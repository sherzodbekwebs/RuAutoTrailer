import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <div className="py-12 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 mb-4">Контакты</h1>
        <div className="h-1 w-20 bg-accent-blue mx-auto"></div>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto font-medium">
          Свяжитесь с нами для получения коммерческого предложения или консультации по подбору техники.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Phone className="text-accent-blue" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Отдел продаж</h3>
            <p className="text-xl font-black text-gray-900">+7 (800) 555-01-23</p>
            <p className="text-sm text-gray-500 mt-1">Звонок по России бесплатный</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Mail className="text-accent-blue" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Электронная почта</h3>
            <p className="text-xl font-black text-gray-900">sales@ruautotrailer.ru</p>
            <p className="text-sm text-gray-500 mt-1">Отвечаем в течение 1 часа</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <MapPin className="text-accent-blue" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Адрес офиса</h3>
            <p className="text-lg font-black text-gray-900">г. Москва, ул. Автомобильная, д. 12</p>
            <p className="text-sm text-gray-500 mt-1">Бизнес-центр "Драйв", офис 402</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl shadow-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">Напишите нам</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Ваше имя</label>
                <input required type="text" placeholder="Иван Иванов" className="w-full bg-gray-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-accent-blue transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Телефон</label>
                <input required type="tel" placeholder="+7 (___) ___-__-__" className="w-full bg-gray-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-accent-blue transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Сообщение</label>
                <textarea required rows={4} placeholder="Какая модель вас интересует?" className="w-full bg-gray-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-accent-blue transition-all resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                className="md:col-span-2 bg-gray-900 text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-brand-blue transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
              >
                Отправить запрос
                <Send size={18} />
              </button>
            </form>
          </div>
          
          {/* Working Hours */}
          <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm font-medium">
            <Clock size={16} className="text-accent-blue" />
            <span>Режим работы: Пн-Пт 9:00 - 18:00, Сб 10:00 - 15:00</span>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-20 w-full h-80 bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <MapPin className="text-gray-300 mx-auto mb-2" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Интерактивная карта скоро появится</p>
            </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-10 grayscale" 
          alt="Map background"
        />
      </div>
    </div>
  );
}
