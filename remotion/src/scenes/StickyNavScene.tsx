import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PALETTE } from "../theme";
import { PhoneFrame } from "../components/Frames";
import { KineticLine, Grain } from "../components/Fx";

const SEQ = 48;
const pad = (n: number) => String(n).padStart(2, "0");

/** Ekte scroll-opptak av prislisten på mobil — kategorimenyen fester seg på toppen. */
export const StickyNavScene: React.FC<{
  kicker: string;
  title: string;
  note: string;
  duration: number;
}> = ({ kicker, title, note, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const PW = 520;
  const PH = Math.round((PW / 430) * 932);

  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const noteIn = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 40 });

  const idx = Math.min(
    SEQ - 1,
    Math.max(0, Math.round(interpolate(frame, [14, duration - 10], [0, SEQ - 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }))),
  );

  // høyde på den klebrige menyen i telefonskjermen
  const navH = PW * (78 / 430);
  const ringIn = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 26 });
  const pulse = 0.5 + 0.5 * Math.sin((frame - 40) / 7);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.deep }}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 52% at 50% 60%, ${PALETTE.dark} 0%, ${PALETTE.deep} 72%)` }} />

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
      </div>

      <div
        style={{
          position: "absolute",
          left: (1080 - PW) / 2 + 60,
          top: 620,
          opacity: rise,
          transform: `translateY(${interpolate(rise, [0, 1], [110, 0])}px) rotateY(-6deg)`,
          transformStyle: "preserve-3d",
          perspective: 1800,
        }}
      >
        <div style={{ position: "absolute", inset: -26, borderRadius: 62, background: PALETTE.yellow, opacity: 0.14 * rise }} />
        <PhoneFrame width={PW}>
          <Img
            src={staticFile(`cmp/priserseq/f${pad(idx)}.png`)}
            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
          {/* markering av den klebrige kategorimenyen */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              right: 4,
              height: navH,
              borderRadius: 16,
              border: `3px solid ${PALETTE.yellow}`,
              boxShadow: `0 0 ${18 + 22 * pulse}px rgba(244,255,120,${0.25 + 0.3 * pulse})`,
              opacity: ringIn,
            }}
          />
        </PhoneFrame>

        {/* callout */}
        <div
          style={{
            position: "absolute",
            left: -320,
            top: navH * 0.1,
            opacity: ringIn,
            transform: `translateX(${interpolate(ringIn, [0, 1], [-40, 0])}px)`,
            textAlign: "right",
            width: 280,
          }}
        >
          <div style={{ fontSize: 27, color: PALETTE.yellow, fontWeight: 400 }}>Kategorimenyen</div>
          <div style={{ fontSize: 23, color: PALETTE.mid, fontWeight: 300, lineHeight: 1.35, marginTop: 6 }}>
            låser seg til toppen og markerer hvor du er
          </div>
        </div>

      </div>

      <Grain />
    </AbsoluteFill>
  );
};
