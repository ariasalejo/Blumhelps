// web/src/components/ProgressChart.tsx
import React from "react";

export default function ProgressChart({points}:{points:{key:string;count:number}[]}){
  const max = Math.max(...points.map(p=>p.count),1);
  const width = 400;
  const height = 80;
  const barWidth = Math.floor(width / points.length) - 4;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="80">
      {points.map((p,i)=>{
        const x = i*(barWidth+4)+2;
        const h = Math.round((p.count/max)*(height-20));
        const y = height - h - 10;
        return (
          <g key={p.key}>
            <rect x={x} y={y} width={barWidth} height={h} rx={4} fill="#7c3aed" opacity={0.9} />
            <text x={x+barWidth/2} y={height-2} fontSize={10} fill="#334155" textAnchor="middle">{p.key.slice(5)}</text>
          </g>
        );
      })}
    </svg>
  );
}
