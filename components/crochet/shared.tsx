export interface MotifProps {
  className?: string;
  /** Adds a light displacement filter for a fuzzy yarn edge. Only worth it on larger pieces. */
  fuzzy?: boolean;
}

/** Light feTurbulence/feDisplacementMap filter that roughens edges like loose yarn fibres. */
export function FuzzyFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

/** Tiny V-shaped stitches, laid over a fill to give it a knitted texture. */
export function StitchPattern({ id, color = '#ffffff', opacity = 0.35 }: { id: string; color?: string; opacity?: number }) {
  return (
    <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse">
      <path d="M0.6 0.6 L2.5 3.6 L4.4 0.6" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
    </pattern>
  );
}
