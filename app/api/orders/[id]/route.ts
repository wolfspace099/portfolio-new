import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export const dynamic = 'force-dynamic'

async function verifyClient(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await verifyClient(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (order.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: messages } = await supabase
    .from('order_messages')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ order, messages: messages || [] })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await verifyClient(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order } = await supabase.from('orders').select('client_id, status, quoted_price').eq('id', id).single()
  if (!order || order.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  if (body.action === 'accept_quote') {
    if (order.status !== 'quoted') return NextResponse.json({ error: 'No active quote' }, { status: 400 })
    await supabase.from('orders').update({ status: 'awaiting_payment' }).eq('id', id)
    await supabase.from('order_messages').insert([
      { order_id: id, sender: 'system', content: `QUOTE ACCEPTED (${order.quoted_price}). Payment link will be sent shortly.` },
    ])
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `**QUOTE ACCEPTED** — Order ${id} — ${order.quoted_price}` }),
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'decline_quote') {
    if (order.status !== 'quoted') return NextResponse.json({ error: 'No active quote' }, { status: 400 })
    await supabase.from('orders').update({ status: 'accepted' }).eq('id', id)
    await supabase.from('order_messages').insert([
      { order_id: id, sender: 'system', content: 'QUOTE DECLINED. We can discuss a different price.' },
    ])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
