import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Copy, Star, Gift, Share2, Disc, User, 
  ShoppingCart, X, CheckCircle2, Rocket 
} from 'lucide-react';

// --- ДАННЫЕ ---
const REQUISITES = {
  umoney: "4100119121976236",
  tinkoffCard: "2200701955299232",
  tinkoffPhone: "+79501700787"
};

const REVIEWS_COUNT = 87;
const generateReviews = () => {
  const names = ["Dmitry", "Alex", "Sasha", "Vika", "Ivan", "Maria", "Kira", "Artem"];
  const texts = ["Всё супер!", "Быстро пришло", "Лучший магазин", "Админу респект", "Качество топ"];
  return Array.from({ length: REVIEWS_COUNT }).map((_, i) => ({
    id: i,
    user: names[Math.floor(Math.random() * names.length)] + "***",
    text: texts[Math.floor(Math.random() * texts.length)],
    rating: 5
  }));
};

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0); // В процентах
  const [isVip, setIsVip] = useState(false);
  const [wheelCooldown, setWheelCooldown] = useState(false);
  const [referrals, setReferrals] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Загрузка товаров из CSV
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://docs.google.com/spreadsheets/d/1q9vPlWM9t934ACzIwbZU4_EDtvpJdfO09-jodyIi9Ew/export?format=csv');
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        const parsed = rows.map(row => {
          const [name, price, img] = row.split(',');
          return { name, price: parseInt(price), img: img?.trim() };
        }).filter(p => p.name);
        setProducts(parsed);
        setLoading(false);
      } catch (e) { console.error(e); }
    };
    fetchProducts();
    
    // Загрузка данных пользователя из LocalStorage
    const savedRef = localStorage.getItem('refs') || 0;
    setReferrals(parseInt(savedRef));
    setDiscount(parseInt(savedRef) * 1.25);
  }, []);

  // 2. Копирование
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Скопировано!");
  };

  // 3. Колесо фортуны
  const spinWheel = () => {
    if (wheelCooldown) return alert("Можно крутить раз в 24 часа!");
        const results = ["VIP", "DISCOUNT", "EMPTY", "HOUR"];
    const result = results[Math.floor(Math.random() * results.length)];
    
    setWheelCooldown(true);
    setTimeout(() => {
      if (result === "VIP") {
        setIsVip(true);
        notifyAdmin("🎰 Пользователю выпал VIP на день!");
        confetti({ particleCount: 150, spread: 70, colors: ['#D4AF37', '#ffffff'] });
      } else if (result === "DISCOUNT") {
        setDiscount(prev => prev + 2);
        notifyAdmin("🎰 Пользователю выпала скидка 2%!");
      }
      alert(`Результат: ${result}`);
    }, 2000);
  };

  // 4. Уведомление админа
  const notifyAdmin = async (msg) => {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
  };

  // 5. Покупка
  const handlePayment = (product) => {
    const finalPrice = product.price - (product.price * (discount / 100));
    const msg = `📦 <b>Новый заказ!</b>\nТовар: ${product.name}\nК оплате: ${finalPrice.toFixed(0)}₽\nСкидка: ${discount}%`;
    notifyAdmin(msg);
    setSelectedProduct({ ...product, finalPrice });
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-gold/30">
      <Head>
        <title>BOSS STORE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </Head>

      {/* HEADER */}
      <header className="p-6 border-b border-gold/20 flex justify-between items-center sticky top-0 bg-dark/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-gold">BOSS <span className="text-white">STORE</span></h1>
        <div className="flex gap-4">
           <div className="text-xs bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-gold">
             Скидка: {discount > 100 ? 100 : discount}%
           </div>
        </div>
      </header>

      <main className="p-4 pb-32 space-y-8">
        
        {/* VIP CARD С ГИРОСКОПОМ */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`relative h-48 rounded-3xl p-6 overflow-hidden border border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] ${isVip ? 'bg-gradient-to-br from-gold-dark via-gold to-gold-light' : 'bg-glass'}`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <User size={32} className={isVip ? 'text-dark' : 'text-gold'} />
              <div className="text-right">
                <p className={`text-xs uppercase opacity-60 ${isVip ? 'text-dark' : ''}`}>Status</p>
                <p className={`font-bold ${isVip ? 'text-dark' : 'text-gold'}`}>{isVip ? 'PLATINUM VIP' : 'STANDARD'}</p>
              </div>
            </div>
            <div className={isVip ? 'text-dark font-mono text-xl' : 'text-white font-mono'}>
              **** **** **** {isVip ? '7777' : '0000'}
            </div>
          </div>
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 pointer-events-none animate-[pulse_3s_infinite]" />
        </motion.div>

        {/* КНОПКИ РЕКВИЗИТОВ */}
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => copyToClipboard(REQUISITES.umoney)} className="flex justify-between p-4 bg-glass rounded-xl border border-white/5 active:scale-95 transition">
            <span className="opacity-60 text-sm">ЮMoney</span>
            <span className="font-mono text-gold flex gap-2">{REQ
                                                                  const results = ["VIP", "DISCOUNT", "EMPTY", "HOUR"];
    const result = results[Math.floor(Math.random() * results.length)];
    
    setWheelCooldown(true);
    setTimeout(() => {
      if (result === "VIP") {
        setIsVip(true);
        notifyAdmin("🎰 Пользователю выпал VIP на день!");
        confetti({ particleCount: 150, spread: 70, colors: ['#D4AF37', '#ffffff'] });
      } else if (result === "DISCOUNT") {
        setDiscount(prev => prev + 2);
        notifyAdmin("🎰 Пользователю выпала скидка 2%!");
      }
      alert(`Результат: ${result}`);
    }, 2000);
  };

  // 4. Уведомление админа
  const notifyAdmin = async (msg) => {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
  };

  // 5. Покупка
  const handlePayment = (product) => {
    const finalPrice = product.price - (product.price * (discount / 100));
    const msg = `📦 <b>Новый заказ!</b>\nТовар: ${product.name}\nК оплате: ${finalPrice.toFixed(0)}₽\nСкидка: ${discount}%`;
    notifyAdmin(msg);
    setSelectedProduct({ ...product, finalPrice });
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-gold/30">
      <Head>
        <title>BOSS STORE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </Head>

      {/* HEADER */}
      <header className="p-6 border-b border-gold/20 flex justify-between items-center sticky top-0 bg-dark/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-gold">BOSS <span className="text-white">STORE</span></h1>
        <div className="flex gap-4">
           <div className="text-xs bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-gold">
             Скидка: {discount > 100 ? 100 : discount}%
           </div>
        </div>
      </header>

      <main className="p-4 pb-32 space-y-8">
        
        {/* VIP CARD С ГИРОСКОПОМ */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`relative h-48 rounded-3xl p-6 overflow-hidden border border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] ${isVip ? 'bg-gradient-to-br from-gold-dark via-gold to-gold-light' : 'bg-glass'}`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <User size={32} className={isVip ? 'text-dark' : 'text-gold'} />
              <div className="text-right">
                <p className={`text-xs uppercase opacity-60 ${isVip ? 'text-dark' : ''}`}>Status</p>
                <p className={`font-bold ${isVip ? 'text-dark' : 'text-gold'}`}>{isVip ? 'PLATINUM VIP' : 'STANDARD'}</p>
              </div>
            </div>
            <div className={isVip ? 'text-dark font-mono text-xl' : 'text-white font-mono'}>
              **** **** **** {isVip ? '7777' : '0000'}
            </div>
          </div>
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 pointer-events-none animate-[pulse_3s_infinite]" />
        </motion.div>

        {/* КНОПКИ РЕКВИЗИТОВ */}
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => copyToClipboard(REQUISITES.umoney)} className="flex justify-between p-4 bg-glass rounded-xl border border-white/5 active:scale-95 transition">
            <span className="opacity-60 text-sm">ЮMoney</span>
            <span className="font-mono text-gold flex gapКанал</span></button>
        <button onClick={() => window.location.href = 'https://t.me/nmproda'} className="flex flex-col items-center gap-1 opacity-40"><User size={20}/><span className="text-[10px] uppercase font-bold">Админ</span></button>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
          }
