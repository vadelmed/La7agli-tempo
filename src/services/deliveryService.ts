import { supabase } from "@/lib/supabase";
import { DeliveryRequest, Driver } from "@/models/Driver";

// Calculate distance between two points using Google Maps API
export async function calculateDistance(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
): Promise<number> {
  try {
    const apiKey = "AIzaSyBxXQ4KffIsymQ1EmhgirbzUEjb37uu5x8";
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
      // Distance in meters, convert to kilometers
      const distanceInMeters = data.rows[0].elements[0].distance.value;
      return distanceInMeters / 1000; // Convert to kilometers
    } else {
      // Fallback to direct distance calculation (as the crow flies)
      return calculateDirectDistance(originLat, originLng, destLat, destLng);
    }
  } catch (error) {
    console.error("Error calculating distance:", error);
    // Fallback to direct distance calculation
    return calculateDirectDistance(originLat, originLng, destLat, destLng);
  }
}

// Calculate direct distance between two points using Haversine formula
function calculateDirectDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate points cost based on distance
export function calculatePointsCost(distanceKm: number): number {
  // Base cost: 5 points
  // Per km cost: 2 points
  const baseCost = 5;
  const perKmCost = 2;

  return Math.ceil(baseCost + distanceKm * perKmCost);
}

// Create a new delivery request
export async function createDeliveryRequest(
  userId: string,
  pickupLat: number,
  pickupLng: number,
  pickupAddress: string,
  deliveryLat: number,
  deliveryLng: number,
  deliveryAddress: string,
): Promise<DeliveryRequest | null> {
  try {
    // Calculate distance
    const distanceKm = await calculateDistance(
      pickupLat,
      pickupLng,
      deliveryLat,
      deliveryLng,
    );

    // Calculate points cost
    const pointsCost = calculatePointsCost(distanceKm);

    // Create delivery request in database
    const { data, error } = await supabase
      .from("delivery_requests")
      .insert({
        user_id: userId,
        pickup_latitude: pickupLat,
        pickup_longitude: pickupLng,
        pickup_address: pickupAddress,
        delivery_latitude: deliveryLat,
        delivery_longitude: deliveryLng,
        delivery_address: deliveryAddress,
        status: "pending",
        distance_km: distanceKm,
        points_cost: pointsCost,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DeliveryRequest;
  } catch (error) {
    console.error("Error creating delivery request:", error);
    return null;
  }
}
