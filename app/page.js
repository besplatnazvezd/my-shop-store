"use client";
import { useState, useEffect } from 'react';

// --- ТВОИ НАСТРОЙКИ ИЗ СКРИНШОТОВ ---
const BOT_TOKEN = '8774830332:AAGfF_PCX2059O3eUWg-d9C19uTqcH4sAZ4';
const ADMIN_ID = '7727345054';
const SHEET_ID = '1q9vPlWM9t934ACzIwbZU4_EDtvpJdfO09-jodyIi9Ew';
const REKVIZITY = `💰 РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ:
💳 Т-Банк: 2200 7019 5529 9232
📞 СБП: +7 950 170 07 87 (Т-Банк)
✅ После оплаты пришлите чек @nmproda`;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState('Все');
  const [loading, setLoading] = useState(true);

  // 1. Загрузка данных (через прокси, чтобы работал без VPN)
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://opensheet.elk.sh/${SHEET_ID}/Лист1`)}`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Ошибка базы:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Логика корзины
  const addToCart = (item) => {
    setCart([...cart, item]);
    if (window.Telegram?.WebApp) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item['Цена'] || 0), 0);

  // 3. Отправка заказа в бот
  const sendOrder = async () => {
    const itemsList = cart.map(i => `• ${i['Название']} (${i['Цена']}₽)`).join('\n');
    const text = `🚀 НОВЫЙ ЗАКАЗ!\n\n🛒 Товары:\n${itemsList}\n\n💰 Итого: ${totalPrice}₽`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_ID, text: text })
      });
      alert("Заказ отправлен админу! Сейчас откроются реквизиты.");
      alert(REKVIZITY);
      setCart([]);
    } catch (e) {
      alert("Ошибка отправки. Напиши в поддержку @nmproda");
    }
  };

  if (loading) return <div style={{background:'#000', color:'#fbbf24', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>ЗАГРУЗКА BOSS STORE...</div>;

  const categories = ['Все', ...new Set(products.map(p => p['Категория']))];
  const filtered = activeCat === 'Все' ? products : products.filter(p => p['Категория'] === activeCat);

  return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      
      {/* ШАПКА */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div>
          <h1 style={{ color: '#fbbf24', margin: 0, fontSize: '22px', fontStyle: 'italic', fontWeight: '900' }}>BOSS STORE</h1>
          <p style={{ margin: 0, fontSize: '10px', color: '#666', letterSpacing: '2px' }}>DIGITAL AGENCY</p>
        </div>
        <button onClick={() => window.open('https://t.me/nmproda')} style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '8px 15px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>ПОДДЕРЖКА</button>
      </header>

      {/* КАТЕГОРИИ */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px 20px', sticky: 'top', top: '70px' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '10px 20px', borderRadius: '15px', border: 'none', backgroundColor: activeCat === cat ? '#fbbf24' : '#1a1a1a', color: activeCat === cat ? '#000' : '#fff', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '12px' }}>{cat}</button>
        ))}
      </div>

      {/* ВИТРИНА */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '20px' }}>
        {filtered.map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#111', borderRadius: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>📦</div>
            <h3 style={{ fontSize: '12px', margin: '0 0 5px 0', height: '32px', overflow: 'hidden' }}>{p['Название']}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ color: '#fbbf24', fontWeight: '900', fontSize: '16px' }}>{p['Цена']} ₽</span>
              <button onClick={() => addToCart(p)} style={{ background: '#fbbf24', border: 'none', width: '35px', height: '35px', borderRadius: '10px', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* ПАНЕЛЬ КОРЗИНЫ */}
      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '20px', borderRadius: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', color: '#aaa', textTransform: 'uppercase' }}>К оплате:</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#fbbf24', fontStyle: 'italic' }}>{totalPrice} ₽</p>
          </div>
          <button onClick={sendOrder} style={{ background: '#fbbf24', color: '#000', padding: '15px 30px', borderRadius: '18px', border: 'none', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>Оформить</button>
        </div>
      )}
    </div>
  );
}
