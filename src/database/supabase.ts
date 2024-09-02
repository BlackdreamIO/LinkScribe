import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON as string;

export function CreateSupabaseServerDBClient(accessToken: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        db: {
            schema: 'public',
        },
        global: {
            headers: { Authorization: `Bearer ${accessToken}` }
        },
    });
}