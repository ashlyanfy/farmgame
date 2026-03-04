import { s, vw, getTabBarHeight } from '../utils/scale';
import { useWalletStore } from '../store/walletStore';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

interface Props { onTap: () => void; }

export default function NutrientsBadge({ onTap }: Props) {
  const nutrients = useWalletStore(st => st.nutrients);
  const lang = useProfileStore(s => s.language);
  return (
    <div onClick={onTap} style={{
      position:'absolute', left:vw(3), bottom:getTabBarHeight() + s(-20),
      width:s(200), zIndex:80, cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap:s(6),
    }}>
      <div style={{ position:'relative', width:s(280), height:s(280) }}>
        <img src="/assets/ui/ui_nutrients.webp" alt=""
          style={{ width:'100%', height:'100%', objectFit:'contain' }} />
        <span style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
          fontSize:s(80), fontWeight:900, color:'#FFF', fontFamily:'Nunito',
          textShadow:'2px 2px 4px rgba(0,0,0,0.4)',
        }}>{nutrients}</span>
      </div>
      <span style={{
        fontSize:s(35), fontWeight:900, color:'#372620', fontFamily:'Nunito',
        textAlign:'center', lineHeight:1.2,
      }}>{tr(lang,'nutrientsBadge')}</span>
    </div>
  );
}
