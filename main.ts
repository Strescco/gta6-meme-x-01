/**
 * gta6-meme-x-01 — "6 STARS, $0 / 0 STARS, $1000"
 *
 * Entry for the make.fun competition gta6-meme-x-01 (post a GTA 6 meme on X).
 *
 * This program (Node 22, standard library only, no network) deterministically
 * regenerates the meme as a self-contained vector master: meme.svg
 * (720 x 1440, the same 1:2 two-panel composition as meme.png).
 *
 * meme.png is the post-ready raster render of the same composition
 * (AI-generated poster, then fixed to exactly six wanted stars and
 * verified by pixel count). The SVG is the reproducible master: run this
 * file and it is rebuilt byte-for-byte from the constants below.
 *
 * V2 (20 Nov, user's direction): the bottom panel's laptop now faces the
 * viewer and its screen shows his real rank-1 win poster from yesterday
 * (19 Nov, BTC race, 1st place, $60, @strescco) — so the $60 in the
 * caption is instantly explained. Source poster:
 * ~/workspace/jedag-jedug/win60-cropped.jpg ("You won 1st place $60",
 * leaderboard row 1 @strescco $60). Raster bottom panel source:
 * bottom-panel-v2.png (AI edit of the v1 desk scene with the poster on
 * the screen); the SVG below draws the same screen content as vectors.
 *
 * V6 (20 Nov, user's feedback on v5): concept right, but the text was too
 * cramped and BUSTED was grey. Fixed both: BUSTED is now GTA-style RED
 * (#E10600, black outline) and moved into the clear sky gap left of the
 * VICE sign (it no longer covers the sign's "V"); -$1000 sits below it with
 * a clear gap and well clear of the car roof and the people. Both captions
 * were redrawn smaller with real padding on both sides ("$1000" no longer
 * jams the right frame edge). Raster work: old captions erased with
 * hole-aware glyph masks + sky-gradient (top) / diffusion (bottom)
 * inpainting; the magenta disc's top arc was redrawn as a Bezier after the
 * bottom caption erase. V5 files kept as meme-v5.png / bottom-panel-v5.png /
 * main-v5.ts for reference.
 *
 * Run:
 *   node --experimental-strip-types main.ts
 *   # (Node 22.6+; on newer Node, plain `node main.ts` also works)
 *
 * Output:
 *   meme.svg  — vector master, 720 x 1440
 *
 * The ghost is the make.fun mascot, drawn here as vector shapes after the
 * official mark (assets/makefun-mark-1024.png, from the make.fun press kit,
 * https://make.fun/press/): a white ghost with black sparkle-diamond eyes
 * and a thick black outline, on a magenta (#C41C83) disc, with the small
 * magenta star badge. The press kit rules say: use the mark as it is, do
 * not redraw, recolour or stretch it — the raster mark in assets/ is
 * untouched; the SVG ghost is a faithful trace of that same mark.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const W = 720;
const H = 1440;
const HALF = 720;

const MAGENTA = "#C41C83";
const MAGENTA_DARK = "#A3146C";
const GOLD = "#FFC93C";
const GOLD_DARK = "#E8A90C";
const INK = "#111111";

/** Five-point star polygon points, centred at (cx, cy), outer radius r. */
function starPoints(cx: number, cy: number, r: number): string {
  const inner = r * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** One gold wanted star. */
function star(cx: number, cy: number, r: number): string {
  return `<polygon points="${starPoints(cx, cy, r)}" fill="${GOLD}" stroke="#7A5200" stroke-width="3" stroke-linejoin="round"/>`;
}

/** The make.fun ghost, drawn as vector shapes after the official mark. */
function ghost(cx: number, cy: number, s: number): string {
  // s = overall scale; the ghost body is ~150 wide at s = 1.
  const body =
    `M ${cx - 75 * s} ${cy + 70 * s} ` +
    `L ${cx - 75 * s} ${cy - 10 * s} ` +
    `C ${cx - 75 * s} ${cy - 65 * s}, ${cx - 40 * s} ${cy - 95 * s}, ${cx} ${cy - 95 * s} ` +
    `C ${cx + 40 * s} ${cy - 95 * s}, ${cx + 75 * s} ${cy - 65 * s}, ${cx + 75 * s} ${cy - 10 * s} ` +
    `L ${cx + 75 * s} ${cy + 70 * s} ` +
    `C ${cx + 60 * s} ${cy + 52 * s}, ${cx + 48 * s} ${cy + 82 * s}, ${cx + 32 * s} ${cy + 70 * s} ` +
    `C ${cx + 16 * s} ${cy + 58 * s}, ${cx + 8 * s} ${cy + 84 * s}, ${cx} ${cy + 70 * s} ` +
    `C ${cx - 8 * s} ${cy + 84 * s}, ${cx - 16 * s} ${cy + 58 * s}, ${cx - 32 * s} ${cy + 70 * s} ` +
    `C ${cx - 48 * s} ${cy + 82 * s}, ${cx - 60 * s} ${cy + 52 * s}, ${cx - 75 * s} ${cy + 70 * s} Z`;
  const diamond = (ex: number, ey: number, r: number): string =>
    `<polygon points="${ex},${ey - r} ${ex + r * 0.62},${ey} ${ex},${ey + r} ${ex - r * 0.62},${ey}" fill="#111111"/>`;
  const smile = `M ${cx - 18 * s} ${cy + 18 * s} Q ${cx} ${cy + 32 * s} ${cx + 18 * s} ${cy + 18 * s}`;
  return `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${150 * s}" fill="${MAGENTA}" stroke="#111111" stroke-width="${10 * s}"/>
    <path d="${body}" fill="#FFFFFF" stroke="#111111" stroke-width="${7 * s}" stroke-linejoin="round"/>
    ${diamond(cx - 28 * s, cy - 18 * s, 15 * s)}
    ${diamond(cx + 28 * s, cy - 18 * s, 15 * s)}
    <path d="${smile}" fill="none" stroke="#111111" stroke-width="${5 * s}" stroke-linecap="round"/>
    <circle cx="${cx + 72 * s}" cy="${cy - 52 * s}" r="${30 * s}" fill="${MAGENTA}" stroke="#111111" stroke-width="${6 * s}"/>
    <polygon points="${starPoints(cx + 72 * s, cy - 52 * s, 17 * s)}" fill="#FFFFFF"/>
    <circle cx="${cx + 72 * s}" cy="${cy - 2 * s}" r="${17 * s}" fill="#FFFFFF" stroke="#111111" stroke-width="${5 * s}"/>
  </g>`;
}

/** Big meme caption text: white fill, thick black outline. */
function caption(text: string, y: number): string {
  return `<text x="360" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" fill="#FFFFFF" stroke="#111111" stroke-width="9" paint-order="stroke" stroke-linejoin="round" letter-spacing="-1">${text}</text>`;
}

/** Top panel: Vice City sunset chase — "ME: 6 STARS, $0". */
function topPanel(): string {
  const stars = [455, 490, 525, 560, 595, 630]
    .map((x) => star(x, 205, 17))
    .join("\n    ");
  return `
  <g>
    <defs>
      <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4B2A72"/>
        <stop offset="0.45" stop-color="#B83A7A"/>
        <stop offset="0.8" stop-color="#FF7E3D"/>
        <stop offset="1" stop-color="#FFC46B"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="720" height="720" fill="url(#sunset)"/>
    <circle cx="360" cy="430" r="120" fill="#FFD9A0" opacity="0.85"/>
    <!-- skyline -->
    <g fill="#241631">
      <rect x="0" y="430" width="90" height="290"/>
      <rect x="100" y="470" width="70" height="250"/>
      <rect x="180" y="400" width="60" height="320"/>
      <rect x="470" y="420" width="80" height="300"/>
      <rect x="560" y="470" width="70" height="250"/>
      <rect x="640" y="400" width="80" height="320"/>
    </g>
    <!-- palm silhouettes -->
    <g stroke="#1D1029" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M70 720 L70 430 M70 430 Q30 400 10 420 M70 430 Q60 390 40 380 M70 430 Q80 385 105 375 M70 430 Q110 405 130 420"/>
      <path d="M660 720 L660 450 M660 450 Q625 420 605 440 M660 450 Q650 410 630 400 M660 450 Q670 405 695 395 M660 450 Q700 425 718 442"/>
    </g>
    <!-- helicopters with searchlights -->
    <g fill="#1D1029">
      <ellipse cx="180" cy="280" rx="42" ry="16"/>
      <rect x="150" y="266" width="60" height="10" rx="5"/>
      <ellipse cx="330" cy="250" rx="42" ry="16"/>
      <rect x="300" y="236" width="60" height="10" rx="5"/>
    </g>
    <g fill="#FFF3C4" opacity="0.55">
      <polygon points="180,296 150,470 210,470"/>
      <polygon points="330,266 300,470 360,470"/>
    </g>
    <!-- neon VICE sign -->
    <text x="600" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" font-style="italic" fill="#FF5DA2" stroke="#7A1040" stroke-width="2">VICE</text>
    <!-- six gold wanted stars, exactly six -->
    ${stars}
    <!-- pink getaway car -->
    <g>
      <rect x="120" y="540" width="480" height="90" rx="38" fill="#E83E8C" stroke="#8E0F56" stroke-width="5"/>
      <path d="M210 545 Q240 480 310 480 L430 480 Q480 490 500 545 Z" fill="#2A1B2E" stroke="#8E0F56" stroke-width="5"/>
      <rect x="330" y="495" width="70" height="40" rx="8" fill="#9AD7FF" opacity="0.9"/>
      <circle cx="215" cy="630" r="42" fill="#16121A" stroke="#3A3A3A" stroke-width="6"/>
      <circle cx="215" cy="630" r="18" fill="#C9CDD6"/>
      <circle cx="505" cy="630" r="42" fill="#16121A" stroke="#3A3A3A" stroke-width="6"/>
      <circle cx="505" cy="630" r="18" fill="#C9CDD6"/>
      <ellipse cx="590" cy="585" rx="18" ry="8" fill="#FFF6C9"/>
    </g>
    <!-- BUSTED overlay (V6): GTA-style RED, in the clear sky gap left of the
         VICE sign so the sign stays fully legible; -$1000 below it with a
         clear gap, well clear of the car roof and the people -->
    <text x="305" y="318" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" fill="#E10600" stroke="#111111" stroke-width="8" paint-order="stroke" stroke-linejoin="round">BUSTED</text>
    <text x="305" y="395" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" stroke="#111111" stroke-width="4" paint-order="stroke" stroke-linejoin="round">-$1000</text>
    ${caption("ME: 6 STARS, $0", 100)}
  </g>`;
}

/** Bottom panel: the ghost earning at its desk — "MY AGENT: 0 STARS, $1000". */
function bottomPanel(): string {
  return `
  <g>
    <rect x="0" y="720" width="720" height="720" fill="#E8DCC8"/>
    <rect x="0" y="720" width="720" height="330" fill="#D9C6A5"/>
    <!-- corkboard -->
    <rect x="48" y="780" width="180" height="150" rx="8" fill="#B98A56" stroke="#7A5230" stroke-width="4"/>
    <g fill="#FFF8E6"><rect x="66" y="800" width="40" height="52"/><rect x="118" y="800" width="40" height="52"/><rect x="170" y="800" width="40" height="52"/><rect x="66" y="864" width="40" height="52"/><rect x="118" y="864" width="40" height="52"/></g>
    <!-- desk -->
    <rect x="0" y="1150" width="720" height="290" fill="#8A5A33"/>
    <rect x="0" y="1150" width="720" height="14" fill="#A9713F"/>
    <!-- speech bubble rising OUT OF THE LAPTOP: it floats above the lid
         and its tail points down to the lid's top edge, so the ghost's
         face stays fully clear. His real rank-1 win poster inside. -->
    <g>
      <polygon points="160,1003 220,1003 190,1035" fill="#FFFFFF" stroke="#111111" stroke-width="5" stroke-linejoin="round"/>
      <rect x="45" y="815" width="280" height="190" rx="22" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <rect x="59" y="829" width="252" height="162" fill="#16181D" stroke="#111111" stroke-width="3"/>
      <circle cx="185" cy="866" r="24" fill="${MAGENTA}" stroke="#111111" stroke-width="4"/>
      <circle cx="185" cy="862" r="12" fill="#FFFFFF"/>
      <path d="M173 862 L173 874 Q179 868 185 874 Q191 868 197 874 L197 862 Z" fill="#FFFFFF"/>
      <text x="185" y="908" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">You won 1st place</text>
      <text x="185" y="942" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FF7AB8">$1000</text>
      <text x="185" y="966" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#FFFFFF">Race a BTC trading bot live for 24 hours</text>
      <text x="185" y="984" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#9AA0B0">@strescco</text>
    </g>
    <!-- laptop, rear view: back of the lid faces the viewer, no screen -->
    <g>
      <polygon points="115,995 295,980 305,1145 125,1158" fill="#23262E" stroke="#16121A" stroke-width="5" stroke-linejoin="round"/>
      <rect x="100" y="1145" width="215" height="12" rx="4" fill="#565D6E"/>
    </g>
    <!-- cash + coins -->
    <g>
      <rect x="90" y="1240" width="120" height="52" rx="6" fill="#7FA36B" stroke="#3F6234" stroke-width="4" transform="rotate(-4 150 1266)"/>
      <rect x="90" y="1240" width="120" height="52" rx="6" fill="none" stroke="#E8F0DC" stroke-width="3" transform="rotate(-4 150 1266)"/>
      <ellipse cx="250" cy="1300" rx="26" ry="10" fill="${GOLD}" stroke="#8A6D00" stroke-width="3"/>
      <ellipse cx="250" cy="1288" rx="26" ry="10" fill="${GOLD}" stroke="#8A6D00" stroke-width="3"/>
      <ellipse cx="250" cy="1276" rx="26" ry="10" fill="${GOLD}" stroke="#8A6D00" stroke-width="3"/>
    </g>
    <!-- coffee -->
    <g>
      <ellipse cx="620" cy="1180" rx="34" ry="44" fill="#F5EFE2" stroke="#8A7A5A" stroke-width="4"/>
      <path d="M652 1160 q26 18 0 40" fill="none" stroke="#8A7A5A" stroke-width="5"/>
      <ellipse cx="620" cy="1170" rx="26" ry="10" fill="#6B4226"/>
    </g>
    ${ghost(500, 1000, 1.2)}
    ${caption("MY AGENT: 0 STARS, $1000", 800)}
  </g>`;
}

function buildSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n` +
    `<rect x="0" y="0" width="720" height="1440" fill="#111111"/>\n` +
    topPanel() +
    bottomPanel() +
    `<rect x="0" y="712" width="720" height="16" fill="#111111"/>\n` +
    `</svg>\n`;
}

/** Read PNG width/height straight from the IHDR chunk (no image library). */
function pngSize(path: string): { width: number; height: number } | null {
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const svg = buildSvg();
  const svgPath = join(here, "meme.svg");
  writeFileSync(svgPath, svg, "utf8");

  const png = pngSize(join(here, "meme.png"));
  const stars = (svg.match(/<polygon points="[^"]*" fill="#FFC93C"/g) ?? []).length;

  console.log("gta6-meme-x-01 — 6 STARS, $0 / 0 STARS, $1000");
  console.log(`wrote ${svgPath} (${svg.length} bytes, ${W}x${H})`);
  console.log(`gold wanted stars in top panel: ${stars} (must be exactly 6)`);
  console.log(
    png
      ? `meme.png present: ${png.width}x${png.height} (post-ready raster)`
      : "meme.png MISSING — the post-ready raster is not in the repo",
  );
  if (stars !== 6) {
    console.error("ERROR: star count is not 6 — fix topPanel() before posting.");
    process.exitCode = 1;
  }
}

main();
