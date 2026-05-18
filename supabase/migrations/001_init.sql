create extension if not exists pgcrypto;

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'cny',
  stripe_price_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  product_id uuid not null references products(id),
  email text not null,
  amount_cents integer not null,
  currency text not null,
  payment_status text not null check (payment_status in ('pending','paid','failed')),
  delivery_status text not null check (delivery_status in ('pending','delivered')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

create table inventory_cards (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  encrypted_code text not null,
  status text not null check (status in ('available','sold')) default 'available',
  sold_order_id uuid references orders(id),
  sold_at timestamptz,
  created_at timestamptz not null default now()
);

create table order_deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references orders(id),
  inventory_card_id uuid unique not null references inventory_cards(id),
  card_snapshot text not null,
  created_at timestamptz not null default now()
);

create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type text not null,
  created_at timestamptz not null default now()
);
