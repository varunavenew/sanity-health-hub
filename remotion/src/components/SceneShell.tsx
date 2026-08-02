import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain } from "./Fx";

/** Felles ramme for prosess-scenene: bakgrunn, kicker, tittel, ingress. */
export const SceneShell: React.FC<{
  kicker: string;
  title: string;
  note?: string;
  glow?: string;
  top?: number;
  titleSize?: number;
  children?: React.ReactNode;
}> = ({ kicker, title, note, glow = "62% 66%", top = 150, titleSize = 86, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inA = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(88% 58% at ${glow}, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }} />
      <div style={{ position: "absolute", left: 84, top, width: 930 }}>
        <div style={{ fontSize: 27, color: PALETTE.yellow, marginBottom: 20, opacity: inA }}>{kicker}</div>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={titleSize} frame={frame} delay={6 + i * 8} />
        ))}
        {note ? (
          <div
            style={{
              fontSize: 27,
              lineHeight: 1.45,
              fontWeight: 300,
              color: PALETTE.mid,
              maxWidth: 830,
              marginTop: 26,
              opacity: noteIn,
              transform: `translateY(${interpolate(noteIn, [0, 1], [18, 0])}px)`,
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
      {children}
      <Grain />
    </AbsoluteFill>
  );
};

/** Liten etikett-pille, brukt på tvers av prosess-scenene. */
export const Pill: React.FC<{
  label: string;
  active?: boolean;
  delay: number;
  frame: number;
  fps: number;
}> = ({ label, active, delay, frame, fps }) => {
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 26 });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
        padding: "11px 22px",
        borderRadius: 999,
        border: `1px solid ${active ? PALETTE.yellow : "rgba(204,186,173,0.4)"}`,
        background: active ? "rgba(244,255,120,0.12)" : "transparent",
        color: active ? PALETTE.yellow : PALETTE.mid,
        fontSize: 23,
        fontWeight: 300,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};
