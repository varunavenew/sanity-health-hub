import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell, Pill } from "../components/SceneShell";

const BUILD = [
  "Redaksjonelt CMS",
  "Norsk og engelsk",
  "Bookingflyt",
  "Søk på tvers",
  "Teknisk SEO",
  "Universell utforming",
  "Ytelse på mobil",
  "Sporing og måling",
];

/** Utvikling: fra design til ferdig, driftbar løsning. */
export const BuildScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bar = interpolate(frame, [20, duration - 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneShell
      kicker="Utvikling og implementering"
      title={"Designet er\nogså bygget."}
      note="Vi leverte ikke en presentasjon. Løsningen er utviklet, innholdet er migrert, og redaksjonen kan drifte alt selv — på norsk og engelsk."
      glow="52% 62%"
    >
      <div style={{ position: "absolute", left: 84, top: 780, width: 920, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {BUILD.map((b, i) => (
          <Pill key={b} label={b} delay={16 + i * 8} frame={frame} fps={fps} active={i === BUILD.length - 1} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 84, top: 1020, width: 900 }}>
        <div style={{ fontSize: 25, color: PALETTE.mid, fontWeight: 300, marginBottom: 16 }}>Fra prototype til produksjon</div>
        <div style={{ height: 8, borderRadius: 4, background: "rgba(204,186,173,0.16)", width: 900 }}>
          <div style={{ height: 8, borderRadius: 4, width: bar * 900, background: PALETTE.yellow }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 23, color: PALETTE.mid }}>
          <span>Wireframe</span>
          <span>Design</span>
          <span>Bygg</span>
          <span style={{ color: bar > 0.95 ? PALETTE.yellow : PALETTE.mid }}>Live</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 84, top: 1240, width: 920 }}>
        {["Over 100 sider strukturert og migrert", "Booking integrert i selve nettsiden", "Samme designsystem på mobil og desktop"].map((t, i) => {
          const a = spring({ frame: frame - (72 + i * 12), fps, config: { damping: 200 }, durationInFrames: 32 });
          return (
            <div
              key={t}
              style={{
                opacity: a,
                transform: `translateX(${interpolate(a, [0, 1], [-26, 0])}px)`,
                display: "flex",
                gap: 18,
                alignItems: "baseline",
                marginBottom: 22,
              }}
            >
              <span style={{ color: PALETTE.yellow, fontSize: 26 }}>—</span>
              <span style={{ fontSize: 30, fontWeight: 300, color: PALETTE.light }}>{t}</span>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
