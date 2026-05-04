import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-slate-100 flex items-center flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-10 flex items-center justify-between">

        {/* Chap taraf: Logo va Navigatsiya */}
        <div className="flex items-center gap-8 md:gap-14">
          <Link to="/" className="group flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#00529B] leading-none">
              РУАВТО <span className="text-[#1E3A5F]">ТРЕЙЛЕР</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/contacts"
              className="text-slate-500 hover:text-[#00529B] transition-all uppercase tracking-widest text-[11px] font-black"
            >
              Контакты
            </Link>
          </nav>
        </div>

        {/* O'ng taraf: Aloqa */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right hidden sm:block">
            <a
              href="tel:+79014010001"
              className="flex items-center gap-2 text-base md:text-lg font-black text-[#1E3A5F] hover:text-[#00529B] transition-colors tracking-tight"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-[#00529B]" />
              </div>
              <span>+7 (901) 401-00-01</span>
            </a>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1">
              Ежедневно с 9:00 до 21:00
            </p>
          </div>

          {/* Mobil uchun telefon knopkasi (faqat ikona) */}
          <a
            href="tel:+79014010001"
            className="sm:hidden w-10 h-10 bg-[#00529B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"
          >
            <Phone size={20} />
          </a>
        </div>

      </div>
    </header>
  );
}