import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

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

  const { data: order } = await supabase.from('orders').select('client_id').eq('id', id).single()
  if (!order || order.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('order_messages')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data || [] })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await verifyClient(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order } = await supabase.from('orders').select('client_id, status').eq('id', id).single()
  if (!order || order.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const content = String(body?.content || '').trim().slice(0, 2000)
  if (!content) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  const { error } = await supabase.from('order_messages').insert([{
    order_id: id,
    sender: 'client',
    content,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `**ORDER MSG** [${id}]: ${content.slice(0, 200)}` }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
