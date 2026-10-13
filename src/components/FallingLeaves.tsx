import React, { useEffect, useState } from 'react';

interface LeafParticle {
  id: number;
  left: string;
  size: number;
  fallDuration: string;
  swayDuration: string;
  delay: string;
  drift: string;
  sway: string;
  rotation: string;
  opacity: number;
  color: string;
  variant: 0 | 1 | 2 | 3;
  mobileVisible: boolean;
}

const LEAF_PARTICLES: LeafParticle[] = [
  { id: 1, left: '3%', size: 18, fallDuration: '22s', swayDuration: '5.5s', delay: '-1s', drift: '40px', sway: '22px', rotation: '240deg', opacity: 0.35, color: '#079669', variant: 0, mobileVisible: true },
  { id: 2, left: '7%', size: 14, fallDuration: '27s', swayDuration: '6.8s', delay: '-9s', drift: '-30px', sway: '-18px', rotation: '-210deg', opacity: 0.28, color: '#2D6A4F', variant: 1, mobileVisible: true },
  { id: 3, left: '12%', size: 22, fallDuration: '24s', swayDuration: '5.2s', delay: '-4s', drift: '55px', sway: '26px', rotation: '300deg', opacity: 0.32, color: '#075C45', variant: 2, mobileVisible: true },
  { id: 4, left: '18%', size: 16, fallDuration: '29s', swayDuration: '7.0s', delay: '-15s', drift: '-45px', sway: '20px', rotation: '195deg', opacity: 0.30, color: '#52B788', variant: 3, mobileVisible: false },
  { id: 5, left: '23%', size: 20, fallDuration: '23s', swayDuration: '5.8s', delay: '-3s', drift: '35px', sway: '-24px', rotation: '-260deg', opacity: 0.34, color: '#079669', variant: 1, mobileVisible: true },
  { id: 6, left: '28%', size: 15, fallDuration: '26s', swayDuration: '6.5s', delay: '-12s', drift: '-35px', sway: '19px', rotation: '220deg', opacity: 0.26, color: '#40916C', variant: 0, mobileVisible: false },
  { id: 7, left: '34%', size: 24, fallDuration: '30s', swayDuration: '6.2s', delay: '-8s', drift: '48px', sway: '-22px', rotation: '280deg', opacity: 0.33, color: '#075C45', variant: 2, mobileVisible: true },
  { id: 8, left: '39%', size: 14, fallDuration: '21s', swayDuration: '5.0s', delay: '-17s', drift: '-40px', sway: '16px', rotation: '-190deg', opacity: 0.29, color: '#74C69D', variant: 3, mobileVisible: false },
  { id: 9, left: '44%', size: 19, fallDuration: '25s', swayDuration: '6.3s', delay: '-6s', drift: '38px', sway: '25px', rotation: '250deg', opacity: 0.36, color: '#079669', variant: 1, mobileVisible: true },
  { id: 10, left: '49%', size: 16, fallDuration: '28s', swayDuration: '5.9s', delay: '-14s', drift: '-50px', sway: '-20px', rotation: '-230deg', opacity: 0.28, color: '#2D6A4F', variant: 0, mobileVisible: true },
  { id: 11, left: '54%', size: 21, fallDuration: '23s', swayDuration: '6.1s', delay: '-2s', drift: '30px', sway: '18px', rotation: '215deg', opacity: 0.35, color: '#075C45', variant: 2, mobileVisible: true },
  { id: 12, left: '59%', size: 15, fallDuration: '27s', swayDuration: '6.7s', delay: '-11s', drift: '-35px', sway: '-16px', rotation: '270deg', opacity: 0.27, color: '#52B788', variant: 3, mobileVisible: false },
  { id: 13, left: '64%', size: 18, fallDuration: '24s', swayDuration: '5.6s', delay: '-5s', drift: '42px', sway: '24px', rotation: '245deg', opacity: 0.32, color: '#079669', variant: 0, mobileVisible: true },
  { id: 14, left: '69%', size: 14, fallDuration: '31s', swayDuration: '7.2s', delay: '-18s', drift: '-28px', sway: '-19px', rotation: '-205deg', opacity: 0.29, color: '#40916C', variant: 1, mobileVisible: false },
  { id: 15, left: '74%', size: 22, fallDuration: '22s', swayDuration: '5.4s', delay: '-7s', drift: '50px', sway: '21px', rotation: '310deg', opacity: 0.34, color: '#075C45', variant: 2, mobileVisible: true },
  { id: 16, left: '79%', size: 15, fallDuration: '26s', swayDuration: '6.4s', delay: '-13s', drift: '-42px', sway: '18px', rotation: '190deg', opacity: 0.26, color: '#74C69D', variant: 3, mobileVisible: false },
  { id: 17, left: '84%', size: 19, fallDuration: '29s', swayDuration: '6.0s', delay: '-3s', drift: '36px', sway: '-23px', rotation: '-255deg', opacity: 0.33, color: '#079669', variant: 1, mobileVisible: true },
  { id: 18, left: '88%', size: 16, fallDuration: '25s', swayDuration: '5.7s', delay: '-16s', drift: '-32px', sway: '17px', rotation: '225deg', opacity: 0.28, color: '#2D6A4F', variant: 0, mobileVisible: true },
  { id: 19, left: '92%', size: 20, fallDuration: '23s', swayDuration: '6.3s', delay: '-8s', drift: '46px', sway: '-20px', rotation: '275deg', opacity: 0.35, color: '#075C45', variant: 2, mobileVisible: true },
  { id: 20, left: '96%', size: 14, fallDuration: '28s', swayDuration: '6.9s', delay: '-10s', drift: '-38px', sway: '15px', rotation: '-195deg', opacity: 0.27, color: '#52B788', variant: 3, mobileVisible: false },
];

export const FallingLeaves: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    }
  }, []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {LEAF_PARTICLES.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            left: leaf.left,
            top: '-35px',
            '--fall-duration': leaf.fallDuration,
            '--sway-duration': leaf.swayDuration,
            '--fall-delay': leaf.delay,
            '--leaf-drift': leaf.drift,
            '--leaf-sway': leaf.sway,
            '--leaf-rot': leaf.rotation,
            '--leaf-opacity': leaf.opacity,
          } as React.CSSProperties}
          className={`absolute animate-leaf-fall ${
            leaf.mobileVisible ? 'block' : 'hidden md:block'
          }`}
        >
          {leaf.variant === 0 && (
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: leaf.color }}
            >
              <path
                d="M17 3C11.5 3 5 7.5 5 15C5 17.5 6.5 19.5 8.5 20.5C15.5 20.5 20.5 14 20.5 6.5C20.5 4.5 19 3 17 3Z"
                fill="currentColor"
                fillOpacity="0.9"
              />
              <path
                d="M6 19C10 15 14 10.5 18.5 5.5"
                stroke="#FFFDF7"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeOpacity="0.7"
              />
            </svg>
          )}
          {leaf.variant === 1 && (
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: leaf.color }}
            >
              <path
                d="M12 2C7.5 6 5.5 11.5 7 16.5C8 19.5 10.5 21 12 21.5C13.5 21 16 19.5 17 16.5C18.5 11.5 16.5 6 12 2Z"
                fill="currentColor"
                fillOpacity="0.85"
              />
              <path
                d="M12 5V20"
                stroke="#FFFDF7"
                strokeWidth="1"
                strokeLinecap="round"
                strokeOpacity="0.65"
              />
            </svg>
          )}
          {leaf.variant === 2 && (
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: leaf.color }}
            >
              <path
                d="M20 4C13 4 6 9 4 17C12 19 18 13 20 4Z"
                fill="currentColor"
                fillOpacity="0.9"
              />
              <path
                d="M4.5 16.5C9.5 13.5 14.5 9.5 19 4.5"
                stroke="#FFFDF7"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeOpacity="0.65"
              />
            </svg>
          )}
          {leaf.variant === 3 && (
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: leaf.color }}
            >
              {/* Fresh mint / coriander sprig silhouette */}
              <path
                d="M12 2C9 5 8 9 9.5 12C7 11 5 12.5 4.5 15C6.5 16.5 9.5 15.5 11 13.5C11 16 12.5 19 14.5 21C15.5 18 15 15 13.5 12.5C16 13.5 18.5 12 19 10C17 8.5 14 9.5 12 11V2Z"
                fill="currentColor"
                fillOpacity="0.85"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
