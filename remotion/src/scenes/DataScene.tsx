import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { SceneShell, Pill } from "../components/SceneShell";

const STAGES = [
  { label: "Besøk på nettsiden", w: 1 },
  { label: "Finner riktig tjeneste", w: 0.74 },
  { label: "Klikker «bestill time»", w: 0.48 },
  { label: "Fullfører bestilling", w: 0.27 },
];

const SOURCES = ["Klikkdata", "Konverteringer", "Frafall i flyten", "Søk på siden", "Mobil vs. desktop"];

/** Innsikt: brukerreisen som trakt — hvor faller folk fra? (form, ikke fasit-tall) */
export const DataScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxW = 820;

  return (
    <SceneShell
      kicker="Analyse og innsikt"
      title={"Vi fulgte\nbrukerreisen."}
      note="Klikk, konverteringer og frafall ble lest sammen med selve reisen: hvor mange kommer inn, hvor mange finner fram — og hvor mange gir opp før de har bestilt time."
      glow="50% 62%"
    >
      <div style={{ position: "absolute", left: 84, top: 720, width: 920 }}>
        {STAGES.map((s, i) => {
          const a = spring({ frame: frame - (14 + i * 12), fps, config: { damping: 200 }, durationInFrames: 34 });
          const w = a * maxW * s.w;
          const last = i === STAGES.length - 1;
          return (
            <div key={s.label} style={{ marginBottom: 34 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, opacity: a }}>
                <span style={{ fontSize: 26, fontWeight: 300, color: last ? PALETTE.yellow : PALETTE.light }}>{s.label}</span>
              </div>
              <div style={{ position: "relative", height: 26 }}>
                <div style={{ position: "absolute", inset: 0, width: maxW, background: "rgba(204,186,173,0.14)", borderRadius: 13 }} />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 26,
                    width: w,
                    borderRadius: 13,
                    background: last ? PALETTE.yellow : PALETTE.mid,
                    opacity: last ? 1 : 0.85 - i * 0.12,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 10,
            fontSize: 25,
            fontWeight: 300,
            color: PALETTE.mid,
            opacity: spring({ frame: frame - 70, fps, config: { damping: 200 }, durationInFrames: 30 }),
          }}
        >
          Illustrasjon av mønsteret vi så etter — jo lengre ut i reisen, jo flere falt fra.
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 42 }}>
          {SOURCES.map((s, i) => (
            <Pill key={s} label={s} delay={84 + i * 8} frame={frame} fps={fps} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 84,
          bottom: 120,
          fontSize: 26,
          color: PALETTE.light,
          fontWeight: 300,
          opacity: interpolate(frame, [duration - 60, duration - 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Innsikten — ikke smaken — bestemte hva som måtte endres.
      </div>
    </SceneShell>
  );
};
