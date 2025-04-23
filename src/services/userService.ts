import { supabase } from "@/lib/supabase";

// Create a new user in the users table after auth signup
export async function createUser(
  userId: string,
  name: string,
  email: string,
  phone: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").insert({
      id: userId,
      name,
      email,
      phone,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; phone?: string },
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}

// Get user's delivery history
export async function getUserDeliveryHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from("delivery_requests")
      .select(
        `
        *,
        drivers:driver_id (*)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user delivery history:", error);
    return [];
  }
}
