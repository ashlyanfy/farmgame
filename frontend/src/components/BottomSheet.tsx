import { s } from '../utils/scale';
interface Props { visible:boolean; onClose:()=>void; title:string; children:React.ReactNode; }
export default function BottomSheet({ visible, onClose, title, children }: Props) {
  if (!visible) return null;
  return (
    <div style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:200,display:'flex',flexDirection:'column',justifyContent:'flex-end' }}>
      <div onClick={onClose} style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.5)' }}/>
      <div style={{
        position:'relative',zIndex:201,background:'#FFF',borderRadius:`${s(32)}px ${s(32)}px 0 0`,
        padding:`${s(24)}px ${s(32)}px ${s(40)}px`,maxHeight:'70%',overflowY:'auto',
        boxShadow:`0 ${s(-4)}px ${s(20)}px rgba(0,0,0,0.15)`,animation:'slideUp 0.3s ease',
      }}>
        <div style={{ width:s(60),height:s(6),borderRadius:s(3),background:'#DDD',margin:`0 auto ${s(16)}px` }}/>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:s(20) }}>
          <span style={{ fontSize:s(32),fontWeight:800,color:'#1F1F1F',fontFamily:'Nunito' }}>{title}</span>
          <div onClick={onClose} style={{ width:s(48),height:s(48),borderRadius:s(24),background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
            <span style={{ fontSize:s(28),color:'#999' }}>✕</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
