import type { BookingRoom } from "@/app/api/booking/rooms/route";
import { mapWithConcurrency } from "@/lib/booking/resolveActivityLocations";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResourceCached,
  unwrapList,
} from "@/lib/booking/upstream";

interface RawFreetimeSlot {
  "room-id"?: number;
  roomId?: number;
}

function normalizeApiRoom(entry: unknown): BookingRoom | null {
  const r = entry as Record<string, unknown>;
  const id = r.id as number | undefined;
  const locationId = (r["location-id"] ?? r.locationId) as number | undefined;
  if (id == null || locationId == null) return null;
  return {
    id,
    name: String(r.name ?? `Room ${id}`).trim(),
    locationId,
    deactivated: r.deactivated as boolean | undefined,
  };
}

/** Resolve Metodika room-id → location-id for discovery freetimes (cached upstream). */
export async function locationIdsByRoomId(
  rawSlots: unknown[],
  apiKey: string,
): Promise<Map<number, number>> {
  const roomIds = [
    ...new Set(
      rawSlots
        .map((entry) => {
          const row = entry as RawFreetimeSlot;
          return row["room-id"] ?? row.roomId;
        })
        .filter((id): id is number => typeof id === "number"),
    ),
  ];

  if (roomIds.length === 0) return new Map();

  const pairs = await mapWithConcurrency(roomIds, 8, async (roomId) => {
    try {
      const url = bookingResourceUrl(BOOKING_URLS.rooms, roomId);
      const payload = await fetchBookingResourceCached(url, apiKey);
      const room = unwrapList(payload)
        .map(normalizeApiRoom)
        .find((item): item is BookingRoom => item !== null);
      if (!room || room.deactivated) return null;
      return [roomId, room.locationId] as const;
    } catch {
      return null;
    }
  });

  return new Map(
    pairs.filter((item): item is readonly [number, number] => item != null),
  );
}
