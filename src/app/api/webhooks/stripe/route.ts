import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase';
import { fulfillOrderBySession } from '@/lib/order';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const event = stripe.webhooks.constructEvent(body, sig, env.stripeWebhook);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { data: existed } = await supabaseAdmin.from('webhook_events').select('id').eq('stripe_event_id', event.id).maybeSingle();
    if (!existed) {
      await supabaseAdmin.from('webhook_events').insert({ stripe_event_id: event.id, event_type: event.type });
      await supabaseAdmin.from('orders').update({ payment_status: 'paid' }).eq('stripe_session_id', session.id);
      await fulfillOrderBySession(session.id);
    }
  }
  return NextResponse.json({ received: true });
}
