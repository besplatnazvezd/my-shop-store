export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { callback_query } = req.body;
    const botToken = "8730430332:AAGff_PCX2059o3EUwG-d9C19uTqcH4sAZ4";
    
    if (callback_query) {
      const [action, userId] = callback_query.data.split('_');
      let text = "";
      
      if (action === 'approve') {
        text = "✅ Админ увидел ваш заказ, свяжитесь с ним @nmproda или напишите через бота в канале https://t.me/boss_storemy если у вас бан.";
      } else {
        text = "❌ Ваш заказ не одобрен. Причины: закончился товар или нет оплаты. Свяжитесь с @nmproda.";
      }

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: userId, text: text })
      });
    }
    res.status(200).send('ok');
  }
}
