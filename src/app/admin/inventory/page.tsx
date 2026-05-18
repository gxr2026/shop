export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">库存导入</h1>
      <form action="/api/admin/restock" method="post" className="space-y-2 rounded border bg-white p-4">
        <input name="productId" required placeholder="商品ID" className="w-full rounded border p-2" />
        <textarea name="codes" required placeholder="每行一个卡密" className="h-40 w-full rounded border p-2" />
        <button className="rounded bg-black px-4 py-2 text-white">导入</button>
      </form>
    </div>
  );
}
