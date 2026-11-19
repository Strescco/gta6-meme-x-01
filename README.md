# gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Strescco/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Strescco/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

A GTA 6 meme in two panels: me with 6 stars and $0 (BUSTED: -$1000), my agent with 0 stars and $1000 — built from his real rank-1 win poster.

## Run it

```sh
node --experimental-strip-types main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=7ch7x9gh&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>

## The meme

Entry for the [make.fun](https://make.fun) competition **gta6-meme-x-01**
(post a GTA 6 meme on X). $500 pot, top 50 paid. Deadline 23 Nov 2026, 21:00 WIB.

![The meme](meme.png)

## The joke

Top panel: me in Vice City at six-star wanted level — helicopters, neon,
a pink getaway car — and I get **BUSTED, -$1000** to show for it.

Bottom panel: my AI agent on make.fun, zero stars, zero cops, calmly
earning **$1000** at its laptop while the make.fun ghost looks on, smug.
The laptop faces away (back of the lid, no screen content), and the
win poster pops out of the laptop itself in a speech bubble — the
bubble floats above the lid with its tail pointing down to the lid, so
the ghost's face stays fully clear: **"You won 1st place $1000 — Race a
BTC trading bot live for 24 hours — @strescco"**, so the $1000 is
instantly explained instead of just asserted. (V2 had the poster on the
laptop screen; V3 had the bubble coming from the ghost, whose tail
touched the ghost's eye — the user moved it to the laptop in V4. V3
files kept as `meme-v3.png` / `bottom-panel-v3.png` / `main-v3.ts`.
V5, on the user's order — "biar gak kelihatan receh make.fun nya" —
added the BUSTED -$1000 overlay on top and raised every $60 to $1000.
V4 files kept as `meme-v4.png` / `bottom-panel-v4.png` / `main-v4.ts`.)
V6, on the user's feedback — text too cramped, BUSTED must be red like in
GTA — made BUSTED red (#E10600) and moved it into the clear sky gap left
of the VICE sign, and redrew both captions smaller with real padding on
both sides. V5 files kept as `meme-v5.png` / `bottom-panel-v5.png` /
`main-v5.ts`.)

> **ME: 6 STARS, $0 — BUSTED, -$1000 — MY AGENT: 0 STARS, $1000**

The joke lands on its own for any GTA fan: in GTA you rob banks for fake
money; on make.fun your agent earns real money. The promo rides inside
the punchline, not on top of it.

Built to the judge's order: (1) the make.fun ghost mascot is front and
centre in the picture; (2) funny first; (3) all about GTA 6 launch week
(19 Nov 2026, Leonida / Vice City, six-star wanted); (4) sells make.fun
because the punchline *is* the payout; (5) short readable caption;
(6) original — the wanted-level parallel, not a recycled "waited 13
years" joke; (7) clean, high-contrast, readable at X feed size.
Likes/replies/reposts never count — the judge compares posts pairwise.

## Files

| File | What it is |
| --- | --- |
| `meme.png` | **The post-ready meme image** (720×1440). Post this on X. |
| `meme-v6.png` | Current full meme (v6): red BUSTED, VICE fully visible, padded captions. |
| `bottom-panel-v6.png` | Current bottom panel (v6): caption redrawn with padding (PIL edit of the v5 panel; disc arc redrawn as a Bezier). |
| `main-v6.ts` | Current program version (v6). |
| `meme-v7.png` | Alternate full meme (v7): thug-life ghost (pixel sunglasses + cigarette), de-blurred captions — user chose v6 instead. |
| `bottom-panel-v7.png` | Alternate bottom panel (v7): wall texture restored, crisp poster logo, thug-life ghost. |
| `main-v7.ts` | Alternate program version (v7). |
| `meme-v5.png` | Previous full meme (v5): grey BUSTED, cramped captions. |
| `bottom-panel-v5.png` | Previous bottom panel (v5): caption and bubble poster at $1000 (PIL edit of the v4 panel). |
| `main-v5.ts` | Previous program version (v5). |
| `meme-v4.png` | Previous full meme (v4): bubble from the laptop, $60. |
| `bottom-panel-v4.png` | Previous bottom panel (v4): desk scene + bubble rising out of the laptop (PIL composite on the v3 panel). |
| `main-v4.ts` | Previous program version (v4). |
| `bottom-panel-v3.png` | Previous bottom panel (v3): desk scene with the laptop turned away (back of lid), no bubble. |
| `meme-v3.png` | Previous full meme (v3): bubble coming from the ghost. |
| `bottom-panel-v2.png` | Previous bottom panel (v2): desk scene with the real win poster on the laptop screen. |
| `main.ts` | The program that produces/regenerates the meme as a vector master (`meme.svg`). Node 22, standard library only, no network. |
| `meme.svg` | Vector master, regenerated by `main.ts`. |
| `assets/makefun-mark-1024.png` | The official make.fun ghost mark, untouched, from the [make.fun press kit](https://make.fun/press/). |
| `POST.json` | The X post URL for this entry. |
| `LICENSE` | MIT. |

## Regenerate

```sh
node --experimental-strip-types main.ts
# (Node 22.6+; newer Node runs `node main.ts` directly)
```

This rebuilds `meme.svg` deterministically and checks it: exactly six
gold wanted stars in the top panel, and that `meme.png` is present.
It exits non-zero if the star count is wrong.

## Post text (posted on X, 20 Nov 2026 04:04 WIB)

```
Me in GTA 6: 6 stars, $0. BUSTED: -$1000.
My agent: 0 stars, $1000. 👻
Your agent could be next: https://make.fun/bounty/gta6-meme-x-01
@makefunai · play code: makefun-mallard-woodland-corridor
```

Post: https://x.com/Strescco/status/2123522914599440824

## Brand

make.fun ghost mascot and name used under the press-kit rules
(`https://make.fun/press/`): the mark is used as-is, never redrawn,
recoloured or stretched. Magenta `#C41C83`.

## Pilihan user 20 Nov 04:03 WIB: pakai V6
V7 (ghost thug life + de-blur) selesai tapi user pilih gambar sebelumnya — V6 yang dipakai. meme.png / main.ts / meme.svg dibalikin ke V6 (md5 meme.png = meme-v6.png). V7 tetap tersimpan (meme-v7.png / main-v7.ts) sebagai alternatif.
