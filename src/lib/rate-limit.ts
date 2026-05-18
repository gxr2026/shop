const map = new Map<string, { count: number; time: number }>();

export function checkRateLimit(key: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const hit = map.get(key);
  if (!hit || now - hit.time > windowMs) {
    map.set(key, { count: 1, time: now });
    return true;
  }
  if (hit.count >= max) return false;
  hit.count += 1;
  return true;
}
