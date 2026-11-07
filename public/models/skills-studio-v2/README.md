# Twelve-room architectural skills studio

The same architectural cutaway, extended to four floors with three rooms each.
Forest enamel, cream limestone, and lime details match the portfolio palette.

`studio.glb` contains real furnished interiors. Meshopt compression and geometry
optimisation reduce the transferred model to approximately 3.3 MB. All decoding
runs locally; there are no remote model, decoder, or environment dependencies.

`layout.json` records the bounding boxes of meaningful technical objects, their
room, and the skill they represent. Both renderers pick real geometry. Category
plates are placed on the front floor fascias so they leave screens unobstructed.

The primary renderer uses Three.js/WebGL. When WebGL is unavailable or lost, a
dedicated worker uses the local WebAssembly depth-buffer renderer to project and
texture the same model. This second path also supports orbit, pan, wheel zoom,
pinch zoom, room focus, and object picking. The overview image is a loading view.
During movement the software renderer coalesces camera updates at a lower
resolution; it draws a sharper frame once movement stops.

The 233 unique skills are assigned exactly once in `skillWorld.ts`. The complete
searchable archive also retains the original 16 CV/project skill groupings.

Regenerate the scene using Python 3.11 with bpy 4.3.0, numpy <2, and Pillow:

```sh
python scripts/build-skills-studio-v2.py --bake
```

The generator shares modelling helpers with `build-skills-studio.py`, renders the
overview, bakes and denoises daylight, and invokes gltfpack 1.3.0 to package the
model. Large authoring files stay under `/tmp/zohaib-portfolio-qa/studio-v2/`.

Rebuild the software rasterizer using Clang and wasm-ld:

```sh
clang --target=wasm32 -O3 -nostdlib -Wl,--no-entry -Wl,--export-all \
  -Wl,--export-memory -Wl,--initial-memory=67108864 \
  -o public/models/studio-raster.wasm scripts/studio-raster.c
```
