// src/supabaseClient.js
// ─────────────────────────────────────────────────────────────────
// Place this file at:  C:\Users\khula\edumark-ai\src\supabaseClient.js
//
// This file creates ONE Supabase client used across the whole app.
// ─────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️  Supabase env variables missing.\n" +
    "Add these to your .env file:\n" +
    "VITE_SUPABASE_URL=https://yourproject.supabase.co\n" +
    "VITE_SUPABASE_ANON_KEY=eyJ..."
  );
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession:   true,
        detectSessionInUrl: true,
      },
    })
  : null;
