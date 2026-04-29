import fs from 'fs'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const htmlPath = './app/index.html'
  let html = fs.readFileSync(htmlPath, 'utf8')

  // The anon key is safe to expose (it is the public browser key).
  // The service key and all admin secrets NEVER leave the server.
  const supabaseUrl  = process.env.SUPABASE_URL      || ''
  const supabaseAnon = process.env.SUPABASE_ANON_KEY  || ''

  // The jsDelivr UMD bundle for @supabase/supabase-js exposes the namespace
  // as window.supabase (NOT window.supabaseJs). We need a different var name
  // for our client instance to avoid shadowing that global, so we read it via
  // window.supabase first, then reassign supabase to the *client* instance.
  const initScript = `
(function() {
  var lib = window.supabase;
  if (!lib || typeof lib.createClient !== 'function') {
    console.error('[init] Supabase CDN not loaded — Discord OAuth will be unavailable.');
    window.supabase = null;
    return;
  }
  try {
    window.supabase = lib.createClient(
      ${JSON.stringify(supabaseUrl)},
      ${JSON.stringify(supabaseAnon)}
    );
  } catch(e) {
    console.error('[init] Supabase createClient failed:', e);
    window.supabase = null;
  }
})();`.trim()

  html = html.replace('/* populated by route.ts */', initScript)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}