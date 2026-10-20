import { FuzzyFilter, StitchPattern, type MotifProps } from './shared';

export default function Flower({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <StitchPattern id="flower-stitch" />
        {fuzzy && <FuzzyFilter id="flower-fuzz" />}
      </defs>
      <g filter={fuzzy ? 'url(#flower-fuzz)' : undefined}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <ellipse cx="50" cy="26" rx="13" ry="21" fill="#C8634A" />
            <ellipse cx="50" cy="26" rx="13" ry="21" fill="url(#flower-stitch)" />
            {/* a centre chain down each petal */}
            <path d="M50 12 V38" stroke="#3F342C" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 1.5" strokeLinecap="round" />
            <ellipse cx="50" cy="26" rx="13" ry="21" fill="none" stroke="#3F342C" strokeOpacity="0.15" strokeWidth="0.8" />
          </g>
        ))}
        <circle cx="50" cy="50" r="12" fill="#E0A93B" />
        <circle cx="50" cy="50" r="12" fill="url(#flower-stitch)" />
        {/* French knots */}
        {[[46, 46], [54, 46], [50, 52], [45, 53], [55, 53]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#7E5A0E" fillOpacity="0.55" />
        ))}
      </g>
    </svg>
  );
}
