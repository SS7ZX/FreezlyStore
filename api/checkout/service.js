import { createXenditInvoice } from '../lib/xendit.client.js';
import { supabase } from '../lib/supabase.client.js';
import { ValidationError } from '../lib/errors.js';

export async function checkoutService(data) {
  if (!data?.userId || !data?.product || !data?.paymentMethod) {
    throw new ValidationError('Missing required checkout fields');
  }

  // 1️⃣ Create invoice
  const invoice = await createXenditInvoice({
    amount: Number(data.price),
    paymentMethod: data.paymentMethod,
    game: data.game,
    product: data.product.name,
    customerName: 'Game Player',
    customerEmail: 'player@example.com',
    frontendUrl: process.env.FRONTEND_URL
  });

  // 2️⃣ Store transaction
  const { error } = await supabase
    .from('transactions')
    .insert({
      external_id: invoice.externalId,
      invoice_id: invoice.invoiceId,
      invoice_url: invoice.invoiceUrl,
      user_game_id: data.userId,
      zone_id: data.zoneId || null,
      game_name: data.game,
      product_name: data.product.name,
      payment_method: data.paymentMethod.toUpperCase(),
      amount: Number(data.price),
      status: 'PENDING',
      currency: 'IDR',
      expired_at: invoice.expiry
    });

  if (error) {
    throw new Error(
      `DB_INSERT_FAILED: ${error.message} | ${error.details || 'no details'}`
    );
  }

  return invoice;
}
