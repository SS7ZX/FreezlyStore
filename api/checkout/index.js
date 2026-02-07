export default async function handler(req, res) {
console.log('✅ checkout function loaded');


  try {
    console.log('METHOD:', req.method);
    console.log('BODY:', req.body);

    // your logic here

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ CHECKOUT CRASH:', err);

    return res.status(500).json({
      error: 'Checkout failed',
      message: err?.message || 'Unknown error'
    });
  }
}
