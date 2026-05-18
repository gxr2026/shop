import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminProductsPage() {
  const { data: products } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">商品管理</h1>
      <form action="/api/admin/restock" method="post" className="rounded border bg-white p-4 text-sm">
        <p>先建商品（SQL 或 Supabase Studio），再在库存管理导入卡密。</p>
      </form>
      <ul className="space-y-2">{products?.map((p)=><li key={p.id} className="rounded border bg-white p-3">{p.name} - ¥{(p.price_cents/100).toFixed(2)}</li>)}</ul>
    </div>
  );
}
