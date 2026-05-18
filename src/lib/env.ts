const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'CARD_SECRET_KEY'
] as const;

required.forEach((k) => {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
});

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  stripeSecret: process.env.STRIPE_SECRET_KEY!,
  stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  cardSecret: process.env.CARD_SECRET_KEY!,
  adminToken: process.env.ADMIN_TOKEN ?? 'change-me'
};
