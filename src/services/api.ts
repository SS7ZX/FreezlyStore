// ============================================
// TYPES
// ============================================

interface CheckoutRequest {
  userId: string;
  zoneId?: string;
  game: string;
  product: {
    name: string;
    price: number;
  };
  paymentMethod: string;
  price: number;
  promoCode?: string;
  customerEmail?: string;
  customerName?: string;
}

interface CheckoutResponse {
  success: boolean;
  invoice_url: string;
  invoice_id: string;
  external_id: string;
  amount: number;
  expiry_date: string;
}

interface TransactionStatus {
  id: string;
  external_id: string;
  invoice_id: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  game_name: string;
  product_name: string;
  user_game_id: string;
  zone_id?: string;
  final_amount: number;
  payment_method: string;
  created_at: string;
  paid_at?: string;
  invoice_url?: string;
}

interface TransactionLookupResponse {
  success: boolean;
  transaction?: TransactionStatus;
  message?: string;
}

// ============================================
// ERROR CLASS (VERSI FIX: ERASABLE SYNTAX SAFE)
// ============================================

export class ApiError extends Error {
  // Kita deklarasikan property di luar constructor (Manual)
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    // Assign manual di sini
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ============================================
// FETCH WRAPPER
// ============================================

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = endpoint;
    const method = options.method || 'GET';
    
    console.log('🔄 API Request:', { url, method });
    
    const response = await fetch(url, {
      ...options,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      throw new ApiError(
        response.status,
        'Server returned non-JSON response. Check backend logs.',
        { responseText: text.substring(0, 500) }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new ApiError(
        response.status,
        data.message || data.error || 'Request failed',
        data.details
      );
    }

    console.log('✅ API Success:', data);
    return data as T;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        0,
        'Network error. Please check your connection.',
        { originalError: error.message }
      );
    }

    throw new ApiError(
      500,
      (error as Error).message || 'Unknown error occurred',
      { originalError: error }
    );
  }
}

// ============================================
// CHECKOUT API (Backend Function)
// ============================================

export async function createCheckout(
  request: CheckoutRequest
): Promise<CheckoutResponse> {
  return await fetchApi<CheckoutResponse>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getCheckoutStatus(
  externalId: string
): Promise<{ success: boolean; transaction: TransactionStatus }> {
  return await fetchApi(`/api/checkout/status/${externalId}`, {
    method: 'GET',
  });
}

// ============================================
// TRANSACTION API
// ============================================

export async function lookupTransaction(params: {
  externalId?: string;
  invoiceId?: string;
  userGameId?: string;
}): Promise<TransactionLookupResponse> {
  return await fetchApi('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getTransactionHistory(
  userGameId: string,
  limit: number = 50
): Promise<{ success: boolean; transactions: TransactionStatus[]; count: number }> {
  return await fetchApi(`/api/transactions/history/${userGameId}?limit=${limit}`, {
    method: 'GET',
  });
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    return await fetchApi('/api/health', { method: 'GET' });
  } catch (error) {
    throw new ApiError(
      0,
      'Backend server is not reachable.',
      { apiUrl: '/api' }
    );
  }
}