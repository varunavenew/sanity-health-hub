import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../theme";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kick = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const t1 = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 46 });
  const t2 = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 46 });
  const t3 = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 46 });
  const line = interpolate(
    spring({ frame: frame - 52, fps, config: { damping: 200 }, durationInFrames: 52 }),
    [0, 1],
    [0, 620],
  );
  const drift = interpolate(frame, [0, 100], [0, -22]);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(80% 55% at 24% 42%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }}
      />
      <div style={{ position: "absolute", left: 88, top: 640, transform: `translateY(${drift}px)`, width: 940 }}>
        <div style={{ fontSize: 26, color: PALETTE.yellow, opacity: kick, marginBottom: 40 }}>
          CMedical — digital plattform
        </div>
        {[
          { txt: "cmedical.no", a: t1, italic: false, col: PALETTE.mid },
          { txt: "møter", a: t2, italic: true, col: PALETTE.mid },
          { txt: "en ny flate.", a: t3, italic: false, col: PALETTE.light },
        ].map((l) => (
          <div
            key={l.txt}
            style={{
              fontSize: 116,
              lineHeight: 1.0,
              fontWeight: 200,
              fontStyle: l.italic ? "italic" : "normal",
              color: l.col,
              opacity: l.a,
              transform: `translateY(${interpolate(l.a, [0, 1], [44, 0])}px)`,
            }}
          >
            {l.txt}
          </div>
        ))}
        <div style={{ height: 1, width: line, background: PALETTE.mid, opacity: 0.5, marginTop: 64 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          bottom: 150,
          fontSize: 26,
          fontWeight: 300,
          color: PALETTE.mid,
          opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Før / etter — 2026
      </div>
    </AbsoluteFill>
  );
};
