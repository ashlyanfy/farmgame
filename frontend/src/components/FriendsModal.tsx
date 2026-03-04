import { s } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVisit: (name: string) => void;
}

const FRIENDS = [
  { nameKey: 'friendsSashaGarden' as const, personName: 'Саша', avatar: '/assets/photos/avatarSasha.webp' },
  { nameKey: 'friendsAltynaiGarden' as const, personName: 'Альтынай', avatar: '/assets/photos/avatarAltynai.webp' },
];

export default function FriendsModal({ visible, onClose, onVisit }: Props) {
  const lang = useProfileStore(st => st.language);
  if (!visible) return null;

  const handleInvite = () => {
    if (navigator.share) {
      navigator.share({ title: 'Моя ферма', url: window.location.href }).catch(() => {});
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)',
    }}>
      <div style={{
        width: '88%', maxWidth: s(900),
        background: 'linear-gradient(180deg, #f5e9c8 0%, #eedaa0 100%)',
        borderRadius: s(32),
        border: `${s(4)}px solid #c8a05a`,
        boxShadow: `0 ${s(8)}px ${s(32)}px rgba(0,0,0,0.35)`,
        overflow: 'hidden',
        fontFamily: 'Nunito',
      }}>
        {/* Шапка */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #e8d5a0 0%, #d4b87a 100%)',
          padding: `${s(10)}px ${s(16)}px`,
          borderBottom: `${s(3)}px solid #c8a05a`,
        }}>
          <span style={{ fontSize: s(40), fontWeight: 900, color: '#3b2a1a',}}>
            {tr(lang, 'friendsTitle')}
          </span>

          <img
            src="/assets/icons/ic_close.webp"
            alt=""
            onClick={onClose}
            style={{ width: s(110), height: s(110),  }}
          />
        </div>


        {/* Список друзей */}
        <div style={{ padding: `${s(16)}px ${s(20)}px`, display: 'flex', flexDirection: 'column', gap: s(12) }}>
          {FRIENDS.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: s(16),
              background: 'rgba(255,255,255,0.55)',
              borderRadius: s(20),
              padding: `${s(14)}px ${s(16)}px`,
              border: `${s(1.5)}px solid rgba(200,160,90,0.4)`,
            }}>
              <img
                src={f.avatar}
                alt=""
                loading="lazy"
                style={{
                  width: s(110), height: s(110),
                  borderRadius: s(55),
                  objectFit: 'cover',
                  border: `${s(3)}px solid #c8a05a`,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: s(30), fontWeight: 800, color: '#2c1a0e' }}>
                  {tr(lang, f.nameKey)}
                </div>
                <div style={{ fontSize: s(24), color: '#8a6a3a', marginTop: s(4) }}>
                  {tr(lang, 'friendsToday')}
                </div>
              </div>
              <button onClick={() => onVisit(f.personName)} style={{
                background: 'linear-gradient(135deg, #7BC67E, #388E3C)',
                border: 'none', borderRadius: s(20), cursor: 'pointer',
                padding: `${s(12)}px ${s(20)}px`,
                color: '#fff', fontSize: s(26), fontWeight: 800, fontFamily: 'Nunito',
                boxShadow: `0 ${s(3)}px ${s(8)}px rgba(56,142,60,0.35)`,
                whiteSpace: 'nowrap',
              }}>
                {tr(lang, 'friendsVisit')} ›
              </button>
            </div>
          ))}
        </div>

        {/* Кнопка пригласить */}
        <div style={{ padding: `0 ${s(20)}px ${s(16)}px` }}>
          <button onClick={handleInvite} style={{
            width: '100%', boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #66BB6A, #388E3C)',
            border: 'none', borderRadius: s(24), cursor: 'pointer',
            padding: `${s(18)}px ${s(24)}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(12),
            boxShadow: `0 ${s(4)}px ${s(12)}px rgba(56,142,60,0.4)`,
          }}>
            <span style={{ color: '#fff', fontSize: s(30), fontWeight: 800, fontFamily: 'Nunito' }}>
              {tr(lang, 'friendsInvite')}
            </span>
            <svg width={s(32)} height={s(32)} viewBox="0 0 24 24" fill="none">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="#fff"/>
            </svg>
          </button>
        </div>

        {/* Промо блок */}
        <div style={{
          margin: `0 ${s(20)}px ${s(20)}px`,
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          borderRadius: s(24),
          padding: `${s(16)}px ${s(16)}px`,
          display: 'flex', alignItems: 'center', gap: s(16),
          border: `${s(1.5)}px solid rgba(56,142,60,0.3)`,
        }}>
          <img
            src="/assets/photos/farmer_smiling.webp"
            alt=""
            loading="lazy"
            style={{
              width: s(120), height: s(120),
              borderRadius: s(60),
              objectFit: 'cover',
              objectPosition: 'top center',
              border: `${s(3)}px solid #388E3C`,
              flexShrink: 0,
            }}
          />
          <p style={{
            margin: 0, fontSize: s(36), fontWeight: 700,
            color: '#1b5e20', fontFamily: 'Nunito', lineHeight: 1.4,
          }}>
            {tr(lang, 'friendsPromo')}
          </p>
        </div>

      </div>
    </div>
  );
}
