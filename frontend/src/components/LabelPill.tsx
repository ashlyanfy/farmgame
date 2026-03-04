import { s } from '../utils/scale';
interface Props { text: string; }
export default function LabelPill({ text }: Props) {
  return (
    <div style={{
      position:'absolute', left:'50%', top:s(1325),
      transform:'translateX(-50%)', zIndex:50,
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)',
      borderRadius:s(26), padding:`${s(8)}px ${s(28)}px`, height:s(50),
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <span style={{ fontSize:s(26),fontWeight:700,color:'#FFF',fontFamily:'Nunito',whiteSpace:'nowrap' }}>{text}</span>
    </div>
  );
}
