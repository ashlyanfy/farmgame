import { useState, useRef } from 'react';
import { s, vw } from '../utils/scale';
import { useWalletStore } from '../store/walletStore';
import { fmt } from '../utils/constants';
import BottomSheet from './BottomSheet';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

export default function HUD() {
  const coins = useWalletStore(s => s.coins);
  const goodness = useWalletStore(s => s.goodness);
  const lang = useProfileStore(s => s.language);
  const [showGoodness, setShowGoodness] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (soundOn) { audioRef.current.pause(); }
    else { audioRef.current.volume = 0.5; audioRef.current.play().catch(() => {}); }
    setSoundOn(!soundOn);
  };

  const cap = (left: number, w: number): React.CSSProperties => ({
    position:'absolute', left:vw(left/10.8), top:s(24),
    width:vw(w/11), height:s(144), borderRadius:s(52),
    background:'rgba(227,215,155,0.92)',
    display:'flex', alignItems:'center', padding:`0 ${s(22)}px`, gap:s(12),
  });

  const pct = Math.round((goodness.value / goodness.goal) * 100);

  return (
    <>
      <div style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:60,pointerEvents:'none' }}>
        <audio ref={audioRef} loop preload="none">
          <source src="/farm-music.mp3" type="audio/mpeg" />
        </audio>

        {/* Монеты */}
        <div style={{ ...cap(32,340), pointerEvents:'auto' }}>
          <img src="/assets/icons/ic_coin.webp" alt="" style={{ width:s(200),height:s(200),objectFit:'contain',marginLeft:s(-70) }}/>
          <div>
            <div style={{ fontSize:s(42),fontWeight:900,color:'#2b1807',fontFamily:'Nunito',lineHeight:1 }}>{fmt(coins)}</div>
            <div style={{ fontSize:s(35),fontWeight:800,color:'rgba(81,42,12,0.7)',fontFamily:'Nunito' }}>{tr(lang,'coins')}</div>
          </div>
        </div>

        {/* Поток Добра */}
        <div onClick={() => setShowGoodness(true)} style={{ ...cap(370,370), pointerEvents:'auto', cursor:'pointer' }}>
          <img src="/assets/icons/ic_goodness.webp" alt="" style={{ width:s(150),height:s(150),objectFit:'contain' }}/>
          <div>
            <div style={{ fontSize:s(42),fontWeight:900,color:'#2b1807',fontFamily:'Nunito',lineHeight:1 }}>{goodness.value}/{goodness.goal}</div>
            <div style={{ fontSize:s(35),fontWeight:800,color:'rgba(81,42,12,0.7)',fontFamily:'Nunito' }}>{tr(lang,'goodness')}</div>
          </div>
        </div>

        {/* Звук */}
        <div onClick={toggleSound} style={{
          position:'absolute',right:vw(3),top:s(24),width:s(144),height:s(144),borderRadius:s(72),
          background:'rgba(227,215,155,0.92)',display:'flex',alignItems:'center',justifyContent:'center',
          cursor:'pointer',pointerEvents:'auto',
        }}>
          <img
            src={soundOn ? '/assets/icons/ic_sound_on.webp' : '/assets/icons/ic_sound_off.webp'}
            alt="" style={{ width:s(200),height:s(200),objectFit:'contain',marginTop:s(40),marginLeft:soundOn?0:s(60) }}
          />
        </div>
      </div>

      {/* Шторка Поток Добра — снаружи pointerEvents:none */}
      <BottomSheet visible={showGoodness} onClose={() => setShowGoodness(false)} title={tr(lang,'goodnessTitle')}>
        <div style={{ display:'flex',flexDirection:'column',gap:s(16) }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:s(48),fontWeight:900,color:'#E65100',fontFamily:'Nunito' }}>{tr(lang,'goodnessLevel',{level:String(goodness.level)})}</div>
            <div style={{ fontSize:s(28),color:'#555',fontFamily:'Nunito',marginTop:s(4) }}>{goodness.value} / {goodness.goal}</div>
          </div>
          <div style={{ background:'#EEE',borderRadius:s(12),height:s(24),overflow:'hidden' }}>
            <div style={{ width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#FF9800,#E65100)',borderRadius:s(12),transition:'width 0.4s' }}/>
          </div>
          <div style={{ fontSize:s(26),color:'#333',fontFamily:'Nunito',lineHeight:1.5 }}>
            {tr(lang,'goodnessRow1')}<br/>
            {tr(lang,'goodnessRow2')}<br/>
            {tr(lang,'goodnessRow3')}<br/>
            {tr(lang,'goodnessRow4')}
          </div>
          <div style={{ fontSize:s(24),color:'#888',fontFamily:'Nunito' }}>
            {tr(lang,'goodnessToday',{count:String(goodness.todayCount)})}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
