export interface Driver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: "motorcycle" | "tuktuk";
  license_number: string;
  points: number;
  is_available: boolean;
  is_active: boolean;
  current_latitude?: number;
  current_longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  driver_id: string;
  amount: number; // Positive for additions, negative for deductions
  transaction_type: "admin_add" | "delivery_deduction" | "system";
  delivery_id?: string;
  notes?: string;
  created_at: string;
}

export interface DeliveryRequest {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_address: string;
  status: "pending" | "accepted" | "picked_up" | "delivered" | "cancelled";
  distance_km: number;
  points_cost: number;
  created_at: string;
  updated_at: string;
}
