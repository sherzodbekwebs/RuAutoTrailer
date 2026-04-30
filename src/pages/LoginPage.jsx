import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password === 'admin777') {
      onLogin();
      navigate('/admin');
    } else {
      setError('Noto\'g\'ri parol!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-[440px]">
        <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Вход в панель</h1>
            <p className="text-gray-400 text-sm mt-3 font-medium">Для управления каталогом РуАвто ТРЕЙЛЕР</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 text-center animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Логин</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  disabled
                  value="Администратор"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 pl-14 text-gray-400 font-bold text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password"
                  required
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 pl-14 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                  placeholder="Введите пароль..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти в систему'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          © 2026 РуАвто ТРЕЙЛЕР • Secure Access
        </p>
      </div>
    </div>
  );
}
