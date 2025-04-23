import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = "https://tgqrhrovlzuztwjuqmvn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncXJocm92bHp1enR3anVxbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTgwMjAsImV4cCI6MjA2MDA5NDAyMH0.9LGbaYCa7m0GY26_Ij1H-Ly7PCvqdNcgQRVsw_7ZN7Q";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
