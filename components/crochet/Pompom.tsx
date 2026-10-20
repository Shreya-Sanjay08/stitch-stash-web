import { FuzzyFilter, type MotifProps } from './shared';

// Short radial fibres around the edge, generated once so the markup is deterministic.
const FIBRES = Array.from({ length: 44 }, (_, i) => {
  const a = (i / 44) * Math.PI * 2;
  const wobble = 1 + ((i * 7) % 5) * 0.12;
  const inner = 30;
  const outer = 38 * wobble;
  return {
    x1: +(50 + Math.cos(a) * inner).toFixed(2),
    y1: +(50 + Math.sin(a) * inner).toFixed(2),
    x2: +(50 + Math.cos(a) * outer).toFixed(2),
    y2: +(50 + Math.sin(a) * outer).toFixed(2),
  };
});

export default function Pompom({ className, fuzzy }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>{fuzzy && <FuzzyFilter id="pompom-fuzz" />}</defs>
      <g filter={fuzzy ? 'url(#pompom-fuzz)' : undefined}>
        <g stroke="#E0A93B" strokeWidth="3" strokeLinecap="round">
          {FIBRES.map((f, i) => (
            <line key={i} {...f} />
          ))}
        </g>
        <circle cx="50" cy="50" r="33" fill="#E0A93B" />
        {/* tufts inside, a little darker, for depth */}
        <g stroke="#7E5A0E" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round">
          {FIBRES.filter((_, i) => i % 2 === 0).map((f, i) => (
            <line
              key={i}
              x1={50 + (f.x1 - 50) * 0.35}
              y1={50 + (f.y1 - 50) * 0.35}
              x2={50 + (f.x1 - 50) * 0.85}
              y2={50 + (f.y1 - 50) * 0.85}
            />
          ))}
        </g>
        <circle cx="38" cy="38" r="9" fill="#FBF7F1" fillOpacity="0.18" />
      </g>
    </svg>
  );
}
