import { ImageResponse } from "next/og";

/**
 * Favicon, generated rather than shipped as a binary.
 *
 * There was no icon at all before this file, so `/favicon.ico` answered 404 and
 * the browser tab fell back to a blank page glyph.
 *
 * The full `[ KDS ]` wordmark does not survive 32 pixels — three letters and two
 * brackets turn to mush — so the mark is reduced to the initial on the terminal
 * background, with the accent rule the header uses under the wordmark. That rule
 * is what makes it read as this brand rather than as a generic letter tile.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070b14",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1,
          }}
        >
          K
        </div>
        <div
          style={{
            width: 16,
            height: 2,
            marginTop: 2,
            background: "#34d399",
          }}
        />
      </div>
    ),
    size,
  );
}
