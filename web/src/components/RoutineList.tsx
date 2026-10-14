import React, { useState } from "react";
import RoutineCard from "./RoutineCard";
import { useRoutines } from "../hooks/useRoutines";

export default function RoutineList(){
  const { routines, addRoutine, toggleCheckin, removeRoutine, streakFor } = useRoutines();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <section>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input className="input-bh" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nueva rutina (p. ej. Tomar agua)" />
        <input className="input-bh" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descripción (opcional)" />
        <button className="btn-primary" onClick={()=>{addRoutine(title,desc); setTitle(''); setDesc('');}}>Añadir</button>
      </div>
      <div style={{display:'grid',gap:12}}>
        {routines.length===0 && <p className="muted">Aún no tienes rutinas. Empieza con algo pequeño.</p>}
        {routines.map(r=> <RoutineCard key={r.id} routine={r} onToggle={toggleCheckin} onRemove={removeRoutine} streak={streakFor(r)} />)}
      </div>
    </section>
  );
}
