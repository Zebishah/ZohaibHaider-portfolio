/// <reference lib="webworker" />
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { Color, Matrix3, Mesh, MeshStandardMaterial, Vector2, Vector3 } from "three";
import { hotspotAtPoint, roomAtPoint, type StudioLayout } from "./studioScene";

type Raster = {
  memory: WebAssembly.Memory;
  draw: (...args: number[]) => void;
  __heap_base: WebAssembly.Global;
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
  th = 1;
let width = 0,
  height = 0,
  ready = false;
const MAX_WIDTH = 1920,
  MAX_HEIGHT = 1280;
function reserve(bytes: number) {
  const p = arena;
  arena = (arena + bytes + 15) & ~15;
  return p;
}
let arena = 0;
function colorByte(v: number) {
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}
async function initialise(url: string, layout: StudioLayout) {
  const [wasm, gltf] = await Promise.all([
    fetch("/models/studio-raster.wasm")
      .then((r) => r.arrayBuffer())
      .then((b) => WebAssembly.instantiate(b, {})),
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url),
  ]);
  raster = wasm.instance.exports as unknown as Raster;
  const meshes: Mesh[] = [];
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (o instanceof Mesh) {
      let parent = o as typeof o | null;
      while (parent) {
        if (parent.name.startsWith("RoomFrame")) return;
        parent = parent.parent as typeof o | null;
      }
      const mat = (
        Array.isArray(o.material) ? o.material[0] : o.material
      ) as MeshStandardMaterial & { transmission?: number };
      if ((mat.transmission ?? 0) > 0.5 || mat.opacity < 0.5) return;
      meshes.push(o);
      nv += o.geometry.attributes.position.count;
      nt += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    }
  });
  let image: CanvasImageSource | undefined;
  for (const mesh of meshes) {
    const mat = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial;
    const map = mat.emissiveMap ?? mat.map;
    if (map?.image) {
      image = map.image as CanvasImageSource;
      break;
    }
  }
  const textureCanvas = new OffscreenCanvas(2048, 2048);
  const tc = textureCanvas.getContext("2d", { willReadFrequently: true })!;
  if (image) {
    tc.drawImage(image, 0, 0, 2048, 2048);
    tw = 2048;
    th = 2048;
  }
  const tex = image
    ? tc.getImageData(0, 0, tw, th).data
    : new Uint8ClampedArray([255, 255, 255, 255]);
  arena = Number(raster.__heap_base.value);
  vp = reserve(nv * 5 * 4);
  tp = reserve(nt * 6 * 4);
  mp = reserve(16 * 4);
  pp = reserve(nv * 4 * 4);
  px = reserve(MAX_WIDTH * MAX_HEIGHT * 4);
  dp = reserve(MAX_WIDTH * MAX_HEIGHT * 4);
  ip = reserve(MAX_WIDTH * MAX_HEIGHT * 4);
  tx = reserve(tw * th * 4);
  if (arena > raster.memory.buffer.byteLength)
    raster.memory.grow(Math.ceil((arena - raster.memory.buffer.byteLength) / 65536));
  new Uint8Array(raster.memory.buffer, tx, tex.length).set(tex);
  const vertices = new Float32Array(raster.memory.buffer, vp, nv * 5),
    triangles = new Uint32Array(raster.memory.buffer, tp, nt * 6);
  let base = 0,
    tri = 0;
  const v = new Vector3(),
    normal = new Vector3(),
    centroid = new Vector3(),
    normalMatrix = new Matrix3();
  for (const mesh of meshes) {
    const g = mesh.geometry,
      p = g.attributes.position,
      uv = g.attributes.uv,
      n = g.attributes.normal;
    const mat = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial;
    const map = mat.emissiveMap ?? mat.map,
      mapped = !!map;
    map?.updateMatrix();
    const coordinate = new Vector2();
    normalMatrix.getNormalMatrix(mesh.matrixWorld);
    const c = mat.color?.clone() ?? new Color("#eee4d4");
    const emit = mat.emissive?.clone();
    const emitting =
      !!emit && emit.r + emit.g + emit.b > 0.001 && (mat.emissiveIntensity ?? 0) > 0.1;
    if (emitting) c.copy(emit!);
    c.convertLinearToSRGB();
    for (let i = 0; i < p.count; i++) {
      v.set(p.getX(i), p.getY(i), p.getZ(i)).applyMatrix4(mesh.matrixWorld);
      coordinate.set(uv?.getX(i) ?? 0, uv?.getY(i) ?? 0);
      if (map) coordinate.applyMatrix3(map.matrix);
      const at = (base + i) * 5;
      vertices[at] = v.x;
      vertices[at + 1] = v.y;
      vertices[at + 2] = v.z;
      vertices[at + 3] = coordinate.x;
      vertices[at + 4] = coordinate.y;
    }
    const count = g.index?.count ?? p.count;
    for (let i = 0; i < count; i += 3) {
      const a = g.index?.getX(i) ?? i,
        b = g.index?.getX(i + 1) ?? i + 1,
        cidx = g.index?.getX(i + 2) ?? i + 2;
      const ia = (base + a) * 5,
        ib = (base + b) * 5,
        ic = (base + cidx) * 5;
      centroid.set(
        (vertices[ia] + vertices[ib] + vertices[ic]) / 3,
        (vertices[ia + 1] + vertices[ib + 1] + vertices[ic + 1]) / 3,
        (vertices[ia + 2] + vertices[ib + 2] + vertices[ic + 2]) / 3,
      );
      const h = hotspotAtPoint(centroid, layout.hotspots),
        room = roomAtPoint(centroid);
      normal
        .set(n?.getX(a) ?? 0, n?.getY(a) ?? 1, n?.getZ(a) ?? 0)
        .applyMatrix3(normalMatrix)
        .normalize();
      const light = emitting
        ? 1
        : Math.min(
            1,
            0.66 + Math.max(0, normal.y * 0.65 + normal.z * 0.6 - normal.x * 0.35) * 0.34,
          );
      const col =
        (colorByte(c.r * light) |
          (colorByte(c.g * light) << 8) |
          (colorByte(c.b * light) << 16) |
          0xff000000) >>>
        0;
      const at = tri++ * 6;
      triangles[at] = base + a;
      triangles[at + 1] = base + b;
      triangles[at + 2] = base + cidx;
      triangles[at + 3] = col;
      triangles[at + 4] = mapped ? 1 : 0;
      triangles[at + 5] = h >= 0 ? 100 + h : room === null ? 0 : 1 + room;
    }
    base += p.count;
  }
  ready = true;
  self.postMessage({ type: "ready", triangles: nt });
}
self.onmessage = async (event) => {
  const m = event.data;
  try {
    if (m.type === "init") await initialise(m.url, m.layout);
    else if (m.type === "render" && ready) {
      width = Math.min(MAX_WIDTH, m.width);
      height = Math.min(MAX_HEIGHT, m.height);
      new Float32Array(raster.memory.buffer, mp, 16).set(m.matrix);
      const start = performance.now();
      raster.draw(
        width,
        height,
        nv,
        nt,
        vp,
        tp,
        mp,
        pp,
        px,
        dp,
        ip,
        tx,
        tw,
        th,
        m.quality ? 1 : 0,
        m.selected,
      );
      const pixels = new Uint8ClampedArray(raster.memory.buffer, px, width * height * 4).slice();
      self.postMessage(
        { type: "frame", width, height, pixels, serial: m.serial, ms: performance.now() - start },
        [pixels.buffer],
      );
    } else if (m.type === "pick" && ready) {
      const x = Math.max(0, Math.min(width - 1, Math.floor(m.x * width))),
        y = Math.max(0, Math.min(height - 1, Math.floor(m.y * height)));
      const id = new Uint32Array(raster.memory.buffer, ip, width * height)[y * width + x];
      self.postMessage({ type: "pick", id, click: m.click });
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
