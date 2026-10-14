// web/src/components/RoutineCard.tsx
import React from "react";
import { Routine } from "../hooks/useRoutines";

export default function RoutineCard({ routine, onToggle, onRemove, streak }: { routine: Routine; onToggle: (id:string)=>void; onRemove:(id:string)=>void; streak:number }) {
  const today = (new Date()).toISOString();
  const checkedToday = routine.checkins.includes(new Date().toISOString().slice(0,10));
  return (
    <article className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div>
        <h3 style={{margin:0,fontSize:16}}>{routine.title}</h3>
        {routine.description && <p style={{margin:'4px 0',color:'#6b7280'}}>{routine.description}</p>}
        <small style={{color:'#9ca3af'}}>Creada {new Date(routine.createdAt).toLocaleDateString()}</small>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={()=>onToggle(routine.id)}>{routine.checkins.includes(new Date().toISOString().slice(0,10))? '✅ Hecho' : '○ Marcar'}</button>
          <button className="btn btn-ghost" onClick={()=>onRemove(routine.id)}>Eliminar</button>
        </div>
        <small style={{color:'#6b7280'}}>Check-ins: {routine.checkins.length} · Racha: {streak}</small>
      </div>
    </article>
  );
}
