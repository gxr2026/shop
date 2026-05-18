import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const orderNo = req.nextUrl.searchParams.get('orderNo');
  if (!orderNo) return NextResponse.json({ error: '缺少订单号' }, { status: 400 });
  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('order_no', orderNo).maybeSingle();
  if (!order) return NextResponse.json({ error: '未找到订单' }, { status: 404 });
  const { data: delivery } = await supabaseAdmin.from('order_deliveries').select('card_snapshot').eq('order_id', order.id).maybeSingle();
  return NextResponse.json({ order, delivery });
}
