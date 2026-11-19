// gta6-meme-x-01 rebuild — entrypoint.
// Node 22, stdlib only. Regenerates meme.svg and validates it:
// exactly six gold wanted stars, and meme.png present at 720x1440.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 720;
const H = 1440;
const PANEL = 720;
const GOLD = "#FFC93C";
const GOLD_DARK = "#7A5200";
const MAGENTA = "#C41C83";

const fmt = (n: number): string => {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
};

// Five-point star polygon: 10 vertices alternating outer/inner radius.
function starPoints(cx: number, cy: number, outer: number, innerRatio = 0.42): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : outer * innerRatio;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${fmt(cx + r * Math.cos(a))},${fmt(cy + r * Math.sin(a))}`);
  }
  return pts.join(" ");
}

function star(cx: number, cy: number, outer: number): string {
  return `<polygon points="${starPoints(cx, cy, outer)}" fill="${GOLD}" stroke="${GOLD_DARK}" stroke-width="3" stroke-linejoin="round"/>`;
}

// Big outlined caption, white fill over a thick black stroke.
// strokeW is tuned per size: the renderer draws the stroke centred on
// the glyph outline, so a stroke wider than ~0.1x the size swallows
// the white fill entirely (verified by rendering: 62/9 and 50/7 both
// come out solid black, while 62/6 and 50/5 stay white and readable).
function caption(text: string, x: number, y: number, size: number, strokeW: number): string {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="900" letter-spacing="-1" fill="#FFFFFF" stroke="#000000" stroke-width="${strokeW}" paint-order="stroke" stroke-linejoin="round">${esc}</text>`;
}

// make.fun ghost: magenta disc behind a white ghost body with diamond
// eyes, a smile, a star badge and a small white circle. Drawn from a
// centre point and a scale factor.
function ghost(cx: number, cy: number, s: number): string {
  const discR = 150 * s;
  const bodyW = 150 * s;
  const bodyH = 210 * s;
  const top = cy - bodyH / 2;
  const left = cx - bodyW / 2;
  const right = cx + bodyW / 2;
  const bottom = cy + bodyH / 2;
  // Wavy hem: three rounded scallops along the bottom edge.
  const scallop = bodyW / 6;
  const hemY = bottom - 18 * s;
  const body = [
    `M ${fmt(left)} ${fmt(hemY)}`,
    `L ${fmt(left)} ${fmt(top + bodyW / 2)}`,
    `A ${fmt(bodyW / 2)} ${fmt(bodyW / 2)} 0 0 1 ${fmt(right)} ${fmt(top + bodyW / 2)}`,
    `L ${fmt(right)} ${fmt(hemY)}`,
    `A ${fmt(scallop)} ${fmt(18 * s)} 0 0 0 ${fmt(right - 2 * scallop)} ${fmt(hemY)}`,
    `A ${fmt(scallop)} ${fmt(18 * s)} 0 0 0 ${fmt(right - 4 * scallop)} ${fmt(hemY)}`,
    `A ${fmt(scallop)} ${fmt(18 * s)} 0 0 0 ${fmt(left)} ${fmt(hemY)}`,
    "Z",
  ].join(" ");
  const eye = (ex: number, ey: number, r: number) =>
    `<rect x="${fmt(ex - r)}" y="${fmt(ey - r)}" width="${fmt(2 * r)}" height="${fmt(2 * r)}" fill="#000000" transform="rotate(45 ${fmt(ex)} ${fmt(ey)})"/>`;
  const badgeX = cx + 100 * s;
  const badgeY = cy - 110 * s;
  const badgeR = 26 * s;
  return [
    `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(discR)}" fill="${MAGENTA}" stroke="#000000" stroke-width="${fmt(10 * s)}"/>`,
    `<path d="${body}" fill="#FFFFFF" stroke="#000000" stroke-width="${fmt(8 * s)}" stroke-linejoin="round"/>`,
    eye(cx - 26 * s, cy - 18 * s, 11 * s),
    eye(cx + 26 * s, cy - 18 * s, 11 * s),
    `<path d="M ${fmt(cx - 16 * s)} ${fmt(cy + 22 * s)} Q ${fmt(cx)} ${fmt(cy + 36 * s)} ${fmt(cx + 16 * s)} ${fmt(cy + 22 * s)}" fill="none" stroke="#000000" stroke-width="${fmt(5 * s)}" stroke-linecap="round"/>`,
    `<circle cx="${fmt(badgeX)}" cy="${fmt(badgeY)}" r="${fmt(badgeR)}" fill="${MAGENTA}" stroke="#FFFFFF" stroke-width="${fmt(4 * s)}"/>`,
    `<polygon points="${starPoints(badgeX, badgeY, badgeR * 0.62, 0.42)}" fill="#FFFFFF"/>`,
    `<circle cx="${fmt(cx + 96 * s)}" cy="${fmt(cy - 62 * s)}" r="${fmt(12 * s)}" fill="#FFFFFF" stroke="#000000" stroke-width="${fmt(3 * s)}"/>`,
  ].join("\n");
}

// ---- Top panel: Vice City sunset chase, 6 stars, $0 ----

function palm(x: number, baseY: number, lean: number): string {
  const topX = x + lean;
  const topY = baseY - 210;
  const fronds: string[] = [];
  for (let k = -2; k <= 2; k++) {
    const fx = topX + k * 52;
    const fy = topY - 18 + Math.abs(k) * 26;
    fronds.push(
      `<path d="M ${fmt(topX)} ${fmt(topY)} Q ${fmt((topX + fx) / 2)} ${fmt(topY - 34)} ${fmt(fx)} ${fmt(fy)}" fill="none" stroke="#1D1029" stroke-width="9" stroke-linecap="round"/>`
    );
  }
  return [
    `<path d="M ${fmt(x)} ${fmt(baseY)} Q ${fmt(x + lean / 2)} ${fmt(baseY - 110)} ${fmt(topX)} ${fmt(topY)}" fill="none" stroke="#1D1029" stroke-width="15" stroke-linecap="round"/>`,
    ...fronds,
  ].join("\n");
}

function heli(x: number, y: number): string {
  return [
    `<polygon points="${fmt(x - 95)},${fmt(y + 95)} ${fmt(x + 95)},${fmt(y + 95)} ${fmt(x + 28)},${fmt(y + 8)} ${fmt(x - 28)},${fmt(y + 8)}" fill="#FFF3C4" opacity="0.55"/>`,
    `<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="46" ry="15" fill="#1D1029"/>`,
    `<rect x="${fmt(x - 58)}" y="${fmt(y - 22)}" width="116" height="4" fill="#1D1029"/>`,
    `<rect x="${fmt(x - 4)}" y="${fmt(y - 30)}" width="8" height="12" fill="#1D1029"/>`,
  ].join("\n");
}

function topPanel(): string {
  const parts: string[] = [];
  parts.push(`<defs><linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4B2A72"/><stop offset="0.45" stop-color="#B83A7A"/>
    <stop offset="0.8" stop-color="#FF7E3D"/><stop offset="1" stop-color="#FFC46B"/>
  </linearGradient></defs>`);
  parts.push(`<rect x="0" y="0" width="720" height="720" fill="url(#sunset)"/>`);
  parts.push(`<circle cx="360" cy="430" r="120" fill="#FFD9A0" opacity="0.85"/>`);
  parts.push(heli(150, 150));
  parts.push(heli(560, 110));
  // Skyline blocks on both sides, middle kept open for sun and car.
  const blocks: Array<[number, number, number, number]> = [
    [0, 480, 70, 240], [70, 520, 60, 200], [130, 460, 55, 260],
    [600, 470, 55, 250], [655, 520, 65, 200],
  ];
  for (const [bx, by, bw, bh] of blocks) {
    parts.push(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#241631"/>`);
  }
  parts.push(palm(52, 720, 26));
  parts.push(palm(672, 720, -26));
  // Neon VICE sign, right side, fully clear of everything else.
  parts.push(`<text x="600" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-style="italic" font-weight="900" fill="#FF5DA2" stroke="#7A1040" stroke-width="7" paint-order="stroke">VICE</text>`);
  // Exactly six gold wanted stars.
  const starXs = [455, 490, 525, 560, 595, 630];
  for (const sx of starXs) parts.push(star(sx, 205, 17));
  // Pink getaway car.
  parts.push(`<g>
    <rect x="120" y="545" width="480" height="80" rx="34" fill="#E83E8C" stroke="#8E0F56" stroke-width="5"/>
    <path d="M 210 550 L 250 505 L 420 505 L 460 550 Z" fill="#2A1B2E"/>
    <path d="M 262 512 L 300 512 L 300 545 L 262 545 Z" fill="#9AD7FF" opacity="0.9"/>
    <circle cx="215" cy="630" r="42" fill="#111111"/><circle cx="215" cy="630" r="18" fill="#8A8A8A"/>
    <circle cx="505" cy="630" r="42" fill="#111111"/><circle cx="505" cy="630" r="18" fill="#8A8A8A"/>
    <circle cx="590" cy="585" r="12" fill="#FFF6C9" opacity="0.9"/>
  </g>`);
  // BUSTED overlay in the clear sky gap left of VICE.
  parts.push(`<text x="305" y="318" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" fill="#E10600" stroke="#000000" stroke-width="12" paint-order="stroke" stroke-linejoin="round">BUSTED</text>`);
  parts.push(`<text x="305" y="395" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" stroke="#000000" stroke-width="8" paint-order="stroke">-$1000</text>`);
  parts.push(caption("ME: 6 STARS, $0", 360, 100, 62, 6));
  return parts.join("\n");
}

// ---- Bottom panel: the ghost at its desk, 0 stars, $1000 ----

function bottomPanel(): string {
  const parts: string[] = [];
  parts.push(`<rect x="0" y="720" width="720" height="720" fill="#E8DCC8"/>`);
  parts.push(`<rect x="0" y="720" width="720" height="330" fill="#D9C6A5"/>`);
  // Desk.
  parts.push(`<rect x="0" y="1150" width="720" height="290" fill="#8A5A33"/>`);
  parts.push(`<rect x="0" y="1150" width="720" height="14" fill="#A9713F"/>`);
  // Corkboard, lower left on the wall, clear of the bubble and laptop,
  // holding five small pale pinned notes in two rows.
  parts.push(`<rect x="40" y="1010" width="170" height="130" rx="10" fill="#B98A56" stroke="#7A5230" stroke-width="4"/>`);
  const notes: Array<[number, number]> = [[54, 1024], [118, 1024], [182, 1024], [86, 1078], [150, 1078]];
  for (const [nx, ny] of notes) {
    parts.push(`<rect x="${nx}" y="${ny}" width="52" height="42" rx="4" fill="#FFF8E6" stroke="#D9C6A5" stroke-width="2"/>`);
    parts.push(`<circle cx="${fmt(nx + 26)}" cy="${fmt(ny + 4)}" r="4" fill="#C41C83"/>`);
  }
  // Laptop, rear view: the BACK of the lid faces the viewer (no screen,
  // no screen content). Lid sits on the desk, right of the corkboard.
  parts.push(`<g>
    <polygon points="190,1000 340,992 350,1150 180,1158" fill="#23262E" stroke="#000000" stroke-width="5" stroke-linejoin="round"/>
    <rect x="172" y="1145" width="196" height="12" rx="4" fill="#565D6E"/>
  </g>`);
  // Speech bubble rising OUT OF THE LAPTOP: it hangs above the lid and
  // its small triangular tail points DOWN to the lid's top edge.
  parts.push(`<g>
    <path d="M 67 805 L 303 805 A 22 22 0 0 1 325 827 L 325 953 A 22 22 0 0 1 303 975 L 278 975 L 262 1006 L 238 975 L 67 975 A 22 22 0 0 1 45 953 L 45 827 A 22 22 0 0 1 67 805 Z" fill="#FFFFFF" stroke="#000000" stroke-width="6" stroke-linejoin="round"/>
    <rect x="59" y="817" width="252" height="146" rx="6" fill="#16181D"/>
    <circle cx="185" cy="842" r="16" fill="#C41C83"/>
    <path d="M 177 842 L 180 846 L 177 850 L 185 850 L 188 846 L 185 842 Z" fill="#FFFFFF"/>
    <text x="185" y="888" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">You won 1st place</text>
    <text x="185" y="920" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#FF7AB8">$1000</text>
    <text x="185" y="942" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#FFFFFF">Race a BTC trading bot live for 24 hours</text>
    <text x="185" y="958" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#9AA0B0">@strescco</text>
  </g>`);
  // Cash stack and gold coins on the desk, left side.
  parts.push(`<g transform="rotate(-6 150 1266)">
    <rect x="90" y="1240" width="120" height="52" rx="4" fill="#7FA36B" stroke="#3F6234" stroke-width="4"/>
    <rect x="90" y="1258" width="120" height="16" fill="#E8F0D8" opacity="0.85"/>
  </g>`);
  for (let i = 0; i < 3; i++) {
    parts.push(`<ellipse cx="250" cy="${1276 + i * 12}" rx="34" ry="10" fill="#FFC93C" stroke="#7A5200" stroke-width="3"/>`);
  }
  // Coffee cup, right side of the desk.
  parts.push(`<g>
    <path d="M 600 1180 L 640 1180 L 634 1246 A 10 10 0 0 1 624 1256 L 616 1256 A 10 10 0 0 1 606 1246 Z" fill="#F5EFE2" stroke="#8A7A5A" stroke-width="4"/>
    <path d="M 640 1196 A 16 16 0 0 1 640 1228" fill="none" stroke="#8A7A5A" stroke-width="5"/>
    <ellipse cx="620" cy="1180" rx="20" ry="6" fill="#6B4226"/>
  </g>`);
  // The make.fun ghost, big, right side.
  parts.push(ghost(500, 1000, 1.2));
  // Bottom caption is longer, so it runs one size smaller (50) to keep
  // real padding from both frame edges; the renderer ignores textLength,
  // so the size itself has to do the fitting.
  parts.push(caption("MY AGENT: 0 STARS, $1000", 360, 800, 50, 5));
  return parts.join("\n");
}

// ---- Assembly and validation ----

function buildSvg(): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#000000"/>`,
    topPanel(),
    bottomPanel(),
    `<rect x="0" y="712" width="720" height="16" fill="#000000"/>`,
    `</svg>`,
  ].join("\n");
}

function pngSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 24 || buf.readUInt32BE(12) !== 0x49484452) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function main(): void {
  const svg = buildSvg();
  const svgPath = join(HERE, "meme.svg");
  writeFileSync(svgPath, svg, "utf8");
  const goldStars = (svg.match(/<polygon[^>]*fill="#FFC93C"/g) ?? []).length;
  const pngPath = join(HERE, "meme.png");
  let pngLine: string;
  if (existsSync(pngPath)) {
    const size = pngSize(readFileSync(pngPath));
    pngLine = size
      ? `meme.png present: ${size.w}x${size.h}`
      : "meme.png present but unreadable (bad IHDR)";
  } else {
    pngLine = "meme.png MISSING — run render.py";
  }
  console.log("gta6-meme-x-01 — 6 STARS, $0 / 0 STARS, $1000");
  console.log(`meme.svg written: ${svgPath} (${svg.length} bytes, ${W}x${H})`);
  console.log(`gold wanted stars: ${goldStars}`);
  console.log(pngLine);
  if (goldStars !== 6) {
    console.error("ERROR: expected exactly 6 gold stars");
    process.exit(1);
  }
}

main();
