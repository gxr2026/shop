export type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  is_active: boolean;
  stripe_price_id: string | null;
};

export type Order = {
  id: string;
  order_no: string;
  product_id: string;
  email: string;
  amount_cents: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed';
  delivery_status: 'pending' | 'delivered';
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
};
