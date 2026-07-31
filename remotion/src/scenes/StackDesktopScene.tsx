import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { WindowFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

type Shot = { src: string; h: number };

export const StackDesktopScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  before: Shot;
  after: Shot;
  duration: number;
}> = ({ kicker, title, note, before, after, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 912;
  const H = 570;
  const scale = W / 1440;

  const scroll = (shot: Shot, delay: number, k: number) => {
    const max = Math.max(0, shot.h * scale - H);
    return interpolate(frame, [delay, duration], [0, -0.9 * k * max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const inA = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 80 }, durationInFrames: 46 });
  const inB = spring({ frame: frame - 18, fps, config: { damping: 13, stiffness: 80 }, durationInFrames: 46 });
  const camera = interpolate(frame, [0, duration], [70, -120]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 40% 45%, ${PALETTE.dark} 0%, ${PALETTE.deep} 70%)` }} />

      <div style={{ position: "absolute", left: 84, top: 150, width: 930 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400, marginBottom: 20, opacity: inA }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={88} frame={frame} delay={6 + i * 8} />
        ))}
        <div style={{ fontSize: 27, lineHeight: 1.45, fontWeight: 300, color: PALETTE.mid, maxWidth: 790, marginTop: 28, opacity: inB }}>
          {note}
        </div>
      </div>

      <AbsoluteFill style={{ perspective: 2000, transform: `translateY(${camera}px)` }}>
        {[
          { shot: before, label: "cmedical.no i dag", anim: inA, top: 640, left: 30, dim: true, delay: 10, rot: 9, k: 1 },
          { shot: after, label: "Ny opplevelse", anim: inB, top: 1260, left: 140, dim: false, delay: 24, rot: -9, k: 1.15 },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.left,
              top: c.top,
              opacity: c.anim,
              transformStyle: "preserve-3d",
              transform: `translateY(${interpolate(c.anim, [0, 1], [110, 0])}px) rotateY(${interpolate(c.anim, [0, 1], [c.rot * 2.2, c.rot])}deg) rotateX(${interpolate(c.anim, [0, 1], [10, 3])}deg)`,
            }}
          >
            {!c.dim ? (
              <div style={{ position: "absolute", inset: -22, borderRadius: 34, background: PALETTE.yellow, opacity: 0.14 * c.anim }} />
            ) : null}
            <WindowFrame width={W} height={H} label={c.label} labelColor={c.dim ? PALETTE.mid : PALETTE.yellow}>
              <Img
                src={staticFile(c.shot.src)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scroll(c.shot, c.delay, c.k)}px)` }}
              />
              {c.dim ? <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.36)" }} /> : null}
            </WindowFrame>
          </div>
        ))}
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
