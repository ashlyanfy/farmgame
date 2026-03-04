import type { TranslationKey } from '../i18n/translations';
export function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const CYCLE_DAYS = { carrot: 75, apple: 180, trout: 120, bee: 30 } as const;
export const CARE_COST = { water_g: 125, oxygen_g: 125, syrup_g: 125 } as const;
export const CARE_BOOST = { step: 0.01, max: 0.15 } as const;
export const NUTRIENTS_BOOST = { step: 0.03, max: 0.18 } as const;
export const GOODNESS = { dailyLogin: 10, careAction: 1, careActionLimit: 20, collect: 15, qualityBonus: 5, qualityThreshold: 90 } as const;
export const HARVEST_WEIGHT = { carrot: 10_000, apple: 12_000, trout: 8_000, honey: 6_000 } as const;
export const INITIAL_RESOURCES = { coins: 500, water_g: 1000, oxygen_g: 1000, syrup_g: 1000, nutrients: 5 } as const;
export type TabId = 'farm' | 'fish' | 'bee' | 'market' | 'profile';
export const TABS: { id: TabId; labelKey: TranslationKey; icon: string }[] = [
{ id: 'farm',  labelKey: 'tabFarm',    icon: '/assets/ui/ic_tab_farm_ref.webp'    },
{ id: 'fish',    labelKey: 'tabFish',    icon: '/assets/ui/ic_tab_fish_ref.webp'    },
{ id: 'bee',     labelKey: 'tabBee',     icon: '/assets/ui/ic_tab_bee_ref.webp'     },
{ id: 'market',  labelKey: 'tabMarket',  icon: '/assets/ui/ic_tab_market_ref.webp'  },
{ id: 'profile', labelKey: 'tabProfile', icon: '/assets/ui/ic_tab_profile_ref.webp' },
];
