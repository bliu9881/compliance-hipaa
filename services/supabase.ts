
import { createClient } from '@supabase/supabase-js';

/**
 * Environment variables for Supabase.
 * Use process.env to safely access variables.
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://oqbxfxrwscxukaxuewwp.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_IBlnvPMxWcR-774a998uvQ_I69ovn3f'; 

if (!supabaseUrl || !supabaseKey) {
  console.error("GuardPHI Error: Supabase configuration is missing. Authentication will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
