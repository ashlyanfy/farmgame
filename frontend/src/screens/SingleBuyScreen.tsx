import { useState } from 'react';
import { s } from '../utils/scale';
import { useOrdersStore } from '../store/ordersStore';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

interface Props { onBack: () => void; }

export default function SingleBuyScreen({ onBack }: Props) {
  const lang = useProfileStore(s => s.language);
  const [selected, setSelected] = useState<string | null>(null);
  const [bought, setBought] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const createOrder = useOrdersStore(st => st.create);

  const BOXES = [
    { id:'carrot', name:tr(lang,'boxCarrotName'), weight:'3 кг', price:1200, photo:'/assets/photos/photo_product_carrot_1kg.webp', emoji:'🥕', desc:tr(lang,'boxCarrotDesc') },
    { id:'apples', name:tr(lang,'boxAppleName'), weight:'3 кг', price:1400, photo:'/assets/photos/photo_product_apples_1kg.webp', emoji:'🍎', desc:tr(lang,'boxAppleDesc') },
    { id:'honey',  name:tr(lang,'boxHoneyName'),    weight:'1 кг', price:3200, photo:'/assets/photos/photo_product_honey_0_5kg.webp', emoji:'🍯', desc:tr(lang,'boxHoneyDesc') },
    { id:'trout',  name:tr(lang,'boxTroutName'), weight:'1 кг', price:2800, photo:'/assets/photos/photo_product_trout_1kg.webp', emoji:'🐟', desc:tr(lang,'boxTroutDesc') },
  ];

  const STEPS = [
    { icon:'🌱', title:tr(lang,'stepCareTitle'), desc:tr(lang,'stepCareDesc') },
    { icon:'🌾', title:tr(lang,'stepHarvestTitle'), desc:tr(lang,'stepHarvestDesc') },
    { icon:'📦', title:tr(lang,'stepDeliverTitle'), desc:tr(lang,'stepDeliverDesc') },
  ];
  
const handleBuy = async (id: string) => {
  if (loading) return; // защита от двойного клика
  const box = BOXES.find(b => b.id === id);
  if (!box) return;
  setLoading(true);
  try {
    await createOrder([{ product: box.id, weight_g: 1000 }]);
    setBought(id);
    setTimeout(() => setBought(null), 2000);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ width:'100%', height:'100%', background:'#F2F5F0', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:'Nunito, sans-serif' }}>

      {/* Шапка */}
      <div style={{ position:'relative', width:'100%', height:s(180), flexShrink:0 }}>
        <img src="/assets/ui/ui_green_picture.webp" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:s(10) }}>
          <span style={{ fontSize:s(40), fontWeight:900, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,0.25)', lineHeight:1.1 }}>{tr(lang,'buyTitle')}</span>
          <span style={{ fontSize:s(30), fontWeight:700, color:'rgba(255,255,255,0.9)', marginTop:s(4) }}>{tr(lang,'buySubtitle')}</span>
        </div>
        <button onClick={onBack} aria-label="Назад" style={{
          position:'absolute', top:s(46), left:s(56), width:s(82), height:s(82), borderRadius:s(18),
          background:'rgba(255,255,255,0.25)', backdropFilter:'blur(8px)',
          border:'2px solid rgba(255,255,255,0.5)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:s(36),
        }}>←</button>
      </div>

      {/* Скролл */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>

        {/* Фото фермера */}
        <div style={{ margin:`${s(20)}px ${s(24)}px 0`, borderRadius:s(24), overflow:'hidden', position:'relative', height:s(420), boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>
          <img src="/assets/photos/farmer_smiling.webp" alt="Фермер" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding:`${s(40)}px ${s(24)}px ${s(20)}px` }}>
            <span style={{ fontSize:s(36), fontWeight:900, color:'#fff', lineHeight:1.2 }}>{tr(lang,'buyFarmerCaption')}</span>
          </div>
        </div>

        {/* Как это работает */}
        <div style={{ padding:`${s(24)}px ${s(24)}px 0` }}>
          <span style={{ fontSize:s(38), fontWeight:900, color:'#1F1F1F' }}>{tr(lang,'howItWorks')}</span>
          <div style={{ display:'flex', flexDirection:'column', gap:s(12), marginTop:s(16) }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:s(16), background:'#fff', borderRadius:s(20), padding:s(20), boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ width:s(80), height:s(80), borderRadius:s(20), background:'#E8F5E9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:s(40), flexShrink:0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize:s(34), fontWeight:800, color:'#1F1F1F' }}>{step.title}</div>
                  <div style={{ fontSize:s(28), color:'#888', marginTop:s(4) }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Выбор коробки */}
        <div style={{ padding:`${s(24)}px ${s(24)}px 0` }}>
          <span style={{ fontSize:s(38), fontWeight:900, color:'#1F1F1F' }}>{tr(lang,'chooseBox')}</span>
          <div style={{ display:'flex', flexDirection:'column', gap:s(12), marginTop:s(16) }}>
            {BOXES.map((box, index) => {
              const isSel = selected === box.id;
              return (
                <div key={box.id} onClick={() => setSelected(box.id)} style={{
                  background:'#fff', borderRadius:s(24), overflow:'hidden', cursor:'pointer', transition:'box-shadow 0.2s',
                  boxShadow: isSel ? `0 0 0 ${s(3)}px #4CAF50, 0 2px 12px rgba(0,0,0,0.08)` : '0 2px 12px rgba(0,0,0,0.08)',
                  opacity: bought === box.id ? 0.7 : 1,
                }}>
                  <div style={{ display:'flex', gap:s(16), padding:s(16), alignItems:'center' }}>
                    <img src={box.photo} alt={box.name} loading={index < 2 ? 'eager' : 'lazy'} style={{ width:s(180), height:s(180), borderRadius:s(16), objectFit:'cover', flexShrink:0 }} />
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:s(8) }}>
                      <div style={{ display:'flex', alignItems:'center', gap:s(10) }}>
                        <span style={{ fontSize:s(36) }}>{box.emoji}</span>
                        <span style={{ fontSize:s(38), fontWeight:900, color:'#1F1F1F' }}>{box.name}</span>
                      </div>
                      <span style={{ fontSize:s(28), color:'#888' }}>{box.desc}</span>
                      <span style={{ fontSize:s(28), color:'#555' }}>📦 {box.weight}</span>
                      <span style={{ fontSize:s(42), fontWeight:900, color:'#2E7D32' }}>{box.price}₸</span>
                    </div>
                    <div style={{ width:s(48), height:s(48), borderRadius:'50%', flexShrink:0, background: isSel ? '#4CAF50' : '#fff', border: isSel ? 'none' : `${s(3)}px solid #E0E0E0`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {isSel && <span style={{ color:'#fff', fontSize:s(28), fontWeight:900 }}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Кнопка купить */}
        <div style={{ padding:`${s(24)}px ${s(24)}px ${s(48)}px` }}>
          <button onClick={() => selected && !loading && handleBuy(selected)} disabled={!selected || loading} style={{
            width:'100%', padding:`${s(36)}px 0`, borderRadius:s(32), border:'none',
            cursor: selected && !loading ? 'pointer' : 'not-allowed',
            background: !selected || loading ? '#E0E0E0' : bought ? 'linear-gradient(135deg,#66BB6A,#43A047)' : 'linear-gradient(135deg,#FF8C42,#FF6F00)',
            color: !selected || loading ? '#aaa' : '#fff',
            fontSize:s(42), fontWeight:900, fontFamily:'Nunito',
            boxShadow: selected && !bought && !loading ? '0 4px 20px rgba(255,111,0,0.35)' : 'none',
            transition:'all 0.3s',
          }}>
            {loading ? '...' : !selected ? tr(lang,'chooseBox') : bought ? tr(lang,'orderPlaced') : tr(lang,'buyFor',{price:String(BOXES.find(b => b.id === selected)?.price)})}
          </button>
        </div>

      </div>
    </div>
  );
}

