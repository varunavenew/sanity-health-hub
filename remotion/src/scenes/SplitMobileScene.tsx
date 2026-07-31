import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

type Shot = { src: string; h: number };

export const SplitMobileScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  before: Shot;
  after: Shot;
  duration: number;
  from?: number;
  to?: number;
}> = ({ kicker, title, note, before, after, duration, from = 0, to = 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 462;
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;

  const scroll = (shot: Shot, k: number) => {
    const scaled = shot.h * (screenW / 430);
    const max = Math.max(0, scaled - screenH);
    return interpolate(frame, [10, duration], [-from * max, -to * k * max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const inA = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 44 });
  const inB = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 90 }, durationInFrames: 44 });
  const noteIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 42 });
  const glow = interpolate(frame, [16, 60], [0, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, duration], [0, -46]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 62% 66%, ${PALETTE.dark} 0%, ${PALETTE.deep} 70%)` }} />

      <div style={{ position: "absolute", left: 84, top: 180, width: 930 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400, marginBottom: 22, opacity: inA }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={88} frame={frame} delay={6 + i * 8} />
        ))}
        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            fontWeight: 300,
            color: PALETTE.mid,
            maxWidth: 780,
            marginTop: 30,
            opacity: noteIn,
            transform: `translateY(${interpolate(noteIn, [0, 1], [18, 0])}px)`,
          }}
        >
          {note}
        </div>
      </div>

      <div style={{ position: "absolute", left: 62, top: 640, display: "flex", gap: 42, transform: `translateY(${drift}px)`, perspective: 1600 }}>
        {[
          { shot: before, label: "I dag", anim: inA, dim: true, tilt: 7, dx: -180, k: 1 },
          { shot: after, label: "Nytt", anim: inB, dim: false, tilt: -7, dx: 180, k: 1.1 },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              opacity: c.anim,
              transform: `translateX(${interpolate(c.anim, [0, 1], [c.dx, 0])}px) translateY(${interpolate(c.anim, [0, 1], [40, 0])}px) rotateY(${interpolate(c.anim, [0, 1], [c.tilt * 2, c.tilt])}deg)`,
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            {!c.dim ? (
              <div
                style={{
                  position: "absolute",
                  inset: -26,
                  borderRadius: 60,
                  background: PALETTE.yellow,
                  opacity: 0.16 * glow,
                }}
              />
            ) : null}
            <PhoneFrame width={PW} label={c.label} labelColor={c.dim ? PALETTE.mid : PALETTE.yellow}>
              <Img
                src={staticFile(c.shot.src)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${scroll(c.shot, c.k)}px)`,
                }}
              />
              {c.dim ? <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.34)" }} /> : null}
            </PhoneFrame>
          </div>
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
