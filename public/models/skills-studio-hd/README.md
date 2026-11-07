# Detailed architectural skills studio

This is the twelve-room cutaway with corrected building geometry: open stair
wells, supported stair flights, connected landings, a continuous roof, closed
database enclosures, front-facing GPU fans, and a smooth cloud sculpture.

`studio.glb` uses error-bounded mesh optimization (0.1% mesh-relative error)
to reduce the authored model from 556,040 to 154,798 triangles. Positions, UVs,
and normals retain floating-point precision. Four
independent 4096 × 4096 daylight maps provide much more texture space per room
than the previous single shared atlas. Cycles lighting is baked in HDR,
denoised, and display-mapped once. The runtime displays those maps without a
second tone-mapping pass.

`studio-4k.png` is a separate 3840 × 2560 Cycles reference render of the actual
unbaked scene. `overview.webp` is its loading preview. Neither replaces the
interactive model.

Both renderers orbit, zoom, pan, focus rooms, and pick the actual technical
objects. Desktop views resolve to 3840 pixels wide after camera motion stops.
During movement they use a smaller buffer to keep interaction responsive;
phones use a smaller detail buffer and software texture allocation. The
software worker retains all four maps, builds filtered mip levels, interpolates
smooth normals, and cancels obsolete detail frames between triangle batches.
Its texture-free `studio-motion.glb` reuses the detailed model's materials and
contains 86,174 triangles. Only rotation renders this lighter geometry; pure
orthographic zoom scales the last sharp frame immediately and renders a new
detail frame after movement stops. The worker accepts one frame at a time and
coalesces queued camera changes. Scanline spans avoid testing empty triangle
bounding rectangles, with packed color interpolation for filtered textures.
CPU-backed WebGL implementations such as SwiftShader use this worker path too.

WebGL raycasts room and object bounds instead of the furnished mesh. Resolution
stays fixed throughout a drag and returns to 4K after settling. Decorative idle
animation runs only in the focused agent/cloud rooms. Labels sit on the entrance
of their own room. `studioDetails.ts` supplies the same suspended ML training
board, LoRA adaptation diagram, and loss curve to both rendering paths.

`layout.json` contains the 34 purposeful object bounds. The twelve skill rooms
and the searchable archive still expose all 233 skills in `skillWorld.ts`.

Regenerate with Python 3.11, bpy 4.3, numpy <2, Pillow, and Node.js:

```sh
python scripts/refine-skills-studio-hd.py
```

The script derives its editable source from `build-skills-studio-v2.py` when
needed. Authoring files remain under `/tmp/zohaib-portfolio-qa/studio-hd`.
`--resume` uses that refined scene and completed floor maps after an interrupted
bake; omit it when changing geometry or lighting. Final geometry packaging uses
`scripts/optimize-skills-studio.py` and gltfpack 1.3.0 to emit the detailed and
motion models. It strips duplicate textures from the motion model without
changing its material names. `--render-only` rebuilds the separate 4K
reference and loading preview from the saved refined scene.

Rebuild the software renderer with Clang and wasm-ld:

```sh
clang --target=wasm32 -O3 -nostdlib -Wl,--no-entry -Wl,--export-all \
  -Wl,--export-memory -Wl,--initial-memory=67108864 \
  -o public/models/studio-raster-hd.wasm scripts/studio-raster.c
```
