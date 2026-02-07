
// api/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create transaction
export async function createTransaction(data) {
  const { data: result, error } = await supabase
    .from('transactions')
    .insert({
      external_id: data.externalId,
      invoice_id: data.invoiceId,
      invoice_url: data.invoiceUrl,
      user_game_id: data.userId,
      zone_id: data.zoneId || null,
      game_name: data.game,
      product_name: data.productName,
      payment_method: data.paymentMethod.toUpperCase(),
      amount: data.amount,
      final_amount: data.amount,
      status: 'PENDING',
      currency: 'IDR',
      expired_at: data.expiryDate
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

// Update transaction status
export async function updateTransactionStatus(invoiceId, status, paidAt = null) {
  const updateData = { status, updated_at: new Date().toISOString() };
  if (paidAt) updateData.paid_at = paidAt;

  const { data, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('invoice_id', invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get transaction by external ID
export async function getTransactionByExternalId(externalId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('external_id', externalId)
    .single();

  if (error) return null;
  return data;
}

// Get transaction by invoice ID
export async function getTransactionByInvoiceId(invoiceId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('invoice_id', invoiceId)
    .single();

  if (error) return null;
  return data;
}