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

      {/* Hero Section - pt-8 md:pt-24 qilib tepaga ko'tardik */}
      <section className="relative overflow-hidden bg-gray-50 pt-8 md:pt-24 pb-12 md:pb-20">
        {/* flex-col-reverse orqali rasm mobil versiyada tepaga chiqdi */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 lg:gap-20">

          {/* Chap tomon: Matnlar */}
          <div className="flex-1 z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight md:leading-none text-gray-900 mb-6 md:mb-8 tracking-tighter">
                Надежная <br />
                <span className="text-accent-blue">техника</span> <br className="hidden md:block" />
                {" "}для вашего бизнеса
              </h1>
              <p className="text-sm md:text-lg text-gray-500 mb-8 md:mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
                Мы предлагаем широкий ассортимент прицепной техники от ООО "РуАвто Трейлер". Гарантия качества и сервис 24/7.
              </p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-6 md:gap-4">
                <a href="#products" className="w-full sm:w-auto bg-gray-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl text-base font-black hover:bg-brand-blue transition-all flex items-center justify-center gap-3 shadow-2xl group">
                  Смотреть каталог
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-6 md:gap-8 px-2">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-gray-900 font-black text-lg md:text-xl">100%</span>
                    <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">Гарантия</span>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200"></div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-gray-900 font-black text-lg md:text-xl">24/7</span>
                    <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">Сервис</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Slayder - Dinamik rasm (Tepaga surilgan holati) */}
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-[500px]">
            {/* Orqa fondagi nur biroz kichraytirildi */}
            <div className="absolute inset-0 bg-accent-blue/10 blur-[60px] md:blur-[120px] rounded-full scale-100 md:scale-75"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full flex flex-col items-center"
              >
                <img
                  src={heroImages[currentSlide]}
                  alt="Tech"
                  className="w-full h-auto max-h-[250px] sm:max-h-[400px] md:max-h-[450px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-20"
                />
                {/* Soya biroz yuqoriga surildi */}
                <div className="w-[60%] md:w-[80%] h-3 md:h-5 bg-black/5 blur-lg md:blur-xl rounded-[100%] -mt-2 md:-mt-4 z-10"></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Katalog qismi o'zgarishsiz qoladi */}
      <section id="products" className="py-12 md:py-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Актуальные предложения</h2>
            <div className="h-1 w-20 bg-accent-blue"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-gray-100 rounded-3xl p-4 md:p-5 flex flex-col hover:shadow-xl transition-all group"
            >
              <Link to={`/product/${product.id}`} className="block mb-4 md:mb-6 overflow-hidden rounded-2xl bg-gray-50 aspect-[16/10] flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="flex-grow">
                <h3 className="font-black text-base md:text-lg mb-2 text-gray-900 leading-tight">{product.name}</h3>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">{product.shortSpecs}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="font-black text-accent-blue text-lg md:text-xl">{product.price}</span>
                <Link to={`/product/${product.id}`} className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1">Подробнее</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}