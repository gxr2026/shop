# 合法数字商品自动发货网站（MVP）

> 这是一个**可运行的网站项目**，不是文档站。仓库里的 `README.md` 只是说明文件。你需要把项目部署后，访问部署域名才能看到网站页面。

## 你现在要的结果（重点）
你说得对：你要的是“打开就是网页”。

- 直接打开 GitHub 仓库主页，只会看到代码和 README（这是 GitHub 的正常行为）。
- 要“打开就是你的网站页面”，请把本项目部署到 **Vercel**（推荐）或你自己的服务器。
- 部署成功后，访问 `https://你的项目域名`，首页就是你的商品列表页面（不是 Markdown）。

---

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

## 本地运行（先确认是“网站”）
```bash
npm install
npm run dev
```
打开 `http://localhost:3000`，你看到的就是网站页面。

## 部署（推荐 Vercel，部署后直接是网站）
1. 把代码推到 GitHub。
2. 登录 Vercel -> `New Project` -> 导入此仓库。
3. 在 Vercel 项目里填写上面的环境变量。
4. 在 Supabase 执行 `supabase/migrations/001_init.sql`。
5. 在 Stripe 配置 Webhook 到：
   - `https://你的域名/api/webhooks/stripe`
6. 把 `NEXT_PUBLIC_APP_URL` 改成你的正式域名。
7. 重新部署。

完成后，你访问的是你的域名（比如 `https://shop.yourdomain.com`），不是 GitHub README。

## GitHub Pages 说明（重要）
本项目包含服务端 API、Stripe webhook、Supabase 服务端访问，**不适合 GitHub Pages**（GitHub Pages 只适合纯静态页面）。

如果你强行用 GitHub Pages，会丢失支付和自动发货能力。

## 合规说明
本项目仅面向合法数字商品，不包含盗版分发、账号盗刷、自动化绕过平台规则、诈骗话术等功能。
