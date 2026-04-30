import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-gray-100 flex items-center flex-shrink-0 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-12">
          <Link to="/" className="text-xl font-black tracking-tight text-brand-blue ">
            РуАвто ТРЕЙЛЕР
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <Link to="/contacts" className="hover:text-accent-blue transition-colors uppercase tracking-widest text-[11px] font-black">Контакты</Link>
          </nav>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 tracking-tight">
            <Phone size={18} className="text-accent-blue" />
            <span>+7 (800) 555-01-23</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Ежедневно с 9:00 до 21:00</p>
        </div>
      </div>
    </header>
  );
}
