import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";

export type ShotSceneProps = {
  src: string;
  kicker: string;
  title: string;
  note: string;
  imageHeight: number;
  from: number;
  to: number;
  duration: number;
  align?: "left" | "right";
};

const PANEL_W = 940;
const PANEL_H = 880;
const IMG_W = 1440;
const SCALE = PANEL_W / IMG_W;

export const ShotScene: React.FC<ShotSceneProps> = ({
  src,
  kicker,
  title,
  note,
  imageHeight,
  from,
  to,
  duration,
  align = "right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaledH = imageHeight * SCALE;
  const maxOffset = Math.max(0, scaledH - PANEL_H);
  const y = interpolate(frame, [0, duration], [-from * maxOffset, -to * maxOffset], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 34 });
  const panelY = interpolate(panelIn, [0, 1], [46, 0]);
  const panelOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(frame, [0, duration], [1, 1.035]);

  const textIn = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 40 });
  const ruleW = interpolate(spring({ frame: frame - 14, fps, config: { damping: 200 }, durationInFrames: 46 }), [0, 1], [0, 96]);

  const panelSide = align === "right" ? { right: 96 } : { left: 96 };
  const textSide = align === "right" ? { left: 132 } : { right: 132 };

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at ${align === "right" ? "18%" : "82%"} 30%, ${PALETTE.dark} 0%, ${PALETTE.deep} 62%)`,
        }}
      />

      {/* Text column */}
      <div
        style={{
          position: "absolute",
          ...textSide,
          top: 300,
          width: 640,
        }}
      >
        <div
          style={{
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [26, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: PALETTE.yellow,
              fontWeight: 400,
              marginBottom: 26,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.03,
              fontWeight: 200,
              color: PALETTE.light,
              whiteSpace: "pre-line",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            height: 1,
            width: ruleW,
            background: PALETTE.mid,
            opacity: 0.55,
            margin: "38px 0 30px",
          }}
        />
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.5,
            fontWeight: 300,
            color: PALETTE.mid,
            maxWidth: 470,
            opacity: noteIn,
            transform: `translateY(${interpolate(noteIn, [0, 1], [18, 0])}px)`,
          }}
        >
          {note}
        </div>
      </div>

      {/* Screen panel */}
      <div
        style={{
          position: "absolute",
          ...panelSide,
          top: 100,
          width: PANEL_W,
          height: PANEL_H,
          overflow: "hidden",
          borderRadius: 6,
          opacity: panelOpacity,
          transform: `translateY(${panelY}px) scale(${drift})`,
          boxShadow: "0 60px 120px -30px rgba(0,0,0,0.7)",
          backgroundColor: PALETTE.light,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PANEL_W,
            transform: `translateY(${y}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(30,23,18,0.35) 0%, rgba(30,23,18,0) 16%, rgba(30,23,18,0) 84%, rgba(30,23,18,0.35) 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
