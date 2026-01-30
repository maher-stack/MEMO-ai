import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wredccrpwomigvxbpzcs.supabase.co';
const supabaseAnonKey = 'sb_publishable_toBOPPtV8ComMKyhnP_Y3A_mvludcpA';

// إعدادات محسنة لضمان ثبات الاتصال وتقليل NetworkError
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'mr-ai-auth-token',
    flowType: 'pkce'
  },
  global: {
    headers: { 'x-application-name': 'mr-ai' }
  }
});