import { createClient } from '@supabase/supabase-js'

// These env vars are ONLY read server-side — never sent to the browser.
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY! // use service key server-side

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)