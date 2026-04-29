import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export const dynamic = 'force-dynamic'

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

// GET /api/admin?resource=all  — returns all quotes + all reviews for admin dashboard
export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [qRes, rRes] = await Promise.all([
    supabase.from('quotes').select('*').order('created_at', { ascending: false }),
    supabase.from('reviews').select('*').order('created_at', { ascending: false }),
  ])

  if (qRes.error) return NextResponse.json({ error: qRes.error.message }, { status: 500 })
  if (rRes.error) return NextResponse.json({ error: rRes.error.message }, { status: 500 })

  return NextResponse.json({ quotes: qRes.data || [], reviews: rRes.data || [] })
}

// PATCH /api/admin  — update a quote or review
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { table, id, payload } = body
  if (!table || !id || !payload) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Only allow updating known tables
  if (table !== 'quotes' && table !== 'reviews') {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { error } = await supabase.from(table).update(payload).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin  — delete a quote or review
export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { table, id } = body
  if (!table || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  if (table !== 'quotes' && table !== 'reviews') {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}