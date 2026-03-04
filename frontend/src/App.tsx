import { useState, useEffect, lazy, Suspense } from 'react';
import type { TabId } from './utils/constants';
import { invalidateScale } from './utils/scale';
import { useWalletStore } from './store/walletStore';
import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/profileStore';
import { useFarmStore } from './store/farmStore';
import { useFishStore } from './store/fishStore';
import { useBeeStore } from './store/beeStore';
import { useInventoryStore } from './store/inventoryStore';
import { useOrdersStore } from './store/ordersStore';
import TabBar from './components/TabBar';
import AuthScreen from './screens/AuthScreen';

const FishScreen = lazy(() => import('./screens/FishScreen'));
const BeeScreen = lazy(() => import('./screens/BeeScreen'));
const MarketScreen = lazy(() => import('./screens/MarketScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const SingleBuyScreen = lazy(() => import('./screens/SingleBuyScreen'));
const FarmScreen = lazy(() => import('./screens/FarmScreen'));

const FALLBACK = <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }} />;

export default function App() {
  const [tab, setTab] = useState<TabId>('farm');
  const [showSingleBuy, setShowSingleBuy] = useState(false);
  const [, forceUpdate] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const fetchWallet = useWalletStore(s => s.fetch);
  const fetchProfile = useProfileStore(s => s.fetch);
  const fetchFarm = useFarmStore(s => s.fetch);
  const fetchFish = useFishStore(s => s.fetch);
  const fetchBee = useBeeStore(s => s.fetch);
  const fetchInventory = useInventoryStore(s => s.fetch);
  const fetchOrders = useOrdersStore(s => s.fetch);
  const claimDailyLogin = useWalletStore(s => s.claimDailyLogin);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([fetchWallet(), fetchProfile(), fetchFarm(), fetchFish(), fetchBee(), fetchInventory(), fetchOrders()])
        .then(async () => { await claimDailyLogin(); })
        .catch(() => { /* данные уже загружены, ошибка не критична */ })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { invalidateScale(); forceUpdate(n => n + 1); }, 120);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (tab !== 'market') setShowSingleBuy(false);
  }, [tab]);

  if (!isAuthenticated) return <AuthScreen onSuccess={() => window.location.reload()} />;
  if (loading) return FALLBACK;

  return (
    <div style={{ width:'100%', height:'100dvh', backgroundColor:'#1a1a2e', display:'flex', justifyContent:'center', alignItems:'flex-start', overflow:'hidden' }}>
      <div style={{ width:'100%', maxWidth:'540px', height:'100%', position:'relative', overflow:'hidden', backgroundColor:'#000', boxShadow:'0 0 40px rgba(0,0,0,0.5)' }}>
        <Suspense fallback={FALLBACK}>
          {<>

            {tab === 'farm' && <FarmScreen />}
            {tab === 'fish' && <FishScreen />}
            {tab === 'bee' && <BeeScreen />}
            {tab === 'market' && !showSingleBuy && <MarketScreen onGoToFarm={() => setTab('farm')} onSingleBuy={() => setShowSingleBuy(true)} />}
            {tab === 'market' && showSingleBuy && <SingleBuyScreen onBack={() => setShowSingleBuy(false)} />}
            {tab === 'profile' && <ProfileScreen />}
          </>}
        </Suspense>
        {tab !== 'market' && <TabBar activeTab={tab} onTabChange={setTab} />}
      </div>
    </div>
  );
}
