import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain, Marquee } from "../components/Fx";

const DISCIPLINES = ["Analyse", "Strategi", "Innhold", "UX", "Design", "Utvikling", "Måling"];

/** Posisjonering: hvem vi er og hvordan vi jobber. */
export const AgencyScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line = interpolate(frame, [14, 46], [0, 900], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) });
  const drift = interpolate(frame, [0, duration], [0, -36]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(85% 55% at 50% 46%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)` }} />
      <Marquee text="STRATEGI · DESIGN · UTVIKLING" top={250} size={92} color={PALETTE.dark} opacity={0.5} speed={2.2} />

      <div style={{ position: "absolute", left: 84, top: 620, width: 940, transform: `translateY(${drift}px)` }}>
        <KineticLine text="Vi lager ikke" size={92} frame={frame} delay={2} color={PALETTE.mid} />
        <KineticLine text="bare nettsider." size={92} frame={frame} delay={10} color={PALETTE.mid} italic />
        <div style={{ height: 3, width: line, background: PALETTE.yellow, margin: "46px 0" }} />
        <KineticLine text="Vi bygger digitale" size={92} frame={frame} delay={24} />
        <KineticLine text="løsninger som" size={92} frame={frame} delay={32} />
        <KineticLine text="skal virke." size={92} frame={frame} delay={40} color={PALETTE.yellow} />
      </div>

      <div style={{ position: "absolute", left: 84, top: 1370, width: 930, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {DISCIPLINES.map((d, i) => {
          const a = spring({ frame: frame - (58 + i * 8), fps, config: { damping: 200 }, durationInFrames: 28 });
          return (
            <div
              key={d}
              style={{
                opacity: a,
                transform: `translateY(${interpolate(a, [0, 1], [20, 0])}px)`,
                padding: "13px 26px",
                borderRadius: 999,
                border: "1px solid rgba(204,186,173,0.45)",
                color: PALETTE.light,
                fontSize: 26,
                fontWeight: 300,
              }}
            >
              {d}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 140,
          fontSize: 28,
          color: PALETTE.mid,
          fontWeight: 300,
          maxWidth: 900,
          lineHeight: 1.45,
          opacity: spring({ frame: frame - 100, fps, config: { damping: 200 }, durationInFrames: 34 }),
        }}
      >
        Ett team fra første analyse til ferdig, driftbar plattform.
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
