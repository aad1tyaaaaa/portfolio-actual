'use client';

/*
 * PixelGhost — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import { useId } from 'react';
import './PixelGhost.css';

// 14×14 arcade ghost sprite, one rect per row run: [x, y, width]
const BODY = [[5, 0, 4], [3, 1, 8], [2, 2, 10], [1, 3, 12], [1, 4, 12], [1, 5, 12],
  ...Array.from({ length: 6 }, (_, i) => [0, 6 + i, 14])];
// the skirt flips between two frames, like the original
const SKIRT_A = [[0, 12, 2], [3, 12, 3], [8, 12, 3], [12, 12, 2], [0, 13, 1], [4, 13, 2], [8, 13, 2], [13, 13, 1]];
const SKIRT_B = [[0, 12, 2], [3, 12, 2], [6, 12, 2], [9, 12, 2], [12, 12, 2], [1, 13, 1], [5, 13, 1], [8, 13, 1], [12, 13, 1]];
// eye white: rounded 4×5 block
const EYE = [[1, 3, 2], [0, 4, 4], [0, 5, 4], [0, 6, 4], [1, 7, 2]];

const rects = (runs, dx = 0) => runs.map(([x, y, w]) => <rect key={`${x}-${y}`} x={x + dx} y={y} width={w} height={1} />);

export default function PixelGhost() {
  const fill = useId(); // unique per copy — the marquee renders several

  return (
    <div className="pixel-ghost">
      <svg className="pg-ghost" viewBox="0 0 14 14" shapeRendering="crispEdges" aria-hidden="true">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff1744" />
            <stop offset=".45" stopColor="#d946ef" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <g fill={`url(#${fill})`}>
          {rects(BODY)}
          <g className="pg-skirt-a">{rects(SKIRT_A)}</g>
          <g className="pg-skirt-b">{rects(SKIRT_B)}</g>
        </g>
        <g fill="#fff">
          {rects(EYE, 2)}
          {rects(EYE, 8)}
        </g>
        <g className="pg-pupils" fill="#2121de">
          <rect x="4" y="5" width="2" height="2" />
          <rect x="10" y="5" width="2" height="2" />
        </g>
      </svg>
      <div className="pg-shadow" />
    </div>
  );
}
