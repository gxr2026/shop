import { supabaseAdmin } from '@/lib/supabase';

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sid = searchParams.session_id;
  if (!sid) return <p>缺少 session_id</p>;
  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('stripe_session_id', sid).maybeSingle();
  const { data: delivery } = order ? await supabaseAdmin.from('order_deliveries').select('*').eq('order_id', order.id).maybeSingle() : { data: null };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">支付成功</h1>
      <p>订单号：{order?.order_no}</p>
      <p>支付状态：{order?.payment_status}</p>
      <p>发货状态：{order?.delivery_status}</p>
      {delivery ? <pre className="rounded bg-slate-900 p-4 text-green-300">{delivery.card_snapshot}</pre> : <p>正在发货，请稍后刷新页面。</p>}
    </div>
  );
}
