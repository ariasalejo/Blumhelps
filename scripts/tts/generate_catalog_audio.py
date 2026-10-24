#!/usr/bin/env python3
import os
import re
import sys
import json
import subprocess
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAT = ROOT / "src/data/recovery/catalog.ts"
OUT = ROOT / "public/audio/recovery"
EDGE = ROOT / ".venv-tts/bin/edge-tts"

VOICE = os.environ.get("BLUMHELP_TTS_VOICE", "es-CO-GonzaloNeural")
KINDS = [
    k.strip()
    for k in os.environ.get("BLUMHELP_TTS_KINDS", "guion,micro").split(",")
    if k.strip()
]
ALLOW_PARTIAL = os.environ.get("BLUMHELP_TTS_ALLOW_PARTIAL", "0") == "1"
EXPECTED_ITEMS = 20


def fail(msg: str) -> None:
    print("ERROR: " + msg)
    sys.exit(1)


if not CAT.exists():
    fail("No existe " + str(CAT))

if not EDGE.exists():
    fail("No existe " + str(EDGE) + ". Crea el venv e instala edge-tts primero.")

raw = CAT.read_text(encoding="utf-8")
raw = unicodedata.normalize("NFC", raw)

# Cada ítem del catálogo está dentro de crearItem({ ... }),
blocks = re.findall(r"crearItem\(\{(.*?)\n  \}\),", raw, re.S)

if not blocks:
    fail("No se encontraron bloques crearItem({...}) en catalog.ts.")


def extract_single_quoted(block: str, field: str):
    """
    Extrae el valor de un campo tipo:
      field: 'texto',
    respetando apostrofos escapados \'.
    """
    pattern = r"\b" + re.escape(field) + r":\s*'"
    m = re.search(pattern, block)
    if not m:
        return None

    i = m.end()
    out = []

    while i < len(block):
        ch = block[i]

        if ch == "\\":
            nxt = block[i + 1] if i + 1 < len(block) else ""

            if nxt == "'":
                out.append("'")
                i += 2
                continue

            if nxt == "\\":
                out.append("\\")
                i += 2
                continue

            if nxt == "n":
                out.append(" ")
                i += 2
                continue

            if nxt == "t":
                out.append(" ")
                i += 2
                continue

            out.append(ch)
            i += 1
            continue

        if ch == "'":
            break

        out.append(ch)
        i += 1

    return "".join(out).strip()


def clean_text(value):
    if value is None:
        return ""
    value = unicodedata.normalize("NFC", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


items = []

for idx, block in enumerate(blocks, start=1):
    item_id = clean_text(extract_single_quoted(block, "id"))
    titulo = clean_text(extract_single_quoted(block, "titulo"))
    guion = clean_text(extract_single_quoted(block, "guion"))
    micro = clean_text(extract_single_quoted(block, "microAccion"))

    if not item_id:
        print("AVISO: bloque " + str(idx) + " sin id; se omite.")
        continue

    items.append(
        {
            "id": item_id,
            "titulo": titulo,
            "guion": guion,
            "micro": micro,
        }
    )

if not items:
    fail("No se extrajo ningún ítem del catálogo.")

if len(items) != EXPECTED_ITEMS and not ALLOW_PARTIAL:
    print("Se extrajeron " + str(len(items)) + " ítems.")
    print("Se esperaban " + str(EXPECTED_ITEMS) + " ítems.")
    print("Si quieres generar igualmente, ejecuta con BLUMHELP_TTS_ALLOW_PARTIAL=1")
    fail("Parseo de catálogo incompleto.")

OUT.mkdir(parents=True, exist_ok=True)

manifest = {
    "version": "1",
    "voice": VOICE,
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "source": "src/data/recovery/catalog.ts",
    "basePath": "/audio/recovery/",
    "items": [],
}

for item in items:
    entry = {
        "id": item["id"],
        "titulo": item["titulo"],
        "files": {},
    }

    for kind in KINDS:
        if kind == "micro":
            text = item.get("micro", "")
        else:
            text = item.get(kind, "")

        if not text:
            continue

        filename = item["id"] + "-" + kind + ".mp3"
        filepath = OUT / filename

        cmd = [
            str(EDGE),
            "--voice",
            VOICE,
            "--text",
            text,
            "--write-media",
            str(filepath),
        ]

        try:
            subprocess.run(
                cmd,
                check=True,
                text=True,
                capture_output=True,
            )
        except subprocess.CalledProcessError as exc:
            print("Fallo generando " + filename)
            print(exc.stderr or "")
            fail("edge-tts falló durante la generación.")

        entry["files"][kind] = "/audio/recovery/" + filename

    manifest["items"].append(entry)
    print("OK " + item["id"] + " -> " + ", ".join(entry["files"].keys()))

manifest_path = OUT / "manifest.json"
manifest_path.write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

mp3_files = list(OUT.glob("*.mp3"))
total_bytes = sum(f.stat().st_size for f in mp3_files)

print("")
print("=" * 72)
print(" GENERACIÓN TTS DEL CATÁLOGO COMPLETADA")
print("=" * 72)
print("Voz: " + VOICE)
print("Ítems procesados: " + str(len(manifest["items"])))
print("Archivos MP3: " + str(len(mp3_files)))
print("Tamaño total: " + str(round(total_bytes / 1024 / 1024, 2)) + " MB")
print("Manifest: " + str(manifest_path.relative_to(ROOT)))
print("=" * 72)
