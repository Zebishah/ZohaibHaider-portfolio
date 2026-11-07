import { useEffect, useMemo, useRef, useState } from "react";
import { Matrix4, OrthographicCamera, Vector3 } from "three";
import { skillDomains } from "./skillWorld";
import {
  cameraMatrix,
  loadStudioLayout,
  roomBases,
  roomCenters,
  roomLabel,
  screenPoint,
  studioAspect,
  studioAsset,
  studioCamera,
  studioWidth,
  type StudioLayout,
} from "./studioScene";
import type { StudioProps } from "./SkillsStudio";

type Controls = { yaw: number; pitch: number; distance: number; zoom: number; target: Vector3 };
const fromPose = (pose: StudioProps["pose"]): Controls => {
  const { camera, target } = studioCamera(pose),
    offset = camera.position.clone().sub(target);
  return {
    yaw: Math.atan2(offset.x, offset.z),
    pitch: Math.asin(offset.y / offset.length()),
    distance: offset.length(),
    zoom: pose.zoom * (pose.room === null ? 1 : studioWidth / 6.1),
    target,
  };
};
function makeCamera(c: Controls) {
  const cam = new OrthographicCamera(
    -studioWidth / 2,
    studioWidth / 2,
    studioWidth / studioAspect / 2,
    -studioWidth / studioAspect / 2,
    0.1,
    180,
  );
  cam.position
    .set(
      Math.sin(c.yaw) * Math.cos(c.pitch),
      Math.sin(c.pitch),
      Math.cos(c.yaw) * Math.cos(c.pitch),
    )
    .multiplyScalar(c.distance)
    .add(c.target);
  cam.zoom = c.zoom;
  cam.lookAt(c.target);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  return cam;
}
export default function SoftwareStudio(
  props: StudioProps & { onReady: () => void; onUnavailable: () => void },
) {
  const [controls, setControls] = useState<Controls>(() => fromPose(props.pose));
  const surface = useRef<HTMLDivElement>(null);
  const state = useRef(controls),
    canvas = useRef<HTMLCanvasElement>(null),
    worker = useRef<Worker | null>(null),
    loaded = useRef(false),
    reported = useRef(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    serial = useRef(0),
    generation = useRef(0);
  const [layout, setLayout] = useState<StudioLayout | null>(null),
    [hover, setHover] = useState<number | null>(null);
  const [display, setDisplay] = useState<{ matrix: Matrix4; front: boolean } | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const camera = useMemo(() => makeCamera(controls), [controls]);
  const sendRef = useRef<(quality?: boolean) => void>(() => {});
  state.current = controls;
  function post(quality = false) {
    if (!loaded.current || !canvas.current) return;
    const rect = canvas.current.getBoundingClientRect();
    const frameCamera = makeCamera(state.current);
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    const width = Math.max(
      240,
      quality
        ? desktop
          ? 3840
          : Math.min(1920, rect.width * Math.min(3, Math.max(2, devicePixelRatio)))
        : Math.min(desktop ? 1440 : 960, rect.width * (desktop ? 1.1 : 1.5)),
    );
    const message = {
      type: "render",
      width: Math.round(width),
      height: Math.round(width / studioAspect),
      matrix: cameraMatrix(frameCamera),
      front: frameCamera.position.z > 0,
      quality,
      selected: propsRef.current.selected,
      serial: ++serial.current,
    };
    canvas.current.dataset.requestSerial = String(message.serial);
    canvas.current.dataset.quality = "pending";
    // The worker cancels obsolete detail frames between triangle batches.
    worker.current?.postMessage(message);
  }
  sendRef.current = post;
  useEffect(() => {
    const w = new Worker(new URL("./studioSoftware.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.current = w;
    let stopped = false;
    loadStudioLayout()
      .then((data) => {
        if (stopped) return;
        setLayout(data);
        w.postMessage({
          type: "init",
          url: new URL(studioAsset + "studio.glb", location.href).href,
          layout: data,
          textureSize: window.matchMedia("(min-width: 900px)").matches ? 4096 : 2048,
        });
      })
      .catch(() => propsRef.current.onUnavailable());
    w.onmessage = (event) => {
      const m = event.data;
      if (m.type === "ready") {
        loaded.current = true;
        if (canvas.current) {
          canvas.current.dataset.modelTriangles = String(m.triangles);
          canvas.current.dataset.lightmaps = String(m.textures);
          canvas.current.dataset.textureSize = String(m.textureSize);
        }
        sendRef.current(true);
      } else if (m.type === "frame") {
        if (m.quality && m.serial < serial.current) return;
        const c = canvas.current;
        if (!c) return;
        c.width = m.width;
        c.height = m.height;
        c.dataset.frameMs = String(Math.round(m.ms));
        c.dataset.frameSerial = String(m.serial);
        c.dataset.quality = m.quality ? "detail" : "interactive";
        c.getContext("2d")!.putImageData(new ImageData(m.pixels, m.width, m.height), 0, 0);
        // A thin frame follows real room geometry, never a flat image position.
        const index = m.selected,
          projection = new Matrix4().fromArray(m.matrix),
          ctx = c.getContext("2d")!;
        // Labels and geometry must use the same completed camera frame.
        setDisplay({ matrix: projection, front: m.front });
        const points = [
          [-2.14, 0.03],
          [2.14, 0.03],
          [2.14, 2.12],
          [-2.14, 2.12],
        ].map(([x, y]) =>
          new Vector3(roomCenters[index] + x, roomBases[index] + y, 1.48).applyMatrix4(projection),
        );
        if (m.front) {
          ctx.strokeStyle = "#bacf62";
          ctx.lineWidth = Math.max(1.5, m.width / c.getBoundingClientRect().width);
          ctx.beginPath();
          points.forEach((p, i) => {
            const x = ((p.x + 1) * m.width) / 2,
              y = ((1 - p.y) * m.height) / 2;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          });
          ctx.closePath();
          ctx.stroke();
        }
        if (!reported.current && m.quality) {
          reported.current = true;
          propsRef.current.onReady();
        }
      } else if (m.type === "pick") {
        if (m.click) {
          if (m.id >= 100) {
            loadStudioLayout().then((l) => {
              const h = l.hotspots[m.id - 100];
              if (h) propsRef.current.onInspect(h.tool, h.room);
            });
          } else if (m.id > 0) propsRef.current.onSelect(m.id - 1);
        } else setHover(m.id >= 100 ? m.id - 100 : null);
      } else if (m.type === "error") {
        console.warn("Studio software renderer:", m.message);
        propsRef.current.onUnavailable();
      }
    };
    const observer = new ResizeObserver(() => sendRef.current(true));
    if (canvas.current) observer.observe(canvas.current);
    return () => {
      stopped = true;
      observer.disconnect();
      w.terminate();
      loaded.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    sendRef.current(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => sendRef.current(true), 350);
  }, [controls, props.selected]);
  useEffect(() => {
    const id = ++generation.current,
      destination = fromPose(props.pose),
      start = performance.now(),
      origin = state.current;
    function step() {
      if (generation.current !== id) return;
      const t = props.active ? Math.min(1, (performance.now() - start) / 550) : 1,
        e = 1 - (1 - t) ** 3;
      setControls({
        yaw: origin.yaw + (destination.yaw - origin.yaw) * e,
        pitch: origin.pitch + (destination.pitch - origin.pitch) * e,
        distance: origin.distance + (destination.distance - origin.distance) * e,
        zoom: origin.zoom + (destination.zoom - origin.zoom) * e,
        target: origin.target.clone().lerp(destination.target, e),
      });
      if (t < 1) requestAnimationFrame(step);
    }
    step();
  }, [props.pose]);
  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    const pointers = new Map<number, { x: number; y: number }>();
    const buttonPointers = new Set<number>();
    let origin: { x: number; y: number } | null = null,
      moved = false,
      pinch = 0;
    const update = (next: Controls) => {
      state.current = next;
      setControls(next);
    };
    const down = (e: PointerEvent) => {
      generation.current++;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      origin = { x: e.clientX, y: e.clientY };
      moved = false;
      const button = (e.target as HTMLElement).closest("button");
      if (button) buttonPointers.add(e.pointerId);
      else element.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        moved = true;
        for (const id of pointers.keys()) element.setPointerCapture(id);
        const p = [...pointers.values()];
        pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      }
    };
    const move = (e: PointerEvent) => {
      const previous = pointers.get(e.pointerId);
      if (previous) {
        const dx = e.clientX - previous.x,
          dy = e.clientY - previous.y;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (origin && Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > 4) moved = true;
        if (!moved && buttonPointers.has(e.pointerId)) return;
        if (moved && buttonPointers.has(e.pointerId)) element.setPointerCapture(e.pointerId);
        if (pointers.size === 2) {
          const p = [...pointers.values()],
            distance = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
          if (pinch)
            update({
              ...state.current,
              zoom: Math.max(0.55, Math.min(9, (state.current.zoom * distance) / pinch)),
            });
          pinch = distance;
        } else if (e.buttons === 2 || e.shiftKey) {
          const c = makeCamera(state.current),
            right = new Vector3().setFromMatrixColumn(c.matrixWorld, 0),
            up = new Vector3().setFromMatrixColumn(c.matrixWorld, 1),
            scale = studioWidth / state.current.zoom / element.getBoundingClientRect().width;
          update({
            ...state.current,
            target: state.current.target
              .clone()
              .addScaledVector(right, -dx * scale)
              .addScaledVector(up, dy * scale),
          });
        } else
          update({
            ...state.current,
            yaw: state.current.yaw - dx * 0.007,
            pitch: Math.max(0.08, Math.min(1.35, state.current.pitch + dy * 0.005)),
          });
      } else {
        const rect = element.getBoundingClientRect();
        worker.current?.postMessage({
          type: "pick",
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
          click: false,
        });
      }
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      const wasButton = buttonPointers.delete(e.pointerId);
      if (!moved && origin && !wasButton) {
        const r = element.getBoundingClientRect();
        worker.current?.postMessage({
          type: "pick",
          x: (e.clientX - r.left) / r.width,
          y: (e.clientY - r.top) / r.height,
          click: true,
        });
      }
      origin = null;
      pinch = 0;
      sendRef.current(true);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      generation.current++;
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      update({
        ...state.current,
        zoom: Math.max(0.55, Math.min(9, state.current.zoom * Math.exp(-delta * 0.0015))),
      });
    };
    const cancel = () => {
      pointers.clear();
      buttonPointers.clear();
      origin = null;
      pinch = 0;
      setHover(null);
    };
    const context = (e: Event) => e.preventDefault();
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", cancel);
    const leave = () => setHover(null);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("contextmenu", context);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", cancel);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("contextmenu", context);
    };
  }, []);
  const hovered = hover === null ? null : layout?.hotspots[hover];
  const front = display?.front ?? camera.position.z > 0;
  function project(point: Vector3) {
    if (!display) return screenPoint(point, camera);
    const p = point.clone().applyMatrix4(display.matrix);
    return { left: `${(p.x + 1) * 50}%`, top: `${(1 - p.y) * 50}%` };
  }
  return (
    <div
      ref={surface}
      className="studio-software"
      style={{ touchAction: "none" }}
      data-camera={JSON.stringify({ yaw: controls.yaw, zoom: controls.zoom })}
    >
      <canvas
        ref={canvas}
        aria-label="Three-dimensional architectural skills studio. Drag to rotate, scroll to zoom, or use the room controls."
        style={{ cursor: hovered ? "pointer" : "grab", touchAction: "none" }}
      />
      <div className="studio-preview-labels">
        {front &&
          skillDomains.map((item, index) =>
            props.pose.room !== null && props.pose.room !== index ? null : (
              <button
                key={item.name}
                className={"studio-room-label" + (props.selected === index ? " is-selected" : "")}
                style={project(roomLabel(index))}
                onClick={() => props.onSelect(index)}
                aria-pressed={props.selected === index}
              >
                <strong>
                  {String(index + 1).padStart(2, "0")} {item.name}
                </strong>
              </button>
            ),
          )}
        {front &&
          props.pose.room !== null &&
          layout?.hotspots
            .filter((h) => h.room === props.selected)
            .map((h, index) => (
              <button
                className="studio-object-pin"
                key={h.tool}
                style={project(
                  new Vector3(...h.center).add(new Vector3(0, h.size[1] / 2 + 0.08, 0)),
                )}
                onClick={() => props.onInspect(h.tool, h.room)}
                aria-label={"Inspect " + h.tool + " object"}
                title={h.tool}
              >
                {index + 1}
              </button>
            ))}
      </div>
      {hovered && (
        <p className="studio-object-tooltip">
          {hovered.tool}
          <span>Click the object to explore this skill ↗</span>
        </p>
      )}
    </div>
  );
}
