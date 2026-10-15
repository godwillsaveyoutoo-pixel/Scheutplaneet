import {colours} from './model.mjs';

export function schemaMarkup(exercise,secondColour){
  const e=exercise,m=e.splitFirst,complete=e.sockConfirmed;
  const leftPart=m||'?',rightPart=m?e.splitRest:'?';
  const total=e.phase==='done'?e.total:'?';
  const equation=complete?`${e.first} ${e.symbol} ${e.second} = 10 ${e.symbol} ${e.remainder} = ${total}`:`${e.first} ${e.symbol} ${e.second} = ?`;
  return `<g id="schema-equation" aria-label="${equation}">
    <defs><marker id="block-split-tip" markerWidth="15" markerHeight="15" refX="12" refY="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 1 12 7 2 13" fill="none" stroke="#2b403c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <g id="schema-grouping" aria-label="${e.first} ${e.symbol} ${m} = ${e.bridgeCount}">${complete?`<g id="schema-sock" class="number-sock complete" transform="translate(32 -35) scale(.7 .5)">${sockArt}</g>`:''}</g>
    <g id="schema-arrows" fill="none" stroke="#2b403c" stroke-width="3.5" stroke-linecap="round"><path d="M423 126 352 151" marker-end="url(#block-split-tip)"/><path d="M450 126 487 151" marker-end="url(#block-split-tip)"/></g>
    <text class="schema-number ${e.isSubtract?'schema-double':''}" x="210" y="110" text-anchor="middle">${e.first}</text>
    <text class="schema-symbol" x="320" y="110" text-anchor="middle">${e.symbol}</text>
    <text class="schema-number" x="435" y="110" text-anchor="middle" style="fill:${colours[secondColour].side}">${e.second}</text>
    <text class="schema-symbol" x="545" y="110" text-anchor="middle">=</text>
    <text id="schema-part-left" class="schema-part" x="334" y="214" text-anchor="middle" style="fill:${complete?'#008d87':colours[secondColour].side}">${leftPart}</text>
    <text id="schema-part-right" class="schema-part" x="490" y="214" text-anchor="middle" style="fill:${colours[secondColour].side}">${rightPart}</text>
    ${complete?`<text id="schema-ten" class="schema-number schema-teal" x="655" y="110" text-anchor="middle">10</text><text class="schema-symbol" x="755" y="110" text-anchor="middle">${e.symbol}</text><text id="schema-rest" class="schema-number" x="835" y="110" text-anchor="middle" style="fill:${colours[secondColour].side}">${e.remainder}</text><text class="schema-symbol" x="940" y="110" text-anchor="middle">=</text><text id="schema-answer" class="schema-number ${e.phase==='done'?'schema-teal':'schema-placeholder'}" x="1040" y="110" text-anchor="middle">${total}</text>`:'<text class="schema-number schema-placeholder" x="655" y="110" text-anchor="middle">…</text>'}
    ${complete?'<text class="schema-caption" x="270" y="244" text-anchor="middle">Altijd 10 in mijn sok.</text>':''}
  </g>`;
}

// Reuse the sock artwork from the existing bridge lesson.
const sockArt=`
            <defs>
              <path id="block-sock-shape" d="M177 112 H323 Q333 112 333 122 V160 Q333 172 327 173 V274 C327 343 335 361 394 370 L475 386 C522 395 542 425 542 453 C542 502 499 516 452 516 C391 516 347 492 288 475 L217 458 C168 446 146 418 152 374 C154 352 171 332 171 294 V173 Q167 171 167 162 V122 Q167 112 177 112 Z"/>
              <clipPath id="block-sock-clip"><use href="#block-sock-shape" xlink:href="#block-sock-shape" fill="white" stroke="none"/></clipPath>
              <pattern id="block-sock-knit" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M2 2 6 6 10 2 M2 8 6 12 10 8" fill="none" stroke="#009d99" stroke-opacity=".07" stroke-width=".8"/></pattern>
            </defs>
            <use class="block-sock-body" href="#block-sock-shape" xlink:href="#block-sock-shape" fill="#daf5ec" fill-opacity=".67" stroke="#009e99" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            <g clip-path="url(#block-sock-clip)" aria-hidden="true">
              <rect x="145" y="105" width="410" height="420" fill="url(#block-sock-knit)"/>
              <path class="block-sock-patch" fill="#71c8b7" fill-opacity=".13" stroke="none" d="M157 324 C208 336 247 385 241 468 L173 445 142 390 Z"/>
              <path class="block-sock-patch" fill="#71c8b7" fill-opacity=".13" stroke="none" d="M502 395 C554 401 573 493 512 525 L478 519 C482 471 491 426 502 395 Z"/>
              <path class="block-sock-seam" fill="none" stroke="#4cafa0" stroke-opacity=".54" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round" d="M159 326 C208 338 248 387 241 466 M502 395 C490 427 483 469 479 514"/>
            </g>
            <rect class="block-sock-cuff" x="167" y="112" width="166" height="60" rx="10" fill="#d6f3e9" fill-opacity=".65" stroke="#009e99" stroke-width="4"/>
            <path class="block-sock-ribs" fill="none" stroke="#5abaae" stroke-opacity=".38" stroke-width="2.5" d="M181 115 V169 M199 115 V169 M217 115 V169 M235 115 V169 M253 115 V169 M271 115 V169 M289 115 V169 M307 115 V169 M323 115 V167"/>
            <g class="block-sock-total" aria-hidden="true">
              <path d="M136 181 H122 V500 H136" fill="none" stroke="#008d87" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <text x="72" y="365" fill="#008d87" stroke="none" text-anchor="middle" font-family="inherit" font-size="66" font-weight="700">10</text>
            </g>
          `;
