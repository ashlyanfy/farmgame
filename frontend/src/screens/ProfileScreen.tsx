import { useState, useRef, useCallback } from 'react';
import { s, TABBAR_HEIGHT } from '../utils/scale';
import { useProfileStore } from '../store/profileStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useOrdersStore } from '../store/ordersStore';
import { tr } from '../i18n/translations';

export default function ProfileScreen() {
  const p = useProfileStore();
  const lang = p.language;
  const inv = useInventoryStore(s=>s.items);
  const ord = useOrdersStore(s=>s.orders);

  // Локальный state для полей доставки — API вызывается только по потере фокуса (onBlur)
  const [localDelivery, setLocalDelivery] = useState(p.delivery);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeliveryChange = useCallback((field: keyof typeof localDelivery, value: string) => {
    const updated = { ...localDelivery, [field]: value };
    setLocalDelivery(updated);
    // Debounce: сохраняем через 500ms после последнего изменения
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      p.updateDelivery({ [field]: value });
    }, 500);
  }, [localDelivery, p]);

  const PN:Record<string,string>={carrot:tr(lang,'productCarrot'),apple:tr(lang,'productApple'),trout:tr(lang,'productTrout'),honey:tr(lang,'productHoney')};
  const SC:Record<string,string>={Created:'#FF9800',Confirmed:'#2196F3',Preparing:'#9C27B0',Delivering:'#00BCD4',Delivered:'#4CAF50',Cancelled:'#F44336'};
  const SL:Record<string,string>={Created:tr(lang,'statusCreated'),Confirmed:tr(lang,'statusConfirmed'),Preparing:tr(lang,'statusPreparing'),Delivering:tr(lang,'statusDelivering'),Delivered:tr(lang,'statusDelivered'),Cancelled:tr(lang,'statusCancelled')};
  const inp:React.CSSProperties = { width:'100%',padding:`${s(12)}px ${s(16)}px`,borderRadius:s(12),border:'1px solid #DDD',fontSize:s(22),fontFamily:'Nunito',color:'#333',outline:'none',boxSizing:'border-box' };
  return (
    <div style={{ width:'100%',height:'100%',background:'#F5F0EB',overflowY:'auto',paddingBottom:s(TABBAR_HEIGHT+20) }}>
      <div style={{ padding:`${s(40)}px ${s(32)}px ${s(20)}px`,background:'linear-gradient(135deg,#7E57C2,#512DA8)' }}>
        <div style={{ fontSize:s(36),fontWeight:900,color:'#FFF',fontFamily:'Nunito' }}>{p.name}</div>
        <div style={{ fontSize:s(22),color:'rgba(255,255,255,0.7)',fontFamily:'Nunito',marginTop:s(4) }}>{tr(lang,'profileCode')} {p.referralCode}</div>
      </div>
      <div style={{ padding:`0 ${s(32)}px` }}>
        <div style={{ fontSize:s(28),fontWeight:800,color:'#1F1F1F',fontFamily:'Nunito',margin:`${s(24)}px 0 ${s(12)}px` }}>{tr(lang,'profileWarehouse',{count:String(inv.length)})}</div>
        {!inv.length?<div style={{padding:s(20),background:'#FFF',borderRadius:s(16),textAlign:'center',fontSize:s(22),color:'#999',fontFamily:'Nunito'}}>{tr(lang,'profileEmpty')}</div>:
        inv.map(i=><div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:s(12),background:'#FFF',borderRadius:s(12),marginBottom:s(8)}}>
          <span style={{fontSize:s(24),fontWeight:700,color:'#333',fontFamily:'Nunito'}}>{PN[i.product]||i.product} · {(i.weight_g/1000).toFixed(1)}кг</span>
          <span style={{padding:`${s(4)}px ${s(12)}px`,borderRadius:s(8),background:i.quality>=90?'#E8F5E9':'#FFF3E0',fontSize:s(20),fontWeight:700,fontFamily:'Nunito',color:i.quality>=90?'#2E7D32':'#E65100'}}>{i.quality}%</span>
        </div>)}

        <div style={{ fontSize:s(28),fontWeight:800,color:'#1F1F1F',fontFamily:'Nunito',margin:`${s(24)}px 0 ${s(12)}px` }}>{tr(lang,'profileOrders',{count:String(ord.length)})}</div>
        {!ord.length?<div style={{padding:s(20),background:'#FFF',borderRadius:s(16),textAlign:'center',fontSize:s(22),color:'#999',fontFamily:'Nunito'}}>{tr(lang,'profileNoOrders')}</div>:
        ord.slice().reverse().map(o=><div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:s(12),background:'#FFF',borderRadius:s(12),marginBottom:s(8)}}>
          <span style={{fontSize:s(22),fontWeight:700,color:'#333',fontFamily:'Nunito'}}>{o.items.map(i=>i.product).join(', ')}</span>
          <span style={{padding:`${s(4)}px ${s(12)}px`,borderRadius:s(8),background:SC[o.status]||'#999',fontSize:s(18),fontWeight:700,fontFamily:'Nunito',color:'#FFF'}}>{SL[o.status]||o.status}</span>
        </div>)}

        <div style={{ fontSize:s(28),fontWeight:800,color:'#1F1F1F',fontFamily:'Nunito',margin:`${s(24)}px 0 ${s(12)}px` }}>{tr(lang,'profileDelivery')}</div>
        <div style={{ background:'#FFF',borderRadius:s(16),padding:s(16),display:'flex',flexDirection:'column',gap:s(12) }}>
          <input value={localDelivery.fio} onChange={e=>handleDeliveryChange('fio',e.target.value)} placeholder={tr(lang,'placeholderFio')} style={inp}/>
          <input value={localDelivery.phone} onChange={e=>handleDeliveryChange('phone',e.target.value)} placeholder={tr(lang,'placeholderPhone')} style={inp}/>
          <input value={localDelivery.city} onChange={e=>handleDeliveryChange('city',e.target.value)} placeholder={tr(lang,'placeholderCity')} style={inp}/>
          <input value={localDelivery.address} onChange={e=>handleDeliveryChange('address',e.target.value)} placeholder={tr(lang,'placeholderAddress')} style={inp}/>
        </div>
      </div>
    </div>
  );
}
