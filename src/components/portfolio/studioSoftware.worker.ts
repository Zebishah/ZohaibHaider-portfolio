/// <reference lib="webworker" />
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { Color, Matrix3, Mesh, MeshStandardMaterial, Vector2, Vector3 } from "three";
import { hotspotAtPoint, roomAtPoint, type StudioLayout } from "./studioScene";
type Raster = {
  memory: WebAssembly.Memory;
  prepare: (...a: number[]) => void;
  paint: (...a: number[]) => void;
  __heap_base: WebAssembly.Global;
};
type FrameRequest = {
  type: "render";
  width: number;
  height: number;
  matrix: number[];
  front: boolean;
  quality: boolean;
  selected: number;
  serial: number;
};
let raster: Raster,
  nv = 0,
  nt = 0,
  vp = 0,
  tp = 0,
  mp = 0,
  pp = 0,
  px = 0,
  dp = 0,
  ip = 0,
  tx = 0,
  tw = 1,
  th = 1,
  arena = 0,
  frameBase = 0,
  capacity = 0,
  ready = false;
let lastIds = new Uint32Array(0),
  lastWidth = 0,
  lastHeight = 0,
  pending: FrameRequest | null = null,
  rendering = false;
const turn = new MessageChannel();
let resume: (() => void) | null = null;
turn.port1.onmessage = () => {
  const f = resume;
  resume = null;
  f?.();
};
const yieldTurn = () =>
  new Promise<void>((resolve) => {
    resume = resolve;
    turn.port2.postMessage(0);
  });
function reserve(bytes: number) {
  const pointer = arena;
  arena = (arena + bytes + 15) & ~15;
  return pointer;
}
function grow() {
  if (arena > raster.memory.buffer.byteLength)
    raster.memory.grow(Math.ceil((arena - raster.memory.buffer.byteLength) / 65536));
}
function ensureFrame(size: number) {
  if (size <= capacity) return;
  capacity = size;
  arena = frameBase;
  px = reserve(size * 4);
  dp = reserve(size * 4);
  ip = reserve(size * 4);
  grow();
}
const byte = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
function displayColor(value: number) {
  const v = Math.max(0, value);
  const mapped = (v * (2.51 * v + 0.03)) / (v * (2.43 * v + 0.59) + 0.14);
  return mapped <= 0.0031308
    ? mapped * 12.92
    : 1.055 * Math.pow(Math.min(1, mapped), 1 / 2.4) - 0.055;
}
async function initialise(url: string, layout: StudioLayout, textureSize = 4096) {
  const [wasm, gltf] = await Promise.all([
    fetch("/models/studio-raster-hd.wasm")
      .then((r) => r.arrayBuffer())
      .then((b) => WebAssembly.instantiate(b, {})),
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url),
  ]);
  raster = wasm.instance.exports as unknown as Raster;
  const meshes: Mesh[] = [];
  const images: CanvasImageSource[] = [];
  const imageIndices = new Map<CanvasImageSource, number>();
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    for (let p: typeof o | null = o; p; p = p.parent as typeof o | null)
      if (p.name.startsWith("RoomFrame")) return;
    const m = (Array.isArray(o.material) ? o.material[0] : o.material) as MeshStandardMaterial & {
      transmission?: number;
    };
    if ((m.transmission ?? 0) > 0.5 || m.opacity < 0.5) return;
    meshes.push(o);
    nv += o.geometry.attributes.position.count;
    nt += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    const image = (m.emissiveMap ?? m.map)?.image as CanvasImageSource | undefined;
    if (image && !imageIndices.has(image)) {
      imageIndices.set(image, images.length + 1);
      images.push(image);
    }
  });
  tw = th = Math.min(4096, Math.max(1024, textureSize));
  let mipPixels = 0;
  for (let size = tw; size >= 1; size >>= 1) mipPixels += size * size;
  arena = Number(raster.__heap_base.value);
  vp = reserve(nv * 6 * 4);
  tp = reserve(nt * 6 * 4);
  mp = reserve(16 * 4);
  pp = reserve(nv * 4 * 4);
  tx = reserve(mipPixels * Math.max(1, images.length) * 4);
  frameBase = arena;
  grow();
  const textureCanvas = new OffscreenCanvas(tw, th),
    tc = textureCanvas.getContext("2d", { willReadFrequently: true })!;
  for (let index = 0; index < images.length; index++) {
    let offset = tx + index * mipPixels * 4;
    for (let size = tw; size >= 1; size >>= 1) {
      textureCanvas.width = textureCanvas.height = size;
      tc.imageSmoothingEnabled = true;
      tc.imageSmoothingQuality = "high";
      tc.drawImage(images[index], 0, 0, size, size);
      const pixels = tc.getImageData(0, 0, size, size).data;
      new Uint8Array(raster.memory.buffer, offset, pixels.byteLength).set(pixels);
      offset += pixels.byteLength;
    }
    await yieldTurn();
  }
  const vertices = new Float32Array(raster.memory.buffer, vp, nv * 6),
    triangles = new Uint32Array(raster.memory.buffer, tp, nt * 6);
  let base = 0,
    tri = 0;
  const point = new Vector3(),
    normal = new Vector3(),
    centroid = new Vector3(),
    coordinate = new Vector2(),
    normalMatrix = new Matrix3();
  for (const mesh of meshes) {
    const g = mesh.geometry,
      p = g.attributes.position,
      uv = g.attributes.uv,
      n = g.attributes.normal;
    const m = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial;
    const map = m.emissiveMap ?? m.map,
      textureId = map?.image ? (imageIndices.get(map.image as CanvasImageSource) ?? 0) : 0;
    map?.updateMatrix();
    normalMatrix.getNormalMatrix(mesh.matrixWorld);
    const color = m.color?.clone() ?? new Color("#eee4d4"),
      emission = m.emissive;
    const emitting =
      !!emission &&
      emission.r + emission.g + emission.b > 0.001 &&
      (m.emissiveIntensity ?? 0) > 0.1;
    if (emitting) color.copy(emission).multiplyScalar(m.emissiveIntensity);
    const packed =
      (byte(displayColor(color.r)) |
        (byte(displayColor(color.g)) << 8) |
        (byte(displayColor(color.b)) << 16) |
        0xff000000) >>>
      0;
    for (let i = 0; i < p.count; i++) {
      point.set(p.getX(i), p.getY(i), p.getZ(i)).applyMatrix4(mesh.matrixWorld);
      coordinate.set(uv?.getX(i) ?? 0, uv?.getY(i) ?? 0);
      if (map) coordinate.applyMatrix3(map.matrix);
      normal
        .set(n?.getX(i) ?? 0, n?.getY(i) ?? 1, n?.getZ(i) ?? 0)
        .applyMatrix3(normalMatrix)
        .normalize();
      const shade = emitting
        ? 1
        : Math.min(
            1.12,
            0.66 +
              0.3 * Math.max(0, normal.y * 0.7 + normal.z * 0.65 - normal.x * 0.3) +
              0.16 * Math.max(0, normal.x * 0.8 + normal.y * 0.6),
          );
      const at = (base + i) * 6;
      vertices[at] = point.x;
      vertices[at + 1] = point.y;
      vertices[at + 2] = point.z;
      vertices[at + 3] = coordinate.x;
      vertices[at + 4] = coordinate.y;
      vertices[at + 5] = shade;
    }
    const count = g.index?.count ?? p.count;
    for (let i = 0; i < count; i += 3) {
      const a = base + (g.index?.getX(i) ?? i),
        b = base + (g.index?.getX(i + 1) ?? i + 1),
        c = base + (g.index?.getX(i + 2) ?? i + 2);
      centroid.set(
        (vertices[a * 6] + vertices[b * 6] + vertices[c * 6]) / 3,
        (vertices[a * 6 + 1] + vertices[b * 6 + 1] + vertices[c * 6 + 1]) / 3,
        (vertices[a * 6 + 2] + vertices[b * 6 + 2] + vertices[c * 6 + 2]) / 3,
      );
      const h = hotspotAtPoint(centroid, layout.hotspots),
        room = roomAtPoint(centroid),
        at = tri++ * 6;
      triangles[at] = a;
      triangles[at + 1] = b;
      triangles[at + 2] = c;
      triangles[at + 3] = packed;
      triangles[at + 4] = textureId;
      triangles[at + 5] = h >= 0 ? 100 + h : room === null ? 0 : 1 + room;
    }
    base += p.count;
  }
  ready = true;
  self.postMessage({ type: "ready", triangles: nt, textures: images.length, textureSize: tw });
}
async function renderFrames() {
  if (rendering || !ready) return;
  rendering = true;
  try {
    while (pending) {
      const frame = pending as FrameRequest;
      pending = null;
      const width = Math.max(1, Math.min(3840, frame.width)),
        height = Math.max(1, Math.min(2560, frame.height));
      ensureFrame(width * height);
      new Float32Array(raster.memory.buffer, mp, 16).set(frame.matrix);
      const start = performance.now();
      raster.prepare(width, height, nv, vp, mp, pp, px, dp, ip);
      let cancelled = false;
      const batch = frame.quality ? 1800 : nt;
      for (let first = 0; first < nt; first += batch) {
        raster.paint(
          width,
          height,
          first,
          Math.min(batch, nt - first),
          vp,
          tp,
          pp,
          px,
          dp,
          ip,
          tx,
          tw,
          th,
          1,
        );
        if (frame.quality) {
          await yieldTurn();
          if (pending && (pending as FrameRequest).serial > frame.serial) {
            cancelled = true;
            break;
          }
        }
      }
      if (cancelled) continue;
      lastIds = new Uint32Array(raster.memory.buffer, ip, width * height).slice();
      lastWidth = width;
      lastHeight = height;
      const pixels = new Uint8ClampedArray(raster.memory.buffer, px, width * height * 4).slice();
      self.postMessage(
        {
          type: "frame",
          width,
          height,
          pixels,
          serial: frame.serial,
          quality: frame.quality,
          matrix: frame.matrix,
          front: frame.front,
          selected: frame.selected,
          ms: performance.now() - start,
        },
        [pixels.buffer],
      );
      await yieldTurn();
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    rendering = false;
    if (pending) void renderFrames();
  }
}
self.onmessage = async (event) => {
  const m = event.data;
  try {
    if (m.type === "init") await initialise(m.url, m.layout, m.textureSize);
    else if (m.type === "render") {
      pending = m;
      if (ready) void renderFrames();
    } else if (m.type === "pick" && lastIds.length) {
      const x = Math.max(0, Math.min(lastWidth - 1, Math.floor(m.x * lastWidth))),
        y = Math.max(0, Math.min(lastHeight - 1, Math.floor(m.y * lastHeight)));
      self.postMessage({ type: "pick", id: lastIds[y * lastWidth + x], click: m.click });
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
