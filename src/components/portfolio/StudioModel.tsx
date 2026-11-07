import { Canvas, addAfterEffect, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AgXToneMapping,
  Box3,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
  type OrthographicCamera,
  type Object3D,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { skillDomains, domainTools } from "./skillWorld";
import {
  hotspotAtPoint,
  loadStudioLayout,
  roomAtPoint,
  roomLabel,
  studioAsset,
  studioCamera,
  studioWidth,
  type StudioLayout,
} from "./studioScene";
import { createStudioEnvironment } from "./stackStudio";
import type { StudioProps } from "./SkillsStudio";
type Props = StudioProps & { onReady: () => void; onUnavailable: () => void };
function Architecture(props: Props) {
  const gltf = useGLTF(studioAsset + "studio.glb", false, true);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const { camera, gl, scene, invalidate } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const [layout, setLayout] = useState<StudioLayout | null>(null),
    [hover, setHover] = useState<number | null>(null),
    [hoverTool, setHoverTool] = useState<string | null>(null),
    [front, setFront] = useState(true);
  const transition = useRef<{
    start: number;
    from: Vector3;
    to: Vector3;
    fromTarget: Vector3;
    toTarget: Vector3;
    fromZoom: number;
    toZoom: number;
    moving: boolean;
  } | null>(null);
  const animations = useRef<{ neural?: Group; cloud?: Group; cloudY?: number }>({});
  useEffect(() => {
    loadStudioLayout()
      .then(setLayout)
      .catch(() => {});
  }, []);
  useEffect(() => {
    const environment = createStudioEnvironment(gl, true);
    scene.environment = environment.texture;
    scene.background = null;
    invalidate();
    return () => {
      scene.environment = null;
      environment.dispose();
    };
  }, [gl, scene, invalidate]);
  useEffect(() => {
    const neural: Object3D[] = [],
      cloud: Object3D[] = [];
    model.traverse((item) => {
      if (!(item instanceof Mesh)) return;
      let owner: Object3D | null = item;
      while (owner) {
        if (owner.userData.skill && !item.userData.skill)
          item.userData.skill = owner.userData.skill;
        if (owner.userData.room !== undefined && item.userData.room === undefined)
          item.userData.room = owner.userData.room;
        if (owner.name.startsWith("RoomFrame"))
          item.userData.frame = Number(owner.name.match(/RoomFrame_(\d+)/)?.[1]);
        owner = owner.parent;
      }
      if (!Array.isArray(item.material) && item.material.name.startsWith("Baked daylight")) {
        const material = item.material as MeshStandardMaterial;
        item.material = new MeshBasicMaterial({
          map: material.emissiveMap ?? material.map,
          side: DoubleSide,
        });
        item.userData.ownedMaterial = true;
      }
      if (item.userData.frame !== undefined) {
        item.material = (item.material as MeshStandardMaterial).clone();
        item.userData.ownedMaterial = true;
      }
      if (item.userData.skill === "LangGraph") neural.push(item);
      const mat = Array.isArray(item.material) ? item.material[0] : item.material;
      if (item.userData.skill === "AWS Lambda" && mat.name.includes("Warm white")) cloud.push(item);
    });
    const pivot = (parts: Object3D[]) => {
      if (!parts.length) return undefined;
      const bounds = new Box3();
      parts.forEach((o) => bounds.expandByObject(o));
      const group = new Group();
      group.position.copy(bounds.getCenter(new Vector3()));
      model.add(group);
      model.updateMatrixWorld(true);
      parts.forEach((o) => group.attach(o));
      return group;
    };
    animations.current = { neural: pivot(neural), cloud: pivot(cloud) };
    animations.current.cloudY = animations.current.cloud?.position.y;
    invalidate();
    return () =>
      model.traverse((item) => {
        if (item instanceof Mesh && item.userData.ownedMaterial)
          (item.material as MeshStandardMaterial).dispose();
      });
  }, [model, invalidate]);
  useEffect(() => {
    model.traverse((item) => {
      if (!(item instanceof Mesh) || item.userData.frame === undefined) return;
      const index = item.userData.frame;
      item.visible = index === props.selected || index === hover;
      const m = item.material as MeshStandardMaterial;
      m.color.set(index === props.selected ? "#bdd365" : "#719c72");
      m.emissive?.set("#7d9f32");
      m.emissiveIntensity = index === props.selected ? 0.45 : 0.18;
    });
    invalidate();
  }, [props.selected, hover, model, invalidate]);
  useEffect(() => {
    const desired = studioCamera(props.pose),
      zoom = props.pose.zoom * (props.pose.room === null ? 1 : studioWidth / 6.1);
    transition.current = {
      start: performance.now(),
      from: camera.position.clone(),
      to: desired.camera.position,
      fromTarget: controls.current?.target.clone() ?? new Vector3(0.7, 5.05, 0),
      toTarget: desired.target,
      fromZoom: (camera as OrthographicCamera).zoom,
      toZoom: zoom,
      moving: true,
    };
    if (!props.active) {
      camera.position.copy(desired.camera.position);
      (camera as OrthographicCamera).zoom = zoom;
      (camera as OrthographicCamera).updateProjectionMatrix();
      controls.current?.target.copy(desired.target);
      controls.current?.update();
      transition.current.moving = false;
    }
    invalidate();
  }, [props.pose, camera, invalidate]);
  useEffect(() => {
    if (!props.active) return;
    let frame = 0;
    const tick = () => {
      invalidate();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [props.active, invalidate]);
  useFrame(({ clock }) => {
    const t = transition.current;
    if (t?.moving) {
      const progress = props.active ? Math.min(1, (performance.now() - t.start) / 650) : 1,
        ease = 1 - (1 - progress) ** 3;
      camera.position.lerpVectors(t.from, t.to, ease);
      controls.current?.target.lerpVectors(t.fromTarget, t.toTarget, ease);
      (camera as OrthographicCamera).zoom = MathUtils.lerp(t.fromZoom, t.toZoom, ease);
      (camera as OrthographicCamera).updateProjectionMatrix();
      controls.current?.update();
      if (progress === 1) t.moving = false;
      else invalidate();
    }
    if (props.active) {
      if (animations.current.neural)
        animations.current.neural.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.12;
      if (animations.current.cloud)
        animations.current.cloud.position.y =
          (animations.current.cloudY ?? 0) + Math.sin(clock.elapsedTime * 0.9) * 0.035;
    }
  });
  function inspect(event: ThreeEvent<MouseEvent | PointerEvent>) {
    const room = roomAtPoint(event.point);
    let tool = event.object.userData.skill as string | undefined;
    if (!tool && layout) {
      const index = hotspotAtPoint(event.point, layout.hotspots);
      if (index >= 0) tool = layout.hotspots[index].tool;
    }
    return { room, tool };
  }
  return (
    <>
      <ambientLight intensity={0.8} color="#f3f1d9" />
      <directionalLight position={[-6, 14, 10]} intensity={1.8} color="#f3f8e8" />
      <primitive
        object={model}
        dispose={null}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          if (event.delta > 5) return;
          const { room, tool } = inspect(event);
          if (room !== null) {
            event.stopPropagation();
            tool ? props.onInspect(tool, room) : props.onSelect(room);
          }
        }}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          const { room, tool } = inspect(event);
          setHover(room);
          setHoverTool(tool ?? null);
          gl.domElement.style.cursor = tool ? "pointer" : "grab";
        }}
        onPointerOut={() => {
          setHover(null);
          setHoverTool(null);
          gl.domElement.style.cursor = "grab";
        }}
      />
      <ContactShadows
        position={[0, -0.145, 0]}
        opacity={0.24}
        scale={29}
        blur={2.8}
        far={13}
        resolution={512}
        frames={1}
        color="#254b38"
      />
      {front &&
        skillDomains.map((item, index) =>
          props.pose.room !== null && props.pose.room !== index ? null : (
            <Html
              key={item.name}
              position={roomLabel(index)}
              zIndexRange={[9, 1]}
              style={{ pointerEvents: "auto" }}
            >
              <button
                className={
                  "studio-room-label studio-live-label" +
                  (props.selected === index ? " is-selected" : "")
                }
                aria-pressed={props.selected === index}
                onClick={() => props.onSelect(index)}
              >
                <strong>
                  {String(index + 1).padStart(2, "0")} {item.name}
                </strong>
              </button>
            </Html>
          ),
        )}
      {front &&
        props.pose.room !== null &&
        layout?.hotspots
          .filter((h) => h.room === props.selected)
          .map((h, index) => (
            <Html
              key={h.tool}
              position={new Vector3(...h.center).add(new Vector3(0, h.size[1] / 2 + 0.08, 0))}
              zIndexRange={[10, 2]}
            >
              <button
                className="studio-object-pin studio-live-pin"
                title={h.tool}
                aria-label={"Inspect " + h.tool + " object"}
                onClick={() => props.onInspect(h.tool, h.room)}
              >
                {index + 1}
              </button>
            </Html>
          ))}
      {hoverTool && (
        <Html fullscreen zIndexRange={[8, 1]} style={{ pointerEvents: "none" }}>
          <p className="studio-object-tooltip">
            {hoverTool}
            <span>Click the object to explore this skill ↗</span>
          </p>
        </Html>
      )}
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0.7, 5.05, 0]}
        minZoom={0.55}
        maxZoom={9}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI * 0.49}
        enableDamping={props.active}
        dampingFactor={0.1}
        enablePan
        enableRotate
        enableZoom
        rotateSpeed={0.65}
        zoomSpeed={0.85}
        onStart={() => {
          if (transition.current) transition.current.moving = false;
        }}
        onChange={() => {
          setFront(camera.position.z > 0);
          invalidate();
        }}
      />
    </>
  );
}
function RenderHealth({ onReady, onUnavailable }: Pick<Props, "onReady" | "onUnavailable">) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    let reported = false;
    const unsub = addAfterEffect(() => {
      if (!reported && !gl.getContext().isContextLost() && gl.info.render.triangles > 0) {
        reported = true;
        onReady();
      }
    });
    invalidate();
    return () => {
      unsub();
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, invalidate, onReady, onUnavailable]);
  return null;
}

export default function StudioModel(props: Props) {
  const camera = useMemo(
    () => studioCamera({ room: null, angle: 0, zoom: 1, serial: 0 }).camera,
    [],
  );
  return (
    <Canvas
      camera={camera}
      dpr={[1, 1.35]}
      frameloop="demand"
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = AgXToneMapping;
        gl.setClearColor(new Color("#eee4d4"), 0);
        gl.domElement.style.touchAction = "none";
      }}
    >
      <RenderHealth onReady={props.onReady} onUnavailable={props.onUnavailable} />
      <Suspense fallback={null}>
        <Architecture {...props} />
      </Suspense>
    </Canvas>
  );
}
