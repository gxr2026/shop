import { supabaseAdmin } from './supabase';
import { decryptCard } from './crypto';

export async function fulfillOrderBySession(sessionId: string) {
  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('stripe_session_id', sessionId).single();
  if (!order || order.delivery_status === 'delivered') return order;

  const { data: stock } = await supabaseAdmin
    .from('inventory_cards')
    .select('*')
    .eq('product_id', order.product_id)
    .eq('status', 'available')
    .limit(1)
    .maybeSingle();

  if (!stock) throw new Error('库存不足，无法发货');

  await supabaseAdmin.from('inventory_cards').update({ status: 'sold', sold_order_id: order.id, sold_at: new Date().toISOString() }).eq('id', stock.id);
  await supabaseAdmin.from('orders').update({ delivery_status: 'delivered' }).eq('id', order.id);
  await supabaseAdmin.from('order_deliveries').insert({ order_id: order.id, inventory_card_id: stock.id, card_snapshot: decryptCard(stock.encrypted_code) });
  return order;
}
