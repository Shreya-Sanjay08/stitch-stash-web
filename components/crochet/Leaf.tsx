import { FuzzyFilter, StitchPattern, type MotifProps } from './shared';

const LEAF = 'M50 90 C18 70 14 36 50 8 C86 36 82 70 50 90 Z';

export default function Leaf({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <StitchPattern id="leaf-stitch" />
        {fuzzy && <FuzzyFilter id="leaf-fuzz" />}
      </defs>
      <g filter={fuzzy ? 'url(#leaf-fuzz)' : undefined}>
        <path d={LEAF} fill="#9DAE8F" />
        <path d={LEAF} fill="url(#leaf-stitch)" />
        <path d="M50 94 V16" stroke="#3F342C" strokeOpacity="0.3" strokeWidth="1.6" strokeLinecap="round" />
        <g stroke="#3F342C" strokeOpacity="0.22" strokeWidth="1.1" strokeDasharray="2.2 1.6" strokeLinecap="round" fill="none">
          {[30, 44, 58, 72].map((y) => (
            <g key={y}>
              <path d={`M50 ${y} L30 ${y - 12}`} />
              <path d={`M50 ${y} L70 ${y - 12}`} />
            </g>
          ))}
        </g>
        <path d={LEAF} fill="none" stroke="#5A6B4C" strokeOpacity="0.5" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
