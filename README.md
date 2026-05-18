# 合法数字商品自动发货 MVP

> 仅用于合法数字内容（如正版软件授权码、课程激活码、你有权分发的会员权益码）。

## 技术栈
- Next.js + TypeScript + Tailwind CSS
- Supabase（商品、订单、库存、发货记录、Webhook 幂等）
- Stripe Checkout（支付）

## 环境变量
复制 `.env.example`：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
CARD_SECRET_KEY=
ADMIN_TOKEN=change-me
```

## 数据库表结构
见 `supabase/migrations/001_init.sql`：
- `products` 商品
- `orders` 订单
- `inventory_cards` 卡密库存（密文）
- `order_deliveries` 发货快照
- `webhook_events` Stripe 回调去重（防重复处理）

## 核心流程
1. 前台选择商品 -> POST `/api/checkout`
2. 校验库存 > 0，创建 pending 订单，跳转 Stripe Checkout
3. Stripe webhook `checkout.session.completed`
4. 幂等检查 `webhook_events`（重复回调忽略）
5. 将订单置为 paid，从 `inventory_cards` 取一条 available 标记 sold
6. 在 `order_deliveries` 写入已解密卡密快照供成功页展示

## 基础风控
- 接口限流：`/api/checkout`、`/api/admin/restock`
- 库存不足不允许下单
- Stripe webhook 事件 ID 去重

## 启动
```bash
npm install
npm run dev
```

## 部署
1. 在 Supabase 执行 migration。
2. 配置 Stripe webhook 到 `/api/webhooks/stripe`。
3. 在 Vercel 配置环境变量。
4. 上线后将 `ADMIN_TOKEN` 改为高强度随机值。

## 合规说明
本项目不包含盗版分发、账号盗刷、自动化绕过平台规则、诈骗话术等功能。
