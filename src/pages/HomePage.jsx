import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function HomePage({ products }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = products && products.length > 0 ? products.slice(0, 10).map(p => p.image) : [];

  useEffect(() => {
    if (heroImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroImages.length]);

  return (
    <div>
      <SEO title="Каталог спецтехники" description="Официальный дилер UzAuto Trailer" />

      <section className="relative overflow-hidden bg-gray-50 pt-16 md:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">

          {/* Chap tomon: Matnlar */}
          <div className="flex-1 z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-none text-gray-900 mb-8 tracking-tighter">
                НАДЕЖНАЯ <br />
                <span className="text-accent-blue">ТЕХНИКА</span> <br />
                ДЛЯ БИЗНЕСА
              </h1>
              <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed font-medium">
                Мы предлагаем широкий ассортимент полуприцепов и спецтехники РуАвто ТРЕЙЛЕР. Гарантия качества и сервис 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#products" className="bg-gray-900 text-white px-10 py-5 rounded-2xl text-base font-black hover:bg-brand-blue transition-all flex items-center justify-center gap-3 shadow-2xl group">
                  Смотреть каталог
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-8 px-2">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-black text-xl">100%</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Гарантия</span>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-black text-xl">24/7</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Сервис</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* O'ng tomon: Dinamik rasm (Yaxshilangan qism) */}
          {/* O'ng tomon: Dinamik rasm (Tiniq va ravon animatsiya) */}
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[350px] md:min-h-[500px]">
            {/* Orqa fondagi ko'k nur (xiralik faqat fonda qoladi, rasmda emas) */}
            <div className="absolute inset-0 bg-accent-blue/10 blur-[120px] rounded-full scale-75"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                // Hiralik (blur) butunlay olib tashlandi
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{
                  duration: 0.5, // Tezlik biroz oshirildi (tezroq almashsa tiniqroq ko'rinadi)
                  ease: "easeOut"
                }}
                className="relative w-full flex flex-col items-center"
              >
                {/* Texnika rasmi - har doim tiniq */}
                <img
                  src={heroImages[currentSlide]}
                  alt="Tech"
                  className="w-full h-auto max-h-[450px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-20"
                />

                {/* Yer soyasi */}
                <div className="w-[80%] h-5 bg-black/5 blur-xl rounded-[100%] -mt-4 z-10"></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Katalog qismi o'zgarishsiz qoladi... */}
      <section id="products" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Актуальные предложения</h2>
            <div className="h-1 w-20 bg-accent-blue"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col hover:shadow-xl transition-all group"
            >
              <Link to={`/product/${product.id}`} className="block mb-6 overflow-hidden rounded-2xl bg-gray-50 aspect-[16/10] flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="flex-grow">
                <h3 className="font-black text-lg mb-2 text-gray-900 leading-tight">{product.name}</h3>
                <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">{product.shortSpecs}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="font-black text-accent-blue text-xl">{product.price}</span>
                <Link to={`/product/${product.id}`} className="text-xs font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1">Подробнее</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}