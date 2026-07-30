import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { WindowFrame } from "../components/Frames";

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

  const scroll = (shot: Shot, delay: number) => {
    const max = Math.max(0, shot.h * scale - H);
    return interpolate(frame, [delay, duration], [0, -0.85 * max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const inA = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 38 });
  const inB = spring({ frame: frame - 16, fps, config: { damping: 200 }, durationInFrames: 38 });
  const textIn = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(90% 60% at 40% 45%, ${PALETTE.dark} 0%, ${PALETTE.deep} 70%)` }}
      />

      <div style={{ position: "absolute", left: 84, top: 150, width: 920, opacity: textIn, transform: `translateY(${interpolate(textIn, [0, 1], [24, 0])}px)` }}>
        <div style={{ fontSize: 26, color: PALETTE.yellow, fontWeight: 400, marginBottom: 20 }}>{kicker}</div>
        <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 200, color: PALETTE.light, whiteSpace: "pre-line" }}>
          {title}
        </div>
        <div style={{ fontSize: 27, lineHeight: 1.45, fontWeight: 300, color: PALETTE.mid, maxWidth: 780, marginTop: 28 }}>
          {note}
        </div>
      </div>

      {[
        { shot: before, label: "cmedical.no i dag", anim: inA, top: 620, left: 60, dim: true, delay: 10 },
        { shot: after, label: "Ny opplevelse", anim: inB, top: 1240, left: 108, dim: false, delay: 24 },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: c.left,
            top: c.top,
            opacity: c.anim,
            transform: `translateY(${interpolate(c.anim, [0, 1], [60, 0])}px)`,
          }}
        >
          <WindowFrame width={W} height={H} label={c.label} labelColor={c.dim ? PALETTE.mid : PALETTE.yellow}>
            <Img
              src={staticFile(c.shot.src)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scroll(c.shot, c.delay)}px)` }}
            />
            {c.dim ? <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.3)" }} /> : null}
          </WindowFrame>
        </div>
      ))}
    </AbsoluteFill>
  );
};
