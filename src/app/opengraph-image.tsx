import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time and applied to every route that does not define its
 * own. Deliberately uses no remote fonts or images so it can never fail a build.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(204,255,51,0.22), rgba(8,8,10,0) 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ccff33",
            }}
          />
          <div
            style={{
              color: "#9a99a4",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {site.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f4f2ee",
              fontSize: 92,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              color: "#ccff33",
              fontSize: 40,
              letterSpacing: -1,
              marginTop: 18,
            }}
          >
            {site.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#63626c",
            fontSize: 24,
            borderTop: "1px solid #1c1c22",
            paddingTop: 28,
          }}
        >
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
          <span>{site.email}</span>
        </div>
      </div>
    ),
    size,
  );
}
