import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendEmail } from '../../../lib/email'

export const dynamic = 'force-dynamic'

async function verifyClient(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export async function GET(req: NextRequest) {
  const user = await verifyClient(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, service_type, package_name, status, quoted_price, eta, progress_note')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data || [] })
}

export async function POST(req: NextRequest) {
  const user = await verifyClient(req)
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const client_name = String(body.client_name || '').trim().slice(0, 100)
  const service_type = String(body.service_type || '').trim().slice(0, 50)
  const package_id = String(body.package_id || '').trim().slice(0, 50)
  const package_name = String(body.package_name || '').trim().slice(0, 100)
  const description = String(body.description || '').trim().slice(0, 3000)
  const details = body.details && typeof body.details === 'object' ? body.details : {}

  if (!client_name || !service_type || !package_id || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase.from('orders').insert([{
    client_id: user.id,
    client_email: user.email,
    client_name,
    service_type,
    package_id,
    package_name,
    description,
    details,
    status: 'pending',
  }]).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (webhookUrl && data) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `**NEW ORDER** from ${client_name} (${user.email})\nType: ${service_type} — ${package_name}\nID: ${data.id}`,
      }),
    }).catch(() => {})
  }

  if (user.email) {
    sendEmail(
      user.email,
      'Order Received — CQT.DEV',
      `<p style="font-family:monospace">Hi ${client_name},</p><p style="font-family:monospace">Your order has been received. I will review it and reply within 24 hours.</p><p style="font-family:monospace">Order ID: ${data?.id}</p>`,
    )
  }

  return NextResponse.json({ ok: true, id: data?.id })
}
