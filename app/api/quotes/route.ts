import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

function makeDate() {
  return new Date().toLocaleDateString()
}

export const dynamic = 'force-dynamic'

// Admin-only: list all quotes (requires Authorization header with Supabase JWT)
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quotes: data || [] })
}

// Public: submit a quote (requires Discord login)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const name = String(body.name || '').trim().slice(0, 100)
  const type = String(body.type || '').trim().slice(0, 100)
  const budget = String(body.budget || 'Not specified').trim().slice(0, 100)
  const description = String(body.description || '').trim().slice(0, 3000)
  const discordUsername = String(body.discord_username || '').trim().slice(0, 64)

  if (!name || !type || !description || !discordUsername) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify the Discord identity via Supabase JWT
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Discord login required' }, { status: 401 })

  const { data: userData, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !userData?.user) {
    return NextResponse.json({ error: 'Discord login required' }, { status: 401 })
  }

  const { error } = await supabase.from('quotes').insert([{
    name,
    email: '@' + discordUsername,
    type,
    budget,
    description,
    date: makeDate(),
    status: 'new',
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}