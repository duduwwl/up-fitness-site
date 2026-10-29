export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { weekdayHoursText } from "@/lib/hours";

export const alt = "UP Fitness Zona Sul, academia de musculação em Lavras, MG";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e0e",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, color: "#ffcb05", lineHeight: 1 }}>DÊ UM UP</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 48, fontWeight: 700 }}>UP Fitness Zona Sul · Lavras, MG</div>
          <div style={{ fontSize: 32 }}>{`Musculação em dois andares climatizados · ${weekdayHoursText}`}</div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 72,
            width: 180,
            height: 220,
            background: "#ffcb05",
            clipPath: "polygon(50% 0, 100% 42%, 66% 42%, 66% 100%, 34% 100%, 34% 42%, 0 42%)",
          }}
        />
      </div>
    ),
    size,
  );
}

