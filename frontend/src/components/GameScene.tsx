import { useState, useCallback } from 'react';
import { s } from '../utils/scale';
import type { ProgressResult } from '../utils/progress';
import type { AdviceResult } from '../utils/aiAdvisor';
import { generateAdvice } from '../utils/aiAdvisor';
import HUD from './HUD';
import SideActions from './SideActions';
import GrowObject from './GrowObject';
import WaterIndicator from './WaterIndicator';
import LabelPill from './LabelPill';
import HelperGirl from './HelperGirl';
import NutrientsBadge from './NutrientsBadge';
import ActionDock from './ActionDock';
import FXLayer from './FXLayer';
import BottomSheet from './BottomSheet';
import FriendsModal from './FriendsModal';
import VisitFriendModal from './VisitFriendModal';
import { useAiStore } from '../store/aiStore';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

type FXType = 'water'|'bubbles'|'pollen'|'sparkle'|'glow'|'none';

interface SceneConfig {
  tab:'farm'|'fish'|'bee'; bgSrc:string; groundSrc:string; groundX:number; groundY:number; groundAnchorOffsetY?:number;
  objectType:'carrot'|'apple'|'trout'|'bee'; label:string; careFX:FXType; stageFXType:FXType;
}
interface SceneData {
  prog:ProgressResult; resourceAmount:number; canCare:boolean; nutrients:number; coins:number;
  careIndex:number; nutrientsUsed:number; goodnessToday:number;
}
interface SceneActions {
  onReward?:()=>void;
  onCare:()=>void; onHarvest:()=>void; onNutrient:()=>void;
  onCultureSwitch?:()=>void; activeCulture?:'carrot'|'apple';
}
interface Props { config:SceneConfig; data:SceneData; actions:SceneActions; }

export default function GameScene({ config, data, actions }: Props) {
  const { tab,bgSrc,groundSrc,groundX,groundY,groundAnchorOffsetY=0,objectType,label,careFX,stageFXType } = config;
  const { prog,resourceAmount,canCare,nutrients,coins,careIndex,nutrientsUsed,goodnessToday } = data;
  const { canShowAdvice, markAdviceShown } = useAiStore();
  const lang = useProfileStore(s => s.language);
  const [triggerFX, setTriggerFX] = useState<FXType>('none');
  const [showAdvice, setShowAdvice] = useState(false);
  const [showNutrients, setShowNutrients] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [showNoRes, setShowNoRes] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [visitFriendName, setVisitFriendName] = useState('');
  const [advice, setAdvice] = useState<AdviceResult|null>(null);

  const handleCare = useCallback(() => {
    if (!canCare) { setShowNoRes(true); return; }
    actions.onCare(); setTriggerFX(careFX);
  }, [canCare, actions, careFX]);

  const handleHarvest = useCallback(() => { actions.onHarvest(); setShowHarvest(true); }, [actions]);

  const handleNutrient = useCallback(() => {
    if (nutrients < 1) return; setShowNutrients(true);
  }, [nutrients]);

  const applyNutrient = () => { actions.onNutrient(); setShowNutrients(false); setTriggerFX('glow'); };

  const handleGirl = useCallback(() => {
    if (!canShowAdvice()) return;
    setAdvice(generateAdvice({ tab,percent:prog.percent,daysLeft:prog.daysLeft,careIndex,nutrientsUsed,resourceAmount,nutrients,coins,goodnessToday,lang }));
    setShowAdvice(true);
    markAdviceShown();
  }, [tab,prog,careIndex,nutrientsUsed,resourceAmount,nutrients,coins,goodnessToday,lang, canShowAdvice, markAdviceShown]);

  const stageFX: FXType = prog.showFX ? stageFXType : 'none';

  const btnStyle = (bg:string): React.CSSProperties => ({
    padding:`${s(14)}px ${s(32)}px`,borderRadius:s(24),border:'none',cursor:'pointer',
    fontSize:s(24),fontWeight:800,fontFamily:'Nunito',color:'#FFF',background:bg,
  });

  return (
    <div style={{ width:'100%',height:'100%',position:'relative',overflow:'hidden' }}>
      {/* L0 Background */}
      <img src={bgSrc} alt="" style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0 }}/>
      {/* L1 Ground 768×384 */}
      <img src={groundSrc} alt="" style={{ position:'absolute',left:s(groundX),top:groundY,width:s(768),height:s(384),objectFit:'contain',zIndex:10 }}/>
      {/* L2 Object */}
      <GrowObject type={objectType} artAsset={prog.artAsset} soilAnchorX={s(groundX + 384)} soilAnchorY={groundY + s(384) + s(groundAnchorOffsetY)} />
      {/* L2b Girl */}
      <HelperGirl onTap={handleGirl}/>
      {/* L3 FX */}
      <FXLayer stageFX={stageFX} triggerFX={triggerFX} onTriggerDone={()=>setTriggerFX('none')}/>
      {/* L4 Resource */}
      <WaterIndicator amount={resourceAmount} tab={tab}/>
      {/* L5 Label */}
      <LabelPill text={label}/>
      {/* L6 HUD */}
      <HUD/>
      {/* L7 Sides */}
      {tab==='farm'
      ?<SideActions activeCulture={actions.activeCulture} onCultureSwitch={actions.onCultureSwitch} onReward={actions.onReward} onFriends={() => setShowFriends(true)}/>
      :<SideActions onFriends={() => setShowFriends(true)}/>}
      {/* L8 Nutrients */}
      <NutrientsBadge onTap={handleNutrient}/>
      {/* L9 Actions */}
      <ActionDock tab={tab} isReady={prog.isReady} daysLeft={prog.daysLeft} percent={prog.percent} canAct={canCare} onCare={handleCare} onHarvest={handleHarvest}/>

      {/* Bottom sheets */}
      <BottomSheet visible={showAdvice} onClose={()=>setShowAdvice(false)} title={tr(lang,'adviceTitle')}>
        {advice&&<div style={{display:'flex',flexDirection:'column',gap:s(16)}}>
          <div style={{background:'#F0F7FF',borderRadius:s(16),padding:s(16)}}>
            <p style={{fontSize:s(26),fontWeight:700,color:'#1F1F1F',fontFamily:'Nunito',margin:0,lineHeight:1.4}}>{advice.mainTip}</p>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:s(8)}}>
            {advice.quickTips.map((t,i)=><div key={i} style={{background:'#E8F5E9',borderRadius:s(16),padding:`${s(8)}px ${s(14)}px`}}>
              <span style={{fontSize:s(20),fontWeight:600,color:'#2E7D32',fontFamily:'Nunito'}}>{t}</span></div>)}
          </div>
          <div>
            <p style={{fontSize:s(24),fontWeight:800,color:'#1F1F1F',fontFamily:'Nunito',marginBottom:s(8)}}>{tr(lang,'advicePlan')}</p>
            {advice.dailyPlan.map((d,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:s(8),padding:`${s(4)}px 0`}}>
              <div style={{width:s(26),height:s(26),borderRadius:s(13),background:'#43A047',color:'#FFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:s(14),fontWeight:800,flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:s(22),color:'#333',fontFamily:'Nunito'}}>{d}</span></div>)}
          </div>
        </div>}
      </BottomSheet>

      <BottomSheet visible={showNutrients} onClose={()=>setShowNutrients(false)} title={tr(lang,'nutrientsTitle')}>
        <div style={{textAlign:'center',padding:`${s(16)}px 0`}}>
          <p style={{fontSize:s(26),color:'#333',fontFamily:'Nunito',marginBottom:s(20)}}>{tr(lang,'nutrientsConfirm')}</p>
          <div style={{display:'flex',gap:s(16),justifyContent:'center'}}>
            <button onClick={()=>setShowNutrients(false)} style={{...btnStyle('transparent'),border:'2px solid #CCC',color:'#666'}}>{tr(lang,'cancel')}</button>
            <button onClick={applyNutrient} style={btnStyle('linear-gradient(135deg,#FF9800,#E65100)')}>{tr(lang,'apply')}</button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet visible={showNoRes} onClose={()=>setShowNoRes(false)} title={tr(lang,'noResTitle')}>
        <div style={{textAlign:'center',padding:`${s(16)}px 0`}}>
          <p style={{fontSize:s(26),color:'#333',fontFamily:'Nunito',marginBottom:s(20)}}>{tr(lang,'noResText',{amount:String(resourceAmount)})}</p>
          <button onClick={()=>setShowNoRes(false)} style={btnStyle('linear-gradient(135deg,#66BB6A,#43A047)')}>{tr(lang,'getDayBonus')}</button>
        </div>
      </BottomSheet>

      <BottomSheet visible={showHarvest} onClose={()=>setShowHarvest(false)} title={tr(lang,'harvestDoneTitle')}>
        <div style={{textAlign:'center',padding:`${s(16)}px 0`}}>
          <img src="/assets/market/ill_harvest_box.png" alt="" loading="lazy" style={{width:s(280),height:s(280),objectFit:'contain',marginBottom:s(16)}}/>
          <p style={{fontSize:s(26),color:'#333',fontFamily:'Nunito',marginBottom:s(20)}}>{tr(lang,'harvestDoneText')}</p>
          <button onClick={()=>setShowHarvest(false)} style={btnStyle('linear-gradient(135deg,#FFD54F,#FFB300)')}>{tr(lang,'enterAddress')}</button>
        </div>
      </BottomSheet>
      <FriendsModal 
      visible={showFriends} 
      onClose={() => setShowFriends(false)}
      onVisit={(name) => {setShowFriends(false); setVisitFriendName(name); setShowVisit(true);}}
       />

       <VisitFriendModal
      visible={showVisit}
  friendName={visitFriendName}
  onClose={() => setShowVisit(false)}
  onBack={() => { setShowVisit(false); setShowFriends(true); }}
/>

    </div>
  );
}
