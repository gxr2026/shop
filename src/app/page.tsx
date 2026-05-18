import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

export default async function HomePage() {
  const { data } = await supabaseAdmin.from('products').select('*').eq('is_active', true);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">商品列表</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {data?.map((p) => (
          <div key={p.id} className="rounded border bg-white p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-slate-600">{p.description}</p>
            <p className="my-2">¥{(p.price_cents / 100).toFixed(2)}</p>
            <Link className="text-blue-600" href={`/products/${p.id}`}>查看并下单</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
