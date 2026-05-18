import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabaseAdmin = createClient(env.supabaseUrl, env.serviceRole, { auth: { persistSession: false } });
export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnon);
