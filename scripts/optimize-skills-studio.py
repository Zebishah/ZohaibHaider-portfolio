"""Package bounded-error geometry and a texture-free software motion model.

Usage: python scripts/optimize-skills-studio.py path/to/unreduced.glb
The motion model reuses the detailed model's materials in the worker.
"""
import json
from pathlib import Path
import struct
import subprocess
import sys
import tempfile

OUT = Path(__file__).resolve().parents[1] / "public/models/skills-studio-hd"


def strip_images(source, destination):
    data = source.read_bytes()
    json_size = struct.unpack_from("<I", data, 12)[0]
    document = json.loads(data[20:20 + json_size])
    binary = data[28 + json_size:]
    image_views = {image["bufferView"] for image in document.get("images", [])}
    # gltfpack places embedded images before compressed geometry.
    views = [document["bufferViews"][i] for i in sorted(image_views)]
    cursor = 0
    for view in views:
        assert view["buffer"] == 0 and view.get("byteOffset", 0) == cursor
        cursor += (view["byteLength"] + 3) & ~3
    binary = binary[cursor:]
    for index, view in enumerate(document["bufferViews"]):
        if index in image_views:
            # Retain indices referenced by geometry accessors.
            view.update(buffer=0, byteOffset=0, byteLength=4)
            continue
        if view["buffer"] == 0:
            view["byteOffset"] = view.get("byteOffset", 0) - cursor
        compressed = view.get("extensions", {}).get("EXT_meshopt_compression")
        if compressed and compressed["buffer"] == 0:
            compressed["byteOffset"] = compressed.get("byteOffset", 0) - cursor

    def remove_texture_references(value):
        if isinstance(value, dict):
            for key in list(value):
                if key.endswith("Texture"):
                    del value[key]
                else:
                    remove_texture_references(value[key])
        elif isinstance(value, list):
            for item in value:
                remove_texture_references(item)

    remove_texture_references(document["materials"])
    for key in ("images", "textures", "samplers"):
        document.pop(key, None)
    document["buffers"][0]["byteLength"] = len(binary)
    encoded = json.dumps(document, separators=(",", ":")).encode()
    encoded += b" " * (-len(encoded) % 4)
    binary += b"\0" * (-len(binary) % 4)
    result = struct.pack("<III", 0x46546C67, 2, 28 + len(encoded) + len(binary))
    result += struct.pack("<II", len(encoded), 0x4E4F534A) + encoded
    result += struct.pack("<II", len(binary), 0x004E4942) + binary
    destination.write_bytes(result)


def main():
    source = Path(sys.argv[1]).resolve()
    OUT.mkdir(parents=True, exist_ok=True)
    common = ["npx", "--yes", "gltfpack@1.3.0", "-i", str(source),
              "-cc", "-vpf", "-vtf", "-vnf", "-kn", "-km", "-ke", "-sp"]
    subprocess.run(common + ["-si", ".15", "-se", ".001", "-o", str(OUT / "studio.glb")], check=True)
    with tempfile.TemporaryDirectory(prefix="studio-motion-") as directory:
        motion = Path(directory) / "motion.glb"
        subprocess.run(common + ["-si", ".04", "-se", ".004", "-o", str(motion)], check=True)
        strip_images(motion, OUT / "studio-motion.glb")


if __name__ == "__main__":
    main()
