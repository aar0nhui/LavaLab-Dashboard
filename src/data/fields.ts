export interface FieldArea {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  polygon: [number, number][]; // [lng, lat] pairs for Mapbox
  color: string;
}

// Bounding boxes around the Iowa farm area (41.9774, -93.4475)
export const FIELDS: Record<string, FieldArea> = {
  "FIELD A": {
    id: "FIELD A",
    name: "FIELD A",
    color: "#3b82f6", // blue-500
    center: { lat: 41.9774, lng: -93.4475 },
    polygon: [
      [-93.4485, 41.9784],
      [-93.4465, 41.9784],
      [-93.4465, 41.9764],
      [-93.4485, 41.9764],
      [-93.4485, 41.9784]
    ]
  },
  "FIELD B": {
    id: "FIELD B",
    name: "FIELD B",
    color: "#eab308", // yellow-500
    center: { lat: 41.9774, lng: -93.4540 },
    polygon: [
      [-93.4550, 41.9784],
      [-93.4530, 41.9784],
      [-93.4530, 41.9764],
      [-93.4550, 41.9764],
      [-93.4550, 41.9784]
    ]
  },
  "FIELD C": {
    id: "FIELD C",
    name: "FIELD C",
    color: "#22c55e", // green-500
    center: { lat: 41.9730, lng: -93.4475 },
    polygon: [
      [-93.4485, 41.9740],
      [-93.4465, 41.9740],
      [-93.4465, 41.9720],
      [-93.4485, 41.9720],
      [-93.4485, 41.9740]
    ]
  },
  "FIELD D": {
    id: "FIELD D",
    name: "FIELD D",
    color: "#ef4444", // red-500
    center: { lat: 41.9730, lng: -93.4540 },
    polygon: [
      [-93.4550, 41.9740],
      [-93.4530, 41.9740],
      [-93.4530, 41.9720],
      [-93.4550, 41.9720],
      [-93.4550, 41.9740]
    ]
  }
};
