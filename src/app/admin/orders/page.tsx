import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminOrdersPage() {
  const { data: orders } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
  return <div><h1 className="mb-4 text-2xl font-bold">订单查询 / 补发</h1><pre className="overflow-auto rounded bg-white p-4">{JSON.stringify(orders, null, 2)}</pre></div>;
}
