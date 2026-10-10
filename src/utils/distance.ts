// Haversine formula to calculate real distance between two lat/lng coordinates in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // round to 1 decimal place
}

export interface LocalityCoords {
  name: string;
  lat: number;
  lng: number;
}

export const HYDERABAD_LOCALITIES: LocalityCoords[] = [
  { name: "Madhapur, Hyderabad", lat: 17.4483, lng: 78.3915 },
  { name: "Jubilee Hills, Hyderabad", lat: 17.4319, lng: 78.4071 },
  { name: "Kondapur, Hyderabad", lat: 17.4622, lng: 78.3673 },
  { name: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489 },
  { name: "Hitec City, Hyderabad", lat: 17.4435, lng: 78.3772 },
  { name: "Banjara Hills, Hyderabad", lat: 17.4156, lng: 78.4347 },
  { name: "Kukatpally, Hyderabad", lat: 17.4849, lng: 78.4011 },
  { name: "Begumpet, Hyderabad", lat: 17.4447, lng: 78.4664 },
  { name: "Secunderabad, Hyderabad", lat: 17.4399, lng: 78.4983 },
  { name: "Mehdipatnam, Hyderabad", lat: 17.3949, lng: 78.4414 },
];

export function findClosestLocality(lat: number, lng: number): LocalityCoords {
  let closest = HYDERABAD_LOCALITIES[0];
  let minDistance = Infinity;

  for (const loc of HYDERABAD_LOCALITIES) {
    const dist = calculateHaversineDistance(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  return closest;
}
