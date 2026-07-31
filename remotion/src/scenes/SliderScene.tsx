import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

type Shot = { src: string; h: number };

/** Én telefon. Gammel side til venstre for skillelinjen, ny side til høyre.
 *  Skillelinjen sveiper fram og tilbake — «wow»-momentet i videoen. */
export const SliderScene: React.FC<{
  kicker: string;
  title: string;
  before: Shot;
  after: Shot;
  duration: number;
}> = ({ kicker, title, before, after, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 760;
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;

  const scroll = (shot: Shot) => {
    const scaled = shot.h * (screenW / 430);
    const max = Math.max(0, scaled - screenH);
    return interpolate(frame, [8, duration], [0, -0.7 * max], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  // sveip: fra 100% gammel -> 8% -> 62% -> 4%
  const cut = interpolate(
    frame,
    [14, 52, 62, 96, 108, duration - 6],
    [1, 0.08, 0.08, 0.62, 0.62, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) },
  );
  const cutPx = cut * screenW;
  const zoom = interpolate(frame, [0, duration], [1.06, 1.0]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 60%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }} />

      <div style={{ position: "absolute", left: 84, top: 170, width: 920 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, marginBottom: 20, opacity: rise }}>{kicker}</div>
        <KineticLine text={title} size={92} frame={frame} delay={6} />
      </div>

      <div
        style={{
          position: "absolute",
          left: (1080 - PW) / 2,
          top: 470,
          transform: `translateY(${interpolate(rise, [0, 1], [90, 0])}px) scale(${zoom})`,
          opacity: rise,
        }}
      >
        <PhoneFrame width={PW}>
          {/* NY side i bunn */}
          <Img
            src={staticFile(after.src)}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scroll(after)}px)` }}
          />
          {/* GAMMEL side klippet til venstre for linjen */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${screenW - cutPx}px 0 0)` }}>
            <Img
              src={staticFile(before.src)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scroll(before)}px)` }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.34)" }} />
          </div>
          {/* håndtak */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: cutPx - 2, width: 4, background: PALETTE.yellow }} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: cutPx - 34,
              width: 68,
              height: 68,
              marginTop: -34,
              borderRadius: 34,
              background: PALETTE.yellow,
              color: PALETTE.deep,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 400,
            }}
          >
            ↔
          </div>
        </PhoneFrame>
      </div>

      <div style={{ position: "absolute", bottom: 118, left: 84, right: 84, display: "flex", justifyContent: "space-between", fontSize: 28, color: PALETTE.mid }}>
        <span>I dag — cmedical.no</span>
        <span style={{ color: PALETTE.yellow }}>Ny flate</span>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
