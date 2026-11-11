import "./HeroAtmosphere.css";

const clusters = [
  {
    id: "upper",
    points: [
      [18, 105],
      [73, 72],
      [131, 128],
      [62, 194],
      [12, 259],
      [112, 296],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
    ],
  },
  {
    id: "middle",
    points: [
      [29, 369],
      [102, 410],
      [51, 474],
      [141, 516],
      [15, 581],
      [86, 632],
      [153, 680],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "lower",
    points: [
      [40, 760],
      [145, 811],
      [251, 751],
      [336, 832],
      [432, 777],
      [518, 848],
      [612, 795],
      [704, 850],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
];

const dust = [
  [176, 43],
  [247, 113],
  [352, 60],
  [445, 140],
  [535, 88],
  [201, 236],
  [326, 304],
  [208, 413],
  [395, 477],
  [247, 601],
  [375, 681],
  [552, 715],
];

function ParticleField() {
  return (
    <svg
      className="hero-particle-field"
      viewBox="0 0 720 900"
      preserveAspectRatio="none"
      fill="none"
    >
      {clusters.map((cluster) => (
        <g className={`hero-particle-cluster hero-particle-cluster-${cluster.id}`} key={cluster.id}>
          <g className="hero-particle-connections">
            {cluster.edges.map(([from, to]) => (
              <path
                key={`${from}-${to}`}
                d={`M${cluster.points[from].join(" ")}L${cluster.points[to].join(" ")}`}
              />
            ))}
          </g>
          <path
            className="hero-particle-signal"
            d={`M${cluster.points.map((point) => point.join(" ")).join("L")}`}
          />
          {cluster.points.map(([x, y], index) => (
            <g key={`${x}-${y}`}>
              {index % 3 === 0 && <circle className="hero-particle-halo" cx={x} cy={y} r="6" />}
              <circle
                className="hero-particle-node"
                cx={x}
                cy={y}
                r={index % 2 === 0 ? 2.2 : 1.6}
              />
            </g>
          ))}
        </g>
      ))}
      <g className="hero-particle-dust">
        {dust.map(([x, y], index) =>
          index % 3 === 0 ? (
            <path key={`${x}-${y}`} d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} />
          ) : (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 2 === 0 ? 1.8 : 1.2} />
          ),
        )}
      </g>
    </svg>
  );
}

export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <div className="hero-ambient-glow hero-ambient-glow-forest" />
      <div className="hero-ambient-glow hero-ambient-glow-sun" />
      <ParticleField />
      {["forest", "paper", "small", "left-top", "left-middle", "lower"].map((position) => (
        <div className={`hero-cube-stage hero-cube-${position}`} key={position}>
          <div className="hero-wire-cube">
            {["front", "back", "right", "left", "top", "bottom"].map((face) => (
              <span className={`hero-cube-face hero-cube-face-${face}`} key={face} />
            ))}
          </div>
        </div>
      ))}
      <span className="hero-orbit-dot hero-orbit-dot-one" />
      <span className="hero-orbit-dot hero-orbit-dot-two" />
      <span className="hero-orbit-dot hero-orbit-dot-three" />
      <span className="hero-particle-orbit hero-particle-orbit-left" />
      <span className="hero-particle-orbit hero-particle-orbit-bottom" />
    </div>
  );
}
