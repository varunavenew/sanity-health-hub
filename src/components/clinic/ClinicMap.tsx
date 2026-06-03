import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ClinicMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

/**
 * Branded clinic map using CartoDB Voyager tiles (no API key required).
 * Wrapped with a subtle warm CSS filter to align with the brand sand/beige palette.
 * Marker is a small brand-dark pin.
 */
export const ClinicMap = ({ lat, lng, label, address }: ClinicMapProps) => {
  useEffect(() => {
    // Fix default Leaflet icon paths (broken under Vite bundling)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  const icon = L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: hsl(28 17% 21%);
        transform: rotate(-45deg);
        border: 2px solid #F2ECE6;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #F4FF78;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

  return (
    <div
      className="w-full h-[400px] overflow-hidden"
      style={{
        // Subtle warming filter to align tiles with brand palette
        filter: "sepia(0.25) saturate(0.9) hue-rotate(-6deg) brightness(1.02)",
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", background: "#F2ECE6" }}
        attributionControl={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <div style={{ fontSize: "13px", lineHeight: 1.4 }}>
              <strong>CMedical {label}</strong>
              <br />
              {address}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
