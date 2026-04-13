import { createClient } from "@supabase/supabase-js";

// =========================================================================
// SUPABASE CLIENT SETUP - src/lib/supabase.ts
// =========================================================================
// 1. Create a project at https://supabase.com
// 2. Go to Project Settings → API
// 3. Copy your URL and anon key into .env.local:
//      VITE_SUPABASE_URL="https://your-project.supabase.co"
//      VITE_SUPABASE_ANON_KEY="your-anon-key"
// =========================================================================

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate env vars at startup — catch missing config early instead of silently breaking auth
if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
  const msg = "[PyMaster] VITE_SUPABASE_URL is not set. Copy .env.example → .env.local and fill in your Supabase project URL.";
  if (import.meta.env.DEV) console.warn(msg);
  else console.error(msg);
}
if (!supabaseAnonKey || supabaseAnonKey === "placeholder-key") {
  const msg = "[PyMaster] VITE_SUPABASE_ANON_KEY is not set. Copy .env.example → .env.local and fill in your Supabase anon key.";
  if (import.meta.env.DEV) console.warn(msg);
  else console.error(msg);
}

export const supabase = createClient(
  supabaseUrl     ?? "https://placeholder-url.supabase.co",
  supabaseAnonKey ?? "placeholder-key",
);


/**
 * ---------------------------------------------------------
 * RECOMMENDED DATABASE SCHEMA SETUP (Run in Supabase SQL Editor)
 * ---------------------------------------------------------
 * 
 * -- 1. Create the Users/Progress Table
 * CREATE TABLE public.profiles (
 *   id uuid references auth.users not null primary key,
 *   email text,
 *   display_name text,
 *   wallet numeric default 0,
 *   streak integer default 0,
 *   xp integer default 0,
 *   stars_caught integer default 0,
 *   daily_stars integer default 0,
 *   solved_problems jsonb default '[]'::jsonb,
 *   updated_at timestamp with time zone default timezone('utc'::text, now())
 * );
 * 
 * -- 2. Create the Problems Table (For 500+ Questions)
 * CREATE TABLE public.problems (
 *   id text primary key,
 *   title text not null,
 *   difficulty text not null,
 *   description text not null,
 *   constraints jsonb,
 *   starter_code text,
 *   solution text,
 *   solution_explanation text,
 *   examples jsonb,
 *   test_cases jsonb
 * );
 * 
 * -- 3. Turn on Realtime for Leaderboards
 * ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
 */
