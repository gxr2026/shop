import { NextRequest, NextResponse } from 'next/server';
import { encryptCard } from '@/lib/crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'admin';
  if (!checkRateLimit(`restock:${ip}`, 5)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const form = await req.formData();
  const productId = String(form.get('productId') || '');
  const codes = String(form.get('codes') || '').split('\n').map((v) => v.trim()).filter(Boolean);
  const payload = codes.map((code) => ({ product_id: productId, encrypted_code: encryptCard(code), status: 'available' }));
  await supabaseAdmin.from('inventory_cards').insert(payload);
  return NextResponse.json({ inserted: payload.length });
}
