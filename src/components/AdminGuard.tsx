import { headers } from 'next/headers';
import { env } from '@/lib/env';

export function assertAdmin() {
  const token = headers().get('x-admin-token');
  if (token !== env.adminToken) throw new Error('Unauthorized admin');
}
