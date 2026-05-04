import { Link } from 'react-router-dom';
import { Phone, Menu } from 'lucide-react'; // Menu iconini ham qo'shdik (ixtiyoriy)

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-slate-100 flex items-center bg-white/95 backdrop-blur-md z-[100]">
      <div className="max-w-[1300px] mx-auto w-full px-4 md:px-10 flex items-center justify-between">

        {/* Chap taraf: Logo va Navigatsiya */}
        <div className="flex items-center gap-4 md:gap-14">
          <Link to="/" className="group flex flex-col">
            <span className="text-lg md:text-2xl font-black tracking-tighter text-[#00529B] leading-none">
              РуАвто <span className="text-[#1E3A5F]">Трейлер</span>
            </span>
          </Link>

          {/* Navigatsiya - Endi 'md' (planshet) ekranlardan boshlab ko'rinadi */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/contacts"
              className="text-slate-500 hover:text-[#00529B] transition-all uppercase tracking-widest text-[10px] md:text-[11px] font-black"
            >
              Контакты
            </Link>
          </nav>
        </div>

        {/* O'ng taraf: Aloqa */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Telefon raqami: Desktop va Planshet uchun */}
          <div className="text-right hidden sm:block">
            <a
              href="tel:+79014010001"
              className="flex items-center gap-2 text-sm md:text-lg font-black text-[#1E3A5F] hover:text-[#00529B] transition-colors tracking-tight"
            >
              <div className="hidden md:flex w-8 h-8 bg-blue-50 rounded-lg items-center justify-center">
                <Phone size={16} className="text-[#00529B]" />
              </div>
              <span>+7 (901) 401-00-01</span>
            </a>
            <p className="hidden md:block text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">
              Ежедневно с 9:00 do 21:00
            </p>
          </div>

          {/* Mobil uchun: Telefon icon (faqat juda kichik ekranlarda) */}
          <a
            href="tel:+79014010001"
            className="sm:hidden w-10 h-10 bg-[#00529B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"
            aria-label="Call us"
          >
            <Phone size={18} />
          </a>

          {/* Mobil uchun kichik "Контакты" linki (faqat telefonda ko'rinadi) */}
          <Link
            to="/contacts"
            className="md:hidden text-[10px] font-black uppercase text-[#00529B] border border-[#00529B]/20 px-2 py-1 rounded"
          >
            Контакты
          </Link>
        </div>

      </div>
    </header>
  );
}