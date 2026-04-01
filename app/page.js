"use client";
import { useState, useEffect } from 'react';

// --- ТВОИ НАСТРОЙКИ ---
const BOT_TOKEN = '8774830332:AAGfF_PCX2059O3eUWg-d9C19uTqcH4sAZ4';
const ADMIN_ID = '7727345054';
const BOT_USER = 'BossStore_robot';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzY6NqWPoYbQIkcgmzX7Xnl9cquizKYxGq1G77hDgEyIcicBBN9OhTyX_1S4ocA7j3/exec';

const REKVIZITY = `💰 РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ:
💳 Т-Банк: 2200 7019 5529 9232
📞 СБП: +7 950 170 07 87 (Т-Банк)
✅ После оплаты обязательно пришлите скриншот чека @nmproda`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(GOOGLE_SCRIPT_URL);
        const json = await res.json();
        
        // Маппинг под твою таблицу (ВСЕ С МАЛЕНЬКОЙ БУКВЫ)
        const mapped = json.map(item => ({
          name: item.название || 'Без названия',
          price: parseFloat(item.цена || 0),
          category: item.категория || 'Прочее',
          desc: item.описание || '',
          image: item.картинка || 'https://via.placeholder.com/150' // ТЕПЕРЬ КАРТИНКИ ТУТ!
        }));
        
        setProducts(mapped);
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
    }
  }, []);

  const addToCart = (p) => {
    setCart([...cart, p]);
    if (window.Telegram?.WebApp) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const confirmOrder = async () => {
    if (cart.length === 0) return;
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user || { first_name: 'Покупатель', id: null };
    
    const itemsList = cart.map(i => `• ${i.name} (${i.price}₽)`).join('\n');
    const adminText = `🚀 НОВЫЙ ЗАКАЗ!\n\n👤 Клиент: ${user.first_name}\n🆔 ID: ${user.id || 'нет'}\n🛒 Товары:\n${itemsList}\n\n💰 Итого: ${totalPrice}₽`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_ID, text: adminText })
      });
            if (user.id) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: user.id, text: `✅ Ваш заказ на сумму ${totalPrice}₽ принят!\n\n${REKVIZITY}` })
        });
        if (tg) tg.showAlert(`Заказ принят! Реквизиты в боте @${BOT_USER}`);
      } else {
        alert(`✅ Заказ принят!\n\n${REKVIZITY}`);
      }
      setCart([]);
    } catch (e) {
      alert("Ошибка отправки заказа.");
    }
  };

  if (loading) return <div style={{background:'#000', color:'#fbbf24', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'900'}}>BOSS STORE...</div>;

  const categories = ['Все', ...new Set(products.map(p => p.category))];
  const filtered = activeCat === 'Все' ? products : products.filter(p => p.category === activeCat);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '140px' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ color: '#fbbf24', margin: 0, fontSize: '24px', fontStyle: 'italic', fontWeight: '900' }}>BOSS STORE</h1>
          <p style={{ margin: 0, fontSize: '9px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Digital Agency</p>
        </div>
        <button onClick={() => window.open('https://t.me/nmproda')} style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf2433', color: '#fbbf24', padding: '10px 15px', borderRadius: '15px', fontSize: '10px', fontWeight: 'bold' }}>ПОДДЕРЖКА</button>
      </header>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '15px 20px' }}>
        {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '10px 22px', borderRadius: '18px', border: 'none', backgroundColor: activeCat === cat ? '#fbbf24' : '#111', color: activeCat === cat ? '#000' : '#fff', whiteSpace: 'nowrap', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase' }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px' }}>
        {filtered.map((p, i) => (
          <div key={i} style={{ background: 'linear-gradient(180deg, #111 0%, #070707 100%)', border: '1px solid #222', borderRadius: '30px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '22px', marginBottom: '10px', overflow: 'hidden' }}>
                <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
            </div>
            <h3 style={{ fontSize: '12px', margin: '0 0 5px 0', fontWeight: '700', color: '#fff', height: '32px', overflow: 'hidden' }}>{p.name}</h3>
            <p style={{ fontSize: '9px', color: '#666', margin: '0 0 10px 0', height: '22px', overflow: 'hidden' }}>{p.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ color: '#fbbf24', fontWeight: '900', fontSize: '18px', fontStyle: 'italic' }}>{p.price}₽</span>
              <button onClick={() => addToCart(p)} style={{ background: '#fbbf24', border: 'none', width: '38px',height: '38px', borderRadius: '14px', fontWeight: 'bold', fontSize: '22px' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '25px', left: '15px', right: '15px', background: 'rgba(20, 20, 20, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid #fbbf2488', padding: '20px', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '900' }}>Итого:</p>
            <p style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#fbbf24', fontStyle: 'italic' }}>{totalPrice} ₽</p>
          </div>
          <button onClick={confirmOrder} style={{ background: '#fbbf24', color: '#000', padding: '16px 35px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>Оформить</button>
        </div>
      )}
    </div>
  );
                      }
