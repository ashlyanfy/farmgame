import { CARE_COST } from '../utils/constants';
import { calculateProgress } from '../utils/progress';
import { useFarmStore } from '../store/farmStore';
import { useWalletStore } from '../store/walletStore';
import { useInventoryStore } from '../store/inventoryStore';
import GameScene from '../components/GameScene';
import { getGroundY } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

export default function FarmScreen() {
  const farm = useFarmStore();
  const wallet = useWalletStore();
  const fetchInventory = useInventoryStore(s => s.fetch);
  const lang = useProfileStore(s => s.language);
  
  const CFG = {
    carrot: { bg:'/assets/backgrounds/bg_farm_carrot_day.webp', ground:'/assets/grounds/ground_farm_soil_patch.webp', gx:144, label:tr(lang,'labelCarrot'), anchorOffsetY:0 },
    apple: { bg:'/assets/backgrounds/bg_farm_apple_orchard_day.webp', ground:'/assets/grounds/ground_orchard_soil_patch.webp', gx:151, label:tr(lang,'labelApple'), anchorOffsetY:820 },
  };
  
  const c = farm.cultures[farm.activeCulture];
  const cfg = CFG[farm.activeCulture];
  const prog = calculateProgress(c);

  return <GameScene
    key={farm.activeCulture}
    config={{ tab:'farm', bgSrc:cfg.bg, groundSrc:cfg.ground, groundX:cfg.gx, groundY:getGroundY(), groundAnchorOffsetY:cfg.anchorOffsetY || 0, objectType:farm.activeCulture, label:cfg.label, careFX:'water', stageFXType:'water' }}
    data={{ prog, resourceAmount:wallet.resources.water_g, canCare:wallet.resources.water_g>=CARE_COST.water_g, nutrients:wallet.nutrients, coins:wallet.coins, careIndex:c.careIndex, nutrientsUsed:c.nutrientsUsed, goodnessToday:wallet.goodness.todayCount }}
    actions={{
      onReward: async () => { await wallet.claimDailyLogin(); },
      onCare: async () => { await wallet.careAction('farm'); await farm.fetch(); },
      onHarvest: async () => { await farm.harvest(); await fetchInventory(); await wallet.fetch(); },
      onNutrient: async () => { await wallet.useNutrient('farm'); await farm.fetch(); },
      onCultureSwitch: farm.switchCulture,
      activeCulture: farm.activeCulture,
    }}
  />;
}

