import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { s } from '../utils/scale';

export default function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'RU' | 'KZ'>('RU');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(username, password);
      else await register(username, password, language);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: '100%', padding: `${s(16)}px ${s(20)}px`, borderRadius: s(12), border: '2px solid #DDD', fontSize: s(38), fontFamily: 'Nunito', color: '#333', outline: 'none', boxSizing: 'border-box' };
  const btn: React.CSSProperties = { width: '100%', padding: `${s(18)}px`, borderRadius: s(12), border: 'none', fontSize: s(38), fontWeight: 700, fontFamily: 'Nunito', color: '#FFF', background: 'linear-gradient(135deg, #bb803d, #6c4f29)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 };

  return (
    <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/assets/backgrounds/bg_farm_apple_orchard_day.webp)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: s(32) }}>
      <div style={{ width: '100%', maxWidth: s(950), background: '#FFF', borderRadius: s(24), padding: s(40), boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <h1 style={{ fontSize: s(48), fontWeight: 900, color: '#a37f3f', fontFamily: 'Nunito', textAlign: 'center', marginBottom: s(32) }}>Моя Ферма</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: s(16) }}>
          <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} style={inp} required />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} required />
          {!isLogin && <select value={language} onChange={(e) => setLanguage(e.target.value as 'RU' | 'KZ')} style={inp}><option value="RU">Русский</option><option value="KZ">Қазақша</option></select>}
          {error && <div style={{ padding: s(12), background: '#FFEBEE', borderRadius: s(10), color: '#C62828', fontSize: s(38), fontFamily: 'Nunito' }}>{error}</div>}
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Регистрация'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ ...btn, background: 'transparent', color: '#704e2b', border: '3px solid #785333' }}>{isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт'}</button>
        </form>
      </div>
    </div>
  );
}
