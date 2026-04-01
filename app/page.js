// ВАЖНО: Мы убрали "use client", теперь это серверный компонент!

async function getProducts() {
  const SHEET_ID = '1q9vPlWM9t934ACzIwbZU4_EDtvpJdfO09-jodyIi9Ew';
  const SHEET_NAME = 'Лист1';
  
  try {
    // Запрос делает СЕРВЕР Vercel, а не твой телефон
    const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`, {
      next: { revalidate: 0 } // Это заставляет сайт обновляться сразу, как ты поменял таблицу
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Ошибка на сервере:", err);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  // Если товаров нет, покажем красивое сообщение
  if (!products || products.length === 0) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
        <h2 style={{ color: '#ff4d4d' }}>ТОВАРЫ НЕ НАЙДЕНЫ ❌</h2>
        <p>Проверь, что в таблице есть данные и она открыта для доступа по ссылке.</p>
        <a href="https://t.me/nmproda" style={{ color: '#00f2ff', marginTop: '20px' }}>Поддержка @nmproda</a>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'sans-serif', padding: '15px', maxWidth: '500px', margin: '0 auto', 
      backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '25px', padding: '20px 0' }}>
        <h1 style={{ fontSize: '32px', color: '#ffcc00', margin: '0', fontWeight: 'bold' }}>BOSS STORE 👑</h1>
        <p style={{ fontSize: '12px', color: '#888', letterSpacing: '2px', marginTop: '5px' }}>DIGITAL AGENCY</p>
      </header>

      {/* Список товаров (Серверный рендеринг - загрузится БЕЗ VPN) */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {products.map((p, index) => (
          <div key={index} style={{ 
            background: '#141414', padding: '20px', borderRadius: '25px', 
            border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff', fontWeight: '600' }}>
                {p['Название'] || 'Без названия'}
              </h3>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#ffcc00', fontSize: '22px' }}>
                {p['Цена'] || '0'} ₽
              </p>
              <div style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', backgroundColor: '#222', borderRadius: '8px', fontSize: '10px', color: '#aaa', textTransform: 'uppercase' }}>
                {p['Категория'] || 'Общее'}
              </div>
            </div>
            
            <a 
              href={`https://t.me/nmproda?text=Привет! Хочу купить: ${p['Название']}`}
              target="_blank"
              style={{ 
                padding: '12px 20px', background: '#ffcc00', color: '#000', 
                textDecoration: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '14px',
                boxShadow: '0 0 15px rgba(255, 204, 0, 0.3)'
              }}
            >
              КУПИТЬ
            </a>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', color: '#444', fontSize: '11px', paddingBottom: '30px', borderTop: '1px solid #111', paddingTop: '20px' }}>
        BOSS STORE © 2024<br/>
        Сделано специально для @nmproda
      </footer>
    </div>
  );
    }
