
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqbxfxrwscxukaxuewwp.supabase.co';
// Using the specific publishable API key provided by the user
const supabaseKey = 'sb_publishable_IBlnvPMxWcR-774a998uvQ_I69ovn3f'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
