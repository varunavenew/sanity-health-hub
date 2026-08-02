import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { SceneShell } from "../components/SceneShell";

const FRICTION = [
  { y: 0.16, x: 0.62, t: "Uklart hva du kan bestille" },
  { y: 0.42, x: 0.18, t: "Innhold uten prioritering" },
  { y: 0.68, x: 0.58, t: "Priser gjemt i tabell" },
  { y: 0.88, x: 0.22, t: "Booking sender deg ut" },
];

/** Utfordringen: vi begynte med å kartlegge friksjonen i dagens løsning. */
export const ChallengeScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 430;
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;
  const scaled = 5592 * (screenW / 430);
  const scroll = interpolate(frame, [10, duration], [0, -0.42 * (scaled - screenH)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 46 });

  return (
    <SceneShell
      kicker="Utfordringen"
      title={"Hva stopper\npasienten?"}
      note="Vi startet ikke med design. Vi startet med å gå gjennom dagens cmedical.no side for side og kartlegge hvor brukeren mister tråden."
      glow="34% 68%"
    >
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 700,
          opacity: rise,
          transform: `translateY(${interpolate(rise, [0, 1], [110, 0])}px) rotateY(8deg)`,
          transformStyle: "preserve-3d",
          perspective: 1700,
        }}
      >
        <PhoneFrame width={PW} label="cmedical.no i dag" labelColor={PALETTE.mid}>
          <Img
            src={staticFile("cmp/old-mobile-home.png")}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scroll}px)` }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.42)" }} />
        </PhoneFrame>
      </div>

      {FRICTION.map((f, i) => {
        const a = spring({ frame: frame - (34 + i * 16), fps, config: { damping: 200 }, durationInFrames: 30 });
        const pulse = 0.5 + 0.5 * Math.sin((frame - 34 - i * 16) / 8);
        return (
          <div
            key={f.t}
            style={{
              position: "absolute",
              left: 96 + f.x * PW,
              top: 700 + f.y * (PW / 430) * 932,
              opacity: a,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: PALETTE.yellow,
                boxShadow: `0 0 ${10 + 18 * pulse}px rgba(244,255,120,${0.35 + 0.35 * pulse})`,
                flexShrink: 0,
              }}
            />
            <div style={{ height: 1, width: interpolate(a, [0, 1], [0, 60]), background: "rgba(204,186,173,0.6)" }} />
            <div
              style={{
                fontSize: 25,
                fontWeight: 300,
                color: PALETTE.light,
                whiteSpace: "nowrap",
                transform: `translateX(${interpolate(a, [0, 1], [-16, 0])}px)`,
              }}
            >
              {f.t}
            </div>
          </div>
        );
      })}
    </SceneShell>
  );
};
