import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`checkout:${ip}`, 8)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const form = await req.formData();
  const productId = String(form.get('productId') || '');
  const email = String(form.get('email') || '');

  const { data: product } = await supabaseAdmin.from('products').select('*').eq('id', productId).eq('is_active', true).single();
  const { count } = await supabaseAdmin.from('inventory_cards').select('*', { count: 'exact', head: true }).eq('product_id', productId).eq('status', 'available');
  if (!product || !count) return NextResponse.json({ error: '库存不足或商品无效' }, { status: 400 });

  const orderNo = `DG${Date.now()}`;
  const { data: order } = await supabaseAdmin.from('orders').insert({
    order_no: orderNo, product_id: productId, email,
    amount_cents: product.price_cents, currency: product.currency,
    payment_status: 'pending', delivery_status: 'pending'
  }).select('*').single();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [{
      price_data: {
        currency: product.currency,
        product_data: { name: product.name },
        unit_amount: product.price_cents
      }, quantity: 1
    }],
    metadata: { orderId: order.id },
    success_url: `${env.appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.appUrl}/products/${productId}`
  });

  await supabaseAdmin.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
  return NextResponse.redirect(session.url!, 303);
}
