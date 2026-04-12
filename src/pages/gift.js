UISITES.umoney} <Copy size={16}/></span>
          </button>
          <button onClick={() => copyToClipboard(REQUISITES.tinkoffCard)} className="flex justify-between p-4 bg-glass rounded-xl border border-white/5 active:scale-95 transition">
            <span className="opacity-60 text-sm">T-Bank Card</span>
            <span className="font-mono text-gold flex gap-2">{REQUISITES.tinkoffCard} <Copy size={16}/></span>
          </button>
        </div>

        {/* КОЛЕСО И УДАЧА */}
        <section className="grid grid-cols-2 gap-4">
          <div onClick={spinWheel} className="p-6 bg-glass rounded-3xl border border-gold/20 flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-gold/10">
            <Disc className="text-gold animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-widest">Колесо</span>
          </div>
          <div onClick={() => alert("Твоя удача: " + (Math.floor(Math.random() * 3) + 4))} className="p-6 bg-glass rounded-3xl border border-gold/20 flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-gold/10">
            <Star className="text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest">Удача</span>
          </div>
        </section>

        {/* ТОВАРЫ (СТЕКЛО) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-2">Товары</h2>
          <div className="grid grid-cols-2 gap-4">
            {loading ? [1,2,3,4].map(n => <div key={n} className="h-40 bg-white/5 animate-pulse rounded-3xl" />) : 
              products.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-glass border border-white/10 p-4 rounded-3xl flex flex-col items-center text-center gap-2 group"
                >
                  <div className="w-full h-24 bg-dark/50 rounded-2xl mb-2 overflow-hidden">
                    <img src={p.img || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <h3 className="font-medium text-sm h-10 overflow-hidden leading-tight">{p.name}</h3>
                  <div className="flex flex-col items-center">
                    {discount > 0 && <span className="text-[10px] line-through opacity-40">{p.price}₽</span>}
                    <span className="text-gold font-bold">{(p.price * (1 - discount/100)).toFixed(0)}₽</span>
                  </div>
                  <button 
                    onClick={() => handlePayment(p)}
                    className="w-full py-2 bg-gold text-dark rounded-xl text-xs font-bold uppercase active:scale-90 transition"
                  >
                    Купить
                  </button>
                </motion.div>
              ))
            }
          </div>
        </section>

        {/* ОТЗЫВЫ */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold px-2">Отзывы ({REVIEWS_COUNT})</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {generateReviews().map(r => (
              <div key={r.id} className="min-w-[200px] p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex text-gold mb-2"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fil
