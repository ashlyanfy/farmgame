import { s } from '../utils/scale';

const CFG = {
  carrot: { assets:['/assets/objects/obj_carrot_s1.webp','/assets/objects/obj_carrot_s2.webp','/assets/objects/obj_carrot_s3.webp'], w:620, h:620 },
  apple:  { assets:['/assets/objects/obj_appletree_s1.webp','/assets/objects/obj_appletree_s2.webp','/assets/objects/obj_appletree_s2.webp'], w:2400, h:2400 },
  trout:  { assets:['/assets/objects/obj_trout_inpond_s1.webp','/assets/objects/obj_trout_inpond_s2.webp','/assets/objects/obj_trout_inpond_s3.webp'], w:720, h:720 },
  bee:    { assets:['/assets/objects/obj_bee_s1.webp','/assets/objects/obj_bee_s2.webp','/assets/objects/obj_bee_s3.webp'], w:620, h:620 },
};

interface Props { type:'carrot'|'apple'|'trout'|'bee'; artAsset:1|2|3; soilAnchorX?:number; soilAnchorY?:number; }

export default function GrowObject({ type, artAsset, soilAnchorX=540, soilAnchorY=1500 }: Props) {
  const c = CFG[type];
  const assetIdx = Math.min(artAsset - 1, c.assets.length - 1);
  return <img src={c.assets[assetIdx]} alt={type} style={{
    position:'absolute',
    left: soilAnchorX, top: soilAnchorY,
    width: s(c.w), height: s(c.h), objectFit: 'contain', zIndex: 20,
    transform: 'translate(-50%,-100%)', transition: 'transform 0.5s ease',
  }} />;
}
