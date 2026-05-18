import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data } = await supabaseAdmin.from('products').select('*').eq('id', params.id).maybeSingle();
  if (!data) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p>{data.description}</p>
      <p className="text-lg">¥{(data.price_cents / 100).toFixed(2)}</p>
      <form action="/api/checkout" method="post" className="space-y-2 rounded border bg-white p-4">
        <input type="hidden" name="productId" value={data.id} />
        <input required name="email" type="email" placeholder="邮箱" className="w-full rounded border p-2"/>
        <button className="rounded bg-black px-4 py-2 text-white">去支付</button>
      </form>
    </div>
  );
}
