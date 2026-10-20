import { FuzzyFilter, StitchPattern, type MotifProps } from './shared';

const HEART = 'M50 86 C16 62 10 40 24 26 C35 15 47 22 50 32 C53 22 65 15 76 26 C90 40 84 62 50 86 Z';

export default function Heart({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <StitchPattern id="heart-stitch" />
        <clipPath id="heart-clip">
          <path d={HEART} />
        </clipPath>
        {fuzzy && <FuzzyFilter id="heart-fuzz" />}
      </defs>
      <g filter={fuzzy ? 'url(#heart-fuzz)' : undefined}>
        <path d={HEART} fill="#EBC4BB" />
        <path d={HEART} fill="url(#heart-stitch)" />
        {/* rows of stitches */}
        <g clipPath="url(#heart-clip)" stroke="#A04A33" strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="2.4 1.8" strokeLinecap="round">
          {[28, 38, 48, 58, 68, 78].map((y) => (
            <line key={y} x1="8" x2="92" y1={y} y2={y} />
          ))}
        </g>
        <path d={HEART} fill="none" stroke="#A04A33" strokeOpacity="0.4" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
