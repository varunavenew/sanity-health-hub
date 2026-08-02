import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell } from "../components/SceneShell";

const TREE: { l: string; d: number; hi?: boolean }[] = [
  { l: "Forsiden", d: 0 },
  { l: "Tjenester", d: 1 },
  { l: "Fagområde (f.eks. gynekologi)", d: 2 },
  { l: "Behandling", d: 3 },
  { l: "Priser", d: 1 },
  { l: "Spesialister", d: 1 },
  { l: "Bestill time", d: 1, hi: true },
];

/** Innholdsstruktur: hierarki og prioritering før noe ble tegnet. */
export const ContentScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell
      kicker="Innhold og struktur"
      title={"Rekkefølgen\nsom svarer."}
      note="Vi skrev om og sorterte innholdet etter pasientens spørsmål: hva kan jeg få hjelp til, hva koster det, hvem møter meg — og hvordan bestiller jeg time."
      glow="48% 62%"
    >
      <div style={{ position: "absolute", left: 96, top: 740, width: 900 }}>
        {TREE.map((n, i) => {
          const a = spring({ frame: frame - (14 + i * 10), fps, config: { damping: 200 }, durationInFrames: 30 });
          return (
            <div
              key={n.l}
              style={{
                opacity: a,
                transform: `translateX(${interpolate(a, [0, 1], [-30, 0])}px)`,
                marginLeft: n.d * 70,
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: n.d === 0 ? 16 : 10,
                  height: n.d === 0 ? 16 : 10,
                  borderRadius: 8,
                  background: n.hi ? PALETTE.yellow : n.d === 0 ? PALETTE.light : PALETTE.mid,
                }}
              />
              <div
                style={{
                  fontSize: n.d === 0 ? 40 : n.d === 1 ? 34 : 28,
                  fontWeight: 300,
                  color: n.hi ? PALETTE.yellow : n.d > 1 ? PALETTE.mid : PALETTE.light,
                }}
              >
                {n.l}
              </div>
              {n.hi ? (
                <div style={{ fontSize: 22, color: PALETTE.mid, fontWeight: 300 }}>— tilgjengelig fra hver eneste side</div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 150,
          fontSize: 26,
          color: PALETTE.light,
          fontWeight: 300,
          maxWidth: 880,
          lineHeight: 1.45,
          opacity: interpolate(frame, [duration - 70, duration - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Samme struktur på over 100 sider — bygget som ett system, ikke som løse sider.
      </div>
    </SceneShell>
  );
};
