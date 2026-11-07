import { Matrix4, OrthographicCamera, Vector3 } from "three";
export const studioAsset = "/models/skills-studio-hd/";
export const studioAspect = 1.5;
export const studioWidth = 20.7;
export const roomBases = Array.from(
  { length: 12 },
  (_, i) => 0.59 + (3 - Math.floor(i / 3)) * 2.45,
);
export const roomCenters = Array.from({ length: 12 }, (_, i) => ((i % 3) - 1) * 4.6);
export type StudioPose = { room: number | null; angle: number; zoom: number; serial: number };
export type StudioHotspot = {
  room: number;
  tool: string;
  label: string;
  center: [number, number, number];
  size: [number, number, number];
};
export type StudioLayout = { rooms: string[]; hotspots: StudioHotspot[] };
let layoutPromise: Promise<StudioLayout> | null = null;
export const loadStudioLayout = () =>
  (layoutPromise ??= fetch(studioAsset + "layout.json")
    .then((r) => {
      if (!r.ok) throw Error("Room details unavailable");
      return r.json();
    })
    .catch((error) => {
      layoutPromise = null;
      throw error;
    }));
export const initialStudioPose: StudioPose = { room: null, angle: 0, zoom: 1, serial: 0 };
export const roomHeadings = [
  "Interfaces, considered",
  "Services, connected",
  "Databases, designed",
  "Intelligence, engineered",
  "Knowledge, retrieved",
  "Machine learning, fine-tuned",
  "A voice for the product",
  "Built to go live",
  "Workflows, connected",
  "Confidence, tested",
  "Payments, connected",
  "Trust, engineered",
];
export function studioCamera(pose: StudioPose, aspect = studioAspect) {
  const target =
    pose.room === null
      ? new Vector3(0.7, 5.05, 0)
      : new Vector3(roomCenters[pose.room], roomBases[pose.room] + 1.05, -0.15);
  const offset =
    pose.room === null
      ? new Vector3(7.5, 11.05, 40).applyAxisAngle(new Vector3(0, 1, 0), (pose.angle * Math.PI) / 6)
      : new Vector3(2.2, 3.7, 15);
  const width = pose.room === null ? studioWidth : 6.1;
  const camera = new OrthographicCamera(
    -width / 2,
    width / 2,
    width / aspect / 2,
    -width / aspect / 2,
    0.1,
    180,
  );
  camera.position.copy(target).add(offset);
  camera.zoom = pose.zoom;
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  Object.assign(camera, { manual: true });
  return { camera, target };
}
export function roomLabel(index: number) {
  return new Vector3(roomCenters[index], roomBases[index] + 2.16, 1.8);
}
export function screenPoint(point: Vector3, camera: OrthographicCamera) {
  const p = point.clone().project(camera);
  return { left: `${(p.x + 1) * 50}%`, top: `${(1 - p.y) * 50}%` };
}
export function previewLabel(index: number, pose: StudioPose) {
  return screenPoint(roomLabel(index), studioCamera(pose).camera);
}
export function roomAtPoint(point: Vector3) {
  if (point.x < -6.85 || point.x > 6.85 || point.y < 0.48 || point.y > 10.25) return null;
  return (
    (3 - Math.min(3, Math.floor((point.y - 0.48) / 2.45))) * 3 +
    Math.min(2, Math.max(0, Math.floor((point.x + 6.9) / 4.6)))
  );
}
export function hotspotAtPoint(point: Vector3, hotspots: StudioHotspot[]) {
  let best = -1,
    volume = Infinity;
  hotspots.forEach((h, i) => {
    const half = h.size.map((x) => x / 2 + 0.045);
    if (
      Math.abs(point.x - h.center[0]) <= half[0] &&
      Math.abs(point.y - h.center[1]) <= half[1] &&
      Math.abs(point.z - h.center[2]) <= half[2]
    ) {
      const v = h.size[0] * h.size[1] * h.size[2];
      if (v < volume) {
        best = i;
        volume = v;
      }
    }
  });
  return best;
}
export function cameraMatrix(camera: OrthographicCamera) {
  camera.updateMatrixWorld();
  return new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    .elements;
}
export const displayTool = (name: string) =>
  ({
    "Hugging Face Hub": "Hugging Face",
    "Hugging Face Transformers": "Transformers",
    "Gemini API": "Gemini",
    "JavaScript (ES6+)": "JavaScript",
  })[name] ?? name;
