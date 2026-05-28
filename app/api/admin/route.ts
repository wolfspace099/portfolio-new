import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendEmail } from '../../../lib/email'

export const dynamic = 'force-dynamic'

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [qRes, rRes, oRes] = await Promise.all([
    supabase.from('quotes').select('*').order('created_at', { ascending: false }),
    supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
  ])

  if (qRes.error) return NextResponse.json({ error: qRes.error.message }, { status: 500 })
  if (rRes.error) return NextResponse.json({ error: rRes.error.message }, { status: 500 })

  return NextResponse.json({
    quotes: qRes.data || [],
    reviews: rRes.data || [],
    orders: oRes.data || [],
  })
}

async function handleOrderAction(orderId: string, action: string, payload: Record<string, string>) {
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'accept') {
    await supabase.from('orders').update({ status: 'accepted' }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: 'ORDER ACCEPTED. Chat is now open — feel free to discuss details.',
    }])
    if (order.client_email) sendEmail(order.client_email, 'Order Accepted — CQT.DEV',
      `<p style="font-family:monospace">Your order has been accepted. You can now chat to discuss details.</p>`)
  } else if (action === 'decline') {
    const reason = String(payload.reason || '').trim()
    await supabase.from('orders').update({ status: 'declined', decline_reason: reason }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: `ORDER DECLINED.${reason ? ' Reason: ' + reason : ''}`,
    }])
    if (order.client_email) sendEmail(order.client_email, 'Order Update — CQT.DEV',
      `<p style="font-family:monospace">Your order was declined.${reason ? ' Reason: ' + reason : ''}</p>`)
  } else if (action === 'quote') {
    const price = String(payload.price || '').trim()
    const paypal = String(payload.paypal || '').trim()
    await supabase.from('orders').update({ status: 'quoted', quoted_price: price, paypal_link: paypal }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: `PRICE QUOTED: ${price}. Do you accept?`,
      is_price_quote: true,
      quoted_price: price,
    }])
    if (order.client_email) sendEmail(order.client_email, 'Price Quoted — CQT.DEV',
      `<p style="font-family:monospace">A price of ${price} has been quoted. Log in to accept or decline.</p>`)
  } else if (action === 'send_paypal') {
    const link = String(payload.link || '').trim()
    await supabase.from('orders').update({ paypal_link: link, status: 'awaiting_payment' }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'admin',
      content: `Payment link: ${link}`,
    }])
  } else if (action === 'mark_paid') {
    await supabase.from('orders').update({ status: 'in_progress' }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: 'PAYMENT CONFIRMED. Development has started.',
    }])
    if (order.client_email) sendEmail(order.client_email, 'Payment Confirmed — CQT.DEV',
      `<p style="font-family:monospace">Payment confirmed — development has started!</p>`)
  } else if (action === 'update') {
    const note = String(payload.note || '').trim()
    const eta = String(payload.eta || '').trim()
    await supabase.from('orders').update({ progress_note: note, eta, status: 'in_progress' }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: `UPDATE: ${note}${eta ? ' — ETA: ' + eta : ''}`,
    }])
    if (order.client_email) sendEmail(order.client_email, 'Order Update — CQT.DEV',
      `<p style="font-family:monospace">${note}${eta ? ` ETA: ${eta}` : ''}</p>`)
  } else if (action === 'complete') {
    await supabase.from('orders').update({ status: 'complete' }).eq('id', orderId)
    await supabase.from('order_messages').insert([{
      order_id: orderId, sender: 'system',
      content: 'PROJECT COMPLETE. Thanks for working with me!',
    }])
    if (order.client_email) sendEmail(order.client_email, 'Project Complete — CQT.DEV',
      `<p style="font-family:monospace">Your project is complete! It was a pleasure working with you.</p>`)
  } else if (action === 'message') {
    const content = String(payload.content || '').trim().slice(0, 2000)
    if (!content) return NextResponse.json({ error: 'Empty message' }, { status: 400 })
    await supabase.from('order_messages').insert([{ order_id: orderId, sender: 'admin', content }])
  } else if (action === 'get_messages') {
    const { data } = await supabase.from('order_messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true })
    return NextResponse.json({ messages: data || [] })
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { table, id, payload, action } = body
  if (!table || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  if (table === 'orders') {
    return handleOrderAction(String(id), String(action || ''), payload || {})
  }

  if (table !== 'quotes' && table !== 'reviews') {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { error } = await supabase.from(table).update(payload).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { table, id } = body
  if (!table || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  if (table !== 'quotes' && table !== 'reviews' && table !== 'orders') {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
