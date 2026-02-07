// services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is missing');
}

export interface CheckoutPayload {
  userId: string;
  zoneId?: string;
  game: string;
  product: {
    name: string;
    price: number;
  };
  paymentMethod: string;
  price: number;
}

export interface CheckoutResponse {
  invoice_url?: string;
  trx_id?: string;
}

class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
  } catch {
    throw new ApiError('Network error. Cannot reach server.');
  }

  const contentType = res.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const text = await res.text();
    console.error('❌ Non-JSON response:', text);
    throw new ApiError('Server returned invalid response format', res.status);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data?.error?.message || data?.message || 'Request failed',
      res.status,
      data
    );
  }

  return data;
}

export async function createCheckout(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  return fetchApi('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
