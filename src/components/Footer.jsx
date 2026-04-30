export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 px-6 md:px-10 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h4 className="text-lg font-black text-brand-blue mb-4 ">РуАвто ТРЕЙЛЕР</h4>
          <p className="text-sm text-gray-500 max-w-sm">
            Продажа качественных полуприцепов в России. Надежная техника для вашего бизнеса.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:gap-16">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Навигация</h5>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><a href="/" className="hover:text-accent-blue">Главная</a></li>
              <li><a href="/#products" className="hover:text-accent-blue">Продукция</a></li>
              <li><a href="/contacts" className="hover:text-accent-blue">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Контакты</h5>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>+7 (800) 555-01-23</li>
              <li>info@ruautotrailer.ru</li>
              <li>Москва, ул. Автомобильная, д. 12</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
        <p>© 2024 RU AUTO TRAILER. Все права защищены.</p>
        <div className="flex gap-4">
          <a href="#" className="underline">Политика конфиденциальности</a>
          <a href="#" className="underline">Условия использования</a>
        </div>
      </div>
    </footer>
  );
}
