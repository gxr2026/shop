export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">订单查询</h1>
      <form className="flex gap-2" action="/api/orders/search" method="get">
        <input name="orderNo" required placeholder="输入订单号" className="rounded border p-2" />
        <button className="rounded bg-black px-4 py-2 text-white">查询</button>
      </form>
    </div>
  );
}
