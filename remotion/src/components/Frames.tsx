import React from "react";
import { PALETTE } from "../theme";

export const PhoneFrame: React.FC<{
  width: number;
  children: React.ReactNode;
  label?: string;
  labelColor?: string;
  style?: React.CSSProperties;
}> = ({ width, children, label, labelColor = PALETTE.mid, style }) => {
  const height = Math.round((width / 430) * 932);
  const r = width * 0.09;
  return (
    <div style={{ ...style }}>
      {label ? (
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: labelColor,
            marginBottom: 18,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          width,
          height,
          borderRadius: r,
          padding: width * 0.022,
          background: "#0C0906",
          boxShadow: "0 50px 90px -25px rgba(0,0,0,0.75)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: r * 0.86,
            overflow: "hidden",
            position: "relative",
            background: PALETTE.light,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const WindowFrame: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  label?: string;
  labelColor?: string;
  style?: React.CSSProperties;
}> = ({ width, height, children, label, labelColor = PALETTE.mid, style }) => {
  const bar = 34;
  return (
    <div style={{ ...style }}>
      {label ? (
        <div style={{ fontSize: 26, fontWeight: 400, color: labelColor, marginBottom: 16 }}>{label}</div>
      ) : null}
      <div
        style={{
          width,
          height: height + bar,
          borderRadius: 14,
          overflow: "hidden",
          background: "#171009",
          boxShadow: "0 50px 90px -25px rgba(0,0,0,0.75)",
        }}
      >
        <div style={{ height: bar, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>
          {["#4A3B31", "#4A3B31", "#4A3B31"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />
          ))}
        </div>
        <div style={{ width, height, position: "relative", overflow: "hidden", background: PALETTE.light }}>
          {children}
        </div>
      </div>
    </div>
  );
};
