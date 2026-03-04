import { useState } from 'react';
import { s } from '../utils/scale';
import { useProfileStore } from '../store/profileStore';
import { translations } from '../i18n/translations';

interface Props { onDone: () => void; }

export default function OnboardingScreen({ onDone }: Props) {
  const [name, setName]   = useState('');
  const [lang, setLang]   = useState<'RU'|'KZ'>('RU');
  const tr = translations[lang];
  const updateProfile = useProfileStore(st => st.updateProfile);
  const setOnboarded  = useProfileStore(st => st.setOnboarded);

const handleStart = async () => {
  if (!name.trim()) return;
  await updateProfile({ name: name.trim(), language: lang });
  setOnboarded(true);
  onDone();
};

  const ready = name.trim().length > 0;

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', fontFamily:'Nunito, sans-serif' }}>

      {/* Фон */}
      <img
        src="/assets/backgrounds/bg_farm_carrot_day.webp" alt=""
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}
      />
      {/* Затемнение снизу чтобы текст читался */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 100%)', zIndex:1 }}/>

      {/* Весь контент */}
      <div style={{
        position:'relative', zIndex:2,
        display:'flex', flexDirection:'column', alignItems:'center',
        height:'100%', padding:`${s(100)}px ${s(64)}px 0`,
      }}>

        {/* Заголовок с пчелой */}
        <div style={{ display:'flex', alignItems:'center', gap:s(20), marginBottom:s(56) }}>
          <img src="/assets/icons/ic_tab_bee.webp" alt="" style={{ width:s(120), height:s(120), objectFit:'contain' }}/>
          <span style={{ fontSize:s(72), fontWeight:900, color:'#fff', textShadow:'0 3px 16px rgba(0,0,0,0.35)' }}>
            {tr.appTitle}
          </span>
        </div>

        {/* Переключатель языка */}
        <div style={{
          display:'flex', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(10px)',
          borderRadius:s(60), padding:s(8), marginBottom:s(44),
          border:`${s(2)}px solid rgba(255,255,255,0.5)`,
        }}>
          {(['RU','KZ'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding:`${s(18)}px ${s(72)}px`, borderRadius:s(52), border:'none', cursor:'pointer',
              background: lang === l ? '#4A90E2' : 'transparent',
              color: lang === l ? '#fff' : 'rgba(255,255,255,0.85)',
              fontSize:s(38), fontWeight:800, fontFamily:'Nunito',
              transition:'all 0.2s',
            }}>{l}</button>
          ))}
        </div>

        {/* Поле имени */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={tr.farmerName}
          maxLength={30}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          style={{
            width:'100%', padding:`${s(34)}px ${s(40)}px`, borderRadius:s(60),
            border:`${s(2)}px solid rgba(255,255,255,0.65)`,
            background:'rgba(255,255,255,0.30)', backdropFilter:'blur(10px)',
            fontSize:s(44), fontFamily:'Nunito', color:'#1a0f00',
            fontWeight:700, outline:'none', boxSizing:'border-box',
            marginBottom:s(32),
          }}
        />

        {/* Кнопка Начать */}
        <button
          onClick={handleStart}
          disabled={!ready}
          style={{
            width:'100%', padding:`${s(36)}px 0`, borderRadius:s(60), border:'none',
            background: ready
              ? 'linear-gradient(135deg, #4A90E2, #2563B0)'
              : 'rgba(200,210,220,0.45)',
            color: ready ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize:s(50), fontWeight:900, fontFamily:'Nunito',
            cursor: ready ? 'pointer' : 'not-allowed',
            boxShadow: ready ? '0 8px 28px rgba(37,99,176,0.45)' : 'none',
            transition:'all 0.3s', marginBottom:s(44),
          }}
        >
          {tr.start}
        </button>

        {/* Речевой пузырь */}
        <div style={{
          background:'rgba(255,255,255,0.88)', borderRadius:s(32),
          padding:`${s(54)}px ${s(76)}px`, textAlign:'center',
          boxShadow:'0 4px 24px rgba(0,0,0,0.12)',
          position:'relative', maxWidth:'85%',
        }}>
          <div style={{ fontSize:s(35), color:'#2b1807', lineHeight:1.55 }}>
            {tr.welcome}<br/>
            {tr.welcomeSub}
          </div>
          {/* Хвостик пузыря */}
          <div style={{
            position:'absolute', bottom:s(-30), right:s(100),
            borderLeft:`${s(22)}px solid transparent`,
            borderRight:`${s(22)}px solid transparent`,
            borderTop:`${s(22)}px solid rgba(255,255,255,0.88)`,
          }}/>
        </div>
      </div>

      {/* Девочка */}
        <img
  src="/assets/characters/char_girl_happy_basket.webp" alt=""
  className="girl-onboard"
  style={{ position:'absolute', bottom:s(50), right:-60, width:s(820), objectFit:'contain', zIndex:3 }}
/>

      {/* Подсказка для PWA */}
      <div style={{ position:'absolute', bottom:s(94), left:0, right:0, textAlign:'center', zIndex:3 }}>
        <span style={{ fontSize:s(36), color:'rgba(255,255,255,0.85)', textShadow:'0 1px 6px rgba(0,0,0,0.4)' }}>
          {tr.pwaHint}
        </span>
      </div>
    </div>
  );
}
