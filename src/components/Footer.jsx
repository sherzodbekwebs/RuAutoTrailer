export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 px-6 md:px-10 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
        {/* Brend va Tavsif */}
        <div>
          <h4 className="text-lg font-black text-brand-blue mb-4">РуАвто ТРЕЙЛЕР</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto md:mx-0">
            Продажа качественных полуприцепов в России. Надежная техника для вашего бизнеса.
          </p>
        </div>

        {/* Navigatsiya va Kontaktlar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 w-full md:w-auto">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Навигация</h5>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><a href="/" className="hover:text-accent-blue transition-colors">Главная</a></li>
              <li><a href="/#products" className="hover:text-accent-blue transition-colors">Продукция</a></li>
              <li><a href="/contacts" className="hover:text-accent-blue transition-colors">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Контакты</h5>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>+7 (901) 401-00-01</li>
              <li>info@ruautotrailer.ru</li>
              <li className="max-w-[200px] mx-auto md:mx-0">Владимирская область, м.-н Вязниковский, г.п. город Вязники, г.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pastki qism: Mualliflik huquqi */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-gray-400 text-center md:text-left">
        <p>© 2024 RU AUTO TRAILER. Все права защищены.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="underline hover:text-gray-600">Политика конфиденциальности</a>
          <a href="#" className="underline hover:text-gray-600">Условия использования</a>
        </div>
      </div>
    </footer>
  );
}