---
diff --git a/web/src/main.tsx b/web/src/main.tsx
index 091f7cb..0000000 100644
--- a/web/src/main.tsx
+++ b/web/src/main.tsx
@@
 import Guardados from "./pages/Guardados";
 import Ajustes from "./pages/Ajustes";
+import Rutinas from "./pages/Rutinas";
@@
             <Route path="/ajustes" element={<Ajustes />} />
+            <Route path="/rutinas" element={<Rutinas />} />
             <Route path="*" element={<NotFound />} />
