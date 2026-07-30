import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";

type Col = { src: string; h: number; speed: number; dir: 1 | -1 };

/**
 * Kreativ helhet: hele siden vist som tre parallelle, roterte kolonner
 * som scroller i ulik retning og hastighet.
 */
export const RibbonScene: React.FC<{
  cols: Col[];
  title: string;
  note: string;
  duration: number;
}> = ({ cols, title, note, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const COL_W = 470;
  const GAP = 40;
  const inAll = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 46 });
  const textIn = spring({ frame: frame - 30, fps, config: { damping: 200 }, durationInFrames: 46 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `rotate(-9deg) scale(1.35) translateY(${interpolate(inAll, [0, 1], [80, 0])}px)`,
          opacity: interpolate(inAll, [0, 1], [0, 1]),
          display: "flex",
          gap: GAP,
          justifyContent: "center",
        }}
      >
        {cols.map((c, i) => {
          const scaled = c.h * (COL_W / 430);
          const travel = Math.max(0, scaled - 1920) * c.speed;
          const y = interpolate(frame, [0, duration], c.dir === 1 ? [0, -travel] : [-travel, 0]);
          return (
            <div key={i} style={{ width: COL_W, position: "relative", overflow: "hidden", borderRadius: 10 }}>
              <Img
                src={staticFile(c.src)}
                style={{ width: COL_W, position: "absolute", top: 0, left: 0, transform: `translateY(${y}px)` }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${PALETTE.deep} 0%, rgba(30,23,18,0.35) 26%, rgba(30,23,18,0.35) 58%, ${PALETTE.deep} 92%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 780,
          width: 900,
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 96, lineHeight: 1.0, fontWeight: 200, color: PALETTE.light, whiteSpace: "pre-line" }}>
          {title}
        </div>
        <div style={{ height: 1, width: 120, background: PALETTE.mid, opacity: 0.5, margin: "34px 0 28px" }} />
        <div style={{ fontSize: 28, lineHeight: 1.45, fontWeight: 300, color: PALETTE.mid, maxWidth: 720 }}>{note}</div>
      </div>
    </AbsoluteFill>
  );
};
