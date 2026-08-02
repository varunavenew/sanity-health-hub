import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell } from "../components/SceneShell";

const AIMS = [
  "Enklere og mer intuitiv brukerreise",
  "Tydeligere kommunikasjon av tilbudet",
  "Mer relevante klikk og handlinger",
  "Mindre friksjon i bookingprosessen",
  "En markant bedre opplevelse på mobil",
  "Flere fullførte timebestillinger",
  "Sterkere digital profil og troverdighet",
];

/** Effekten løsningen er bygget for å skape — uttalte mål, ikke målte tall. */
export const OutcomeScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneShell
      kicker="Bygget for å oppnå"
      title={"Et verktøy,\nikke et utstillingsvindu."}
      note="Nettsiden er utviklet med konkrete mål i bunn. Effekten skal måles over tid — dette er hva løsningen er laget for å levere:"
      titleSize={76}
      glow="46% 58%"
    >
      <div style={{ position: "absolute", left: 84, top: 830, width: 930 }}>
        {AIMS.map((a, i) => {
          const p = spring({ frame: frame - (18 + i * 11), fps, config: { damping: 200 }, durationInFrames: 30 });
          return (
            <div
              key={a}
              style={{
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "20px 0",
                borderBottom: "1px solid rgba(204,186,173,0.18)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  border: `1px solid ${PALETTE.yellow}`,
                  color: PALETTE.yellow,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: 32, fontWeight: 300, color: PALETTE.light }}>{a}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 100,
          fontSize: 24,
          color: PALETTE.mid,
          fontWeight: 300,
          maxWidth: 900,
          lineHeight: 1.45,
          opacity: interpolate(frame, [duration - 70, duration - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Måltall følges opp etter lansering — vi lover ikke resultater vi ennå ikke har målt.
      </div>
    </SceneShell>
  );
};
