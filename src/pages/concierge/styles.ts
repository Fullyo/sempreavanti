// Small shared style helpers for the concierge tool.
import type { CSSProperties } from "react";

export const COLORS = {
  bg: "#F7F4EE",
  card: "#FDFBF7",
  dark: "#1C1914",
  gold: "#B8924A",
  goldLight: "#D4A96A",
  textDark: "#1C1914",
  textMid: "#5A5242",
  textMuted: "#9E9080",
  border: "#DDD5C4",
  green: "#2D6A45",
  amber: "#7A5C1E",
  red: "#8B2E2E",
  blue: "#1E4477",
};

export const fieldLabel: CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: COLORS.textMuted,
  fontFamily: "'Jost', sans-serif",
  marginBottom: 6,
  display: "block",
  fontWeight: 500,
};

export const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${COLORS.border}`,
  background: "#fff",
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  color: COLORS.textDark,
  outline: "none",
  borderRadius: 2,
  boxSizing: "border-box",
};

export const card: CSSProperties = {
  background: "#fff",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 4,
  padding: "18px 22px",
};

export const btnPrimary: CSSProperties = {
  background: COLORS.gold,
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  cursor: "pointer",
  borderRadius: 2,
};

export const btnGhost: CSSProperties = {
  background: "transparent",
  color: COLORS.textMid,
  border: `1px solid ${COLORS.border}`,
  padding: "10px 18px",
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  cursor: "pointer",
  borderRadius: 2,
};

export const btnDanger: CSSProperties = {
  ...btnGhost,
  color: COLORS.red,
  borderColor: COLORS.red,
};

export const heading: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  color: COLORS.textDark,
};

export const sectionTitle: CSSProperties = {
  ...heading,
  fontSize: 28,
  margin: 0,
};
