import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "http://localhost/inicio", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement; global.Element = dom.window.Element;
global.Node = dom.window.Node; global.SVGElement = dom.window.SVGElement; global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = (cb)=>setTimeout(cb,16); global.cancelAnimationFrame = clearTimeout;
global.IS_REACT_ACT_ENVIRONMENT = false;
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { MemoryRouter, Routes, Route } = await import("react-router-dom");
const { AppProvider } = await import("./state/app.tsx");
const Inicio = (await import("./pages/Inicio.tsx")).default;
const Ayuda = await import("./pages/Ayuda.tsx");
const Bienestar = (await import("./pages/Bienestar.tsx")).default;
const Empleo = await import("./pages/Empleo.tsx");
const Comunidad = await import("./pages/Comunidad.tsx");
const Formacion = await import("./pages/Formacion.tsx");
const Guardados = (await import("./pages/Guardados.tsx")).default;
const Ajustes = (await import("./pages/Ajustes.tsx")).default;

const routes = (
  <AppProvider>
    <Routes>
      <Route path="/inicio" element={<Inicio/>}/>
      <Route path="/ayuda" element={<Ayuda.AyudaList/>}/>
      <Route path="/ayuda/recurso/a2" element={<Ayuda.AyudaDetalle/>}/>
      <Route path="/ayuda/emergencia" element={<Ayuda.Emergencia/>}/>
      <Route path="/bienestar" element={<Bienestar/>}/>
      <Route path="/formacion" element={<Formacion.FormacionList/>}/>
      <Route path="/empleo" element={<Empleo.EmpleoList/>}/>
      <Route path="/empleo/hoja-de-vida" element={<Empleo.HojaDeVida/>}/>
      <Route path="/comunidad" element={<Comunidad.ComunidadList/>}/>
      <Route path="/familias" element={<Comunidad.FamiliasList/>}/>
      <Route path="/guardados" element={<Guardados/>}/>
      <Route path="/ajustes" element={<Ajustes/>}/>
    </Routes>
  </AppProvider>
);

let fails = 0;
for (const path of ["/inicio","/ayuda","/ayuda/recurso/a2","/ayuda/recurso/zzz","/ayuda/emergencia","/bienestar","/formacion","/empleo","/empleo/hoja-de-vida","/comunidad","/familias","/guardados","/ajustes"]) {
  try {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(React.createElement(MemoryRouter, { initialEntries: [path] }, routes));
    await new Promise(r => setTimeout(r, 60));
    const text = container.textContent || "";
    if (!text || text.length < 40) throw new Error("contenido vacío");
    console.log("OK ", path, "| chars:", text.length);
    root.unmount();
  } catch (e) { fails++; console.log("FAIL", path, "→", e.message?.slice(0,160)); }
}
process.exit(fails ? 1 : 0);
