import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

type Block = { t: number; h: number; w: number; kind?: "img" | "text" | "cta" };

const BLOCKS: Block[] = [
  { t: 0, h: 300, w: 100, kind: "img" },
  { t: 320, h: 34, w: 62, kind: "text" },
  { t: 366, h: 34, w: 44, kind: "text" },
  { t: 424, h: 18, w: 86 },
  { t: 450, h: 18, w: 78 },
  { t: 496, h: 54, w: 56, kind: "cta" },
  { t: 580, h: 150, w: 47, kind: "img" },
  { t: 580, h: 150, w: 47, kind: "img" },
  { t: 756, h: 18, w: 70 },
  { t: 782, h: 18, w: 58 },
  { t: 828, h: 190, w: 100, kind: "img" },
];

/** Blueprint → design. Wireframe blocks draw in, then the real screen materialises. */
export const PrototypeScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  shot: { src: string; h: number };
  duration: number;
  reveal?: number;
}> = ({ kicker, title, note, shot, duration, reveal = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 560;
  const screenW = PW * (1 - 0.044);
  const screenH = Math.round((PW / 430) * 932) - PW * 0.044;
  const k = screenW / 430;

  const inA = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 40 });

  const revealStart = duration * reveal;
  const real = interpolate(frame, [revealStart, revealStart + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const wire = 1 - real;

  const gridY = interpolate(frame, [0, duration], [0, -140]);
  const scanY = interpolate(frame, [0, revealStart + 34], [-200, screenH + 200], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, duration], [24, -34]);
  const scrollY = interpolate(frame, [revealStart, duration], [0, -Math.max(0, shot.h * k - screenH) * 0.35], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${PALETTE.dark} 1px, transparent 1px), linear-gradient(90deg, ${PALETTE.dark} 1px, transparent 1px)`,
          backgroundSize: "68px 68px",
          backgroundPosition: `0px ${gridY}px`,
          opacity: 0.55 * wire + 0.12,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 68%, rgba(66,51,42,0.75) 0%, ${PALETTE.deep} 72%)` }} />

      <div style={{ position: "absolute", left: 84, top: 148, width: 940 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400, marginBottom: 22, opacity: inA }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={92} frame={frame} delay={6 + i * 8} />
        ))}
        <div
          style={{
            fontSize: 27,
            lineHeight: 1.45,
            fontWeight: 300,
            color: PALETTE.mid,
            maxWidth: 800,
            marginTop: 28,
            opacity: noteIn,
            transform: `translateY(${interpolate(noteIn, [0, 1], [16, 0])}px)`,
          }}
        >
          {note}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 260,
          top: 600,
          transform: `translateY(${drift}px) rotateY(${interpolate(inA, [0, 1], [14, -4])}deg) rotateX(2deg)`,
          transformStyle: "preserve-3d",
          perspective: 1800,
          opacity: inA,
        }}
      >
        <PhoneFrame width={PW}>
          {/* wireframe layer */}
          <div style={{ position: "absolute", inset: 0, background: "#241B15", opacity: wire }}>
            {BLOCKS.map((b, i) => {
              const d = 6 + i * 5;
              const p = spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 26 });
              const left = i === 7 ? screenW * 0.53 : screenW * 0.06;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left,
                    top: b.t * k,
                    width: (b.w / 100) * screenW * (i === 6 || i === 7 ? 1 : 0.88) * p,
                    height: b.h * k,
                    borderRadius: b.kind === "cta" ? 999 : 8,
                    border: `2px solid ${b.kind === "cta" ? PALETTE.yellow : "rgba(204,186,173,0.5)"}`,
                    background:
                      b.kind === "img"
                        ? "repeating-linear-gradient(45deg, rgba(204,186,173,0.10) 0 12px, rgba(204,186,173,0.02) 12px 24px)"
                        : b.kind === "cta"
                        ? "rgba(244,255,120,0.10)"
                        : "rgba(204,186,173,0.10)",
                    opacity: p,
                  }}
                />
              );
            })}
            {/* scan line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: scanY,
                width: "100%",
                height: 3,
                background: PALETTE.yellow,
                opacity: 0.85,
              }}
            />
          </div>

          {/* real design layer, wiped in from the top */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 0 ${(1 - real) * 100}% 0)`,
            }}
          >
            <Img
              src={staticFile(shot.src)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${scrollY}px)` }}
            />
          </div>
        </PhoneFrame>
      </div>

      {/* annotation ticks */}
      {["hero", "innhold", "handling"].map((t, i) => {
        const p = spring({ frame: frame - (18 + i * 14), fps, config: { damping: 200 }, durationInFrames: 30 });
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: 96,
              top: 760 + i * 92,
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: p * wire,
              transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
            }}
          >
            <div style={{ width: 110 * p, height: 2, background: PALETTE.yellow, opacity: 0.7 }} />
            <div style={{ fontSize: 24, color: PALETTE.mid, fontWeight: 300 }}>{t}</div>
          </div>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
