import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";

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

  const PW = 462; // phone screen width in px on canvas
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;

  const scroll = (shot: Shot) => {
    const scaled = shot.h * (screenW / 430);
    const max = Math.max(0, scaled - screenH);
    return interpolate(frame, [10, duration], [-from * max, -to * max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const inA = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 36 });
  const inB = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 36 });
  const textIn = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 42 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(90% 60% at 50% 62%, ${PALETTE.dark} 0%, ${PALETTE.deep} 70%)` }}
      />

      <div style={{ position: "absolute", left: 84, top: 190, width: 920 }}>
        <div style={{ opacity: textIn, transform: `translateY(${interpolate(textIn, [0, 1], [26, 0])}px)` }}>
          <div style={{ fontSize: 26, color: PALETTE.yellow, fontWeight: 400, marginBottom: 22 }}>{kicker}</div>
          <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 200, color: PALETTE.light, whiteSpace: "pre-line" }}>
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            fontWeight: 300,
            color: PALETTE.mid,
            maxWidth: 760,
            marginTop: 30,
            opacity: noteIn,
            transform: `translateY(${interpolate(noteIn, [0, 1], [16, 0])}px)`,
          }}
        >
          {note}
        </div>
      </div>

      <div style={{ position: "absolute", left: 62, top: 620, display: "flex", gap: 42 }}>
        {[
          { shot: before, label: "I dag", anim: inA, dim: true },
          { shot: after, label: "Nytt", anim: inB, dim: false },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              opacity: c.anim,
              transform: `translateY(${interpolate(c.anim, [0, 1], [56, 0])}px)`,
            }}
          >
            <PhoneFrame width={PW} label={c.label} labelColor={c.dim ? PALETTE.mid : PALETTE.yellow}>
              <Img
                src={staticFile(c.shot.src)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${scroll(c.shot)}px)`,
                }}
              />
              {c.dim ? (
                <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.28)" }} />
              ) : null}
            </PhoneFrame>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
