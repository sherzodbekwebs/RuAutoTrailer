import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Info, Truck, Settings, Package, History } from 'lucide-react';
import { useState } from 'react';
import SEO from '../components/SEO.jsx';

const SpecSection = ({ title, icon: Icon, specs, color }) => {
  if (!specs || specs.length === 0) return null;
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-500`}>
          <Icon size={20} />
        </div>
        <h3 className="font-black text-sm uppercase tracking-wider text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex justify-between items-end gap-4 text-sm group">
            <span className="text-gray-400 font-medium group-hover:text-gray-600 transition-colors">{spec.key}</span>
            <div className="flex-grow border-b border-dotted border-gray-200 mb-1"></div>
            <span className="text-gray-900 font-bold text-right">{spec.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProductPage({ products }) {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(null);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Продукт не найден</h2>
        <Link to="/" className="text-accent-blue underline mt-4 inline-block">Вернуться на главную</Link>
      </div>
    );
  }

  const currentImage = activeImage || product.image;
  const gallery = [product.image, ...(product.gallery || [])];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={product.name} 
        description={product.description?.substring(0, 160) + "..."}
        image={product.image}
      />
      {/* Top Banner (Optional if banner exists) */}
      {product.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden relative">
            <img src={product.banner} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent-blue mb-10 transition-all hover:-translate-x-1">
          <ArrowLeft size={16} />
          Назад в каталог
        </Link>

        {/* Product Title & Short Specs */}
        <div className="mb-12">
            <span className="text-brand-blue font-black text-xs uppercase tracking-[0.2em] mb-4 block">{product.brand || 'UzAutoTrailer'}</span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight uppercase max-w-4xl">
              {product.name}
            </h1>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <motion.div 
               layoutId={`image-${product.id}`}
               className="rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200 bg-gray-50 aspect-[4/3] border border-gray-100 flex items-center justify-center p-6"
            >
              <img src={currentImage} alt={product.name} className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" />
            </motion.div>
            
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`rounded-2xl overflow-hidden bg-gray-100 aspect-square border-2 transition-all ${currentImage === img ? 'border-brand-blue scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
              {product.description}
            </p>

            <div className="bg-gray-50 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between border border-gray-100 mb-10 gap-8">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ориентировочная стоимость</p>
                <p className="text-4xl font-black text-brand-blue tracking-tight">{product.price}</p>
              </div>
              <a href="tel:+998711234567" className="w-full md:w-auto bg-brand-blue text-white px-8 py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20 group font-black uppercase tracking-widest text-sm">
                <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                Связаться
              </a>
            </div>

            <button className="w-full bg-[#FF7F3F] text-white py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#E56F35] transition-all shadow-2xl shadow-orange-100">
              Оставить заявку
            </button>
          </div>
        </div>

        {/* Technical Data Sections */}
        <div className="space-y-12">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4">
                Технические данные
                <div className="flex-grow h-px bg-gray-100"></div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SpecSection 
                  title="Весовые параметры" 
                  icon={History} 
                  specs={product.specifications} 
                  color="indigo" 
                />
                <SpecSection 
                  title="Оси и подвеска" 
                  icon={Truck} 
                  specs={product.axleSpecs} 
                  color="blue" 
                />
                <SpecSection 
                  title="Основные характеристики" 
                  icon={Settings} 
                  specs={product.characteristicSpecs} 
                  color="emerald" 
                />
                <SpecSection 
                  title="Комплектация" 
                  icon={Package} 
                  specs={product.equipment} 
                  color="orange" 
                />
            </div>
        </div>

        {/* Extra Description (If very long) */}
        {product.description?.length > 500 && (
            <div className="mt-24 max-w-4xl">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Подробное описание</h3>
                <div className="prose prose-gray max-w-none text-gray-500 font-medium leading-relaxed">
                   {product.description}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
