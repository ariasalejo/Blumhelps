import React from "react";

export default function ProgressChart({points}:{points:{key:string;count:number}[]}){
  const max = Math.max(...points.map(p=>p.count),1);
  const cols = points.length;
  const gap = 6;
  const barWidth = Math.max(8, Math.floor((360 - (cols-1)*gap) / cols));
  const totalWidth = cols * (barWidth + gap);
  const height = 96;

  return (
    <svg viewBox={`0 0 ${totalWidth} ${height}`} width="100%" height={height} role="img" aria-label="Progreso de los últimos días">
      {points.map((p,i)=>{
        const x = i*(barWidth+gap);
        const h = Math.round((p.count/max)*(height-28));
        const y = height - h - 18;
        const dayLabel = p.key.slice(5);
        return (
          <g key={p.key}>
            <rect x={x} y={y} width={barWidth} height={h} rx={6} fill="#7c3aed" opacity={0.95} />
            <text x={x+barWidth/2} y={height-4} fontSize={10} fill="#334155" textAnchor="middle">{dayLabel}</text>
          </g>
        );
      })}
    </svg>
  );
}
