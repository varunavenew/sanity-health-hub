import {useCallback, useEffect, useRef, useState} from 'react'
import {Box, Card, Stack, Text} from '@sanity/ui'
import {ObjectInputProps, PatchEvent, set, unset} from 'sanity'

type LocationValue = {
  placeId?: string
  lat?: number
  lng?: number
  alt?: number
}

type GoogleMapsApi = {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        center: {lat: number; lng: number}
        zoom: number
        mapTypeControl: boolean
        streetViewControl: boolean
        fullscreenControl: boolean
      },
    ) => {
      panTo: (position: {lat: number; lng: number}) => void
      addListener: (
        event: string,
        handler: (event: {latLng?: {lat: () => number; lng: () => number}}) => void,
      ) => void
    }
    Marker: new (options: {
      map: InstanceType<GoogleMapsApi['maps']['Map']>
      position: {lat: number; lng: number}
    }) => {
      setPosition: (position: {lat: number; lng: number}) => void
    }
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        options: {fields: string[]},
      ) => {
        bindTo: (field: string, map: InstanceType<GoogleMapsApi['maps']['Map']>) => void
        addListener: (event: string, handler: () => void) => void
        getPlace: () => {
          place_id?: string
          geometry?: {location?: {lat: () => number; lng: () => number}}
        }
      }
    }
  }
}

declare global {
  interface Window {
    google?: GoogleMapsApi
  }
}

const DEFAULT_CENTER = {lat: 59.9139, lng: 10.7522}

function getMapsApiKey(): string | undefined {
  const fromVite = (import.meta as unknown as {env?: Record<string, string>}).env
    ?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (typeof fromVite === 'string' && fromVite.length > 0) return fromVite

  const fromNext = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : undefined
  if (fromNext) return fromNext

  return undefined
}

let mapsLoader: Promise<GoogleMapsApi> | null = null

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only load in the browser'))
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google)
  }

  if (!mapsLoader) {
    mapsLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google)
          return
        }
        reject(new Error('Google Maps failed to initialize'))
      }
      script.onerror = () => reject(new Error('Failed to load Google Maps'))
      document.head.appendChild(script)
    })
  }

  return mapsLoader
}

export function LocationSearchInput(props: ObjectInputProps) {
  const {value, onChange, renderDefault} = props
  const location = (value || {}) as LocationValue
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<InstanceType<GoogleMapsApi['maps']['Map']> | null>(null)
  const markerRef = useRef<InstanceType<GoogleMapsApi['maps']['Marker']> | null>(null)
  const mapsApiRef = useRef<GoogleMapsApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const updateLocation = useCallback(
    (next: {placeId?: string; lat?: number; lng?: number}) => {
      const patches = []
      if (next.placeId) {
        patches.push(set(next.placeId, ['placeId']))
      } else {
        patches.push(unset(['placeId']))
      }
      if (typeof next.lat === 'number') {
        patches.push(set(next.lat, ['lat']))
      } else {
        patches.push(unset(['lat']))
      }
      if (typeof next.lng === 'number') {
        patches.push(set(next.lng, ['lng']))
      } else {
        patches.push(unset(['lng']))
      }
      onChange(PatchEvent.from(patches))
    },
    [onChange],
  )

  const placeMarker = useCallback(
    (maps: GoogleMapsApi, position: {lat: number; lng: number}) => {
      if (!mapRef.current) return

      if (!markerRef.current) {
        markerRef.current = new maps.maps.Marker({
          map: mapRef.current,
          position,
        })
      } else {
        markerRef.current.setPosition(position)
      }

      mapRef.current.panTo(position)
    },
    [],
  )

  useEffect(() => {
    const apiKey = getMapsApiKey()
    if (!apiKey) {
      setLoadError(
        'Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to the project root .env, then restart Sanity Studio (npm run dev in test/).',
      )
      return
    }

    let cancelled = false

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapContainerRef.current || !searchInputRef.current) return

        mapsApiRef.current = maps

        const initialCenter =
          typeof location.lat === 'number' && typeof location.lng === 'number'
            ? {lat: location.lat, lng: location.lng}
            : DEFAULT_CENTER

        mapRef.current = new maps.maps.Map(mapContainerRef.current, {
          center: initialCenter,
          zoom: typeof location.lat === 'number' ? 15 : 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        if (typeof location.lat === 'number' && typeof location.lng === 'number') {
          placeMarker(maps, {lat: location.lat, lng: location.lng})
        }

        const autocomplete = new maps.maps.places.Autocomplete(searchInputRef.current, {
          fields: ['place_id', 'geometry'],
        })
        autocomplete.bindTo('bounds', mapRef.current)

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          const lat = place.geometry?.location?.lat()
          const lng = place.geometry?.location?.lng()
          if (lat == null || lng == null) return

          const position = {lat, lng}
          placeMarker(maps, position)
          updateLocation({
            placeId: place.place_id,
            lat,
            lng,
          })
        })

        mapRef.current.addListener('click', (event) => {
          const lat = event.latLng?.lat()
          const lng = event.latLng?.lng()
          if (lat == null || lng == null) return

          placeMarker(maps, {lat, lng})
          updateLocation({lat, lng})
        })
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setLoadError(error.message || 'Failed to load Google Maps')
        }
      })

    return () => {
      cancelled = true
      mapRef.current = null
      markerRef.current = null
      if (mapContainerRef.current) {
        mapContainerRef.current.replaceChildren()
      }
    }
  }, [placeMarker, updateLocation])

  useEffect(() => {
    const maps = mapsApiRef.current
    if (!maps || location.lat == null || location.lng == null) return
    placeMarker(maps, {lat: location.lat, lng: location.lng})
  }, [location.lat, location.lng, placeMarker])

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Location Search
          </Text>
          {loadError ? (
            <Text size={1} muted>
              {loadError}
            </Text>
          ) : (
            <>
              <Box>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for location"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    border: '1px solid var(--card-border-color)',
                    borderRadius: '4px',
                    font: 'inherit',
                  }}
                />
              </Box>
              <Box
                ref={mapContainerRef}
                style={{
                  width: '100%',
                  height: '280px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: 'var(--card-bg-color)',
                }}
              />
            </>
          )}
        </Stack>
      </Card>
      {renderDefault(props)}
    </Stack>
  )
}
