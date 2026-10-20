import fs from 'fs';
import path from 'path';

// Archivos críticos que DEBEN existir para que el proyecto sea válido
const criticalFiles = [
    'package.json',
    'vite.config.ts',      // Corregido: tu proyecto usa .ts
    'src/main.tsx',        // Corregido: tu proyecto usa .tsx
    'index.html',
    'tsconfig.json'
];

// Archivos opcionales que pueden no existir en etapas tempranas
const optionalFiles = [
    'src/components/ui.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx'
];

console.log("🔍 Validando integridad estructural de Blumhelps...");
let hasErrors = false;

for (const file of criticalFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
        console.error(`❌ CRÍTICO: Falta archivo esencial: ${file}`);
        hasErrors = true;
    }
}

for (const file of optionalFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
        console.warn(`⚠️  ADVERTENCIA: Componente opcional no encontrado: ${file} (Se omitirá)`);
    }
}

if (hasErrors) {
    console.error("🚫 La validación falló. No se puede continuar el build.");
    process.exit(1);
} else {
    console.log("✅ Validación completada. El proyecto está estructuralmente sano.");
}
