const BASE_URL =
  import.meta.env.PROD
    ? 'https://freezly-store.vercel.app'
    : '';

export async function createCheckout(payload: any) {
  const res = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
