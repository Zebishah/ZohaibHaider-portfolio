import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
} from "three";
export function createStudioEnvironment(renderer: WebGLRenderer, warm = false) {
  const room = new Scene();
  room.background = new Color(warm ? "#a69885" : "#4b596b");
  const panels: {
    size: [number, number, number];
    position: [number, number, number];
    color: string;
    power: number;
  }[] = [
    { size: [12, 0.1, 10], position: [0, -3, 0], color: "#e3efff", power: 2 },
    { size: [9, 0.1, 5], position: [0, 5, 0], color: "#ffffff", power: 6 },
    { size: [0.1, 6, 3], position: [-5, 1, 1], color: "#e1f5ff", power: 4 },
    { size: [0.1, 5, 2], position: [5, 2, -1], color: "#ffffff", power: 5 },
    { size: [5, 4, 0.1], position: [1, 1, 6], color: "#ffffff", power: 3 },
    { size: [5, 3, 0.1], position: [-1, 1, -5], color: "#b1deff", power: 2 },
  ];
  for (const p of panels) {
    const material = new MeshBasicMaterial({
      color: new Color(warm ? "#fff1d9" : p.color).multiplyScalar(warm ? p.power * 0.5 : p.power),
    });
    const mesh = new Mesh(new BoxGeometry(...p.size), material);
    mesh.position.set(...p.position);
    room.add(mesh);
  }
  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(room, 0.03);
  generator.dispose();
  for (const child of room.children) {
    const mesh = child as Mesh;
    mesh.geometry.dispose();
    (mesh.material as MeshBasicMaterial).dispose();
  }
  return target;
}
