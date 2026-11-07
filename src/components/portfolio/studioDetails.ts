import {
  BoxGeometry,
  CanvasTexture,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  type Object3D,
} from "three";
import { roomBases, roomCenters } from "./studioScene";

// The actual monitors and small corner markers carry the category artwork.
// A single atlas keeps all twelve rooms consistent without extra texture loads.
const rooms = [
  {
    title: "INTERFACE DESIGN",
    tools: "React / TypeScript / UI systems",
    accent: "#87c4cf",
    desk: [-0.65, 0.48],
    skill: "React",
  },
  {
    title: "BACKEND & APIs",
    tools: "FastAPI / Node.js / REST APIs",
    accent: "#d8b17e",
    desk: [-1, 0.45],
    skill: "FastAPI",
  },
  {
    title: "DATABASE SYSTEMS",
    tools: "PostgreSQL / MongoDB / Redis",
    accent: "#8ac4ac",
    desk: [-1.2, 0.45],
    skill: "SQLAlchemy",
  },
  {
    title: "AI AGENTS",
    tools: "LangGraph / Tools / Memory",
    accent: "#c4d568",
    desk: [1, 0.58],
    skill: "Tool Calling",
  },
  {
    title: "SEARCH & RETRIEVAL",
    tools: "RAG / Embeddings / Qdrant",
    accent: "#bba9db",
    desk: [-1, 0.48],
    skill: "RAG",
  },
  {
    title: "MODEL TRAINING",
    tools: "PyTorch / LoRA / QLoRA",
    accent: "#e0a17e",
    desk: [-0.95, 0.48],
    skill: "LoRA",
  },
  {
    title: "VOICE & AUDIO",
    tools: "Whisper / Speech-to-Text / TTS",
    accent: "#d5a5bc",
    desk: [0.75, 0.5],
    skill: "Groq Audio API",
  },
  {
    title: "CLOUD DEPLOYMENT",
    tools: "Docker / AWS / CI/CD",
    accent: "#a1bfdf",
    desk: [-1.1, 0.48],
    skill: "GitHub Actions",
  },
  {
    title: "WORKFLOW AUTOMATION",
    tools: "n8n / MCP / Webhooks",
    accent: "#dcc47e",
    desk: [1, 0.48],
    skill: "MCP",
  },
  {
    title: "TESTING & QUALITY",
    tools: "pytest / Playwright / Vitest",
    accent: "#abd29a",
    desk: [0.75, 0.48],
    skill: "pytest",
  },
  {
    title: "PAYMENTS & FINTECH",
    tools: "Stripe / Subscriptions / Payouts",
    accent: "#beaee0",
    desk: [-0.9, 0.48],
    skill: "Stripe Connect",
  },
  {
    title: "SECURITY & SYSTEMS",
    tools: "OAuth / RBAC / Tenant isolation",
    accent: "#a5c3b6",
    desk: [1, 0.48],
    skill: "System Design",
  },
] as const;

type Context = OffscreenCanvasRenderingContext2D;
const ink = "#152f2c";
const paper = "#f4eedf";
function line(ctx: Context, points: number[][]) {
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  });
  ctx.stroke();
}
function box(ctx: Context, x: number, y: number, w: number, h: number) {
  ctx.strokeRect(x, y, w, h);
}
function dot(ctx: Context, x: number, y: number, radius = 5) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
function symbol(ctx: Context, index: number) {
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const paths = [
    "M8 12h48v40H8z M8 23h48 M18 31h10v13H18z M35 32h13 M35 41h13",
    "M10 8h44v12H10z M10 26h44v12H10z M10 44h44v12H10z M44 14h2 M44 32h2 M44 50h2",
    "M10 15C10 5 54 5 54 15S10 25 10 15 M10 15v34c0 10 44 10 44 0V15 M10 31c0 10 44 10 44 0",
    "M12 16l20 16 20-16 M12 48l20-16 20 16 M12 16v32 M52 16v32",
    "M38 13H10v40h28 M17 22h14 M17 30h10 M45 39l12 14 M49 28a12 12 0 1 1-24 0 12 12 0 0 1 24 0",
    "M16 16h32v32H16z M24 2v14 M40 2v14 M24 48v14 M40 48v14 M2 24h14 M2 40h14 M48 24h14 M48 40h14 M23 39l7-9 6 5 6-12",
    "M25 10a7 7 0 0 1 14 0v22a7 7 0 0 1-14 0z M17 27v5a15 15 0 0 0 30 0v-5 M32 47v11 M23 58h18",
    "M14 42a12 12 0 0 1-1-24 18 18 0 0 1 35-2 13 13 0 0 1 2 26H14 M32 28v28 M24 48l8 8 8-8",
    "M5 24h15v16H5z M44 5h15v16H44z M44 43h15v16H44z M20 32h12V13h12 M32 32v19h12",
    "M8 10h12v12H8z M8 29h12v12H8z M8 48h12v12H8z M30 16h26 M30 35h26 M30 54h26 M9 15l4 4 8-10",
    "M6 14h52v36H6z M6 25h52 M14 38h14 M38 38h10",
    "M32 5l22 9v17c0 13-22 25-22 25S10 44 10 31V14z M24 29l6 6 12-14",
  ];
  ctx.stroke(new Path2D(paths[index]));
  if (index === 3)
    for (const [x, y] of [
      [12, 16],
      [32, 32],
      [52, 16],
      [12, 48],
      [52, 48],
    ])
      dot(ctx, x, y, 4);
}

function screen(ctx: Context, index: number) {
  const accent = rooms[index].accent;
  ctx.fillStyle = "#122d29";
  ctx.fillRect(0, 0, 512, 288);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 512, 5);
  ctx.font = "600 25px sans-serif";
  ctx.fillText(rooms[index].title, 24, 42);
  ctx.save();
  ctx.translate(24, 66);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.font = "500 19px sans-serif";
  switch (index) {
    case 0:
      box(ctx, 0, 0, 464, 158);
      line(ctx, [
        [0, 25],
        [464, 25],
      ]);
      box(ctx, 14, 42, 68, 101);
      ctx.fillRect(101, 43, 240, 10);
      for (let i = 0; i < 3; i++) {
        box(ctx, 101 + i * 119, 73, 105, 69);
        ctx.fillRect(113 + i * 119, 85, 80, 16);
      }
      break;
    case 1:
      ctx.fillText("GET /api", 0, 24);
      ctx.fillText("POST /events", 0, 62);
      for (let i = 0; i < 3; i++) {
        box(ctx, 200, i * 53, 260, 39);
        ctx.fillText(["REQUEST", "SERVICE", "RESPONSE"][i], 218, 26 + i * 53);
        if (i < 2)
          line(ctx, [
            [330, i * 53 + 39],
            [330, i * 53 + 53],
          ]);
      }
      break;
    case 2:
      for (let i = 0; i < 3; i++) {
        const x = i * 160;
        box(ctx, x, 14, 138, 123);
        ctx.fillRect(x, 14, 138, 27);
        ctx.save();
        ctx.fillStyle = ink;
        ctx.fillText(["USERS", "ORDERS", "ITEMS"][i], x + 10, 34);
        ctx.restore();
        for (let j = 0; j < 3; j++) ctx.fillRect(x + 13, 56 + j * 25, j ? 80 : 48, 5);
        if (i < 2)
          line(ctx, [
            [x + 138, 78],
            [x + 160, 78],
          ]);
      }
      break;
    case 3: {
      const points = [
        [45, 80],
        [180, 20],
        [180, 140],
        [305, 80],
        [425, 25],
        [425, 140],
      ];
      for (const [a, b] of [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [3, 5],
      ])
        line(ctx, [points[a], points[b]]);
      points.forEach(([x, y]) => dot(ctx, x, y, 14));
      ctx.fillText("PLAN", 5, 126);
      ctx.fillText("TOOLS", 140, 78);
      ctx.fillText("MEMORY", 338, 89);
      break;
    }
    case 4:
      for (let i = 0; i < 3; i++) {
        box(ctx, i * 18, i * 18, 82, 108);
        line(ctx, [
          [14 + i * 18, 30 + i * 18],
          [63 + i * 18, 30 + i * 18],
        ]);
      }
      ctx.save();
      ctx.translate(160, 38);
      ctx.scale(1.1, 1.1);
      symbol(ctx, 4);
      ctx.restore();
      line(ctx, [
        [125, 85],
        [155, 85],
      ]);
      line(ctx, [
        [244, 85],
        [282, 85],
      ]);
      box(ctx, 292, 28, 168, 108);
      ctx.fillText("ANSWER", 311, 60);
      for (let i = 0; i < 3; i++) ctx.fillRect(310, 76 + i * 17, 126 - i * 20, 4);
      break;
    case 5:
      line(ctx, [
        [12, 6],
        [12, 143],
        [300, 143],
      ]);
      line(
        ctx,
        Array.from({ length: 45 }, (_, i) => [
          24 + i * 6,
          18 + 111 * (1 - Math.exp(-i / 9)) + Math.sin(i) * 3,
        ]),
      );
      ctx.fillText("TRAINING LOSS", 35, 19);
      box(ctx, 326, 30, 133, 52);
      ctx.fillText("LoRA", 366, 63);
      ctx.fillText("ADAPT", 357, 121);
      break;
    case 6:
      ctx.save();
      ctx.translate(0, 28);
      ctx.scale(1.5, 1.5);
      symbol(ctx, 6);
      ctx.restore();
      for (let i = 0; i < 29; i++) {
        const height = 12 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 100;
        ctx.fillRect(120 + i * 12, 80 - height / 2, 6, height);
      }
      ctx.fillText("SPEECH → TEXT → VOICE", 121, 154);
      break;
    case 7:
      ctx.save();
      ctx.translate(8, 7);
      ctx.scale(2, 2);
      symbol(ctx, 7);
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        box(ctx, 181, 3 + i * 53, 278, 40);
        ctx.fillText(["BUILD", "CONTAINER", "DEPLOY"][i], 199, 30 + i * 53);
        if (i < 2)
          line(ctx, [
            [320, i * 53 + 43],
            [320, i * 53 + 56],
          ]);
      }
      break;
    case 8:
      for (const [x, y, label] of [
        [0, 58, "TRIGGER"],
        [183, 8, "ACTION"],
        [183, 108, "ACTION"],
        [363, 58, "DONE"],
      ] as const) {
        box(ctx, x, y, 100, 42);
        ctx.fillText(label, x + 8, y + 28);
      }
      line(ctx, [
        [100, 79],
        [140, 79],
        [140, 29],
        [183, 29],
      ]);
      line(ctx, [
        [140, 79],
        [140, 129],
        [183, 129],
      ]);
      line(ctx, [
        [283, 29],
        [324, 29],
        [324, 129],
        [283, 129],
      ]);
      line(ctx, [
        [324, 79],
        [363, 79],
      ]);
      break;
    case 9:
      ["UNIT TESTS", "API TESTS", "BROWSER TESTS"].forEach((label, i) => {
        line(ctx, [
          [6, 21 + i * 51],
          [17, 33 + i * 51],
          [39, 8 + i * 51],
        ]);
        ctx.fillText(label, 61, 31 + i * 51);
        ctx.fillRect(296, 15 + i * 51, 160, 13);
      });
      break;
    case 10:
      box(ctx, 4, 17, 211, 126);
      ctx.fillRect(4, 44, 211, 19);
      box(ctx, 23, 85, 34, 28);
      ctx.fillRect(80, 106, 65, 5);
      ["CHECKOUT", "SUBSCRIPTIONS", "PAYOUTS"].forEach((label, i) =>
        ctx.fillText(label, 254, 35 + i * 47),
      );
      break;
    case 11:
      ctx.save();
      ctx.translate(5, 0);
      ctx.scale(2.5, 2.5);
      symbol(ctx, 11);
      ctx.restore();
      ["IDENTITY", "PERMISSIONS", "TENANT BOUNDARY"].forEach((label, i) => {
        box(ctx, 210, 2 + i * 53, 250, 40);
        ctx.fillText(label, 221, 29 + i * 53);
      });
      break;
  }
  ctx.restore();
  ctx.fillStyle = "#c6d3c8";
  ctx.font = "18px sans-serif";
  ctx.fillText(rooms[index].tools, 24, 269);
}

export function createRoomDetails() {
  const canvas = new OffscreenCanvas(2048, 2048);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, 2048, 2048);
  rooms.forEach((room, index) => {
    ctx.save();
    ctx.translate((index % 4) * 512, Math.floor(index / 4) * 512);
    screen(ctx, index);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 320, 192, 192);
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(96, 416, 79, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = room.accent;
    ctx.fillStyle = room.accent;
    ctx.translate(48, 368);
    ctx.scale(1.5, 1.5);
    symbol(ctx, index);
    ctx.restore();
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.flipY = false;
  const material = new MeshBasicMaterial({ map: texture, side: DoubleSide, toneMapped: false });
  material.name = "Room category artwork";
  const frameMaterial = new MeshBasicMaterial({ color: paper, toneMapped: false });
  frameMaterial.name = "Room marker limestone";
  const frameGeometry = new BoxGeometry(0.54, 0.54, 0.035);
  const details = new Group();
  details.name = "Studio room identities";
  const plane = (index: number, width: number, height: number, region: number[]) => {
    const geometry = new PlaneGeometry(width, height);
    const uv = geometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(
        i,
        ((index % 4) * 512 + region[0] + uv.getX(i) * region[2]) / 2048,
        (Math.floor(index / 4) * 512 + region[1] + (1 - uv.getY(i)) * region[3]) / 2048,
      );
    }
    return new Mesh(geometry, material);
  };
  rooms.forEach((room, index) => {
    const x = roomCenters[index],
      y = roomBases[index];
    const display = plane(index, 1.0452, 0.5746, [0, 0, 512, 288]);
    display.name = room.title + " monitor";
    display.position.set(x + room.desk[0] - 0.08, y + 1.2482, -room.desk[1] - 0.08);
    display.userData = { room: index, skill: room.skill };
    const frame = new Mesh(frameGeometry, frameMaterial);
    frame.name = room.title + " corner marker frame";
    frame.position.set(x - 1.95, y + 1.78, 1.4);
    frame.userData.room = index;
    const marker = plane(index, 0.5, 0.5, [0, 320, 192, 192]);
    marker.name = room.title + " corner marker";
    marker.position.set(x - 1.95, y + 1.78, 1.42);
    marker.userData.room = index;
    details.add(display, frame, marker);
  });
  return details;
}

export function disposeRoomDetails(model: Object3D) {
  const geometries = new Set<PlaneGeometry | BoxGeometry>();
  const materials = new Set<MeshBasicMaterial>();
  model.getObjectByName("Studio room identities")?.traverse((item) => {
    if (!(item instanceof Mesh)) return;
    geometries.add(item.geometry);
    materials.add(item.material as MeshBasicMaterial);
  });
  geometries.forEach((geometry) => geometry.dispose());
  const textures = new Set([...materials].flatMap((m) => (m.map ? [m.map] : [])));
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}
