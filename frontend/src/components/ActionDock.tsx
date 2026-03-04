import { s, vw, getTabBarHeight } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';


interface Props {
  tab: 'farm'|'fish'|'bee'; isReady: boolean; daysLeft: number; percent: number;
  canAct: boolean; onCare: () => void; onHarvest: () => void;
}
export default function ActionDock({ tab, isReady, daysLeft, percent, canAct, onCare }: Props) {
  const lang = useProfileStore(s => s.language);
  const careLabels = { farm: tr(lang,'careWater'), fish: tr(lang,'careOxygen'), bee: tr(lang,'careSyrup') };

  return (
    <div style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:90,pointerEvents:'none' }}>
      {/* Объединенный блок: прогресс + статус */}
      <div style={{
        position:'absolute', left:'50%', bottom:getTabBarHeight() + s(24),
        transform:'translateX(-50%)',
        minWidth:vw(50), maxWidth:vw(80), height:s(100), borderRadius:s(50),
        pointerEvents:'auto',
        background:'rgba(255,243,224,0.97)',
        boxShadow:`0 ${s(4)}px ${s(12)}px rgba(0,0,0,0.15)`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:`${s(12)}px ${s(20)}px`, gap:s(8),
      }}>
        <span style={{ fontSize:s(26),fontWeight:700,color:'#5D4037',fontFamily:'Nunito' }}>
          {isReady ? tr(lang,'harvestReady') : tr(lang,'progressText',{percent:String(percent),days:String(daysLeft)})}
        </span>
        {!isReady && (
          <div style={{ width:'90%',height:s(12),borderRadius:s(6),background:'rgba(0,0,0,0.12)',overflow:'hidden' }}>
            <div style={{ width:`${percent}%`,height:'100%',borderRadius:s(6),background:'#5CCB74',transition:'width 0.5s ease' }}/>
          </div>
        )}
      </div>
      <div onClick={onCare} style={{
        position:'absolute', right:vw(3), bottom:getTabBarHeight() + s(-20),
        width:s(200), cursor:canAct?'pointer':'not-allowed',
        pointerEvents:'auto', opacity:canAct?1:0.5,
        display:'flex', flexDirection:'column', alignItems:'center', gap:s(6),
      }}>
        <div style={{ width:s(280), height:s(280) }}>
          <img src="/assets/ui/ui_funnel.webp" alt=""
            style={{ width:'100%', height:'100%', objectFit:'contain' }} />
        </div>
        <span style={{
          fontSize:s(35), fontWeight:900, color:'#48322a', fontFamily:'Nunito',
          textAlign:'center', lineHeight:1.2,
        }}>{careLabels[tab]}</span>
      </div>
    </div>
  );
}
