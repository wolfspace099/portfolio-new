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

  // Inject a tiny init script that creates the Supabase client for OAuth only.
  // No keys are ever hardcoded in script.js or any static file.
  const initScript = `
var supabase = (function() {
  try {
    return supabaseJs.createClient(
      ${JSON.stringify(supabaseUrl)},
      ${JSON.stringify(supabaseAnon)}
    );
  } catch(e) { return null; }
})();`.trim()

  html = html.replace('/* populated by route.ts */', initScript)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}