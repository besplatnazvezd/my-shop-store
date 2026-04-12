
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function BossStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState({ id: '', balance: 0, isVip: false });
  const [luckUsed, setLuckUsed] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  // Твои данные
  const adminId = "7727345054";
  const botToken = "8730430332:AAGff_PCX2059o3EUwG-d9C19uTqcH4sAZ4";
  const csvUrl = "https://docs.google.com/spreadsheets/d/1q9vPlWM9t934ACzIwbZU4_EDtvpJdfO09-jodyIi9Ew/export?format=csv";

  useEffect(() => {
    fetchProducts();
    initTg();
  }, []);

  const initTg = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      setUser(prev => ({ ...prev, id: tg.initDataUnsafe?.user?.id || 'Guest' }));
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(csvUrl);
      const data = await res.text();
      const rows = data.split('\n').slice(1);
      const parsed = rows.map(row => {
        const [id, name, price, desc, img] = row.split(',');
        return { id, name, price: parseInt(price), desc, img };
      }).filter(p => p.name);
      setProducts(parsed);
      setLoading(false);
    } catch (e) { console.error("Ошибка загрузки товаров"); }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyStatus('Скопировано!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const rollLuck = () => {
    if (luckUsed) return;
    const result = Math.floor(Math.random() * 3) + 4; // Только 4, 5, 6
    alert(`Выпало число ${result}! Вам начислена секретная скидка!`);
    setLuckUsed(true);
  };

  const sendOrder = async (type) => {
    const message = `🛍 НОВЫЙ ЗАКАЗ!\nЮзер: ${user.id}\nТовары: ${JSON.stringify(cart)}\nТип: ${type}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminId,
        text: message,
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Одобрить", callback_data: `approve_${user.id}` },
             { text: "❌ Отказать", callback_data: `reject_${user.id}` }]
          ]
        }
      })
    });
    alert("Заказ отправлен админу! Ожидайте подтверждения.");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500">
      <Head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <title>Boss Store | Premium</title>
      </Head>

      {/* Header */}
      <header className="p-6 border-b border-yellow-600/30 bg-gradient-to-b from-yellow-900/20 to-black sticky top-0 z-50 backdrop-blur-md">
        <h1 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700 uppercase tracking-widest">
          Boss Store
        </h1>
        {copyStatus && <div className="text-center text-yellow-500 text-sm animate-pulse">{copyStatus}</div>}
      </header>

      {/* Реквизиты */}
      <section className="p-4 grid grid-cols-1 gap-3">
        <div onClick={() => copy('4100119121976236')} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg cursor-pointer hover:bg-white/10 transition">
          <p className="text-xs text-gray-400">ЮMoney</p>
          <p className="text-lg font-mono">4100119121976236 📋</p>
        </div>
        <div onClick={() => copy('2200701955299232')} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg cursor-pointer hover:bg-white/10 transition">
          <p className="text-xs text-gray-400">Т-Банк (Карта)</p>
          <p className="text-lg font-mono">2200701955299232 📋</p>
        </div>
      </section>

      {/* Удачный бросок */}
      <div className="px-4 mb-6">
        <button 
          onClick={rollLuck}
          disabled={luckUsed}
          className={`w-full py-4 rounded-2xl font-bold uppercase tracking-tighter shadow-lg shadow-yellow-900/20 transition-all ${luckUsed ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black active:scale-95'}`}
        >
          {luckUsed ? "Удача использована" : "💎 ИСПЫТАТЬ УДАЧУ (1 РАЗ)"}
        </button>
      </div>

      {/* Список товаров */}
      <main className="p-4 grid grid-cols-2 gap-4">
        {loading ? [1,2,3,4].map(i => (
          <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
        )) : products.map(p => (
          <div key={p.id} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center backdrop-blur-xl">
            <div className="w-full h-24 bg-yellow-500/10 rounded-lg mb-2 flex items-center justify-center text-3xl">📦</div>
            <h3 className="font-bold text-sm text-center line-clamp-1">{p.name}</h3>
            <p className="text-yellow-500 font-black mt-1">{p.price} ₽</p>
            <div className="flex items-center gap-2 mt-3">
               <button onClick={() => setCart({...cart, [p.id]: (cart[p.id] || 0) + 1})} className="bg-yellow-500 text-black w-8 h-8 rounded-full font-bold">+</button>
               <span className="font-mono">{cart[p.id] || 0}</span>
               <button onClick={() => setCart({...cart, [p.id]: Math.max(0, (cart[p.id] || 0) - 1)})} className="bg-white/10 w-8 h-8 rounded-full font-bold">-</button>
            </div>
          </div>
        ))}
      </main>

      {/* Футер кнопки */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-2xl border-t border-yellow-900/30 grid grid-cols-2 gap-2 z-50">
        <button onClick={() => sendOrder('Обычный')} className="col-span-2 py-4 bg-yellow-500 text-black font-black rounded-xl uppercase">Я оплатил(а)</button>
        <button onClick={() => setShowGift(true)} className="py-2 bg-blue-600 text-white text-xs rounded-lg uppercase font-bold">🎁 Подарок другу</button>
        <button onClick={() => setCart({})} className="py-2 bg-red-600/20 text-red-500 text-xs rounded-lg uppercase font-bold">Отмена</button>
        
        <a href="https://t.me/boss_storemy" className="text-[10px] text-center text-gray-500 mt-2 underline">Канал</a>
        <a href="https://t.me/nmproda" className="text-[10px] text-center text-gray-500 mt-2 underline">Админ</a>
      </div>

      {/* Секция отзывов (87 штук - имитация) */}
      <section className="p-4 mb-32">
        <h2 className="text-xl font-black mb-4 text-yellow-500 uppercase">Отзывы (87)</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 italic text-sm text-gray-300">
              "Всё четко, Boss Store лучший, nmproda быстро выдал товар. Рекомендую!"
            </div>
          ))}
          <p className="text-center text-gray-600 text-xs">... и еще 82 отзыва</p>
        </div>
      </section>

      {/* Подарок Оверлей */}
      {showGift && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <div className="relative w-48 h-48 mb-8">
             <div className="absolute inset-0 bg-red-600 rounded-lg shadow-2xl"></div>
             <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-blue-500 -translate-x-1/2"></div>
             <div className="absolute left-0 right-0 top-1/2 h-4 bg-blue-500 -translate-y-1/2"></div>
          </div>
          <h2 className="text-3xl font-black text-yellow-500 mb-2 underline italic">РАКЕТЫ ЗАПУЩЕНЫ! 🚀</h2>
          <p className="text-gray-300 mb-6 font-bold uppercase tracking-widest">Конфетти и товар уже внутри!</p>
          <input type="text" placeholder="@твой_юзернейм" className="bg-white/10 border border-yellow-500/50 p-4 rounded-xl w-full mb-4 outline-none focus:border-yellow-500" />
          <button onClick={() => setShowGift(false)} className="text-yellow-500 underline font-bold">Закрыть</button>
        </div>
      )}

      <style jsx global>{`
        body { background: black; }
        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); }
      `}</style>
    </div>
  );
                                           }
