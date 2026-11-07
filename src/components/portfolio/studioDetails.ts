import {
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from "three";

// Shared by WebGL and the worker so the room keeps its identity in both renderers.
export function createTrainingLab() {
  // Keep text pixels square in the software mip chain. A wide image stretched
  // into a square atlas selects overly coarse mips and makes the sign blurry.
  const canvas = new OffscreenCanvas(1600, 1600);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#123d30";
  ctx.fillRect(0, 0, 1600, 1600);
  ctx.strokeStyle = "#7f9c74";
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 1596, 236);
  ctx.fillStyle = "#c8da82";
  ctx.font = "600 23px sans-serif";
  ctx.fillText("06 / MODEL TRAINING LAB", 30, 43);
  ctx.fillStyle = "#faf5e8";
  ctx.font = "600 43px sans-serif";
  ctx.fillText("Machine Learning", 30, 100);
  ctx.font = "400 29px sans-serif";
  ctx.fillText("& Fine-tuning", 30, 146);
  ctx.fillStyle = "#b4c6ac";
  ctx.font = "22px sans-serif";
  ctx.fillText("PyTorch  /  LoRA  /  QLoRA", 30, 202);

  const steps = ["BASE MODEL", "LoRA ADAPTER", "TUNED MODEL"];
  ctx.textAlign = "center";
  steps.forEach((label, i) => {
    const x = 565 + i * 197;
    ctx.fillStyle = i === 1 ? "#c8da82" : "#315c49";
    ctx.fillRect(x, 88, 168, 64);
    ctx.fillStyle = i === 1 ? "#123d30" : "#faf5e8";
    ctx.font = "600 19px sans-serif";
    ctx.fillText(label, x + 84, 127);
    if (i < 2) {
      ctx.strokeStyle = "#c8da82";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 174, 120);
      ctx.lineTo(x + 191, 120);
      ctx.lineTo(x + 185, 114);
      ctx.moveTo(x + 191, 120);
      ctx.lineTo(x + 185, 126);
      ctx.stroke();
    }
  });
  ctx.fillStyle = "#b4c6ac";
  ctx.font = "21px sans-serif";
  ctx.fillText("TRAIN  →  ADAPT  →  EVALUATE", 845, 202);
  ctx.textAlign = "left";
  ctx.fillStyle = "#faf5e8";
  ctx.font = "600 22px sans-serif";
  ctx.fillText("TRAINING LOSS", 1235, 43);
  ctx.strokeStyle = "#6c8b71";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1235, 65);
  ctx.lineTo(1235, 181);
  ctx.lineTo(1555, 181);
  ctx.stroke();
  ctx.strokeStyle = "#c8da82";
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const x = 1248 + i * 5;
    const y = 78 + 91 * (1 - Math.exp(-i / 15)) + Math.sin(i * 1.4) * 4 * (1 - i / 65);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#b4c6ac";
  ctx.font = "19px sans-serif";
  ctx.fillText("optimization steps →", 1290, 214);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.flipY = false;
  const geometry = new PlaneGeometry(4.04, 0.606);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, (1 - uv.getY(i)) * (240 / 1600));
  const material = new MeshBasicMaterial({ map: texture, side: DoubleSide, toneMapped: false });
  material.name = "Training lab signage";
  const panel = new Mesh(geometry, material);
  panel.name = "Machine learning training diagram";
  // Suspend it just inside the opening: the ceiling hides the rear wall in
  // the overview camera, so a wall-mounted sign would disappear from view.
  panel.position.set(4.6, 7.14, 1.35);
  panel.userData = { room: 5, skill: "LoRA" };
  for (const x of [-1.9, 1.9]) {
    const support = new Mesh(
      new CylinderGeometry(0.008, 0.008, 0.217, 6),
      new MeshBasicMaterial({ color: "#34463a" }),
    );
    support.position.set(x, 0.412, 0);
    support.userData.trainingLabSupport = true;
    panel.add(support);
  }
  return panel;
}
