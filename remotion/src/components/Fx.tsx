import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { PALETTE } from "../theme";

/** Subtle animated film grain — cheap (no blur filters). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const dots = new Array(90).fill(0).map((_, i) => ({
    x: random(`gx${seed}${i}`) * 1080,
    y: random(`gy${seed}${i}`) * 1920,
    s: 1 + random(`gs${seed}${i}`) * 2,
  }));
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            background: PALETTE.light,
            borderRadius: d.s,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(70% 50% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Thin yellow progress line at the very bottom of the whole video. */
export const ProgressBar: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, total], [0, 1080], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 5,
        width: w,
        background: PALETTE.yellow,
        opacity: 0.9,
      }}
    />
  );
};

/** Endless horizontal ticker of a repeated word — adds kinetic energy. */
export const Marquee: React.FC<{
  text: string;
  top: number;
  speed?: number;
  size?: number;
  color?: string;
  opacity?: number;
  dir?: 1 | -1;
}> = ({ text, top, speed = 2.2, size = 92, color = PALETTE.dark, opacity = 1, dir = -1 }) => {
  const frame = useCurrentFrame();
  const unit = text.length * size * 0.62;
  const x = ((frame * speed * dir) % unit) - (dir === -1 ? 0 : unit);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: 1080,
        overflow: "hidden",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translateX(${x}px)`,
          fontSize: size,
          fontWeight: 200,
          color,
          lineHeight: 1,
        }}
      >
        {new Array(8).fill(text).join("   ·   ")}
      </div>
    </div>
  );
};

/** Word-by-word clip-path reveal headline. */
export const KineticLine: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color?: string;
  italic?: boolean;
  stagger?: number;
  frame: number;
}> = ({ text, delay = 0, size, color = PALETTE.light, italic, stagger = 5, frame }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.22}px` }}>
    {text.split(" ").map((w, i) => {
      const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      return (
        <span
          key={`${w}-${i}`}
          style={{
            display: "inline-block",
            overflow: "hidden",
            lineHeight: 1.02,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: size,
              fontWeight: 200,
              fontStyle: italic ? "italic" : "normal",
              color,
              transform: `translateY(${(1 - p) * size * 1.05}px)`,
            }}
          >
            {w}
          </span>
        </span>
      );
    })}
  </div>
);
