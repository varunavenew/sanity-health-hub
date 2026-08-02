import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell } from "../components/SceneShell";

const DOTS = [
  { x: 0.22, y: 0.7, l: "Aktør A" },
  { x: 0.36, y: 0.44, l: "Aktør B" },
  { x: 0.58, y: 0.62, l: "Aktør C" },
  { x: 0.46, y: 0.24, l: "Aktør D" },
];

/** Marked og konkurrenter: hvor er rommet i markedet? */
export const MarketScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 860;
  const H = 660;
  const grid = interpolate(frame, [6, 40], [0, 1], { extrapolateRight: "clamp" });
  const cm = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 110 }, durationInFrames: 44 });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <SceneShell
      kicker="Marked og konkurrenter"
      title={"Hvor er\nrommet?"}
      note="Vi kartla hvordan andre private helseaktører snakker til den samme målgruppen — og fant posisjonen CMedical faktisk kan eie: bred spisskompetanse formidlet enkelt og trygt."
      glow="58% 64%"
    >
      <div style={{ position: "absolute", left: 110, top: 760, width: W, height: H }}>
        {/* rutenett */}
        {new Array(5).fill(0).map((_, i) => (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: (H / 4) * i,
              width: W * grid,
              height: 1,
              background: "rgba(204,186,173,0.18)",
            }}
          />
        ))}
        {new Array(5).fill(0).map((_, i) => (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              top: 0,
              left: (W / 4) * i,
              height: H * grid,
              width: 1,
              background: "rgba(204,186,173,0.18)",
            }}
          />
        ))}

        {/* akser */}
        <div style={{ position: "absolute", left: 0, top: -46, fontSize: 23, color: PALETTE.mid, opacity: grid }}>
          Tydelig og enkel kommunikasjon ↑
        </div>
        <div style={{ position: "absolute", left: 0, top: H + 20, fontSize: 23, color: PALETTE.mid, opacity: grid }}>
          Bredde i spesialisttilbud →
        </div>

        {DOTS.map((d, i) => {
          const a = spring({ frame: frame - (34 + i * 9), fps, config: { damping: 200 }, durationInFrames: 28 });
          return (
            <div
              key={d.l}
              style={{
                position: "absolute",
                left: d.x * W,
                top: d.y * H,
                opacity: a * 0.75,
                transform: `scale(${interpolate(a, [0, 1], [0.4, 1])})`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 8, border: `1px solid ${PALETTE.mid}` }} />
              <span style={{ fontSize: 22, color: PALETTE.mid, fontWeight: 300 }}>{d.l}</span>
            </div>
          );
        })}

        {/* CMedical */}
        <div
          style={{
            position: "absolute",
            left: 0.78 * W,
            top: 0.16 * H,
            opacity: cm,
            transform: `scale(${interpolate(cm, [0, 1], [0.4, 1])})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              background: PALETTE.yellow,
              boxShadow: `0 0 ${16 + 26 * pulse}px rgba(244,255,120,${0.3 + 0.35 * pulse})`,
            }}
          />
          <span style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400 }}>CMedical</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 110,
          fontSize: 26,
          color: PALETTE.light,
          fontWeight: 300,
          maxWidth: 900,
          lineHeight: 1.4,
          opacity: interpolate(frame, [duration - 70, duration - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Posisjonen ble utgangspunktet for både struktur, tone og prioritering.
      </div>
    </SceneShell>
  );
};
