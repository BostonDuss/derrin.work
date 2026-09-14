/* Build script for the static derrin.work site.
   Run with: eval(await readFile('site/_build.js'))
   Reads the Design Component, renders every {{ hole }} / sc-for / sc-if at BUILD TIME,
   and emits plain static pages that need no framework at runtime. */

const src = await readFile('derrin.work hero-tiles.dc.html');
let tpl = src.slice(src.indexOf('<x-dc'), src.indexOf('</x-dc>'));

/* ---- pre-pass: preserve identities the renderer would otherwise flatten ---- */
tpl = tpl.replace(/ ref="\{\{\s*([\w$]+)\s*\}\}"/g, ' data-ref="$1"');
tpl = tpl.replace(/ onClick="\{\{\s*([\w$]+)\s*\}\}"/g, ' data-action="$1"');
tpl = tpl.replace(/ hint-[a-z-]+="[^"]*"/g, '');

/* ---- generators, ported verbatim from the component's logic class ---- */
const tiles = (t, c, on, off) => { const o = [], r = Math.ceil(t / c); for (let i = 0; i < t; i++) { const b = Math.floor(i / c) / Math.max(1, r - 1); const f = 1 - b * 0.92; const p = ((i * 2654435761) % 1000) / 1000; o.push({ c: p < f ? on : off }); } return o; };
const migCells = () => { const o = []; for (let p = 0; p < 20; p++) for (let v = 0; v < 14; v++) o.push({ c: v === 0 ? '#1D5C57' : '#7FC0B6' }); return o; };
const FW_STEPS = [["01","Client + Arnold kickoff",0,0,"pill"],["02","Creative concepting",1,0,"rect"],["03","Reviews & approvals",0,0,"diamond"],["04","Creative production",1,1,"rect"],["05","Media trafficking initiates",2,1,"rect"],["06","Tracking implementation",2,1,"rect"],["07","Asset delivery & routing",1,1,"rect"],["08","Final asset trafficking",2,2,"rect"],["09","Asset posting",4,2,"rect"],["10","Post analytics",5,2,"pill"]];
const FW_LANES = ["NAR","Arnold","Havas Media","Cake","Socialyse","DBi"];
const FW_PH = ["#4E3F7A","#2F5677","#74355A"];
const FW_PHN = ["Phase 1 — Brief & concept","Phase 2 — Production & handoff","Phase 3 — Distribution & measurement"];
const FW_SECOND = { "01":"Arnold", "06":"DBi", "09":"Cake" };
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fwWrap = (t, m) => { const o = []; let c = ''; t.split(' ').forEach(w => { if ((c + ' ' + w).trim().length <= m) c = (c + ' ' + w).trim(); else { if (c) o.push(c); c = w; } }); if (c) o.push(c); return o; };
const fwLabel = (x, cy, l, s, f, a, ls) => { const lead = s * 1.22; return { x, a: a || 'middle', s, f, ls: ls || '0', y: cy - ((l.length - 1) * lead) / 2 + s * 0.35, lines: l.map((t, i) => ({ t, dy: i ? lead : 0 })) }; };
const fwText = (arr) => { let o = ''; arr.forEach(t => { let y = t.y; t.lines.forEach(ln => { y += ln.dy; o += '<text x="' + t.x + '" y="' + y + '" text-anchor="' + t.a + '" font-size="' + t.s + '" fill="' + t.f + '" letter-spacing="' + t.ls + '">' + esc(ln.t) + '</text>'; }); }); return o; };
const fwSwim = (o) => {
  const bands = [], rects = [], polys = [], lines = [], labels = [], S = FW_STEPS;
  FW_LANES.forEach((n, i) => { const y = o.top + i * o.laneH; bands.push({ x:0, y, w:o.W, h:o.laneH, f: i % 2 ? o.bandB : o.bandA }); labels.push(fwLabel(o.L - 18, y + o.laneH / 2, [n], o.laneFont, o.muted, 'end')); });
  [0,1,2].forEach(p => { const idx = S.map((s,i) => s[3] === p ? i : -1).filter(i => i >= 0); const x1 = o.L + idx[0] * o.colW, x2 = o.L + idx[idx.length-1] * o.colW + o.bw;
    rects.push({ x:x1, y:o.top-22, w:x2-x1, h:o.stripH, rx:0, f:FW_PH[p], s:'none', role:'strip' });
    labels.push(fwLabel(x1, o.top-34, [o.titles ? FW_PHN[p] : 'Phase ' + (p+1)], o.phaseFont, FW_PH[p], 'start', '0.04em')); });
  const cx = i => o.L + i * o.colW + o.bw / 2, cy = i => o.top + S[i][2] * o.laneH + o.laneH / 2;
  S.forEach((s, i) => { const x = o.L + i * o.colW, y = cy(i) - o.bh / 2, f = FW_PH[s[3]];
    if (s[4] === 'diamond' && o.titles) polys.push({ p: cx(i)+','+(cy(i)-(o.bh+14)/2)+' '+(cx(i)+(o.bw+8)/2)+','+cy(i)+' '+cx(i)+','+(cy(i)+(o.bh+14)/2)+' '+(cx(i)-(o.bw+8)/2)+','+cy(i), f });
    else rects.push({ x, y, w:o.bw, h:o.bh, rx: s[4] === 'pill' ? o.bh/2 : 2, f, s:'none' });
    if (o.titles) { labels.push(fwLabel(cx(i), cy(i)-1, fwWrap(s[1], o.wrapAt), o.titleFont, '#FFFFFF'));
      labels.push(fwLabel(cx(i), y-12, [s[0]], o.numFont, o.muted, 'middle', '0.08em'));
      if (FW_SECOND[s[0]]) labels.push(fwLabel(cx(i), y + o.bh + 15, ['with ' + FW_SECOND[s[0]]], o.numFont, o.muted)); }
    else labels.push(fwLabel(cx(i), cy(i), [s[0]], o.numFont, '#FFFFFF', 'middle', '0.04em'));
    if (i < 9) { const x1 = x + o.bw, y1 = cy(i), x2 = o.L + (i+1) * o.colW, y2 = cy(i+1), mx = (x1+x2)/2;
      lines.push({ p: x1+','+y1+' '+mx+','+y1+' '+mx+','+y2+' '+(x2-o.arrow)+','+y2 });
      polys.push({ p: x2+','+y2+' '+(x2-o.arrow)+','+(y2-o.arrow*0.56)+' '+(x2-o.arrow)+','+(y2+o.arrow*0.56), f: o.muted }); } });
  return { bands, rects, polys, lines, labels: fwText(labels) };
};
const fwA = fwSwim({ W:1530,L:186,colW:134,bw:120,bh:64,laneH:92,top:64,stripH:3,titles:true,titleFont:14,wrapAt:14,laneFont:15,phaseFont:13.5,numFont:12.5,arrow:9,muted:"#A3A6A4",bandA:"#F6F6F4",bandB:"#FFFFFF" });
const fwB = fwSwim({ W:680,L:120,colW:54,bw:44,bh:26,laneH:36,top:66,stripH:2,titles:false,titleFont:11,wrapAt:14,laneFont:13,phaseFont:11,numFont:11,arrow:6,muted:"#8A8D8B",bandA:"#171717",bandB:"#0d0d0d" });

const V = {
  vw:'wide', wide:true, narrow:false, menuOpen:'false', menuLabel:'Open menu', true:true,
  barTop:'display:block; width:22px; height:1.5px; background:#FFFFFF; transition:transform 220ms cubic-bezier(.2,.7,.2,1);',
  barMid:'display:block; width:22px; height:1.5px; background:#FFFFFF; transition:opacity 160ms linear;',
  barBot:'display:block; width:22px; height:1.5px; background:#FFFFFF; transition:transform 220ms cubic-bezier(.2,.7,.2,1);',
  videoOff:true, videoOn:false, video2Off:true, video2On:false,
  helmIdx1:'1', helmCount:'1 / 14',
  thesisWords:['I','build','things','that','outlive','me.'].map((t,i)=>({ t, o:1, y:'0px', d:(i*0.075).toFixed(3)+'s' })),
  migThirteen:Array.from({length:13},(_,i)=>({i})),
  migBatch:migCells(),
  migBlocks:Array.from({length:15},()=>({ cells: migCells() })),
  platePaper:tiles(240,24,'#1D5C57','rgba(92,95,94,.22)'),
  plateBlack:tiles(600,40,'#7FC0B6','rgba(163,166,164,.22)'),
  seamDays:Array.from({length:15},(_,i)=>({ c: i<5 ? '#4E3F7A' : 'rgba(78,63,122,.28)' })),
  bom:Array.from({length:40},(_,i)=>({ c: i<13 ? '#2F5677' : 'rgba(47,86,119,.22)' })),
  cycleDays:Array.from({length:15},(_,i)=>({ c: i<5 ? '#4E3F7A' : 'transparent' })),
  batches:[{label:'Batch 1',w:'100%'},{label:'Batch 2',w:'84%'},{label:'Batch 3, re-cut',w:'61%'},{label:'Batch 4',w:'43%'},{label:'Batch 5, re-cut',w:'22%'}],
  fwBands:fwA.bands, fwRects:fwA.rects, fwPolys:fwA.polys, fwLines:fwA.lines, fwLabels:{__raw:fwA.labels},
  fwLiteBands:fwB.bands, fwLiteRects:fwB.rects, fwLitePolys:fwB.polys, fwLiteLines:fwB.lines, fwLiteLabels:{__raw:fwB.labels}
};

/* ---- build-time renderer for {{ holes }}, <sc-for>, <sc-if> ---- */
const lookup = (path, scope) => { const parts = path.split('.'); let cur = Object.prototype.hasOwnProperty.call(scope, parts[0]) ? scope[parts[0]] : V[parts[0]]; for (let i = 1; i < parts.length && cur != null; i++) cur = cur[parts[i]]; return cur; };
const fillHoles = (html, scope) => html.replace(/\{\{\s*([\w$.]+)\s*\}\}/g, (m, p) => { const v = lookup(p, scope); if (v == null) return ''; if (typeof v === 'object' && v.__raw != null) return v.__raw; if (typeof v === 'object') return ''; return String(v); });
const findClose = (html, tag, openEnd) => { const o = '<' + tag, c = '</' + tag + '>'; let depth = 1, i = openEnd;
  for (;;) { const ni = html.indexOf(o, i), nc = html.indexOf(c, i); if (nc < 0) throw new Error('unclosed ' + tag);
    if (ni >= 0 && ni < nc) { depth++; i = ni + o.length; } else { depth--; i = nc + c.length; if (!depth) return { inner: [openEnd, nc], after: i }; } } };
const attrOf = (s, n) => { const m = s.match(new RegExp(n + '="([^"]*)"')); return m ? m[1] : null; };
const render = (html, scope) => { let out = '', i = 0;
  for (;;) { const fi = html.indexOf('<sc-for', i), ii = html.indexOf('<sc-if', i);
    const next = fi < 0 ? ii : (ii < 0 ? fi : Math.min(fi, ii));
    if (next < 0) { out += fillHoles(html.slice(i), scope); break; }
    out += fillHoles(html.slice(i, next), scope);
    const isFor = next === fi, tag = isFor ? 'sc-for' : 'sc-if';
    const openEnd = html.indexOf('>', next) + 1, tagStr = html.slice(next, openEnd);
    const { inner, after } = findClose(html, tag, openEnd);
    const body = html.slice(inner[0], inner[1]);
    if (isFor) { const list = lookup((attrOf(tagStr,'list')||'').replace(/[{}\s]/g,''), scope) || [];
      const as = attrOf(tagStr, 'as') || 'item';
      list.forEach((item, idx) => { out += render(body, Object.assign({}, scope, { [as]: item, $index: idx })); }); }
    else if (lookup((attrOf(tagStr,'value')||'').replace(/[{}\s]/g,''), scope)) out += render(body, scope);
    i = after; }
  return out; };

/* ---- page definitions ---- */
const PAGES = [
  { key:'home',      mark:'isHome', dir:'',                                 title:"Derrin Andrade — Product & Program Manager", desc:"Fifteen years turning ambiguous programs into systems other people can run." },
  { key:'releases',  mark:'isRel',  dir:'releases-and-launches',            title:"Releases & Product Launches — Derrin Andrade", desc:"Running the release train for servicenow.com." },
  { key:'migration', mark:'isMig',  dir:'design-system-migration',          title:"Design System Migration — Derrin Andrade", desc:"250+ pages, 13 locales, one template system." },
  { key:'shop',      mark:'isShop', dir:'good-ideas-shop',                  title:"Good Ideas Shop — Derrin Andrade", desc:"A Meta storefront activation for ten local businesses." },
  { key:'helmets',   mark:'isHelm', dir:'helmets-for-habitat',              title:"Helmets for Habitat — Derrin Andrade", desc:"A Fallout 76 charity activation with 40+ global artists." },
  { key:'framework', mark:'isFw',   dir:'content-development-framework',    title:"Content Development Framework — Derrin Andrade", desc:"A swimlane framework five agencies adopted." },
  { key:'next',      mark:'isNext', dir:'whats-next',                       title:"What's next — Derrin Andrade", desc:"Systems thinking for agent-first workflows." }
];
const URLS = { '#home':'/', '#work':'/#work', '#shop':'/good-ideas-shop/', '#migration':'/design-system-migration/',
  '#releases':'/releases-and-launches/', '#helmets':'/helmets-for-habitat/', '#framework':'/content-development-framework/',
  '#next':'/whats-next/', '#resume':'/Derrin-Andrade-Resume.pdf' };

/* ---- hover/focus attributes become real CSS classes ---- */
const hoverRules = new Map();
const classFor = (decls, pseudo) => {
  const key = pseudo + '|' + decls;
  if (!hoverRules.has(key)) hoverRules.set(key, 'x' + hoverRules.size.toString(36));
  return hoverRules.get(key);
};
const liftStates = (html) => html.replace(/<([a-z][a-z0-9-]*)((?:\s+[^>]*?)?)>/gi, (full, tag, attrs) => {
  if (!/style-(hover|focus|active)=/.test(attrs)) return full;
  const added = [];
  let out = attrs.replace(/\s*style-(hover|focus|active)="([^"]*)"/g, (m, ps, decls) => { added.push(classFor(decls.trim(), ps)); return ''; });
  if (!added.length) return full;
  if (/\sclass="/.test(out)) out = out.replace(/\sclass="([^"]*)"/, (m, c) => ' class="' + c + ' ' + added.join(' ') + '"');
  else out += ' class="' + added.join(' ') + '"';
  return '<' + tag + out + '>';
});

/* ---- link rewriting + interaction hooks ---- */
const rewire = (html) => {
  let out = html;
  for (const [hash, url] of Object.entries(URLS)) out = out.split('href="' + hash + '"').join('href="' + url + '"');
  out = out.split('href="/#work"').join('href="/index.html#work"');
  out = out.split('href="/Derrin-Andrade-Resume.pdf"').join('href="/Derrin-Andrade-Resume.pdf" download');
  // parallax stage identities
  out = out.replace(/data-ref="stageRef"/, 'data-parallax="stage"').replace(/data-ref="layerRef"/, 'data-parallax="layer"');
  out = out.replace(/data-ref="stage2Ref"/, 'data-parallax="stage"').replace(/data-ref="layer2Ref"/, 'data-parallax="layer"');
  // video hooks
  out = out.replace(/data-action="playVideo"/, 'data-video="JshRws3jBdg" data-video-title="Good Ideas Shop sizzle reel"');
  out = out.replace(/data-action="playVideo2"/, 'data-video="e6EuZRGNv1U" data-video-title="Good Ideas Shop, second video"');
  // lookbook hooks
  out = out.replace(/data-action="helmPrev"/, 'data-helm-step="-1"').replace(/data-action="helmNext"/, 'data-helm-step="1"');
  out = out.replace(/data-action="helmGo(\d+)"/g, (m, n) => 'data-helm-go="' + n + '"');
  // drop the broken hot-linked press photo, keep the two that resolve
  const badStart = out.indexOf('<a href="https://www.myballard.com/2021/10/18/');
  if (badStart > -1) { const badEnd = out.indexOf('</a>', out.indexOf('Facebook takes over Ballard storefront')) + 4; out = out.slice(0, badStart) + out.slice(badEnd); }
  out = out.replace(/\sdata-action="[\w$]+"/g, '');
  out = out.replace(/\sdata-ref="[\w$]+"/g, '');
  // lookbook counter hook
  out = out.replace(/(<p style="position:absolute; left:14px; bottom:12px;[^"]*")>1 \/ 14</, '$1 data-helm-count>1 / 14<');
  // images move out of uploads/ into /images/ with clean names
  for (const [from, to] of Object.entries(IMAGES)) out = out.split('src="uploads/' + from + '"').join('src="/images/' + to + '"');
  return out;
};

const IMAGES = JSON.parse(await readFile('site/_image-map.json'));

/* ---- shared chrome ---- */
const NAV = (current) => {
  current = current === '/' ? '/index.html' : current;
  const link = (href, label) => '<a href="' + href + '"' + (current === href ? ' aria-current="page"' : '') + ' class="navlink">' + label + '</a>';
  const HOME = '/index.html';
  return `<header id="siteheader">
  <div class="nav-wide">
    <a href="/index.html" class="wordmark">Derrin Andrade</a>
    ${link('/index.html#work', 'Work')}
    ${link('/whats-next/', "What's next")}
    <a href="/Derrin-Andrade-Resume.pdf" download class="btn">Download resume</a>
  </div>
  <div class="nav-narrow">
    <div class="navbar">
      <a href="/index.html" class="wordmark">Derrin Andrade</a>
      <button type="button" id="menubtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobilemenu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
    </div>
    <nav id="mobilemenu" hidden>
      <a href="/index.html#work">Work</a>
      <a href="/whats-next/">What's next</a>
      <a href="/Derrin-Andrade-Resume.pdf" download class="btn">Download resume</a>
    </nav>
  </div>
</header>
<div id="headerspacer"></div>`;
};

const HEAD = (p) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<title>${p.title}</title>
<meta name="description" content="${p.desc}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${p.title}" />
<meta property="og:description" content="${p.desc}" />
<meta property="og:image" content="/share-card.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&amp;family=Schibsted+Grotesk:wght@400;500;600&amp;display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css" />
</head>
<body>`;

const FOOT = `<script src="/assets/site.js" defer></script>
</body>
</html>`;

/* ---- emit pages ---- */
const bodies = {};
for (const p of PAGES) {
  const i = tpl.indexOf('<sc-if value="{{ ' + p.mark + ' }}"');
  const ms = tpl.indexOf('<main>', i), me = tpl.indexOf('</main>', ms) + 7;
  bodies[p.key] = rewire(liftStates(render(tpl.slice(ms, me), {})));
}

/* ---- stylesheet: component CSS, minus the runtime-only bits, plus lifted states ---- */
const styleStart = src.indexOf('<style>', src.indexOf('<helmet>')) + 7;
let css = src.slice(styleStart, src.indexOf('</style>', styleStart));
// the component switched these with a JS-set attribute; the static site uses a media query
css = css.replace(/\[data-vw="narrow"\] /g, '');
const narrowBlock = css.match(/(\[data-tiles\][^]*?\[data-tile-meta\][^}]*\})/);
if (narrowBlock) css = css.replace(narrowBlock[1], '@media (max-width: 719px) {\n' + narrowBlock[1] + '\n}');

let stateCss = '';
for (const [key, cls] of hoverRules) { const [pseudo, decls] = key.split('|'); stateCss += '.' + cls + ':' + pseudo + ' { ' + decls + (decls.endsWith(';') ? '' : ';') + ' }\n'; }

const chromeCss = `
#siteheader { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: #000000; border-bottom: 1px solid #1c1c1c; }
#siteheader a { text-decoration: none; }
.wordmark { font-family: 'Newsreader', serif; font-size: 17px; letter-spacing: .005em; color: #FFFFFF; margin-right: auto; }
.wordmark:hover { color: #7FC0B6; }
.navlink { font-family: 'Schibsted Grotesk', system-ui, sans-serif; font-size: 14px; color: #A3A6A4; }
.navlink:hover, .navlink[aria-current="page"] { color: #FFFFFF; }
.btn { font-family: 'Schibsted Grotesk', system-ui, sans-serif; font-size: 14px; color: #000000; background: #FFFFFF; padding: 8px 14px 9px; }
.btn:hover { background: #7FC0B6; color: #000000; }
#siteheader a:focus-visible, #siteheader button:focus-visible { outline: 2px solid #7FC0B6; outline-offset: 4px; }
.nav-wide { max-width: 1560px; margin: 0 auto; padding: 14px clamp(18px, 5vw, 96px); display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 26px; }
.nav-narrow { display: none; }
.navbar { padding: 10px 18px; display: flex; align-items: center; gap: 16px; }
#menubtn { width: 44px; height: 44px; padding: 0; border: none; background: transparent; cursor: pointer; display: grid; place-content: center; gap: 5px; }
#menubtn .bar { display: block; width: 22px; height: 1.5px; background: #FFFFFF; transition: transform 220ms cubic-bezier(.2,.7,.2,1), opacity 160ms linear; }
#menubtn[aria-expanded="true"] .bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
#menubtn[aria-expanded="true"] .bar:nth-child(2) { opacity: 0; }
#menubtn[aria-expanded="true"] .bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
#mobilemenu { border-top: 1px solid #1c1c1c; padding: 10px 18px 22px; display: grid; gap: 2px; }
#mobilemenu[hidden] { display: none; }
#mobilemenu a { font-family: 'Schibsted Grotesk', system-ui, sans-serif; font-size: 17px; color: #FFFFFF; padding: 14px 0; border-bottom: 1px solid #1c1c1c; }
#mobilemenu a:hover { color: #7FC0B6; }
#mobilemenu .btn { font-size: 16px; padding: 14px 16px; margin-top: 16px; text-align: center; border-bottom: 0; color: #000000; }
@media (max-width: 719px) { .nav-wide { display: none; } .nav-narrow { display: block; } }
@media print { #siteheader, #headerspacer { display: none; } }
`;
await saveFile('site/assets/site.css', css + '\n' + chromeCss + '\n' + stateCss);

const siteJs = `/* derrin.work — the only runtime behaviour the static site needs. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header height reserved by a spacer, so fixed chrome never covers content */
  var header = document.getElementById('siteheader'), spacer = document.getElementById('headerspacer');
  function syncHeader() { if (header && spacer) spacer.style.height = header.offsetHeight + 'px'; }
  syncHeader();
  window.addEventListener('resize', syncHeader);
  if (window.ResizeObserver && header) new ResizeObserver(syncHeader).observe(header);

  /* mobile menu */
  var btn = document.getElementById('menubtn'), menu = document.getElementById('mobilemenu');
  if (btn && menu) btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
    syncHeader();
  });

  /* parallax hero layers */
  Array.prototype.forEach.call(document.querySelectorAll('[data-parallax="stage"]'), function (stage) {
    var layer = stage.querySelector('[data-parallax="layer"]');
    if (!layer) return;
    var raf = 0;
    function apply() {
      raf = 0;
      var r = stage.getBoundingClientRect();
      var travel = Math.max(0, stage.offsetHeight - (window.innerHeight || 800));
      var y = Math.min(Math.max(-r.top, 0), travel);
      layer.style.transform = 'translate3d(0,' + (reduce ? 0 : y) + 'px,0)';
    }
    function tick() { if (!raf) raf = requestAnimationFrame(apply); }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    apply();
  });

  /* click-to-play video: the poster is replaced by the embed, so nothing third-party loads first */
  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (poster) {
    poster.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative; aspect-ratio:16/9; background:#000000;';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + poster.getAttribute('data-video') + '?autoplay=1&cc_load_policy=1&rel=0';
      f.title = poster.getAttribute('data-video-title') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; border:0;';
      wrap.appendChild(f);
      poster.parentNode.replaceChild(wrap, poster);
    });
  });

  /* lookbook: CSS shows the active frame, JS only moves the index */
  var stageEl = document.querySelector('[data-helm]:not([data-helmthumbs])');
  var thumbs = document.querySelector('[data-helmthumbs]');
  var counter = document.querySelector('[data-helm-count]');
  var TOTAL = 14;
  function setHelm(n) {
    var i = ((n - 1) % TOTAL + TOTAL) % TOTAL + 1;
    if (stageEl) stageEl.setAttribute('data-helm', String(i));
    if (thumbs) thumbs.setAttribute('data-helm', String(i));
    if (counter) counter.textContent = i + ' / ' + TOTAL;
  }
  function current() { return parseInt((stageEl && stageEl.getAttribute('data-helm')) || '1', 10); }
  Array.prototype.forEach.call(document.querySelectorAll('[data-helm-step]'), function (b) {
    b.addEventListener('click', function () { setHelm(current() + parseInt(b.getAttribute('data-helm-step'), 10)); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-helm-go]'), function (b) {
    b.addEventListener('click', function () { setHelm(parseInt(b.getAttribute('data-helm-go'), 10)); });
  });
})();
`;
await saveFile('site/assets/site.js', siteJs);

/* root-relative links become depth-relative, so the site works at a domain root,
   on a GitHub Pages project subpath, and from the local filesystem alike */
const localize = (html, depth) => {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  return html.replace(/(href|src)="\/(?!\/)/g, (m, a) => a + '="' + prefix);
};

for (const p of PAGES) {
  const nav = NAV(p.dir ? '/' + p.dir + '/' : '/');
  const html = HEAD(p) + '\n' + nav + '\n' + bodies[p.key] + '\n' + FOOT;
  await saveFile('site/' + (p.dir ? p.dir + '/index.html' : 'index.html'), localize(html, p.dir ? 1 : 0));
}

await saveFile('site/robots.txt', 'User-agent: *\nDisallow: /\n');
await saveFile('site/.nojekyll', '');
await saveFile('site/404.html', localize(HEAD({ title: 'Not found — Derrin Andrade', desc: 'Page not found.' }) + '\n' + NAV('/') +
  '\n<main><section style="background:#000000; color:#FFFFFF; padding:clamp(72px,12vw,180px) 0;"><div style="max-width:1560px; margin:0 auto; padding:0 clamp(18px,5vw,96px);">' +
  '<p style="margin:0 0 22px; font-family:\'Schibsted Grotesk\',system-ui,sans-serif; font-size:13px; color:#A3A6A4;">404</p>' +
  '<h1 style="margin:0; font-size:clamp(36px,6vw,88px); font-weight:400; line-height:1.03; letter-spacing:-.028em;">That page moved.</h1>' +
  '<p style="margin:clamp(28px,3.5vw,48px) 0 0; font-size:clamp(18px,1.6vw,22px); line-height:1.5; max-width:44ch;">Try <a href="/index.html#work" style="color:#7FC0B6;">the work index</a>.</p>' +
  '</div></section></main>\n' + FOOT, 0));
await saveFile('site/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#000000"/><text x="16" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="17" fill="#7FC0B6">D</text></svg>');

log('pages: ' + PAGES.map(p => (p.dir || 'index') + '=' + bodies[p.key].length).join(', '));
log('lifted state classes: ' + hoverRules.size);
log('css chars: ' + (css.length + chromeCss.length + stateCss.length));