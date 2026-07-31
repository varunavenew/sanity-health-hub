import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { KineticLine, Grain } from "../components/Fx";

type Col = { src: string; h: number; speed: number; dir: 1 | -1 };

/** Hele siden som fem parallelle, roterte kolonner i motsatt retning. */
export const RibbonScene: React.FC<{
  cols: Col[];
  title: string;
  note: string;
  duration: number;
}> = ({ cols, title, note, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const COL_W = 400;
  const GAP = 30;
  const inAll = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const textIn = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 44 });
  const rot = interpolate(frame, [0, duration], [-13, -6]);
  const zoom = interpolate(frame, [0, duration], [1.55, 1.28]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `rotate(${rot}deg) scale(${zoom}) translateY(${interpolate(inAll, [0, 1], [120, 0])}px)`,
          opacity: inAll,
          display: "flex",
          flexDirection: "row",
          gap: GAP,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {cols.map((c, i) => {
          const scaled = c.h * (COL_W / 430);
          const travel = Math.max(0, scaled - 1920) * c.speed;
          const y = interpolate(frame, [0, duration], c.dir === 1 ? [0, -travel] : [-travel, 0]);
          return (
            <div
              key={i}
              style={{
                width: COL_W,
                flex: `0 0 ${COL_W}px`,
                height: 1920,
                position: "relative",
                overflow: "hidden",
                borderRadius: 12,
              }}
            >
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
          background: `linear-gradient(to bottom, ${PALETTE.deep} 0%, rgba(30,23,18,0.18) 20%, rgba(30,23,18,0.30) 46%, rgba(30,23,18,0.90) 74%, ${PALETTE.deep} 96%)`,
        }}
      />


      <div style={{ position: "absolute", left: 84, top: 1010, width: 920, opacity: textIn }}>
        {title.split("\n").map((l, i) => (
          <KineticLine key={l} text={l} size={98} frame={frame} delay={26 + i * 8} />
        ))}
        <div style={{ height: 4, width: 160, background: PALETTE.yellow, margin: "34px 0 28px" }} />
        <div style={{ fontSize: 28, lineHeight: 1.45, fontWeight: 300, color: PALETTE.mid, maxWidth: 740 }}>{note}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
