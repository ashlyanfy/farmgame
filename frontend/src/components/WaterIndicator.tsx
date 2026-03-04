import { s } from '../utils/scale';
import { fmt } from '../utils/constants';

interface Props { amount: number; tab: 'farm'|'fish'|'bee'; }

export default function WaterIndicator({ amount }: Props) {
  const display = fmt(amount) + ' г';
  return (
    <div style={{
      position:'absolute', left:'50%', top:s(230), transform:'translateX(-50%)',
      width:'auto', height:s(200),
      zIndex:40, display:'flex', alignItems:'center',
    }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <img src="/assets/ui/ui_water_bottle_round.webp" alt=""
          style={{ width:s(200),height:s(160),objectFit:'contain' }} />
      </div>
      <span style={{
        fontSize:s(48),fontWeight:900,color:'#271717',fontFamily:'Nunito',
        textShadow:`${s(2)}px ${s(2)}px ${s(4)}px rgba(0,0,0,0.3)`,whiteSpace:'nowrap',
      }}>{display}</span>
    </div>
  );
}
