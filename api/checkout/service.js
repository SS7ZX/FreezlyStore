import { createXenditInvoice } from '../lib/xendit.client.js';
import { supabase } from '../lib/supabase.client.js';
import { ValidationError } from '../lib/errors.js';

export async function checkoutService(data) {
  if (!data.userId || !data.product || !data.paymentMethod) {
    throw new ValidationError('Missing required fields');
  }

  const invoice = await createXenditInvoice({
    amount: data.price,
    paymentMethod: data.paymentMethod,
    game: data.game,
    product: data.product.name,
    customerName: 'Game Player',
    customerEmail: 'player@example.com',
    frontendUrl: 'https://freezly-store.vercel.app'
  });

  await supabase.from('transactions').insert({
    external_id: invoice.externalId,
    invoice_id: invoice.invoiceId,
    invoice_url: invoice.invoiceUrl,
    user_game_id: data.userId,
    zone_id: data.zoneId || null,
    game_name: data.game,
    product_name: data.product.name,
    payment_method: data.paymentMethod.toUpperCase(),
    amount: data.price,
    status: 'PENDING',
    currency: 'IDR',
    expired_at: invoice.expiry
  });

  return invoice;
}
