import { CARE_COST } from '../utils/constants';
import { calculateProgress } from '../utils/progress';
import { useFishStore } from '../store/fishStore';
import { useWalletStore } from '../store/walletStore';
import { useInventoryStore } from '../store/inventoryStore';
import GameScene from '../components/GameScene';
import { getGroundY } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

export default function FishScreen() {
  const fish = useFishStore();
  const wallet = useWalletStore();
  const fetchInventory = useInventoryStore(s => s.fetch);
  const lang = useProfileStore(s => s.language);
  const prog = calculateProgress(fish);

  return <GameScene
    config={{ tab:'fish', bgSrc:'/assets/backgrounds/bg_fish_nature_pond_day.webp', groundSrc:'/assets/grounds/ground_fish_pond_shore_patch.webp', groundX:144, groundY:getGroundY(), objectType:'trout', label:tr(lang,'labelTrout'), careFX:'bubbles', stageFXType:'bubbles' }}
    data={{ prog, resourceAmount:wallet.resources.oxygen_g, canCare:wallet.resources.oxygen_g>=CARE_COST.oxygen_g, nutrients:wallet.nutrients, coins:wallet.coins, careIndex:fish.careIndex, nutrientsUsed:fish.nutrientsUsed, goodnessToday:wallet.goodness.todayCount }}
    actions={{
      onReward: async () => { await wallet.claimDailyLogin(); },
      onCare: async () => { await wallet.careAction('fish'); await fish.fetch(); },
      onHarvest: async () => { await fish.harvest(); await fetchInventory(); await wallet.fetch(); },
      onNutrient: async () => { await wallet.useNutrient('fish'); await fish.fetch(); },
    }}
  />;
}
