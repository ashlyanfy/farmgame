import { useState, useEffect } from 'react';
import { s } from '../utils/scale';
import { tr } from '../i18n/translations';
import { useProfileStore } from '../store/profileStore';

interface Props {
  visible: boolean;
  friendName: string;
  onClose: () => void;
  onBack: () => void;
}

const TOTAL_SECONDS = 8 * 3600;

// H:MM — как на скриншоте "8:00"
function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

const ACTIONS = [
  { labelKey: 'visitWater' as const, icon: '/assets/ui/ui_funnel.webp', cost: 50 },
  { labelKey: 'visitFertilize' as const, icon: '/assets/ui/ui_nutrients.webp', cost: 100 },
] as const;

export default function VisitFriendModal({ visible, friendName, onClose, onBack }: Props) {
  const lang = useProfileStore(st => st.language);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(TOTAL_SECONDS);
    const id = setInterval(() => setSecondsLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    // Затемнённый оверлей + центрирование карточки
    <div style={{
      position: 'absolute', inset: 0, zIndex: 350,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)',
    }}>
      {/* Карточка — такой же контейнер как FriendsModal */}
      <div style={{
        width: '108%', maxWidth: s(1000),
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
          <img src="/assets/icons/ic_back.webp" alt="" onClick={onBack}
            style={{ width: s(150), height: s(150), objectFit: 'contain', cursor: 'pointer' }} />
          <span style={{ fontSize: s(60), fontWeight: 900, color: '#3b2a1a' }}>
            {tr(lang, 'friendsTitle')}
          </span>
          <img src="/assets/icons/ic_close.webp" alt="" onClick={onClose}
            style={{ width: s(150), height: s(150), objectFit: 'contain', cursor: 'pointer' }} />
        </div>

        {/* Тёмная полоса: иконка птичек + название сада */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: s(12),
          background: '#5d3515',
          padding: `${s(10)}px ${s(18)}px`,
        }}>
          <img src="/assets/icons/ic_invite_friend.webp" alt="" loading="lazy"
            style={{ width: s(108), height: s(108), objectFit: 'contain', }} />
          <span style={{ fontSize: s(42), fontWeight: 800, color: '#fff' }}>
            {tr(lang, 'visitGardenOf', { name: friendName })}
          </span>
        </div>

        {/* Картинка сада + оверлеи */}
        <div style={{
          position: 'relative',
          margin: `${s(12)}px`,
          borderRadius: s(20),
          overflow: 'hidden',
        }}>
          <img
            src="/assets/photos/farmfriend.webp"
            alt=""
            loading="lazy"
            style={{ width: '100%', display: 'block', borderRadius: s(20) }}
          />

          {/* Карточки действий — правый оверлей поверх картинки */}
          <div style={{
            position: 'absolute', top: s(14), right: s(10),
            display: 'flex', flexDirection: 'column', gap: s(10),
          }}>
            {ACTIONS.map((action, i) => (
              <div key={i} style={{
                background: 'rgba(245,233,200)',
                borderRadius: s(16),
                border: `${s(4)}px solid rgba(200,160,90,0.6)`,
                padding: `${s(0)}px ${s(16)}px`,
                cursor: 'pointer',
                width: s(370),
                height: s(220),

              }}>
                <div style={{background: '#5aca5d',border:`${s(4)}px solid #3e7f40`, 
                padding: `${s(4)}px ${s(5)}px`,
                borderRadius: s(20),
                textAlign: 'center',width: s(220), height: s(70), fontSize: s(39), fontWeight: 800, color: '#3a2608', marginBottom: s(10), marginTop: s(10) }}>
                  {tr(lang, action.labelKey)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center',gap: s(-30) }}>
                    <span style={{ fontSize: s(38), fontWeight: 800, color: '#3b2a1a' }}>{action.cost}</span>
                    <img src="/assets/icons/ic_coin.webp" alt=""
                      style={{ width: s(82), height: s(92), objectFit: 'contain' }} />
                  </div>
                  <img src={action.icon} alt="" loading="lazy"
                    style={{ width: s(200), height: s(150), objectFit: 'contain', marginTop: s(-30), marginRight: s(-12)}} />
                </div>
              </div>
            ))}
          </div>

          {/* Таймер — нижний левый оверлей */}
          <div style={{
            position: 'absolute', bottom: s(10), left: s(10),
            display: 'flex', alignItems: 'center', gap: s(6),
            background: 'rgba(245,233,200,0.92)',
            borderRadius: s(32),
            border: `${s(1.5)}px solid rgba(200,160,90,0.5)`,
            padding: `${s(6)}px ${s(14)}px`,
          }}>
            <img src="/assets/icons/ic_goodness.webp" alt=""
              style={{ width: s(68), height: s(68), objectFit: 'contain' }} />
            <span style={{ fontSize: s(46), fontWeight: 700, color: '#1b5e20' }}>
              {tr(lang, 'visitTimeLeft', { time: formatTime(secondsLeft) })}
            </span>
          </div>
        </div>

        {/* Отправить подарок */}
        <div style={{
          padding: `${s(10)}px ${s(20)}px`,
          borderTop: `${s(10)}px solid rgba(200,160,90,0.4)`,
          borderBottom: `${s(10)}px solid rgba(200,160,90,0.4)`,
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: s(48), fontWeight: 700, color: '#3b2a1a' }}>
            {tr(lang, 'visitSendGift')}
          </span>
        </div>

        {/* Сообщение с иконкой */}
        <div style={{
          margin: `${s(12)}px`,
          background: 'rgba(255,255,255,0.55)',
          borderRadius: s(20),
          border: `${s(1.5)}px solid rgba(200,160,90,0.4)`,
          padding: `${s(14)}px ${s(16)}px`,
          display: 'flex', alignItems: 'flex-start', gap: s(12),
        }}>
          <img src="/assets/icons/ic_reward_visit.webp" alt="" loading="lazy"
            style={{ width: s(202), height: s(202), objectFit: 'contain', flexShrink: 0 }} />
          <p style={{
            margin: 0, fontSize: s(42), fontWeight: 600,
            color: '#3b2a1a', lineHeight: 1.4,
          }}>
            {tr(lang, 'visitMessage', { name: friendName })}
          </p>
        </div>

      </div>
    </div>
  );
}
