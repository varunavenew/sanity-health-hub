import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame, WindowFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

type Shot = { src: string; h: number };

/** A "new surface" scene: no before/after — desktop behind, phone in front, step chips. */
export const BookingScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  steps: string[];
  mobile: Shot;
  desktop: Shot;
  duration: number;
}> = ({ kicker, title, note, steps, mobile, desktop, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 452;
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;

  const DW = 860;
  const DH = 538;
  const dScale = DW / 1440;

  const inA = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 44 });
  const inB = spring({ frame: frame - 16, fps, config: { damping: 15, stiffness: 90 }, durationInFrames: 46 });
  const noteIn = spring({ frame: frame - 28, fps, config: { damping: 200 }, durationInFrames: 40 });

  const mScroll = interpolate(frame, [14, duration], [0, -Math.max(0, mobile.h * (screenW / 430) - screenH) * 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dScroll = interpolate(frame, [14, duration], [0, -Math.max(0, desktop.h * dScale - DH) * 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camera = interpolate(frame, [0, duration], [40, -60]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(85% 55% at 55% 62%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }} />

      <div style={{ position: "absolute", left: 84, top: 152, width: 940 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400, marginBottom: 22, opacity: inA }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={90} frame={frame} delay={6 + i * 8} />
        ))}
        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            fontWeight: 300,
            color: PALETTE.mid,
            maxWidth: 800,
            marginTop: 26,
            opacity: noteIn,
          }}
        >
          {note}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
          {steps.map((s, i) => {
            const p = spring({ frame: frame - (34 + i * 11), fps, config: { damping: 200 }, durationInFrames: 26 });
            return (
              <div
                key={s}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: `1px solid ${i === steps.length - 1 ? PALETTE.yellow : "rgba(204,186,173,0.45)"}`,
                  background: i === steps.length - 1 ? "rgba(244,255,120,0.12)" : "transparent",
                  color: i === steps.length - 1 ? PALETTE.yellow : PALETTE.mid,
                  fontSize: 24,
                  fontWeight: 300,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>

      <AbsoluteFill style={{ perspective: 2000, transform: `translateY(${camera}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 780,
            opacity: inA,
            transformStyle: "preserve-3d",
            transform: `translateY(${interpolate(inA, [0, 1], [90, 0])}px) rotateY(-11deg) rotateX(4deg)`,
          }}
        >
          <WindowFrame width={DW} height={DH} label="Desktop" labelColor={PALETTE.mid}>
            <Img
              src={staticFile(desktop.src)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${dScroll}px)` }}
            />
          </WindowFrame>
        </div>

        <div
          style={{
            position: "absolute",
            left: 560,
            top: 1050,
            opacity: inB,
            transformStyle: "preserve-3d",
            transform: `translateY(${interpolate(inB, [0, 1], [140, 0])}px) rotateY(9deg)`,
          }}
        >
          <div style={{ position: "absolute", inset: -26, borderRadius: 62, background: PALETTE.yellow, opacity: 0.16 * inB }} />
          <PhoneFrame width={PW} label="Mobil" labelColor={PALETTE.yellow}>
            <Img
              src={staticFile(mobile.src)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${mScroll}px)` }}
            />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
