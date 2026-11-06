import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useRef, type ReactNode } from "react";
import type { Group } from "three";
function Sculpture() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.17;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.14 + state.pointer.y * 0.08;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
  });
  return (
    <group ref={group} rotation={[0.25, 0.3, 0.18]}>
      <mesh>
        <torusKnotGeometry args={[0.85, 0.22, 180, 22, 2, 3]} />
        <meshStandardMaterial color="#9fbf79" metalness={0.72} roughness={0.24} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[(Math.PI / 3) * i, (Math.PI / 2) * i, i * 0.4]}>
          <mesh>
            <torusGeometry args={[1.57 + i * 0.14, 0.012, 8, 110]} />
            <meshStandardMaterial
              color={i === 1 ? "#d3df82" : "#8baf98"}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[1.57 + i * 0.14, 0, 0]}>
            <sphereGeometry args={[0.08, 14, 14]} />
            <meshStandardMaterial color="#e5ebad" emissive="#b9cc67" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function SkillSculpture({ active }: { active: boolean }) {
  return (
    <SceneBoundary>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        fallback={<div className="sculpture-fallback" />}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 3, 4]} intensity={3.5} color="#e6e9bf" />
        <pointLight position={[-3, -2, 2]} intensity={20} color="#b7d8b1" />
        <Sculpture />
      </Canvas>
    </SceneBoundary>
  );
}
