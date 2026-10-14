// web/src/pages/Rutinas.tsx
import React from "react";
import RoutineList from "../components/RoutineList";
import ProgressChart from "../components/ProgressChart";
import { useRoutines } from "../hooks/useRoutines";

export default function RutinasPage(){
  const { countsByDay, totalCheckins } = useRoutines();
  const points = countsByDay(14);

  return (
    <div>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <p className="eyebrow">Rutinas</p>
          <h1>Tu ritmo diario</h1>
          <p className="muted">Crea pequeñas rutinas, registra check-ins y observa tu progreso.</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:20,fontWeight:700}}>{totalCheckins}</div>
          <small className="muted">Check-ins totales</small>
        </div>
      </header>

      <section style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16,alignItems:'start'}}>
        <div>
          <RoutineList />
        </div>
        <aside>
          <div className="card">
            <h3>Últimos 14 días</h3>
            <ProgressChart points={points} />
          </div>
          <div style={{height:12}} />
          <div className="card">
            <h4>Consejo</h4>
            <p className="muted">Empieza siempre con una tarea que puedas completar en 2–5 minutos para construir hábito sin presión.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
