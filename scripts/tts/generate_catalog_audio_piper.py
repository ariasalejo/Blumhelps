#!/usr/bin/env python3
import os
import re
import sys
import json
import hashlib
import subprocess
import tempfile
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAT = ROOT / "src/data/recovery/catalog.ts"
OUT = ROOT / "public/audio/recovery-piper"
VOICE_DIR = ROOT / ".piper-voices"
INDEX = ROOT / "piper-voices-index.json"

DEFAULT_VOICE = os.environ.get("BLUMHELP_PIPER_VOICE", "es_MX-claude-high")
KINDS = [
    k.strip()
    for k in os.environ.get("BLUMHELP_PIPER_KINDS", "guion,micro").split(",")
    if k.strip()
]
ALLOW_PARTIAL = os.environ.get("BLUMHELP_PIPER_ALLOW_PARTIAL", "0") == "1"
EXPECTED_ITEMS = 20


def fail(msg: str) -> None:
    print("ERROR: " + msg)
    sys.exit(1)


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def clean_text(value):
    if value is None:
        return ""
    value = unicodedata.normalize("NFC", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def extract_single_quoted(block: str, field: str):
    """
    Extrae el valor de un campo tipo:
      field: 'texto',
    respetando apostrofos escapados.
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


def find_voice_file(voice: str, ext: str):
    matches = list(VOICE_DIR.rglob(voice + ext))
    return matches[0] if matches else None


def ensure_voice(voice: str):
    VOICE_DIR.mkdir(parents=True, exist_ok=True)

    model = find_voice_file(voice, ".onnx")
    config = find_voice_file(voice, ".onnx.json")

    if model and config:
        print("Voz ya disponible:", voice)
        return model, config

    print("Descargando voz Piper:", voice)
    try:
        subprocess.run(
            [
                sys.executable,
                "-m",
                "piper.download_voices",
                voice,
                "--download-dir",
                str(VOICE_DIR),
            ],
            check=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        print("stdout:", exc.stdout or "")
        print("stderr:", exc.stderr or "")
        fail("No se pudo descargar la voz Piper: " + voice)

    model = find_voice_file(voice, ".onnx")
    config = find_voice_file(voice, ".onnx.json")

    if not model:
        fail("No se encontró modelo .onnx para " + voice)

    return model, config


def verify_md5_if_possible(voice: str, model: Path, config):
    if not INDEX.exists():
        print("WARN No existe piper-voices-index.json; no se verificará MD5.")
        return

    try:
        data = json.loads(INDEX.read_text(encoding="utf-8"))
    except Exception as exc:
        print("WARN No se pudo leer índice MD5:", repr(exc))
        return

    meta = data.get(voice)
    if not isinstance(meta, dict):
        print("WARN No hay metadata MD5 para", voice)
        return

    files = meta.get("files", {})
    if not isinstance(files, dict):
        return

    checked = 0

    for rel, info in files.items():
        if not isinstance(rel, str):
            continue
        if not (rel.endswith(".onnx") or rel.endswith(".onnx.json")):
            continue
        if not isinstance(info, dict):
            continue

        expected = info.get("md5_digest")
        if not expected:
            continue

        fname = Path(rel).name

        local = None
        if model and model.name == fname:
            local = model
        elif config and config.name == fname:
            local = config
        else:
            matches = list(VOICE_DIR.rglob(fname))
            local = matches[0] if matches else None

        if not local:
            print("WARN No se encontró archivo descargado para verificar:", fname)
            continue

        actual = md5_file(local)
        if actual.lower() != str(expected).lower():
            fail("MD5 no coincide para " + fname)

        print("OK MD5 verificado:", fname)
        checked += 1

    if checked == 0:
        print("WARN No se verificó ningún MD5; índice no coincidió.")


def synthesize(text: str, out_mp3: Path, model: Path, config):
    text = clean_text(text)
    if not text:
        return False

    out_mp3.parent.mkdir(parents=True, exist_ok=True)

    tmp = tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".txt",
        delete=False,
        encoding="utf-8",
    )
    tmp.write(text)
    tmp.close()

    wav = out_mp3.with_suffix(".wav")

    cmd = [
        sys.executable,
        "-m",
        "piper",
        "-m",
        str(model),
        "-i",
        tmp.name,
        "-f",
        str(wav),
        "--length-scale",
        "1.0",
    ]

    if config:
        cmd += ["-c", str(config)]

    try:
        proc = subprocess.run(
            cmd,
            check=True,
            text=True,
            capture_output=True,
        )
        if proc.stdout.strip():
            print(proc.stdout.strip())
    except subprocess.CalledProcessError as exc:
        print("stdout:", exc.stdout or "")
        print("stderr:", exc.stderr or "")
        os.unlink(tmp.name)
        fail("Piper falló sintetizando " + str(out_mp3.name))

    os.unlink(tmp.name)

    if not wav.exists() or wav.stat().st_size < 10000:
        fail("WAV sospechosamente pequeño o inexistente: " + str(wav))

    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(wav),
                "-codec:a",
                "libmp3lame",
                "-qscale:a",
                "4",
                str(out_mp3),
            ],
            check=True,
            text=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError as exc:
        print("stdout:", exc.stdout or "")
        print("stderr:", exc.stderr or "")
        fail("ffmpeg falló convirtiendo " + str(out_mp3))

    try:
        wav.unlink()
    except Exception:
        pass

    if not out_mp3.exists() or out_mp3.stat().st_size < 5000:
        fail("MP3 sospechosamente pequeño o inexistente: " + str(out_mp3))

    return True


def main():
    if not CAT.exists():
        fail("No existe " + str(CAT))

    if "piper" not in sys.executable and not Path(sys.executable).name.startswith("python"):
        # No es fatal, pero conviene ejecutar con el venv.
        pass

    raw = CAT.read_text(encoding="utf-8")
    raw = unicodedata.normalize("NFC", raw)

    blocks = re.findall(r"crearItem\(\{(.*?)\n  \}\),", raw, re.S)
    if not blocks:
        blocks = re.findall(r"crearItem\(\{(.*?)\n  \}\)", raw, re.S)

    if not blocks:
        fail("No se encontraron bloques crearItem({...}) en catalog.ts.")

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
        print("Si quieres generar igualmente, ejecuta con BLUMHELP_PIPER_ALLOW_PARTIAL=1")
        fail("Parseo de catálogo incompleto.")

    OUT.mkdir(parents=True, exist_ok=True)

    voice = DEFAULT_VOICE
    model, config = ensure_voice(voice)
    verify_md5_if_possible(voice, model, config)

    manifest = {
        "version": "1",
        "provider": "piper",
        "voice": voice,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "src/data/recovery/catalog.ts",
        "basePath": "audio/recovery-piper/",
        "items": [],
    }

    print("")
    print("=" * 72)
    print(" GENERANDO CATÁLOGO PIPER LOCAL")
    print("=" * 72)
    print("Voz:", voice)
    print("Modelo:", model.relative_to(ROOT))
    if config:
        print("Config:", config.relative_to(ROOT))
    print("Kinds:", ", ".join(KINDS))
    print("Ítems:", len(items))
    print("")

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

            if not clean_text(text):
                continue

            filename = item["id"] + "-" + kind + ".mp3"
            filepath = OUT / filename
            relpath = "audio/recovery-piper/" + filename

            ok = synthesize(text, filepath, model, config)
            if ok:
                entry["files"][kind] = relpath
                print("OK " + item["id"] + " -> " + kind)

        manifest["items"].append(entry)

    manifest_path = OUT / "manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    mp3_files = list(OUT.glob("*.mp3"))
    total_bytes = sum(f.stat().st_size for f in mp3_files)

    print("")
    print("=" * 72)
    print(" GENERACIÓN PIPER COMPLETADA")
    print("=" * 72)
    print("Voz:", voice)
    print("Ítems procesados:", len(manifest["items"]))
    print("Archivos MP3:", len(mp3_files))
    print("Tamaño total:", str(round(total_bytes / 1024 / 1024, 2)) + " MB")
    print("Manifest:", manifest_path.relative_to(ROOT))
    print("=" * 72)


if __name__ == "__main__":
    main()
