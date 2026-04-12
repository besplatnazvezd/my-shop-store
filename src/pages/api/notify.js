export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  
  const { message } = req.body;
  const BOT_TOKEN = '8730430332:AAGff_PCX2059o3EUwG-d9C19uTqcH4sAZ4';
  const ADMIN_ID = '7727345054';

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: ADMIN_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });

  res.status(200).json({ success: true });
}
