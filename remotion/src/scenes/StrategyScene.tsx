import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell } from "../components/SceneShell";

const GOALS = [
  { t: "Flere fullførte timebestillinger", w: 1 },
  { t: "Tydeligere tilbud og fagområder", w: 0.86 },
  { t: "Mobil først — der pasienten er", w: 0.8 },
  { t: "Troverdighet: mennesker og kompetanse", w: 0.66 },
];

/** Strategi: fra innsikt til prioriterte forretningsmål. */
export const StrategyScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell
      kicker="Strategi og prioritering"
      title={"Innsikt blir\nbeslutninger."}
      note="Alt kan ikke være viktigst. Vi satte forretningsmålene i rekkefølge, og lot den rekkefølgen styre hva som får plass øverst på hver eneste side."
      glow="40% 60%"
    >
      <div style={{ position: "absolute", left: 84, top: 760, width: 920 }}>
        {GOALS.map((g, i) => {
          const a = spring({ frame: frame - (16 + i * 14), fps, config: { damping: 200 }, durationInFrames: 36 });
          const top = i === 0;
          return (
            <div
              key={g.t}
              style={{
                opacity: a,
                transform: `translateX(${interpolate(a, [0, 1], [-40, 0])}px)`,
                borderTop: `1px solid ${top ? "rgba(244,255,120,0.5)" : "rgba(204,186,173,0.22)"}`,
                paddingTop: 22,
                marginBottom: 30,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <span style={{ fontSize: 26, color: top ? PALETTE.yellow : PALETTE.mid, fontWeight: 300, width: 46 }}>
                  0{i + 1}
                </span>
                <span style={{ fontSize: 38, fontWeight: 300, color: top ? PALETTE.yellow : PALETTE.light, lineHeight: 1.2 }}>
                  {g.t}
                </span>
              </div>
              <div style={{ marginTop: 16, marginLeft: 66, height: 6, background: "rgba(204,186,173,0.14)", borderRadius: 3, width: 780 }}>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: a * 780 * g.w,
                    background: top ? PALETTE.yellow : PALETTE.mid,
                    opacity: top ? 1 : 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 120,
          fontSize: 27,
          color: PALETTE.light,
          fontWeight: 300,
          maxWidth: 900,
          lineHeight: 1.4,
          opacity: interpolate(frame, [duration - 70, duration - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Hver designbeslutning videre kunne måles mot denne listen.
      </div>
    </SceneShell>
  );
};
