import { s, vw } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

interface Props { onCultureSwitch?: () => void; activeCulture?: 'carrot' | 'apple'; onReward?: () => void; onFriends?: () => void}

function circleStyle(size: number): React.CSSProperties {
  return {
    width: s(size), height: s(size), borderRadius: s(size / 2),
    background: 'rgb(248, 241, 207)',
    boxShadow: `0 ${s(3)}px ${s(10)}px rgba(245, 198, 112, 0.13)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  };
}

const labelStyle: React.CSSProperties = {
  fontSize: s(30), fontWeight: 900, color: '#1f1513',
  fontFamily: 'Nunito', textAlign: 'center',
  textShadow: '0 1px 3px rgba(238, 179, 90, 0.9)',
  lineHeight: 1.1, maxWidth: s(140),
};

export default function SideActions({ onCultureSwitch, activeCulture, onReward, onFriends }: Props) {
  const lang = useProfileStore(s => s.language);
  const LEFT = [
    { icon: '/assets/icons/ic_reward_visit.webp', labelKey: 'sideReward' as const, y: 200, offsetX: 0 },
    { icon: '/assets/icons/ic_daily_challenge.webp', labelKey: 'sideChallenge' as const, y: 355, offsetX: -50 },
    { icon: '/assets/icons/ic_household.webp', labelKey: 'sideHousehold' as const, y: 510, offsetX: 0 },
    { icon: '/assets/icons/ic_storage.webp', labelKey: 'sideStorage' as const, y: 665, offsetX: 20 },
    { icon: '/assets/icons/ic_invite_friend.webp', labelKey: 'sideFriends' as const, y: 820, offsetX: -30 },
  ];
  const RIGHT = [
    { icon: '/assets/icons/ic_hot_deal.webp', labelKey: 'sideHot' as const, y: 210 },
    { icon: '/assets/icons/ic_change_culture.webp', labelKey: 'sideCulture' as const, y: 415 },
  ];

  return (
    <div style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',zIndex:70,pointerEvents:'none' }}>
      {LEFT.map((btn, i) => (
        <div key={i} style={{
          position:'absolute', left:vw(2), top:s(btn.y),
          display:'flex', flexDirection:'column', alignItems:'center', gap:s(6),
          pointerEvents:'auto',
        }}>
          <div style={circleStyle(118)} onClick={i === 0 ? onReward : i === 4? onFriends : undefined}>
            <img src={btn.icon} alt="" loading={i === 0 ? 'eager' : 'lazy'} style={{ width:s(150),height:s(150),objectFit:'contain', marginLeft:s(btn.offsetX) }} />
          </div>
          <span style={labelStyle}>{tr(lang, btn.labelKey)}</span>
        </div>
      ))}

      {RIGHT.map((btn, i) => (
        <div key={i} style={{
          position:'absolute', right:vw(2), top:s(btn.y),
          display:'flex', flexDirection:'column', alignItems:'center', gap:s(6),
          pointerEvents:'auto', width:s(136),
        }}>
          <div
            onClick={() => { if (btn.labelKey === 'sideCulture' && onCultureSwitch) onCultureSwitch(); }}
            style={circleStyle(136)}
          >
            <img src={btn.icon} alt="" style={{ width:s(138),height:s(138),objectFit:'contain' }} />
          </div>
          <span style={labelStyle}>{tr(lang, btn.labelKey)}</span>
          {btn.labelKey === 'sideCulture' && activeCulture && (
            <img
              src={activeCulture === 'carrot'
                ? '/assets/icons/ic_culture_carrot.webp'
                : '/assets/icons/ic_culture_appletree.webp'}
              alt=""
              style={{ width:s(76),height:s(76),objectFit:'contain' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
