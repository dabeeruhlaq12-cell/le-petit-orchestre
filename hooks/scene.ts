// Le Petit Orchestre: the backdrop scene.
//
// A perfectly symmetrical bandstand: a scalloped striped awning across the
// top, and below it neat rows of little notes that bob in time, all together,
// like a marching band. Every 30 seconds one note (a different one each time)
// hops out of line and back. Pure SVG + CSS: no script, ~16 animated groups.

const W = 1600
const H = 1600
const CX = W / 2

// Palette
const BLUSH = '#F6D6D2'
const ROSE = '#E39A90' // awning stripe: deep enough to read against the blush page
const CREAM = '#FBF3E4'
const MUSTARD = '#D9A441'
const POWDER = '#8FB8C9'
const MINT = '#9CCFB1' // a touch deeper than the bubble mint so it reads on blush
const NIGHT = '#2A1E1A'

// ---- the awning -----------------------------------------------------------
// 21 stripes (odd, so one sits dead centre and both halves mirror); each ends in a scallop.
const STRIPES = 21
const SW = W / STRIPES
const AWNING_H = 70

function awning(): string {
  let out = ''
  for (let i = 0; i < STRIPES; i++) {
    const x = i * SW
    const cls = i % 2 === 0 ? 'aw-a' : 'aw-b'
    // straight body + scalloped bottom (arc), drawn as one path
    out += `<path class="${cls}" d="M${x} 0H${x + SW}V${AWNING_H}A${SW / 2} ${SW / 2} 0 0 1 ${x} ${AWNING_H}Z"/>`
  }
  // a thin mustard trim rope just under the valance
  out += `<path class="trim" d="M0 ${AWNING_H + 2}H${W}"/>`
  return out
}

// ---- the notes ------------------------------------------------------------
const EIGHTH =
  '<symbol id="n1" viewBox="0 0 32 40" overflow="visible">' +
  '<ellipse cx="11" cy="32" rx="8" ry="5.6" transform="rotate(-22 11 32)"/>' +
  '<rect x="17" y="4" width="3" height="28" rx="1.2"/>' +
  '<path d="M18.5 4c5 3 10 6 9 14c-1-5-5-7-9-8z"/></symbol>'
const BEAMED =
  '<symbol id="n2" viewBox="0 0 40 40" overflow="visible">' +
  '<ellipse cx="9" cy="33" rx="7.4" ry="5.2" transform="rotate(-22 9 33)"/>' +
  '<ellipse cx="31" cy="29" rx="7.4" ry="5.2" transform="rotate(-22 31 29)"/>' +
  '<rect x="14.5" y="6" width="2.8" height="27" rx="1.1"/>' +
  '<rect x="36.5" y="2" width="2.8" height="27" rx="1.1"/>' +
  '<path d="M14.5 6L39.3 2v6L14.5 12z"/></symbol>'

const COLS = 14 // even, so the grid mirrors exactly about the centre
const COL_GAP = 110
const ROW_GAP = 118
const FIRST_ROW = 200
const ROWS = Math.floor((H - FIRST_ROW) / ROW_GAP) + 1
const COLORS = ['c-m', 'c-p', 'c-t'] // mustard, powder, mint

// The soloists: [row, col]. Each hops once in a 180 s cycle, 30 s apart, so a
// hop comes every 30 s and never the same note twice in a row.
const SOLOISTS: Array<[number, number]> = [
  [2, 3],
  [5, 10],
  [1, 8],
  [7, 2],
  [4, 12],
  [9, 6],
]

function notes(): string {
  let out = ''
  for (let r = 0; r < ROWS; r++) {
    const y = FIRST_ROW + r * ROW_GAP
    out += `<g class="row ${r % 2 ? 'off' : 'on'}">`
    for (let c = 0; c < COLS; c++) {
      // distance from the centre line, so col c and its mirror match exactly
      const m = c < COLS / 2 ? COLS / 2 - 1 - c : c - COLS / 2
      const x = CX + (c - (COLS - 1) / 2) * COL_GAP
      const glyph = (m + r) % 2 === 0 ? 'n1' : 'n2'
      const color = COLORS[(m + r) % 3]
      const solo = SOLOISTS.findIndex(([sr, sc]) => sr === r && sc === c)
      const use = `<use href="#${glyph}" x="${x - 16}" y="${y - 20}" width="32" height="40" class="${color}"/>`
      out += solo >= 0 ? `<g class="solo s${solo}">${use}</g>` : use
    }
    out += '</g>'
  }
  return out
}

const soloDelays = SOLOISTS.map((_, i) => `.s${i}{animation-delay:${i * 30 + 12}s}`).join('')

const STYLE = `
.bg{fill:${BLUSH}}
.aw-a{fill:${ROSE}}
.aw-b{fill:${CREAM}}
.awning{opacity:1}
.trim{stroke:${MUSTARD};stroke-width:5;stroke-dasharray:2 12;stroke-linecap:round;fill:none;opacity:1}
.band{opacity:.55}
.c-m{fill:${MUSTARD}}
.c-p{fill:${POWDER}}
.c-t{fill:${MINT}}
.veil{fill:${BLUSH};opacity:.15}
.row{animation:bob 2.4s ease-in-out infinite;will-change:transform}
.off{animation-delay:-1.2s}
.solo{transform-box:fill-box;transform-origin:50% 100%;animation:hop 180s ease-in-out infinite}
${soloDelays}
@keyframes bob{0%,100%{transform:translateY(-8px)}50%{transform:translateY(8px)}}
@keyframes hop{
  0%,96%,100%{transform:translate(0,0) rotate(0)}
  96.6%{transform:translate(0,-34px) rotate(-12deg)}
  97.2%{transform:translate(10px,-46px) rotate(14deg)}
  97.8%{transform:translate(0,-18px) rotate(-4deg)}
  98.3%{transform:translate(0,2px) scale(1.08,.92)}
  98.7%{transform:translate(0,0) rotate(0)}
}
@media (prefers-color-scheme: dark){
  .bg{fill:${NIGHT}}
  .aw-a{fill:#7A3F3A}
  .aw-b{fill:#5A4238}
  .veil{fill:${NIGHT}}
  .band{opacity:.6}
}
@media (prefers-reduced-motion: reduce){
  .row,.solo{animation:none}
}
`

export const SCENE =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice">` +
  `<style>${STYLE}</style><defs>${EIGHTH}${BEAMED}</defs>` +
  `<rect class="bg" width="${W}" height="${H}"/>` +
  `<g class="band">${notes()}</g>` +
  // a soft, symmetrical veil down the reading column so text never sits on notes at full strength
  `<rect class="veil" x="${CX - 360}" y="0" width="720" height="${H}"/>` +
  `<g class="awning">${awning()}</g>` +
  `</svg>`
