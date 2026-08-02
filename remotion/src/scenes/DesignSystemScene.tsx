import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell } from "../components/SceneShell";

const SWATCHES = [
  { c: PALETTE.light, n: "Lys hud" },
  { c: PALETTE.mid, n: "Varm sand" },
  { c: PALETTE.dark, n: "Dyp brun" },
  { c: PALETTE.deep, n: "Natt" },
  { c: PALETTE.yellow, n: "Signal" },
];

const TYPE = [
  { s: 64, t: "Overskrift" },
  { s: 38, t: "Mellomtittel" },
  { s: 26, t: "Brødtekst som er til å lese på mobil" },
];

/** Visuell retning: paletten, typografien og komponentene som holder alt sammen. */
export const DesignSystemScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell
      kicker="Visuell retning"
      title={"Et system,\nikke et tema."}
      note="Farger, typografi og komponenter ble satt som ett felles språk — slik at nye sider kan lages i årevis uten at helheten sprekker."
      glow="60% 60%"
    >
      <div style={{ position: "absolute", left: 84, top: 740, display: "flex", gap: 20 }}>
        {SWATCHES.map((s, i) => {
          const a = spring({ frame: frame - (12 + i * 7), fps, config: { damping: 16, stiffness: 100 }, durationInFrames: 34 });
          return (
            <div key={s.n} style={{ opacity: a, transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)` }}>
              <div
                style={{
                  width: 168,
                  height: 168,
                  borderRadius: 24,
                  background: s.c,
                  border: s.c === PALETTE.deep ? `1px solid rgba(204,186,173,0.35)` : "none",
                }}
              />
              <div style={{ fontSize: 22, color: PALETTE.mid, marginTop: 12, fontWeight: 300 }}>{s.n}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 84, top: 1010, width: 900 }}>
        {TYPE.map((t, i) => {
          const a = spring({ frame: frame - (48 + i * 10), fps, config: { damping: 200 }, durationInFrames: 32 });
          return (
            <div
              key={t.t}
              style={{
                opacity: a,
                transform: `translateX(${interpolate(a, [0, 1], [-30, 0])}px)`,
                fontSize: t.s,
                fontWeight: i === 0 ? 200 : 300,
                color: i === 2 ? PALETTE.mid : PALETTE.light,
                marginBottom: 22,
              }}
            >
              {t.t}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 84, top: 1330, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", width: 920 }}>
        {["Bestill time →", "Se priser", "Les mer"].map((b, i) => {
          const a = spring({ frame: frame - (86 + i * 9), fps, config: { damping: 200 }, durationInFrames: 28 });
          const primary = i === 0;
          return (
            <div
              key={b}
              style={{
                opacity: a,
                transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)`,
                padding: "18px 34px",
                borderRadius: 999,
                fontSize: 27,
                fontWeight: 300,
                background: primary ? PALETTE.yellow : "transparent",
                color: primary ? PALETTE.deep : PALETTE.light,
                border: primary ? "none" : `1px solid rgba(204,186,173,0.5)`,
              }}
            >
              {b}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 120,
          fontSize: 26,
          color: PALETTE.light,
          fontWeight: 300,
          maxWidth: 900,
          lineHeight: 1.45,
          opacity: interpolate(frame, [duration - 60, duration - 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Rolig palett, tydelig hierarki — og én signalfarge som alltid betyr «her handler du».
      </div>
    </SceneShell>
  );
};
