import { useEffect, useState } from 'react';
import { s } from '../utils/scale';
type FXType = 'water'|'bubbles'|'pollen'|'sparkle'|'glow'|'none';
interface Props { stageFX:FXType; triggerFX:FXType; onTriggerDone?:()=>void; soilAnchorX?:number; soilAnchorY?:number; }
const ASSETS:Record<string,string>={water:'/assets/fx/fx_water_drops.webp',bubbles:'/assets/fx/fx_bubbles.webp',pollen:'/assets/fx/fx_pollen.webp',sparkle:'/assets/fx/fx_sparkle.webp',glow:'/assets/fx/fx_glow_ring.webp'};
export default function FXLayer({ stageFX, triggerFX, onTriggerDone, soilAnchorX=540, soilAnchorY=1550 }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => { if(triggerFX!=='none'){setShow(true);const t=setTimeout(()=>{setShow(false);onTriggerDone?.()},800);return()=>clearTimeout(t)} }, [triggerFX]);
  const sz=300, cx=soilAnchorX-sz/2, cy=soilAnchorY-sz-80;
  const base=(op:number):React.CSSProperties=>({position:'absolute',left:s(cx),top:s(cy),width:s(sz),height:s(sz),objectFit:'contain',zIndex:30,opacity:op,pointerEvents:'none',transition:'opacity 0.5s ease'});
  return <>
    {stageFX!=='none'&&ASSETS[stageFX]&&<img src={ASSETS[stageFX]} alt="" style={{...base(0.6),animation:'fxP 2s ease-in-out infinite'}}/>}
    {show&&triggerFX!=='none'&&ASSETS[triggerFX]&&<img src={ASSETS[triggerFX]} alt="" style={{...base(1),animation:'fxB 0.8s ease-out forwards'}}/>}
  </>;
}
