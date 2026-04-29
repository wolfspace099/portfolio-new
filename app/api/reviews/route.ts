import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

function makeDate() {
  return new Date().toLocaleDateString()
}

export const dynamic = 'force-dynamic'

// Public: fetch approved reviews only
export async function GET() {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, rank, text, date, rating, discord_id, discord_username, status')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const approved = (data || []).filter((r) => r.status === 'approved')
  return NextResponse.json({ reviews: approved })
}

// Public: submit a new review (always goes to pending)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const name = String(body.name || '').trim().slice(0, 100)
  const rank = String(body.rank || 'Client').trim().slice(0, 60)
  const text = String(body.text || '').trim().slice(0, 2000)
  const rating = Math.min(5, Math.max(1, parseInt(body.rating || '5', 10)))
  const discord_id = String(body.discord_id || '').trim().slice(0, 64) || null
  const discord_username = String(body.discord_username || '').trim().slice(0, 64) || null

  if (!name || !rank || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const payload: Record<string, unknown> = {
    name,
    rank,
    text,
    rating,
    date: makeDate(),
    status: 'pending',
  }
  if (discord_id) payload.discord_id = discord_id
  if (discord_username) payload.discord_username = discord_username

  const { error } = await supabase.from('reviews').insert([payload])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}