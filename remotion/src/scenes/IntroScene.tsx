import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kick = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const t1 = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 46 });
  const t2 = spring({ frame: frame - 22, fps, config: { damping: 200 }, durationInFrames: 46 });
  const line = interpolate(
    spring({ frame: frame - 34, fps, config: { damping: 200 }, durationInFrames: 50 }),
    [0, 1],
    [0, 420],
  );
  const drift = interpolate(frame, [0, 90], [0, -18]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 80% at 22% 45%, ${PALETTE.dark} 0%, ${PALETTE.deep} 70%)`,
        }}
      />
      <div style={{ position: "absolute", left: 132, top: 330, transform: `translateY(${drift}px)` }}>
        <div style={{ fontSize: 20, color: PALETTE.yellow, opacity: kick, marginBottom: 34 }}>
          CMedical — digital plattform
        </div>
        <div
          style={{
            fontSize: 108,
            lineHeight: 0.98,
            fontWeight: 200,
            color: PALETTE.light,
            opacity: t1,
            transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          }}
        >
          Slik ble den til.
        </div>
        <div
          style={{
            fontSize: 108,
            lineHeight: 0.98,
            fontWeight: 200,
            fontStyle: "italic",
            color: PALETTE.mid,
            opacity: t2,
            transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          }}
        >
          Fra idé til flate.
        </div>
        <div style={{ height: 1, width: line, background: PALETTE.mid, opacity: 0.5, marginTop: 56 }} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 132,
          bottom: 120,
          fontSize: 22,
          fontWeight: 300,
          color: PALETTE.mid,
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        2026
      </div>
    </AbsoluteFill>
  );
};
