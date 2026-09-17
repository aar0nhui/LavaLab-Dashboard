import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Singleton guard — prevents multiple GoTrueClient instances during HMR
const key = "__supabase_singleton__";
const g = globalThis as any;
if (!g[key]) {
  g[key] = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
}

export const supabase = g[key];
