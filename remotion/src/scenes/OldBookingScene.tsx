import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

/** Slik bestiller man time i dag: eget vindu, engelsk, land -> behandling -> klinikk. */
export const OldBookingScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  duration: number;
}> = ({ kicker, title, note, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 300;
  const shots = [
    { src: "cmp/old-book-1.png", cap: "Choose country" },
    { src: "cmp/old-book-2.png", cap: "Choose type of treatment" },
    { src: "cmp/old-book-3.png", cap: "Choose clinic" },
  ];

  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 40 });
  const drift = interpolate(frame, [0, duration], [0, -40]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(85% 55% at 45% 62%, ${PALETTE.dark} 0%, ${PALETTE.deep} 74%)` }} />

      <div style={{ position: "absolute", left: 84, top: 160, width: 930 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, marginBottom: 20, opacity: rise }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={86} frame={frame} delay={6 + i * 8} />
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
            transform: `translateY(${interpolate(noteIn, [0, 1], [18, 0])}px)`,
          }}
        >
          {note}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 700,
          display: "flex",
          gap: 34,
          perspective: 1800,
          transform: `translateY(${drift}px)`,
        }}
      >
        {shots.map((s, i) => {
          const a = spring({ frame: frame - (8 + i * 14), fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 46 });
          return (
            <div
              key={s.src}
              style={{
                opacity: a,
                transform: `translateY(${interpolate(a, [0, 1], [120, i * 34])}px) rotateY(9deg) rotateZ(${-2 + i}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <PhoneFrame width={PW}>
                <Img src={staticFile(s.src)} style={{ position: "absolute", top: 0, left: 0, width: "100%" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(30,23,18,0.38)" }} />
              </PhoneFrame>
              <div style={{ marginTop: 16, fontSize: 23, color: PALETTE.mid, fontWeight: 300 }}>
                {i + 1}. {s.cap}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 84,
          right: 84,
          fontSize: 27,
          color: PALETTE.mid,
          opacity: spring({ frame: frame - 64, fps, config: { damping: 200 }, durationInFrames: 30 }),
        }}
      >
        Eget vindu · engelsk · ingen priser · ingen behandlervalg
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
