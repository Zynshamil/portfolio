import { ImageResponse } from "next/og";
import { BRAND, BRAND_INK } from "@/lib/brand";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time and applied to every route that does not define its
 * own. Deliberately uses no remote fonts or images so it can never fail a build.
 *
 * Painted in the brand colours rather than in a palette: this is the card that
 * arrives before the site does, so it should look like the curtain a visitor
 * lands on, not like whichever of the four they might later pick. Those colours
 * are literals here because `ImageResponse` rasterises with no stylesheet in
 * scope — `src/lib/brand.ts` is where they are named.
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
          background: BRAND.blue,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* The gold ring off the top-right corner, the same mark the intro
            curtain opens with. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: "50%",
            border: `14px solid ${BRAND.gold}`,
            opacity: 0.5,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BRAND.orange,
            }}
          />
          <div
            style={{
              color: BRAND_INK.subtle,
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
              color: BRAND_INK.paper,
              fontSize: 92,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              color: BRAND.gold,
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
            color: BRAND_INK.muted,
            fontSize: 24,
            borderTop: `1px solid ${BRAND_INK.rule}`,
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
