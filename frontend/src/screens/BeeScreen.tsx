import { CARE_COST } from '../utils/constants';
import { calculateProgress } from '../utils/progress';
import { useBeeStore } from '../store/beeStore';
import { useWalletStore } from '../store/walletStore';
import { useInventoryStore } from '../store/inventoryStore';
import GameScene from '../components/GameScene';
import { getGroundY } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

export default function BeeScreen() {
  const bee = useBeeStore();
  const wallet = useWalletStore();
  const fetchInventory = useInventoryStore(s => s.fetch);
  const lang = useProfileStore(s => s.language);
  const prog = calculateProgress(bee);

  return <GameScene
    config={{ tab:'bee', bgSrc:'/assets/backgrounds/bg_bee_apiary_day.webp', groundSrc:'/assets/grounds/ground_bee_apiary_grass_patch.webp', groundX:144, groundY:getGroundY(), objectType:'bee', label:tr(lang,'labelBee'), careFX:'pollen', stageFXType:'pollen' }}
    data={{ prog, resourceAmount:wallet.resources.syrup_g, canCare:wallet.resources.syrup_g>=CARE_COST.syrup_g, nutrients:wallet.nutrients, coins:wallet.coins, careIndex:bee.careIndex, nutrientsUsed:bee.nutrientsUsed, goodnessToday:wallet.goodness.todayCount }}
    actions={{
      onReward: async () => { await wallet.claimDailyLogin(); },
      onCare: async () => { await wallet.careAction('bee'); await bee.fetch(); },
      onHarvest: async () => { await bee.harvest(); await fetchInventory(); await wallet.fetch(); },
      onNutrient: async () => { await wallet.useNutrient('bee'); await bee.fetch(); },
    }}
  />;
}
