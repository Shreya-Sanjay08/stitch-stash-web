import { FuzzyFilter, StitchPattern, type MotifProps } from './shared';

// Concentric rounds, centre outwards.
const ROUNDS = [
  { size: 18, color: '#E8690B' },
  { size: 34, color: '#FBDDC4' },
  { size: 50, color: '#7F8A25' },
  { size: 66, color: '#C9C5BD' },
  { size: 82, color: '#5F6A1A' },
];

export default function GrannySquare({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <StitchPattern id="granny-stitch" />
        {fuzzy && <FuzzyFilter id="granny-fuzz" />}
      </defs>
      <g filter={fuzzy ? 'url(#granny-fuzz)' : undefined}>
        {[...ROUNDS].reverse().map(({ size, color }) => (
          <g key={size}>
            <rect x={43 - size / 2} y={43 - size / 2} width={size + 14} height={size + 14} rx="9" fill={color} />
            <rect x={43 - size / 2} y={43 - size / 2} width={size + 14} height={size + 14} rx="9" fill="url(#granny-stitch)" />
            <rect x={43 - size / 2} y={43 - size / 2} width={size + 14} height={size + 14} rx="9" fill="none" stroke="#3F342C" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="2.2 1.6" />
          </g>
        ))}
        {/* Corner clusters: little puffs where each round turns the corner */}
        {[[16, 16], [84, 16], [16, 84], [84, 84]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5" fill="#A64B00" stroke="#FBF7F1" strokeOpacity="0.5" strokeWidth="0.8" />
            <circle cx={cx} cy={cy} r="2.2" fill="#FBF7F1" fillOpacity="0.35" />
          </g>
        ))}
        <circle cx="50" cy="50" r="4" fill="#FBF7F1" fillOpacity="0.55" />
      </g>
    </svg>
  );
}
