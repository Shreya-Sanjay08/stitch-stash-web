import { FuzzyFilter, type MotifProps } from './shared';

export default function YarnBall({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="ball-clip">
          <circle cx="46" cy="46" r="34" />
        </clipPath>
        {fuzzy && <FuzzyFilter id="ball-fuzz" />}
      </defs>
      <g filter={fuzzy ? 'url(#ball-fuzz)' : undefined}>
        <circle cx="46" cy="46" r="34" fill="#9DAE8F" />
        {/* wound strands, curving around the ball at different angles */}
        <g clipPath="url(#ball-clip)" fill="none" stroke="#5A6B4C" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round">
          {[-24, -16, -8, 0, 8, 16, 24].map((o) => (
            <path key={`a${o}`} d={`M8 ${46 + o} Q46 ${30 + o * 1.4} 84 ${46 + o}`} />
          ))}
          {[-22, -10, 2, 14, 26].map((o) => (
            <path key={`b${o}`} d={`M${46 + o} 10 Q${62 + o * 0.6} 46 ${46 + o} 84`} strokeOpacity="0.35" />
          ))}
        </g>
        <circle cx="46" cy="46" r="34" fill="none" stroke="#3F342C" strokeOpacity="0.15" strokeWidth="1" />
        {/* trailing thread */}
        <path d="M70 70 C84 76 78 90 90 92 S98 84 94 80" fill="none" stroke="#5A6B4C" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
