import { useState, useCallback } from 'react';
import { s, vw } from '../utils/scale';

interface Props { onTap: () => void; }

export default function HelperGirl({ onTap }: Props) {
  const [tapped, setTapped] = useState(false);

  const handleTap = useCallback(() => {
    setTapped(true);
    onTap();
    setTimeout(() => setTapped(false), 500);
  }, [onTap]);

  return (
    <div onClick={handleTap} style={{
      position:'absolute', right:vw(10), top:s(760),
      width:s(500), height:s(590), zIndex:25, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <img
        src="/assets/characters/char_girl_idle_watering.webp"
        alt="Помощница"
        className={tapped ? 'girl-tapped' : 'girl-idle'}
        style={{ width:s(600), height:s(970), objectFit:'contain' }}
      />
    </div>
  );
}
