import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

const STEPS = [
  { src: "cmp/book-step1.png", label: "Tjeneste" },
  { src: "cmp/book-step3.png", label: "Behandler" },
  { src: "cmp/book-step4.png", label: "Tid" },
  { src: "cmp/book-step5.png", label: "Bekreft" },
];

/** Hele den nye bookingflyten, steg for steg, i én telefon. */
export const BookingFlowScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  duration: number;
}> = ({ kicker, title, note, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 520;
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 40 });

  const start = 26;
  const per = (duration - start - 10) / STEPS.length;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 52% at 55% 60%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }} />

      <div style={{ position: "absolute", left: 84, top: 150, width: 930 }}>
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

        <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => {
            const active = frame >= start + i * per;
            const now = frame >= start + i * per && frame < start + (i + 1) * per;
            return (
              <div
                key={s.label}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  fontSize: 24,
                  fontWeight: 300,
                  border: `1px solid ${now ? PALETTE.yellow : active ? "rgba(244,255,120,0.5)" : "rgba(204,186,173,0.35)"}`,
                  background: now ? "rgba(244,255,120,0.14)" : "transparent",
                  color: now ? PALETTE.yellow : active ? PALETTE.light : PALETTE.mid,
                  opacity: active ? 1 : 0.55,
                }}
              >
                {i + 1}. {s.label}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: (1080 - PW) / 2 + 40,
          top: 700,
          opacity: rise,
          transform: `translateY(${interpolate(rise, [0, 1], [120, 0])}px) rotateY(7deg)`,
          transformStyle: "preserve-3d",
          perspective: 1800,
        }}
      >
        <div style={{ position: "absolute", inset: -26, borderRadius: 62, background: PALETTE.yellow, opacity: 0.15 * rise }} />
        <PhoneFrame width={PW}>
          {STEPS.map((s, i) => {
            const t0 = start + i * per;
            const o = interpolate(frame, [t0, t0 + 10, t0 + per - 6, t0 + per], [0, 1, 1, i === STEPS.length - 1 ? 1 : 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = interpolate(frame, [t0, t0 + 16], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <Img
                key={s.src}
                src={staticFile(s.src)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: o, transform: `translateY(${y}px)` }}
              />
            );
          })}
        </PhoneFrame>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
