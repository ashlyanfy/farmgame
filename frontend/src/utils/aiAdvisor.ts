import { tr, type Lang } from '../i18n/translations';

export interface AdviceInput { tab:'farm'|'fish'|'bee'; percent:number; daysLeft:number; careIndex:number; nutrientsUsed:number; resourceAmount:number; nutrients:number; coins:number; goodnessToday:number; lang:Lang; }
export interface AdviceResult { mainTip:string; quickTips:string[]; dailyPlan:string[]; }

export function generateAdvice(i:AdviceInput):AdviceResult {
  const{tab,percent,daysLeft,careIndex,nutrientsUsed,resourceAmount,nutrients,goodnessToday,lang}=i;
  const RES:Record<string,string>={farm:tr(lang,'resWater'),fish:tr(lang,'resOxygen'),bee:tr(lang,'resSyrup')};
  let mainTip='';
  if(percent>=100)mainTip=tr(lang,'aiHarvestReady');
  else if(resourceAmount<125)mainTip=tr(lang,'aiLowRes',{res:RES[tab]});
  else if(nutrients>0&&nutrientsUsed<6)mainTip=tr(lang,'aiHasNutrients',{count:String(nutrients)});
  else if(daysLeft<=5)mainTip=tr(lang,'aiAlmostDone',{days:String(daysLeft)});
  else mainTip=tr(lang,'aiProgress',{percent:String(percent)});
  const q:string[]=[
    careIndex<15?tr(lang,'aiCareMore',{count:String(15-careIndex)}):tr(lang,'aiCareMax'),
    nutrients>0&&nutrientsUsed<6?tr(lang,'aiNutrientTip'):tr(lang,'aiNutrientMax'),
    resourceAmount>=125?tr(lang,'aiResOk',{count:String(Math.floor(resourceAmount/125))}):tr(lang,'aiResLow',{res:RES[tab]})
  ];
  const d:string[]=[];
  if(Math.floor(resourceAmount/125)>0)d.push(tr(lang,'aiPlanWater',{count:String(Math.min(Math.floor(resourceAmount/125),5))}));
  if(nutrients>0&&nutrientsUsed<6)d.push(tr(lang,'aiPlanNutrient'));
  if(goodnessToday<20)d.push(tr(lang,'aiPlanGoodness',{count:String(20-goodnessToday)}));
  if(!d.length)d.push(tr(lang,'aiPlanVisit'));
  return{mainTip,quickTips:q,dailyPlan:d};
}
