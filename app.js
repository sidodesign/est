/* 시도디자인 견적 프로그램 v3 — 실장 페이지(APP_MODE="staff")와 관리자 페이지(APP_MODE="admin")가 같은 코드를 씁니다.
   데이터: data.js (window.SIDO_DATA). 실장용 data.js에는 원가가 없고 판매단가(price)와 마진율(m)만 있습니다. */
"use strict";
const APP_VER = "2026-11-23.99"
const DOC_KINDS = ["견적서", "가견적", "확정 견적", "변경 견적"];   // (v92) 견적서 구분 — 기본은 ‘견적서’ (화면을 그리기 전에 있어야 해서 맨 위에 둔다);                       // 이 프로그램의 판. app.js 를 고쳐 올릴 때마다 바꾼다 — 서버가 이 줄을 읽어(/api/ping) 열려 있는 화면에 ‘새로 바뀌었습니다 · 눌러서 새로 고침’을 띄운다
const MODE = window.APP_MODE === "admin" ? "admin" : "staff";
const $ = s => document.querySelector(s);
const deep = o => JSON.parse(JSON.stringify(o));
/* (v69) 회사 주소(https)에서는 실장 화면과 관리자 화면이 같은 주소라 브라우저 저장 공간도 같다. 밖에서 여는 관리자 화면("adm:")과 관리자가 ‘실장 화면 보기’로 연 화면("view:실장id:")은
   저장 이름 앞에 표시를 붙여 따로 쓴다 — 같은 기기에서 내 실장 화면과 관리자 화면을 같이 써도 쓰던 견적·저장된 견적이 섞이지 않는다. 이 PC(localhost)의 관리자 화면과 실장 화면은 전과 같다(표시 없음). */
const NS = (() => { try { if (!/^https?:$/.test(location.protocol)) return ""; const p = location.pathname, m = p.match(/^\/s\/(s\d+)x/);
  if (/^\/admin(\/|$)/.test(p) && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return "adm:";
  if (m && location.hash === "#view") return "view:" + m[1] + ":" } catch (e) { } return "" })();
/* (v81) 항상 열리는 주소(깃허브 Pages)로 열었는가: 그 주소의 index.html 이 front.js 로 window.SIDO_FRONT = { api 회사 서버 주소, mir 잠근 사본이 있는 곳, kb } 를 준다. 다른 곳에서는 null — 전과 똑같이 동작한다. */
const FRONT = (() => { try { const f = window.SIDO_FRONT; return f && f.api && /^https?:$/.test(location.protocol) ? { api: String(f.api).replace(/\/+$/, ""), mir: String(f.mir || ""), kb: String(f.kb || ""), gate: String(f.gate || "").replace(/\/+$/, "") } : null } catch (e) { return null } })();
function frontSess(v) {                               // 이 기기의 로그인: 읽기 frontSess() · 쓰기 frontSess({ tok, keep, mir, who }) · 지우기 frontSess(null). keep = 로그인 유지(끄면 창을 닫을 때 사라진다)
  const K = "sido_front_sess";
  try { if (v === undefined) { const s = sessionStorage.getItem(K) || localStorage.getItem(K); return s ? JSON.parse(s) : null }
    sessionStorage.removeItem(K); localStorage.removeItem(K); if (v) (v.keep ? localStorage : sessionStorage).setItem(K, JSON.stringify(v)) } catch (e) { }
  return v || null }
/* (v84) 실장의 ‘전용 주소’(항상 열리는 주소 뒤 #u=코드): 회사 컴퓨터가 꺼져 있어도 처음 쓰는 기기에서 로그인되게 하는 코드(무작위 16자).
   주소로 열면 코드를 이 창에만 적어 두고(sessionStorage) 주소 칸에서는 바로 지운다. 로그인하면 그 기기의 로그인 정보(frontSess 의 off)에 함께 둔다 — 로그아웃하면 같이 지워진다. */
const offNorm = v => { v = String(v || "").trim(); const m = v.match(/[#&?]u=([A-Za-z0-9\-]+)/); if (m) v = m[1]; else if (/[:/.]/.test(v)) return ""; return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 40) };
function offCode(v) { const K = "sido_front_u"; try { if (v !== undefined) { if (v) sessionStorage.setItem(K, v); else sessionStorage.removeItem(K); return v || "" } return (frontSess() || {}).off || sessionStorage.getItem(K) || "" } catch (e) { return "" } }
if (FRONT) { try { const m = location.hash.match(/[#&]u=([A-Za-z0-9\-]{8,60})/); if (m) { offCode(offNorm(m[1])); history.replaceState(null, "", location.pathname + location.search) } } catch (e) { } }
const store = {
  get(k, d) { try { const v = localStorage.getItem(NS + k); return v ? JSON.parse(v) : d } catch (e) { return d } },
  set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); return true } catch (e) { return false } },
  del(k) { try { localStorage.removeItem(NS + k) } catch (e) {} }
};
const won = n => (Math.round(n) || 0).toLocaleString("ko-KR");
const pct = x => (x * 100).toFixed(1) + "%";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const r1 = x => Math.round(x * 10) / 10;
const PROCS = ["가설", "철거", "설비", "창호", "목공", "전기", "도어", "타일", "욕실", "바닥", "도배", "필름", "가구", "기타"];
const PROC_LABEL = { 가설: "가설공사", 철거: "철거공사", 설비: "설비·방수공사", 창호: "창호공사", 목공: "목공사", 전기: "전기·조명공사", 도어: "도어·중문공사", 타일: "타일공사", 욕실: "욕실공사", 바닥: "바닥공사", 도배: "도배공사", 필름: "필름공사", 가구: "가구공사", 기타: "기타·마감공사" };

/* ---------- SHA-256 (file:// 에서도 동작하도록 직접 구현) ---------- */
function sha256(s){const K=[],H=[];let n=2,c=0;const isP=x=>{for(let i=2;i*i<=x;i++)if(x%i==0)return 0;return 1};const f=x=>(x-(x|0))*4294967296|0;
while(c<64){if(isP(n)){if(c<8)H[c]=f(Math.pow(n,1/2));K[c]=f(Math.pow(n,1/3));c++}n++}
const b=new TextEncoder().encode(s),l=b.length,w=[],m=new Uint8Array(((l+9+63)>>6)<<6);m.set(b);m[l]=128;const bl=l*8;
for(let i=0;i<4;i++)m[m.length-1-i]=(bl>>>(i*8))&255;const h=H.slice(),r=(x,y)=>(x>>>y)|(x<<(32-y));
for(let o=0;o<m.length;o+=64){for(let i=0;i<16;i++)w[i]=(m[o+i*4]<<24)|(m[o+i*4+1]<<16)|(m[o+i*4+2]<<8)|m[o+i*4+3];
for(let i=16;i<64;i++){const s0=r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3),s1=r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0}
let[a,bb,cc,d,e,ff,g,hh]=h;for(let i=0;i<64;i++){const S1=r(e,6)^r(e,11)^r(e,25),ch=(e&ff)^(~e&g),t1=(hh+S1+ch+K[i]+w[i])|0,S0=r(a,2)^r(a,13)^r(a,22),mj=(a&bb)^(a&cc)^(bb&cc),t2=(S0+mj)|0;
hh=g;g=ff;ff=e;e=(d+t1)|0;d=cc;cc=bb;bb=a;a=(t1+t2)|0}h[0]=(h[0]+a)|0;h[1]=(h[1]+bb)|0;h[2]=(h[2]+cc)|0;h[3]=(h[3]+d)|0;h[4]=(h[4]+e)|0;h[5]=(h[5]+ff)|0;h[6]=(h[6]+g)|0;h[7]=(h[7]+hh)|0}
return h.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("")}

/* ---------- 데이터 ---------- */
const BASE = deep(window.SIDO_DATA || {});
const STAFF_DATA = !!BASE.staffOnly;
let D = deep(BASE);
/* (v87) 실장 화면의 공정별 마진 — 사용자(2026-11-21): “각 공정별로 마진이 어떻게 되는지 정확하게 알려줄려고 해 그리고 실제 금액이 들어가는게 달라질 수 있으니 실장페이지에서 마진에 대한 금액변경 할 수 있게 만들어야해”.
   실장용 데이터에는 원가가 없다(누구나 받을 수 있는 곳에 있는 파일이라 넣지 않는다). 로그인한 뒤 회사 서버가 내려 주는 원가표(costApply)를 받았을 때만 원가를 계산한다(COST_ON).
   실장에게 보이는 것은 공정별 합계(판매 · 실공사비 · 마진)뿐이고, 줄마다의 원가는 전처럼 관리자 화면에서만 보인다. 공정의 실공사비는 실장이 그 견적에서 고칠 수 있다(E.costOv). */
let COST_ON = false, COST_VER = "", MARGIN_OPEN = false;
const noCost = () => STAFF_DATA && !COST_ON;
function costApply(tb) {                              // tb = { v, margins: { 공정: 마진율 }, items: { 품목 id: [원가, 마진율 또는 null] } }
  if (!STAFF_DATA || !tb || !tb.items) return false;
  D.margins = tb.margins || {}; for (const it of D.catalog) { const r = tb.items[it.id]; if (!r) continue; it.cost = +r[0] || 0; if (r[1] !== null && r[1] !== undefined) it.margin = +r[1] }
  COST_ON = true; COST_VER = tb.v || "1"; return true;
}
function costTable() {                                // 관리자 화면(원가 자료를 연 화면)이 서버에 올리는 표
  const items = {}, has = v => v !== null && v !== undefined && v !== "";
  for (const it of D.catalog) if (+it.cost > 0 || has(it.margin)) items[it.id] = [+it.cost || 0, has(it.margin) ? +it.margin : null];
  const body = { margins: D.margins || {}, items }; return { ...body, v: "c" + sigH(JSON.stringify(body)).replace(/[^0-9]/g, "") };
}
if (MODE === "admin" && !STAFF_DATA) {
  const ov = store.get("sido3_override", null);
  if (ov && ov.base === BASE.version) Object.assign(D, ov.data);
}
let byName = {};
/* (v67) 기본으로 켜지는 공사를 바꾼 판 번호. 이 번호가 없는(전에 쓰던) 견적은 그때의 기본대로 계산한다(lnState 의 defOn) — 금액이 달라지지 않게.
   2 = 전체 리모델링에 문·문틀 필름 묶음(DEF_ON2)을 처음부터 켬 — 사용자(2026-11-19, “필름 작업은 무엇을 더할까요?”에): “기본 견적에 켜 두기” */
const DFV = 2, DEF_ON2 = ["filmDoor", "filmSub", "filmLabor", "filmMeal"];
function indexCatalog() { dataFix(); dataFix2(); byName = {}; for (const i of D.catalog) byName[i.name] = i }
function dataFix() {
  for (const n of ["냉장고장", "키큰장"]) { const it = (D.catalog || []).find(i => i.name === n); if (it && it.unit === "식") it.unit = "개" }   // ‘1식’이 아니라 개수로 센다
  const w4 = (D.stepLines || {}).s4 || [], wm = w4.find(l => l.id === "woodMat"), wsb = w4.find(l => l.id === "woodSub");
  // 석고가 붙는 면적(㎡). s = "" 석고용(겹·면 포함) · "F" 각재 틀용. 치수 표에 넣은 종류는 그 값, 없으면 예전 어림값
  const AR = s => "ON('flatCeil')*ceilA" + s + "+ON('wellCeil')*livingA*0.5+ON('wall')*wallA" + s + "+(insN?insA" + s + ":L('insul')*7)+ON('curtainBox')*L('curtainBox')*0.3+ON('artwall')*artA" + s + "+ON('flatWall')*flatWA" + s + "+etcA" + s + "+ON('lightBox')*4+ON('tvBox')*3+perimAll*0.05";
  if (wm && wm.bom) { const sg = wm.bom.items.find(b => /^석고보드/.test(b.name)), gj = wm.bom.items.find(b => /^각재/.test(b.name));
    if (sg && /flatCeil/.test(String(sg.qty))) { sg.qty = "Math.ceil((" + AR("") + ")/1.62*(1+woodLoss))"; sg.note = "900×1800 (1.62㎡) · 로스율 적용" }
    if (gj && /flatCeil/.test(String(gj.qty))) { gj.qty = "Math.max(1,Math.ceil(Math.ceil((" + AR("F") + ")/1.62*(1+woodLoss))*3/12))"; gj.note = "한치각 12자(3600mm) · 석고 1장당 3개 · 12개 1단" } }
  if (wsb && wsb.bom) { const tk = wsb.bom.items.find(b => /^ST45/.test(b.name)); if (tk && /flatCeil/.test(String(tk.qty))) tk.qty = "1+Math.ceil((" + AR("") + ")/30)" }
  if (wm && wm.bom) { const iso = wm.bom.items.find(b => /^아이소핑크/.test(b.name)); if (iso && String(iso.qty).trim() === "L('insul')*5") { iso.qty = "(insN?Math.ceil(insAF/1.62*(1+woodLoss)):L('insul')*5)"; iso.note = "단열 벽 치수를 넣으면 면적 ÷ 1.62 (900×1800 보드) · 없으면 1면당 5장" } }
  const et = ((D.stepLines || {}).s7 || []).find(l => l.id === "entTile"); if (et && String(et.qty).trim() === "3.5") { et.qty = "entryA"; if (!et.note) et.note = "현관 바닥 면적 (실측하면 실측값)" }
  const fc0 = w4.find(l => l.id === "flatCeil"); if (fc0 && fc0.label === "거실 천장 평평하게") fc0.label = "천장 평평하게 (평천장 목작업)";
  const l5 = (D.stepLines || {}).s5, fan = l5 && l5.find(l => l.id === "fan");
  if (fan) {                                          // 조명: 마그네틱 레일 조명 (레일은 도면에 그린 길이만큼, 모듈·전원은 개수)
    const has = n => (D.catalog || []).some(i => i.name === n), c5 = ((D.cats || {}).s5 || []).find(c => c.lines.includes("fan")); let at = l5.indexOf(fan), ci = c5 ? c5.lines.indexOf("fan") : -1;
    for (const [id, names, o] of [["magRail", ["M20 마그네틱 / A타입 레일 1M", "M20 마그네틱 / B타입 날개형 레일 1M"], { qty: "3", label: "마그네틱 조명 레일 (1M 단위)", note: "도면에 그리면 그 길이만큼 자동" }],
      ["magLine", ["M20 마그네틱 / 라인 확산 24W [L600]", "M20 마그네틱 / 라인 확산 12W [L300]", "M20 마그네틱 / 라인 확산 30W [L900]", "M20 마그네틱 / 라인 확산 40W [L1200]"], { qty: "2", label: "마그네틱 라인 모듈 (확산)" }],
      ["magSpot", ["M20 마그네틱 / 멀티 집중 12W [L220]", "M20 마그네틱 / 멀티 집중 6W [L110]", "M20 마그네틱 / 멀티 집중 18W [L330]", "M20 마그네틱 / 스팟 스포트 7W", "M20 마그네틱 / 스팟 스포트 12W"], { qty: "2", label: "마그네틱 스팟 모듈 (집중)" }],
      ["magPower", ["M20 마그네틱 / 레일형 SMPS 100W", "M20 마그네틱 / 레일형 SMPS 200W"], { qty: "1", label: "마그네틱 전원 (SMPS)" }]]) {
      const items = names.filter(has); if (!items.length) continue;
      if (!l5.some(l => l.id === id)) l5.splice(++at, 0, { id, items, tags: "", loc: "거실", ...o });
      if (c5 && !c5.lines.includes(id)) c5.lines.splice(++ci, 0, id);
    }
  }
  const ls = (D.stepLines || {}).s10, fd = ls && ls.find(l => l.id === "filmDoor"); if (!fd) return;
  // 필름: 방문만 있던 것을 욕실문 · 현관문 · 몰딩까지 (문·중문 공정과 같은 범위)
  const cat = ((D.cats || {}).s10 || []).find(c => c.lines.includes("filmDoor")); let at = ls.indexOf(fd), ci = cat ? cat.lines.indexOf("filmDoor") : -1;
  for (const [id, o] of [["filmBath", { qty: "Math.ceil(baths*3.5/1.22)", loc: "욕실", label: "욕실문·문틀 필름", note: "욕실문 1개당 약 2.9M (폭 1.22m)" }],
    ["filmEntry", { qty: "3", loc: "현관", label: "현관문·중문틀 필름", note: "현관문 안쪽 1면 약 3M · 중문틀까지 하면 수량을 늘리세요" }],
    ["filmMold", { qty: "Math.ceil(perimAll*1.1*0.15/1.22)", loc: "전체", label: "몰딩·걸레받이 필름", note: "둘레 × 감싸는 폭 15cm (폭 1.22m 필름 기준)" }]]) {
    if (!ls.some(l => l.id === id)) ls.splice(++at, 0, { id, items: [...fd.items], tags: "", ...o });
    if (cat && !cat.lines.includes(id)) cat.lines.splice(++ci, 0, id);
  }
  const sumL = "(L('filmDoor')+L('filmBath')+L('filmEntry')+L('filmMold'))", fix = s => typeof s === "string" && s.includes("L('filmDoor')") && !s.includes("filmBath") ? s.split("L('filmDoor')").join(sumL) : s;
  for (const l of ls) { if (/^film(Door|Bath|Entry|Mold)$/.test(l.id)) continue; l.qty = fix(l.qty); if (l.bom) for (const b of l.bom.items) b.qty = fix(b.qty) }   // 부자재·작업비·식대는 필름 전체 길이 기준
  const sf = ls.find(l => l.id === "sashFilm"); if (sf) { if (!sf.loc) sf.loc = "전체"; if (String(sf.qty).trim() === "4") sf.qty = "rooms+2"; if (!sf.note) sf.note = "방마다 1틀 + 거실·주방 (창호 목록이 있으면 그 개수)" }
}
indexCatalog();
const marginOf = it => (it.margin !== null && it.margin !== undefined && it.margin !== "") ? +it.margin : (+D.margins[it.proc] || 0);
const roundPrice = p => p < 10000 ? Math.round(p / 100) * 100 : Math.round(p / 1000) * 1000;
function tableCost(it, E) { const lv = +E.level || 1; const t = it.costTable, row = t.find(r => lv >= r[0] && lv <= r[1]) || (lv < t[0][0] ? t[0] : t[t.length - 1]); return row[2] }
/* 수량별 고정 판매가: it.tier = [[최소, 최대, 판매단가], ...]  (예: 문 1~2틀은 틀당 50만, 3틀부터 40만). 같은 품목을 쓰는 줄의 수량을 모두 더해서 구간을 정한다. */
const tierPrice = (it, q) => { const t = it.tier.find(r => q >= r[0] && q <= r[1]) || it.tier[it.tier.length - 1]; return +t[2] };
/* 고객 견적서·엑셀에 나가는 글에서 실장만 봐야 하는 내용(계산식 · 몇 명 · 1롤 5평 · 단가 규칙 · 치수)을 뺀다 */
function custText(t) { return String(t || "").split(/\s+[\/·]\s+/).filter(x => x && !/÷|×|평형|평에\s*\d|\d\s*평에|롤\s*약|1롤|㎡\/인|\/인|여유|명 추가|인 추가|반올림|원가|마진|로스|업체 견적|단가|만\s*원|[\d,]+\s*원|자동$|입력값|체크하면|들어갑니다|고칠 수|합산|더해집니다|합쳐서|기준$|견적서에|나갑니다|올림|낱개|넣으세요|넣습니다|계산하지|\d\s*만(\s|$)|\d+\s*(인|명)(\s|$)/.test(x)).join(" · ").replace(/\s*[\d,]+\s*mm/g, "").trim() }
function custName(n) { return String(n || "").replace(/\s*\((1롤[^)]*|롤|1명 하루|엑셀 단가|평당|길이 자)\)/g, "").replace(/\s*·\s*평당\s*\)/g, ")").trim() }
function docRows(ls) {                               // 실장 화면에서는 자재별로 수량을 고치고, 고객에게는 묶음 1식 금액과 포함 내역(수량만)을 보여 준다
  const out = [], seen = new Map();
  for (const l of ls) {
    if (l.set && l.name === SET_SUB && !l.tbd) { const k = "setsub|" + l.price; let g = seen.get(k);   // 작업마다 들어간 부자재 1식은 한 줄로 합친다
      if (!g) { g = { ...l, key: "grp|" + k, docName: "목공 부자재", spaceName: "", qty: 0, amt: 0, cost: 0, detail: (l.detail || []).map(d => ({ ...d, qty: 0 })), grp: true }; seen.set(k, g); out.push(g) }
      g.qty += l.qty; g.amt += l.amt; g.cost += l.cost || 0; (l.detail || []).forEach(d => { const x = g.detail.find(y => y.name === d.name); if (x) x.qty += d.qty; else g.detail.push({ ...d }) }); continue }
    if (!l.group || !String(l.key).includes("#")) { out.push(l); continue }
    const sub = /목/.test(l.group) && /단열|아이소핑크/.test(l.name) ? "단열 자재" : l.group, k = l.lid + "|" + sub; let g = seen.get(k);
    if (!g) { g = { ...l, key: "grp|" + k, name: sub, note: "", spec: "", unit: "식", qty: 1, auto: 1, lump: true, amt: 0, price: 0, cost: 0, ucost: 0, tbd: false, edited: false, detail: [], grp: true }; seen.set(k, g); out.push(g) }
    g.amt += l.amt; g.cost += l.cost || 0; g.ucost = g.cost; g.price = g.amt; g.detail.push({ name: l.name, qty: l.qty, unit: l.unit, note: "" }); g.tbd = !(g.amt > 0) }
  return out;
}
const docNm = l => custName(l.docName || aliasOf(l.name));
const custLine = l => l.extra ? String(l.note || "") : l.set ? "" : custText([aliasOf(l.name) !== l.name ? custName(l.name) : "", l.note].filter(Boolean).join(" / "));
function unitPrice(it, E) {
  if (it.tier) return +it.tier[it.tier.length - 1][2];
  if (it.costTable) { const m = STAFF_DATA ? it.m : marginOf(it); return roundPrice(tableCost(it, E) / (1 - m)) }
  if (it.costVar) { const c = +((E.num.common || {})[it.costVar] || 0); const m = STAFF_DATA ? it.m : marginOf(it); return roundPrice(c / (1 - m)) }
  if (STAFF_DATA) return it.price;
  if (it.fixedPrice) return +it.fixedPrice;          // 인건비 30만원처럼 판매가 고정 품목
  return it.cost ? roundPrice(it.cost / (1 - marginOf(it))) : 0;
}
/* 관리자가 '실장 페이지에 적용'한 마진·설정 (같은 PC: localStorage / 온라인: db 'pub/settings') */
/* 실장용 데이터에는 원가·마진율이 없다. 관리자가 계산한 판매단가(prices)만 받아서 바꾼다.
   (업체 견적 원가를 실장이 직접 넣는 품목만 그 품목의 마진율 vm 을 받는다) */
function applyPub(pub) {
  if (!pub || !pub.prices) return false;
  for (const k of ["bizProfit", "laborBuffer"]) if (pub[k] !== undefined) D.settings[k] = pub[k];
  if (STAFF_DATA) for (const it of D.catalog) {
    if (it.costTable || it.costVar) { if (pub.vm && pub.vm[it.id] !== undefined) it.m = pub.vm[it.id]; continue }
    if (pub.prices[it.id] !== undefined) it.price = pub.prices[it.id];
  }
  return true;
}
if (MODE === "staff") { const pub0 = store.get("sido3_pub", null); if (pub0 && pub0.base === BASE.version) applyPub(pub0) }
/* 1식 묶음(세트): 구성품을 1개씩 합친 것이 1식. 판매 단가는 관리자가 정하고(기본단가), 원가는 구성품 원가를 1개씩 더한 값. 견적에는 ‘○식 × 1식 단가’로 들어가고 포함 내역은 구성품 × 식 수 */
const SET_GEN = "목자재 1식 (석고보드·각재·MDF)", SET_RND = "목자재 1식 · 라운드 (오징어 합판 추가)", SET_INS = "단열 목자재 1식 (석고보드·각재·단열재)", SET_SUB = "목공 부자재 1식";
const SET_PARTS = { [SET_GEN]: ["석고보드 (9.5T)", "각재 (30x30)", "MDF (9T)"], [SET_RND]: ["석고보드 (9.5T)", "각재 (30x30)", "MDF (9T)", "오징어 합판 (밴딩)"], [SET_INS]: ["석고보드 (9.5T)", "각재 (30x30)", "아이소핑크/단열재 (50T)"],
  [SET_SUB]: ["우레탄폼", "목공본드", "ST45 타카핀", "T50 타카핀", "422 타카핀", "630 타카핀", "실리콘(유성=무초산)", "장갑"] };
function unitCost(it, E) {
  if (it.costTable) return tableCost(it, E);
  if (it.costVar) return +((E.num.common || {})[it.costVar] || 0);
  if (!noCost() && SET_PARTS[it.name]) { const c = SET_PARTS[it.name].reduce((a, n) => a + (+(byName[n] || {}).cost || 0), 0); if (c) return c }   // 세트 원가 = 구성품 원가 합 (구성품 원가가 바뀌면 바로 따라간다)
  return noCost() ? 0 : (+it.cost || 0);
}
/* 실장에게 나가는 판매단가 (내보내기·'실장 페이지에 적용' 공용) */
function staffPrice(i) { return i.tier ? +i.tier[i.tier.length - 1][2] : i.costTable || i.costVar ? 0 : i.fixedPrice ? +i.fixedPrice : i.cost ? roundPrice(i.cost / (1 - marginOf(i))) : 0 }
const fpKey = l => l.key + "::" + l.name;

/* ---------- 견적 상태 ---------- */
function blankEst() {
  return { id: "e" + Date.now(), info: { client: "", site: "", region: "", manager: "", date: new Date().toISOString().slice(0, 10), kind: "견적서", ver: 1 },
    py: 33, excl: "", rooms: 3, baths: 2, balconies: 2, level: 10,
    floorItem: D.global.floorOpts[0], paperItem: D.global.paperOpts[0],
    sel: {}, num: {}, ovr: {}, extras: [], dim: {}, ceilH: "", skip: {}, skipW: {}, inc: {}, meas: {}, marks: [], biz: Math.round((D.settings.bizProfit ?? 0.07) * 1000) / 10, memo: "", space: "living", pk: {}, preset: 0, ln: {}, lq: {}, dataVer: BASE.version, dfv: DFV };
}
let E = store.get("sido3_draft_" + MODE, null);
// 단가표(data.js) 버전이 바뀌어도 작성 중이던 견적은 지우지 않는다. 체크 내용이 없는 옛 형식만 새로 시작.
const freshStart = !E || !E.pk || (BASE.stepLines && !E.ln);
const verChanged = !freshStart && E.dataVer !== BASE.version;
if (freshStart) E = blankEst(); else { normEst(E); E.dataVer = BASE.version }
function normEst(x) { for (const k of ["sel", "num", "ovr", "pk", "ln", "lq", "dim", "skip", "skipW", "inc", "meas", "planPins", "planBox", "noCeil", "wallLen"]) x[k] = x[k] || {}; x.extras = x.extras || []; x.wins = x.wins || []; x.furn = x.furn || []; x.ceilList = x.ceilList || []; x.info = x.info || {};
  if (x.pyOv && +x.pyOv.s9 > 0) { if (!(+x.dpOv > 0)) x.dpOv = Math.round(+x.pyOv.s9 * 2.5); delete x.pyOv.s9 }   // v50 때는 도배 칸에 아파트 평형을 넣었다 → 도배 평수로 옮긴다
  { const pq = x.ln.paper && x.ln.paper.q; if (pq !== undefined && pq !== "" && +pq > 0 && !(+x.dpOv > 0)) x.dpOv = Math.round(+pq); for (const id of ["paper", "paperSub"]) if (x.ln[id] && "q" in x.ln[id]) delete x.ln[id].q }   // 벽지 줄에 직접 넣어 둔 평수 → 도배 평수 (부자재도 같이 따라간다)
  { const f0 = ((D.stepLines || {}).s8 || []).find(l => l.id === "floor"), fq = x.ln.floor, alt = (fq && +fq.alt) || 0, u = f0 && (D.catalog.find(i => i.name === f0.items[alt]) || {}).unit;   // 장판·강마루가 평 단위로 바뀐 뒤: 전에 ㎡로 직접 넣어 둔 수량은 평으로 고친다
    // 조건: 지금 고른 종류가 평 단위 · 평형보다 훨씬 큰 값 · ㎡ 시절 데이터로 쓰던 견적(장판은 2026-11-17-1525, 강마루는 그다음 판부터 평) — 평으로 바뀐 뒤에 직접 넣은 큰 평수는 건드리지 않는다
    if (u === "평" && fq && +fq.q > 0 && String(x.dataVer || "") < (alt < 6 ? "2026-11-17-1525" : "2026-11-17-1526") && +fq.q > (+x.py || 33) * 1.3) fq.q = Math.round(+fq.q / 3.3058 * 10) / 10 }
  if (!(+x.dfv >= 2) && !(Object.keys(x.ln).length || x.info.client || x.info.site || x.savedAt || x.extras.length)) x.dfv = DFV;   // (v67) 손댄 적 없는 빈 견적은 새 기본(필름 켜짐)을 따른다. 전에 쓰던 견적은 번호가 없는 채로 두어 옛 기본 그대로 계산한다(lnState) — 견적 내용을 고쳐 쓰지 않는다
  for (const id of ["wallTile", "floorTile"]) { const b = x.ln[id]; if (b && b.q !== undefined && b.q !== "" && !x.ln[id + "2"]) { x.ln[id + "2"] = { ...b, q: 0 }; x.ln[id + "3"] = { ...b, q: 0 } } }   // (v78) 욕실 타일이 욕실마다 한 줄로 나뉘기 전에 박스 수를 직접 넣어 둔 견적: 그 수는 첫 줄(욕실1)에 그대로 두고 다른 욕실 줄은 0으로 (합계가 달라지지 않게)
  { const b = x.ln.balTile; if (b && b.q !== undefined && b.q !== "" && !x.ln.balTile2) x.ln.balTile2 = { on: !!b.on, q: 0 } }   // (v65) 발코니 바닥 타일이 앞·뒤 두 줄로 나뉘기 전에 박스 수를 직접 넣어 둔 견적: 그 수는 앞 줄에 그대로 두고 뒷 줄은 0으로 (합계가 달라지지 않게). 새 판에서는 앞 줄을 고칠 때 뒷 줄 상태가 먼저 굳어 이 줄에 걸리지 않는다
  for (const e of x.extras) if (!e.item && e.proc === "가설" && /철거/.test(e.name || "")) e.proc = "철거";   // 2026-11-17 전에는 1단계에서 추가한 철거 항목이 가설공사로 들어갔다
  return x }

/* ---------- 공사 체크리스트 → 공간별 선택으로 풀기 ---------- */
const pkState = p => E.pk[p.key] || (E.pk[p.key] = { on: false, g: 0, v: undefined });
function pkNum(p) { const st = pkState(p); if (!p.num) return 0; if (st.v !== undefined && st.v !== "") return +st.v; const d = p.num.def; return typeof d === "string" ? (+E[d] || 0) : d }
function setSel(sets, onlyFirst, firstType) {
  const list = spaces().list;
  for (const s of sets || []) for (const t of s.types) {
    const sps = list.filter(x => x.type === t);
    sps.forEach((sp, i) => {
      const cat = catsOf(sp).find(c => c.key === s.cat); if (!cat) return;
      const oi = cat.opts.findIndex(o => o.label === s.opt); if (oi < 0) return;
      if (onlyFirst !== undefined && t === firstType && i >= onlyFirst) return;
      (E.sel[sp.id] = E.sel[sp.id] || {})[s.cat] = oi;
    });
  }
}
function applyPackages() {
  const list = spaces().list;
  for (const p of D.packages || []) {
    const st = pkState(p);
    if (!st.on) { setSel(p.off); continue }
    const n = pkNum(p), first = p.num && p.num.first;
    const count = first ? (p.num.unit === "칸" || p.num.unit === "개" ? n : 1) : undefined;
    if (first) setSel(p.off);                       // 나머지 공간은 '안 함'으로 두고
    setSel(p.sets, count, first);                   // 앞에서부터 count개 공간에만 적용
    const g = p.grades ? p.grades[Math.min(st.g || 0, p.grades.length - 1)] : null;
    if (g) { setSel(g.sets, count, first); if (g.global) Object.assign(E, g.global) }
    if (p.num && p.num.var) (E.num.common = E.num.common || {})[p.num.var] = n;
    if (p.num && p.num.target) for (const sp of list) if (catsOf(sp).some(c => c.key === p.num.target)) (E.num[sp.id] = E.num[sp.id] || {})[p.num.target] = n;
  }
}
function applyPreset(i) {
  const pr = (D.presets || [])[i]; if (!pr) return;
  E.preset = i;
  for (const p of D.packages || []) { const st = pkState(p); st.on = pr.on.includes(p.key); if (pr.grades && pr.grades[p.key] !== undefined) st.g = pr.grades[p.key] }
  applyPackages();
}

/* ---------- 공간과 면적 ---------- */
/* (v63) 추가 공간: 방 목록에 없는 공간(보조 주방·다용도실·팬트리 …)을 견적에 넣는다. E.xsp = [{ id: "x1", name, type }]
   · 넓이는 0에서 시작한다. 가로·세로(E.dim[id])를 넣기 전에는 수량·금액이 하나도 바뀌지 않는다 (넣은 것을 빼면 원래대로).
   · 종류(type)는 원래 있던 공간 종류에 맞춘다: 방·주방 = 바닥·벽·둘레 면적에 더함 · 발코니 = 발코니 타일·페인트 면적에 더함.
   · 방·욕실·발코니 ‘개수’(문·조명 수)와 도배 평수·바닥 평수(아파트 평수 기준)에는 넣지 않는다 — 공간 표시 xsp 로 가른다. */
const XSP_PRE = [["보조 주방", "주방"], ["다용도실", "발코니"], ["세탁실", "발코니"], ["팬트리", "방"], ["알파룸", "방"], ["창고", "방"], ["실외기실", "발코니"], ["테라스", "발코니"]];
const XSP_KIND = { "방": "방처럼 계산", "주방": "주방처럼 계산", "발코니": "발코니처럼 계산" };
const xspList = () => (Array.isArray(E.xsp) ? E.xsp : []).filter(x => x && x.id && x.name);
const noX = list => list.filter(s => !s.xsp);
function geometry(A, H, cut) { const P = 4 * Math.sqrt(A) * 1.05; return { A: r1(A), P: r1(P), W: r1(P * H * cut + A) } }
function wallDims(t) {                                // ‘3600*2300, 2400*2300, -900*2100’ → 벽 면적(㎡)·가로 합(m). 50 이상은 mm, ‘-’로 시작하면 문·창처럼 빼는 면, 셋째 숫자는 같은 벽 개수
  let area = 0, len = 0, n = 0, cut = 0; const mm = v => v >= 50 ? v / 1000 : v;
  for (const term of String(t || "").split(/[,+\n]|\s{2,}/)) { const neg = /^\s*[-−]/.test(term), ns = (term.match(/\d+(\.\d+)?/g) || []).map(Number); if (ns.length < 2) continue;
    const a = mm(ns[0]) * mm(ns[1]) * (ns.length >= 3 ? ns[2] : 1); if (neg) { area -= a; cut += a } else { area += a; len += mm(ns[0]) * (ns.length >= 3 ? ns[2] : 1); n += ns.length >= 3 ? ns[2] : 1 } }
  return n ? { area: Math.max(0, area), len, n, cut } : null;
}
/* (v68) 그린 크기대로 (E.planFit): 올린 도면에 그린 방 영역(E.planBox)의 크기 비율로 방마다의 넓이·둘레를 정한다.
   · 축척 = 실측 치수를 넣은 방이 있으면 그 방들(실제 넓이 ÷ 그린 넓이), 없으면 그린 방들의 평형 추정 넓이 합계 ÷ 그린 넓이 합계
     → 실측이 없을 때는 집 전체 넓이는 그대로 두고, 방마다의 몫만 그린 대로 나눈다.
   · 실측 치수(E.dim 의 가로×세로·면적)를 넣은 방은 늘 그 값이 먼저다. 넓이를 안 넣은 추가 공간은 그린 크기만큼 더해진다.
   · 적어 두는 값이 없다(그릴 때마다 다시 계산) — 끄면 평형 추정으로 돌아간다. */
function planFitMap(out) {
  if (!E.planFit || !E.planImg) return null;
  const bx = E.planBox || {}, dm = E.dim || {}, vw = 800, vh = Math.round(800 * (E.planImgH || 600) / (E.planImgW || 800)), sh = {};   // 그림 크기는 imgView 와 같은 값
  const area = p => Math.abs(p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0)) / 2, len = p => p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + Math.hypot(n[0] - q[0], n[1] - q[1]) }, 0);
  for (const s of out) { const b = bx[s.id]; if (!b) continue;
    if (b.poly && b.poly.length > 2) { const p = b.poly.map(q => [q[0] * vw, q[1] * vh]); sh[s.id] = { u: area(p), pu: len(p) } }   // 점으로 그린 방: 찍은 모양의 넓이·둘레
    else if (b.more && b.more.length) sh[s.id] = { u: [b, ...b.more].reduce((a, q) => a + q.w * vw * q.h * vh, 0) }             // 네모 여러 개(ㄱ자 방): 넓이만
    else sh[s.id] = { u: b.w * vw * b.h * vh, w: b.w * vw, h: b.h * vh } }                                                    // 네모 하나: 가로 × 세로
  const real = m => m ? (+m.w > 0 && +m.d > 0 ? m.w * m.d : +m.a > 0 ? +m.a : 0) : 0, live = s => s.xsp || s.type === "거실" || s.type === "주방" || s.type === "방"; let mu = 0, ma = 0, eu = 0, ea = 0;   // live = 그린 크기를 따르는 곳: 거실·주방·방(드레스룸)·추가 공간. 욕실·현관·발코니는 평형 추정 그대로 둔다 (사용자가 말한 곳만 — 욕실을 작게 그리면 타일 수량이 모자라게 잡힌다)
  for (const s of out) { const z = sh[s.id]; if (!z || !(z.u > 0)) continue; const r = real(dm[s.id]); if (r > 0) { mu += z.u; ma += r } else if (live(s) && s.A > 0) { eu += z.u; ea += s.A } }
  const k2 = mu > 0 ? ma / mu : eu > 0 ? ea / eu : 0; if (!(k2 > 0)) return null;   // k2 = 그림 단위² 하나가 몇 ㎡ 인가
  const k = Math.sqrt(k2), r2 = v => Math.round(v * 100) / 100, fit = {};
  for (const s of out) { const z = sh[s.id]; if (!z || !(z.u > 0) || !live(s) || real(dm[s.id]) > 0) continue; fit[s.id] = z.w ? { w: r2(z.w * k), d: r2(z.h * k) } : z.pu ? { a: r2(z.u * k2), p: r2(z.pu * k) } : { a: r2(z.u * k2) } }
  return fit;
}
function spaces() {
  const L = D.layout, py = +E.py || 0;
  const supplyM2 = py * 3.3058;
  const excl = +E.excl > 0 ? +E.excl : supplyM2 * L.exclRatio;
  const rooms = Math.max(1, +E.rooms || 1), baths = Math.max(0, +E.baths || 0), bal = Math.max(0, +E.balconies || 0);
  const living = excl * L.living, kitchen = excl * L.kitchen, entry = L.entry, bathA = L.bath;
  const roomTotal = Math.max(rooms * 7, excl - living - kitchen - entry - bathA * baths);
  const master = rooms > 1 ? roomTotal * L.masterShare : roomTotal, other = rooms > 1 ? (roomTotal - master) / (rooms - 1) : 0;
  const H = +E.ceilH > 0 ? +E.ceilH : L.ceilH, cut = L.openingCut, out = [];
  const dressA = +E.dress > 0 ? Math.max(0, Math.min(+L.dress || 4, master - 7)) : 0;   // 드레스룸: 안방 면적에서 떼어 낸다 (실측 치수를 넣으면 그 값)
  out.push({ id: "entry", type: "현관", name: "현관·전실", ...geometry(entry, H, cut) });
  out.push({ id: "living", type: "거실", name: "거실·공용부", ...geometry(living, H, cut) });
  out.push({ id: "kitchen", type: "주방", name: "주방", ...geometry(kitchen, H, cut) });
  for (let i = 1; i <= rooms; i++) out.push({ id: "room" + i, type: "방", name: i === 1 ? "방1 (안방)" : "방" + i, ...geometry(i === 1 ? master - dressA : other, H, cut) });
  if (dressA > 0) out.push({ id: "dress1", type: "방", dress: true, name: "드레스룸", ...geometry(dressA, H, cut) });   // 바닥·벽 면적에는 들어가고 방 개수(문·조명 수)에는 넣지 않는다
  for (let i = 1; i <= baths; i++) { const g = geometry(bathA * (i === 1 ? 1 : 0.85), 2.2, 1); g.WT = r1(g.P * 2.2 * 0.92); out.push({ id: "bath" + i, type: "욕실", name: i === 1 ? "욕실1 (공용)" : "욕실" + i + (i === 2 ? " (안방)" : ""), ...g }) }
  for (let i = 1; i <= bal; i++) out.push({ id: "bal" + i, type: "발코니", name: "발코니" + i, ...geometry(L.balcony, H, cut) });
  for (const x of xspList()) out.push({ id: x.id, type: XSP_KIND[x.type] ? x.type : "방", xsp: true, name: x.name, A: 0, P: 0, W: 0 });   // (v63) 추가 공간: 넓이는 0에서 시작 — 아래에서 치수(E.dim)를 넣은 것만 면적이 생긴다
  // 실측 치수(E.dim)가 있으면 평형 추정값 대신 쓴다: 가로×세로, 또는 면적만
  for (const s of out) s.A0 = s.A;                     // (v86) 평형으로 나눈 자동 넓이 (치수를 넣어도 남겨 둔다)
  const fit = planFitMap(out);                         // (v68) ‘그린 크기대로’가 켜져 있으면 도면에 그린 방 크기 (실측 치수가 없는 방만)
  for (const s of out) {
    let m = (E.dim || {})[s.id]; const fz = fit && fit[s.id];
    if (fz) { const u = m || {}; m = { ...fz }; for (const k in u) if (u[k] !== "" && u[k] != null && !(k in fz)) m[k] = u[k] }   // 높이·벽체별 치수처럼 따로 적어 둔 값은 그대로 얹는다
    if (!m) continue;
    const w = +m.w || 0, d = +m.d || 0, a = +m.a || 0, bath = s.type === "욕실", wl = wallDims(m.walls), hb = bath && +m.h > 0 ? +m.h : 2.2;   // 욕실 높이(타일 붙이는 높이)를 넣으면 그 값, 없으면 2.2m
    if (w > 0 && d > 0) { s.A = r1(w * d); s.P = r1(2 * (w + d)); s.W = r1(s.P * (bath ? hb : H) * (bath ? 1 : cut) + s.A) }
    else if (a > 0) { Object.assign(s, geometry(a, bath ? hb : H, bath ? 1 : cut)); if (+m.p > 0) { s.P = r1(+m.p); s.W = r1(s.P * (bath ? hb : H) * (bath ? 1 : cut) + s.A) } }   // p = 실측 둘레 (ㄱ자 방)
    else if (!wl && !(bath && +m.h > 0)) continue;
    if (bath) s.WT = r1(s.P * hb * 0.92);
    if (wl) { s.P = r1(wl.len); s.W = r1(wl.area + (bath ? 0 : (s.A || 0))); if (bath) s.WT = r1(wl.area); s.wallA = r1(wl.area); s.wallN = wl.n; s.wallCut = r1(wl.cut) }   // 벽체별 치수를 적었으면 벽 면적·둘레는 그 값 (천장 = 바닥 면적)
    if (fz) s.fit = true; if (!fz || wl) s.measured = true;   // fit = 도면에 그린 크기로 정한 방 (실측은 아니다)
  }
  out.push({ id: "common", type: "공통", name: "공통공사", A: 0, P: 0, W: 0 });
  return { list: out, supplyM2: r1(supplyM2), exclM2: r1(excl) };
}
const catsOf = sp => (D.spaceTypes[sp.type] || { cats: [] }).cats;
function selIdx(sp, cat) { const s = (E.sel[sp.id] || {})[cat.key]; return s === undefined ? cat.def : s }
function numVal(sp, cat) { const v = (E.num[sp.id] || {})[cat.key]; return v === undefined || v === "" ? (cat.num ? cat.num.def : 0) : +v }
function selLabel(sp, key) { const c = catsOf(sp).find(c => c.key === key || c.label === key);return c ? (c.opts[selIdx(sp, c)] || {}).label : "" }

/* ---------- 계산 엔진 ---------- */
const fnCache = {};
function ev(expr, ctx) {
  if (typeof expr === "number") return expr;
  let f = fnCache[expr];
  if (!f) { f = new Function("ctx", "with(ctx){return (" + expr + ")}"); fnCache[expr] = f }
  return f(ctx);
}
function resolveItem(name) { return name === "@floor" ? E.floorItem : name === "@paper" ? E.paperItem : name }
/* ---------- 줄 단위 공정 템플릿 (stepLines) ---------- */
const presetTag = () => (((D.presets2 || [])[E.preset] || {}).tag) || "";
const lnFind = id => { for (const rows of Object.values(D.stepLines || {})) for (const x of rows) if (x.id === id) return x; return null };   // 공사 줄 찾기 (처음 계산할 때도 쓸 수 있다)
const defOn = l => !!presetTag() && l.tags.includes(presetTag()) && !(DEF_ON2.includes(l.id) && !(+E.dfv >= 2));   // 이 견적에서 처음부터 켜지는 줄인가 (전에 쓰던 견적은 그때의 기본대로 — 필름 묶음은 꺼짐)
function lnState(l) { if (l.dead) return { on: false };   // 없앤 줄 (어느 견적에서도 켜지지 않는다)
  let st = E.ln[l.id] || { on: defOn(l) };
  if (l.pyf && st.q !== undefined && /평당/.test(String(l.items[+st.alt || 0] || ""))) { st = { ...st }; delete st.q }   // (v73) 바닥재(장판·강마루) 줄의 수량은 평수를 따른다 — 줄에 남아 있는 옛 수량은 평수로 쓰인다(pyfQ)
  if (l.pyq && st.q !== undefined) { st = { ...st }; delete st.q }   // 도배 평수를 따르는 줄(벽지·부자재)은 줄마다의 수량을 따로 두지 않는다
  if (l.follow && !E.ln[l.id]) { const f = lnFind(l.follow); if (f && f !== l && lnState(f).on) st = { ...st, on: true } }   // 따라 켜지는 줄 (확장 공사 → 확장부 단열 목작업)
  if (l.same && !E.ln[l.id]) { const f = lnFind(l.same); if (f && f !== l) { const fs = lnState(f); st = { ...st, on: !!fs.on }; if (fs.opt) st.opt = fs.opt; else delete st.opt; if (st.alt === undefined && fs.alt !== undefined) st.alt = fs.alt } }   // (v65) 한 줄을 둘로 나눈 줄(뒷 발코니 바닥 타일): 따로 손대기 전에는 원래 줄(앞 발코니)과 똑같이 켜지고 꺼진다 — 옛 견적의 금액이 그대로다
  if (l.altOf) { const f = lnFind(l.altOf); if (f && f !== l) st = { ...st, alt: Math.min(lnState(f).alt || 0, l.items.length - 1) } }
  if (l.altBy && st.alt === undefined) { let a = 0; try { a = +new Function("py", "return (" + l.altBy + ")")(+E.py || 0) || 0 } catch (e) {} return { ...st, alt: a } }   // 평형에 따라 기본 품목이 달라지는 줄 (직접 고르면 그 선택이 먼저)
  return st }
function setLn(l, patch) {
  if (l.pyq && "q" in patch) { const v = Math.round(+patch.q || 0); let a; try { a = (lineVars(R.S).s9 || {}).dpAuto } catch (e) { } if (v > 0 && v !== a) E.dpOv = v; else delete E.dpOv; patch = { ...patch }; delete patch.q }   // 벽지·부자재 줄의 수량 = 도배 평수 (어느 칸에서 고쳐도 같은 값)
  if (l.pyf && "q" in patch && /평당/.test(String(l.items[+("alt" in patch ? patch.alt : lnState(l).alt) || 0] || ""))) {   // (v71) 바닥재(장판·강마루) 줄의 수량 = 평수 — 사용자: “평수대로 넣었는데 인건비도 전혀 안 바뀌고 있어”(줄의 수량 칸에 넣으면 평수가 안 바뀌어 인원이 그대로였다)
    const v = +patch.q || 0; let a; try { a = (lineVars(R.S)[l.pyf] || {}).pyAuto } catch (e) { } E.pyOv = E.pyOv || {}; if (v > 0 && v !== a) E.pyOv[l.pyf] = v; else delete E.pyOv[l.pyf];
    patch = { ...patch }; delete patch.q; if (E.ln[l.id] && E.ln[l.id].q !== undefined) { E.ln[l.id] = { ...E.ln[l.id] }; delete E.ln[l.id].q } }
  for (const m of Object.values(D.stepLines || {}).flat()) if (m.same === l.id && !E.ln[m.id]) E.ln[m.id] = { ...lnState(m) };   // (v65) 원래 줄을 고치기 전에, 그 줄을 따라가던 나눈 줄의 지금 상태를 굳혀 둔다 (앞 발코니만 끄면 뒷 발코니는 그대로)
  E.ln[l.id] = { ...lnState(l), ...patch } }
function areaVars(S) {
  const live = S.list.filter(s => ["거실", "주방", "방"].includes(s.type)), baths = S.list.filter(s => s.type === "욕실");
  const sum = (arr, k) => r1(arr.reduce((a, s) => a + (s[k] || 0), 0));
  return { FT: sum(live, "A"), perimAll: sum(live, "P"), paperM2: r1(sum(live, "W") * 1.12), bathWallM2: sum(baths, "WT"), bathFloorM2: sum(baths, "A") };
}
/* 공정(step)마다 따로 변수를 만든다. 도면에서 그 공정에서 제외한 공간(E.skip[공정][공간 id])은 면적과 개수에서 빠진다.
   → 문 공정에서 방3 을 끄면 문짝·문틀·경첩·손잡이·설치비가 함께 줄고, 바닥 공정에서 끄면 바닥 면적이 준다. */
const SIDES = ["N", "S", "W", "E"], WALL_STEPS = ["s4", "s7", "s9", "s10"];   // 벽을 한 면씩 고를 수 있는 공정 (몰딩·벽, 타일, 벽지, 필름·페인트)
const wallShare = (r, side) => r.sl ? r.sl[side] / (r.per || 1) : (side === "N" || side === "S" ? r.w : r.h) / (r.per || 2 * (r.w + r.h));   // 그 벽이 방 둘레에서 차지하는 비율 (점으로 그린 방은 그쪽을 보는 변들의 길이)
const LINE_DIFF = 55; let PLAN_AUTO = null;                                // 방금 넣은 도면(자동 구획 대상)
const rd4 = v => Math.round(v * 10000) / 10000, rr4 = b => ({ x: rd4(b.x), y: rd4(b.y), w: rd4(b.w), h: rd4(b.h) });
/* (v62) 점을 찍어 그린 방 모양: E.planBox[id].poly = [[x, y], …] (도면 그림의 0~1 비율, 찍은 차례대로).
   x·y·w·h 에는 그 모양을 감싸는 네모를 같이 적어 둔다 — 네모만 아는 곳(벽 고르기 · 벽 치수 넣기 · 3D)은 그 네모로 그대로 돈다. */
const polyArea = p => Math.abs(p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0)) / 2;   // 넓이 (신발끈 공식)
const polyLen = p => p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + Math.hypot(n[0] - q[0], n[1] - q[1]) }, 0);         // 둘레
const polyIn = (p, x, y) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c };   // 그 자리가 모양 안쪽인가
const polyCross = p => { const n = p.length, o = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));   // 선끼리 엇갈리는가 (엇갈리면 넓이를 잴 수 없다)
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; const a = p[i], b = p[i + 1], c = p[j], d = p[(j + 1) % n]; if (o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0) return true }
  return false };
const polyMid = p => { const xs0 = p.map(q => q[0]), ys = p.map(q => q[1]), y = (Math.min(...ys) + Math.max(...ys)) / 2, xs = [];   // 모양 안쪽의 한 점 (이름표·손잡이 자리): 가운데 높이의 가로줄이 모양을 지나는 가장 긴 토막의 한가운데 — ㄱ자 방도 이름표가 방 안에 놓인다
  p.forEach((a, i) => { const b = p[(i + 1) % p.length]; if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0])) }); xs.sort((a, b) => a - b);
  let best = null; for (let i = 0; i + 1 < xs.length; i += 2) if (!best || xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]];
  return [best ? (best[0] + best[1]) / 2 : (Math.min(...xs0) + Math.max(...xs0)) / 2, y] };
const polySides = p => { const cw = p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0) > 0 ? 1 : -1;   // 변마다 어느 쪽 벽인지: 바깥을 보는 방향이 위(N)·아래(S)·왼쪽(W)·오른쪽(E) 중 어디에 가까운가
  return p.map((a, i) => { const b = p[(i + 1) % p.length], nx = (b[1] - a[1]) * cw, ny = (a[0] - b[0]) * cw; return Math.abs(nx) > Math.abs(ny) ? (nx > 0 ? "E" : "W") : ny > 0 ? "S" : "N" }) };
const polyPack = pts => { const p = pts.map(q => [rd4(q[0]), rd4(q[1])]).filter((q, i, a) => { const n = a[(i + 1) % a.length]; return q[0] !== n[0] || q[1] !== n[1] }), xs = p.map(q => q[0]), ys = p.map(q => q[1]), x = Math.min(...xs), y = Math.min(...ys);   // 찍은 점들을 저장 모양으로 (같은 자리에 겹친 점은 하나로 · 감싸는 네모를 같이 적는다)
  return { x, y, w: rd4(Math.max(...xs) - x), h: rd4(Math.max(...ys) - y), poly: p } };
function bigRect(m, bw, bh) {                        // 칸 안에 들어가는 가장 큰 네모
  const hg = new Int32Array(bw); let best = null;
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) hg[x] = m[y * bw + x] ? hg[x] + 1 : 0;
    const st = [];
    for (let x = 0; x <= bw; x++) { const hc = x < bw ? hg[x] : 0; let start = x;
      while (st.length && st[st.length - 1][1] > hc) { const [sx, sh] = st.pop(), a = sh * (x - sx); if (!best || a > best.a) best = { a, x0: sx, x1: x - 1, y0: y - sh + 1, y1: y }; start = sx }
      if (hc && (!st.length || st[st.length - 1][1] < hc)) st.push([start, hc]) }
  }
  return best;
}
const zoneBox = rg => { const rs = (rg.rects && rg.rects.length ? rg.rects : [rg]).map(rr4); return { ...rs[0], ...(rs.length > 1 ? { more: rs.slice(1) } : {}), rid: rg.id } };
function setZone(id, rg) { E.planBox = E.planBox || {}; for (const k in E.planBox) if (E.planBox[k].rid === rg.id && k !== id) delete E.planBox[k]; E.planBox[id] = zoneBox(rg) }
function autoZones() {                               // 크기·모양·위치로 거실/방/욕실/발코니/현관을 추정 (틀린 곳은 실장이 눌러서 고친다)
  const P = PLAN_REG; if (P.src !== E.planImg || !P.list.length) return false;
  const rg = [...P.list].sort((a, b) => b.cnt - a.cnt), tot = rg.reduce((a, q) => a + q.cnt, 0), asp = q => { const w = q.w * P.W, h = q.h * P.H; return Math.max(w, h) / Math.min(w, h) };
  const ext = q => SIDES.some(sd => !rg.some(o => { if (o === q) return false; const hor = sd === "N" || sd === "S";   // 그 방향 바깥쪽에 다른 칸이 없으면 외벽 쪽
    const beyond = sd === "N" ? o.y + o.h <= q.y + 0.03 : sd === "S" ? o.y >= q.y + q.h - 0.03 : sd === "W" ? o.x + o.w <= q.x + 0.03 : o.x >= q.x + q.w - 0.03; if (!beyond) return false;
    const a0 = hor ? q.x : q.y, a1 = a0 + (hor ? q.w : q.h), b0 = hor ? o.x : o.y, b1 = b0 + (hor ? o.w : o.h); return Math.min(a1, b1) - Math.max(a0, b0) > 0.3 * (a1 - a0) }));
  // 발코니 = 외벽 쪽에 붙은 길고 얇은 칸. ‘얇다’는 큰 칸들(방)의 평균 폭과 비교해서 정한다
  const long = q => Math.max(q.w * P.W, q.h * P.H), thick = q => q.cnt / long(q), bigT = rg.slice(1).filter(q => q.cnt / tot >= 0.07).map(thick).sort((a, b) => a - b), thr = 0.62 * (bigT.length ? bigT[Math.floor(bigT.length / 2)] : thick(rg[0]));
  /* 색이 있는 평면도(네이버 부동산 등)
     ① 2D: 마루색(주황·갈색) = 거실·주방 · 베이지 = 침실 · 하늘색 = 욕실 · 옅은 타일 줄눈 = 발코니 · 회색 체크 = 현관
     ② 3D: 방도 거실도 마루색 → 가장 큰 마루 칸이 거실, 나머지 큰 마루 칸이 방 · 회색 얇은 칸 = 발코니 · 작은 회색 칸 = 욕실 */
  const tone = q => { const [r, g, b] = q.rgb || [255, 255, 255], mx = Math.max(r, g, b), mn = Math.min(r, g, b); return { sat: mx ? (mx - mn) / mx : 0, light: mx, blue: b > r + 6 && b >= g - 6 } };
  if (rg.some(q => tone(q).sat >= 0.38 && q.cnt / tot >= 0.05)) {
    const wood = [], bath = [], bal = [], room = [], gray = [], thin = q => ext(q) && long(q) / thick(q) >= 1.6 && thick(q) < thr;
    for (const q of rg) { const c = tone(q), fr = q.cnt / tot; if (fr < 0.008) continue;
      if (c.blue && c.sat > 0.03) bath.push(q);
      else if (c.sat >= 0.38) wood.push(q);
      else if (c.sat > 0.04 && c.sat < 0.15 && (q.ink >= 0.03 || thin(q)) && fr >= 0.015) bal.push(q);   // 옅은 타일색 + 줄눈
      else if (c.sat >= 0.15 && fr >= 0.04) room.push(q);                                                  // 베이지 = 침실
      else gray.push(q);
    }
    const box = { living: zoneBox(wood[0]) }, d3 = !room.length && wood.length > 1;   // 베이지 방이 하나도 없고 마루 칸이 여럿이면 3D 그림
    if (d3) {
      for (const q of wood.slice(1)) if (q.cnt / tot >= 0.05) room.push(q);
      for (const q of gray) { const fr = q.cnt / tot; if (thin(q) && fr >= 0.02) bal.push(q); else if (fr < 0.06 && tone(q).light < 200) bath.push(q) }
    } else {
      if (wood[1] && wood[1].cnt / tot >= 0.04) box.kitchen = zoneBox(wood[1]);
      const en = gray.find(q => { const c = tone(q); return c.sat < 0.04 && c.light < 251 && q.ink >= 0.04 && q.cnt / tot < 0.06 }); if (en) box.entry = zoneBox(en);
    }
    E.rooms = Math.max(1, Math.min(5, room.length)); if (bath.length) E.baths = Math.min(3, bath.length); E.balconies = Math.min(3, bal.length);
    room.slice(0, 5).forEach((q, i) => box["room" + (i + 1)] = zoneBox(q)); bath.slice(0, 3).forEach((q, i) => box["bath" + (i + 1)] = zoneBox(q)); bal.slice(0, 3).forEach((q, i) => box["bal" + (i + 1)] = zoneBox(q));
    E.planBox = box; E.planPins = {}; return true;
  }
  const living = rg[0], bals = [], rooms = [], smalls = [];
  for (const q of rg.slice(1)) { const fr = q.cnt / tot; if (fr < 0.012) continue; if (q.ink > 0.15 && fr >= 0.07) continue; if (ext(q) && long(q) / thick(q) >= 1.6 && thick(q) < thr && fr >= 0.02) bals.push(q); else if (fr >= 0.07) rooms.push(q); else smalls.push(q) }
  const inks = rooms.map(q => q.ink).sort((a, b) => a - b), med = inks.length ? inks[Math.floor((inks.length - 1) / 2)] : 0, rooms2 = rooms.filter(q => q.ink <= Math.max(0.15, med * 3));   // 계단실처럼 선이 빽빽한 칸은 방이 아니다
  // 작은 칸(욕실·현관·드레스룸 등)은 그림만으로 가려내기 어렵다 → 가장 큰 것 하나만 욕실1 로 두고 나머지는 실장이 눌러서 정한다
  E.rooms = Math.max(1, Math.min(5, rooms2.length)); E.balconies = Math.min(3, bals.length);
  const box = { living: zoneBox(living) };
  rooms2.slice(0, 5).forEach((q, i) => box["room" + (i + 1)] = zoneBox(q)); bals.slice(0, 3).forEach((q, i) => box["bal" + (i + 1)] = zoneBox(q)); if (smalls[0]) box.bath1 = zoneBox(smalls[0]);
  E.planBox = box; E.planPins = {}; return true;
}
let PLAN_REG = { src: "", list: [] };                // 올린 도면에서 자동으로 찾은 방 칸
function detectRooms(done) {
  const src0 = E.planImg; if (!src0 || PLAN_REG.src === src0) return; PLAN_REG = { src: src0, list: [] };
  const img = new Image();
  img.onload = () => {
    try {
      const W = 480, H = Math.max(1, Math.round(W * img.height / img.width)), c = document.createElement("canvas"); c.width = W * 2; c.height = H * 2;
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, W * 2, H * 2); x.drawImage(img, 0, 0, W * 2, H * 2);
      const d = x.getImageData(0, 0, W * 2, H * 2).data, n = W * H, w0 = new Uint8Array(n), w1 = new Uint8Array(n), st = new Int32Array(n);
      const W2 = W * 2, H2 = H * 2, Lm = new Uint8Array(W2 * H2), M1 = new Uint8Array(W2 * H2), M2 = new Uint8Array(W2 * H2), R0 = 4;
      for (let i = 0; i < W2 * H2; i++) Lm[i] = 0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2];
      for (let y = 0; y < H2; y++) for (let xx = 0; xx < W2; xx++) { let m = 0; for (let k = Math.max(0, xx - R0); k <= Math.min(W2 - 1, xx + R0); k++) { const v = Lm[y * W2 + k]; if (v > m) m = v } M1[y * W2 + xx] = m }
      for (let y = 0; y < H2; y++) for (let xx = 0; xx < W2; xx++) { let m = 0; for (let k = Math.max(0, y - R0); k <= Math.min(H2 - 1, y + R0); k++) { const v = M1[k * W2 + xx]; if (v > m) m = v } M2[y * W2 + xx] = m }
      // 선 = 어둡거나, 주변보다 뚜렷이 어두운 곳 (회색 창 선·가는 문 선도 잡는다). 2×2 칸 중 하나라도 선이면 벽
      for (let y = 0; y < H2; y++) for (let xx = 0; xx < W2; xx++) { const i = y * W2 + xx; if (Lm[i] < 110 || Lm[i] < M2[i] - LINE_DIFF) w0[(y >> 1) * W + (xx >> 1)] = 1; if (Lm[i] < M2[i] - 22) w1[(y >> 1) * W + (xx >> 1)] = 1 }
      let best = null;
      for (const LD of [55, 40, 28]) {               // 도면마다 선 진하기가 달라서 기준을 바꿔 가며 가장 잘 나뉘는 것을 고른다
      w0.fill(0); for (let y = 0; y < H2; y++) for (let xx = 0; xx < W2; xx++) { const i = y * W2 + xx; if (Lm[i] < 110 || Lm[i] < M2[i] - LD) w0[(y >> 1) * W + (xx >> 1)] = 1 }
      for (let r = 1; r <= 7; r++) {                 // 문이 열린 틈을 메우려고 벽을 r칸 두껍게 해 본다. 방이 가장 많이 나뉘는 두께를 쓴다
      const t = new Uint8Array(n), wall = new Uint8Array(n);
      for (let y = 0; y < H; y++) { let last = -99; for (let xx = 0; xx < W; xx++) { if (w0[y * W + xx]) last = xx; if (xx - last <= r) t[y * W + xx] = 1 } last = W + 99; for (let xx = W - 1; xx >= 0; xx--) { if (w0[y * W + xx]) last = xx; if (last - xx <= r) t[y * W + xx] = 1 } }
      for (let xx = 0; xx < W; xx++) { let last = -99; for (let y = 0; y < H; y++) { if (t[y * W + xx]) last = y; if (y - last <= r) wall[y * W + xx] = 1 } last = H + 99; for (let y = H - 1; y >= 0; y--) { if (t[y * W + xx]) last = y; if (last - y <= r) wall[y * W + xx] = 1 } }
      const lab = new Int32Array(n), list = []; let id = 0;
      for (let s = 0; s < n; s++) {
        if (wall[s] || lab[s]) continue; id++; let top = 0, cnt = 0, x0 = W, x1 = 0, y0 = H, y1 = 0, edge = false; st[top++] = s; lab[s] = id;
        while (top) { const i = st[--top], px = i % W, py = (i - px) / W; cnt++; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; if (!px || !py || px === W - 1 || py === H - 1) edge = true;
          if (px > 0 && !wall[i - 1] && !lab[i - 1]) { lab[i - 1] = id; st[top++] = i - 1 } if (px < W - 1 && !wall[i + 1] && !lab[i + 1]) { lab[i + 1] = id; st[top++] = i + 1 }
          if (py > 0 && !wall[i - W] && !lab[i - W]) { lab[i - W] = id; st[top++] = i - W } if (py < H - 1 && !wall[i + W] && !lab[i + W]) { lab[i + W] = id; st[top++] = i + W } }
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        if (!edge && cnt > n * 0.004 && bw > W * 0.035 && bh > H * 0.035 && cnt / (bw * bh) > 0.4) list.push({ id, pc: cnt, x: (x0 - r) / W, y: (y0 - r) / H, w: (bw + 2 * r) / W, h: (bh + 2 * r) / H });
      }
      const sc = list.reduce((a, q) => a + q.pc, 0) / n * list.filter(q => q.pc > n * 0.01).length;   // 넓게 덮으면서 방이 많이 나뉠수록 좋은 결과
      if (!best || sc > best.sc) best = { list, lab, r, sc };
      }
      }
      const { list, lab } = best, rB = best.r;
      for (const q of list) {                        // 칸마다: 글자 구멍을 메운 모양 · 선이 얼마나 많은지 · 그 모양을 덮는 네모 1~3개
        const X0 = Math.max(0, Math.round(q.x * W)), Y0 = Math.max(0, Math.round(q.y * H)), X1 = Math.min(W - 1, Math.round((q.x + q.w) * W) - 1), Y1 = Math.min(H - 1, Math.round((q.y + q.h) * H) - 1), bw = X1 - X0 + 1, bh = Y1 - Y0 + 1, m = new Uint8Array(bw * bh);
        const rl = new Int32Array(bh).fill(-1), rr = new Int32Array(bh).fill(-1), ct = new Int32Array(bw).fill(-1), cb = new Int32Array(bw).fill(-1);
        for (let y = 0; y < bh; y++) for (let xx = 0; xx < bw; xx++) if (lab[(Y0 + y) * W + X0 + xx] === q.id) { if (rl[y] < 0) rl[y] = xx; rr[y] = xx; if (ct[xx] < 0) ct[xx] = y; cb[xx] = y }
        let area = 0, ink = 0, cr = 0, cg = 0, cbl = 0, cn = 0;
        for (let y = 0; y < bh; y++) for (let xx = 0; xx < bw; xx++) if (rl[y] >= 0 && xx >= rl[y] && xx <= rr[y] && ct[xx] >= 0 && y >= ct[xx] && y <= cb[xx]) { m[y * bw + xx] = 1; area++; if (w1[(Y0 + y) * W + X0 + xx]) ink++; else { const j = ((Y0 + y) * 2 * W2 + (X0 + xx) * 2) * 4; cr += d[j]; cg += d[j + 1]; cbl += d[j + 2]; cn++ } }
        q.cnt = area || 1; q.ink = ink / q.cnt; q.rgb = cn ? [cr / cn, cg / cn, cbl / cn] : [255, 255, 255]; q.rects = []; let cov = 0;
        for (let k = 0; k < 3; k++) { const b = bigRect(m, bw, bh); if (!b || (k && b.a < area * 0.08)) break;
          if (!k && b.a >= area * 0.72) { q.rects.push({ x: q.x, y: q.y, w: q.w, h: q.h }); break }   // 거의 네모인 방(붙박이장 홈 정도)은 반듯한 네모 하나로
          q.rects.push({ x: (X0 + b.x0 - rB) / W, y: (Y0 + b.y0 - rB) / H, w: (b.x1 - b.x0 + 1 + 2 * rB) / W, h: (b.y1 - b.y0 + 1 + 2 * rB) / H });
          for (let y = b.y0; y <= b.y1; y++) for (let xx = b.x0; xx <= b.x1; xx++) m[y * bw + xx] = 0; cov += b.a; if (cov > area * 0.9) break }
      }
      PLAN_REG = { src: src0, list, lab, W, H };
    } catch (e) { PLAN_REG = { src: src0, list: [] } }
    if (done) done();
  };
  img.src = src0;
}
function regionAt(x, y) { const P = PLAN_REG; if (P.src !== E.planImg || !P.lab) return null; const id = P.lab[Math.min(P.H - 1, Math.floor(y * P.H)) * P.W + Math.min(P.W - 1, Math.floor(x * P.W))]; return P.list.find(r => r.id === id) || P.list.filter(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h).sort((a, b) => a.w * a.h - b.w * b.h)[0] || null }   // 글자·선 위를 눌렀으면 그 자리를 품은 가장 작은 칸
const BXK = 56, BXP = 12;                           // 도면 좌표 (PK · PPAD 와 같은 값)
const hasBox = () => !!E.planImg && Object.keys(E.planBox || {}).length > 0;
const imgView = () => ({ vw: 800, vh: Math.round(800 * (E.planImgH || 600) / (E.planImgW || 800)) });
function curLayout(S) {                              // 올린 도면에 방 칸을 정해 두었으면 그 칸, 아니면 프로그램 도면
  if (!hasBox()) return planLayout(S);
  const { vw, vh } = imgView(), rects = [], mk = (s, k, b) => ({ s, k, x: (b.x * vw - BXP) / BXK, y: (b.y * vh - BXP) / BXK, w: b.w * vw / BXK, h: b.h * vh / BXK });
  for (const s of S.list) {
    const b = E.planBox[s.id]; if (!b) continue;
    const grp = [mk(s, s.id, b), ...(b.more || []).map((q, i) => mk(s, s.id + "#" + (i + 2), q))], tol = 0.3; let per = 0;
    for (const r of grp) { r.inner = {};                           // 같은 방의 다른 네모와 맞닿은 변은 벽이 아니다
      for (const sd of SIDES) {
        const hor = sd === "N" || sd === "S", c = sd === "N" ? r.y : sd === "S" ? r.y + r.h : sd === "W" ? r.x : r.x + r.w, a0 = hor ? r.x : r.y, a1 = a0 + (hor ? r.w : r.h);
        const touch = grp.some(q => { if (q === r) return false; const c0 = hor ? q.y : q.x, c1 = c0 + (hor ? q.h : q.w), b0 = Math.max(a0, hor ? q.x : q.y), b1 = Math.min(a1, hor ? q.x + q.w : q.y + q.h); return c > c0 - tol && c < c1 + tol && b1 - b0 > 0.5 * (a1 - a0) });
        if (touch) r.inner[sd] = true; else per += a1 - a0;
      } }
    if (b.poly && b.poly.length > 2) {                             // (v62) 점으로 그린 방: 그림·넓이·둘레·벽 비율은 찍은 모양대로 (x·y·w·h 는 그 모양을 감싸는 네모)
      const r = grp[0], p = b.poly.map(q => [(q[0] * vw - BXP) / BXK, (q[1] * vh - BXP) / BXK]); Object.assign(r, { poly: p, pa: polyArea(p), es: polySides(p), sl: { N: 0, S: 0, W: 0, E: 0 }, lc: polyMid(p) });
      p.forEach((q, i) => { const n = p[(i + 1) % p.length]; r.sl[r.es[i]] += Math.hypot(n[0] - q[0], n[1] - q[1]) }); per = polyLen(p) }
    for (const r of grp) r.per = per; rects.push(...grp);
  }
  return { rects, k: 1, W: vw / BXK, H: vh / BXK, img: true };
}
const PY_STEPS = { s8: "FT", s9: "paperM2" };   // ‘평수 한 칸’으로 넣는 공정 → 그 공정의 평수를 정하는 면적(바닥 = 바닥 면적 · 도배 = 벽·천장 면적)
/* (v73) 바닥재(장판·강마루) 줄의 수량 칸에 전에 넣어 둔 평수도 ‘평수 칸에 넣은 것’으로 본다 — 사용자: “장판에 관련된 내용도 지금 적용 하나도 안 되어 있고”.
   v71 은 그 뒤에 새로 고친 수량만 평수로 옮겼기 때문에, 전에 수량 칸에 평수를 넣어 둔 견적에서는 인원·식대가 여전히 따라오지 않았다. */
function pyfQ(sk) { try { for (const l of (D.stepLines || {})[sk] || []) { if (l.pyf !== sk) continue; const st = (E.ln || {})[l.id]; if (st && st.on !== false && +st.q > 0 && /평당/.test(String(l.items[+st.alt || 0] || ""))) return +st.q } } catch (e) { } return 0 }
function pyfClear(sk) { for (const l of (D.stepLines || {})[sk] || []) if (l.pyf === sk && E.ln[l.id] && E.ln[l.id].q !== undefined) { E.ln[l.id] = { ...E.ln[l.id] }; delete E.ln[l.id].q } }   // 평수 칸을 쓰면 줄에 남아 있던 옛 수량은 지운다 (두 칸이 다른 값을 갖지 않게)
function stepBase(S, sk) {
  const ex = (E.skip || {})[sk] || {}, exW = (E.skipW || {})[sk] || {};
  let list = S.list.filter(s => !ex[s.id]);
  if (Object.keys(exW).length) {                     // 뺀 벽만큼 둘레·벽 면적을 줄인다 (바닥·천장 면적은 그대로)
    const L = curLayout(S);
    list = list.map(s => {
      const w = exW[s.id]; if (!w) return s;
      let f = 0; for (const k in w) { const [rk, side] = k.split("|"), r = L.rects.find(r => r.k === rk); if (r && !(r.inner || {})[side]) f += wallShare(r, side) }
      f = Math.min(1, f); const wallA = (s.W || 0) - (s.A || 0);
      return { ...s, P: r1(s.P * (1 - f)), W: r1(wallA * (1 - f) + (s.A || 0)), ...(s.WT ? { WT: r1(s.WT * (1 - f)) } : {}) };
    });
  }
  if ((E.noCeil || {})[sk]) list = list.map(s => s.type === "욕실" ? s : { ...s, W: r1(Math.max(0, (s.W || 0) - (s.A || 0))) });   // 천장 도배 제외 → 벽 면적만
  // 발코니 확장부: 이 공정에서 ‘포함’으로 켠 발코니는 거실처럼 바닥·벽 면적에 더한다 (방 개수에는 넣지 않음)
  const inc = (E.inc || {})[sk] || {}, add = S.list.filter(s => s.type === "발코니" && inc[s.id]).map(s => ({ ...s, type: "거실" }));
  const S2 = { ...S, list: [...list, ...add] }, living = list.find(s => s.type === "거실"), n = t => list.filter(s => s.type === t && !s.dress && !s.xsp).length - (t === "방" && ex.util ? 1 : 0);
  const av = areaVars(S2), bsA = list.filter(s => s.type === "욕실"), bsT = bsA.filter(s => { const m = bathModeOf(s.id); return m === "full" || m === "over" }), bN = k => bsA.filter(s => bathModeOf(s.id) === k).length;   // (v71) 욕실마다 고른 공사 범위 — 타일을 붙이는 칸(전체 교체 · 덧방)만 타일 넓이에 센다
  av.bathWallM2 = r1(bsT.reduce((a, s) => a + (s.WT || 0), 0)); av.bathFloorM2 = r1(bsT.reduce((a, s) => a + (s.A || 0), 0));
  for (let n = 1; n <= 3; n++) { const bs = bsT.filter(s => bathSlot(s) === n); av["bwA" + n] = bs.reduce((a, s) => a + (+s.WT || 0), 0); av["bfA" + n] = bs.reduce((a, s) => a + (+s.A || 0), 0) }   // (v78) 욕실마다의 타일 넓이 (욕실1 · 욕실2 · 욕실3부터)
  let pyE = +E.py || 0, pyAuto = pyE, dp = 0, dpAuto = 0;
  if (PY_STEPS[sk]) { const kk = PY_STEPS[sk], all = areaVars({ ...S, list: noX(S.list) }), avB = areaVars({ ...S2, list: noX(S2.list) }), xFT = r1(av.FT - avB.FT), xPM = r1(av.paperM2 - avB.paperM2), house = pyE;   // (v63) 평수 비율은 추가 공간을 빼고 잰다 — 추가 공간은 아파트 평수 안에 이미 들어 있는 곳이라 넣거나 빼도 도배·바닥 평수가 달라지지 않는다 (xFT·xPM = 추가 공간 몫의 면적)
    pyAuto = all[kk] > 0 ? Math.round(pyE * avB[kk] / all[kk] * 10) / 10 : pyE;   // 자동 평수 = 집 평형 × (이 공정에서 하는 면적 ÷ 집 전체). 도면에서 방·벽·천장을 빼면 평수도 줄어든다
    dpAuto = Math.round(pyAuto * 2.5);   // 도배 평수(벽·천장에 바르는 넓이) = 평형 × 2.5 (34평 → 85평)
    const ov = sk === "s9" ? (dv => dv > 0 && dv !== dpAuto ? dv / 2.5 : 0)(Math.round(+E.dpOv || 0)) : (v => v > 0 && v !== pyAuto ? v : 0)(+((E.pyOv || {})[sk]) || pyfQ(sk));   // 직접 넣은 값: 도배는 ‘도배 평수’(E.dpOv), 바닥은 아파트 평형(E.pyOv.s8)
    if (ov) { if (house > 0) { av.FT = r1(all.FT * ov / house + xFT); av.paperM2 = r1(all.paperM2 * ov / house + xPM) } pyE = ov } else pyE = pyAuto;   // 직접 넣으면 그 평수의 집으로 보고 면적도 같은 비율로 맞춘다
    dp = Math.round(pyE * 2.5) }
  return { ...av, entryA: (list.find(s => s.type === "현관") || {}).A || 0, tb: (c => { const bs = bsT, bl = list.filter(s => s.type === "발코니"), bx = (t, s) => t + c(+s.A || 0, 0.99); const sm = (n, k, b) => bs.filter(s => bathSlot(s) === n).reduce((t, s) => t + c(+s[k] || 0, b), 0);
    return { w: bs.reduce((t, s) => t + c(+s.WT || 0, 1.44), 0), f6: bs.reduce((t, s) => t + c(+s.A || 0, 1.44), 0), f3: bs.reduce((t, s) => t + c(+s.A || 0, 0.99), 0), b: bl.reduce(bx, 0),
      w1: sm(1, "WT", 1.44), w2: sm(2, "WT", 1.44), w3: sm(3, "WT", 1.44), f61: sm(1, "A", 1.44), f62: sm(2, "A", 1.44), f63: sm(3, "A", 1.44), f31: sm(1, "A", 0.99), f32: sm(2, "A", 0.99), f33: sm(3, "A", 0.99), b1: bl.filter(s => s.id === "bal1").reduce(bx, 0), b2: bl.filter(s => s.id !== "bal1").reduce(bx, 0) } })((a, b) => a > 0 ? Math.ceil(a * 1.2 / b - 1e-9) : 0), _sp: list,   // b1 = 앞 발코니(발코니1) · b2 = 그 밖의 발코니(뒷 발코니 · 발코니처럼 계산하는 추가 공간)
    balA1: r1(list.filter(s => s.type === "발코니" && s.id === "bal1").reduce((a, s) => a + (+s.A || 0), 0)), balA2: r1(list.filter(s => s.type === "발코니" && s.id !== "bal1").reduce((a, s) => a + (+s.A || 0), 0)),
    balA: r1(list.filter(s => s.type === "발코니").reduce((a, s) => a + (+s.A || 0), 0)), kitA: (k => k && +k.w > 0 ? r1(+k.w * (+k.h > 0 ? +k.h : 0.6)) : 4)((E.dim || {}).kitTile), ...woodVars(living ? living.A : 0), woodLoss: woodLossPct() / 100, livingA: living ? living.A : 0, py: pyE, pyAuto, dp, dpAuto, rooms: n("방"), baths: n("욕실"), bathsFull: bN("full"), bathsOver: bN("over"), bathsFix: bN("fix"), bathsTile: bsT.length, bathsAny: bsA.filter(s => bathModeOf(s.id) !== "none").length, balconies: n("발코니"), level: +E.level || 0, exclM2: S.exclM2, supplyM2: S.supplyM2, buf: Math.max(0, +D.settings.laborBuffer || 0), Math };
}
function woodVars(lv) {                               // 목작업 치수 표(E.ceilList) → 종류별 면적. 표에 없는 종류는 예전 어림값(거실 60% · 가벽 7㎡ · 아트월 6㎡)
  const H = (+E.ceilH > 0 ? +E.ceilH : D.layout.ceilH) * 1000, KEY = { "천장": "ceilA", "가벽": "wallA", "단열 벽": "insA", "아트월": "artA", "벽 평탄화": "flatWA", "기타": "etcA" };
  const o = { ceilA: 0, wallA: 0, insA: 0, artA: 0, flatWA: 0, etcA: 0 }, f = { ...o }, n = { ...o }, r3 = v => Math.round(v * 1000) / 1000;
  for (const r of E.ceilList || []) { const k = KEY[r.kind || "천장"] || "etcA", h = +r.h > 0 ? +r.h : (k === "ceilA" ? 0 : H); if (!(+r.w > 0 && h > 0)) continue;
    const a = r.w * h / 1e6, m = +r.m > 0 ? +r.m : 1; o[k] += a * m; f[k] += a; n[k]++ }   // o = 석고가 붙는 면적(겹·면 수 포함) · f = 각재 틀 면적
  return { ceilA: r3(n.ceilA ? o.ceilA : lv * 0.6), ceilAF: r3(n.ceilA ? f.ceilA : lv * 0.6), wallA: r3(n.wallA ? o.wallA : 7), wallAF: r3(n.wallA ? f.wallA : 7), insN: n.insA, insA: r3(o.insA), insAF: r3(f.insA),
    artA: r3(n.artA ? o.artA : 6), artAF: r3(n.artA ? f.artA : 6), flatWA: r3(o.flatWA), flatWAF: r3(f.flatWA), etcA: r3(o.etcA), etcAF: r3(f.etcA) };
}
/* 실측표(E.meas): 치수를 넣으면 그 줄의 수량이 실측값으로 정해진다. 가구는 cm 로 받아 ‘자’(30.3cm)로 바꾼다.
   MEAS_ROWS = [키, 이름, 단위, 받는 줄 id, 설명]  ·  kitH 는 주방 벽 타일 높이(싱크대 위 타일 붙이는 높이, 비우면 60cm) */
const JA = 30.3;
const MEAS_ROWS = [["sink", "싱크대 길이", "cm", "sink", "하부장 전체 길이 (ㄱ자면 두 변 합)"], ["kitH", "주방 벽 타일 높이", "cm", "kitTile", "싱크대 길이 × 이 높이 = 타일 면적 (비우면 60cm)"],
  ["shoe", "신발장 폭", "cm", "shoe", "현관 신발장 가로"], ["closet", "붙박이장 폭", "cm", "closet", "붙박이장 가로 합계"], ["desk", "화장대·책장 폭", "cm", "desk", "맞춤 가구 가로"],
  ["winN", "교체할 창 수", "틀", "demoSash", "기존 창문 철거 수량"], ["screenN", "방충망 수", "개", "screen", "방충망 교체 수량"]];
function measQty(l) {                                // 이 줄에 해당하는 실측값이 있으면 [수량, 견적서에 적을 설명], 없으면 null
  const m = E.meas || {}, v = k => +m[k] > 0 ? +m[k] : 0;
  const fu = E.furnOff ? [] : (E.furn || []), fw = ids => fu.filter(f => ids.includes(f.lid) && +f.w > 0), pos = (x, d) => +x > 0 ? +x : d;
  const box = a => Math.max(1, Math.ceil(a * 1.2 / 1.44 - 1e-9)), kt = (E.dim || {}).kitTile;   // 타일은 면적 → 박스 수 (로스 20% · 1BOX 1.44㎡)
  if (l.id === "kitTile" && kt && +kt.w > 0) return [box(+kt.w * (+kt.h > 0 ? +kt.h : 0.6)), "타일 치수 기준 (가로 × 높이)"];
  if (l.id === "kitTile" && fw(["sink"]).length) return [box(fw(["sink"]).reduce((a, f) => a + f.w / 1000 * pos(f.hg, 600) / 1000, 0)), "가구 치수 기준 (싱크대 길이 × 상·하부장 사이)"];
  if (l.id === "sinkFilm" && fw(["sink"]).length) return [r1(fw(["sink"]).reduce((a, f) => a + f.w / 1000 * (pos(f.hl, 850) + pos(f.hu, 700)) / 1000, 0)), "가구 치수 기준 (상·하부장 문짝 면적)"];
  if (l.id === "closetFilm" && fw(["closet", "shoe"]).length) return [r1(fw(["closet", "shoe"]).reduce((a, f) => a + f.w / 1000 * pos(f.h, 2300) / 1000, 0)), "가구 치수 기준 (가로 × 높이)"];
  if (l.id === "sashFilm" && (E.wins || []).some(w => w.kind !== "방충망")) return [E.wins.filter(w => w.kind !== "방충망").length, "창호 목록 기준"];
  if (l.id === "demoSash" && !v("winN") && (E.wins || []).some(w => w.kind !== "방충망")) return [E.wins.filter(w => w.kind !== "방충망").length, "창호 목록 기준"];
  if (l.id === "screen" && !v("screenN") && (E.wins || []).some(w => w.kind === "방충망")) return [E.wins.filter(w => w.kind === "방충망").length, "창호 목록 기준"];
  if (l.id === "sink" && v("sink")) return [r1(v("sink") / JA), `실측 ${v("sink")}cm`];
  if (l.id === "kitTile" && v("sink")) { const h = v("kitH") || 60; return [box(v("sink") / 100 * h / 100), `실측 길이 ${v("sink")}cm × 높이 ${h}cm`] }
  if (l.id === "shoe" && v("shoe")) return [r1(v("shoe") / JA), `실측 ${v("shoe")}cm`];
  if (l.id === "closet" && v("closet")) return [r1(v("closet") / JA), `실측 ${v("closet")}cm`];
  if (l.id === "desk" && v("desk")) return [r1(v("desk") / JA), `실측 ${v("desk")}cm`];
  if (l.id === "demoSash" && v("winN")) return [v("winN"), "실측 창 수"];
  if (l.id === "screen" && v("screenN")) return [v("screenN"), "실측 방충망 수"];
  return null;
}
/* 벽에 하는 공사 중 수량을 고정 숫자로 둔 줄(벽면 도장·부분 도배·벽 타일)은, 도면에 ‘위치 메모’로 벽을 찍으면 그 벽 면적 합계가 수량이 된다 */
function wallMarkQty(l, it, S) {
  const ms = (E.marks || []).filter(m => m.lid === l.id && m.room && !!m.img === !!E.planImg); if (!ms.length) return null;
  if (it.unit !== "㎡" || l.id === "kitTile" || !/^[\d.]+$/.test(String(l.qty).trim()) || !/벽|도배|도장|페인트/.test((l.label || "") + l.items.join(" "))) return null;
  const L = curLayout(S), H = +E.ceilH > 0 ? +E.ceilH : D.layout.ceilH, cut = D.layout.openingCut; let a = 0;
  for (const m of ms) { const s = S.list.find(x => x.id === m.room), r = L.rects.find(r => r.k === (m.rk || m.room)); if (!s || !r) continue; a += m.side ? s.P * wallShare(r, m.side) * H * cut : (s.W - s.A) }
  return r1(a);
}
function ltGeom(S) {                                  // 도면 크기와 1m 의 길이(px). 올린 도면에 방 칸이 없으면 pm = 0 (길이를 잴 수 없음)
  if (E.planImg) { const v = imgView(); if (!hasBox()) return { ...v, pm: 0 }; const L = curLayout(S), seen = new Set(), aU = L.rects.reduce((a, r) => a + (+r.s.A > 0 ? (r.pa || r.w * r.h) : 0), 0); let aM = 0;   // 넓이를 아직 안 넣은 추가 공간(A = 0)은 축척을 재는 데서 뺀다
    for (const r of L.rects) if (!seen.has(r.s.id)) { seen.add(r.s.id); aM += +r.s.A || 0 } return { ...v, pm: aM > 0 ? Math.sqrt(aU / aM) * BXK : 0 } }
  const L = planLayout(S); return { vw: L.W * BXK + BXP * 2, vh: L.H * BXK + BXP * 2, pm: BXK * (L.k || 1) };
}
function lightQty(l, S) {                             // 도면에 놓은 조명이 있으면 [수량, 설명]
  const k = { fan: "fan", down: "down", pendant: "pendant", line: "line", magRail: "mag", circuit: "plug" }[l.id]; if (!k) return null;
  const ls = (E.lights || []).filter(t => t.k === k && !!t.img === !!E.planImg); if (!ls.length) return null;
  if (k !== "line" && k !== "mag") return [ls.length, "도면 배치 기준"];
  const G = ltGeom(S); if (!G.pm) return null; const len = ls.reduce((a, t) => a + Math.hypot((t.x2 - t.x) * G.vw, (t.y2 - t.y) * G.vh) / G.pm, 0);
  return [k === "mag" ? Math.max(1, Math.ceil(len - 0.05)) : r1(len), "도면 배치 기준"];
}
const stepOfLine = l => Object.keys(D.stepLines).find(sk => D.stepLines[sk].includes(l));
function lineVars(S) {                               // { 공정 key: 변수 묶음 }
  const V = {}, q = {}, on = {}, qa = {}, ona = {};   // q·on = 합계에 들어가는 줄만 · qa·ona = 비교견적(별도) 줄까지
  for (const [sk, rows] of Object.entries(D.stepLines)) {
    V[sk] = stepBase(S, sk); const ALT = id => { const x = lnFind(id); return x ? (lnState(x).alt || 0) : 0 }; V[sk].ALT = ALT; V[sk].PR = n => { const i = byName[n]; return i ? (+unitPrice(i, E) || 0) : 0 }; const base = { ...V[sk], ON: () => 0, L: () => 0, ALT };   // 1차: 각 줄 수량 (다른 줄을 참조하는 식을 위해)
    for (const l of rows) {
      const st = lnState(l), live = st.on && !st.opt; on[l.id] = live ? 1 : 0;   // 옵션으로 돌린 줄은 다른 줄(작업비 등)의 계산에 넣지 않는다
      let a = 0; try { a = r1(+ev(l.qty, base)) } catch (e) {}
      { const val = st.q !== undefined && st.q !== "" ? +st.q : a; q[l.id] = live ? val : 0; qa[l.id] = st.on ? val : 0; ona[l.id] = st.on ? 1 : 0 }
    }
  }
  { const xf = (E.extras || []).filter(x => x.film && !x.opt).reduce((a, x) => a + (+x.qty || 0), 0); if (xf) q.filmMold = (q.filmMold || 0) + xf; const xa = (E.extras || []).filter(x => x.film).reduce((a, x) => a + (+x.qty || 0), 0); if (xa) qa.filmMold = (qa.filmMold || 0) + xa }   // ‘필름 넣을 곳’으로 더한 필름 길이도 필름 작업비 인원 계산에 넣는다
  for (const sk in V) { V[sk].ON = id => on[id] || 0; V[sk].L = id => q[id] || 0; V[sk]._o = { ON: id => ona[id] || 0, L: id => qa[id] || 0 } }
  return V;
}
function lnLoc(l, S) { return l.locDoc && l.locIds && S ? ((S.list.find(s => s.id === l.locIds[0]) || {}).name || l.loc || "") : (l.loc || "") }   // 견적서 ‘위치’ 칸: 욕실마다 나눈 타일 줄은 그 욕실 이름
function computeLines(S, lines, errors) {
  const V = lineVars(S);
  for (const [sk, rows] of Object.entries(D.stepLines)) for (const l of rows) {
    const st = lnState(l); if (!st.on) continue; if (l.sel && !st.opt) continue;   // 인원만 더하는 작업: 금액은 ‘목수 작업비’ 한 줄에 합쳐진다
    const v = st.opt && V[sk]._o ? { ...V[sk], ...V[sk]._o } : V[sk];
    const name = l.sel && byName["목수 인건비"] ? "목수 인건비" : l.items[Math.min(st.alt || 0, l.items.length - 1)], it = byName[name];
    if (!it) { errors.push("품목 없음: " + name); continue }
    let auto; try { auto = r1(+ev(l.qty, v)) } catch (e) { errors.push(`수량식 오류 (${name})`); continue }
    const wq = wallMarkQty(l, it, S); if (wq !== null) auto = wq;
    const mq = measQty(l) || lightQty(l, S); if (mq) auto = mq[0];
    const qty = st.q !== undefined && st.q !== "" ? +st.q : auto;
    if (l.hideZero && !(qty > 0)) continue;   // 다른 줄에 포함돼 0이 되는 줄은 견적에 올리지 않는다 (예: 강마루를 고르면 바닥 작업비)
    const bom = l.bom;
    if (bom && bom.mode === "replace" && st.p !== undefined && st.p !== "") {   // 실장이 1식 금액을 정한 묶음: 금액은 그 값, 포함 내역(수량)은 자동으로 풀어 적는다
      const det = bom.items.map(b => { let a = 0; try { a = r1(+ev(b.qty, v)) } catch (e) {} return { name: b.name, qty: a, unit: (byName[b.name] || {}).unit || "", note: "" } }).filter(d => d.qty > 0);
      const one = { key: "ln|" + l.id, lid: l.id, step: sk, space: "common", spaceName: lnLoc(l, S), proc: it.proc, name: bom.label, it: null, spec: "", note: "", unit: "식", kind: bom.label.includes("부자재") ? "부자재" : "자재", auto: 1, qty: 1, edited: false, lump: true, manualPrice: st.p, detail: det };
      if (st.opt) one.opt = true; lines.push(one); continue;
    }
    if (bom && bom.mode === "replace") {           // 묶음 대신 자재·부자재를 낱개로
      bom.items.forEach((b, k) => {
        const bi = byName[b.name]; if (!bi) { errors.push("품목 없음: " + b.name); return }
        let a = 0; try { a = r1(+ev(b.qty, v)) } catch (e) { errors.push(`수량식 오류 (${b.name})`); return }
        const key = "ln|" + l.id + "#" + k, sq = (E.lq || {})[key];
        const bq = sq !== undefined && sq !== "" ? +sq : a; if (bq <= 0) return;
        lines.push({ key, lid: l.id, step: sk, space: "common", spaceName: lnLoc(l, S), proc: it.proc, name: b.name, it: bi, spec: bi.spec, note: `${bom.label}${b.note ? " · " + b.note : ""}`, unit: bi.unit, kind: bom.label.includes("부자재") && !(k < 1 && bom.label === "목자재") ? "부자재" : (bi.kind || "자재"), auto: a, qty: bq, edited: bq !== a, group: bom.label, ...(st.opt ? { opt: true } : {}) });
      });
      continue;
    }
    const line = { key: "ln|" + l.id, lid: l.id, step: sk, space: "common", spaceName: lnLoc(l, S), proc: it.proc, name, it, spec: it.spec, note: l.note || it.spec, unit: it.unit, kind: l.kind || (name === SET_SUB ? "부자재" : it.kind || "자재"), auto, qty, edited: qty !== auto };
    { const ff = (E.furn || []).filter(f => f.lid === l.id && (f.loc || +f.w > 0)); if (ff.length) { const locs = [...new Set(ff.map(f => String(f.loc || "").trim()).filter(Boolean))];   // 가구 자리: 정해진 위치 말고도 적은 위치를 모두 보여 준다
        if (locs.length) line.spaceName = locs.join("·"); line.note = [line.note, "위치: " + ff.map(f => (String(f.loc || "").trim() || "위치 미정") + (+f.w > 0 ? " " + (+f.w).toLocaleString("ko-KR") + "mm" : "")).join(", ")].filter(Boolean).join(" · ") } }
    if (l.docName) line.docName = l.docName; if (l.set) line.set = true;
    if (st.opt) line.opt = true;   // 옵션: 금액은 보이되 합계에는 넣지 않는다
    if (l.lump) line.lump = true;   // 고객 견적서에는 자당 단가 대신 1식 금액으로 보인다
    if (l.cq) { try { const c = r1(+ev(l.cq, v)); if (c > 0 && c < qty) line.cq = c } catch (e) { } }   // cq = 실제 쓰는 양 (판매 수량보다 작을 때만 — 장판을 아파트 평수 그대로 받는 경우)
    if (mq) { line.note = [line.note, mq[1]].filter(Boolean).join(" · "); line.measured = true }
    if (bom && bom.mode === "detail") { const sc = !!bom.scale && auto > 0, vd = Object.create(v); vd.SELF = sc ? auto : qty; vd.AUTO = auto; const K = sc ? qty / auto : 1; if (bom.scale) line.useCost = true;   // scale: ‘자동 수량일 때 쓰는 양’을 계산한 뒤 실장이 고친 수량의 비율만큼 늘리거나 줄인다. 품목마다 따로 올림하므로 각기 다르게 변한다
      line.detailAll = bom.items.map((b, k) => { let a = 0; try { a = +ev(b.qty, vd) || 0 } catch (e) {} if (bom.scale) { if (sc && !b.fix) a *= K; a = a > 0 ? Math.ceil(a - 1e-6) : 0 } else a = r1(a); const o = (E.dq || {})[l.id + "#" + k]; return { k, name: b.name, qty: o !== undefined && o !== "" ? +o : a, auto: a, unit: b.unit, note: b.note, hide: !!b.hide } }); line.detail = line.detailAll.filter(d => d.qty > 0 && !d.hide) }   // hide = 실장 화면에만 (롤 수 · 인원처럼 고객 견적서에 나가면 안 되는 것)   // 포함 내역: 실장이 수량을 고칠 수 있다 (E.dq)
    if (it.costVar) { const c = +st.c || 0; const m = STAFF_DATA ? it.m : marginOf(it); line.manualPrice = c ? roundPrice(c / (1 - m)) : ""; line.manualCost = c || ""; line.costInput = true }
    if (!l.set && st.p !== undefined && st.p !== "") line.manualPrice = st.p;   // 세트 줄의 단가는 관리자가 정한 1식 단가만 쓴다
    if (l.id === "down" && E.dnl) { const ps = Object.entries(E.dnl).filter(([, n]) => +n > 0); if (ps.length && ps.reduce((a, [, n]) => a + +n, 0) === qty) line.detail = ps.map(([k, n]) => ({ name: k === "hall" ? "복도·현관" : ((S.list.find(x => x.id === k) || {}).name || k).replace(/ \(.*\)/, "").replace("·공용부", ""), qty: +n, unit: it.unit })) }   // 매입등: 곳마다 넣은 개수
    lines.push(line);
  }
}
let CMP_BUSY = false, CMP_OPEN = null, BASE_AMT = null;
function baseAmts() {                                 // 실장이 수량·종류·금액을 고치지 않았다면(자동·기본) 줄마다 얼마였을지 → ‘기본보다 얼마’ 표시에 쓴다. 체크한 공사는 그대로 두고 고친 값만 뺀다
  if (BASE_AMT) return BASE_AMT; const m = {}; if (CMP_BUSY || !D.stepLines) return m; CMP_BUSY = true; const k1 = E.ln, k2 = E.dq, k3 = E.lq, k4 = E.dnl;
  try { E.ln = Object.fromEntries(Object.entries(k1 || {}).map(([k, x]) => [k, { on: !!x.on, ...(x.opt ? { opt: true } : {}) }])); E.dq = {}; E.lq = {}; E.dnl = undefined;
    const r = compute0(); for (const x of r.all || r.lines) if (x.lid) m[x.lid] = (m[x.lid] || 0) + x.amt; m._sum = r.sum; m._ok = true } catch (e) { } finally { E.ln = k1; E.dq = k2; E.lq = k3; E.dnl = k4; CMP_BUSY = false }
  return BASE_AMT = m }
const curAmt = id => (R.all || R.lines).filter(x => x.lid === id).reduce((a, x) => a + x.amt, 0);
const dltChip = (d, t) => Math.abs(d) >= 1 ? `<span class="dlt ${d > 0 ? "up" : "dn"}" title="수량·종류를 자동(기본)으로 뒀을 때와의 차이입니다">${t || "기본보다"} ${d > 0 ? "+" : "−"}${won(Math.abs(d))}원</span>` : "";
function cmpArr(st) { return !st || st.cmp === undefined || st.cmp === null || st.cmp === "" ? [] : [].concat(st.cmp).map(Number).filter(n => n >= 0) }   // 비교로 고른 다른 종류들
function altDiffs(l) {                                // 이 줄을 다른 종류로 바꿨을 때 공사비가 얼마나 달라지는지 (종류마다)
  const had = E.ln[l.id], st0 = { ...lnState(l) }, cur = st0.alt || 0, base = R.sum + R.biz, out = []; if (CMP_BUSY) return out; CMP_BUSY = true;
  try { l.items.forEach((n, i) => { if (i === cur || !byName[n]) return; E.ln[l.id] = { ...st0, on: true, opt: false, alt: i, p: undefined, c: undefined, cmp: undefined };
      const r2 = compute0(); out.push({ i, diff: (r2.sum + r2.biz) - base, tbd: r2.all.some(x => x.lid === l.id && x.tbd) }) }) }
  finally { if (had) E.ln[l.id] = had; else delete E.ln[l.id]; CMP_BUSY = false }
  return out;
}
function compute() {                                  // 본 계산 + ‘비교’로 고른 다른 종류로 바꿨을 때의 합계 차이
  BASE_AMT = null; const r = compute0(); r.cmp = [];
  if (CMP_BUSY || !D.stepLines) return r; CMP_BUSY = true;
  try { for (const l of Object.values(D.stepLines).flat()) { const st = E.ln[l.id]; if (!st || !st.on || st.opt) continue; const cur = lnState(l).alt || 0;
      for (const ci of cmpArr(st)) { if (ci === cur || !l.items[ci]) continue;
        E.ln[l.id] = { ...st, alt: ci, p: undefined, c: undefined }; let r2; try { r2 = compute0() } finally { E.ln[l.id] = st }
        r.cmp.push({ lid: l.id, alt: ci, label: l.label || l.items[cur], from: l.items[cur], to: l.items[ci], diff: (r2.sum + r2.biz) - (r.sum + r.biz), net: r2.net, total: r2.total }) } } } finally { CMP_BUSY = false }
  return r;
}
function compute0() {
  const S = spaces(), lines = [], errors = [];
  if (D.stepLines) { computeLines(S, lines, errors); return finish(S, lines, errors, 0) }
  const common = S.list.find(s => s.id === "common");
  const FT = S.list.filter(s => ["거실", "주방", "방"].includes(s.type) && selLabel(s, "floor") === "기본 마감").reduce((a, s) => a + s.A, 0);
  const totals = {};
  const base = { py: +E.py || 0, rooms: +E.rooms || 0, baths: +E.baths || 0, balconies: +E.balconies || 0, level: +E.level || 0, exclM2: S.exclM2, supplyM2: S.supplyM2, FT: r1(FT),
    G: { floorItem: E.floorItem, paperItem: E.paperItem }, Math, C: k => selLabel(common, k), T: n => totals[n] || 0 };
  function push(sp, li, idx, ctx, src) {
    const name = resolveItem(li.item), it = byName[name];
    if (!it) { errors.push(`품목 없음: ${name}`); return }
    let when = true; try { if (li.when) when = !!ev(li.when, ctx) } catch (e) { errors.push(`조건식 오류 (${name}): ${li.when}`); return }
    if (!when) return;
    let q; try { q = +ev(li.qty, ctx) } catch (e) { errors.push(`수량식 오류 (${name}): ${li.qty}`); return }
    // 인건비가 애매한 공정은 여유 인원을 더한다 (관리자 설정: laborBuffer, bufferItems)
    const buf = src === "auto" && (D.settings.bufferItems || []).includes(name) ? (+D.settings.laborBuffer || 0) : 0;
    if (!isFinite(q)) return;
    q += buf;
    if (q <= 0) return;
    if (buf) li = { ...li, note: `${li.note || it.spec}${li.note || it.spec ? " · " : ""}여유 ${buf}인 포함` };
    const key = `${sp.id}|${src}|${idx}|${name}`;
    const auto = r1(q);
    const qty = E.ovr[key] !== undefined && E.ovr[key] !== "" ? +E.ovr[key] : auto;
    totals[name] = (totals[name] || 0) + qty;
    lines.push({ key, space: sp.id, spaceName: sp.name, proc: it.proc, name, it, spec: it.spec, note: li.note || it.spec, unit: it.unit, kind: it.kind || "자재", auto, qty, edited: qty !== auto });
  }
  for (const sp of S.list) {
    for (const cat of catsOf(sp)) {
      const opt = cat.opts[selIdx(sp, cat)]; if (!opt) continue;
      const ctx = { ...base, ...sp, v: numVal(sp, cat), S: k => selLabel(sp, k) };
      opt.lines.forEach((li, i) => push(sp, li, i, ctx, cat.key));
    }
  }
  for (const p of D.packages || []) {
    if (!p.items || !(E.pk[p.key] || {}).on) continue;
    const ctx = { ...base, ...common, v: pkNum(p), S: () => "" };
    p.items.forEach((li, i) => push(common, li, i, ctx, "pkg:" + p.key));
  }
  (D.auto || []).forEach((li, i) => push(common, li, i, { ...base, ...common, v: 0, S: () => "" }, "auto"));
  return finish(S, lines, errors, FT);
}
function finish(S, lines, errors, FT) {
  for (const x of E.extras) {
    const it = x.item ? byName[x.item] : null;
    lines.push({ key: x.id, extra: true, space: x.space || "common", spaceName: (S.list.find(s => s.id === (x.space || "common")) || {}).name || "공통공사", proc: it ? it.proc : (x.proc || "기타"),
      name: it ? it.name : (x.name || x.item || ""), it, note: x.note ?? (it ? it.spec : ""), unit: it ? it.unit : (x.unit || "식"), kind: it ? it.kind : "자재", qty: +x.qty || 0, auto: +x.qty || 0, manualPrice: x.price, manualCost: x.cost, ...(x.sub ? { detail: String(x.sub).split(",").map(n => ({ name: n.trim(), qty: +x.qty || 0, unit: x.unit || "식" })).filter(d => d.name) } : {}), ...(x.opt ? { opt: true } : {}), ...(x.film ? { film: true, spaceName: x.note || "필름" } : {}), ...(x.wk ? { wk: true } : {}), ...(x.at ? { at: x.at } : {}), dim: x.dim || "" });
  }
  // 금액
  let sum = 0, cost = 0, fzDiff = 0, optSum = 0; const byProc = {}, bySpace = {}, fz = E.fpVer && String(E.fpVer) < "2026-11-16" ? {} : (E.fp || {}), tq = {};   // 2026-11-16 확정 금액 전에 저장한 단가는 버리고 새 단가로 계산한다
  for (const l of lines) if (l.it && l.it.tier) tq[l.it.name] = (tq[l.it.name] || 0) + (+l.qty || 0);
  for (const l of lines) {
    const it = l.it, manual = l.manualPrice !== undefined && l.manualPrice !== "";
    const cur = it ? unitPrice(it, E) : 0;
    // 저장할 때 고정해 둔 단가(E.fp)가 있으면 단가표가 바뀌어도 그 값을 쓴다 (층수·업체견적으로 정해지는 품목은 제외)
    const f = !manual && it && !it.costTable && !it.costVar && !it.tier ? +fz[fpKey(l)] || 0 : 0;
    l.price = manual ? +l.manualPrice : it && it.tier ? tierPrice(it, tq[it.name] || 0) : (f || cur);
    if (f && f !== cur) { l.frozen = true; fzDiff++ }
    const m = noCost() ? 0 : it ? marginOf(it) : (+(D.margins || {})[l.proc] || 0);
    l.ucost = noCost() ? 0 : l.manualCost !== undefined && l.manualCost !== "" ? +l.manualCost : (it && !manual ? unitCost(it, E) : l.price * (1 - m));
    l.amt = Math.round(l.price * l.qty); l.cost = l.ucost * l.qty;
    if (!noCost() && l.cq > 0 && l.cq < l.qty && !(l.manualCost !== undefined && l.manualCost !== "")) { l.cost = l.ucost * l.cq; l.ucost = l.qty ? l.cost / l.qty : l.ucost }   // 원가는 실제 쓰는 양으로 (남는 수량만큼은 이익으로 잡힌다)
    if (!noCost() && l.set && l.useCost && l.detailAll && l.detailAll.length) { const c = l.detailAll.reduce((a, d) => a + d.qty * (+(byName[d.name] || {}).cost || 0), 0); if (c > 0) { l.cost = c; l.ucost = l.qty ? c / l.qty : c } }   // 세트 줄의 원가 = 실제 쓰는 양 × 낱개 원가 (식 수를 올림한 만큼은 이익으로 잡힌다)
    l.tbd = !l.price && (l.manualPrice === undefined || l.manualPrice === "");
    if (!l.lump && (l.unit === "인" || l.unit === "롤" || /식대/.test(l.name))) l.lump = true;   // 인건비(몇 명)·벽지 롤 수·식대는 고객 견적서에 ‘1식’ 금액으로만 나간다 (계산 근거는 실장 화면에서만)
    if (l.opt) { optSum += l.amt; continue }   // 옵션 줄: 합계·공정별 집계에서 뺀다
    sum += l.amt; cost += l.cost;
    const p = byProc[l.proc] = byProc[l.proc] || { amt: 0, cost: 0, 자재: 0, 노무: 0, 경비: 0 }; p.amt += l.amt; p.cost += l.cost; p[l.kind] = (p[l.kind] || 0) + l.amt;
    const s = bySpace[l.space] = bySpace[l.space] || { amt: 0 }; s.amt += l.amt;
  }
  if (!noCost()) { const cov = E.costOv || {}, mov = E.mgOv || {};   // (v90) 공정의 원가를 실장이 고쳐 적은 값(E.costOv) · (v88) 마진율로 고쳐 둔 값(E.mgOv — 전에 쓰던 견적에 남아 있으면 그대로 읽는다)
    for (const pk in byProc) { const b = byProc[pk]; b.cost0 = b.cost; let c = null; if (mov[pk] !== undefined && mov[pk] !== "" && isFinite(+mov[pk])) c = b.amt * (1 - +mov[pk]); else if (cov[pk] !== undefined && cov[pk] !== "" && +cov[pk] >= 0) c = +cov[pk]; if (c !== null) { cost += c - b.cost; b.cost = c; b.ov = true } } }
  const biz = Math.round(sum * (+E.biz || 0) / 100), unit = +D.settings.roundUnit || 10000;
  const pre = sum + biz, net = Math.floor(pre / unit) * unit, cut = net - pre, vat = Math.round(net * (D.settings.vat ?? 0.1));
  const main = lines.filter(l => !l.opt);   // lines = 합계에 들어가는 줄 · opt = 옵션 줄 · all = 둘 다
  return { S, lines: main, opt: lines.filter(l => l.opt), all: lines, optSum, errors, byProc, bySpace, sum, biz, cut, net, vat, total: net + vat, cost, margin: net ? (net - cost) / net : 0, FT: r1(FT), tbd: main.filter(l => l.tbd), fzDiff };
}
/* 저장·내보내기 때 지금 단가를 견적에 고정해 둔다 */
function snapshotPrices() {
  R = compute(); E.fp = {};
  for (const l of R.lines) { const manual = l.manualPrice !== undefined && l.manualPrice !== ""; if (l.price > 0 && !manual && l.it && !l.it.costTable && !l.it.costVar && !l.it.tier) E.fp[fpKey(l)] = l.price }
  E.fpVer = E.fpVer && R.fzDiff ? E.fpVer : BASE.version;
}
function optionAmount(sp, cat, oi) {
  // 이 옵션을 골랐을 때 이 공간 카테고리 금액 (옵션 카드에 표시)
  const keep = E.sel[sp.id] ? E.sel[sp.id][cat.key] : undefined;
  E.sel[sp.id] = E.sel[sp.id] || {}; E.sel[sp.id][cat.key] = oi;
  const R = compute(); const amt = R.lines.filter(l => l.space === sp.id && l.key.split("|")[1] === cat.key).reduce((a, l) => a + l.amt, 0);
  if (keep === undefined) delete E.sel[sp.id][cat.key]; else E.sel[sp.id][cat.key] = keep;
  return amt;
}
function weeks(R) {
  const demo = selLabel(R.S.list.find(s => s.id === "common"), "demo");
  const fullBath = R.lines.some(l => l.name === "욕실 철거 (1칸)");
  const base = demo === "전체 철거" ? 6 : fullBath ? 5 : demo === "부분 철거" ? 4 : 3;
  return (+E.py || 0) >= 40 ? base + 1 : base;
}

/* ---------- 화면: 공통 ---------- */
let R = compute(), isAdmin = false;
const HIST = [], REDO = []; let HIST_LAST = null, HIST_T = 0, UNDOING = false, TYPE_T = 0;
document.addEventListener("input", () => { TYPE_T = Date.now() }, true);
const snapE = () => { const { planImg, step, ...rest } = E; return { j: JSON.stringify(rest), img: planImg } };
function save() {
  if (store.set("sido3_draft_" + MODE, E)) { if (save.full) { save.full = false; setTimeout(() => { try { estBarUp() } catch (e) { } }, 0) } }   // 다시 저장되기 시작하면 경고 표시를 지운다
  else if (!save.full) { save.full = true; setTimeout(() => { try { toast("이 기기의 저장 공간이 꽉 차서 지금 쓰는 내용이 자동으로 남지 않습니다. ‘저장된 견적’에서 끝난 견적을 ‘견적 파일 내보내기’로 보관한 뒤 지워 주세요."); estBarUp() } catch (e) { } }, 0) }   // 전에는 소리 없이 실패했다
  helpTrack();   // 챗봇이 점검 중이면 고친 것을 이어서 알려 준다
  const s = snapE();
  if (!UNDOING && HIST_LAST && (HIST_LAST.j !== s.j || HIST_LAST.img !== s.img)) {
    if (!(Date.now() - TYPE_T < 900 && Date.now() - HIST_T < 900) || !HIST.length) { HIST.push(HIST_LAST); if (HIST.length > 80) HIST.shift() }   // 글자·숫자를 이어서 치는 동안만 한 번으로 묶는다
    HIST_T = Date.now(); REDO.length = 0;
  }
  HIST_LAST = s; undoBtn();
  clearTimeout(save.p3); save.p3 = setTimeout(() => { try { if (BASE_3D || PLAN_3D) p3dSync() } catch (e) { } }, 300);   // (v63) 입체 그림을 띄워 둔 채 도면을 고치면 따라 바뀐다
}
function undoBtn() {
  let b = document.getElementById("undoBtn");
  if (!b) { document.body.insertAdjacentHTML("beforeend", '<div id="undoBtn" style="position:fixed;left:12px;bottom:12px;z-index:60;display:flex;gap:6px"><button type="button" class="btn sm" data-undo title="Ctrl+Z">↶ 되돌리기</button><button type="button" class="btn sm" data-redo title="Ctrl+Y">↷ 다시</button></div>'); b = document.getElementById("undoBtn") }
  b.querySelector("[data-undo]").disabled = !HIST.length; b.querySelector("[data-redo]").disabled = !REDO.length; b.hidden = !HIST.length && !REDO.length;
}
function undo(redo) {
  const from = redo ? REDO : HIST, to = redo ? HIST : REDO;
  if (!from.length) { toast(redo ? "다시 실행할 것이 없습니다." : "되돌릴 것이 없습니다."); return }
  const s = from.pop(), st = E.step; to.push(HIST_LAST || snapE());
  E = normEst(JSON.parse(s.j)); if (s.img) E.planImg = s.img; E.step = st; HIST_LAST = s;
  UNDOING = true; try { refresh(true); if (!$("#view-doc").hidden) renderDoc() } finally { UNDOING = false }
  HIST_LAST = snapE(); undoBtn(); toast(redo ? "다시 실행했습니다." : `되돌렸습니다. (남은 되돌리기 ${HIST.length}번 · 다시 하려면 Ctrl+Y)`);
}
document.addEventListener("keydown", ev0 => {
  if (!(ev0.ctrlKey || ev0.metaKey) || ev0.altKey) return; const k = ev0.key.toLowerCase(); if (k !== "z" && k !== "y") return;
  const el = document.activeElement, typing = el && (el.tagName === "TEXTAREA" || el.isContentEditable || (el.tagName === "INPUT" && !["checkbox", "radio", "button", "file"].includes(el.type)));
  if (typing) return;                                // 글자를 치는 칸에서는 그 칸의 되돌리기를 그대로 쓴다
  ev0.preventDefault(); undo(k === "y" || ev0.shiftKey);
});
document.addEventListener("click", ev0 => { if (ev0.target.closest("[data-undo]")) undo(false); else if (ev0.target.closest("[data-redo]")) undo(true) });
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, Math.min(9000, Math.max(3200, String(m || "").length * 90))) }
function show(v) {
  document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.view === v));
  document.querySelectorAll(".view").forEach(s => s.hidden = s.id !== "view-" + v);
  const slot = document.querySelector(`#view-${v} .sumslot`); if (slot) slot.appendChild($("#summary"));
  if (v === "est") { renderSpaces(); renderSpace() } if (v === "check") renderChecklist();
  if (v === "doc") renderDoc(); if (v === "saved") renderSaved();
  if (v === "prices") renderPrices(); if (v === "settings") renderSettings(); if (v === "rules") renderRules(); if (v === "analysis") renderAnalysis();
}
function refresh(full) {
  if (full) applyPackages();
  R = compute(); if (full) renderInfo();
  if (!$("#view-est").hidden) { renderSpaces(); renderSpace() }
  if (!$("#view-check").hidden) renderChecklist();
  renderSummary(); save();
}

/* ---------- 공사 체크리스트 화면 ---------- */
const CAT2PK = {};
for (const p of D.packages || []) for (const s of [...(p.sets || []), ...(p.off || []), ...((p.grades || []).flatMap(g => g.sets || []))]) for (const t of s.types) CAT2PK[t + "|" + s.cat] = p.key;
Object.assign(CAT2PK, { "욕실|set": "bath", "욕실|ftile": "bath", "욕실|mirror": "bath", "욕실|fan": "bath","거실|light": "downlight", "방|light": "downlight" });
function pkAmounts() {
  const out = {}, type = {}; for (const s of R.S.list) type[s.id] = s.type;
  for (const l of R.lines) {
    const src = l.key.split("|")[1] || ""; let k = null;
    if (src.startsWith("pkg:")) k = src.slice(4); else if (src !== "auto") k = CAT2PK[type[l.space] + "|" + src];
    if (k) out[k] = (out[k] || 0) + l.amt;
  }
  return out;
}
/* ---------- 단계별 입력 (공정 순서) ---------- */
const USED = new Set();
const USEDB = new Set(), nmBase = n => String(n || "").replace(/\s*\(.*?\)/g, "").replace(/[\s·\/]/g, "");   // 공사 줄에 이미 쓰는 품목의 이름 뿌리 (추가 품목 목록에서 같은 것을 감춘다)
function dataFix2() {                                 // 관리자·실장 데이터 파일을 다시 만들지 않고도 두 화면에 똑같이 적용되는 구조 손질
  const SL = D.stepLines, C = D.cats; if (!SL || !C) return;
  for (const k in D.alias || {}) if (/엑셀 단가/.test(D.alias[k])) D.alias[k] = D.alias[k].replace(/\s*\(엑셀 단가\)/, "");
  if (SL.s10 && SL.s12 && C.s10 && C.s12) { const mv = SL.s10.filter(l => l.id === "elastic" || l.id === "balPaint");
    if (mv.length) { SL.s10 = SL.s10.filter(l => !mv.includes(l)); SL.s12 = [...mv.sort((a, b) => (a.id === "elastic" ? -1 : 1)), ...SL.s12];
      for (const c of C.s10) { c.lines = c.lines.filter(id => id !== "elastic" && id !== "balPaint"); if (c.key === "paint") c.label = "페인트 (몰딩·문틀·벽)" }
      if (!C.s12.some(c => c.key === "bal")) C.s12.unshift({ key: "bal", label: "발코니 탄성코트·페인트", desc: "발코니 벽·천장", lines: mv.map(l => l.id) }) } }
  { const fl = id => Object.values(SL).flat().find(l => l.id === id), pp = fl("paper");   // 벽지를 ‘도배 평수 × 평당 금액’으로 넣는 방식: 평당 금액은 벽지 값이다. 부자재·인건비·식대는 따로 든다
    if (pp && pp.items.some(n => /평당/.test(n))) { pp.label = "벽지"; pp.lump = true;
      pp.note = "도배 평수 = 평형 × 2.5 · 벽지 평당 금액 (부자재·인건비·식대는 아래 줄에 따로 들어갑니다)";
      pp.bom = { mode: "detail", label: "실장 참고", items: [{ name: "벽지 (1롤 5평)", qty: "Math.ceil(SELF/5)", unit: "롤", hide: true, note: "발주할 롤 수 · 실장만 봅니다" }] };
      for (const [id, note] of [["paperSub", "초배지, 도배풀, 실리콘, 커버링테이프 · 도배 평수 기준"], ["paperLabor", "실크: 도배 평수 ÷ 15 · 합지: ÷ 20 (반올림) · 고급 실크는 1명 추가"], ["paperMeal", "도배 작업자"]]) { const x = fl(id); if (x) { if (!x.tags) x.tags = "FBP"; if (/평당 도배 금액에 들어/.test(x.note || "")) x.note = note } }
      D.alias = D.alias || {}; for (const [a, b] of [["실크 도배 (평당)", "실크 벽지 (평당)"], ["고급 실크 도배 (평당)", "고급 실크 벽지 (평당)"], ["합지 도배 (평당)", "합지 벽지 (평당)"]]) if (pp.items.includes(a)) D.alias[a] = b } }
  for (const l of Object.values(SL).flat()) { const m = String(l.qty || "").match(/\*\s*1\.(\d{1,2})(?!\d)/); if (m && !/로스/.test(l.note || "")) { const pc = Math.round(+("0." + m[1]) * 100); if (pc > 0 && pc <= 30) l.note = [l.note, "로스 " + pc + "% 포함"].filter(Boolean).join(" · ") } }   // 수량식에 들어 있는 로스율을 설명에 적는다 (실장 화면에만 보인다)
  { const fl = id => Object.values(SL).flat().find(l => l.id === id);
    // (가) 부자재·세트 묶음: 포함 내역은 ‘쓰는 양’이고, 수량을 고치면 그 비율만큼 품목마다 따로 올림해서 변한다. 고객 견적서에는 1식 금액과 포함 내역(수량)만 나간다
    for (const id of ["tileSub", "floorSub", "elecSub", "plumbMat", "paperSub", "bathAcc", "light", "switch"]) { const x = fl(id); if (x && x.bom && x.bom.mode === "detail") { x.bom.scale = true; if (id !== "bathAcc") x.lump = true } }
    { const x = fl("tileSub"); if (x) { x.note = "타일 붙이는 면적(㎡) × 부자재 단가 (고객 견적서에는 1식 금액과 포함 내역만 나갑니다)"; for (const b of (x.bom || {}).items || []) if (/코너비드|실리콘/.test(b.name)) b.fix = true } }
    { const x = fl("paperSub"), U = [["초배지", "Math.max(1,Math.ceil(SELF/90))", "롤"], ["삼중지", "Math.max(1,Math.ceil(SELF/60))", "롤"], ["네바리", "Math.max(1,Math.ceil(SELF/60))", "롤"], ["도배풀", "Math.max(1,Math.ceil(SELF/25))", "봉"], ["마법사", "Math.max(1,Math.ceil(SELF/30))", "롤"], ["수성실리콘", "Math.max(1,Math.ceil(SELF/40))", "EA"]];   // 도배 부자재: [이름에 든 말, 도배 평수(SELF)에 따른 수량식, 단위]. 조사 기준(2026-11): 도배풀 14kg 1봉 = 실크 약 25평 · 운용지(32cm×320m) 30평대 1롤. 나머지는 어림
      if (x && x.bom && x.bom.mode === "detail") for (const b of x.bom.items) { const u = U.find(z => b.name.includes(z[0])); if (u && /^1$/.test(String(b.qty).trim())) { b.qty = u[1]; b.unit = u[2] } } }   // ‘1식’으로만 적혀 있던 도배 부자재를 도배 평수에 따른 수량으로
    { const ld = fl("ladder"), la = fl("ladderAdd");   // (v52) 사다리차: 운임표 그대로 — 기본시간은 1시간. 이름을 표와 같게 하고, 추가 시간은 ‘시간’ 단위로
      if (ld) { D.alias = D.alias || {}; for (const [k, v] of [["사다리차 기본시간", "사다리차 기본 1시간"], ["사다리차 반대 4시간", "사다리차 반대 4시간"], ["사다리차 일대 8시간", "사다리차 일대 8시간"], ["사다리차 추가 1시간", "사다리차 추가 시간"]]) if (D.catalog.some(i => i.name === k)) D.alias[k] = v;   // 운임표에 적힌 말 그대로
        ld.note = "현장 층수에 맞는 금액이 자동으로 들어갑니다"; if (la) { la.note = "기본·반대·일대 시간을 넘길 때 1시간 단위로 넣습니다"; const it = D.catalog.find(i => i.name === la.items[0]); if (it && it.unit === "회") it.unit = "시간" }
        const c = ((C.s1 || []).find(c => c.lines.includes("ladder"))); if (c) { c.lad = true; c.desc = "층수 · 시간에 맞춰 자동 계산" } } }
    { const pp = fl("paper"), ps = fl("paperSub");   // (v51) 도배: 벽지와 부자재는 늘 같은 ‘도배 평수’로 들어간다. 고객 견적서에도 1식이 아니라 평수 × 평당 금액으로 적는다 (사용자 2026-11-17: “85평 형식으로 들어가야 해 · 실크 벽지도 부자재 평수랑 똑같이”)
      if (pp && pp.items.some(n => /평당/.test(n))) { pp.pyq = true; delete pp.lump; pp.note = "도배 평수 × 벽지 평당 금액 · 평수는 묶음 맨 위 ‘도배 평수’ 칸에 넣습니다";
        if (ps && ps.items.some(n => /평당/.test(n))) { ps.pyq = true; delete ps.lump; ps.note = "초배지, 도배풀, 실리콘, 커버링테이프 · 벽지와 같은 도배 평수 기준" } } }
    { const n = fl("floorLabN"), lb = fl("floorLabor"), ml = fl("floorMeal"), f0 = fl("floor");   // (v51) 바닥: 일반 장판은 평당 시공비를 쓰지 않는다 → 인원(35평까지 혼자). 4.5T·5T만 평당 시공비. 강마루 평당 금액은 시공비 포함 (사용자 2026-11-17)
      if (n) { n.qty = "0"; n.tags = ""; n.gone = true; n.hideZero = true }
      if (lb && /^ALT\('floor'\)<=6\?0:/.test(String(lb.qty))) { lb.qty = "ALT('floor')<4?(py<=35?1:2):ALT('floor')<=6?0:Math.max(1,Math.ceil(FT/90))+buf";
        lb.note = "장판은 35평까지 1명 · 35평이 넘으면 2명 · 4.5T와 5T는 평당 시공비 줄에 들어갑니다 · 강마루는 시공비가 바닥재 금액에 들어갑니다 · 그 밖은 90㎡에 1명 + 여유 1명" }
      if (ml && /^Math\.max\(1,Math\.ceil\(FT\/90\)\)\+1$/.test(String(ml.qty))) { ml.qty = "ALT('floor')<6?(py<=35?1:2):ALT('floor')==6?0:Math.max(1,Math.ceil(FT/90))+1"; ml.hideZero = true; ml.note = "바닥 작업자 · 장판은 35평까지 1명 · 강마루는 시공비에 들어갑니다" }
      D.alias = D.alias || {}; for (const nm of (f0 ? f0.items : [])) if (/^강마루/.test(nm)) { const a = D.alias[nm] || nm; if (!/시공비 포함/.test(a)) D.alias[nm] = /\)\s*$/.test(a) ? a.replace(/\)\s*$/, " · 시공비 포함)") : a + " (시공비 포함)" } }
    { const x = fl("setLabor"); if (x && !x.bom) x.bom = { mode: "detail", label: "포함 작업", scale: true, items: [{ name: "양변기 설치", qty: "SELF", unit: "대" }, { name: "세면대·세면수전 설치", qty: "SELF", unit: "조" }, { name: "샤워수전·슬라이드바 설치", qty: "SELF", unit: "조" }, { name: "거울장·악세서리 설치", qty: "SELF", unit: "칸" }, { name: "실리콘 마감", qty: "SELF", unit: "칸" }] } }
    { const x = fl("demoFloor"); if (x && /FT\/3\.3058/.test(String(x.qty))) { x.qty = "py"; x.note = "아파트 평형 기준 · 강마루 철거와 샌딩을 합친 금액" } }   /* 설명의 ‘아파트 평형 기준’은 고객 견적서에 나가지 않는다(custText 가 ‘평형’·‘기준’을 걸러 낸다) */   // (v66) 바닥 철거·샌딩은 아파트 평수 그대로 받는다 — 사용자(2026-11-19, “실제 바닥 넓이 × 35,000 과 아파트 평수 × 35,000 중 무엇으로?”에): “아파트 평수로 받기”. 전에는 실제 바닥 넓이(33평 집 약 23평)였다
    for (const id of DEF_ON2) { const x = fl(id); if (x && !String(x.tags || "").includes("F")) x.tags = String(x.tags || "") + "F" }   // (v67) 전체 리모델링(F)에 문·문틀 필름 · 부자재 · 작업비 · 식대를 처음부터 켠다
    // (나) 타일: 면적 → 박스 수, 로스 20%. 300각은 1박스 0.99㎡(11장), 그 밖은 1.44㎡. 발코니·주방 벽은 넣은 치수를 따른다
    for (const [id, a, box, nt] of [["wallTile", "bathWallM2", "1.44", "벽 면적"], ["floorTile", "bathFloorM2", "(ALT('floorTile')==1?0.99:1.44)", "바닥 면적"], ["entTile", "entryA", "1.44", "현관 바닥 면적"], ["balTile", "balA", "0.99", "발코니 바닥 면적 (치수를 안 넣으면 1칸 6㎡)"], ["kitTile", "kitA", "1.44", "주방 벽 면적 (치수를 안 넣으면 4㎡)"]]) {
      const x = fl(id); if (!x || !/1\.08\/1\.44/.test(String(x.qty))) continue; x.qty = `Math.ceil(${a}*1.2/${box})`; x.note = nt + " × 로스 20% ÷ 1박스 면적 → 올림"; }
    { const w = fl("wallTile"), f = fl("floorTile"), b = fl("balTile");   // 욕실·발코니는 곳마다 따로 올림해서 더한다 (욕실 1칸 2100×1600×2200, 600각이면 벽 13 + 바닥 3 = 16박스)
      if (w && /bathWallM2\*1\.2\/1\.44/.test(String(w.qty))) { w.qty = "tb.w"; w.note = "욕실마다 벽 면적 × 로스 20% ÷ 1박스 면적 → 올림해서 더한 값" }
      if (f && /bathFloorM2\*1\.2\//.test(String(f.qty))) { f.qty = "(ALT('floorTile')==1?tb.f3:tb.f6)"; f.note = "욕실마다 바닥 면적 × 로스 20% ÷ 1박스 면적 → 올림해서 더한 값" }
      if (b && /balA\*1\.2\/0\.99/.test(String(b.qty))) { b.qty = "tb.b"; b.note = "발코니마다 바닥 면적 × 로스 20% ÷ 1박스 면적 → 올림해서 더한 값" } }
    for (const id of ["tileSub", "tileLabor"]) { const x = fl(id), f = t => String(t).split("ON('balTile')*balconies*6").join("ON('balTile')*balA").split("ON('kitTile')*4").join("ON('kitTile')*kitA"); if (!x) continue; x.qty = f(x.qty); if (x.bom) for (const b of x.bom.items) b.qty = f(b.qty) }
    { const x = fl("tileSub"); if (x && x.bom && x.bom.mode === "detail") {   // 타일 부자재 쓰는 양. 조사 기준(2026-11, 제조사 자료): 압착시멘트 20kg 1포 = 600각 바닥 2㎡·300각 4㎡·600각 벽 3㎡ / 타일본드 20kg 1통 = 6㎡(도기질 벽·주방 벽) / 줄눈 1포 = 600각 10㎡·300각 6㎡ / 욕실 바닥 구배 몰탈 ㎡당 1.3포
        const W = "ON('wallTile')*bathWallM2", F = "ON('floorTile')*bathFloorM2", Ee = "ON('entTile')*entryA", B = "(ON('balTile')*balA1+ON('balTile2')*balA2)", K = "ON('kitTile')*kitA", X = "(L('entWall')+L('balWall')+L('balWall2'))", big = "(ALT('wallTile')!=1)";   // (v65) 켜 둔 타일만 센다 (전에는 욕실 벽·바닥 넓이가 늘 들어가서 발코니만 해도 욕실 몫이 붙었다)
        const T = [[/압착시멘트/, `Math.ceil(${F}/(ALT('floorTile')==1?4:2)+(${Ee})/2+(${B})/4+(${big}?${W}/3:0))`], [/몰탈|레미탈/, `Math.ceil(${F}*1.3+(${Ee}+${B})*0.5)`], [/타일본드/, `Math.ceil(((${big}?0:${W})+${K}+${X})/6)`], [/메지|줄눈/, `Math.ceil((${W}+${F}+${Ee}+${K}+${X})/10+(${B})/6)`]];
        for (const b of x.bom.items) { const t = T.find(z => z[0].test(b.name)); if (t) b.qty = t[1] } } }
    /* (v65) 타일을 곳별로 — 사용자(2026-11-19): “앞뒤 베란다 바닥 타일 별도, 벽체 타일 별도 작업 · 각 타일 공정별로 작업할 수 있게”.
       ① 발코니 바닥 타일을 앞(발코니1)·뒤(그 밖의 발코니) 두 줄로, 발코니 벽 타일도 앞·뒤 두 줄로 나눈다. 뒷 발코니 바닥 줄은 따로 손대기 전에는 앞 줄과 똑같이 켜지고 꺼진다(same) → 옛 견적·기본 견적의 금액은 그대로다.
       ② 타일 부자재·작업비는 켜 둔 타일 넓이만 센다(욕실 벽·바닥도 그 줄이 켜져 있을 때만) → 발코니만, 현관만 해도 그 몫만 나온다.
       ③ 묶음을 셋으로: 욕실 타일 / 현관·주방·발코니 타일 / 타일 부자재·작업비(켜 둔 타일 전체 몫). */
    if (SL.s7 && fl("balTile") && !fl("balTile2")) { const bt = fl("balTile"), bw = fl("balWall"), at = SL.s7.indexOf(bt);
      bt.label = "앞 발코니 바닥 타일"; bt.qty = "tb.b1"; bt.locIds = ["bal1"]; bt.note = "앞 발코니(발코니1) 바닥 면적 × 로스 20% ÷ 1박스 면적 → 올림";
      SL.s7.splice(at + 1, 0, { ...bt, id: "balTile2", label: "뒷 발코니 바닥 타일", qty: "tb.b2", same: "balTile", hideZero: true, locNot: ["bal1"], locIds: undefined, note: "뒷 발코니(발코니2·3)마다 바닥 면적 × 로스 20% ÷ 1박스 면적 → 올림해서 더한 값" });
      if (bw) { bw.label = "앞 발코니 벽 타일"; bw.locIds = ["bal1"]; SL.s7.splice(SL.s7.indexOf(bw) + 1, 0, { ...bw, id: "balWall2", label: "뒷 발코니 벽 타일", locNot: ["bal1"], locIds: undefined }) }
      const tf = t => String(t).split("ON('balTile')*balA").join("(ON('balTile')*balA1+ON('balTile2')*balA2)").split("L('balWall')").join("(L('balWall')+L('balWall2'))").replace(/(^|[^*\w'])bathWallM2/g, "$1ON('wallTile')*bathWallM2").replace(/(^|[^*\w'])bathFloorM2/g, "$1ON('floorTile')*bathFloorM2");
      for (const id of ["tileSub", "tileLabor"]) { const x = fl(id); if (!x) continue; x.qty = tf(x.qty); if (x.bom) for (const b of x.bom.items) if (!/balTile2/.test(String(b.qty))) b.qty = tf(b.qty) }
      { const x = fl("tileSub"); if (x) x.note = "켜 둔 타일(욕실·현관·주방·발코니)을 붙이는 면적(㎡) × 부자재 단가" } { const x = fl("tileLabor"); if (x) x.note = "켜 둔 타일(욕실·현관·주방·발코니) 면적 합계 기준 — 한 곳만 해도 그 곳만큼만 계산됩니다" }
      if (C.s7) { const bc = C.s7.find(c => c.key === "btile"), oc = C.s7.find(c => c.key === "othertile"), has = id => SL.s7.some(l => l.id === id);
        if (bc) { bc.lines = bc.lines.filter(id => id !== "tileSub" && id !== "tileLabor"); bc.desc = bc.desc || "욕실 벽·바닥 타일 — 따로 켜고 끕니다" }
        if (oc) { oc.lines = ["entTile", "entWall", "kitTile", "balTile", "balTile2", "balWall", "balWall2"].filter(has); oc.desc = "곳마다 따로 켜고 끕니다 — 앞·뒷 발코니 바닥과 벽도 따로" }
        if (oc && bc && C.s7.indexOf(oc) !== C.s7.indexOf(bc) + 1) { C.s7.splice(C.s7.indexOf(oc), 1); C.s7.splice(C.s7.indexOf(bc) + 1, 0, oc) }   // 타일 묶음 셋을 맨 위에 나란히
        if (!C.s7.some(c => c.key === "tilework")) C.s7.splice(Math.max(C.s7.indexOf(oc), C.s7.indexOf(bc)) + 1, 0, { key: "tilework", label: "타일 부자재·작업비", desc: "위에서 켜 둔 타일(욕실·현관·주방·발코니) 넓이만큼 계산됩니다 — 한 곳만 해도 그 몫만", lines: ["tileSub", "tileLabor"].filter(has) }) } }
    /* (v71) 욕실을 칸마다 다르게 (E.bathMode · 화면은 bathModeCard). 철거·방수 = ‘전체 교체’ 칸만 / 타일·천장·배수구·욕실 다운라이트 = 전체 교체 + 덧방 칸 / 도기·수전·악세서리·설치비 = ‘안 함’이 아닌 칸.
       모든 칸이 ‘전체 교체’(기본)면 세 변수가 모두 baths 와 같아 전과 금액이 같다. 칸 수가 0 이 된 줄은 견적에 올리지 않는다(hideZero).
       ‘욕실 덧방 시공 (1칸)’ 줄은 감춘다 — 사용자: “그건 뭐야? … 금액도 들어가 있는데 전혀 필요없는 부분같은데”. 덧방은 칸별 공사 범위로 고른다(전에 켜 둔 견적에서는 그대로 보이고 계산된다). */
    { const sw = (id, from, to) => { const x = fl(id); if (x && String(x.qty).replace(/\s+/g, "") === from) { x.qty = to; x.hideZero = true } };
      sw("demoBath", "baths", "bathsFull"); sw("demoBathTile", "baths", "bathsFull"); sw("waterproof", "baths", "bathsFull"); sw("trap", "baths", "bathsTile"); sw("bathDown", "baths*2", "bathsTile*2"); sw("smc", "baths", "bathsTile"); sw("grout", "baths", "bathsTile"); sw("bathSilicone", "baths*2", "bathsAny*2");
      for (const id of ["basin", "basinTap", "shower", "slidebar", "toilet", "mirror", "towel", "paperHolder", "shelf2", "robe", "cleaner", "vent", "zendaiTop", "setLabor", "bidet", "lineDrain", "bathAcc"]) sw(id, "baths", "bathsAny");
      { const x = fl("bathAcc"); if (x && x.bom) for (const b of x.bom.items) if (String(b.qty).trim() === "baths") b.qty = "bathsAny" }
      { const x = fl("tileSub"); if (x && x.bom) for (const b of x.bom.items) b.qty = String(b.qty).replace(/(^|[^\w'])baths(?![\w])/g, "$1bathsTile") }
      { const x = fl("overlay"); if (x) { x.gone = true; x.dead = true } }   // (v73) 사용자: “욕실 덧방 시공이라고 되어 있는 건 분명 금액 넣지 말라고 했는데, 따로 인건비는 실장들이 작업할 거라고” → 전에 켜 둔 견적에서도 보이지 않고 금액도 들어가지 않는다(dead)
      { const x = fl("floor"); if (x && /ALT\('floor'\)<7\?py:/.test(String(x.qty))) x.pyf = "s8" } }   // 바닥재 줄의 수량 칸 = 평수 칸 (장판·강마루): 어느 칸에서 고쳐도 작업 인원·식대·평당 시공비가 따라온다
    /* (v76) 타일은 한 묶음에서 — 사용자(2026-11-20): “타일을 3번 넣는 거야? 그냥 1개만 놔두고 욕실타일 추가를 할 수 있게”.
       ‘욕실 타일’과 ‘현관·주방·발코니 타일’ 묶음을 하나로 합친다. 치수는 타일 줄마다 그 줄 아래에서 넣고(tileDimRow), 꺼져 있는 곳은 묶음 맨 위 ‘＋ 타일 붙일 곳 추가’로 켠다(tileAddBar). */
    if (C.s7) { const bc = C.s7.find(c => c.key === "btile"), oc = C.s7.find(c => c.key === "othertile");
      if (bc && oc) { const tail = bc.lines.filter(id => id === "grout" || id === "overlay"); bc.lines = [...bc.lines.filter(id => !tail.includes(id)), ...oc.lines, ...tail]; C.s7.splice(C.s7.indexOf(oc), 1) }
      if (bc) { bc.label = "타일 (욕실 · 현관 · 주방 · 발코니)"; bc.desc = "붙일 곳마다 한 줄 — 펼치면 그 줄에서 박스 수 · 종류 · 치수(mm)를 넣고, ‘＋ 타일 붙일 곳 추가’로 현관·주방·발코니를 넣습니다" } }
    /* (v78) 욕실 타일은 욕실마다 한 줄 — 사용자(2026-11-20): “거실 타일 안방 타일도 적어 두긴 했는데 지금 그냥 선택만 하는 거고, 안방 타일일 때 금액과 함께 거실 타일도 같이 할 수 있는데 같이 금액이 들어가지는 못하는 형태” ·
       “한 번 들어가기로 했는데 또 들어가는 건 잘못됐지만, 한 번 더 들어가는 이유가 타당할 땐 실장들이 사용하기 편한 형식”. 욕실 벽·바닥 타일 줄을 욕실1 · 욕실2 · 욕실3(넷째부터는 여기에 더함)로 나눈다.
       나눈 줄은 따로 손대기 전에는 첫 줄과 똑같이 켜지고 같은 종류다(same) → 새 견적·옛 견적의 합계는 그대로. 부자재·작업비 식도 줄마다 켜 둔 넓이를 센다. */
    if (SL.s7 && fl("wallTile") && fl("floorTile") && !fl("wallTile2")) { const NM = ["", "욕실1(공용)", "욕실2(안방)", "욕실3"], sfx = n => n > 1 ? String(n) : "", wt = fl("wallTile"), ft = fl("floorTile");
      const mk = (b, kind, q, n) => ({ ...b, id: (b === wt ? "wallTile" : "floorTile") + sfx(n), label: NM[n] + " " + kind + " 타일", qty: q(n), locIds: ["bath" + n], locDoc: true, hideZero: true, note: "그 욕실의 " + kind + " 면적 × 로스 20% ÷ 1박스 면적 → 올림", ...(n > 1 ? { same: b.id } : {}) });
      const qw = n => "tb.w" + n, qf = n => `(ALT('floorTile${sfx(n)}')==1?tb.f3${n}:tb.f6${n})`;
      Object.assign(wt, mk(wt, "벽", qw, 1)); Object.assign(ft, mk(ft, "바닥", qf, 1));
      SL.s7.splice(SL.s7.indexOf(ft) + 1, 0, mk(wt, "벽", qw, 2), mk(ft, "바닥", qf, 2), mk(wt, "벽", qw, 3), mk(ft, "바닥", qf, 3));
      const bc = (C.s7 || []).find(c => c.lines.includes("wallTile")); if (bc) { const six = ["wallTile", "floorTile", "wallTile2", "floorTile2", "wallTile3", "floorTile3"]; bc.lines = [...six, ...bc.lines.filter(id => !six.includes(id))] }
      const ns = [["", 1], ["2", 2], ["3", 3]], R1 = x => `(Math.round((${x})*10)/10)`, sum = f => ns.map(([s, n]) => f(s, n)).join("+");
      const Wn = R1(sum((s, n) => `ON('wallTile${s}')*bwA${n}`)), Fn = R1(sum((s, n) => `ON('floorTile${s}')*bfA${n}`));
      const Wbig = R1(sum((s, n) => `(ALT('wallTile${s}')!=1?ON('wallTile${s}')*bwA${n}:0)`)), Wsm = R1(sum((s, n) => `(ALT('wallTile${s}')==1?ON('wallTile${s}')*bwA${n}:0)`));
      const F3 = R1(sum((s, n) => `(ALT('floorTile${s}')==1?ON('floorTile${s}')*bfA${n}:0)`)), F6 = R1(sum((s, n) => `(ALT('floorTile${s}')!=1?ON('floorTile${s}')*bfA${n}:0)`));
      const Ee = "ON('entTile')*entryA", B = "(ON('balTile')*balA1+ON('balTile2')*balA2)", K = "ON('kitTile')*kitA", X = "(L('entWall')+L('balWall')+L('balWall2'))";
      const T = [[/압착시멘트/, `Math.ceil(${F3}/4+${F6}/2+(${Ee})/2+(${B})/4+${Wbig}/3)`], [/몰탈|레미탈/, `Math.ceil(${Fn}*1.3+(${Ee}+${B})*0.5)`], [/타일본드/, `Math.ceil((${Wsm}+${K}+${X})/6)`], [/메지|줄눈/, `Math.ceil((${Wn}+${Fn}+${Ee}+${K}+${X})/10+(${B})/6)`]];
      const tf = t => String(t).split("ON('wallTile')*bathWallM2").join(Wn).split("ON('floorTile')*bathFloorM2").join(Fn)
        .split("(ON('wallTile')*(ALT('wallTile')!=1?1:0))").join("(ON('wallTile')*(ALT('wallTile')!=1?1:0)+(L('wallTile2')>0?1:0)*(ALT('wallTile2')!=1?1:0)+(L('wallTile3')>0?1:0)*(ALT('wallTile3')!=1?1:0))")
        .split("(ON('floorTile')*(ALT('floorTile')==0?1:0))").join("(ON('floorTile')*(ALT('floorTile')==0?1:0)+(L('floorTile2')>0?1:0)*(ALT('floorTile2')==0?1:0)+(L('floorTile3')>0?1:0)*(ALT('floorTile3')==0?1:0))");
      for (const id of ["tileSub", "tileLabor"]) { const x = fl(id); if (!x) continue; x.qty = tf(x.qty); if (x.bom) for (const b of x.bom.items) { const t = x.bom.mode === "detail" && T.find(z => z[0].test(b.name)); b.qty = t ? t[1] : tf(b.qty) } } }
    { const wc = (C.s2 || []).find(c => c.key === "window"); if (wc) wc.desc = "펼치면 맨 위 ‘창호 목록’에 창마다 치수·금액을 넣습니다 · 철거·실리콘·작업비는 그 아래 줄" }   // (v77) 창호 목록은 이 묶음 안에
    // (다) 조명: 기본 조명등 세트 / 매입등 세트 / 라인조명 세트 / 공통(직부등·센서등·욕실등)
    if (C.s5 && SL.s5) { const lc = C.s5.find(c => c.key === "light"); if (lc && !C.s5.some(c => c.key === "lbase")) { const pick = ids => ids.filter(id => SL.s5.some(l => l.id === id));
        const nc = [{ key: "lbase", label: "기본 조명등 세트", desc: "거실등·방등·주방등 — 종류와 개수를 따로 고릅니다", lines: pick(["lightLiving", "lightRoom", "lightKitchen", "pendant", "fan", "light"]) },
          { key: "ldown", label: "매입등 세트", desc: "천장 매입등 — 종류를 고르고 곳마다 개수를 넣습니다", lines: pick(["down"]) },
          { key: "lline", label: "라인조명 세트", desc: "라인조명·간접조명·마그네틱 — 쓰는 것만 고릅니다", lines: pick(["line", "t5", "magRail", "magLine", "magSpot", "magPower", "dim"]) },
          { key: "lcommon", label: "공통 조명 (직부등·센서등·욕실등)", desc: "어느 세트를 고르든 따로 들어가는 등", lines: pick(["sensor", "balLight", "bathDown", "direct"]) }].filter(c => c.lines.length);
        const rest = lc.lines.filter(id => !nc.some(c => c.lines.includes(id))); if (rest.length && nc.length) nc[0].lines.push(...rest);
        if (nc.length) C.s5.splice(C.s5.indexOf(lc), 1, ...nc) }
      { const x = fl("down"); if (x && /작은 원형 조명/.test(x.label || "")) x.label = "천장 매입등" } }
    // (라) 단계 이름: 목공이라는 것이 보이게 · 철거의 ‘몰딩 철거’는 상부 몰딩 / 걸레받이 두 줄로 나뉘었으면 옛 줄을 감춘다 (켜 둔 견적에서는 보인다)
    { const s4 = (D.steps || []).find(x => x.key === "s4"); if (s4 && s4.label === "몰딩·천장·벽") s4.label = "목공 (몰딩·천장·벽)" }
    for (const cs of Object.values(C)) for (const c of cs) if (/ 바꾸기$/.test(c.label || "")) c.label = c.label.replace(/ 바꾸기$/, " 교체");
    { const a = (C.s9 || []).find(c => c.key === "paper"), b = (C.s8 || []).find(c => c.key === "floor"); if (a) a.pyc = "paper"; if (b) b.pyc = "floor" }   // 평수 한 칸으로 넣는 묶음 (pyc = 종류를 고르는 줄)   // ‘방문 바꾸기’ → ‘방문 교체’ (몰딩·욕실문·벽지도)
    { const x = fl("demoMold"); if (x && fl("demoMoldTop") && fl("demoBase")) x.gone = true }
    { const x = fl("bathLight"); if (x && fl("bathDown")) x.gone = true } }   // 욕실 조명은 전기·조명 단계의 ‘욕실 다운라이트’로 옮겼다
  try { woodFix() } catch (e) { }   // 처음 불러올 때는 아직 준비 전일 수 있다 (바로 뒤 rebuildUsed 에서 다시 실행)
}
const WOOD_WORKS = [["flatCeil", "평천장", "ceilA", "ceilAF", 0], ["wellCeil", "우물천장", "livingA*0.5", "livingA*0.5", 0], ["lightBox", "등박스·간접등 홈", "4", "4", 0], ["wall", "가벽", "wallA", "wallAF", 4], ["artwall", "아트월", "artA", "artAF", 2],
  ["insul", "벽체 단열", "(insN?insA:L('insul')*7)", "(insN?insAF:L('insul')*7)", 0], ["curtainBox", "커튼박스", "L('curtainBox')*0.3", "L('curtainBox')*0.3", 0], ["flatWall", "벽 평탄화", "flatWA", "flatWAF", 0], ["tvBox", "TV 매립박스·벽 보강", "3", "3", 2],
  ["shelf", "선반", "0", "0", 1], ["arch", "아치", "0", "0", 0], ["hidden", "히든도어·문틀", "0", "0", 0], ["halfIn", "반매립", "0", "0", 0]];   // [공사 줄 id, 이름, 석고가 붙는 면적 식, 각재 틀 면적 식, 합판 장수]
const WOOD_SUB = (id, AF, sg, gj, ply) => [            // 작업 하나에 드는 부자재(어림) [품목, 수량식]. 조사 기준(2026-11): 422·T50 타카핀 1갑 5,000발, ST45 1갑 1,000발 → 웬만한 작업은 1갑 · 목공본드는 석고보드 6~8장에 1개. 장갑·실리콘·폼은 공통 부자재에 들어 있다
  { name: "ST45 타카핀", qty: `Math.max(1,Math.ceil((${AF})/60))` }, { name: "422 타카핀", qty: `Math.max(1,Math.ceil(${sg}/100))` }, { name: "T50 타카핀", qty: `Math.max(1,Math.ceil(${gj}/20))` },
  { name: "630 타카핀", qty: id === "flatCeil" || ply ? "1" : "0" }, { name: "목공본드", qty: `Math.max(1,Math.ceil(${sg}/7))` }, { name: "우레탄폼", qty: id === "insul" ? `Math.max(2,Math.ceil(${sg}/8))` : "0" }];
const WOOD_MAIN = ["flatCeil", "wellCeil", "wall", "artwall", "insul", "curtainBox"];   // 목공 단계에 늘 보이는 작업 카드 (나머지는 ‘다른 작업’에서 눌러 넣는다)
const WOOD_DESC = { flatCeil: "천장을 평평하게 다시 짜기 · 사각 / 라운드 중천장", wellCeil: "천장 가운데를 한 단 올리기", wall: "칸막이 벽 세우기", artwall: "거실 TV 벽 같은 포인트 벽", insul: "확장부·외벽 쪽 벽 단열 (치수를 안 넣으면 2면)", curtainBox: "창 위 커튼 넣는 홈", shelf: "벽 선반", arch: "아치 게이트", halfIn: "반매립 작업", lightBox: "등박스·간접등 홈", tvBox: "TV 매립박스·벽 보강", hidden: "히든도어·문틀", flatWall: "석고보드로 벽 평탄화" };
const WOOD_MENS = { flatCeil: 1, halfIn: 1.5, insul: 1.5 };   // 사용자가 정한 작업별 목수 인원 (몰딩은 1명 · 35평 이상 2명). 여기에 없는 작업은 예전처럼 작업비 1식
function woodFix() {                                  // 목공(세트 방식): 작업마다 ‘자재 ○식 · 부자재 ○식 · 목수 ○명’. 세트 품목이 데이터에 없으면 예전 방식으로
  const SL = D.stepLines, C = D.cats, w4 = SL && SL.s4; if (!w4 || !C || !C.s4) return;
  const has = n => (D.catalog || []).some(i => i.name === n), unitOf = n => ((D.catalog || []).find(i => i.name === n) || {}).unit || "";
  if (!(has(SET_GEN) && has(SET_SUB) && has("목수 인건비"))) { D._woodSet = false; return woodFixOld() }
  D._woodSet = true;
  { const w0 = w4.find(l => l.id === "woodSub"); if (w0 && !D._woodSub0 && w0.bom && w0.bom.mode === "replace") D._woodSub0 = w0.bom.items.map(b => ({ name: b.name, qty: String(b.qty) })) }   // 데이터에 들어 있던 공통 부자재 사용량 식 (세트 방식으로 바꾸기 전에 한 번 보관)
  const up = (id, props) => { let x = w4.find(l => l.id === id); if (!x) { x = { id, tags: "", loc: "" }; w4.push(x) } for (const k of ["hideZero", "sel", "follow", "altOf", "docName", "set", "bom", "note", "altBy", "lump"]) delete x[k]; return Object.assign(x, props) };
  const P = n => "PR('" + n + "')", sum = set => "(" + SET_PARTS[set].map(P).join("+") + ")";
  const SG = A => `Math.ceil((${A})/1.62*(1+woodLoss))`, GJ = AF => `Math.max(1,Math.ceil(Math.ceil((${AF})/1.62*(1+woodLoss))*3/12))`;
  const ok = list => list.filter(b => has(b.name) && String(b.qty) !== "0");
  const one = set => ({ mode: "detail", label: "1식 구성", items: SET_PARTS[set].filter(has).map(n => ({ name: n, qty: "SELF", unit: unitOf(n) })) });   // 치수로 계산하지 않는 작업: 구성품 × 식 수
  const use = list => ({ mode: "detail", label: "포함 내역", scale: true, items: ok(list).map(b => ({ name: b.name, qty: b.qty, unit: unitOf(b.name) })) });   // 실제 쓰는 양(어림). 식 수를 고치면 그 비율만큼 품목마다 따로 올림해서 바뀐다
  const nSet = (list, den) => `Math.max(1,Math.ceil((${ok(list).map(b => "(" + b.qty + ")*" + P(b.name)).join("+") || "0"})/Math.max(1,${den})-0.1))`;   // 식 수 = 쓰는 양을 낱개로 산 금액 ÷ 1식(구성품 1개씩) 금액 → 올림 (모자라게 받지 않게)
  const N1 = "식 수 = 쓰는 양을 낱개로 산 금액 ÷ 1식 금액 (올림) · 고칠 수 있습니다", N0 = "치수로 계산하지 않는 작업입니다 · 필요한 식 수를 넣으세요";
  const cats = [C.s4.find(c => c.key === "mold")].filter(Boolean), sel = [];
  for (const [id, nm, A0, AF0, ply] of WOOD_WORKS) { const w = w4.find(l => l.id === id); if (!w) continue; const men = WOOD_MENS[id], phys = A0 !== "0";
    const A = id === "insul" ? "(insN?insA:14)" : A0, AF = id === "insul" ? "(insN?insAF:14)" : AF0;   // 단열: 치수를 안 넣으면 2면(14㎡)으로 본다
    if (men) { w.sel = true; w.qty = String(men); w.hideZero = false; w.label = nm; w.docName = nm + " 목수 작업비"; w.note = "목수 " + men + "명 — ‘목수 작업비’ 인원에 합쳐집니다"; sel.push(id) }
    else { w.sel = false; if (!w.label || / 목수 작업비$/.test(w.label)) w.label = nm + " 작업비" }
    const set = id === "insul" && has(SET_INS) ? SET_INS : SET_GEN, rnd = id === "flatCeil" && has(SET_RND);
    const mat = [{ name: "석고보드 (9.5T)", qty: SG(A) }, { name: "각재 (30x30)", qty: GJ(AF) }];
    if (id === "flatCeil") mat.push({ name: "MDF (9T)", qty: "Math.max(1,Math.ceil((ceilA)/6))" }, { name: "오징어 합판 (밴딩)", qty: "(ALT('flatCeil')==1?Math.max(1,Math.ceil((ceilA)/6)):0)" });
    if (id === "insul") mat.push({ name: "아이소핑크/단열재 (50T)", qty: "(insN?Math.ceil(insAF/1.62*(1+woodLoss)):10)" });
    if (ply) mat.push({ name: "일반합판 (9T)", qty: String(ply) });
    const sub = WOOD_SUB(id, AF, SG(A), GJ(AF), ply), den = rnd ? `(ALT('flatCeil')==1?${sum(SET_RND)}:${sum(SET_GEN)})` : sum(set);
    up(id + "Mat", { label: nm + " 자재", docName: nm + " 자재", items: rnd ? [SET_GEN, SET_RND] : [set], ...(rnd ? { altOf: "flatCeil" } : {}), qty: phys ? nSet(mat, den) : "0", hideZero: true, follow: id, set: true, lump: true, loc: w.loc || "", note: phys ? N1 : N0, bom: phys ? use(mat) : one(set) });
    up(id + "Sub", { label: nm + " 부자재", docName: nm + " 부자재", items: [SET_SUB], qty: phys ? nSet(sub, sum(SET_SUB)) : "0", hideZero: true, follow: id, set: true, lump: true, loc: w.loc || "", note: phys ? N1 : N0, bom: phys ? use(sub) : one(SET_SUB) });
    cats.push({ key: "w_" + id, label: nm, desc: WOOD_DESC[id] || "", lines: [id + "Mat", id + "Sub", id], only: id, main: WOOD_MAIN.includes(id) }) }
  const CM = "etcA+perimAll*0.05", CMF = "etcAF+perimAll*0.05";
  const cmat = [{ name: "석고보드 (9.5T)", qty: SG(CM) }, { name: "각재 (30x30)", qty: GJ(CMF) }, { name: "MDF (9T)", qty: "Math.max(1,Math.ceil(perimAll/12))" }, { name: "일반합판 (9T)", qty: "(ON('fan')*1)" }];
  const csub = D._woodSub0 && D._woodSub0.length ? D._woodSub0.map(b => /^ST45/.test(b.name) ? { name: b.name, qty: "1+Math.ceil((" + CM + ")/30)" } : b) : SET_PARTS[SET_SUB].map(n => ({ name: n, qty: "1" }));   // 작업별 타카핀은 작업 줄에 있으므로 공통에는 몰딩·기타분만
  up("woodMat", { label: "공통 목자재 (몰딩·기타)", docName: "목자재 (몰딩·공통)", items: [SET_GEN], set: true, lump: true, qty: nSet(cmat, sum(SET_GEN)), note: N1, bom: use(cmat) });
  up("woodSub", { label: "공통 목공 부자재", docName: "목공 부자재 (몰딩·공통)", items: [SET_SUB], set: true, lump: true, qty: nSet(csub, sum(SET_SUB)), note: N1, bom: use(csub) });
  const wl = w4.find(l => l.id === "woodLabor"); if (wl) { wl.label = "목수 작업비"; wl.qty = `Math.max(1,Math.round(((ON('ceilMold')+ON('baseMold')+ON('doorMold'))>0?(py>=35?2:1):0)${sel.map(i => "+L('" + i + "')").join("")}))`; wl.note = "몰딩 1명(35평 이상 2명) + 고른 작업의 인원 → 합쳐서 반올림" }
  const wc = C.s4.find(c => c.key === "wood"); if (wc) { wc.label = "공통 목자재·부자재·목수 작업비"; wc.lines = ["woodMat", "woodSub", "woodLabor"]; cats.push(wc) }
  C.s4 = cats;
}
function woodFixOld() {                               // (세트 품목이 없을 때) 목공: 작업마다 ‘목수 작업비 · 자재 · 부자재’ 묶음을 만든다. 공통 목자재에는 몰딩·기타분만 남긴다 (데이터 파일은 그대로, 불러올 때마다 적용)
  const SL = D.stepLines, C = D.cats, w4 = SL && SL.s4; if (!w4 || !C || !C.s4 || w4.some(l => l.id === "flatCeilMat")) return;
  const has = n => (D.catalog || []).some(i => i.name === n); if (!has("목자재 납품") || !has("부자재 및 장비대")) return;
  const cats = C.s4.filter(c => c.key === "mold");
  for (const [id, nm, A, AF, ply] of WOOD_WORKS) { const w = w4.find(l => l.id === id); if (!w) continue; w.sel = !!w.hideZero && String(w.qty).trim() === "0"; w.label = w.sel ? nm : nm + " 목수 작업비"; const lines = [id], mi = [];
    if (A !== "0") mi.push({ name: "석고보드 (9.5T)", qty: `Math.ceil((${A})/1.62*(1+woodLoss))`, note: "900×1800 (1.62㎡) · 로스율 적용" }, { name: "각재 (30x30)", qty: `Math.max(1,Math.ceil(Math.ceil((${AF})/1.62*(1+woodLoss))*3/12))`, note: "한치각 12자 · 석고 1장당 3개 · 12개 1단" });
    if (ply) mi.push({ name: "일반합판 (9T)", qty: String(ply) });
    if (id === "flatCeil") mi.push({ name: "MDF (9T)", qty: "Math.max(1,Math.ceil((ceilA)/6))", note: "천장 마감·박스 (어림)" }, { name: "오징어 합판 (밴딩)", qty: "ALT('flatCeil')==1?Math.max(1,Math.ceil((ceilA)/6)):0", note: "라운드 중천장일 때만" });
    if (id === "insul") mi.push({ name: "아이소핑크/단열재 (50T)", qty: "(insN?Math.ceil(insAF/1.62*(1+woodLoss)):L('insul')*5)", note: "단열 벽 치수를 넣으면 면적 ÷ 1.62 · 없으면 1면당 5장" });
    const ok = mi.filter(b => has(b.name));
    if (ok.length) { w4.push({ id: id + "Mat", label: nm + " 자재", items: ["목자재 납품"], qty: "1", tags: "", loc: w.loc || "", follow: id, bom: { mode: "replace", label: nm + " 자재", items: ok } }); lines.push(id + "Mat") }
    if (A !== "0" && has("ST45 타카핀")) { w4.push({ id: id + "Sub", label: nm + " 부자재", items: ["부자재 및 장비대"], qty: "1", tags: "", loc: w.loc || "", follow: id, bom: { mode: "replace", label: nm + " 부자재", items: [{ name: "ST45 타카핀", qty: `Math.max(1,Math.ceil((${A})/30))` }, ...(has("목공본드") ? [{ name: "목공본드", qty: "1" }] : []), ...(id === "insul" && has("우레탄폼") ? [{ name: "우레탄폼", qty: "2" }] : [])] } }); lines.push(id + "Sub") }
    cats.push({ key: "w_" + id, label: nm, desc: w.sel ? (lines.length > 1 ? "자재 · 부자재 (목수 인원은 위 목수 작업비에 합산)" : "목수 인원만 (위 목수 작업비에 합산)") : (lines.length > 1 ? "목수 작업비 · 자재 · 부자재" : "목수 작업"), lines, only: id }) }
  const wm = w4.find(l => l.id === "woodMat"), ws = w4.find(l => l.id === "woodSub"), wl = w4.find(l => l.id === "woodLabor"), CM = "etcA+perimAll*0.05", CMF = "etcAF+perimAll*0.05";
  if (wm && wm.bom) { wm.label = "공통 목자재 (몰딩·기타)"; wm.bom.label = "공통 목자재"; for (const b of wm.bom.items) { if (/^석고보드/.test(b.name)) b.qty = `Math.ceil((${CM})/1.62*(1+woodLoss))`; else if (/^각재/.test(b.name)) b.qty = `Math.max(1,Math.ceil(Math.ceil((${CMF})/1.62*(1+woodLoss))*3/12))`; else if (/^일반합판/.test(b.name)) b.qty = "ON('fan')*1"; else if (/^아이소핑크/.test(b.name)) b.qty = "0" } }
  if (ws && ws.bom) { ws.label = "공통 목공 부자재"; ws.bom.label = "공통 목공 부자재"; const tk = ws.bom.items.find(b => /^ST45/.test(b.name)); if (tk) tk.qty = `1+Math.ceil((${CM})/30)` }
  if (wl) wl.label = "목수 작업비 (몰딩·공통)";
  cats.push(...C.s4.filter(c => c.key === "wood").map(c => ({ ...c, label: "공통 목자재·부자재·목수 작업비", desc: "몰딩 시공과 여러 작업에 함께 드는 것" })));
  C.s4 = cats;
}
const woodTot0 = re => { const ls = R.lines.filter(l => l.step === "s4" && String(l.key).includes("#") && re.test(l.name)); return ls.length ? { ...ls[0], qty: Math.round(ls.reduce((a, l) => a + l.qty, 0) * 10) / 10, amt: ls.reduce((a, l) => a + l.amt, 0) } : null };   // 작업별로 나뉜 목자재를 품목별로 합친 값 (석고보드 몇 장 · 각재 몇 단)
const woodTot = re => D._woodSet ? null : woodTot0(re);   // 세트 방식에서는 낱개 수량이 견적에 없다
function rebuildUsed() {
  dataFix2(); USEDB.clear(); if (D.stepLines) for (const l of Object.values(D.stepLines).flat()) { l.items.forEach(n => USEDB.add(nmBase(n))); ((l.bom || {}).items || []).forEach(b => USEDB.add(nmBase(b.name))) }
  USED.clear();
  if (D.stepLines) { for (const l of Object.values(D.stepLines).flat()) { l.items.forEach(n => USED.add(n)); ((l.bom || {}).items || []).forEach(b => USED.add(b.name)) } return }
  const walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === "object") { if (x.item) USED.add(x.item); Object.values(x).forEach(walk) } };
  walk(D.spaceTypes); walk(D.auto); walk(D.packages); ((D.global || {}).floorOpts || []).forEach(n => USED.add(n)); ((D.global || {}).paperOpts || []).forEach(n => USED.add(n));
}
rebuildUsed();
const STEPS = () => [{ key: "s0", label: "현장 정보", procs: [], pk: [] }, ...(D.steps || []), { key: "end", label: "확인 · 견적서", procs: [], pk: [] }];
/* 면적 단위: 견적을 넣는 화면에서는 실장이 익숙한 ‘평’으로 보여 주고 받는다 (안에서는 ㎡로 계산). 고객에게 나가는 상세견적서·엑셀은 ㎡ 그대로. */
const PYM = 3.3058, toPy = q => Math.round((+q || 0) / PYM * 10) / 10;
/* ---------- 큰 공사 카드: 체크하면 세부 품목이 펼쳐짐 ---------- */
const aliasOf = n => (D.alias || {})[n] || n;
const lineById = id => Object.values(D.stepLines).flat().find(x => x.id === id);
const FIND_HTML = `<div id="findBox" style="position:relative;margin-bottom:8px"><input id="findQ" type="search" placeholder="공사 찾기 (예: 젠다이, 확장)" autocomplete="off" style="width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:var(--panel);color:var(--ink)"><div id="findOut" hidden style="position:absolute;left:0;top:100%;z-index:40;width:min(440px,92vw);max-height:360px;overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);margin-top:4px"></div></div>`;
function findItems(q0) {
  const q = q0.replace(/\s+/g, "").toLowerCase(); if (!q) return { lines: [], extra: [] };
  const hit = s => String(s || "").replace(/\s+/g, "").toLowerCase().includes(q), lines = [], seen = new Set();
  for (const st of D.steps || []) for (const l of (D.stepLines[st.key] || [])) {
    const cat = ((D.cats || {})[st.key] || []).find(c => c.lines.includes(l.id));
    if (hit(lineLabel(l)) || hit(l.label) || hit(l.loc) || l.items.some(n => hit(n) || hit(aliasOf(n)) || hit((D.catalog.find(i => i.name === n) || {}).spec)) || (cat && (hit(cat.label) || hit(cat.desc)))) { lines.push({ st, l, cat }); l.items.forEach(n => seen.add(n)) }
  }
  const extra = D.catalog.filter(i => !seen.has(i.name) && !USED.has(i.name) && (hit(i.name) || hit(aliasOf(i.name)))).map(i => ({ i, st: (D.steps || []).find(s => (s.procs || []).includes(i.proc)) })).filter(x => x.st);
  return { lines: lines.slice(0, 25), extra: extra.slice(0, 12) };
}
document.addEventListener("input", ev0 => {
  if (ev0.target.id !== "findQ") return; const out = $("#findOut"), r = findItems(ev0.target.value), row = "display:flex;gap:8px;align-items:center;width:100%;text-align:left;padding:8px 10px;border:0;border-bottom:1px solid var(--line);background:none;color:var(--ink);font:inherit;cursor:pointer";
  if (!ev0.target.value.trim()) { out.hidden = true; return }
  const fb = ev0.target.getBoundingClientRect(); out.style.position = "fixed"; out.style.left = fb.left + "px"; out.style.top = (fb.bottom + 4) + "px";   // 옆 칸에 잘리지 않게 화면 기준으로 띄운다
  out.hidden = false;
  out.innerHTML = (r.lines.map(x => { const on = lnState(x.l).on, m = R.lines.find(y => y.key === "ln|" + x.l.id);
      return `<button type="button" data-findgo="${x.l.id}" style="${row}"><span style="flex:1;min-width:0"><b>${esc(lineLabel(x.l))}</b><br><small class="note">${esc(x.st.label)}${x.cat ? " › " + esc(x.cat.label) : ""}</small></span><span class="note" style="white-space:nowrap">${on ? "✓ 켜짐" + (m && m.amt ? " · " + won(m.amt) + "원" : "") : "눌러서 추가"}</span></button>` }).join("")
    + r.extra.map(x => `<button type="button" data-findstep="${x.st.key}" style="${row}"><span style="flex:1;min-width:0"><b>${esc(aliasOf(x.i.name))}</b><br><small class="note">${esc(x.st.label)} › 추가 품목 (그 단계 아래 ‘추가 품목’에서 체크)</small></span><span class="note" style="white-space:nowrap">단계로 가기</span></button>`).join(""))
    || `<div class="note" style="padding:10px">‘${esc(ev0.target.value)}’ 에 맞는 공사가 없습니다. 그 단계에서 묶음 카드를 펼쳐 ‘＋ 항목 추가 → 직접 입력’으로 넣을 수 있습니다.</div>`;
});
document.addEventListener("click", ev0 => {
  const t = ev0.target, go = t.closest("[data-findgo]"), gs = t.closest("[data-findstep]"), out = $("#findOut");
  if (out && !out.hidden && !t.closest("#findBox")) out.hidden = true;
  if (!go && !gs) return;
  const steps = STEPS(), fq = $("#findQ");
  if (gs) { E.step = Math.max(0, steps.findIndex(s => s.key === gs.dataset.findstep)); out.hidden = true; if (fq) fq.value = ""; renderChecklist(); window.scrollTo(0, 0); toast("이 단계 아래쪽 ‘추가 품목’에서 체크하세요."); return }
  const l = lineById(go.dataset.findgo), sk = stepOfLine(l), cat = ((D.cats || {})[sk] || []).find(c => c.lines.includes(l.id)), was = lnState(l).on;
  E.step = Math.max(0, steps.findIndex(s => s.key === sk)); if (!was) setLn(l, { on: true }); if (cat) openCat(sk + "|" + cat.key);
  out.hidden = true; if (fq) fq.value = ""; refresh();
  const card = cat && document.querySelector(`[data-catopen="${sk}|${cat.key}"]`); if (card) card.scrollIntoView({ block: "center" });
  toast(`‘${lineLabel(l)}’ ${was ? "은(는) 이미 켜져 있습니다" : "을(를) 켰습니다"} · ${stepLabel(sk)}${cat ? " › " + cat.label : ""}`);
});
const WIN_KINDS = ["외부 단창", "외부 이중창", "내부 이중창", "공틀창", "FIX창", "터닝도어", "폴딩도어", "방충망", "기타"];
function winSync() {                                  // 창호 목록 → 견적 줄 (이름·사양·금액만. 치수는 E.wins 에만 남는다)
  const pr = ((D.steps || []).find(s => s.key === "s2") || { procs: ["창호"] }).procs[0];
  E.extras = (E.extras || []).filter(x => !String(x.id).startsWith("xw")).concat((E.wins || []).filter(w => String(w.loc || "").trim() || +w.price > 0)
    .map(w => ({ id: "xw" + w.id, space: "common", proc: pr, name: [String(w.loc || "").trim(), w.kind === "기타" ? "" : w.kind].filter(Boolean).join(" ") || "창호", unit: "식", qty: 1, price: w.price === "" || w.price === undefined ? "" : +w.price, note: w.spec || "" })));
}
const winArea = w => +w.w > 0 && +w.h > 0 ? (w.w * w.h / 1e6).toFixed(2) + "㎡" : "";
function winCard() {
  const ws = E.wins || [], sum = ws.reduce((a, w) => a + (+w.price || 0), 0);
  const locs = [...new Set(["앞베란다", "뒷베란다", "거실", "주방", "안방", "입구방", "작은방", ...R.S.list.filter(s => s.type === "방" && s.id !== "room1").map(s => s.name), "다용도실"])];
  return `<div class="pgroup"><h3>창호 목록 — 창마다 치수와 금액 <span class="note">치수는 실장만 봅니다. 고객 견적서에는 이름·사양·금액만 나옵니다.</span></h3>
    <datalist id="winLocs">${locs.map(x => `<option value="${esc(x)}">`).join("")}</datalist>
    ${ws.length ? `<div class="tbl"><table><thead><tr><th>위치</th><th>종류</th><th class="num">가로 mm</th><th class="num">세로 mm</th><th class="num">면적</th><th class="num">㎡당 단가</th><th class="num">금액 (원)</th><th>사양 (견적서에 표시)</th><th></th></tr></thead><tbody>
    ${ws.map(w => `<tr data-win="${w.id}"><td><input data-wf="loc" list="winLocs" value="${esc(w.loc || "")}" placeholder="안방" style="width:84px"></td><td><select data-wf="kind">${WIN_KINDS.map(k => `<option ${w.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></td>
      <td class="num"><input class="q" type="number" min="0" step="10" data-wf="w" value="${w.w ?? ""}"></td><td class="num"><input class="q" type="number" min="0" step="10" data-wf="h" value="${w.h ?? ""}"></td><td class="num note" data-warea>${winArea(w)}</td><td class="num"><input class="q" type="number" min="0" step="1000" data-wf="rate" value="${w.rate ?? ""}" placeholder="선택" style="width:78px"></td>
      <td class="num"><input class="q" type="number" min="0" step="1000" data-wf="price" value="${w.price ?? ""}" style="width:100px"></td><td><input data-wf="spec" value="${esc(w.spec || "")}" placeholder="예림 140바 / 백색 / 24T 로이" style="width:100%;min-width:120px"></td><td><button type="button" class="btn ghost sm" data-windel="${w.id}">삭제</button></td></tr>`).join("")}
    </tbody><tfoot><tr><td colspan="6"><b>창호 ${ws.length}개 합계</b></td><td class="num"><b id="winSum">${won(sum)}</b></td><td colspan="2" class="note">㎡당 단가를 넣으면 가로×세로로 금액이 자동 계산됩니다(금액을 직접 고치면 ㎡당 단가는 지워짐). 금액을 비우면 ‘별도 협의’.</td></tr></tfoot></table></div>` : '<p class="note" style="padding:0 14px">실측해 온 창을 하나씩 넣으세요. 예: 안방 · 내부 이중창 · 2400 × 1200 · 1,240,000원</p>'}
    <div class="addrow"><button type="button" class="btn sm" data-winadd>+ 창 추가</button>${ws.length ? '<button type="button" class="btn ghost sm" data-wincopy>마지막 창 복사</button>' : ""}</div></div>`;
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, del = t.closest("[data-windel]"); E.wins = E.wins || [];
  if (t.closest("[data-winadd]")) E.wins.push({ id: Date.now().toString(36), loc: "", kind: "외부 이중창", w: "", h: "", price: "", spec: "" });
  else if (t.closest("[data-wincopy]") && E.wins.length) E.wins.push({ ...E.wins[E.wins.length - 1], id: Date.now().toString(36), loc: "" });
  else if (del) E.wins = E.wins.filter(w => w.id !== del.dataset.windel);
  else return;
  winSync(); refresh();
  if (!del) { const rows = document.querySelectorAll("[data-win]"), last = rows[rows.length - 1]; if (last) last.querySelector('[data-wf="loc"]').focus() }
});
const winEdit = ev0 => {
  const el = ev0.target; if (!el.dataset || el.dataset.wf === undefined) return; const tr = el.closest("[data-win]"), w = (E.wins || []).find(x => x.id === tr.dataset.win); if (!w) return;
  const k = el.dataset.wf; w[k] = ["w", "h", "price", "rate"].includes(k) ? (el.value === "" ? "" : +el.value) : el.value;
  if (k === "price" && ev0.type === "input") { w.rate = ""; const ri = tr.querySelector('[data-wf="rate"]'); if (ri) ri.value = "" }
  else if (["w", "h", "rate"].includes(k) && +w.rate > 0 && +w.w > 0 && +w.h > 0) { w.price = Math.round(w.w * w.h / 1e6 * w.rate / 1000) * 1000; const pi = tr.querySelector('[data-wf="price"]'); if (pi) pi.value = w.price }
  winSync(); R = compute(); renderSummary(); save();
  tr.querySelector("[data-warea]").textContent = winArea(w); const s = $("#winSum"); if (s) s.textContent = won(E.wins.reduce((a, x) => a + (+x.price || 0), 0));
};
document.addEventListener("input", winEdit); document.addEventListener("change", winEdit);
/* ───── 가구 치수 목록: 치수를 넣으면 정면도가 그려지고, 자 수·개수 → 아래 가구 줄의 수량·금액이 따라 바뀐다 (치수·그림은 실장만 본다) ───── */
const FURN_JA = 303, FURN_CNT = ["fridge", "tall", "pantry", "laundry", "island", "dress"];   // 1자 = 303mm (반 자 올림) · 개수로 세는 가구
const furnIsJa = l => !!l && (byName[l.items[0]] || {}).unit === "자";
const furnLines = () => ((D.stepLines || {}).s11 || []).filter(l => furnIsJa(l) || FURN_CNT.includes(l.id));
const furnJa = w => +w > 0 ? Math.ceil(w / FURN_JA * 2 - 1e-6) / 2 : 0;
const furnQty = f => { const l = lineById(f.lid); return !l ? 0 : furnIsJa(l) ? furnJa(f.w) : +f.n > 0 ? +f.n : f.lid === "tall" && +f.w > 0 ? Math.ceil(f.w / 600 - 1e-6) : 1 };
const furnH = f => ({ hl: +f.hl > 0 ? +f.hl : 850, hg: +f.hg > 0 ? +f.hg : 600, hu: +f.hu > 0 ? +f.hu : 700 });   // 하부장 · 상하부장 사이(벽 타일) · 상부장
function furnSync(clearLid) {
  const by = {}; for (const f of E.furn || []) { const q = furnQty(f); if (q) by[f.lid] = (by[f.lid] || 0) + q }
  const og = E.furnOrig = E.furnOrig || {};
  if (E.furnOff) { furnRestore(); return }            // ‘원래 금액으로’ 상태: 치수는 기록만 하고 금액은 건드리지 않는다
  for (const lid in by) { if (!(lid in og)) og[lid] = E.ln[lid] ? { ...E.ln[lid] } : null; setLn(lineById(lid), { on: true, q: by[lid] }) }
  for (const lid of Object.keys(og)) if (!by[lid]) furnRestore(lid);
}
function furnRestore(only) {                          // 치수 목록이 바꾸기 전의 체크·수량으로 되돌린다
  const og = E.furnOrig || {};
  for (const lid of Object.keys(og)) { if (only && lid !== only) continue; if (og[lid]) E.ln[lid] = og[lid]; else delete E.ln[lid]; delete og[lid] }
}
function furnOrigAmt(f) {                             // 치수로 바꾸기 전 그 가구 줄의 금액 (비교용)
  const og = (E.furnOrig || {})[f.lid], l = lineById(f.lid), ln = R.lines.find(x => x.key === "ln|" + f.lid); if (og === undefined || !l || !ln || !ln.price) return "";
  const on = og ? og.on : defOn(l); if (!on) return "원래 없음";
  const q = og && og.q !== undefined && og.q !== "" ? +og.q : ln.auto; return `원래 ${q}${ln.unit} · ${won(Math.round(ln.price * q))}`;
}
function furnInfo(f) {
  const l = lineById(f.lid); if (!l) return ""; const q = furnQty(f), u = (byName[l.items[0]] || {}).unit || "";
  if (!furnIsJa(l)) return `${q}${u}` + (f.lid === "tall" && !(+f.n > 0) && +f.w > 0 ? " (600mm 통 기준 자동)" : "");
  if (!q) return "가로를 넣으세요";
  return `${q}자` + (l.id === "closet" && q >= 4 ? ` · 4자 통 ${Math.floor(q / 4)}개${q % 4 ? " + " + (q % 4) + "자" : ""}` : "") + (l.id === "sink" ? ` · 벽 타일 ${r1(f.w / 1000 * furnH(f).hg / 1000)}㎡` : "");
}
function furnAmt(f) { const q = furnQty(f), ln = R.lines.find(x => x.key === "ln|" + f.lid); return !q ? "" : E.furnOff ? "적용 안 함" : ln && ln.price ? won(Math.round(ln.price * q)) + "원" : "단가 미정" }
function furnElev(f) {                                // 정면도 (2D): 벽 가로 × 천장 높이 안에 가구를 그린다. 파란 숫자 = 넣은 치수, 회색 = 기본값
  const l = lineById(f.lid); if (!l) return ""; const ja = furnIsJa(l), k = f.lid, q = furnQty(f), { hl, hg, hu } = furnH(f), n1 = v => v.toFixed(1);
  const W = +f.w > 0 ? +f.w : ja ? 2400 : 600 * Math.max(1, q), CH = (+E.ceilH > 0 ? +E.ceilH : D.layout.ceilH) * 1000, sink = k === "sink", up = k === "laundry";
  const H = sink ? hl + hg + hu : +f.h > 0 ? +f.h : k === "island" ? 900 : up ? 700 : k === "shoe" ? 2100 : Math.min(2300, CH), yU = up ? Math.max(0, Math.min(1450, CH - H)) : 0, RH = Math.max(CH, H + yU);
  const VW = 320, VH = 200, mL = sink ? 62 : 44, mB = 24, mT = 8, mR = 8, s = Math.min((VW - mL - mR) / W, (VH - mB - mT) / RH), x0 = mL + ((VW - mL - mR) - W * s) / 2, fy = VH - mB;
  const rc = (x, yb, w, h, fill, st) => `<rect x="${n1(x0 + x * s)}" y="${n1(fy - (yb + h) * s)}" width="${n1(Math.max(0, w * s))}" height="${n1(Math.max(0, h * s))}" fill="${fill}" stroke="${st || "#6b5d48"}" stroke-width="1"/>`;
  const cols = (yb, h, n, fill, dbl) => { let o = ""; for (let i = 0; i < n; i++) { o += rc(i * W / n, yb, W / n, h, fill); if (dbl) { const mx = x0 + (i + 0.5) * W / n * s; o += `<line x1="${n1(mx)}" y1="${n1(fy - yb * s)}" x2="${n1(mx)}" y2="${n1(fy - (yb + h) * s)}" stroke="#6b5d48" stroke-width="0.6"/>` } } return o };
  let b = `<rect x="${n1(x0)}" y="${n1(fy - RH * s)}" width="${n1(W * s)}" height="${n1(RH * s)}" fill="#f3f4f0" stroke="#b9beb8" stroke-width="1"/>`; const hd = [];
  if (sink) { const n = Math.max(1, Math.round(W / 600));
    b += rc(0, 0, W, 100, "#b9ad96") + cols(100, Math.max(0, hl - 130), n, "#e6dcc8") + rc(0, hl - 30, W, 30, "#5f6462", "#3c403e") + rc(0, hl, W, hg, "#d7eeea", "#8fc7bd") + cols(hl + hg, hu, n, "#efe7d6")
      + `<text x="${n1(x0 + W * s / 2)}" y="${n1(fy - (hl + hg / 2) * s + 3.5)}" text-anchor="middle" font-size="9.5" fill="#1f7a6c">벽 타일</text>`;
    hd.push([0, hl, +f.hl > 0, "하부"], [hl, hg, +f.hg > 0, "사이"], [hl + hg, hu, +f.hu > 0, "상부"]);
  } else if (k === "closet" && q > 0) { const uw = W / q, full = Math.floor(q / 4); let x = 0;
    for (let i = 0; i < full; i++) { b += rc(x, 0, 4 * uw, H, "#efe7d6") + `<line x1="${n1(x0 + (x + 2 * uw) * s)}" y1="${n1(fy)}" x2="${n1(x0 + (x + 2 * uw) * s)}" y2="${n1(fy - H * s)}" stroke="#6b5d48" stroke-width="0.6"/>`; x += 4 * uw }
    if (W - x > 1) b += rc(x, 0, W - x, H, "#e6dcc8"); hd.push([0, H, +f.h > 0, ""]);
  } else if (k === "fridge") { const n = Math.max(1, q), cw = W / n, fh = Math.min(1800, H - 250);
    for (let i = 0; i < n; i++) b += rc(i * cw, 0, cw, H, "#efe7d6") + rc(i * cw + cw * 0.08, 0, cw * 0.84, fh, "#cfd6da", "#8a959b") + `<text x="${n1(x0 + (i + 0.5) * cw * s)}" y="${n1(fy - fh * s / 2)}" text-anchor="middle" font-size="9" fill="#55616a">냉장고</text>`;
    hd.push([0, H, +f.h > 0, ""]);
  } else { const n = ja ? Math.max(1, Math.round(W / (k === "shoe" ? 450 : 600))) : Math.max(1, q); b += cols(yU, H, n, "#efe7d6", !ja && k !== "island"); hd.push([yU, H, +f.h > 0, ""]) }
  const dc = on => on ? "#0b3d91" : "#9aa29c";
  b += `<line x1="${n1(x0)}" y1="${fy + 7}" x2="${n1(x0 + W * s)}" y2="${fy + 7}" stroke="${dc(+f.w > 0)}" stroke-width="1"/><text x="${n1(x0 + W * s / 2)}" y="${fy + 19}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${dc(+f.w > 0)}">${+f.w > 0 ? (+f.w).toLocaleString("ko-KR") : "가로 ?"}${ja && q ? " · " + q + "자" : !ja ? " · " + q + "개" : ""}</text>`;
  for (const [yb, h, on, nm] of hd) { const ya = fy - yb * s, yb2 = fy - (yb + h) * s; b += `<line x1="${n1(x0 - 5)}" y1="${n1(ya)}" x2="${n1(x0 - 5)}" y2="${n1(yb2)}" stroke="${dc(on)}" stroke-width="1"/><text x="${n1(x0 - 8)}" y="${n1((ya + yb2) / 2 + 3.5)}" text-anchor="end" font-size="9.5" font-weight="700" fill="${dc(on)}">${nm ? nm + " " : ""}${h}</text>` }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="가구 정면도">${b}</svg>`;
}
document.head.insertAdjacentHTML("beforeend", `<style>.fcard{display:grid;grid-template-columns:minmax(200px,300px) minmax(0,1fr);gap:10px;border:1px solid var(--line);border-radius:10px;padding:8px;margin:0 14px 8px}.fcard .frow{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:flex-end;margin-bottom:6px}.fcard .ff{display:flex;flex-direction:column;gap:2px;font-size:11px;color:var(--muted)}.fcard .ff input{width:74px}.fcard select{width:auto;max-width:230px}.fsvg svg{width:100%;height:auto;display:block;background:#fff;border:1px solid var(--line);border-radius:8px}@media (max-width:700px){.fcard{grid-template-columns:1fr}}</style>`);
function furnCard() {
  const fs = E.furn || [], kinds = furnLines(); if (!kinds.length) return "";
  const locs = [...new Set(["주방", "현관", "안방", "드레스룸", ...R.S.list.filter(s => s.type === "방").map(s => s.name.replace(/ \(.*\)/, "")), "작은방", "다용도실", "거실", "복도", "베란다", "팬트리", "세탁실", "알파룸"])];
  const num = (f, k, lb, ph) => `<label class="ff"><span>${lb}</span><input class="q" type="number" min="0" step="10" data-ff="${k}" value="${f[k] ?? ""}" placeholder="${ph}"></label>`;
  return `<div class="pgroup"><h3>가구 치수 목록 — 치수를 넣으면 정면도·자 수·금액이 자동 <span class="note">1자 = 303mm, 반 자 올림. 치수와 그림은 실장만 봅니다. 고객 견적서에는 수량과 금액만 나옵니다.</span></h3>
    <datalist id="furnLocs">${locs.map(x => `<option value="${esc(x)}">`).join("")}</datalist>
    ${fs.map(f => { const l = lineById(f.lid), ja = furnIsJa(l), sink = f.lid === "sink";
      return `<div class="fcard" data-furn="${f.id}"><div class="fsvg" data-fsvg>${furnElev(f)}</div><div>
        <div class="frow"><input data-ff="loc" list="furnLocs" value="${esc(f.loc || "")}" placeholder="위치 (직접 적어도 됩니다)" title="목록에 없는 위치도 그대로 적을 수 있습니다. 적은 위치는 견적서의 위치·비고 칸에 나옵니다" style="width:140px"><select data-ff="lid">${kinds.map(x => `<option value="${x.id}" ${f.lid === x.id ? "selected" : ""}>${esc((x.label || aliasOf(x.items[0])).replace(/ \(길이 자\)/, ""))}</option>`).join("")}</select><button type="button" class="btn ghost sm" data-furndel="${f.id}">삭제</button></div>
        <div class="frow">${num(f, "w", "가로 mm", "3600")}${ja ? "" : num(f, "n", "개수", f.lid === "tall" ? "자동" : "1")}${sink ? num(f, "hl", "하부장 높이", "850") + num(f, "hg", "상·하부장 사이", "600") + num(f, "hu", "상부장 높이", "700") : num(f, "h", "전체 높이 mm", "2300")}${num(f, "d", "깊이 mm", "600")}</div>
        <div class="frow"><b data-finfo>${esc(furnInfo(f))}</b><span>금액 <b data-famt>${furnAmt(f)}</b></span><small class="note" data-forig>${esc(furnOrigAmt(f))}</small></div>
        <div class="frow"><input data-ff="note" value="${esc(f.note || "")}" placeholder="실장 메모 (단내림 있음 / 커튼박스 / 콘센트 위치)" style="flex:1;min-width:160px"></div></div></div>` }).join("") || '<p class="note" style="padding:0 14px">실측해 온 가구 자리를 넣으세요. 예: 주방 · 싱크대 · 가로 3600 · 하부장 850 / 사이 600 / 상부장 700 → 12자, 벽 타일 2.2㎡까지 자동 계산됩니다.</p>'}
    ${fs.length ? '<p class="note" style="padding:0 14px">같은 가구를 여러 줄 넣으면 수량을 더합니다. 싱크대 치수는 <b>주방 벽 타일</b>(가로 × 상·하부장 사이)과 <b>싱크·가구 필름</b>에, 붙박이장·신발장 치수는 <b>붙박이장·신발장 필름</b> 수량에도 쓰입니다(그 공사를 켰을 때). 종류와 단가는 아래 가구 줄에서 고릅니다.</p>' : ""}
    <div class="addrow"><button type="button" class="btn sm" data-furnadd>+ 가구 자리 추가</button>${fs.length ? `<button type="button" class="btn ghost sm" data-furnoff>${E.furnOff ? "치수 기준 금액으로 다시 계산" : "원래 수량·금액으로 되돌리기 (치수는 기록만)"}</button>` : ""}</div>
    ${E.furnOff ? '<p class="note" style="padding:0 14px;color:var(--warn)">지금은 치수가 금액에 반영되지 않습니다. 가구 금액은 아래 가구 줄에 적힌 원래 수량대로 계산됩니다.</p>' : ""}</div>`;
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, del = t.closest("[data-furndel]"); E.furn = E.furn || [];
  if (t.closest("[data-furnadd]")) { const k = furnLines()[0]; if (!k) return; E.furn.push({ id: Date.now().toString(36), loc: "", lid: t.closest("[data-furnadd]").dataset.furnadd || (E.furn[E.furn.length - 1] || {}).lid || k.id, w: "", n: "", h: "", hl: "", hg: "", hu: "", d: "", note: "" }); furnSync() }
  else if (del) { const f = E.furn.find(x => x.id === del.dataset.furndel); E.furn = E.furn.filter(x => x !== f); furnSync(f && f.lid) }
  else if (t.closest("[data-furnoff]")) { const b0 = R.total; E.furnOff = !E.furnOff; furnSync(); refresh(); const d0 = R.total - b0; toast(`${E.furnOff ? "가구 금액을 원래대로 되돌렸습니다" : "치수 기준으로 다시 계산했습니다"} · 합계 ${d0 >= 0 ? "+" : "−"}${won(Math.abs(d0))}원`); return }
  else return;
  refresh();
  if (!del) { const nf = E.furn[E.furn.length - 1], row = nf && document.querySelector('[data-furn="' + nf.id + '"]'); if (row) row.querySelector('[data-ff="loc"]').focus() }
});
const furnEdit = ev0 => {
  const el = ev0.target; if (!el.dataset || el.dataset.ff === undefined) return; const tr = el.closest("[data-furn]"), f = (E.furn || []).find(x => x.id === tr.dataset.furn); if (!f) return;
  const k = el.dataset.ff, old = f.lid; f[k] = ["w", "n", "h", "hl", "hg", "hu", "d"].includes(k) ? (el.value === "" ? "" : +el.value) : el.value;
  furnSync(k === "lid" ? old : ""); R = compute(); renderSummary(); save();
  document.querySelectorAll("[data-furn]").forEach(r => { const g = E.furn.find(x => x.id === r.dataset.furn); if (g) { r.querySelector("[data-finfo]").textContent = furnInfo(g); r.querySelector("[data-famt]").textContent = furnAmt(g); r.querySelector("[data-forig]").textContent = furnOrigAmt(g); r.querySelector("[data-fsvg]").innerHTML = furnElev(g) } });
  if (ev0.type === "change") setTimeout(() => {      // 아래 가구 줄(체크·수량)까지 다시 그리되, 옮겨 간 입력 칸은 그대로 잡아 둔다
    const a = document.activeElement, row = a && a.closest && a.closest("[data-furn]"), id = row && row.dataset.furn, ff = row && a.dataset.ff;
    refresh(); if (id) { const n = document.querySelector(`[data-furn="${id}"] [data-ff="${ff}"]`); if (n) n.focus() }
  }, 0);
};
document.addEventListener("input", furnEdit); document.addEventListener("change", furnEdit);
/* ───── 목작업 치수 (천장·벽): 가로×세로, 벽은 길이×높이를 넣으면 석고보드·각재가 공식대로 계산된다 ─────
   석고보드(900×1800 = 1.62㎡ = 18자평) = 면적 ÷ 1.62 = 자평수 ÷ 18, 로스율을 더해 올림 · 각재(한치각 다루끼 12자) = 석고 1장당 3개, 12개 1단
   벽은 높이를 비우면 천장 높이를 쓴다. 겹·면(양면 가벽 2, 2겹 2, 양면 2겹 4)은 석고에만 곱하고 각재 틀은 한 번만 센다. */
document.head.insertAdjacentHTML("beforeend", "<style>.addrow{flex-wrap:wrap;row-gap:6px}.addrow select{max-width:100%}.addrow label{flex-wrap:wrap}</style>");
const SG_M2 = 1.62, WOOD_KINDS = ["천장", "가벽", "벽 평탄화", "단열 벽", "아트월", "기타"], WOOD_LINE = { "천장": "flatCeil", "가벽": "wall", "벽 평탄화": "flatWall", "단열 벽": "insul", "아트월": "artwall" };
const woodH = () => Math.round((+E.ceilH > 0 ? +E.ceilH : D.layout.ceilH) * 1000);
const woodRow = r => { const kind = r.kind || "천장", h = +r.h > 0 ? +r.h : (kind === "천장" ? 0 : woodH()), ok = +r.w > 0 && h > 0, a = ok ? r.w * h / 1e6 : 0, m = +r.m > 0 ? +r.m : 1; return { kind, h, ok, a, m, sg: a * m / SG_M2 } };
function woodLossPct() { return E.woodLoss === "" || E.woodLoss == null || !(+E.woodLoss >= 0) ? 10 : +E.woodLoss }   // 로스율: 비워 두면 10%, 0 을 넣으면 0%
function ceilCalc() { return woodCalcOf(E.ceilList || [], woodLossPct()) }
function woodCalcOf(list, loss) {                     // 치수 줄 목록 → 석고보드·각재 (목작업 치수 표와 챗봇 계산이 같은 식을 쓴다)
  const rows = list.map(woodRow).filter(x => x.ok), a = rows.reduce((s, x) => s + x.a * x.m, 0), fa = rows.reduce((s, x) => s + x.a, 0), up = v => Math.ceil(v * (1 + loss / 100) - 1e-9);
  const raw = a / SG_M2, sg = up(raw), fsg = up(fa / SG_M2), gj = fsg * 3, by = {}; for (const x of rows) by[x.kind] = (by[x.kind] || 0) + x.a * x.m;
  return { n: rows.length, a, fa, ja: a * 1e6 / 90000, raw, loss, sg, fsg, gj, dan: Math.ceil(gj / 12), by };
}
function ceilSumHtml() {
  const c = ceilCalc(); if (!c.n) return '<div class="note">치수를 넣으면 여기에 계산이 나옵니다.</div>';
  const sgL = woodTot(/^석고보드/), gjL = woodTot(/^각재/), kinds = Object.entries(c.by);
  return `${kinds.length > 1 ? `<div class="note">${kinds.map(([k, v]) => `${esc(k)} ${v.toFixed(2)}㎡`).join(" · ")}</div>` : ""}
    <div>석고 붙는 면적 <b>${c.a.toFixed(2)}㎡</b> (${c.ja.toFixed(1)}자평) ÷ 1.62 = 석고보드 ${c.raw.toFixed(2)}장 → 로스 ${c.loss}% 더해 <b class="ok">${c.sg}장</b></div>
    <div>각재 = ${c.fa !== c.a ? `틀 면적 ${c.fa.toFixed(2)}㎡ → ` : ""}${c.fsg}장 × 3개 = ${c.gj}개 ÷ 12 = <b class="ok">${c.dan}단</b> <span class="note">(한치각 12자, 12개 1단${c.fa !== c.a ? " · 겹·면이 늘어도 틀은 한 번만 셉니다" : ""})</span></div>
    <div class="note">${sgL && gjL ? `아래 ‘목재·석고보드’에는 커튼박스·몰딩 보강 등 다른 목공분이 더해져 석고보드 ${sgL.qty}장 · 각재 ${gjL.qty}단으로 들어갑니다.` : (D._woodSet ? "견적에는 아래 ‘목공 작업표’의 자재 ○식으로 들어갑니다. 식 수는 이 치수로 계산한 자재 금액을 1식 금액으로 나눈 값(반올림)이고, 고칠 수 있습니다." : "‘목재·석고보드’를 켜야 견적에 들어갑니다.")}</div>`;
}
function woodWalls() {                                // 도면의 벽 목록: 실측 길이가 있으면 그 값, 없으면 (프로그램 도면일 때) 추정 길이
  const L = E.planImg && !hasBox() ? null : curLayout(R.S); if (!L) return []; const out = [];
  for (const r of L.rects) { if (r.s.type === "발코니") continue; for (const sd of SIDES) { if ((r.inner || {})[sd]) continue;
    const v = +(E.wallLen || {})[r.k + "|" + sd], len = v > 0 ? v : !L.img ? Math.round((sd === "N" || sd === "S" ? r.w : r.h) / (L.k || 1) * 100) * 10 : 0;
    out.push({ k: r.k + "|" + sd, nm: r.s.name.replace(/ \(.*\)/, "") + " " + SIDE_NAME[sd], len, meas: v > 0 }) } }
  return out;
}
function ceilCard() {
  const rs = E.ceilList || [], H = woodH(); if (!lineById("flatCeil")) return ""; const walls = woodWalls();
  return `<div class="pgroup"><h3>목작업 치수 (천장·벽) — 석고보드·각재 자동 계산 <span class="note">석고보드 = 면적 ÷ 1.62㎡ (= 자평수 ÷ 18) · 각재(한치각 12자) = 석고 1장당 3개, 12개 1단 · 벽은 길이만 넣으면 높이는 천장 높이 ${H.toLocaleString("ko-KR")}mm</span></h3>
    ${rs.length ? `<div class="tbl"><table><thead><tr><th>종류</th><th>위치</th><th class="num">가로·길이 mm</th><th class="num">세로·높이 mm</th><th class="num">겹·면</th><th class="num">면적 ㎡</th><th class="num">석고 환산 (장)</th><th></th></tr></thead><tbody>
      ${rs.map(r => { const x = woodRow(r), wall = x.kind !== "천장";
        return `<tr data-ceil="${r.id}"><td><select data-cf="kind">${WOOD_KINDS.map(k => `<option ${x.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></td><td><input data-cf="name" value="${esc(r.name || "")}" placeholder="${wall ? "안방 창쪽 벽" : "거실"}" style="width:120px"></td>
          <td class="num"><input class="q" type="number" min="0" step="10" data-cf="w" value="${r.w ?? ""}"></td><td class="num"><input class="q" type="number" min="0" step="10" data-cf="h" value="${r.h ?? ""}" placeholder="${wall ? H : ""}"></td>
          <td class="num"><input class="q" type="number" min="1" max="4" step="1" data-cf="m" value="${r.m ?? ""}" placeholder="1" style="width:54px"></td><td class="num" data-ca>${x.ok ? (x.a * x.m).toFixed(2) : ""}</td><td class="num note" data-cs>${x.ok ? x.sg.toFixed(2) : ""}</td><td><button type="button" class="btn ghost sm" data-ceildel="${r.id}">삭제</button></td></tr>` }).join("")}
      </tbody></table></div><div class="scope" id="ceilSum" style="padding:6px 14px">${ceilSumHtml()}</div>`
      : '<p class="note" style="padding:0 14px">천장은 가로·세로, 벽은 길이만 넣으세요(높이는 천장 높이). 넣지 않으면 지금처럼 어림값(천장은 거실 넓이의 60%, 가벽 7㎡, 아트월 6㎡)으로 계산합니다.</p>'}
    <div class="addrow"><button type="button" class="btn sm" data-ceiladd="천장">+ 천장</button><button type="button" class="btn sm" data-ceiladd="가벽">+ 벽</button><button type="button" class="btn ghost sm" data-ceilrooms>도면의 방 천장 모두 가져오기</button>
      ${walls.length ? `<select data-woodwall aria-label="도면의 벽에서 고르기" style="max-width:220px"><option value="">도면의 벽에서 고르기…</option>${walls.map(w => `<option value="${esc(w.k)}">${esc(w.nm)} ${w.len ? w.len.toLocaleString("ko-KR") + "mm" + (w.meas ? " 실측" : " 추정") : "(길이 없음)"}</option>`).join("")}</select>` : ""}
      <label class="note" style="display:inline-flex;align-items:center;gap:6px;margin-left:8px">목자재 로스율 <input class="q" type="number" min="0" max="50" step="1" id="woodLoss" value="${woodLossPct()}" style="width:64px"> %</label>
      ${rs.length ? '<button type="button" class="btn ghost sm" data-ceilclear>치수 모두 지우기 (원래 어림 계산으로)</button>' : ""}</div>
    ${rs.length ? '<p class="note" style="padding:0 14px">겹·면: 한 면 1겹이면 비워 두고, 양면 가벽은 2, 2겹은 2, 양면 2겹은 4를 넣습니다. 석고에만 곱하고 각재 틀은 한 번만 셉니다. 종류를 넣으면 그 공사 줄(천장 평평하게·가벽·벽 평탄화·단열·아트월)이 켜집니다.</p>' : ""}</div>`;
}
function ceilRoomRows() {                             // 도면의 거실·주방·방 → 천장 치수 줄 (실측값이 없으면 도면 추정 치수)
  const L = E.planImg ? null : planLayout(R.S), r10 = v => Math.round(v / 10) * 10; let est = 0;
  const rows = R.S.list.filter(s => ["거실", "주방", "방"].includes(s.type)).map((s, k) => { const m = (E.dim || {})[s.id] || {}, q = L && L.rects.find(x => x.s.id === s.id && !x.sub), ok = +m.w > 0 && +m.d > 0; if (!ok) est++;
    return { id: Date.now().toString(36) + k, kind: "천장", name: s.name.replace(/ \(.*\)/, ""), w: ok ? r10(m.w * 1000) : q ? r10(q.w / (L.k || 1) * 1000) : "", h: ok ? r10(m.d * 1000) : q ? r10(q.h / (L.k || 1) * 1000) : "", m: "" } });
  return { rows, est };
}
function ceilSync() {                                 // 치수가 들어온 종류의 공사 줄과 목자재 줄을 켠다. 단열 벽은 면 수도 맞춘다
  const rows = (E.ceilList || []).map(woodRow).filter(x => x.ok); if (rows.length) { const l = lineById("woodMat"); if (l && !lnState(l).on) setLn(l, { on: true }) }
  for (const k of new Set(rows.map(x => x.kind))) { const l = WOOD_LINE[k] && lineById(WOOD_LINE[k]); if (l && !lnState(l).on) setLn(l, { on: true }) }
  const ins = lineById("insul"), n = rows.filter(x => x.kind === "단열 벽").length;
  if (ins) { if (n) { setLn(ins, { on: true, q: n }); E.woodInsQ = true } else if (E.woodInsQ) { setLn(ins, { q: undefined }); delete E.woodInsQ } }
}
document.addEventListener("click", ev0 => {
  const t = ev0.target; if (!t.closest) return; const del = t.closest("[data-ceildel]"), add = t.closest("[data-ceiladd]"); E.ceilList = E.ceilList || [];
  if (add) E.ceilList.push({ id: Date.now().toString(36), kind: add.dataset.ceiladd, name: "", w: "", h: "", m: "" });
  else if (del) E.ceilList = E.ceilList.filter(r => r.id !== del.dataset.ceildel);
  else if (t.closest("[data-ceilclear]")) E.ceilList = [];
  else if (t.closest("[data-ceilrooms]")) { const { rows: add2, est } = ceilRoomRows();
    E.ceilList = E.ceilList.filter(r => (r.kind || "천장") !== "천장").concat(add2);
    ceilSync(); refresh(); toast(est ? `방 ${add2.length}곳의 천장을 가져왔습니다. ${est}곳은 실측값이 없어 도면 추정 치수이니 실측값으로 고쳐 주세요.` : `방 ${add2.length}곳의 실측 치수를 가져왔습니다.`); return }
  else return;
  ceilSync(); refresh();
  if (add) { const nr = E.ceilList[E.ceilList.length - 1], row = nr && document.querySelector('[data-ceil="' + nr.id + '"]'); if (row) row.querySelector('[data-cf="name"]').focus() }
});
const ceilEdit = ev0 => {
  const el = ev0.target; if (!el || !el.dataset) return;
  if (el.dataset.woodwall !== undefined) { if (ev0.type !== "change" || !el.value) return; const w = woodWalls().find(x => x.k === el.value); if (!w) return;   // 도면의 벽을 골라 줄로 넣는다 (종류는 줄에서 바꿀 수 있음)
    const wk = WOOD_KINDS.includes(el.dataset.wkind) ? el.dataset.wkind : "벽 평탄화"; (E.ceilList = E.ceilList || []).push({ id: Date.now().toString(36), kind: wk, name: w.nm, w: w.len || "", h: "", m: "" }); ceilSync(); refresh(); toast(`${w.nm}을(를) ‘${wk}’ 치수로 넣었습니다.`); return }
  const isLoss = el.id === "woodLoss"; if (!isLoss && el.dataset.cf === undefined) return;
  if (isLoss) E.woodLoss = el.value === "" ? "" : Math.max(0, Math.min(50, +el.value));
  else { const tr = el.closest("[data-ceil]"), r = (E.ceilList || []).find(x => x.id === tr.dataset.ceil); if (!r) return; const k = el.dataset.cf; r[k] = k === "name" || k === "kind" ? el.value : (el.value === "" ? "" : +el.value);
    const x = woodRow(r); tr.querySelector("[data-ca]").textContent = x.ok ? (x.a * x.m).toFixed(2) : ""; tr.querySelector("[data-cs]").textContent = x.ok ? x.sg.toFixed(2) : "" }
  ceilSync(); R = compute(); renderSummary(); save(); const s = document.getElementById("ceilSum"); if (s) s.innerHTML = ceilSumHtml();
  if (ev0.type === "change") setTimeout(() => {      // 아래 목공 줄까지 다시 그리되, 옮겨 간 입력 칸은 그대로 잡아 둔다
    const a = document.activeElement, row = a && a.closest && a.closest("[data-ceil]"), id = row && row.dataset.ceil, cf = row && a.dataset.cf, loss = a && a.id === "woodLoss";
    refresh(); const n = loss ? document.getElementById("woodLoss") : id ? document.querySelector(`[data-ceil="${id}"] [data-cf="${cf}"]`) : null; if (n) n.focus();
  }, 0);
};
document.addEventListener("input", ceilEdit); document.addEventListener("change", ceilEdit);
/* ───── 3D 보기: 지금 도면을 세워서 본다 (끌어서 돌리기). 공정을 고르면 그 공정의 바닥·벽 공사 범위가 색으로 보인다 ───── */
const V3 = { a: 28, e: 55, full: false }; let PLAN_3D = false, P3_DRAG = null;
function plan3dSvg(step, o = {}) {
  const g = planGeom(), L = g.L; if (!L || !L.rects.length) return "";
  const one = !!STEP_COLOR[step], col = STEP_COLOR[step] || "#2d6a58", hit = one ? stepRooms(step) : {}, skip = one ? ((E.skip || {})[step] || {}) : {}, surf = one ? stepSurf(step) : {}, sw = one ? ((E.skipW || {})[step] || {}) : {};
  const seen = new Set(), aU = L.rects.reduce((a, r) => a + (+r.s.A > 0 ? (r.pa || r.w * r.h) : 0), 0); let aM = 0; for (const r of L.rects) if (!seen.has(r.s.id)) { seen.add(r.s.id); aM += +r.s.A || 0 }
  const u = aM > 0 ? Math.sqrt(aU / aM) : (L.k || 1), Hc = (+E.ceilH > 0 ? +E.ceilH : D.layout.ceilH) * u, Hw = Hc * (V3.full && !o.doc ? 1 : 0.5);   // u = 도면에서 1m 의 길이
  const cx = L.W / 2, cy = L.H / 2, th = (o.doc ? 28 : V3.a) * Math.PI / 180, el = (o.doc ? 58 : V3.e) * Math.PI / 180, ct = Math.cos(th), sn = Math.sin(th), se = Math.sin(el), ce = Math.cos(el), f = n => n.toFixed(1);
  const P = (x, y, z) => { const dx = x - cx, dy = y - cy, yr = dx * sn + dy * ct; return [(dx * ct - dy * sn) * 40, (yr * se - z * ce) * 40, yr] };   // [화면 x, 화면 y, 깊이(클수록 앞)]
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const poly = (pts, attr) => { for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1] } return `<polygon points="${pts.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" ${attr}/>` };
  const dep = pts => pts.reduce((a, p) => a + p[2], 0) / pts.length;
  const box = (x, y, w, d, z0, z1, fill, top) => {    // 상자(가구): 옆면을 뒤에서 앞으로, 마지막에 윗면
    const c = (i, z) => P(x + (i === 1 || i === 2 ? w : 0), y + (i >= 2 ? d : 0), z), sd = [];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4, q = [c(i, z0), c(j, z0), c(j, z1), c(i, z1)]; sd.push([dep(q), poly(q, `fill="${fill}" stroke="#6b5d48" stroke-width="0.7"`)]) }
    sd.sort((a, b) => a[0] - b[0]); return sd.map(q => q[1]).join("") + poly([0, 1, 2, 3].map(i => c(i, z1)), `fill="${top || fill}" stroke="#6b5d48" stroke-width="0.7"`);
  };
  const floors = [], faces = [], labels = [], shp = !o.doc || E.posDoc ? posMarks().filter(m => !m.only) : [];   // (v63) 위치·가구 표시도 입체로 (고객 견적서의 조감도에는 ‘고객 견적서 도면에도 넣기’를 켰을 때만)
  for (const r of L.rects) {
    const s = r.s, sf = surf[s.id] || {}, hl = hit[s.id], out = hl && skip[s.id] && !sf.opt, t = s.type, w0 = sw[s.id] || {}, fOn = hl && !out && (sf.floor || sf.ceil);
    const fl = r.poly ? r.poly.map(q => P(q[0], q[1], 0)) : [P(r.x, r.y, 0), P(r.x + r.w, r.y, 0), P(r.x + r.w, r.y + r.h, 0), P(r.x, r.y + r.h, 0)];
    floors.push([dep(fl), poly(fl, `fill="${out ? "#aab0aa" : fOn ? col : t === "욕실" ? "#dfecf2" : t === "발코니" ? "#e9e9e1" : t === "현관" ? "#efe9df" : "#f6f1e6"}" fill-opacity="${fOn ? 0.45 : out ? 0.6 : 1}" stroke="#8b948e" stroke-width="0.8"`)]);
    if (r.poly) { const pp = r.poly, cw = pp.reduce((a, q, i) => { const n = pp[(i + 1) % pp.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0) > 0 ? 1 : -1;   // (v63) 점으로 그린 방 · 둥근 방: 벽을 찍은 모양 그대로 세운다 (전에는 감싸는 네모로 세웠다)
      pp.forEach((a, i) => { const b = pp[(i + 1) % pp.length], ln = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!(ln > 0)) return; const nx = (b[1] - a[1]) * cw / ln, ny = (a[0] - b[0]) * cw / ln;
        if (nx * sn + ny * ct > 0.02) return;         // 보는 쪽을 향한 벽은 그리지 않는다
        const q = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], Hw), P(a[0], a[1], Hw)], wOn = hl && !out && sf.wall && !w0[r.k + "|" + (r.es || [])[i]];
        faces.push([dep(q) - 0.01, poly(q, `fill="${wOn ? col : "#eceee9"}" fill-opacity="${wOn ? 0.62 : 0.96}" stroke="#2f3834" stroke-width="${pp.length > 12 ? 0.4 : 0.9}"`)]) }) }
    else for (const sd of SIDES) { if ((r.inner || {})[sd]) continue;
      const [ax, ay, bx, by, nx, ny] = sd === "N" ? [r.x, r.y, r.x + r.w, r.y, 0, -1] : sd === "S" ? [r.x, r.y + r.h, r.x + r.w, r.y + r.h, 0, 1] : sd === "W" ? [r.x, r.y, r.x, r.y + r.h, -1, 0] : [r.x + r.w, r.y, r.x + r.w, r.y + r.h, 1, 0];
      if (nx * sn + ny * ct > 0.02) continue;          // 보는 쪽을 향한 벽은 그리지 않는다 (방 안이 보이게)
      const q = [P(ax, ay, 0), P(bx, by, 0), P(bx, by, Hw), P(ax, ay, Hw)], wOn = hl && !out && sf.wall && !w0[r.k + "|" + sd];
      let sv = poly(q, `fill="${wOn ? col : "#eceee9"}" fill-opacity="${wOn ? 0.62 : 0.96}" stroke="#2f3834" stroke-width="0.9"`);
      if (r.win === sd) { const z0 = Math.min(0.9 * u, Hw * 0.45), z1 = Math.min(2.1 * u, Hw * 0.94), pt = (k, z) => P(ax + (bx - ax) * k, ay + (by - ay) * k, z); sv += poly([pt(0.2, z0), pt(0.8, z0), pt(0.8, z1), pt(0.2, z1)], 'fill="#cfe8f7" stroke="#4a9fd8" stroke-width="1.2"') }
      faces.push([dep(q) - 0.01, sv]);
    }
    if (r.fx === "kitchen" && !shp.some(m => /싱크/.test(m.t || ""))) { const h = furnH((E.furn || []).find(q => q.lid === "sink") || {}), m = 0.06 * u, top = (h.hl + h.hg + h.hu) / 1000 * u;   // 싱크대: 가구 치수 목록의 하부장·상부장 높이대로 (도면에 싱크대 모양을 직접 놓았으면 그것만 그린다)
      faces.push([P(r.x + r.w / 2, r.y + 0.3 * u, 0)[2], box(r.x + m, r.y + m, r.w - 2 * m, 0.6 * u, 0, h.hl / 1000 * u, "#e2d6bf", "#6a6e6c") + (Hw >= top - 0.01 ? box(r.x + m, r.y + m, r.w - 2 * m, 0.35 * u, (h.hl + h.hg) / 1000 * u, top, "#efe7d6") : "")]) }
    if (!r.sub) { const c = P(r.x + r.w / 2, r.y + r.h / 2, 0), nm = t === "발코니" ? s.name : s.name.replace(/ \(.*\)/, "").replace("·공용부", "").replace("·전실", "");
      labels.push(`<text x="${f(c[0])}" y="${f(c[1] + 4)}" text-anchor="middle" font-size="11" font-weight="700" fill="${out ? "#b3261e" : "#1c2320"}" stroke="#ffffff" stroke-width="3" paint-order="stroke" pointer-events="none">${esc(nm)}${out ? " ✕" : ""}</text>`) }
  }
  { const ux = v => (v * g.vw - PPAD) / PK, uy = v => (v * g.vh - PPAD) / PK, tag = (c, t, col2) => `<text x="${f(c[0])}" y="${f(c[1] + 3)}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${col2}" stroke="#ffffff" stroke-width="2.6" paint-order="stroke" pointer-events="none">${esc(t.length > 9 ? t.slice(0, 9) + "…" : t)}</text>`;
    /* (v63) 도면에 놓은 가구·설비 모양을 세운다. 높이(m)는 이름으로 정한다 — 싱크대·아일랜드는 허리 높이, 붙박이장·키큰장·신발장은 천장 가까이, 목록에 없는 공간(보조 주방 등)은 바닥에 색만 */
    const H3 = t => POS_ROOM.includes(t) ? [0.03, "#bfe3da", "#bfe3da"] : /싱크/.test(t) ? [0.85, "#e2d6bf", "#6a6e6c"] : /붙박이|키큰장|냉장고장|신발장|장롱|옷장/.test(t) ? [2.2, "#e2d6bf", "#efe7d6"] : /아일랜드|식탁/.test(t) ? [0.85, "#e2d6bf", "#f4efe4"] : /화장대|책상|책장/.test(t) ? [0.75, "#e2d6bf", "#efe7d6"] : /욕조/.test(t) ? [0.55, "#f4f7f8", "#dfecf2"] : /샤워/.test(t) ? [1.9, "#cfe8f7", "#e6f3fb"] : [0.9, "#e2d6bf", "#efe7d6"];
    for (const mk of shp) {
      if (mk.shape) { const [hm, fill, topc] = H3(mk.t || ""), z1 = Math.min(hm * u, Hc), glass = /샤워/.test(mk.t || "");
        for (const pg of mk.shape) { const pp = pg.map(q => [ux(q[0]), uy(q[1])]); if (pp.length < 3) continue; const cw = pp.reduce((a, q, i) => { const n = pp[(i + 1) % pp.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0) > 0 ? 1 : -1, sd = [];
          pp.forEach((a, i) => { const b = pp[(i + 1) % pp.length], nx = (b[1] - a[1]) * cw, ny = (a[0] - b[0]) * cw; if (nx * sn + ny * ct <= 0) return;   // 가구는 보는 쪽 옆면만 그린다
            const q = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], z1), P(a[0], a[1], z1)]; sd.push([dep(q), poly(q, `fill="${fill}" fill-opacity="${glass ? 0.45 : 1}" stroke="#6b5d48" stroke-width="0.7"`)]) });
          sd.sort((a, b) => a[0] - b[0]); const tp = pp.map(q => P(q[0], q[1], z1));
          faces.push([dep(tp), sd.map(q => q[1]).join("") + poly(tp, `fill="${topc}" fill-opacity="${glass ? 0.4 : 1}" stroke="#6b5d48" stroke-width="0.7"`)]) }
        const all = mk.shape.flat(), mx = (Math.min(...all.map(q => q[0])) + Math.max(...all.map(q => q[0]))) / 2, my = (Math.min(...all.map(q => q[1])) + Math.max(...all.map(q => q[1]))) / 2, c0 = mk.shape.length > 1 ? [mx, my] : polyMid(mk.shape[0]);
        labels.push(tag(P(ux(c0[0]), uy(c0[1]), mk.shape.length > 1 ? 0 : z1), mk.t || "", "#3a2f1d")) }
      else if (mk.line && mk.line.length > 1) { const wall3 = /가벽|벽체/.test(mk.t || ""), c = markCol(mk);
        mk.line.forEach((q, i) => { if (!i) return; const p0 = mk.line[i - 1], a = [ux(p0[0]), uy(p0[1])], b = [ux(q[0]), uy(q[1])];
          if (wall3) { const w4 = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], Hw), P(a[0], a[1], Hw)]; faces.push([dep(w4), poly(w4, `fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="1.2"`)]) }
          else { const A = P(a[0], a[1], 0.02 * u), B = P(b[0], b[1], 0.02 * u); faces.push([(A[2] + B[2]) / 2 - 0.5, `<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}" stroke="${c}" stroke-width="2.6" stroke-linecap="round"${mk.dash ? ' stroke-dasharray="6 4"' : ""}/>`]) } }) }
      else if (mk.x !== undefined && mk.y !== undefined) { const c = P(ux(mk.x), uy(mk.y), 0.02 * u); labels.push(`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="3.2" fill="${markCol(mk)}" stroke="#ffffff" stroke-width="1.2"/>` + tag([c[0], c[1] - 9], mk.t || "", markCol(mk))) }
    } }
  let tops = "";
  if (step === "s5" || !one) for (const t of ltList()) { if (t.k === "plug") continue; const ux = v => (v * g.vw - PPAD) / PK, uy = v => (v * g.vh - PPAD) / PK, a = P(ux(t.x), uy(t.y), Hw);
    if (ltIsLine(t.k)) { const b2 = P(ux(t.x2), uy(t.y2), Hw); tops += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b2[0])}" y2="${f(b2[1])}" stroke="${t.k === "mag" ? "#1c2320" : "#f0b400"}" stroke-width="3.5" stroke-linecap="round"/>` }
    else if (t.k === "fan") { const pts = []; for (let i = 0; i < 16; i++) { const q = i / 16 * 2 * Math.PI, p = P(ux(t.x) + Math.cos(q) * 0.65 * u, uy(t.y) + Math.sin(q) * 0.65 * u, Hw); pts.push(f(p[0]) + "," + f(p[1])) }
      tops += `<polygon points="${pts.join(" ")}" fill="#ffffff" fill-opacity="0.6" stroke="#b98a00" stroke-width="1.2" stroke-dasharray="3 3"/>`;
      for (const dg of [90, 210, 330]) { const q = dg * Math.PI / 180, p = P(ux(t.x) + Math.cos(q) * 0.6 * u, uy(t.y) + Math.sin(q) * 0.6 * u, Hw); tops += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(p[0])}" y2="${f(p[1])}" stroke="#b98a00" stroke-width="3" stroke-linecap="round"/>` } }
    else tops += `<circle cx="${f(a[0])}" cy="${f(a[1])}" r="${t.k === "down" ? 2.6 : 4.2}" fill="#ffe27a" stroke="#b98a00" stroke-width="1"/>`;
  }
  floors.sort((a, b) => a[0] - b[0]); faces.sort((a, b) => a[0] - b[0]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x0 - 10)} ${f(y0 - 10)} ${f(x1 - x0 + 20)} ${f(y1 - y0 + 20)}"${o.doc ? "" : ` data-p3d="${step}" style="height:100%;cursor:grab;touch-action:none;user-select:none"`} role="img" aria-label="3D 도면">${floors.map(q => q[1]).join("")}${faces.map(q => q[1]).join("")}${tops}${labels.join("")}</svg>`;
}
document.addEventListener("pointerdown", ev0 => { const w = ev0.target.closest && ev0.target.closest("[data-p3dwrap]"); if (!w || ev0.button > 0) return; P3_DRAG = { w, x: ev0.clientX, y: ev0.clientY, a: V3.a, e: V3.e }; ev0.preventDefault(); try { w.setPointerCapture(ev0.pointerId) } catch (e) {} });
document.addEventListener("pointermove", ev0 => { const d = P3_DRAG; if (!d) return; V3.a = d.a - (ev0.clientX - d.x) * 0.5; V3.e = Math.min(85, Math.max(20, d.e + (ev0.clientY - d.y) * 0.3)); d.w.innerHTML = plan3dSvg(d.w.dataset.p3dwrap) });
const p3End = () => { P3_DRAG = null }; document.addEventListener("pointerup", p3End); document.addEventListener("pointercancel", p3End);
document.addEventListener("click", ev0 => {
  const t = ev0.target; if (t.closest("[data-p3dtoggle]")) { PLAN_3D = !PLAN_3D; renderChecklist() }
  else if (t.closest("[data-p3dh]")) { V3.full = !V3.full; renderChecklist(); if ($("#info") && BASE_3D) renderInfo() }
  else if (t.closest("[data-p3dturn]")) { V3.a += 90 * +t.closest("[data-p3dturn]").dataset.p3dturn; document.querySelectorAll("[data-p3dwrap]").forEach(w => w.innerHTML = plan3dSvg(w.dataset.p3dwrap)) }
});
/* ───── 조명 배치: 실링팬·매입등·펜던트는 눌러서, 라인조명·마그네틱 레일은 끌어서 도면에 놓는다. 개수·길이가 조명 줄의 수량이 된다 ───── */
const LT_KINDS = { fan: ["실링팬", "fan"], down: ["매입등", "down"], pendant: ["펜던트", "pendant"], line: ["라인조명", "line"], mag: ["마그네틱 레일", "magRail"], plug: ["콘센트 증설", "circuit"] };   // 종류: [이름, 조명 줄 id]
let LT_SEL = null, LT_KIND = "fan", LT_DRAG = null;
const ltIsLine = k => k === "line" || k === "mag", ltList = () => (E.lights || []).filter(t => !!t.img === !!E.planImg), ltLen = (t, G) => G.pm ? Math.hypot((t.x2 - t.x) * G.vw, (t.y2 - t.y) * G.vh) / G.pm : 0;
function ltSvg(g, o) {
  const G = ltGeom(R.S), fs = Math.max(7, g.vw / 60), f = n => n.toFixed(1), ed = !!o.edit && !o.m2 && PLAN_MODE.s5 === 2, col = "#b98a00"; let b = "";
  for (const t of ltList()) {
    const x = t.x * g.vw, y = t.y * g.vh, sel = ed && LT_SEL === t.id, at = ed ? `data-lt="${t.id}" style="cursor:move;touch-action:none"` : 'pointer-events="none"';
    if (ltIsLine(t.k)) { const x2 = t.x2 * g.vw, y2 = t.y2 * g.vh, len = ltLen(t, G), mag = t.k === "mag", ln = (st, w, ex) => `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${st}" stroke-width="${f(w)}" stroke-linecap="round" ${ex || ""}/>`;
      b += `<g ${at}>${ln("transparent", fs * 2)}${sel ? ln("#2f7fb8", fs * 1.5, 'stroke-opacity="0.35"') : ""}${ln(mag ? "#1c2320" : "#f0b400", fs * 0.62)}${mag ? ln("#ffffff", fs * 0.2, `stroke-dasharray="${f(fs * 0.4)} ${f(fs * 1.1)}" pointer-events="none"`) : ln("#fff7d6", fs * 0.2, 'pointer-events="none"')}`
        + `<text x="${f((x + x2) / 2)}" y="${f((y + y2) / 2 - fs * 0.75)}" text-anchor="middle" font-size="${f(fs * 0.95)}" font-weight="700" fill="${o.m2 ? "#1c2320" : "#0b3d91"}" stroke="#ffffff" stroke-width="${f(fs / 4)}" paint-order="stroke" pointer-events="none">${mag ? "마그네틱" : "라인"}${!o.m2 && len ? " " + len.toFixed(1) + "m" : ""}</text>`
        + (ed ? `<circle data-lth="1" cx="${f(x)}" cy="${f(y)}" r="${f(fs * 0.62)}" fill="#ffffff" stroke="#2f7fb8" stroke-width="1.5" style="cursor:crosshair"/><circle data-lth="2" cx="${f(x2)}" cy="${f(y2)}" r="${f(fs * 0.62)}" fill="#ffffff" stroke="#2f7fb8" stroke-width="1.5" style="cursor:crosshair"/>` : "") + "</g>";
    } else { const r = t.k === "fan" ? fs * 1.9 : t.k === "pendant" ? fs * 0.85 : t.k === "plug" ? fs * 0.7 : fs * 0.55; let s = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + fs * 0.5)}" fill="${sel ? "#2f7fb8" : "transparent"}" fill-opacity="0.3"/>`;
      if (t.k === "fan") { s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#ffffff" fill-opacity="0.75" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
        for (const a of [90, 210, 330]) { const q = a * Math.PI / 180; s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(q) * r * 0.92)}" y2="${f(y - Math.sin(q) * r * 0.92)}" stroke="${col}" stroke-width="${f(fs * 0.5)}" stroke-linecap="round"/>` }
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(fs * 0.4)}" fill="#ffffff" stroke="${col}" stroke-width="1.5"/><text x="${f(x)}" y="${f(y + r + fs)}" text-anchor="middle" font-size="${f(fs * 0.9)}" font-weight="700" fill="#1c2320" stroke="#ffffff" stroke-width="${f(fs / 4)}" paint-order="stroke" pointer-events="none">실링팬</text>` }
      else if (t.k === "plug") s += `<rect x="${f(x - r)}" y="${f(y - r)}" width="${f(2 * r)}" height="${f(2 * r)}" rx="${f(r * 0.3)}" fill="#ffffff" stroke="#c0392b" stroke-width="1.5"/><circle cx="${f(x - r * 0.38)}" cy="${f(y)}" r="${f(r * 0.17)}" fill="#c0392b"/><circle cx="${f(x + r * 0.38)}" cy="${f(y)}" r="${f(r * 0.17)}" fill="#c0392b"/>`;
      else if (t.k === "pendant") s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#ffffff" stroke="${col}" stroke-width="1.5"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.45)}" fill="${col}"/>`;
      else s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#ffe27a" stroke="${col}" stroke-width="1.3"/>`;
      b += `<g ${at}>${s}</g>`; }
  }
  return b;
}
function lightPanel() {
  const G = ltGeom(R.S), ls = ltList(), sel = ls.find(t => t.id === LT_SEL);
  const sum = k => { const a = ls.filter(t => t.k === k); return !a.length ? "" : ltIsLine(k) ? (G.pm ? r1(a.reduce((s, t) => s + ltLen(t, G), 0)) + "m" : a.length + "줄") : a.length + "개" };
  return `<div class="howto"><b>종류를 고르고 도면을 누르면</b> 그 자리에 놓입니다(실링팬·매입등·펜던트·콘센트). <b>라인조명·마그네틱 레일은 끌어서</b> 길이만큼 그립니다. 놓은 조명은 <b>끌어서 옮기고</b>, 선 끝의 흰 점을 끌어 길이를 바꿉니다. 눌러서 고른 뒤 ‘삭제’(또는 Delete 키).</div>
    <div class="layers" style="margin-bottom:6px">${Object.entries(LT_KINDS).map(([k, [nm]]) => `<button type="button" data-ltkind="${k}" aria-pressed="${LT_KIND === k}" style="opacity:1;${LT_KIND === k ? "background:var(--accent);color:var(--accent-ink);border-color:var(--accent)" : ""}">${nm}${sum(k) ? ` · ${sum(k)}` : ""}</button>`).join("")}</div>
    ${!G.pm ? '<p class="note" style="margin:0 0 6px">이 도면은 방 영역이 지정되지 않아 길이를 잴 수 없습니다. 라인·마그네틱 길이는 아래 조명 줄에서 직접 넣으세요.</p>' : ""}
    ${sel ? `<div class="scope"><div><b class="ok">선택: ${LT_KINDS[sel.k][0]}</b>${ltIsLine(sel.k) && G.pm ? " " + ltLen(sel, G).toFixed(1) + "m" : ""} <button type="button" class="btn ghost sm" data-ltdel style="color:var(--warn)">삭제</button></div></div>` : ""}
    ${ls.length ? `<div class="scope"><div>놓은 조명 <b class="ok">${ls.length}개</b> — 개수·길이가 아래 조명 줄의 수량으로 들어갑니다. <button type="button" class="btn ghost sm" data-ltclear>모두 지우기 (원래 수량으로)</button></div></div>` : '<p class="note" style="margin:0 0 6px">아직 놓은 조명이 없습니다. 놓지 않으면 조명 줄은 원래 수량대로 계산됩니다.</p>'}`;
}
const ltPt = ev0 => { const svg = document.querySelector('svg[data-plan="s5"]'); if (!svg) return null; const b = svg.getBoundingClientRect(), c = v => Math.min(1, Math.max(0, v)); return { x: c((ev0.clientX - b.left) / b.width), y: c((ev0.clientY - b.top) / b.height), b } };
const ltRedraw = () => { const svg = document.querySelector('svg[data-plan="s5"]'); if (svg) svg.outerHTML = planSvg("s5", { edit: true }) };
const ltSnap = (t, end, b) => { const dx = (t.x2 - t.x) * b.width, dy = (t.y2 - t.y) * b.height;   // 거의 가로·세로면 반듯하게
  if (Math.abs(dy) < Math.abs(dx) * 0.12) { if (end === 2) t.y2 = t.y; else t.y = t.y2 } else if (Math.abs(dx) < Math.abs(dy) * 0.12) { if (end === 2) t.x2 = t.x; else t.x = t.x2 } };
document.addEventListener("pointerdown", ev0 => {
  if (PLAN_MODE.s5 !== 2 || ev0.button > 0 || !ev0.target.closest) return; const svg = ev0.target.closest('svg[data-plan="s5"]'); if (!svg || ev0.target.closest("g[data-mk]")) return;
  const p = ltPt(ev0), el = ev0.target.closest("g[data-lt]"), h = ev0.target.closest("[data-lth]"); E.lights = E.lights || [];
  const t = el && E.lights.find(q => q.id === el.dataset.lt);
  LT_DRAG = t ? { mode: h ? "end" + h.dataset.lth : "move", t, o: { ...t } } : { mode: "new", t: null };
  Object.assign(LT_DRAG, { p0: p, cx: ev0.clientX, cy: ev0.clientY, moved: false }); ev0.preventDefault();
});
document.addEventListener("pointermove", ev0 => {
  const d = LT_DRAG; if (!d) return; if (!d.moved && Math.hypot(ev0.clientX - d.cx, ev0.clientY - d.cy) < 5) return; d.moved = true;
  const p = ltPt(ev0); if (!p) return; const dx = p.x - d.p0.x, dy = p.y - d.p0.y, c = v => Math.min(1, Math.max(0, v));
  if (d.mode === "new") {
    if (!d.t) { d.t = { id: "L" + Date.now().toString(36), k: LT_KIND, x: d.p0.x, y: d.p0.y, img: !!E.planImg }; if (ltIsLine(LT_KIND)) { d.t.x2 = d.p0.x; d.t.y2 = d.p0.y } E.lights.push(d.t) }
    if (ltIsLine(d.t.k)) { d.t.x2 = p.x; d.t.y2 = p.y; ltSnap(d.t, 2, p.b) } else { d.t.x = p.x; d.t.y = p.y }
  } else if (d.mode === "move") { d.t.x = c(d.o.x + dx); d.t.y = c(d.o.y + dy); if (ltIsLine(d.t.k)) { d.t.x2 = c(d.o.x2 + dx); d.t.y2 = c(d.o.y2 + dy) } }
  else if (d.mode === "end1") { d.t.x = p.x; d.t.y = p.y; ltSnap(d.t, 1, p.b) } else { d.t.x2 = p.x; d.t.y2 = p.y; ltSnap(d.t, 2, p.b) }
  LT_SEL = d.t.id; ltRedraw();
});
const ltEnd = () => {
  const d = LT_DRAG; if (!d) return; LT_DRAG = null; MK_EAT = Date.now();
  if (d.mode === "new" && !d.moved) {                // 끌지 않고 눌렀다: 점 조명은 그 자리, 선 조명은 1.2m 가로선
    const G = ltGeom(R.S), t = { id: "L" + Date.now().toString(36), k: LT_KIND, x: d.p0.x, y: d.p0.y, img: !!E.planImg };
    if (ltIsLine(LT_KIND)) { const half = (G.pm ? 0.6 * G.pm : 0.08 * G.vw) / G.vw; t.x = Math.max(0, d.p0.x - half); t.x2 = Math.min(1, d.p0.x + half); t.y2 = t.y }
    E.lights.push(t); d.t = t;
  } else if (d.mode !== "new" && !d.moved) { LT_SEL = LT_SEL === d.t.id ? null : d.t.id; renderChecklist(); return }   // 눌러서 고르기
  if (d.t && ltIsLine(d.t.k) && Math.hypot(d.t.x2 - d.t.x, d.t.y2 - d.t.y) < 0.01) { E.lights = E.lights.filter(q => q !== d.t); d.t = null }
  if (d.t) { LT_SEL = d.t.id; const l = lineById(LT_KINDS[d.t.k][1]); if (l && !lnState(l).on) setLn(l, { on: true }) }
  refresh();
};
document.addEventListener("pointerup", ltEnd); document.addEventListener("pointercancel", ltEnd);
const ltDel = () => { if (!LT_SEL) return; E.lights = (E.lights || []).filter(t => t.id !== LT_SEL); LT_SEL = null; refresh() };
document.addEventListener("click", ev0 => {
  const t = ev0.target, k = t.closest("[data-ltkind]");
  if (k) { LT_KIND = k.dataset.ltkind; LT_SEL = null; renderChecklist() }
  else if (t.closest("[data-ltdel]")) ltDel();
  else if (t.closest("[data-ltclear]")) { E.lights = (E.lights || []).filter(q => !!q.img !== !!E.planImg); LT_SEL = null; refresh(); toast("도면의 조명을 모두 지웠습니다. 조명 줄은 원래 수량으로 돌아갑니다.") }
});
document.addEventListener("keydown", ev0 => { if (!LT_SEL || PLAN_MODE.s5 !== 2 || (ev0.key !== "Delete" && ev0.key !== "Backspace") || /INPUT|TEXTAREA|SELECT/.test((ev0.target.tagName || ""))) return; ev0.preventDefault(); ltDel() });
const p3dBar = () => `<button type="button" class="btn ghost sm" data-p3dturn="-1">◀ 돌리기</button><button type="button" class="btn ghost sm" data-p3dturn="1">돌리기 ▶</button><button type="button" class="btn ghost sm" data-p3dh>${V3.full ? "벽 낮춰 보기" : "벽 실제 높이로"}</button>`;
/* ───── 견적 검수: 견적서를 내보내기 전에 빠뜨리기 쉬운 것을 자동으로 찾아 준다 ───── */
function estCheck(steps) {
  const out = [], idx = k => Math.max(0, steps.findIndex(s => s.key === k)), all = Object.entries(D.stepLines || {}).flatMap(([sk, ls]) => ls.map(l => ({ sk, l, t: (l.label || "") + " " + l.items.join(" ") })));
  const on = all.filter(x => lnState(x.l).on), onT = on.map(x => x.t).concat((E.extras || []).map(x => x.item || x.name || "")).join(" | ");
  const stepOfProc = p => (steps.find(s => (s.procs || []).includes(p)) || {}).key;
  if (!(E.info.addr || E.info.bname)) out.push({ lv: 1, t: "현장 주소(단지명)가 비어 있습니다.", go: 0, wh: "현장 정보 › 고객·현장", at: { sel: '#info [data-info="addr"]', up: ".f", say: "현장 주소나 단지명을 적어 주세요." } });
  if (!String(E.info.dur ?? "").trim()) out.push({ lv: 2, t: `예상 공사 기간을 아직 정하지 않았습니다. (지금은 견적서에 자동 계산 ‘약 ${durAuto()}주’로 나갑니다)`, go: steps.length - 1, wh: "② 상세견적서 › 맨 위 ‘예상 공사 기간’", at: { doc: "dur", say: "공사 기간을 골라 주세요. 고객에게 설명할 기간입니다." } });   // (v86) 사용자: “실장들이 공사기간을 정해야 해 그래야 고객한테 설명하지”
  for (const l of R.tbd) { const sk = l.step || stepOfProc(l.proc); out.push({ lv: 1, t: `‘${aliasOf(l.name)}’ 단가가 없습니다. 견적서에 ‘별도 협의’로 나갑니다.`, go: idx(sk), wh: spotWh(steps, sk, l.lid), at: spotOfLine(l, "단가를 넣거나 종류를 바꾸세요. 그대로 두면 견적서에 ‘별도 협의’로 나갑니다.") }) }
  for (const l of R.lines) if (!l.extra && l.lid && !(l.qty > 0)) out.push({ lv: 1, t: `‘${aliasOf(l.name)}’ 수량이 0입니다. 수량을 넣거나 체크를 끄세요.`, go: idx(l.step), wh: spotWh(steps, l.step, l.lid), at: spotOfLine(l, "수량을 넣거나, 안 하는 공사면 체크를 끄세요.") });
  const wBad = w => (String(w.loc || "").trim() || +w.w > 0) && !(+w.price > 0), wn = (E.wins || []).filter(wBad).length; if (wn) out.push({ lv: 1, t: `창호 목록에 금액이 빈 창이 ${wn}개 있습니다.`, go: idx("s2"), wh: spotWh(steps, "s2", "", "창문(샷시) 교체 › 창호 목록"), at: { cat: "s2|window", h: "창호 목록", rowSel: "tbody tr", row: (E.wins || []).findIndex(wBad), say: "이 창의 금액 칸이 비어 있습니다." } });
  const fBad = f => furnIsJa(lineById(f.lid)) && !(+f.w > 0), fn = (E.furn || []).filter(fBad).length; if (fn) out.push({ lv: 1, t: `가구 치수에 가로가 빈 자리가 ${fn}개 있습니다.`, go: idx("s11"), ...(f => ({ wh: spotWh(steps, "s11", f.lid, "치수"), at: { cat: (c => c.cat ? c.sk + "|" + c.cat.key : "")(catOfLine(f.lid)), sel: '[data-furn="' + f.id + '"]', say: "가로 치수를 넣어 주세요." } }))((E.furn || []).find(fBad)) });
  const pair = (has, need, msg) => { if (!has.test(onT) || need.test(onT)) return; const tg = all.find(x => need.test(x.t)), ci = tg ? null : D.catalog.find(i => need.test(i.name)); if (!tg && !ci) return; const sk = tg ? tg.sk : stepOfProc(ci.proc);   // 빠진 짝이 있는 자리: 공사 줄이면 그 줄, 없으면 ‘추가 품목’의 그 품목
    out.push({ lv: 2, t: msg, go: sk ? idx(sk) : undefined, wh: sk ? spotWh(steps, sk, tg ? tg.l.id : "", tg ? "" : "추가 품목") : "", at: !sk ? undefined : tg ? { lid: tg.l.id, say: "이 줄을 체크하면 들어갑니다. 안 하는 현장이면 그대로 두세요." } : { name: ci.name, say: "체크하면 들어갑니다. 안 하는 현장이면 그대로 두세요." } }) };
  pair(/철거/, /폐기물|폐자재/, "철거 공사가 있는데 폐기물 처리가 없습니다.");
  pair(/욕실[^|]*타일|타일[^|]*욕실/, /방수/, "욕실 타일이 있는데 방수가 없습니다.");
  pair(/확장/, /단열/, "발코니 확장이 있는데 단열 공사가 없습니다.");
  pair(/확장/, /엑셀|난방 ?배관/, "발코니 확장이 있는데 난방 배관(엑셀) 증설이 없습니다.");
  pair(/마루|장판|데코타일/, /걸레받이/, "바닥재가 있는데 걸레받이가 없습니다.");
  pair(/싱크대/, /주방[^|]*타일|타일[^|]*주방/, "싱크대가 있는데 주방 벽 타일이 없습니다.");
  pair(/실링팬/, /천장[^|]*보강|보강[^|]*천장|합판 ?보강/, "실링팬이 있는데 천장 보강(합판)이 없습니다.");
  pair(/마그네틱[^|]*레일/, /마그네틱[^|]*(SMPS|전원)/, "마그네틱 레일이 있는데 전원(SMPS)이 없습니다.");
  pair(/타일|도배|마루|장판|도장|필름/, /보양/, "공사가 있는데 보양(엘리베이터·공용부)이 없습니다.");
  pair(/타일|도배|마루|장판|도장|필름/, /입주 ?청소|준공 ?청소/, "입주(준공) 청소가 없습니다.");
  const empty = steps.slice(1, -1).filter(st => !stepStats(st).on); if (empty.length && empty.length < steps.length - 2) out.push({ lv: 3, t: `공사가 하나도 없는 공정: ${empty.map(s => s.label).join(", ")} — 안 하는 것이 맞는지 확인하세요.` });
  { const kinds = new Set((E.ceilList || []).map(woodRow).filter(x => x.ok).map(x => x.kind)), miss = Object.entries(WOOD_LINE).filter(([k, id]) => { const l = lineById(id); return l && lnState(l).on && !kinds.has(k) }).map(([k]) => k);
    if (miss.length) out.push({ lv: 3, t: `목작업(${miss.join("·")})의 석고보드·각재를 어림값으로 계산했습니다. ‘몰딩·천장·벽’ 단계에서 그 작업 카드를 펼쳐 치수를 넣으면 정확해집니다.`, go: idx("s4"), wh: spotWh(steps, "s4", WOOD_LINE[miss[0]], "치수"), at: { cat: "s4|w_" + WOOD_LINE[miss[0]], sel: '[data-ceilpart="' + miss[0] + '"]', say: "천장·벽 치수를 넣으면 석고보드·각재 수량이 정확해집니다." } }) }
  if (!Object.keys(E.dim || {}).length && !Object.keys(E.wallLen || {}).length) out.push({ lv: 3, t: "실측 치수가 없어 평형 기준 추정 면적으로 계산했습니다. 실측 후 ‘현장 정보’ 도면에서 벽 치수를 넣으면 수량이 맞춰집니다.", go: 0, wh: "현장 정보 › 도면", at: { h: "도면", say: "도면 아래 ‘벽 치수 넣기’로 실측 치수를 넣을 수 있습니다." } });
  return out;
}
/* (v74) ‘확인할 것’ → 정확한 자리로 — 사용자(2026-11-20): “정확하게 클릭했을때 그 위치가 어딘지 모르겠어서 위치를 특정할 수 있게 해줘야”.
   estCheck 항목의 at = { lid 공사 줄 · key 직접 넣은 줄 · name 추가 품목 · h 칸 제목(+ rowSel·row) · sel 화면의 칸(+ up) · say 그 자리에서 할 일 }, wh = ‘단계 › 묶음’.
   누르면 그 단계로 가서 묶음을 펼치고, 그 줄을 화면에 보이게 옮긴 뒤 주황 테두리와 ‘여기입니다’ 표시로 짚는다 (12초 · 목록을 다시 그리면 사라진다). */
document.head.insertAdjacentHTML("beforeend", `<style>.spot{outline:3px solid #e67e00!important;outline-offset:2px;border-radius:8px;background-color:rgba(255,179,0,.2)!important;animation:spotP 1.1s ease-in-out 6;scroll-margin-top:150px}
tr.spot>td{background-color:rgba(255,179,0,.2)!important}@keyframes spotP{50%{outline-color:#ffd54a;outline-offset:6px}}
.spottip{position:absolute;z-index:19;max-width:min(92vw,440px);background:#e67e00;color:#fff;border-radius:10px;padding:7px 13px;font-size:15px;line-height:1.4;box-shadow:0 6px 18px rgba(0,0,0,.3);pointer-events:none}
.spottip b{margin-right:6px;white-space:nowrap}.spottip:after{content:"";position:absolute;left:20px;bottom:-7px;border:7px solid transparent;border-top-color:#e67e00;border-bottom:0}
.lastlist li small.wh{display:block;margin-top:2px}</style>`);
function atAttr(c) { return c && c.at ? ` data-at="${esc(JSON.stringify(c.at))}"` : "" }
function atOf(b) { try { return b && b.dataset.at ? JSON.parse(b.dataset.at) : null } catch (e) { return null } }
function catOfLine(id) { const l = lineById(id), sk = l ? stepOfLine(l) : "", cat = l ? ((D.cats || {})[sk] || []).find(c => c.lines.includes(id)) : null; return { l, sk, cat } }
function spotWh(steps, sk, lid, tail) { const st = (steps || []).find(s => s.key === sk), c = lid ? catOfLine(lid).cat : null; return st ? st.label + (c ? " › " + c.label : "") + (tail ? " › " + tail : "") : "" }
function spotOfLine(l, say) {                         // 계산된 줄(R.lines 의 한 줄) → 화면의 자리
  if (l.lid) return { lid: l.lid, say };
  if (String(l.key).startsWith("xw")) return { cat: "s2|window", h: "창호 목록", say };
  if (l.extra && l.it) return { key: l.key, name: l.name, say };
  return { key: l.key, say };
}
function spotClear() { clearTimeout(spotClear.t); document.querySelectorAll(".spot").forEach(x => x.classList.remove("spot")); document.querySelectorAll(".spottip").forEach(x => x.remove()) }
function spotFind(at) {
  const q = (s, r) => { try { return (r || document).querySelector(s) } catch (e) { return null } }, cq = s => String(s).replace(/["\\]/g, "\\$&");
  let el = null;
  if (at.key) el = q(`#stepBody tr[data-key="${cq(at.key)}"]`);
  if (!el && at.lid) { const i = q(`#stepBody .catbody [data-ln="${cq(at.lid)}"]`) || q(`#stepBody [data-ln="${cq(at.lid)}"]`); el = i && (i.closest(".pk") || i.closest("tr") || i);
    if (!el) { const c = catOfLine(at.lid), b = c.cat && q(`#stepBody [data-catopen="${c.sk}|${c.cat.key}"]`); el = b && b.closest(".cat2") } }
  if (!el && at.name) el = q(`#stepBody .mi[data-mname="${cq(at.name)}"]`);
  if (!el && at.h) { const h = [...document.querySelectorAll("#stepBody .pgroup > h3, #stepBody .group > h3")].find(x => x.textContent.trim().startsWith(at.h)); el = h ? h.parentElement : null;
    if (el && at.rowSel) { const rs = el.querySelectorAll(at.rowSel); if (rs[at.row || 0]) el = rs[at.row || 0] } }
  if (!el && at.sel) { el = q(at.sel); if (el && at.up) el = el.closest(at.up) || el }
  return el;
}
function spotMark(at) {
  spotClear(); const el = spotFind(at);
  if (!el) { window.scrollTo({ top: 0, behavior: "smooth" }); if (at.say) toast(at.say); return false }
  for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
  el.classList.add("spot");
  const tip = document.createElement("div"); tip.className = "spottip"; tip.innerHTML = `<b>👉 여기입니다</b>${at.say ? esc(at.say) : ""}`; document.body.appendChild(tip);
  el.scrollIntoView({ block: el.getBoundingClientRect().height > innerHeight * 0.55 ? "start" : "center" });
  const pin = document.querySelector("#stepBody .plantop:not(.unpin)"), need = tip.offsetHeight + 18;   // ‘위에 고정’한 도면이 그 줄이나 표시를 가리면 도면 아래로 오게 조금 더 옮긴다
  if (pin && pin !== el && !pin.contains(el) && getComputedStyle(pin).position === "sticky") { const pb = pin.getBoundingClientRect().bottom, r0 = el.getBoundingClientRect(); if (r0.top < pb + need && pb + need + Math.min(r0.height, 90) < innerHeight) window.scrollBy(0, r0.top - (pb + need)) }
  const r = el.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(r.left + scrollX, scrollX + document.documentElement.clientWidth - tip.offsetWidth - 8)) + "px"; tip.style.top = Math.max(scrollY + 4, r.top + scrollY - tip.offsetHeight - 9) + "px";
  spotClear.t = setTimeout(spotClear, 12000);
  return true;
}
function goSpot(step, at) {                           // 그 단계로 가서(묶음을 펼치고) 그 자리를 짚는다
  if (at && at.doc) { show("doc"); setTimeout(() => { const b = at.doc === "memo" ? ($("#memoCard") || $("#docOpts")) : $("#docOpts"); if (!b) return; b.scrollIntoView({ block: "center", behavior: "smooth" }); b.style.outline = "3px solid var(--accent)"; b.style.outlineOffset = "4px"; setTimeout(() => { b.style.outline = ""; b.style.outlineOffset = "" }, 4500); if (at.say) toast(at.say) }, 150); return }   // (v86) 상세견적서 화면 위의 칸(공사 기간)
  const steps = STEPS(); E.step = Math.min(Math.max(0, +step || 0), steps.length - 1);
  if (at && at.lid) { const c = catOfLine(at.lid); if (c.cat) openCat(c.sk + "|" + c.cat.key) }
  if (at && at.cat) openCat(at.cat);                  // (v77) 묶음 안에 있는 표(창호 목록 · 가구 치수 · 목작업 치수)
  if (at && at.key && !at.lid) { const st = steps[E.step]; if (st && (D.cats || {})[st.key]) { const a = catXAssign(st); for (const ck in a.by) if (a.by[ck].some(l => l.key === at.key)) openCat(st.key + "|" + ck) } }   // 묶음 안에 직접 넣은 줄
  show("check"); renderChecklist(); save();
  if (!at) { window.scrollTo({ top: 0, behavior: "smooth" }); return }
  setTimeout(() => spotMark(at), 60);
}
/* (v90) 공정별 원가 · 견적 금액 — 견적 합계 칸. 사용자(2026-11-22): “마진이 있는게 중요한거보다 얼마정도의 금액이 산정되었는지 알아야 하는게 직관적이야
   예를 들어 철거 비용이 300만원이라고 할때 원가는 200만원이고 적혀 있고 모든 공정이 그렇게 … 마지막에 원가얼마 견적금액 얼마 차액으로 얼마이득이고 마진 몇 %인가로 생각을 해야 이해가 쉽지
   그리고 마진금액은 각자 생각의 차이가 있으니 원가에서 조율해서 적어내려 갈거고”.   (v88 은 공정마다 ‘마진 %’ 칸이었다 — 금액으로 바꿨다.)
   · 공정 줄 = 공정 | 원가 [칸] | 견적 금액. 원가 칸에는 단가표 원가로 계산한 값이 적혀 있고, 실장이 실제로 들어갈 돈에 맞게 고쳐 적는다(E.costOv[공정] = 금액 · 견적 금액은 그대로 · ↺ 되돌림).
     고쳐 적을 때의 견적 금액을 같이 적어 두고(E.costAt) 그 뒤 견적 금액이 바뀌면 칸을 주황으로 알린다(원가를 다시 보라고). v88 에서 % 로 고쳐 둔 것(E.mgOv)은 그대로 읽는다.
   · 합계 아래 = 원가 합계 · 견적 금액(VAT 별도) · 차액(이득) · 마진 %.
   · 실장 화면 = 로그인해서 서버가 원가표를 내려 줬을 때만(COST_ON) · 관리자 화면 = 늘. ‘원가 가리기’로 감출 수 있다(고객과 같이 볼 때 · 그 기기에 기억).
   · 저장할 때 E.mg(견적 금액 · 원가 · 마진율 · 고친 공정 수)를 같이 적어 회사 저장소 목록에서 견적마다 보인다. 고객 견적서 · 인쇄 · 엑셀에는 나가지 않는다. */
const mgCan = () => STAFF_DATA ? COST_ON : isAdmin;
const mgHidden = () => { try { return localStorage.getItem("sido_mg_hide") === "1" } catch (e) { return false } };
const mgPct = v => (Math.round(v * 1000) / 10).toFixed(1);
const numIn = s => { const v = String(s ?? "").replace(/[^\d]/g, ""); return v === "" ? null : +v };   // "2,000,000원" → 2000000 · 숫자가 없으면 null
const mgStale = p => { const b = R.byProc[p], a = (E.costAt || {})[p]; return !!(b && b.ov && (E.costOv || {})[p] !== undefined && a !== undefined && Math.abs(+a - b.amt) >= 1) };   // 원가를 고쳐 적은 뒤 그 공정의 견적 금액이 바뀌었다
function mgRow(p) {                                   // 공정 줄의 원가 칸: (↺) [ 2,000,000 ] — 마우스를 올리면 차액 · 마진 %
  const b = R.byProc[p]; if (!b || !(b.amt > 0)) return '<span class="mgi"></span>';
  const c = Math.round(b.cost), c0 = Math.round(b.cost0 ?? b.cost), gap = b.amt - c, st = mgStale(p);
  const tip = `${gap < 0 ? "손해" : "차액"} ${won(Math.abs(gap))}원 · 마진 ${mgPct(gap / b.amt)}%${b.ov ? ` · 계산한 원가 ${won(c0)}원` : ""}${st ? ` · 원가를 적은 뒤 견적 금액이 바뀌었습니다 (그때 ${won(E.costAt[p])}원) — 원가를 다시 확인하세요` : ""}`;
  return `<span class="mgi${b.ov ? " ov" : ""}${st ? " stale" : ""}" title="${tip}">${b.ov ? `<button type="button" data-mgauto="${p}" title="계산한 원가 ${won(c0)}원으로 되돌립니다" aria-label="${PROC_LABEL[p]} 원가 되돌리기">↺</button>` : ""}<input type="text" inputmode="numeric" autocomplete="off" data-costov="${p}" data-c0="${c0}" value="${won(c)}" aria-label="${PROC_LABEL[p]} 원가"></span>`;
}
function mgTotal() {                                  // 합계 아래: 원가 합계 · 견적 금액 · 차액(이득) · 마진 % · 안내
  const ovs = PROCS.filter(p => R.byProc[p] && R.byProc[p].ov), nov = ovs.length, nst = ovs.filter(mgStale).length, zeroL = R.lines.filter(l => l.amt > 0 && !(l.cost > 0)), zero = zeroL.length, zeroN = [...new Set(zeroL.map(l => custName(l.name)))], adm = !STAFF_DATA && SRV && SRV.me && SRV.me.role === "admin", h = (SRV && SRV.costHead) || null;
  const gap = Math.round(R.net - R.cost), neg = gap < 0;
  return `<div class="mgbox"><div class="mgq">
    <div><small>원가 합계</small><b>${won(Math.round(R.cost))}</b></div>
    <div><small>견적 금액 <i>VAT 별도</i></small><b>${won(R.net)}</b></div>
    <div class="gain${neg ? " neg" : ""}"><small>${neg ? "차액 (손해)" : "차액 (이득)"}</small><b>${neg ? "−" : ""}${won(Math.abs(gap))}</b></div>
    <div class="gain${neg ? " neg" : ""}"><small>마진</small><b>${R.net ? mgPct(R.margin) + "%" : "-"}</b></div></div>
    <div class="note">공정 줄의 <b>원가</b> 칸은 실제로 들어갈 돈에 맞게 고쳐 적습니다 (견적 금액은 그대로). <b>고객 견적서에는 안 나갑니다.</b>${nov ? ` <b>고친 공정 ${nov}곳</b> <button type="button" class="btn ghost sm" data-mgauto="*">↺ 모두 계산한 원가로</button>` : ""}</div>
    ${nst ? `<div class="note down" style="margin-top:4px">원가를 적은 뒤 견적 금액이 바뀐 공정 ${nst}곳 (주황 칸) — 원가를 다시 확인하세요.</div>` : ""}
    ${STAFF_DATA && zero ? `<div class="note down" style="margin-top:4px" title="${esc(zeroN.join(" · "))}">원가가 없는 줄 ${zero}개 (${esc(zeroN.slice(0, 2).join(" · "))}${zeroN.length > 2 ? " 외" : ""}) — 그만큼 이득이 많게 보입니다.</div>` : ""}
    ${adm ? `<div class="note" style="margin-top:6px">실장 화면에도 공정별 원가가 보입니다: <b>${h ? (h.on ? "켜짐" : "꺼짐") : "확인 중"}</b>${h ? ` <button type="button" class="btn sm" data-coston="${h.on ? 0 : 1}">${h.on ? "실장에게 보이지 않게 끄기" : "실장에게 보여 주기"}</button><br><span class="note">원가표 품목 ${h.n}개${h.at ? " · 올린 때 " + esc(h.at) : ""}</span>` : ""}</div>` : ""}</div>`;
}
function mgNote() {                                   // 원가가 안 보일 때 까닭 한 줄 (실장 화면 · 회사 주소로 연 화면에서만)
  if (!STAFF_DATA || !SRV || COST_ON) return "";
  return `<div class="note" style="margin-top:8px">공정별 원가 · 차액은 ${SRV.me && SRV.me.role === "staff" ? "관리자가 원가표를 올려 두면(관리자 화면을 한 번 열면)" : SRV.down ? "회사 컴퓨터가 켜져 있을 때 이 기기로 한 번 들어온 뒤부터" : "로그인하면"} 보입니다.</div>`;
}
function mgSnap() { if (mgCan() && R.net > 0) E.mg = { net: R.net, cost: Math.round(R.cost), m: Math.round(R.margin * 1000) / 1000, ov: Object.keys(E.mgOv || {}).length + Object.keys(E.costOv || {}).length } }   // 저장할 때: 이 견적의 마진 요약 (회사 저장소 목록에 보인다)
function costShown() { R = compute(); renderSummary() }
function costOff() { COST_ON = false; COST_VER = ""; for (const it of D.catalog) { delete it.cost; delete it.margin } delete D.margins; costShown() }
async function costKeep(tb) { try { if (!keepOk() || !SRV.me || SRV.me.role !== "staff") return; const k = SRV.me.id + "|#cost"; await keepDo("readwrite", st => tb ? st.put({ x: tb }, k) : st.delete(k)) } catch (e) { } }   // 꺼져 있을 때를 위해, 받아 둔 내 견적과 같은 곳에 둔다 (로그아웃하면 같이 지워진다)
async function costKept() { try { const w = pendWho(); if (!keepOk() || !w || w === "?") return null; const v = await keepDo("readonly", st => st.get(w + "|#cost")); return v && v.x ? v.x : null } catch (e) { return null } }
async function costSync() {                           // 실장: 서버가 공정별 마진을 보여 주기로 했으면 원가표를 받는다(꺼져 있으면 이 기기에 받아 둔 것) · 관리자: 원가표가 바뀌었으면 서버에 올린다
  if (!SRV) return;
  try {
    if (STAFF_DATA) {
      if (SRV.me && SRV.me.role === "staff") { const v = SRV.me.cost || ""; if (!v) { if (COST_ON) costOff(); else renderSummary(); costKeep(null); return } if (COST_ON && COST_VER === v) return; const tb = await srv("GET", "/api/costs"); if (costApply(tb)) { costKeep(tb); costShown() } }
      else if (SRV.down && !COST_ON) { const tb = await costKept(); if (tb && costApply(tb)) costShown(); else renderSummary() }
    } else if (SRV.me && SRV.me.role === "admin" && D.catalog.some(i => +i.cost > 0)) { const tb = costTable(); let h = await srv("GET", "/api/costs"); if (h && h.v !== tb.v) h = await srv("PUT", "/api/costs", tb); SRV.costHead = h; renderSummary() }
  } catch (e) { }
}
document.addEventListener("input", ev0 => {           // 원가 칸: 치는 대로 천 단위 쉼표
  const el = ev0.target; if (!el.dataset || el.dataset.costov === undefined) return; const n = numIn(el.value); el.value = n === null ? "" : won(n);
});
document.addEventListener("focusin", ev0 => { const el = ev0.target; if (el.dataset && el.dataset.costov !== undefined) setTimeout(() => { try { el.select() } catch (e) { } }, 0) });   // 누르면 통째로 골라져 바로 새 금액을 친다
document.addEventListener("keydown", ev0 => { const el = ev0.target; if (ev0.key === "Enter" && el.dataset && el.dataset.costov !== undefined) el.blur() });
document.addEventListener("change", ev0 => {          // 공정의 원가를 고쳐 적는다 (비우거나 계산한 값과 같으면 계산한 값으로)
  const el = ev0.target; if (!el.dataset || el.dataset.costov === undefined) return; const pk = el.dataset.costov, n = numIn(el.value), c0 = +el.dataset.c0, b = R.byProc[pk];
  E.costOv = E.costOv || {}; E.costAt = E.costAt || {};
  if (n === null || n === c0) { delete E.costOv[pk]; delete E.costAt[pk] } else { E.costOv[pk] = n; E.costAt[pk] = b ? b.amt : 0 }
  if (E.mgOv) { delete E.mgOv[pk]; if (!Object.keys(E.mgOv).length) delete E.mgOv }
  for (const k of ["costOv", "costAt"]) if (!Object.keys(E[k]).length) delete E[k];
  costShown(); save();
});
document.addEventListener("click", async ev0 => {
  const t0 = ev0.target; if (!t0.closest) return; const a = t0.closest("[data-mgauto]"), o = t0.closest("[data-coston]"), hd = t0.closest("[data-mghide]");
  if (a) { const pk = a.dataset.mgauto; for (const k of ["mgOv", "costOv", "costAt"]) if (E[k]) { if (pk === "*") delete E[k]; else { delete E[k][pk]; if (!Object.keys(E[k]).length) delete E[k] } } costShown(); save(); return }
  if (hd) { try { if (mgHidden()) localStorage.removeItem("sido_mg_hide"); else localStorage.setItem("sido_mg_hide", "1") } catch (e) { } renderSummary(); return }
  if (o) { try { SRV.costHead = await srv("POST", "/api/costs", { on: o.dataset.coston === "1" }); toast(SRV.costHead.on ? "실장 화면에 공정별 원가 · 차액을 보여 줍니다. 실장이 화면을 새로 열면 보입니다." : "실장 화면에서 공정별 원가 · 차액을 껐습니다. 실장이 화면을 새로 열면 사라집니다.") } catch (e) { toast("바꾸지 못했습니다. " + (e && e.msg || "")) } renderSummary() }
});
function checkCard(steps) {
  const cs = estCheck(steps), n = cs.filter(c => c.lv < 3).length, mark = ["", "⚠", "❓", "ℹ"], col = ["", "var(--warn)", "var(--warn)", "var(--muted,#667)"];
  return `<div class="pgroup"><h3>견적 검수 <span class="note">${n ? `확인할 것 ${n}건` : "걸리는 항목 없음"} · 견적서를 내보내기 전에 자동으로 살펴본 결과입니다</span></h3>
    ${cs.length ? `<ul style="list-style:none;margin:0;padding:0 14px 8px">${cs.map(c => `<li style="display:flex;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--line)"><b style="color:${col[c.lv]};width:1.3em;text-align:center">${mark[c.lv]}</b><span style="flex:1">${esc(c.t)}${c.wh ? ` <small class="note">· ${esc(c.wh)}</small>` : ""}</span>${c.go !== undefined ? `<button type="button" class="btn ghost sm" data-goto="${c.go}"${atAttr(c)}>가서 고치기</button>` : ""}</li>`).join("")}</ul>
    <p class="note" style="padding:0 14px">⚠ 꼭 확인 · ❓ 보통 같이 들어가는 공사 (안 하는 현장이면 그대로 두세요) · ℹ 참고</p>` : '<p class="note" style="padding:0 14px">✓ 빠진 단가·수량이나 짝이 안 맞는 공사가 없습니다.</p>'}</div>`;
}
/* ───── 챗봇 ─────
   · 답은 ‘핵심 한 줄 + 짧은 줄 몇 개’로 보여 주고, 긴 설명은 ‘자세히’를 눌렀을 때만 편다.
   · 프로그램이 직접 할 수 있는 일은 바로 한다: 대화에 적힌 치수로 석고보드·각재·타일 계산 → 버튼으로 목작업 치수 표에 넣기, 지금 견적의 수량·검수 읽기.
   · 그 밖의 질문은 저장된 답(kb.js, window.SIDO_KB)에서 가장 가까운 내용을 찾아 답한다. 어느 PC에서나 되고 비용이 없다.
   · 클로드 URL 화면에서는 AI 가 지금 견적 상태(수량·검수, 금액 제외)와 저장된 답을 읽고 답한다 (보는 사람의 클로드 사용량).
   · ‘출처’라고 물으면 방금 답의 출처를 보여 준다. 답이 없거나 부족한 질문, ‘추가: …’로 적은 내용, 많이 물은 질문은 요청 목록에 쌓인다. */
let KB = [], KB_AI = null, HELP_OPEN = false, HELP_LAST = null, HELP_BUSY = null, HELP_RS = null; const HELP_LOG = [], HELP_TURNS = [];
const KB_FILL = ["인테리어", "아파트", "어디에", "어디서", "어디", "어떻게", "얼마나", "얼마", "인가요", "되나요", "하나요", "있나요", "나요", "알려줘", "알려주세요", "궁금해", "궁금", "뭐야", "뭔가요", "무엇", "어때", "해줘", "보통", "대해", "관련", "은요", "는요", "어떤", "언제", "왜", "돼", "되요", "입니까", "인지"];
const KB_TRADE = [["s7", /타일|욕실|화장실|줄눈|변기|세면|욕조|샤워|덧방|젠다이/], ["s9", /도배|벽지|실크|합지|초배/], ["s8", /마루|장판|데코타일|바닥재|걸레받이/], ["s10", /필름|페인트|도장|탄성코트|젯소|퍼티/], ["s4", /목공|목작업|천[장정]|몰딩|가벽|석고|각재|커튼박스|단열|아트월|타카/],
  ["s5", /전기|콘센트|조명|스위치|매입등|차단기|전선|배선/], ["s6", /방문(?!\s*(상담|견적|실측|예약|일정|날짜|약속|시간|점검|검수|해서|하면|해야|하는|했|드리|전에|할\s*때))|중문|문틀|문짝|도어|경첩|손잡이/], ["s2", /샷시|샤시|창호|창문|확장|방충망/], ["s3", /방수|배관|보일러|난방|에어컨|수전|미장|설비|누수|배수/], ["s11", /싱크|붙박이|신발장|상부장|하부장|상판|가구|후드|냉장고장/], ["s1", /철거|보양|폐기물|동의서/], ["s12", /실리콘|커튼|블라인드|청소|우레탄폼/]];
const KB_INT = [[/부자재|자재|재료|준비물|뭐가\s*들어|뭐\s*들어|들어가는|뭐가\s*필요|뭐\s*필요|필요한\s*(것|거|게)/, /부자재|자재|들어가|준비물|재료/, 4], [/경우|상황|언제\s*(써|쓰|필요|하)/, /경우|언제|조건|상태에\s*따라/, 3],
  [/차이|비교|다른\s*(점|가|게)|뭐가\s*(나아|낫|좋)|어떤\s*게\s*(나아|낫|좋)/, /차이|다른가|다르고|다른\s*점|비교|무엇이\s*낫|중\s*무엇/, 3], [/순서|절차|방법|어떻게\s*(해|하|시공)/, /순서|어떻게|방법/, 1.5], [/주의|조심|하자|문제|원인/, /주의|조심|하자|원인|왜/, 2], [/종류|뭐가\s*있|뭐\s*있어|어떤\s*게\s*있/, /종류|무엇이\s*다르|어떻게\s*다르|차이/, 3], [/며칠|몇\s*일|얼마나\s*걸|기간/, /기간|며칠|걸리/, 3], [/견적|수량\s*(은|을)?\s*(어떻게)?\s*계산/, /견적|수량|계산/, 1.5]];
const kbNorm = s => String(s || "").toLowerCase().replace(/[\s·.,?!~()\[\]'"“”‘’\-_\/:]+/g, "");
const kbGram = s => { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g };
const kbCore = q0 => { let q = kbNorm(q0); for (const w of KB_FILL) q = q.split(w).join(""); return q };   // 질문 말투를 뺀 알맹이
const kbTok = q => [...new Set(String(q).toLowerCase().split(/[\s,·?!.~]+/).flatMap(t => { const x = kbNorm(t), y = x.replace(/(은|는|이|가|을|를|의|에|도|로|으로|와|과|랑|이랑|요|인가요|인지|일까|뭐야|뭔가요|어때|알려줘|궁금해|있어|있나요|해줘|하나요|되나요|인가|이야)$/, ""); return [x, y, x.replace(/(할때|하려면|하면|하는|해서|하고|하기|하게|해야|할|한|했|해|되면|되는|된|됐|돼)$/, "")] }).filter(t => t.length >= 2 && !KB_FILL.includes(t)))];
const kbG = e => { if (!e._g) { e._g = kbGram(kbNorm(e.q + (e.k || []).join(""))); e._ga = kbGram(kbNorm(e.a)) } return e };
const HELP_EASYQ = /뭐야|뭔가요|뭐에요|뭐예요|뭐임|뭔지|뭐지|뭐냐|뭔데|무슨뜻|뜻이|뜻은|뜻좀|이란|란게|라는게|왜해|왜하|왜달|왜필요|처음듣|쉽게/, HELP_RECQ = /추천|어떻게(넣|구성|하는게|해야|하면좋|들어가)|보통어떻게|뭐가좋|평대|구성/;
const KB_HINT = [[/왜해|왜하|왜달|왜필요|꼭해야|안하면/, /왜 하나/], [/어디에|어디다|어느/, /어디에 하나/], [/며칠|몇일|얼마나걸|걸려|걸리나|기간/, /기간/], [/하자|불량|as|a\/s|소리|소음|들뜨|들뜸|깨지|깨졌|벌어|변색|처지|처짐|고장|안닫|나는데/, /흔한 하자/], [/원인|왜/, /원인/], [/보수|수리|고치|고쳐/, /보수/], [/예방/, /예방/], [/주의|조심|하자|실수|문제/, /주의/], [/순서|절차|과정/, /순서/], [/로스/, /로스/], [/계산|몇장|몇박스|몇롤|몇개|몇평/, /계산식/], [/견적|수량|물량|계산/, /견적/], [/준비|바탕/, /준비|바탕/], [/부자재|자재|재료|준비물/, /부자재/], [/종류/, /종류/], [/경우|상황|조건/, /경우/], [/고르|선택|추천|뭐가좋|뭐가나/, /고르/], [/규격|치수|크기|두께/, /규격|치수/], [/발주|주문/, /발주/], [/관리|청소/, /관리 방법/], [/고객|뭐라고|설명/, /고객/]];   // 질문의 뜻 → 그 내용을 담은 소제목
const KB_CANON = [[/매립\s*조명|매립\s*등|매입\s*조명|매입\s*등/g, "매입등"], [/화장실/g, "욕실"], [/베란다/g, "발코니"], [/샤시|새시/g, "샷시"], [/메지/g, "줄눈"], [/씽크대/g, "싱크대"], [/두꺼비집/g, "분전반"], [/중천장/g, "평천장"], [/모노륨/g, "장판"], [/하부\s*몰딩/g, "걸레받이"], [/상부\s*몰딩/g, "천장 몰딩"], [/할려고|하려고\s*하는데|하려는데/g, " "], [/(?<![\d.])2\d\s*평(형|대)?/g, "$& 20평대 "], [/(?<![\d.])3\d\s*평(형|대)?/g, "$& 30평대 "], [/(?<![\d.])[4-6]\d\s*평(형|대)?/g, "$& 40평대 "], [/올\s*수리|올\s*리모델링|풀\s*리모델링|전체\s*수리/g, "올수리 전체 리모델링"]];
const kbCanon = q => KB_CANON.reduce((t, [a, b]) => t.replace(a, b), String(q || ""));   // 현장에서 달리 부르는 말을 저장된 답에 쓰인 말로 바꿔서 찾는다
const kbKr = (e, x) => (e._kr = e._kr || [])[x] || (e._kr[x] = /\s/.test(e.k[x]) ? new RegExp(e.k[x].trim().split(/\s+/).map(w => kbNorm(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".{0,2}")) : /$^/);   // 두 낱말 넘는 낱말은 사이에 조사 한두 글자가 끼어도 맞는 것으로 본다
function kbFind(q0, min = 3, max = 3) {              // 낱말이 조금 달라도(띄어쓰기·조사·줄임말·말투) 가장 가까운 항목을 찾는다
  q0 = kbCanon(q0); const q = kbNorm(q0); if (q.length < 2) return []; const toks = kbTok(q0), qg = kbGram(kbCore(q0));
  const tr = new Set(KB_TRADE.filter(x => x[1].test(q0)).map(x => x[0])), tw = [...new Set(KB_TRADE.flatMap(x => String(q0).match(new RegExp(x[1].source, "g")) || []))], cur = (STEPS()[E.step] || {}).key, um = String(q0).match(/몇\s*(롤|장|박스|단|개|자|평|인치|미터|mm|m)/i), ctx = !tr.size && HELP_LAST && HELP_LAST.es && HELP_LAST.es[0] ? HELP_LAST.es[0].s : null;
  return KB.map(e => { let sc = 0; kbG(e); const title = kbNorm(e.q), body = kbNorm(e.a), ks = (e.k || []).map(kbNorm);
    if (qg.size) { let ht = 0, ha = 0; for (const g of qg) { if (e._g.has(g)) ht++; else if (e._ga.has(g)) ha++ } sc += 6 * ht / qg.size + 2 * ha / qg.size }
    const km = ks.map((k, x) => k.length >= 2 && (q.includes(k) || kbKr(e, x).test(q)) ? (3 + 2 * k.length) * (1 - 0.5 * x / Math.max(1, ks.length - 1)) : 0).filter(Boolean).sort((x, y) => y - x); if (km.length) sc += km[0] + (km.length - 1);   // 앞쪽에 적힌 낱말일수록 그 항목의 중심 주제
    for (const t of toks) { const kc = ks.filter(k => k.includes(t)).length; if (title.startsWith(t)) sc += 2; if (kc > 1) sc += Math.min(3, kc - 1) * 1.5;
      if (title.includes(t)) sc += 3; else if (kc) sc += 2; else if (body.includes(t)) sc += 1;
      else if (t.length >= 3) { const p = t.slice(0, 2); if (title.includes(p)) sc += 1.5; else if (ks.some(k => k.includes(p))) sc += 1; else if (body.includes(p)) sc += 0.5 } }
    if (sc >= 5 && ctx && e.s === ctx) sc += 6;       // 공정을 말하지 않은 질문은 방금 답하던 공정의 답을 앞세운다 (‘부자재는?’)
    if (sc >= 2) { if (tr.has(e.s)) sc += 2.5; else if (!tr.size && e.s === cur) sc += 1;
      if (tw.length && !tr.has(e.s) && !tw.some(w => title.includes(w) || ks.some(k => k.includes(w)))) sc -= 3;   // 질문에 나온 공정 낱말이 제목·낱말에 없는 다른 공정 답(꼴만 비슷한 답)은 뒤로
        // 질문에 나온 공정(없으면 지금 보고 있는 단계)의 답을 앞세운다
      for (const [a, b, w] of KB_INT) if (a.test(q0) && b.test(e.q)) sc += w; if (tr.size) for (const [a, b] of KB_HINT) if (a.test(q) && (e.d || []).filter(x => b.test(x.h || "")).length === 1) { sc += 5; break }   // 물은 뜻(기간·주의·견적…)을 소제목으로 담고 있는 답을 앞세운다
      if (um && (e.q + (e.k || []).join(" ")).includes(um[1])) sc += 7;
      if (sc >= 5 && HELP_EASYQ.test(q) && (e.d || []).some(x => x.h === "쉽게 말하면")) sc += 4;   // ‘~이 뭐야?’ · ‘왜 해?’ → 처음 듣는 사람용 답
      if (sc >= 5 && HELP_RECQ.test(q) && !/배치|간격|개수|몇개/.test(q) && (e.d || []).some(x => x.h === "추천 구성")) sc += 4 }   // ‘어떻게 넣는 게 좋아?’ · ‘추천해 줘’ → 평형대별 추천 구성 답
    if (e.o && sc > 0) sc += 1.5 + (e.o === "프로그램 사용법" && sc >= 2 && /프로그램|(어디서|어디에|어디)\s*(넣|입력|적|올리|바꾸|고치|보|확인|찾|누르)/.test(q0) ? 6 : 0);   // ‘어디에 넣어?’는 프로그램 사용법 답을 앞세운다
    return { e, sc } }).filter(x => x.sc >= min).sort((x, y) => y.sc - x.sc).slice(0, max);
}
const kbRel = e => { kbG(e); return KB.filter(x => x !== e).map(x => { kbG(x); let h = 0; for (const g of e._g) if (x._g.has(g)) h++; return { x, sc: h / Math.max(1, e._g.size) + (x.s === e.s ? 0.15 : 0) } }).sort((p, q) => q.sc - p.sc).slice(0, 3).map(p => p.x) };   // 이어서 볼 만한 질문
const helpFmt = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`\n]+)`/g, "<code data-helpfill>$1</code>").replace(/\n/g, "<br>");
const helpCut = (s, n) => s.length > n ? s.slice(0, n) + "…" : s;
const helpFirst = t => { const s = String(t).trim(), m = s.match(/^[\s\S]*?[.!?](?=\s|$)/); return m ? m[0] : s };   // 문단의 첫 문장
const helpTxt = h => String(h).replace(/<\/b><span>/g, ": ").replace(/<br\s*\/?>|<\/(div|p)>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n{2,}/g, "\n").trim();   // 화면 글 → 평문 (AI 대화 맥락용)
const helpRow = (h, t) => `<div class="hl">${h ? `<b>${esc(h)}</b>` : "<i>·</i>"}<span>${t}</span></div>`;   // ‘이름 — 내용’ 한 줄
const helpFoot = (n, o = {}) => `<div class="hm">${o.more ? `<button type="button" class="lk" data-helpmore>${o.more === "full" ? "간단히" : "자세히"}</button>` : ""}${o.ai ? '<button type="button" class="lk" data-helpsay="자세히 설명해 줘">자세히</button>' : ""}${o.askAi ? '<button type="button" class="lk" data-helpai>AI에게 더 묻기</button>' : ""}<button type="button" class="lk" data-helpsrc="${n}">출처</button><button type="button" class="lk" data-helpfind>웹 검색</button>${o.deep ? '<button type="button" class="lk" data-helpdeep>더 깊이</button>' : ""}${o.re ? `<button type="button" class="lk" data-helpre="${esc(o.re)}">AI에게 다시 묻기</button>` : ""}<button type="button" class="lk" data-helpbad="${esc(o.bad || "")}">부족해요</button></div>`;   // o.re = 배운 답(회사 저장소에 쌓아 둔 AI 답)으로 답했을 때의 그 질문 → ‘AI에게 다시 묻기’ · o.bad = AI 가 답한 질문 → ‘부족해요’를 누르면 쌓아 둔 그 답에도 표시한다
const helpFindLinks = q0 => { const q = String(q0 || "").replace(/[?？!]+$/, "").trim().slice(0, 60), s = encodeURIComponent(q + (/인테리어|시공|공사|리모델링/.test(q) ? "" : " 인테리어")), a = (u, t) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`;   // 답이 없거나 더 찾아볼 때 바로 여는 검색
  return `<span class="hs">${a("https://search.naver.com/search.naver?query=" + s, "네이버")}${a("https://www.youtube.com/results?search_query=" + s, "유튜브")}${a("https://ohou.se/search/index?query=" + encodeURIComponent(q), "오늘의집")}</span>` };
function kbFocus(e, q) {                              // 질문이 그 답 안의 어느 문단을 묻는지: 제목에는 없고 소제목·문단에 있는 낱말로 가린다
  const d = e.d || []; if (d.length < 2 || !q) return -1;
  { const qn = kbNorm(q); for (const [a, b] of KB_HINT) if (a.test(qn) && !(b.source === "견적" && /견적/.test(e.q))) { const ix = d.map((x, i) => b.test(x.h || "") ? i : -1).filter(i => i >= 0); if (ix.length === 1) return ix[0] } }
  const title = kbNorm(e.q), hs = d.map(x => kbNorm(x.h)), toks = kbTok(q).filter(t => !title.includes(t) || hs.includes(t)); if (!toks.length) return -1;
  const sc = d.map(x => { const h = kbNorm(x.h), t = kbNorm(x.t); let s = 0; for (const k of toks) { if (h && (h.includes(k) || (k.length >= 3 && k.includes(h)))) s += 3; else if (t.includes(k)) s += 1 } return s });
  const best = Math.max(...sc), i = sc.indexOf(best), second = Math.max(0, ...sc.filter((v, k) => k !== i));
  return best >= 3 && best >= second + 1.5 ? i : -1;
}
const kbHead = (p, full) => full || String(p).length <= 80 ? p : helpFirst(p);
const KB_ROWS = 2;                                    // (v95) 저장된 답을 처음 보여 줄 때 펼쳐 두는 줄 수 — 나머지 소제목은 ‘더 보기’ 단추
const kbLong = e => (e.d || []).some(x => helpFirst(x.t).length < String(x.t).trim().length) || kbHead(e.p || "", false) !== (e.p || "") || (e.d || []).length > KB_ROWS;
const kbText = e => e.p ? e.p + " " + (e.d || []).map(x => (x.h ? x.h + ": " : "") + x.t).join(" ") : e.a;   // AI 에게 넘기는 전체 글
/* (v95) 답 모양을 짧게 — 사용자(2026-11-22 · 평형대별 추천 답이 길게 나온 화면을 보내며): “말이 너무 많고 읽기가 불편해 어떤 말을 하는지 읽어야만 추천한다고 느껴지고 너무 보기에 불편해”.
   ① 맨 위에 무슨 답인지(추천 · 시공 방법 · 자재 · 수량 계산 · 하자 · 보수 · 쉬운 설명 · 프로그램 사용법 · 회사 기준) ② 핵심 한 줄 ③ 두 줄만 ④ 나머지 소제목은 ‘더 보기’ 단추(누르면 그 문단) ⑤ ‘자세히’ = 전부. */
const kbKind = e => { const o = String(e.o || ""), hs = (e.d || []).map(x => x.h || ""); return /프로그램/.test(o) ? "프로그램 사용법" : /회사 기준|교육자료/.test(o) ? "회사 기준" : hs.includes("추천 구성") ? "추천" : hs.includes("쉽게 말하면") ? "쉬운 설명" : hs.includes("계산식") ? "수량 계산" : hs.includes("흔한 하자") ? "하자 · 보수" : hs.includes("시공 순서") ? "시공 방법" : hs.includes("고르는 기준") ? "자재" : hs.some(h => /고객에게 설명|고객 안내/.test(h)) ? "고객 설명" : "" };
/* (v97) 추천 답: 평형대를 크게 띄우고, 그 단계의 공사를 아래에 하나씩 — ✓ 들어 있음(누르면 그 줄로) · ＋ 누르면 넣는다.
   사용자(2026-11-22 · “30평대 필름 추천해줘” 답 그림을 보고): “30평대 띄우거나 한눈에 들어 올 수 있게 문, 문틀, 현관문 이런 내용을 하부에 따로 작업 할 수 있게 만들어 주는게 좋은거 같고”. */
function kbRecHead(e) { const st = STEPS().find(x => x.key === e.s), band = (String(e.q).match(/[2-4]0평대/) || [""])[0];
  const topic = e.s === "s0" || !st ? (kbLabel(e).replace(/[2-4]0평대\s*/, "").replace(/\s*추천$/, "") || "올수리") : String(st.label).replace(/\s*\(.*$/, "");
  return `<div class="hhd"><i>추천</i>${band ? `<b>${band}</b>` : ""}<span>${esc(topic)}</span></div>` }
function kbRecChips(e) {
  if (!D.stepLines || !D.stepLines[e.s] || e.s === "s0") return ""; const txt = kbNorm(kbText(e)), gi = STEPS().findIndex(x => x.key === e.s);
  let ls = D.stepLines[e.s].filter(l => !l.gone && !l.dead && !l.sel && !helpIsSup2(l) && !(typeof HIDE_LINES !== "undefined" && HIDE_LINES.includes(l.id) && !lnState(l).on));
  const words = l => String(lineLabel(l)).split(/[\s·()\/,]+/).filter(t => t.length >= 2 && !/^(필름|교체|공사|시공|세트|설치|작업|철거|바닥|벽|타일)$/.test(t));
  const hit = ls.filter(l => lnState(l).on || words(l).some(t => txt.includes(kbNorm(t)))); if (hit.length >= 2) ls = hit;
  ls = [...ls.filter(l => lnState(l).on), ...ls.filter(l => !lnState(l).on)].slice(0, 9); if (!ls.length || gi < 0) return "";
  return `<div class="hbx hrc"><i>이 견적에</i>${ls.map(l => lnState(l).on
    ? `<span role="button" tabindex="0" class="hch on" data-goto="${gi}"${atAttr({ at: { lid: l.id, say: "이 줄입니다." } })} title="들어 있습니다 · 누르면 그 줄로 갑니다">✓ ${esc(helpCut(lineLabel(l), 13))}</span>`
    : `<span role="button" tabindex="0" class="hch add" data-helpline="${esc(l.id)}|1" title="누르면 견적에 넣습니다">＋ ${esc(helpCut(lineLabel(l), 13))}</span>`).join("")}</div><div class="hrn">✓ 들어 있는 공사(누르면 그 줄로) · ＋ 누르면 견적에 넣습니다</div>`;
}
function kbBody(e, fx, full) {                        // 핵심 한 줄 + 소제목 두 줄(첫 문장) + 나머지 소제목 단추. full 이면 문단 전체. fx = 질문이 가리킨 문단(그 문단을 핵심 자리에)
  if (!e.p) return helpFmt(e.a);
  const d = e.d || [], kind = kbKind(e), rec = kind === "추천", tag = rec ? kbRecHead(e) : kind ? `<div class="hty"><i>${esc(kind)}</i>${esc(kbLabel(e))}</div>` : "", chipsR = rec ? kbRecChips(e) : ""; let f = fx >= 0 ? d[fx] : null;
  if (!full && fx === 0 && d.length > 1) f = null;   // 첫 문단을 물은 것이면 핵심 한 줄 + 첫 줄 그대로가 가장 짧다
  if (full) return tag + `<div class="hk">${f && f.h ? `<em>${esc(f.h)}</em>` : ""}${helpFmt(f ? f.t : e.p)}</div>` + chipsR + (f ? [{ h: "전체 요점", t: e.p }, ...d.filter(x => x !== f)] : d).map(x => helpRow(x.h, helpFmt(x.t))).join("");
  const row = (x, i) => i < 0 || (x.h && helpFirst(x.t).length < String(x.t).trim().length)   // 더 볼 내용이 있는 가지만 누를 수 있게
    ? `<div class="hl"><b role="button" tabindex="0" class="hbr" ${i < 0 ? `data-helpgo="${e.n}"` : `data-helppar="${e.n}|${i}"`}>${esc(x.h)}</b><span>${helpFmt(helpFirst(x.t))}</span></div>` : helpRow(x.h, helpFmt(helpFirst(x.t)));
  const show = f ? [] : d.slice(0, KB_ROWS), chips = d.filter(x => x !== f && !show.includes(x) && x.h);
  const two = t => { const s = String(t).trim(), a = helpFirst(s); if (a.length >= s.length) return a; const b = helpFirst(s.slice(a.length).trim()); return (a + " " + b).length <= 170 ? a + " " + b : a };   // 앞세운 문단은 두 문장까지 (나머지는 ‘자세히’)
  return tag + `<div class="hk">${f && f.h ? `<em>${esc(f.h)}</em>` : ""}${helpFmt(f ? two(f.t) : kbHead(e.p, false))}</div>`
    + chipsR + (f ? row({ h: "전체 요점", t: e.p }, -1) : show.map(x => row(x, d.indexOf(x))).join(""))
    + (chips.length ? `<div class="hbx hmo"><i>더 보기</i>${chips.map(x => `<span role="button" tabindex="0" class="hch" data-helppar="${e.n}|${d.indexOf(x)}">${esc(x.h)}</span>`).join("")}</div>` : "");
}
function helpAiFmt(t0) {                              // AI 답: 첫 줄(문단)은 핵심, ‘· 이름: 내용’ 줄은 표처럼, 나머지는 문단. [이동:s4] 는 그 단계로 가는 버튼
  const steps = STEPS(), raw = String(t0 || "").replace(/\s*\[\d+\]/g, ""), go = [...new Set([...raw.matchAll(/\[이동:\s*(s\d+|end)\s*\]/g)].map(x => x[1]))], out = []; let head = false;
  for (const blk of raw.replace(/\[(이동|명령):[^\]]*\]?/g, "").split(/\n{2,}/)) { let para = [];
    const flush = () => { if (!para.length) return; const t = para.join("\n"); para = [];
      if (!head) { out.push(`<div class="hk">${helpFmt(t)}</div>`); head = true } else out.push(/^※/.test(t) ? `<p class="hp hn"><small>${helpFmt(t)}</small></p>` : `<p class="hp">${helpFmt(t)}</p>`) };
    for (const ln of blk.split("\n").map(s => s.trim()).filter(Boolean)) { const m = ln.match(/^[·•\-*]\s+(.*)$/) || ln.match(/^\d+[.)]\s+(.*)$/);
      if (m && (head || para.length)) { flush(); const k = m[1].match(/^(?:\*\*)?([^:：*`]{1,14}?)(?:\*\*)?\s*[:：]\s*(?!\/\/)(.+)$/); out.push(k ? helpRow(k[1].trim(), helpFmt(k[2])) : helpRow("", helpFmt(m[1]))) }
      else para.push(m ? m[1] : ln) }
    flush() }
  const btn = go.map(k => { const i = steps.findIndex(s => s.key === k); return i >= 0 ? `<button type="button" data-goto="${i}">‘${esc(steps[i].label)}’ 단계로 가기</button>` : "" }).join("");
  return out.join("") + (btn ? `<div class="hm">${btn}</div>` : "");
}
const kbLabel = e => helpCut(String((e.k || [])[0] || e.q.replace(/[?？]$/, "")), 13);   // 가지에 적는 짧은 이름 (그 답의 첫 낱말)
const kbSub = e => e._sub || (e._sub = (a => KB.filter(x => x !== e).map(x => { const ks = (x.k || []).map(kbNorm).filter(k => k.length >= 2); let sc = ks[0] && a.includes(ks[0]) ? 3 : 0; sc += Math.min(2, ks.slice(1).filter(k => a.includes(k)).length * 0.5); if (sc && x.s === e.s) sc += 1; return { x, sc } }).filter(p => p.sc >= 2.5).sort((p, q) => q.sc - p.sc).slice(0, 3).map(p => p.x))(kbNorm(e.a || kbText(e))));   // 이 답의 글에 나오는 낱말을 주제로 삼은 답 = 여기서 뻗는 가지
function kbBranch(e, more) {                          // 답 아래 가지: 이어서 볼 답 + 그 공정의 가지 지도
  const rel = [...new Set([...kbSub(e), ...(more || []), ...kbRel(e)])].filter(x => x !== e).slice(0, 3), st = STEPS().find(s => s.key === e.s);
  return `<div class="hbx"><i>가지</i>${rel.map(x => `<span role="button" tabindex="0" class="hch" data-helpgo="${x.n}" title="${esc(x.q)}">${esc(kbLabel(x))}</span>`).join("")}${st ? `<span role="button" tabindex="0" class="hch all" data-helpmap="${esc(e.s)}">${esc(helpCut(st.label, 10))} 전체 ›</span>` : ""}</div>`;
}
const HELP_MAPG = [["자재·종류", /자재|부자재|종류|고르|차이|다르|비교|규격|두께|등급|재질/], ["치수·기준", /치수|높이|깊이|폭|간격|얼마|몇|기준|크기|규정/], ["시공·순서", /순서|시공|방법|과정|설치|붙이|깔|만드|세우|교체|철거/], ["주의·하자", /주의|하자|문제|이유|왜|곰팡|누수|결로|깨|들뜸|확인|괜찮/], ["견적·수량", /견적|수량|로스|계산|포함|비용|단가|추가/], ["관리·안내", /관리|청소|고객|안내|입주|사용/]];
function helpMap(sk, grp) {                           // 가지 지도: 공정 → 갈래 → 질문. sk 가 없으면 공정 목록
  const steps = STEPS(), chip = e => `<span role="button" tabindex="0" class="hch" data-helpgo="${e.n}" title="${esc(e.q)}">${esc(kbLabel(e))}</span>`;
  const st = steps.find(s => s.key === sk), es = st ? KB.filter(e => e.s === sk) : [];
  if (!st || !es.length) return '<div class="hk">공정을 누르면 그 안의 가지를 펼쳐 보여 드립니다.</div><div class="hbx">' + steps.filter(x => KB.some(e => e.s === x.key)).map(x => `<span role="button" tabindex="0" class="hch" data-helpmap="${x.key}">${esc(x.label)} <small>${KB.filter(e => e.s === x.key).length}</small></span>`).join("") + "</div>";
  const by = {}; for (const e of es) { const g = (HELP_MAPG.find(x => x[1].test(e.q)) || ["그 밖"])[0]; (by[g] = by[g] || []).push(e) }
  const names = [...HELP_MAPG.map(x => x[0]), "그 밖"].filter(g => by[g]);
  if (grp && by[grp]) return `<div class="hk">${esc(st.label)} › ${esc(grp)} <small>${by[grp].length}개</small></div><div class="hbx">${by[grp].map(chip).join("")}</div><div class="hm"><button type="button" class="lk" data-helpmap="${sk}">‹ ${esc(st.label)} 전체</button></div>`;
  return `<div class="hk">${esc(st.label)} — 가지 <small>${es.length}개</small></div>` + names.map(g => `<div class="hl"><b role="button" tabindex="0" class="hbr" data-helpmap="${sk}|${esc(g)}">${esc(g)}</b><span class="hbx in">${by[g].slice(0, 5).map(chip).join("")}${by[g].length > 5 ? `<span role="button" tabindex="0" class="hch all" data-helpmap="${sk}|${esc(g)}">+${by[g].length - 5}</span>` : ""}</span></div>`).join("") + '<div class="hm"><button type="button" class="lk" data-helpmap="">‹ 다른 공정</button></div>';
}
function helpStepOf(w) {                              // ‘타일’, ‘도배’처럼 공정 이름만 말했을 때 그 단계 키
  const al = { 목공: "s4", 목작업: "s4", 가구: "s11", 설비: "s3", 도장: "s10", 샷시: "s2", 샤시: "s2", 창호: "s2", 화장실: "s7", 장판: "s8", 마루: "s8" }, st = al[w] ? STEPS().find(s => s.key === al[w]) : STEPS().find(s => String(s.label).split(/[·()\s]+/).includes(w));
  return st && KB.some(e => e.s === st.key) ? st.key : "";
}
function kbCard(e, more, q, weak, full, fx0) {        // 저장된 답: 핵심 + 짧은 줄. 이어서 볼 만한 질문은 한 줄로. fx0 = 앞에 내세울 문단을 직접 정할 때
  const nx = (more && more.length ? more : kbRel(e))[0], fx = fx0 >= 0 ? fx0 : q ? kbFocus(e, q) : -1;
  return (weak ? '<p class="hp h0">딱 맞는 답은 아직 없어서, 가장 가까운 내용입니다.</p>' : "") + kbBody(e, fx, full)
    + kbBranch(e, more) + helpFoot(e.n, { more: kbLong(e) ? (full ? "full" : "brief") : null, askAi: !!KB_AI });
}
function kbSay(e, more, q, weak, fx) {                // 저장된 답을 그대로 보여 준다 (AI 화면에서는 대화 맥락에도 남긴다)
  if (KB_AI) HELP_TURNS.push({ role: "user", content: q || e.q }, { role: "assistant", content: kbText(e).slice(0, 600) });
  return helpSay(kbCard(e, more, q, weak, false, fx), kbLong(e) ? kbCard(e, more, q, weak, true, fx) : null);
}
/* 이어 묻는 말: ‘깊이는?’ · ‘그럼 겨울에는?’ · ‘왜?’ · ‘주의할 점은?’ · ‘그거 두께는?’ · ‘또 있어?’ — 방금 답(과 그 주제) 안에서 먼저 푼다 */
const HELP_FOL = [[/왜|이유|때문/, /이유|왜|원인|때문/], [/주의|조심|하자|문제|단점|위험|안좋/, /주의|조심|하자|문제|단점|한계|확인/], [/순서|방법|어떻게|절차|과정/, /순서|방법|시공|과정|절차/], [/얼마|몇|치수|크기|규격|수치/, /치수|크기|규격|기준|두께|높이|깊이|폭|간격/],
  [/언제|시기|시점/, /언제|시기|시점|기간|순서/], [/장점|좋은점|좋아/, /장점|특징/], [/예시|예를|사례/, /예|사례/], [/종류|뭐가있|뭐있|어떤게있/, /종류|구분/], [/관리|청소|유지/, /관리|청소/]];
const HELP_REF = /^(그럼|그러면|그거|이거|그건|이건|그게|이게|거기|거긴|그때|근데|그런데|그리고|그래서|그렇다면|아니면|혹시)/;
const HELP_STOPW = /^(그럼|그러면|그거|이거|그건|이건|그게|이게|거기|거긴|그때|근데|그런데|그리고|그래서|그렇다면|아니면|혹시|경우|때|하면|이면|라면|점|부분|내용|뭐야?|뭔가|무엇|어떤|있어|있나|알려|해줘|말해|설명|좀|더|거|우리|저희|요즘|가능|될까|되나|있을까|좋을까|하기|위한|위에|위|아래|아래에|안에|밖에|옆에|그냥|바로|꼭|같이|직접|해도|돼|되나요|될까요|뭐뭐|뭘로|뭐로|뭐가|뭐를|뭘|뭐|무슨|필요(해|한|한거|하|함|해요)?|써|쓰|쓸|쓰는|써야|써요|뭐써|붙여|붙이|붙일|붙이는|해야|해야돼|해야해|해야하|하나|할때|할|하는|해요|해|내야|내야돼|내야해|달아|달때|다는|깔때|깔아|깔아도|까는|칠할때|칠하기|전에|후에|때는|좋아|좋은|낫|나아|걸려|걸리|걸리나|얼마|얼마나|얼마로|몇|몇이야|되|됨|들어가|들어가는|있어야|해줘요|하는데|되는거야|되는거|되는건가|되는|거야|건데|인데|했을때|한다면|들어가는게|좋겠어|좋을까|아파트|우리집|요즘|보통|일반적으로|대략|정도|낼|봐야|때|할려고|하려고|하려는데)$/;
const kbNear = (e, n) => { kbG(e); return KB.filter(x => x !== e).map(x => { kbG(x); let h = 0; for (const g of e._g) if (x._g.has(g)) h++; return { x, sc: h / Math.max(1, e._g.size) + (x.s === e.s ? 0.15 : 0) } }).sort((a, b) => b.sc - a.sc).slice(0, n).map(a => a.x) };   // 그 답과 내용이 가까운 답 n개
const helpIsFollow = q => kbCore(q).length <= 10 || HELP_REF.test(q.replace(/\s+/g, ""));
const helpRest = q0 => { const q = kbCanon(q0), s = q.replace(/\s+/g, ""), hit = HELP_FOL.find(x => x[0].test(s)), base = t => t.replace(/(에서는|에서|에는|에도|으로는|으로|로는|까지|부터|이랑|은|는|이|가|을|를|의|에|도|로|와|과|랑)$/, "");   // 내용 낱말만: 지시어·뜻 낱말은 빼고, 조사 붙은 꼴은 하나로
  const t = [...new Set(kbTok(q).flatMap(x => [x, base(x)]))].filter(x => x.length >= 2 && !HELP_STOPW.test(x) && !HELP_STOPW.test(base(x)) && !(hit && hit[0].test(x)));
  return t.filter(x => !t.some(y => y !== x && x.startsWith(y))) };
const helpBare = q => !helpRest(q).length;            // ‘왜?’ · ‘순서는?’ · ‘주의할 점은?’처럼 내용 낱말 없이 뜻만 있는 말
const helpWordIn = (text, tok) => new RegExp("(^|[\\s·,(‘'\"/~])" + tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(String(text).toLowerCase());   // 글에서 낱말이 어절 첫머리에 나오는지 (‘들어가는’ 속의 ‘가는’은 세지 않는다)
const helpFresh = (q, hs, p0) => { const top = hs[0]; if (!top || top.e === p0 || helpBare(q) || HELP_REF.test(q.replace(/\s+/g, ""))) return false; if (!p0) return top.sc >= 12;   // 방금 답과 상관없이 다른 답이 뚜렷이 맞는 새 질문인지
  const lead = helpRest(q).some(t => kbNorm(top.e.q).startsWith(t)); return top.sc >= (lead ? 15 : 20) && (lead || top.e.s === p0.s || KB_TRADE.some(x => x[1].test(q))) };
function kbFocusLoose(e, q) {                         // 이어 묻는 말일 때 방금 답의 어느 문단인지: 소제목 → 문단 글에 그 낱말이 나오는 단 하나 → 뜻(왜·주의·순서…)에 맞는 소제목
  const d = e.d || []; if (d.length < 2) return -1; const fx = kbFocus(e, q); if (fx >= 0) return fx;
  const rest = helpRest(q), hit = HELP_FOL.find(x => x[0].test(q.replace(/\s+/g, "")));
  if (rest.length) { const sc = d.map(x => { const h = kbNorm(x.h); let n = 0; for (const k of rest) n += h.includes(k) ? 3 : helpWordIn(x.t, k) ? 1 : 0; return n }), best = Math.max(...sc); return best >= 1 && sc.filter(v => v === best).length === 1 ? sc.indexOf(best) : -1 }
  return hit ? d.findIndex(x => hit[1].test(x.h)) : -1;
}
function helpFollowKb(q, p0) {                        // 방금 답에 이어 묻는 말을 저장된 답 안에서 푼다. 풀었으면 true
  if (!p0 || !helpIsFollow(q)) return false; const s = q.replace(/\s+/g, ""), ref = HELP_REF.test(s), rest = helpRest(q), bare = !rest.length, hit = HELP_FOL.find(x => x[0].test(s));
  if (s.length <= 12 && /^(또|다른(건|거|것|내용)|그밖|그외|더(없|있)|이어서)/.test(s)) { const nx = kbRel(p0)[0]; if (nx) { HELP_LAST = { q, es: [nx], topic: helpTopic(nx) }; kbSay(nx, [], ""); return true } }   // ‘또 있어?’ → 이어서 볼 만한 답
  const fx = kbFocusLoose(p0, q); if (fx >= 0) { HELP_LAST = { q, es: [p0], topic: helpTopic(p0) }; kbSay(p0, [], q, false, fx); return true }   // 방금 답 안의 그 문단
  if (bare && hit && hit[1].test(p0.q)) { HELP_LAST = { q, es: [p0], topic: helpTopic(p0) }; helpSay(kbCard(p0, [], "", false, true), kbLong(p0) ? kbCard(p0, [], "") : null); return true }   // 방금 답이 바로 그 내용(‘순서는?’ ↔ 순서 답)이면 문단 전체로 다시
  const ok = x => x.e !== p0 && (rest.length ? rest.some(t => kbNorm(x.e.q + (x.e.k || []).join("")).includes(t) || helpWordIn(x.e.a || "", t)) : !!hit && hit[1].test(x.e.q));   // 이어 물은 낱말(또는 뜻)이 실제로 든 답만
  const q2 = q.replace(/^\s*(그럼|그러면|그거|이거|그건|이건|그게|이게|거기|거긴|그때|근데|그런데|그리고|그래서|그렇다면|아니면|혹시)\s*/, ""), pool = new Set(bare ? kbNear(p0, 10) : ref ? [...kbRel(p0), ...KB.filter(x => x.s === p0.s)] : [...kbRel(p0), ...kbNear(p0, 14)]), hs = kbFind(q2, 9, 40), h = hs.find(x => pool.has(x.e) && ok(x));   // 방금 주제 둘레에서 먼저 찾는다 (뜻만 있는 말은 내용이 가까운 답 안에서, 낱말이 있으면 같은 공정에서)
  if (h && (ref || bare || (!KB_TRADE.some(x => x[1].test(q)) && h.sc >= hs[0].sc - 10))) { HELP_LAST = { q, es: [h.e], topic: helpTopic(h.e) }; kbSay(h.e, [], q2); return true }
  if (bare) { HELP_LAST = { q, es: [p0], topic: helpTopic(p0), miss: true }; helpMiss(q); helpSay(helpStuck(q, p0, null)); return true }   // 뜻만 있는 말인데 방금 답 둘레에 없으면 엉뚱한 답을 찾지 않고 길을 보여 준다
  return false;
}
const helpCalcLike = q => !helpParse(q).rows.length && (String(q).match(/\d+(\.\d+)?/g) || []).length >= 2 && /얼마|몇|계산|들어가|들어\s|필요|나와/.test(q) && /석고|각재|천[장정전]|가벽|타일|목작업|목공|벽/.test(q);   // 치수를 숫자×숫자로 적지 않은 계산 부탁
const helpLoose = (q, hs, p0) => !!(p0 && hs[0] && helpIsFollow(q) && !KB_TRADE.some(x => x[1].test(q)) && (hs[0].sc < 20 || (hs[1] && hs[1].sc >= hs[0].sc - 3)));   // 방금 답에 이어 물은 듯한 짧은 말(‘깊이는?’)인데 방금 주제에서 못 찾았고 다른 답도 뚜렷하지 않다 → 아무 공정 답이나 내밀지 않는다
const helpExact = (q, h, h2) => { if (!h) return false;
  if (h2 && h2.e.s !== h.e.s && h2.sc >= h.sc - 2 && h.sc < 45 && h.e.s !== (STEPS()[E.step] || {}).key && !KB_TRADE.some(x => x[1].test(q))) return false;   // 공정을 말하지 않았는데 여러 공정의 답이 비슷하게 맞으면 하나를 내밀지 않고 고르게 한다
  const r = helpRest(q); if (!r.length) return h.sc >= 20; const hay = kbNorm(h.e.q + (h.e.k || []).join("")), c = r.filter(t => hay.includes(t) || (t.length >= 4 && hay.includes(t.slice(0, 3))) || KB_HINT.some(([a, b]) => a.test(t) && (h.e.d || []).some(x => b.test(x.h || "")))).length / r.length;   // 저장된 답이 질문에 딱 맞는지: 점수와, 질문의 내용 낱말이 그 답의 제목·낱말에 든 비율로 본다
  return h.sc >= 30 || (h.sc >= 12 && c >= 0.6) || (h.sc >= 16 && c >= 0.5 && r.length <= 2) };
const helpIsMore = q => q.length <= 14 && /^(더|좀더)?(자세히|자세하게|상세히|풀어서|설명해)/.test(q.replace(/\s+/g, ""));   // ‘자세히 설명해 줘’ — 질문이 아니라 방금 답을 풀어 달라는 말 (배운 답으로 찾지도 쌓지도 않는다)
const HELP_MINE = /(^|\s)(이|내)\s*견적|지금|현재|방금|아까|여기|이거|이건|우리|저희|이번|몇\s*(장|개|박스|롤|평|명|군데|곳)|수량|빠진|빠졌|검수|요약|\d\s*(평|㎡|m|개|롤|박스|장|만\s*원|원)/i;   // 지금 견적·이 현장에 기대는 질문 (치수·수량·금액이 든 말 포함)
const helpGen = (q, a) => q.length <= 80 && !HELP_MINE.test(q) && !helpCalcLike(q) && !helpIsAct(q) && !/(^|\s)(지금|현재|이|이번)\s*견적|견적에(는|서는)|켜\s*(두신|둔|져\s*있)|넣어\s*두신|입력하신|입력된|보고\s*계신/.test(a);   // AI 답을 ‘배운 답’으로 쌓을 때: 누가 물어도 같은 답이 맞는 질문인가 — 짧고, 지금 견적을 가리키지 않고, 답도 지금 견적을 끌어다 쓰지 않았다. 아니면 쌓기만 하고 관리자가 ‘확인함’을 누른 뒤에 다시 쓴다
const HELP_FOLW = /그럼|그러면|그건|그거|그게|그때|그리고|그런데|근데|그래서|그렇다면|방금|아까|위에서?\s*(말|적|쓴|나온|답|물)|(^|\s)또(\s|$)|더\s*자세히|^\s*(계속|이어서)/;   // 앞 대화를 가리키는 말
const helpFollowQ = (q, first) => kbNorm(q).length <= 3 || HELP_REF.test(q.replace(/\s+/g, "")) || HELP_FOLW.test(q) || helpBare(q) || (!first && helpRest(q).length < 2);   // 앞 대화에 이어 묻는 말인가 (‘왜?’ · ‘그럼 겨울에는?’ · 대화 도중의 ‘두께는 얼마야?’처럼 무엇을 묻는지가 앞 대화에 있는 말) — 이런 말은 배운 답에서 찾지도, 누구에게나 주는 답으로 쌓지도 않는다. 그 밖의 질문은 대화 도중에 물어도 혼자서 뜻이 통하는 질문으로 본다
const helpStuck = (q, p0, hits) => '<div class="hk">' + (p0 ? "방금 답에서는 그 내용을 찾지 못했습니다." : hits && hits.length ? "딱 맞는 답은 없습니다. 아래에서 가까운 내용을 골라 보세요." : "그 내용은 아직 준비된 답이 없습니다.") + "</div>"   // 막혔을 때: 방금 답의 소제목 · 비슷한 내용 · 검색
  + (p0 && (p0.d || []).some(x => x.h) ? helpRow("방금 답", p0.d.map((x, i) => x.h ? `<span role="button" tabindex="0" class="lk in" data-helppar="${p0.n}|${i}">${esc(x.h)}</span>` : "").filter(Boolean).join(" · ")) : "")
  + (hits && hits.length ? helpRow("비슷한 내용", hits.slice(0, 3).map(h => `<span role="button" tabindex="0" class="lk in" data-helpgo="${h.e.n}">${esc(helpCut(h.e.q.replace(/[?？]$/, ""), 40))}</span>`).join("<br>")) : "")
  + helpRow("바로 찾기", helpFindLinks(q)) + helpRow("요청", "목록에 남겨 두었습니다. 다음 보완 때 답을 채웁니다.");
function helpDigest(q, hits) {                        // 딱 맞는 답은 없지만 같은 주제의 답이 여럿이면, 그 답들의 핵심을 한데 묶어 가지로 보여 준다
  const rest = helpRest(q), hay = h => kbNorm(h.e.q + (h.e.k || []).join("")), topic = rest.filter(t => hits.filter(h => hay(h).includes(t)).length >= 2).sort((a, b) => b.length - a.length)[0]; if (!topic) return "";
  const es = hits.filter(h => hay(h).includes(topic)).slice(0, 5).map(h => h.e), st = STEPS().find(x => x.key === es[0].s);
  return `<div class="hk">‘${esc(topic)}’에 관해 준비된 답을 묶었습니다. 물으신 내용만 따로 정리한 답은 아직 없습니다.</div>`
    + es.map(e => `<div class="hl"><b role="button" tabindex="0" class="hbr" data-helpgo="${e.n}" title="${esc(e.q)}">${esc(kbLabel(e))}</b><span>${helpFmt(helpFirst(e.p || e.a || ""))}</span></div>`).join("")
    + `<div class="hbx"><i>가지</i>${st ? `<span role="button" tabindex="0" class="hch all" data-helpmap="${esc(es[0].s)}">${esc(helpCut(st.label, 10))} 전체 ›</span>` : ""}</div>`
    + helpRow("바로 찾기", helpFindLinks(q)) + helpRow("요청", "물으신 내용은 목록에 남겨 두었습니다. 다음 보완 때 답을 채웁니다.");
}
function helpSay(html, alt) { const m = { who: "bot", html: '<span class="hdots"><i></i><i></i><i></i></span>' }; HELP_LOG.push(m); helpDraw(); setTimeout(() => { m.html = html; if (alt) m.alt = alt; helpDraw() }, 420); return m }   // 잠깐 쓰는 중 표시 뒤에 답 (alt = ‘자세히’를 눌렀을 때 바꿔 보일 글)
function kbSrc(es, ai) {
  const body = es.map(e => `<b>${esc(helpCut(e.q, 34))}</b><br>` + ((e.src || []).length ? e.src.map(s => `· <a href="${esc(s.u)}" target="_blank" rel="noopener noreferrer">${esc((s.site ? s.site + " — " : "") + helpCut(s.t || s.u, 46))}</a>`).join("<br>") : e.o ? "· " + esc(e.o) + "입니다." : "· 확인된 출처가 없는 일반 기준입니다. 현장에서 확인하세요.")).join("<br><br>");
  return (ai ? "이 답에는 일반 지식으로 쓴 부분이 있을 수 있습니다. 확인된 출처는 아래와 같습니다.<br><br>" : "") + (body || "방금 답에는 확인된 출처가 없습니다.") + '<br><br><small>출처 내용을 요약한 것이며 현장·제품에 따라 다를 수 있습니다.</small>';
}
const helpReqs = () => store.get("sido3_help_miss", []);
const helpFreq = () => store.get("sido3_help_hist", []).filter(x => x.n >= 2).sort((a, b) => b.n - a.n).slice(0, 12);   // 두 번 넘게 물은 질문
function helpMiss(q, tag) { const a = helpReqs(), v = (tag ? "[" + tag + "] " : "") + q; if (!a.includes(v)) { a.push(v); store.set("sido3_help_miss", a.slice(-200)); try { if (SRV && SRV.me) srv("PUT", "/api/miss", { q: v }).catch(() => {}) } catch (e) { } } }   // 답을 못 한 질문 · 보완 요청 · 추가 요청 (회사 저장소에 연결돼 있으면 거기에도 모은다)
const HELP_AV = '<i class="av"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.7 21l3.9-2.3c.8.2 1.6.3 2.4.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg></i>';
function helpDraw(keep) {
  const w = document.getElementById("helpWin"); if (!w) return; w.hidden = !HELP_OPEN; document.getElementById("helpFab").hidden = HELP_OPEN; if (!HELP_OPEN) return;
  if (!HELP_RS) helpSize();
  const nm = helpReqs().length;
  document.getElementById("helpNote").innerHTML = nm ? `<button type="button" data-helpmiss>요청 ${nm}</button>` : "";
  const body = document.getElementById("helpBody"), near = body.scrollHeight - body.scrollTop - body.clientHeight < 80;
  body.innerHTML = HELP_LOG.map((m, i) => `<div class="hr ${m.who}" data-hi="${i}">${m.who === "bot" ? HELP_AV : ""}<div class="hbub">${m.html}</div></div>`).join("");
  if (keep !== 2 && (!keep || near)) body.scrollTop = body.scrollHeight;
  document.getElementById("helpSend").textContent = HELP_BUSY ? "멈춤" : "보내기";
}
function helpSize(w0, h0) {                           // 창 크기에 맞춰 글자 크기도 정한다 (350px 일 때 13px)
  const el = document.getElementById("helpWin"), sv = store.get("sido3_help_size", null) || {};
  const w = Math.max(300, Math.min(innerWidth - 24, w0 || sv.w || 380)), h = Math.max(360, Math.min(innerHeight - 90, h0 || sv.h || 580));
  el.style.width = w + "px"; el.style.height = h + "px"; el.style.setProperty("--hf", Math.min(26, Math.max(13, 13 * w / 350)).toFixed(1) + "px"); return { w, h };
}
const helpTopic = e => (e.k || []).slice(0, 2).join(" ") || e.q;
function helpShow(e) { HELP_LOG.push({ who: "me", html: esc(e.q) }); HELP_LAST = { q: e.q, es: [e], topic: helpTopic(e) }; kbSay(e, [], e.q) }
const helpHistAll = () => store.get("sido3_help_hist", []);
function helpHist(q) { const a = helpHistAll(), k = kbNorm(q), x = a.find(y => y.k === k); if (x) { x.n++; x.t = Date.now() } else a.push({ k, q: q.slice(0, 80), n: 1, t: Date.now() }); store.set("sido3_help_hist", a.sort((p, r) => r.t - p.t).slice(0, 300)) }   // 많이 묻는 질문 기록 (프로그램·답 보완용)
/* 대화에 적힌 치수 읽기: ‘거실 2230*5730, 안방 3320*3820 로스 15%’ · ‘가벽 3000*2300 양면’ · ‘욕실 바닥 1500*2200 타일 300각’ */
let HELP_CALC = null, HELP_CTX = "", HELP_UNDO = null, HELP_LASTCALC = null;   // 넣기 전 계산 · 지금 주제(wood/tile) · 되돌릴 표 상태 · 마지막 계산(이어 묻기용)
const HELP_ROOM = /거실|공용부|주방|부엌|안방|침실|작은방|큰방|아이방|서재|드레스룸|현관|복도|욕실|화장실|발코니|베란다|다용도실|팬트리|알파룸|식당|^방\d?$|방\d$/;
const HELP_KINDW = /^(천[장정전]|가벽|벽체?|벽면|단열벽?|아트월|평탄화?|치수|크기|사이즈|길이|가로|세로|전체|바닥|목작업|목공|타일)(은|는|이|가|을|를|도)?$/;
const HELP_TILE = new Set([100, 150, 200, 250, 300, 400, 450, 500, 600, 750, 800, 900, 1000, 1200, 1600, 1800, 2400]);
function helpParse(q0) {
  let s = " " + String(q0).replace(/(\d),(?=\d{3}(?!\d))/g, "$1") + " ", tile = null, loss = null, H = 0;
  const mm = (v, u) => { v = parseFloat(v); if (!(v > 0)) return 0; u = (u || "").toLowerCase(); return Math.round(u === "m" || u === "미터" ? v * 1000 : u === "cm" || u === "센치" ? v * 10 : u ? v : v < 100 ? v * 1000 : v) };
  const blank = m => " ".repeat(m.length), tsz = (a, b) => HELP_TILE.has(+a) && HELP_TILE.has(+b);
  s = s.replace(/(\d{2,4})\s*각/g, (m, a) => { if (tile || !tsz(a, a)) return m; tile = { w: +a, h: +a }; return blank(m) });
  s = s.replace(/(\d{2,4})\s*[*xX×]\s*(\d{2,4})\s*(?:mm)?\s*(?:타일|짜리|사이즈)|타일\s*(?:크기|사이즈|규격)\s*(?:는|은)?\s*(\d{2,4})\s*[*xX×]\s*(\d{2,4})/g, (m, a, b, c, d) => { const w = a || c, h = b || d; if (tile || !tsz(w, h)) return m; tile = { w: +w, h: +h }; return blank(m) });
  s = s.replace(/(?:로스율?|손실|할증)\s*(?:은|는|을|를)?\s*(\d{1,2})(?!\d)\s*(?:%|프로|퍼센트|퍼)?|(?<![\d.])(\d{1,2})\s*(?:%|프로|퍼센트)/g, (m, a, b) => { loss = +(a || b); return blank(m) });
  s = s.replace(/높이\s*(?:는|은|가)?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|미터|센치)?(?!\s*[*xX×])/gi, (m, a, u) => { H = mm(a, u); return blank(m) });
  const kindW = t => /가벽/.test(t) ? "가벽" : /단열/.test(t) ? "단열 벽" : /아트월/.test(t) ? "아트월" : /평탄|벽체|벽면|벽(?![지걸돌])/.test(t) ? "벽 평탄화" : /천[장정전]/.test(t) ? "천장" : "";
  const nameOf = seg => { const ws = seg.replace(/[,:;()\[\]\/·+~]+/g, " ").trim().split(/\s+/).filter(Boolean), out = [];
    for (let i = ws.length - 1; i >= 0 && out.length < 4; i--) { let w = ws[i].replace(/(은|는|이|가|엔|에는|에)$/, ""); if (/도$/.test(w) && w !== "복도" && HELP_ROOM.test(w.slice(0, -1))) w = w.slice(0, -1);
      if (/^(바닥|벽|천[장정])$/.test(w)) { out.unshift(w); continue } if (HELP_KINDW.test(ws[i])) continue;
      if (HELP_ROOM.test(w)) out.unshift(w); else if (/^(및|과|와|겸|랑)$/.test(ws[i]) && out.length) out.unshift(ws[i]); else break }
    return out.join(" ").replace(/^(및|과|와|겸|랑)\s*/, "").slice(0, 16) };
  const mult = t => Math.min(4, (/양면/.test(t) ? 2 : 1) * (/(2|두)\s*겹|2\s*p\b/i.test(t) ? 2 : 1)), KW = /가벽|단열|아트월|평탄|벽|천[장정전]|,/;
  const re = /(\d+(?:\.\d+)?)\s*(mm|cm|m|미터|센치)?\s*[*xX×]\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|미터|센치)?/gi, ps = []; let m, cur = /천[장정전]/.test(s) ? "천장" : kindW(s) || "천장";
  while ((m = re.exec(s))) { if (!m[2] && !m[4] && /^\d$/.test(m[1]) && /^\d$/.test(m[3])) continue;   // ‘3×6’ 같은 판재 이름은 치수가 아니다
    ps.push({ i: m.index, e: m.index + m[0].length, w: mm(m[1], m[2] || m[4]), h: mm(m[3], m[4] || m[2]) }) }
  const rows = []; ps.forEach((p, k) => { const seg = s.slice(k ? ps[k - 1].e : 0, p.i); cur = kindW(seg) || cur; if (p.w > 0 && p.h > 0) rows.push({ kind: cur, name: nameOf(seg), w: p.w, h: p.h, m: 1, _i: p.i, _e: p.e }) });
  if (!rows.length && kindW(s) && kindW(s) !== "천장") for (const x of s.matchAll(/(\d+(?:\.\d+)?)\s*(mm|cm|m|미터|센치)?/gi)) {   // 벽은 길이만 적어도 된다 (높이는 ‘높이 2300’ 또는 천장 높이)
    if (!x[2] && +x[1] < 300) continue; const w = mm(x[1], x[2]); if (w >= 300 && w <= 30000) rows.push({ kind: kindW(s), name: nameOf(s.slice(0, x.index)), w, h: H || "", m: 1, _i: x.index, _e: x.index + x[0].length }) }
  rows.forEach((r, k) => { const nx = rows[k + 1], gap = s.slice(r._e, nx ? nx._i : s.length), cut = nx ? gap.search(KW) : -1, pre = s.slice(k ? rows[k - 1]._e : 0, r._i), pc = k ? pre.search(KW) : 0;
    r.m = mult((cut < 0 ? gap : gap.slice(0, cut)) + " " + (pc < 0 ? "" : pre.slice(pc))) });
  let left = s; for (const r of rows) left = left.slice(0, r._i) + " ".repeat(r._e - r._i) + left.slice(r._e);
  left = left.split(/[\s,:;()\[\]\/·+~.?!]+/).filter(w => w && !HELP_KINDW.test(w) && !HELP_ROOM.test(w.replace(/(은|는|이|가|엔|에는|에)$/, "")) && !/^(및|과|와|겸|랑|양면|2겹|두겹|mm)$/.test(w)).join("");
  return { rows: rows.map(({ _i, _e, ...r }) => r), loss, tile, left: left.length };
}
const helpCanon = rows => rows.map(r => `${r.kind === "천장" ? "" : r.kind.replace(/\s/g, "") + " "}${r.name && !/^(벽|바닥|천[장정])$/.test(r.name) ? r.name.replace(/[·,]/g, " ") + " " : ""}${+r.h > 0 ? r.w + "*" + r.h : "길이 " + r.w}${r.m === 2 ? (r.kind === "천장" ? " 2겹" : " 양면") : r.m === 4 ? " 양면 2겹" : ""}`).join(", ");   // 계산한 치수를 다시 적을 수 있는 글로
function helpCalcSay(p, q, extra, hint) {             // 치수 → 석고보드·각재(회사 계산식) 또는 타일 면적·장수
  const nf = v => (+v).toLocaleString("ko-KR"), H = woodH(), woodW = /석고|각재|다루끼|목작업|목공|목작|가벽|천[장정전]/.test(q), tileQ = /타일/.test(q) || p.tile ? !/석고|각재|다루끼|목작업|목공|가벽/.test(q) : !woodW && HELP_CTX === "tile";
  const dims = p.rows.map(r => { const h = +r.h > 0 ? +r.h : H; return `${esc(r.name || (tileQ ? "" : r.kind))} ${nf(r.w)}×${nf(h)}${+r.h > 0 ? "" : "(천장 높이)"}${!tileQ && r.m > 1 ? " ×" + r.m : ""} = ${(r.w * h / 1e6).toFixed(2)}㎡`.trim() }).join("<br>");
  if (tileQ) { const loss = p.loss != null ? p.loss : 10, a = p.rows.reduce((s, r) => s + r.w * (+r.h > 0 ? +r.h : H) / 1e6, 0), tot = a * (1 + loss / 100), ta = p.tile ? p.tile.w * p.tile.h / 1e6 : 0, n = ta ? Math.ceil(tot / ta - 1e-9) : 0; HELP_CTX = "tile"; HELP_CALC = null; HELP_LASTCALC = { kind: "tile", rows: p.rows, loss, lossSet: p.loss != null, tile: p.tile || null };
    return `<div class="hk">타일 <b>${tot.toFixed(2)}㎡</b>${n ? ` · ${p.tile.w}×${p.tile.h} <b>${nf(n)}장</b>` : ""} <small>로스 ${loss}% 포함</small></div>` + helpRow("치수", dims)
      + helpRow("계산", `${a.toFixed(2)}㎡ × ${(1 + loss / 100).toFixed(2)} = ${tot.toFixed(2)}㎡${n ? ` ÷ ${+ta.toFixed(4)}㎡ = ${(tot / ta).toFixed(1)} → <b>${nf(n)}장</b>` : ""}`)
      + (n ? helpRow("박스", "제품 박스에 적힌 장수(또는 ㎡)로 나눠 올림하세요.") : helpRow("장수", `타일 크기를 같이 적으면 장수까지 나옵니다. <code data-helpfill>${esc(helpCanon(p.rows))} 타일 300각</code>`)) + (extra || "") }
  const loss = p.loss != null ? p.loss : woodLossPct(), c = woodCalcOf(p.rows, loss), can = !!lineById("flatCeil"), kinds = [...new Set(p.rows.map(r => r.kind))], same = (E.ceilList || []).some(r => woodRow(r).ok && kinds.includes(r.kind || "천장"));
  HELP_CTX = "wood"; HELP_CALC = { rows: p.rows, loss, lossSet: p.loss != null }; HELP_LASTCALC = { kind: "wood", rows: p.rows, loss, lossSet: p.loss != null };
  return `<div class="hk">석고보드 <b>${c.sg}장</b> · 각재 <b>${c.dan}단</b> <small>로스 ${loss}%</small></div>` + helpRow("치수", dims)
    + helpRow("석고보드", `${c.a.toFixed(2)}㎡ ÷ 1.62 = ${c.raw.toFixed(2)}장 → 로스 ${loss}% → <b>${c.sg}장</b>`)
    + helpRow("각재", `${c.fsg}장 × 3개 = ${c.gj}개 ÷ 12 = <b>${c.dan}단</b>${c.fa !== c.a ? " <small>(겹·면이 늘어도 틀은 한 번)</small>" : ""}`)
    + (p.loss == null ? helpRow("로스", `${loss}%로 계산했습니다. 바꾸려면 <code data-helpfill>로스 15%로</code>`) : "") + (extra || "")
    + (can ? `<div class="hm">${same ? `<button type="button" data-helpadd="replace">표의 ${esc(kinds.join("·"))} 치수를 이걸로 바꾸기</button><button type="button" class="alt" data-helpadd="add">표에 추가하기</button>` : '<button type="button" data-helpadd="add">견적의 목작업 치수 표에 넣기</button>'}</div>` : "");
}
function helpPlanCalc(loss) {                         // ‘도면 치수로 계산’: 도면의 거실·주방·방 천장 치수를 그대로 쓴다
  const { rows, est } = ceilRoomRows(), ok = rows.filter(r => +r.w > 0 && +r.h > 0);
  if (!ok.length) return '<div class="hk">도면에 방 치수가 아직 없습니다.</div>' + helpRow("방법 1", "‘현장 정보’ 도면에서 방 가로·세로를 넣은 뒤 다시 물어보세요.") + helpRow("방법 2", "여기에 바로 적어 주세요. <code data-helpfill>거실 2230*5730, 안방 3320*3820</code>");
  return helpCalcSay({ rows: ok.map(r => ({ kind: "천장", name: r.name, w: r.w, h: r.h, m: 1 })), loss: loss == null ? null : loss, tile: null }, "천장 석고보드", est ? helpRow("확인", `${est}곳은 실측값이 없어 도면 추정 치수입니다. 실측 후 고쳐 주세요.`) : "");
}
function helpCalcHow(q) {                             // 계산을 맡기는 방법: 무엇을 적어 주면 되는지 한눈에
  const tile = /타일/.test(q) && !/석고|각재|목작업|목공|천[장정전]|가벽/.test(q), L = woodLossPct(); HELP_CTX = tile ? "tile" : "wood";
  return tile ? '<div class="hk">네, 치수와 타일 크기를 적어 주시면 바로 계산합니다.</div>' + helpRow("바닥·벽", "<code data-helpfill>욕실 바닥 1500*2200 타일 300각</code>") + helpRow("로스", "안 적으면 10%. 바꾸려면 <code data-helpfill>로스 15%</code>를 덧붙입니다.") + helpRow("예시", '<button type="button" data-helpsay="타일 예시로 계산">예시 치수로 먼저 해 보기</button>')
    : '<div class="hk">네, 치수만 적어 주시면 석고보드 장수와 각재 단 수를 바로 계산합니다.</div>' + helpRow("천장", "<code data-helpfill>거실 2230*5730, 안방 3320*3820</code>") + helpRow("벽", "<code data-helpfill>가벽 3000*2300 양면</code> · 높이를 빼면 천장 높이")
      + helpRow("로스", `<code data-helpfill>로스 15%</code>를 덧붙입니다. 안 적으면 ${L}%`) + helpRow("도면 치수", '<button type="button" data-helpsay="도면 치수로 천장 석고보드 계산">도면의 방 치수로 바로 계산</button>') + helpRow("예시", '<button type="button" data-helpsay="목작업 치수 예시로 계산">예시 치수로 먼저 해 보기</button>') + helpRow("견적 반영", "계산 뒤 버튼 한 번으로 목작업 치수 표에 들어갑니다.");
}
const helpWoodSnap = () => { const snap = {}; for (const k of ["woodMat", ...Object.values(WOOD_LINE)]) snap[k] = E.ln[k] ? { ...E.ln[k] } : null; return { snap, loss: E.woodLoss, insQ: E.woodInsQ, list: (E.ceilList || []).slice() } };   // 표를 바꾸기 전 상태 (되돌리기용)
function helpAddWood(mode) {                          // 계산한 치수를 목작업 치수 표에 넣는다. mode "replace" = 표의 같은 종류 줄을 새 치수로 바꾼다. ‘방금 넣은 것 빼기’로 되돌린다
  const c = HELP_CALC; if (!c || !c.rows.length) return '<div class="hk">넣을 계산이 없습니다. 치수를 먼저 적어 주세요.</div>' + helpRow("예", "<code data-helpfill>거실 2230*5730, 안방 3320*3820</code>");
  if (!lineById("flatCeil")) return "이 견적 자료에는 목작업 치수 표가 없어 넣지 못했습니다.";
  const u = helpWoodSnap(), kinds = new Set(c.rows.map(r => r.kind)), base = mode === "replace" ? u.list.filter(r => !kinds.has(r.kind || "천장")) : u.list, out = u.list.length - base.length, n = c.rows.length; HELP_UNDO = u;
  E.ceilList = base.concat(c.rows.map((r, k) => ({ id: Date.now().toString(36) + "c" + k, kind: r.kind, name: (r.name || "").replace(/\s*천[장정]$/, "").replace(/^(벽|바닥)$/, ""), w: r.w, h: +r.h > 0 ? +r.h : "", m: r.m > 1 ? r.m : "" })));
  if (c.lossSet) E.woodLoss = c.loss; ceilSync(); refresh(); HELP_CALC = null;
  const sg = woodTot(/^석고보드/), gj = woodTot(/^각재/), i4 = STEPS().findIndex(s => s.key === "s4");
  return `<div class="hk">${out ? `표의 ${esc([...kinds].join("·"))} 치수 ${out}줄을 새 치수 ${n}줄로 바꿨습니다.` : `목작업 치수 표에 ${n}줄을 넣었습니다.`}</div>` + (sg && gj ? helpRow("견적 수량", `석고보드 <b>${sg.qty}장</b> · 각재 <b>${gj.qty}단</b> <small>(커튼박스 등 다른 목공분 포함)</small>`) : "")
    + (base.length ? helpRow("확인", `표에 이미 있던 ${base.length}줄도 함께 계산됩니다.${mode === "replace" ? "" : " 같은 곳이 두 번 들어갔으면 ‘방금 넣은 것 빼기’를 누르세요."}`) : "")
    + `<div class="hm">${i4 >= 0 ? `<button type="button" data-goto="${i4}"${(k => atAttr({ at: WOOD_LINE[k] ? { cat: "s4|w_" + WOOD_LINE[k], sel: '[data-ceilpart="' + k + '"]', say: "넣은 치수는 이 카드 안에 있습니다." } : { cat: "s4|wood", sel: '[data-ceilpart="공통"]', say: "넣은 치수는 이 묶음 안에 있습니다." } }))([...kinds][0])}>치수 넣은 곳 보러 가기</button>` : ""}<button type="button" class="lk" data-helpundo>방금 넣은 것 빼기</button><button type="button" class="lk" data-helpsay="다른 치수로 다시">다른 치수로 다시</button></div>`;
}
function helpUndoWood() {
  const u = HELP_UNDO; if (!u) return "되돌릴 것이 없습니다."; HELP_UNDO = null;
  E.ceilList = u.list; E.woodLoss = u.loss; if (u.insQ === undefined) delete E.woodInsQ; else E.woodInsQ = u.insQ;
  for (const k in u.snap) { if (u.snap[k]) E.ln[k] = u.snap[k]; else delete E.ln[k] }
  refresh(); return "되돌렸습니다. 목작업 치수 표와 견적은 바꾸기 전 상태입니다.";
}
function helpTableSay() {                             // 목작업 치수 표에 지금 들어 있는 것
  const rs = (E.ceilList || []).filter(r => woodRow(r).ok), nf = v => (+v).toLocaleString("ko-KR"), i4 = STEPS().findIndex(s => s.key === "s4");
  if (!rs.length) return '<div class="hk">목작업 치수 표가 비어 있습니다.</div>' + helpRow("넣는 법", "치수를 적어 보내면 계산해서 넣을 수 있습니다. <code data-helpfill>거실 2230*5730, 안방 3320*3820</code>");
  const c = ceilCalc();
  return `<div class="hk">표에 ${rs.length}줄 — 석고보드 <b>${c.sg}장</b> · 각재 <b>${c.dan}단</b> <small>로스 ${c.loss}%</small></div>` + helpRow("치수", rs.map(r => { const x = woodRow(r); return `${esc(r.kind || "천장")} ${esc(r.name || "")} ${nf(r.w)}×${nf(x.h)}${x.m > 1 ? " ×" + x.m : ""} = ${(x.a * x.m).toFixed(2)}㎡` }).join("<br>"))
    + `<div class="hm">${i4 >= 0 ? `<button type="button" data-goto="${i4}">치수 표 보러 가기</button>` : ""}<button type="button" class="lk" data-helpsay="다른 치수로 다시">치수 고쳐서 다시</button><button type="button" class="lk" data-helpsay="치수 표 모두 비워줘">표 비우기</button></div>`;
}
const helpTabRows = () => (E.ceilList || []).filter(r => woodRow(r).ok).map(r => ({ kind: r.kind || "천장", name: r.name || "", w: +r.w, h: +r.h > 0 ? +r.h : "", m: +r.m > 1 ? +r.m : 1 }));   // 목작업 치수 표의 줄을 계산용 줄로
const HELP_EXS = { wood: ["거실 4500*3600, 안방 3300*3000", "거실 4200*3900, 주방 3000*2700, 작은방 2700*2400", "거실 5100*3600, 안방 3600*3300, 작은방 3000*2700, 복도 1200*3000"], wall: ["가벽 3000*2300 양면", "가벽 2400*2300 양면, 아트월 3600*2300"], tile: ["욕실 바닥 1500*2200 타일 300각", "현관 바닥 1200*1500 타일 600각"] };
let HELP_EXN = 0;
function helpExample(q, p, qs) {                      // ‘예시로 만들어 줘’: 연습용 치수로 바로 계산해 보여 준다. 넣어 달라고 하면 표에도 넣는다
  if (p.rows.length || qs.length > 28 || !/예시|샘플|예를들|예로|보기로|아무(거나|치수|숫자)|임의|임시로|테스트|연습|시험삼아|대충/.test(qs) || /빼|지워|삭제|취소|되돌|없애|비워/.test(qs)) return null;
  const woodT = /목작업|목공|석고|각재|다루끼|가벽/.test(qs), tileT = /타일/.test(qs), calcT = /치수|계산|면적|수량|몇(장|단|개)|넣어|입력|기입|채워|표에|치수표/.test(qs);
  if (!woodT && !tileT && /도배|벽지|장판|마루|필름|도장|페인트|전기|조명|설비|욕실|주방|싱크|가구|철거|샷시|창호|중문|에어컨|확장|질문|견적(?!.*(치수|표))/.test(qs)) return null;   // 다른 공정의 예시를 묻는 말은 저장된 답으로
  const ctx = !!(HELP_CTX && HELP_LAST && HELP_LAST.own) && /계산|만들어|해줘|해봐|보여|하나더|다른|또|줘$/.test(qs);
  if (!calcT && !((woodT || tileT) && /예시로|샘플로/.test(qs)) && !ctx) return null;
  const tile = tileT ? !woodT : !woodT && !/천[장정전]|벽|치수표/.test(qs) && HELP_CTX === "tile", wall = !tile && /가벽|벽/.test(qs) && !/천[장정전]/.test(qs);
  if (/다른|하나더|또|새로운|한번더|말고/.test(qs)) HELP_EXN++;
  const list = HELP_EXS[tile ? "tile" : wall ? "wall" : "wood"], s = list[HELP_EXN % list.length], p2 = helpParse(s), put = !tile && /넣어|입력|기입|채워|반영|추가/.test(qs) && !!lineById("flatCeil");
  const plan = !tile && !wall && ceilRoomRows().rows.some(r => +r.w > 0 && +r.h > 0);
  const note = helpRow("예시", `연습용 치수입니다. 실제 치수는 숫자만 고쳐 보내세요. <code data-helpfill>${esc(s)}</code> <button type="button" class="lk" data-helpsay="다른 예시로 계산">다른 예시</button>`) + (plan ? helpRow("도면", '<button type="button" data-helpsay="도면 치수로 천장 석고보드 계산">도면의 실제 치수로 계산</button>') : "");
  const card = helpCalcSay(p2, s + (tile ? "" : " 석고보드"), note); if (HELP_LASTCALC) HELP_LASTCALC.ex = true;   // 예시 치수는 뒤에 보내는 실제 치수와 섞지 않는다
  if (!put || (E.ceilList || []).some(r => woodRow(r).ok && p2.rows.some(x => x.kind === (r.kind || "천장")))) return card;   // 표에 같은 종류 치수가 이미 있으면 바꿀지 더할지 고르게 한다
  return helpAddWood("add").replace('<div class="hk">', '<div class="hk">예시 치수 — ').replace("</div>", "</div>" + helpRow("넣은 치수", `<code data-helpfill>${esc(s)}</code>`));
}
function helpWoodFollow(q, p) {                       // 계산·치수 표에 이어지는 말. 알아들으면 답(HTML), 아니면 null
  const qs = q.replace(/\s+/g, ""), last = HELP_LASTCALC, none = !p.rows.length;
  const ex0 = helpExample(q, p, qs); if (ex0) return ex0;
  if (HELP_CALC && none && qs.length <= 16 && /(넣어|넣자|넣을게|반영해|입력해|기입해|채워|올려|적용해|추가해|바꿔넣|교체해|(이걸로|이거로|이것으로|이치수로|새치수로)(바꿔|교체)|표.{0,8}(바꿔|교체))/.test(qs) && !/어디|어떻게/.test(qs)) {   // ‘넣어 줘’
    const kinds = [...new Set(HELP_CALC.rows.map(r => r.kind))], same = (E.ceilList || []).filter(r => woodRow(r).ok && kinds.includes(r.kind || "천장")).length, rep = /바꿔|교체|대신/.test(qs), add = /추가/.test(qs);
    if (same && !rep && !add) return `<div class="hk">표에 ${esc(kinds.join("·"))} 치수가 이미 ${same}줄 있습니다. 바꿀까요, 추가할까요?</div><div class="hm"><button type="button" data-helpadd="replace">새 치수로 바꾸기</button><button type="button" class="alt" data-helpadd="add">추가하기</button></div>`;
    return helpAddWood(rep ? "replace" : "add") }
  if (HELP_UNDO && none && qs.length <= 18 && /(넣은(것|거)?(을|를)?(빼|취소|지워)|방금.*(빼|취소|지워)|예시.{0,3}(빼|지워|삭제|취소)|^(다시|그거|이거|그건)?(빼|지워|취소|삭제)(해)?(줘|주세요|줘요)|되돌려|취소해|원래대로|원상복구)/.test(qs)) return helpUndoWood();
  if (!HELP_UNDO && none && qs.length <= 14 && /(예시|넣은(것|거)?|방금(넣은)?(것|거)?)(을|를|은|는)?(다)?(빼|지워|취소|삭제)/.test(qs)) return helpTableSay().replace('<div class="hk">', '<div class="hk">방금 넣은 기록이 없어 되돌릴 것이 없습니다. ');   // 되돌릴 것이 없으면 표에 든 것을 보여 준다   // ‘방금 넣은 거 빼 줘’
  if (none && qs.length <= 22 && /(치수|목작업|목공)표.*(뭐|무엇|어떤|보여|확인|내용|들어)|^표(에|를)?(뭐|보여|확인)|넣은치수.*(보여|확인|뭐)|(표|치수)(에|가|는|도)?(잘|제대로|다|정확히|맞게|전부)?(들어갔|들어가있|들어왔|기입됐|기입되|입력됐|입력되|반영됐|반영되)|(넣은|들어간)(거|것|치수)?(을|를|이|가)?(확인|보여|맞)/.test(qs)) return helpTableSay();   // ‘표에 뭐 들어 있어?’
  if (none && qs.length <= 12 && /^(처음부터|아예|전부)(다시|새로)/.test(qs) && (last || (HELP_LAST && HELP_LAST.own))) { HELP_CALC = null; HELP_LASTCALC = null;   // ‘처음부터 다시’
    return helpCalcHow(HELP_CTX === "tile" ? "타일" : q) + ((E.ceilList || []).length ? '<div class="hm"><button type="button" class="lk" data-helpsay="치수 표 모두 비워줘">표에 든 치수도 비우기</button></div>' : "") }
  if (none && qs.length <= 18 && (/(치수표|목작업표|치수(를|을)?(다|모두|전부|싹)).*(비워|지워|삭제)|^표(를|을)?(다|모두|전부)?(비워|지워)|(치수|표|목작업).{0,5}(초기화|리셋)/.test(qs) || (HELP_LAST && HELP_LAST.own && /^(초기화|리셋|전부지워|모두지워|다지워|싹지워|전부비워|다비워|모두비워)(해)?(줘|주세요)?[.!]?$/.test(qs)))) {   // ‘치수 표 모두 비워 줘’
    if (!(E.ceilList || []).length) return "목작업 치수 표는 이미 비어 있습니다."; HELP_UNDO = helpWoodSnap(); E.ceilList = []; ceilSync(); refresh();
    return '<div class="hk">목작업 치수 표를 비웠습니다. 수량은 원래 어림 계산으로 돌아갑니다.</div><div class="hm"><button type="button" class="lk" data-helpundo>되돌리기</button></div>' }
  if (none && qs.length <= 24 && (last || HELP_CALC || (HELP_LAST && HELP_LAST.own) || /치수|계산|석고|각재|다루끼|타일|로스/.test(qs)) && /(다른|새|새로운)치수|치수.*(바꿔|바꾸|변경|수정|고쳐|다시)|다시(계산|넣|입력|할|해)|(수정|변경)(할래|하고|해줘|할게|해서)|고쳐서|고칠게|잘못(넣|적|입력|말)|틀렸/.test(qs)) {   // ‘다른 치수로’
    const tab = (E.ceilList || []).filter(r => woodRow(r).ok).map(r => ({ kind: r.kind || "천장", name: r.name || "", w: +r.w, h: +r.h > 0 ? +r.h : "", m: +r.m > 1 ? +r.m : 1 })), rows = last && last.rows.length ? last.rows : tab;
    if (!rows.length) return helpCalcHow(q);
    const canon = helpCanon(rows) + (last && last.kind === "tile" ? (!last.tile ? " 타일" : last.tile.w === last.tile.h ? " 타일 " + last.tile.w + "각" : " " + last.tile.w + "*" + last.tile.h + " 타일") : "");
    setTimeout(() => { const el = document.getElementById("helpQ"); if (el && !el.value) { el.value = canon; el.focus() } }, 560);
    return '<div class="hk">네, 바꿀 치수를 보내 주세요. 방금 치수를 입력 칸에 넣어 두었으니 숫자만 고쳐서 보내면 됩니다.</div>' + helpRow("방금 치수", `<code data-helpfill>${esc(canon)}</code>`) + helpRow("예시로 해 보기", "<code data-helpfill>거실 4500*3600, 안방 3300*3000</code>")
      + (tab.length ? helpRow("표 반영", "새로 계산한 뒤 ‘표의 치수를 이걸로 바꾸기’를 누르면 표의 줄이 새 치수로 바뀝니다.") : "") }
  const L = last || (t => t.length ? { kind: "wood", rows: t, loss: woodLossPct(), lossSet: false } : null)(helpTabRows());   // 대화에서 계산한 적이 없으면 목작업 치수 표의 줄을 바탕으로 본다
  if (!L) return null;
  const wood = L.kind === "wood", lossOf = () => p.loss != null ? p.loss : (L.lossSet ? L.loss : null), again = (rows, extra) => helpCalcSay({ rows, loss: lossOf(), tile: L.tile || null }, wood ? "석고보드" : "타일", extra);
  const rk = r => (r.name || "").replace(/\s*천[장정]$/, "").replace(/\s+/g, ""), sameRow = (r, x) => x.kind === r.kind && !!rk(r) && rk(x) === rk(r), setRow = (x, r) => ({ ...x, w: r.w, h: +r.h > 0 ? r.h : x.h, m: r.m > 1 ? r.m : x.m });
  if (p.rows.length && !/추가|더해|더넣|포함|합쳐|까지|따로|새로/.test(qs) && !/(방|실|관|장|니|다|재|룸|도|엌|당|리)도\s*\d/.test(q)) {   // 방금 계산(또는 표)의 한 곳만 고치는 말: ‘안방 치수를 3500*3000으로 바꿔 줘’ · ‘거실은 4000*3600이야’
    const qe = qs.replace(/[.!?？~]+$/, ""), verb = /바꿔|바꾸|변경|수정|고쳐|고치|정정/.test(qe), mark = verb || /아니고|아니라|아니야|잘못|틀렸/.test(qe), soft = /\d(mm)?(으로|로)(해|할게|하자|해줘)?$/.test(qe);
    const nm = p.rows.every(r => rk(r)), hit = nm && p.rows.every(r => L.rows.some(x => sameRow(r, x))), own = !!(HELP_LAST && HELP_LAST.own), dim = r => `${r.w}*${+r.h > 0 ? r.h : woodH()}`;
    if (hit && (mark || soft || (own && !L.ex && p.rows.length < L.rows.length && !/계산|석고|각재|타일|몇/.test(qs))))
      return again(L.rows.map(x => { const r = p.rows.find(r => sameRow(r, x)); return r ? setRow(x, r) : x }), helpRow("바꾼 곳", `${esc(p.rows.map(r => r.name).join(" · "))} <small>나머지는 그대로</small>` + (verb ? "" : ` <button type="button" class="lk" data-helpsay="${esc(helpCanon(p.rows))} 따로 계산">이 치수만 따로 계산</button>`)));
    if (mark && nm && !hit) { const miss = p.rows.filter(r => !L.rows.some(x => sameRow(r, x)));
      return `<div class="hk">${last ? "방금 계산" : "치수 표"}에 ‘${esc(miss.map(r => r.name).join("·"))}’ 치수는 없습니다. 추가할까요?</div>` + helpRow("지금 있는 곳", esc(L.rows.map(x => x.name || x.kind).join(" · "))) + `<div class="hm"><button type="button" data-helpsay="${esc(helpCanon(miss))} 추가">추가하기</button></div>` }
    if ((mark || soft) && p.rows.length === 1 && !nm) { const r = p.rows[0], cand = L.rows.filter(x => r.kind === "천장" && !/천[장정전]/.test(q) ? true : x.kind === r.kind);   // 이름 없이 치수만: 한 줄뿐이면 그 줄, 여러 줄이면 어느 곳인지 묻는다
      if (cand.length === 1) return again(L.rows.map(x => x === cand[0] ? setRow(x, r) : x), helpRow("바꾼 곳", esc(cand[0].name || cand[0].kind)));
      if (cand.length > 1) return `<div class="hk">어느 곳 치수를 ${esc(dim(r).replace("*", "×"))}로 바꿀까요?</div><div class="hm">` + cand.slice(0, 6).map(x => `<button type="button" data-helpsay="${esc((x.name || x.kind) + " 치수를 " + dim(r) + "으로 바꿔줘")}">${esc(x.name || x.kind)}</button>`).join("") + "</div>" }
  }
  if (!last) return null;
  if (p.loss != null && none && qs.length <= 16) return again(last.rows);   // ‘로스 15%로’
  if (none && qs.length <= 14 && /로스(율)?(는|를|은|도)?(빼|없이|제외|안넣|없애)/.test(qs)) return helpCalcSay({ rows: last.rows, loss: 0, tile: last.tile || null }, wood ? "석고보드" : "타일");   // ‘로스 없이’
  if (none && qs.length <= 18 && /만/.test(qs)) { const only = last.rows.filter(r => r.name && r.name.split(/\s+/).some(w => w.length >= 2 && qs.includes(w + "만"))); if (only.length && only.length < last.rows.length) return again(only) }   // ‘거실만 계산해 줘’
  if (wood && none && qs.length <= 16 && (/^(그럼|그러면|그래서|결국)?(총|합계|전부|다해서|모두)?(석고(보드)?|각재|다루끼)(는|은|만|도|가|이)?(총)?(몇(장|단|개))?(이야|야|예요|이에요|인가요|나와|나왔어|들어가|들어|필요해|필요)?[?？]*$/.test(qs) && ((HELP_LAST && HELP_LAST.own) || /몇(장|단|개)/.test(qs)) || /^(그럼|그래서|결국)?(총|합계|다해서|전부해서|모두)(는|은)?(몇(장|단)|얼마)|^(계산)?결과(다시|보여|알려|는|가)/.test(qs))) return again(last.rows);   // ‘각재는?’ · ‘그래서 총 몇 장?’
  if (wood && p.rows.length && (/추가|더해|더넣|포함|합쳐|까지/.test(qs) || /(방|실|관|장|니|다|재|룸|도|엌|당|리)도\s*\d/.test(q))) return again(last.rows.concat(p.rows));   // ‘작은방도 2550*2400’
  if (none && qs.length <= 16 && /(빼|제외|없이)/.test(qs)) { const keep = last.rows.filter(r => !(r.name && r.name.split(/\s+/).some(w => w.length >= 2 && qs.includes(w)))); if (keep.length && keep.length < last.rows.length) return again(keep) }   // ‘안방은 빼 줘’
  if (wood && none && qs.length <= 14 && /(양면|단면|한면|2겹|두겹|한겹|1겹)/.test(qs)) { const two = /양면/.test(qs), dbl = /(2|두)겹/.test(qs), one = /(단면|한면|한겹|1겹)/.test(qs);   // ‘양면으로’ · ‘2겹으로’
    const rows = last.rows.map(r => { const m = r.m || 1, wall = r.kind !== "천장", side = two ? (wall ? 2 : 1) : (wall && m >= 2 ? 2 : 1), ply = dbl ? 2 : (m === 4 || (!wall && m === 2) ? 2 : 1); return { ...r, m: one ? 1 : side * ply } });
    if (rows.every((r, k) => r.m === (last.rows[k].m || 1))) return '<div class="hk">바뀐 것이 없습니다. 양면은 벽(가벽) 치수에만 적용되고, 천장은 ‘2겹으로’만 됩니다.</div>' + helpRow("예", "<code data-helpfill>가벽 3000*2300 양면</code>");
    return again(rows) }
  if (wood && none && qs.length <= 24 && /(왜|어떻게).*(나왔|나온|나와|계산|단|장)|계산(식|방법|근거)|근거가?뭐/.test(qs)) { const c = woodCalcOf(last.rows, last.loss);   // ‘왜 8단이야?’
    return '<div class="hk">석고보드는 면적 ÷ 1.62, 각재는 석고 1장당 3개이고 12개가 1단입니다.</div>' + helpRow("석고보드", `${c.a.toFixed(2)}㎡ ÷ 1.62 = ${c.raw.toFixed(2)}장 → 로스 ${last.loss}% 더하면 ${(c.raw * (1 + last.loss / 100)).toFixed(2)}장 → 올림 <b>${c.sg}장</b>`)
      + helpRow("각재", `${c.fsg}장 × 3개 = ${c.gj}개 ÷ 12 = ${(c.gj / 12).toFixed(2)}단 → 올림 <b>${c.dan}단</b> (한치각 12자)`) + helpRow("기준", "회사 계산식입니다. 석고보드 3×6 한 장이 1.62㎡입니다.") }
  if (none && qs.length <= 14 && /(몇평|평수|면적|헤베|제곱|㎡)/.test(qs)) { const H = woodH(), a = last.rows.reduce((s, r) => s + r.w * (+r.h > 0 ? +r.h : H) / 1e6, 0);   // ‘몇 평이야?’
    return `<div class="hk">면적 <b>${a.toFixed(2)}㎡</b> · ${(a / 3.3058).toFixed(2)}평 · ${(a * 1e6 / 90000).toFixed(1)}자평</div>` + helpRow("기준", "1평 = 3.3058㎡, 1자평 = 303×303mm 입니다.") }
  if (none && qs.length <= 22 && /치수|표에|넣어|넣을|계산|로스/.test(q) && !kbFind(q, 12, 1).length)   // 계산 흐름에서 못 알아들은 말: 할 수 있는 일을 보여 준다
    return '<div class="hk">치수 계산에서 할 수 있는 일입니다.</div>' + helpRow("새 치수", '<code data-helpfill>거실 4500*3600, 안방 3300*3000</code> <button type="button" class="lk" data-helpsay="목작업 치수 예시로 계산">예시로 계산</button>') + helpRow("고치기", '<button type="button" data-helpsay="다른 치수로 다시">방금 치수 고쳐서 다시</button> <code data-helpfill>로스 15%로</code>')
      + helpRow("더하기·빼기", "<code data-helpfill>작은방도 2550*2400</code> <code data-helpfill>안방은 빼줘</code>") + helpRow("표", '<button type="button" data-helpsay="치수 표에 뭐 들어 있어?">표에 든 치수 보기</button>' + (HELP_UNDO ? ' <button type="button" class="lk" data-helpundo>방금 넣은 것 빼기</button>' : ""));
  return null;
}
function helpBathSay(q) { const qs = q.replace(/\s+/g, "");   // (v71) 욕실마다 공사 범위를 말로 바꾼다 — helpDo 맨 앞에서 부른다(‘견적 어떻게 내’ 같은 큰 질문 안내보다 먼저)
  { const md = /덧방/.test(qs) ? "over" : /(도기|수전).{0,5}만/.test(qs) ? "fix" : /전체교체|전체로교체|전부교체|올철거|전체철거|철거하고새로/.test(qs) ? "full" : /(안함|안해|안할|빼줘|빼고|제외해|공사안|그대로둬|그대로두)/.test(qs) && /(안방|부부|공용|거실|욕실1|욕실2|1번|2번|한칸|하나)/.test(qs) && /욕실|화장실/.test(qs) && !/타일|도기|수전|천장|환풍기|거울|방수|철거|줄눈|문|필름/.test(qs) ? "none" : "", bs = md ? bathList() : [];   // (v88) ‘안방 욕실은 안 해’ = 그 욕실은 공사하지 않음 (화면에서 고르는 칸을 없앴으므로 말로 바꾼다)   // (v71) ‘안방 욕실은 덧방으로 해 줘’ · ‘욕실 둘 다 덧방’ · ‘덧방은 어디서 넣어?’ — 욕실마다 공사 범위를 고른다
    if (md && bs.length && /욕실|화장실|덧방/.test(qs) && qs.length <= 34 && !/(뭐야|뭔가|이란|차이|장단점|하자|주의|순서|기간|며칠|가능|조건|괜찮|문제|두께|높이|문턱)/.test(qs)) {
      const named = /(안방|부부|공용|거실|욕실1|욕실2|1번|2번|둘다|두칸|모두|전부)/.test(qs), ask = /어디|어떻게|넣|견적|고르|바꾸|바꿔|설정|선택|체크|하려면|할래|할게/.test(qs);
      const act = helpIsAct(q) || (named && !ask && (md === "none" || /(만|으로|로|해|함|해요|합니다)$/.test(qs.replace(/[?？!.~]+$/, ""))));   // (v88) ‘안방 욕실은 안 해’ · ‘욕실2는 도기 수전만’처럼 어느 욕실인지 짚어 말하면 바로 바꾼다 (화면에 고르는 칸이 없으므로)
      if (act || ask) { const lab = bathLabel(md), where = helpRow("바꾸는 법", "화면에서 고르는 칸은 없고 이렇게 말로 바꿉니다: <code data-helpfill>안방 욕실은 덧방으로 해 줘</code> <code data-helpfill>욕실2는 도기 수전만</code> <code data-helpfill>안방 욕실은 안 해</code> <code data-helpfill>욕실 둘 다 전체 교체로</code> · ‘욕실·타일’ 단계 맨 위에 지금 상태가 한 줄로 나옵니다.") + helpRow("바뀌는 것", "덧방으로 고른 욕실은 철거와 방수가 빠지고 타일·천장·도기는 그대로 들어갑니다. ‘도기·수전만’은 타일과 천장도 빠집니다.");
        const pick = /둘다|두칸|모두|전부|다덧방|전체욕실|욕실전부/.test(qs) ? bs : /안방|부부|욕실2|2번/.test(qs) ? bs.filter(s => s.id === "bath2") : /거실|공용|욕실1|1번/.test(qs) ? bs.filter(s => s.id === "bath1") : bs.length === 1 ? bs : [];
        if (!act || !pick.length) return `<div class="hk">욕실마다 공사 범위를 따로 고릅니다. 어느 욕실을 ‘${esc(lab)}’${bathRo(lab).slice(lab.length)} 할까요?</div>` + where + `<div class="hm">${bs.map(s => `<button type="button" class="lk" data-bathmode="${s.id}|${md}">${esc(s.name)}</button>`).join("")}${bs.length > 1 ? `<button type="button" class="lk" data-bathmode="*|${md}">모두</button>` : ""}</div>`;
        for (const s of pick) bathModeSet(s.id, md); refresh(true);
        return `<div class="hk">${pick.map(s => esc(s.name)).join(" · ")} → ‘${esc(lab)}’${bathRo(lab).slice(lab.length)} 바꿨습니다.</div>` + where + '<div class="hw">⚠ 철거·방수·타일·도기 수량이 맞는지 실장님이 직접 확인해 주세요.</div><div class="hm"><button type="button" class="lk" data-undo>되돌리기</button></div>' } } }
  return null }
function helpProgDo(q) {                              // 프로그램 조작: 단계 이동 · 견적서 열기 · 공사 찾아 켜기/끄기. 알아들으면 답(HTML), 아니면 null
  const qs = q.replace(/\s+/g, ""), steps = STEPS();
  if (qs.length <= 22 && /(가줘|가자|이동|열어|넘어가|보여줘|보러)/.test(qs) && /(단계|공정|화면|탭|견적서|으로|로)/.test(qs)) {   // ‘목공 단계로 가 줘’
    if (/견적서/.test(qs)) { show("doc"); const k = estCheck(steps).filter(c => c.lv < 3).length; return k ? `<div class="hk">상세견적서를 열었습니다. 확인할 것이 <b>${k}건</b> 남아 있습니다.</div><div class="hm"><button type="button" data-helpsay="뭐 안 했지?">덜 된 것 보기</button></div>` : "상세견적서를 열었습니다. 내보내기 전에 한 번 더 확인해 주세요." }
    let i = steps.findIndex(s => String(s.label).split(/[·()\s]+/).some(w => w.length >= 2 && qs.includes(w)));
    if (i < 0) { const t = KB_TRADE.find(x => x[1].test(q)); if (t) i = steps.findIndex(s => s.key === t[0]) }
    if (i < 0 && /현장정보|처음/.test(qs)) i = 0;
    if (i >= 0) { show("check"); E.step = i; renderChecklist(); save(); window.scrollTo({ top: 0, behavior: "smooth" }); return `‘${esc(steps[i].label)}’ 단계로 옮겼습니다.` } }
  { const xn = [...XSP_PRE.map(p => p[0]), "세탁실", "가족실", "드레스룸"].find(n => qs.includes(n.replace(/\s+/g, "")));   // (v63) ‘보조 주방 추가해 줘’ · ‘다용도실은 어디서 넣어?’ — 공사 이름이 같이 나오면(다용도실 타일 넣어 줘) 공사 쪽으로 넘긴다
    if (xn && qs.length <= 26 && /(공간|추가|만들어|넣어|넣을|넣고|넣는|있어|있는데)/.test(qs) && !/(철거|도배|벽지|타일|장판|마루|페인트|탄성|필름|몰딩|걸레받이|조명|등|문|창|샷시|방수|확장|단열|빼|제외|얼마|금액|가격|비용)/.test(qs.replace(xn.replace(/\s+/g, ""), ""))) {
      const where = helpRow("넣는 곳", "‘현장 정보 → 공간 → 추가 공간’ 줄입니다. 이름을 누르면 들어가고, 가로·세로(mm)를 넣으면 그때부터 수량·금액에 들어갑니다.") + helpRow("금액", "넓이를 넣기 전에는 금액이 바뀌지 않습니다. 방·욕실·발코니 개수와 도배 평수·바닥 평수는 그대로입니다. ‘✕ 빼기’를 누르면 넣기 전으로 돌아갑니다.");
      if (xn === "드레스룸") return '<div class="hk">드레스룸은 ‘현장 정보 → 공간’의 ‘드레스룸’ 칸에서 1을 누르면 들어갑니다.</div>' + helpRow("넓이", "안방 넓이에서 떼어 냅니다. 실측 표에 가로·세로를 넣으면 그 값으로 계산합니다.");
      if (xspList().some(x => x.name.replace(/\s+/g, "") === xn.replace(/\s+/g, ""))) return `<div class="hk">‘${esc(xn)}’은(는) 이미 들어 있습니다.</div>` + where + '<div class="hm"><button type="button" class="lk" data-xspgo>추가 공간 줄 보기</button></div>';
      if (!helpIsAct(q) || /어디|어딨|어떻게|방법/.test(qs)) return `<div class="hk">${esc(xn)} 같은 공간은 ‘추가 공간’으로 넣습니다.</div>` + where + `<div class="hm"><button type="button" class="lk" data-helpsay="${esc(xn)} 추가해줘">지금 ${esc(xn)} 넣기</button><button type="button" class="lk" data-xspgo>추가 공간 줄 보기</button></div>`;
      const r = xspAdd(xn); if (r.err) return `<div class="hk">${esc(r.err)}</div>` + where;
      refresh(true); return `<div class="hk">‘${esc(xn)}’을(를) 공간에 넣었습니다. 아직 금액은 그대로입니다.</div>` + where + '<div class="hw">⚠ 넓이와 계산 방식(방처럼 · 주방처럼 · 발코니처럼)은 실장님이 직접 확인해 주세요.</div><div class="hm"><button type="button" class="lk" data-undo>되돌리기</button><button type="button" class="lk" data-xspgo>추가 공간 줄 보기</button></div>' } }
  if (qs.length <= 22 && !/배관|난방|보일러|방법|뭐야|이란|차이/.test(qs)) {   // ‘견적 저장해 줘’ · ‘인쇄하고 싶어’ · ‘엑셀로 만들어 줘’ · ‘저장된 견적 열어 줘’
    const ask = helpIsAct(q) || /어디|어딨|어떻게|하고싶|할래|하려면|하자$|할게$/.test(qs), doc = t => { show("doc"); return `<div class="hk">상세견적서를 열었습니다. 위쪽 ‘${t}’ 단추를 누르세요.</div>` };
    if (ask && /저장(된|한)견적|견적목록|불러와|불러오|예전견적|지난견적|이전견적/.test(qs)) { show("saved"); return '<div class="hk">‘저장된 견적’ 화면을 열었습니다.</div>' + helpRow("다음", "목록에서 견적을 고르면 다시 열립니다.") }
    if (ask && /인쇄|프린트|출력|pdf/i.test(qs)) return doc("인쇄 · PDF 저장");
    if (ask && /엑셀/.test(qs)) return doc("엑셀 견적서 저장 (.xlsx)") + helpRow("다른 방법", "‘엑셀용 복사’를 누른 뒤 엑셀에 붙여 넣어도 됩니다.");
    if (ask && /내보내|파일로/.test(qs)) return doc("견적 파일 내보내기");
    if (ask && /버전/.test(qs)) return doc("버전 올리기 (변경 견적)");
    if (/^(새견적|새로운견적|새견적서|새로견적)|견적(서)?(을|를)?새로/.test(qs)) {
      if (!ask || /어디|어딨|어떻게|방법/.test(qs)) return '<div class="hk">‘현장 정보’ 맨 위(또는 견적 합계 칸)의 ‘＋ 새 견적 만들기’를 누르면 됩니다.</div>' + helpRow("쓰던 견적", "지워지지 않고 ‘저장된 견적’에 임시저장으로 남습니다. ‘이어 쓰기’를 누르면 쓰던 단계에서 다시 시작합니다.") + '<div class="hm"><button type="button" class="lk" data-helpsay="새 견적 만들어줘">지금 새 견적 시작</button></div>';
      const had = estHas(); if (newEst() === false) return '<div class="hk">이 브라우저에는 더 저장할 수 없어 쓰던 견적을 남기지 못했습니다. ‘견적 파일 내보내기’로 보관한 뒤 ‘＋ 새 견적 만들기’를 누르세요.</div>';
      return '<div class="hk">새 견적을 시작했습니다.</div>' + (had ? helpRow("쓰던 견적", "‘저장된 견적’에 남겨 두었습니다. ‘이어 쓰기’를 누르면 다시 열립니다.") + '<div class="hm"><button type="button" class="lk" data-undo>되돌리기 (쓰던 견적으로)</button><button type="button" class="lk" data-helpsay="저장된 견적 열어줘">저장된 견적 보기</button></div>' : "") }
    if (/임시저장/.test(qs) && !/안눌러|안누르|자동|저절로|회사|올라가|몇분/.test(qs)) {   // ‘임시저장 안 눌러도 저장돼?’ 같은 물음은 저장된 답(자동 임시저장)으로 보낸다
      if (!ask || /어디|어딨|어떻게|방법|뭐/.test(qs)) return '<div class="hk">‘현장 정보’ 맨 위나 견적 합계 칸의 ‘임시저장’을 누르면 쓰던 견적이 ‘저장된 견적’에 들어갑니다.</div>' + helpRow("이어 쓰기", "‘저장된 견적’에서 ‘이어 쓰기’를 누르면 쓰던 단계에서 다시 시작합니다.") + helpRow("저장과 다른 점", "‘저장’은 그때의 단가를 견적에 고정합니다. ‘임시저장’은 쓰던 그대로 넣어만 둡니다.") + '<div class="hm"><button type="button" class="lk" data-helpsay="임시저장해줘">지금 임시저장</button></div>';
      save(); const ok = stashEst(true); estBarUp(); return ok ? '<div class="hk">임시저장했습니다.</div>' + helpRow("이어 쓰기", "‘저장된 견적’에서 ‘이어 쓰기’를 누르면 쓰던 단계에서 다시 시작합니다.") : '<div class="hk">이 브라우저에는 더 저장할 수 없습니다. ‘견적 파일 내보내기’로 보관하세요.</div>' }
    if (ask && /^(이거|이견적|견적|지금견적|현재견적|지금|현재)?(을|를|좀)?저장/.test(qs) && !/안하|안누|안눌|닫으|닫았|끄면|꺼지|꺼졌|날아|날라|사라|없어지|안했/.test(qs)) { const b = document.querySelector('[data-act="save"]');
      if (b && /어디|어딨|어떻게/.test(qs)) { show("check"); return '<div class="hk">화면의 ‘저장’ 단추를 누르면 됩니다. 여기서 “견적 저장해줘”라고 하셔도 저장합니다.</div>' }
      if (b) { b.click(); return '<div class="hk">지금 견적을 저장했습니다.</div>' + helpRow("확인", "‘저장된 견적’ 탭에서 다시 열 수 있습니다.") + '<div class="hm"><button type="button" class="lk" data-helpsay="저장된 견적 열어줘">저장된 견적 보기</button></div>' }
      show("check"); return '<div class="hk">‘① 견적 입력’ 화면을 열었습니다. 요약 칸의 ‘저장’ 단추를 누르세요.</div>' }
  }
  const act = /(켜줘|켜주세요|체크해|추가해줘|추가해주세요|넣어줘|넣어주세요)$/.test(qs.replace(/[?？!.]+$/, "")) ? "on" : /(꺼줘|꺼주세요|해제해|빼줘|빼주세요)$/.test(qs.replace(/[?？!.]+$/, "")) ? "off" : /(어디서|어디에|어디)(넣|켜|체크|추가|있|찾|고르|선택)|어딨/.test(qs) && !/치수|박스|도면|메모|저장|실측|견적서|평면도/.test(qs) ? "find" : "";
  if (!act || !D.stepLines || qs.length > 26) return null;
  const terms = kbTok(q).filter(t => !/^(켜|꺼|체크|추가|넣어|빼|해제|어디|프로그램|공사|항목|견적|있어|찾아|이거|그거|좀)/.test(t)).sort((a, b) => b.length - a.length); let hit = null, term = terms[0] || "";
  const sc = Object.entries(D.stepLines).flatMap(([sk, ls]) => ls.map(l => ({ st: steps.find(s => s.key === sk), l, lab: kbNorm(lineLabel(l) + (l.label || "")) }))).filter(x => x.st).map(x => ({ ...x, n: terms.filter(t => x.lab.includes(t)).length })).filter(x => x.n).sort((a, b) => b.n - a.n);
  if (act === "find" && !/(어디서|어디에|어디)(넣|켜|체크|추가|고르|선택)/.test(qs) && !(sc.length && sc[0].n >= terms.length) && kbFind(q, 20, 1).length) return null;   // ‘어디 있어?’처럼 애매하고 딱 맞는 공사 이름도 없으면 저장된 답이 먼저
  if (sc.length) { hit = sc.filter(x => x.n === sc[0].n); const par = hit.filter(x => !(x.l.follow && hit.some(y => y.l.id === x.l.follow))); if (par.length) hit = par }   // 공사 이름에 낱말이 가장 많이 든 것 (작업을 따라다니는 자재·부자재 줄은 작업 줄에 맡긴다)
  else for (const t of terms) { const r = findItems(t); if (r.lines.length && r.lines.length <= 12) { hit = r.lines; term = t; break } }   // 없으면 분류·품목 이름까지 넓혀 찾는다
  if (!hit) return null;
  if (act !== "find" && hit.length === 1) { const { st, l } = hit[0], on = act === "on"; lnSetAll(l, on); refresh(); const gi = steps.findIndex(s => s.key === st.key);
    return `<div class="hk">‘${esc(lineLabel(l))}’ 공사를 ${on ? "켰습니다" : "껐습니다"}. <small>${esc(st.label)}</small></div><div class="hm">${gi >= 0 ? `<button type="button" data-goto="${gi}">그 단계 보기</button>` : ""}<button type="button" class="lk" data-helpline="${esc(l.id)}|${on ? 0 : 1}">되돌리기</button></div>` }
  return `<div class="hk">‘${esc(term)}’ 관련 공사 ${hit.length}개입니다. 누르면 켜지거나 꺼집니다.</div>` + hit.slice(0, 7).map(({ st, l }) => { const on = lnState(l).on; return `<div class="hl"><b>${esc(helpCut(lineLabel(l), 16))}</b><span>${esc(st.label)} · ${on ? "켜짐" : "꺼짐"} <button type="button" data-helpline="${esc(l.id)}|${on ? 0 : 1}">${on ? "끄기" : "켜기"}</button></span></div>` }).join("");
}
function lnSetAll(l, on) { setLn(l, { on }); for (const x of Object.values(D.stepLines || {}).flat()) if (x.follow === l.id) setLn(x, { on }); if (on && l.sel) { const w = lnFind("woodLabor"); if (w && !lnState(w).on) setLn(w, { on: true }) } }   // 줄을 켜고 끌 때 따라다니는 줄(그 작업의 자재·부자재)도 함께. 인원만 넣는 작업이면 목수 작업비 줄도 켠다
function helpLineSet(v) {                             // 챗봇의 ‘켜기/끄기’ 단추
  const [id, on] = String(v).split("|"), l = Object.values(D.stepLines || {}).flat().find(x => x.id === id); if (!l) return "그 공사를 찾지 못했습니다.";
  lnSetAll(l, on === "1"); refresh(); const st = (D.steps || []).find(s => (D.stepLines[s.key] || []).includes(l)), gi = st ? STEPS().findIndex(s => s.key === st.key) : -1;
  return `<div class="hk">‘${esc(lineLabel(l))}’ 공사를 ${on === "1" ? "켰습니다" : "껐습니다"}.</div><div class="hm">${gi >= 0 ? `<button type="button" data-goto="${gi}">그 단계 보기</button>` : ""}<button type="button" class="lk" data-helpline="${esc(id)}|${on === "1" ? 0 : 1}">되돌리기</button></div>`;
}
/* ‘어떤 게 부족하지?’ · ‘뭐 안 했지?’ · ‘다 됐어?’ · ‘이제 뭐 해야 해?’ — 지금 견적에서 덜 된 것을 짚고, 고치면 남은 것을 이어서 알려 준다 */
const HELP_GAP1 = /부족|모자라|모자란|빠진|빠뜨|빠졌|빠트|누락|놓친|놓쳤|빼먹|빼놓|깜빡|까먹|덜(한|했|된|됐|넣)|안(한|했|넣은|넣었|채운|채웠|된|됐)|못(한|했)|남은(거|것|게|건|일)|남았|미완|미입력|비어있|비었|빈(곳|칸|데)/;   // 덜 된 것을 묻는 말
const HELP_GAP2 = /^(이제|그럼|그러면|견적|이견적|지금견적|이거)?(은|는|이|가)?(다|전부|모두)(했|됐|된|끝났|끝난|채웠|넣었|한거|된거)|끝났(어|나|지|니|을까)|끝난(거|건)|완성(됐|된|이야|인가)|마무리(됐|된|해도)|(뭐|뭘|무엇을?|어떤걸?)(를|을)?(더)?(해야|하면돼|넣어야|채워야|봐야|확인해야|고쳐야)|다음(에|엔|은|으로)?(뭐|뭘|무엇)|이제(뭐|뭘|무엇)|할일|(확인|체크|점검|검토|수정)(할|해야할|해야될)(거|것|게|데|곳)|(점검|검토|검수|체크)(해|좀|부탁|한번|돌려)|(견적|이거|한번|좀)봐줘|내보내도돼|보내도돼|제출해도|견적서?(은|는|이|가)?(괜찮|어때|어떤가|문제없|이상없)/;   // 다 됐는지 · 무엇을 더 해야 하는지 묻는 말
const HELP_GAP3 = /(문제|이상한(거|것|게|데)|잘못된(거|것|게|데)|틀린(거|것|게|데))(가|는|이)?(있|없)|제대로(했|됐|된|한|넣)|맞게(했|됐|넣)/;   // 뜻이 넓은 말: 견적을 가리킬 때만 점검으로 본다
var HELP_TRACK = null, HELP_TRT = 0; let KB_KWS = null, KB_KWN = -1;
function helpIsGap(q) {                               // 지금 견적에서 덜 된 것을 묻는 말인가 → "all" · 공정을 짚었으면 그 단계 키 목록 · 아니면 ""
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length > 24 || /어떻게|왜|하면(?!돼)|되면|언제|얼마|이유|방법|차이|종류|뭐야|이란|때는|(할|살|볼|고를|받을|줄|쓸)때|경우|고를|고르|계약|잔금|입주|이사|공사전|시작전|착공|상담|실측|현장|첫날|고객|하자|(는|인|던)데.|\d/.test(qs)) return "";
  const g1 = HELP_GAP1.test(qs), g2 = HELP_GAP2.test(qs), g3 = HELP_GAP3.test(qs) && (/견적|이거|여기|내가|제가|우리/.test(qs) || !HELP_LAST || !!HELP_LAST.own); if (!g1 && !g2 && !g3) return "";
  const tr = [...new Set(KB_TRADE.filter(x => x[1].test(q)).map(x => x[0]))]; let body = qs; for (const x of KB_TRADE) body = body.replace(new RegExp(x[1].source, "g"), "");
  if (KB_KWN !== KB.length) { KB_KWN = KB.length; KB_KWS = [...new Set(KB.flatMap(e => (e.k || []).map(kbNorm)))].filter(k => k.length >= 2 && !/^(견적|견적서|공사|현장|확인|체크|점검|검수|검토|마무리|완성|항목|수량|단가|프로그램|챗봇|누락|부족|문제|이상)/.test(k)) }
  if (KB_KWS.some(k => body.includes(k))) return "";   // 다른 주제 낱말이 있으면 지식 질문이다 (‘곰팡이 문제 있어?’)
  return tr.length ? (g1 && qs.length <= 18 ? tr : "") : "all";
}
function helpGapSay(scope) {                          // 덜 된 것을 차례로 보여 주고, 무엇이 남았는지 기억해 둔다 (helpTrack 이 이어 간다)
  const steps = STEPS(), cs = estCheck(steps), mark = ["", "⚠", "❓", "ℹ"], idxs = scope === "all" ? null : scope.map(k => steps.findIndex(s => s.key === k)).filter(i => i >= 0);
  const mine = idxs ? cs.filter(c => idxs.includes(c.go)) : cs, must = mine.filter(c => c.lv < 3), info = mine.filter(c => c.lv === 3), other = cs.filter(c => c.lv < 3).length - must.length;
  HELP_TRACK = { scope, left: must.map(c => c.t.replace(/\d+/g, "#")) };
  const name = idxs ? `‘${esc(idxs.map(i => steps[i].label).join("·"))}’ 단계` : "", row = c => `<div class="hl"><i>${mark[c.lv]}</i><span>${esc(c.t)}${c.go !== undefined ? ` <button type="button" class="lk" data-goto="${c.go}"${atAttr(c)}>가서 고치기</button>` : ""}</span></div>`;
  const head = must.length ? `${name ? name + "에서 " : ""}꼭 확인할 것이 <b>${must.length}건</b> 남았습니다.` : info.length ? `${name ? name + "는 " : ""}꼭 고칠 것은 없고, 참고로 볼 것만 ${info.length}건 있습니다.` : `${name ? name + "는 " : ""}빠진 것 없이 다 됐습니다.`;
  return `<div class="hk">${head}</div>` + must.slice(0, 6).map(row).join("") + (must.length > 6 ? helpRow("", `나머지 ${must.length - 6}건은 위를 고치면 이어서 보여 드립니다.`) : "") + info.slice(0, must.length ? 2 : 4).map(row).join("")
    + (idxs && other > 0 ? helpRow("다른 단계", `${other}건 더 있습니다. <button type="button" class="lk" data-helpsay="뭐 안 했지?">전체 보기</button>`) : "")
    + (must.length ? helpRow("이어서", "고치시면 남은 것을 제가 이어서 알려 드립니다.") : '<div class="hm"><button type="button" data-helpsay="견적서 보여줘">견적서 보기</button></div>');
}
function helpTrack() {                                // 점검한 뒤 견적을 고치면: 해결된 것을 지우고 남은 것을 챗봇이 이어서 말한다 (다 될 때까지)
  if (!HELP_TRACK || !HELP_TRACK.left.length) return; clearTimeout(HELP_TRT);
  HELP_TRT = setTimeout(() => { const tr = HELP_TRACK; if (!tr || !tr.left.length || HELP_BUSY) return; let cs; try { cs = estCheck(STEPS()) } catch (e) { return }
    const now = new Set(cs.filter(c => c.lv < 3).map(c => c.t.replace(/\d+/g, "#"))), done = tr.left.filter(t => !now.has(t)); if (!done.length) return;
    HELP_LOG.push({ who: "bot", html: `<div class="hl"><i>✔</i><span><b>${done.length}건 해결</b> — <s>${done.slice(0, 2).map(t => esc(t.replace(/#/g, ""))).join("</s><br><s>")}</s>${done.length > 2 ? ` 외 ${done.length - 2}건` : ""}</span></div>` + helpGapSay(tr.scope) }); helpDraw() }, 1500);
}
function helpNow(q) {                                 // 지금 견적을 읽어 답한다: 빠진 것(검수) · 들어가 있는 수량 · 요약. 금액은 말하지 않는다
  const gap = helpIsGap(q); if (gap) return helpGapSay(gap);
  const steps = STEPS(), now2 = q.replace(/\s+/g, "").length <= 26 && /들어갔|들어가\s*있|들어\s*있|들어간|잡혔|잡혀\s*있|나왔|계산됐|계산돼\s*있|넣어\s*놨|넣었|돼\s*있|되어\s*있/.test(q) && !/어떻게|왜|이유|방법|하려면|필요|할 ?때|깔 ?때|붙일 ?때|칠할 ?때/.test(q);   // (v90) ‘도배 몇 평 들어갔어’ · ‘지금 뭐뭐 들어갔어’ — ‘지금 견적’이라고 하지 않아도 지금 견적을 묻는 말
  const now = now2 || /(지금|현재|이번|이|내|우리)\s*견적|견적서?에서?\s/.test(q), qtyW = /몇|얼마나|수량|들어가|들어갔|들어있|들어\s*있|개수|장수|물량|나와|나왔|잡혔|넣었/.test(q);
  if (/검수\s*(해|결과|돌려|부탁)/.test(q)) { const cs = estCheck(steps), top = cs.filter(c => c.lv < 3), mark = ["", "⚠", "❓", "ℹ"];
    return `<div class="hk">${top.length ? `확인할 것이 <b>${top.length}건</b> 있습니다.` : "빠진 단가·수량이나 짝이 안 맞는 공사는 없습니다."}</div>` + [...top, ...cs.filter(c => c.lv === 3)].slice(0, 7).map(c => `<div class="hl"><i>${mark[c.lv]}</i><span>${esc(c.t)}${c.go !== undefined ? ` <button type="button" class="lk" data-goto="${c.go}"${atAttr(c)}>가서 고치기</button>` : ""}</span></div>`).join("") }
  if (/(이|여기|지금|현재)\s*(단계|공정|화면)/.test(q) && /뭐|뭘|무엇|어떻게|설명|안내|해야|할\s*일|도와|알려/.test(q) && q.length <= 26) {   // 지금 보고 있는 단계 안내
    const st = steps[E.step] || {}, has = st.key && (D.stepLines || {})[st.key], on = has ? stepItems(st.key).map(lineLabel) : [], ck = estCheck(steps).filter(c => c.go === E.step), rel = KB.filter(e => e.s === st.key).slice(0, 3);
    return `<div class="hk">‘${esc(st.label || "")}’ 단계${has ? ` — 켠 공사 ${on.length}건` : "입니다."}</div>` + (has ? helpRow("켠 공사", on.length ? esc(on.slice(0, 8).join(", ")) + (on.length > 8 ? " 외" : "") : "아직 없습니다. 필요한 공사를 체크하세요.") : "")
      + (ck.length ? helpRow("확인할 것", ck.slice(0, 3).map(c => esc(c.t)).join("<br>")) : "") + (rel.length ? helpRow("많이 묻는 것", rel.map(e => `<span role="button" tabindex="0" class="lk in" data-helpgo="${e.n}">${esc(helpCut(e.q.replace(/[?？]$/, ""), 36))}</span>`).join("<br>")) : "") }
  if (!now || /왜|이유|뭐야|뭔가|누가/.test(q)) return null;
  const toks = kbTok(q).filter(t => !/^(지금|현재|이번|견적|현장|수량|몇|얼마|들어|있어|나와|계산|어떻게|우리|내)/.test(t));
  const hit = toks.length && qtyW ? R.lines.filter(l => !l.extra && l.qty > 0 && toks.some(t => (kbNorm(aliasOf(l.name)) + kbNorm(l.name)).includes(t))) : [];
  if (hit.length) { const f = hit[0], gi = steps.findIndex(s => s.key === f.step);
    return `<div class="hk">${esc(aliasOf(f.name))} <b>${f.qty}${esc(f.unit || "")}</b>${hit.length > 1 ? ` <small>외 ${hit.length - 1}줄</small>` : ""}</div>` + (hit.length > 1 ? hit.slice(0, 7).map(l => helpRow(helpCut(aliasOf(l.name), 12), `${l.qty}${esc(l.unit || "")}${l.spaceName ? " · " + esc(l.spaceName) : ""}${l.edited ? " <small>(직접 고친 수량)</small>" : l.measured ? " <small>(실측 기준)</small>" : ""}`)).join("")
        : (f.note ? helpRow("기준", esc(helpCut(f.note, 70))) : "") + (f.edited ? helpRow("수량", "직접 고친 수량입니다.") : f.measured ? helpRow("수량", "실측 기준입니다.") : "")
          + (f.lid === "woodMat" && !ceilCalc().n ? helpRow("참고", "목작업 치수를 넣지 않아 어림값입니다. 치수를 적어 주시면 바로 계산합니다. <code data-helpfill>거실 2230*5730, 안방 3320*3820</code>") : ""))
      + (gi >= 0 ? `<div class="hm"><button type="button" data-goto="${gi}">‘${esc(steps[gi].label)}’ 단계 보기</button></div>` : "") }
  if (!hit.length && now2 && toks.length && !/뭐|뭘|무엇|어떤/.test(q)) { const ls = helpWorkHit(toks.filter(t => !/^(들어|잡혔|잡혀|나왔|계산|넣어|넣었|돼있|되어|있나|있어|했어|했나|됐어|됐나)/.test(t)).join(" "));   // ‘방충망 들어갔어?’ — 꺼져 있는 공사
    if (ls && ls.every(l => !lnState(l).on)) return `<div class="hk">‘${esc(ls.map(l => helpCut(lineLabel(l), 14)).join(" · "))}’은(는) 지금 견적에 <b>들어 있지 않습니다.</b></div><div class="hm">${ls.slice(0, 3).map(l => `<button type="button" data-helpline="${esc(l.id)}|1">${esc(helpCut(lineLabel(l), 12))} 넣기</button>`).join("")}</div>` }
  if (/요약|현황|정리|상태|뭐\s*들어|뭐뭐|어디까지|들어간\s*(공사|거|게|것)|어떤\s*공사/.test(q)) { const by = {}; for (const l of R.lines) if (!l.extra && l.qty > 0 && l.step) by[l.step] = (by[l.step] || 0) + 1; const n = estCheck(steps).filter(c => c.lv < 3).length;
    return `<div class="hk">${E.py || "?"}평 · 방 ${E.rooms || "?"} · 욕실 ${E.baths || "?"} — 공사 ${Object.values(by).reduce((a, b) => a + b, 0)}줄이 들어가 있습니다.</div>` + steps.filter(s => by[s.key]).map(s => helpRow(s.label, by[s.key] + "줄")).join("") + helpRow("검수", n ? `확인할 것 ${n}건 · <code data-helpfill>지금 견적에서 빠진 거 있어?</code>` : "걸리는 항목 없음") }
  return null;
}
/* ‘거실 아트월이랑 중천장, 전체 상하부 몰딩만 작업할 거야’ · ‘탄성코트 앞뒤 베란다 작업할 거야’ · ‘거실 다운라이트 6개 추가해 줘’
   — 말한 공사를 찾아 체크하고(되돌리기 가능), 그 단계 도면으로 보여 준다. 끝에는 실장이 직접 확인하라는 말을 붙인다 */
const HELP_WSYN = [[/아트\s*월/, ["artwall"]], [/중천장|평천장|천장\s*(평탄|평평)|천장\s*목작업/, ["flatCeil"]], [/우물\s*천장/, ["wellCeil"]],
  [/상하부\s*몰딩|위아래\s*몰딩|몰딩\s*(전체|전부)/, ["ceilMold", "baseMold"]], [/상부\s*몰딩|천장\s*몰딩|상몰딩/, ["ceilMold"]], [/하부\s*몰딩|걸레받이|바닥\s*몰딩|하몰딩/, ["baseMold"]], [/문선\s*몰딩|문선|문\s*(테두리\s*)?몰딩/, ["doorMold"]], [/몰딩/, ["ceilMold"]],
  [/탄성\s*코트/, ["elastic"]], [/다운\s*라이트|매입등|매입\s*조명/, ["down"]], [/간접\s*(조명|등)/, ["t5"]], [/등\s*박스/, ["lightBox"]], [/라인\s*조명/, ["line"]], [/펜던트/, ["pendant"]], [/실링\s*팬/, ["fan"]], [/콘센트\s*(증설|추가)|전용\s*회로/, ["circuit"]], [/스위치|콘센트/, ["switch"]],
  [/(발코니|베란다)\s*(페인트|도장)/, ["balPaint"]], [/(발코니|베란다)\s*확장|확장\s*공사|확장/, ["expand"]], [/앞\s*(발코니|베란다)\s*벽\s*타일/, ["balWall"]], [/(뒷|뒤)\s*(발코니|베란다)\s*벽\s*타일/, ["balWall2"]], [/(발코니|베란다)\s*벽\s*타일/, ["balWall", "balWall2"]], [/앞\s*(발코니|베란다)\s*(바닥\s*)?타일/, ["balTile"]], [/(뒷|뒤)\s*(발코니|베란다)\s*(바닥\s*)?타일/, ["balTile2"]], [/(발코니|베란다)\s*(바닥\s*)?타일/, ["balTile", "balTile2"]], [/터닝\s*도어/, ["turning"]],
  [/천장\s*(도배|벽지)/, ["ceilPaper"]], [/부분\s*도배/, ["partPaper"]], [/도배|벽지/, ["paper"]], [/장판|마루|바닥재|데코\s*타일/, ["floor"]], [/욕실\s*방수|방수/, ["waterproof"]], [/줄눈/, ["grout"]],
  [/(안방|욕실\s*2)\s*(욕실\s*)?벽\s*타일/, ["wallTile2"]], [/(안방|욕실\s*2)\s*(욕실\s*)?바닥\s*타일/, ["floorTile2"]], [/(안방|욕실\s*2)\s*(욕실\s*)?타일/, ["wallTile2", "floorTile2"]], [/(공용|거실|욕실\s*1)\s*(욕실\s*)?벽\s*타일/, ["wallTile"]], [/(공용|거실|욕실\s*1)\s*(욕실\s*)?바닥\s*타일/, ["floorTile"]], [/(공용|거실|욕실\s*1)\s*(욕실\s*)?타일/, ["wallTile", "floorTile"]],
  [/욕실\s*벽\s*타일/, ["wallTile", "wallTile2", "wallTile3"]], [/욕실\s*바닥\s*타일/, ["floorTile", "floorTile2", "floorTile3"]], [/욕실\s*타일/, ["wallTile", "floorTile", "wallTile2", "floorTile2", "wallTile3", "floorTile3"]], [/현관\s*(바닥\s*)?타일/, ["entTile"]], [/주방\s*(벽\s*)?타일/, ["kitTile"]],
  [/싱크대/, ["sink"]], [/상판/, ["top"]], [/붙박이장/, ["closet"]], [/신발장/, ["shoe"]], [/냉장고장/, ["fridge"]], [/키큰장/, ["tall"]], [/아일랜드/, ["island"]], [/후드/, ["hood"]], [/중문/, ["jungmun"]], [/욕실\s*문/, ["bathDoorSet"]], [/방문/, ["doorSet"]], [/도어락/, ["lock"]],
  [/샷시|샤시|창호|창문\s*교체/, ["window"]], [/방충망/, ["screen"]], [/욕실\s*철거/, ["demoBath"]], [/주방\s*철거/, ["demoKitchen"]], [/전체\s*철거|집\s*철거/, ["demo"]], [/보일러/, ["boiler"]], [/시스템\s*에어컨|에어컨/, ["aircon"]],
  [/커튼\s*박스/, ["curtainBox"]], [/가벽/, ["wall"]], [/단열/, ["insul"]], [/입주\s*청소/, ["clean"]], [/환풍기/, ["vent"]], [/욕조/, ["tub"]], [/비데/, ["bidet"]], [/세면대/, ["basin"]], [/변기/, ["toilet"]], [/젠다이/, ["zendai"]]];   // 현장에서 부르는 이름 → 공사 줄 id (앞에 적힌 긴 이름부터 맞춘다)
const helpIsSup = l => /부자재|작업비|식대|설치비|실측비|목재·석고보드|배관 자재/.test(lineLabel(l));   // 그 공정의 자재·작업비 줄 (공사를 켜면 함께 있어야 한다)
const HELP_WINT = /(할|하려|넣을|달|깔|바꿀|칠할|붙일|들어갈)\s*(거야|거에요|거예요|겁니다|건데|거임|게요)|할\s*예정|할\s*계획|하려고|하기로\s*했|만\s*(할게|한다|합니다|해요|하면\s*돼)|(추가|체크|선택)해\s*(줘|주세요)|도\s*(해\s*줘|넣어\s*줘)|(으로|로)\s*(바꿔|변경|수정|맞춰)\s*(줘|주세요|줄래)|수량.{0,6}(원래대로|자동으로|되돌려)|원래\s*수량/;   // 공사를 하겠다(안 하겠다)는 말
const HELP_WSTOP = /^(지금|나는|난|우리|우리는|이번|이번에|일단|현장|작업|시공|공사|진행|교체|설치|추가|새로|다시|전체|전부|모두|부분|쪽|벽|면|개|곳|칸|위|아래|앞|뒤|앞뒤|상하부|상부|하부|거실|주방|부엌|현관|안방|큰방|작은방|끝방|욕실|화장실|베란다|발코니|방|그리고|하고|이랑|랑|및|만|도|\d.*)$/;
var HELP_WK = null;
function helpRoomsIn(t0) {                            // 문장에 나온 공간 → 공간 id 목록
  let t = String(t0); const ids = new Set(), S = R.S.list, take = (re, f) => { if (re.test(t)) { S.filter(f).forEach(x => ids.add(x.id)); t = t.replace(re, " ") } };
  for (const x of xspList()) take(new RegExp(x.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"), "g"), s => s.id === x.id);   // (v63) 추가 공간은 이름으로 먼저 찾는다 (‘보조 주방’이 ‘주방’으로 읽히지 않게)
  take(/안방\s*(욕실|화장실)|부부\s*욕실|(욕실|화장실)\s*2/g, x => x.id === "bath2"); take(/(공용|거실)\s*(욕실|화장실)|(욕실|화장실)\s*1/g, x => x.id === "bath1"); take(/욕실|화장실/g, x => x.type === "욕실");
  take(/앞\s*뒤\s*(베란다|발코니)/g, x => x.type === "발코니" && !x.xsp); take(/앞\s*(베란다|발코니)|(베란다|발코니)\s*1/g, x => x.id === "bal1"); take(/(뒷|뒤)\s*(베란다|발코니)|(베란다|발코니)\s*2/g, x => x.id === "bal2"); take(/베란다|발코니/g, x => x.type === "발코니" && !x.xsp);
  take(/거실/g, x => x.id === "living"); take(/주방|부엌/g, x => x.id === "kitchen"); take(/현관/g, x => x.id === "entry");
  take(/드레스\s*룸|옷\s*방/g, x => x.id === "dress1"); take(/안방|큰방|방\s*1(?!\d)/g, x => x.id === "room1"); take(/작은방|방\s*2(?!\d)/g, x => x.id === "room2"); take(/방\s*3(?!\d)|끝방/g, x => x.id === "room3");
  take(/모든\s*방|각\s*방|방\s*(전체|전부|들|마다)|방\s*다(?![가-힣])/g, x => x.type === "방" && !x.xsp);
  return [...ids];
}
function helpWorkFind(text) {                         // 문장에서 공사 줄 찾기 → out:[{l, n(개수), rooms, off}] 또는 {many, term} · miss:[못 찾은 낱말]
  const all = Object.values(D.stepLines || {}).flat().map(l => ({ l, lab: kbNorm(lineLabel(l) + (l.label || "")), its: kbNorm(l.items.join("")) })), pt = typeof presetTag === "function" ? presetTag() : "";
  const tail = /(만|은|는|도)?\s*(작업|시공|공사|진행|교체|설치|추가|체크|선택)?\s*(안\s*)?(할|하려|넣을|달|깔|바꿀|칠할|붙일|들어갈|해|넣어|바꿔|변경해|수정해|맞춰)?\s*(거야|거에요|거예요|겁니다|건데|거임|게요|예정(이야|입니다|이에요)?|계획(이야)?|려고(\s*해)?|기로\s*했\S*|줘|주세요|한다|합니다|해요)\s*[.!~]*$/;
  const segs = String(text).replace(/[.!~]+$/, "").split(/[,，+]|\s(?:및|그리고|하고)\s|(?<=[가-힣\d])(?:이랑|랑|하고)(?=\s|$)/).map(x => x.trim()).filter(Boolean), out = [], miss = [], seen = new Set(); let carry = [];
  const num = t => { const m = t.match(/(\d+)\s*(개|구|등|군데|곳|면|칸|조|세트|대|짝)/); return m ? +m[1] : null };
  const offRe = /안\s*(할|해|함|합니다|한다)|빼고|빼줘|제외|없이/, offs = segs.map(x => offRe.test(x)), left = [];
  for (let i = segs.length - 2; i >= 0; i--) if (!offs[i] && offs[i + 1] && !tail.test(segs[i]) && !/(은|는)$/.test(segs[i])) offs[i] = true;   // (v90) ‘도배랑 장판 빼줘’ — 끝말이 없는 앞 토막은 뒤 토막의 뜻을 따른다 (‘도배는 하고 장판은 빼줘’처럼 ‘은/는’으로 가른 말은 따르지 않는다)
  for (let si = 0; si < segs.length; si++) { const seg = segs[si], off = offs[si], rooms = helpRoomsIn(seg); let rest = seg.replace(tail, " "), hit = false;
    const segL = [], push = l => { if (l) segL.push(l); if (l && !seen.has(l.id)) { seen.add(l.id); out.push({ l, n: num(seg), rooms: carry.concat(rooms), off, seg }) } };
    for (const [re, ids] of HELP_WSYN) if (re.test(rest)) { hit = true; ids.forEach(id => push(lineById(id))); rest = rest.replace(re, " ") }
    const terms = kbTok(rest).filter(t => t.length >= 2 && !HELP_WSTOP.test(t) && !HELP_WSTOP.test(t.replace(/(은|는|이|가|을|를|에|도|만|의)$/, ""))).map(t => t.replace(/(은|는|을|를|에|도|만|으로|로)$/, "")).filter(t => t.length >= 2 && !segL.some(l => kbNorm(l.items.map(aliasOf).join("")).includes(t))).sort((a, b) => b.length - a.length);   // 이름표에 없는 말은 공사 이름에서 찾는다 (이미 찾은 공사의 자재 이름은 뺀다)
    if (terms.length) { const sc = all.filter(x => !helpIsSup(x.l)).map(x => ({ l: x.l, n: terms.reduce((a, t) => a + (x.lab.startsWith(t) ? 3 : x.lab.includes(t) ? 2 : x.its.includes(t) ? 1 : 0), 0) })).filter(x => x.n).sort((a, b) => b.n - a.n);   // 이름이 그 말로 시작 > 이름에 있음 > 품목에만 있음
      let best = sc.length ? sc.filter(x => x.n === sc[0].n) : []; if (best.length > 2 && pt) { const std = best.filter(x => (x.l.tags || "").includes(pt)); if (std.length && std.length <= 2) best = std }   // 여럿이면 기본 견적에 들어가는 줄을 고른다
      for (const t of terms) if (!all.some(x => x.lab.includes(t) || x.its.includes(t))) left.push(t);   // (v90) 어느 공사 이름에도 없는 낱말
      if (best.length && best.length <= 2) { hit = true; best.forEach(x => push(x.l)) } else if (best.length > 2) { hit = true; out.push({ many: best.slice(0, 5).map(x => x.l), term: terms[0] }) } else if (!hit) miss.push(terms[0]) }
    if (hit) carry = []; else if (rooms.length) carry = carry.concat(rooms);   // 공간만 말한 토막(‘거실이랑’)은 다음 공사에 붙인다
  }
  return { out, miss, left };
}
function helpPlaceLights(ids, n) {                    // 그 방 안에 매입등 n개를 고르게 찍는다 (도면 그림을 올린 견적은 방 위치를 몰라 찍지 않는다) → 찍은 개수
  const g = planGeom(); if (!g.L || g.img || E.planImg) return 0; let put = 0; E.lights = E.lights || [];
  ids.forEach((id, k) => { const r = g.L.rects.find(x => x.s.id === id && !x.sub); if (!r) return; const cnt = k === ids.length - 1 ? n - put : Math.max(1, Math.round(n / ids.length)); if (cnt <= 0) return;
    const X0 = PPAD + r.x * PK, Y0 = PPAD + r.y * PK, W = r.w * PK, H = r.h * PK, cols = Math.min(cnt, Math.max(1, Math.round(Math.sqrt(cnt * W / H)))), rows = Math.ceil(cnt / cols);
    E.lights = E.lights.filter(t => !(t.k === "down" && !t.img && t.x * g.vw >= X0 && t.x * g.vw <= X0 + W && t.y * g.vh >= Y0 && t.y * g.vh <= Y0 + H));   // 그 방에 찍혀 있던 매입등은 새로 찍는다
    for (let i = 0; i < cnt; i++) { const rw = Math.floor(i / cols), inRow = rw === rows - 1 ? cnt - cols * (rows - 1) : cols, c = i - rw * cols;
      E.lights.push({ id: Date.now().toString(36) + "h" + put, k: "down", x: (X0 + W * (c + 0.5) / inRow) / g.vw, y: (Y0 + H * (rw + 0.5) / rows) / g.vh, img: false }); put++ } });
  return put;
}
const HELP_WSHORT = { artwall: "아트월", flatCeil: "평천장", wellCeil: "우물천장", ceilMold: "천장몰딩", baseMold: "걸레받이", doorMold: "문선", elastic: "탄성코트", down: "매입등", t5: "간접조명", lightBox: "등박스", paper: "도배", ceilPaper: "천장도배", floor: "바닥재", waterproof: "방수", wallTile: "벽타일", floorTile: "바닥타일", wallTile2: "벽타일", wallTile3: "벽타일", floorTile2: "바닥타일", floorTile3: "바닥타일", balTile: "바닥타일", balTile2: "바닥타일", balWall: "벽타일", balWall2: "벽타일", entTile: "바닥타일", kitTile: "벽타일", balPaint: "페인트", jungmun: "중문", shoe: "신발장", sink: "싱크대", closet: "붙박이장", window: "창호", fan: "실링팬" };
const helpWShort = l => HELP_WSHORT[l.id] || helpCut(lineLabel(l).replace(/\s*\(.*\)/, "").replace(/\s+/g, ""), 5);
const helpInRoom = (l, sp) => (l.loc === "방1" ? sp.id === "room1" : (LOC_TYPES[l.loc] || []).includes(sp.type)) && !(((E.skip || {})[stepOfLine(l)] || {})[sp.id]);   // 그 공사가 그 공간에 들어가는가 (그 단계에서 뺀 공간은 아니다)
function helpPlanMini(ls, o = {}) {                           // 작은 도면: 방마다 그 방에 들어가는 공사 이름을 적는다 (그림 도면을 올린 견적은 방 위치를 몰라 그리지 않는다)
  const g = planGeom(); if (!g.L || g.img || !ls.length) return ""; const lts = (E.lights || []).filter(t => t.k === "down" && !t.img);
  const body = g.L.rects.filter(r => r.s.type !== "공통").map(r => { const x = PPAD + r.x * PK, y = PPAD + r.y * PK, w = r.w * PK, h = r.h * PK;
    const ws = ls.filter(l => helpInRoom(l, r.s)).map(l => { if (l.id !== "down" || !lts.length) return helpWShort(l); const n = lts.filter(t => t.x * g.vw >= x && t.x * g.vw <= x + w && t.y * g.vh >= y && t.y * g.vh <= y + h).length; return n ? "매입등 " + n : "" }).filter(Boolean);
    const fs = Math.max(o.max ? 9 : 14, Math.min(o.max || 30, w / 5.2, h / ((Math.min(ws.length, 6) + 1.3) * 1.18))), cap = Math.max(1, Math.floor(h / (fs * 1.18)) - 1);   // 공사가 많은 방은 글자를 줄여 더 많이 적는다
    const box = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${ws.length ? "#2f6b5a" : "#ffffff"}" fill-opacity="${ws.length ? 0.16 : 1}" stroke="#555" stroke-width="2" data-wroom="${esc(r.s.id)}" style="cursor:pointer"><title>${esc(r.s.name.replace(/ \(.*\)/, ""))} — 누르면 이 방의 공사를 챗봇에서 봅니다</title></rect>`.replace("/><title>", "><title>"); if (r.sub) return box;
    const keep = Math.max(1, cap - 1), show = ws.length > cap ? ws.slice(0, keep).concat("+" + (ws.length - keep)) : ws;
    return box + `<text x="${(x + 6).toFixed(1)}" y="${(y + fs * 0.8).toFixed(1)}" font-size="${(fs * 0.62).toFixed(1)}" fill="#777" pointer-events="none">${esc(r.s.name.replace(/ \(.*\)/, "").replace(/·.*/, ""))}</text>`
      + show.map((t, i) => `<text x="${(x + w / 2).toFixed(1)}" y="${(y + fs * (1.8 + i * 1.15)).toFixed(1)}" font-size="${fs.toFixed(1)}" font-weight="700" fill="#1f4d40" text-anchor="middle" pointer-events="none">${esc(t)}</text>`).join("") }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(g.vw)} ${Math.round(g.vh)}" role="img" aria-label="공사가 들어가는 곳">${body}</svg>`;
}
function helpPlanAll() {                              // ‘도면으로 보여 줘’: 지금 켜 둔 공사를 방마다 적은 도면 + 방별 목록
  const ls = helpWorkLines(), mini = helpPlanMini(ls), last = STEPS().length - 1;
  const rows = R.S.list.filter(sp => sp.type !== "공통").map(sp => { const ws = ls.filter(l => helpInRoom(l, sp)).map(helpWShort); return ws.length ? helpRow(sp.name.replace(/ \(.*\)/, "").replace(/·.*/, ""), esc(ws.slice(0, 7).join(", ")) + (ws.length > 7 ? ` <small>외 ${ws.length - 7}</small>` : "")) : "" }).join("");
  return `<div class="hk">지금 켜 둔 공사 ${ls.length}개가 들어가는 곳입니다.</div>` + (mini ? `<div class="hpl">${mini}</div>` : helpRow("도면", "그림 도면을 올린 견적은 방 위치를 몰라 목록으로만 보여 드립니다.")) + rows
    + `<div class="hm"><button type="button" class="lk" data-goto="${last}">확인 단계의 공사 도면·공간별 표 보기</button></div><div class="hw">⚠ 방별 표시는 공사 종류 기준입니다. 실제 위치·수량은 각 단계 도면에서 직접 확인해 주세요.</div>`;
}
const helpWorkLines = () => Object.entries(D.stepLines || {}).filter(([sk]) => sk !== "s1" && sk !== "s12").flatMap(([, v]) => v).filter(l => lnState(l).on && !helpIsSup(l) && (LOC_TYPES[l.loc] || l.loc === "방1"));   // 도면에 적을 공사: 켜 둔 것 가운데 자재·작업비 줄과 철거·마무리 단계는 뺀다
var WPLAN_OPEN = false;
function workPlanBox(open) {                          // 프로그램 화면의 ‘공사 도면’: 챗봇의 작은 도면과 같은 그림. 방을 누르면 그 방 공사가 챗봇에 나온다
  let svg = ""; try { svg = helpPlanMini(helpWorkLines(), { max: 15 }) } catch (e) {} if (!svg) return "";
  const inner = `<div class="planwrap wplan">${svg}</div><div class="note">방을 누르면 그 방에 들어가는 공사를 챗봇에서 보고 켜고 끌 수 있습니다. 챗봇에 “거실 아트월 추가해줘”처럼 말해도 여기에 바로 반영됩니다.</div>`;
  return open ? `<h3>공사 도면 <span class="note">방마다 들어가는 공사 (자재·작업비, 철거·마무리 단계는 빼고 적습니다)</span></h3>${inner}` : `<details class="wplanbox" ${WPLAN_OPEN ? "open" : ""}><summary>공사 도면 — 지금 체크한 공사가 들어가는 곳</summary>${inner}</details>`;
}
function stepWorkNames(step, sp, w, fs) {             // 단계 도면의 방 안에 적는 공사 이름 한 줄 (챗봇의 작은 도면과 같은 이름)
  let ns = []; try { ns = stepItems(step).filter(l => !helpIsSup(l) && surfOf(l, step) !== "none" && helpInRoom(l, sp)).map(helpWShort) } catch (e) { return "" }
  const max = Math.max(5, Math.floor(w / (fs * 0.62))); let out = "";
  for (let i = 0; i < ns.length; i++) { if (!i) { out = helpCut(ns[0], Math.max(4, max - 3)); continue } const t = out + "·" + ns[i]; if (t.length > max - (i < ns.length - 1 ? 3 : 0)) { out += " 외" + (ns.length - i); break } out = t }
  return out;
}
function helpRoomSay(id) {                            // 도면에서 방을 눌렀을 때: 그 방에 들어가는 공사를 단계별로 보여 주고 끌 수 있게 한다
  const sp = R.S.list.find(x => x.id === id); if (!sp) return "그 공간을 찾지 못했습니다."; const steps = STEPS(), nm = sp.name.replace(/ \(.*\)/, ""), ls = helpWorkLines().filter(l => helpInRoom(l, sp)), by = {};
  for (const l of ls) { const k = stepOfLine(l); (by[k] = by[k] || []).push(l) }
  return `<div class="hk">${esc(nm)}에 들어가는 공사 <b>${ls.length}개</b></div>` + steps.filter(st => by[st.key]).map(st => `<div class="hl"><b role="button" tabindex="0" class="hbr" data-goto="${steps.indexOf(st)}" title="그 단계 도면 보기">${esc(helpCut(st.label, 9))}</b><span class="hbx in">${by[st.key].map(l => `<span role="button" tabindex="0" class="hch" data-helpline="${esc(l.id)}|0" title="${esc(lineLabel(l))} 끄기">${esc(helpWShort(l))} ×</span>`).join("")}</span></div>`).join("")
    + (ls.length ? "" : helpRow("", "이 공간에 켜 둔 공사가 없습니다.")) + helpRow("더하기", `말로 하면 됩니다. <code data-helpfill>${esc(nm.replace(/·.*/, "").replace(/\d+$/, ""))} 아트월 추가해줘</code>`)
    + '<div class="hw">⚠ × 를 누르면 그 공사가 꺼집니다. 공사는 이 방만이 아니라 그 공사가 들어가는 모든 공간에서 함께 꺼지니, 끈 뒤에는 그 단계에서 직접 확인해 주세요.</div>';
}
document.addEventListener("click", ev0 => { const r = ev0.target.closest && ev0.target.closest("[data-wroom]"); if (!r || HELP_BUSY) return;   // 공사 도면(프로그램·챗봇)의 방을 누르면 그 방 공사를 챗봇에 띄운다
  const sp = R.S.list.find(x => x.id === r.dataset.wroom); if (!sp) return; HELP_OPEN = true; HELP_LOG.push({ who: "me", html: esc(sp.name.replace(/ \(.*\)/, "")) + " 공사" }); helpSay(helpRoomSay(sp.id)); HELP_LAST = { q: "", es: [], own: true, topic: HELP_LAST && HELP_LAST.topic } });
document.addEventListener("toggle", ev0 => { if (ev0.target.classList && ev0.target.classList.contains("wplanbox")) WPLAN_OPEN = ev0.target.open }, true);
function helpWork(q) {                                // 알아들으면 공사를 체크하고 답(HTML), 아니면 null
  if (!D.stepLines || /[?？]|어떻게|뭐가|뭐야|얼마|왜|언제|되나|될까|할까|해도|인가/.test(q) || !HELP_WINT.test(q)) return null;
  const { out, miss } = helpWorkFind(q), got = out.filter(x => x.l), many = out.filter(x => x.many); if (!got.length && !many.length) return null;
  const steps = STEPS(), snap = { ln: deep(E.ln || {}), skip: deep(E.skip || {}), lights: deep(E.lights || []) }, name = id => roomName(id).replace(/ \(.*\)/, ""), notes = [];
  for (const x of got) { x.was = !!lnState(x.l).on; lnSetAll(x.l, !x.off) }
  const pt = typeof presetTag === "function" ? presetTag() : "", sup = [];   // 켠 공사와 같은 단계의 자재·작업비 줄이 꺼져 있으면 함께 켠다
  for (const sk of new Set(got.filter(x => !x.off).map(x => stepOfLine(x.l)))) for (const l of D.stepLines[sk] || []) if (helpIsSup(l) && pt && (l.tags || "").includes(pt) && !lnState(l).on) { setLn(l, { on: true }); sup.push(l) }
  if (sup.length) notes.push(`같은 단계의 자재·작업비 ${sup.length}줄(${sup.slice(0, 3).map(l => lineLabel(l)).join(", ")}${sup.length > 3 ? " 외" : ""})도 함께 켰습니다.`);
  refresh();
  { const nOff = helpSupOff(new Set(got.filter(x => x.off).map(x => stepOfLine(x.l)))); if (nOff) { notes.push(`그 단계에 남은 공사가 없어 자재·작업비 ${nOff}줄도 함께 껐습니다.`); refresh() } }
  for (const x of got) { if (x.off) continue;   // ‘바닥재 강마루로 바꿔 줘’ → 자재 · ‘걸레받이 40개로 바꿔 줘’ → 수량 · ‘걸레받이 수량 원래대로’ → 자동 계산으로
    if (x.l.items.length > 1) { const lab = kbNorm(lineLabel(x.l) + (x.l.label || "")), al = x.l.items.map(it => kbNorm(aliasOf(it))), toks = kbTok(x.seg.replace(/(\d)\.(\d)/g, "$1$2")).map(t => t.replace(/(으로|로)$/, "").replace(/^(\d+)t$/, "$1mm")).filter(t => t.length >= 2 && (!HELP_WSTOP.test(t) || (/^\d.*[가-힣a-z]/.test(t) && !/^\d+(개|구|등|군데|곳|면|칸|조|세트|대|짝|장|박스|롤|평|자)$/.test(t))) && !lab.includes(t) && !/^(바꿔|변경|수정|맞춰|수량|원래)/.test(t));   // ‘3연동’·‘2.2T’처럼 숫자로 시작하는 자재 이름도 본다
      const cand = toks.map(t => al.map((a, i) => a.includes(t) ? i : -1).filter(i => i >= 0)).filter(c => c.length && c.length < al.length).sort((a, b) => a.length - b.length)[0];
      if (cand) { setLn(x.l, { alt: cand[0] }); notes.push(`‘${lineLabel({ ...x.l, label: x.l.label })}’ 자재를 ‘${aliasOf(x.l.items[cand[0]])}’(으)로 골랐습니다.` + (cand.length > 1 ? " 같은 이름이 더 있습니다: " + cand.slice(1, 4).map(i => `<button type="button" class="lk" data-helpalt="${esc(x.l.id)}|${i}">${esc(helpCut(aliasOf(x.l.items[i]), 14))}</button>`).join(" ") : "")); x.html = true } }
    const mq = x.seg.match(/(\d+(?:\.\d+)?)\s*(개|구|등|군데|곳|면|칸|조|세트|대|짝|장|박스|롤|평|자|m|㎡|ea)?\s*(으로|로)\s*(바꿔|변경|수정|맞춰)/i) || x.seg.match(/수량\s*(?:은|을|를)?\s*(\d+(?:\.\d+)?)/);
    if (/수량.{0,6}(원래대로|자동|되돌)|원래\s*수량/.test(x.seg)) { setLn(x.l, { q: undefined }); notes.push(`‘${helpWShort(x.l)}’ 수량을 자동 계산으로 되돌렸습니다.`); x.n = null }
    else if (mq) { setLn(x.l, { q: +mq[1] }); notes.push(`‘${helpWShort(x.l)}’ 수량을 ${mq[1]}(으)로 고쳤습니다. 자동 계산으로 돌리려면: ${helpWShort(x.l)} 수량 원래대로`); x.n = null } }
  refresh();
  for (const x of got) { if (x.off || !x.n) continue;   // 개수를 말했으면: 매입등은 방에 찍고, 개수로 세는 공사는 수량에 넣는다
    if (x.l.id === "down") { const rs = x.rooms.filter(id => !/^(bal|common)/.test(id)), put = rs.length ? helpPlaceLights(rs, x.n) : 0;
      if (put) { setLn(x.l, { q: undefined }); notes.push(`매입등 ${put}개를 ${rs.map(name).join("·")} 도면에 찍었습니다. 도면에 찍힌 개수가 그대로 수량이 됩니다.`) } else { setLn(x.l, { q: x.n }); notes.push(`매입등 수량을 ${x.n}개로 넣었습니다. 방을 같이 말하면 도면에도 찍습니다. 예: 거실 다운라이트 6개 추가해줘`) } }
    else { const rl = R.lines.find(r => r.lid === x.l.id); if (rl && /^(EA|ea|개|칸|곳|면|구|등|조|세트|대|짝)$/.test(rl.unit || "")) setLn(x.l, { q: x.n }); else if (x.n > 1) notes.push(`‘${lineLabel(x.l)}’의 ${x.n}은(는) 수량에 넣지 않았습니다. 그 단계에서 치수·수량을 확인해 주세요.`) } }
  refresh();
  const on = got.filter(x => !x.off), only = []; for (const x of on) { const ty = LOC_TYPES[x.l.loc]; if (!ty || x.l.id === "down") continue; const cov = R.S.list.filter(y => ty.includes(y.type)).map(y => y.id), keep = x.rooms.filter(id => cov.includes(id)), sk = stepOfLine(x.l);
    if (keep.length && keep.length < cov.length && !only.some(o => o.sk === sk)) only.push({ sk, keep, id: x.l.id }) }   // 집 전체에 들어가는 공사인데 방을 짚어 말했으면: 그 단계에서 그 방만 남기는 단추
  HELP_WK = { snap, ids: on.map(x => x.l.id) };
  const row = x => { const sk = stepOfLine(x.l), gi = steps.findIndex(y => y.key === sk), rl = R.lines.filter(r => r.lid === x.l.id);
    return `<div class="hl"><i>${x.off ? "✕" : "✔"}</i><span><b>${esc(lineLabel(x.l))}</b> <small>${esc((steps[gi] || {}).label || "")}${!x.off && rl.length ? " · " + rl.slice(0, 2).map(r => r.qty + (r.unit || "")).join(", ") : ""}${x.off ? " · 껐습니다" : x.was ? " · 이미 켜져 있었음" : ""}</small>${gi >= 0 ? ` <button type="button" class="lk" data-goto="${gi}">보기</button>` : ""}</span></div>` };
  const sks = [...new Set(on.map(x => stepOfLine(x.l)))].slice(0, 2), mini = helpPlanMini(on.map(x => x.l)), solo = /만\s*(작업|시공|공사|진행|할|해|한다|합니다)/.test(q) && on.length;
  const rel = [...new Set(on.map(x => (kbFind(lineLabel(x.l).replace(/\(.*\)/, ""), 12, 1)[0] || {}).e).filter(Boolean))].slice(0, 3);
  if (miss.length) helpMiss(q, "공사");
  return `<div class="hk">${on.length ? `공사 <b>${on.length}개</b>를 체크했습니다.` : ""}${got.length - on.length ? ` ${got.length - on.length}개는 껐습니다.` : ""}${!got.length ? "어느 공사인지 골라 주세요." : ""}</div>` + got.map(row).join("")
    + many.map(x => helpRow(x.term, "해당하는 공사가 여럿입니다. " + x.many.map(l => `<button type="button" data-helpline="${esc(l.id)}|1">${esc(helpCut(lineLabel(l), 12))}</button>`).join(" "))).join("")
    + notes.map(t => helpRow(/자재를/.test(t) ? "자재" : /함께/.test(t) ? "함께" : "수량", /<button/.test(t) ? t : esc(t))).join("") + (miss.length ? helpRow("못 찾은 말", `${esc(miss.join(", "))} — 공사 이름을 조금 다르게 적거나 그 단계에서 직접 체크해 주세요.`) : "")
    + (mini ? `<div class="hpl"><small>도면 — 체크한 공사가 들어가는 곳</small>${mini}</div>` : sks.map(sk => `<div class="hpl"><small>${esc((steps.find(y => y.key === sk) || {}).label || "")} 도면</small>${planSvg(sk)}</div>`).join(""))
    + `<div class="hm">${got.length ? '<button type="button" class="lk" data-helpwk="undo">방금 체크 되돌리기</button>' : ""}${sks.length ? `<button type="button" class="lk" data-goto="${steps.findIndex(y => y.key === sks[0])}">견적 도면에서 보기</button>` : ""}${solo ? '<button type="button" data-helpwk="solo">말한 공사만 남기고 나머지 끄기</button>' : ""}${only.map(o => `<button type="button" data-helpwk="only|${o.id}|${o.keep.join(",")}">‘${esc((steps.find(y => y.key === o.sk) || {}).label || "")}’ 단계는 ${esc(o.keep.map(name).join("·"))}만 남기기</button>`).join("")}</div>`
    + (got.length ? '<div class="hw">⚠ 말씀만 듣고 제가 체크한 것입니다. 수량·자재·위치는 실장님이 그 단계에서 직접 한 번 확인해 주세요.</div>' : "")
    + (rel.length ? `<div class="hbx"><i>가지</i>${rel.map(e => `<span role="button" tabindex="0" class="hch" data-helpgo="${e.n}" title="${esc(e.q)}">${esc(kbLabel(e))}</span>`).join("")}</div>` : "");
}
function helpAltSet(v) {                              // 자재 고르기 단추: 그 공사의 자재(등급)를 바꾼다
  const [id, i] = String(v).split("|"), l = lineById(id); if (!l || !l.items[+i]) return "그 자재를 찾지 못했습니다."; setLn(l, { on: true, alt: +i }); refresh();
  return `<div class="hk">자재를 ‘${esc(aliasOf(l.items[+i]))}’(으)로 바꿨습니다.</div><div class="hm">${HELP_WK ? '<button type="button" class="lk" data-helpwk="undo">말하기 전으로 되돌리기</button>' : ""}</div><div class="hw">⚠ 바뀐 자재와 수량은 실장님이 그 단계에서 직접 한 번 확인해 주세요.</div>`;
}
function helpWorkBtn(v) {                             // 공사 체크 답의 단추: 되돌리기 · 말한 공사만 남기기 · 그 단계에서 그 방만 남기기
  const w = HELP_WK, [act, sk, ids] = String(v).split("|"), steps = STEPS(); if (!w) return "되돌릴 것이 없습니다.";
  const undo = '<div class="hm"><button type="button" class="lk" data-helpwk="undo">말하기 전으로 되돌리기</button></div>', warn = '<div class="hw">⚠ 바뀐 내용은 실장님이 직접 한 번 확인해 주세요.</div>';
  if (act === "undo") { E.ln = w.snap.ln; E.skip = w.snap.skip; E.lights = w.snap.lights; HELP_WK = null; refresh(); return "되돌렸습니다. 공사 체크·제외한 방·도면의 조명이 말하기 전 상태입니다." }
  if (act === "solo") { const keep = new Set(w.ids), sks = new Set(w.ids.map(id => stepOfLine(lineById(id)))); let n = 0, s2 = 0;   // 말한 공사와, 같은 단계의 자재·작업비 줄은 남긴다
    for (const [k, ls] of Object.entries(D.stepLines)) for (const l of ls) if (lnState(l).on && !keep.has(l.id)) { if (sks.has(k) && helpIsSup(l)) { s2++; continue } setLn(l, { on: false }); n++ } refresh();
    const ck = estCheck(steps).filter(c => c.lv < 3).length;
    return `<div class="hk">말한 공사 ${keep.size}개${s2 ? `와 같은 단계의 자재·작업비 ${s2}줄` : ""}만 남기고 <b>${n}개</b>를 껐습니다.</div>` + (ck ? helpRow("확인", `짝이 맞지 않거나 빠진 것이 ${ck}건 있습니다. <button type="button" class="lk" data-helpsay="뭐 안 했지?">덜 된 것 보기</button>`) : "") + undo + warn }
  if (act === "only") { const l = lineById(sk), keep = (ids || "").split(","), stK = l ? stepOfLine(l) : "", st = steps.find(y => y.key === stK), ty = l ? LOC_TYPES[l.loc] || [] : []; if (!l || !st) return "그 공사를 찾지 못했습니다.";
    E.skip = E.skip || {}; E.skip[stK] = { ...(E.skip[stK] || {}) }; for (const x of R.S.list) if (ty.includes(x.type)) { if (keep.includes(x.id)) delete E.skip[stK][x.id]; else E.skip[stK][x.id] = true } refresh();
    return `<div class="hk">‘${esc(st.label)}’ 단계에서 ${esc(keep.map(id => roomName(id).replace(/ \(.*\)/, "")).join("·"))}만 남겼습니다. 뺀 공간은 그 단계 도면에 ✕로 표시됩니다.</div><div class="hpl">${helpPlanMini([l]) || planSvg(stK)}</div>` + undo + warn }
  return "";
}
function lastCheck(b) {                               // 상세견적서로 넘어가기 전: 확인할 것이 있으면 무엇인지 보여 주고, 보러 갈지 그대로 넘어갈지 고르게 한다
  const steps = STEPS(), cs = estCheck(steps).filter(c => c.lv < 3), old = document.getElementById("lastBox"); if (old) old.remove();
  const first = cs.find(c => c.go !== undefined);
  const rows = cs.slice(0, 6).map(c => `<li><span>${esc(c.t)}${c.wh ? `<small class="note wh">📍 ${esc(c.wh)}</small>` : ""}</span>${c.go !== undefined ? `<button type="button" class="btn sm" data-lastgo="${c.go}"${atAttr(c)}>여기로 가기</button>` : ""}</li>`).join("");
  document.body.insertAdjacentHTML("beforeend", `<div id="lastBox" style="position:fixed;inset:0;z-index:95;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px"><div class="card" style="width:min(560px,100%);max-height:86vh;overflow:auto"><div class="hd"><h2>${cs.length ? `확인할 것이 ${cs.length}건 있습니다` : "한 번 더 확인하셨나요?"}</h2></div>
    <div class="bd" style="display:flex;flex-direction:column;gap:10px">${cs.length ? `<ul class="lastlist">${rows}</ul>${cs.length > 6 ? `<p class="note">외 ${cs.length - 6}건은 ‘확인’ 단계의 견적 검수에서 볼 수 있습니다.</p>` : ""}` : '<p>빠진 공사 · 수량 · 단가가 없는지 한 번만 더 봐 주세요. 걸리는 항목은 없습니다.</p>'}
    <div class="toolbar"><button type="button" class="btn primary" data-lastgo="${first ? first.go : steps.length - 1}"${first ? atAttr(first) : ""}>${cs.length ? "확인할 내용 보러 가기" : "확인 단계 다시 보기"}</button><button type="button" class="btn" data-lastdoc>상세견적서로 넘어가기</button><button type="button" class="btn ghost" data-lastclose>닫기</button></div></div></div></div>`);
  return false;
}
document.addEventListener("click", ev0 => { const t = ev0.target, box = document.getElementById("lastBox"); if (!box) return; const g = t.closest("[data-lastgo]");
  if (g) { box.remove(); goSpot(+g.dataset.lastgo, atOf(g)) }
  else if (t.closest("[data-lastdoc]")) { box.remove(); show("doc") }
  else if (t.closest("[data-lastclose]") || t === box) box.remove() });
const helpIsAct = q => { const s = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, "");   // 프로그램에 일을 시키는 말인가 (설명·추천을 바라는 말은 아니다)
  return s.length <= 32 && /(만들어|넣어|계산해|바꿔|지워|빼|열어|켜|꺼|옮겨|저장해|출력해|인쇄해|추가해|수정해|삭제해|복사해|불러와|채워|입력해|기입해|반영해|적용해|초기화해|되돌려|취소해|내보내|해봐|해)(줘|주세요|줘요|줄래|줄래요|주라|줘봐|주실래요|봐|봐줘|봐요|줄수있어|줄수있나요|줄수있니|다오|줘라)$/.test(s) && !/(설명|말|얘기|이야기|추천|비교|요약|정리|소개|안내|답|대답|번역|검색|조사|이해)해?(줘|주세요|줘요|줄래|봐|줘봐)$/.test(s) };
function helpCanDo(q, hits) {                         // 시키는 말을 못 알아들었을 때: 그 말과 가까운, 바로 되는 말을 단추로 보여 준다
  const wood = /치수|목작업|목공|석고|각재|다루끼|천[장정전]|가벽|표/.test(q), tile = /타일/.test(q), est = /견적|검수|빠진|요약|수량|확인/.test(q), nav = /단계|공정|이동|견적서|공사|항목/.test(q), all = !(wood || tile || est || nav);
  const b = (say, lab) => `<button type="button" data-helpsay="${esc(say)}">${esc(lab || say)}</button>`, c = t => `<code data-helpfill>${esc(t)}</code>`;
  return '<div class="hk">그 말은 제가 바로 실행하지 못했습니다. 아래처럼 말하면 바로 됩니다.</div>'
    + (wood || all ? helpRow("목작업 치수", b("목작업 치수 예시로 계산", "예시로 계산") + " " + b("도면 치수로 천장 석고보드 계산", "도면 치수로 계산") + "<br>" + c("거실 4500*3600, 안방 3300*3000")) : "")
    + (wood ? helpRow("치수 표", b("치수 표에 뭐 들어 있어?", "표에 든 치수 보기") + (HELP_CALC ? " " + b("넣어줘", "방금 계산 표에 넣기") : "") + (HELP_UNDO ? ' <button type="button" class="lk" data-helpundo>방금 넣은 것 빼기</button>' : "")) : "")
    + (tile || all ? helpRow("타일", b("타일 예시로 계산", "예시로 계산") + " " + c("욕실 바닥 1500*2200 타일 300각")) : "")
    + (est || all ? helpRow("지금 견적", b("뭐 안 했지?", "덜 된 것 확인") + " " + b("지금 견적 요약해줘", "요약")) : "")
    + (nav || all ? helpRow("이동·공사", c("목공 단계로 가줘") + " " + c("가벽 켜줘") + " " + c("견적서 보여줘")) : "")
    + (hits && hits.some(h => h.sc >= 14) ? helpRow("관련 안내", hits.filter(h => h.sc >= 14).slice(0, 2).map(h => `<span role="button" tabindex="0" class="lk in" data-helpgo="${h.e.n}">${esc(helpCut(h.e.q.replace(/[?？]$/, ""), 40))}</span>`).join("<br>")) : "");
}
/* 큰 질문 · 처음 쓰는 사람의 질문 — ‘30평대 기본견적은 어떻게 들어가?’ · ‘견적서 어떻게 작성해야 하는지 모르겠어’ · ‘인테리어 하나도 몰라’ */
const HELP_BASEQ = /기본(적인)?견적|기본구성|기본세팅|기본항목|기본공사|기본(은|이|에|으로|적으로)?(는)?(뭐|뭘|어떤|어떻게|무슨)|(보통|대개|일반적으로|원래|평균적으로)(은|는)?(뭐|뭘|뭐뭐|어떤거|어떤게|어떤공사|무슨공사|어떻게).{0,8}(들어가|넣|하지|해|하나)|(올수리|리모델링|전체공사|인테리어공사|인테리어)(는|은|를|을|하면|할때|에|에는)?.{0,6}(뭐|뭘|뭐뭐|어떤|무슨|공정|항목|구성).{0,10}(들어가|넣|해야|하나|하지|해|있|되|포함)|(처음부터|자동으로|미리)(켜|체크|들어가)/;
const HELP_HOWQ = /견적서?(은|는|을|를)?.{0,6}(어떻게|어케|어떤식|무슨순서|순서|방법).{0,10}(작성|만들|쓰|써|짜|내|뽑|시작|하|넣|입력)|견적서?(을|를)?(작성|만드는|쓰는|내는|짜는|뽑는)(하는)?(법|방법|순서)|(작성|사용|입력|쓰는|하는)(법|방법|하는지|해야하는지|해야할지)?.{0,4}(모르|몰라)|(처음|첨)(인데|이라|써|쓰|사용|해보|왔|이야|입니다|이에요)|뭐부터(해|눌러|하|시작|넣|입력)|(어디|무엇|뭘)(서)?부터|(이거|프로그램|여기|이프로그램|이건)(은|는|을|를)?(어떻게|어케)(써|쓰|사용|하는|시작)|사용(법|방법|순서)|시작(은|을)?어떻게|어떻게시작|견적(을|서를)?(내고|만들고|작성하고|뽑고)싶/;
const HELP_NEWQ = /(하나도|아무것도|전혀|아예|잘|1도|일도)(몰라|모르|모름)|초보|신입|입문|문외한|(인테리어|공사|현장|이일|이쪽)(은|는|이|가)?(처음|첨)|(물어봐야|질문해야)할지|뭐가뭔지|무슨말인지|용어.{0,5}(모르|몰라|어려|알려|정리|설명)|모르는(말|용어|단어)/;
function helpBaseSay(q) {                             // 공사 범위 묶음(전체 리모델링 등)에서 처음부터 켜지는 공사를 단계별로 보여 준다
  const ps = D.presets2 || [], steps = STEPS(), qs = q.replace(/\s+/g, ""), SL = D.stepLines || {}; if (!ps.length) return null;
  const want = /욕실만|화장실만/.test(qs) ? "W" : /주방만|부엌만|싱크대만/.test(qs) ? "K" : /도배만|바닥만|장판만|도배.{0,3}(바닥|장판)/.test(qs) ? "P" : /기본리모델링|부분(수리|공사|리모델링)|최소/.test(qs) ? "B" : /(지금|현재|이)견적/.test(qs) && presetTag() ? presetTag() : "F";
  const pr = ps.find(x => x.tag === want) || ps.find(x => x.tag); if (!pr) return null;
  const tr = [...new Set(KB_TRADE.filter(x => x[1].test(q)).map(x => x[0]))], one = want === "F" && tr.length === 1 && SL[tr[0]] ? tr[0] : "";
  const m = q.match(/(\d{2})\s*평/), band = m ? (+m[1] < 30 ? "20평대" : +m[1] < 40 ? "30평대" : "40평대 이상") : "", short = l => lineLabel(l).replace(/\s*\(.*?\)/g, "");
  const rows = steps.filter(st => SL[st.key] && (!one || st.key === one)).map(st => ({ st, i: steps.indexOf(st), ls: SL[st.key].filter(l => (l.tags || []).includes(pr.tag)), off: SL[st.key].filter(l => !(l.tags || []).includes(pr.tag)) }));
  const n = rows.reduce((a, r) => a + r.ls.length, 0), none = rows.filter(r => !r.ls.length), cur = ps[E.preset] || {};
  const line = r => { const main = r.ls.filter(l => !helpIsSup(l)), sup = r.ls.length - main.length;
    return `<div class="hl"><b role="button" tabindex="0" class="hbr" data-goto="${r.i}" title="그 단계 보기">${esc(helpCut(r.st.label, 9))}</b><span>${esc(main.slice(0, one ? 14 : 6).map(short).join(", "))}${main.length > (one ? 14 : 6) ? ` 외 ${main.length - (one ? 14 : 6)}개` : ""}${sup ? " <small>+ 자재·작업비</small>" : ""}</span></div>` };
  const rel = kbFind(q, 9, 2);
  return `<div class="hk">${band ? band + " " : ""}‘${esc(pr.label)}’ 기준으로 ${one ? "이 단계에서 " : ""}처음부터 켜지는 공사는 <b>${n}개</b>입니다.</div>`
    + rows.filter(r => r.ls.length).map(line).join("")
    + (one && rows[0] && rows[0].off.length ? helpRow("필요하면 체크", esc(rows[0].off.filter(l => !helpIsSup(l)).slice(0, 10).map(short).join(", "))) : "")
    + (!one && none.length ? helpRow("기본에 없는 단계", esc(none.map(r => r.st.label).join(", ")) + " — 하는 현장만 그 단계에서 체크합니다.") : "")
    + helpRow("평수", `평수가 달라도 공사 종류는 같고 <b>수량만</b> 바뀝니다. ‘현장 정보’에 평수·방·욕실 수를 넣으면 자동으로 계산됩니다.${E.py ? ` <small>지금 견적 ${esc(String(E.py))}평</small>` : ""}`)
    + (cur.label && cur.tag !== pr.tag ? helpRow("지금 견적", `공사 범위가 ‘${esc(cur.label)}’입니다. ‘현장 정보’에서 바꿀 수 있습니다.`) : "")
    + (!one ? helpRow("다른 범위", ps.filter(x => x.tag && x.tag !== pr.tag).map(x => `<button type="button" class="lk" data-helpsay="${esc(x.label)} 기본견적은 뭐 들어가?">${esc(x.label)}</button>`).join(" ")) : "")
    + (rel.length ? helpRow("관련 안내", rel.map(h => `<span role="button" tabindex="0" class="lk in" data-helpgo="${h.e.n}">${esc(helpCut(h.e.q.replace(/[?？]$/, ""), 40))}</span>`).join("<br>")) : "")
    + `<div class="hm"><button type="button" data-goto="${one ? rows[0].i : 0}">${one ? "그 단계 보기" : "‘현장 정보’에서 시작"}</button><button type="button" class="lk" data-helpsay="견적서 어떻게 작성해?">작성 순서</button></div>`
    + '<div class="hw">⚠ 기본으로 켜진 공사는 출발점입니다. 현장에서 안 하는 공사는 끄고, 실장님이 직접 확인해 주세요.</div>';
}
function helpHowSay(q) {                              // 견적서 만드는 순서 (처음 쓰는 사람용)
  const steps = STEPS(), SL = D.stepLines || {}, tr = [...new Set(KB_TRADE.filter(x => x[1].test(q)).map(x => x[0]))], last = steps.length - 1;
  if (tr.length === 1 && SL[tr[0]]) { const i = steps.findIndex(s => s.key === tr[0]), st = steps[i], on = SL[st.key].filter(l => lnState(l).on && !helpIsSup(l)).map(l => lineLabel(l).replace(/\s*\(.*?\)/g, "")), rel = kbFind(q, 9, 3);   // ‘도배 견적은 어떻게 넣어?’ → 그 단계 안내
    return `<div class="hk">‘${esc(st.label)}’ 단계에서 할 공사를 체크하면 견적에 들어갑니다.</div>` + helpRow("지금 켜진 공사", on.length ? esc(on.slice(0, 8).join(", ")) + (on.length > 8 ? " 외" : "") : "아직 없습니다.")
      + (PY_STEPS[st.key] && (D.cats[st.key] || []).some(c => c.pyc) ? helpRow("평수만 넣기", `‘${esc((D.cats[st.key].find(c => c.pyc) || {}).label || "")}’ 묶음 맨 위에서 평수와 종류만 정하면 자재·부자재·작업비가 계산됩니다.`) : "")
      + helpRow("수량", "평수와 방 수로 자동 계산됩니다. 눌러서 고칠 수 있고, 언제든 원래대로 되돌릴 수 있습니다.") + helpRow("말로 하기", "<code data-helpfill>" + esc(String(st.label).split(/[·(]/)[0]) + " 작업할거야</code>")
      + (rel.length ? helpRow("많이 묻는 것", rel.map(h => `<span role="button" tabindex="0" class="lk in" data-helpgo="${h.e.n}">${esc(helpCut(h.e.q.replace(/[?？]$/, ""), 40))}</span>`).join("<br>")) : "")
      + `<div class="hm"><button type="button" data-goto="${i}">‘${esc(st.label)}’ 단계 보기</button><button type="button" class="lk" data-helpmap="${st.key}">${esc(helpCut(st.label, 10))} 전체 ›</button></div>` }
  let k = 0, nl = 0; try { k = estCheck(steps).filter(c => c.lv < 3).length; nl = R.lines.filter(l => !l.extra && l.qty > 0).length } catch (e) { }
  return '<div class="hk">아래 순서대로 누르면 견적서가 됩니다. 기본 공사는 이미 켜져 있어서 <b>고칠 것만</b> 고치면 됩니다.</div>'
    + helpRow("① 현장 정보", '평수 · 방 · 욕실 수와 공사 범위(전체 리모델링 등)를 고릅니다. <button type="button" class="lk" data-goto="0">가기</button>')
    + helpRow("② 단계별 체크", `‘다음 →’으로 ${steps.filter(s => SL[s.key]).length}단계를 넘기며 할 공사만 체크합니다. 수량은 자동으로 계산됩니다.`)
    + helpRow("③ 고치기", "자재 · 수량을 눌러 바꿉니다. 직접 고친 값은 언제든 원래대로 되돌릴 수 있습니다.")
    + helpRow("④ 확인", `마지막 ‘확인 · 견적서’ 단계에서 빠진 것을 봅니다. <button type="button" class="lk" data-helpsay="뭐 안 했지?">덜 된 것 보기</button>`)
    + helpRow("⑤ 견적서", '‘② 상세견적서’에서 수정 · 저장 · 인쇄 · 엑셀 저장을 합니다. <button type="button" class="lk" data-helpsay="견적서 보여줘">열기</button>')
    + helpRow("다른 고객 견적", "‘현장 정보’ 맨 위 ‘＋ 새 견적 만들기’로 시작합니다. 쓰던 견적은 지워지지 않고 ‘저장된 견적’에 남습니다.")
    + helpRow("말로 해도 됩니다", "<code data-helpfill>거실 아트월이랑 몰딩만 작업할거야</code>")
    + helpRow("모르는 말", "<code data-helpfill>몰딩이 뭐야?</code> <code data-helpfill>기본견적은 뭐 들어가?</code>")
    + helpRow("지금 견적", `${esc(String(E.py || "?"))}평 · 공사 ${nl}줄${k ? ` · 확인할 것 ${k}건` : ""}`)
    + `<div class="hm"><button type="button" data-goto="0">‘현장 정보’에서 시작</button><button type="button" class="lk" data-goto="${last}">확인 단계</button></div>`;
}
function helpNewSay(q) {                              // 인테리어를 처음 접하는 사람: 큰 순서 · 쉬운 질문 예시 · 견적 만드는 길
  const steps = STEPS(), tr = [...new Set(KB_TRADE.filter(x => x[1].test(q)).map(x => x[0]))];
  if (tr.length === 1 && KB.some(e => e.s === tr[0])) return '<div class="hk">괜찮습니다. 이 공정에서 많이 묻는 것부터 보세요. 모르는 말은 그 말에 ‘뭐야?’만 붙여 물으면 됩니다.</div>' + helpMap(tr[0]);
  const c = t => `<code data-helpfill>${t}</code>`;
  return '<div class="hk">괜찮습니다. 아는 말이 없어도 쓸 수 있습니다. 모르는 말이 나오면 그 말에 <b>‘뭐야?’</b>만 붙여 물어보세요.</div>'
    + `<div class="hl"><b>공사 큰 순서</b><span class="hbx in">${steps.filter(s => KB.some(e => e.s === s.key) && s.key !== "s0").map(s => `<span role="button" tabindex="0" class="hch" data-helpmap="${s.key}">${esc(s.label)}</span>`).join("")}</span></div>`
    + helpRow("전체 그림", c("인테리어 공사는 뭐부터 해?") + " " + c("올수리가 뭐야?") + " " + c("공사 며칠 걸려?"))
    + helpRow("모르는 말", c("몰딩이 뭐야?") + " " + c("샷시가 뭐야?") + " " + c("덧방이 뭐야?"))
    + helpRow("견적서 말", c("견적서에 식이 뭐야?") + " " + c("헤베가 뭐야?") + " " + c("전용면적이 뭐야?"))
    + helpRow("견적 만들기", '<button type="button" data-helpsay="견적서 어떻게 작성해?">작성 순서</button> <button type="button" data-helpsay="기본견적은 뭐 들어가?">기본으로 들어가는 공사</button>')
    + helpRow("추천 묻기", c("30평대 조명 어떻게 넣어?") + " " + c("30평대 욕실은 보통 어떻게 해?"));
}
const HELP_COSTQ = /(견적|공사비|총액|전체|올수리|리모델링|인테리어|평대?|평형)(은|는|이|가|하면|으로|에)?.{0,8}(얼마|비용|금액|가격|예산)|^(총|전체|합계)?(금액|비용|견적금액|공사비|합계)(은|는|이|가)?(얼마|어디|어떻게|확인|보여|알려)|평당(얼마|단가|가격|비용)|^(총|전체|합계|전부|다해서|다합쳐서?|모두|토탈|총액)(는|은|가|이)?(얼마|몇)|^(견적|금액)?(이|은|는)?얼마나?(나왔|나와|나오)/;
const HELP_WHYNO = "회사 내부 방침상 금액 전달은 힘듭니다.";   // (v95) 왜 금액을 말하지 않는지 — 사용자: “왜 말하지 않는지 간단히 말해줘야 잘 알지 … 회사 방침이라 할 수도 있잖아”
function helpCostSay(q) {                             // 금액은 챗봇이 말하지 않는다 → 어디서 보는지 · 왜 · 지금 견적
  let nl = 0; try { nl = R.lines.filter(l => !l.extra && l.qty > 0).length } catch (e) { }
  return `<div class="hk">금액은 <b>견적 합계 칸</b>과 <b>상세견적서</b>에 바로 나옵니다.<small class="hwy">${HELP_WHYNO}</small></div>`
    + helpRow("지금 견적", `${esc(String(E.py || "?"))}평 · 공사 ${nl}줄 — 평수 · 공사 범위 · 종류 · 수량을 바꾸면 금액이 바로 바뀝니다.`)
    + ((m => m && +m[1] !== +E.py ? helpRow("평형", `물으신 ${+m[1]}평과 다릅니다. <button type="button" class="lk" data-helpsay="평수 ${+m[1]}평으로 바꿔줘">${+m[1]}평으로 바꾸기</button> <button type="button" class="lk" data-helpsay="${+m[1]}평 전체 리모델링 견적 만들어줘">${+m[1]}평 새 견적 만들기</button>`) : "")(String(q || "").replace(/\s+/g, "").match(/(?<!\d)(\d{2})평/)))
    + '<div class="hm"><button type="button" data-procview="*">공정별 금액 보기</button><button type="button" class="lk" data-helpsay="견적서 보여줘">상세견적서 열기</button><button type="button" class="lk" data-goto="0">평수 · 범위 고치기</button></div>';
}
function helpCmpSay(q) {                              // 말로 비교견적 만들기
  if (!D.stepLines || !/비교\s*견적|비교\s*해|비교\s*좀|옵션\s*으로|별도\s*로|별도\s*견적/.test(q) || /뭐야|이란|차이가|어떻게\s*달라|장단점/.test(q)) return null;
  const qn = kbNorm(kbCanon(q)), steps = STEPS(), warn = '<div class="hw">⚠ 비교견적은 합계에 들어가지 않습니다. 금액과 수량은 실장님이 직접 확인해 주세요.</div>', key = n => kbNorm(aliasOf(n).split(/[ (]/)[0]);
  for (const [sk, ls] of Object.entries(D.stepLines)) for (const l of ls) { if (l.items.length < 2) continue;
    const ks = [...new Set(l.items.map(key))].filter(k => k.length >= 2 && qn.includes(k)); if (ks.length < 2) continue;
    const st = lnState(l), cur = key(l.items[Math.min(st.alt || 0, l.items.length - 1)]), base = st.on && ks.includes(cur) ? cur : ks[0], other = ks.filter(k => k !== base);
    const patch = { on: true, opt: false, cmp: [...new Set([...cmpArr(st), ...other.map(k => l.items.findIndex(n => key(n) === k))])] }; if (!(st.on && ks.includes(cur))) patch.alt = l.items.findIndex(n => key(n) === base);
    const was = E.ln[l.id] ? JSON.stringify(E.ln[l.id]) : ""; setLn(l, patch); refresh(); const gi = steps.findIndex(s => s.key === sk), cs = (R.cmp || []).filter(x => x.lid === l.id);
    return `<div class="hk">‘${esc(lineLabel(l))}’에 비교견적을 넣었습니다. 지금 견적은 <b>${esc(aliasOf(l.items[lnState(l).alt || 0]))}</b> 기준입니다.</div>`
      + cs.map(x => helpRow(helpCut(aliasOf(x.to), 14), `바꾸면 공사비 ${x.diff > 0 ? "+" : "−"}${won(Math.abs(x.diff))}원`)).join("") + helpRow("어디에 나오나", "합계 칸의 ‘비교견적’과 상세견적서 끝의 표에 따로 나옵니다.")
      + `<div class="hm">${gi >= 0 ? `<button type="button" data-goto="${gi}">그 단계 보기</button>` : ""}<button type="button" class="lk" data-helpsay="견적서 보여줘">견적서 보기</button></div>` + warn }
  const ids = [...new Set(HELP_WSYN.filter(x => x[0].test(q)).slice(0, 3).flatMap(x => x[1]))], ls2 = ids.map(lnFind).filter(Boolean);
  if (ls2.length) { ls2.forEach(l => setLn(l, { on: true, opt: true })); refresh(); const amt = (R.opt || []).filter(x => ids.includes(x.lid)).reduce((a, x) => a + x.amt, 0);
    return `<div class="hk">${esc(ls2.map(lineLabel).join(", "))} — 비교견적(별도)으로 넣었습니다. 합계에는 들어가지 않습니다.</div>` + helpRow("별도 금액", won(amt) + "원 (VAT 별도)") + helpRow("되돌리기", "그 줄의 ‘합계에 넣기’를 누르면 합계에 들어갑니다. 부자재·작업비까지 함께 비교하려면 묶음의 ‘묶음째 비교견적’을 누르세요.") + warn }
  return '<div class="hk">비교견적은 공사 줄의 <b>비교견적</b> 단추로 만듭니다. 합계에는 넣지 않고 금액만 따로 보여 줍니다.</div>' + helpRow("종류 비교", "줄의 ‘비교견적 ▾’ → 다른 종류를 누르면 차액이 나옵니다. <code data-helpfill>장판이랑 강마루 비교견적 해줘</code>") + helpRow("할지 말지", "‘이 공사를 별도로 돌리기’ 또는 묶음의 ‘묶음째 비교견적’. <code data-helpfill>탄성코트는 비교견적으로 넣어줘</code>") + helpRow("직접 입력", "직접 입력한 공사·필름 줄은 ‘비교견적(별도)’를 체크합니다.");
}
function helpWhereSay(q) {                            // 공사가 어느 단계 · 어느 묶음에 있는지
  const qs = q.replace(/\s+/g, "");
  { const pm = D.stepLines && qs.length <= 30 && /평수/.test(qs) && /어디|어딨|어떻게|넣|바꾸|바꿔|고치|고쳐|입력|줄이|줄여/.test(qs) && !/계산|몇|얼마|뭐야|무엇|왜|인원|인건비|식대|작업비|바뀌어|바뀌나|바뀝|따라/.test(qs) ? (/도배|벽지/.test(qs) ? "s9" : /장판|마루|바닥|데코타일/.test(qs) ? "s8" : "") : "";   // ‘도배 평수 어디에 넣어?’ → 그 묶음의 평수 칸
    if (pm) { const steps = STEPS(), i = steps.findIndex(s => s.key === pm), c = (D.cats[pm] || []).find(c => c.pyc);
      if (i >= 0 && c) return `<div class="hk">${i}단계 ‘${esc(steps[i].label)}’의 ‘${esc(c.label)}’ 묶음 맨 위 ‘${pm === "s9" ? "도배 평수" : "평수"}’ 칸에 넣습니다.</div>` + helpRow("평수", pm === "s9" ? "도배 평수(벽·천장에 바르는 넓이)입니다. 집 전체를 도배하면 아파트 평형에 맞춰 자동으로 들어가 있습니다(34평이면 85평)." : "아파트 평형 기준입니다. 집 전체를 하면 현장 정보의 평형이 그대로 들어가 있어 고칠 것이 없습니다.") + helpRow("일부만", "안 하는 공간을 도면·공간 단추에서 빼거나, ‘평수’ 칸에 줄인 평수를 넣습니다.") + helpRow("나머지", "자재·부자재·작업비·식대는 프로그램이 계산해 상세견적서에 나눠 적습니다.") + `<div class="hm"><button type="button" class="lk" data-wgo="${i}|${pm}|${c.key}">가서 보기</button></div>` } } if (!D.stepLines || qs.length > 30 || !/(?<!스)위치|어디|어딨|어느단계|어느공정|몇단계/.test(qs) || /치수|메모|도면|저장|인쇄|엑셀|주소|평면도|높이|간격|박스|공사기간|유효기간|기업이윤|여기로가기|어떻게(정|잡)|정해|잡아|추천|좋아|좋을|좋은|보통|써도|해도|되나|될까/.test(qs) || !/견적|넣|입력|체크|항목|공정|위치|있어|있나|있지|있는|찾/.test(qs)) return null;
  const steps = STEPS(), ids = [...new Set(HELP_WSYN.filter(x => x[0].test(q)).slice(0, 2).flatMap(x => x[1]))]; let hits = [];
  const hidden = l => (HIDE_LINES.includes(l.id) || l.gone) && !lnState(l).on, inWt = () => false;
  const row = (sk, l) => { const i = steps.findIndex(s => s.key === sk), c = (D.cats[sk] || []).find(c => c.lines.includes(l.id));
    if (inWt(sk, l)) return `<div class="hl"><b>목공 작업표</b><span>${i}단계 ‘${esc(steps[i].label)}’ 맨 위 — 작업을 고르고 자재·부자재 ‘식’ 수와 목수 인원을 넣는 표 <button type="button" class="lk" data-wgo="${i}|">가서 보기</button></span></div>`;
    return `<div class="hl"><b>${esc(helpCut(lineLabel(l), 14))}</b><span>${i}단계 ‘${esc(steps[i].label)}’${c ? ` › ‘${esc(c.label)}’ 묶음` : ""} <button type="button" class="lk" data-wgo="${i}|${c ? sk + "|" + c.key : ""}">가서 보기</button></span></div>` };
  for (const [sk, ls] of Object.entries(D.stepLines)) for (const l of ls) if (ids.includes(l.id)) hits.push([sk, l]);
  if (!hits.length) { const terms = kbTok(q).filter(t => !/^(견적|위치|어디|어딨|단계|공정|항목|넣|입력|체크|있어|있나|찾|어느|몇)/.test(t)); if (terms.length) for (const [sk, ls] of Object.entries(D.stepLines)) for (const l of ls) { const lab = kbNorm(lineLabel(l) + (l.label || "") + l.items.join("")); if (terms.some(t => t.length >= 2 && lab.includes(t))) hits.push([sk, l]) } }
  { const sp = [[/욕실\s*(조명|등|다운|매입등)|방습등/, ["bathDown", "bathLight"]], [/센서등/, ["sensor"]], [/직부등/, ["balLight", "direct"]], [/(상부|천장)\s*몰딩\s*철거/, ["demoMoldTop"]], [/걸레받이\s*철거/, ["demoBase"]]].find(x => x[0].test(q));   // 두 낱말이 합쳐져야 뜻이 정해지는 것은 먼저 본다 (욕실 + 조명 → 욕실 다운라이트)
    if (sp) { const hs = []; for (const [sk, ls] of Object.entries(D.stepLines)) for (const l of ls) if (sp[1].includes(l.id)) hs.push([sk, l]); if (hs.length) hits = hs } }
  if (/조명|전등|등기구/.test(qs) && !/매입|다운|라인|간접|센서|직부|욕실|거실|방등|주방|펜던트|마그네틱|레일|실링|스위치|콘센트|철거/.test(qs) && D.cats.s5) { const lc = D.cats.s5.filter(c => /^l(base|down|line|common)$/.test(c.key)); if (lc.length) hits = lc.flatMap(c => c.lines.map(lineById).filter(Boolean).map(l => ["s5", l])) }   // ‘조명’을 통째로 물으면 조명 묶음 넷을 알려 준다
  let more = ""; hits = hits.filter(h => !hidden(h[1])); { let wt = false; hits = hits.filter(h => inWt(h[0], h[1]) ? (wt ? false : (wt = true)) : true) }   // 감춘 줄은 빼고, 목공 세트 줄들은 ‘목공 작업표’ 한 줄로
  if (/철거|뜯|떼어|떼는|떼내/.test(qs)) {   // ‘걸레받이 철거 어디야’ → 다는 공사(목공)가 아니라 철거 묶음의 줄을 알려 준다
    const tm = kbTok(q).filter(t => t.length >= 2 && !/^(철거|견적|위치|어디|어딨|단계|공정|항목|넣|입력|체크|있어|있나|찾|어느|몇)/.test(t)), dh = [];
    if (tm.length) for (const [sk, ls] of Object.entries(D.stepLines)) for (const l of ls) { const lab = kbNorm(lineLabel(l) + l.items.join("")); if (/철거/.test(lab) && !hidden(l) && tm.some(t => lab.includes(t))) dh.push([sk, l]) }
    if (dh.length) { const oth = hits.filter(h => !dh.some(d => d[1] === h[1])).slice(0, 2); hits = dh; if (oth.length) more = helpRow("새로 다는 공사는", oth.map(h => `${esc(lineLabel(h[1]))} — ${steps.findIndex(s => s.key === h[0])}단계 ‘${esc((steps.find(s => s.key === h[0]) || {}).label || "")}’`).join(" · ")) } }
  if (hits.length >= 5 && new Set(hits.map(h => h[0])).size === 1) { const sk = hits[0][0], i = steps.findIndex(s => s.key === sk), cs = (D.cats[sk] || []).filter(c => c.lines.some(id => hits.some(h => h[1].id === id)) && !(c.only && HIDE_LINES.includes(c.only) && !c.lines.some(id => { const x = lineById(id); return x && lnState(x).on })));   // 한 단계에 여러 줄이면 줄 대신 묶음으로 알려 준다 (감춘 작업 카드는 빼고)
    if (cs.length > 1) return `<div class="hk">${i}단계 ‘${esc(steps[i].label)}’에 있습니다. 묶음 ${cs.length}개로 나뉘어 있습니다.</div>` + cs.map(c => `<div class="hl"><b>${esc(helpCut(c.label, 18))}</b><span>${esc(helpCut(c.lines.map(lineById).filter(l => l && !hidden(l)).map(lineLabel).join(", "), 64))} <button type="button" class="lk" data-wgo="${i}|${sk}|${c.key}">가서 보기</button></span></div>`).join("") + `<div class="hm"><button type="button" data-goto="${i}">‘${esc(steps[i].label)}’ 단계 보기</button></div>` }
  if (hits.length) return `<div class="hk">${hits.length === 1 ? "여기에 있습니다." : `관련 공사 ${hits.length}개의 위치입니다.`}</div>` + hits.slice(0, 7).map(h => row(h[0], h[1])).join("") + (hits.length > 7 ? helpRow("", `외 ${hits.length - 7}개 — 왼쪽 위 ‘공사 찾기’ 칸에 이름을 적어도 찾을 수 있습니다.`) : "") + more + helpRow("없으면", "그 단계에서 묶음 카드를 펼쳐 맨 아래 ‘＋ 항목 추가’로 넣거나, 단계 맨 아래 ‘묶음에 없는 항목 추가’로 직접 넣을 수 있습니다.");
  const t = KB_TRADE.find(x => x[1].test(q)), i = t ? steps.findIndex(s => s.key === t[0]) : -1; if (i < 0) return null;
  return `<div class="hk">${i}단계 ‘${esc(steps[i].label)}’에 있습니다.</div>` + (D.cats[t[0]] || []).map(c => `<div class="hl"><b>${esc(helpCut(c.label, 14))}</b><span>${esc(helpCut(c.lines.map(lineById).filter(Boolean).map(lineLabel).join(", "), 60))} <button type="button" class="lk" data-wgo="${i}|${t[0]}|${c.key}">가서 보기</button></span></div>`).join("") + `<div class="hm"><button type="button" data-goto="${i}">‘${esc(steps[i].label)}’ 단계 보기</button></div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-wgo]"); if (!b) return; const [i, sk, ck] = b.dataset.wgo.split("|"); E.step = +i; if (sk && ck) openCat(sk + "|" + ck); show("check"); renderChecklist(); save(); window.scrollTo({ top: 0, behavior: "smooth" }) });
/* (v79 · v80) 챗봇: 견적을 바라는 말에는 설명 말고 견적을 새로 만들어 준다 — 사용자(2026-11-20, “기본인테리어 견적서를 작성하려고 하는데 32평 기준으로 어느 정도 될까?”에 챗봇이 설명만 늘어놓은 화면을 보내며):
   “답변이 이상하지? … 기본 공사라고 하면 실크도배, 장판, 기본철거, 욕실 덧방 시공, 제일 금액이 가성비 있게 저렴하게 들어가는 형태로 잡는 걸 추천하는 거지. 실장의 견적서 추천이 아니라 그걸 조합해서 견적서를 하나 새로 작성해 주는 거지.” ·
   “기본공사에 그렇게 생각을 해주면 되는거야 · 필요한 내용들을 다 넣어서 작업을 하고 내가 말한 의도를 다 파악해서”.
   · 기본 공사 = 공사 유형 ‘기본 리모델링’(실크 도배 · 장판 · 부분 철거 · 필요한 공사 모두) + 모든 욕실 ‘덧방’.
   · (v80) 같은 뜻을 다른 공사 유형에도: 전체 리모델링(올수리) · 도배·바닥만 · 욕실만 · 주방만 — 평형(과 방·욕실 수 · 욕실 덧방/전체 교체)을 말하면 그 유형으로 새 견적을 만든다.
   쓰던 견적은 ‘저장된 견적’에 남기고(keepCur) ‘되돌리기’를 함께 준다. 금액은 말하지 않고 견적 합계 칸을 가리킨다. */
function helpBasicQ(q) {                              // 견적을 만들어 달라는(얼마냐는) 말인가 → { tag 공사 유형, name, py, rooms, baths, over 욕실 덧방, go 바로 만들기 } 또는 null
  const qs = q.replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (/\d\s*[*xX×]\s*\d/.test(q) || qs.length > 80) return null;
  if (/어떻게|어케|방법|순서|하는법|쓰는법|뭐부터|어디서부터|왜|이유|차이|비싸|올라|마진|원가|단가표|평당|며칠|기간/.test(qs)) return null;   // 쓰는 법 · 까닭을 묻는 말은 저장된 답으로
  const basic = /(기본|가성비|저렴|최소한?으로|싸게|제일싼|가장싼)/.test(qs) && /(인테리어|공사|리모델링|올수리|견적)/.test(qs);
  const kind = basic ? ["B", "기본 공사"] : /(도배.{0,5}(장판|바닥|마루)|(장판|바닥|마루).{0,5}도배)(만|공사)?/.test(qs) ? ["P", "도배·바닥만"] : /(욕실|화장실)(만|공사만|리모델링)/.test(qs) ? ["W", "욕실만"]
    : /(주방|싱크대?)(만|공사만|리모델링)/.test(qs) ? ["K", "주방만"] : /전체리모델링|올수리|전체공사|올리모델링|풀리모델링|전체인테리어|전체수리/.test(qs) ? ["F", "전체 리모델링"] : null;
  if (!kind) return null;
  const make = /(견적서?(을|를)?.{0,8}(작성|만들|뽑|짜|잡아|써줘|내줘|내고))|(작성|만들어|뽑아|짜|잡아)(줘|주세요|줄래|주라|봐)/.test(qs), cost = /얼마|어느정도|어느만큼|금액|비용|예산|견적.{0,3}(나와|나올|될까|되나|돼)/.test(qs);
  const m = qs.match(/(\d{2,3})평/), py = m && +m[1] >= 10 && +m[1] <= 150 ? +m[1] : 0;
  if (!make && !(cost && (basic || py))) return null;  // ‘올수리 얼마야’처럼 평형도 없이 값만 묻는 말은 전처럼 금액 보는 곳 안내
  if (/(뭐|뭘|무엇|어떤|무슨|뭐뭐).{0,8}(들어가|포함|넣|하나|해야|있)/.test(qs) && !make) return null;   // 구성만 묻는 말은 helpBaseSay
  const rm = qs.match(/방(\d)(개|칸)?/), bm = qs.match(/(욕실|화장실)(\d)(개|칸|곳)?/);
  const over = /덧방/.test(qs) ? true : /(욕실|화장실).{0,6}(전체|올)(교체|철거|공사)|욕실철거/.test(qs) ? false : basic;
  return { tag: kind[0], name: kind[1], py, rooms: rm && +rm[1] >= 1 && +rm[1] <= 6 ? +rm[1] : 0, baths: bm && +bm[2] >= 1 && +bm[2] <= 3 ? +bm[2] : 0, over, go: make };
}
function helpBasicSay(q) {
  const m = helpBasicQ(q); if (!m || !D.stepLines || !(D.presets2 || []).some(p => p.tag === m.tag)) return null;
  const py = m.py || +E.py || 33, lab = py + "평 " + m.name, say = lab + (m.rooms ? " 방" + m.rooms : "") + (m.baths ? " 욕실" + m.baths : "") + (m.over && m.tag !== "B" ? " 욕실 덧방" : "") + " 견적 만들어줘";
  if (!m.go && estHas()) return `<div class="hk">${esc(lab)} 견적을 새로 만들어 드릴 수 있습니다. 만들면 금액이 화면의 견적 합계에 바로 나옵니다.</div>`
    + (m.tag === "B" ? helpRow("기본 공사", "실크 도배 · 장판 · 부분 철거 · 욕실 덧방으로, 가장 가성비 있게 잡는 구성입니다.") : helpRow("구성", `공사 유형 ‘${esc(m.name)}’에서 처음 켜지는 공사 그대로입니다.`)) + helpRow("쓰던 견적", "지워지지 않고 ‘저장된 견적’에 임시저장으로 남습니다.")
    + `<div class="hm"><button type="button" data-helpsay="${esc(say)}">${esc(lab)} 견적 만들기</button></div>`;
  return helpBasicMake(py, !m.py, m);
}
function helpBasicMake(py, guessed, m) {
  m = m || { tag: "B", name: "기본 공사", over: true };
  const kept = keepCur(); if (kept === false) return '<div class="hk">이 브라우저에는 더 저장할 수 없어 쓰던 견적을 남기지 못했습니다. ‘견적 파일 내보내기’로 보관한 뒤 다시 말씀해 주세요.</div>';
  const ps = D.presets2 || [], bi = Math.max(0, ps.findIndex(p => p.tag === m.tag));
  E = blankEst(); E.py = py; if (m.rooms) E.rooms = m.rooms; if (m.baths) E.baths = m.baths; applyPreset2(bi);
  let bs = []; try { bs = spaces().list.filter(s => s.type === "욕실") } catch (e) { }
  const bathOn = m.tag !== "P" && m.tag !== "K";      // 욕실 공사가 들어가는 유형
  if (bs.length && m.over && bathOn) { E.bathMode = {}; for (const s of bs) E.bathMode[s.id] = "over" }   // 욕실은 모두 덧방 (철거·방수 없이 타일·천장·도기)
  const steps = STEPS(); E.step = steps.length - 1; refresh(true); show("check"); window.scrollTo({ top: 0 });
  const nm = id => { const x = R.lines.find(y => y.lid === id); return x ? custName(docNm(x)) : "" };
  const parts = [nm("paper"), nm("floor"), R.lines.some(x => x.step === "s1" && /철거/.test(x.name)) ? (m.tag === "F" ? "철거" : "부분 철거") : "", bathOn && bs.length ? `욕실 ${bs.length}칸 ${m.over ? "덧방" : "전체 교체"}` : ""].filter(Boolean);
  const rest = steps.slice(1, -1).map(st => { const s = stepStats(st); return s.on ? st.label + " " + s.on + "건" : "" }).filter(Boolean);
  return `<div class="hk">${py}평 ‘${esc(m.name)}’${m.tag === "B" ? "로" : " 견적으로"} 새 견적을 만들었습니다. 금액은 화면의 <b>견적 합계</b> 칸에 나와 있습니다.</div>`
    + helpRow("핵심", esc(parts.join(" · ")) + (m.tag === "B" ? " — 가장 가성비 있게 잡는 구성입니다." : ""))
    + helpRow("단계별", esc(rest.join(" · ")))
    + helpRow("집 구조", `방 ${E.rooms} · 욕실 ${E.baths} · 발코니 ${E.balconies}로 잡았습니다. 다르면 ‘현장 정보’에서 고치면 금액이 바로 바뀝니다.${guessed ? " 평형을 말씀하지 않아 " + py + "평으로 만들었습니다." : ""}`)
    + helpRow("고치려면", "안 하는 공사는 그 단계에서 체크를 끄고, " + (bathOn ? `욕실을 ${m.over ? "전체 교체" : "덧방"}${m.over ? "로" : "으로"} 하려면 ‘현장 정보 → 공간’의 ‘욕실 공사 범위’에서 바꿉니다.` : "더 넣을 공사는 그 단계에서 체크합니다."))
    + (kept ? helpRow("쓰던 견적", esc(kept)) : "")
    + '<div class="hw">⚠ 처음 켜진 공사는 출발점입니다. 현장에 맞는지, 빠진 공사가 없는지 실장님이 직접 확인해 주세요.</div>'
    + `<div class="hm"><button type="button" data-goto="0">현장 정보 넣기</button><button type="button" class="lk" data-helpsay="견적서 보여줘">상세견적서</button>${kept ? '<button type="button" class="lk" data-undo>되돌리기 (쓰던 견적으로)</button>' : ""}</div>`;
}
function helpBig(q) {                                 // 위 세 가지 가운데 맞는 것 (없으면 null)
  const qs = q.replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length > 34 || /\d\s*[*xX×]\s*\d/.test(q)) return null;
  if (/기기|컴퓨터|휴대폰|핸드폰|로그인|로그아웃|전용주소|비밀번호|아이디/.test(qs)) return null;   // (v84) 기기 · 로그인을 묻는 말(‘집 컴퓨터에서 처음 쓰려면’)은 견적 쓰는 순서 안내가 아니라 저장된 답으로
  const tr = KB_TRADE.filter(x => x[1].test(q)).length;
  if (HELP_BASEQ.test(qs) && !/얼마|비용|금액|가격|단가|기간|며칠|몇일|차이|뭐야$|순서|부터|먼저|추천|좋/.test(qs) && (!tr || (tr === 1 && /기본/.test(qs)))) return helpBaseSay(q);
  if (tr === 1 && qs.length <= 20 && /(얼마야|얼마예요|얼마에요|얼마임|얼마지|얼마나와|얼마들어|얼마해|얼마받|가격|비용|금액|단가)/.test(qs) && !/높이|두께|간격|깊이|폭|크기|치수|수량|몇|기간|로스|길이|넓이|사이즈|규격|용량|걸려|왜|이유|차이|비싸|싸|추가|원가|마진|평당|롤|박스/.test(qs)) { const sk = KB_TRADE.find(x => x[1].test(q))[0], i = STEPS().findIndex(s => s.key === sk); if (i > 0) return '<div class="hk">‘' + esc(STEPS()[i].label) + '’ 단계에서 공사를 체크하면 줄마다 금액이 바로 나옵니다.<small class="hwy">' + HELP_WHYNO + '</small></div>' + '<div class="hm"><button type="button" data-goto="' + i + '">그 단계 보기</button><button type="button" class="lk" data-helpsay="견적서 보여줘">상세견적서</button></div>' }
  if (HELP_COSTQ.test(qs) && !tr && !/왜|이유|차이|올라|비싸|싸|깎|할인|부가세|추가|계약금|중도금|잔금|결제|마진|원가|라는말|이란말|믿|의미|맞아|맞나|맞는|정확|함정|기준이|예산|얼마나(빨리|걸|자주|오래|많|일찍|늦|미리|자세|길)/.test(qs)) return helpCostSay(q);
  if (HELP_NEWQ.test(qs) && tr <= 1 && !/계산|수량/.test(qs)) return helpNewSay(q);
  if (HELP_HOWQ.test(qs) && !/하자|누수|고장|계약|잔금|이사|입주|민원|관리사무소|이웃|보수|as|a\/s|상담|실측|현장|고객|손님|통화|전화|카톡|문의|집볼|집을|집보|발주|공정표|작업자/i.test(qs) && !/^(사용법|도움말|기능)|챗봇|치수|계산|저장|인쇄|엑셀|도면|출력|pdf|내보내|버전|수정|고치|바꾸|삭제|지우|복사|새견적|새로운견적|견적서?[을를]?새로|이어서|이어쓰/i.test(qs) && (!tr || (tr === 1 && /견적/.test(qs) && qs.length <= 24)) && (/견적|프로그램|이거|여기|처음|첨|사용|작성/.test(qs) || !/공사|시공|인테리어|리모델링|올수리|수리/.test(qs))) return helpHowSay(q);
  return null;
}
/* ───── (v90) 짧은 말 · 여러 말투로 시키는 일 ─────
   사용자(2026-11-22): “챗봇에서 의도를 이해하고 답변하는 방식도 계속해서 업데이트를 해둬 질문이 엄청다양하게 나올텐데 모든 작업에 계속해서 이렇게 작업했을때 답변이 이래 저렇게 질문했을때 답변이 이래 하면서 지적하면 어느세월에 다 얼로드 하겠어”.
   한 문장씩 고치지 않는다 — ‘공사 이름 + 시키는 끝말’ 꼴이면 끝말이 무엇이든(빼 · 제외 · 안 해 · 필요없어 · 추가 · 넣자 · 포함시켜 …) 전부터 알아듣던 말로 바꿔 같은 일을 시킨다.
   · helpCmd(q) → { say }(바꿔 말한 문장 → helpWork) · { html }(바로 답) · null(시키는 말이 아님 → 전처럼 저장된 답 · AI)
   · 묻는 말(? · 어떻게 · 왜 · 종류 · 차이 · 꼭 …)은 건드리지 않는다. 공사 이름을 딱 짚지 못하거나 모르는 낱말이 남으면 건드리지 않는다(지식 질문이 견적을 바꾸지 않게).
   · ‘도배 빼줘’ · ‘목공 다 빼’처럼 공정 이름으로 끄면 그 공정의 자재·작업비까지 함께 끈다(HELP_GRP). ‘해야 돼 · 빠졌어’는 한 번 묻는다.
   · helpSpecSay = 평수 · 방 · 욕실 · 발코니 수 / helpAskNow = 겹치는 공사(중복) · 금액이 큰 공정 · (AI 없을 때) 줄이는 법.
   시험: tools\chat_fuzz.js 의 qfuzz() — 공사 40여 개 × 끝말 40여 개를 돌려 실제로 켜지고 꺼졌는지, 묻는 말은 견적을 안 바꾸는지 본다. 새 끝말·새 유형은 거기에 더한다. */
const HELP_QW = /[?？]|어떻게|어떡|어케|뭐가|뭐야|뭔가|뭐지|뭘까|뭔지|무엇|얼마|몇|왜|언제|되나|될까|할까|해도|인가|인지|차이|종류|방법|순서|주의|기간|며칠|이유|장단점|추천|좋아|좋을|나아|나을|낫|괜찮|가능|꼭|굳이|뭐부터|어디|하면|라면|으면/;
const HELP_OFFV = "빼버려|빼주세요|빼줘요|빼줘|빼라|빼자|뺄게|뺄래|빼고해줘|빼고해|빼고|빼|제외시켜줘|제외해줘|제외해|제외|삭제해줘|삭제해|삭제|지워줘|지워|꺼줘|끄자|꺼|안할거야|안할거임|안할래|안할게|안합니다|안한다|안해요|안해|안함|안넣을거야|안넣어|안들어가|안바꿀거야|안바꿔|안바꿈|교체안함|교체안해|필요없어요|필요없어|필요없음|필요없다|없어도돼|없어도됨|그대로둘거야|그대로둘게|그대로둬|그대로둠|그대로쓸거야|그대로쓸게|그대로써|유지할게|유지|손안댈거야|손안댄다|손안대|손안댐|패스|스킵|생략해줘|생략";
const HELP_ONV = "추가해주세요|추가해줘|추가할게|추가하자|추가해|추가요|추가|넣어주세요|넣어줘|넣어야지|넣을게|넣을래|넣어라|넣자|넣어|포함시켜줘|포함시켜|포함해줘|포함해|포함|켜줘|켜|체크해줘|체크해|같이넣어줘|같이넣자|같이해줘|도같이|해주세요|해줘|할거임|할게|할래|진행해줘|진행할게|시공해줘";   // ‘하자’는 넣지 않는다 — ‘젠다이 하자’(결함)를 묻는 말과 같다
const HELP_MUSTV = "해야합니다|해야한다|해야돼|해야되|해야해|해야함|해야지|들어가야돼|들어가야해|들어가야함|넣어야돼|넣어야해|넣어야함|빠졌어|빠졌네|빠졌다|빠져있어|안들어갔어|안들어가있어";
const HELP_OFFR = new RegExp("^(.{1,22}?)(" + HELP_OFFV + ")$"), HELP_ONR = new RegExp("^(.{2,22}?)(" + HELP_ONV + ")$"), HELP_MUSTR = new RegExp("^(.{2,22}?)(" + HELP_MUSTV + ")$");
const HELP_GRP = [   // 공정 이름 → 그 공정의 줄 (자재·작업비 포함) — ‘도배 빼줘’ · ‘목공 다 빼’ · ‘주방은 손 안 대’
  [/^(도배|벽지|도배공사)$/, l => stepOfLine(l) === "s9"], [/^(장판|마루|강마루|바닥재|바닥|바닥공사)$/, l => stepOfLine(l) === "s8"], [/^(필름|필름공사|필름작업)$/, l => /^(film|sashFilm|sinkFilm|closetFilm)/.test(l.id)], [/^(페인트|도장)$/, l => /^(paint|wallPaint)$/.test(l.id)],
  [/^(목공|목작업|목공사)$/, l => stepOfLine(l) === "s4"], [/^(전기|조명|전기공사|전기조명)$/, l => stepOfLine(l) === "s5"], [/^(타일|타일공사)$/, l => /tile/i.test(l.id) || l.id === "grout"],
  [/^(주방|부엌|주방공사)$/, l => /^(sink|top|bowl|ktap|hood|cooktop|kitTile|demoKitchen|island|fridge|tall|appInst)$/.test(l.id)], [/^(철거|철거공사)$/, l => /^(demo|waste$|asbestos$)/.test(l.id)], [/^(샷시|샤시|창호|창문)$/, l => /^(window|demoSash|caulk|winLabor)$/.test(l.id)],
  [/^(문|도어|문교체|방문교체)$/, l => stepOfLine(l) === "s6" && l.id !== "jungmun" && l.id !== "lock"], [/^(가구|수납|수납가구)$/, l => stepOfLine(l) === "s11"], [/^(발코니|베란다)$/, l => /^(elastic|balPaint|balTile|balTile2|balWall|balWall2|balLight)$/.test(l.id)]];
function helpWorkHit(x) {                             // 그 말이 공사 줄을 딱 짚는가 → 줄 목록 (못 찾았거나 · 여럿이라 고를 수 없거나 · 모르는 낱말이 남으면 null)
  try { const r = helpWorkFind(String(x) + " 추가해줘"), got = r.out.filter(o => o.l); return got.length && !r.out.some(o => o.many) && !r.miss.length && !(r.left || []).length ? got.map(o => o.l) : null } catch (e) { return null } }
const helpIsSup2 = l => /(Sub|Labor|Meal)$/.test(l.id) || /^(plumbMat|woodMat|caulk|doorMeasure|doorInstall)$/.test(l.id);   // 그 단계의 공사에 딸린 줄(부자재 · 작업비 · 식대 · 실측비) — 이름이 아니라 줄 id 로 본다(‘가벽 작업비’는 공사다)
function helpSupOff(sks) { let n = 0;                 // 공사를 끈 단계에 켜진 공사가 하나도 안 남았으면 그 단계의 딸린 줄도 끈다 (‘필름 안 해’ → 필름 부자재·작업비·식대)
  for (const sk of sks) { if (!sk || R.lines.some(r => r.step === sk && !r.extra && r.lid && r.qty > 0 && (l => l && !helpIsSup2(l))(lineById(r.lid)))) continue;
    for (const l of D.stepLines[sk] || []) if (helpIsSup2(l) && lnState(l).on) { setLn(l, { on: false }); n++ } } return n }
function helpOffIds(ls, name) {                       // 줄 여러 개를 한 번에 끈다 (되돌리기 = 말하기 전으로)
  const snap = { ln: deep(E.ln || {}), skip: deep(E.skip || {}), lights: deep(E.lights || []) }, steps = STEPS(); for (const l of ls) lnSetAll(l, false); refresh();
  const more = helpSupOff(new Set(ls.map(stepOfLine))); if (more) refresh(); HELP_WK = { snap, ids: [] };
  const gi = steps.findIndex(s => s.key === stepOfLine(ls[0]));
  return `<div class="hk">‘${esc(name)}’ 쪽 공사 <b>${ls.length}줄</b>을 껐습니다.</div>` + helpRow("끈 것", esc(ls.slice(0, 7).map(l => helpCut(lineLabel(l), 12)).join(", ")) + (ls.length > 7 ? ` 외 ${ls.length - 7}줄` : "")) + (more ? helpRow("함께", `남은 공사가 없는 단계의 자재·작업비 ${more}줄도 껐습니다.`) : "")
    + `<div class="hm"><button type="button" class="lk" data-helpwk="undo">말하기 전으로 되돌리기</button>${gi >= 0 ? `<button type="button" class="lk" data-goto="${gi}">그 단계 보기</button>` : ""}</div><div class="hw">⚠ 말씀만 듣고 제가 끈 것입니다. 빠지면 안 되는 공사가 없는지 실장님이 직접 한 번 확인해 주세요.</div>`;
}
function helpCmd(q) {
  const s = String(q).trim().replace(/[.!~…]+$/, "").trim(), c = s.replace(/\s+/g, "");
  if (!D.stepLines || c.length < 3 || c.length > 30 || HELP_QW.test(c) || HELP_WINT.test(s) || /\d\s*[*xX×]\s*\d/.test(s)) return null;   // 전부터 알아듣던 말(HELP_WINT)은 그대로 둔다
  const cut = n => { let i = s.length, k = n; while (i > 0 && k > 0) { i--; if (!/\s/.test(s[i])) k-- } return s.slice(0, i).trim() };   // 끝에서 글자 n개(띄어쓰기 빼고)를 뗀 앞부분 — 띄어쓰기는 살린다
  const forms = x => { const out = [x.trim()]; let y = x.trim(); for (let k = 0; k < 2; k++) { y = y.replace(/\s*(은요|는요|은|는|도|만|을|를|이|가)$/, "").trim(); out.push(y); y = y.replace(/\s*(교체|공사|시공|작업|설치)$/, "").trim(); out.push(y) } return [...new Set(out)].filter(Boolean) };   // 조사·‘교체/공사’를 차례로 뗀 꼴들 (‘걸레받이’의 ‘이’를 조사로 떼지 않게, 떼기 전의 말부터 맞춰 본다)
  const pick = x => { for (const y of forms(x)) { const ls = helpWorkHit(y); if (ls) return { x: y, ls } } return null };
  const grp = x => { const w = x.replace(/\s+/g, "").replace(/(다|전부|전체|모두|싹|싹다|관련|쪽|은|는)+$/, ""); return HELP_GRP.find(g => g[0].test(w)) ? [w, HELP_GRP.find(g => g[0].test(w))[1]] : null };
  let m;
  // ① 종류: ‘장판 말고 강마루’ · ‘바닥 강마루로 해줘’ · ‘도배 합지로’
  const alt = (a, b) => { const nb = kbNorm(b).replace(/^(\d+)t$/, "$1mm"); if (nb.length < 2) return false; const ls = helpWorkHit(a) || helpWorkHit(b) || []; return ls.some(l => l.items.length > 1 && (al => al.some(x => x.includes(nb)) && !al.every(x => x.includes(nb)))(l.items.map(it => kbNorm(aliasOf(it))))) };
  { const tk = s.split(/\s+/); if (tk.length > 1 && /^(해주세요|해줘|해|할게|하자|갈게|가자|교체해줘|교체|변경해줘|변경|바꿔줘|바꿔)$/.test(tk[tk.length - 1])) tk.pop();
    const mi = tk.findIndex(w => /말고$/.test(w)), last = tk[tk.length - 1] || "";
    if (mi >= 0 && mi < tk.length - 1) { const a = tk.slice(0, mi + 1).join(" ").replace(/\s*(은|는|을|를)?\s*말고$/, "").replace(/(은|는|을|를)$/, ""), b = tk.slice(mi + 1).join(" ").replace(/(으로|로)$/, ""); if (a.length >= 2 && b.length >= 2 && alt(a, b)) return { say: `${a} ${b}로 바꿔줘` } }
    else if (tk.length >= 2 && tk.length <= 4 && /(으로|로)$/.test(last)) { const a = tk.slice(0, -1).join(" ").replace(/(은|는|을|를)$/, ""), b = last.replace(/(으로|로)$/, ""); if (a.length >= 2 && b.length >= 2 && alt(a, b)) return { say: `${a} ${b}로 바꿔줘` } } }
  // ② 수량: ‘매입등 10개’ · ‘걸레받이 40개로’ · ‘콘센트 2개 더 추가’
  if ((m = c.match(/^(.{2,16}?)(?:수량|갯수|개수)?(?:은|는|을|를)?(\d+(?:\.\d+)?)(개|구|등|군데|곳|면|칸|조|세트|대|짝|장|박스|롤|자|평)(더)?(?:으로|로)?(추가해줘|추가|넣어줘|넣어|달아줘|달아|설치해줘|설치|해주세요|해줘|해|바꿔줘|바꿔|변경해줘|변경|맞춰줘|맞춰|수정해줘|수정|할게)?$/))) {
    const pk = pick(cut(c.length - m[1].length)), x = pk ? pk.x : "", l = pk && pk.ls.length === 1 ? pk.ls[0] : null, n = +m[2], add = !!m[4] || /^(추가|넣어|달아|설치)/.test(m[5] || "");
    if (l && (m[3] !== "평" || l.pyq || l.pyf)) { if (l.id === "down") return { say: `${x} ${n}${m[3]} 추가해줘` };
      const rl = R.lines.find(r => r.lid === l.id), cur = rl && lnState(l).on ? +rl.qty || 0 : 0; return { say: `${x} ${add && cur > 0 ? cur + n : n}${m[3]}로 바꿔줘` } } }
  // ③ 빼기
  if ((m = c.match(HELP_OFFR))) { const x0 = cut(m[2].length), x = forms(x0).pop() || ""; if (x && !/넣|추가|포함|만$/.test(x0)) {
      if (/^(욕실|화장실)(다|전부|전체|모두)?$/.test(x.replace(/\s+/g, ""))) { const bs = bathList(); if (bs.length) return { html: '<div class="hk">어느 욕실을 공사하지 않을까요?</div><div class="hm">' + bs.map(b => `<button type="button" class="lk" data-bathmode="${b.id}|none">${esc(b.name)}</button>`).join("") + (bs.length > 1 ? '<button type="button" class="lk" data-bathmode="*|none">모두</button>' : "") + "</div>" } }
      { const parts = x0.split(/\s*,\s*|\s+(?:및|그리고)\s+|(?<=[가-힣])(?:이랑|랑|하고)\s+/).map(y => y.trim()).filter(Boolean), gs = parts.map(y => forms(y).map(grp).find(Boolean));   // ‘도배랑 장판 빼줘’ — 공정 이름 여럿
        if (parts.length > 1 && gs.every(Boolean)) { const ls = Object.values(D.stepLines).flat().filter(l => !l.gone && !l.dead && lnState(l).on && gs.some(g => g[1](l))); return { html: ls.length ? helpOffIds(ls, gs.map(g => g[0]).join(" · ")) : `<div class="hk">‘${esc(gs.map(g => g[0]).join(" · "))}’ 쪽은 지금 켜진 공사가 없습니다.</div>` } } }
      const g = forms(x0).map(grp).find(Boolean); if (g) { const ls = Object.values(D.stepLines).flat().filter(l => !l.gone && !l.dead && lnState(l).on && g[1](l)); return { html: ls.length ? helpOffIds(ls, g[0]) : `<div class="hk">‘${esc(g[0])}’ 쪽은 지금 켜진 공사가 없습니다.</div>` } }
      const pk = pick(x0); if (pk) return { say: `${pk.x} 안 할 거야` } } }
  // ④ ‘해야 돼 · 빠졌어’ — 한 번 묻는다
  if ((m = c.match(HELP_MUSTR))) { const x0 = cut(m[2].length), pk = x0 && !/빼|제외|말고|없이|안\s*(해|할)/.test(x0) ? pick(x0) : null, x = pk ? pk.x : "", ls = pk ? pk.ls : null;
    if (ls) { const off = ls.filter(l => !lnState(l).on), nm = ls.map(l => helpCut(lineLabel(l), 14)).join(" · "), gi = STEPS().findIndex(y => y.key === stepOfLine(ls[0]));
      return { html: off.length ? `<div class="hk">‘${esc(nm)}’ 공사를 견적에 넣을까요?</div><div class="hm"><button type="button" data-helpsay="${esc(x)} 추가해줘">넣기</button><button type="button" class="lk" data-helpsay="${esc(x)} 시공이 어떻게 되는거야?">설명 보기</button></div>` : `<div class="hk">‘${esc(nm)}’은(는) 이미 견적에 들어 있습니다.</div><div class="hm">${gi >= 0 ? `<button type="button" class="lk" data-goto="${gi}">그 단계 보기</button>` : ""}</div>` } } }
  // ⑤ 넣기
  if ((m = c.match(HELP_ONR))) { const x0 = cut(m[2].length), pk = x0 && !/빼|제외|말고|없이|안\s*(해|할)/.test(x0) ? pick(x0) : null; if (pk) return { say: `${pk.x} 추가해줘` } }
  return null;
}
const HELP_NUMK = { 한: 1, 하나: 1, 두: 2, 둘: 2, 세: 3, 셋: 3, 네: 4, 넷: 4, 다섯: 5 };
function helpSpecSay(q) {                             // ‘평수 28평으로 바꿔줘’ · ‘방 4개로’ · ‘욕실 하나야’ · ‘방3 욕실2’ — 현장 정보의 평형 · 방 · 욕실 · 발코니 수를 말로 바꾼다
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length < 3 || qs.length > 28 || HELP_QW.test(qs) || /[*xX×]/.test(qs)) return null;
  const V = "바꿔주세요|바꿔줘|바꿔|변경해줘|변경해|변경|수정해줘|수정해|수정|고쳐줘|고쳐|해줘|해|맞춰줘|맞춰", set = {}; let m;
  if ((m = qs.match(new RegExp("^(?:평수|평형|공급평형)(?:는|은|를|을)?(\\d{2,3})(?:평형|평)?(?:으로|로|이야|야)?(?:" + V + ")?$"))) || (m = qs.match(new RegExp("^(\\d{2,3})(?:평형|평)(?:으로|로)(?:" + V + ")$"))) || (m = qs.match(new RegExp("^\\d{2,3}(?:평형|평)(?:말고|아니고|아니라|에서)(\\d{2,3})(?:평형|평)?(?:으로|로|이야|야)?(?:" + V + ")?$")))) set.py = +m[1];
  else { const rest = qs.replace(/(발코니|베란다)(?:가|는|은)?없(?:어요|어|음|다|습니다)/g, () => { set.balconies = 0; return "" }).replace(/(방|욕실|화장실|발코니|베란다)(?:은|는|이|가|을|를|수|개수)?(\d|하나|한|둘|두|셋|세|넷|네|다섯)(?:개|칸|곳)?/g, (all, k, n) => { set[k === "방" ? "rooms" : /욕실|화장실/.test(k) ? "baths" : "balconies"] = /^\d$/.test(n) ? +n : HELP_NUMK[n]; return "" });
    if (!Object.keys(set).length || rest.replace(new RegExp("으로|로|이야|야|임|입니다|이에요|예요|짜리|구조|집|,|그리고|이고|고|" + V, "g"), "") !== "") return null }
  const LIM = { py: [15, 65, "평형", "평"], rooms: [1, 5, "방", "개"], baths: [1, 3, "욕실", "칸"], balconies: [0, 3, "발코니", "개"] }, done = [], bad = [];
  for (const k in set) { const [lo, hi, nm, u] = LIM[k], v = set[k]; if (!(v >= lo && v <= hi)) { bad.push(`${nm}은(는) ${lo}~${hi}${u} 사이로 고를 수 있습니다.`); continue } if ((+E[k] || 0) === v) { done.push(`${nm}은(는) 이미 ${v}${u}입니다.`); continue }
    done.push(`${nm} ${+E[k] || 0}${u} → <b>${v}${u}</b>`); E[k] = v; if (k === "py") E.excl = ""; set._ch = true }
  if (!set._ch) return `<div class="hk">${[...done, ...bad].join(" ")}</div>`;
  refresh(true);
  return `<div class="hk">${done.join(" · ")}(으)로 바꿨습니다. 수량과 금액을 다시 계산했습니다.</div>` + (bad.length ? helpRow("안 바꾼 것", esc(bad.join(" "))) : "") + helpRow("그대로인 것", "직접 넣어 둔 치수 · 수량 · 평수는 그대로입니다. ‘현장 정보’에서 한 번 확인해 주세요.")
    + '<div class="hm"><button type="button" class="lk" data-undo>되돌리기</button><button type="button" class="lk" data-goto="0">현장 정보 보기</button></div><div class="hw">⚠ 말씀만 듣고 제가 바꾼 것입니다. 평형 · 방 · 욕실 수는 실장님이 직접 한 번 확인해 주세요.</div>';
}
const HELP_DUPS = [   // [이 줄이 켜져 있고, 이 줄도 켜져 있으면, 알릴 말] — 같은 곳에 두 가지가 겹칠 수 있는 짝
  [["doorSet"], ["filmDoor"], "방문을 새로 바꾸는데 ‘문·문틀 필름’도 들어 있습니다. 새 문·문틀에는 보통 필름을 하지 않습니다 (문틀은 살리고 필름만 하는 곳이 있으면 그대로)."],
  [["bathDoorSet"], ["filmBath"], "욕실문을 새로 바꾸는데 ‘욕실문·문틀 필름’도 들어 있습니다."],
  [["doorSet"], ["roomLeaf", "roomFrame", "doorLeaf", "hinge", "handle"], "‘방문 교체’(문짝·문틀·경첩 포함)와 낱개 문짝·문틀·경첩·손잡이가 같이 들어 있습니다."],
  [["bathDoorSet"], ["bathLeaf", "bathFrame"], "‘욕실문 교체’(문짝·문틀 포함)와 낱개 욕실 문짝·문틀이 같이 들어 있습니다."],
  [["ceilMold", "baseMold"], ["filmMold"], "몰딩·걸레받이를 새로 하는데 ‘몰딩·걸레받이 필름’도 들어 있습니다."],
  [["window"], ["sashFilm"], "창문(샷시)을 교체하는데 ‘창호 필름’도 들어 있습니다."],
  [["sink"], ["sinkFilm"], "싱크대를 새로 하는데 ‘싱크·가구 필름 리폼’도 들어 있습니다."],
  [["closet", "shoe"], ["closetFilm"], "붙박이장·신발장을 새로 하는데 ‘붙박이장·신발장 필름’도 들어 있습니다."],
  [["jungmun"], ["filmEntry"], "중문을 새로 하는데 ‘현관문·중문틀 필름’도 들어 있습니다 (현관문만 필름이면 그대로)."],
  [["paper"], ["wallPaint"], "벽지(도배)와 ‘벽면 도장(페인트)’이 같이 들어 있습니다. 같은 벽이면 한 가지만 합니다."],
  [["elastic"], ["balPaint"], "발코니 탄성코트와 발코니 페인트가 같이 들어 있습니다. 같은 벽이면 한 가지만 합니다."],
  [["shower"], ["slidebar"], "샤워 수전(슬라이드바 포함)과 ‘샤워기 거치대(슬라이드바)’가 같이 들어 있습니다."],
  [["turning"], ["turning2"], "터닝도어가 ‘창문·확장’ 단계와 ‘문·중문’ 단계에 둘 다 들어 있습니다."]];
function helpDupSay() {                               // ‘이 견적서에서 중복으로 들어간 부분이 있을까?’(2026-11-21 실장이 실제로 물은 말) — 같은 이름이 두 번 · 같은 곳에 겹치는 짝
  const steps = STEPS(), on = new Set(R.lines.filter(l => l.lid && l.qty > 0).map(l => l.lid)), rows = [], lab = id => { const l = lineById(id); return l ? helpCut(lineLabel(l), 14) : id };
  for (const [as, bs, msg] of HELP_DUPS) { const a = as.filter(x => on.has(x)), b = bs.filter(x => on.has(x)); if (a.length && b.length) rows.push({ t: msg, id: b[0], offs: b }) }
  const seen = new Map(); for (const l of R.lines) if (l.qty > 0) { const k = kbNorm(custName(String(l.name || "")).replace(/\(.*?\)/g, "")) + "|" + (l.spaceName || ""); if (k.length > 3) (seen.get(k) || seen.set(k, []).get(k)).push(l) }
  for (const ls of seen.values()) if (ls.length > 1 && ls.some(l => l.extra)) rows.push({ t: `‘${custName(String(ls[0].name))}’이(가) ${ls.length}번 들어 있습니다 (직접 넣은 줄 · 추가 품목 포함).`, sk: (ls.find(l => !l.extra) || ls[0]).step, id: (ls.find(l => l.lid) || {}).lid });
  const row = r => { const sk = r.sk || (r.id && stepOfLine(lineById(r.id) || {})), gi = steps.findIndex(s => s.key === sk);
    return `<div class="hl"><i>⚠</i><span>${esc(r.t)}${gi >= 0 ? ` <button type="button" class="lk" data-goto="${gi}"${r.id ? atAttr({ at: { lid: r.id, say: "겹치는지 확인해 주세요. 필요 없으면 체크를 끄세요." } }) : ""}>가서 보기</button>` : ""}${(r.offs || []).slice(0, 2).map(id => ` <button type="button" class="lk" data-helpline="${esc(id)}|0">‘${esc(lab(id))}’ 끄기</button>`).join("")}</span></div>` };
  return `<div class="hk">${rows.length ? `겹칠 수 있는 곳이 <b>${rows.length}건</b> 있습니다. 같은 곳에 둘 다 하는지 확인해 주세요.` : "겹쳐 들어간 공사는 찾지 못했습니다."}</div>` + rows.slice(0, 6).map(row).join("")
    + helpRow("본 것", "같은 이름이 두 번 들어간 줄 · 새로 바꾸는데 필름도 든 곳(문 · 몰딩 · 샷시 · 싱크대 · 붙박이장) · 도배와 페인트 · 세트와 낱개") + '<div class="hm"><button type="button" class="lk" data-helpsay="뭐 안 했지?">빠진 것도 확인</button></div>';
}
function helpTopSay(cut) {                            // ‘제일 비싼 공정이 뭐야’ · (AI 없을 때) ‘어디를 줄이면 돼’ — 순서만 말한다(금액은 견적 합계 칸)
  const ps = PROCS.filter(p => R.byProc[p] && R.byProc[p].amt > 0).sort((a, b) => R.byProc[b].amt - R.byProc[a].amt); if (!ps.length) return '<div class="hk">아직 켜진 공사가 없습니다. 공사를 체크하면 공정별 금액이 오른쪽 ‘견적 합계’ 칸에 나옵니다.</div>';
  const steps = STEPS(), gi = p => steps.findIndex(s => (s.procs || []).includes(p));
  return `<div class="hk">${cut ? "금액이 큰 공정부터 보는 것이 빠릅니다." : "지금 견적에서 금액이 큰 공정 순서입니다."} <small>(금액은 오른쪽 ‘견적 합계’ 칸)</small></div>`
    + ps.slice(0, 5).map((p, i) => `<div class="hl"><b>${i + 1}</b><span>${esc(PROC_LABEL[p])}${gi(p) >= 0 ? ` <button type="button" class="lk" data-goto="${gi(p)}">그 단계 보기</button>` : ""}</span></div>`).join("")
    + (cut ? helpRow("줄이는 방법", "① 그 공정에서 종류(등급)를 낮춥니다 ② 범위를 줄입니다 (욕실 덧방 · 문은 교체 대신 필름 · 방 일부 제외) ③ 공사 줄의 ‘비교견적’ 단추로 종류별 차액을 먼저 봅니다") : "")
    + '<div class="hm"><button type="button" class="lk" data-helpsay="중복된 거 있어?">겹치는 공사 찾기</button><button type="button" class="lk" data-helpsay="뭐 안 했지?">덜 된 것 확인</button></div>';
}
const HELP_DUPQ = /중복|겹치|겹친|겹쳐|겹침|이중으로|두번들어|2번들어|두번씩|똑같은(거|게|것)|같은(거|게|것)(이|가)?(또|두번)/, HELP_TOPQ = /(제일|가장|젤)(비싼|큰|많이(드는|나오는|들어가는|나온|들어간|차지)|돈많이|금액(이)?(큰|많))|어느(공정|공사)(이|가)?(제일|가장|젤)|(공정|공사)별(비중|순위|금액순)|돈(이)?(어디|제일많이|가장많이)|어디(에|서)(돈|금액)(이)?(제일|가장|많이)/, HELP_CUTQ = /(줄이|줄일|줄여|낮추|낮출|낮춰|아끼|아낄|절감|깎)/;
function helpAskNow(q) {                              // 지금 견적을 놓고 묻는 말: 겹치는 공사 · 금액이 큰 공정 · (AI 없을 때) 줄이는 법
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (!D.stepLines || qs.length < 3 || qs.length > 34 || /\d\s*[*xX×]\s*\d/.test(q)) return null;
  if (HELP_DUPQ.test(qs) && /견적|들어간|들어갔|들어가있|넣은|넣었|공사|항목|부분|거|게|것|체크|있어|있나|있을까|있니|확인|봐줘|찾아|없나|없어/.test(qs.replace(HELP_DUPQ, "")) && !/시공|붙이|붙여|깔|바르|칠|이음|조인트|이중(창|샷시|주차|천장|바닥|유리)|방수|벽지|도배지|타일|장판|필름지|하자|어떻게|왜/.test(qs)) return helpDupSay();
  if (HELP_TOPQ.test(qs) && !/자재|브랜드|제품|타일|벽지|장판|마루|도기|수전|등급/.test(qs)) return helpTopSay(false);
  if (!KB_AI && HELP_CUTQ.test(qs) && /견적|금액|가격|비용|총액|합계|공사비|돈|예산|어디|어느|뭘|뭐를|무엇/.test(qs) && !KB_TRADE.some(x => x[1].test(q)) && !/치수|수량|로스|인원|기간|공기/.test(qs)) return helpTopSay(true);
  return null;
}
/* ───── (v93) ‘어디서 작성해 · 어디서 바꿔 · 바꾸려면 어떻게’ — 프로그램에서 하는 곳을 묻는 말 ─────
   사용자(2026-11-22, “공사기간은 어디서 작성할 수 있어?”에 평형별 공사 기간 설명이 나온 화면을 보내며): “어디서 작성할 수 있는지 물어봤는데 제대로 답변이 안와 다른 질문도 마찬가지일거아냐
   도배 어디서 작성해 · 장판 2.2t로 바꾸고 싶은데 어떻게 이런거 처럼 지금 질문에 대한 답변이 너무 별로야 고친 뒤 여러 번 다시 확인하고 작업해”.
   ‘어디서/어디에 + 작성·적·입력·바꾸·고치…’ · ‘~하려면 · ~하고 싶은데 · 어떻게 바꿔’는 지식을 묻는 말이 아니라 **화면의 어느 칸인지**를 묻는 말이다 → ① 어디인지 한 줄 ② 하는 법 ③ 그 칸으로 가는 단추(되는 일은 ‘지금 하기’ 단추).
   순서: 칸(HELP_SPOTS: 공사 기간 · 유효기간 · 구분 · 메모 · 고객명 · 주소 · 평형 · 방 수 · 방 크기 · 층 · 기업이윤 · 도면 · 공사 범위 · 원가) → 종류를 짚은 말(‘장판 2.2t로 바꾸고 싶은데’) → 공사 줄 → 공정(단계) → 수량·단가·항목 추가 → 프로그램 사용법 답.
   시공 위치를 묻는 말(‘타일 어디에 붙여’ · ‘방수 어디까지 해’ · ‘어디서 사’)은 건드리지 않는다. 묶음 시험: tools\chat_fuzz.js 의 where · how · wkeep 묶음. */
const HELP_SPOTS = [   // [묻는 말(띄어쓰기 없이), 핵심 한 줄, 하는 법, 가는 곳(0 = 현장 정보 · "doc" = 상세견적서 · "sum" = 견적 합계 칸 · null = 단추 없음), 짚을 자리]
  [/유효기간|견적유효/, "견적 유효기간은 <b>‘② 상세견적서’ 화면 맨 위 ‘견적 유효기간’ 칸</b>에서 바꿉니다.", "기본은 견적일에서 한 달입니다. 날짜를 눌러 바꾸고 ‘↺ 한 달로’로 되돌립니다.", "doc", { doc: "dur", say: "‘견적 유효기간’ 날짜를 바꿉니다." }],
  [/공사기간|공사일정|예상기간|공사며칠|^기간|기간(은|을|이|도)?(어디|어떻게|적는|정하는|입력|작성|설정)/, "공사 기간은 <b>‘② 상세견적서’ 화면 맨 위 ‘예상 공사 기간’ 칸</b>에서 정합니다.", "추천(자동 계산) · 2~12주 · 직접 입력 가운데 고릅니다. 고른 기간이 견적서 첫 장 ‘예상 공사 기간’에 나갑니다.", "doc", { doc: "dur", say: "‘예상 공사 기간’에서 기간을 고릅니다." }],
  [/견적서?구분|가견적|확정견적|변경견적|견적종류/, "견적서 구분(견적서 · 가견적 · 확정 견적 · 변경 견적)은 <b>‘② 상세견적서’ 화면 맨 위 ‘견적서 구분’</b>에서 고릅니다.", "고른 것이 견적서 오른쪽 위에 나갑니다. ‘가견적’을 고를 때만 ‘확정 금액이 아닙니다’ 안내가 들어갑니다. ‘현장 정보’의 ‘구분’ 칸과 같은 값입니다.", "doc", { doc: "dur", say: "‘견적서 구분’을 고릅니다." }],
  [/메모|특기사항|특이사항/, "견적서 메모는 <b>‘② 상세견적서’ 화면 맨 아래 ‘견적서 메모’ 칸</b>에 적습니다.", "적는 대로 견적서 마지막 장 ‘특기사항’의 메모에 나갑니다. 이 칸 자체는 인쇄되지 않습니다.", "doc", { doc: "memo", say: "여기에 메모를 적습니다." }],
  [/동호수|상세주소|몇동|몇호/, "동·호수는 <b>‘현장 정보’ 맨 위 ‘고객·현장’의 ‘동·호수 (상세 주소)’ 칸</b>에 적습니다.", "", 0, { sel: '#info [data-info="addr2"]', up: ".f", say: "동·호수를 적습니다." }],
  [/현장주소|고객주소|공사주소|단지명|아파트이름|아파트명|^주소|주소(는|를|은|도)?(어디서|어디에|어디다)(넣|적|입력|작성|쓰|써|바꾸|바꿔|수정|고치)/, "현장 주소는 <b>‘현장 정보’ 맨 위 ‘고객·현장’의 ‘현장 주소’ 칸</b>에 적습니다.", "‘주소 검색’을 누르거나 직접 적습니다. 동·호수는 바로 아래 칸입니다.", 0, { sel: '#info [data-info="addr"]', up: ".f", say: "현장 주소를 적습니다." }],
  [/고객(명|이름|성함|정보)|손님이름|의뢰인|^고객(은|을|도)?어디/, "고객명은 <b>‘현장 정보’ 맨 위 ‘고객·현장’의 ‘고객명’ 칸</b>에 적습니다.", "견적서 첫 장과 파일 이름에 나갑니다.", 0, { sel: '#info [data-info="client"]', up: ".f", say: "고객명을 적습니다." }],
  [/담당실장|담당자|담당|실장이름|내이름/, "담당 실장 이름은 <b>‘현장 정보’ 맨 위 ‘고객·현장’의 ‘담당 실장’ 칸</b>에 적습니다.", "견적서 첫 장에 나갑니다.", 0, { sel: '#info [data-info="manager"]', up: ".f", say: "담당 실장 이름을 적습니다." }],
  [/견적일|견적날짜|견적작성일|작성일|작성날짜/, "견적일은 <b>‘현장 정보’ 맨 위 ‘고객·현장’의 ‘견적일’ 칸</b>에서 바꿉니다.", "견적서 오른쪽 위에 나가고, 견적 유효기간(한 달)의 기준이 됩니다.", 0, { sel: '#info [data-info="date"]', up: ".f", say: "견적일을 바꿉니다." }],
  [/방크기|방치수|거실크기|거실치수|주방크기|방사이즈|가로세로|방넓이/, "방 크기는 <b>‘현장 정보’의 도면 아래 ‘방 크기’ 칸</b>에 넣습니다.", "거실 · 주방 · 방마다 가로 × 세로(mm)를 넣습니다. 도면에서 ‘방 크기 바꾸기’를 누르고 방을 눌러도 됩니다. 비워 두면 평형으로 자동 계산합니다.", 0, { sel: "#roomDimBox", say: "방마다 가로 × 세로(mm)를 넣습니다." }],
  [/(방|욕실|화장실|발코니|베란다)(개수|갯수|숫자|몇개|몇칸)|방몇|욕실몇|화장실몇|드레스룸/, "방 · 욕실 · 발코니 수는 <b>‘현장 정보’ › ‘공간’의 숫자 단추</b>로 바꿉니다.", "단추를 누르면 도면과 수량이 다시 계산됩니다. 여기서 “방 4개로 바꿔줘” · “욕실 하나야”라고 하셔도 됩니다.", 0, { sel: '#stepBody [data-seg="rooms"]', up: ".f", say: "방 · 욕실 · 발코니 수를 누릅니다." }],
  [/평수|평형|몇평/, "평형은 <b>‘현장 정보’ › ‘공간’의 ‘공급 평형’ 칸</b>에서 바꿉니다.", "평형을 고르면 수량과 금액이 다시 계산됩니다. 여기서 “평수 28평으로 바꿔줘”라고 하셔도 됩니다.", 0, { sel: '#stepBody [data-e="py"]', up: ".f", say: "평형을 고릅니다." }],
  [/층수|몇층|현장층|아파트층/, "층수는 <b>‘현장 정보’ › ‘공간’의 ‘층’ 칸</b>에 넣습니다.", "사다리차 금액이 이 층수로 계산됩니다.", 0, { sel: '#stepBody [data-e="level"]', up: ".f", say: "층수를 넣습니다." }],
  [/기업이윤|이윤/, "기업이윤(%)은 <b>‘현장 정보’ › ‘공간’ 아래 ‘기업이윤’ 칸</b>에서 바꿉니다.", "공정 합계에 이 비율을 더합니다. 고객 견적서에는 비율이 나가지 않고 금액만 나갑니다.", 0, { sel: '#stepBody [data-e="biz"]', up: ".f", say: "기업이윤 비율(%)을 바꿉니다." }],
  [/공사범위|공사유형|공사종류|전체리모델링|기본리모델링|올수리/, "공사 범위는 <b>‘현장 정보’ 아래쪽 ‘공사 범위’ 단추</b>에서 고릅니다.", "전체 리모델링 · 기본 리모델링 · 도배·바닥만 · 욕실만 · 주방만 · 직접 선택 가운데 고르면 그 범위의 공사가 한 번에 체크됩니다.", 0, { sel: "#presets", say: "공사 범위를 고릅니다." }],
  [/원가|차액|마진|이득|실공사비/, "원가는 <b>오른쪽 ‘견적 합계’ 칸의 공정 줄마다 있는 ‘원가’ 칸</b>에서 고칩니다.", "칸을 눌러 실제 들어갈 금액을 적습니다(견적 금액은 그대로). 총 합계 아래에 원가 합계 · 견적 금액 · 차액 · 마진이 나옵니다. 고객 견적서에는 나가지 않습니다.", "sum", { sel: "#summary [data-costov]", up: ".srow", say: "공정마다 ‘원가’ 칸을 눌러 고칩니다." }],
  [/도면|평면도/, "도면은 <b>‘현장 정보’의 ‘도면’ 칸</b>에 있습니다.", "도면 그림을 올리거나, 방 수에 맞춰 그려진 기본 도면에서 ‘방 크기 바꾸기’ · ‘위치·가구 표시’ · ‘선 표시’를 씁니다.", 0, { h: "도면", say: "도면은 여기서 올리고 고칩니다." }]];
const HELP_SPOTS2 = [   // 공사 줄 · 공정을 못 짚었을 때만 쓰는 넓은 말
  [/추가품목|직접입력|직접넣|목록에없|없는항목|없는공사|항목추가|품목추가|항목/, "목록에 없는 항목은 <b>각 단계의 묶음 카드를 펼친 맨 아래 ‘＋ 항목 추가’</b>로 넣습니다.", "자주 넣는 작업 · 단가표 품목 · ‘+ 직접 입력’ 가운데 고릅니다. 어느 묶음에도 맞지 않으면 그 단계 맨 아래 ‘묶음에 없는 항목 추가’를 씁니다.", null, null],
  [/수량|개수|갯수/, "수량은 <b>그 공사가 있는 단계에서 묶음 카드를 펼치면 줄마다 있는 ‘수량’ 칸</b>에서 고칩니다.", "고치면 금액이 바로 바뀌고 ↺ 로 자동 계산으로 돌립니다. 여기서 “걸레받이 40개로” · “매입등 10개”처럼 말해도 됩니다.", null, null],
  [/단가|가격표/, "기본 단가는 <b>관리자만</b> 바꿉니다.", "‘단가 미정’으로 나오는 품목은 그 줄의 금액 칸에 그 견적에만 쓸 금액을 넣을 수 있습니다. 단가표를 고쳐야 하면 관리자에게 요청하세요.", null, null]];
const HELP_STEPHOW = { s9: "‘벽지 교체’ 묶음 맨 위에서 <b>도배 평수와 벽지 종류</b>만 정하면 부자재 · 작업비 · 식대는 자동으로 들어갑니다.", s8: "‘바닥재 깔기’ 묶음 맨 위에서 <b>평수와 바닥재 종류</b>(장판 두께 · 강마루 등)를 정하면 부자재 · 작업비는 자동으로 들어갑니다.", s7: "욕실마다 벽 · 바닥 타일 줄이 따로 있고 줄 아래에 치수 칸이 있습니다. 도기 · 수전 · 천장도 이 단계입니다.", s4: "작업마다 카드(몰딩 · 평천장 · 가벽 …)가 있고, 카드 맨 위에 치수를 넣으면 석고보드 · 각재가 계산됩니다.", s1: "‘철거’ 묶음에서 철거할 곳을 체크하고, 사다리차는 층수와 시간을 고릅니다.", s5: "조명은 기본 조명등 · 매입등 · 라인조명 묶음으로 나뉘고, 매입등은 곳마다 개수를 넣습니다.", s11: "싱크대 · 붙박이장처럼 길이로 세는 가구는 줄을 체크하면 줄 아래 ‘+ 치수로 넣기’가 나옵니다." };
const HELP_PVERB = "작성|(?<!견)적|써|쓰|입력|기입|기재|올리|올려|그리|그려|수정|바꾸|바꿔|변경|고치|고쳐|설정|정하|정해|고르|골라|선택|체크|넣|추가|빼|삭제|지우|확인|보|봐|볼|찾|하|해|할";
const HELP_SPOTW = new RegExp("(어디서|어디에서|어디에다|어디에|어디(?!로|까지|부터)|어느칸|어느화면|어느단계|어느메뉴|어느탭|어느곳)[가-힣]{0,3}?(" + HELP_PVERB + ")|어딨|어디(야|예요|에요|지|임|있|인가|인지|죠|냐)|어디$|(적는|쓰는|넣는|입력하는|작성하는|고르는|바꾸는|고치는|정하는|수정하는|설정하는|보는|확인하는)(곳|칸|데|위치|화면|메뉴)");
const HELP_SPOTH = /(작성|(?<!견)적|입력|기입|넣|추가|수정|바꾸|바꿔|변경|고치|고쳐|설정|정하|빼|삭제|지우|체크|고르|선택|교체)[가-힣]{0,2}(고싶|려면|으려면|는법|는방법|고자|야하는데|야되는데|야돼는데|려는데|려고하는데|려고해|을려면|을려고|으려고)|어떻게(해서)?[가-힣]{0,3}(작성|(?<!견)적|입력|추가|수정|바꾸|바꿔|변경|고치|고쳐|설정|정하|빼|삭제|지우|체크|고르|선택)|(작성|입력|수정|변경|설정|추가|삭제)(은|는|을|를)?어떻게/;
const HELP_SPOTNO = /시공|붙이|붙여|붙일|깔아|깔고|깔때|깔면|바르|발라|칠하|칠해|쏘|쏴|자르|잘라|뚫|새는|새요|새나|샌|누수|하자|주의|순서|며칠|몇일|얼마|가격|비용|왜|이유|차이|장단점|추천|구매|구입|사야|사는|사요|사나|살수|파는|주문|발주|버리|버려|폐기|높이|간격|규격|어디까지|어디부터|보증|양생|건조|납기|배송|설치해|설치하|달아|다는|써야|쓰는거|쓰나요|쓰이|사용하|들어가는(거|게|것)|필요해|필요한/;   // 시공 · 구매를 묻는 말(지식)
const HELP_SPOTOLD = /덧방|도기.{0,3}만|비교견적|옵션|저장|인쇄|프린트|출력|pdf|엑셀|내보내|버전|새견적|새로운견적|임시저장|불러|이어쓰|로그인|비밀번호|아이디|로그아웃|전용주소|바로가기|챗봇|치수|타일붙일|박스|(도배|벽지|장판|마루|바닥)평수|평수.{0,3}(도배|벽지|장판|마루|바닥)|위치메모|위치표시|가구표시|선표시|보조주방|다용도실|세탁실|팬트리|알파룸|창고|실외기|테라스|추가공간|사다리|견적서(는|은|를|을)?(어디|어떻게)|금액|합계|총액/i;   // 전부터 맞게 답하던 것은 그 길로 둔다
function helpAltHit(a, b) {                           // ‘장판’ + ‘2.2t’ → 그 줄에서 그 이름의 종류 { l, i } (없으면 null)
  const nb = kbNorm(String(b).replace(/(\d)\.(\d)/g, "$1$2")).replace(/^(\d+)t$/, "$1mm"); if (nb.length < 2) return null;
  const ls = (a && helpWorkHit(a)) || helpWorkHit(b) || [];
  for (const l of ls) { if (l.items.length < 2) continue; const al = l.items.map(it => kbNorm(aliasOf(it))), hit = al.map((x, i) => x.includes(nb) ? i : -1).filter(i => i >= 0); if (hit.length && hit.length < al.length) return { l, i: hit[0], n: hit.length } }
  return null;
}
function helpSpotLoc(l) { const steps = STEPS(), sk = stepOfLine(l), i = steps.findIndex(s => s.key === sk), c = ((D.cats || {})[sk] || []).find(c => c.lines.includes(l.id)); return { i, sk, c, txt: i >= 0 ? `${i}단계 ‘${steps[i].label}’${c ? ` › ‘${c.label}’ 묶음` : ""}` : "" } }
function helpSpotSay(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (!D.stepLines || qs.length < 4 || qs.length > 34 || /\d\s*[*xX×]\s*\d/.test(q)) return null;
  const where = HELP_SPOTW.test(qs), how = HELP_SPOTH.test(qs); if (!where && !how) return null;
  if (HELP_SPOTNO.test(qs) || HELP_SPOTOLD.test(qs) || /\d+평|평대|평형대/.test(qs)) return null;   // ‘40평대 조명 어떻게 넣어’ = 추천을 묻는 말
  const steps = STEPS(), go = (g, at, lab) => g === null || g === undefined ? "" : `<button type="button" data-goto="${g === "doc" ? steps.length - 1 : g === "sum" ? E.step : g}"${at ? atAttr({ at }) : ""}>${lab || "그 칸으로 가기"}</button>`;
  const spot = S => { for (const [re, hk, howTo, g, at] of S) if (re.test(qs)) return `<div class="hk">${hk}</div>` + (howTo ? helpRow("하는 법", howTo) : "") + (g !== null ? `<div class="hm">${go(g, at)}</div>` : ""); return null };
  // 말에서 ‘무엇을’만 남긴다: 어디·어떻게부터 뒤 · 끝의 하려는 말 · 조사
  let head = String(q).trim().replace(/[?？!.~]+$/, "").replace(/\s*(은|는|을|를|이|가|도)?\s*(어디서|어디에서|어디에다|어디에|어디로|어디|어딨|어느\s*(칸|화면|단계|메뉴|탭|곳)|어떻게).*$/, "").replace(/\s*(적는|쓰는|넣는|입력하는|작성하는|고르는|바꾸는|고치는|정하는|수정하는|설정하는|보는|확인하는)\s*(곳|칸|데|위치|화면|메뉴).*$/, "");
  const actM = qs.match(/(빼|삭제|지우)/) ? "off" : qs.match(/(넣|추가|체크)/) ? "on" : qs.match(/(바꾸|바꿔|변경|수정|고치|고쳐|교체|고르|골라|선택)/) ? "chg" : "";
  head = head.replace(/\s*(을|를|은|는|이|가|도)?\s*(작성|적|입력|기입|넣|추가|수정|바꾸|바꿔|변경|고치|고쳐|설정|정하|빼|삭제|지우|체크|고르|선택|교체)[가-힣\s]*$/, "").trim();
  // ① 종류를 짚은 말: ‘장판 2.2t로 바꾸고 싶은데 어떻게’ · ‘강마루로 바꾸려면’
  { const tk = head.split(/\s+/).filter(Boolean), last = tk[tk.length - 1] || "";
    if (/(으로|로)$/.test(last) && last.length >= 3) { const b = last.replace(/(으로|로)$/, ""), a = tk.slice(0, -1).join(" ").replace(/(은|는|을|를)$/, ""), h = helpAltHit(a, b);
      if (h) { const loc = helpSpotLoc(h.l), nm = aliasOf(h.l.items[h.i]), cur = aliasOf(h.l.items[lnState(h.l).alt || 0]), same = lnState(h.l).on && (lnState(h.l).alt || 0) === h.i;
        return `<div class="hk">‘${esc(helpCut(lineLabel(h.l), 14))}’ 종류는 <b>${esc(loc.txt)}</b>에서 그 줄의 <b>종류 칸</b>으로 바꿉니다.</div>`
          + helpRow("지금", same ? `이미 ‘${esc(nm)}’입니다. 바꿀 것이 없습니다.` : `‘${esc(cur)}’${lnState(h.l).on ? "" : " · 꺼져 있음"} → 바꿀 종류 ‘${esc(nm)}’`) + (same ? "" : helpRow("바로 하기", "아래 ‘지금 바꾸기’를 누르면 제가 바꿉니다(되돌리기 가능)."))
          + `<div class="hm">${same ? "" : `<button type="button" data-helpsay="${esc((a || helpCut(lineLabel(h.l), 10)) + " " + b)}로 바꿔줘">지금 바꾸기</button>`}${go(loc.i, { lid: h.l.id, say: "이 줄의 종류 칸에서 고릅니다." }, "그 줄로 가기")}</div>` } } }
  const fld = spot(HELP_SPOTS);
  if (!fld && /(어디에|어디서|어디)[가-힣]{0,2}(써|쓰)/.test(qs)) return null;   // ‘줄눈 어디에 써’ = 어디에 쓰는 자재냐는 말(지식) — 적는 칸(메모 등)일 때만 받는다

  // ② 공사 줄: ‘중문 종류 어디서 바꿔’ · ‘매입등 개수 어디서 바꿔’ · ‘중문 빼고 싶은데 어떻게 해’ · ‘붙박이장 넣으려면’
  let asp = ""; const h2 = head.replace(/\s*(은|는|을|를|이|가|도|의)$/, "").replace(/\s*(종류|자재|등급|모델|색상|색|두께|개수|갯수|수량|길이|치수|크기|사이즈|자수|위치|금액)$/, m => { asp = m.trim(); return "" }).replace(/\s*(은|는|을|를|이|가|도|의)$/, "").trim();
  const forms = x => { const out = [x]; let y = x; for (let k = 0; k < 2; k++) { y = y.replace(/\s*(은요|는요|은|는|도|만|을|를|이|가)$/, "").trim(); out.push(y); y = y.replace(/\s*(교체|공사|시공|작업|설치)$/, "").trim(); out.push(y) } return [...new Set(out)].filter(z => z.length >= 2) };
  const h2n = h2.replace(/\s+/g, "").replace(/(다|전부|전체|모두|관련|쪽|공사|작업|견적|견적서|내용)+$/, ""), isGrp = !asp && !!h2n && (HELP_GRP.some(g => g[0].test(h2n)) || /^(욕실|화장실|조명|전기|설비|배관|보양|가설|창호|확장|수납|마무리)$/.test(h2n));
  let ls = null;
  if (!isGrp && /철거|뜯|떼어|떼는|떼내/.test(h2)) { const tm = kbTok(h2).map(x => x.replace(/(은|는|을|를|이|가|도)$/, "")).filter(x => x.length >= 2 && !/^(철거|뜯|떼)/.test(x)), dh = tm.length ? Object.values(D.stepLines).flat().filter(l => !l.gone && !l.dead && /철거/.test(lineLabel(l)) && tm.some(x => kbNorm(lineLabel(l) + l.items.join("")).includes(x))) : []; if (dh.length) ls = dh.slice(0, 3) }   // ‘걸레받이 철거’ = 다는 공사가 아니라 철거 묶음의 그 줄
  if (!ls && !isGrp && (!fld || asp)) for (const y of forms(h2)) { ls = helpWorkHit(y); if (ls) break }
  if (ls && ls.length > 1) { const dm = /철거|뜯|떼/.test(qs), sc = x => (/철거/.test(lineLabel(x)) === dm ? 0 : 2) + (lnState(x).on ? 0 : 1); ls = [...ls].sort((a, b) => sc(a) - sc(b)) }
  if (ls && ls.length <= 3) { const l = ls[0], loc = helpSpotLoc(l), st = lnState(l), rl = R.lines.find(r => r.lid === l.id), on = !!st.on, nmL = helpCut(lineLabel(l), 16);
    const kindA = /종류|자재|등급|모델|색|두께/.test(asp) ? "type" : /개수|갯수|수량|길이|치수|크기|사이즈|자수/.test(asp) ? "qty" : actM === "off" ? "off" : actM === "on" ? "on" : actM === "chg" && !on ? "on" : actM === "chg" && l.items.length > 1 ? "type" : actM === "chg" ? "qty" : "";
    const ja = typeof furnIsJa === "function" && furnIsJa(l);
    const howTo = kindA === "type" ? (l.items.length > 1 ? `그 줄의 <b>종류 칸</b>에서 고릅니다. 지금: ‘${esc(aliasOf(l.items[st.alt || 0]))}’ · 고를 수 있는 종류 ${l.items.length}가지` : "이 공사는 종류가 한 가지입니다.")
      : kindA === "qty" ? (ja ? "줄을 체크하면 줄 아래 <b>‘+ 치수로 넣기’</b>가 나옵니다. 가로(mm)를 넣으면 자 수가 계산됩니다. 수량 칸에 바로 적어도 됩니다." : `그 줄의 <b>‘수량’ 칸</b>을 고칩니다${on && rl ? ` (지금 ${rl.qty}${esc(rl.unit || "")})` : ""}. ↺ 로 자동 계산으로 돌립니다.${/^(EA|ea|개)$/.test((rl || {}).unit || "") ? ` “${esc(h2)} 10개”처럼 말해도 됩니다.` : ""}`)
      : kindA === "off" ? (on ? "그 줄의 <b>체크를 끄면</b> 빠집니다. 아래 ‘지금 빼기’를 눌러도 됩니다." : "지금 견적에 들어 있지 않습니다.")
      : kindA === "on" ? (on ? "이미 견적에 들어 있습니다." : "그 줄을 <b>체크하면</b> 들어갑니다. 아래 ‘지금 넣기’를 눌러도 됩니다.")
      : `묶음 카드를 펼쳐 그 줄을 <b>체크</b>하고${l.items.length > 1 ? " 종류와" : ""} 수량을 정합니다.` + (on && rl ? ` 지금 켜져 있습니다 (${rl.qty}${esc(rl.unit || "")}).` : " 지금은 꺼져 있습니다.");
    const alts = kindA === "type" && l.items.length > 1 ? helpRow("바로 고르기", l.items.slice(0, 6).map((it, i) => `<button type="button" class="lk" data-helpalt="${esc(l.id)}|${i}">${esc(helpCut(aliasOf(it), 14))}</button>`).join(" ")) : "";
    return `<div class="hk">‘${esc(nmL)}’ 줄${ls.length > 1 ? ` 외 ${ls.length - 1}줄` : ""}은 <b>${esc(loc.txt)}</b>에 있습니다.</div>` + helpRow("하는 법", howTo) + alts
      + (ls.length > 1 ? helpRow("함께", ls.slice(1).map(x => `${esc(helpCut(lineLabel(x), 14))} — ${esc(helpSpotLoc(x).txt)}`).join("<br>")) : "")
      + `<div class="hm">${go(loc.i, { lid: l.id, say: "이 줄입니다." }, "그 줄로 가기")}${kindA !== "type" ? `<button type="button" class="lk" data-helpline="${esc(l.id)}|${on ? 0 : 1}">${on ? "지금 빼기" : "지금 넣기"}</button>` : ""}</div>` }
  if (fld) return fld;
  // ③ 공정(단계): ‘도배 어디서 작성해’ · ‘타일 어디서 해’ · ‘문 교체 어디서 넣어’
  { const w = h2n || h2.replace(/\s+/g, ""), tr = KB_TRADE.filter(x => x[1].test(h2));
    const sk = /^(문|도어|문교체|방문교체|방문|중문)$/.test(w) ? "s6" : /^(가구|수납|수납가구|주방|부엌)$/.test(w) ? "s11" : /^(조명|전등|전기|전기조명)$/.test(w) ? "s5" : /^(철거|보양|가설)$/.test(w) ? "s1" : /^(샷시|샤시|창호|창문|확장)$/.test(w) ? "s2" : /^(발코니|베란다|마무리)$/.test(w) ? "s12" : /^(설비|배관|난방)$/.test(w) ? "s3" : /^(욕실|화장실|타일)$/.test(w) ? "s7" : /^(바닥|바닥재|장판|마루|강마루)$/.test(w) ? "s8" : /^(도배|벽지)$/.test(w) ? "s9" : /^(필름|페인트|도장)$/.test(w) ? "s10" : /^(목공|목작업|목공사)$/.test(w) ? "s4" : tr.length ? tr[0][0] : "", i = sk ? steps.findIndex(s => s.key === sk) : -1;
    if (i >= 0 && w.length <= 8) { const cs = ((D.cats || {})[sk] || []).filter(c => !c.only || c.lines.some(id => { const x = lineById(id); return x && lnState(x).on })).slice(0, 7), n = R.lines.filter(r => r.step === sk && !r.extra && r.qty > 0).length;
      const gw = isGrp && (actM === "off" || actM === "on") && HELP_GRP.some(g => g[0].test(w)) ? `<button type="button" class="lk" data-helpsay="${esc(w)} ${actM === "off" ? "빼줘" : "추가해줘"}">지금 ‘${esc(w)}’ ${actM === "off" ? "빼기" : "넣기"}</button>` : "";
      return `<div class="hk">‘${esc(w)}’ 공사는 <b>${i}단계 ‘${esc(steps[i].label)}’</b>에서 작성합니다.</div>` + helpRow("하는 법", HELP_STEPHOW[sk] || "묶음 카드를 펼쳐 필요한 공사를 체크하고 종류 · 수량을 정합니다.")
        + (cs.length ? helpRow("묶음", cs.map(c => `<button type="button" class="lk" data-wgo="${i}|${sk}|${esc(c.key)}">${esc(helpCut(c.label, 16))}</button>`).join(" ")) : "") + helpRow("지금", n ? `이 단계에 공사 ${n}줄이 들어 있습니다.` : "이 단계에는 아직 켜진 공사가 없습니다.")
        + `<div class="hm"><button type="button" data-goto="${i}">‘${esc(steps[i].label)}’ 단계로 가기</button>${gw}</div>` } }
  const g2 = spot(HELP_SPOTS2); if (g2) return g2;
  // ④ 프로그램 사용법 답 가운데 가장 가까운 것
  { let hs = [], all = []; try { all = kbFind(q, 2.2, 8); hs = all.filter(h => /프로그램/.test(String(h.e.o || ""))) } catch (e) { hs = [] }
    if (all.length && hs.length && all[0] === hs[0]) return null;   // 저장된 답 찾기가 이미 프로그램 사용법 답을 맨 앞에 두면 그 길(이어 묻기 · 가지)로 둔다
    if (hs.length && hs[0].sc >= 12 && helpExact(q, hs[0], hs[1])) return kbCard(hs[0].e, hs.slice(1, 3).map(h => h.e), q) }   // 딱 맞을 때만 (어설프게 걸린 답은 내밀지 않는다)
  return null;
}
/* ───── (v95) ‘○○ 얼마 정도 들어가?’ — 공사 · 공정 하나의 금액을 묻는 말 ─────
   사용자(2026-11-22 · “32평 필름작업을 얼마정도들어가?”에 평형대별 추천 글이 길게 나온 화면을 보내며): “어떤게 들어가고 어떻게 들어가는걸 추천한다고 말하고 금액을 말하지않는건 왜 말하지 않는지 간단히 말해줘야 잘알지 실장들마다 금액 다르단 말을 할 수도 있고 회사 방침이라 할 수도 있잖아”.
   → ① 금액을 어디서 보는지(견적 합계의 그 공정 · 그 줄) + 왜 숫자로 말하지 않는지 한 줄 ② 무엇이 들어가는지(지금 견적의 줄과 수량 — 금액은 적지 않는다) ③ 추천 한 줄(평형대별 추천 답) ④ 단추(공정별로 보기 · 그 단계 · 넣기 · 평수 바꾸기).
   전체 견적의 금액(‘32평 인테리어 얼마’ · ‘총 얼마’)은 전처럼 helpBasicSay · helpCostSay 가 받는다. 치수 · 기간 · 수량 · 까닭을 묻는 말은 건드리지 않는다. */
const HELP_PRICEW = /얼마(?!나)|얼마나(해|하나|하죠|하는|나와|나올|나오|드나|드는|들까|들지|듭|줘야|받|잡|예상|생각)|(공사|작업|시공|교체|설치|하는데|하려면|하면)(은|는|이|가|을|를)?얼마나(들|드)|비용|금액|가격|단가|예산|시세|견적(이|은|는)?(얼마|어느|대략|보통)|어느정도(들|나오|나와|해|하|될|돼|잡|예상|드|인가|일까|야|예요|에요)|몇만원|몇백|몇천|돈(이|은)?(얼마|많이)/;
const HELP_PRICENO = /걸려|걸리|기간|며칠|몇일|두께|높이|간격|깊이|폭이|크기|치수|로스|길이|넓이|사이즈|규격|용량|몇(장|개|박스|롤|단|명|인|포|통)|왜|이유|차이|비싸|싼|싸게|저렴|깎|할인|부가세|계약금|중도금|잔금|결제|마진|원가|이윤|추가금|줄이|아끼|절약|맞추|맞춰|올수리|리모델링|인테리어|어디서|어디에|어떻게(해|바|고|넣|적)|비교|만하면|만할|말고/;
const helpJosa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1); return c >= 0xAC00 && c <= 0xD7A3 ? ((c - 0xAC00) % 28 ? a : b) : a };   // 받침에 따라 은/는 · 이/가 · 을/를
function helpSubj(head0) {                            // ‘필름작업’ · ‘샷시 교체’ · ‘욕실’ · ‘몰딩’ → 그 말이 가리키는 공사 줄들 { ls, name, whole(공정 전체) } (없으면 null)
  const head = String(head0).replace(/\s+/g, " ").trim().replace(/\s*(은|는|이|가|을|를|도|에|의|하면|하는데|하려면|할 때|할때)$/, "").trim(); if (head.replace(/\s+/g, "").length < 2) return null;
  const forms = x => { const out = [x.trim()]; let y = x.trim(); for (let k = 0; k < 2; k++) { y = y.replace(/\s*(은요|는요|은|는|도|만|을|를|이|가)$/, "").trim(); out.push(y); y = y.replace(/\s*(교체|공사|시공|작업|설치|견적)$/, "").trim(); out.push(y) } return [...new Set(out)].filter(z => z.length >= 2) };
  const all = Object.values(D.stepLines).flat().filter(l => !l.gone && !l.dead);
  const hn = head.replace(/\s+/g, "").replace(/(은|는|을|를|이|가|도|에|의)$/, "").replace(/(다|전부|전체|모두|관련|쪽|견적|시공|공사|작업|교체|설치)+$/, "");
  const g = HELP_GRP.find(g => g[0].test(hn)) || (/^(욕실|화장실)$/.test(hn) ? [0, l => stepOfLine(l) === "s7"] : /^(설비|배관)$/.test(hn) ? [0, l => stepOfLine(l) === "s3"] : null);
  if (g) { const ls = all.filter(g[1]); if (ls.length) return { ls, name: hn, whole: true } }
  for (const y of forms(head)) { const h = helpWorkHit(y); if (h && h.length) return { ls: h, name: y, whole: false } }
  const w = kbNorm(hn), hit = w.length >= 2 ? all.filter(l => kbNorm(lineLabel(l)).includes(w)) : []; if (hit.length && hit.length <= 8) return { ls: hit, name: hn, whole: false };   // ‘몰딩’처럼 여러 줄에 걸친 이름
  return null;
}
function helpLineTxt(ls, max) {                       // 켜진 줄을 ‘이름 수량’으로 (금액은 적지 않는다) — 공사 줄을 앞에, 부자재 · 작업비는 뒤에
  const rows = l => R.lines.filter(r => r.lid === l.id && !r.extra && r.qty > 0), on = ls.filter(l => rows(l).length).sort((a, b) => (helpIsSup2(a) ? 1 : 0) - (helpIsSup2(b) ? 1 : 0));
  const tx = l => { const rs = rows(l), lab = lineLabel(l), kind = l.items.length > 1 && lab.length <= 6 && rs.length === 1 ? `(${helpCut(custName(aliasOf(rs[0].name)), 14)})` : ""; return esc(helpCut(lab, 16) + kind) + (rs.length === 1 ? " " + rs[0].qty + esc(rs[0].unit || "") : "") };
  return { on, txt: on.slice(0, max).map(tx).join(" · ") + (on.length > max ? ` 외 ${on.length - max}줄` : "") };
}
function helpPriceSay(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (!D.stepLines || qs.length < 4 || qs.length > 34 || /\d\s*[*xX×]\s*\d/.test(q)) return null;
  if (!HELP_PRICEW.test(qs) || HELP_PRICENO.test(qs) || /^(총|전체|합계|전부|다해서|다합쳐|모두|토탈|견적|금액|비용)/.test(qs)) return null;
  const pm = qs.match(/(?<!\d)(\d{2})평/), pyQ = pm ? +pm[1] : 0;
  // 무엇의 금액인지: 평형과, 값을 묻는 말부터 뒤를 떼고 남은 말
  let head = String(q).replace(/[?？!.~]+$/, "").replace(/\d{2}\s*평\s*(형|대)?\s*(아파트|집|기준|이면|인데|짜리|일때|일 때)?/g, " ");
  const cut = head.search(/\s*(견적|공사비|시공비|인건비)?\s*(은|는|이|가|을|를|도|에)?\s*(대략|대충|보통|평균)?\s*(평당|㎡당|헤베당|개당|한\s*평에|1평에)?\s*(얼마|어느\s*정도|비용|금액|가격|단가|예산|시세|몇\s*만\s*원|몇\s*백|몇\s*천|돈)/); if (cut >= 0) head = head.slice(0, cut);
  const sj = helpSubj(head); if (!sj) return null;
  const { ls, name, whole } = sj, steps = STEPS(), LT = helpLineTxt(ls, 6), on = LT.on, main = on.filter(l => !helpIsSup2(l));
  const cnt = (xs, f) => { const c = {}; for (const x of xs) { const k = f(x); if (k) c[k] = (c[k] || 0) + 1 } return Object.keys(c).sort((a, b) => c[b] - c[a]) };
  const sk = cnt(main.length ? main : on.length ? on : ls.filter(l => !helpIsSup2(l)), stepOfLine)[0] || stepOfLine(ls[0]), gi = steps.findIndex(x => x.key === sk), stl = gi >= 0 ? steps[gi].label : "";
  const prs = cnt(main.length ? main : on, lineProc), pr = prs[0] || "", prl = pr ? (PROC_LABEL[pr] || pr) : "";
  const one = !whole && on.length === 1, l1 = one ? on[0] : null;
  const where = !on.length ? `‘${esc(name)}’${helpJosa(name, "은", "는")} 지금 견적에 <b>들어 있지 않습니다.</b> 넣으면 금액이 바로 나옵니다.`
    : one ? `‘${esc(name)}’ 금액은 <b>${esc(helpSpotLoc(l1).txt)}</b>의 그 줄에 바로 나옵니다.`
    : `‘${esc(name)}’ 금액은 <b>견적 합계 칸${prs.length === 1 ? `의 ‘${esc(prl)}’ 줄` : ""}</b>에 나옵니다.`;
  const inRow = on.length ? helpRow("들어가는 것", LT.txt + " <small>(지금 견적)</small>")
    : helpRow("넣으면", esc(ls.filter(l => !helpIsSup2(l)).slice(0, 5).map(l => helpCut(lineLabel(l), 14)).join(" · ")) + (whole ? " + 부자재 · 작업비" : ""));
  let altRow = ""; try { const ah = helpAltHit("", name); if (ah && lnState(ah.l).on && (lnState(ah.l).alt || 0) !== ah.i) altRow = helpRow("종류", `지금 견적은 ‘${esc(helpCut(aliasOf(ah.l.items[lnState(ah.l).alt || 0]), 16))}’입니다. <button type="button" class="lk" data-helpalt="${esc(ah.l.id)}|${ah.i}">‘${esc(helpCut(aliasOf(ah.l.items[ah.i]), 14))}’로 바꾸기</button>`) } catch (e) { altRow = "" }   // ‘강마루 얼마’인데 지금은 장판
  let rec = null; try { const py = pyQ || +E.py || 33, band = py < 30 ? "20평대" : py < 40 ? "30평대" : "40평대", w2 = kbNorm(name).slice(0, 2);
    const zs = KB.filter(e => e.s === sk && (e.d || []).some(x => x.h === "추천 구성")), hay = e => kbNorm(e.q + (e.k || []).join("")), inB = e => hay(e).includes(band);   // 그 공사가 있는 단계의 ‘추천 구성’ 답 가운데: 평형대 + 그 말 → 그 말 → 평형대
    rec = zs.find(e => inB(e) && hay(e).includes(w2)) || zs.find(e => hay(e).includes(w2)) || zs.find(inB) || zs[0] || null } catch (e) { rec = null }
  const recRow = rec ? helpRow("추천", helpFmt(helpCut(helpFirst(rec.p), 120)) + ` <span role="button" tabindex="0" class="lk in" data-helpgo="${rec.n}">자세히</span>`) : "";
  const pyRow = pyQ && pyQ !== +E.py ? helpRow("평형", `지금 견적은 ${esc(String(E.py || "?"))}평입니다. <button type="button" class="lk" data-helpsay="평수 ${pyQ}평으로 바꿔줘">${pyQ}평으로 바꾸기</button>`) : "";
  const unitRow = /평당|단가|당얼마/.test(qs) && on.length ? helpRow("단가", "그 줄에 ‘수량 × 단가 = 금액’으로 보입니다. 기본 단가는 관리자가 정합니다.") : "";
  const btn = (on.length ? (one ? `<button type="button" data-goto="${gi}"${atAttr({ at: { lid: l1.id, say: "이 줄의 금액입니다." } })}>그 줄로 가기</button>` : `<button type="button" data-procview="${esc(prs.length === 1 ? pr : "*")}">${prs.length === 1 ? `‘${esc(prl)}’ 금액 보기` : "공정별 금액 보기"}</button>`)
      : `<button type="button" data-helpsay="${esc(name)} 추가해줘">지금 넣기</button>`)
    + (gi >= 0 && !(on.length && one) ? `<button type="button" class="lk" data-goto="${gi}">‘${esc(helpCut(stl, 12))}’ 단계로 가기</button>` : "");
  return `<div class="hk">${where}<small class="hwy">${HELP_WHYNO}</small></div>` + inRow + altRow + recRow + unitRow + pyRow + `<div class="hm">${btn}</div>`;
}
/* (v95) 원가 · 마진 · 남는 돈을 숫자로 묻는 말 — 숫자는 말하지 않고 어디에 나오는지 */
function helpMarginAsk(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length < 4 || qs.length > 30) return null;
  if (!/원가|마진|차액|남는|남아|남기|이익|이윤/.test(qs) || !/얼마|몇|어느정도|보여|알려|어때|되나|나와|나오|인가|일까/.test(qs) || /기업이윤|어디서|어디에|어떻게|고치|바꾸|바꿔|왜|뭐야|뭔가|차이/.test(qs)) return null;
  if (!mgCan()) return `<div class="hk">원가 · 차액 · 마진은 이 화면에는 나오지 않습니다.<small class="hwy">회사 주소로 로그인한 화면에서만, ‘견적 합계’ 칸에 공정별 합계로 보입니다. 회사 내부 방침상 금액 전달은 힘듭니다.</small></div>`;
  let pr = ""; try { const sj = helpSubj(String(q).replace(/[?？!.~]+$/, "").replace(/\s*(의|은|는|이|가)?\s*(원가|마진|차액|남는|남아|남기|이익|이윤).*$/, "")); if (sj) { const on = sj.ls.filter(l => R.lines.some(r => r.lid === l.id && r.qty > 0) && !helpIsSup2(l)); pr = on.length ? lineProc(on[0]) : "" } } catch (e) { pr = "" }
  return `<div class="hk">원가 · 차액 · 마진은 <b>‘견적 합계’ 칸</b>에 공정마다 나옵니다${mgHidden() ? " (지금은 ‘원가 보기’를 눌러야 보입니다)" : ""}.<small class="hwy">회사 내부 방침상 원가 · 마진 금액 전달은 힘듭니다. 고객 견적서에는 나가지 않습니다.</small></div>`
    + helpRow("보는 곳", "공정 줄 = 원가 | 견적 금액, 총 합계 아래 = 원가 합계 · 차액 · 마진 %. 원가 칸은 실제 들어갈 금액으로 고쳐 적을 수 있습니다.")
    + `<div class="hm"><button type="button" data-procview="${esc(pr || "*")}">${pr ? `‘${esc(PROC_LABEL[pr] || pr)}’ 공정 보기` : "공정별로 보기"}</button></div>`;
}
/* (v95) ‘타일 얼마나 들어가’ · ‘석고보드 몇 장 필요해’ — 양을 묻는 말: 지금 견적의 수량 + 계산법 답 */
const HELP_QTYW = /얼마나(들어가|들어|필요|쓰|써|사야|주문)|몇(장|박스|롤|개|포|통|단|평|자|m|미터|본|세트)(이나|이|가|나|정도|쯤)?(들어|필요|나와|나오|쓰|써|사야|주문|시켜)/;
function helpQtySay(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (!D.stepLines || qs.length < 5 || qs.length > 30 || /\d\s*[*xX×]\s*\d/.test(q) || /\d{3,}/.test(qs)) return null;
  if (!HELP_QTYW.test(qs) || /비용|금액|가격|돈|왜|어떻게|계산|로스|기간|걸려|지금견적|이견적|석고|각재|다루끼|목자재/.test(qs)) return null;
  const head = String(q).replace(/[?？!.~]+$/, "").replace(/\d{2}\s*평\s*(형|대)?/g, " ").replace(/\s*(은|는|이|가|을|를|도)?\s*(보통|대략|대충)?\s*(얼마나|몇\s*(장|박스|롤|개|포|통|단|평|자|m|미터|본|세트)).*$/, "");
  const sj = helpSubj(head); if (!sj) return null;
  const LT = helpLineTxt(sj.whole ? sj.ls.filter(l => !helpIsSup2(l)) : sj.ls, 5), l0 = LT.on[0] || sj.ls[0], loc = helpSpotLoc(l0);
  let calc = null; try { calc = kbFind(`${sj.name} 수량 계산`, 2.2, 8).map(h => h.e).find(e => (e.d || []).some(x => x.h === "계산식") && kbNorm(e.q + (e.k || []).join("")).includes(kbNorm(sj.name).slice(0, 2))) || null } catch (e) { calc = null }
  if (!LT.on.length && !calc) return null;
  return `<div class="hk">${LT.on.length ? `지금 견적에는 <b>${LT.txt}</b> 들어가 있습니다.` : `‘${esc(sj.name)}’${helpJosa(sj.name, "은", "는")} 지금 견적에 들어 있지 않습니다.`}<small class="hwy">집 크기와 치수에 따라 달라집니다. 수량 칸을 고치면 금액도 같이 바뀝니다.</small></div>`
    + (calc ? helpRow("계산법", helpFmt(helpCut(helpFirst(calc.p), 110)) + ` <span role="button" tabindex="0" class="lk in" data-helpgo="${calc.n}">자세히</span>`) : "")
    + `<div class="hm">${loc.i >= 0 ? `<button type="button" data-goto="${loc.i}"${atAttr({ at: { lid: l0.id, say: "이 줄의 수량 칸입니다." } })}>그 줄로 가기</button>` : ""}${LT.on.length ? "" : `<button type="button" class="lk" data-helpsay="${esc(sj.name)} 추가해줘">지금 넣기</button>`}</div>`;
}
/* (v95) ‘○○인데 하자야?’ · ‘이렇게 하는 게 맞는 시공이야?’ — 인테리어 카페에서 가장 많이 보인 유형(사진을 올리고 판단해 달라는 글).
   판단 틀(눈에 띄는지 · 쓰는 데 문제가 있는지 · 커지는지) + 그 공사의 하자 답에서 한 줄 + 말하는 순서. 하자 전반(기준 · 접수 · 기간 · 책임)은 저장된 답으로 둔다. */
const HELP_DEFQ = /하자(야|예요|에요|인가|일까|맞|인지|아닌|아냐|임|죠|라고|로봐|로보)|맞는시공|제대로된시공|제대로한(거|건)|정상(이야|인가|일까|이에요|예요|인지|임|이죠|맞)|원래이래|원래이런|원래그래|이게맞(아|나|는)|마감해도(돼|되)|메꿔도(돼|되)|메워도(돼|되)/;
const HELP_DEFT = [   // (v96) 증상 → [지켜봐도 되는 것, 하자로 보는 것, 남길 것] — 다른 대화가 쓴 재료(클로드_공유/하자판단.txt · 허용 오차 숫자는 근거가 없어 넣지 않았다)
  [/(도배|벽지).*(우는|울어|울었|주름|쭈글)/, "붙인 직후의 잔주름과 우는 자리 — 마르면서 당겨져 펴지는 경우가 많다(기존 답: 7~10일 지켜봄)", "다 마른 뒤에도 남은 주름 · 들뜸, 눌러도 다시 뜨는 자리", "시공 직후 사진 → 다 마른 뒤 같은 자리 사진 → 그대로면 접수"],
  [/(도배|벽지).*(이음|벌어)/, "가까이서 비스듬히 봐야 보이는 가는 이음선(실크 맞댐 시공) · 조명 방향에 따라 보이는 정도", "이음이 벌어져 바탕이 보인다 · 겹쳐서 턱이 졌다 · 끝이 말려 올라왔다", "벌어진 길이가 보이게 자와 함께, 정면과 비스듬한 각도 한 장씩"],
  [/(벽지|도배).*무늬/, "무지나 잔무늬 벽지의 아주 작은 차이 — 현장 확인", "무늬가 있는 벽지에서 이음마다 눈에 띄게 어긋난다", "정면 사진"],
  [/(벽지|도배).*(볼록|기포|공기)/, "마르기 전의 작은 공기 주머니 — 지켜본다", "다 마른 뒤에도 남은 기포, 바탕의 이물로 튀어나온 자리", "비스듬한 빛에서 사진"],
  [/(벽지|도배).*(모서리|콘센트|지저분|풀자국|들떴|들뜸)/, "커버나 몰딩에 가려지는 재단선", "커버 밖으로 보이는 찢김 · 틈, 몰딩 · 문틀 끝선의 들뜸, 풀 자국과 오염", "커버를 닫은 상태로 사진"],
  [/줄눈.*(간격|일정)/, "타일 치수 차이에서 오는 아주 작은 차이 — 현장 확인", "한 벽에서 줄눈이 눈에 띄게 넓어졌다 좁아진다 · 줄이 휘었다", "줄 전체가 보이게 멀리서 한 장, 가까이 한 장"],
  [/타일.*(단차|울퉁불퉁|면이)/, "손끝으로 겨우 느끼는 정도(큰 타일일수록 생기기 쉽다) — 현장 확인", "발에 걸린다 · 눈에 띄게 층이 졌다 · 모서리가 날카롭게 튀어나왔다", "비스듬한 빛을 비춰 그림자가 보이게 사진"],
  [/타일.*(빈소리|통통|두드리)/, "벽 타일을 점으로 붙이면(회사 FM: 에폭시 점 5~9개) 점 사이는 소리가 다르게 난다", "바닥 타일의 넓은 빈 소리, 밟으면 움직이거나 줄눈이 갈라진다, 벽 타일이 흔들린다", "빈 소리 나는 장에 테이프로 표시하고 사진"],
  [/(욕실|바닥).*(물이고|고이|고여)/, "샤워 뒤 얇게 남았다가 마르는 물기", "배수구 반대쪽으로 물이 흐른다 · 고여서 오래 안 빠진다(물매 불량)", "물을 뿌리고 1~2분 뒤 사진이나 영상"],
  [/줄눈.*(갈라|빠졌|빠져|얼룩|색이)/, "마르는 동안의 색 차이 — 지켜본다", "갈라짐 · 덜 채움 · 구멍 · 가루가 묻어 나온다", "가까운 사진"],
  [/타일.*(금이|금갔|깨졌|깨짐)/, "없음(시공 직후의 금 · 깨짐은 정상이 아니다)", "금 · 이 빠짐 · 모서리 깨짐 → 그 장 교체. 입주 뒤 충격으로 깨진 것은 유상", "인도하는 날 확인해야 구분된다. 발견한 날 바로 사진"],
  [/마루.*(틈|벌어)/, "건조한 계절 · 난방할 때 생겼다 줄어드는 가는 틈", "계절과 상관없이 벌어져 있다 · 점점 커진다 · 끝이 들린다", "틈에 종이나 동전을 끼워 너비가 보이게, 날짜와 함께"],
  [/마루.*소리/, "한두 자리에서 가끔 나는 소리 — 현장 확인", "넓은 범위에서 밟을 때마다 난다 · 꺼지는 느낌이 있다(접착 · 바닥 평활 문제)", "소리 나는 자리에 테이프 표시, 영상"],
  [/장판.*(이음|벌어)/, "이음선이 보이는 것 자체(용착한 선)", "벌어짐 · 들뜸 · 이음이 터졌다", "가까운 사진"],
  [/장판.*(울룩|울어|들뜸|들떴|기포)/, "깐 직후 며칠 — 난방하면서 펴지는 경우가 있다", "시간이 지나도 남은 울음 · 기포, 바닥 이물로 튀어나온 자리", "비스듬한 빛에서 사진"],
  [/걸레받이.*(떴|뜸|벌어|안맞|모서리)/, "바닥이 고르지 않아 생긴 가는 틈을 실리콘으로 마감한 것", "걸레받이가 떨어져 흔들린다 · 모서리 이음이 벌어졌다", "가까운 사진"],
  [/문틀.*(실리콘|메꿨|메꾸|메워)/, "문틀과 벽 · 바닥 사이의 가는 틈을 실리콘으로 마감하는 것은 흔한 마감이다", "문틀을 뜯다가 깨지거나 넓게 벌어진 자리를 실리콘만으로 채웠다 · 문틀이 흔들린다 · 수직이 안 맞는다 → 보강이나 교체가 맞다(너비 기준은 현장 확인)", "틈 너비가 보이게 자와 함께, 문틀 전체 사진"],
  [/문(이|은)?.{0,6}(저절로|안닫|잘안닫)/, "없음 — 조정할 일이다", "경첩 조정으로 안 잡힌다 · 문틀이 뒤틀렸다", "영상"],
  [/문.*아래.*틈/, "바닥재 두께와 환기 때문에 두는 틈 — 현장 확인", "문마다 눈에 띄게 다르다 · 바닥에 끌린다", "문을 닫고 아래쪽 사진"],
  [/몰딩.*(이음|벌어)/, "가는 이음선", "벌어져 속이 보인다 · 모서리 맞춤이 어긋났다 · 계절이 지나며 커진다", "가까운 사진"],
  [/(상부장|하부장|붙박이장|신발장|가구|싱크대).*틈/, "벽이 고르지 않아 생기는 가는 틈을 실리콘이나 마감재(휠라)로 막는 것", "틈이 넓어 실리콘이 꺼지거나 금방 갈라질 정도 → 휠라 · 몰딩으로 마감해야 한다(너비 기준은 현장 확인)", "틈 너비가 보이게 자와 함께, 장 전체 사진"],
  [/(싱크대|붙박이장|문짝).*(높이|안맞)/, "없음 — 경첩 조정할 일이다(하자라기보다 조정)", "조정해도 안 맞는다 · 문짝이 휘었다", "문을 닫고 정면 사진"],
  [/상판.*이음/, "재질에 따라 이음선이 보일 수 있다 — 현장 확인", "턱이 졌다 · 벌어졌다 · 물이 스민다", "가까운 사진"],
  [/가구.*찍힘/, "없음", "설치 때 생긴 찍힘 · 긁힘은 보수나 교체 대상", "설치한 날 확인하고 바로 사진(늦으면 쓰다 생긴 것과 구분이 어렵다)"],
  [/아트월/, "판 사이에 계획해서 둔 줄눈", "판이 들떴다 · 깨졌다 · 층이 졌다 · 이음이 벌어졌다 · 오염", "접수한다. 전체 한 장 + 가까운 한 장 + 언제부터"],
  [/필름.*기포/, "붙인 직후의 아주 작은 기포는 며칠 사이 빠지기도 한다 — 현장 확인", "남은 기포, 이물로 튀어나온 자리", "비스듬한 빛에서 사진"],
  [/필름.*(들떴|들뜸|말림)/, "없음", "들뜸 · 말림 → 다시 붙이거나 그 면을 다시 시공", "가까운 사진"],
  [/필름.*이음/, "넓은 면에서 생기는 이음선(눈에 덜 띄는 자리에 둔다)", "이음이 벌어졌다 · 겹쳐서 턱이 졌다", "정면 사진"],
  [/실리콘.*(삐뚤|끊|구멍)/, "가까이서 보이는 작은 굴곡", "끊겼다 · 구멍이 있다 · 덜 채웠다 — 물 닿는 곳은 누수로 이어진다", "줄 전체와 끊긴 자리"],
  [/실리콘.*곰팡이/, "쓰면서 생긴 곰팡이는 관리 · 소모품(회사 AS 기준: 사용 중 생긴 것과 소모품은 유상)", "쏜 직후부터 들뜨거나 떨어진다", "사진. 다시 쏘는 법은 실리콘 제거 답으로"],
  [/(샷시|샤시|창).*결로/, "안팎 온도 차가 큰 날 유리 아래 가장자리의 물방울(환기하면 준다)", "유리 두 장 사이에 김이 찬다 · 창틀 둘레 벽이 젖는다(틈 채움 불량)", "물이 맺힌 자리와 벽 사진, 날씨 · 시간"],
  [/(샷시|샤시|창).*(바람|외풍)/, "없음 — 조정할 일이다", "닫아도 바람이 든다 · 잠금이 안 맞는다", "휴지나 향 연기가 움직이는 영상"],
  [/(창문|샷시|샤시).*뻑뻑/, "없음 — 조정할 일이다", "조정해도 걸린다 · 레일이 휘었다", "영상"],
  [/욕조/, "없음(사진을 봐야 한다)", "흔들린다 · 밟으면 꺼지는 느낌 · 욕조 둘레 실리콘 틈 · 설치 때 생긴 긁힘과 깨짐", "전체 한 장 + 문제 자리 한 장"],
  [/변기.*(물|새)/, "없음", "바닥으로 물이 샌다 · 변기가 흔들린다 → 바로 접수", "물이 나온 자리 사진"],
  [/수전.*(새|물)/, "없음", "연결부 누수 → 밸브를 잠그고 바로 접수", "새는 자리 영상"],
  [/배수.*느/, "없음", "물이 고여 천천히 빠진다 → 트랩과 물매 확인", "물 내려가는 영상"]];
const HELP_DEFS = /(실금|금이|금갔|틈이|벌어졌|벌어져|들떴|들뜨|깨졌|찍힘|기포|흔들|울어|울룩|삐뚤|뻑뻑|헐거|안닫|안열|안맞|새는|물이새|고이|고여|깜빡|소리가?나|안따뜻|느린|처졌).{0,14}(괜찮(아|나|은가|을까|은거야|은건가)?|정상이?야?|문제(야|인가|없나)?|맞아|되나|돼)$|(안닫혀|안닫힘|안열려|흔들려|뻑뻑해|깜빡여|소리나|소리가나|벌어졌어|들떴어|깨졌어|금갔어|금이갔어|물이고여|안따뜻해)$/;   // 증상만 말한 것
function helpDefectSay(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length < 6 || qs.length > 40 || !(HELP_DEFQ.test(qs) || HELP_DEFS.test(qs))) return null;
  if (/기간|책임|누구|누가|기준으로|어떤기준|뭐부터|사진|아니라고|잔금|구분|다시생|망가지|보증|접수|담보|과실|잘못인지|어떻게|왜|이유|방법|하려면|고치|보수|수리|교체/.test(qs)) return null;
  let zb = null; try { const tr = KB_TRADE.map(x => [x[0], String(q).search(x[1])]).filter(x => x[1] >= 0).sort((a, b) => a[1] - b[1]).map(x => x[0]), hs = kbFind(q, 2.2, 12).map(h => h.e).filter(e => (e.d || []).some(x => x.h === "흔한 하자")); zb = hs.find(e => tr[0] && e.s === tr[0]) || hs.find(e => !tr.length || tr.includes(e.s)) || (tr.length ? KB.find(e => tr.includes(e.s) && (e.d || []).some(x => x.h === "흔한 하자")) : null) || null } catch (e) { zb = null }
  const d = zb ? zb.d : [], sec = h => (d.find(x => x.h === h) || {}).t || "", fixI = d.findIndex(x => x.h === "보수 방법"), dt = HELP_DEFT.find(x => x[0].test(qs)) || null;
  let ex = null; try { const h0 = kbFind(q.replace(/\s*(인데|는데)?\s*(하자|정상|원래|맞는\s*시공|괜찮).*$/, ""), 2.2, 3); if (h0[0] && h0[0].e !== zb && h0[0].e.p && h0[0].sc >= 16 && helpExact(q, h0[0], h0[1])) ex = h0[0].e } catch (e) { ex = null }   // 그 증상을 바로 다룬 답(예: 타일 통통 소리 = 타음)
  return `<div class="hty"><i>하자 판단</i>${zb ? esc(kbLabel(zb)) : ""}</div><div class="hk">하자인지는 <b>눈에 띄는지 · 쓰는 데 문제가 있는지 · 시간이 지나며 커지는지</b>로 봅니다.<small class="hwy">${dt ? "아래는 이 증상에서 흔히 보는 기준입니다. 현장을 보고 판단합니다." : "마르거나 자리 잡으며 없어지는 것은 지켜보고, 남아 있거나 커지는 것은 보수 대상입니다. 사진만으로는 단정하지 않습니다."}</small></div>`
    + (dt ? helpRow("지켜봐도 되는 것", esc(dt[1])) + helpRow("하자로 보는 것", esc(dt[2])) + helpRow("남길 것", esc(dt[3])) : "")
    + (dt ? "" : ex ? helpRow("이 경우는", helpFmt(helpCut(helpFirst(ex.p), 140)) + ` <span role="button" tabindex="0" class="lk in" data-helpgo="${ex.n}">자세히</span>`) : "")
    + (dt ? "" : zb ? helpRow("이 공사는", helpFmt(helpFirst(sec("흔한 하자") || zb.p)) + ` <span role="button" tabindex="0" class="lk in" data-helpgo="${zb.n}">자세히</span>`) : "")
    + (zb && sec("원인") && !ex && !dt ? helpRow("흔한 원인", helpFmt(helpFirst(sec("원인")))) : "")
    + (dt ? "" : helpRow("말하는 순서", "① 가까이 · 멀리 사진과 위치를 남기고 ② 글로 접수하고 ③ 보수 날짜를 받습니다. 잔금 전이면 보수 뒤에 정산합니다."))
    + `<div class="hm">${zb && fixI >= 0 ? `<button type="button" data-helppar="${zb.n}|${fixI}">보수 방법 보기</button>` : ""}<button type="button" class="lk" data-helpsay="하자 판단 기준은 어떤 기준으로 봐">판단 기준</button><button type="button" class="lk" data-helpsay="하자 보수 기간 얼마나 돼">하자 보수 기간</button></div>`;
}
/* (v95) ‘도배 왜 비싸’ · ‘욕실 금액이 왜 이렇게 많이 나와’ → 그 공정의 금액을 좌우하는 것 (하자 답의 ‘원인’ 문단으로 가던 것) */
function helpWhyPrice(q) {
  const qs = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (qs.length < 4 || qs.length > 30) return null;
  if (!/(왜|이유).{0,10}(비싸|비싼|많이나|많이들|높|올라)|비싼이유|왜이렇게(나와|나오|비싸|많)/.test(qs) || /업체|견적서|평당|구축|신축|하자|원가|마진/.test(qs)) return null;
  const e = KB.find(x => /^같은 공사인데 금액이 달라지는/.test(x.q)); if (!e) return null;
  const fx = /도배|벽지|장판|마루|바닥/.test(qs) ? 0 : /욕실|화장실|타일/.test(qs) ? 1 : /목공|전기|조명|몰딩|천장/.test(qs) ? 2 : /샷시|샤시|창호|가구|싱크|붙박이/.test(qs) ? 3 : -1;
  return kbCard(e, [], q, false, false, fx);
}
/* (v99) 고객 · 이웃 · 작업자를 어떻게 응대하느냐를 묻는 말(‘평수만 보내고 얼마냐고 하면 뭐라고 답해’ · ‘이 줄 빼 달라고 하면’ · ‘전화로 문의 오면 뭐부터 물어봐’)은
   ‘얼마’ · ‘빼’ 같은 낱말 때문에 금액 안내나 견적 쓰는 순서로 읽혔다 → 프로그램이 직접 답하지 않고 저장된 답(없으면 AI)으로 보낸다. 값을 바로 묻는 끝말(얼마야)로 끝나면 전처럼 둔다. */
const HELP_RESPW = /(고객|손님)(?!명|이름|정보|견적서|용)|이웃|작업자|기술자|관리사무소|부부|문의|통화|전화(?!단자|선|기)|카톡|문자(?!열)|상담/;
const helpRespQ = q => { const t = String(q).replace(/\s+/g, "").replace(/[?？!.~]+$/, ""); if (t.length > 44 || /\d\s*[*xX×]\s*\d/.test(q) || /(얼마야|얼마예요|얼마에요|얼마지|얼마임|얼마나와|얼마나와요)$/.test(t)) return false;
  return /(냐고|라고|다고|자고|달라고|겠다고)(하면|하시면|물으면|물어보면|그러면|할때|하는데|할경우)/.test(t) || (HELP_RESPW.test(t) && /(뭐라고|뭐라)(답|말|해|하|설명|응대|대답|안내)|(으면|하면|오면|이면|물으면|시면|다면|라면)(어떻게|어떡|뭘|뭐부터|뭐라|어찌)/.test(t)) };
function helpDo(q) {                                  // 프로그램이 직접 할 수 있는 일이면 그 답(HTML), 아니면 null
  if (helpRespQ(q)) return null;
  let r = null; try { r = helpSpecSay(q) || helpAskNow(q) || helpDefectSay(q) || helpMarginAsk(q) || helpWhyPrice(q) || helpPriceSay(q) || helpQtySay(q) || helpSpotSay(q) } catch (e) { r = null } if (r) return r;
  let c = null; try { c = helpCmd(q) } catch (e) { c = null }
  if (c && c.html) return c.html; if (c && c.say) { try { r = helpWork(c.say) } catch (e) { r = null } if (r) return r }
  return helpDo1(q);
}
function helpDo1(q) {                                 // (v90 전의 helpDo) 치수 계산 · 큰 질문 · 공사 체크 · 프로그램 조작
  const p = helpParse(q), calcW = /계산|수량|물량|산출|몇\s*(장|단|개|박스|평)|면적|평수|석고|각재|다루끼|타일|로스|목작업|목공|천[장정전]|가벽/.test(q), wood = /석고|각재|다루끼|목작업|목공|목작|천[장정전]|가벽/.test(q), qs = q.replace(/\s+/g, "");
  const n = p.rows.length, qW = /계산|수량|몇\s*(장|단|개|박스)|석고|각재|다루끼|로스|면적|평수/.test(q);   // 치수가 여러 개면 치수 목록, 하나뿐이면 계산을 바라는 말이 있을 때만 계산으로 본다
  if (!n) { const be = helpBasicSay(q); if (be) return be }   // (v79) ‘32평 기본 인테리어 견적 어느 정도?’ → 기본 공사로 새 견적을 만들어 준다
  if (!n) { const bq = helpBathSay(q); if (bq) return bq }   // (v71) ‘안방 욕실은 덧방으로’ · ‘욕실 2칸인데 하나는 덧방이면?’
  if (!n) { const wq = helpWhereSay(q); if (wq) return wq }   // ‘~ 견적 위치 어디야’
  if (!n) { const cq = helpCmpSay(q); if (cq) return cq }   // ‘~ 비교견적 해줘’
  if (!n) { const wk = helpWork(q); if (wk) return wk }   // ‘~ 작업할 거야’: 말한 공사를 체크한다
  if (!n) { const big = helpBig(q); if (big) return big }   // 큰 질문 · 처음 쓰는 사람의 질문
  if (!n && D.stepLines && qs.length <= 22 && /도면.{0,8}(보여|표시|확인|그려|띄워)|어디에뭐(하|들어가)|공사.{0,4}도면/.test(qs) && !/치수|계산|어떻게|방법|올리|업로드|하려면|하는법|싱크|붙박이|가구|분전함|배관|가벽|위치표시|선표시/.test(qs)) return helpPlanAll();   // ‘도면으로 보여 줘’
  const fol = helpWoodFollow(q, p); if (fol) return fol;
  if ((n >= 2 && (calcW || p.left <= 2)) || (n === 1 && (p.left <= 2 || qW || (p.tile && /타일/.test(q))))) return helpCalcSay(p, q);
  if (/도면|평면도|실측\s*(치수|값)/.test(q) && (/석고|각재|다루끼|목작업|목공|목작/.test(q) || (/천[장정전]/.test(q) && /계산/.test(q))) && /계산|수량|몇|산출/.test(q)) return helpPlanCalc(p.loss);
  if (/계산|수량|물량|산출|몇\s*(장|단)/.test(q) && (/여기|너한테|너에게|네게|챗봇|보내|말하면|말해\s*주면|적으면|적어\s*주면|알려\s*주면|입력하면|불러\s*주면|치수\s*주면/.test(q) || /계산\s*(좀\s*)?해\s*(줘|주세요|줄래|줄\s*수|봐)/.test(q))) return helpCalcHow(q);
  const now = helpNow(q); if (now) return now;
  const prog = helpProgDo(q); if (prog) return prog;
  { let w = qs.replace(/[?？!.~]+$/, ""); const m0 = w; for (let k = 0; k < 4; k++) w = w.replace(/(은|는|이|가|에대해서?|관련|쪽|전체|전부|목록|질문|가지|지도|목차|뭐있어|뭐가있어|뭐물어볼수있어|알려줘|보여줘|좀)$/, "");   // ‘타일’ · ‘도배 전체’ · ‘목공 관련 질문’ → 그 공정의 가지 지도
    if (m0.length <= 16 && w && w.length <= 5 && helpStepOf(w)) return helpMap(helpStepOf(w));
    if (m0.length <= 16 && /^(전체)?(가지|지도|가지지도|마인드맵|목차|질문목록|전체목록|전체보기)(를|을|좀)?(보여줘|보여|알려줘|줘)?$|^(뭐|뭘|어떤걸?)(를|을)?물어볼수있(어|나|지|나요)$/.test(m0)) return helpMap() }
  if (/^(안녕|하이|ㅎㅇ|hello|hi)/i.test(qs) && qs.length <= 12) return "안녕하세요. 궁금한 것을 묻거나 치수를 적어 주세요. 바로 답하고 계산합니다.";
  if (/(고마워|고맙|감사|땡큐|수고했|수고하)/.test(qs) && qs.length <= 14) return "네, 또 궁금한 게 생기면 바로 물어보세요.";
  if ((/^(여기서?|여기에|챗봇(한테|에게|은|이)?는?|너(한테|는)?|넌)?(뭘|뭐를?|무엇을?|어떤걸?)(할수|물어볼수|물어봐도|도와|해줄)/.test(qs) && qs.length <= 24) || /^(사용법|도움말|기능)/.test(qs) || (qs.length <= 14 && /^(질문|사용|입력)?(예시|샘플|보기)(로|좀|를|을|는)?(보여|알려|만들어|해)?(줘|주세요|줘요|줄래|봐|뭐야|뭐있어|있어)?[?？!.]*$/.test(qs)))
    return '<div class="hk">인테리어 질문에 답하고, 치수 계산과 지금 견적 확인을 합니다.</div>' + helpRow("질문", "<code data-helpfill>타일 부자재는 뭐가 들어가?</code>") + helpRow("계산", "<code data-helpfill>거실 2230*5730, 안방 3320*3820 로스 15%</code>") + helpRow("예시로 해 보기", '<button type="button" data-helpsay="목작업 치수 예시로 계산">치수 계산 예시</button> <button type="button" data-helpsay="타일 예시로 계산">타일 계산 예시</button>') + helpRow("지금 견적", "<code data-helpfill>뭐 안 했지?</code> <code data-helpfill>지금 견적 요약해줘</code>") + helpRow("출처", "답을 받은 뒤 <code data-helpfill>출처</code>") + helpRow("추가 요청", "<code data-helpfill>추가: 넣었으면 하는 내용</code>");
  return null;
}
/* (v72) ‘금액을 맞추고 싶은데 어디를 고치면 돼’ · ‘이걸 줄이려면?’ · ‘왜 안 바뀌어?’처럼 견적을 어떻게 만들지 묻는 말은, 낱말만 겹치는 지식 답(자재 종류 등)을 내밀지 않고 AI 에게 넘긴다
   — 사용자(2026-11-20): “실장의 요구사항을 제대로 이해하지 못한다면 필요없는 작업을 한 게 되니까”. 프로그램 사용법·회사 기준 답이 걸렸으면 그 답을 쓴다. AI 가 없는 화면은 전과 같다. */
const HELP_GOAL = /(맞추|맞춰|줄이|줄여|늘리|늘려|낮추|낮춰|올리|올려|바꾸|바꿔|고치|고쳐|빼|넣)[가-힣]{0,6}(싶|려면|려고|면돼|면되|야돼|야되|야하|어떻게|방법)|어디를|어느칸|어느줄|금액[가-힣]{0,8}(맞|줄|낮|올|안바뀌|그대로|이상)|왜[가-힣]{0,10}(안바뀌|그대로|안나와|안들어|안보)/;
function helpGoalQ(q, top) { return HELP_GOAL.test(q.replace(/\s+/g, "")) && !(top && /프로그램|회사 기준/.test(String((top.e && top.e.o) || ""))) }
function helpSend(q0) {
  const q = String(q0 || "").trim(); if (!q) return; HELP_LOG.push({ who: "me", html: esc(q) });
  const add = q.match(/^(추가|요청)\s*[:：]\s*(.+)/);
  if (add) { helpMiss(add[2].trim(), "추가"); helpSay("네, 요청 목록에 남겨 두었습니다. 쌓이면 한꺼번에 답을 채워 넣겠습니다."); return }
  if (/출처|근거|링크|source|어디서\s*(나온|나왔|본|찾은|가져)/i.test(q) && q.length <= 20) { helpSay(!HELP_LAST ? "먼저 궁금한 것을 물어봐 주세요. 답을 드린 뒤에 ‘출처’라고 적으시면 그 답의 출처를 알려 드립니다." : HELP_LAST.miss ? "방금은 준비된 답을 드리지 못해 출처도 없습니다." : HELP_LAST.own ? "방금 답은 프로그램이 지금 견적과 회사 기준 계산식(석고보드 = 면적 ÷ 1.62, 각재 = 석고 1장당 3개·12개 1단)으로 낸 값입니다." : kbSrc(HELP_LAST.es, HELP_LAST.ai)); return }
  let own = null; try { own = helpDo(q) } catch (e) { own = null }
  if (own) { helpSay(own); HELP_TURNS.push({ role: "user", content: q }, { role: "assistant", content: helpTxt(own).slice(0, 700) }); HELP_LAST = { q, es: [], own: true, topic: HELP_LAST && HELP_LAST.topic }; return }
  if (!/^(더\s*)?자세히/.test(q)) helpHist(q);
  const more = q.length <= 14 && /^(더|좀더)?(자세히|자세하게|상세히|풀어서|설명해)/.test(q.replace(/\s+/g, ""));
  if (KB_AI && !(more && !(HELP_LAST && HELP_LAST.ai))) {   // AI 를 쓸 수 있는 화면: 저장된 답이 딱 맞으면 그 답 그대로(누구에게나 같은 답), 저장된 답으로 못 푸는 말만 AI 가 답한다
    const hs = kbFind(q, 2.2, 5), p0 = HELP_LAST && !HELP_LAST.ai && HELP_LAST.es && HELP_LAST.es[0], fresh = helpFresh(q, hs, p0);
    if (!more && !helpCalcLike(q) && !helpIsAct(q) && q.length <= 45 && !helpGoalQ(q, hs[0])) { if (!fresh && helpFollowKb(q, p0)) return;
      if (!helpLoose(q, hs, p0) && helpExact(q, hs[0], hs[1])) { HELP_LAST = { q, es: hs.map(h => h.e), topic: helpTopic(hs[0].e) }; kbSay(hs[0].e, hs.slice(1).map(h => h.e), q); return } }
    HELP_LAST = { q, es: hs.map(h => h.e), topic: HELP_LAST && HELP_LAST.topic }; if (!hs.length || hs[0].sc < 12) helpMiss(q); helpDraw(); helpAi(); return }
  helpLocal(q);
}
function helpLocal(q) {                               // AI 없이 저장된 답만으로 답하기
  if (!KB.length) { helpSay("아직 답할 준비가 안 됐습니다. 잠시 뒤에 다시 물어봐 주세요. 계속 안 되면 F5(새로 고침)를 눌러 주세요."); helpLoadKb(); return }
  let hits = kbFind(q, 2.2, 4); const prev = HELP_LAST && HELP_LAST.topic;
  const p0 = HELP_LAST && HELP_LAST.es && HELP_LAST.es[0];
  if (q.length <= 14 && /^(더|좀더)?(자세히|자세하게|상세히|풀어서|설명해)/.test(q.replace(/\s+/g, ""))) { if (p0) helpSay(kbCard(p0, [], HELP_LAST.q, false, true), kbLong(p0) ? kbCard(p0, [], HELP_LAST.q) : null); else helpSay("자세히 볼 답이 아직 없습니다. 궁금한 것을 먼저 물어봐 주세요."); return }   // ‘자세히’ → 방금 답을 문단째로
  if (helpCalcLike(q)) { HELP_LAST = { q, es: p0 ? [p0] : [], topic: prev, miss: true }; helpSay(helpCalcHow(q).replace("네, 치수만 적어 주시면", "치수를 ‘가로*세로’(mm)로 적어 주시면").replace("네, 치수와 타일 크기를 적어 주시면", "치수를 ‘가로*세로’(mm)로, 타일 크기와 함께 적어 주시면")); return }   // 치수를 말로 풀어 쓴 계산 부탁: 적는 방법을 보여 준다
  if (!helpFresh(q, hits, p0) && helpFollowKb(q, p0)) return;   // 이어 묻는 말은 방금 답(과 그 주제) 안에서 먼저 푼다. 다른 답이 뚜렷이 맞으면 새 질문으로 본다
  const top = hits[0], rest = hits.slice(1).map(h => h.e);
  if (!helpLoose(q, hits, p0) && helpExact(q, top, hits[1])) { HELP_LAST = { q, es: hits.map(h => h.e), topic: helpTopic(top.e) }; kbSay(top.e, rest, q) }   // 딱 맞는 답만 바로 내고, 애매하면 후보로 보여 준다
  else { const fol = p0 && helpIsFollow(q) ? p0 : null; HELP_LAST = { q, es: p0 ? [p0] : [], topic: prev, miss: true }; helpMiss(q);   // 애매하게 걸린 답은 내밀지 않는다. 방금 답의 소제목·비슷한 내용·검색으로 길을 보여 준다
    const cand = top && top.sc >= 10 ? (fol ? [...hits.filter(h => h.e.s === fol.s), ...hits.filter(h => h.e.s !== fol.s)] : hits) : null;   // 이어 물은 말이면 방금 공정의 답을 후보 앞에 둔다
    const dg = !helpIsAct(q) && top && top.sc >= 10 ? helpDigest(q, kbFind(q, 2.2, 8)) : "";
    helpSay(dg || (helpIsAct(q) ? helpCanDo(q, cand) : helpStuck(q, fol, cand))) }
}
function helpState() {                                // AI 에게 넘기는 지금 견적 상태 (수량·검수만. 금액·단가·원가는 넣지 않는다)
  const steps = STEPS(), st = steps[E.step] || {}, out = [`[지금 견적] ${E.py || "?"}평 · 방 ${E.rooms || "?"} · 욕실 ${E.baths || "?"} · 보고 있는 단계: ${st.label || ""}`];
  try {
    out[0] += ` · 천장 높이 ${woodH()}mm`;
    try { const V = lineVars(R.S), bt = bathDocTxt(); out[0] += `${bt ? " · 욕실 공사 범위" + bt : ""} · 도배 평수 ${(V.s9 || {}).dp || "?"}평 · 바닥 평수 ${(V.s8 || {}).py || "?"}평 · 목작업 로스 ${woodLossPct()}%` } catch (e) { }   // (v72) 회사 기준으로 계산할 때 쓰는 값
    const by = {}; for (const l of R.lines) if (!l.extra && l.qty > 0 && l.step) (by[l.step] = by[l.step] || []).push(`${aliasOf(l.name)} ${l.qty}${l.unit || ""}`);
    const ls = steps.filter(s => by[s.key]).map(s => `${s.key} ${s.label}: ${by[s.key].slice(0, 30).join(", ")}`); if (ls.length) out.push("[켜 둔 공사와 수량]\n" + ls.join("\n"));
    const c = ceilCalc(); if (c.n) out.push(`[목작업 치수 표] ${(E.ceilList || []).filter(r => +r.w > 0).map(r => `${r.kind || "천장"} ${r.name || ""} ${r.w}×${r.h || "천장 높이"}${+r.m > 1 ? " ×" + r.m : ""}`).join(", ")} → 석고보드 ${c.sg}장 · 각재 ${c.dan}단 (로스 ${c.loss}%)`);
    const dm = R.S.list.filter(s => +((E.dim || {})[s.id] || {}).w > 0).map(s => `${s.name} ${E.dim[s.id].w}×${E.dim[s.id].d || "?"}m`); if (dm.length) out.push("[도면 실측] " + dm.slice(0, 14).join(", "));
    const ck = estCheck(steps).filter(x => x.lv < 3).slice(0, 6).map(x => x.t); out.push("[견적 검수] " + (ck.length ? ck.join(" / ") : "걸리는 항목 없음"));
    out.push("[단계 코드] " + steps.map(s => s.key + " " + s.label).join(", "));
  } catch (e) {}
  return out.join("\n");
}
async function helpAi(tier, re) {                     // re = ‘AI에게 다시 묻기’: 배운 답을 건너뛰고 AI 에게 새로 묻는다 (‘더 깊이’ = tier 도 건너뛴다)
  if (!KB_AI || HELP_BUSY || !HELP_LAST) return; const q = HELP_LAST.q, m = { who: "bot", html: '<span class="hdots"><i></i><i></i><i></i></span>' }; HELP_LOG.push(m);
  const ctl = HELP_BUSY = new AbortController(), rel = kbFind(q, 1, 8).map(h => h.e), fol = helpFollowQ(q, !HELP_TURNS.length); let like = ""; helpDraw();   // fol = 앞 대화에 이어 묻는 말 (배운 답을 찾지도, 누구에게나 주는 답으로 쌓지도 않는다) · like = 비슷한 질문에 전에 답한 것 (AI 에게 자료로 넘긴다)
  if (SRV && SRV.me && !fol && !helpIsMore(q)) {     // 회사 저장소의 ‘배운 답’: 전에 AI 가 답해 쌓아 둔 같은 질문이 있으면 그 답을 바로 준다 (AI 를 다시 부르지 않는다 · 누구에게나 같은 답). 없으면 비슷한 질문의 답을 받아 AI 에게 자료로 넘긴다. 3초 안에 못 받으면 그냥 AI 에게 묻는다
    const look = !tier && !re; let L = null;          // ‘더 깊이’·‘AI에게 다시 묻기’는 같은 질문의 답은 찾지 않고 비슷한 답만 받는다
    try { L = await Promise.race([srv("GET", "/api/learn?" + (look ? "q=" + encodeURIComponent(q) + "&like=1" : "like=" + encodeURIComponent(q))), new Promise(ok => setTimeout(ok, 3000))]) } catch (e) { }
    if (ctl.signal.aborted) { m.html = "<small>(멈췄습니다)</small>"; HELP_BUSY = null; helpDraw(); return }
    if (look && L && L.a) try { const es = rel.slice(0, 2), html = helpAiFmt(L.a) + `<p class="hp hn"><small>전에 AI가 답한 내용을 저장해 둔 것입니다 · ${esc(fmtAt(L.at).slice(0, 10))}${L.state === "ok" ? " · 관리자 확인" : ""}</small></p>` + helpFoot("last", { ai: !/자세히|설명해/.test(q), re: q, bad: q });
      m.html = html; HELP_TURNS.push({ role: "user", content: q }, { role: "assistant", content: String(L.a) }); HELP_LAST = { q, es, ai: true, topic: es[0] ? helpTopic(es[0]) : (HELP_LAST && HELP_LAST.topic) }; HELP_BUSY = null; helpDraw(); return } catch (e) { }
    try { if (L && Array.isArray(L.like) && L.like.length) like = ("\n\n[전에 답한 내용] 이 회사 챗봇이 비슷한 질문에 전에 답한 것입니다. 틀린 데가 없으면 이 내용과 어긋나지 않게 답하고, 모자란 부분은 보완합니다. 여기에는 자료 번호를 붙이지 않습니다.\n" + L.like.map(x => "· 질문: " + String(x.q || "") + "\n  답: " + String(x.a || "")).join("\n")).slice(0, 1500) } catch (e) { } }
  const rules = "당신은 한국 아파트 인테리어 시공 회사의 견적 프로그램 안에 있는 챗봇입니다. 상대는 견적을 내는 실장이고, 당신은 이 프로그램과 인테리어 시공을 가장 잘 아는 동료입니다.\n\n"
    + "[답하는 방식 — 반드시 지킬 것]\n"
    + "1. 첫 줄은 핵심 한 문장입니다. 결론·숫자·필요한 것을 바로 말하고, 질문을 되풀이하거나 서론을 쓰지 않습니다. ‘~하는 거네?’, ‘~맞아?’ 같은 확인 질문은 ‘네,’ 또는 ‘아니요,’로 시작합니다.\n"
    + "2. 빈 줄을 하나 두고, 꼭 필요한 내용만 2~5줄로 적습니다. 각 줄은 ‘· 이름: 내용’ 형식으로 한 줄에 하나씩 씁니다(이름은 6자 안팎, 내용은 한 문장). 한 줄로 끝나는 답이면 핵심만 씁니다.\n"
    + "3. 전체는 6줄을 넘기지 않습니다. 인사·맺음말·권유 문장은 쓰지 않습니다. 답을 내는 데 꼭 필요한 값이 빠졌을 때만 마지막 줄에 한 가지를 되묻습니다.\n"
    + "4. 실장이 무엇을 주면 되는지(치수, 도면에서 볼 곳, 정할 것)가 있으면 ‘· 주실 것: …’ 줄로 분명히 적습니다. 대화창에 그대로 적으면 되는 입력 예시는 `거실 2230*5730`처럼 백틱으로 감쌉니다.\n"
    + "5. ‘자세히’, ‘더 설명해 줘’라고 하면 그때만 길게 설명합니다(문단마다 **소제목**으로 시작).\n"
    + "6. 말투는 짧고 친근한 존댓말입니다. 치수는 mm 로 말하고, 현장·제품마다 다르면 그렇게 말합니다.\n\n"
    + "[범위] 견적·수량·시공·프로그램 사용이 먼저지만 인테리어에 관한 것은 모두 답합니다(디자인, 자재 선택, 색, 가구 배치, 관리, 하자, 고객 응대). 금액·단가·원가·마진의 숫자는 말하지 않습니다. 금액을 물으면 ‘회사 내부 방침상 금액 전달은 힘듭니다’라고 한 문장으로 말하고, 어디서 보는지(견적 합계 칸의 그 공정)와 그 공사에 무엇이 들어가는지를 2~3줄로 답합니다. 추천을 물으면 첫 줄에 ‘○○을 추천합니다’라고 결론부터 말합니다.\n\n"
    + "[요구 파악] 답하기 전에 실장이 얻으려는 결과가 무엇인지 먼저 정합니다: ① 수량·치수 계산 ② 프로그램에서 어디를 어떻게 고치는지 ③ 시공 방법·들어가는 품목 ④ 고객에게 할 말. 질문이 여러 뜻으로 읽히면 가장 그럴듯한 뜻으로 바로 답하고, 다른 뜻일 수 있으면 마지막 줄에 한 줄로만 되묻습니다. ‘금액을 얼마에 맞추고 싶다’·‘줄이고 싶다’는 금액을 말해 달라는 것이 아니라 프로그램에서 그렇게 만드는 방법을 묻는 것입니다 — 금액 숫자는 말하지 않되, 어느 줄의 어느 칸(수량·종류·포함 내역)을 고치면 되는지와 그때 따라 바뀌는 것을 구체적으로 답합니다. ‘금액은 답할 수 없습니다’로 끝내지 않습니다. ‘어떻게 시공해?’·‘뭐가 들어가?’에는 순서나 품목을 빠짐없이 짧게 늘어놓습니다.\n\n"
    + "[회사 기준 — 이 프로그램이 실제로 계산하는 방식입니다. 일반 기준과 달라도 수량·로스·인원은 이 숫자로 계산합니다]\n· 타일: 박스 수 = 면적 × 1.2(로스 20%) ÷ 1박스 면적 → 올림. 600각과 300×600은 1박스 1.44㎡(600각 4장), 300각은 0.99㎡(11장). 욕실은 칸마다 벽과 바닥을 따로 올림해서 더합니다.\n· 타일 부자재: 압착시멘트 1포(20kg) = 600각 바닥 2㎡ · 300각 4㎡ · 600각 벽 3㎡ / 타일본드 1통 = 6㎡ / 줄눈 1포 = 600각 10㎡ · 300각 6㎡ / 욕실 바닥 몰탈 = ㎡당 1.3포.\n· 도배: 도배 평수 = 아파트 평형 × 2.5 (34평이면 85평). 벽지 1롤 = 5평. 작업 인원 = 실크는 도배 평수 ÷ 15, 합지는 ÷ 20.\n· 바닥: 장판과 강마루는 아파트 평수 그대로 받습니다. 장판 작업 인원은 35평까지 1명, 35평이 넘으면 2명. 4.5T·5T 장판은 평당 시공비, 강마루는 시공비가 바닥재 금액에 들어 있습니다. 돌마루·데코타일은 실제 까는 넓이 + 로스 7%, 90㎡에 1명 + 여유 1명.\n· 목공: 석고보드 = 면적 ÷ 1.62(장), 각재 = 석고보드 1장당 3개이고 12개가 1단.\n· 욕실: 욕실마다 공사 범위(전체 교체 · 덧방 · 도기·수전만 · 안 함)를 고릅니다. 철거·방수는 ‘전체 교체’ 칸만, 타일·천장은 전체 교체와 덧방 칸만 들어갑니다.\n· 기본 공사: 실크 도배 · 장판 · 부분 철거 · 욕실 덧방으로, 가장 가성비 있게 잡는 구성입니다(공사 유형 ‘기본 리모델링’ + 욕실 공사 범위 ‘덧방’).\n· 시공 방법: 회사 교육자료의 FM 방식이 기준입니다. 일반 자료와 다르면 FM 방식으로 답합니다. 욕실 벽 방수는 바닥에서 허리 높이인 1,200~1,500mm까지 올립니다(정해진 시방 수치는 없습니다). 벽 타일은 에폭시를 점으로 5~9개 찍어 붙이고, 바닥과 물이 고이는 샤워 구역 아래쪽은 빈 곳 없이 붙입니다. 담수 테스트는 물을 2~3cm 채워 24~48시간 봅니다.\n\n"
    + "[프로그램에서 고치는 법]\n· 수량: 공사 줄의 수량 칸을 고칩니다. ‘↺’를 누르면 자동 수량으로 돌아갑니다.\n· 부자재·세트 줄(타일 부자재 · 도배 부자재 · 목공 자재 묶음): 수량을 고치면 금액과 ‘포함 내역’(품목별 쓰는 양)이 같은 비율로 함께 바뀝니다. 금액을 어떤 값에 맞추려면 그 줄의 수량을 올리거나 내려 금액 칸이 그 값이 되게 하고, 그때 포함 내역에 나오는 수량을 품목별 답으로 삼습니다. 포함 내역의 품목 수량을 하나씩 직접 고칠 수도 있습니다.\n· 종류(자재 등급): 줄의 종류 칸에서 고르면 금액이 바로 바뀝니다. 여러 종류를 나란히 보려면 ‘비교견적’을 씁니다.\n· 평수: 도배는 ‘도배 평수’ 칸, 바닥은 ‘평수’ 칸 하나만 넣으면 자재·부자재·작업비·식대가 계산됩니다.\n· 욕실 공사 범위: ‘현장 정보 → 공간’에서 욕실마다 고릅니다. 욕실 타일은 욕실마다 벽·바닥 줄이 따로 있어 줄마다 수량·종류·치수를 넣습니다.\n· 합계에서 빼고 따로 보여 줄 것은 줄의 ‘옵션’. 기본 단가는 관리자만 바꿉니다.\n\n"
    + "[명령] 실장의 말이 아래 일 가운데 하나를 뜻하면, 설명하지 말고 [명령:문장] 한 줄만 답하세요. 프로그램이 그 문장을 실행해 결과를 보여 줍니다. 문장은 아래 보기의 형태를 그대로 쓰고 치수·이름·숫자만 실장이 말한 값으로 바꿉니다. 치수가 필요한데 실장이 주지 않았으면 명령을 쓰지 말고 어떤 치수가 필요한지 한 줄로 물으세요.\n· 치수 계산: [명령:거실 4500*3600, 안방 3300*3000 로스 15%] / 벽 [명령:가벽 3000*2300 양면] / 타일 [명령:욕실 바닥 1500*2200 타일 300각] / 도면 치수 그대로 [명령:도면 치수로 천장 석고보드 계산]\n· 방금 계산 고치기: [명령:다른 치수로] [명령:로스 15%로] [명령:작은방도 2550*2400] [명령:안방은 빼줘] [명령:양면으로] [명령:왜 이렇게 나왔어?] [명령:몇 평이야?] [명령:안방 치수를 3500*3000으로 바꿔줘] [명령:거실만 계산해줘] [명령:로스 없이]\n· 예시(연습용 치수. 예시·샘플·아무 치수나 달라고 하면 치수를 되묻지 말고 이 명령을 씁니다): [명령:목작업 치수 예시로 계산] [명령:가벽 치수 예시로 계산] [명령:타일 예시로 계산] [명령:예시 치수 표에 넣어줘] [명령:다른 예시로 계산]\n· 목작업 치수 표: [명령:넣어줘] [명령:바꿔 넣어줘] [명령:방금 넣은 거 빼줘] [명령:치수 표에 뭐 들어 있어?] [명령:치수 표 모두 비워줘]\n· 지금 견적: [명령:뭐 안 했지?] [명령:욕실에서 빠진 거 있어?] [명령:지금 견적 요약해줘] [명령:지금 견적에 석고보드 몇 장 들어가?] [명령:이 단계에서 뭐 해야 해?]\n· 이동·공사 켜기: [명령:목공 단계로 가줘] [명령:견적서 보여줘] [명령:가벽 켜줘] [명령:천장 몰딩 꺼줘] [명령:젠다이 어디서 넣어?]\n· 공사 체크(실장이 무엇을 하겠다·안 하겠다고 말하면 그 공사를 켜고 끕니다. 실장의 말을 그대로 넣습니다): [명령:거실 아트월이랑 중천장, 상하부 몰딩 작업할거야] [명령:발코니 탄성코트 작업할거야] [명령:거실 다운라이트 6개 추가해줘] [명령:문선 몰딩은 안 할거야] [명령:바닥재 강마루로 바꿔줘] [명령:걸레받이 40개로 바꿔줘] [명령:걸레받이 수량 원래대로]\n· 저장·출력: [명령:견적 저장해줘] [명령:저장된 견적 열어줘] [명령:견적서 인쇄해줘] [명령:엑셀로 복사해줘] [명령:견적 파일 내보내줘]\n· 견적 새로 만들기(○○평 기본 인테리어·전체 리모델링·도배 장판만·욕실만·주방만 하면 얼마나 드는지 묻거나 그런 견적을 만들어 달라고 하면, 설명하지 말고 새 견적을 만듭니다. 평수·방·욕실 수는 실장이 말한 값으로): [명령:32평 기본 공사 견적 만들어줘] [명령:34평 전체 리모델링 견적 만들어줘] [명령:24평 도배 장판만 견적 만들어줘] [명령:욕실만 견적 만들어줘] [명령:33평 전체 리모델링 방3 욕실2 욕실 덧방 견적 만들어줘]\n\n"
    + "[프로그램 안내] 아래 [지금 견적]의 수량·검수 내용은 이 실장이 지금 보고 있는 실제 값이니 그대로 인용해도 됩니다. 프로그램의 어느 단계에서 하는 일이면 답 맨 끝에 [이동:s4]처럼 단계 코드를 한 번 붙이세요(그 단계로 가는 버튼이 됩니다).\n\n"
    + "[근거] 아래 [자료]에 있는 내용은 그 기준을 우선하고, 자료를 근거로 쓴 줄 끝에는 [12]처럼 자료 번호만 붙입니다. 자료에 없는 내용은 일반 지식으로 답하되 맨 끝 줄에 ‘※ 일반 기준이니 현장에서 확인하세요.’를 붙입니다. ‘자료’, ‘답변집’이라는 말은 답에 쓰지 않습니다.\n\n[자료]\n"
    + (rel.map(e => `${e.n}. ${e.q}\n${kbText(e)}`).join("\n\n") || "(관련 항목 없음)") + like + "\n\n" + helpState();
  try {
    const { text, truncated } = await KB_AI([{ role: "user", content: rules }, ...HELP_TURNS.slice(-6), { role: "user", content: q }], { cache: false, modelTier: tier || "quick", signal: ctl.signal, onText: ({ text }) => { m.html = (/^\s*\[명령/.test(text) ? "" : helpAiFmt(text)) || '<span class="hdots"><i></i><i></i><i></i></span>'; helpDraw(true) } });
    const cm = text.match(/\[명령:\s*([^\]\n]{1,90})\]/); if (cm) { let own = null; try { own = helpDo(cm[1].trim()) } catch (e) {}   // AI 가 고른 프로그램 기능을 실행한다
      if (own) { const a = helpReqs(), i = a.indexOf(q); if (i >= 0) { a.splice(i, 1); store.set("sido3_help_miss", a) } }
      m.html = own || helpAiFmt(text) || "그 일은 실행하지 못했습니다. 치수나 공사 이름을 조금 더 구체적으로 적어 주세요.";
      HELP_TURNS.push({ role: "user", content: q }, { role: "assistant", content: helpTxt(m.html).slice(0, 700) }); HELP_LAST = { q, es: [], own: true, topic: HELP_LAST && HELP_LAST.topic }; HELP_BUSY = null; helpDraw(); return }
    const used = [...new Set([...text.matchAll(/\[(\d+)\]/g)].map(x => +x[1]))].map(n => KB.find(e => e.n === n)).filter(Boolean), es = used.length ? used : rel.slice(0, 2);
    m.html = helpAiFmt(text) + (truncated ? "<br><small>(답이 길어 잘렸습니다)</small>" : "") + helpFoot("last", { ai: !/자세히|설명해/.test(q), deep: !tier, bad: q });
    HELP_TURNS.push({ role: "user", content: q }, { role: "assistant", content: text }); HELP_LAST = { q, es, ai: true, topic: es[0] ? helpTopic(es[0]) : (HELP_LAST && HELP_LAST.topic) };
    try { if (SRV && SRV.me && !truncated && text.trim() && !helpIsMore(q)) srv("PUT", "/api/learn", { q, a: text.replace(/\s*\[\d+\]/g, "").trim(), gen: !fol && helpGen(q, text) }).catch(() => {}) } catch (e) { }   // 방금 답을 회사 저장소의 ‘배운 답’으로 쌓는다 (질문·답 글만 · 자료 번호 [12] 는 뺀다 · 잘린 답 · 프로그램 명령 · ‘자세히’로 풀어 준 답은 쌓지 않는다). gen = 앞 대화에 이어 묻는 말이 아니고 지금 견적에 기대지 않는 답 → 같은 질문에 바로 다시 쓴다. 쌓지 못해도 답은 그대로 보여 준다
  } catch (e) { const c = e && e.code;
    if (c === "cancelled") m.html = (e.text ? helpAiFmt(e.text) + "<br>" : "") + "<small>(멈췄습니다)</small>";
    else { if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"].includes(c)) KB_AI = null;
      m.html = c === "day_limit" ? "오늘 쓸 수 있는 AI 답변 횟수를 다 썼습니다. 저장된 내용으로 답합니다." : c === "rate_limited" ? "지금은 답변이 몰려 있어 저장된 내용으로 답합니다." : c === "session_expired" ? "클로드 로그인이 풀려 저장된 내용으로 답합니다." : "지금은 저장된 내용으로 답합니다."; HELP_BUSY = null; helpLocal(q); return } }
  HELP_BUSY = null; helpDraw();
}
document.head.insertAdjacentHTML("beforeend", `<style>
#helpFab{position:fixed;right:16px;bottom:78px;z-index:88;display:flex;align-items:center;gap:7px;height:46px;padding:0 17px 0 14px;border-radius:23px;border:0;background:var(--accent);color:var(--accent-ink);box-shadow:0 8px 20px rgba(0,0,0,.28);cursor:pointer;font:inherit;font-weight:700;font-size:15px}
#helpFab{touch-action:none;user-select:none}#helpFab[hidden]{display:none}#helpFab svg{width:20px;height:20px}
#helpWin{position:fixed;right:12px;bottom:72px;z-index:90;width:380px;height:580px;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;box-shadow:0 18px 48px rgba(0,0,0,.32);border:1px solid var(--line);background:var(--panel);color:var(--ink);--hf:13px}
#helpWin[hidden]{display:none}
#helpWin .hbx{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-top:8px}#helpWin .hbx.in{margin-top:0}
#helpWin .hbx>i{font-style:normal;font-size:calc(var(--hf) - 2px);opacity:.6;margin-right:2px}
#helpWin .hty{font-size:calc(var(--hf) - 2px);color:var(--muted);margin:0 0 5px;line-height:1.5}#helpWin .hty i{font-style:normal;font-weight:700;color:var(--accent-ink);background:var(--accent);border-radius:99px;padding:1px 9px;margin-right:6px}
#helpWin .hk small.hwy{display:block;margin-top:4px;line-height:1.5}
#helpWin .hhd{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;margin:0 0 6px;font-weight:800;font-size:calc(var(--hf) + 2px);line-height:1.4}#helpWin .hhd i{font-style:normal;font-weight:700;font-size:calc(var(--hf) - 2px);color:var(--accent-ink);background:var(--accent);border-radius:99px;padding:1px 9px}#helpWin .hhd b{color:var(--accent);font-size:calc(var(--hf) + 7px);line-height:1.1}
#helpWin .hbx.hrc{margin-top:9px}#helpWin .hch.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}#helpWin .hch.add{border-style:dashed;border-color:var(--accent);color:var(--accent);font-weight:700;background:var(--panel)}#helpWin .hrn{font-size:calc(var(--hf) - 3px);color:var(--muted);margin-top:4px}
#helpWin .hch{display:inline-block;padding:3px 9px;border-radius:99px;border:1px solid var(--line);background:var(--soft);font-size:calc(var(--hf) - 1px);cursor:pointer;line-height:1.5}
#helpWin .hch:hover{border-color:var(--accent)}#helpWin .hch.all{border-style:dashed;color:var(--accent)}#helpWin .hch small{opacity:.6}
#helpWin .hbr{cursor:pointer;text-decoration:underline dotted;text-underline-offset:3px}
.wplan svg{width:100%;height:auto;display:block;max-width:760px;background:#fff;border:1px solid var(--line);border-radius:8px}.wplanbox{margin:10px 0;border:1px solid var(--line);border-radius:10px;padding:8px 12px}.wplanbox summary{cursor:pointer;font-weight:700}.wplanbox[open] summary{margin-bottom:8px}
#helpWin .hw{margin-top:8px;padding:7px 9px;border-radius:8px;background:rgba(214,150,0,.14);font-size:calc(var(--hf) - 1px);line-height:1.5}
#helpWin .hpl{margin-top:8px}#helpWin .hpl small{display:block;opacity:.7;margin-bottom:3px}#helpWin .hpl svg{width:100%;height:auto;display:block;border:1px solid var(--line);border-radius:8px;background:#fff}
#helpWin .hh{display:flex;align-items:center;gap:8px;padding:11px 12px 11px 34px;background:var(--accent);color:var(--accent-ink)}#helpWin .hh b{font-size:calc(var(--hf) + 3px)}
#helpWin .hh span{flex:1;min-width:0;font-size:calc(var(--hf) - 1px);opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#helpWin .hh span button{border:0;background:rgba(255,255,255,.22);color:inherit;border-radius:99px;padding:2px 9px;font:inherit;cursor:pointer;margin-left:4px}
#helpWin .hx{border:0;background:none;font-size:calc(var(--hf) + 9px);line-height:1;cursor:pointer;color:inherit;padding:0 4px}
#helpWin .hz{position:absolute;left:0;top:0;width:28px;height:28px;cursor:nwse-resize;touch-action:none;z-index:2;background:linear-gradient(135deg,rgba(255,255,255,.85) 0 4px,transparent 4px 7px,rgba(255,255,255,.85) 7px 10px,transparent 10px 13px,rgba(255,255,255,.85) 13px 15px,transparent 15px)}
#helpBody{flex:1;overflow:auto;padding:14px 12px;display:flex;flex-direction:column;gap:12px;background:var(--soft)}
#helpWin .hr{display:flex;gap:8px;align-items:flex-start}#helpWin .hr.me{justify-content:flex-end}
#helpWin .av{flex:0 0 auto;width:30px;height:30px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center}#helpWin .av svg{width:16px;height:16px}
#helpWin .hbub{max-width:86%;padding:10px 13px;border-radius:4px 14px 14px 14px;font-size:var(--hf);line-height:1.65;background:var(--panel);color:var(--ink);border:1px solid var(--line);word-break:break-word}
#helpWin .hr.me .hbub{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);border-radius:14px 4px 14px 14px}
#helpWin .hbub a{color:inherit;text-decoration:underline}#helpWin .hbub small{color:var(--muted)}
#helpWin .hq0{display:block;font-size:calc(var(--hf) - 2px);color:var(--muted);margin-bottom:4px}
#helpWin .hk{border-left:3px solid var(--accent);background:var(--soft);border-radius:0 8px 8px 0;padding:8px 11px;margin:1px 0 2px;font-weight:700;line-height:1.55}
#helpWin .hp{margin:10px 0 0;line-height:1.65}#helpWin .hp.h0{margin:0 0 8px;color:var(--muted)}#helpWin .hp.hn{color:var(--muted)}#helpWin .hp b{color:var(--accent)}
#helpWin .hm{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:8px;font-size:calc(var(--hf) - 2px)}#helpWin .hbub .lk.in{display:inline;text-align:left;white-space:normal;padding:0;color:inherit;font-size:inherit;font-weight:700;border:0;background:none;text-decoration:underline;cursor:pointer;font-family:inherit}
#helpWin .hm button,#helpChips button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:4px 10px;font:inherit;font-size:calc(var(--hf) - 1px);cursor:pointer;white-space:nowrap}
#helpWin .hm button.lk{border:0;background:none;color:var(--muted);text-decoration:underline;padding:4px 3px}
#helpWin .hhome p{margin:0;font-size:var(--hf);line-height:1.65}#helpWin .hhome .hint{font-size:calc(var(--hf) - 2px);color:var(--muted)}
#helpWin .hgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:12px 0}
#helpWin .hgrid button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:12px;text-align:left;padding:9px 11px;font:inherit;font-size:calc(var(--hf) - 1px);line-height:1.45;cursor:pointer}
#helpWin .hgrid small{display:block;color:var(--accent);font-weight:700;font-size:calc(var(--hf) - 3px);margin-bottom:2px}
#helpChips{display:flex;gap:5px;overflow-x:auto;padding:8px 10px;border-top:1px solid var(--line);background:var(--panel);scrollbar-width:none}#helpChips::-webkit-scrollbar{display:none}#helpChips:empty{display:none}
#helpForm{display:flex;gap:7px;padding:9px 10px 11px;background:var(--panel)}
#helpQ{flex:1;min-width:0;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font:inherit;font-size:calc(var(--hf) + 1px);background:var(--panel);color:var(--ink)}
#helpSend{border:0;border-radius:12px;background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:700;font-size:var(--hf);padding:0 15px;cursor:pointer}
#helpWin .hdots i{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--muted);margin-right:4px;animation:hdot 1s infinite}#helpWin .hdots i:nth-child(2){animation-delay:.15s}#helpWin .hdots i:nth-child(3){animation-delay:.3s}
@keyframes hdot{0%,80%,100%{opacity:.25}40%{opacity:1}}
#helpWin .hk b{color:var(--accent)}#helpWin .hk small{font-weight:400;color:var(--muted)}#helpWin .hk em{display:block;font-style:normal;color:var(--accent);font-size:calc(var(--hf) - 2px);margin-bottom:2px}
#helpWin .hl{margin-top:8px;line-height:1.6;padding-left:9px;border-left:2px solid var(--line)}#helpWin .hl>b{color:var(--accent);font-weight:700;margin-right:7px}#helpWin .hl>i{font-style:normal;color:var(--accent);margin-right:6px}
#helpWin code{font:inherit;background:var(--soft);border:1px dashed var(--accent);border-radius:6px;padding:1px 6px;cursor:pointer;white-space:normal;word-break:break-all}
#helpWin .hbub .hs{display:inline-flex;flex-wrap:wrap;gap:5px}#helpWin .hbub .hs a{border:1px solid var(--line);border-radius:99px;padding:3px 11px;text-decoration:none;background:var(--panel);color:var(--ink)}
#helpWin .hm button[data-helpadd],#helpWin .hm button[data-goto]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);font-weight:700;white-space:normal}
#helpWin .hm button.alt{background:var(--panel);color:var(--accent)}#helpWin .hl code{margin-right:4px}
#helpWin .hl button.lk{border:0;background:none;color:var(--muted);text-decoration:underline;padding:0 2px;font:inherit;cursor:pointer}
#helpWin .hl button:not(.lk){border:1px solid var(--accent);background:var(--panel);color:var(--accent);border-radius:99px;padding:3px 11px;font:inherit;font-weight:700;cursor:pointer}
@media print{#helpFab,#helpWin{display:none!important}}
</style>`);
document.body.insertAdjacentHTML("beforeend", `<button id="helpFab" type="button" aria-label="챗봇 열기" title="궁금한 것을 물어보세요 (가리면 끌어서 옮길 수 있습니다)"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.7 21l3.9-2.3c.8.2 1.6.3 2.4.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg>챗봇</button>
<div id="helpWin" hidden role="dialog" aria-label="챗봇"><div class="hz" data-helpsize title="끌어서 창과 글자를 크게·작게"></div><div class="hh"><b>챗봇</b><span id="helpNote"></span><button type="button" class="hx" data-helpclose aria-label="닫기">×</button></div>
<div id="helpBody"></div><form id="helpForm"><input id="helpQ" placeholder="질문이나 치수를 적어 보세요" autocomplete="off"><button id="helpSend" type="submit">보내기</button></form></div>`);
let HELP_FD = null, HELP_FT = 0;                      // 챗봇 버튼 끌기 · 끈 직후의 클릭은 열기로 치지 않는다
const helpFabPos = p => { const f = document.getElementById("helpFab"); if (!f || !p) return; f.style.right = Math.max(4, Math.min(innerWidth - 60, p.r)) + "px"; f.style.bottom = Math.max(4, Math.min(innerHeight - 56, p.b)) + "px" };
helpFabPos(store.get("sido3_help_pos", null));
document.addEventListener("pointerdown", ev0 => { const f = ev0.target.closest && ev0.target.closest("#helpFab"); if (!f || ev0.button > 0) return; const r = f.getBoundingClientRect(); HELP_FD = { x: ev0.clientX, y: ev0.clientY, r: innerWidth - r.right, b: innerHeight - r.bottom, moved: false, cur: null }; try { f.setPointerCapture(ev0.pointerId) } catch (e) {} });
document.addEventListener("pointermove", ev0 => { const d = HELP_FD; if (!d) return; if (!d.moved && Math.hypot(ev0.clientX - d.x, ev0.clientY - d.y) < 6) return; d.moved = true; d.cur = { r: d.r - (ev0.clientX - d.x), b: d.b - (ev0.clientY - d.y) }; helpFabPos(d.cur) });
const helpFabEnd = () => { const d = HELP_FD; if (!d) return; HELP_FD = null; if (d.moved && d.cur) { HELP_FT = Date.now(); const f = document.getElementById("helpFab"); store.set("sido3_help_pos", { r: parseFloat(f.style.right) || 16, b: parseFloat(f.style.bottom) || 78 }) } };
document.addEventListener("pointerup", helpFabEnd); document.addEventListener("pointercancel", helpFabEnd);
document.addEventListener("pointerdown", ev0 => { const z = ev0.target.closest && ev0.target.closest("[data-helpsize]"); if (!z) return; const r = document.getElementById("helpWin").getBoundingClientRect(); HELP_RS = { x: ev0.clientX, y: ev0.clientY, w: r.width, h: r.height, cur: null }; ev0.preventDefault(); try { z.setPointerCapture(ev0.pointerId) } catch (e) {} });
document.addEventListener("pointermove", ev0 => { const d = HELP_RS; if (!d) return; d.cur = helpSize(d.w + (d.x - ev0.clientX), d.h + (d.y - ev0.clientY)) });
const helpRsEnd = () => { const d = HELP_RS; if (!d) return; HELP_RS = null; if (d.cur) store.set("sido3_help_size", d.cur) };
document.addEventListener("pointerup", helpRsEnd); document.addEventListener("pointercancel", helpRsEnd);
window.addEventListener("resize", () => { if (HELP_OPEN) helpSize() });
document.addEventListener("click", ev0 => {
  const t = ev0.target; if (!t.closest) return; const go = t.closest("[data-helpgo]"), sr = t.closest("[data-helpsrc]");
  if (t.closest("#helpFab")) { if (Date.now() - HELP_FT < 400) return; HELP_OPEN = true; if (!KB.length) helpLoadKb(); if (!HELP_LOG.length) HELP_LOG.push({ who: "bot", html: "안녕하세요. 궁금한 것을 묻거나 치수를 적어 주세요. 바로 답하고 계산합니다." }); helpDraw(); const q = document.getElementById("helpQ"); if (q) q.focus() }
  else if (t.closest("[data-helpclose]")) { HELP_OPEN = false; helpDraw() }
  else if (go) { const e = KB.find(x => x.n === +go.dataset.helpgo); if (e) helpShow(e) }
  else if (sr) { const es = sr.dataset.helpsrc === "last" ? (HELP_LAST || { es: [] }).es : KB.filter(x => x.n === +sr.dataset.helpsrc); HELP_LOG.push({ who: "bot", html: kbSrc(es, sr.dataset.helpsrc === "last") }); helpDraw() }
  else if (t.closest("[data-helpmore]")) { const r = t.closest("[data-hi]"), m = r && HELP_LOG[+r.dataset.hi]; if (m && m.alt) { const x = m.html; m.html = m.alt; m.alt = x; helpDraw(2) } }   // 자세히 ↔ 간단히
  else if (t.closest("[data-helpsay]")) { if (!HELP_BUSY) helpSend(t.closest("[data-helpsay]").dataset.helpsay) }
  else if (t.closest("[data-helpfill]")) { const q = document.getElementById("helpQ"); q.value = t.closest("[data-helpfill]").textContent; q.focus() }   // 입력 예시를 누르면 입력 칸에 들어간다
  else if (t.closest("[data-helpadd]")) helpSay(helpAddWood(t.closest("[data-helpadd]").dataset.helpadd || "add"));
  else if (t.closest("[data-helpundo]")) helpSay(helpUndoWood());
  else if (t.closest("[data-helpline]")) helpSay(helpLineSet(t.closest("[data-helpline]").dataset.helpline));
  else if (t.closest("[data-helpalt]")) helpSay(helpAltSet(t.closest("[data-helpalt]").dataset.helpalt));
  else if (t.closest("[data-helpwk]")) helpSay(helpWorkBtn(t.closest("[data-helpwk]").dataset.helpwk));
  else if (t.closest("[data-helpmap]")) { const [k, g] = t.closest("[data-helpmap]").dataset.helpmap.split("|"); helpSay(helpMap(k, g)) }
  else if (t.closest("[data-helppar]")) { const [n, i] = t.closest("[data-helppar]").dataset.helppar.split("|"), e = KB.find(x => x.n === +n); if (e) { HELP_LAST = { q: e.q, es: [e], topic: helpTopic(e) }; kbSay(e, [], "", false, +i) } }
  else if (t.closest("[data-helpfind]")) { if (HELP_LAST) { HELP_LOG.push({ who: "bot", html: helpRow("웹 검색", helpFindLinks(HELP_LAST.q)) }); helpDraw() } }
  else if (t.closest("[data-helpai]")) helpAi();
  else if (t.closest("[data-helpdeep]")) { HELP_TURNS.splice(-2, 2); helpAi("default") }
  else if (t.closest("[data-helpre]")) { const q = t.closest("[data-helpre]").dataset.helpre, n = HELP_TURNS.length; if (!q || HELP_BUSY || !KB_AI) return;   // 배운 답 대신 AI 에게 새로 묻는다: 그 질문을 다시 세우고, 방금 주고받은 것이 그 질문이면 대화 맥락에서 빼고 묻는다
    if (!HELP_LAST || HELP_LAST.q !== q) { HELP_LOG.push({ who: "me", html: esc(q) }); HELP_LAST = { q, es: [], topic: HELP_LAST && HELP_LAST.topic } } else if (n >= 2 && HELP_TURNS[n - 2].content === q) HELP_TURNS.splice(-2, 2);
    helpAi("", true) }
  else if (t.closest("[data-helpbad]")) { const bq = t.closest("[data-helpbad]").dataset.helpbad || "", on = !!(bq && SRV && SRV.me); if (bq || HELP_LAST) helpMiss(bq || HELP_LAST.q, "보완");
    try { if (on) srv("PUT", "/api/learn", { q: bq, bad: true }).catch(() => {}) } catch (e) { }   // AI 가 답한 질문이면 회사 저장소에 쌓아 둔 그 답에도 ‘부족’ 표시를 한다 → 검토 전 답은 다음에 AI 가 새로 답해 바꾸고, 관리자가 확인한 답은 관리자 화면에 횟수가 보인다
    helpSay("알겠습니다, 보완 요청으로 남겨 두었어요. 어떤 점이 부족했는지 ‘추가: …’로 적어 주시면 더 정확히 채울 수 있습니다." + (on ? " 쌓아 둔 답에도 ‘부족’ 표시를 남겼습니다(관리자가 확인하지 않은 답이면 다음에는 AI가 새로 답합니다)." : "")) }
  else if (t.closest("[data-helpmiss]")) { const a = helpReqs(), f = helpFreq(); HELP_LOG.push({ who: "bot", html: "<b>요청 목록</b> <small>(답을 못 드린 질문 · 보완 요청 · 추가 요청)</small><br>" + a.map(x => "· " + esc(x)).join("<br>") + (f.length ? "<br><br><b>많이 물은 질문</b><br>" + f.map(x => `· ${esc(x.q)} <small>${x.n}번</small>`).join("<br>") : "") + '<div class="hm"><button type="button" data-helpmisscopy>목록 복사</button><button type="button" class="lk" data-helpmissclear>목록 비우기</button></div>' }); helpDraw() }
  else if (t.closest("[data-helpmisscopy]")) { const f = helpFreq(), txt = helpReqs().join("\n") + (f.length ? "\n\n[많이 물은 질문]\n" + f.map(x => `${x.q} (${x.n}번)`).join("\n") : ""); (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("요청 목록을 복사했습니다. 클로드에게 붙여 넣으면 답을 채웁니다."), () => toast("복사하지 못했습니다. 목록을 끌어서 직접 복사해 주세요.")) }
  else if (t.closest("[data-helpmissclear]")) { store.set("sido3_help_miss", []); helpDraw() }
});
document.addEventListener("submit", ev0 => { if (ev0.target.id !== "helpForm") return; ev0.preventDefault(); if (HELP_BUSY) { HELP_BUSY.abort(); return } const q = document.getElementById("helpQ"); helpSend(q.value); q.value = ""; q.focus() });
document.addEventListener("keydown", ev0 => { if (ev0.key === "Escape" && HELP_OPEN && ev0.target.closest && ev0.target.closest("#helpWin")) { HELP_OPEN = false; helpDraw() } });
let HELP_KBN = 0;
const HELP_BASE = /^https?:$/.test(location.protocol) ? (location.pathname.match(/^\/s\/[A-Za-z0-9]+\//) || [""])[0] : "";   // 회사 주소로 열었을 때 프로그램 파일이 있는 자리. 주소 칸의 주소를 나중에 줄여도(로그인 열쇠 감추기) 답 파일은 여기서 불러온다
function helpLoadKb() { const use = () => { KB = (window.SIDO_KB || []).map((e, k) => ({ ...e, a: e.a || kbText(e), n: k + 1 })); helpDraw() };
  if ((window.SIDO_KB || []).length) { use(); return }   // 한 파일로 묶은 판은 답이 이미 들어 있다
  const s = document.createElement("script"); s.src = HELP_BASE + "kb.js" + (HELP_KBN++ ? "?t=" + Date.now() : FRONT && FRONT.kb ? "?v=" + FRONT.kb : ""); s.onload = use; document.head.appendChild(s) }
helpLoadKb();
if (window.claude && typeof window.claude.use === "function") window.claude.use("sample").then(s => { KB_AI = s || null; helpDraw() }).catch(() => {});
const HIDE_ITEMS = ["실크 도배 (평당)", "고급 실크 도배 (평당)", "합지 도배 (평당)", "목자재 납품", "부자재 및 장비대", "사다리차 (8층 이하)", "사다리차 (10층 이상)",
  "장판 2.2T (LX 자연애 등)", "장판 1.8T", "장판 2.7T", "장판 3.2T", "장판 4.5T", "장판 5T", "장판 1.8T (저가형)", "장판 2.2T", "장판 2.7T (중급형)", "장판 3.2T (고급형)", "장판 4.5T/5T", "장판 2.0T", "장판 4.5T/시공평당13,000원", "장판 5T/시공 평당 15,000원"];   // 옛 장판 품목(㎡ 단가 · 이름에 시공 원가가 적힌 것)도 감춘다 — 바닥재 줄에서 고른다   // 더 쓰지 않아 ‘목록에 없는 품목’에서 감추는 품목
const HIDE_LINES = ["lightBox", "tvBox", "hidden", "flatWall", "light"];   // 화면에서 감추는 공사 줄 id (켜져 있는 견적에서는 보인다). 사용자가 필요 없다고 한 줄을 더한다
const CAT_OPEN = {};                                 // 카드 펼침 상태 (체크 여부와 따로). 하나를 펼치면 같은 단계의 다른 카드는 접힌다
function openCat(k) { const sk = k.split("|")[0]; for (const x in CAT_OPEN) if (x.startsWith(sk + "|")) CAT_OPEN[x] = false; CAT_OPEN[k] = true }
/* (v75) 묶음 카드 안에서 바로 항목 추가 — 사용자(2026-11-20): “필요한 내용에서는 작업내용을 바로 더 추가할 수 있게 … 해당 선택사항에서 작업이 안 되면 공정에서 추가해야 하는데 너무 많이 보여서 보기 힘들잖아.
   창호 배관 목공 바닥 욕실 필름 등 여러 공정에서 세부적으로 봤을 때도 선택하고 추가할 수 있게 … 카테고리별로” · “전공정 다”.
   직접 넣은 줄(E.extras)에 cat = "단계|묶음" 을 적는다(cat = "" 은 ‘묶음에 없는 항목’). cat 이 없는 옛 줄은 이름으로 묶음을 어림한다(화면에서만 — 견적 내용은 그대로).
   묶음 카드는 그 줄을 자기 금액에 더해 보여 주고, 펼치면 맨 아래 ‘＋ 항목 추가’(그 묶음에 자주 넣는 것 · 품목 찾기 · 직접 입력)가 있다. 단계 맨 아래에는 어느 묶음에도 맞지 않는 것만 남는다. */
document.head.insertAdjacentHTML("beforeend", `<style>.catadd{margin:6px 14px 12px;padding:10px 12px;border:1px dashed var(--line);border-radius:10px;background:var(--panel)}
.catadd .cah{font-weight:700;margin:0 0 6px}.catadd .tbl{margin:0 0 10px}.catadd .car{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.catadd .car>b{margin-right:4px}
.catadd .car input.search{flex:1 1 200px;max-width:320px;margin:0}.catadd .cfout{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.catadd .cfout:empty{display:none}
.catadd .cnote{margin-top:6px}.cs1.cx b:before{content:"＋ ";color:var(--accent)}</style>`);
function catKw(sk) {                                  // 묶음마다의 낱말 (위에서부터 먼저 맞는 묶음) — 직접 넣은 줄·빠른 추가 단추가 어느 묶음 것인지 가린다
  return (catKw.t = catKw.t || {
    s1: [["ladder", /사다리/], ["permit", /행위허가|확장 신고/], ["waste", /폐기물|폐자재|쓰레기|반출/], ["demo", /철거|샌딩|해체|떼기/], ["prep", /보양|신고|엘리베이터|양중|운반|민원|동의서|안내문/]],
    s2: [["turning", /터닝/], ["expand", /확장|단열|날개벽/], ["window", /샷시|샤시|창|방충망|실리콘|유리/]],
    s3: [["water", /방수/], ["ac", /에어컨|실외기|냉매/], ["heat", /보일러|난방|분배기|온도조절|온수/], ["pipe", /수전|배수|배관|급수|트랩|수도|하수|세탁|젠다이|미장|누수|엑셀/]],
    s4: [["mold", /몰딩|걸레받이|문선/], ["w_wall", /가벽/], ["w_curtainBox", /커튼/], ["w_lightBox", /등박스|간접/], ["w_artwall", /아트월/], ["w_insul", /단열/], ["w_shelf", /선반/], ["w_arch", /아치/], ["w_hidden", /히든|문틀/], ["w_wellCeil", /우물/], ["w_flatCeil", /천장/], ["w_tvBox", /TV|매립박스|보강/], ["w_flatWall", /평탄/], ["wood", /목수|각재|석고|합판|MDF|목자재/]],
    s5: [["switch", /스위치|콘센트|단자|회로|분전|차단기|배선/], ["safety", /인터폰|소화기|감지기|도어폰/], ["ldown", /매입등|다운라이트/], ["lline", /라인|레일|마그네틱|T5|간접|디밍/], ["lbase", /거실등|방등|주방등|식탁등|펜던트|실링팬/], ["lcommon", /센서등|직부등|욕실등|조명|등\s*추가/], ["elec", /전선|CD관|전기/]],
    s6: [["jungmun", /중문/], ["front", /현관문|도어락|방화문|디지털/], ["turn", /터닝/], ["bath", /욕실문/], ["leafonly", /문짝만|민자/], ["room", /방문|문짝|문틀|손잡이|스토퍼|문턱|경첩|도어/], ["labor", /작업비|인건/]],
    s7: [["othertile", /(현관|주방|발코니|베란다)[^|]*타일/], ["tilework", /부자재|본드|압착|기공|조공|타일 ?(작업|인건)/], ["shower", /샤워부스|칸막이|파티션|욕조/], ["ceiling", /천장|환풍|휴젠|조명|다운/], ["fixture", /변기|세면|수전|샤워기|도기|비데/], ["acc", /거울|수납|액세서리|악세|선반|휴지|수건|옷걸이|유가/], ["btile", /타일|줄눈|젠다이|문턱/], ["set", /설치|세팅|실리콘/]],
    s8: [["finish", /수평|몰탈|메움|걸레받이|재료분리|논슬립|보정|문턱|단차/], ["floor", /장판|마루|데코|바닥재|철거|샌딩/]],
    s9: [["repair", /곰팡이|퍼티|보수|초배|부분/], ["paper", /벽지|도배|포인트|디아망|무몰딩|인건/]],
    s10: [["paint", /도장|페인트|탄성/], ["film2", /창틀|창호|샷시|샤시|싱크|가구|붙박이|신발장|냉장고/], ["film", /필름|문/]],
    s11: [["shoe", /신발장/], ["closet", /붙박이|드레스|화장대|옷장|행거|책장/], ["laundry", /다용도|세탁/], ["kstore", /수납장|냉장고장|키큰장|팬트리/], ["fdoor", /문짝|도어/], ["sink", /싱크|상판|수전|후드|쿡탑|아일랜드|주방|식기|인덕션/]],
    s12: [["bal", /탄성|페인트|도장|발코니 타일/], ["pwaste", /쓰레기|반출|폐기/], ["life", /건조대|블라인드|커튼/], ["out", /외주/], ["finish", /실리콘|청소|줄눈|준공|코팅|새집/]] })[sk] || [];
}
function catShown(st) { return ((D.cats || {})[st.key] || []).filter(c => !c.only || (D._woodSet && c.main) || CAT_OPEN[st.key + "|" + c.key] || c.lines.some(id => { const x = lineById(id); return x && lnState(x).on })) }   // 지금 화면에 나오는 묶음
function catOfName(st, name, shown) { const nm = String(name || ""); if (!nm.trim()) return ""; for (const [ck, re] of catKw(st.key)) if (re.test(nm) && (!shown || shown.has(ck))) return ck; return "" }
function qaParse(st, q) { const m = q.match(/^([가-힣]+)>/), p0 = st.key === "s1" ? "철거" : st.procs[0], pr = m && PROCS.includes(m[1]) ? m[1] : p0, body = m ? q.slice(m[0].length) : q; return { pr, body, name: body.split("|")[0], far: !st.procs.includes(pr) } }
function catProc(st, c) { if (st.key === "s1") return /^(prep|ladder|permit)$/.test(c.key) ? "가설" : "철거"; if (st.key === "s7") return /tile/.test(c.key) ? "타일" : "욕실"; return st.procs[0] }   // 묶음에서 직접 넣는 줄의 공정
function catXAssign(st) {                             // 이 단계에 직접 넣은 줄을 묶음별로 나눈다 → { by: { 묶음: [줄] }, rest: [어느 묶음에도 안 맞는 줄] }
  const ex = new Map((E.extras || []).map(x => [x.id, x])), shown = new Set(catShown(st).map(c => c.key)), by = {}, rest = [];
  const pin = {}; catXAssign.pin = pin;
  for (const l of (R.all || R.lines)) { if (!l.extra || l.film) continue;
    if (String(l.key).startsWith("xw")) { if (st.key === "s2" && shown.has("window")) (pin.window = pin.window || []).push(l); continue }   // (v77) 창호 목록에서 넣은 창
    if (!(l.at ? l.at === st.key : st.procs.includes(l.proc))) continue;
    const x = ex.get(l.key) || {}; let ck = "";
    if (l.wk) { rest.push(l); continue }              // 목수 인원으로 넣는 ‘그 밖의 작업’은 전처럼 아래에
    if (x.cat) { const [sk, c] = String(x.cat).split("|"); ck = sk === st.key && shown.has(c) ? c : "" }
    else if (x.cat === undefined && !l.it) ck = catOfName(st, l.name, shown);
    if (ck) (by[ck] = by[ck] || []).push(l); else if (!l.it) rest.push(l) }
  catXAssign.by = by; catXAssign.shown = shown; catXAssign.sk = st.key;
  return { by, rest };
}
function catXs(st, c) { return catXAssign.sk === st.key ? (catXAssign.by || {})[c.key] || [] : [] }
function catAddHtml(st, c, xs) {                      // 펼친 묶음 맨 아래: 이 묶음에 넣은 줄 + ‘＋ 항목 추가’
  const k = st.key + "|" + c.key, have = new Set(xs.map(x => x.name)), nz = s => String(s).replace(/[\s()·]/g, ""), shown = catXAssign.shown;
  const mine = c.lines.map(lineById).filter(l => l && !l.gone).map(l => nz(l.label || aliasOf(l.items[0])));
  const qs = (QUICK_ADD[st.key] || []).map(q => ({ q, ...qaParse(st, q) })).filter(z => catOfName(st, z.name, shown) === c.key && !have.has(z.name) && !mine.some(n => n.includes(nz(z.name))) && !(/(천장 몰딩|걸레받이) 철거/.test(z.name) && lnFind("demoMoldTop")));
  const xset = new Set(E.extras.filter(x => x.item).map(x => x.item));   // 단가표의 품목 가운데 이 묶음 것 (공사 줄에 이미 있는 것 · 넣어 둔 것은 뺀다)
  const its = D.catalog.filter(i => st.procs.includes(i.proc) && !USED.has(i.name) && !USEDB.has(nmBase(i.name)) && !HIDE_ITEMS.includes(i.name) && !xset.has(i.name) && catOfName(st, aliasOf(i.name) + " " + i.name, shown) === c.key);
  const more = !!(catAddHtml.more || {})[k], lim = 8, chip = z => z.it ? `<button type="button" class="btn sm" data-citem="${esc(z.it.name)}" data-qcat="${k}">+ ${esc(aliasOf(z.it.name))}${(pr => pr ? ` <small class="note">${won(pr)}/${esc(z.it.unit)}</small>` : "")(unitPrice(z.it, E))}</button>`
    : `<button type="button" class="btn sm" data-qadd="${esc(z.pr + "|" + z.body)}" data-qat="${st.key}" data-qcat="${k}">+ ${z.far ? esc(z.pr) + " · " : ""}${esc(z.name)}</button>`;
  const all = [...qs, ...its.map(it => ({ it }))];
  return `<div class="catadd">${xs.length ? `<div class="cah">이 묶음에 추가한 항목 ${xs.length}개</div>${lineTable(xs, true)}` : ""}
    <div class="car"><b>＋ 항목 추가</b>${(more ? all : all.slice(0, lim)).map(chip).join("")}${all.length > lim && !more ? `<button type="button" class="btn ghost sm" data-cmore="${k}">더 보기 ${all.length - lim}개 ▾</button>` : ""}<button type="button" class="btn sm" data-cadd="${k}">+ 직접 입력</button><input class="search" type="search" placeholder="품목 이름으로 찾기" data-cfind="${k}" autocomplete="off" aria-label="${esc(c.label)}에 넣을 품목 찾기"></div>
    <div class="cfout"></div>
    <div class="note cnote">이 묶음에 없는 작업은 여기서 바로 넣습니다. 넣은 줄은 이 묶음 금액에 더해지고, 이름·수량·단가를 고치거나 ‘비교견적(별도)’로 돌릴 수 있습니다.</div></div>`;
}
document.addEventListener("click", ev0 => { const t = ev0.target, ba = t.closest && t.closest("[data-cadd]"), bi = t.closest && t.closest("[data-citem]"), bm = t.closest && t.closest("[data-cmore]"); if (!ba && !bi && !bm) return;
  if (bm) { (catAddHtml.more = catAddHtml.more || {})[bm.dataset.cmore] = true; renderChecklist(); return }
  const k = ba ? ba.dataset.cadd : bi.dataset.qcat, [sk, ck] = String(k).split("|"), st = STEPS().find(s => s.key === sk), c = st && ((D.cats || {})[sk] || []).find(z => z.key === ck); if (!c) return;
  const id = "x" + Date.now();
  if (bi) { const n = bi.dataset.citem, old = E.extras.find(x => x.item === n && !x.film);
    if (old) { old.cat = k; refresh(); toast(`‘${aliasOf(n)}’은(는) 이미 들어 있어 이 묶음으로 옮겼습니다.`); return }
    E.extras.push({ id, space: "common", item: n, qty: 1, cat: k }); refresh(); toast(`‘${aliasOf(n)}’을(를) ‘${c.label}’ 묶음에 넣었습니다. 수량을 확인하세요.`); return }
  E.extras.push({ id, space: "common", proc: catProc(st, c), name: "", unit: "식", qty: 1, price: "", note: "", at: sk, cat: k }); refresh();
  const inp = document.querySelector(`#stepBody tr[data-key="${id}"] [data-x="name"]`); if (inp) inp.focus() });
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.cfind === undefined) return;   // 묶음 안 ‘품목 찾기’: 이 공정의 품목과 빠른 추가에서 찾는다
  const k = el.dataset.cfind, sk = k.split("|")[0], st = STEPS().find(s => s.key === sk), box = el.closest(".catadd"), out = box && box.querySelector(".cfout"); if (!st || !out) return;
  const q = el.value.replace(/\s+/g, "").toLowerCase(); if (!q) { out.innerHTML = ""; return }
  const hit = s => String(s || "").replace(/\s+/g, "").toLowerCase().includes(q), xset = new Set(E.extras.filter(x => x.item).map(x => x.item));
  const qs = (QUICK_ADD[sk] || []).map(z => qaParse(st, z)).filter(z => hit(z.name)).slice(0, 6);
  const its = D.catalog.filter(i => st.procs.includes(i.proc) && !USED.has(i.name) && !USEDB.has(nmBase(i.name)) && !HIDE_ITEMS.includes(i.name) && !xset.has(i.name) && (hit(i.name) || hit(aliasOf(i.name)) || hit(i.spec))).slice(0, 12);
  out.innerHTML = qs.map(z => `<button type="button" class="btn sm" data-qadd="${esc(z.pr + "|" + z.body)}" data-qat="${sk}" data-qcat="${k}">+ ${z.far ? esc(z.pr) + " · " : ""}${esc(z.name)}</button>`).join("")
    + its.map(i => { const pr = unitPrice(i, E); return `<button type="button" class="btn sm" data-citem="${esc(i.name)}" data-qcat="${k}">+ ${esc(aliasOf(i.name))} <small class="note">${pr ? won(pr) + "/" + esc(i.unit) : "단가 미정"}</small></button>` }).join("")
    || `<span class="note">‘${esc(el.value)}’에 맞는 품목이 없습니다. ‘+ 직접 입력’으로 이름을 적어 넣을 수 있습니다.</span>` });
/* (v77) 창호 목록 · 가구 치수 · 목작업 치수도 묶음 안에서 — 사용자(2026-11-20, “목공 치수 표 · 창호 목록 · 가구 치수 목록도 타일처럼 묶음 안으로 합칠까요?”에): “네, 합쳐 주세요”.
   단계 맨 위에 따로 있던 표 셋을 없애고 그 공사의 묶음 카드 안으로 옮겼다 (자료 E.wins · E.furn · E.ceilList 와 계산은 그대로):
   · 창호 목록 → ‘창문(샷시) 교체’ 묶음 맨 위 (창마다 넣은 금액은 그 묶음 금액과 요약에 더해 보인다 — catXAssign.pin)
   · 가구 치수 → 그 가구 줄 바로 아래 (furnUnder · ‘+ 치수로 넣기’) · 단계 맨 위에는 한 줄(furnBar)만
   · 목작업 치수 → 그 작업 카드 맨 위에 그 종류의 줄만 (ceilPart) · 로스율·계산 요약·그 밖의 줄은 ‘공통’ 카드 (ceilCommon) */
document.head.insertAdjacentHTML("beforeend", `<style>.catbody>.pgroup{margin:8px 14px 10px;border:1px dashed var(--line);border-radius:10px;background:var(--panel)}.catbody>.pgroup .addrow{padding-bottom:10px}
.bom.furnin{display:block}.bom.furnin .fcard{margin:0 0 8px;background:var(--panel)}.bom.furnin .addrow{padding:0}.furnbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 14px}</style>`);
function catTop(st, c) {                              // 펼친 묶음 맨 위에 붙는 칸
  if (st.key === "s7" && c.key === "btile") return tileAddBar(st, c);
  if (st.key === "s2" && c.key === "window") return winCard();
  if (st.key === "s4" && c.key === "wood") return ceilCommon();
  if (st.key === "s4" && c.only) { const kind = Object.keys(WOOD_LINE).find(k => WOOD_LINE[k] === c.only); if (kind) return ceilPart(kind) }
  return "";
}
function lnUnder(l) { return /^(wallTile|floorTile)\d?$|^(entTile|kitTile|balTile|balTile2)$/.test(l.id) ? tileDimRow(l) : furnUnder(l) }   // 공사 줄 바로 아래에 붙는 칸 (타일 치수 · 가구 치수)
function catPins(st, c) { return catXAssign.sk === st.key ? (catXAssign.pin || {})[c.key] || [] : [] }   // 그 묶음의 다른 표에서 넣은 줄 (창호 목록의 창) — 금액·요약에만 더한다
/* ── 가구: 그 줄 아래에서 치수로 넣기 ── */
function furnOne(f) {
  const l = lineById(f.lid), ja = furnIsJa(l), sink = f.lid === "sink";
  const num = (k, lb, ph) => `<label class="ff"><span>${lb}</span><input class="q" type="number" min="0" step="10" data-ff="${k}" value="${f[k] ?? ""}" placeholder="${ph}"></label>`;
  return `<div class="fcard" data-furn="${f.id}"><div class="fsvg" data-fsvg>${furnElev(f)}</div><div>
    <div class="frow"><input data-ff="loc" list="furnLocs" value="${esc(f.loc || "")}" placeholder="위치 (직접 적어도 됩니다)" title="적은 위치는 견적서의 위치·비고 칸에 나옵니다" style="width:150px"><button type="button" class="btn ghost sm" data-furndel="${f.id}">삭제</button></div>
    <div class="frow">${num("w", "가로 mm", "3600")}${ja ? "" : num("n", "개수", f.lid === "tall" ? "자동" : "1")}${sink ? num("hl", "하부장 높이", "850") + num("hg", "상·하부장 사이", "600") + num("hu", "상부장 높이", "700") : num("h", "전체 높이 mm", "2300")}${num("d", "깊이 mm", "600")}</div>
    <div class="frow"><b data-finfo>${esc(furnInfo(f))}</b><span>금액 <b data-famt>${furnAmt(f)}</b></span><small class="note" data-forig>${esc(furnOrigAmt(f))}</small></div>
    <div class="frow"><input data-ff="note" value="${esc(f.note || "")}" placeholder="실장 메모 (단내림 있음 / 커튼박스 / 콘센트 위치)" style="flex:1;min-width:160px"></div></div></div>`;
}
function furnUnder(l) {
  if (!l || !D.stepLines || !((D.stepLines.s11 || []).includes(l)) || !(furnIsJa(l) || FURN_CNT.includes(l.id))) return "";
  const fs = (E.furn || []).filter(f => f.lid === l.id); if (!fs.length && !lnState(l).on) return "";
  return `<div class="bom furnin">${fs.map(furnOne).join("")}<div class="addrow"><button type="button" class="btn sm" data-furnadd="${l.id}">+ 치수로 넣기</button><span class="note">${fs.length ? "여러 자리를 넣으면 수량을 더합니다 · 1자 = 303mm (반 자 올림)" : "가로 치수를 넣으면 정면도 · 자 수(개수) · 금액이 자동으로 나옵니다 (수량 칸에 바로 적어도 됩니다)"}</span></div></div>`;
}
function furnBar() {                                  // 가구 단계 맨 위: 위치 목록 + (치수를 넣어 둔 것이 있으면) 한 줄
  const fs = E.furn || [], locs = [...new Set(["주방", "현관", "안방", "드레스룸", ...R.S.list.filter(s => s.type === "방").map(s => s.name.replace(/ \(.*\)/, "")), "작은방", "다용도실", "거실", "복도", "베란다", "팬트리", "세탁실", "알파룸"])];
  return `<datalist id="furnLocs">${locs.map(x => `<option value="${esc(x)}">`).join("")}</datalist>` + (fs.length ? `<div class="pgroup"><div class="furnbar"><span class="note"><b>가구 치수 ${fs.length}곳</b>${E.furnOff ? ' — <b style="color:var(--warn)">지금은 금액에 반영되지 않습니다</b> (원래 수량대로 계산 중)' : "이 수량·금액에 반영되어 있습니다"} · 치수는 그 가구 줄을 펼치면 바로 아래에 있습니다</span><button type="button" class="btn ghost sm" data-furnoff>${E.furnOff ? "치수 기준 금액으로 다시 계산" : "원래 수량·금액으로 되돌리기 (치수는 기록만)"}</button></div></div>` : "");
}
/* ── 목작업: 그 작업 카드 안에서 그 종류의 치수만 ── */
function ceilRowHtml(r, withKind) { const x = woodRow(r), wall = x.kind !== "천장", H = woodH();
  return `<tr data-ceil="${r.id}">${withKind ? `<td><select data-cf="kind">${WOOD_KINDS.map(k => `<option ${x.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></td>` : ""}<td><input data-cf="name" value="${esc(r.name || "")}" placeholder="${wall ? "안방 창쪽 벽" : "거실"}" style="width:120px"></td>
    <td class="num"><input class="q" type="number" min="0" step="10" data-cf="w" value="${r.w ?? ""}"></td><td class="num"><input class="q" type="number" min="0" step="10" data-cf="h" value="${r.h ?? ""}" placeholder="${wall ? H : ""}"></td>
    <td class="num"><input class="q" type="number" min="1" max="4" step="1" data-cf="m" value="${r.m ?? ""}" placeholder="1" style="width:54px"></td><td class="num" data-ca>${x.ok ? (x.a * x.m).toFixed(2) : ""}</td><td class="num note" data-cs>${x.ok ? x.sg.toFixed(2) : ""}</td><td><button type="button" class="btn ghost sm" data-ceildel="${r.id}">삭제</button></td></tr>` }
function ceilTable(rs, withKind) { return `<div class="tbl"><table><thead><tr>${withKind ? "<th>종류</th>" : ""}<th>위치</th><th class="num">가로·길이 mm</th><th class="num">세로·높이 mm</th><th class="num">겹·면</th><th class="num">면적 ㎡</th><th class="num">석고 환산 (장)</th><th></th></tr></thead><tbody>${rs.map(r => ceilRowHtml(r, withKind)).join("")}</tbody></table></div>` }
function ceilPart(kind) {
  const rs = (E.ceilList || []).filter(r => (r.kind || "천장") === kind), wall = kind !== "천장", walls = wall ? woodWalls() : [];
  return `<div class="pgroup" data-ceilpart="${esc(kind)}"><h3>${esc(kind)} 치수 — 넣으면 석고보드·각재가 치수대로 계산됩니다 <span class="note">${wall ? `길이만 넣으면 높이는 천장 높이 ${woodH().toLocaleString("ko-KR")}mm` : "가로 × 세로"} · 넣지 않으면 어림값으로 계산합니다</span></h3>
    ${rs.length ? ceilTable(rs, false) : ""}
    <div class="addrow"><button type="button" class="btn sm" data-ceiladd="${esc(kind)}">+ ${wall ? "벽" : "천장"} 치수</button>${wall ? "" : '<button type="button" class="btn ghost sm" data-ceilrooms>도면의 방 천장 모두 가져오기</button>'}
      ${walls.length ? `<select data-woodwall data-wkind="${esc(kind)}" aria-label="도면의 벽에서 고르기" style="max-width:220px"><option value="">도면의 벽에서 고르기…</option>${walls.map(w => `<option value="${esc(w.k)}">${esc(w.nm)} ${w.len ? w.len.toLocaleString("ko-KR") + "mm" + (w.meas ? " 실측" : " 추정") : "(길이 없음)"}</option>`).join("")}</select>` : ""}
      ${rs.length && wall ? '<span class="note">겹·면: 양면 가벽 2 · 2겹 2 · 양면 2겹 4 (석고에만 곱합니다)</span>' : ""}</div></div>`;
}
function ceilCommon() {                               // ‘공통’ 카드: 로스율 · 계산 요약 · 카드가 없는 종류(기타 등)의 줄
  if (!lineById("flatCeil")) return ""; const all = E.ceilList || [], shown = catXAssign.sk === "s4" ? catXAssign.shown : null;
  const inCard = r => { const id = WOOD_LINE[r.kind || "천장"]; return !!id && (!shown || shown.has("w_" + id)) }, rs = all.filter(r => !inCard(r));
  return `<div class="pgroup" data-ceilpart="공통"><h3>목작업 치수 — 로스율 · 계산 요약 <span class="note">치수는 위 작업 카드(평천장 · 가벽 · 벽 평탄화 · 벽체 단열 · 아트월)를 펼쳐 그 안에서 넣습니다 · 석고보드 = 면적 ÷ 1.62㎡ · 각재 = 석고 1장당 3개, 12개 1단</span></h3>
    ${rs.length ? ceilTable(rs, true) : ""}
    ${all.length ? `<div class="scope" id="ceilSum" style="padding:6px 14px">${ceilSumHtml()}</div>` : ""}
    <div class="addrow"><label class="note" style="display:inline-flex;align-items:center;gap:6px">목자재 로스율 <input class="q" type="number" min="0" max="50" step="1" id="woodLoss" value="${woodLossPct()}" style="width:64px"> %</label><button type="button" class="btn ghost sm" data-ceiladd="기타">+ 그 밖의 치수</button>
      ${all.length ? '<button type="button" class="btn ghost sm" data-ceilclear>치수 모두 지우기 (원래 어림 계산으로)</button>' : ""}</div></div>`;
}
function catCard(st, c) {
  const allL = R.all || R.lines, lines0 = c.lines.map(lineById).filter(Boolean), lines = c.pyc ? lines0.filter(l => allL.some(x => x.lid === l.id) || !(l.gone || (l.hideZero && lnState(l).on))) : lines0.filter(l => !tileGone(l));
  const nOn = lines.filter(l => lnState(l).on).length, on = nOn > 0, k = st.key + "|" + c.key, open = !!CAT_OPEN[k];
  const xs = catXs(st, c), px = catPins(st, c), xAmt = [...xs, ...px].reduce((a, x) => a + (x.opt ? 0 : x.amt), 0);   // (v75) 이 묶음에 직접 넣은 줄 · (v77) 창호 목록의 창
  const xbrief = !open ? [...px, ...xs].map(x => `<span class="cs1 cx"><span><b>${esc(x.name || "(이름 없음)")}</b> <em>${x.qty}${esc(x.unit || "")}</em></span><span class="csa">${x.tbd ? '<span class="tbd">단가 미정</span>' : won(x.amt) + "원"}${x.opt ? ' <small class="optm">별도</small>' : ""}</span></span>`).join("") : "";
  const amt = R.lines.filter(x => c.lines.includes(x.lid)).reduce((a, x) => a + x.amt, 0);
  const tbd = on && R.lines.some(x => c.lines.includes(x.lid) && x.tbd);
  const oAmt = (R.opt || []).filter(x => c.lines.includes(x.lid)).reduce((a, x) => a + x.amt, 0), allOpt = on && lines.filter(l => lnState(l).on).every(l => lnState(l).opt);
  // 자주 쓰는 줄(공사 유형에 들어 있거나 지금 켜 둔 것)만 먼저 보여 주고, 나머지는 ‘덜 쓰는 항목’으로 접는다
  const showSel = !!D._woodSet, core = lines.filter(l => (showSel || !l.sel) && (lnState(l).on || (l.tags && !l.gone))), extra = lines.filter(l => (showSel || !l.sel) && !core.includes(l) && !HIDE_LINES.includes(l.id) && !l.gone);
  const selQ = l => { const x = lnState(l); return x.q !== undefined && x.q !== "" ? +x.q : +l.qty || 0 }, selMen = showSel ? lines.reduce((a, l) => { const x = lnState(l); return l.sel && x.on && !x.opt ? a + selQ(l) : a }, 0) : 0;
  const bd = on ? baseAmts() : {}, cd = on && bd._ok ? lines.reduce((a, l) => { const x = lnState(l); return x.on && !x.opt ? a + curAmt(l.id) - (bd[l.id] || 0) : a }, 0) : 0;   // 이 묶음이 자동(기본)보다 얼마나 달라졌는지
  // 접혀 있어도 무엇이 들어가고 각각 얼마인지 보여 준다 (실장이 눌러 보지 않아도 알 수 있게)
  const brief = on && !open ? lines.filter(l => lnState(l).on && (showSel || !l.sel)).map(l => { if (l.sel && !lnState(l).opt) return `<span class="cs1"><span><b>목수</b> <em>${selQ(l)}명</em></span><span class="csa"><small class="note">아래 목수 작업비에 합산</small></span></span>`;
      const xs = allL.filter(x => x.lid === l.id); if (!xs.length) return ""; const m = xs.find(x => x.key === "ln|" + l.id), a = xs.reduce((t, x) => t + x.amt, 0), nm = l.items[Math.min(lnState(l).alt || 0, l.items.length - 1)];
      const kn = aliasOf(nm).replace(/\s*\(.*?\)/g, ""), kind = l.label && l.items.length > 1 ? ` <i>${esc(kn.startsWith(l.label + " ") ? kn.slice(l.label.length + 1) : kn)}</i>` : "", q = m ? (m.unit === "㎡" ? toPy(m.qty) + "평" : m.qty + esc(m.unit || "")) : "1식";
      const dl = m && m.detail && m.detail.length ? m.detail : (!m ? xs.map(x => ({ name: aliasOf(x.name), qty: x.qty, unit: x.unit })) : []);
      const dt = dl.length ? `<small>└ ${esc(dl.slice(0, 8).map(d => String(d.name).replace(/\s*\(.*?\)/g, "") + " " + d.qty + (d.unit || "")).join(" · "))}${dl.length > 8 ? " …" : ""}</small>` : "";
      return `<span class="cs1"><span><b>${esc(l.label || aliasOf(nm))}</b>${kind} <em>${q}</em></span><span class="csa">${xs.some(x => x.tbd) && !a ? '<span class="tbd">단가 미정</span>' : won(a) + "원"}${lnState(l).opt ? ' <small class="optm">별도</small>' : ""}</span>${dt}</span>` }).filter(Boolean).join("") : "";
  return `<div class="cat2 ${on || xs.length || px.length ? "on" : ""}${allOpt ? " opt" : ""}">
    <label class="ch"><input type="checkbox" data-cat2="${k}" ${on ? "checked" : ""}><span><b>${esc(c.label)}</b>${c.desc ? `<small>${esc(c.desc)}</small>` : ""}</span></label>
    <span class="amt">${on ? (amt + xAmt ? won(amt + xAmt) + "원" : "") + (selMen ? ` <small class="note">+ 목수 ${selMen}명</small>` : "") + dltChip(cd) + (oAmt ? ` <span class="optm">비교견적 · 별도 ${won(oAmt)}원</span>` : "") + (tbd ? ' <span class="tbd">단가 미정 포함</span>' : "") : xs.length + px.length ? `<span class="note">${[px.length ? "창 " + px.length + "개" : "", xs.length ? "추가 항목 " + xs.length + "개" : ""].filter(Boolean).join(" · ")}</span> ${won(xAmt)}원` : '<span class="note">안 함</span>'}
      <button type="button" class="btn ghost sm cmpb" data-cmpcat="${k}|${allOpt ? 0 : 1}" title="${allOpt ? "비교견적에서 빼고 합계에 넣습니다" : "이 묶음 전체(자재·부자재·작업비)를 합계에 넣지 않고 금액만 따로 보여 줍니다"}">${allOpt ? "합계에 넣기" : on ? "묶음째 비교견적" : "비교견적에 넣기"}</button>
      <button type="button" class="btn ghost sm" data-catopen="${k}" aria-expanded="${open}">${open ? "접기 ▴" : `${on ? "고치기 · " : ""}세부 ${on ? nOn + "/" : ""}${lines.length}개 ▾`}</button></span>
    ${on && c.pyc ? pyCtl(st, c) : ""}${on && c.lad ? ladCtl(st, c) : ""}
    ${brief || xbrief ? `<div class="catsum" data-catopen="${k}" title="누르면 펼쳐서 종류·수량을 고칩니다">${brief}${xbrief}</div>` : ""}
    ${open ? `<div class="catbody">${catTop(st, c)}${(core.length ? core : lines).map(lnRow).join("")}${core.length && extra.length ? `<details class="more less"><summary>덜 쓰는 항목 ${extra.length}개 <span class="note">${esc(extra.map(lineLabel).join(" · "))}</span></summary>${extra.map(lnRow).join("")}</details>` : ""}${catAddHtml(st, c, xs)}</div>` : ""}</div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-lnreset]"); if (!b) return; const l = lnFind(b.dataset.lnreset); if (!l) return; const x = { ...(E.ln[l.id] || lnState(l)) }; delete x.q; delete x.alt; delete x.p; E.ln[l.id] = x;   // 이 줄을 자동(기본) 값으로
  for (const k of Object.keys(E.dq || {})) if (k.startsWith(l.id + "#")) delete E.dq[k]; for (const k of Object.keys(E.lq || {})) if (k.startsWith("ln|" + l.id + "#")) delete E.lq[k]; if (l.id === "down") E.dnl = undefined;
  refresh(); toast("자동(기본) 값으로 되돌렸습니다.") });
function stepDelta(st) { const bd = baseAmts(); if (!bd._ok) return ""; let d = 0; for (const l of (D.stepLines[st.key] || [])) { const x = lnState(l); if (x.on && !x.opt) d += curAmt(l.id) - (bd[l.id] || 0) } return dltChip(d, "자동(기본)보다") }
/* (v71) 욕실 공사 범위를 칸마다 고른다 — 사용자(2026-11-20): “욕실이 2칸인데 1칸만 견적을 낼 수 있으면 안 되는 거 아냐? 거실 화장실은 전체 교체에 안방은 덧방을 할 수도 있는데 … 둘 다 덧방일 수도 있고 하나는 철거 하나는 덧방일 경우도 … 직관적이게 보고 작업할 수 있게”.
   E.bathMode = { bath2: "over" } — 적혀 있지 않은 욕실은 ‘전체 교체’(전과 같은 금액). 수량식은 dataFix2 의 v71 블록이 칸 수 변수(stepBase: bathsFull · bathsTile · bathsAny)로 바꿔 둔다:
   철거·방수 = 전체 교체 칸만 / 타일·천장·배수구·욕실 다운라이트 = 전체 교체 + 덧방 칸 / 도기·수전·악세서리·설치비 = ‘안 함’이 아닌 칸. */
const BATH_MODES = [["full", "전체 교체", "철거 · 방수 · 타일 · 천장 · 도기·수전을 모두 새로 합니다"], ["over", "덧방", "철거·방수 없이 기존 타일 위에 타일을 붙입니다 · 천장과 도기·수전은 새로 합니다"], ["fix", "도기·수전만", "타일·천장은 그대로 두고 도기·수전·악세서리만 바꿉니다"], ["none", "안 함", "이 욕실은 공사하지 않습니다"]];
function bathModeOf(id) { const m = (E.bathMode || {})[id]; return m === "over" || m === "fix" || m === "none" ? m : "full" }
function bathModeSet(id, m) { E.bathMode = E.bathMode || {}; if (!m || m === "full") delete E.bathMode[id]; else E.bathMode[id] = m; if (!Object.keys(E.bathMode).length) delete E.bathMode }
function bathList() { try { return (typeof R !== "undefined" && R && R.S ? R.S : spaces()).list.filter(s => s.type === "욕실") } catch (e) { return [] } }
function bathLabel(m) { return (BATH_MODES.find(x => x[0] === m) || BATH_MODES[0])[1] }
function bathDocTxt() { try { const bs = bathList(); return bs.some(s => bathModeOf(s.id) !== "full") ? " (" + bs.map(s => s.name + " " + bathLabel(bathModeOf(s.id))).join(" · ") + ")" : "" } catch (e) { return "" } }   // 고객 견적서 ‘구조’ 칸: 칸마다 범위가 다를 때만 적는다
function bathAmt(id) {                                // 이 욕실 한 칸에 드는 금액(어림) = 지금 합계 − 이 칸을 ‘안 함’으로 했을 때의 합계
  const orig = E.bathMode, busy = CMP_BUSY;          // 견적에 적힌 것은 건드리지 않고(새 묶음으로 잠깐 바꿔) 계산만 해 본다
  try { CMP_BUSY = true; E.bathMode = { ...(orig || {}), [id]: "none" }; const r = compute0(); return Math.max(0, Math.round(((R.sum + R.biz) - (r.sum + r.biz)) / 1000) * 1000) } catch (e) { return 0 }
  finally { CMP_BUSY = busy; if (orig) E.bathMode = orig; else delete E.bathMode; BASE_AMT = null } }
function bathRo(w) { const c = String(w).charCodeAt(String(w).length - 1) - 0xAC00, j = c >= 0 && c <= 11171 ? c % 28 : 0; return w + (j === 0 || j === 8 ? "로" : "으로") }   // ‘전체 교체로’ · ‘덧방으로’
let BM_OPEN = false;
function bathModeCard(o) {                            // o.fold = 접어 두는 곳(철거 · 설비 단계) · o.tight = ‘현장 정보 → 공간’ 칸 안
  const bs = bathList(); if (!bs.length || !(D.stepLines && D.cats)) return "";
  const rows = bs.map(s => { const m = bathModeOf(s.id), a = m === "none" ? 0 : bathAmt(s.id), tip = (BATH_MODES.find(x => x[0] === m) || BATH_MODES[0])[2];
    return `<div class="bmrow" style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:5px 0"><b style="min-width:96px">${esc(s.name)}</b><span style="display:inline-flex;flex-wrap:wrap;gap:4px">${BATH_MODES.map(([k, t, tp]) => `<button type="button" class="btn sm${m === k ? " primary" : ""}" data-bathmode="${s.id}|${k}" aria-pressed="${m === k}" title="${esc(tp)}">${t}</button>`).join("")}</span><span class="note" style="flex:1 1 230px">${esc(tip)}${a ? ` · <b>이 칸 약 ${won(a)}원</b>` : ""}</span></div>` }).join("");
  const all = bs.length > 1 ? `<span style="display:inline-flex;flex-wrap:wrap;gap:4px">${[["full", "모두 전체 교체"], ["over", "모두 덧방"]].map(([k, t]) => `<button type="button" class="btn ghost sm" data-bathmode="*|${k}">${t}</button>`).join("")}</span>` : "";
  if (o && o.fold) return `<details class="more bmode"${BM_OPEN ? " open" : ""} style="margin:8px 0"><summary>욕실 공사 범위 <span class="note">${bs.map(s => `${esc(s.name)} <b>${bathLabel(bathModeOf(s.id))}</b>`).join(" · ")} · 철거·방수는 ‘전체 교체’ 칸만 들어갑니다 · 누르면 바꿉니다</span></summary><div class="bd">${rows}${all}</div></details>`;
  if (o && o.tight) return `<div class="f wide"><span>욕실 공사 범위 <small class="note">칸마다 따로</small></span><div style="flex:1 1 100%;min-width:0">${rows}${all}</div></div>`;
  return `<div class="pgroup bmode"><h3>욕실 공사 범위 <span class="note">욕실마다 따로 고릅니다 — 철거·방수·타일·천장·도기 수량이 여기에 맞춰 저절로 바뀝니다</span> ${all}</h3><div style="padding:2px 14px 8px">${rows}</div></div>`;
}
document.addEventListener("toggle", ev0 => { const d = ev0.target; if (d && d.classList && d.classList.contains("bmode") && d.tagName === "DETAILS") BM_OPEN = d.open }, true);
document.addEventListener("click", ev0 => { const t = ev0.target; if (!t.closest) return;
  const b = t.closest("[data-bathmode]");
  if (b) { const [id, m] = b.dataset.bathmode.split("|"), bs = bathList(); if (b.closest("details.bmode")) BM_OPEN = true;
    if (id === "*") for (const s of bs) bathModeSet(s.id, m); else bathModeSet(id, m);
    refresh(true); toast(`${id === "*" ? "욕실 모두" : (bs.find(s => s.id === id) || {}).name || "욕실"} → ‘${bathRo(bathLabel(m)).replace(/(로|으로)$/, "’$1")} 바꿨습니다. 철거·방수·타일·도기 수량이 따라 바뀝니다.`); return }
  if (t.closest("[data-tdmore]")) { TD_MORE = !TD_MORE; renderChecklist() } });
function bathModeNote() {                             // (v88) 욕실 공사 범위를 고르는 칸은 화면에서 뺐다(사용자: “아직 상세하게 정해지지도 않았는데 들어가서 불편해 없애”). 챗봇의 ‘기본 공사’처럼 덧방으로 만든 견적은 값(E.bathMode)이 남아 있으므로, 그런 욕실이 있을 때만 한 줄로 알린다
  const bs = bathList().filter(s => bathModeOf(s.id) !== "full"); if (!bs.length) return "";
  return `<p class="note" style="margin:6px 14px;padding:8px 10px;border:1px dashed var(--line);border-radius:8px">${bs.map(s => `<b>${esc(s.name)}</b>: ${esc(bathLabel(bathModeOf(s.id)))}(으)로 계산 중`).join(" · ")} — 그만큼 철거·방수·타일 수량이 빠져 있습니다. <button type="button" class="btn ghost sm" data-bathmode="*|full">↺ 모두 전체 교체로</button></p>`;
}
function bathSum(st) {                                // 욕실 구성: 타일을 뺀 도기·수전·천장·환풍기·거울장·악세서리·칸막이·설치비가 합쳐서, 1칸에 얼마인지
  const n = (v => v && v.bathsAny !== undefined ? v.bathsAny : +E.baths || 0)((lineVars(R.S) || {}).s7), cs = ((D.cats || {}).s7 || []).filter(c => ["fixture", "ceiling", "acc", "shower", "set"].includes(c.key)); if (!n || !cs.length) return "";   // (v71) 칸 수 = 이 단계에서 공사하는 욕실(‘안 함’과 도면에서 뺀 칸은 세지 않는다)
  const ids = cs.flatMap(c => c.lines), tot = R.lines.filter(x => ids.includes(x.lid)).reduce((a, x) => a + x.amt, 0); if (!tot) return "";
  const bd = baseAmts(), d = bd._ok ? ids.reduce((a, id) => { const l = lineById(id); if (!l) return a; const x = lnState(l); return x.on && !x.opt ? a + curAmt(id) - (bd[id] || 0) : a }, 0) : 0;
  return `<div class="pgroup bsum"><h3>욕실 ${n}칸 구성 <span class="note">타일을 뺀 도기·수전·천장·환풍기·거울장·악세서리·칸막이·설치비</span></h3><div class="bsr"><span>합계 <b>${won(tot)}원</b></span><span>1칸에 <b>${won(tot / n)}원</b></span>${dltChip(d)}<span class="note">아래 묶음마다 들어가는 것과 금액이 보입니다. 종류나 개수를 바꾸면 ‘기본보다 얼마’가 함께 나옵니다.</span></div></div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-catopen]"); if (!b) return; const k = b.dataset.catopen; if (CAT_OPEN[k]) CAT_OPEN[k] = false; else openCat(k); renderChecklist() });
document.addEventListener("change", ev0 => {
  const el = ev0.target; if (!el.dataset.cat2) return;
  const [sk, ck] = el.dataset.cat2.split("|"), c = D.cats[sk].find(x => x.key === ck), lines = c.lines.map(lineById).filter(Boolean);
  if (!el.checked) lines.forEach(l => setLn(l, { on: false }));
  else {
    const tag = presetTag() || "F";
    let core = c.only ? lines.filter(l => l.id === c.only) : lines.filter(l => l.tags.includes(tag)); if (!core.length) core = lines.filter(l => l.tags && l.tags !== "-"); if (!core.length) core = [lines[0]];
    if (c.only && D._woodSet) { const x = lnFind("woodLabor"); if (x && !lnState(x).on) setLn(x, { on: true }) }   // 목수 인원이 합쳐질 줄이 꺼져 있으면 켠다
    core.forEach(l => setLn(l, { on: true })); lines.filter(l => l.follow && core.some(c => c.id === l.follow)).forEach(l => setLn(l, { on: true })); openCat(el.dataset.cat2);
  }
  refresh();
});
/* (v76) 타일은 한 곳에서 — 사용자(2026-11-20): “옆에 욕실1, 욕실2 되어 있는데 베란다나 현관에 관해서 알고 싶을 수 있으니 마우스로 클릭해서 변경할 수 있게 … 타일 수량도 못 넣고 …
   타일을 3번 넣는 거야? 그냥 1개만 놔두고 욕실타일 추가를 할 수 있게”. 따로 있던 ‘타일 붙일 곳 치수’ 표를 없애고, ‘타일’ 묶음 한 곳에서 타일 줄마다 [수량(박스) · 종류 · 그 줄 아래 치수]를 넣는다.
   치수 칸의 곳 이름(욕실1·욕실2 …)은 눌러서 바꾸고, 꺼져 있는 곳(현관·주방 벽·발코니)은 묶음 맨 위 ‘＋ 타일 붙일 곳 추가’ 단추로 켠다. 계산법은 그대로(면적 × 로스 20% ÷ 1박스 넓이 → 곳마다 올림). */
document.head.insertAdjacentHTML("beforeend", `<style>.bom.tdr{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;gap:6px 10px;align-items:center}.bom.tdr label{display:inline-flex;align-items:center;gap:4px;font-size:13px}.bom.tdr input.q{width:92px}
.bom.tdr .seg button{min-height:32px}.tileadd{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:10px 14px 4px}.tileadd>b{margin-right:4px}.tilesum{padding:2px 14px 8px;margin:0}@media (max-width:700px){.pk>.amt{grid-column:1/-1}}</style>`);   /* 좁은 화면: 금액이 아래 칸(포함 내역·치수)과 겹치지 않게 한 줄을 다 쓴다 */
function tileBathOf(l) { const m = /^(wallTile|floorTile)(\d?)$/.exec(l.id); return m ? { part: m[1] === "wallTile" ? "w" : "f", n: +m[2] || 1 } : null }   // (v78) 욕실 타일 줄 → 몇 번째 욕실의 벽/바닥인지
function bathSlot(s) { return Math.min(3, +String(s.id).replace(/\D/g, "") || 1) }   // 욕실 → 타일 줄 번호 (넷째 욕실부터는 셋째 줄에 더한다)
function tileGone(l) { return /^(wallTile|floorTile)\d?$|^balTile2$/.test(l.id) && !!l.hideZero && !tilePlaces(l).length && !(E.ln[l.id] && +E.ln[l.id].q > 0) }   // 그 곳이 없거나(욕실이 1칸 · 뒷 발코니 없음) 타일을 붙이지 않는 욕실의 줄은 보이지 않는다
function tilePlaces(l) {                              // 이 타일 줄이 붙는 곳: [치수 id, 이름, 넣는 칸(w 가로 · d 세로 · h 높이)]
  const SL = tdList(R.S), tb = s => s.type === "욕실" && ["full", "over"].includes(bathModeOf(s.id)), bo = tileBathOf(l);
  if (bo) return SL.filter(s => tb(s) && bathSlot(s) === bo.n).map(s => [s.id, s.name, bo.part === "w" ? "wdh" : "wd"]);
  if (l.id === "entTile") return SL.filter(s => s.type === "현관").map(s => [s.id, "현관", "wd"]);
  if (l.id === "kitTile") return [["kitTile", "주방 벽", "wh"]];
  if (l.id === "balTile") return SL.filter(s => s.type === "발코니" && s.id === "bal1").map(s => [s.id, s.name, "wd"]);
  if (l.id === "balTile2") return SL.filter(s => s.type === "발코니" && s.id !== "bal1").map(s => [s.id, s.name, "wd"]);
  return [];
}
function tileOutAt(l, pid) {                          // 그 줄의 그 곳: 면적 → 박스 수 + (치수가 덜 들어갔거나 수량을 직접 넣어 둔 것) 알림
  const sp = tdList(R.S).find(s => s.id === pid), bo = tileBathOf(l), st = lnState(l), own = st.q !== undefined && st.q !== "", dm = (E.dim || {})[pid] || {}, half = pid !== "kitTile" && (+dm.w > 0) !== (+dm.d > 0);
  const t = pid === "kitTile" ? tdKit() : !sp ? "" : bo && bo.part === "w" ? `${tdPill(sp.measured)} 벽 <b>${sp.WT}㎡</b> (${toPy(sp.WT)}평) → 타일 <b>${tdBox(+sp.WT || 0, 1.44)}박스</b>`
    : bo ? `${tdPill(sp.measured)} 바닥 <b>${sp.A}㎡</b> (${toPy(sp.A)}평) → 타일 <b>${tdBox(+sp.A || 0, (st.alt || 0) === 1 ? 0.99 : 1.44)}박스</b>` : tdOut(sp);
  const b0 = bo && bo.n > 1 ? lineById(bo.part === "w" ? "wallTile" : "floorTile") : null, bq = b0 ? lnState(b0).q : undefined;
  if (own && +st.q === 0 && bq !== undefined && bq !== "" && +bq > 0)   // 욕실마다 줄이 나뉘기 전에 넣어 둔 합계 수량: 첫 줄에 모여 있고 이 줄은 0
    return t + ` <b style="color:var(--warn)">· 전에 넣어 둔 수량이 위 욕실1 줄에 합쳐져 있어 이 줄은 0입니다</b> <button type="button" class="wtr" data-tq0all="${bo.part === "w" ? "wallTile" : "floorTile"}">↺ 욕실마다 계산한 수량으로 나누기</button>`;
  return t + (half ? ` <b style="color:var(--warn)">· 가로와 세로를 둘 다 넣어야 치수로 계산됩니다 (지금은 어림값)</b>` : "")
    + (own ?` <b style="color:var(--warn)">· 수량을 직접 넣어 둔 줄이라 치수를 바꿔도 그대로입니다</b> <button type="button" class="wtr" data-tq0="${l.id}">↺ 계산한 수량으로</button>` : "");
}
function tileDimRow(l) {                              // 타일 줄 아래: 그 곳의 치수(mm) → 면적 · 박스 수
  if (!lnState(l).on) return ""; const ps = tilePlaces(l); if (!ps.length) return ""; const bo = tileBathOf(l);
  if (bo && bo.part === "f") { const w = lineById("wallTile" + (bo.n > 1 ? bo.n : "")); if (w && lnState(w).on && tilePlaces(w).length) return `<div class="bom tdr" data-tdrow="${ps[0][0]}"><span class="note">치수는 바로 위 벽 타일 줄에서 넣습니다 (가로 × 세로가 바닥 넓이)</span><span class="note" data-tdout="${l.id}">${tileOutAt(l, ps[0][0])}</span></div>` }
  const at = tileDimRow.at = tileDimRow.at || {}, cur = ps.some(p => p[0] === at[l.id]) ? at[l.id] : ps[0][0], p = ps.find(x => x[0] === cur), dm = E.dim || {};
  const v = k => { const x = (dm[cur] || {})[k]; return x === undefined || x === "" ? "" : Math.round(x * 1000) }, ph = { w: cur === "kitTile" ? "예: 2400" : "예: 1500", d: "예: 2300", h: cur === "kitTile" ? "600" : "2200" }, nm = { w: "가로", d: "세로", h: "높이" };
  const flds = [...p[2]].map(k => `<label>${nm[k]} <input class="q" type="number" min="0" step="10" inputmode="numeric" data-tdim="${cur}|${k}" value="${v(k)}" placeholder="${ph[k]}" aria-label="${esc(p[1] + " " + nm[k])} mm"></label>`).join("");
  const chips = ps.length > 1 ? `<span class="seg" role="group" aria-label="치수를 넣을 곳">${ps.map(x => `<button type="button" data-tdat="${l.id}|${x[0]}" aria-pressed="${x[0] === cur}">${esc(x[1])}</button>`).join("")}</span>` : "";
  return `<div class="bom tdr" data-tdrow="${cur}"><span class="note"><b>치수 mm</b>${ps.length > 1 ? " · 곳을 눌러 바꿉니다" : ""}</span>${chips}${flds}<span class="note" data-tdout="${l.id}">${tileOutAt(l, cur)}</span></div>`;
}
document.addEventListener("click", ev0 => { const t = ev0.target, b = t.closest && t.closest("[data-tq0]"), a = t.closest && t.closest("[data-tq0all]"); if (!b && !a) return;
  if (a) { for (const s of ["", "2", "3"]) { const l = lnFind(a.dataset.tq0all + s); if (l) setLn(l, { q: undefined }) } refresh(); toast("욕실마다 치수로 계산한 수량으로 나눴습니다. 합계가 달라졌을 수 있으니 확인해 주세요."); return }
  const l = lnFind(b.dataset.tq0); if (!l) return; setLn(l, { q: undefined }); refresh(); toast("치수로 계산한 수량으로 되돌렸습니다.") });
function tileAddBar(st, c) {                          // ‘타일’ 묶음 맨 위: 꺼져 있는 곳을 눌러서 넣는다 + 지금 들어가는 타일 합계
  const off = c.lines.map(lineById).filter(l => l && !l.gone && !l.dead && !HIDE_LINES.includes(l.id) && !lnState(l).on && /Tile|Wall/.test(l.id) && !tileGone(l) && !(tileBathOf(l) && !tilePlaces(l).length));
  return `<div class="tileadd"><b>＋ 타일 붙일 곳 추가</b>${off.map(l => `<button type="button" class="btn sm" data-tileon="${l.id}">+ ${esc((l.label || aliasOf(l.items[0])).replace(/ 타일$/, ""))}</button>`).join("") || '<span class="note">모든 곳이 켜져 있습니다</span>'}</div><p class="note tilesum" data-tdsum>${tdSum()}</p>`;
}
document.addEventListener("click", ev0 => { const t = ev0.target, a = t.closest && t.closest("[data-tdat]"), o = t.closest && t.closest("[data-tileon]"); if (!a && !o) return;
  if (a) { const [lid, pid] = a.dataset.tdat.split("|"); (tileDimRow.at = tileDimRow.at || {})[lid] = pid; renderChecklist(); return }
  const l = lnFind(o.dataset.tileon); if (!l) return; setLn(l, { on: true });
  for (const id of ["tileSub", "tileLabor"]) { const x = lnFind(id); if (x && !lnState(x).on) setLn(x, { on: true }) }   // 타일 부자재·작업비가 꺼져 있으면 함께 켠다
  refresh(); toast(`‘${l.label || aliasOf(l.items[0])}’을(를) 넣었습니다. 그 줄에서 치수나 박스 수를 확인하세요.`) });
function lnRow(l) {
  if (l.sel && D._woodSet && !lnState(l).opt) return selRow(l);
  const st = lnState(l), ls = (R.all || R.lines).filter(x => x.lid === l.id), amt = ls.reduce((a, x) => a + x.amt, 0);
  const name = l.items[Math.min(st.alt || 0, l.items.length - 1)], it = byName[name] || {};
  const main = ls.find(x => x.key === "ln|" + l.id);
  const auto = main ? main.auto : (() => { try { return r1(+ev(l.qty, lineVars(R.S)[stepOfLine(l)])) } catch (e) { return 1 } })();
  const m2 = it.unit === "㎡";
  const variant = l.items.length > 1 ? `<select data-ln="${l.id}" data-lf="alt" aria-label="종류">${l.items.map((n, i) => `<option value="${i}" ${(st.alt || 0) === i ? "selected" : ""}>${esc(aliasOf(n))}</option>`).join("")}</select>` : "";
  const qty = it.costVar ? `<span class="nb"><input type="number" min="0" step="10000" class="wide" data-ln="${l.id}" data-lf="c" value="${st.c ?? ""}" placeholder="업체 원가"><span class="note">원 (업체 견적)</span></span>`
    : (l.bom && l.bom.mode === "replace") ? `<span class="nb"><span class="note">1식</span><input type="number" min="0" step="1000" class="wide" data-ln="${l.id}" data-lf="p" value="${st.p ?? ""}" placeholder="${won(amt) || "금액"}" title="비워 두면 자동 계산 금액입니다. 금액만 바꾸면 되고, 포함 내역은 견적서에 자동으로 풀려 나갑니다"><span class="note">원 ${st.p !== undefined && st.p !== "" ? "<b>직접 넣은 금액</b> · 비우면 자동" : "(자동 · 금액을 적으면 그 금액)"}</span></span>`
    : `<span class="nb"><input type="number" min="0" step="0.1" data-ln="${l.id}" data-lf="q"${m2 ? ' data-py="1"' : ""} value="${m2 ? toPy(st.q ?? auto) : (st.q ?? auto)}"><span class="note">${m2 ? `평 <small data-m2v>(${r1(st.q ?? auto)}㎡)</small>` : esc(it.unit || "")}</span></span>`;
  const price = l.bom && l.bom.mode === "replace" ? "" : (main ? (main.tbd ? '<span class="tbd">단가 미정</span>' : `<span class="note">@${m2 ? "평당 " + won(main.price * PYM) : won(main.price)}</span>`) : (unitPrice(it, E) ? `<span class="note">@${m2 ? "평당 " + won(unitPrice(it, E) * PYM) : won(unitPrice(it, E))}</span>` : '<span class="tbd">단가 미정</span>'));
  const admP = isAdmin && !STAFF_DATA, canP = st.on && !(l.bom && l.bom.mode === "replace") && !it.costVar && !it.costTable;
  const priceIn = !canP ? "" : admP ? `<span class="nb"><input type="number" min="0" step="1000" class="wide" data-ln="${l.id}" data-lf="ap" value="${it.tier ? "" : (unitPrice(it, E) || "")}" placeholder="${it.tier ? "수량별 단가" : "기본 단가"}" ${it.tier ? "disabled" : ""} title="이 품목의 기본 단가를 바꿉니다. 모든 견적에 적용되고, ‘바꾼 단가 파일 받기’로 내보내 고정합니다"><span class="note">원/${esc(it.unit || "")} 기본단가${(c => c ? " · 원가 " + won(c) + (unitPrice(it, E) ? " · 마진 " + Math.round((1 - c / unitPrice(it, E)) * 1000) / 10 + "%" : "") : "")(unitCost(it, E))}</span></span>`
    : (main && main.tbd) || (st.p !== undefined && st.p !== "") ? `<span class="nb"><input type="number" min="0" step="1000" class="wide" data-ln="${l.id}" data-lf="p" value="${st.p ?? ""}" placeholder="단가 직접 입력" title="단가가 정해지지 않은 품목입니다. 이 견적에 쓸 단가를 직접 넣을 수 있습니다"><span class="note">원/${esc(it.unit || "")} (이 견적만)</span></span>` : "";
  let sub = "";
  if (st.on && l.bom && l.bom.mode === "replace" && st.p !== undefined && st.p !== "") sub = `<div class="bom note">견적서 포함 내역(수량 자동): ${esc(((main || {}).detail || []).map(d => d.name.replace(/\s*\(.*?\)/g, "") + " " + d.qty + d.unit).join(" · "))}</div>`;
  else if (st.on && l.bom && l.bom.mode === "replace") sub = `<details class="bom det"><summary>포함 자재 ${ls.length}가지 <span class="note">${esc(ls.map(x => aliasOf(x.name).replace(/\s*\(.*?\)/g, "") + " " + x.qty + x.unit).join(" · "))}</span> <b class="note">· 수량까지 고치려면 펼치기</b></summary>${ls.map(x => `<label class="bi"><span>${esc(aliasOf(x.name))}${x.it.spec ? `<small>${esc(x.it.spec)}</small>` : ""}</span><span class="nb"><input type="number" min="0" step="1" data-lq="${esc(x.key)}" value="${x.qty}"><span class="note">${esc(x.unit)}</span></span><span class="mp">${x.tbd ? '<span class="tbd">단가 미정</span>' : won(x.amt)}</span></label>`).join("")}</details>`;
  if (st.on && main && main.detailAll && main.detailAll.length) sub = `<details class="bom det"><summary>포함 내역 ${main.detail.length}가지 <span class="note">${esc(main.detailAll.filter(d => d.qty > 0).map(d => d.name + " " + d.qty + d.unit + (d.hide ? "(실장만)" : "")).join(" · "))}</span> <b class="note">· 눌러서 수량 고치기</b></summary>${main.detailAll.map(d => `<label class="bi"><span>${esc(d.name)}${d.note ? `<small>${esc(d.note)}</small>` : ""}</span><span class="nb"><input type="number" min="0" step="1" data-dq="${l.id}#${d.k}" value="${d.qty}" title="0으로 하면 견적서의 포함 내역에서 빠집니다"><span class="note">${esc(d.unit)}</span></span><span class="mp">${d.hide ? "실장만 봄" : d.qty !== d.auto ? `고침 <small>(자동 ${d.auto})</small>` : "포함"}</span></label>`).join("")}<p class="note" style="margin:4px 0 0">포함 내역은 금액에 이미 들어 있습니다. 수량을 고치면 견적서에 적히는 내용만 바뀝니다. 비우면 자동값으로 돌아갑니다.</p></details>`;
  if (st.on && l.set && main && main.detail && main.detail.length) { const pv = main.detail.reduce((a, d) => a + d.qty * (+unitPrice(byName[d.name] || {}, E) || 0), 0);   // 세트 줄: 포함 내역을 낱개로 샀을 때의 값과 견줘 보여 준다
    if (pv) sub += `<div class="bom note">낱개로 사면 ${won(pv)}원 → ${main.qty}식 ${won(main.amt)}원${admP && main.amt ? ` <span class="cost">· 원가 ${won(main.cost)}원 · 마진 ${Math.round((1 - main.cost / main.amt) * 1000) / 10}%</span>` : ""}</div>` }
  if (st.on && l.id === "woodLabor" && D._woodSet) sub = woodMenNote() + sub;
  const raw = E.ln[l.id] || {}, own = st.on && !it.costVar && ((raw.q !== undefined && raw.q !== "") || raw.alt !== undefined || (raw.p !== undefined && raw.p !== "")), bdm = own ? baseAmts() : null;
  const dnote = bdm && bdm._ok && Math.abs(amt - (bdm[l.id] || 0)) >= 1 ? `<div class="bom note dln">${dltChip(amt - (bdm[l.id] || 0))} <span class="note">자동(기본) ${won(bdm[l.id] || 0)}원 → 지금 ${won(amt)}원</span> <button type="button" class="wtr" data-lnreset="${l.id}" title="이 줄의 수량·종류·금액을 자동(기본)으로 되돌립니다">↺ 기본으로</button></div>` : "";
  if (st.on && l.id === "down") sub += downPlaces(auto);
  const cms = (R.cmp || []).filter(x => x.lid === l.id), cOpen = CMP_OPEN === l.id, sg = d => (d > 0 ? "+" : d < 0 ? "−" : "±") + won(Math.abs(d));
  const optCtl = !st.on ? `<button type="button" class="btn ghost sm cmpb" data-cmpset="${l.id}|1" title="합계에는 넣지 않고 금액만 따로 보여 줍니다">비교견적에 넣기</button>`
    : st.opt ? `<button type="button" class="btn ghost sm cmpb" data-cmpset="${l.id}|0" title="비교견적에서 빼고 합계에 넣습니다">합계에 넣기</button>`
    : `<button type="button" class="btn ghost sm cmpb${cms.length ? " has" : ""}" data-cmpopen="${l.id}" aria-expanded="${cOpen}" title="합계에는 넣지 않고 금액만 따로 보여 주는 비교견적을 만듭니다">비교견적${cms.length ? " " + cms.length : ""} ${cOpen ? "▴" : "▾"}</button>`;
  let cmpNote = st.on ? cms.map(cm => `<div class="bom note cmpn">비교견적 · ‘${esc(aliasOf(cm.to))}’(으)로 하면 공사비가 <b>${sg(cm.diff)}원</b> <small>(그때 공사비 합계 ${won(cm.net)}원 · VAT 별도)</small> <button type="button" class="btn ghost sm" data-cmpalt="${l.id}|${cm.alt}">빼기</button></div>`).join("") : "";
  if (cOpen && st.on && !st.opt) { const sel = cmpArr(st), ds = l.items.length > 1 ? altDiffs(l) : [];
    cmpNote += `<div class="cmpbox"><div class="cmph"><b>비교견적</b> 합계에는 넣지 않고, 고객에게 금액만 따로 보여 줍니다. 상세견적서 끝에 ‘비교견적’ 표로 나옵니다.</div>
      ${ds.length ? `<div class="cmpr"><span class="cmpl">다른 종류로 바꾸면 얼마? <small>누르면 비교견적에 들어갑니다 (여러 개 가능)</small></span><div class="cmpch">${ds.map(d => `<button type="button" data-cmpalt="${l.id}|${d.i}" aria-pressed="${sel.includes(d.i)}">${esc(aliasOf(l.items[d.i]))} <b>${d.tbd ? "단가 미정" : sg(d.diff)}</b></button>`).join("")}</div></div>` : ""}
      <div class="cmpr"><span class="cmpl">할지 말지 고객이 고르는 공사라면</span><div class="cmpch"><button type="button" data-cmpset="${l.id}|1">이 공사를 별도로 돌리기 <b>${won(amt)}</b></button></div><span class="note">지금 금액이 합계에서 빠지고 ‘별도’로 따로 표시됩니다.</span></div></div>` }
  const label = l.bom && l.bom.mode === "replace" ? `${esc(l.label || l.bom.label)} <small>${esc(l.bom.items.map(b => b.name.split(" (")[0]).join("·"))}</small>`
    : `${esc(l.label || aliasOf(name))}${aliasOf(name) !== name || l.label ? `<small>${esc(name)}</small>` : ""}`;
  return `<div class="pk ${st.on ? "" : "off"}${st.on && st.opt ? " opt" : ""}"><input type="checkbox" data-ln="${l.id}" data-lf="on" ${st.on ? "checked" : ""} aria-label="${esc(name)}">
    <span class="nm">${label}${l.loc ? ` <span class="pill">${esc(l.loc)}</span>` : ""}${l.note ? `<small class="lnote" title="실장 화면에만 보이는 계산 기준입니다. 고객 견적서에는 나가지 않습니다">${esc(l.note)}</small>` : ""}</span><span class="ctl">${variant}${qty}${price}${priceIn}${optCtl}</span>
    <span class="amt">${st.on && st.opt ? '<small class="optm">비교견적 · 별도</small> ' : ""}${st.on ? (amt ? won(amt) : (main && main.tbd ? '<span class="tbd">단가 미정</span>' : "0")) : "-"}</span>${lnUnder(l)}${dnote}${sub}${cmpNote}</div>`;
}
document.addEventListener("click", ev0 => {           // 비교견적 단추들
  const t = ev0.target, bo = t.closest("[data-cmpopen]"), bs = t.closest("[data-cmpset]"), ba = t.closest("[data-cmpalt]"), bc = t.closest("[data-cmpcat]"); if (!bo && !bs && !ba && !bc) return;
  if (bo) { CMP_OPEN = CMP_OPEN === bo.dataset.cmpopen ? null : bo.dataset.cmpopen; renderChecklist(); return }
  if (bs) { const [id, v] = bs.dataset.cmpset.split("|"), l = lnFind(id); if (!l) return; setLn(l, { on: true, opt: v === "1" }); CMP_OPEN = null; refresh(); toast(v === "1" ? "비교견적(별도)으로 돌렸습니다. 합계에는 들어가지 않습니다." : "합계에 넣었습니다."); return }
  if (ba) { const [id, i] = ba.dataset.cmpalt.split("|"), l = lnFind(id); if (!l) return; const a = cmpArr(lnState(l)), k = a.indexOf(+i); if (k >= 0) a.splice(k, 1); else a.push(+i); setLn(l, { cmp: a.length ? a : undefined }); refresh(); return }
  if (bc) { const [sk, ck, v] = bc.dataset.cmpcat.split("|"), c = (D.cats[sk] || []).find(x => x.key === ck); if (!c) return; const lines = c.lines.map(lineById).filter(Boolean);
    if (v === "1" && !lines.some(l => lnState(l).on)) { const tag = presetTag() || "F"; let core = lines.filter(l => l.tags.includes(tag)); if (!core.length) core = lines.filter(l => l.tags); if (!core.length) core = [lines[0], ...lines.filter(helpIsSup)]; core.forEach(l => setLn(l, { on: true })) }   // 꺼져 있던 묶음: 대표 공사 + 부자재·작업비까지 켜서 별도로
    lines.filter(l => lnState(l).on).forEach(l => setLn(l, { opt: v === "1" })); refresh(); toast(v === "1" ? `‘${c.label}’ 묶음을 비교견적(별도)으로 돌렸습니다. 합계에는 들어가지 않습니다.` : `‘${c.label}’ 묶음을 합계에 넣었습니다.`) }
});
document.addEventListener("change", ev0 => {
  const el = ev0.target; if (!el.dataset.ln) return;
  const l = Object.values(D.stepLines).flat().find(x => x.id === el.dataset.ln), f = el.dataset.lf;
  if (f === "on") setLn(l, { on: el.checked }); else if (f === "alt") setLn(l, { alt: +el.value, on: true }); else if (f === "p" || f === "q" || f === "c") return; else if (f === "ap") { const st = lnState(l), it = byName[l.items[Math.min(st.alt || 0, l.items.length - 1)]]; if (!it) return; adminPrice(it.name, +el.value || 0); return }
  else if (f === "opt") setLn(l, { opt: el.checked, on: true }); else if (f === "cmp") setLn(l, { cmp: el.value === "" ? undefined : +el.value });
  refresh();
});
document.addEventListener("input", ev0 => {
  const el = ev0.target;
  if (el.dataset.dq) { E.dq = E.dq || {}; if (el.value === "") delete E.dq[el.dataset.dq]; else E.dq[el.dataset.dq] = el.value; R = compute(); renderSummary(); save(); clearTimeout(LN_T); LN_T = setTimeout(reKeep, 1200); return }
  if (el.dataset.ln && (el.dataset.lf === "q" || el.dataset.lf === "c" || el.dataset.lf === "p")) {
    const l = Object.values(D.stepLines).flat().find(x => x.id === el.dataset.ln);
    setLn(l, { [el.dataset.lf]: el.value === "" ? undefined : (el.dataset.py ? Math.round(+el.value * PYM * 10) / 10 : +el.value), on: true });
    R = compute(); renderSummary(); save(); const row = el.closest(".pk"), mv = row.querySelector("[data-m2v]"); if (mv) { const ml = (R.all || R.lines).find(x => x.key === "ln|" + l.id); if (ml) mv.textContent = `(${ml.qty}㎡)` } row.classList.remove("off"); row.querySelector("input[type=checkbox]").checked = true;
    if (!(l.sel && D._woodSet && !lnState(l).opt)) row.querySelector(".amt").textContent = won((R.all || R.lines).filter(x => x.lid === l.id).reduce((a, x) => a + x.amt, 0));
    clearTimeout(LN_T); LN_T = setTimeout(reKeep, 1200);
  }
  if (el.dataset.lq) { E.lq = E.lq || {}; E.lq[el.dataset.lq] = el.value; R = compute(); renderSummary(); save(); const x = R.lines.find(y => y.key === el.dataset.lq); if (x) el.closest(".bi").querySelector(".mp").textContent = won(x.amt) }
});
let LN_T = 0;
function reKeep() {                                   // 공사 목록을 다시 그리되, 글자를 넣던 칸과 펼쳐 둔 포함 내역은 그대로 둔다
  const a = document.activeElement, d = a && a.dataset ? a.dataset : {}, sel = d.pyov ? `[data-pyov="${d.pyov}"]` : d.lad ? `[data-lad="${d.lad}"]` : d.ln ? `[data-ln="${d.ln}"][data-lf="${d.lf}"]` : d.dq ? `[data-dq="${d.dq}"]` : d.lq ? `[data-lq="${d.lq}"]` : "";
  const open = [...document.querySelectorAll("#stepBody details.det[open]")].map(x => { const i = x.querySelector("[data-dq],[data-lq]"); return i ? (i.dataset.dq ? `[data-dq="${i.dataset.dq}"]` : `[data-lq="${i.dataset.lq}"]`) : "" }).filter(Boolean);
  renderChecklist();
  for (const k of open) { const i = document.querySelector(k), x = i && i.closest("details"); if (x) x.open = true }
  if (sel) { const n = document.querySelector(sel); if (n) { n.focus(); if (n.tagName === "INPUT" && n.type === "number") { const v = n.value; n.value = ""; n.value = v } } }
}
function ladCtl(st, c) {                              // 사다리차 묶음: 운임표 그대로 — 층수 · 사용 시간(기본 1시간 / 반대 4시간 / 일대 8시간) · 추가 시간 · 부르는 횟수. 금액은 층수별 표에서 자동
  const l = lineById("ladder"), la = lineById("ladderAdd"); if (!l) return "";
  const x = lnState(l), xa = la ? lnState(la) : {}, alt = Math.min(x.alt || 0, l.items.length - 1), lv = +E.level || 1, T = ["기본 1시간", "반대 4시간", "일대 8시간"], itOf = n => byName[n] || {};
  const pr = (n, lvl) => +unitPrice(itOf(n), lvl === undefined ? E : { ...E, level: lvl }) || 0, pa = la ? pr(la.items[0]) : 0;
  const n = x.on ? (x.q !== undefined && x.q !== "" ? +x.q : 1) : 0, add = la && xa.on ? (xa.q !== undefined && xa.q !== "" ? +xa.q : 1) : 0, base = pr(l.items[alt]);
  const tab = itOf(l.items[0]).costTable || [], cur = tab.find(r => lv >= r[0] && lv <= r[1]) || (tab.length ? (lv < tab[0][0] ? tab[0] : tab[tab.length - 1]) : null), fl = r => r[0] === r[1] ? r[0] + "층" : r[1] > 90 ? r[0] + "층 이상" : r[0] + "~" + r[1] + "층";
  const adm = isAdmin && !STAFF_DATA, cst = nm => adm ? ` <small class="cost">원가 ${won(tableCost(itOf(nm), E))}</small>` : "";
  const tbl = tab.length ? `<details class="ladt"><summary>층수별 금액표 보기 <span class="note">(부가세 별도)</span></summary><div class="tw"><table><thead><tr><th>층수</th><th>기본 1시간</th><th>추가 1시간</th><th>반대 4시간</th><th>일대 8시간</th></tr></thead><tbody>${tab.map(r => `<tr class="${r === cur ? "cur" : ""}"><td>${fl(r)}</td><td>${won(pr(l.items[0], r[0]))}</td><td>${la ? won(pr(la.items[0], r[0])) : "-"}</td><td>${won(pr(l.items[1] || l.items[0], r[0]))}</td><td>${won(pr(l.items[2] || l.items[0], r[0]))}</td></tr>`).join("")}</tbody></table></div></details>` : "";
  return `<div class="pyrow ladrow"><label class="pyf"><span>현장 층수</span><span class="nb"><input type="number" min="1" max="99" step="1" inputmode="numeric" data-lad="lv" value="${lv}" aria-label="현장 층수"><span class="note">층</span></span></label>
    <div class="ladk"><span>사용 시간 <small>누르면 바뀝니다</small></span><div class="ladb">${l.items.map((nm, i) => `<button type="button" data-ladalt="${i}" aria-pressed="${alt === i}">${T[i] || esc(aliasOf(nm))}<b>${won(pr(nm))}원</b>${cst(nm)}</button>`).join("")}</div></div>
    ${la ? `<label class="pyf"><span>추가 시간 <small>1시간에 ${won(pa)}원</small></span><span class="nb"><input type="number" min="0" step="1" inputmode="numeric" data-lad="add" value="${add}" aria-label="추가 시간"><span class="note">시간</span></span></label>` : ""}
    <label class="pyf"><span>부르는 횟수</span><span class="nb"><input type="number" min="1" step="1" inputmode="numeric" data-lad="n" value="${n || 1}" aria-label="사다리차 횟수"><span class="note">회</span></span></label>
    <div class="pyn"><div class="ladsum">${cur ? fl(cur) : lv + "층"} · ${T[alt] || ""} ${won(base)}원 × ${n || 1}회${add ? ` + 추가 ${add}시간 ${won(pa * add)}원` : ""} = <b>${won(base * (n || 1) + pa * add)}원</b></div>
      <div class="note">층수에 맞는 운임표 금액이 자동으로 들어갑니다(부가세 별도). 기본은 1시간이고, 넘기면 추가 시간을 넣거나 반대(4시간)·일대(8시간)로 바꿉니다. 층수는 ‘현장 정보’의 층과 같은 값입니다.</div>${tbl}</div></div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-ladalt]"); if (!b) return; const l = lineById("ladder"); if (!l) return; setLn(l, { alt: +b.dataset.ladalt, on: true }); refresh() });
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.lad === undefined) return; const k = el.dataset.lad, v = Math.round(+el.value || 0), l = lineById("ladder"), la = lineById("ladderAdd");
  if (k === "lv") { if (!(v >= 1)) return; E.level = v; applyPackages() }                      // 층수는 현장 정보의 ‘층’과 같은 값
  else if (k === "add" && la) setLn(la, v > 0 ? { on: true, q: v } : { on: false, q: undefined })   // 추가 시간: 0이면 줄을 끈다
  else if (k === "n" && l) { if (!(v >= 1)) return; setLn(l, { on: true, q: v === 1 ? undefined : v }) }
  R = compute(); renderSummary(); save(); clearTimeout(LN_T); LN_T = setTimeout(reKeep, 900) });
function pyAutoAmt(sk, ids) {                          // 평수를 자동으로 뒀다면 이 묶음이 얼마였을지 (직접 넣은 평수와 견줘 보여 준다)
  const dpS = sk === "s9"; if (CMP_BUSY || (dpS ? !(+E.dpOv > 0) : !E.pyOv || !(sk in E.pyOv))) return null; const keep = dpS ? E.dpOv : E.pyOv[sk]; CMP_BUSY = true;
  try { if (dpS) delete E.dpOv; else delete E.pyOv[sk]; return compute0().lines.filter(x => ids.includes(x.lid)).reduce((a, x) => a + x.amt, 0) } catch (e) { return null } finally { if (dpS) E.dpOv = keep; else E.pyOv[sk] = keep; CMP_BUSY = false } }
function pyCtl(st, c) {                               // 도배·바닥 묶음: 평수 한 칸 + 종류. 도배는 ‘도배 평수’(34평 집 = 85평), 바닥은 아파트 평형. 나머지(자재·부자재·작업비·식대)는 프로그램이 계산해 상세견적서에 나눠 적는다
  const sk = st.key, V = lineVars(R.S)[sk] || {}, paper = sk === "s9", house = +E.py || 0, val = paper ? V.dp : V.py, auto = paper ? V.dpAuto : V.pyAuto, whole = paper ? Math.round(house * 2.5) : house, ovr = val !== auto, l = lineById(c.pyc), x = l ? lnState(l) : null;
  const kind = l && l.items.length > 1 ? `<label class="pyf"><span>${paper ? "벽지 종류" : "바닥재 종류"}</span><select data-ln="${l.id}" data-lf="alt" aria-label="${paper ? "벽지 종류" : "바닥재 종류"}">${l.items.map((n, i) => `<option value="${i}" ${(x.alt || 0) === i ? "selected" : ""}>${esc(aliasOf(n).replace(/\s*\(평당\)/, ""))}</option>`).join("")}</select></label>` : "";
  const m = (R.all || R.lines).find(y => y.key === "ln|" + c.pyc), calc = paper || !m ? "" : m.unit === "㎡" ? `실제 까는 넓이 <b>${toPy(m.qty)}평</b> <small>(${m.qty}㎡ · 로스 포함)</small>` : m.unit === "평" ? `${/^강마루/.test(m.name) ? "강마루" : /^장판/.test(m.name) ? "장판" : "바닥재"} <b>${m.qty}평</b> <small>(아파트 평수 그대로${m.cq ? ` · 실제 까는 넓이는 약 ${m.cq}평` : ""} · 깎아 줄 때는 평수를 줄여 넣습니다)</small>` : `바닥재 <b>${m.qty}${esc(m.unit || "")}</b>`;
  const labTxt = paper || !m ? "" : (() => { const A = R.all || R.lines, f = id => A.find(y => y.key === "ln|" + id), fl = f("floorLabor"), lp = f("floorLab45") || f("floorLab5");   // (v71) 평수에 따라 정해진 작업 인원을 바로 보여 준다
    return /^강마루/.test(m.name) ? " · 작업비는 바닥재 금액에 들어 있습니다" : lp ? ` · 시공비 <b>${lp.qty}평</b> <small>(4.5T·5T는 평당 시공비)</small>` : fl ? ` · 작업 인원 <b>${fl.qty}명</b> <small>(${m.unit === "평" ? "장판은 35평까지 1명 · 35평이 넘으면 2명" : "90㎡에 1명 + 여유 1명"} — 평수를 바꾸면 따라 바뀝니다)</small>` : "" })();
  const fixed = c.lines.filter(id => { const y = lineById(id), r = y ? lnState(y) : {}; return (r.q !== undefined && r.q !== "") || Object.keys(E.dq || {}).some(k => k.startsWith(id + "#")) || Object.keys(E.lq || {}).some(k => k.startsWith("ln|" + id + "#")) }).length;
  let d = 0; if (ovr) { const a0 = pyAutoAmt(sk, c.lines); if (a0 !== null) d = R.lines.filter(y => c.lines.includes(y.lid)).reduce((a, y) => a + y.amt, 0) - a0 }
  const why = ovr ? `<b>직접 넣은 평수</b>입니다 <small>(자동은 ${auto}평${Math.abs(d) >= 1 ? ` · 자동일 때보다 ${d > 0 ? "+" : "−"}${won(Math.abs(d))}원` : ""})</small> <button type="button" class="wtr" data-pyovr="${sk}">↺ 자동 ${auto}평으로</button>`
    : auto !== whole ? `도면에서 넣고 뺀 곳(공간·벽·천장)을 반영한 평수입니다 <small>(집 전체는 ${whole}평)</small>`
    : paper ? `집 전체(아파트 ${house}평)를 도배하는 평수입니다. 일부만 하면 줄인 도배 평수를 넣으세요.` : `집 전체(아파트 ${house}평) 기준입니다. 일부만 하면 줄인 평수를 넣으세요.`;
  return `<div class="pyrow"><label class="pyf"><span>${paper ? "도배 평수" : "평수 <small>아파트 평형 기준</small>"}</span><span class="nb"><input type="number" min="0" step="${paper ? 1 : 0.5}" inputmode="decimal" data-pyov="${sk}" value="${val ?? ""}" aria-label="${paper ? "도배 평수" : "평수 (아파트 평형 기준)"}"><span class="note">평</span></span></label>${kind}
    <div class="pyn"><div>${why}</div><div class="note">${paper ? "도배 평수와 벽지 종류만 정하면 벽지·부자재(벽지와 같은 평수)·도배 작업비·식대를 프로그램이 계산해 상세견적서에 나눠 적습니다." : `평수와 바닥재 종류만 정하면 바닥재·부자재·작업비·식대를 프로그램이 계산해 상세견적서에 나눠 적습니다.${calc ? ` 지금 계산: ${calc}${labTxt}` : ""}`}</div>${fixed ? `<div class="pyw">직접 고친 수량 ${fixed}줄은 평수를 바꿔도 그대로입니다. <button type="button" class="wtr" data-pyfollow="${sk}|${c.key}">↺ 모두 평수에 맞추기</button></div>` : ""}</div></div>`;
}
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.pyov === undefined) return; const sk = el.dataset.pyov, V = lineVars(R.S)[sk] || {};
  if (sk === "s9") { const v = Math.round(+el.value || 0); if (v > 0 && v !== V.dpAuto) E.dpOv = v; else delete E.dpOv }   // 도배 평수 (비우거나 자동과 같게 넣으면 ‘직접 넣은 값’으로 보지 않는다)
  else { const v = +el.value; E.pyOv = E.pyOv || {}; if (v > 0 && v !== V.pyAuto) E.pyOv[sk] = v; else delete E.pyOv[sk]; pyfClear(sk) }
  R = compute(); renderSummary(); save(); clearTimeout(LN_T); LN_T = setTimeout(reKeep, 900) });
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-pyovr]"), f = ev0.target.closest("[data-pyfollow]"); if (!b && !f) return;
  if (b) { if (b.dataset.pyovr === "s9") delete E.dpOv; else { if (E.pyOv) delete E.pyOv[b.dataset.pyovr]; pyfClear(b.dataset.pyovr) } refresh(); toast("자동 평수로 되돌렸습니다."); return }
  const [sk, ck] = f.dataset.pyfollow.split("|"), c = ((D.cats || {})[sk] || []).find(y => y.key === ck); if (!c) return;
  for (const id of c.lines) { const r = E.ln[id]; if (r && r.q !== undefined) { const y = { ...r }; delete y.q; E.ln[id] = y } for (const k of Object.keys(E.dq || {})) if (k.startsWith(id + "#")) delete E.dq[k]; for (const k of Object.keys(E.lq || {})) if (k.startsWith("ln|" + id + "#")) delete E.lq[k] }
  refresh(); toast("직접 고친 수량을 평수에 맞춰 자동으로 되돌렸습니다.") });
function applyPreset2(i) { E.preset = i; E.ln = {}; E.lq = {} }
function stepStats(st) {
  if (D.stepLines) {
    const rows = D.stepLines[st.key] || [];
    const on = rows.filter(l => lnState(l).on).length + E.extras.filter(x => st.procs.includes(x.item ? (byName[x.item] || {}).proc : x.proc)).length;
    const amt = R.lines.filter(l => l.step === st.key || (l.extra && st.procs.includes(l.proc))).reduce((a, l) => a + l.amt, 0);
    return { on, amt };
  }
  const pks = (D.packages || []).filter(p => st.pk.includes(p.key));
  const on = pks.filter(p => pkState(p).on).length;
  const ex = E.extras.filter(x => st.procs.includes(x.item ? (byName[x.item] || {}).proc : x.proc)).length;
  const amt = R.lines.filter(l => st.procs.includes(l.proc)).reduce((a, l) => a + l.amt, 0);
  return { on: on + ex, amt };
}
/* ───── (v94) 공정별로 나눠 보기 ─────
   사용자(2026-11-22): “가설공사로 나뉘는 곳과 철거가 나뉘는 곳을 그리고 전체적으로 해당 공사에서 나뉘는 곳이 명확해야지 실장들이 보고 견적금액 및 원가를 변경하지
   위에 가설 밑에 가설 중간에 철거 이런식으로 나눠져있으면 사용하기 불편해 모든 공정들이 공정별로 나눠서도 볼 수 있어야지”.
   ① 단계 화면(procRows): 묶음 카드를 ‘견적 합계’의 공정별로 모으고 공정 이름 줄(procHead)로 가른다 — ‘보양·철거’ = 가설공사 묶음들 → 철거공사 묶음들. 그 묶음 안에 다른 공정으로 집계되는 줄(식대 → 기타·마감 등)이 있으면 알려 준다.
   ② ‘공정별로 보기’(procView): 견적 합계의 공정마다 무엇이 들어 있는지(줄 · 수량 · 금액 · 어느 단계)를 한 화면에 — 원가 칸도 여기서 고친다(같은 칸). 견적 합계 칸의 공정 이름 · 단계 화면의 공정 이름 줄에서 연다.
   줄마다의 원가는 보여 주지 않는다(공정 합계만 — 전과 같다). 고객 견적서에는 아무것도 달라지지 않는다. */
let PROC_MAP = null, PROC_MAPN = -1, PROC_VIEW = null;
function lineProc(l) { const r = R.lines.find(x => x.lid === l.id); if (r) return r.proc; if (!PROC_MAP || PROC_MAPN !== D.catalog.length) { PROC_MAP = new Map(D.catalog.map(i => [i.name, i.proc])); PROC_MAPN = D.catalog.length } return PROC_MAP.get(l.items[lnState(l).alt || 0]) || PROC_MAP.get(l.items[0]) || "" }
function catProc(c, st) { const n = {}, own = (st && st.procs) || []; for (const id of c.lines) { const l = lineById(id); if (!l || l.gone || l.dead) continue; const q = lineProc(l); if (q) n[q] = (n[q] || 0) + (lnState(l).on ? 3 : 1) }   // 켜진 줄을 더 무겁게
  return Object.keys(n).sort((a, b) => n[b] - n[a] || (own.includes(b) ? 1 : 0) - (own.includes(a) ? 1 : 0) || PROCS.indexOf(a) - PROCS.indexOf(b))[0] || "" }
function procHead(st, pr, cats) {
  const ids = new Set(cats.flatMap(c => c.lines)), amt = R.lines.filter(r => r.lid && ids.has(r.lid) && r.proc === pr).reduce((a, r) => a + (r.amt || 0), 0), tot = R.byProc[pr] ? R.byProc[pr].amt : 0, oth = {};
  for (const r of R.lines) if (r.lid && ids.has(r.lid) && r.proc !== pr && r.amt > 0) (oth[r.proc] = oth[r.proc] || []).push(custName(aliasOf(r.name)));
  const on = Object.entries(oth).map(([q, ns]) => { const u = [...new Set(ns)]; return `${esc(u.slice(0, 2).join(" · "))}${u.length > 2 ? " 외" : ""} → ${esc(PROC_LABEL[q] || q)}` }).join(" / ");
  return `<div class="prochd"><b>${esc(PROC_LABEL[pr] || pr)}</b><span class="pa">${amt > 0 ? `아래 묶음 ${won(amt)}원` : "아직 켜진 공사 없음"}${amt > 0 && Math.abs(tot - amt) >= 1 ? ` <small>· 견적 합계의 ‘${esc(PROC_LABEL[pr] || pr)}’은 ${won(tot)}원 (다른 단계의 줄 포함)</small>` : ""}</span><button type="button" class="btn ghost sm" data-procview="${esc(pr)}" title="이 공정에 들어 있는 줄을 한 화면에 봅니다">공정별로 보기</button>${on ? `<div class="note">아래 묶음의 줄 가운데 ${on} 공정으로 집계됩니다.</div>` : ""}</div>`;
}
function procRows(st) {
  const gp = new Map(); for (const c of catShown(st)) { const q = catProc(c, st) || (st.procs || [])[0] || ""; (gp.get(q) || gp.set(q, []).get(q)).push(c) }
  const ord = q => (PROCS.indexOf(q) + 99) % 99;
  return [...gp.keys()].sort((a, b) => ord(a) - ord(b)).map(q => (q ? procHead(st, q, gp.get(q)) : "") + gp.get(q).map(c => catCard(st, c)).join("")).join("");
}
function procViewHtml() {
  const mgs = mgCan() && !mgHidden(), steps = STEPS(), ps = PROCS.filter(q => R.byProc[q]), si = k => { const i = steps.findIndex(s => s.key === k); return i < 0 ? 99 : i };
  const sec = q => { const b = R.byProc[q], ls = R.lines.filter(r => r.proc === q && (r.amt > 0 || r.qty > 0)).sort((x, y) => si(x.step) - si(y.step));
    const row = r => { const gi = steps.findIndex(s => s.key === r.step), at = r.lid ? { lid: r.lid, say: "이 줄입니다." } : r.key ? { key: r.key, say: "이 줄입니다." } : null;
      return `<tr><td>${esc(custName(r.docName || aliasOf(r.name)))}${r.extra ? ' <small class="note">직접 넣음</small>' : ""}</td><td class="r">${r.qty}${esc(r.unit || "")}</td><td class="r">${won(r.amt)}</td><td class="r">${gi >= 0 ? `<button type="button" class="lk" data-goto="${gi}"${at ? atAttr({ at }) : ""} data-procclose title="그 줄로 가서 고칩니다">${esc(helpCut(steps[gi].label, 9))} ›</button>` : ""}</td></tr>` };
    return `<section class="pvsec" id="pv_${PROCS.indexOf(q)}"><div class="pvh"><b>${esc(PROC_LABEL[q] || q)}</b><span class="spacer"></span>${mgs ? `<span class="pvamt"><span class="note">원가</span>${mgRow(q)}</span>` : ""}<span class="pvamt"><span class="note">견적 금액</span><b class="pa">${won(b.amt)}</b></span></div><table class="pvt"><tbody>${ls.map(row).join("")}</tbody></table></section>` };
  return `<div class="card" style="width:min(780px,100%);margin:auto"><div class="hd"><h2>공정별로 보기</h2><span class="note">견적 합계의 공정마다 들어 있는 줄입니다${mgs ? " · 원가 칸은 여기서 고쳐도 같습니다" : ""}</span><span class="spacer"></span><button type="button" class="btn sm" data-procclose>닫기</button></div>
    <div class="bd">${ps.length ? ps.map(sec).join("") : '<p class="note">아직 켜진 공사가 없습니다.</p>'}<div class="srow" style="border-top:2px solid var(--ink);padding-top:8px"><span>공정 합계 <small class="note">(기업이윤 · 부가세 전)</small></span><b>${won(R.sum)}</b></div>
    <div class="note" style="margin-top:6px">줄 오른쪽의 단계 이름을 누르면 그 줄로 가서 수량 · 종류를 고칩니다. 고객 견적서에는 이 화면이 나가지 않습니다.</div></div></div>`;
}
function procView(pr) {
  if (pr) PROC_VIEW = pr; if (!PROC_VIEW) return;
  let box = document.getElementById("procBox"); const st0 = box ? box.scrollTop : -1;
  if (!box) { document.body.insertAdjacentHTML("beforeend", '<div id="procBox" style="position:fixed;inset:0;z-index:94;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow:auto"></div>'); box = document.getElementById("procBox") }
  box.innerHTML = procViewHtml();
  if (st0 >= 0) box.scrollTop = st0; else if (pr && pr !== "*") { const s = document.getElementById("pv_" + PROCS.indexOf(pr)); if (s) box.scrollTop = Math.max(0, s.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 70) }
}
function procClose() { const b = document.getElementById("procBox"); if (b) b.remove(); PROC_VIEW = null }
document.addEventListener("click", ev0 => { const t0 = ev0.target; if (!t0.closest) return;
  const v = t0.closest("[data-procview]"); if (v) { procView(v.dataset.procview || "*"); return }
  if (t0.closest("[data-procclose]") || t0.id === "procBox") procClose() });
document.addEventListener("keydown", ev0 => { if (ev0.key === "Escape" && document.getElementById("procBox") && !(ev0.target.dataset && ev0.target.dataset.costov !== undefined)) procClose() });
function renderChecklist() {
  document.querySelectorAll(".spottip").forEach(x => x.remove());
  const steps = STEPS(); E.step = Math.min(Math.max(0, E.step || 0), steps.length - 1);
  $("#steps").innerHTML = FIND_HTML + steps.map((st, i) => { const s = i && i < steps.length - 1 ? stepStats(st) : null;
    return `<button type="button" data-goto="${i}" ${i === E.step ? 'aria-current="step"' : ""} class="${s && s.on ? "done" : ""}"><span class="no">${i === steps.length - 1 ? "✓" : i}</span><span>${esc(st.label)}</span><span class="cnt">${s ? (s.on ? s.on + "건" : "") : ""}</span></button>` }).join("");
  $("#stepPos").textContent = `${E.step} / ${steps.length - 1}`;
  document.querySelector('[data-step="prev"]').disabled = E.step === 0;
  const nx = document.querySelector('[data-step="next"]'); delete nx.dataset.armed; nx.textContent = E.step === steps.length - 1 ? "상세견적서 보기 →" : E.step === steps.length - 2 ? "확인 →" : `다음: ${steps[E.step + 1].label} →`;
  const st = steps[E.step], body = $("#stepBody");
  if (E.step === 0) {
    body.innerHTML = estBar() + `<div class="sthead"><h2>현장 정보</h2><span class="note">평형과 방·욕실 수로 공간별 ㎡가 자동 계산됩니다.</span></div><div id="info"></div>
      <div class="sthead"><h2>공사 유형</h2><span class="note">고르면 자주 하는 공사가 미리 체크됩니다. 다음 단계에서 하나씩 바꿀 수 있습니다.</span></div><div class="presets" id="presets" style="padding:0 14px 14px"></div><div id="info2" style="padding:0 14px 14px"></div>`;
    renderInfo();
    $("#presets").innerHTML = (D.presets2 || D.presets || []).map((p, i) => `<button type="button" data-preset="${i}" aria-pressed="${E.preset === i}">${esc(p.label)}</button>`).join("");
    return;
  }
  if (E.step === steps.length - 1) { renderConfirm(body, steps); return }
  const s = stepStats(st);
  const XA = D.cats && D.cats[st.key] ? catXAssign(st) : null; if (!XA) catXAssign.sk = "";   // (v75) 직접 넣은 줄을 묶음별로
  const rows = D.cats && D.cats[st.key] ? procRows(st)
    : D.stepLines ? (D.stepLines[st.key] || []).map(lnRow).join("") : (D.packages || []).filter(p => st.pk.includes(p.key)).map(p => pkRow(p, pkAmounts())).join("");
  const xset = new Set(E.extras.filter(x => x.item).map(x => x.item));
  const others = D.catalog.filter(i => st.procs.includes(i.proc) && !USED.has(i.name) && (xset.has(i.name) || (!USEDB.has(nmBase(i.name)) && !HIDE_ITEMS.includes(i.name))));   // 공사 줄에 이미 있는 것과 이름이 같은 품목은 감춘다 (금액이 달라 헷갈리지 않게)
  const checked = new Map(E.extras.filter(x => x.item).map(x => [x.item, x]));
  const nOn = others.filter(i => checked.has(i.name)).length;
  const custom = XA ? XA.rest : (R.all || R.lines).filter(l => l.extra && !l.it && !l.film && (l.at ? l.at === st.key : st.procs.includes(l.proc)) && !String(l.key).startsWith("xw"));   // 창호 목록에서 넣은 창은 위 표에서 고친다
  body.innerHTML = `<div class="sthead"><h2>${esc(st.label)}</h2><span class="note">하지 않는 공사는 체크를 끄면 됩니다.</span>${D.stepLines ? stepDelta(st) : ""}<b class="tabnum">${won(s.amt)}원</b></div>
    ${D.stepLines ? planCard(st) : ""}${st.key === "s11" ? furnBar() : ""}${st.key === "s7" && D.stepLines && D.cats ? bathModeNote() + bathSum(st) : ""}
    ${st.key === "s4" && D.cats ? workChooser(st) : ""}<div class="pgroup">${rows || '<p class="note" style="padding:0 14px">주요 공사가 없습니다.</p>'}</div>${st.key === "s4" && D._woodSet && D.cats ? woodTail() : ""}${st.key === "s10" && D.stepLines ? filmCard() : ""}
    <details class="more allmore" ${nOn ? "open" : ""}><summary><b>목록에 없는 품목 찾아 넣기</b> <span class="note">${others.length}개${nOn ? ` · ${nOn}개 체크됨` : " · 필요할 때만 펼치세요"}</span></summary><div class="pgroup"><h3>추가 품목 <span class="note">단가가 없어도 체크하면 견적서에 ‘별도 협의’로 들어갑니다</span></h3>
    ${groupsOf(others).map(([g, list]) => { const on = list.filter(i => checked.has(i.name)).length;
      return `<details class="more" ${on ? "open" : ""}><summary>${esc(g)} <span class="note">${list.length}개${on ? ` · ${on}개 체크` : ""}</span></summary>
      ${list.length > 12 ? '<input class="search" type="search" placeholder="품목 검색" data-msearch>' : ""}
      <div class="mlist">${list.map(i => { const x = checked.get(i.name), pr = unitPrice(i, E);
        return `<label class="mi ${x ? "on" : ""}" data-mname="${esc(i.name)}"><input type="checkbox" data-xitem="${esc(i.name)}" ${x ? "checked" : ""}>
          <span class="mn">${esc(i.name)}${i.spec ? `<small>${esc(i.spec)}</small>` : ""}</span>
          <span class="mp">${x ? `<input class="mq" type="number" min="0" step="0.1" data-xq="${esc(i.name)}" value="${x.qty}"> ${esc(i.unit)}` : (pr ? won(pr) + "/" + esc(i.unit) : '<span class="tbd">단가 미정</span>')}</span></label>` }).join("")}</div>
    </details>` }).join("")}</div></details>
    ${quickAddCard(st, custom)}`;
}
const WOOD_MEN = { flatCeil: "+1명", halfIn: "+1.5명", insul: "+1.5명" };   // 화면에 적어 주는 인원 (실제 계산식은 데이터의 woodLabor 수량식)
function woodHead(st) {                               // 목공 단계 맨 위: 작업은 아래 묶음 카드에서 고른다 (발코니 확장과 같은 형식 — 카드 → 줄(수량 × 단가 = 금액) → 포함 내역)
  const cs = ((D.cats || {}).s4 || []).filter(c => c.only && !c.main && !HIDE_LINES.includes(c.only) && !CAT_OPEN["s4|" + c.key] && !c.lines.some(id => { const x = lineById(id); return x && lnState(x).on }));
  return `<div class="pgroup wkc whd"><h3>목공 작업 고르기 <span class="note"><b>작업 카드를 체크</b>하면 그 작업의 자재 · 부자재 · 목수 인원이 함께 들어갑니다 (목수 인원은 맨 아래 ‘공통’ 카드의 목수 작업비에 합산)</span></h3>
    ${cs.length ? `<div class="wkr"><b>다른 작업</b><div class="cmpch">${cs.map(c => `<button type="button" data-wk="${c.only}">+ ${esc(c.label)}${WOOD_MENS[c.only] ? ` <small>목수 ${WOOD_MENS[c.only]}명</small>` : ""}</button>`).join("")}</div></div>` : ""}</div>`;
}
function woodTail() {                                 // 목공 카드 아래: 목록에 없는 작업(목수 인원으로 넣기) · 1식 단가
  const adm = isAdmin && !STAFF_DATA, all = R.all || R.lines;
  const sets = [[SET_GEN, "목자재 1식"], [SET_RND, "라운드 목자재 1식"], [SET_INS, "단열 목자재 1식"], [SET_SUB, "목공 부자재 1식"]].filter(z => byName[z[0]]);
  const legend = sets.map(([n, t]) => { const it = byName[n], pr = unitPrice(it, E), c = adm ? unitCost(it, E) : 0;
    return `<div class="wts"><b>${t}</b><span>= ${esc(SET_PARTS[n].map(z => z.replace(/\s*\(.*?\)/g, "")).join(" + "))} <small>(각 1개 값)</small></span>${adm ? `<span class="nb"><input type="number" min="0" step="1000" class="wide" data-apitem="${esc(n)}" value="${pr || ""}" aria-label="${t} 판매 단가"><span class="note">원 판매 · 원가 ${won(c)} · 마진 ${pr ? Math.round((1 - c / pr) * 1000) / 10 : "-"}%</span></span>` : `<b>${pr ? won(pr) + "원" : "단가 미정"}</b>`}</div>` }).join("");
  return `<div class="pgroup wkc wt">${byName["목수 인건비"] ? `<div class="wkr"><b>그 밖의 작업</b><div><div class="cmpch">${WOOD_MORE.map(n => `<button type="button" data-wkadd="${esc(n)}">+ ${esc(n)}</button>`).join("")}<button type="button" data-wkadd="">+ 직접 입력</button></div><span class="note">목록에 없는 작업은 이름과 목수 인원으로 넣습니다 (0.5 단위 가능).</span>
      ${(wx => wx.length ? lineTable(wx, true) : "")(all.filter(l => l.extra && l.wk))}</div></div>` : ""}
    <div class="wtleg"><div class="note" style="padding:6px 14px 0"><b>1식의 뜻</b> — 구성품을 1개씩 합친 값이 1식 단가입니다. 식 수는 ‘그 작업에 실제 쓰는 양을 낱개로 산 금액 ÷ 1식 단가’를 올림한 값이고, 더 받거나 덜 받으려면 식 수만 고치면 됩니다(포함 내역의 자재 수량도 그 비율로 따라 바뀝니다). 고객 견적서에는 1식 금액과 포함 내역(쓰는 양)만 나갑니다.${adm ? " <b>관리자:</b> 1식 판매 단가를 여기서 정합니다. 바꾼 뒤 합계 칸의 ‘바꾼 단가 파일 받기’로 고정하세요." : ""}</div>${legend}</div></div>`;
}
function woodMenNote() {                              // 목수 작업비 줄 아래: 인원이 어떻게 합쳐졌는지
  const moldOn = ["ceilMold", "baseMold", "doorMold"].some(id => { const x = lineById(id); return x && lnState(x).on }), mm = moldOn ? ((+E.py || 0) >= 35 ? 2 : 1) : 0, parts = mm ? ["몰딩 " + mm] : []; let raw = mm;
  for (const w of WOOD_WORKS) { const x = lineById(w[0]); if (!x || !x.sel) continue; const t = lnState(x); if (!t.on || t.opt) continue; const q = t.q !== undefined && t.q !== "" ? +t.q : +x.qty || 0; raw += q; parts.push(w[1] + " " + q) }
  return `<div class="bom note">목수 인원 = ${parts.length ? esc(parts.join(" + ")) + " = " : ""}<b>${Math.round(raw * 10) / 10}명</b> → 반올림 · 목수가 1명만 들어가면 35만 원, 2명부터는 1명에 30만 원 · 인원을 직접 고치면 그 값으로 계산합니다</div>`;
}
function selRow(l) {                                  // 인원만 넣는 목공 작업 줄: 금액은 ‘목수 작업비’ 한 줄에 합쳐진다
  const st = lnState(l); let auto = 0; try { auto = r1(+ev(l.qty, lineVars(R.S)[stepOfLine(l)])) } catch (e) { }
  const q = st.q !== undefined && st.q !== "" ? +st.q : auto, ed = st.on && q !== auto, fc = l.id === "flatCeil" && l.items.length > 1;
  const variant = fc ? `<select data-ln="${l.id}" data-lf="alt" aria-label="중천장 종류">${l.items.map((n, k) => `<option value="${k}" ${(st.alt || 0) === k ? "selected" : ""}>${k ? "라운드 중천장 (오징어 합판 추가)" : "사각 중천장"}</option>`).join("")}</select>` : "";
  const optCtl = st.on ? `<button type="button" class="btn ghost sm cmpb" data-wopt="${l.id}" title="이 작업(자재·부자재·목수)을 합계에 넣지 않고 금액만 따로 보여 줍니다">비교견적</button>` : "";
  return `<div class="pk ${st.on ? "" : "off"}"><input type="checkbox" data-ln="${l.id}" data-lf="on" ${st.on ? "checked" : ""} aria-label="${esc(l.label || "")} 목수">
    <span class="nm">${esc(l.label || "")} 목수 인원<small>목수 인건비</small>${l.loc ? ` <span class="pill">${esc(l.loc)}</span>` : ""}<small class="lnote">아래 ‘공통’ 카드의 목수 작업비 인원에 합쳐집니다 (합계를 반올림)</small></span>
    <span class="ctl">${variant}<span class="nb"><input type="number" min="0" step="0.5" data-ln="${l.id}" data-lf="q" value="${q}"><span class="note">명</span></span>${ed ? `<button type="button" class="wtr" data-wqr="${l.id}" title="자동값 ${auto}(으)로 되돌리기">↺ 자동 ${auto}</button>` : ""}${optCtl}</span>
    <span class="amt"><small class="note">목수 작업비에 합산</small></span></div>`;
}
let WOOD_T = 0;
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.wq === undefined) return; const l = lnFind(el.dataset.wq); if (!l) return;
  setLn(l, { q: el.value === "" ? undefined : +el.value, on: true }); R = compute(); renderSummary(); save();
  clearTimeout(WOOD_T); WOOD_T = setTimeout(() => { const a = document.activeElement, k = a && a.dataset ? a.dataset.wq : null; renderChecklist(); if (k) { const n = document.querySelector('[data-wq="' + k + '"]'); if (n) { n.focus(); const v = n.value; n.value = ""; n.value = v } } }, 900) });
document.addEventListener("click", ev0 => { const t = ev0.target, r = t.closest("[data-wqr]"), o = t.closest("[data-wopt]"); if (!r && !o) return;
  if (r) { const l = lnFind(r.dataset.wqr); if (l) { setLn(l, { q: undefined }); refresh() } return }
  const id = o.dataset.wopt, w = lnFind(id); if (!w) return; const v = !lnState(w).opt; for (const x of [w, lnFind(id + "Mat"), lnFind(id + "Sub")]) if (x && lnState(x).on) setLn(x, { opt: v });
  refresh(); toast(v ? "이 작업을 비교견적(별도)으로 돌렸습니다. 합계에는 들어가지 않습니다." : "이 작업을 합계에 넣었습니다.") });
function adminPrice(name, v) {                        // 관리자: 품목의 기본 판매 단가를 바꾼다 (모든 견적에 적용 · ‘바꾼 단가 파일 받기’로 내보내 고정)
  const it = byName[name]; if (!it) return; if (v > 0) it.fixedPrice = v; else delete it.fixedPrice;
  const pe = store.get("sido3_price_edits", {}); pe[name] = v; store.set("sido3_price_edits", pe); const ab = document.getElementById("applyData"); if (ab) ab.click(); else refresh(true);
  toast(`‘${aliasOf(name)}’ 기본 단가를 ${won(v)}원으로 바꿨습니다. 실장 화면까지 고정하려면 ‘바꾼 단가 파일 받기’를 누르세요.`) }
document.addEventListener("change", ev0 => { const el = ev0.target; if (el.dataset && el.dataset.apitem) adminPrice(el.dataset.apitem, +el.value || 0) });
function workChooser(st) {
  if (D._woodSet) return woodHead(st);                           // 목공 단계 맨 위: 목수 작업비(인원·금액)와, 그 인원에 들어가는 작업을 한곳에서 고른다
  const cs = (D.cats || {})[st.key] || [], mold = cs.find(c => c.key === "mold"), works = cs.filter(c => { if (!c.only) return false; const l = lineById(c.only); return l && (lnState(l).on || l.sel || l.items.some(n => byName[n] && unitPrice(byName[n], E))) }); if (!mold && !works.length) return "";   // 단가도 인원 기준도 없는 작업은 고르기에서 뺀다 (‘그 밖의 작업’으로 넣는다)
  const amtOf = ids => (R.all || R.lines).filter(x => ids.includes(x.lid)).reduce((t, x) => t + x.amt, 0);
  const chip = (id, label, ids) => { const l = lineById(id); if (!l) return ""; const on = lnState(l).on, a = on ? amtOf(ids) : 0; return `<button type="button" data-wk="${id}" aria-pressed="${!!on}">${on ? "✓ " : ""}${esc(label)}${WOOD_MEN[id] ? ` <small>${WOOD_MEN[id]}</small>` : ""}${a ? ` <b>${won(a)}</b>` : ""}</button>` };
  const wl = lineById("woodLabor"), wst = wl ? lnState(wl) : null, wm = (R.all || R.lines).find(x => x.key === "ln|woodLabor"), fc = lineById("flatCeil"), fst = fc ? lnState(fc) : null;
  return `<div class="pgroup wkc"><h3>목수 작업비 · 작업 고르기 <span class="note">아래에서 작업을 고르면 목수 인원이 자동으로 합쳐지고(반올림), 그 작업의 자재·부자재가 ‘1식’으로 아래에 생깁니다</span></h3>
    ${wl ? `<div class="wkr"><b>목수 인원</b><div class="pk wkpk"><input type="checkbox" hidden ${wst.on ? "checked" : ""}><span class="nb"><input type="number" min="0" step="0.5" data-ln="woodLabor" data-lf="q" value="${wst.q ?? (wm ? wm.auto : "")}"><span class="note">명${wm ? ` × ${won(wm.price)}원` : ""}</span></span><span class="amt">${wm ? won(wm.amt) : "-"}</span><span class="note" style="flex-basis:100%">자동 합산 ${wm ? wm.auto : "-"}명${wm && wm.edited ? " (직접 고침)" : ""} · 목수가 1명만 들어가면 35만 원, 2명부터는 1명에 30만 원입니다.</span></div></div>` : ""}
    ${mold ? `<div class="wkr"><b>몰딩 <small>1명 · 35평 이상 2명</small></b><div class="cmpch">${mold.lines.map(id => { const l = lineById(id); return l ? chip(id, lineLabel(l).replace(/\s*\(.*?\)/g, ""), [id]) : "" }).join("")}</div></div>` : ""}
    ${works.length ? `<div class="wkr"><b>목공 작업</b><div><div class="cmpch">${works.map(c => chip(c.only, c.label, c.lines)).join("")}</div>${fc && fst.on && fc.items.length > 1 ? `<div style="margin-top:6px"><span class="note">중천장 종류</span> <select data-ln="flatCeil" data-lf="alt" aria-label="중천장 종류">${fc.items.map((n, k) => `<option value="${k}" ${(fst.alt || 0) === k ? "selected" : ""}>${k ? "라운드 중천장 (오징어 합판 추가)" : "사각 중천장"}</option>`).join("")}</select></div>` : ""}</div></div>` : ""}
    ${byName["목수 인건비"] ? `<div class="wkr"><b>그 밖의 작업</b><div><div class="cmpch">${WOOD_MORE.map(n => `<button type="button" data-wkadd="${esc(n)}">+ ${esc(n)}</button>`).join("")}<button type="button" data-wkadd="">+ 직접 입력</button></div><span class="note">누르면 작업 이름이 붙은 목수 인건비 줄이 생깁니다. 인원(0.5 단위)과 이름을 고치세요.</span>
      ${(wx => wx.length ? lineTable(wx, true) : "")((R.all || R.lines).filter(l => l.extra && l.wk))}</div></div>` : ""}</div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-wk]"); if (!b) return; const id = b.dataset.wk, l = lnFind(id); if (!l) return; const on = !lnState(l).on; setLn(l, { on });
  for (const x of Object.values(D.stepLines).flat()) if (x.follow === id) setLn(x, { on });   // 그 작업의 자재·부자재 줄도 함께 켜고 끈다
  if (on) for (const k of ["woodMat", "woodSub", "woodLabor"]) { const x = lnFind(k); if (x && !lnState(x).on) setLn(x, { on: true }) }
  if (on && D._woodSet) openCat("s4|w_" + id);
  refresh() });
const WOOD_MORE = ["단내림", "문틀 목작업", "창틀 목작업", "템바보드·루바", "간접 박스", "붙박이 틀·가구 자리", "중문 가벽", "천장 보강", "걸레받이·몰딩 보수"];   // 목록에 없는 목공 작업 (목수 인원으로 넣는다)
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-wkadd]"); if (!b) return; E.extras.push({ id: "x" + Date.now(), space: "common", item: "목수 인건비", qty: 1, note: b.dataset.wkadd, wk: true }); refresh() });
const QUICK_ADD = {                                  // "이름|단위|단가|비고|포함 내역(쉼표)"  단가가 비어 있으면 실장이 넣는다
  s1: ["싱크대 상판 철거", "싱크대 문짝 철거", "싱크대 전체 철거", "주방 벽 타일 철거", "도배지 철거|평", "안방 붙박이장 철거", "작은방 붙박이장 철거", "신발장 철거", "천장 몰딩 철거|m", "걸레받이 철거|m", "문짝 철거|짝", "문틀 철거|틀", "중문 철거", "욕실 타일 철거|칸", "욕조 철거|개", "욕실 천장 철거|칸", "천장 철거|평", "가벽·아트월 철거", "발코니 타일 철거|칸", "장판 철거|평", "강마루 철거·샌딩|평|35000|바닥재 철거 + 샌딩|강마루 철거,바닥 샌딩", "조명·스위치 철거", "에어컨 철거|대"],
  s2: ["철거>샷시 철거|틀", "샷시 추가|틀", "방충망 추가|개", "창틀 실리콘 재시공", "확장부 단열 추가|칸", "터닝도어 추가|개"],
  s3: ["수전 위치 이동|개소", "배수 위치 이동|개소", "분배기 교체", "난방 배관 연장|m", "에어컨 배관 매립|대", "보일러 교체|대"],
  s4: ["철거>천장 몰딩 철거|m", "철거>걸레받이 철거|m", "철거>가벽·아트월 철거", "철거>천장 철거|평", "가벽 추가|m", "커튼박스 추가|m", "등박스 추가|m", "아트월 추가|㎡", "단열 벽 추가|㎡", "문틀 보수|개소", "선반 제작|개", "아치 게이트|개소"],
  s5: ["철거>조명·스위치 철거", "콘센트 추가|개", "스위치 추가|개", "전용 회로 추가|회로", "방등 추가|개", "매입등 추가|개", "인터넷·TV 단자 이동|개소", "분전반 교체"],
  s6: ["철거>문짝 철거|짝", "철거>문틀 철거|틀", "철거>중문 철거", "문짝만 교체|짝", "문틀 보수|틀", "손잡이 교체|개", "도어스토퍼|개", "문턱 제거|개소"],
  s7: ["철거>욕실 타일 철거|칸", "철거>욕조 철거|개", "철거>욕실 천장 철거|칸", "젠다이 설치|개소", "욕조 설치|개", "샤워부스|개", "욕실 선반 추가|개", "타일>줄눈 시공|칸", "타일>타일 추가|㎡", "욕실 문턱 교체|개소"],
  s8: ["철거>장판 철거|평", "바닥 수평 몰탈|㎡", "문턱 제거 후 메움|개소", "걸레받이 추가|m", "강마루 철거·샌딩|평|35000|바닥재 철거 + 샌딩|강마루 철거,바닥 샌딩"],
  s9: ["철거>도배지 철거|평", "포인트 벽지|롤", "곰팡이 제거·방지|㎡", "퍼티 추가|㎡", "디아망 추가 인건비|인", "무몰딩·라운드 마감 추가 인건비|인"],
  s10: ["몰딩 도장|m", "방문 도장|짝", "벽면 도장 추가|㎡"],
  s11: ["철거>싱크대 전체 철거", "철거>싱크대 상판 철거", "철거>싱크대 문짝 철거", "철거>붙박이장 철거", "철거>신발장 철거", "상판 교체|자", "싱크 문짝 교체|짝", "수납장 추가|자", "팬트리 선반|개", "화장대|자", "아일랜드 식탁|자"],
  s12: ["철거>발코니 타일 철거|칸", "실리콘 추가", "줄눈 코팅|칸", "추가 청소", "빨래건조대|개"] };
function quickAddCard(st, custom) {                  // 각 공정 단계의 ‘이 공정에 항목 추가’
  const hasCats = !!((D.cats || {})[st.key]), shown = catXAssign.sk === st.key ? catXAssign.shown : null;
  const qs = (QUICK_ADD[st.key] || []).filter(q => !(/(천장 몰딩|걸레받이) 철거/.test(q) && lnFind("demoMoldTop"))).filter(q => !hasCats || !catOfName(st, qaParse(st, q).name, shown)), proc = st.key === "s1" ? "철거" : st.procs[0];   // (v75) 묶음에 맞는 것은 그 묶음 카드의 ‘＋ 항목 추가’에 있다   // 철거 묶음에 정식 줄이 생긴 것은 빠른 추가에서 뺀다 (같은 것이 두 군데 있지 않게)
  return `<div class="pgroup qadd"><h3>${hasCats ? "묶음에 없는 항목 추가" : "이 공정에 항목 추가"} <span class="note">${hasCats ? "묶음에 맞는 작업은 <b>그 카드 안의 ‘＋ 항목 추가’</b>로 · 어디에도 맞지 않는 것만 여기서 넣습니다" : "누르면 아래에 줄이 생깁니다 · 공정·이름·단위·수량·단가를 고칠 수 있습니다"}</span></h3>
    <div class="fchips">${qs.map(q => { const m = q.match(/^([가-힣]+)>/), pr = m && PROCS.includes(m[1]) ? m[1] : proc, body = m ? q.slice(m[0].length) : q, far = !st.procs.includes(pr); return `<button type="button" class="btn sm" data-qadd="${esc(pr + "|" + body)}" data-qat="${st.key}" data-qcat="">+ ${far ? esc(pr) + " · " : ""}${esc(body.split("|")[0])}</button>` }).join("")}<button type="button" class="btn sm" data-custom="${esc(proc)}">+ 직접 입력</button></div>
    ${custom.length ? lineTable(custom, true) + '<p class="note" style="padding:0 14px 10px">단가를 비워 두면 견적서에 ‘별도 협의’로 나갑니다. 단위를 m·㎡·평으로 바꾸면 치수(가로*세로*개수)로 수량을 넣을 수 있습니다.</p>' : ""}</div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-qadd]"); if (!b) return; const [proc, name, unit, price, note, sub] = b.dataset.qadd.split("|");
  E.extras.push({ id: "x" + Date.now(), space: "common", proc, name, unit: unit || "식", qty: 1, price: price || "", note: note || "", ...(sub ? { sub } : {}), ...(b.dataset.qat ? { at: b.dataset.qat } : {}), ...(b.dataset.qcat !== undefined ? { cat: b.dataset.qcat } : {}) }); refresh() });   // at = 눌러서 넣은 단계 (철거 항목을 다른 단계에서 넣어도 그 단계에 보인다)
const FILM_PLACES = [["싱크대", 10], ["냉장고장", 4], ["아일랜드 식탁", 3], ["주방", 4], ["신발장", 5], ["현관", 3], ["중문", 4], ["복도", 4], ["안방 붙박이장", 8], ["작은방 붙박이장", 6], ["베란다 붙박이장", 4], ["샤시", 4], ["방문", 3], ["문틀", 2], ["직접 입력", 1]];   // 넣을 곳 · 처음 넣는 길이(M, 어림값)
let FILM_GRADE = "";
function filmCard() {                                 // 필름·페인트 단계: 필름을 넣을 곳을 눌러 줄을 만든다 (곳마다 치수·수량을 따로)
  const fl = lnFind("filmDoor"); if (!fl) return ""; const grades = fl.items.filter(n => byName[n]); if (!grades.length) return ""; if (!grades.includes(FILM_GRADE)) FILM_GRADE = grades[0];
  const ls = (R.all || R.lines).filter(l => l.extra && l.film);
  return `<div class="pgroup filmbox"><h3>필름 넣을 곳 <span class="note">누르면 아래에 줄이 생깁니다 · 치수(가로*세로*개수)를 적으면 필요한 길이로 바꿔 줍니다</span></h3>
    <div class="fchips"><select id="filmGrade" aria-label="필름 종류">${grades.map(n => `<option value="${esc(n)}" ${n === FILM_GRADE ? "selected" : ""}>${esc(aliasOf(n))}</option>`).join("")}</select>${FILM_PLACES.map(([n]) => `<button type="button" class="btn sm" data-filmadd="${esc(n)}">+ ${esc(n)}</button>`).join("")}</div>
    ${ls.length ? lineTable(ls, true) + '<p class="note" style="padding:0 14px 10px">처음 수량은 어림값입니다. 치수를 적거나 수량을 직접 고쳐 주세요. 길이는 폭 1.22m 필름 기준(로스 10%)이고, 넣은 길이만큼 ‘필름 작업비’ 인원도 함께 늘어납니다. 비교용이면 ‘옵션’을 체크하세요.</p>' : ""}</div>`;
}
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-filmadd]"); if (!b) return; const n = b.dataset.filmadd, def = (FILM_PLACES.find(x => x[0] === n) || [0, 1])[1];
  E.extras.push({ id: "x" + Date.now(), space: "common", item: FILM_GRADE, qty: def, note: n === "직접 입력" ? "" : n, film: true });
  for (const id of ["filmSub", "filmLabor", "filmMeal"]) { const l = lnFind(id); if (l && !lnState(l).on) setLn(l, { on: true }) }   // 부자재·작업비 줄이 꺼져 있으면 함께 켠다
  refresh() });
document.addEventListener("change", ev0 => { if (ev0.target.id === "filmGrade") FILM_GRADE = ev0.target.value });
function groupsOf(items) {
  const m = new Map();
  for (const i of items) { const g0 = i.group || (i.src === "엑셀" || i.src === "단가 미정" ? "그 밖의 품목" : "기타 품목"), g = /엑셀/.test(g0) ? "그 밖의 품목" : g0; if (!m.has(g)) m.set(g, []); m.get(g).push(i) }
  const rank = g => g.startsWith("조명") ? 0 : g.includes("(") ? 1 : g === "그 밖의 품목" ? 3 : 2;
  return [...m.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
}
function pkRow(p, amt) {
  const st = pkState(p), a = amt[p.key] || 0;
  const tbd = st.on && R.lines.some(l => l.tbd && (l.key.split("|")[1] === "pkg:" + p.key));
  const grade = p.grades ? `<select data-pkg="${p.key}" data-pkf="g" aria-label="${esc(p.label)} 등급">${p.grades.map((x, i) => `<option value="${i}" ${(st.g || 0) === i ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select>` : "";
  const num = p.num ? `<span class="nb"><input type="number" min="0" class="${p.num.unit === "원" ? "wide" : ""}" data-pkg="${p.key}" data-pkf="v" value="${pkNum(p)}" aria-label="${esc(p.num.label)}"><span class="note">${esc(p.num.unit === "원" ? p.num.label : p.num.unit)}</span></span>` : "";
  return `<div class="pk ${st.on ? "" : "off"}"><input type="checkbox" data-pkg="${p.key}" data-pkf="on" ${st.on ? "checked" : ""} aria-label="${esc(p.label)}">
    <span class="nm">${esc(p.label)}</span><span class="ctl">${grade}${num}</span>
    <span class="amt">${st.on ? (tbd ? '<span class="tbd">단가 미정</span>' : won(a)) : "-"}</span></div>`;
}
function renderConfirm(body, steps) {
  const list = steps.slice(1, -1).map((st, i) => {
    const on = D.stepLines ? (D.stepLines[st.key] || []).filter(l => lnState(l).on).map(l => { const ls = R.lines.filter(x => x.lid === l.id); return l.bom && l.bom.mode === "replace" ? `${l.bom.label} ${ls.length}종` : ls.map(x => `${aliasOf(x.name)} ${x.unit === "㎡" ? toPy(x.qty) + "평" : x.qty + x.unit}`).join("") })
      : (D.packages || []).filter(p => st.pk.includes(p.key) && pkState(p).on).map(p => p.label + (p.grades ? ` (${p.grades[pkState(p).g || 0].label})` : ""));
    const ex = E.extras.filter(x => st.procs.includes(x.item ? (byName[x.item] || {}).proc : x.proc)).map(x => (x.item || x.name || "(품명 없음)") + ` ${x.qty}${x.item ? (byName[x.item] || {}).unit || "" : x.unit || ""}`);
    const s = stepStats(st);
    return `<h3>${i + 1}. ${esc(st.label)} <span class="note">${s.amt ? won(s.amt) + "원" : ""}</span> <button type="button" class="btn ghost sm" data-goto="${i + 1}">고치기</button></h3>${on.length || ex.length ? `<ul>${[...on, ...ex].map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<ul><li class="note">선택한 공사 없음</li></ul>`}`;
  }).join("");
  body.innerHTML = `<div class="sthead"><h2>확인</h2><span class="note">체크한 공사가 모두 상세견적서에 들어갑니다.</span><b class="tabnum">${won(R.total)}원</b></div>
    <p class="note" style="margin:4px 14px;color:var(--warn)">⚠ 상세견적서로 넘어가기 전에 아래 ‘견적 검수’와 공간별 공사를 한 번 더 확인해 주세요. 챗봇에 ‘뭐 안 했지?’라고 물어도 됩니다.</p>
    ${R.tbd.length ? `<p class="note down" style="margin:4px 14px">단가 미정 ${R.tbd.length}건은 견적서에 ‘별도 협의’로 표시됩니다: ${esc(R.tbd.map(l => l.name).join(", "))}</p>` : ""}
    ${checkCard(steps)}
    ${D.stepLines ? planOverview() : ""}
    <div class="confirm">${list}</div>
    <div class="toolbar" style="padding:8px 14px 14px"><button type="button" class="btn primary" data-act="doc">상세견적서 보기</button><button type="button" class="btn" data-act="save">저장</button></div>`;
}
document.addEventListener("click", ev0 => {
  const b = ev0.target.closest("[data-goto],[data-step],[data-custom]"); if (!b) return;
  const n = STEPS().length;
  if (b.dataset.goto !== undefined && b.dataset.at) { const at = atOf(b); if (at) { goSpot(+b.dataset.goto, at); return } }   // 자리가 정해진 단추는 그 줄까지 간다
  if (b.dataset.goto !== undefined) E.step = +b.dataset.goto;
  if (b.dataset.step === "prev") E.step = Math.max(0, (E.step || 0) - 1);
  if (b.dataset.step === "next") { if ((E.step || 0) >= n - 1) { if (lastCheck(b)) show("doc"); return } E.step = (E.step || 0) + 1 }
  if (b.dataset.custom) { E.extras.push({ id: "x" + Date.now(), space: "common", proc: b.dataset.custom, name: "", unit: "식", qty: 1, price: "", note: "", cat: "" }); R = compute() }
  renderChecklist(); save(); if (!b.dataset.custom) window.scrollTo({ top: 0, behavior: "smooth" });
});
document.addEventListener("change", ev0 => {
  const el = ev0.target; if (el.dataset.xitem === undefined) return;
  const n = el.dataset.xitem;
  if (el.checked) E.extras.push({ id: "x" + Date.now(), space: "common", item: n, qty: 1 }); else E.extras = E.extras.filter(x => x.item !== n);
  refresh();
});
document.addEventListener("input", ev0 => {
  const el = ev0.target;
  if (el.dataset.xq !== undefined) { const x = E.extras.find(x => x.item === el.dataset.xq); if (x) x.qty = el.value; R = compute(); renderSummary(); save(); return }
  if (el.dataset.msearch !== undefined) { const q = el.value.trim().toLowerCase(); el.closest("details").querySelectorAll(".mi").forEach(m => m.hidden = !!q && !m.dataset.mname.toLowerCase().includes(q)) }
});
function renderChecklistOld() {
  $("#presets").innerHTML = (D.presets || []).map((p, i) => `<button type="button" data-preset="${i}" aria-pressed="${E.preset === i}">${esc(p.label)}</button>`).join("");
  const amt = pkAmounts(), groups = [...new Set((D.packages || []).map(p => p.group))];
  $("#checklist").innerHTML = groups.map(g => `<div class="pgroup"><h3>${esc(g)}</h3>${(D.packages || []).filter(p => p.group === g).map(p => {
    const st = pkState(p), a = amt[p.key] || 0;
    const tbd = st.on && R.lines.some(l => l.tbd && (l.key.split("|")[1] === "pkg:" + p.key));
    const grade = p.grades ? `<select data-pkg="${p.key}" data-pkf="g" aria-label="${esc(p.label)} 등급">${p.grades.map((x, i) => `<option value="${i}" ${(st.g || 0) === i ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select>` : "";
    const num = p.num ? `<span class="nb"><input type="number" min="0" class="${p.num.unit === "원" ? "wide" : ""}" data-pkg="${p.key}" data-pkf="v" value="${pkNum(p)}" aria-label="${esc(p.num.label)}"><span class="note">${esc(p.num.unit === "원" ? p.num.label : p.num.unit)}</span></span>` : "";
    return `<div class="pk ${st.on ? "" : "off"}"><input type="checkbox" data-pkg="${p.key}" data-pkf="on" ${st.on ? "checked" : ""} aria-label="${esc(p.label)}">
      <span class="nm">${esc(p.label)}</span><span class="ctl">${grade}${num}</span>
      <span class="amt">${st.on ? (tbd ? '<span class="tbd">단가 미정</span>' : won(a)) : "-"}</span></div>`
  }).join("")}</div>`).join("");
  $("#addItem2").innerHTML = `<option value="">목록에 없는 공사 추가…</option>` + PROCS.map(p => `<optgroup label="${PROC_LABEL[p]}">${D.catalog.filter(i => i.proc === p).map(i => `<option value="${esc(i.name)}">${esc(i.name)} · ${esc(i.unit)}${unitPrice(i, E) ? "" : " (단가 미정)"}</option>`).join("")}</optgroup>`).join("") + `<option value="__custom">직접 입력 (품명·단가 수기)</option>`;
  const ex = R.lines.filter(l => l.extra);
  if (ex.length) $("#checklist").insertAdjacentHTML("beforeend", `<div class="pgroup"><h3>추가한 공사</h3>${lineTable(ex, true)}</div>`);
}
document.addEventListener("change", ev0 => {
  const el = ev0.target;
  if (el.dataset.pkg && el.dataset.pkf !== "v") {
    const p = D.packages.find(x => x.key === el.dataset.pkg), st = pkState(p);
    if (el.dataset.pkf === "on") st.on = el.checked; else { st.g = +el.value; st.on = true }
    E.preset = (D.presets || []).length - 1; refresh(true);
  }
  if (el.id === "addItem2" && el.value) {
    if (el.value === "__custom") E.extras.push({ id: "x" + Date.now(), space: "common", proc: "기타", name: "", unit: "식", qty: 1, price: "", note: "" });
    else E.extras.push({ id: "x" + Date.now(), space: "common", item: el.value, qty: 1 });
    refresh();
  }
});
document.addEventListener("input", ev0 => {
  const el = ev0.target; if (!(el.dataset.pkg && el.dataset.pkf === "v")) return;
  const p = D.packages.find(x => x.key === el.dataset.pkg), st = pkState(p); st.v = el.value; st.on = true;
  applyPackages(); R = compute(); renderSummary(); save();
  const row = el.closest(".pk"); row.classList.remove("off"); row.querySelector("input[type=checkbox]").checked = true; row.querySelector(".amt").textContent = won(pkAmounts()[p.key] || 0);
});
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-preset]"); if (!b) return; if (D.stepLines) applyPreset2(+b.dataset.preset); else applyPreset(+b.dataset.preset); refresh(true) });

/* ---------- 현장 정보 ---------- */
function renderInfo() {
  if (!$("#info")) return;
  const py = +E.py || 0, S = spaces();
  const seg = (k, arr) => `<div class="seg" role="group">${arr.map(n => `<button type="button" data-seg="${k}" data-v="${n}" aria-pressed="${(+E[k] || 0) === n}">${n}</button>`).join("")}</div>`;
  $("#info").innerHTML = `
  <div class="group"><h3>고객·현장</h3><div class="fields f4">
    <label class="f wide">고객명<input data-info="client" value="${esc(E.info.client)}" placeholder="홍길동 고객님"></label>
    <div class="f wide"><span>현장 주소</span><span class="in"><input data-info="addr" value="${esc(E.info.addr ?? E.info.site ?? "")}" placeholder="‘주소 검색’을 누르거나 직접 입력"><button type="button" class="btn sm" data-addr>주소 검색</button></span>${E.info.bname || E.info.zip ? `<small class="note">${esc([E.info.bname, E.info.zip ? "우편번호 " + E.info.zip : "", E.info.jibun ? "지번 " + E.info.jibun : ""].filter(Boolean).join(" · "))}</small>` : ""}</div>
    <label class="f">동·호수 (상세 주소)<input data-info="addr2" value="${esc(E.info.addr2 || "")}" placeholder="101동 1001호"></label>
    <div class="f"><span>위치 확인</span><a class="btn sm" data-maplink href="${mapUrl()}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">지도에서 보기</a></div>
    <label class="f">지역<input data-info="region" value="${esc(E.info.region)}" placeholder="부산 해운대구"></label>
    <label class="f">담당 실장<input data-info="manager" value="${esc(E.info.manager)}"></label>
    <label class="f">견적일<input type="date" data-info="date" value="${esc(E.info.date)}"></label>
    <label class="f">구분<select data-info="kind">${DOC_KINDS.map(k => `<option ${E.info.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></label>
  </div></div>
  <div class="inforow"><div class="group"><h3>공간</h3><div class="fields">
    <label class="f">공급 평형<span class="in"><select data-e="py">${Array.from({ length: 51 }, (_, i) => i + 15).map(n => `<option value="${n}" ${n === py ? "selected" : ""}>${n}평</option>`).join("")}</select></span></label>
    <label class="f">전용면적 ${+E.excl > 0 ? "(직접 입력)" : "(자동 계산)"}<span class="in"><input type="number" step="0.01" data-e="excl" class="${+E.excl > 0 ? "" : "auto"}" value="${+E.excl > 0 ? esc(E.excl) : S.exclM2}"><span class="u">㎡</span></span></label>
    <div class="f wide"><span>방</span>${seg("rooms", [1, 2, 3, 4, 5])}</div>
    <div class="f wide"><span>욕실</span>${seg("baths", [1, 2, 3])}</div>
    <div class="f wide"><span>발코니</span>${seg("balconies", [0, 1, 2, 3])}</div>
    <div class="f wide"><span>드레스룸</span>${seg("dress", [0, 1])}</div>
    <label class="f">층<span class="in"><input type="number" min="1" data-e="level" value="${esc(E.level)}"><span class="u">층</span></span></label>
    <label class="f">기업이윤<span class="in"><input type="number" step="0.5" data-e="biz" value="${esc(E.biz)}"><span class="u">%</span></span></label>
  </div>
  <p class="note" style="margin:8px 0 0">공급 <b>${S.supplyM2}㎡</b> → 전용 <b>${S.exclM2}㎡ (${toPy(S.exclM2)}평)</b> ${+E.excl > 0 ? `(직접 입력한 값) <button type="button" class="btn ghost sm" data-exclauto>자동값으로</button>` : `(평형을 고르면 공급면적의 ${Math.round(D.layout.exclRatio * 100)}% 평균값으로 자동 계산 · 실제 전용면적을 알면 칸에 바로 고쳐 넣으세요)`}</p></div>
  ${planBase()}${D.stepLines ? workPlanBox() : ""}</div>
  <div class="group"><h3>방 크기 <span class="note">가로 × 세로 (mm) · 비워 두면 평형에 맞춰 자동 · 위 도면에서 방을 눌러 넣어도 같습니다</span></h3>${roomDimBox(S)}</div>
  <div class="group"><h3>추가 공간 <span class="note">보조 주방 · 다용도실처럼 방 목록에 없는 곳이 있을 때만</span></h3><div style="display:flex;flex-wrap:wrap">${xspBox(S)}</div></div>`;
  const i2 = $("#info2"); if (i2) i2.innerHTML = dimBox(S);
  planLibCheck();          // 실측 입력은 공사 유형 아래에 (필요할 때만 펼침)
}
/* ---------- (v63) 추가 공간: 보조 주방·다용도실·팬트리처럼 방 목록에 없는 공간을 견적에 넣는다 ----------
   현장 정보 ‘공간’ 칸의 ‘추가 공간’ 줄에서 넣고, 이름·계산 종류·가로×세로(mm)를 그 자리에서 고친다. 치수 칸은 실측 표와 같은 값(E.dim)이다. */
function xspClean(id) {                               // 그 공간에 딸린 값(치수·도면 영역·제외 표시·매입등 개수)을 지운다
  for (const k of ["dim", "planBox", "planPins", "sel", "num", "dnl"]) if (E[k]) delete E[k][id];
  for (const k of ["skip", "skipW", "inc"]) for (const sk in E[k] || {}) if (E[k][sk]) delete E[k][sk][id];
  for (const m of E.marks || []) if (m.room === id) { delete m.room; delete m.rk }
}
function xspAdd(name, type) {                         // → { id } 또는 { err: 까닭 }
  name = String(name || "").replace(/\s+/g, " ").trim().slice(0, 12); if (!name) return { err: "넣을 공간의 이름을 적어 주세요." };
  const xs = xspList(), same = n => n.replace(/\s+/g, "") === name.replace(/\s+/g, "");
  if (xs.length >= 8) return { err: "추가 공간은 8곳까지 넣을 수 있습니다." };
  if (xs.some(x => same(x.name)) || spaces().list.some(s => same(s.name.replace(/ \(.*\)/, "")))) return { err: `‘${name}’은(는) 이미 있습니다.` };
  const id = "x" + (Math.max(0, ...xs.map(x => +String(x.id).slice(1) || 0)) + 1); xspClean(id);
  E.xsp = [...xs, { id, name, type: XSP_KIND[type] ? type : (XSP_PRE.find(p => same(p[0])) || [])[1] || "방" }];
  return { id };
}
function xspDel(id) { const xs = xspList().filter(x => x.id !== id); if (xs.length) E.xsp = xs; else delete E.xsp; xspClean(id); if (typeof PIN_SEL !== "undefined" && PIN_SEL === id) PIN_SEL = null }
function xspPlanDim(id) {                             // 올린 도면에 그려 둔 영역의 크기를, 다른 방들의 넓이로 잰 축척으로 어림한다 → { w, d, a } 또는 { a, p } (m · ㎡). 축척을 잴 수 없으면 null
  const b = (E.planBox || {})[id], G = E.planImg && b ? ltGeom(R.S) : null; if (!G || !G.pm) return null;
  const r2 = v => Math.round(v * 100) / 100, kx = G.vw / G.pm, ky = G.vh / G.pm;
  if (b.poly) { const p = b.poly.map(q => [q[0] * kx, q[1] * ky]); return { a: r2(polyArea(p)), p: r2(polyLen(p)) } }
  if (b.more && b.more.length) return { a: r2([b, ...b.more].reduce((a, q) => a + q.w * kx * q.h * ky, 0)) };
  return { w: r2(b.w * kx), d: r2(b.h * ky), a: r2(b.w * kx * b.h * ky) };
}
const XSP_HOW = { "방": "바닥·벽·둘레 넓이에 더합니다 (몰딩·걸레받이처럼 ㎡·m로 세는 공사)", "주방": "바닥·벽·둘레 넓이에 더합니다 (주방 공사 범위로 표시)", "발코니": "발코니 타일·페인트 넓이에 더합니다" };
/* (v86) 방 크기 — 사용자(2026-11-21): “방 1,2,3, 거실 설정할때 치수넣게 만들어줘 이유는 치수가 방마다 다 다르기때문이야 · 가견적으로 원하는 분들이 있기때문에 자동 분배도 있지만 치수 넣게 만들어줘야해”.
   ‘현장 정보 → 공간’에서 거실·주방·방마다 가로×세로(mm)를 바로 넣는다. 비워 두면 평형으로 자동 분배(가견적) — 칸의 흐린 숫자가 그 자동값이다(평형·방 수가 바뀌면 같이 바뀐다).
   칸은 실측 표·도면 벽 치수와 같은 값(E.dim[id].w/d)이다. 실측 표(dimBox)에서는 이 방들의 가로·세로 칸을 뺐다(같은 칸이 두 군데 있지 않게 — 넓이만 넣는 칸과 벽체별은 그대로). */
const ROOM_RATIO = { "거실": 1.35, "주방": 1.5, "방": 1.15 };   // 자동 넓이를 가로×세로로 보여 줄 때의 어림 비율 (계산에는 넓이만 쓴다)
const isRoomRow = s => !!s && !s.xsp && (s.type === "거실" || s.type === "주방" || s.type === "방");
const roomOwn = s => { const m = (E.dim || {})[s.id] || {}; return (+m.w > 0 && +m.d > 0) || +m.a > 0 };
function roomAutoWD(s) { const A = +s.A0 || 0; if (!(A > 0)) return null; const w = Math.sqrt(A * (ROOM_RATIO[s.type] || 1.2)); return [Math.round(w * 10) * 100, Math.round(A / w * 10) * 100] }   // mm (100 단위)
function roomDimInfo(s) {
  const m = (E.dim || {})[s.id] || {}, hw = +m.w > 0, hd = +m.d > 0, a0 = +s.A0 || 0, back = `<button type="button" class="btn ghost sm" data-roomauto="${s.id}" title="평형 기준 자동값 ${a0}㎡로 되돌립니다">↺ 자동</button>`;
  if (hw !== hd && !(+m.a > 0)) return `<b style="color:var(--warn)">가로·세로 둘 다 넣어 주세요</b> ${back}`;
  if (roomOwn(s)) { const df = r1(s.A - a0); return `<b>${s.A}㎡</b> <span class="note">${toPy(s.A)}평${df ? ` · 자동보다 ${df > 0 ? "+" : "−"}${Math.abs(df)}` : ""}</span> <span class="pill 엑셀">입력</span> ${back}` }
  return `<b>${s.A}㎡</b> <span class="note">${toPy(s.A)}평</span> <span class="pill">${s.fit ? "도면에 그린 크기" : "자동"}</span>`;
}
function roomSumTxt(S) {
  const rs = S.list.filter(isRoomRow), n = rs.filter(roomOwn).length, sum = r1(rs.reduce((a, s) => a + (s.A || 0), 0)), s0 = r1(rs.reduce((a, s) => a + (+s.A0 || 0), 0));
  return `거실·주방·방 바닥 합계 <b>${sum}㎡</b> (${toPy(sum)}평)` + (n ? ` · 직접 넣은 곳 ${n}곳 <span class="note">(모두 자동이면 ${s0}㎡)</span> <button type="button" class="btn ghost sm" data-roomauto="*">↺ 모두 자동으로</button>` : ` <span class="note">· ${+E.py || 0}평형에 맞춰 자동으로 나눈 값</span>`);
}
function roomDimBox(S) {
  const dm = E.dim || {}, rows = S.list.filter(isRoomRow);
  const inp = (s, k, ph) => { const m = dm[s.id] || {}; return `<input class="q" type="number" min="0" step="10" inputmode="numeric" style="width:96px" data-dim="${s.id}|${k}" data-mm="1" value="${m[k] === undefined || m[k] === "" ? "" : Math.round(m[k] * 1000)}" placeholder="${ph}" aria-label="${esc(s.name)} ${k === "w" ? "가로" : "세로"} mm">` };
  return `<div id="roomDimBox"><div class="roomgrid">${rows.map(s => { const a = roomAutoWD(s) || ["", ""]; return `<div class="rrow" data-roomrow="${s.id}"><b>${esc(s.name)}</b>${inp(s, "w", "자동 " + a[0])}<span class="note">×</span>${inp(s, "d", "자동 " + a[1])}<span data-roomout>${roomDimInfo(s)}</span></div>` }).join("")}</div>
    <div id="roomSum" style="margin-top:10px">${roomSumTxt(S)}</div>
    <small class="note" style="display:block;margin-top:4px"><b>비워 두면 평형에 맞춰 자동으로 나눕니다</b>(가견적 · 칸의 흐린 숫자가 자동값). 잰 치수를 넣은 방은 그 값으로 계산합니다. 몰딩·걸레받이·목공처럼 길이·넓이로 세는 공사가 따라 바뀌고, <b>도배·장판·강마루는 각 단계의 ‘평수’ 칸</b>에서 정합니다. 욕실·현관·발코니 치수는 타일 줄 아래에서 넣습니다.</small></div>`;
}
function roomDimSync() {                              // 치수 칸을 고친 뒤: 방 크기 칸의 오른쪽 글과 합계만 다시 적는다 (치던 칸은 그대로)
  document.querySelectorAll("[data-roomrow]").forEach(r => { const s = R.S.list.find(x => x.id === r.dataset.roomrow), o = r.querySelector("[data-roomout]"); if (s && o) o.innerHTML = roomDimInfo(s) });
  const rs = $("#roomSum"); if (rs) rs.innerHTML = roomSumTxt(R.S);
}
document.addEventListener("click", ev0 => {           // ↺ 자동: 그 방(또는 모든 방)의 가로·세로·넓이를 지워 평형 기준으로 되돌린다 (벽체별·높이는 그대로)
  const b = ev0.target.closest && ev0.target.closest("[data-roomauto]"); if (!b) return; const id = b.dataset.roomauto, dm = E.dim || {};
  for (const k of id === "*" ? Object.keys(dm) : [id]) { const s = R.S.list.find(x => x.id === k), m = dm[k]; if (!m || !isRoomRow(s)) continue; for (const f of ["w", "d", "a", "p"]) delete m[f]; if (!Object.keys(m).length) delete dm[k] }
  refresh(true); toast(id === "*" ? "거실·주방·방 크기를 모두 자동(평형 기준)으로 되돌렸습니다. (Ctrl+Z 되돌리기)" : "그 방의 크기를 자동(평형 기준)으로 되돌렸습니다. (Ctrl+Z 되돌리기)");
});
function xspBox(S) {
  const xs = xspList(), dm = E.dim || {}, has = n => xs.some(x => x.name === n), row = "display:flex;flex-wrap:wrap;gap:6px;align-items:center";
  const one = x => { const s = S.list.find(q => q.id === x.id) || { xsp: true, A: 0 }, m = dm[x.id] || {}, est = !(s.A > 0) ? xspPlanDim(x.id) : null;
    const inp = (k, ph) => `<input class="q" type="number" min="0" step="10" inputmode="numeric" style="width:92px" data-dim="${x.id}|${k}" data-mm="1" value="${m[k] === undefined || m[k] === "" ? "" : Math.round(m[k] * 1000)}" placeholder="${ph}" aria-label="${esc(x.name)} ${k === "w" ? "가로" : "세로"} mm">`;
    return `<div data-dimrow="${x.id}" style="${row};margin-top:8px;padding-top:8px;border-top:1px dashed var(--line,#d8ddd6)"><input data-xspname="${x.id}" value="${esc(x.name)}" maxlength="12" style="width:112px;font-weight:700" aria-label="공간 이름" title="이름을 고치고 Enter">
      <select data-xsptype="${x.id}" style="width:auto;max-width:100%;flex:0 1 auto" aria-label="${esc(x.name)} 계산 방식" title="${esc(XSP_HOW[x.type] || "")}">${Object.entries(XSP_KIND).map(([k, v]) => `<option value="${k}" ${x.type === k ? "selected" : ""}>${v}</option>`).join("")}</select>
      ${inp("w", "가로 mm")}<span class="note">×</span>${inp("d", "세로 mm")}
      <button type="button" class="btn ghost sm" data-xspdel="${x.id}" style="color:var(--warn)" title="이 공간을 빼면 수량·금액이 넣기 전으로 돌아갑니다">✕ 빼기</button>
      ${est ? `<button type="button" class="btn sm" data-xspfit="${x.id}">도면에 그린 크기로 넣기 (약 ${est.a}㎡)</button>` : ""}
      <span class="note" data-dimout style="flex-basis:100%">${dimInfo(s)}</span></div>` };
  return `<div id="xspBox" style="flex:1 1 100%;min-width:0">
    <div style="${row}">${XSP_PRE.filter(([n]) => !has(n)).map(([n, t]) => `<button type="button" class="btn ghost sm" data-xspadd="${esc(n)}" data-xspt="${t}">＋ ${esc(n)}</button>`).join("")}
      <span style="display:inline-flex;gap:4px"><input id="xspNew" maxlength="12" placeholder="직접 적기 (예: 가족실)" style="width:156px" aria-label="추가할 공간 이름"><button type="button" class="btn sm" data-xspadd="">추가</button></span></div>
    ${xs.map(one).join("")}
    <small class="note" style="display:block;margin-top:6px">${xs.length ? "<b>가로·세로(mm)를 넣은 공간만</b> 수량·금액에 들어갑니다. 방·욕실·발코니 개수(문·조명 수)와 도배 평수·바닥 평수(아파트 평수 기준)는 그대로입니다. 올린 도면에서는 ‘방 영역 고치기’에 이 이름이 나와 영역을 그릴 수 있습니다. ‘✕ 빼기’를 누르면 넣기 전으로 돌아갑니다." : "보조 주방·다용도실·팬트리처럼 방 목록에 없는 공간이 있으면 눌러서 넣으세요. <b>가로·세로를 넣기 전에는 금액이 바뀌지 않습니다.</b>"}</small></div>`;
}
document.addEventListener("click", ev0 => {
  const t = ev0.target; if (!t.closest) return; const add = t.closest("[data-xspadd]"), del = t.closest("[data-xspdel]"), fit = t.closest("[data-xspfit]"), go = t.closest("[data-xspgo]");
  if (go) { const b = $("#xspBox"); if (!b) { E.step = 0; show("check"); renderChecklist() } setTimeout(() => { const x = $("#xspBox"); if (!x) return; x.scrollIntoView({ block: "center", behavior: "smooth" }); x.style.outline = "3px solid var(--accent)"; x.style.outlineOffset = "4px"; setTimeout(() => { x.style.outline = ""; x.style.outlineOffset = "" }, 2200); const i = $("#xspNew"); if (i) i.focus({ preventScroll: true }) }, 60); return }
  if (add) { const el = $("#xspNew"), r = xspAdd(add.dataset.xspadd || (el && el.value), add.dataset.xspt); if (r.err) { toast(r.err); return }
    refresh(true); const nm = (xspList().find(x => x.id === r.id) || {}).name; toast(`‘${nm}’을(를) 넣었습니다. 가로·세로(mm)를 넣으면 그때부터 수량·금액에 들어갑니다. (Ctrl+Z 되돌리기)`);
    setTimeout(() => { const i = document.querySelector(`#xspBox [data-dim="${r.id}|w"]`); if (i) i.focus({ preventScroll: true }) }, 60); return }
  if (del) { const x = xspList().find(q => q.id === del.dataset.xspdel); if (!x) return; xspDel(x.id); refresh(true); toast(`‘${x.name}’을(를) 뺐습니다. 수량·금액이 넣기 전으로 돌아갔습니다. (Ctrl+Z 되돌리기)`); return }
  if (fit) { const id = fit.dataset.xspfit, d = xspPlanDim(id); if (!d) { toast("도면에서 다른 방의 영역도 그려 두어야 크기를 잴 수 있습니다."); return }
    E.dim = E.dim || {}; E.dim[id] = d.w ? { w: d.w, d: d.d } : d.p ? { a: d.a, p: d.p } : { a: d.a }; E.dimOpen = true; refresh(true); toast(`도면에 그린 크기(약 ${d.a}㎡)를 넣었습니다. 다른 방 넓이로 어림한 값이니 실측하면 고쳐 주세요. (Ctrl+Z 되돌리기)`) }
});
document.addEventListener("keydown", ev0 => { if (ev0.key === "Enter" && ev0.target && ev0.target.id === "xspNew") { ev0.preventDefault(); const b = document.querySelector('#xspBox [data-xspadd=""]'); if (b) b.click() } });   // 직접 적고 Enter
document.addEventListener("change", ev0 => {          // 추가 공간의 이름 · 계산 방식
  const el = ev0.target; if (!el.dataset) return; const xs = xspList();
  if (el.dataset.xspname !== undefined) { const x = xs.find(q => q.id === el.dataset.xspname), nm = el.value.replace(/\s+/g, " ").trim().slice(0, 12); if (!x) return;
    if (!nm || xs.some(q => q !== x && q.name === nm) || R.S.list.some(s => !s.xsp && s.name.replace(/ \(.*\)/, "") === nm)) { el.value = x.name; toast(nm ? `‘${nm}’은(는) 이미 있는 이름입니다.` : "이름을 비울 수 없습니다. 빼려면 ‘✕ 빼기’를 누르세요."); return }
    x.name = nm; E.xsp = xs; refresh(true); return }
  if (el.dataset.xsptype !== undefined) { const x = xs.find(q => q.id === el.dataset.xsptype); if (!x || !XSP_KIND[el.value]) return; x.type = el.value; E.xsp = xs; refresh(true); toast(`‘${x.name}’: ${XSP_HOW[x.type]}.`) }
});
/* ---------- 현장 주소: 검색(카카오 우편번호 서비스)으로 고르거나 직접 입력 ----------
   검색 창은 누를 때만 불러온다. 외부 스크립트가 막힌 환경(인터넷 주소 버전 등)에서는 직접 입력 + ‘지도에서 보기’로 확인한다.
   견적에는 addr(도로명) · jibun(지번) · bname(건물·단지명) · zip · addr2(동·호수) · region(시/도 구/군)이 따로 저장되고, site 는 이들을 합친 글자다. */
const mapUrl = () => "https://map.naver.com/p/search/" + encodeURIComponent(String(E.info.addr || E.info.site || "").trim());
function syncSite() {
  const i = E.info; i.site = [i.addr, i.bname && !String(i.addr || "").includes(i.bname) ? "(" + i.bname + ")" : "", i.addr2].filter(Boolean).join(" ");
  const a = document.querySelector("[data-maplink]"); if (a) a.href = mapUrl();
  clearTimeout(syncSite.t); syncSite.t = setTimeout(planLibCheck, 600);
}
function openAddrSearch() {
  const closeAddr = () => { const o = $("#addrLayer"); if (o) o.remove() };
  const fail = () => { closeAddr(); toast("이 화면에서는 주소 검색 창을 열 수 없습니다. 주소를 직접 입력한 뒤 ‘지도에서 보기’로 확인하세요."); const n = document.querySelector('[data-info="addr"]'); if (n) n.focus() };
  if (location.protocol === "file:") {
    closeAddr();
    document.body.insertAdjacentHTML("beforeend", `<div id="addrLayer" style="position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px"><div class="card" style="width:min(520px,100%)"><div class="hd"><h2>주소 검색</h2><span class="spacer"></span><button type="button" class="btn sm" data-addrclose>닫기</button></div><div style="padding:14px;line-height:1.7">
      <p style="margin:0 0 8px"><b>지금처럼 파일을 직접 연 화면(주소창이 C:/… 로 시작)에서는 검색한 주소를 받아 올 수 없습니다.</b> 주소 검색 서비스가 이런 화면으로는 결과를 보내 주지 않기 때문입니다.</p>
      <p style="margin:0 0 8px">아래 방법으로 열면 검색한 주소를 누르는 즉시 칸에 들어갑니다.</p>
      <ul style="margin:0 0 8px;padding-left:18px"><li>폴더의 <b>‘실장_견적_열기.bat’</b> 를 실행해서 열기 (설치 없음)</li><li>회사 저장소에서 받은 <b>전용 주소</b>로 열기</li></ul>
      <p class="note" style="margin:0">지금은 주소 칸에 직접 입력한 뒤 ‘지도에서 보기’로 확인해 주세요.</p></div></div></div>`);
    return;
  }
  const run = () => {
    closeAddr();
    document.body.insertAdjacentHTML("beforeend", `<div id="addrLayer" style="position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px"><div class="card" style="width:min(520px,100%);height:min(580px,90vh);display:flex;flex-direction:column;overflow:hidden"><div class="hd"><h2>주소 검색</h2><span class="note">도로명 · 아파트 이름 · 지번으로 검색해서 고르세요</span><span class="spacer"></span><button type="button" class="btn sm" data-addrclose>닫기</button></div><div id="addrBox" style="flex:1;min-height:0"></div></div></div>`);
    try {
      new daum.Postcode({ width: "100%", height: "100%", oncomplete: d => {
        const i = E.info; i.addr = d.roadAddress || d.address || d.jibunAddress || ""; i.jibun = d.jibunAddress || d.autoJibunAddress || ""; i.zip = d.zonecode || ""; i.bname = d.buildingName || ""; i.region = [d.sido, d.sigungu].filter(Boolean).join(" ");
        syncSite(); save(); closeAddr(); renderInfo(); const n = document.querySelector('[data-info="addr2"]'); if (n) n.focus(); toast("주소를 넣었습니다. 동·호수를 입력하세요.");
      } }).embed($("#addrBox"));
    } catch (e) { fail() }
  };
  if (window.daum && daum.Postcode) return run();
  const load = (src, bad) => { const s = document.createElement("script"); s.src = src; s.onload = () => { if (window.daum && daum.Postcode) run(); else bad() }; s.onerror = bad; document.head.appendChild(s) };
  load("https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", () => load("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", fail));   // 새 주소 먼저, 안 되면 예전 주소
  setTimeout(() => { if (!(window.daum && daum.Postcode) && !$("#addrLayer")) fail() }, 7000);
}
document.addEventListener("click", ev0 => {
  if (ev0.target.closest("[data-addr]")) openAddrSearch();
  if (ev0.target.closest("[data-addrclose]") || ev0.target.id === "addrLayer") { const o = $("#addrLayer"); if (o) o.remove() }
});
document.addEventListener("input", ev0 => {          // 저장된 견적: 고객명·주소·지역으로 찾기
  if (ev0.target.id !== "savedQ") return; const q = ev0.target.value.trim().toLowerCase();
  document.querySelectorAll("#view-saved li[data-q]").forEach(li => li.hidden = !!q && !li.dataset.q.includes(q));
});
// 전용면적: 평형을 고르면 자동으로 채워지고, 고쳐 넣으면 그 값을 쓴다 (칸을 비우거나 ‘자동값으로’를 누르면 다시 자동)
document.addEventListener("change", ev0 => { if (ev0.target.dataset && ev0.target.dataset.e === "excl") { if (!(+E.excl > 0)) E.excl = ""; refresh(true) } });
document.addEventListener("click", ev0 => { if (ev0.target.closest("[data-exclauto]")) { E.excl = ""; refresh(true) } });
/* ---------- 실측 치수 입력 (확정 견적용) ---------- */
/* ── 타일 붙일 곳 치수: 가로×세로×높이(mm)만 넣으면 면적과 타일 박스 수가 나온다 (면적을 모르는 사람도 쓸 수 있게) ── */
const tdPill = on => on ? '<span class="pill 엑셀">치수</span>' : '<span class="pill">어림</span>';
const tdBox = (a, b) => a > 0 ? Math.ceil(a * 1.2 / b - 1e-9) : 0;   // 면적 → 박스 수 (로스 20% · 올림)
const tdList = S => ((lineVars(S).s7 || {})._sp) || S.list;          // 이 단계에서 도면으로 뺀 벽·공간까지 반영된 면적
const tdOut = s => { if (s.type === "욕실" && !["full", "over"].includes(bathModeOf(s.id))) return `<span class="note">타일을 붙이지 않는 욕실입니다 (공사 범위: ${bathLabel(bathModeOf(s.id))})</span>`;
  if (s.type === "욕실") { const f3 = (l => !!l && (lnState(l).alt || 0) === 1)(lineById("floorTile")), w = tdBox(+s.WT || 0, 1.44), f = tdBox(+s.A || 0, f3 ? 0.99 : 1.44);
    return `${tdPill(s.measured)} 바닥 <b>${s.A}㎡</b> (${toPy(s.A)}평) · 벽 <b>${s.WT}㎡</b> (${toPy(s.WT)}평) → 타일 <b>벽 ${w}박스 + 바닥 ${f}박스 = ${w + f}박스</b>` }
  return `${tdPill(s.measured)} 바닥 <b>${s.A}㎡</b> (${toPy(s.A)}평) → 타일 <b>${tdBox(+s.A || 0, s.type === "발코니" ? 0.99 : 1.44)}박스</b>` };
const tdKit = () => { const k = (E.dim || {}).kitTile, a = k && +k.w > 0 ? r1(+k.w * (+k.h > 0 ? +k.h : 0.6)) : 0; return a ? `${tdPill(true)} 벽 <b>${a}㎡</b> (${toPy(a)}평) → 타일 <b>${Math.max(1, tdBox(a, 1.44))}박스</b>` : `${tdPill(false)} 벽 4㎡로 계산 → 타일 <b>${tdBox(4, 1.44)}박스</b> (가구 치수를 넣었으면 그 값)` };
function tdSum() { const out = ["wallTile", "floorTile", "wallTile2", "floorTile2", "wallTile3", "floorTile3", "entTile", "kitTile", "balTile", "balTile2"].map(id => { const l = lineById(id); return [id, l ? String(l.label || "").replace(/ 타일$/, "").replace(/ 바닥$/, id.startsWith("bal") || id === "entTile" ? "" : " 바닥") : id] }).map(([id, nm]) => { const m = (R.all || R.lines).find(x => x.key === "ln|" + id); return m ? `${nm} <b>${m.qty}${esc(m.unit)}</b>` : "" }).filter(Boolean);
  return out.length ? "지금 견적에 들어가는 타일 합계 — " + out.join(" · ") + " <small>(위 줄의 박스 수를 더한 값 · 로스 20% 포함)</small>" : "타일 공사가 꺼져 있습니다." }
let TD_MORE = false;                                 // (v71) 치수 표는 두 줄만 먼저 보이고, 나머지 곳은 눌러서 펼친다 — 사용자: “2개 정도 계산할 수 있게 만들어 주고 나머지는 누르면 … 너무 위에 6칸을 넘게 차지하니까”
function tileDimCard(S) {
  const dm = E.dim || {}, v = (id, k) => { const x = (dm[id] || {})[k]; return x === undefined || x === "" ? "" : Math.round(x * 1000) }, has = id => !!dm[id] && Object.keys(dm[id]).some(k => ["w", "d", "h"].includes(k));
  const inp = (id, k, ph, lab) => `<input class="q" type="number" min="0" step="10" inputmode="numeric" data-tdim="${id}|${k}" value="${v(id, k)}" placeholder="${ph}" aria-label="${esc(lab)}">`, no = '<td class="note" style="text-align:center">—</td>';
  const SL = tdList(S), rows = SL.filter(s => s.type === "욕실").map(s => [s.id, s.name, `<td data-th="곳"><b>${esc(s.name)}</b></td><td class="num" data-th="가로 mm">${inp(s.id, "w", "예: 1500", s.name + " 가로")}</td><td class="num" data-th="세로 mm">${inp(s.id, "d", "예: 2300", s.name + " 세로")}</td><td class="num" data-th="높이 mm">${inp(s.id, "h", "2200", s.name + " 높이")}</td><td class="note" data-tdout>${tdOut(s)}</td>`])
    .concat(SL.filter(s => s.type === "현관").map(s => [s.id, "현관", `<td data-th="곳"><b>현관 바닥</b></td><td class="num" data-th="가로 mm">${inp(s.id, "w", "예: 1300", "현관 가로")}</td><td class="num" data-th="세로 mm">${inp(s.id, "d", "예: 1500", "현관 세로")}</td>${no}<td class="note" data-tdout>${tdOut(s)}</td>`]))
    .concat([["kitTile", "주방 벽", `<td data-th="곳"><b>주방 벽</b></td><td class="num" data-th="가로 mm">${inp("kitTile", "w", "예: 2400", "주방 벽 타일 가로")}</td>${no}<td class="num" data-th="높이 mm">${inp("kitTile", "h", "600", "주방 벽 타일 높이")}</td><td class="note" data-tdout>${tdKit()}</td>`]])
    .concat(SL.filter(s => s.type === "발코니").map(s => [s.id, s.name, `<td data-th="곳"><b>${esc(s.name)} 바닥</b></td><td class="num" data-th="가로 mm">${inp(s.id, "w", "예: 1200", s.name + " 가로")}</td><td class="num" data-th="세로 mm">${inp(s.id, "d", "예: 4000", s.name + " 세로")}</td>${no}<td class="note" data-tdout>${tdOut(s)}</td>`]));
  const rest = rows.slice(2), filled = rest.filter(r => has(r[0])).length;
  const more = rest.length ? `<div style="padding:6px 14px 0"><button type="button" class="btn ghost sm" data-tdmore aria-expanded="${TD_MORE}">${TD_MORE ? "▴ 다른 곳 접기" : `▾ 다른 곳 치수 넣기 (${esc(rest.map(r => r[1]).join(" · "))})`}</button>${!TD_MORE && filled ? ` <span class="note">치수를 넣어 둔 곳 ${filled}곳</span>` : ""}</div>` : "";
  return `<div class="pgroup tdim"><h3>타일 붙일 곳 치수 <span class="note" title="박스 수 = 면적 × 로스 20% ÷ 1박스 면적(600각·300×600은 1.44㎡ ≈ 0.44평, 300각은 0.99㎡) → 올림"><b>가로 × 세로 × 높이를 mm로</b> 넣으면 면적과 타일 박스 수가 나옵니다 · 비워 두면 평형으로 어림합니다 (로스 20% 포함)</span></h3>
    <div class="tbl"><table><thead><tr><th>곳</th><th class="num">가로 mm</th><th class="num">세로 mm</th><th class="num">높이 mm</th><th>면적 → 타일 박스 수</th></tr></thead><tbody>${rows.map((r, i) => `<tr data-tdrow="${r[0]}"${i >= 2 && !TD_MORE ? " hidden" : ""}>${r[2]}</tr>`).join("")}</tbody></table></div>${more}
    <p class="note" style="padding:6px 14px 10px;margin:0" data-tdsum>${tdSum()}</p></div>`;
}
let TD_T = 0;
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.tdim === undefined) return; const [id, k] = el.dataset.tdim.split("|"); E.dim = E.dim || {}; const m = E.dim[id] = E.dim[id] || {};
  if (el.value === "" || !(+el.value > 0)) delete m[k]; else m[k] = +el.value / 1000; if (!Object.keys(m).length) delete E.dim[id];
  R = compute(); renderSummary(); save();
  document.querySelectorAll("[data-tdrow] [data-tdout]").forEach(c => { const pid = c.closest("[data-tdrow]").dataset.tdrow, l = c.dataset.tdout ? lineById(c.dataset.tdout) : null, sp = tdList(R.S).find(s => s.id === pid); c.innerHTML = l ? tileOutAt(l, pid) : pid === "kitTile" ? tdKit() : sp ? tdOut(sp) : "" });   // (v78) 줄마다의 결과 칸
  { const t = document.querySelector("[data-tdsum]"); if (t) t.innerHTML = tdSum() }
  clearTimeout(TD_T); TD_T = setTimeout(() => { const a = document.activeElement, kk = a && a.dataset ? a.dataset.tdim : null; renderChecklist(); if (kk) { const n = document.querySelector('[data-tdim="' + kk + '"]'); if (n) { n.focus(); const vv = n.value; n.value = ""; n.value = vv } } }, 1500) });
/* ── 매입등: 곳마다 개수를 따로 넣으면 합계가 수량이 된다 ── */
function downPlaces(auto) {
  const d = E.dnl || {}, has = Object.keys(d).length > 0, ps = [...R.S.list.filter(s => ["거실", "주방", "방"].includes(s.type) && !s.dress).map(s => [s.id, s.name.replace(/ \(.*\)/, "").replace("·공용부", "")]), ["hall", "복도·현관"]];
  return `<div class="bom dnl"><span class="note"><b>곳마다 개수</b> — 넣으면 합계가 위 수량이 됩니다 ${has ? `· 지금 합계 <b>${Object.values(d).reduce((a, n) => a + (+n || 0), 0)}개</b>` : `(비워 두면 자동 ${auto}개)`}</span>
    <div class="dnr">${ps.map(([id, nm]) => `<label class="dnp"><span>${esc(nm)}</span><input type="number" min="0" step="1" inputmode="numeric" data-dnl="${id}" value="${d[id] ?? ""}" placeholder="0" aria-label="${esc(nm)} 매입등 개수"></label>`).join("")}${has ? '<button type="button" class="wtr" data-dnlclear>↺ 자동 개수로</button>' : ""}</div></div>`;
}
let DN_T = 0;
document.addEventListener("input", ev0 => { const el = ev0.target; if (!el.dataset || el.dataset.dnl === undefined) return; const l = lnFind("down"); if (!l) return; const d = E.dnl = E.dnl || {};
  if (el.value === "") delete d[el.dataset.dnl]; else d[el.dataset.dnl] = Math.max(0, +el.value || 0); const ks = Object.keys(d); if (!ks.length) E.dnl = undefined;
  setLn(l, { q: ks.length ? ks.reduce((a, k) => a + (+d[k] || 0), 0) : undefined, on: true }); R = compute(); renderSummary(); save();
  clearTimeout(DN_T); DN_T = setTimeout(() => { const a = document.activeElement, kk = a && a.dataset ? a.dataset.dnl : null; renderChecklist(); if (kk) { const n = document.querySelector('[data-dnl="' + kk + '"]'); if (n) { n.focus(); const vv = n.value; n.value = ""; n.value = vv } } }, 1200) });
document.addEventListener("click", ev0 => { if (!ev0.target.closest("[data-dnlclear]")) return; const l = lnFind("down"); E.dnl = undefined; if (l) setLn(l, { q: undefined }); refresh() });
function dimInfo(s) { if (s.xsp && !(s.A > 0)) return '<span class="pill">넓이 미입력</span> 가로·세로를 넣기 전에는 수량·금액에 들어가지 않습니다';   // (v63) 추가 공간
  return `${s.measured ? '<span class="pill 엑셀">실측</span>' : s.fit ? '<span class="pill">도면에 그린 크기</span>' : '<span class="pill">추정</span>'} 바닥 ${s.A}㎡ · 둘레 ${s.P}m · ${s.WT ? "벽타일 " + s.WT : "벽·천장 " + s.W}㎡${s.wallN ? ` <b>· 벽 ${s.wallN}면 ${s.wallA}㎡ (${toPy(s.wallA)}평)${s.wallCut ? " · 문·창 −" + s.wallCut + "㎡" : ""}</b>` : ""}` }
function measOut(lid, k) {                          // 실측표 오른쪽에 보여 줄 ‘지금 견적에 들어가는 수량’
  const l = lineById(lid), on = l && lnState(l).on, m = R.lines.find(x => x.key === "ln|" + lid), nm = l ? lineLabel(l) : lid;
  if (k === "kitH" && !(+(E.meas || {}).sink > 0)) return "싱크대 길이를 먼저 넣으세요";
  if (!on) return `${nm}: 체크 안 함 (공정에서 체크하면 반영)`;
  return `${nm}: <b>${m ? m.qty : "-"}${m ? esc(m.unit) : ""}</b>${m && m.measured ? ' <span class="pill 엑셀">실측</span>' : ' <span class="pill">기본값</span>'}${m && m.edited ? " · 수량을 손으로 고친 상태" : ""}`;
}
function dimBox(S) {
  const dm = E.dim || {}, n = S.list.filter(s => s.measured).length + Object.values(E.meas || {}).filter(v => +v > 0).length, n2 = n - S.list.filter(s => s.measured && isRoomRow(s) && !s.wallN).length;   // n2 = 위 ‘방 크기’ 칸에서 넣은 것 말고 이 표에서 볼 것
  return `<details class="more" ${n2 || E.dimOpen ? "open" : ""}><summary>실측 치수 표 (욕실·현관·발코니 · 벽체별 · 가구·창) <span class="note">${n ? n + "건 실측 반영 중" : "현장에서 잰 치수를 넣으면 수량이 실측값으로 계산됩니다 · 비워 두면 평형으로 추정"}</span></summary>
   <div class="bd"><p class="note"><b>치수는 모두 mm로 넣습니다</b> (위 도면에서 벽을 눌러 넣는 것과 같은 단위). 넣는 방법은 세 가지이고 아무거나 하나만 쓰면 됩니다: ① 위 도면에서 벽을 눌러 넣기 ② 이 표에 가로·세로 ③ 벽마다 가로*높이.<br>공간마다 가로·세로를 넣거나, 모양이 반듯하지 않으면 면적(㎡)만 넣으세요. 넣은 공간은 그 값으로 바닥·벽·둘레 수량을 다시 계산합니다.<br><b>벽체별 치수</b>: 벽마다 <code>가로*높이</code>(mm)를 쉼표로 이어 적으면 벽 면적과 둘레가 그 값으로 계산됩니다. 예: <code>3600*2300, 2400*2300*2, -900*2100</code> (‘*2’ = 같은 벽 2개 · ‘-’ = 문·창처럼 빼는 면). 도배·몰딩·타일 수량이 이 면적을 따라갑니다.</p>
   <div class="tbl"><table><thead><tr><th>공간</th><th class="num">가로 mm</th><th class="num">세로 mm</th><th class="num">또는 면적 ㎡</th><th>계산 결과</th></tr></thead><tbody>
   ${S.list.filter(s => s.type !== "공통").map(s => { const m = dm[s.id] || {}; return `<tr data-dimrow="${s.id}"><td><b>${esc(s.name)}</b></td>${["w", "d", "a"].map(k => isRoomRow(s) && k !== "a" ? (k === "w" ? '<td class="note" colspan="2" style="text-align:center">가로·세로는 위 ‘공간’ 칸의 <b>방 크기</b>에서</td>' : "") : `<td class="num"><input class="q" type="number" min="0" step="${k === "a" ? 0.01 : 10}" data-dim="${s.id}|${k}"${k === "a" ? "" : ' data-mm="1"'} value="${m[k] === undefined || m[k] === "" ? "" : k === "a" ? m[k] : Math.round(m[k] * 1000)}" placeholder="${k === "a" ? "" : "예: 3600"}" aria-label="${esc(s.name)} ${k === "w" ? "가로" : k === "d" ? "세로" : "면적"}"></td>`).join("")}<td class="note" data-dimout>${dimInfo(s)}</td></tr><tr class="dimwr"><td class="note" style="text-align:right">└ 벽체별</td><td colspan="4"><input class="dimw" data-dimw="${s.id}" value="${esc(m.walls || "")}" placeholder="3600*2300, 2400*2300, -900*2100" aria-label="${esc(s.name)} 벽체별 치수" title="벽마다 가로*높이(mm)를 쉼표로 이어 적습니다. 같은 벽이 여러 개면 *개수, 문·창처럼 뺄 면은 앞에 - 를 붙입니다"></td></tr>` }).join("")}
   </tbody></table></div>
   <h3 style="font-size:13px;margin:12px 0 4px">주방 · 가구 · 창 <span class="note">치수를 넣으면 그 공사의 수량이 실측값으로 바뀝니다 · 비워 두면 기본 수량</span></h3>
   <div class="tbl"><table><thead><tr><th>항목</th><th class="num">실측값</th><th>단위</th><th>견적에 들어가는 수량</th><th>설명</th></tr></thead><tbody>
   ${MEAS_ROWS.map(([k, nm, u, lid, tip]) => `<tr><td><b>${nm}</b></td><td class="num"><input class="q" type="number" min="0" step="1" data-meas="${k}" value="${(E.meas || {})[k] ?? ""}" aria-label="${nm}"></td><td>${u}</td><td class="note" data-measout="${lid}|${k}">${measOut(lid, k)}</td><td class="note">${tip}</td></tr>`).join("")}
   </tbody></table></div>
   <div class="fields" style="margin-top:8px"><label class="f">천장고 (비우면 ${D.layout.ceilH}m)<span class="in"><input type="number" min="0" step="0.01" data-dimh value="${esc(E.ceilH ?? "")}"><span class="u">m</span></span></label>
   <div class="f"><span>바닥 시공 합계 (거실·주방·방)</span><b id="dimSum">${areaVars(S).FT}㎡</b></div></div>
   ${n || +E.ceilH > 0 ? '<button type="button" class="btn sm" data-dimclear style="margin-top:8px">실측값 모두 지우기</button>' : ""}</div></details>`;
}
document.addEventListener("input", ev0 => {
  const el = ev0.target; if (el.dataset.dim === undefined && el.dataset.dimh === undefined) return;
  if (el.dataset.dimh !== undefined) E.ceilH = el.value === "" ? "" : +el.value;
  else { const [id, k] = el.dataset.dim.split("|"); E.dim = E.dim || {}; const m = E.dim[id] = E.dim[id] || {}; if (el.value === "") delete m[k]; else m[k] = el.dataset.mm ? +el.value / 1000 : +el.value; if (!Object.keys(m).length) delete E.dim[id] }
  if (el.closest("details.more")) E.dimOpen = true; R = compute(); renderSummary(); save();   // (v86) 접어 둔 실측 표는 그 안에서 칠 때만 펼쳐 둔다
  for (const s of R.S.list) document.querySelectorAll(`[data-dimrow="${s.id}"] [data-dimout]`).forEach(c => c.innerHTML = dimInfo(s));
  roomDimSync();   // 같은 공간의 줄이 두 군데(추가 공간 줄 · 실측 표)에 있을 수 있다
  if (el.dataset.dim) document.querySelectorAll(`[data-dim="${el.dataset.dim}"]`).forEach(o => { if (o !== el) o.value = el.value });   // 다른 쪽 칸도 같은 값으로
  const t = $("#dimSum"); if (t) t.textContent = areaVars(R.S).FT + "㎡";
  const pb = $("#planBase"); if (pb) pb.innerHTML = planSvg("base", baseOpts()); p3dSync();
});
document.addEventListener("input", ev0 => {          // 벽체별 치수
  const el = ev0.target; if (!el.dataset || el.dataset.dimw === undefined) return; const id = el.dataset.dimw; E.dim = E.dim || {}; const m = E.dim[id] = E.dim[id] || {};
  if (el.value.trim() === "") delete m.walls; else m.walls = el.value; if (!Object.keys(m).length) delete E.dim[id];
  E.dimOpen = true; R = compute(); renderSummary(); save();
  for (const sp of R.S.list) document.querySelectorAll(`[data-dimrow="${sp.id}"] [data-dimout]`).forEach(c => c.innerHTML = dimInfo(sp));
});
document.addEventListener("click", ev0 => { if (!ev0.target.closest("[data-dimclear]")) return; E.measSkip = planBaseKey(); delete E.measFrom; E.wallLen = {}; E.dim = {}; E.meas = {}; E.ceilH = ""; E.dimOpen = true; refresh(true) });
document.addEventListener("input", ev0 => {          // 가구·주방·창 실측값
  const el = ev0.target; if (el.dataset.meas === undefined) return;
  E.meas = E.meas || {}; if (el.value === "") delete E.meas[el.dataset.meas]; else E.meas[el.dataset.meas] = +el.value;
  E.dimOpen = true; R = compute(); renderSummary(); save();
  document.querySelectorAll("[data-measout]").forEach(c => { const [lid, k] = c.dataset.measout.split("|"); c.innerHTML = measOut(lid, k) });
});
document.addEventListener("input", ev0 => {
  const el = ev0.target;
  if (el.dataset.info !== undefined) {
    const k = el.dataset.info; E.info[k] = el.value;
    if (k === "addr") { delete E.info.bname; delete E.info.zip; delete E.info.jibun }      // 직접 고치면 검색으로 받은 건물명·우편번호는 지운다
    if (k === "addr" || k === "addr2") syncSite();
    save(); return;
  }
  if (el.dataset.e !== undefined) { const k = el.dataset.e; E[k] = el.type === "number" ? (el.value === "" ? "" : +el.value) : el.value; if (k === "py") { E.excl = "" } if (k === "excl" || k === "level") applyPackages(); refresh(k === "py"); return }
});
document.addEventListener("change", ev0 => { const el = ev0.target; if (el.tagName === "SELECT" && el.dataset.e) { E[el.dataset.e] = el.dataset.e === "py" ? +el.value : el.value; refresh(true) } if (el.tagName === "SELECT" && el.dataset.info) { E.info[el.dataset.info] = el.value; save() } });

/* ---------- 공간 선택 ---------- */
function renderSpaces() {
  $("#spaceTabs").innerHTML = R.S.list.map(sp => `<button type="button" class="stab" data-space="${sp.id}" aria-pressed="${E.space === sp.id}">
    <span>${esc(sp.name)}</span><b>${won((R.bySpace[sp.id] || { amt: 0 }).amt)}</b></button>`).join("");
}
function renderSpace() {
  const sp = R.S.list.find(s => s.id === E.space) || R.S.list[1]; E.space = sp.id;
  const dims = sp.type === "공통" ? `<span class="note">집 전체에 들어가는 공정입니다. 인건비·부자재는 공간 선택 결과로 자동 계산됩니다.</span>`
    : `<span class="chip">바닥 ${sp.A}㎡</span>${sp.WT ? `<span class="chip">벽 타일 ${sp.WT}㎡</span>` : `<span class="chip">벽·천장 ${sp.W}㎡</span>`}<span class="chip">둘레 ${sp.P}m</span>`;
  const cats = catsOf(sp).map(cat => {
    const si = selIdx(sp, cat);
    const num = cat.num ? `<label class="f numin"><span>${esc(cat.num.label)}</span><span class="in"><input type="number" min="0" data-num="${cat.key}" value="${numVal(sp, cat)}"><span class="u">${esc(cat.num.unit)}</span></span></label>` : "";
    return `<div class="cat"><div class="cath"><b>${esc(cat.label)}</b>${num}</div><div class="opts">${cat.opts.map((o, oi) => {
      const amt = o.lines.length ? optionAmount(sp, cat, oi) : 0;
      return `<button type="button" class="opt" data-cat="${cat.key}" data-oi="${oi}" aria-pressed="${si === oi}"><span>${esc(o.label)}</span><small>${o.lines.length ? (amt ? won(amt) + "원" : "해당 없음") : "추가금 없음"}</small></button>`
    }).join("")}</div></div>`
  }).join("");
  const ls = R.lines.filter(l => l.space === sp.id);
  $("#spacePanel").innerHTML = `<div class="hd"><h2>${esc(sp.name)}</h2>${dims}<span class="spacer"></span><b class="tabnum">${won((R.bySpace[sp.id] || { amt: 0 }).amt)}원</b></div>
   <div class="bd cats">${cats || '<p class="note">선택할 항목이 없습니다.</p>'}</div>
   <div class="hd sub"><h2>${esc(sp.name)} 내역</h2><span class="note">수량을 고치면 그 줄만 바뀝니다 (초록 칸 = 직접 수정)</span></div>
   ${lineTable(ls, true)}
   <div class="addrow"><select id="addItem" aria-label="품목 추가"><option value="">이 공간에 품목 추가…</option>${PROCS.map(p => `<optgroup label="${PROC_LABEL[p]}">${D.catalog.filter(i => i.proc === p).map(i => `<option value="${esc(i.name)}">${esc(i.name)} · ${esc(i.unit)}</option>`).join("")}</optgroup>`).join("")}<option value="__custom">직접 입력 (단가 수기)</option></select></div>`;
}
const XUNITS = ["식", "m", "㎡", "평", "개", "장", "자", "짝", "틀", "세트", "개소", "롤", "박스", "M", "인", "일", "대"];   // 직접 입력한 공사에서 고르는 단위
function dimQty(t, unit, it) {                        // 치수 글 → 수량. ‘2400*600*2 + 900*2100’ (50 이상은 mm 로 본다 · 셋째 숫자는 개수)
  const u = String(unit || ""); if (!/^(㎡|m|M|평)$/.test(u)) return null; let area = 0, len = 0, ok = false; const mm = v => v >= 50 ? v / 1000 : v;
  for (const term of String(t || "").split(/[+,]/)) { const ns = (term.match(/\d+(\.\d+)?/g) || []).map(Number); if (!ns.length) continue; ok = true;
    if (ns.length === 1) { len += mm(ns[0]); continue }
    if (ns[1] < 50 && ns[0] >= 50 && ns.length === 2) { len += mm(ns[0]) * ns[1]; continue }   // 길이*개수
    area += mm(ns[0]) * mm(ns[1]) * (ns.length >= 3 ? ns[2] : 1); len += mm(ns[0]) * (ns.length >= 3 ? ns[2] : 1) }
  if (!ok) return null; const film = u === "M" && it && it.proc === "필름";
  if (u === "㎡") return area ? r1(area) : null; if (u === "평") return area ? r1(area / 3.3058) : null;
  if (film) return area ? Math.ceil(area / 1.22 * 1.1 * 2) / 2 : (len ? r1(len) : null);   // 필름: 폭 1.22m 기준 길이 + 로스 10%, 0.5M 단위로 올림
  return len ? r1(len) : null;
}
const dimOk = l => l.extra && /^(㎡|m|M|평)$/.test(String(l.unit || ""));
const procShort = p => (PROC_LABEL[p] || p || "").replace(/공사$/, "").replace(/^목$/, "목공");   // 가설공사 → 가설 · 목공사 → 목공
function lineTable(ls, editable) {
  const adm = isAdmin;
  if (!ls.length) return `<p class="note" style="padding:0 14px 12px">선택된 공사가 없습니다.</p>`;
  return `<div class="tbl xl"><table><thead><tr><th>공정</th><th>품명</th><th>규격·비고</th><th>구분</th><th class="num">수량</th><th>단위</th><th class="num">단가</th>${adm ? '<th class="num cost">원가</th>' : ""}<th class="num">금액</th><th></th></tr></thead><tbody>
  ${ls.map(l => `<tr data-key="${esc(l.key)}" class="${l.edited ? "edited" : ""}${l.opt ? " opt" : ""}">
    <td class="note" data-th="공정">${l.extra && !l.it ? `<select data-x="proc" aria-label="공정" title="이 줄의 금액이 들어갈 공정입니다. 바꾸면 견적서와 합계에서 그 공정으로 옮겨집니다">${PROCS.map(p => `<option value="${p}" ${p === l.proc ? "selected" : ""}>${esc(procShort(p))}</option>`).join("")}</select>` : esc(procShort(l.proc))}</td>
    <td class="nm w2" data-th="품명">${l.extra && !l.it ? `<input data-x="name" value="${esc(l.name)}" placeholder="품명">` : `<b>${esc(l.name)}</b>`}</td>
    <td class="nm w2" data-th="규격·비고">${l.extra ? `<input data-x="note" value="${esc(l.note)}" placeholder="${l.film ? "넣을 곳" : "위치 · 규격"}">${dimOk(l) ? `<input class="dim" data-x="dim" value="${esc(l.dim || "")}" placeholder="치수 예: 2400*600*2 + 900*2100" title="가로*세로*개수 (mm). 적으면 수량이 자동으로 바뀝니다">` : ""}` : `<small>${esc(l.note)}</small>`}</td>
    <td data-th="구분"><span class="pill">${esc(l.kind)}</span></td>
    <td class="num" data-th="수량">${editable ? `<input class="q" type="number" min="0" step="0.1" data-q value="${l.qty}">` : l.qty}</td>
    <td data-th="단위">${l.extra && !l.it ? `<select data-x="unit" aria-label="단위">${[...new Set([l.unit, ...XUNITS])].map(u => `<option ${u === l.unit ? "selected" : ""}>${esc(u)}</option>`).join("")}</select>` : esc(l.unit)}</td>
    <td class="num" data-th="단가">${l.extra && (!l.it || adm || l.tbd) ? `<input class="p" type="number" min="0" step="100" data-x="price" value="${l.manualPrice ?? ""}" placeholder="${l.tbd ? "단가 입력" : won(l.price)}">` : (l.tbd ? '<span class="tbd">단가 미정</span>' : won(l.price))}</td>
    ${adm ? `<td class="num cost" data-th="원가">${won(l.ucost)}</td>` : ""}
    <td class="num amtc" data-th="금액">${won(l.amt)}${l.opt ? ' <small class="optm">별도</small>' : ""}</td>
    <td class="w2 act">${l.extra ? `<label class="optk" title="합계에는 넣지 않고 금액만 따로 보여 줍니다"><input type="checkbox" data-x="opt" ${l.opt ? "checked" : ""}>비교견적(별도)</label> <button class="btn ghost sm" data-delx="${esc(l.key)}">삭제</button>` : (l.edited ? `<button class="btn ghost sm" data-reset="${esc(l.key)}" title="자동 수량 ${l.auto}">자동값</button>` : "")}</td></tr>`).join("")}
  </tbody></table></div>`;
}
document.addEventListener("click", ev0 => {
  const b = ev0.target.closest("button"); if (!b) return;
  if (b.dataset.seg) { E[b.dataset.seg] = +b.dataset.v; if (b.dataset.seg === "rooms" || b.dataset.seg === "baths" || b.dataset.seg === "balconies") E.excl = E.excl; refresh(true); return }
  if (b.dataset.space) { E.space = b.dataset.space; renderSpaces(); renderSpace(); save(); return }
  if (b.dataset.cat !== undefined && b.dataset.oi !== undefined) { E.sel[E.space] = E.sel[E.space] || {}; E.sel[E.space][b.dataset.cat] = +b.dataset.oi; refresh(); return }
  if (b.dataset.reset) { delete E.ovr[b.dataset.reset]; refresh(); return }
  if (b.dataset.delx) { E.extras = E.extras.filter(x => x.id !== b.dataset.delx); refresh(); return }
});
document.addEventListener("input", ev0 => {
  const el = ev0.target;
  if (el.dataset.num) { E.num[E.space] = E.num[E.space] || {}; E.num[E.space][el.dataset.num] = el.value; R = compute(); renderSpaces(); renderSummary(); save(); clearTimeout(refresh.t); refresh.t = setTimeout(() => { const f = document.activeElement && document.activeElement.dataset.num; renderSpace(); if (f) { const n = document.querySelector(`[data-num="${f}"]`); if (n) { n.focus(); const v = n.value; n.value = ""; n.value = v } } }, 700); return }
  const tr = el.closest("tr[data-key]"); if (!tr) return;
  const key = tr.dataset.key;
  if (el.dataset.q !== undefined) { const x = E.extras.find(x => x.id === key); if (x) x.qty = el.value; else E.ovr[key] = el.value === "" ? undefined : +el.value }
  if (el.dataset.x) { const x = E.extras.find(x => x.id === key), k = el.dataset.x; if (x) { x[k] = el.type === "checkbox" ? el.checked : el.value;
      if (k === "dim" || (k === "unit" && x.dim)) { const it = x.item ? byName[x.item] : null, v = dimQty(x.dim, it ? it.unit : x.unit, it); if (v !== null) { x.qty = v; const qi = tr.querySelector("[data-q]"); if (qi) qi.value = v } }
      if (k === "proc") { const s0 = STEPS()[E.step]; if (s0 && s0.key !== "s0" && s0.key !== "end") x.at = s0.key }   // 공정을 바꿔도 넣은 단계의 목록에 그대로 보인다
      if (k === "unit" || k === "opt" || k === "proc") { refresh(); return } } }
  R = compute(); const l = (R.all || R.lines).find(l => l.key === key); if (l) { const c = tr.querySelectorAll("td.num"); c[c.length - 1].textContent = won(l.amt); tr.classList.toggle("edited", !!l.edited) }
  renderSpaces(); renderSummary(); save();
});
document.addEventListener("change", ev0 => {
  if (ev0.target.id !== "addItem") return; const v = ev0.target.value; if (!v) return;
  if (v === "__custom") E.extras.push({ id: "x" + Date.now(), space: E.space, proc: "기타", name: "", unit: "식", qty: 1, price: "", note: "" });
  else E.extras.push({ id: "x" + Date.now(), space: E.space, item: v, qty: 1 });
  refresh();
});

/* ---------- 합계 ---------- */
function cmpSummary() {                              // 합계 칸: 비교견적(별도) 모아 보기
  const o = R.opt || [], c = R.cmp || []; if (!o.length && !c.length) return '<div class="cmpsum empty note" title="공사 줄의 ‘비교견적’ 단추를 누르면 합계에 넣지 않고 금액만 따로 낼 수 있습니다. (예: 장판 ↔ 강마루, 문 교체 ↔ 필름)"><b>비교견적</b> 공사 줄의 ‘비교견적’ 단추로 따로 냅니다 (합계 미포함)</div>';
  const by = new Map(); for (const l of o) { const k = l.lid || l.key, x = lnFind(l.lid); if (!by.has(k)) by.set(k, { n: l.extra ? (l.film ? "필름 · " + l.spaceName : (l.name || "직접 입력")) : (x ? lineLabel(x) : aliasOf(l.name)), a: 0 }); by.get(k).a += l.amt }
  return `<div class="cmpsum"><div class="cmpt">비교견적 <small>별도 · 합계 미포함 · VAT 별도</small></div>`
    + [...by.values()].map(x => `<div class="srow sub"><span>별도 · ${esc(x.n)}</span><span>${won(x.a)}</span></div>`).join("") + (o.length ? `<div class="srow sub"><span><b>별도 합계</b></span><b>${won(R.optSum)}</b></div>` : "")
    + c.map(x => `<div class="srow sub"><span>${esc(aliasOf(x.from))} → ${esc(aliasOf(x.to))}</span><span>${x.diff > 0 ? "+" : "−"}${won(Math.abs(x.diff))}</span></div>`).join("") + "</div>";
}
function renderSummary() {                             // (v89) 합계 칸은 화면보다 길면 안에서 스크롤된다 → 다시 그려도 보던 자리를 지킨다
  const b0 = document.querySelector("#summary>.bd"), st0 = b0 ? b0.scrollTop : 0; renderSummary1(); if (st0) { const b1 = document.querySelector("#summary>.bd"); if (b1) b1.scrollTop = st0 }
  if (PROC_VIEW && document.getElementById("procBox")) { try { procView() } catch (e) { } } }   // (v94) 열려 있는 ‘공정별로 보기’도 같이
function renderSummary1() {
  const tgt = D.settings.targetMargin ?? 0.2, m = R.margin, mgc = mgCan(), mgs = mgc && !mgHidden();   // (v88) mgs = 공정마다 원가를 같이 보여 준다
  document.body.classList.toggle("mgon", mgs);        // (v90) 원가 칸이 들어가면 합계 칸을 조금 넓힌다
  $("#summary").innerHTML = `<div class="hd"><h2>견적 합계</h2><span class="spacer"></span>${mgc ? `<button type="button" class="btn ghost sm" data-mghide title="고객과 화면을 같이 볼 때 원가 · 차액을 감춥니다 (이 기기에 기억)">${mgs ? "원가 가리기" : "원가 보기"}</button>` : ""}<span class="chip">${esc(E.info.kind)} v${E.info.ver}</span></div><div class="bd">
   <div class="srow sub mgh"><span><button type="button" class="plk" data-procview="*" title="공정마다 무엇이 들어 있는지 한 화면에 봅니다">공정별로 보기 ›</button></span>${mgs ? '<span class="mgi">원가</span>' : ""}<span class="pa">견적 금액</span></div>
   ${PROCS.filter(p => R.byProc[p]).map(p => `<div class="srow sub${mgs ? " mg" : ""}"><span><button type="button" class="plk" data-procview="${p}" title="이 공정에 들어 있는 줄 보기">${PROC_LABEL[p]}</button></span>${mgs ? mgRow(p) : ""}<span class="pa">${won(R.byProc[p].amt)}</span></div>`).join("")}
   <div class="srow${mgs ? " mg mgsum" : ""}" style="border-top:1px solid var(--line);margin-top:6px;padding-top:8px"><span${mgs ? ' title="견적서의 ‘공사원가’ (기업이윤을 더하기 전의 공정 금액 합계)"' : ""}>${mgs ? "공정 합계" : "공사원가"}</span>${mgs ? `<span class="mgi sum" title="공정별 원가의 합계">${won(Math.round(R.cost))}</span>` : ""}<b class="pa">${won(R.sum)}</b></div>
   <div class="srow"><span>기업이윤${isAdmin ? ` <span class="cost">${+E.biz || 0}%</span>` : ""}</span><span>${won(R.biz)}</span></div>
   <div class="srow sub"><span>절사</span><span>${won(R.cut)}</span></div>
   <div class="srow"><span>공사비 합계 (VAT 별도)</span><b>${won(R.net)}</b></div>
   <div class="srow sub"><span>부가세 10%</span><span>${won(R.vat)}</span></div>
   <div class="srow total"><span>총 합계</span><span>${won(R.total)}원</span></div>
   ${mgs ? mgTotal() : mgNote()}
   ${(bd => bd._ok && Math.abs(R.sum - bd._sum) >= 1 ? `<div class="note" style="text-align:right;margin-top:4px">수량·종류를 고쳐서 ${dltChip(R.sum - bd._sum, "자동 계산보다")} <small>(${mgs ? "공정 합계" : "공사원가"} 기준)</small></div>` : "")(D.stepLines ? baseAmts() : {})}
   ${cmpSummary()}
   <div class="note" style="text-align:right">평당 ${won(R.net / (+E.py || 1))}원 · ㎡당 ${won(R.net / (R.S.supplyM2 || 1))}원 (VAT 별도)</div>
   ${STAFF_DATA ? staffNote() : `<div class="meter ${R.net ? (m >= tgt ? "good" : "low") : ""}"><div class="note">예상 마진율 (기업이윤 포함)</div><div class="big">${R.net ? pct(m) : "-"}</div>
     <div class="bar"><i style="width:${Math.max(0, Math.min(100, m / 0.5 * 100))}%"></i><b style="left:${tgt / 0.5 * 100}%"></b></div>
     <div class="note" style="margin-top:6px">${!R.net ? "공사를 체크하면 계산됩니다." : m >= tgt ? `목표 ${pct(tgt)} 이상입니다.` : `목표 ${pct(tgt)}보다 낮습니다. 직접 입력한 단가나 수량을 확인하세요.`}</div></div>`}
   ${R.fzDiff ? `<p class="note down" style="margin-top:8px">저장할 때의 단가로 계산 중입니다. 지금 단가표와 다른 품목 ${R.fzDiff}건. <button class="btn sm" data-act="reprice">현재 단가로 다시 계산</button></p>` : ""}
   ${isAdmin && !STAFF_DATA ? (z => z.length ? `<p class="note down cost" style="margin-top:8px">원가가 없는 줄 ${z.length}개 — 마진이 실제보다 높게 보입니다: ${esc(z.slice(0, 5).map(l => custName(l.docName || aliasOf(l.name))).join(", "))}${z.length > 5 ? " 외" : ""}</p>` : "")(R.lines.filter(l => l.amt > 0 && !(l.cost > 0)))
     + (z => z.length ? `<p class="note down cost" style="margin-top:6px">마진이 3% 아래인 줄 ${z.length}개: ${esc(z.slice(0, 5).map(l => custName(l.docName || aliasOf(l.name)) + " " + Math.round((1 - l.cost / l.amt) * 1000) / 10 + "%").join(", "))}${z.length > 5 ? " 외" : ""}</p>` : "")(R.lines.filter(l => l.amt > 0 && l.cost > 0 && l.cost > l.amt * 0.97 && !/식대/.test(l.name))) : ""}
   ${R.tbd.length ? `<p class="note down" style="margin-top:8px">단가 미정 ${R.tbd.length}건: ${esc(R.tbd.slice(0, 3).map(l => l.name).join(", "))}${R.tbd.length > 3 ? " 외" : ""} — ${isAdmin ? "단가·원가 화면에서 원가를 넣으세요." : "단가를 직접 넣거나 관리자에게 요청하세요."}</p>` : ""}
   ${R.errors.length ? `<p class="note down">규칙 오류 ${R.errors.length}건: ${esc(R.errors.slice(0, 3).join(" / "))}</p>` : ""}
   <div class="toolbar" style="margin-top:12px"><button class="btn primary sm" data-act="save">저장</button><button class="btn sm" data-act="draft" title="쓰던 견적을 ‘저장된 견적’에 임시로 넣어 둡니다. 나중에 ‘이어 쓰기’로 열면 쓰던 단계에서 다시 시작합니다">임시저장</button><button class="btn sm" data-act="doc">견적서 보기</button><button class="btn sm" data-act="new" title="쓰던 견적은 ‘저장된 견적’에 남겨 두고 빈 견적으로 시작합니다">＋ 새 견적</button>${isAdmin && !STAFF_DATA && Object.keys(store.get("sido3_price_edits", {})).length ? `<button class="btn sm" data-act="pricepatch" title="견적 입력 화면에서 바꾼 기본 단가를 patch.json 파일로 받습니다">바꾼 단가 파일 받기 (${Object.keys(store.get("sido3_price_edits", {})).length}건)</button>${(() => { try { return SRV && SRV.me && SRV.me.role === "admin" } catch (e) { return false } })() ? '<button class="btn sm primary" data-act="priceapply" title="바꾼 기본 단가를 관리자 비밀번호로 바로 반영합니다 (실장 화면에도 나갑니다). 대표님 컴퓨터에서 bat을 돌리지 않아도 됩니다">바꾼 단가 바로 반영</button>' : ""}` : ""}</div>
  </div>`;
}
document.addEventListener("click", ev0 => {
  const b = ev0.target.closest("[data-act]"); if (!b) return; const a = b.dataset.act;
  if (SENT_HOW[a]) srvSent(SENT_HOW[a]);
  if (a === "reprice") { if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = "한 번 더 누르면 금액이 바뀝니다"; return } delete E.fp; delete E.fpVer; refresh(); toast("현재 단가표로 다시 계산했습니다.") }
  if (a === "save") { snapshotPrices(); save(); const L = store.get("sido3_list", []).filter(x => x.id !== E.id), prevAt = E.savedAt || ""; E.savedAt = new Date().toISOString(); E.total = R.total; mgSnap(); delete E.draft; L.unshift(deep(E)); store.set("sido3_list", L) ? toast("저장했습니다.") : toast("이 브라우저에는 저장할 수 없습니다. 견적 파일로 내보내세요."); estBarUp();
    const fc = !!(SRV && SRV.force && SRV.force.id === E.id && Date.now() < SRV.force.until); if (SRV) SRV.force = null;   // 방금 ‘더 새 내용이 있다’는 안내를 보고 한 번 더 누른 것이면 덮어쓴다
    srvSave(fc, prevAt).then(ok => { if (ok && ok.clash) { SRV.force = { id: E.id, until: Date.now() + 20000 }; toast(`이 기기에는 저장했습니다. 그런데 회사 저장소에는 ${whoSay(ok.who)} ${fmtAt(ok.at)}에 저장한 더 새 내용이 있어 아직 올리지 않았습니다. 화면 위 ‘회사 저장소에 더 새 내용’을 눌러 확인하세요. 내 내용으로 덮어쓰려면 20초 안에 ‘저장’을 한 번 더 누르세요.`) }
      else if (ok) toast(fc ? "내 내용으로 회사 저장소를 덮어썼습니다." : "저장했습니다. 회사 저장소에도 올렸습니다."); else if (SRV && SRV.token && (ok === false || ok === null)) toast("이 기기에 저장했습니다. 회사 컴퓨터에 연결되면 저절로 회사 저장소에 올라갑니다."); else if (ok === false) toast("이 기기에는 저장했지만 회사 저장소에는 올리지 못했습니다. 연결을 확인하세요.") }) }
  if (a === "doc") { if (lastCheck(b)) show("doc") }
  if (a === "new") newEst(b);
  if (a === "draft") { save(); const cur = store.get("sido3_list", []).find(x => x.id === E.id);
    if (cur && !cur.draft && estSig(cur) === estSig(E)) toast("이미 저장되어 있습니다(저장한 뒤 고친 내용이 없습니다).");
    else { const ok = stashEst(true), up = stashEst.up; toast(ok ? "임시저장했습니다. ‘저장된 견적’에서 ‘이어 쓰기’를 누르면 쓰던 단계에서 다시 시작합니다." : "이 브라우저에는 더 저장할 수 없습니다. ‘견적 파일 내보내기’로 보관하세요.");
      if (up) up.then(r => { if (r && r.clash) toast(`이 기기에는 임시저장했습니다. 회사 저장소에는 ${whoSay(r.who)} ${fmtAt(r.at)}에 저장한 더 새 내용이 있어 올리지 않았습니다. 화면 위 ‘회사 저장소에 더 새 내용’을 눌러 확인하세요.`); else if (r === true) toast("임시저장했습니다. 회사 저장소에도 올렸습니다 — 다른 기기에서 로그인해 이어 쓸 수 있습니다."); else if (SRV && SRV.token && (r === false || r === null)) toast("이 기기에 임시저장했습니다. 회사 컴퓨터에 연결되면 저절로 회사 저장소에 올라갑니다.") }) }
    estBarUp() }
  if (a === "savedgo") show("saved");
  if (a === "backest") show(D.stepLines ? "check" : "est");
  if (a === "print") { const de = DOC_EDIT; if (de) DOC_EDIT = false; renderDoc(); if (!printFile()) window.print(); if (de) { DOC_EDIT = true; renderDoc() } }
  if (a === "nextver") { E.info.ver = (+E.info.ver || 1) + 1; renderDoc(); save(); toast(`v${E.info.ver}로 올렸습니다.`) }
  if (a === "export") snapshotPrices(), save(), download(`견적_${E.info.client || "고객"}_${kindTag()}v${E.info.ver}.json`, JSON.stringify(E, null, 1), "application/json");
  if (a === "copy") copyTsv();
  if (a === "pricepatch") { const pe = store.get("sido3_price_edits", {}), items = Object.entries(pe).map(([name, v]) => ({ name, set: +v > 0 ? { fixedPrice: +v, src: "확정" } : { fixedPrice: null } }));
    download("patch.json", JSON.stringify({ note: "관리자 견적 입력 화면에서 바꾼 기본 단가 " + new Date().toISOString().slice(0, 10), items }, null, 1), "application/json"); toast("patch.json 을 받았습니다. 견적프로그램 폴더의 tools 폴더에 넣고 ‘5_수정사항_반영하기.bat’을 실행하면 실장용에도 반영됩니다. (또는 Claude에게 ‘이 단가로 고정해줘’라고 하세요)") }
  if (a === "priceapply") { SRV.patchOpen = true; SRV.patchRes = null; SRV.patch = null; SRV.patchErr = ""; show("saved"); setTimeout(() => { const b = $("#patchBox"); if (b) { b.open = true; b.scrollIntoView({ block: "center" }) } }, 500) }   // (v70) ‘저장된 견적’의 ‘수정사항 반영’ 칸으로 간다
});
let DL_CAP = null;                                   // 게시 주소에서는 화면이 파일을 직접 내려받지 못한다 → 뷰어의 ‘내려받기’ 기능으로 저장한다 (받는 사람이 확인 창에서 허용)
if (window.claude && typeof window.claude.use === "function") window.claude.use("downloads").then(d => { DL_CAP = d || null }).catch(() => {});
function capSave(name, data, okMsg) { if (!DL_CAP) return false;
  DL_CAP.save({ filename: name, data }).then(() => toast(okMsg || "파일을 저장했습니다.")).catch(e => { const c = e && e.code; if (c === "declined") return; toast(c === "rate_limited" ? "저장 확인 창이 이미 떠 있습니다. 그 창에서 허용해 주세요." : "이 주소에서는 주인과 같은 조직으로 클로드에 로그인한 사람만 파일을 받을 수 있습니다. ‘엑셀용 복사’로 엑셀에 붙여 넣거나, 한 파일 판·바탕화면 바로가기로 열면 엑셀·PDF 저장이 됩니다.") });
  return true }
function printFile() {                                // 게시 주소: 인쇄 창을 띄울 수 없으므로, 견적서를 인쇄용 파일로 받아서 연 뒤 ‘PDF로 저장’
  let css = ""; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) css += r.cssText + "\n" } catch (e) { } }
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>견적서 ${esc(E.info.client || "")}</title><style>${css}\nbody{background:#fff!important;margin:0;padding:12px}.dbtn,.dadd,.docbar{display:none!important}@media print{body{padding:0!important}@page{margin:10mm;@top-left{content:""}@bottom-right{content:counter(page) " / " counter(pages);font-size:9px;color:#888}}}</style></head><body><main><section class="view" id="view-doc"><div id="docView">${$("#docView").innerHTML}</div></section></main><script>window.addEventListener("load",function(){setTimeout(function(){window.print()},400)})<\/script></body></html>`;
  return capSave(`견적서_${(E.info.client || "고객").replace(/[\\/:*?"<>|]/g, "")}_${kindTag()}v${E.info.ver}_인쇄용.html`, html, "인쇄용 파일을 저장했습니다. 그 파일을 열면 인쇄 창이 뜹니다. ‘PDF로 저장’을 고르세요.") }
function download(name, text, type) { if (capSave(name, text)) return; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500) }
async function copyTsv() {
  const rows = [["공정", "위치", "품명", "규격·비고", "구분", "수량", "단위", "단가", "금액"].join("\t")];
  for (const p of PROCS) for (const l of docRows(R.lines.filter(l => l.proc === p))) rows.push([PROC_LABEL[p], l.spaceName, docNm(l), custLine(l), l.kind, l.lump ? 1 : l.qty, l.lump ? "식" : l.unit, l.lump ? l.amt : l.price, l.amt].join("\t"));
  rows.push(["", "", "공사원가", "", "", "", "", "", R.sum].join("\t"), ["", "", "기업이윤", "", "", "", "", "", R.biz].join("\t"), ["", "", "공사비 합계(VAT 별도)", "", "", "", "", "", R.net].join("\t"), ["", "", "총 합계(VAT 포함)", "", "", "", "", "", R.total].join("\t"));
  if ((R.opt || []).length || (R.cmp || []).length) rows.push("", ["옵션 · 비교 견적 (위 합계에 포함되지 않음 · VAT 별도)"].join("\t"));
  for (const l of R.opt || []) rows.push([PROC_LABEL[l.proc] || l.proc, l.spaceName, "[옵션] " + l.name, l.film ? "" : l.note, l.kind, l.qty, l.unit, l.price, l.amt].join("\t"));
  if ((R.opt || []).length) rows.push(["", "", "옵션 합계", "", "", "", "", "", R.optSum].join("\t"));
  for (const c of R.cmp || []) rows.push(["", "", "[비교] " + aliasOf(c.label), `${aliasOf(c.from)} 대신 ${aliasOf(c.to)}`, "", "", "", c.diff, c.net].join("\t"));
  const t = rows.join("\n");
  try { await navigator.clipboard.writeText(t); toast("복사했습니다. 엑셀에 붙여넣으세요.") } catch (e) { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("복사했습니다.") } catch (_) { toast("복사하지 못했습니다.") } ta.remove() }
}

/* ---------- 상세견적서 (표지 · 집계표 · 내역서 · 특기사항) ---------- */
/* (v92) 불포함 목록의 가전 줄 — 사용자(2026-11-22): “가전 설치 및 연결 (식기세척기·인덕션 등) … 인덕션은 내용에 포함이 안되고 고객님이 직접 가져다 놓을 수도 있어 확인해”.
   설치·연결뿐 아니라 가전제품 자체가 견적에 없다는 것과 고객이 직접 준비할 수 있다는 것을 적는다. 견적에 쿡탑·가전 설치 줄을 넣었을 때는 ‘견적서에 적힌 것 외의’를 붙인다. (데이터 파일은 그대로 — 여기서 글만 바꾼다) */
function docExclude(doc) {
  const has = R.lines.some(l => /^(cooktop|appInst)$/.test(l.lid || "") && l.qty > 0) || R.lines.some(l => l.extra && l.qty > 0 && /인덕션|식기세척기|식세기|쿡탑/.test(String(l.name || "")));
  return ((doc || {}).exclude || []).map(x => /^가전 설치 및 연결/.test(x) ? (has ? "견적서에 적힌 것 외의 가전제품과 설치·연결 (식기세척기·인덕션 등 — 고객님이 직접 준비하실 수 있습니다)" : "가전제품과 설치·연결 (식기세척기·인덕션 등 — 고객님이 직접 준비하실 수 있습니다)") : x);
}
function addDays(d, n) { const x = new Date(d || Date.now()); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
var DOC_EDIT = false;
function docSet(key, f, v) {                           // 상세견적서에서 고친 값을 견적에 넣는다 (q 수량 · p 단가 · n 이름 · x 빼기 · r 원래대로)
  const x = (E.extras || []).find(e => e.id === key);
  if (x) { if (f === "q") x.qty = v === "" ? 0 : +v; else if (f === "p") x.price = v; else if (f === "n") x.name = v; else if (f === "u") x.unit = v; else if (f === "x") E.extras = E.extras.filter(e => e !== x) }
  else if (key.includes("#")) { E.lq = E.lq || {}; if (f === "q") { if (v === "") delete E.lq[key]; else E.lq[key] = +v } else if (f === "x") E.lq[key] = 0; else if (f === "r") delete E.lq[key] }
  else { const l = lineById(key.slice(3)); if (!l) return;
    if (f === "q") setLn(l, { q: v === "" ? undefined : +v }); else if (f === "p") setLn(l, { p: v === "" ? undefined : +v }); else if (f === "x") setLn(l, { on: false }); else if (f === "r") setLn(l, { q: undefined, p: undefined }) }
  const y = window.scrollY, a = document.activeElement, ds = a && a.dataset ? a.dataset : {}, k = ["dq", "dp", "dn", "du"].find(n => ds[n] !== undefined), sel = k ? `[data-${k}="${String(ds[k]).replace(/"/g, '\\"')}"]` : "";   // 다시 그려도 보던 자리와 입력 칸을 그대로 둔다
  refresh(); renderDoc(); window.scrollTo(0, y);
  if (sel && f !== "x" && f !== "r") { const el = document.querySelector("#docView " + sel); if (el) { el.focus({ preventScroll: true }); if (el.type !== "number") { const n = el.value.length; try { el.setSelectionRange(n, n) } catch (e) {} } } }
  toast(f === "q" ? "수량을 고쳤습니다. 금액에 반영됐습니다." : f === "p" ? "단가를 고쳤습니다. 금액에 반영됐습니다." : f === "x" ? "항목을 뺐습니다." : f === "r" ? "원래 수량·단가로 돌렸습니다." : "고쳤습니다.");
}
let DOC_T = 0;
document.addEventListener("input", ev0 => { const t = ev0.target; if (!t.closest || !t.closest("#docView")) return; const d = t.dataset; if (d.dq === undefined && d.dp === undefined) return;   // 숫자를 치다 잠깐 멈추면 반영한다 (엔터·칸 이동을 안 해도 된다)
  clearTimeout(DOC_T); DOC_T = setTimeout(() => { if (document.activeElement !== t || t.value === "" || t.value === t.dataset.v0) return; t.dataset.v0 = t.value; docSet(d.dq !== undefined ? d.dq : d.dp, d.dq !== undefined ? "q" : "p", t.value) }, 900) });
document.addEventListener("change", ev0 => { const t = ev0.target; if (!t.closest || !t.closest("#docView")) return; const d = t.dataset;
  if (d.dq !== undefined) docSet(d.dq, "q", t.value); else if (d.dp !== undefined) docSet(d.dp, "p", t.value); else if (d.dn !== undefined) docSet(d.dn, "n", t.value); else if (d.du !== undefined) docSet(d.du, "u", t.value) });
document.addEventListener("click", ev0 => { const t = ev0.target.closest && ev0.target.closest("[data-dx],[data-dr],[data-dadd],[data-act='docedit'],[data-act='print']"); if (!t) return;
  if (t.dataset.act === "print") { if (DOC_EDIT) { DOC_EDIT = false; renderDoc() } return }   // 인쇄할 때는 수정 칸을 감춘다
  if (t.dataset.act === "docedit") { DOC_EDIT = !DOC_EDIT; renderDoc(); return }
  if (t.dataset.dx !== undefined) docSet(t.dataset.dx, "x"); else if (t.dataset.dr !== undefined) docSet(t.dataset.dr, "r");
  else if (t.dataset.dadd !== undefined) { const p = (document.getElementById("dAddProc") || {}).value || PROCS[0]; E.extras = E.extras || []; E.extras.push({ id: "x" + Date.now(), space: "common", proc: p, name: "", unit: "식", qty: 1, price: "", note: "" }); refresh(); renderDoc(); toast("‘" + PROC_LABEL[p] + "’에 빈 항목을 넣었습니다. 이름·수량·단가를 적어 주세요.") } }, true);
const DETAIL_NOTE = { "1차 방수 (시멘트 액체방수)": "바닥 전체와 벽 아랫부분에 바르는 기본 방수", "도막방수 아덱스 WPM003": "1차 방수 위에 덧바르는 탄성 도막방수", "방수테이프 (모서리 보강)": "벽과 바닥이 만나는 모서리·배관 둘레 보강",
  "단열 작업": "확장부 바닥·벽 단열재 시공", "엑셀 난방배관 연장": "거실 난방 배관을 확장부까지 연장", "미장 작업": "난방 배관 위 바닥 미장 마감",
  "단열재 (아이소핑크 등)": "확장부 벽·천장에 붙임", "각재 틀·석고보드": "단열재 위 목공 틀과 석고보드 마감", "목수 시공": "단열재·틀·석고보드를 붙이는 인건비",
  "싱크대 (상부장·하부장)": "기본형 주방 가구", "4way 폭포수전": "물줄기를 바꿔 쓰는 주방 수전", "후드": "조리대 위 환기 장치",
  "초배지 (일반초배지320mm*320M)": "벽지 밑에 먼저 바르는 종이", "삼중지 150mm*100M": "이음매 보강 종이", "네바리/조인트테이프 (균열)": "균열·이음매 보강 테이프", "도배풀 14kg": "벽지를 붙이는 풀", "마법사 50mm*30M": "이음매 보강 테이프", "도배용 수성실리콘": "몰딩·걸레받이 틈 마감",
  "곰팡이·오염 제거": "칠하기 전 벽면 정리", "프라이머 (하도)": "접착을 돕는 밑칠", "탄성코트 도장 2회": "밑칠 위에 두 번 덧칠",
  "창틀·샷시 둘레 실리콘": "창틀과 벽이 만나는 둘레", "걸레받이·몰딩 마감 실리콘": "걸레받이·몰딩과 벽 사이 틈", "주방·욕실 마감 실리콘": "싱크대·세면대·욕조 둘레",
  "중문 프레임·문짝": "문틀 역할의 프레임과 문짝 한 세트", "유리": "문짝에 들어가는 유리", "레일·부속": "문이 움직이는 길과 롤러", "시공": "실측·설치",
  "붙박이장 몸통·문짝": "치수에 맞춰 제작", "신발장 몸통·문짝": "치수에 맞춰 제작", "냉장고장 몸통·문짝": "냉장고 크기에 맞춰 제작", "경첩·손잡이·부속": "문을 여닫는 철물", "경첩·부속": "문을 여닫는 철물", "설치": "배송·설치",
  "터닝도어 문짝·프레임": "발코니 출입문 한 세트", "타일 철거": "벽과 바닥 전체", "도기·수전·액세서리 철거": "변기·세면대·수건걸이 등 기존 설비", "천장재 철거": "기존 천장 판과 틀", "세대 방문 동의서 받기": "공사 전 이웃 세대 서명",
  "엘리베이터 보양판·골판지": "엘리베이터 내부 보호", "복도·현관 보양": "공용 복도와 현관 바닥 보호", "보양 비닐·마스킹테이프": "보양용 소모품",
  "ABS 기본 민자도어 (문짝 35T)": "무늬 없는 기본형 문짝", "ABS 문틀 (두께는 실측 후 확정)": "벽 두께에 맞춰 제작", "ABS 문틀 (욕실용 턱 있음)": "물 넘침을 막는 턱", "경첩": "문 1짝에 1조", "손잡이·실린더": "잠금 장치 포함", "문 설치비": "문을 달고 수평·간격 조정",
  "장판본드": "바닥재 접착", "프라이머": "바닥 접착력 보강", "실리콘": "틈새 마감" };
const detailNote = d => { const n = d.note || DETAIL_NOTE[d.name] || "", a = kbNorm(n), b = kbNorm(d.name); return a && (a === b || b.includes(a)) ? "" : n };   // 견적서에 ‘구성 내역’이라고만 쓰지 않고 무엇인지 적는다
function optDoc() {                                  // 상세견적서: 옵션 · 비교 견적 (총 공사금액에 넣지 않은 금액)
  const o = R.opt || [], c = R.cmp || []; if (!o.length && !c.length) return "";
  const unit = +D.settings.roundUnit || 10000, withAll = Math.floor((R.sum + R.optSum) * (1 + (+E.biz || 0) / 100) / unit) * unit, sg = d => (d > 0 ? "+" : "−") + won(Math.abs(d));
  return `<h2 style="margin-top:22px">비교견적 · 선택 공사 (별도)</h2><p class="note">아래 금액은 위 총 공사금액에 <b>포함되지 않았습니다.</b> 고르시면 그만큼 더해지거나 바뀝니다. (VAT 별도)</p>
    <table class="detail"><thead><tr><th>구분</th><th>품명</th><th>규격·비고</th><th class="r">수량</th><th>단위</th><th class="r">단가</th><th class="r">금액</th></tr></thead><tbody>`
    + o.map(l => `<tr><td>선택(별도)${l.spaceName && l.spaceName !== "공통공사" ? " · " + esc(l.spaceName) : ""}</td><td>${esc(docNm(l))}</td><td>${esc(l.film ? "" : custLine(l))}</td><td class="r">${l.lump ? 1 : l.qty}</td><td>${l.lump ? "식" : esc(l.unit)}</td><td class="r">${l.tbd ? "별도 협의" : won(l.lump ? l.amt : l.price)}</td><td class="r">${l.tbd ? "-" : won(l.amt)}</td></tr>`).join("")
    + (o.length ? `<tr class="ps"><td colspan="6" class="r">선택(별도) 합계</td><td class="r">${won(R.optSum)}</td></tr><tr class="ps"><td colspan="6" class="r">선택 공사를 모두 넣었을 때 공사비 합계</td><td class="r">${won(withAll)}</td></tr>` : "")
    + c.map(x => `<tr><td>비교</td><td>${esc(aliasOf(x.label))}</td><td>${esc(aliasOf(x.from))} 대신 ${esc(aliasOf(x.to))}</td><td></td><td></td><td class="r">${sg(x.diff)}</td><td class="r">${won(x.net)}</td></tr>`).join("")
    + (c.length ? `<tr class="ps"><td colspan="7" class="note" style="text-align:left">비교 줄: ‘단가’ 칸은 지금 견적과의 차이, ‘금액’ 칸은 그렇게 바꿨을 때의 공사비 합계입니다.</td></tr>` : "") + "</tbody></table>";
}
/* (v74) 견적서 머리글 — 사용자(2026-11-20): “예상 공사기간은 실장들이 체크할 수 있게 · 견적유효기간은 한달정도로 · 기업이윤 옆에 퍼센트 치수는 없애야 · 기업이윤에 뭐가 포함되어 있는지 고객이 납득할 수 있게”.
   E.info.dur = ""(자동 — weeks) · "4"(주) · 그 밖의 글(그대로 적힘) / E.info.validTo = 직접 정한 날(없으면 견적일에서 한 달). 고객 견적서·엑셀의 기업이윤에는 비율(%)을 적지 않고, 무엇이 들어 있는지 풀어 적는다. */
const DUR_PICK = [2, 3, 4, 5, 6, 7, 8, 10, 12];
const PROFIT_NOTE = { "설계 도서 검토": "공사 전에 도면과 현장을 맞춰 보고 공사 범위와 자재를 확정합니다", "공정 및 일정 관리": "공정 순서와 작업팀 일정을 잡고, 공사 진행 상황을 매일 알려 드립니다", "자재 및 시공 품질 관리": "자재 발주와 검수, 공정마다의 시공 상태 확인을 맡습니다",
  "작업자 및 현장 안전 관리": "작업자 안전과 현장 정리·보양 상태를 관리합니다", "최종 검수 및 하자 관리": "공사를 마친 뒤 검수하고, 하자 보수 기간 동안 책임지고 손봅니다" };
function durAuto() { try { return weeks(R) } catch (e) { return 0 } }
function durTxt() { const d = String((E.info || {}).dur ?? "").trim(); if (!d) return `약 ${durAuto()}주 (실측 후 확정)`; return /^\d+(\.\d+)?$/.test(d) ? `약 ${d}주 (실측 후 확정)` : d }
function addMonth(d, n) { const x = new Date(d || Date.now()); if (isNaN(x)) return addMonth("", n); const day = x.getUTCDate(); x.setUTCMonth(x.getUTCMonth() + (n || 1)); if (x.getUTCDate() !== day) x.setUTCDate(0); return x.toISOString().slice(0, 10) }   // 31일에서 한 달 뒤가 없으면 그 달 말일
function validTo() { const v = (E.info || {}).validTo; return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : addMonth((E.info || {}).date, 1) }
function profitItems() { return String((D.doc || {}).profitDesc || "").split("/").map(s => s.trim()).filter(Boolean).map(n => [n, PROFIT_NOTE[n] || ""]) }
function profitBox() { const ps = profitItems(); if (!ps.length) return "";
  return `<div class="box profitbox"><h3>기업이윤에 들어 있는 것</h3><p class="note" style="margin:0 0 6px">기업이윤은 공사를 처음부터 끝까지 책임지고 관리하는 데 드는 비용입니다. 자재비·인건비와 따로, 아래 일을 맡는 값입니다.</p><ul>${ps.map(([n, t]) => `<li><b>${esc(n)}</b>${t ? ` — ${esc(t)}` : ""}</li>`).join("")}</ul></div>` }
function docOptsDraw() {                              // 상세견적서 화면 위: 공사 기간 · 유효기간을 고르는 칸 (메모 칸 위)
  const dv = $("#docView"); if (!dv) return;          // (v83) 메모 칸은 견적서 뒤로 갔다 → 이 칸은 늘 견적서 바로 위에 둔다
  let box = $("#docOpts"); if (!box) { box = document.createElement("div"); box.id = "docOpts"; box.className = "card"; box.style.cssText = "max-width:900px;margin:0 auto 14px"; dv.parentNode.insertBefore(box, dv) }
  const d = String(E.info.dur ?? "").trim(), num = /^\d+(\.\d+)?$/.test(d), custom = !!d && !(num && DUR_PICK.includes(+d)), w = durAuto(), vt = validTo(), own = !!E.info.validTo && E.info.validTo !== addMonth(E.info.date, 1);
  const chip = (v, t) => `<button type="button" data-dur="${v}" aria-pressed="${v === "*" ? custom || docOptsDraw.open === true : !custom && !docOptsDraw.open && d === v}">${t}</button>`;
  const picks = [...new Set([...DUR_PICK, w].filter(n => n > 0))].sort((a, b) => a - b);   // (v86) 자동 계산은 ‘추천’으로만 — 기간은 실장이 골라서 정한다
  box.innerHTML = `<div class="bd" style="display:flex;flex-direction:column;gap:12px">
    <div><b>견적서 구분</b> <span class="note">견적서 오른쪽 위에 나갑니다 · 지금: <b>${esc(E.info.kind || "견적서")}</b>${E.info.kind === "가견적" ? " — ‘실측 전 가견적이며 확정 금액이 아닙니다’ 안내가 견적서에 함께 들어갑니다" : ""}</span>
      <div class="cmpch" style="margin-top:6px">${DOC_KINDS.map(k => `<button type="button" data-dkind="${k}" aria-pressed="${(E.info.kind || "견적서") === k}">${k}</button>`).join("")}</div></div>
    <div><b>예상 공사 기간</b> ${d ? `<span class="note">견적서 첫 장에 그대로 나갑니다 · 지금: <b>${esc(durTxt())}</b></span> <button type="button" class="btn ghost sm" data-dur="">↺ 정하지 않음으로</button>` : `<b style="color:var(--warn)">아직 정하지 않았습니다 — 아래에서 골라 주세요</b> <span class="note">고객에게 설명할 기간입니다 · 안 고르면 견적서에는 자동 계산 ‘약 ${w}주’로 나갑니다</span>`}
      <div class="cmpch" style="margin-top:6px">${picks.map(n => chip(String(n), n + "주" + (n === w ? " · 추천" : ""))).join("")}${chip("*", "직접 입력")}</div>
      ${custom || docOptsDraw.open ? `<input id="durIn" value="${esc(custom ? d : "")}" placeholder="예: 약 40일 · 12월 초 ~ 1월 중순 · 6.5" style="margin-top:6px;display:block;width:min(420px,100%)"><div class="note">숫자만 적으면 ‘약 ○주 (실측 후 확정)’, 글로 적으면 적은 그대로 나갑니다.</div>` : ""}</div>
    <div><b>견적 유효기간</b> <input type="date" id="validIn" value="${esc(vt)}" style="margin-left:6px;width:auto;display:inline-block;min-width:170px"> <span class="note">까지 · 기본은 견적일(${esc(E.info.date || "")})에서 한 달</span>${own ? ` <button type="button" class="btn ghost sm" data-validreset>↺ 한 달로</button>` : ""}</div>
    <div><b>견적서 메모</b> <span class="note">${E.memo ? "적어 둔 메모가 있습니다 · " : ""}견적서 맨 뒤 ‘특기사항’에 나갑니다. 적는 칸은 이 화면 맨 아래에 있습니다.</span> <button type="button" class="btn ghost sm" data-memogo>메모 적으러 가기 ↓</button></div>
    <div class="note">인쇄하면 견적서만 찍힙니다(이 칸 · 단추 · 인터넷 주소 · 날짜는 찍히지 않고, 쪽 번호만 오른쪽 아래에 작게 나옵니다).</div></div>`;
}
document.addEventListener("click", ev0 => { const g = ev0.target.closest && ev0.target.closest("[data-memogo]"); if (!g) return; const m = $("#memo"); if (!m) return; (m.closest(".card") || m).scrollIntoView({ block: "center", behavior: "smooth" }); setTimeout(() => { try { m.focus({ preventScroll: true }) } catch (e) { } }, 350) });
/* (v92) 견적서 구분 — 사용자(2026-11-22): “상세견적서 오른쪽에 가견적이 아니고 견적서라고 작성하게 만들어 이유는 전부 가견적으로 나가는게 아니야”.
   새 견적의 기본은 ‘견적서’. 실측 전 어림 견적일 때만 ‘가견적’을 고른다(그때만 ‘확정 금액이 아닙니다’ 안내가 들어간다). 전에 만든 견적은 그때 값 그대로 — 견적서 화면 맨 위에서 바로 바꾼다. */
function kindTag() { const k = (E.info || {}).kind || ""; return k === "견적서" ? "" : k }   // 파일 이름에 붙이는 구분 (‘견적서_고객_견적서v1’이 되지 않게)
document.addEventListener("click", ev0 => { const k = ev0.target.closest && ev0.target.closest("#docOpts [data-dkind]"); if (!k) return; E.info.kind = k.dataset.dkind; save(); renderDoc(); try { renderSummary() } catch (e) { } });
document.addEventListener("click", ev0 => { const t = ev0.target, b = t.closest && t.closest("#docOpts [data-dur]"), vr = t.closest && t.closest("#docOpts [data-validreset]"); if (!b && !vr) return;
  if (vr) { delete E.info.validTo; save(); renderDoc(); return }
  if (b.dataset.dur === "*") { docOptsDraw.open = true; docOptsDraw(); const i = $("#durIn"); if (i) i.focus(); return }
  docOptsDraw.open = false; if (b.dataset.dur) E.info.dur = b.dataset.dur; else delete E.info.dur; save(); renderDoc() });
document.addEventListener("input", ev0 => { const el = ev0.target; if (el.id !== "durIn") return; const v = el.value.trim(); if (v) E.info.dur = v; else delete E.info.dur; save(); renderDoc.keep = true; try { renderDoc() } finally { renderDoc.keep = false } });
document.addEventListener("change", ev0 => { const el = ev0.target; if (el.id !== "validIn") return; const v = el.value; if (/^\d{4}-\d{2}-\d{2}$/.test(v) && v !== addMonth(E.info.date, 1)) E.info.validTo = v; else delete E.info.validTo; save(); renderDoc() });
function renderDoc() {
  R = compute(); { const eb = document.querySelector("[data-act='docedit']"); if (eb) { eb.textContent = DOC_EDIT ? "수정 끝내기" : "견적서에서 수정"; eb.classList.toggle("primary", DOC_EDIT) } }
  const co = D.company || {}, doc = D.doc || {}, info = E.info;
  const spacesUsed = R.S.list.filter(s => s.type !== "공통" && (D.stepLines || R.bySpace[s.id])), nMeas = spacesUsed.filter(s => s.measured).length;
  const procRows = PROCS.filter(p => R.byProc[p]).map((p, i) => { const b = R.byProc[p]; return `<tr><td>${i + 1}</td><td>${PROC_LABEL[p]}</td><td class="r">${won((b["자재"] || 0) + (b["부자재"] || 0))}</td><td class="r">${won(b["노무"] || 0)}</td><td class="r">${won(b["경비"] || 0)}</td><td class="r"><b>${won(b.amt)}</b></td></tr>` }).join("");
  let detail = "";
  const KORD = ["자재", "부자재", "노무", "경비"], markNo = {};
  planMarks().forEach(m => { if (m.lid) (markNo[m.lid] = markNo[m.lid] || []).push(m.n) });
  for (const p of PROCS) {
    let ls = R.lines.filter(l => l.proc === p); if (!ls.length) continue; if (!DOC_EDIT) ls = docRows(ls);
    // 공정 안에서 자재 → 부자재 → 노무 → 경비 순으로 묶고 묶음마다 금액을 보여 준다
    const kinds = [...new Set(ls.map(l => l.kind))].sort((a, b) => (KORD.indexOf(a) + 9) % 9 - (KORD.indexOf(b) + 9) % 9);
    ls.sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind));
    const kh = kd => kinds.length > 1 ? `<tr class="kh"><td colspan="7">${esc(kd)}</td><td class="r">${won(ls.filter(l => l.kind === kd).reduce((a, l) => a + l.amt, 0))}</td></tr>` : "";
    detail += `<tr class="ph"><td colspan="8">${PROC_LABEL[p]}</td></tr>` + ls.map((l, i) => (i === 0 || ls[i - 1].kind !== l.kind ? kh(l.kind) : "") + `<tr><td>${DOC_EDIT ? `<button type="button" class="dbtn" data-dx="${esc(l.key)}" title="이 항목 빼기">✕</button>${!l.extra && (l.edited || (l.manualPrice !== undefined && l.manualPrice !== "" && !l.costInput)) ? `<button type="button" class="dbtn r" data-dr="${esc(l.key)}" title="원래 수량·단가로">↺</button>` : ""}` : ""}${esc(l.spaceName)}${markNo[l.lid] ? ` <span class="mk">도면 ${markNo[l.lid].join("·")}</span>` : ""}</td><td>${DOC_EDIT && l.extra && !(l.it) ? `<input class="dn" data-dn="${esc(l.key)}" value="${esc(l.name)}" placeholder="항목 이름">` : esc(docNm(l))}</td><td>${esc(custLine(l))}</td><td>${esc(l.kind)}</td>${DOC_EDIT ? `<td class="r"><input class="de" type="number" step="any" data-dq="${esc(l.key)}" value="${l.qty}"></td><td>${l.extra && !l.it ? `<input class="de u" data-du="${esc(l.key)}" value="${esc(l.unit)}">` : esc(l.unit)}</td><td class="r">${String(l.key).includes("#") || l.costInput ? (l.tbd ? "별도 협의" : won(l.price)) : `<input class="de" type="number" step="any" data-dp="${esc(l.key)}" value="${l.price || ""}" placeholder="단가">`}</td>` : `<td class="r">${l.lump ? 1 : l.qty}</td><td>${l.lump ? "식" : esc(l.unit)}</td><td class="r">${l.tbd ? "별도 협의" : won(l.lump ? l.amt : l.price)}</td>`}<td class="r">${l.tbd ? "-" : won(l.amt)}</td></tr>`
      + (l.detail || []).map(d => `<tr class="sub"><td></td><td>└ ${esc(d.name)}</td><td class="note">${esc(detailNote(d))}</td><td></td><td class="r">${d.qty}</td><td>${esc(d.unit)}</td><td class="r">포함</td><td class="r">-</td></tr>`).join("")).join("")
      + `<tr class="ps"><td colspan="7" class="r">${PROC_LABEL[p]} 소계</td><td class="r">${won(R.byProc[p].amt)}</td></tr>`;
  }
  if (DOC_EDIT) detail += `<tr class="dadd"><td colspan="8">빠진 항목 넣기 <select id="dAddProc">${PROCS.map(p => `<option value="${p}">${PROC_LABEL[p]}</option>`).join("")}</select> <button type="button" class="btn sm" data-dadd>+ 항목 추가</button> <span class="note">수량·단가를 고치면 바로 금액에 반영됩니다. ✕ 빼기 · ↺ 원래대로. 다 고친 뒤 위의 ‘저장’을 누르세요.</span></td></tr>`;
  const pay = (doc.payment || []).map(([n, r, w2]) => `<tr><td>${n}</td><td class="r">${r}%</td><td class="r">${won(R.total * r / 100)}</td><td>${w2}</td></tr>`).join("");
  const html = `
  <section class="page">
    <div class="dhead"><div><div class="dbrand">${esc(co.name || "시도디자인")}</div><div class="note">${esc(co.tel || "")} ${esc(co.addr || "")}</div></div><div class="dver">${esc(info.kind)} v${info.ver}<br><span class="note">${esc(info.date)}</span></div></div>
    <h1>견 적 서</h1>
    <table class="kv"><tr><th>고객명</th><td>${esc(info.client)}</td><th>현장</th><td>${esc(info.site)}</td></tr>
      <tr><th>평형</th><td>공급 ${E.py}평 (${R.S.supplyM2}㎡) · 전용 ${R.S.exclM2}㎡</td><th>구조</th><td>방 ${E.rooms} · 욕실 ${E.baths}${esc(bathDocTxt())} · 발코니 ${E.balconies}${+E.dress > 0 ? " · 드레스룸" : ""}${xspList().map(x => " · " + esc(x.name)).join("")}</td></tr>
      <tr><th>예상 공사 기간</th><td>${esc(durTxt())}</td><th>견적 유효기간</th><td>${validTo()}까지</td></tr>
      <tr><th>담당 실장</th><td>${esc(info.manager)}</td><th>기본 마감</th><td>${esc(["floor", "paper"].map(id => { const m = R.lines.find(y => y.lid === id); return m ? docNm(m) : "" }).filter(Boolean).join(" · ") || "-")}</td></tr></table>
    <div class="totalbox"><span>총 공사금액 (VAT 포함)</span><b>₩ ${won(R.total)}</b><span class="note">공사비 ${won(R.net)}원 + 부가세 ${won(R.vat)}원</span></div>
    ${info.kind === "가견적" ? `<p class="warnline">본 금액은 현장 실측 전 가견적이며 확정 금액이 아닙니다. 현장 실측 후 확정 견적을 드리며, 확정 견적 금액이 계약 금액이 됩니다.</p>` : ""}
    <h2>공간별 시공 면적</h2>
    <table><thead><tr><th>공간</th><th class="r">바닥 (㎡)</th><th class="r">벽·천장 (㎡)</th><th class="r">${D.stepLines ? "면적 기준" : "공사 금액"}</th></tr></thead><tbody>
      ${spacesUsed.map(s => `<tr><td>${esc(s.name)}</td><td class="r">${s.A}</td><td class="r">${s.WT ? s.WT + " (타일)" : s.W}</td><td class="r">${D.stepLines ? (s.measured ? "실측" : s.fit ? "도면에 그린 크기" : "평형 추정") : won((R.bySpace[s.id] || { amt: 0 }).amt)}</td></tr>`).join("")}
      ${D.stepLines ? "" : `<tr class="ps"><td>공통공사</td><td></td><td></td><td class="r">${won((R.bySpace.common || { amt: 0 }).amt)}</td></tr>`}</tbody></table>
    <p class="note">${nMeas && nMeas === spacesUsed.length ? "면적은 현장 실측 치수 기준입니다." : nMeas ? `${nMeas}개 공간은 실측 치수, 나머지는 평형 기준 추정치이며 실측 후 확정합니다.` : "면적은 평형 기준 추정치이며 실측 후 확정합니다."} 수량에는 시공에 필요한 여유분이 포함되어 있습니다.</p>
  </section>
  <section class="page">
    <h2>공정별 집계표</h2>
    <table><thead><tr><th>No</th><th>공정</th><th class="r">자재비</th><th class="r">노무비</th><th class="r">경비</th><th class="r">합계</th></tr></thead><tbody>${procRows}</tbody></table>
    <table class="sumt"><tr><th>공사원가</th><td class="r">${won(R.sum)}</td></tr><tr><th>기업이윤</th><td class="r">${won(R.biz)}</td></tr><tr><th>절사</th><td class="r">${won(R.cut)}</td></tr>
      <tr><th>공사비 합계</th><td class="r">${won(R.net)}</td></tr><tr><th>부가세 (10%)</th><td class="r">${won(R.vat)}</td></tr><tr class="big"><th>총 합계 (VAT 포함)</th><td class="r">₩ ${won(R.total)}</td></tr></table>
    ${profitBox()}
  </section>
  ${planDocPage()}
  <section class="page">
    <h2>상세 내역서</h2>
    <table class="detail"><thead><tr><th>위치</th><th>품명</th><th>규격·비고</th><th>구분</th><th class="r">수량</th><th>단위</th><th class="r">단가</th><th class="r">금액</th></tr></thead><tbody>${detail}</tbody></table>${optDoc()}
  </section>
  <section class="page">
    <h2>특기사항</h2>
    <div class="two"><div class="box"><h3>포함</h3><ul>${(doc.include || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="box"><h3>불포함 (별도)</h3><ul>${docExclude(doc).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
    <div class="box"><h3>계약 조건</h3><ul>${(doc.terms || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <h3>대금 지급 조건</h3>
    <table><thead><tr><th>구분</th><th class="r">비율</th><th class="r">금액 (VAT 포함)</th><th>지급 시점</th></tr></thead><tbody>${pay}</tbody></table>
    ${E.memo ? `<div class="box"><h3>메모</h3><p style="white-space:pre-wrap">${esc(E.memo)}</p></div>` : ""}
    <table class="sign"><tr><th>발주자</th><td>${esc(info.client)} (인)</td><th>시공사</th><td>${esc(co.name || "")} (인)</td></tr></table>
  </section>`;
  $("#docView").innerHTML = html;
  if ($("#memo") && $("#memo").value !== (E.memo || "")) $("#memo").value = E.memo || "";
  if (!renderDoc.keep) docOptsDraw();
}
$("#memo") && ($("#memo").oninput = ev0 => { E.memo = ev0.target.value; save(); clearTimeout(renderDoc.mt); renderDoc.mt = setTimeout(() => { renderDoc.keep = true; try { renderDoc() } finally { renderDoc.keep = false } }, 500) });   // (v74) 적는 대로 아래 견적서 ‘메모’ 칸에 보인다
(() => { const m = $("#memo"), card = m && m.closest(".card"), dv = $("#docView"); if (!card || !dv) return;   // (v83) 메모 적는 칸은 견적서 뒤(화면 맨 아래)로 — 메모가 나가는 마지막 장 ‘특기사항’ 바로 아래. 사용자: “메모할 수 있는 공간은 맨 앞에 있으면 안 되지”. 이 칸 자체는 인쇄되지 않는다
  card.id = "memoCard"; card.style.margin = "14px auto"; dv.parentNode.insertBefore(card, dv.nextSibling);
  const lab = m.closest("label"); if (lab && lab.firstChild && lab.firstChild.nodeType === 3) lab.firstChild.nodeValue = "견적서 메모 — 여기에 적으면 바로 위 견적서 마지막 장 ‘특기사항’의 메모에 나갑니다 (이 칸은 인쇄되지 않습니다)" })();
/* (v83) 인쇄: 어느 화면에서 인쇄(Ctrl+P)를 눌러도 지금 견적서가 찍히고, ‘PDF로 저장’할 때 파일 이름이 ‘견적서_고객_종류v판’이 된다(끝나면 창 제목을 되돌린다).
   크롬이 붙이는 날짜 · 창 제목 · 주소는 아래 인쇄 CSS 의 @page 여백 상자로 없앤다(위쪽 상자를 비워 두고 아래쪽에 쪽 번호만 — 크롬 131부터. 2026-11-21 크롬 157 로 PDF 를 뽑아 확인). */
const PRN = { t: null, de: false };
function printName() { const i = E.info || {}; return `견적서_${String(i.client || "고객").replace(/[\\/:*?"<>|]/g, "")}_${i.kind === "견적서" ? "" : i.kind || ""}v${i.ver || 1}` }
window.addEventListener("beforeprint", () => { try { if (PRN.t === null) { PRN.t = document.title; PRN.de = DOC_EDIT } DOC_EDIT = false; renderDoc(); document.title = printName() } catch (e) { } });
window.addEventListener("afterprint", () => { try { if (PRN.t !== null) { document.title = PRN.t; PRN.t = null; if (PRN.de) { DOC_EDIT = true; renderDoc() } } } catch (e) { } });

/* ---------- 도면: 공정마다 한 장씩 위치를 표시하고, 마지막에 모아 본다 ----------
   · 기본은 평형·방/욕실/발코니 수·실측 치수로 그리는 약식 도면. 실제 아파트 도면 사진을 올리면 그 위에 표시한다.
   · 공정별 도면에는 그 공정에서 체크한 공사가 들어가는 공간이 색으로 칠해지고, 도면을 눌러 번호 표시(E.marks)를 남긴다.
   · 한 장에 다 겹치면 복잡하므로 ‘공정별 작은 도면 여러 장 + 전체 번호 도면(공정 켜고 끄기)’으로 모아 보여 준다. */
const STEP_COLOR = { s1: "#8a6d3b", s2: "#2f7fb8", s3: "#c0392b", s4: "#b9770e", s5: "#c99700", s6: "#7d5ba6", s7: "#1f9e89", s8: "#a0522d", s9: "#5d8a3a", s10: "#c2185b", s11: "#455a64", s12: "#00838f" };
const CEIL_STEPS = ["s3", "s4", "s5"];              // 천장도로 보는 공정 (에어컨·천장·조명)
const LOC_TYPES = { "전체": ["거실", "주방", "방"], "욕실": ["욕실"], "주방": ["주방"], "거실": ["거실"], "방": ["방"], "현관": ["현관"], "발코니": ["발코니"], "확장부": ["발코니"] };
const PK = 56, PPAD = 12, MARK_SEL = {};
document.head.insertAdjacentHTML("beforeend", `<style>
.planrow{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(220px,1fr);gap:12px}@media (max-width:900px){.planrow{grid-template-columns:minmax(0,1fr)}}
.planwrap svg{width:100%;height:auto;display:block;background:#ffffff;border:1px solid var(--line);border-radius:8px}.planrow.fit{grid-template-columns:minmax(0,auto) minmax(230px,1fr)}@media (max-width:900px){.planrow.fit{grid-template-columns:minmax(0,1fr)}}
.less{border-top:1px dashed var(--line)!important}.less summary{font-weight:500!important;color:var(--muted)!important;font-size:12px!important}svg[data-plan]{cursor:crosshair}
.marks{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.marks li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:6px;align-items:center;font-size:13px}
.marks b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:99px;color:#fff;font-size:11px}
.plangrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}.plangrid figure{margin:0;border:1px solid var(--line);border-radius:8px;padding:6px;break-inside:avoid}
.plangrid figcaption,.layers button{font-size:12px;font-weight:700;display:flex;gap:6px;align-items:center}.plangrid figcaption{margin-bottom:4px}.plangrid i,.layers i{width:10px;height:10px;border-radius:99px;display:inline-block;flex:0 0 auto}
.layers{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.layers button{font-family:inherit;padding:3px 9px;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}.layers button[aria-pressed="false"]{opacity:.4}
.plantop{position:sticky;top:calc(env(safe-area-inset-top,0px) + 58px);z-index:6;background:var(--panel);border-bottom:2px solid var(--line);border-top:0!important;box-shadow:0 6px 10px -8px rgba(0,0,0,.35)}.plantop .bd{padding-top:0}.planside{max-height:46vh;overflow:auto}
.howto{font-size:12px;background:var(--soft);border-radius:8px;padding:6px 10px;margin-bottom:8px}.howto ol{margin:2px 0 0;padding-left:18px}
.inforow{display:grid;grid-template-columns:minmax(250px,330px) minmax(0,1fr);gap:18px;align-items:start}@media (max-width:1000px){.inforow{grid-template-columns:minmax(0,1fr)}}
.srow.mg{align-items:center}.srow.mg>span:first-child,.srow.mgh>span:first-child{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.srow .pa{min-width:82px;text-align:right}
.mgi{display:inline-flex;align-items:center;justify-content:flex-end;gap:2px;width:104px;flex:0 0 auto;font-size:13px;color:var(--muted);white-space:nowrap}
.srow.mgh{font-size:11px;padding-bottom:0}.srow.mgh .mgi{font-size:11px;padding-right:6px}
.mgi input{width:86px;height:21px;padding:1px 5px;border:1px solid var(--line);border-radius:6px;font:inherit;font-size:13px;font-variant-numeric:tabular-nums;text-align:right;background:transparent;color:var(--ink)}
.mgi input:focus{outline:2px solid var(--accent);outline-offset:0;background:var(--panel)}
.mgi.ov input{border-color:var(--accent);background:rgba(46,107,87,.12);font-weight:700}
.mgi.stale input{border-color:#c77700;background:rgba(199,119,0,.14)}
.mgi button{border:0;background:none;cursor:pointer;color:var(--accent);padding:0 1px;font-size:13px;line-height:1}
.mgi.sum{padding-right:6px;color:var(--ink);font-weight:700}
.srow.mgsum>b.pa{font-weight:700}
.mgbox{margin-top:8px;padding:7px 11px;border-radius:10px;background:rgba(46,107,87,.07);border:1px solid rgba(46,107,87,.22)}
.prochd{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin:16px 14px 2px;padding:8px 12px;border-left:5px solid var(--accent);background:var(--soft);border-radius:8px}
.prochd b{font-size:16px}.prochd .pa{margin-left:auto;font-variant-numeric:tabular-nums;font-size:14px}.prochd .pa small{color:var(--muted)}.prochd .note{flex-basis:100%;margin:0}
.plk{border:0;background:none;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-align:left;text-decoration:underline dotted;text-underline-offset:3px}
.plk:hover{color:var(--accent)}.srow.mgh .plk{color:var(--accent);font-weight:700;text-decoration:none;font-size:12px}
.pvsec{margin-bottom:16px}.pvh{display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--soft);border-left:5px solid var(--accent);border-radius:8px}.pvh b{font-size:15px}.pvamt{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.pvh .pa{min-width:90px;text-align:right;font-variant-numeric:tabular-nums}
.pvt{width:100%;border-collapse:collapse;font-size:13px;margin-top:2px;table-layout:fixed}.pvt td:nth-child(2){width:84px}.pvt td:nth-child(3){width:112px}.pvt td:nth-child(4){width:176px}.pvt td button{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pvt td{padding:4px 6px;border-bottom:1px solid var(--line)}.pvt td.r{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.pvt td:first-child{word-break:keep-all}
@media (max-width:560px){#procBox{padding:6px!important}.pvh{flex-wrap:wrap}.pvt{font-size:12px}.pvt td{padding:4px 3px}.pvt td:nth-child(2){width:52px}.pvt td:nth-child(3){width:78px}.pvt td:nth-child(4){width:104px}}
.mgq{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px;margin-bottom:5px}
.mgq>div{display:flex;flex-direction:column;min-width:0;line-height:1.25}
.mgq small{font-size:11px;color:var(--muted)}.mgq small i{font-style:normal;opacity:.85}
.mgq b{font-size:15px;font-variant-numeric:tabular-nums}
.mgq .gain{border-top:1px solid rgba(46,107,87,.25);padding-top:4px}
.mgq .gain b{font-size:17px;color:var(--accent)}.mgq .gain.neg b{color:#c0392b}
@media (min-width:1301px){body.mgon .est3.wiz{grid-template-columns:210px minmax(0,1fr) 336px}}
.srow.mg{padding-top:2px;padding-bottom:2px}
.cmpsum.empty{padding:5px 9px}
@media (min-width:1301px){.est3.wiz .sumslot{align-self:stretch}
.est3.wiz #summary{display:flex;flex-direction:column;max-height:calc(100vh - 78px - env(safe-area-inset-top,0px))}
.est3.wiz #summary>.hd{flex:0 0 auto}
.est3.wiz #summary>.bd{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding-bottom:0;scrollbar-width:thin}
.est3.wiz #summary>.bd>.toolbar{position:sticky;bottom:0;z-index:2;background:var(--panel);margin:10px -14px 0;padding:9px 104px 11px 14px;border-top:1px solid var(--line);border-radius:0 0 12px 12px}
body #helpFab{bottom:18px}}

.roomgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:8px 16px}
.roomgrid .rrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:7px 10px;border:1px solid var(--line);border-radius:10px}
.roomgrid .rrow>b{min-width:88px}
.roomgrid .rrow [data-roomout]{flex:1 1 150px;min-width:0;text-align:right}
.fields.f4{grid-template-columns:repeat(4,minmax(0,1fr))}.fields.f4 .wide{grid-column:span 2}@media (max-width:900px){.fields.f4{grid-template-columns:1fr 1fr}.fields.f4 .wide{grid-column:1/-1}}
.stepfoot{position:sticky;bottom:0;background:var(--panel);z-index:5;border-radius:0 0 12px 12px}
.pinbar{margin-top:8px;font-size:13px}.pinbar .layers button{opacity:1!important}.pinbar .layers{margin-top:6px}
.keys{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--muted);margin-bottom:6px}.keys span{display:inline-flex;align-items:center;gap:5px}.keys i{display:inline-block;width:14px;height:10px;border-radius:2px}.keys i.ln{height:4px;border-radius:2px}.keys i.dr{width:10px;height:10px;border:2px solid;border-radius:0 10px 0 0;background:none}
.wopt{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}.wopt .seg button{font-size:12px;padding:3px 8px}
.scope{font-size:13px;display:flex;flex-direction:column;gap:3px;margin-bottom:6px}.scope .ok{color:var(--ok)}.scope .no{color:var(--warn)}
.mis{font-size:12px;background:var(--warn-soft);color:var(--ink);border-radius:8px;padding:6px 10px;margin-bottom:6px}
.pmx th{font-size:11px;white-space:normal;text-align:center;vertical-align:bottom;line-height:1.25}.pmx th i{display:block;margin:0 auto 3px;width:10px;height:10px;border-radius:99px}.pmx td{text-align:center}.pmx th:first-child,.pmx td:first-child{text-align:left;white-space:nowrap}.pmx .x{color:#b3261e;font-weight:700}
.planall{padding:4px 14px 10px}.planall h3{font-size:13px;margin:8px 0 4px}
#docView .kh td{background:#f7f8f6;font-weight:700;font-size:12px;color:#444}#docView .mk{display:inline-block;font-size:10.5px;font-weight:700;color:#fff;background:#2d6a58;border-radius:99px;padding:0 6px;margin-left:2px}
#docView .plangrid figure{border-color:#b9beb8}#docView .plangrid .note{font-size:10.5px}
@media print{#docView .plangrid{grid-template-columns:repeat(3,1fr)}
html,body{background:#fff!important}body>*:not(main){display:none!important}#view-doc>*:not(#docView){display:none!important}
@page{margin:10mm;@top-left{content:""}@bottom-right{content:counter(page) " / " counter(pages);font-size:9px;color:#888}}}
</style>`);
const lineLabel = l => l.label || aliasOf(l.items[Math.min(lnState(l).alt || 0, l.items.length - 1)]);
const stepItems = step => ((D.stepLines || {})[step] || []).filter(l => lnState(l).on);
const stepLabel = step => ((D.steps || []).find(s => s.key === step) || {}).label || step;
const roomName = id => (R.S.list.find(s => s.id === id) || {}).name || "";
/* (v62) 위치 표시: 싱크대·분전함처럼 ‘어디에 있는지’만 도면에 찍어 두는 표시. 위치 메모(E.marks)에 step "pos" 로 같이 둔다 — 공정에 딸리지 않아 모든 도면에 보이고, 번호를 매기지 않으며(n = 0), 공사 줄(lid)이 없어 수량·금액을 바꾸지 않는다 */
const POS = "pos", POS_COLOR = "#12305f", POS_PRE = ["세면대", "변기", "세탁기", "건조기", "냉장고", "가스·인덕션", "식기세척기", "분전함", "보일러", "에어컨", "실외기", "급수", "배수", "콘센트", "스위치"];   // 자리만 찍는 것 (누르면 바로 저장)
/* 위치 표시는 세 가지 꼴이다: 점(x·y) · 선(line = [[x, y], …] — 배관·가벽·전선) · 모양(shape = [[[x, y], …], …] — 싱크대·붙박이장처럼 바닥을 차지하는 것. 11자 주방은 다각형 둘). 좌표는 전부 도면의 0~1 비율 */
const POS_BIG = { "싱크대": ["sink", 2.4, 0.6], "붙박이장": ["closet", 2.4, 0.6], "냉장고장·키큰장": ["fridge", 1, 0.7], "신발장": ["shoe", 1.2, 0.4], "아일랜드·식탁": ["island", 1.6, 0.9], "화장대": ["desk", 1.2, 0.5], "욕조": ["", 1.5, 0.7], "샤워부스": ["", 0.9, 0.9] };   // 모양으로 그리는 가구·설비: [가구 치수 목록(E.furn)의 줄 id, 기본 가로 m, 깊이 m]
const POS_ROOM = ["보조 주방", "다용도실", "팬트리", "알파룸", "창고", "실외기실", "테라스"], POS_ROOM_COL = "#00695c";   // 방 목록(방·욕실·발코니 수)에 없는 공간: 지금은 도면에 자리와 이름만 표시한다 (견적의 공간으로 넣지는 않는다 — 수량·금액 그대로)
for (const k of POS_ROOM) POS_BIG[k] = ["", 2, 1.5];
const POS_SHAPES = [["I", "일자"], ["L", "ㄱ자"], ["U", "ㄷ자"], ["11", "11자"], ["box", "네모"], ["free", "직접 그리기"]];
const LINE_PRE = [["급수 배관", "#1565c0"], ["배수 배관", "#00838f"], ["가스 배관", "#e08a00"], ["전선", "#c62828"], ["가벽", "#6a1b9a"], ["철거선", "#b3261e", 1], ["몰딩 라인", "#2e7d32"], ["단열 구간", "#6d4c41"]];   // 선 표시 이름: [이름, 색, 점선]
const markCol = m => m.only ? "#39423e" : m.step === POS ? m.col || POS_COLOR : STEP_COLOR[m.step] || "#333";
const segD = (ax, ay, bx, by, X, Y) => { const l2 = (bx - ax) ** 2 + (by - ay) ** 2, t = l2 ? Math.max(0, Math.min(1, ((X - ax) * (bx - ax) + (Y - ay) * (by - ay)) / l2)) : 0; return Math.hypot(ax + t * (bx - ax) - X, ay + t * (by - ay) - Y) };   // 점에서 선분까지의 거리
const posMarks = () => (E.marks || []).filter(m => m.step === POS && !!m.img === !!E.planImg);   // 지금 도면의 위치 표시 (점·선·모양)
const posPm = g => ltGeom(R.S).pm || g.vw / 12;      // 도면에서 1m 의 길이 (방 영역이 없어 잴 수 없으면 도면 폭을 12m 로 본다 — 가구 모양의 처음 크기를 정할 때만 쓴다)
const lineLen = m => { const G = ltGeom(R.S); return G.pm && m.line ? m.line.reduce((a, q, i) => i ? a + Math.hypot((q[0] - m.line[i - 1][0]) * G.vw, (q[1] - m.line[i - 1][1]) * G.vh) : 0, 0) / G.pm : 0 };   // 선의 대략 길이(m). 축척을 모르면 0
function shapeFit(ps, cx, cy) {                      // 모양을 (cx, cy) 가운데로 옮기고(안 주면 제자리) 도면 밖으로 나간 만큼 안으로 민다
  const all = ps.flat(), xs = all.map(q => q[0]), ys = all.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const dx = Math.min(1 - x1, Math.max(-x0, cx === undefined ? 0 : cx - (x0 + x1) / 2)), dy = Math.min(1 - y1, Math.max(-y0, cx === undefined ? 0 : cy - (y0 + y1) / 2));
  return ps.map(p => p.map(q => [rd4(q[0] + dx), rd4(q[1] + dy)]));
}
function shapeMake(kind, cx, cy, W, D, g) {          // 가구·설비의 바닥 모양을 만든다: 일자 · ㄱ자 · ㄷ자 · 11자(두 줄, 사이 1m) · 네모. W 가로 · D 깊이(m) → 도면 비율 좌표
  const pm = posPm(g), kx = pm / g.vw, ky = pm / g.vh, A = Math.max(2 * D + 0.3, Math.min(W, 1.8)), R4 = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const ps = kind === "L" ? [[[0, 0], [W, 0], [W, D], [D, D], [D, A], [0, A]]] : kind === "U" ? [[[0, 0], [W, 0], [W, A], [W - D, A], [W - D, D], [D, D], [D, A], [0, A]]] : kind === "11" ? [R4(0, 0, W, D), R4(0, D + 1, W, D)] : kind === "box" ? [R4(0, 0, Math.min(W, 1.6), Math.max(D, 0.9))] : [R4(0, 0, W, D)];
  return shapeFit(ps.map(p => p.map(q => [q[0] * kx, q[1] * ky])), cx, cy);
}
function shapeTurn(m, flip) {                        // 모양을 가운데를 축으로 90° 돌리거나 좌우로 뒤집는다 (화면의 가로세로 비율대로 — 돌려도 크기가 변하지 않는다)
  const g = planGeom(), all = m.shape.flat(), xs = all.map(q => q[0]), ys = all.map(q => q[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  m.shape = shapeFit(m.shape.map(p => p.map(q => flip ? [2 * cx - q[0], q[1]] : [cx - (q[1] - cy) * g.vh / g.vw, cy + (q[0] - cx) * g.vw / g.vh])));
}
const shapeDel = m => { const g = planGeom(), all = m.shape.flat(); return [Math.min(0.985, Math.max(...all.map(q => q[0])) + 22 / g.vw), Math.max(0.015, Math.min(...all.map(q => q[1])) - 22 / g.vh)] };   // 고른 모양을 지우는 ✕: 오른쪽 위 바깥
const markRoomSet = (m, fx, fy) => { const g = planGeom(), r = rectAt(g, fx * g.vw, fy * g.vh); if (r) { m.room = r.s.id; m.rk = r.k } else { delete m.room; delete m.rk } };   // 그 자리가 어느 방인지 적어 둔다 (목록에 ‘(주방)’으로 보인다)
const planMarks = () => { let n = 0; return (E.marks || []).map(m => ({ ...m, n: m.step === POS ? 0 : ++n })).filter(m => !!m.img === !!E.planImg) };
const planSteps = () => (D.steps || []).filter(st => stepItems(st.key).length || planMarks().some(m => m.step === st.key));
const INC_STEPS = ["s4", "s8", "s9"];                // 발코니 확장부를 넣을 수 있는 공정 (몰딩·벽, 바닥, 벽지)
const SURF_ID = { wallTile: "wall", wallTile2: "wall", wallTile3: "wall", floorTile2: "floor", floorTile3: "floor", kitTile: "wall", entWall: "wall", balWall: "wall", floorTile: "floor", entTile: "floor", balTile: "floor", balTile2: "floor", balWall2: "wall", waterproof: "floor", overlay: "floor", demoBath: "floor", demoKitchen: "item", filmDoor: "door", filmBath: "door", filmEntry: "item", sashFilm: "wall", sinkFilm: "item", closetFilm: "item" };
function surfOf(l, step) {                          // 이 줄이 도면의 어디에 들어가는지: floor 바닥 · wall 벽 · ceil 천장 · door 문 · item 개별 품목 · none 표시 안 함
  if (SURF_ID[l.id]) return SURF_ID[l.id]; const t = lineLabel(l);
  if (/작업비|인건비|부자재|식대|운반|쓰레기|신고|동의서|실측|설치비|안내문|예치금/.test(t)) return "none";
  if (step === "s6") return /중문|도어락|방화문|터닝/.test(t) ? "item" : "door";
  if (step === "s8") return "floor"; if (step === "s5") return "ceil"; if (step === "s2") return "wall";
  if (step === "s9") return /천장/.test(t) ? "ceil" : "wall";
  if (step === "s1") return /보호|철거|평탄/.test(t) ? "floor" : "item";
  if (step === "s3") return /에어컨/.test(t) ? "ceil" : /방수|수평|미장/.test(t) ? "floor" : "item";
  if (step === "s4") return /천장|우물|등박스|커튼/.test(t) ? "ceil" : /몰딩|걸레받이|벽|아트월|단열|아치/.test(t) ? "wall" : "item";
  if (step === "s10") return /문|필름|도장|페인트|탄성/.test(t) ? "wall" : "item";
  if (step === "s12") return /청소|새집/.test(t) ? "floor" : "item";
  return "item";
}
function stepSurf(step) {                           // {공간 id: {floor:[이름], wall:[...], ceil:[...], door:[...], item:[...]}}
  const out = {};
  for (const l of stepItems(step)) { const k = surfOf(l, step); if (k === "none") continue; const both = step === "s9" && k === "wall" && /paperM2|\bpy\b/.test(String(l.qty)) && !(E.noCeil || {})[step];
    for (const s of R.S.list) if ((l.loc === "방1" ? s.id === "room1" : (LOC_TYPES[l.loc] || []).includes(s.type)) && !(l.locIds && !l.locIds.includes(s.id)) && !(l.locNot && l.locNot.includes(s.id))) { const o = out[s.id] = out[s.id] || {}; /* locIds·locNot = 그 종류 가운데 어느 공간인지 (앞 발코니 / 뒷 발코니) */ (o[k] = o[k] || []).push(lineLabel(l)); if (step === "s10") o.film = true; if (both) (o.ceil = o.ceil || []).push("천장 도배") } }
  if (INC_STEPS.includes(step) && out.living) for (const s of R.S.list) if (s.type === "발코니") out[s.id] = ((E.inc || {})[step] || {})[s.id] ? { ...out.living, ext: true } : { opt: true };
  return out;
}
function stepRooms(step) {                          // 이 공정에서 체크한 공사가 들어가는 공간 {공간 id: [공사 이름]}
  const sf = stepSurf(step), out = {};
  for (const id in sf) out[id] = sf[id].opt ? ["발코니 확장부 (누르면 이 공정에 포함)"] : [].concat(sf[id].floor || [], sf[id].wall || [], sf[id].ceil || [], sf[id].door || [], sf[id].item || []);
  return out;
}
const cut7 = x => x.length > 7 ? x.slice(0, 7) + "…" : x;
function surfText(sf, narrow) {                             // 방 안에 적는 한 줄: 어느 면에 무엇이 들어가는지
  if (!sf) return ""; if (sf.opt) return "＋ 확장하면 누르기";
  const parts = [sf.floor && "바닥", sf.wall && "벽", sf.ceil && "천장", sf.door && (sf.film ? "문 필름" : "문 교체")].filter(Boolean), items = sf.item || [];
  return (sf.ext ? "확장부 · " : "") + "✓ " + parts.join("·") + (items.length ? (narrow ? (parts.length ? " 외" : `품목 ${items.length}`) : (parts.length ? " + " : "") + items.slice(0, 2).map(cut7).join("·") + (items.length > 2 ? ` 외 ${items.length - 2}` : "")) : "");
}
function stepLegend(step) {
  const by = {}; for (const l of stepItems(step)) { const k = l.loc || "공간과 상관없이 세는 항목"; (by[k] = by[k] || []).push(lineLabel(l)) }
  return Object.entries(by).map(([k, v]) => `<div class="note"><b>${esc(k)}</b> · ${esc(v.join(", "))}</div>`).join("");
}
/* 방 수에 따라 달라지는 아파트 평면 (가장 흔한 판상형 기준). 단위 m, 마지막에 전용면적에 맞춰 전체 크기를 맞춘다.
   남쪽 줄: 안방 · 거실 · (방) — 방 1~2개는 2베이, 3개는 평형에 따라 2·3베이, 4~5개는 4베이
   가운데 줄: 안방 욕실 · 복도 · 식당      북쪽 줄: 작은 방 · 공용 욕실 · 현관 · 주방      위아래: 발코니 */
function planLayout(S) {
  const sp = S.list, get = id => sp.find(s => s.id === id), cnt = t => sp.filter(s => s.type === t && !s.dress && !s.xsp).length, rooms = cnt("방"), baths = cnt("욕실"), bals = cnt("발코니"), py = +E.py || 0;
  const nS = rooms <= 2 ? 0 : rooms === 3 ? (py >= 28 ? 1 : 0) : 2, southRooms = [], northRooms = [];
  for (let i = 2; i <= rooms; i++) (southRooms.length < nS ? southRooms : northRooms).push("room" + i);
  // 화면에서 한눈에 들어오도록 가로로 넓게 그린다 (폭은 넉넉히, 깊이는 얕게)
  const hN = 2.8, hH = baths >= 2 ? 1.5 : 1.2, hS = 3.4, bS = 1.1, bN = 1.0, wR = 3.8, wB = 2.2, wM = 4.6, wN0 = 3.5, wB2 = 2.8;
  const w1 = baths >= 2 && northRooms.length ? 4.0 : wN0, wNR = northRooms.length ? w1 + (northRooms.length - 1) * wN0 : 0, nb = baths >= 3 ? 2 : baths >= 1 ? 1 : 0;
  const W = Math.max(wNR + nb * wB + wB + 4.2, wM + 5.8 + southRooms.length * wR), top = bals >= 2 ? bN : 0, yH = top + hN, yS = yH + hH, rects = [];
  const add = (id, k, x, y, w, h, o) => { const s = get(id); if (s) rects.push({ s, k, x, y, w, h, ...(o || {}) }) };
  let x = 0;
  northRooms.forEach((id, i) => { const w = i ? wN0 : w1; add(id, id, x, top, w, hN, { door: "S", dx: x + w - 0.65, win: "N" }); x += w });
  if (baths >= 1) { add("bath1", "bath1", x, top, wB, hN, { door: "S", dx: x + wB / 2, fx: "bath" }); x += wB }
  if (baths >= 3) { add("bath3", "bath3", x, top, wB, hN, { door: "S", dx: x + wB / 2, fx: "bath" }); x += wB }
  add("entry", "entry", x, top, wB, hN, { fx: "entry" }); x += wB;
  const xK = x; add("kitchen", "kitchen", xK, top, W - xK, hN, { fx: "kitchen", win: "N" });
  const xh = baths >= 2 ? wB2 : 0; if (baths >= 2) add("bath2", "bath2", 0, yH, wB2, hH, { door: "S", dx: wB2 / 2, fx: "bath" });
  add("living", "living#h", xh, yH, xK - xh, hH, { sub: true });                       // 복도 (거실과 트임)
  add("kitchen", "kitchen#d", xK, yH, W - xK, hH, { sub: true });                      // 식당 (주방·거실과 트임)
  const wD = get("dress1") ? 1.5 : 0; if (wD) add("dress1", "dress1", 0, yS, wD, hS, {});   // 드레스룸 (안방 옆)
  add("room1", "room1", wD, yS, wM - wD, hS, { door: "N", dx: wM - 0.7, win: "S" });
  const wL = W - wM - southRooms.length * wR; add("living", "living", wM, yS, wL, hS, { win: "S" });
  let xs = wM + wL; southRooms.forEach(id => { add(id, id, xs, yS, wR, hS, { door: "N", dx: xs + 0.75, win: "S" }); xs += wR });
  if (bals >= 1) add("bal1", "bal1", 0, yS + hS, W, bS, { fx: "bal" });
  // 뒤 발코니는 집 폭을 다 채운다 (도면에 빈 모서리가 생기지 않게). 3개면 작은 방 쪽과 주방 쪽으로 나눈다
  if (bals === 2) add("bal2", "bal2", 0, 0, W, bN, { fx: "bal" });
  if (bals >= 3) { add("bal3", "bal3", 0, 0, xK, bN, { fx: "bal" }); add("bal2", "bal2", xK, 0, W - xK, bN, { fx: "bal" }) }
  const nominal = rects.filter(r => r.s.type !== "발코니").reduce((a, r) => a + r.w * r.h, 0), k = Math.min(1.5, Math.max(0.75, Math.sqrt((S.exclM2 || nominal) / nominal)));
  for (const r of rects) { r.x *= k; r.y *= k; r.w *= k; r.h *= k; if (r.dx !== undefined) r.dx *= k }
  // (v63) 추가 공간: 집 오른쪽에 따로 세워 그린다 (약식 도면에서는 자리를 알 수 없다 — 올린 도면에서는 영역을 직접 그린다). 집 크기를 맞추는 계산(k)에는 넣지 않는다
  const xq = sp.filter(s => s.xsp), HH = (top + hN + hH + hS + (bals >= 1 ? bS : 0)) * k; let WW = W * k;
  if (xq.length) { const gap = 0.4 * k, cols = Math.ceil(xq.length / 4), per = Math.ceil(xq.length / cols), bw = 2.4 * k, bh = Math.min(2.4 * k, HH / per);
    xq.forEach((s, i) => rects.push({ s, k: s.id, x: WW + gap + Math.floor(i / per) * bw, y: (i % per) * bh, w: bw, h: bh }));
    WW += gap + cols * bw }
  return { W: WW, H: HH, rects, k };
}
/* 벽: 칸 테두리를 그리되, 트여 있는 사이(같은 공간끼리 · 거실↔주방 · 현관↔복도)는 비운다 */
function planWalls(L) {
  const segs = [], eps = 0.02, open = (a, b) => a.s.id === b.s.id || ["entry|living", "kitchen|living"].includes([a.s.id, b.s.id].sort().join("|"));
  for (const r of L.rects) for (const side of "NSEW") {
    const hor = side === "N" || side === "S", c = side === "N" ? r.y : side === "S" ? r.y + r.h : side === "W" ? r.x : r.x + r.w, a0 = hor ? r.x : r.y, a1 = hor ? r.x + r.w : r.y + r.h, cuts = [];
    for (const q of L.rects) {
      if (q === r || !open(r, q)) continue;
      const qc = side === "N" ? q.y + q.h : side === "S" ? q.y : side === "W" ? q.x + q.w : q.x; if (Math.abs(qc - c) > eps) continue;
      const b0 = Math.max(a0, hor ? q.x : q.y), b1 = Math.min(a1, hor ? q.x + q.w : q.y + q.h); if (b1 - b0 > eps) cuts.push([b0, b1]);
    }
    cuts.sort((p, q) => p[0] - q[0]); let p = a0;
    for (const [b0, b1] of cuts) { if (b0 - p > eps) segs.push(hor ? [p, c, b0, c] : [c, p, c, b0]); p = Math.max(p, b1) }
    if (a1 - p > eps) segs.push(hor ? [p, c, a1, c] : [c, p, c, a1]);
  }
  return segs;
}
function planGeom() {
  if (E.planImg) return { img: true, ...imgView(), L: hasBox() ? curLayout(R.S) : null };
  const L = planLayout(R.S); return { L, vw: L.W * PK + PPAD * 2, vh: L.H * PK + PPAD * 2 };
}
const SIDE_NAME = { N: "위쪽 벽", S: "아래쪽 벽", W: "왼쪽 벽", E: "오른쪽 벽" };
const markWhere = m => m.step === POS ? (roomName(m.room).replace(/ \(.*\)/, "") || "도면") : m.img && !m.room ? "도면 표시 위치" : `${roomName(m.room)}${m.side ? " " + SIDE_NAME[m.side] : " 전체"}`;
function markRect(m, g) { return g.L.rects.find(r => r.k === (m.rk || m.room)) || g.L.rects.find(r => r.s.id === m.room) }
const rectAt = (g, px, py) => g.L ? g.L.rects.find(r => { const x = PPAD + r.x * PK, y = PPAD + r.y * PK; return px >= x && px <= x + r.w * PK && py >= y && py <= y + r.h * PK && (!r.poly || polyIn(r.poly, (px - PPAD) / PK, (py - PPAD) / PK)) }) || null : null;   // 도면의 그 자리에 있는 방 칸 (점으로 그린 방은 감싸는 네모가 아니라 찍은 모양 안쪽일 때만 — 네모끼리 겹쳐도 옆방을 가로채지 않는다)
const hK = () => { try { return Math.min(2, Math.max(1, 560 / Math.min(800, window.innerWidth - 62))) } catch (e) { return 1 } };   // 손잡이 배율: 손잡이는 도면 좌표로 그리므로 휴대폰처럼 도면이 작게 보이는 화면에서는 같이 작아진다 → 좁은 화면에서는 2배까지 키운다 (넓은 화면은 그대로 1)
const xGlyph = (ex, ey, k = 1) => `<g${k === 1 ? "" : ` transform="translate(${ex.toFixed(1)} ${ey.toFixed(1)}) scale(${k.toFixed(2)}) translate(${(-ex).toFixed(1)} ${(-ey).toFixed(1)})"`}><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="13" fill="#ffffff" stroke="#b3261e" stroke-width="3"/><path d="M${(ex - 5).toFixed(1)} ${(ey - 5).toFixed(1)}l10 10M${(ex + 5).toFixed(1)} ${(ey - 5).toFixed(1)}l-10 10" stroke="#b3261e" stroke-width="3" stroke-linecap="round"/></g>`;   // 지우는 ✕ 손잡이
function posSvg(mk, g, o, c, fs) {                   // (v62) 선 표시 · 모양 표시를 그린다. 고치는 화면(선 표시 / 위치·가구 표시)에서는 손잡이도 — 누른 자리는 lineHit · shapeHit 이 화면 거리로 잰다
  const f = n => n.toFixed(1), pts = P => P.map(q => f(q[0]) + "," + f(q[1])).join(" "), S = p => p.map(q => [q[0] * g.vw, q[1] * g.vh]), nm = esc(mk.t || (mk.line ? "선" : "모양")), hk = hK();
  const tag = (x, y, t, at) => { const tw = fs * 1.3 + t.length * fs * 0.93; x = Math.min(g.vw - tw / 2 - 3, Math.max(tw / 2 + 3, x)); y = Math.min(g.vh - fs, Math.max(fs, y));   // 이름표: 바탕이 있는 알약 모양 — 방 이름이나 다른 선과 겹쳐도 읽힌다
    return `<g${at || ""}><rect x="${f(x - tw / 2)}" y="${f(y - fs * 0.8)}" width="${f(tw)}" height="${f(fs * 1.6)}" rx="${f(fs * 0.8)}" fill="${c}" stroke="#ffffff" stroke-width="1.5"/><text x="${f(x)}" y="${f(y + fs * 0.36)}" text-anchor="middle" font-size="${f(fs)}" font-weight="700" fill="#ffffff">${t}</text></g>` };
  if (mk.line) {
    const P = S(mk.line), len = o.m2 ? 0 : lineLen(mk), sw = Math.max(3.5, fs * 0.36); let run = P.reduce((a, q, i) => i ? a + Math.hypot(q[0] - P[i - 1][0], q[1] - P[i - 1][1]) : 0, 0) / 2, mx = P[0][0], my = P[0][1];
    for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (run <= d || i === P.length - 1) { const k = d ? Math.min(1, run / d) : 0; mx = P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k; my = P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k; break } run -= d }   // 이름표는 선 길이의 한가운데
    return `<g pointer-events="none"><polyline points="${pts(P)}" fill="none" stroke="#ffffff" stroke-width="${f(sw + 3)}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts(P)}" fill="none" stroke="${c}" stroke-width="${f(sw)}" stroke-linejoin="round" stroke-linecap="${mk.dash ? "butt" : "round"}"${mk.dash ? ` stroke-dasharray="${f(sw * 2.4)} ${f(sw * 1.6)}"` : ""}/>`
      + P.map(q => o.line ? `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(10 * hk)}" fill="#ffffff" stroke="${c}" stroke-width="4"/>` : `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(sw * 0.9)}" fill="${c}" stroke="#ffffff" stroke-width="1.5"/>`).join("")
      + tag(mx, my, nm + (len ? ` 약 ${len.toFixed(1)}m` : "")) + "</g>";
  }
  const PS = mk.shape.map(S), sel = !!o.pos && SH_SEL === mk.id, all = PS.flat(), mid = PS.length > 1 ? [(Math.min(...all.map(q => q[0])) + Math.max(...all.map(q => q[0]))) / 2, (Math.min(...all.map(q => q[1])) + Math.max(...all.map(q => q[1]))) / 2] : polyMid(PS[0]);   // 이름은 모양 안쪽에 (11자처럼 둘이면 그 사이에)
  let b = `<g data-sh="${mk.id}" pointer-events="none">` + PS.map((P, i) => `<polygon data-shp="${i}" points="${pts(P)}" fill="${c}" fill-opacity="${sel ? 0.32 : 0.22}" stroke="${sel ? "#e0672f" : c}" stroke-width="${sel ? 3.5 : 2.5}"${sel ? ' stroke-dasharray="10 6"' : ""} stroke-linejoin="round"/>`).join("") + tag(mid[0], mid[1], nm, " data-shl");
  if (sel) { const [dx, dy] = shapeDel(mk); b += "<g data-shh>" + all.map(q => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(11 * hk)}" fill="#ffffff" stroke="#e0672f" stroke-width="4"/>`).join("") + xGlyph(dx * g.vw, dy * g.vh, hk) + "</g>" }   // 고른 모양: 모서리 동그라미 = 크기·팔 길이 · ✕ = 지우기 (안쪽을 끌면 통째로 옮겨진다)
  return b + "</g>";
}
function sideSegs(r, sd, i) {                        // 그 방의 한쪽 벽을 긋는 선분들 (도면 좌표 · 안쪽으로 i 만큼 들여서). 점으로 그린 방은 그쪽을 보는 변마다 하나씩
  const X = v => PPAD + v * PK;
  if (!r.poly) { const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK; return [sd === "N" ? [x + i, y + i, x + w - i, y + i] : sd === "S" ? [x + i, y + h - i, x + w - i, y + h - i] : sd === "W" ? [x + i, y + i, x + i, y + h - i] : [x + w - i, y + i, x + w - i, y + h - i]] }
  const p = r.poly, cw = p.reduce((a, q, k) => { const n = p[(k + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1] }, 0) > 0 ? 1 : -1, out = [];
  p.forEach((a, k) => { if (r.es[k] !== sd) return; const b = p[(k + 1) % p.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]) * PK; if (len < 1) return;
    const ux = (b[0] - a[0]) * PK / len, uy = (b[1] - a[1]) * PK / len, nx = -uy * cw, ny = ux * cw, t = Math.min(i, len / 3);   // (nx, ny) = 방 안쪽을 보는 방향
    out.push([X(a[0]) + nx * i + ux * t, X(a[1]) + ny * i + uy * t, X(b[0]) + nx * i - ux * t, X(b[1]) + ny * i - uy * t]) });
  return out;
}
/* step: "base"(구조만) · 공정 key(그 공정만) · "all"(모든 표시, E.layerOff 로 끈 공정 제외) */
function planSvg(step, o = {}) {
  const g = planGeom(), one = !!STEP_COLOR[step], col = STEP_COLOR[step] || "#2d6a58", ceil = CEIL_STEPS.includes(step), hit = one ? stepRooms(step) : {}, off = E.layerOff || {}, f = n => n.toFixed(1);
  const X = v => PPAD + v * PK, wall = "#2f3834", skip = one ? ((E.skip || {})[step] || {}) : {}, surf = one ? stepSurf(step) : {};
  let body = "";
  if (g.img) {
    const sch = hasBox() && E.planView !== "pic" && !o.pin;      // 약식 도면 보기: 올린 도면은 흐리게 깔고, 지정한 방 칸을 깨끗한 선으로 그린다
    body = `<rect x="0" y="0" width="${g.vw}" height="${g.vh}" fill="#ffffff"/><image href="${E.planImg}" x="0" y="0" width="${g.vw}" height="${g.vh}"${sch ? ' opacity="0.16"' : ""}/>`;
    if (o.pin && PLAN_REG.src === E.planImg) for (const q of PLAN_REG.list) {   // 자동으로 찾은 방 칸 (아직 이름을 안 붙인 것)
      if (Object.values(E.planBox || {}).some(b => b.rid === q.id)) continue;
      body += `<rect x="${f(q.x * g.vw)}" y="${f(q.y * g.vh)}" width="${f(q.w * g.vw)}" height="${f(q.h * g.vh)}" fill="#2f7fb8" fill-opacity="0.12" stroke="#2f7fb8" stroke-width="2.5" stroke-dasharray="7 5" pointer-events="none"/>`;
    }
    const pins = E.planPins || {}, sw0 = one ? ((E.skipW || {})[step] || {}) : {}, rs = g.L ? g.L.rects : [];
    for (const r of rs) {                                          // 방 네모: 바닥·천장 공사는 면을 칠하고, 벽 공사는 벽마다 띠
      const id = r.s.id, hl = hit[id], sf = surf[id] || {}, out = hl && skip[id] && !sf.opt, fillOn = hl && !out && !!(sf.floor || sf.ceil), x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, act = one && hl && !sf.opt;
      const fa = `fill="${out ? "#6f766f" : fillOn ? col : "#ffffff"}" fill-opacity="${out ? 0.5 : fillOn ? 0.3 : sch ? 0.88 : 0}"`, la = `stroke="${sch ? "#2f3834" : act ? col : "#2d6a58"}" stroke-width="${sch ? 4 : act ? 2.5 : 1.5}"${sch || act ? "" : ' stroke-dasharray="7 5"'}`;
      if (r.poly) body += `<polygon points="${r.poly.map(q => f(X(q[0])) + "," + f(X(q[1]))).join(" ")}" ${fa} ${la} stroke-linejoin="round" pointer-events="none"/>`;   // (v62) 점으로 그린 방은 찍은 모양 그대로
      else { body += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${fa} stroke="none" pointer-events="none"/>`;
      for (const sd of SIDES) { if ((r.inner || {})[sd]) continue; const [x1, y1, x2, y2] = sd === "N" ? [x, y, x + w, y] : sd === "S" ? [x, y + h, x + w, y + h] : sd === "W" ? [x, y, x, y + h] : [x + w, y, x + w, y + h];
        body += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${la} stroke-linecap="square" pointer-events="none"/>` } }
      if (!act || out) continue; const w0 = sw0[id] || {}; if (!sf.wall && !Object.keys(w0).length) continue;
      const i = 7;
      for (const sd of SIDES) { if ((r.inner || {})[sd]) continue; const offW = w0[r.k + "|" + sd];
        for (const [x1, y1, x2, y2] of sideSegs(r, sd, i)) body += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${offW ? "#5f665f" : col}" stroke-width="${offW ? 4 : 8}" stroke-opacity="0.9"${offW ? ' stroke-dasharray="4 7"' : ""} stroke-linecap="round" pointer-events="none"/>` }
    }
    for (const s of R.S.list) {                                    // 이름표: 네모가 있으면 그 가운데(점으로 그린 방은 모양 안쪽), 없으면 찍어 둔 자리
      const r = rs.find(q => q.s.id === s.id), p = r ? (r.lc ? { x: X(r.lc[0]) / g.vw, y: X(r.lc[1]) / g.vh } : { x: (X(r.x) + r.w * PK / 2) / g.vw, y: (X(r.y) + r.h * PK / 2) / g.vh }) : pins[s.id]; if (!p) continue;
      const x = p.x * g.vw, y = p.y * g.vh, hl = hit[s.id], sf = surf[s.id] || {}, out = hl && skip[s.id] && !sf.opt, nm = s.name.replace(/ \(.*\)/, "").replace("·공용부", "").replace("·전실", "");
      const txt = !one ? (s.xsp && !(s.A > 0) ? nm : `${nm} ${o.m2 ? s.A + "㎡" : toPy(s.A) + "평"}`) : !hl ? nm : sf.opt ? `${nm} ＋확장` : out ? `${nm} ✕ 제외` : `${nm} ${surfText(sf, true)}`;
      const fs = r ? Math.max(11, Math.min(20, r.w * PK / (txt.length * 0.95 + 1.5))) : 21, tw = fs * 1.3 + txt.length * fs * 0.92, hh = fs * 1.7, on = one && hl && !out && !sf.opt, bg = on ? col : out ? "#8d948e" : "#ffffff", fg = on || out ? "#ffffff" : "#1c2320";
      body += `<g pointer-events="none"><rect x="${f(x - tw / 2)}" y="${f(y - hh / 2)}" width="${f(tw)}" height="${f(hh)}" rx="${f(hh / 2)}" fill="${bg}" fill-opacity="${on || out ? 0.95 : 0.9}" stroke="${one && hl ? col : "#39423e"}" stroke-width="2"${sf.opt ? ' stroke-dasharray="6 4"' : ""}/><text x="${f(x)}" y="${f(y + fs * 0.36)}" text-anchor="middle" font-size="${f(fs)}" font-weight="700" fill="${fg}">${esc(txt)}</text></g>`;
    }
    if (o.pin) {                                                   // (v60) 고른 방의 네모에 손잡이: 모서리 = 크기 바꾸기 · 가운데 = 자리 옮기기 · ✕ = 그 네모만 지우기. 누른 자리는 boxHit 이 화면 거리로 잰다(손가락으로도 잡히게)
      const sel = pinCur(), dr = polyDraft(), b0 = !dr && sel && (E.planBox || {})[sel], pts = q => q.map(v => f(v[0]) + "," + f(v[1])).join(" "), hk = hK();   // 점을 찍는 중에는 손잡이를 감춘다 (누르는 곳마다 점이 찍힌다) · hk = 좁은 화면에서 손잡이를 키우는 배율
      const big = (s, cx, cy) => hk === 1 ? s : `<g transform="translate(${f(cx)} ${f(cy)}) scale(${hk.toFixed(2)}) translate(${f(-cx)} ${f(-cy)})">${s}</g>`;
      const mvG = (cx, cy) => big(`<circle cx="${f(cx)}" cy="${f(cy)}" r="17" fill="#e0672f" stroke="#ffffff" stroke-width="2.5"/><path d="M${f(cx - 10)} ${f(cy)}H${f(cx + 10)}M${f(cx)} ${f(cy - 10)}V${f(cy + 10)}M${f(cx - 10)} ${f(cy)}l4 -4m-4 4l4 4M${f(cx + 10)} ${f(cy)}l-4 -4m4 4l-4 4M${f(cx)} ${f(cy - 10)}l-4 4m4 -4l4 4M${f(cx)} ${f(cy + 10)}l-4 -4m4 4l4 -4" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`, cx, cy);
      const delG = (ex, ey) => xGlyph(ex, ey, hk);
      if (b0 && b0.poly) {                                         // (v62) 점으로 그린 방: 점마다 동그라미(끌어서 옮기기 · 눌러서 고르기) · 변 가운데 작은 ＋(거기에 점 더하기) · 주황 손잡이(통째로 옮기기) · ✕(지우기)
        const P = b0.poly.map(q => [q[0] * g.vw, q[1] * g.vh]), [mx, my] = polyMv(b0), [dx, dy] = polyDel(b0), ps = PIN_PT && PIN_PT.id === sel ? PIN_PT.i : -1, eLen = i => { const n = P[(i + 1) % P.length]; return Math.hypot(n[0] - P[i][0], n[1] - P[i][1]) };
        body += `<g pointer-events="none"><polygon points="${pts(P)}" fill="#e0672f" fill-opacity="0.07" stroke="#e0672f" stroke-width="3.5" stroke-dasharray="10 6" stroke-linejoin="round"/>`
          + P.map((q, i) => { const n = P[(i + 1) % P.length], cx = (q[0] + n[0]) / 2, cy = (q[1] + n[1]) / 2; return eLen(i) < 60 ? "" : big(`<circle cx="${f(cx)}" cy="${f(cy)}" r="9" fill="#ffffff" stroke="#e0672f" stroke-width="2"/><path d="M${f(cx - 5)} ${f(cy)}h10M${f(cx)} ${f(cy - 5)}v10" stroke="#e0672f" stroke-width="2.4" stroke-linecap="round"/>`, cx, cy) }).join("")   // 변이 짧으면(둥근 모양의 촘촘한 점) ＋ 를 두지 않는다
          + P.map((q, i) => { const sm = i !== ps && eLen(i) < 60 && eLen((i + P.length - 1) % P.length) < 60; return `<circle data-ph="${i === ps ? "sel" : sm ? "sm" : "pt"}" cx="${f(q[0])}" cy="${f(q[1])}" r="${f((i === ps ? 14 : sm ? 7 : 12) * hk)}" fill="${i === ps ? "#e0672f" : "#ffffff"}" stroke="${i === ps ? "#ffffff" : "#e0672f"}" stroke-width="${sm ? 3 : 4}"/>` }).join("")
          + mvG(mx * g.vw, my * g.vh) + delG(dx * g.vw, dy * g.vh) + "</g>";
      }
      else if (b0) for (const q of boxParts(b0)) {
        const x = q.x * g.vw, y = q.y * g.vh, w = q.w * g.vw, h = q.h * g.vh, [mx, my] = boxMv(q), [dx, dy] = boxDel(q);
        body += `<g pointer-events="none"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#e0672f" fill-opacity="0.07" stroke="#e0672f" stroke-width="3.5" stroke-dasharray="10 6"/>`
          + [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([px, py]) => `<circle data-ph="pt" cx="${f(px)}" cy="${f(py)}" r="${f(12 * hk)}" fill="#ffffff" stroke="#e0672f" stroke-width="4"/>`).join("")
          + mvG(mx * g.vw, my * g.vh) + delG(dx * g.vw, dy * g.vh) + "</g>";
      }
      if (dr) {                                                    // (v62) 찍는 중인 모양: 찍은 점을 잇는 선 · 처음 찍은 점은 크게(다시 누르면 닫힌다) · 점선은 마우스를 따라간다(pointermove 가 고친다)
        const P = dr.pts.map(q => [q[0] * g.vw, q[1] * g.vh]), z = P[P.length - 1];
        body += `<g pointer-events="none">${P.length > 1 ? `<polyline points="${pts(P)}" fill="#2d6a58" fill-opacity="0.13" stroke="#2d6a58" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>` : ""}<line data-polyrb x1="${f(z[0])}" y1="${f(z[1])}" x2="${f(z[0])}" y2="${f(z[1])}" stroke="#2d6a58" stroke-width="2.5" stroke-dasharray="7 5"/>`
          + P.map((q, i) => i ? `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(9 * hk)}" fill="#ffffff" stroke="#2d6a58" stroke-width="4"/>` : `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f((P.length > 2 ? 15 : 11) * hk)}" fill="#2d6a58" stroke="#ffffff" stroke-width="3.5"/>`).join("") + "</g>";
      }
    }
  }
  else {
    const L = g.L, m = PK * L.k;                                   // m = 도면상 1m 의 길이
    for (const r of L.rects) {                                     // 칸 바탕 (공사 위치는 공정 색으로 칠함)
      const hl = hit[r.s.id], t = r.s.type, sf = surf[r.s.id] || {}, out = hl && skip[r.s.id] && !sf.opt, fillOn = hl && !!(sf.floor || sf.ceil);
      body += `<rect x="${f(X(r.x))}" y="${f(X(r.y))}" width="${f(r.w * PK)}" height="${f(r.h * PK)}" fill="${out ? "#aab0aa" : fillOn ? col : t === "욕실" ? "#e6eff3" : t === "발코니" ? "#eeeee8" : t === "현관" ? "#f3f0ea" : "#ffffff"}" fill-opacity="${out ? 0.45 : fillOn ? 0.3 : 1}"><title>${esc(r.s.name)}${out ? " — 이 공정에서 제외" : hl ? ": " + esc(hl.join(", ")) : ""}</title></rect>`;
    }
    if (!ceil) for (const r of L.rects) {                          // 가구·설비 기호
      const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, fxs = 'fill="#d5dad2" stroke="#8b948e" stroke-width="1" pointer-events="none"';
      if (r.fx === "bath") body += `<rect x="${f(x + 5)}" y="${f(y + 5)}" width="${f(0.7 * m)}" height="${f(0.45 * m)}" rx="3" ${fxs}/><ellipse cx="${f(x + w - 0.35 * m - 4)}" cy="${f(y + 0.4 * m + 4)}" rx="${f(0.22 * m)}" ry="${f(0.3 * m)}" ${fxs}/>`;
      if (r.fx === "kitchen") body += `<rect x="${f(x + 4)}" y="${f(y + 4)}" width="${f(w - 8)}" height="${f(0.6 * m)}" ${fxs}/><rect x="${f(x + w - 0.62 * m)}" y="${f(y + 4)}" width="${f(0.6 * m - 4)}" height="${f(Math.min(h - 8, 1.9 * m))}" ${fxs}/><rect x="${f(x + 0.5 * m)}" y="${f(y + 0.12 * m + 4)}" width="${f(0.7 * m)}" height="${f(0.36 * m)}" rx="3" fill="#fff" stroke="#8b948e" stroke-width="1" pointer-events="none"/><circle cx="${f(x + 1.8 * m)}" cy="${f(y + 0.3 * m + 4)}" r="${f(0.12 * m)}" fill="none" stroke="#8b948e" pointer-events="none"/><circle cx="${f(x + 2.15 * m)}" cy="${f(y + 0.3 * m + 4)}" r="${f(0.12 * m)}" fill="none" stroke="#8b948e" pointer-events="none"/>`;
      if (r.fx === "entry") body += `<rect x="${f(x + 4)}" y="${f(y + 0.9 * m)}" width="${f(0.38 * m)}" height="${f(h - 0.9 * m - 6)}" ${fxs}/>`;
    }
    for (const [x1, y1, x2, y2] of planWalls(L)) body += `<line x1="${f(X(x1))}" y1="${f(X(y1))}" x2="${f(X(x2))}" y2="${f(X(y2))}" stroke="${wall}" stroke-width="${ceil ? 2 : 4}" stroke-linecap="square"${ceil ? ' stroke-dasharray="8 5"' : ""} pointer-events="none"/>`;
    if (one) { const sw = (E.skipW || {})[step] || {};             // 벽 한 면씩: 하는 벽은 공정 색 띠, 뺀 벽은 회색 점선
      for (const r of L.rects) { if (!hit[r.s.id] || skip[r.s.id]) continue; const w0 = sw[r.s.id] || {}; if (!(surf[r.s.id] || {}).wall && !Object.keys(w0).length) continue;
        const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, i = 5;
        for (const sd of SIDES) { const offW = w0[r.k + "|" + sd], [x1, y1, x2, y2] = sd === "N" ? [x + i, y + i, x + w - i, y + i] : sd === "S" ? [x + i, y + h - i, x + w - i, y + h - i] : sd === "W" ? [x + i, y + i, x + i, y + h - i] : [x + w - i, y + i, x + w - i, y + h - i];
          body += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${offW ? "#8d948e" : col}" stroke-width="${offW ? 3 : 6}" stroke-opacity="${offW ? 0.9 : 0.9}"${offW ? ' stroke-dasharray="3 5"' : ""} stroke-linecap="round" pointer-events="none"/>` } } }
    if (!ceil) for (const r of L.rects) {                          // 창 · 문
      const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK;
      if (r.win) { const yy = r.win === "N" ? y : y + h; body += `<line x1="${f(x + w * 0.2)}" y1="${f(yy)}" x2="${f(x + w * 0.8)}" y2="${f(yy)}" stroke="#ffffff" stroke-width="6" pointer-events="none"/><line x1="${f(x + w * 0.2)}" y1="${f(yy)}" x2="${f(x + w * 0.8)}" y2="${f(yy)}" stroke="#4a9fd8" stroke-width="2.5" pointer-events="none"/>` }
      if (r.door) { const dOn = one && (surf[r.s.id] || {}).door && !skip[r.s.id], dw = 0.8 * m, cx = X(r.dx), yy = r.door === "N" ? y : y + h, dir = r.door === "N" ? 1 : -1, x0 = cx - dw / 2;   // 문: 벽을 끊고 열리는 방향을 호로 그림
        body += `<line x1="${f(x0)}" y1="${f(yy)}" x2="${f(x0 + dw)}" y2="${f(yy)}" stroke="#ffffff" stroke-width="6" pointer-events="none"/><path d="M${f(x0)} ${f(yy)} L${f(x0)} ${f(yy + dir * dw)} A${f(dw)} ${f(dw)} 0 0 ${dir > 0 ? 0 : 1} ${f(x0 + dw)} ${f(yy)}" fill="${dOn ? col : "none"}" fill-opacity="0.35" stroke="${dOn ? col : "#7d8781"}" stroke-width="${dOn ? 3 : 1.2}" pointer-events="none"/>` }
      if (r.fx === "entry") { const dw = 0.9 * m, x0 = x + w / 2 - dw / 2; body += `<line x1="${f(x0)}" y1="${f(y)}" x2="${f(x0 + dw)}" y2="${f(y)}" stroke="#ffffff" stroke-width="6" pointer-events="none"/><path d="M${f(x0)} ${f(y)} L${f(x0)} ${f(y + dw)} A${f(dw)} ${f(dw)} 0 0 0 ${f(x0 + dw)} ${f(y)}" fill="none" stroke="#7d8781" stroke-width="1.2" pointer-events="none"/>` }
    }
    for (const r of L.rects) {                                     // 이름 · 면적
      if (r.sub) continue; const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, fs = Math.min(13 * planFsK(), Math.max(8.5, w / 5), Math.max(8.5, h / 4.6)), nm = r.s.type === "발코니" ? r.s.name : r.s.name.replace(/ \(.*\)/, "").replace("·공용부", "").replace("·전실", "");
      body += `<text x="${f(x + w / 2)}" y="${f(y + h / 2 + (r.fx === "kitchen" ? 0.35 * m : 0))}" text-anchor="middle" font-size="${f(fs)}" font-weight="700" fill="#1c2320" pointer-events="none">${esc(nm)}</text>`
        + (r.s.type === "발코니" ? "" : `<text x="${f(x + w / 2)}" y="${f(y + h / 2 + fs + 1 + (r.fx === "kitchen" ? 0.35 * m : 0))}" text-anchor="middle" font-size="${f(Math.max(7.5, fs - 2.5))}" fill="#5c6661" pointer-events="none">${r.s.xsp && !(r.s.A > 0) ? (o.m2 ? "" : "넓이 미입력") : (o.m2 ? r.s.A + "㎡" : toPy(r.s.A) + "평") + (r.s.measured ? " 실측" : "")}</text>`)
        + (hit[r.s.id] ? `<text x="${f(x + w / 2)}" y="${f(y + h / 2 - fs - 1)}" text-anchor="middle" font-size="${f(Math.max(8, fs - 1.5))}" font-weight="700" fill="${surf[r.s.id] && surf[r.s.id].opt ? "#7d8781" : skip[r.s.id] ? "#b3261e" : col}" pointer-events="none">${surf[r.s.id] && surf[r.s.id].opt ? surfText(surf[r.s.id]) : skip[r.s.id] ? "✕ 제외" : esc(surfText(surf[r.s.id], w < 150) || "✓")}</text>` : "")
        + (() => { const wn = hit[r.s.id] && !skip[r.s.id] && !(surf[r.s.id] && surf[r.s.id].opt) && step !== "base" && step !== "all" ? stepWorkNames(step, r.s, w, fs) : "";   // 챗봇이 체크한 공사 이름이 견적 도면에도 같은 이름으로 보인다
            return wn ? `<text x="${f(x + w / 2)}" y="${f(y + h / 2 + fs + 2 + (r.s.type === "발코니" ? 0 : Math.max(7.5, fs - 2.5) + 2) + (r.fx === "kitchen" ? 0.35 * m : 0))}" text-anchor="middle" font-size="${f(Math.max(7.5, fs - 2.5))}" font-weight="700" fill="${col}" pointer-events="none">${esc(wn)}</text>` : "" })();
    }
  }
  const posOn = !o.pin && (o.m2 ? !!E.posDoc && !one : !one || !!o.edit);   // (v62) 위치 표시(싱크대·분전함 자리 등)를 그리는 도면: 현장 정보 · 공정마다의 큰 도면 · 모아 보기. 방 영역을 고치는 중과 작은 공정별 도면에는 안 그리고, 고객 견적서에는 ‘고객 견적서에도 넣기’를 켰을 때만
  for (const mk of planMarks()) {                                  // 위치 메모: 벽 한 면이면 그 벽에 굵은 선, 아니면 방 안에 이름표
    const pos = mk.step === POS; if (pos ? !posOn : step === "base" || (one ? mk.step !== step : off[mk.step])) continue; if (o.m2 && mk.only) continue;   // 치수만 적은 메모는 고객용 도면에 그리지 않는다
    const c = markCol(mk), full = pos && !mk.only ? mk.t : mk.t + (mk.memo ? " · " + mk.memo : "") + (!o.m2 && mk.dim ? (mk.only ? " " : " · ") + mk.dim : ""), label = `${pos ? "" : mk.n + " "}${full.length > 20 ? full.slice(0, 20) + "…" : full}`, fs = Math.max(8, g.vw / 44 * (+E.markScale || 0.75)) * Math.min(4, Math.max(0.4, +mk.sc || 1)) * (pos ? 1.15 * (o.m2 ? 1 : Math.sqrt(hK())) : 1), tw = fs * 1.5 + label.length * fs * 0.93;   // 위치 표시의 이름표에는 이름만 (메모·크기는 도면 아래 목록에) · 좁은 화면에서는 조금 더 크게
    if (mk.line || mk.shape) { body += posSvg(mk, g, o, c, fs); continue }
    let px, py, ax, ay;
    if (g.img) { px = mk.x * g.vw; py = mk.y * g.vh;
      const r = mk.side && g.L && markRect(mk, g);                 // 네모가 있는 방의 벽을 찍었으면 그 벽에 굵은 선
      if (r) for (const [x1, y1, x2, y2] of sideSegs(r, mk.side, 7)) body += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="9" stroke-linecap="round" pointer-events="none"/>` }
    else {
      const r = markRect(mk, g); if (!r) continue; const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, i = 6;
      if (mk.side) {
        const [x1, y1, x2, y2] = mk.side === "N" ? [x + i, y + i, x + w - i, y + i] : mk.side === "S" ? [x + i, y + h - i, x + w - i, y + h - i] : mk.side === "W" ? [x + i, y + i, x + i, y + h - i] : [x + w - i, y + i, x + w - i, y + h - i];
        body += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="7" stroke-linecap="round" pointer-events="none"/>`;
        ax = (x1 + x2) / 2; ay = (y1 + y2) / 2;
        px = (x1 + x2) / 2 + (mk.side === "W" ? tw / 2 + 6 : mk.side === "E" ? -tw / 2 - 6 : 0); py = (y1 + y2) / 2 + (mk.side === "N" ? 14 : mk.side === "S" ? -14 : 0);
      } else { px = x + (mk.rx ?? 0.5) * w; py = y + (mk.ry ?? 0.5) * h }
    }
    if (ax === undefined) { ax = px; ay = py }
    if (mk.lx !== undefined) { px = mk.lx * g.vw; py = mk.ly * g.vh }   // 끌어서 옮긴 자리
    else if (pos) py = ay + (ay < fs * 3.2 ? 1.9 : -1.9) * fs;          // 위치 표시: 찍은 자리에는 점을 두고 이름표는 그 위에 띄운다 (정확한 자리가 이름표에 가려지지 않게)
    px = Math.min(g.vw - tw / 2 - 3, Math.max(tw / 2 + 3, px)); py = Math.min(g.vh - fs, Math.max(fs, py));   // 이름표가 도면 밖으로 나가지 않게
    const ed = pos ? !!o.pos : o.edit && !o.m2;                  // 실장 화면: 이름표를 끌어 옮기고, 오른쪽 아래 점을 끌어 크기 조절 (위치 표시는 현장 정보의 ‘위치 표시’에서만 — 공정 도면에서는 눌러도 그 공정의 조작이 그대로 된다)
    const dot = `<line x1="${f(ax)}" y1="${f(ay)}" x2="${f(px)}" y2="${f(py)}" stroke="${c}" stroke-width="${pos ? 2.5 : 2}" pointer-events="none"/><circle cx="${f(ax)}" cy="${f(ay)}" r="${f(Math.max(3, fs * (pos ? 0.42 : 0.3)))}" fill="${c}" stroke="#fff" stroke-width="${pos ? 2 : 1.5}" pointer-events="none"/>`;
    body += (!pos && mk.lx !== undefined && Math.hypot(px - ax, py - ay) > fs * 1.6 ? dot : "")
      + `<g ${ed ? `data-mk="${mk.id}" style="cursor:move;touch-action:none"` : 'pointer-events="none"'}>${pos && ed ? `<rect x="${f(px - tw / 2 - fs * 0.9)}" y="${f(py - fs * 1.75)}" width="${f(tw + fs * 1.8)}" height="${f(fs * 3.5)}" fill="transparent"/><circle cx="${f(ax)}" cy="${f(ay)}" r="${f(fs * 1.3)}" fill="transparent"/>` : ""}${pos ? dot : ""}<rect x="${f(px - tw / 2)}" y="${f(py - fs * 0.85)}" width="${f(tw)}" height="${f(fs * 1.7)}" rx="${f(fs * 0.85)}" fill="${c}" stroke="#fff" stroke-width="2"/><text x="${f(px)}" y="${f(py + fs * 0.36)}" text-anchor="middle" font-size="${f(fs)}" font-weight="700" fill="#fff" pointer-events="none">${esc(label)}</text>${ed ? `<circle data-mkz="1" cx="${f(px + tw / 2 - fs * 0.2)}" cy="${f(py + fs * 0.75)}" r="${f(Math.max(5, fs * 0.45))}" fill="#fff" stroke="${c}" stroke-width="2" style="cursor:nwse-resize"/>` : ""}</g>`;
  }
  if (o.line && lineDraft()) {                                     // (v62) 긋는 중인 선 (또는 직접 그리는 모양): 찍은 점을 잇고, 점선은 마우스를 따라간다
    const dr = lineDraft(), P = dr.pts.map(q => [q[0] * g.vw, q[1] * g.vh]), z = P[P.length - 1], big = P.length > 2;   // (v68) 선도 점이 셋을 넘으면 처음 점을 크게 — 다시 누르면 모양이 닫힌다
    body += `<g pointer-events="none">${P.length > 1 ? `<polyline points="${P.map(q => f(q[0]) + "," + f(q[1])).join(" ")}" fill="${dr.close ? POS_COLOR : "none"}" fill-opacity="0.13" stroke="${POS_COLOR}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>` : ""}<line data-polyrb x1="${f(z[0])}" y1="${f(z[1])}" x2="${f(z[0])}" y2="${f(z[1])}" stroke="${POS_COLOR}" stroke-width="2.5" stroke-dasharray="7 5"/>`
      + P.map((q, i) => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f((!i && big ? 15 : 9) * hK())}" fill="${!i && (dr.close || big) ? POS_COLOR : "#ffffff"}" stroke="${!i && (dr.close || big) ? "#ffffff" : POS_COLOR}" stroke-width="4"/>`).join("") + "</g>";
  }
  if (!o.m2 && g.L && E.wallLen) {                                 // 벽 실측 길이 (실장 화면에만. 고객 견적서 도면에는 그리지 않는다)
    const fs = Math.max(6.5, g.vw / 88 * ((+E.markScale || 0.75) / 0.75));   // 벽 치수 글자는 방 이름보다 작게 (크면 도면을 가린다)
    for (const r of g.L.rects) for (const sd of SIDES) { const v = +E.wallLen[r.k + "|" + sd]; if (!(v > 0)) continue;
      const x = X(r.x), y = X(r.y), w = r.w * PK, h = r.h * PK, tx = sd === "W" ? x + fs * 1.9 : sd === "E" ? x + w - fs * 1.9 : x + w / 2, ty = sd === "N" ? y + fs * 1.5 : sd === "S" ? y + h - fs * 0.8 : y + h / 2 + (sd === "W" ? -fs : fs);
      body += `<text x="${f(tx)}" y="${f(ty)}" text-anchor="middle" font-size="${f(fs)}" font-weight="700" fill="#0b3d91" stroke="#ffffff" stroke-width="${f(fs / 4)}" paint-order="stroke" pointer-events="none">${v.toLocaleString("ko-KR")}</text>` }
  }
  if (step === "s5") body += ltSvg(g, o);
  const ar = (g.vw / g.vh).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(g.vw)} ${Math.round(g.vh)}"${o.edit ? ` data-plan="${step}" style="width:calc(${o.vh || 36}vh*${ar});max-width:100%;aspect-ratio:${ar}"` : ""} ${o.pin ? ' data-planpin="1" style="cursor:crosshair;touch-action:none;user-select:none"' : o.dim ? ' data-plandim="1" style="cursor:pointer"' : o.pos ? ` data-plan="${POS}" style="touch-action:none;user-select:none"` : o.line ? ' data-planline="1" style="cursor:crosshair;touch-action:none;user-select:none"' : ""} role="img" aria-label="${one ? esc(stepLabel(step)) + " " : ""}도면">${ceil && !g.img ? `<text x="${PPAD}" y="9" font-size="8" fill="#888">천장도 (위에서 내려다본 천장)</text>` : ""}${body}</svg>`;
}
function marksList(ms, del) {
  return ms.length ? `<ul class="marks">${ms.map(m => `<li><b style="background:${m.step === POS ? markCol(m) : STEP_COLOR[m.step] || "#333"}">${m.n || (m.line ? "━" : m.shape ? "■" : "●")}</b><span>${esc(m.t)}${m.line && lineLen(m) ? ` <small class="note">약 ${lineLen(m).toFixed(1)}m</small>` : ""}${m.memo ? " — " + esc(m.memo) : ""}${m.dim ? ` <b style="background:none;color:var(--ink);width:auto;height:auto;display:inline;font-size:12px">[${esc(m.dim)}]</b>` : ""}${m.line || (m.img && !(m.step === POS && m.room)) ? "" : ` <small class="note">(${esc(markWhere(m))})</small>`}</span>${del ? (m.step === POS ? `<span class="mbt"><button type="button" class="btn ghost sm" data-markedit="${m.id}">고치기</button><button type="button" class="btn ghost sm" data-markdel="${m.id}">삭제</button></span>` : `<button type="button" class="btn ghost sm" data-markdel="${m.id}">삭제</button>`) : "<span></span>"}</li>`).join("")}</ul>` : "";
}
let PIN_SEL = null, PIN_ADD = false, BASE_MODE = "", ZONE_TOOL = "rect", POLY_DRAFT = null, PIN_PT = null, LINE_DRAFT = null, SH_SEL = null;   // (v62) ZONE_TOOL 방 영역을 그리는 방법(rect 네모 · poly 점 찍기 · round 둥근 모양) · POLY_DRAFT 찍는 중인 점들 { src 도면, pts, t 마지막으로 찍은 때 } · PIN_PT 고른 점 { id 방, i 몇째 } · LINE_DRAFT 긋는 중인 선 { src, pts, t, close 직접 그리는 모양의 이름 } · SH_SEL 고른 모양 표시의 id
const baseMode = () => BASE_MODE === "pos" || BASE_MODE === "line" ? BASE_MODE : E.planImg && !hasBox() ? "zone" : BASE_MODE === "zone" && !E.planImg ? "dim" : (BASE_MODE || "dim");   // 방 영역이 아직 없으면 영역부터 (위치·선 표시는 영역이 없어도 된다 · 도면 그림을 지운 뒤에는 영역 그리기가 없다)
const baseOpts = () => ({ pin: !!E.planImg && baseMode() === "zone", dim: baseMode() === "dim", pos: baseMode() === "pos", line: baseMode() === "line" });
const polyDraft = () => ZONE_TOOL === "poly" && POLY_DRAFT && POLY_DRAFT.src === E.planImg && POLY_DRAFT.pts.length ? POLY_DRAFT : null;   // 찍는 중인 점들 (도면이 바뀌었으면 버린다)
const lineDraft = () => LINE_DRAFT && LINE_DRAFT.src === (E.planImg || "") && LINE_DRAFT.pts.length ? LINE_DRAFT : null;                  // 긋는 중인 선
const freeDraw = () => BASE_MODE === "line" && LINE_DRAFT && LINE_DRAFT.src === (E.planImg || "") && LINE_DRAFT.close || null;          // 직접 그리는 중인 모양의 이름·메모 (‘위치·가구 표시’에서 ‘직접 그리기’를 골라 넘어온 상태)
function posBar(md) {                                // (v62) 현장 정보 도면 아래 ‘위치·가구 표시’와 ‘선 표시’: 싱크대·붙박이장·분전함의 자리와 모양, 배관·가벽·전선이 지나는 길을 도면에 남긴다 (수량·금액과는 상관없다)
  const ms = planMarks().filter(m => m.step === POS), dr = lineDraft(), cl = freeDraw(), np = dr ? dr.pts.length : 0, sel = md === "pos" && ms.find(m => m.shape && m.id === SH_SEL), onSt = "background:var(--accent);color:var(--accent-ink);border-color:var(--accent)";
  const how = md === "line" ? (cl ? `<b>‘${esc(cl.t)}’ 모양 직접 그리기:</b> 도면에서 그 모양의 모서리를 <b>차례로 누르세요.</b> 처음 찍은 점을 다시 누르면 모양이 닫힙니다.` : "<b>선 표시:</b> 배관·가벽·전선이 지나는 길을 긋습니다 (표시만 남고 방 크기·금액은 바뀌지 않습니다 — <b>방 크기는 ‘" + (E.planImg ? "벽 치수 넣기" : "방 크기 바꾸기") + "’를 누른 뒤 도면에서 방을 눌러</b> 바꿉니다). 시작점에서 끝점까지 <b>끌거나</b>, 꺾이는 곳마다 <b>차례로 누른 뒤</b> 끝점을 한 번 더 누르세요. <b>방 모양을 그리려면</b> 모서리를 차례로 누른 뒤 <b>처음 찍은 점(큰 동그라미)을 다시 누르면</b> 모양이 닫히고, 그 모양이 <b>어느 방인지 고르는 창</b>이 뜹니다. 그어 둔 선은 <b>끝점을 끌어</b> 고치고, <b>선을 누르면</b> 이름을 바꾸거나 지웁니다.")
    : "<b>위치·가구 표시:</b> 도면에서 <b>그 자리를 누르면</b> 작은 창이 뜹니다. 분전함·콘센트는 이름만 누르면 점으로 찍히고, 싱크대·붙박이장은 <b>모양(일자·ㄱ자·ㄷ자…)</b>을 고르면 그 크기로 놓입니다. 놓은 것은 <b>끌어서 옮기고</b>, 모양은 한 번 눌러 고른 뒤 <b>모서리 동그라미</b>로 크기를 맞춥니다.";
  return `<div class="pinbar"><span class="note">${how} <b>수량·금액은 바뀌지 않습니다.</b> ${E.posDoc ? "지금은 고객 견적서의 ‘위치 메모’ 도면에도 나옵니다." : "고객 견적서에는 나오지 않습니다."} 잘못 눌렀으면 <b>Ctrl+Z</b>.</span>
    ${md === "line" && (dr || cl) ? `<div class="layers">${np ? `<button type="button" data-linedone style="${np > (cl ? 2 : 1) ? onSt : "opacity:.5!important"}">${cl ? "모양 닫기" : "선 끝내기"} (Enter)</button><button type="button" data-lineback>방금 찍은 점 지우기</button>` : ""}<button type="button" data-linecancel style="color:var(--warn)">그리기 취소 (Esc)</button><span class="note" style="align-self:center">점 ${np}개${cl && np < 3 ? " · 3개부터 모양이 됩니다" : !cl && np < 2 ? " · 끝점을 누르세요" : !cl && np > 2 ? " · 처음 점(큰 동그라미)을 누르면 방 모양으로 닫힙니다" : ""}</span></div>` : ""}
    ${sel ? `<div class="layers"><span class="note" style="align-self:center"><b>‘${esc(sel.t)}’</b> 고름</span><button type="button" data-shturn>↻ 90° 돌리기</button><button type="button" data-shflip>⇄ 좌우 뒤집기</button><button type="button" data-markedit="${sel.id}">이름·메모·크기</button><button type="button" data-markdel="${sel.id}" style="color:var(--warn)">이 모양 지우기</button></div>` : ""}
    ${marksList(ms, true)}
    <div class="layers"><span class="note" style="align-self:center">도면 글자</span><button type="button" data-mscale="-1">작게</button><button type="button" data-mscale="1">크게</button><button type="button" data-posdoc aria-pressed="${!!E.posDoc}" style="${E.posDoc ? onSt : ""}">고객 견적서 도면에도 넣기${E.posDoc ? " 켜짐" : ""}</button>${ms.length > 1 ? `<button type="button" data-markclear="${POS}" style="color:var(--warn)">위치·선 표시 ${ms.length}개 모두 지우기</button>` : ""}</div></div>`;
}
function baseBar() {                                 // 현장 정보 도면 아래 한 줄: 벽 치수 넣기 / (올린 도면이면) 방 영역 고치기 — 네모·점·둥근 모양 / 위치·가구 표시 / 선 표시. 지금 하는 것 하나만 진하게
  const md = baseMode(), n = Object.keys(E.wallLen || {}).length, on = 'style="background:var(--accent);color:var(--accent-ink);border-color:var(--accent)"', ps = planMarks().filter(m => m.step === POS), nLn = ps.filter(m => m.line).length, nPos = ps.length - nLn;
  const fd = freeDraw(), bt = (m, lb, tool) => { const a = fd ? m === "pos" : md === m && (!tool || ZONE_TOOL === tool); return `<button type="button" data-basemode="${m}"${tool ? ` data-ztool="${tool}"` : ""} aria-pressed="${a}" ${a ? on : ""}>${lb}</button>` };
  return `<div class="layers bmode" style="margin-top:8px">${bt("dim", E.planImg ? "벽 치수 넣기" : "방 크기 바꾸기")}${E.planImg ? `<span class="note" style="align-self:center;margin-left:4px">방 영역 고치기</span>${bt("zone", "네모 그리기", "rect")}${bt("zone", "점 찍어 그리기", "poly")}${bt("zone", "둥근 모양", "round")}<span class="note" style="align-self:center;margin-left:4px">표시</span>` : ""}${bt("pos", `위치·가구 표시${nPos ? ` · ${nPos}곳` : ""}`)}${bt("line", `선 표시${nLn ? ` · ${nLn}줄` : ""}`)}</div>
    ${md !== "zone" && E.planFit ? fitBar() : ""}
    ${md === "zone" ? pinBar() : md === "pos" || md === "line" ? posBar(md) : `<div class="pinbar"><b>${E.planImg ? "벽 실측 치수" : "방 크기 바꾸기"}</b> <span class="note">${E.planImg ? "<b>도면에서 방 가운데를 누르면</b> 그 방의 가로·세로(mm)를 넣는 창이 뜹니다. <b>벽을 누르면</b> 그 벽 길이만 넣습니다." : "<b>도면에서 방을 누르면</b> 그 방의 가로·세로(mm)를 넣는 창이 뜹니다 (아래 ‘방 크기’ 칸과 같은 값입니다)."} 넣은 치수로 그 방의 바닥·벽·둘레가 실측값이 되어 <b>바닥·도배·몰딩·걸레받이 등의 수량과 금액이 자동으로</b> 바뀝니다. 한쪽 벽만 넣어도 나머지는 도면 비율로 계산합니다. 치수는 고객 견적서에 나오지 않습니다.${n ? ` · 지금 ${n}면 입력됨` : ""}</span>
      <div class="layers"><span class="note" style="align-self:center">도면 글자</span><button type="button" data-mscale="-1">작게</button><button type="button" data-mscale="1">크게</button>${n ? '<button type="button" data-lenclear style="color:var(--warn)">벽 치수 모두 지우기</button>' : ""}</div></div>`}`;
}
function applyWallLens(id) {                         // 벽 치수 → 그 방의 실측표(E.dim). 네모 하나면 가로×세로, ㄱ자 방이면 면적+둘레
  const rs = curLayout(R.S).rects.filter(r => r.s.id === id), wl = E.wallLen || {}, mm = (r, sd) => +wl[r.k + "|" + sd] > 0 ? +wl[r.k + "|" + sd] / 1000 : 0, r2 = v => Math.round(v * 100) / 100;
  if (!rs.length) return; E.dim = E.dim || {};
  const sc = []; for (const r of rs) for (const sd of SIDES) { const v = mm(r, sd); if (v) sc.push(v / (sd === "N" || sd === "S" ? r.w : r.h)) }
  if (!sc.length) { delete E.dim[id]; return }
  const k = sc.reduce((a, b) => a + b, 0) / sc.length, avg = (a, b) => a && b ? (a + b) / 2 : a || b, wd = r => [avg(mm(r, "N"), mm(r, "S")) || r.w * k, avg(mm(r, "W"), mm(r, "E")) || r.h * k];   // 안 잰 벽은 도면 비율로
  if (rs.length === 1 && rs[0].poly) { const r = rs[0], [w, d] = wd(r), kx = w / r.w, ky = d / r.h;   // (v62) 점으로 그린 방: 잰 치수(감싸는 네모의 가로·세로)로 축척을 정하고, 면적·둘레는 찍은 모양대로
    E.dim[id] = { a: r2(r.pa * kx * ky), p: r2(r.poly.reduce((t, q, i) => { const n = r.poly[(i + 1) % r.poly.length]; return t + Math.hypot((n[0] - q[0]) * kx, (n[1] - q[1]) * ky) }, 0)) }; return }
  if (rs.length === 1) { const [w, d] = wd(rs[0]); E.dim[id] = { w: r2(w), d: r2(d) }; return }
  let a = 0, p = 0, hasIn = rs.some(r => r.inner);
  for (const r of rs) { const [w, d] = wd(r); a += w * d; for (const sd of SIDES) if (!(r.inner || {})[sd]) p += sd === "N" || sd === "S" ? w : d }
  E.dim[id] = hasIn ? { a: r2(a), p: r2(p) } : { a: r2(a) };
}
let LEN_DRAFT = null;
const closeLenPop = () => { const p = document.getElementById("lenPop"); if (p) p.remove(); LEN_DRAFT = null };
function openLenPop(r, side, cx, cy) {
  closeLenPop(); closeMarkPop(); LEN_DRAFT = { r, side }; const wl = E.wallLen || {}, v = sd => wl[r.k + "|" + sd] ?? "", nm = r.s.name.replace(/ \(.*\)/, ""), bd = E.planImg ? null : ((E.dim || {})[r.s.id] || {});   // bd = 기본 도면이면 그 방에 넣어 둔 가로·세로
  const left = Math.max(8, Math.min(cx + 14, innerWidth - 316)), top = Math.max(8, Math.min(cy + 14, innerHeight - 230)), inp = (id, ph, val) => `<input id="${id}" type="number" min="0" step="10" inputmode="numeric" placeholder="${ph}" value="${esc(val)}" style="width:120px;padding:7px 9px;border:1px solid var(--line);border-radius:8px;font:inherit">`;
  document.body.insertAdjacentHTML("beforeend", `<div id="lenPop" class="card" style="position:fixed;left:${left}px;top:${top}px;z-index:80;width:300px;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.3)">
    <div style="font-weight:700;margin-bottom:6px">${esc(nm)} ${side ? SIDE_NAME[side] + " 길이" : r.poly ? "가장 넓은 곳의 가로 × 세로" : "가로 × 세로"} <span class="note">mm</span></div>
    ${side ? inp("lpA", "예: 3400", v(side)) : `<div style="display:flex;gap:6px;align-items:center">${inp("lpA", "가로 3400", bd ? (bd.w ? Math.round(bd.w * 1000) : "") : v("N") || v("S"))}<span>×</span>${inp("lpB", "세로 4200", bd ? (bd.d ? Math.round(bd.d * 1000) : "") : v("W") || v("E"))}</div>`}
    <div class="note" style="margin-top:6px">비우고 저장하면 그 치수를 지웁니다.</div>
    <div class="toolbar" style="margin-top:8px"><button type="button" class="btn primary sm" data-lpsave>저장 (Enter)</button><button type="button" class="btn sm" data-lpcancel>취소</button></div></div>`);
  $("#lpA").focus(); $("#lpA").select();
}
function lenPopSave() {
  const d = LEN_DRAFT; if (!d) return;
  if (!E.planImg && !d.side) {                          // (v88) 기본 도면: 넣은 가로 × 세로가 그대로 그 방의 크기다 (‘방 크기’ 칸과 같은 값 E.dim[id].w/d)
    const a = +$("#lpA").value || 0, b2 = +$("#lpB").value || 0, id = d.r.s.id, nm = d.r.s.name.replace(/ \(.*\)/, "");
    if ((a > 0) !== (b2 > 0)) { toast("가로와 세로를 둘 다 넣어 주세요. (둘 다 비우면 자동으로 돌아갑니다)"); return }
    E.dim = E.dim || {}; const m = E.dim[id] = E.dim[id] || {}; for (const k of Object.keys(E.wallLen || {})) if (k.split("|")[0].split("#")[0] === id) delete E.wallLen[k];
    for (const f of ["w", "d", "a", "p"]) delete m[f]; if (a > 0) { m.w = a / 1000; m.d = b2 / 1000 } if (!Object.keys(m).length) delete E.dim[id];
    closeLenPop(); refresh(true); const s = R.S.list.find(x => x.id === id); toast(a > 0 ? `${nm}: ${a} × ${b2}mm = ${s ? s.A : ""}㎡ 로 계산합니다. 관련 공정 수량이 바뀌었습니다. (Ctrl+Z 되돌리기)` : `${nm}: 평형 기준 자동 크기로 되돌렸습니다.`); return }
  E.wallLen = E.wallLen || {}; const put = (sd, val) => { const k = d.r.k + "|" + sd; if (+val > 0) E.wallLen[k] = +val; else delete E.wallLen[k] };
  if (d.side) put(d.side, $("#lpA").value); else { put("N", $("#lpA").value); delete E.wallLen[d.r.k + "|S"]; put("W", $("#lpB").value); delete E.wallLen[d.r.k + "|E"] }
  const id = d.r.s.id; closeLenPop(); applyWallLens(id); E.dimOpen = true; refresh(true);
  const s = R.S.list.find(x => x.id === id); toast(s && s.measured ? `${s.name.replace(/ \(.*\)/, "")}: 바닥 ${s.A}㎡ · 둘레 ${s.P}m 로 계산합니다. 관련 공정 수량이 바뀌었습니다.` : "치수를 지웠습니다.");
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, bm = t.closest("[data-basemode]"), svg = t.closest("svg[data-plandim]");
  if (bm) { const tool = bm.dataset.ztool; BASE_MODE = bm.dataset.basemode; closeLenPop(); closeMarkPop(); SH_SEL = null; LINE_DRAFT = null;   // 하는 일을 바꾸면 그리던 것(찍던 점·긋던 선)은 버린다
    if (tool && tool !== ZONE_TOOL) { ZONE_TOOL = tool; POLY_DRAFT = null; PIN_PT = null; if (tool !== "rect") PIN_ADD = false }
    renderInfo(); return }
  if (t.closest("[data-posdoc]")) { if (E.posDoc) delete E.posDoc; else E.posDoc = true; refresh(); toast(E.posDoc ? "위치 표시를 고객 견적서의 ‘위치 메모’ 도면에도 넣습니다." : "위치 표시를 고객 견적서에서 뺐습니다. 실장 화면에는 그대로 보입니다."); return }
  if (t.closest("[data-lenclear]")) { for (const k of Object.keys(E.wallLen || {})) { const id = k.split("|")[0].split("#")[0]; if (E.dim) delete E.dim[id] } E.wallLen = {}; refresh(true); return }
  if (t.closest("[data-lpsave]")) { lenPopSave(); return }
  if (LEN_DRAFT && (t.closest("[data-lpcancel]") || (!t.closest("#lenPop") && !svg))) closeLenPop();
  if (!svg) return;
  const g = planGeom(); if (!g.L) return; const b = svg.getBoundingClientRect(), px = (ev0.clientX - b.left) / b.width * g.vw, py = (ev0.clientY - b.top) / b.height * g.vh;
  const r = rectAt(g, px, py);
  if (!r) { toast("방 안쪽이나 벽 가까이를 눌러 주세요."); return }
  const w = r.w * PK, h = r.h * PK, rx = (px - PPAD - r.x * PK) / w, ry = (py - PPAD - r.y * PK) / h, edge = Math.min(0.9 * PK * (g.L.k || 1), 0.28 * Math.min(w, h)), d = { N: ry * h, S: (1 - ry) * h, W: rx * w, E: (1 - rx) * w }, near = Object.keys(d).sort((p, q) => d[p] - d[q])[0];
  openLenPop(r, E.planImg && !r.poly && d[near] < edge && !(r.inner || {})[near] ? near : "", ev0.clientX, ev0.clientY);   // (v88) 기본 도면(그림 없음)에서는 어디를 눌러도 그 방의 가로 × 세로를 받는다   // 점으로 그린 방은 벽 한 면이 여러 토막일 수 있어 늘 ‘가장 넓은 곳의 가로 × 세로’로 받는다
});
document.addEventListener("keydown", ev0 => { if (!LEN_DRAFT) return; if (ev0.key === "Enter" && (ev0.target.id === "lpA" || ev0.target.id === "lpB")) { ev0.preventDefault(); lenPopSave() } else if (ev0.key === "Escape") closeLenPop() });                                  // 지금 위치를 지정할 공간
const hasPins = () => !!E.planImg && (hasBox() || Object.keys(E.planPins || {}).length > 0);
const pinList = () => R.S.list.filter(s => s.type !== "공통");
const pinCur = () => { const list = pinList(), bx = E.planBox || {}; return PIN_SEL && list.some(s => s.id === PIN_SEL) ? PIN_SEL : (list.find(s => !bx[s.id]) || {}).id };
function pinBar() {                                  // 올린 도면의 방 칸: 자동으로 나눈 것을 확인하고, 틀린 곳만 고친다
  const list = pinList(), bx = E.planBox || {}, pins = E.planPins || {}, sel = pinCur(), left = list.filter(s => !bx[s.id]), done = list.filter(s => bx[s.id]), nm = s => esc(s.name.replace(/ \(.*\)/, ""));
  const dr = polyDraft(), selNm = sel ? nm(list.find(s => s.id === sel)) : "", onSt = "background:var(--accent);color:var(--accent-ink);border-color:var(--accent)", ptOn = sel && bx[sel] && bx[sel].poly && PIN_PT && PIN_PT.id === sel && PIN_PT.i < bx[sel].poly.length, tool = ZONE_TOOL;
  const how = tool === "poly" ? "<b>점 찍어 그리기:</b> 도면에서 방의 모서리를 벽을 따라 <b>차례로 누르고</b>, 처음 찍은 <b>큰 초록 점</b>을 다시 누르면 모양이 닫힙니다 (ㄱ자 방 · 비스듬한 벽). 아래에서 방 이름을 먼저 눌러 두면 바로 그 방이 되고, 고르지 않았으면 <b>닫은 뒤에 어느 방인지 고르는 창</b>이 뜹니다 (세탁실·보조 주방처럼 목록에 없는 공간도 그 창에서 넣습니다)."   // (v62) 그리는 방법마다 한 문장 · (v68) 그린 뒤에 방 고르기
    : tool === "round" ? "<b>둥근 모양:</b> 둥근 곳의 한쪽 끝에서 맞은편 끝까지 <b>끌면</b> 그 안에 꽉 차는 둥근 모양(원·타원)이 됩니다. 아래에서 방 이름을 먼저 눌러 두면 바로 그 방이 되고, 아니면 그린 뒤에 어느 방인지 고릅니다. 벽 한쪽만 둥글면 ‘점 찍어 그리기’로 그린 뒤 그 점을 눌러 ‘둥글게’를 쓰세요."
    : "<b>네모 그리기:</b> 아래에서 방 이름을 고르고(진한 것) 도면에서 그 방을 <b>한 번 누르면</b> 그 칸이 그 이름이 됩니다. 칸이 안 맞으면 모서리에서 대각선 모서리까지 <b>끌어서</b> 직접 그리세요.";
  const fix = !sel || !bx[sel] || dr ? "" : bx[sel].poly ? " 그려 둔 모양은 <b>점(동그라미)</b>을 끌어 고치고, 선 가운데의 <b>작은 ＋</b>를 끌면 점이 하나 더 생깁니다. <b>가운데 주황 손잡이</b>로 옮기고 <b>✕</b>로 지웁니다." : " 그려 둔 네모는 <b>모서리 동그라미</b>를 끌어 크기를, <b>가운데 주황 손잡이</b>를 끌어 자리를 바꾸고, <b>✕</b>로 그 네모만 지웁니다.";
  return `<div class="pinbar"><span class="note">${done.length ? `<b>방 영역 ${done.length}곳</b> 지정됨${left.length ? ` · 아직 없는 곳: ${left.map(nm).join(", ")}` : ""}. ` : ""}${how}${fix} 잘못 눌렀으면 <b>Ctrl+Z</b>.</span>
    <div class="layers">${list.map(s => `<button type="button" data-pinsel="${s.id}" aria-pressed="${sel === s.id}" style="${sel === s.id ? onSt : ""}">${bx[s.id] ? "✓ " : pins[s.id] ? "· " : ""}${nm(s)}</button>`).join("")}</div>
    ${tool === "poly" ? `<p class="note" style="margin:4px 0 0">${dr ? `<b>${sel && sel === PIN_EXP ? `‘${selNm}’ ` : ""}점 ${dr.pts.length}개</b>를 찍었습니다. ${dr.pts.length < 3 ? "3개부터 모양이 됩니다. 다음 모서리를 누르세요." : `더 찍거나, 처음 찍은 <b>큰 초록 점</b>을 누르면(같은 자리를 두 번 눌러도 됩니다) 모양이 닫힙니다${sel && sel === PIN_EXP ? "" : " — 그다음 어느 방인지 고릅니다"}.`}` : sel && sel === PIN_EXP ? `지금 도면을 누르면 <b>‘${selNm}’</b>의 점이 찍힙니다. 누른 채 움직이면 자리를 맞춘 뒤 손을 뗄 때 찍히고, 거의 가로·세로인 선은 반듯하게 맞춰집니다.` : `지금 도면에서 방 모서리를 차례로 누르세요. 모양을 닫으면 <b>어느 방인지 고르는 창</b>이 뜹니다${sel ? ` (먼저 권하는 이름: ‘${selNm}’)` : ""}. 거의 가로·세로인 선은 반듯하게 맞춰집니다.`}</p>${dr ? `<div class="layers"><button type="button" data-polyclose style="${dr.pts.length > 2 ? onSt : "opacity:.5!important"}">모양 닫기 (Enter)</button><button type="button" data-polyback>방금 찍은 점 지우기</button><button type="button" data-polycancel style="color:var(--warn)">그리기 취소 (Esc)</button></div>` : ""}` : ""}
    ${ptOn && !dr ? '<p class="note" style="margin:4px 0 0">점 하나를 골랐습니다(진한 주황). 끌어서 옮기거나, 빼거나, <b>둥글게</b>(앞뒤 점과 이어지는 곡선으로) 바꿀 수 있습니다. 둥근 벽은 선 가운데의 ＋를 둥근 쪽으로 끌어낸 뒤 ‘둥글게’를 누르면 됩니다.</p><div class="layers"><button type="button" data-polyarc>◠ 이 점에서 둥글게</button><button type="button" data-polyptdel style="color:var(--warn)">고른 점 지우기 (Delete)</button></div>' : ""}
    <div class="layers"><button type="button" data-xspgo title="보조 주방·다용도실·팬트리처럼 위 이름 목록에 없는 공간을 넣습니다">＋ 목록에 없는 공간 넣기 (보조 주방 등)</button><button type="button" data-autozone>자동으로 다시 나누기</button>${tool === "rect" ? `<button type="button" data-pinadd aria-pressed="${!!PIN_ADD}" style="${PIN_ADD ? onSt : ""}">＋ 네모 더하기 (ㄱ자 방)${PIN_ADD ? " 켜짐" : ""}</button>` : ""}${sel && bx[sel] ? `<button type="button" data-pindel style="color:var(--warn)">‘${selNm}’ 영역 지우기</button>` : ""}${Object.keys(bx).length || Object.keys(pins).length ? '<button type="button" data-pinclear style="color:var(--warn)">영역 모두 지우기</button>' : ""}</div>
    ${PIN_ADD && tool === "rect" ? '<p class="note" style="margin:4px 0 0">‘네모 더하기’가 켜져 있습니다. 고른 방 위에 네모를 하나 더 끌어 그리면 두 네모가 한 방으로 합쳐집니다 (ㄱ자·ㄷ자 방).</p>' : ""}
    ${fitBar()}
    ${done.length ? `<div class="wopt" style="margin-top:8px"><b>도면 치수로 실측표 채우기</b><select id="scRoom" aria-label="기준 방">${done.map(s => `<option value="${s.id}">${nm(s)}</option>`).join("")}</select><span class="note">의 가로(좌우) 길이</span><input id="scLen" class="q" type="number" min="0" step="0.01" style="width:84px" placeholder="예: 3.6" aria-label="가로 길이"><span class="note">m</span><button type="button" class="btn sm" data-scfill>실측표 채우기</button><span class="note">도면에 치수가 적힌 방 하나만 넣으면 나머지 방 크기도 계산해 실측표에 넣습니다.</span></div>` : ""}</div>`;
}
/* (v68) 그린 크기대로 방 넓이 맞추기 — 단추와 지금 상태. 계산은 spaces() 의 planFitMap 이 한다 (E.planFit 만 켜고 끈다) */
function fitDiff() {                                 // 그린 크기로 정해진 방들: [{ nm, a0 평형 추정 ㎡, a1 그린 크기 ㎡ }]
  if (!E.planFit) return []; let S0; E.planFit = false; try { S0 = spaces() } finally { E.planFit = true }
  return R.S.list.filter(s => s.fit).map(s => ({ nm: s.name.replace(/ \(.*\)/, ""), a0: (S0.list.find(x => x.id === s.id) || {}).A || 0, a1: s.A }));
}
function fitBar() {
  if (!E.planImg || !hasBox()) return ""; const on = !!E.planFit, df = on ? fitDiff() : [], onSt = "background:var(--accent);color:var(--accent-ink);border-color:var(--accent)";
  return `<div class="wopt" style="margin-top:8px"><button type="button" class="btn sm" data-planfit aria-pressed="${on}" style="${on ? onSt : ""}">${on ? "✓ 그린 크기대로 방 넓이 맞추는 중 (누르면 끔)" : "그린 크기대로 방 넓이 맞추기"}</button>
    <span class="note">${on ? (df.length ? df.map(x => `${esc(x.nm)} <b>${x.a1}㎡</b>${x.a0 > 0 && x.a0 !== x.a1 ? ` (추정 ${x.a0})` : ""}`).join(" · ") + " — " : "") + "방 모양을 고치면 넓이도 따라 바뀝니다. 실측 치수를 넣은 방은 그 값이 먼저이고, <b>끄면 평형 추정으로 돌아갑니다.</b>" : "도면에 그린 방 크기의 비율대로 <b>거실·주방·방·추가 공간(세탁실 등)</b>의 넓이를 나눕니다 (그 방들의 넓이 합계는 그대로 · 추가 공간은 그린 크기만큼 더해짐). 몰딩·걸레받이처럼 ㎡·m로 세는 수량과 금액이 따라 바뀝니다. 도배·장판처럼 평수로 받는 것과 욕실·현관·발코니는 그대로입니다."}</span></div>`;
}
const dWon = d => `${d > 0 ? "+" : "−"}${won(Math.abs(d))}원`;
function planFitSet(on) {                            // 켜고 끄기 → 바뀐 금액을 알려 준다
  const t0 = R.total; E.planFit = !!on; refresh(true); const d = R.total - t0;
  toast(on ? `그린 크기대로 방 넓이를 맞췄습니다 (합계 ${d ? dWon(d) : "그대로"}). 같은 단추를 다시 누르면 평형 추정으로 돌아갑니다. (Ctrl+Z 되돌리기)` : `그린 크기 반영을 껐습니다. 방 넓이가 평형 추정으로 돌아갔습니다${d ? ` (합계 ${dWon(d)})` : ""}.`);
}
/* (v68) 그린 모양이 어느 방인지 고르기: 점을 이어 닫은 모양(방 영역 ‘점 찍어 그리기’·‘둥근 모양’, ‘선 표시’에서 처음 점으로 돌아와 닫은 선)을 먼저 그리고, 방은 그다음에 고른다.
   올린 도면이면 그 모양이 그 방의 영역(E.planBox)이 되고, 약식 도면이면 그린 크기를 그 방의 실측 치수(E.dim 의 면적·둘레)로 넣는다. 목록에 없는 공간(세탁실·보조 주방)은 그 창에서 추가 공간으로 넣는다. */
let ROOM_DRAFT = null, PIN_EXP = null;               // ROOM_DRAFT { pts 도면 0~1 비율, from "zone" | "line", def 먼저 권하는 방, t 창을 띄운 때 } · PIN_EXP = 실장이 이름을 직접 눌러 고른 방 (그 방으로 바로 정한다 — 창을 띄우지 않는다)
const closeRoomPop = () => { const p = document.getElementById("roomPop"); if (p) p.remove(); ROOM_DRAFT = null };
function shapeOk(pts) {                              // 방 모양으로 쓸 수 있는가 → 저장 모양, 아니면 null (까닭은 알림 글로)
  if (pts.length < 3) { toast("점을 3개 이상 찍어야 모양이 됩니다. 모서리를 더 눌러 주세요."); return null }
  const bx = polyPack(pts);
  if (bx.poly.length < 3 || bx.w < 0.03 || bx.h < 0.03) { toast("모양이 너무 작습니다. 조금 더 크게 찍어 주세요."); return null }
  if (polyCross(bx.poly)) { toast("선이 서로 엇갈렸습니다. 둘레를 따라 차례대로 찍어야 합니다. ‘방금 찍은 점 지우기’로 고쳐 주세요."); return null }
  return bx;
}
function drawnSize(pts) {                            // 그린 모양의 실제 크기 { a ㎡, p m } — 축척을 모르면(올린 도면에 다른 방 영역이 아직 없을 때) null
  const G = ltGeom(R.S); if (!G.pm) return null; const p = pts.map(q => [q[0] * G.vw / G.pm, q[1] * G.vh / G.pm]), r2 = v => Math.round(v * 100) / 100; return { a: r2(polyArea(p)), p: r2(polyLen(p)) };
}
function openRoomPop(pts, from, cx, cy, def) {
  closeRoomPop(); closeLenPop(); closeMarkPop(); const img = !!E.planImg, list = pinList(), bx = E.planBox || {}, sz = drawnSize(pts), nm = s => esc(s.name.replace(/ \(.*\)/, "")), xs = xspList();
  ROOM_DRAFT = { pts: pts.map(q => [...q]), from, def: def || "", t: Date.now() };
  const left = Math.max(8, Math.min(cx + 14, innerWidth - 356)), top = Math.max(8, Math.min(cy + 14, innerHeight - 440)), fitOn = E.planFit === undefined ? true : !!E.planFit;
  document.body.insertAdjacentHTML("beforeend", `<div id="roomPop" class="card" style="position:fixed;left:${left}px;top:${top}px;z-index:80;width:340px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);overflow:auto;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.3)">
    <div style="font-weight:700;font-size:15px;margin-bottom:4px">그린 모양은 어느 방인가요?</div>
    <div class="note" style="margin-bottom:6px">${sz ? `그린 크기 약 <b>${sz.a}㎡</b> (${toPy(sz.a)}평) · 둘레 ${sz.p}m. ` : ""}방 이름을 누르면 ${img ? "이 모양이 그 방의 영역이 됩니다." : "그 방을 이 크기로 넣습니다 (아래 실측 표에서 고칠 수 있습니다)."}</div>
    <div class="layers">${list.map(s => `<button type="button" data-rpick="${s.id}" aria-pressed="${s.id === def}">${img && bx[s.id] ? "✓ " : ""}${nm(s)}</button>`).join("")}</div>
    <div class="note" style="margin:8px 0 2px">목록에 없는 공간이면 (넣으면서 바로 이 모양으로)</div>
    <div class="layers">${XSP_PRE.filter(([n]) => !xs.some(x => x.name === n)).map(([n, t]) => `<button type="button" data-rnew="${esc(n)}" data-rnt="${t}">＋ ${esc(n)}</button>`).join("")}</div>
    <div style="display:flex;gap:4px;margin-top:4px"><input id="rpNew" maxlength="12" placeholder="직접 적기 (예: 가족실)" style="flex:1;min-width:0;padding:7px 9px;border:1px solid var(--line);border-radius:8px;font:inherit" aria-label="새 공간 이름"><button type="button" class="btn sm" data-rnew="">넣기</button></div>
    ${img ? `<label style="display:flex;gap:6px;align-items:flex-start;margin-top:10px;font-size:13px"><input type="checkbox" id="rpFit" ${fitOn ? "checked" : ""} style="margin-top:3px;width:auto"><span><b>그린 크기대로 방 넓이도 맞추기</b><br><span class="note">거실·주방·방·추가 공간의 넓이를 그린 비율대로 나눕니다 (몰딩·걸레받이처럼 ㎡·m로 세는 수량·금액이 따라 바뀜). 끄면 영역만 표시합니다.</span></span></label>` : ""}
    <div class="toolbar" style="margin-top:10px">${from === "line" ? '<button type="button" class="btn sm" data-rmark>방이 아니에요 · 표시만 남기기</button>' : ""}<button type="button" class="btn sm" data-rcancel>취소 (Esc)</button></div></div>`);
}
function roomPopPick(id) {                           // 고른 방으로 정한다
  const d = ROOM_DRAFT; if (!d) return; const s = spaces().list.find(q => q.id === id && q.type !== "공통"); if (!s) { closeRoomPop(); return }
  const img = !!E.planImg, fitEl = document.getElementById("rpFit"), nm = s.name.replace(/ \(.*\)/, ""), t0 = R.total;
  if (img) {
    const bx = shapeOk(d.pts); if (!bx) return;
    E.planBox = E.planBox || {}; E.planBox[id] = bx; if (E.planPins) delete E.planPins[id]; if (fitEl) E.planFit = !!fitEl.checked;
    POLY_DRAFT = null; LINE_DRAFT = null; PIN_PT = null; PIN_EXP = null; BASE_MODE = "zone"; if (d.from === "line") ZONE_TOOL = "poly";
    PIN_SEL = (pinList().find(q => !E.planBox[q.id]) || {}).id || id; closeRoomPop(); refresh(true);
    const s1 = R.S.list.find(q => q.id === id), dl = R.total - t0;
    toast(`‘${nm}’ 영역으로 정했습니다${E.planFit && s1 && s1.fit ? ` — 넓이 ${s1.A}㎡ (${toPy(s1.A)}평)로 계산합니다 (합계 ${dl ? dWon(dl) : "그대로"})` : E.planFit && s1 && s1.measured ? " — 이 방은 넣어 둔 실측 치수로 계산합니다" : ""}. 점을 끌어 모양을 고칠 수 있습니다. (Ctrl+Z 되돌리기)`);
    return;
  }
  const sz = drawnSize(d.pts); if (!sz || !(sz.a > 0)) { toast("그린 크기를 잴 수 없습니다. ‘벽 치수 넣기’로 가로·세로를 넣어 주세요."); return }
  E.dim = E.dim || {}; const old = E.dim[id] || {}, keep = {}; for (const k of ["h", "walls"]) if (old[k] !== undefined && old[k] !== "") keep[k] = old[k];
  E.dim[id] = { ...keep, a: sz.a, p: sz.p }; for (const k of Object.keys(E.wallLen || {})) if (k.split("|")[0].split("#")[0] === id) delete E.wallLen[k];   // 그 방에 넣어 둔 벽 치수는 지운다 (그린 크기와 어긋난다)
  LINE_DRAFT = null; E.dimOpen = true; closeRoomPop(); refresh(true); const dl = R.total - t0;
  toast(`‘${nm}’을(를) 그린 크기(바닥 ${sz.a}㎡ · 둘레 ${sz.p}m)로 넣었습니다 (합계 ${dl ? dWon(dl) : "그대로"}). 아래 실측 표에서 고치거나 지울 수 있습니다. (Ctrl+Z 되돌리기)`);
}
function roomPopNew(name, type) { if (!ROOM_DRAFT) return; const r = xspAdd(name, type); if (r.err) { toast(r.err); return } roomPopPick(r.id) }   // 목록에 없는 공간: 추가 공간으로 넣고 바로 그 모양으로
function roomPopMark(cx, cy) {                       // 방이 아니다 → 위치 표시(직접 그린 모양)로 남기고 이름 창을 띄운다 (수량·금액과 상관없다)
  const d = ROOM_DRAFT; if (!d) return; const p = d.pts.map(q => [rd4(q[0]), rd4(q[1])]), m = { id: "m" + Date.now(), step: POS, lid: "", t: "표시", memo: "", dim: "", img: !!E.planImg, shape: [p], sk: "free" }, mid = polyMid(p);
  markRoomSet(m, mid[0], mid[1]); E.marks = E.marks || []; E.marks.push(m); LINE_DRAFT = null; BASE_MODE = "pos"; SH_SEL = m.id; closeRoomPop(); refresh(); setTimeout(() => { if ((E.marks || []).includes(m)) openMarkPop(m, true, cx, cy) }, 0);   // 이름 창은 이 누름이 끝난 뒤에 띄운다 (같은 누름의 ‘창 밖을 누르면 닫기’에 바로 닫히지 않게)
}
document.addEventListener("click", ev0 => {
  const t = ev0.target; if (!t.closest) return;
  if (t.closest("[data-planfit]")) { planFitSet(!E.planFit); return }
  if (!ROOM_DRAFT) return;
  if (!t.closest("#roomPop")) { if (Date.now() - ROOM_DRAFT.t > 400) closeRoomPop(); return }   // 창 밖을 누르면 닫는다 (그리던 점은 그대로 — 이어서 고칠 수 있다)
  const pk = t.closest("[data-rpick]"), nw = t.closest("[data-rnew]");
  if (pk) { roomPopPick(pk.dataset.rpick); return }
  if (nw) { roomPopNew(nw.dataset.rnew || ($("#rpNew") || {}).value || "", nw.dataset.rnt || ""); return }
  if (t.closest("[data-rmark]")) { roomPopMark(ev0.clientX - 150, ev0.clientY - 200); return }
  if (t.closest("[data-rcancel]")) closeRoomPop();
});
document.addEventListener("keydown", ev0 => {        // 방 고르는 창: Enter = 먼저 권한 방(또는 적은 이름) · Esc = 닫기
  if (!ROOM_DRAFT) return; const k = ev0.key;
  if (k === "Escape") { ev0.preventDefault(); ev0.stopImmediatePropagation(); closeRoomPop() }   // 뒤에 있는 그리기 글쇠(Esc = 그리던 것 버리기 · Enter = 닫기)까지 가지 않게 한다
  else if (k === "Enter") { ev0.preventDefault(); ev0.stopImmediatePropagation(); const v = ev0.target && ev0.target.id === "rpNew" ? ev0.target.value.trim() : ""; if (v) roomPopNew(v, ""); else if (ROOM_DRAFT.def) roomPopPick(ROOM_DRAFT.def) }
}, true);
document.head.insertAdjacentHTML("beforeend", '<style>#roomPop .layers{display:flex;flex-wrap:wrap;gap:6px}#roomPop .layers button{opacity:1;min-height:40px;padding:6px 12px;font-size:13px}#roomPop .layers button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}</style>');
function planAutoRun() {                             // 방금 넣은 도면이면 방을 자동으로 나눈다 (한 번만)
  const go = PLAN_AUTO === E.planImg && !hasBox(); PLAN_AUTO = null;
  if (go && autoZones()) { refresh(true); toast("방을 자동으로 나누고 방·욕실·발코니 수도 맞췄습니다. 틀린 곳은 이름을 고르고 그 방을 누르면 바뀝니다. (Ctrl+Z 되돌리기)") }
  else if ($("#planBase")) renderInfo();
}
let BASE_3D = false;                                 // (v63) 현장 정보 도면 바로 아래에서 입체(3D)로 보기 — 방 영역·가구 모양을 놓으면서 바로 세워 본다
function base3d() {
  if (!planGeom().L) return E.planImg ? '<div class="note" style="margin-top:8px">방 영역을 그리면 이 도면을 <b>입체(3D)</b>로 세워 볼 수 있습니다.</div>' : "";
  return `<div style="margin-top:8px"><button type="button" class="btn sm" data-base3d aria-pressed="${BASE_3D}">${BASE_3D ? "입체(3D) 닫기" : "입체(3D)로 보기"}</button>${BASE_3D ? ` ${p3dBar()}<span class="note" style="margin-left:6px">끌어서 돌려 보세요 · ‘위치·가구 표시’로 놓은 싱크대·붙박이장이 입체로 섭니다</span>
    <div class="planwrap" data-p3dwrap="base" style="width:min(100%,680px);aspect-ratio:1.5;margin-top:6px">${plan3dSvg("base")}</div>` : ' <span class="note">도면을 세워서 봅니다 · 고객 견적서의 3D 조감도와 같은 그림</span>'}</div>`;
}
function p3dSync() { document.querySelectorAll("[data-p3dwrap]").forEach(w => { if (!P3_DRAG) w.innerHTML = plan3dSvg(w.dataset.p3dwrap) }) }   // 화면에 떠 있는 입체 그림을 지금 도면대로 다시 그린다
document.addEventListener("click", ev0 => { if (!ev0.target.closest || !ev0.target.closest("[data-base3d]")) return; BASE_3D = !BASE_3D; renderInfo(); if (BASE_3D) setTimeout(() => { const w = document.querySelector('#info [data-p3dwrap="base"]'); if (w) w.scrollIntoView({ block: "nearest", behavior: "smooth" }) }, 50) });
function planBase() {                               // 현장 정보: 방·욕실·발코니 수를 바꾸면 바로 바뀌는 도면
  if (!D.stepLines) return "";
  if (E.planImg && PLAN_REG.src !== E.planImg) detectRooms(planAutoRun);
  else if (E.planImg && PLAN_AUTO === E.planImg && PLAN_REG.lab) setTimeout(planAutoRun, 0);   // 같은 도면을 다시 넣은 경우
  return `<div class="group"><h3>도면 ${E.planImg ? (E.planFrom ? `· ${esc(E.planFrom)} 저장 도면` : "· 올린 도면 사진") : "· 방·욕실·발코니 수에 맞는 아파트 평면으로 바뀝니다"}</h3><div class="planwrap" id="planBase">${planSvg("base", baseOpts())}</div>${baseBar()}${base3d()}<div id="planLib" class="note" style="margin-top:8px"></div><div id="measLib" class="note" style="margin-top:4px"></div>
   <div class="toolbar" style="margin-top:8px"><label class="btn sm" style="cursor:pointer">도면 파일 고르기<input type="file" accept="image/*" data-planimg hidden></label>${E.planImg ? '<button type="button" class="btn sm" data-planimgdel>약식 도면으로 돌아가기</button>' : ""}
   ${E.info.bname || E.info.addr ? `<a class="btn sm" target="_blank" rel="noopener" style="text-decoration:none" href="https://search.naver.com/search.naver?query=${encodeURIComponent((E.info.bname || E.info.addr) + " " + (+E.py || "") + "평 평면도")}" data-planfind>평면도 찾기 (네이버 검색)</a><a class="btn sm" target="_blank" rel="noopener" style="text-decoration:none" data-planfind href="https://m.land.naver.com/search/result/${encodeURIComponent(E.info.bname || E.info.addr)}">네이버 부동산에서 단지 열기</a>` : ""}
   <span class="note"><b>가장 빠른 방법:</b> 평면도를 화면 캡처(Win+Shift+S)한 뒤 이 화면에서 <b>Ctrl+V</b>. 이미지 파일을 끌어다 놓아도 됩니다.</span>
   <span class="note">${E.planImg ? "각 공정에서 이 도면 위에 공사 위치를 표시합니다." : "가장 흔한 판상형 평면으로 그린 그림이라 실제 구조와 다를 수 있습니다. 단지 평면도를 캡처해 올리면 그 도면 위에 표시합니다."}</span></div></div>`;
}
const WALL_ONLY = {};                                // 벽 공정에서 벽을 눌렀을 때: false 그 벽만 빼기 · true 그 벽만 하기
const PLAN_MODE = {};                                // 공정별 도면 누르기 방식: 0 공간 켜기·끄기 · 1 위치 메모
const COUNT_RE = /\b(rooms|baths|balconies)\b/;
function stepMismatch(step) {                        // 수량을 손으로 고쳐서 도면(켜진 공간 수)과 달라진 줄
  return stepItems(step).filter(l => COUNT_RE.test(String(l.qty))).map(l => { const m = R.lines.find(x => x.key === "ln|" + l.id); return m && m.edited ? { l, q: m.qty, auto: m.auto, unit: m.unit } : null }).filter(Boolean);
}
let PLAN_PIN = (() => { try { const v = localStorage.getItem("sido3_planpin"); return v === null ? null : v === "1" } catch (e) { return null } })();   // 도면을 화면 위에 붙여 둘지 (고르지 않았으면 화면이 충분히 클 때만)
const planPinned = () => PLAN_PIN === true;   // 직접 ‘위에 고정’을 눌렀을 때만 따라온다 (처음에는 어느 화면이든 고정하지 않는다)
let PLAN_SMALL = (() => { try { const v = localStorage.getItem("sido3_plansmall"); return v === null ? null : v === "1" } catch (e) { return null } })();
const planSmall = () => PLAN_SMALL === null ? window.innerHeight < 950 : PLAN_SMALL;   // 낮은 화면(노트북·휴대폰)은 처음부터 작게
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-plansmall]"); if (!b) return; ev0.preventDefault(); ev0.stopPropagation(); PLAN_SMALL = !planSmall(); try { localStorage.setItem("sido3_plansmall", PLAN_SMALL ? "1" : "0") } catch (e) { }
  renderChecklist() }, true);
document.addEventListener("click", ev0 => { const b = ev0.target.closest("[data-planpin]"); if (!b) return; ev0.preventDefault(); ev0.stopPropagation(); PLAN_PIN = !planPinned(); try { localStorage.setItem("sido3_planpin", PLAN_PIN ? "1" : "0") } catch (e) { }
  renderChecklist(); toast(PLAN_PIN ? "도면을 화면 위에 고정했습니다." : "도면 고정을 풀었습니다. 도면은 맨 위에 그대로 있습니다.") }, true);
function planFsK() { let k = 1.45; try { k = planPinned() ? 2.9 : planSmall() ? 2.1 : 1.45 } catch (e) { } return k * Math.min(1.6, Math.max(0.7, (+E.markScale || 0.75) / 0.75)) }   // 도면의 방 이름·면적 글자 배율
function planCard(st) {                             // 공정 단계 맨 위에 붙어 있는 도면
  const sk = st.key, items = stepItems(sk), ms = planMarks().filter(m => m.step === sk), cur = MARK_SEL[sk], mode = sk === "s5" && PLAN_MODE.s5 === 2 ? 2 : E.planImg && !hasPins() ? 1 : (PLAN_MODE[sk] || 0);
  const hit = stepRooms(sk), skip = (E.skip || {})[sk] || {}, sf0 = stepSurf(sk), rel = R.S.list.filter(s => hit[s.id] && !(sf0[s.id] || {}).opt), inc = rel.filter(s => !skip[s.id]), exc = rel.filter(s => skip[s.id]), mis = stepMismatch(sk);
  const sfAll = stepSurf(sk), wallStep = (!E.planImg || hasBox()) && Object.values(sfAll).some(x => x.wall), sw = (E.skipW || {})[sk] || {}, util = ((E.skip || {})[sk] || {}).util;
  const balOpt = Object.values(sfAll).some(x => x.opt || x.ext), doorStep = Object.values(sfAll).some(x => x.door);
  const keyNote = `<div class="keys">${[Object.values(sfAll).some(x => x.floor || x.ceil) && `<span><i style="background:${STEP_COLOR[sk]};opacity:.35"></i>칠해진 면 = ${Object.values(sfAll).some(x => x.floor) ? (Object.values(sfAll).some(x => x.ceil) ? "바닥·천장" : "바닥") : "천장"} 공사</span>`, wallStep && `<span><i class="ln" style="background:${STEP_COLOR[sk]}"></i>굵은 선 = 벽 공사</span>`, doorStep && `<span><i class="dr" style="border-color:${STEP_COLOR[sk]}"></i>색칠된 문 = ${sk === "s10" ? "필름 붙이는 문" : "교체할 문"}</span>`, balOpt && "<span>발코니 = 확장하는 곳만 눌러서 포함</span>"].filter(Boolean).join("")}</div>
     ${doorStep ? `<div class="scope"><div>다용도실·기타 문 1개 <b class="${util ? "no" : "ok"}">${util ? "제외" : "포함"}</b> <button type="button" class="btn ghost sm" data-util="${sk}">${util ? "다시 넣기" : "빼기"}</button></div></div>` : ""}`;
  const wallList = Object.entries(sw).filter(([id]) => !skip[id]).map(([id, ws]) => { const all = curLayout(R.S).rects.filter(r => r.s.id === id).flatMap(r => SIDES.map(s => r.k + "|" + s)), kept = all.filter(k => !ws[k]), nm = ks => [...new Set(ks.map(k => SIDE_NAME[k.split("|")[1]]))].join("·");   // 남은 벽이 1~2면이면 ‘○○만 공사’로 적는다
    return `${roomName(id).replace(/ \(.*\)/, "")} ${kept.length && kept.length <= 2 ? nm(kept) + "만 공사" : nm(Object.keys(ws)) + " 제외"}` });
  const wallNote = wallList.length ? `<div class="scope"><div><b class="no">벽 일부만</b> ${esc(wallList.join(" / "))}</div></div>` : "";
  const nc = (E.noCeil || {})[sk], ceilNote = sk === "s9" && stepItems(sk).some(l => /paperM2|\bpy\b/.test(String(l.qty)) && surfOf(l, sk) === "wall") ? `<div class="scope"><div>천장 도배 <b class="${nc ? "no" : "ok"}">${nc ? "제외 (벽만)" : "포함"}</b> <button type="button" class="btn ghost sm" data-noceil="${sk}">${nc ? "천장도 하기" : "벽만 하기"}</button></div></div>` : "";
  const spcChips = rel.length && mode === 0 ? `<div class="spcs">${rel.map(s => `<button type="button" class="spc ${skip[s.id] ? "off" : "on"}" data-spc="${sk}|${s.id}" title="누르면 이 공간을 이 공정에서 빼거나 다시 넣습니다">${skip[s.id] ? "✕" : "✓"} ${esc(s.name.replace(/ \(.*\)/, ""))} <small>${skip[s.id] ? "제외" : "포함"}</small></button>`).join("")}</div>` : "";
  const nMeas = rel.filter(s => s.measured).length, measNote = rel.length ? `<div class="scope"><div>수량 기준 ${nMeas ? `<b class="ok">실측 ${nMeas}곳</b>` : ""}${rel.length - nMeas ? ` 평형 추정 ${rel.length - nMeas}곳` : ""} <button type="button" class="btn ghost sm" data-godim>실측 치수 넣기</button></div></div>` : "";
  const scope = `${rel.length ? `<div class="scope"><div><b class="ok">공사하는 공간 ${inc.length}곳</b> ${esc(inc.map(s => s.name.replace(/ \(.*\)/, "")).join(" · ") || "없음")}</div>${exc.length ? `<div><b class="no">제외 ${exc.length}곳</b> ${esc(exc.map(s => s.name.replace(/ \(.*\)/, "")).join(" · "))} <button type="button" class="btn ghost sm" data-skipclear="${sk}">모두 다시 넣기</button></div>` : ""}${!exc.length && Object.keys(sw).length ? `<div><button type="button" class="btn ghost sm" data-skipclear="${sk}">벽 선택 모두 되돌리기</button></div>` : ""}</div>` : '<p class="note" style="margin:0 0 6px">이 공정에서 체크한 공사 중 특정 공간에 들어가는 것이 아직 없습니다.</p>'}
     ${mis.map(x => `<div class="mis">‘${esc(lineLabel(x.l))}’ 수량을 직접 <b>${x.q}${esc(x.unit)}</b>(으)로 넣었습니다. 도면에 켜진 공간 기준은 ${x.auto}${esc(x.unit)}입니다. 안 하는 공간을 도면에서 끄면 수량이 자동으로 맞춰집니다. <button type="button" class="btn sm" data-qreset="${x.l.id}">도면 기준으로 되돌리기</button></div>`).join("")}`;
  return `<details class="more plantop${planPinned() ? "" : " unpin"}${planSmall() ? " small" : ""}" data-planbox ${E.planOpen === false ? "" : "open"}><summary>도면 <button type="button" class="btn ghost sm pinb" data-planpin title="아래 공사 목록을 내릴 때 도면이 화면 위에 따라올지 정합니다">${planPinned() ? "📌 고정 풀기" : "📌 위에 고정"}</button><button type="button" class="btn ghost sm pinb" data-plansmall ${planPinned() ? "hidden" : ""} title="도면 크기를 바꿉니다. 작게 하면 아래 공사 목록이 더 많이 보입니다">${planSmall() ? "🔍 도면 크게" : "🔍 도면 작게"}</button> <span class="note">${CEIL_STEPS.includes(sk) ? "천장도" : "평면도"} · ${rel.length ? `공사 ${inc.length}곳${exc.length ? ` · 제외 ${exc.length}곳` : ""}` : "해당 공간 없음"}${ms.length ? ` · 메모 ${ms.length}곳` : ""} · 여기를 눌러 접기/펼치기</span></summary>
   <div class="bd"><div class="planrow fit"><div>${PLAN_3D && planGeom().L ? `<div class="planwrap" data-p3dwrap="${sk}" style="width:calc(42vh*1.5);max-width:100%;aspect-ratio:1.5">${plan3dSvg(sk)}</div><div class="note" style="margin:2px 0">끌어서 돌려 보세요. 색칠된 바닥·벽이 이 공정의 공사 범위입니다. 범위를 고치려면 ‘평면으로 보기’.</div>` : `<div class="planwrap">${planSvg(sk, { edit: true })}</div>`}${planGeom().L ? `<button type="button" class="btn sm" data-p3dtoggle style="margin-top:4px">${PLAN_3D ? "평면으로 보기" : "3D로 보기"}</button>${PLAN_3D ? p3dBar() : ""} ` : ""}${hasBox() ? `<button type="button" class="btn ghost sm" data-planview style="margin-top:4px">${E.planView === "pic" ? "약식 도면으로 보기" : "올린 도면 사진으로 보기"}</button>` : ""} <span class="note">도면 글자 전체</span> <button type="button" class="btn ghost sm" data-mscale="-1">작게</button><button type="button" class="btn ghost sm" data-mscale="1">크게</button></div>
   <div class="planside">${E.planImg && !hasPins() ? '<p class="note" style="margin:0 0 8px">올린 도면입니다. ‘현장 정보’의 <b>방 영역 지정</b>에서 방마다 네모를 그려 두면, 여기서 방 전체나 벽 한 면씩 눌러 빼고 넣을 수 있습니다. 지금은 위치 메모만 됩니다. <button type="button" class="btn sm" data-godim>방 영역 지정하러 가기</button></p>' + (sk === "s5" ? `<div class="seg" role="group" style="margin-bottom:8px"><button type="button" data-pmode="s5|1" aria-pressed="${mode === 1}">위치 메모</button><button type="button" data-pmode="s5|2" aria-pressed="${mode === 2}">조명·콘센트 배치</button></div>` : "") : `<div class="seg" role="group" style="margin-bottom:8px"><button type="button" data-pmode="${sk}|0" aria-pressed="${mode === 0}">공간 켜기·끄기</button><button type="button" data-pmode="${sk}|1" aria-pressed="${mode === 1}">위치 메모</button>${sk === "s5" ? `<button type="button" data-pmode="s5|2" aria-pressed="${mode === 2}">조명·콘센트 배치</button>` : ""}</div>`}
     ${mode === 2 ? lightPanel() : mode === 0 ? `<div class="howto">도면을 누르면 이 공정의 공사 범위가 바뀌고 <b>수량·금액이 바로 따라 바뀝니다.</b> ${doorStep ? "<b>방을 누르면 그 방의 문</b>을 빼거나 넣습니다." : wallStep ? "<b>방 가운데</b> = 방 전체 빼기/넣기, <b>벽 가까이</b> = 그 벽 한 면만." : "공간을 누르면 그 공간을 빼거나 다시 넣습니다."}</div>
       ${wallStep ? `<div class="wopt"><span class="note">벽을 누르면</span><div class="seg" role="group"><button type="button" data-wonly="${sk}|0" aria-pressed="${!WALL_ONLY[sk]}">그 벽만 빼기</button><button type="button" data-wonly="${sk}|1" aria-pressed="${!!WALL_ONLY[sk]}">그 벽만 하기</button></div></div>` : ""}${keyNote}${ceilNote}${spcChips}${scope}${wallNote}${measNote}`
       : `<div class="howto"><b>도면에서 표시할 자리를 누르면</b> 그 자리에 작은 창이 뜹니다. 공사를 고르거나 메모를 적고 저장하세요. <b>이미 있는 표시를 누르면</b> 고치거나 지울 수 있습니다. <b>실측 치수</b>는 ‘치수’ 칸에 적으면 실장 화면에만 보이고 고객 견적서에는 나오지 않습니다.${wallStep ? " 벽 가까이를 누르면 그 벽에 표시되고, <b>벽면 도장·부분 도배·벽 타일</b>은 표시한 벽 면적이 수량이 됩니다." : ""}</div>`}
     ${ms.length ? `<div class="howto" style="margin-top:6px"><b>이름표를 끌면</b> 자리가 옮겨지고, <b>이름표 오른쪽 아래 흰 점을 끌면</b> 그 이름표만 커지거나 작아집니다. 이름표를 그냥 누르면 내용을 고칩니다.</div>` : ""}${marksList(ms, true)}${ms.length > 1 ? `<button type="button" class="btn ghost sm" data-markclear="${sk}" style="margin-top:4px;color:var(--warn)">이 공정의 메모 ${ms.length}개 모두 지우기</button>` : ""}
     <div style="margin-top:6px">${stepLegend(sk)}</div></div></div></div></details>`;
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, pm = t.closest("[data-pmode]"), sc = t.closest("[data-skipclear]"), qr = t.closest("[data-qreset]");
  if (pm) { const [sk, m] = pm.dataset.pmode.split("|"); PLAN_MODE[sk] = +m; renderChecklist() }
  if (sc) { if (E.skip) delete E.skip[sc.dataset.skipclear]; if (E.skipW) delete E.skipW[sc.dataset.skipclear]; if (E.inc) delete E.inc[sc.dataset.skipclear]; refresh() }
  const sp1 = t.closest("[data-spc]"); if (sp1) { const [k, id] = sp1.dataset.spc.split("|"); E.skip = E.skip || {}; const s0 = E.skip[k] = E.skip[k] || {}, b0 = R.total; if (s0[id]) delete s0[id]; else s0[id] = true; refresh(); const d0 = R.total - b0; toast(`${roomName(id).replace(/ \(.*\)/, "")} ${s0[id] ? "제외" : "포함"} · 합계 ${d0 >= 0 ? "+" : "−"}${won(Math.abs(d0))}원`) }
  const ut = t.closest("[data-util]"); if (ut) { E.skip = E.skip || {}; const s0 = E.skip[ut.dataset.util] = E.skip[ut.dataset.util] || {}; if (s0.util) delete s0.util; else s0.util = true; refresh() }
  const wo = t.closest("[data-wonly]"); if (wo) { const [k, m] = wo.dataset.wonly.split("|"); WALL_ONLY[k] = m === "1"; renderChecklist() }
  const ncb = t.closest("[data-noceil]"); if (ncb) { E.noCeil = E.noCeil || {}; const k = ncb.dataset.noceil, b0 = R.total; if (E.noCeil[k]) delete E.noCeil[k]; else E.noCeil[k] = true; refresh(); const d0 = R.total - b0; toast(`천장 도배 ${E.noCeil[k] ? "제외 (벽만)" : "포함"} · 합계 ${d0 >= 0 ? "+" : "−"}${won(Math.abs(d0))}원`) }
  const msb = t.closest("[data-mscale]"); if (msb) { E.markScale = Math.min(1.8, Math.max(0.35, (+E.markScale || 0.75) + 0.15 * +msb.dataset.mscale)); refresh() }
  if (t.closest("[data-planview]")) { E.planView = E.planView === "pic" ? "" : "pic"; refresh() }
  if (t.closest("[data-godim]")) { E.step = 0; E.dimOpen = true; renderChecklist(); const tg = $("#planBase") || $("#info2"); if (tg) tg.scrollIntoView({ block: "center" }) }
  if (qr) { const l = lineById(qr.dataset.qreset); if (l) { setLn(l, { q: undefined }); refresh(); toast("도면에 켜진 공간 기준 수량으로 되돌렸습니다.") } }
});
/* 공간 × 공정 표: 어느 공간에 어떤 공정이 들어가는지 한 번에 본다 */
function planMatrix(m2) {
  const steps = planSteps(), rows = R.S.list.filter(s => s.type !== "공통"); if (!steps.length) return "";
  const hits = {}; steps.forEach(st => hits[st.key] = stepRooms(st.key));
  return `<div class="tbl"><table class="pmx"><thead><tr><th>공간</th>${steps.map(st => `<th><i style="background:${STEP_COLOR[st.key]}"></i>${esc(st.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(s => `<tr><td><b>${esc(s.name.replace(/ \(.*\)/, ""))}</b> <span class="note">${m2 ? s.A + "㎡" : toPy(s.A) + "평"}</span></td>${steps.map(st => { const h = (stepSurf(st.key)[s.id] || {}).opt ? null : hits[st.key][s.id], out = ((E.skip || {})[st.key] || {})[s.id]; return `<td title="${h ? esc(h.join(", ")) : ""}">${h ? (out ? '<span class="x">✕</span>' : `<span style="color:${STEP_COLOR[st.key]}">${Object.keys((((E.skipW || {})[st.key] || {})[s.id]) || {}).length ? "◐" : "●"}</span>`) : ""}</td>` }).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function planOverview() {                           // 확인 단계: 공간×공정 표 + (있으면) 위치 메모 도면 + 공정별 작은 도면
  const steps = planSteps(), ms = planMarks(), off = E.layerOff || {}; if (!steps.length) return "";
  const skipNote = sk => { const ids = Object.keys((E.skip || {})[sk] || {}); return ids.length ? `<div class="note" style="color:var(--warn)">제외: ${esc(ids.map(id => roomName(id).replace(/ \(.*\)/, "")).filter(Boolean).join(", "))}</div>` : "" };
  return `<div class="planall">${workPlanBox(true)}<h3>공간별로 들어가는 공사 <span class="note">● 공사함 · ◐ 벽 일부만 · ✕ 이 공정에서 제외한 공간 · 칸에 마우스를 올리면 공사 이름이 보입니다</span></h3>${planMatrix()}
    ${ms.length ? `<h3>위치 메모</h3><div class="planrow"><div><div class="layers">${steps.filter(st => ms.some(m => m.step === st.key)).map(st => `<button type="button" data-layer="${st.key}" aria-pressed="${!off[st.key]}"><i style="background:${STEP_COLOR[st.key]}"></i>${esc(st.label)}</button>`).join("")}</div><div class="planwrap">${planSvg("all")}</div></div><div>${marksList(ms.filter(m => !off[m.step]))}</div></div>` : ""}
    ${planGeom().L ? `<h3>3D 조감도 <span class="note">끌어서 돌려 볼 수 있습니다 · 고객 견적서에도 들어갑니다</span></h3><div class="planwrap" data-p3dwrap="base" style="width:min(100%,560px);aspect-ratio:1.5">${plan3dSvg("base")}</div><div style="margin-top:4px">${p3dBar()}</div>` : ""}
    <h3>공정별 도면 <span class="note">색칠된 곳이 그 공정의 공사 범위 · 고치려면 왼쪽에서 그 공정을 누르세요</span></h3><div class="plangrid">${steps.map(st => `<figure><figcaption><i style="background:${STEP_COLOR[st.key]}"></i>${esc(st.label)}</figcaption>${planSvg(st.key)}${skipNote(st.key)}</figure>`).join("")}</div></div>`;
}
function planDocPage() {                            // 상세견적서: 공사 위치 도면 쪽
  if (!D.stepLines) return ""; const steps = planSteps(), ms0 = planMarks().filter(m => !m.only), ms = ms0.filter(m => m.step !== POS), nPos = E.posDoc ? ms0.length - ms.length : 0; if (!steps.length) return "";   // (v62) 위치 표시(싱크대 자리 등)는 ‘고객 견적서 도면에도 넣기’를 켰을 때만 도면에 그린다. 이름이 그대로 적혀 있어 번호 표에는 넣지 않는다
  const keep = E.layerOff; E.layerOff = {}; const all = planSvg("all", { m2: true }); E.layerOff = keep;
  return `<section class="page"><h2>공사 위치 도면</h2>
    <p class="note">${E.planImg ? (E.planFrom ? `단지 도면(${esc(E.planFrom)}) 위에` : "올려 주신 도면 위에") : "평형·방 수로 그린 약식 도면에"} 공정별 공사 위치를 표시했습니다. 번호는 아래 표, 그리고 상세 내역서의 ‘도면’ 번호와 같습니다.${E.planImg ? "" : " 약식 도면은 실제 구조와 다를 수 있으며 실측 후 확정합니다."}</p>
    <h3>공간별 공사 범위 (● 공사 · ◐ 벽 일부만 · ✕ 제외)</h3>${planMatrix(true)}
    ${ms.length + nPos ? `<h3>위치 메모</h3><div class="planwrap" style="max-width:520px;margin:0 auto 10px">${all}</div>
    ${ms.length ? `<table><thead><tr><th>번호</th><th>공정</th><th>공사</th><th>위치</th><th>메모</th></tr></thead><tbody>${ms.map(m => `<tr><td>${m.n}</td><td>${esc(stepLabel(m.step))}</td><td>${esc(m.t)}</td><td>${esc(markWhere(m))}</td><td>${esc(m.memo || "")}</td></tr>`).join("")}</tbody></table>` : ""}` : ""}
    ${planGeom().L ? `<h3>3D 조감도</h3><div class="planwrap" style="max-width:520px;margin:0 auto 10px">${plan3dSvg("base", { doc: true })}</div>` : ""}
    <h3>공정별 도면 (색칠된 곳이 그 공정의 공사 위치)</h3>
    <div class="plangrid">${steps.map(st => `<figure><figcaption><i style="background:${STEP_COLOR[st.key]}"></i>${esc(st.label)}${CEIL_STEPS.includes(st.key) ? " · 천장도" : ""}</figcaption>${planSvg(st.key, { m2: true })}<div class="note">${esc(stepItems(st.key).map(lineLabel).slice(0, 8).join(", "))}${stepItems(st.key).length > 8 ? " 외" : ""}${Object.keys((E.skip || {})[st.key] || {}).length ? " · 제외: " + esc(Object.keys(E.skip[st.key]).map(id => roomName(id).replace(/ \(.*\)/, "")).filter(Boolean).join(", ")) : ""}</div></figure>`).join("")}</div>
  </section>`;
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, svg = t.closest("svg[data-plan]"), del = t.closest("[data-markdel]"), lay = t.closest("[data-layer]");
  if (del) { E.marks = (E.marks || []).filter(m => m.id !== del.dataset.markdel); refresh(); return }
  const mc = t.closest("[data-markclear]"); if (mc) { E.marks = (E.marks || []).filter(m => !(m.step === mc.dataset.markclear && !!m.img === !!E.planImg)); refresh(); toast(mc.dataset.markclear === POS ? "위치 표시를 모두 지웠습니다. (Ctrl+Z 되돌리기)" : "이 공정의 메모를 모두 지웠습니다."); return }
  if (lay) { E.layerOff = E.layerOff || {}; E.layerOff[lay.dataset.layer] = !E.layerOff[lay.dataset.layer]; refresh(); return }
  if (t.closest("[data-planimgdel]")) { delete E.planImg; delete E.planImgW; delete E.planImgH; delete E.planFrom; E.planPins = {}; E.planBox = {}; PIN_SEL = null; E.planSkip = (SRV && planKeys().find(k => SRV.plan[k])) || ""; refresh(true); return }
  if (!svg) return;
  const step = svg.dataset.plan, g = planGeom(), b = svg.getBoundingClientRect(), px = (ev0.clientX - b.left) / b.width * g.vw, py = (ev0.clientY - b.top) / b.height * g.vh;
  if (step === "s5" && PLAN_MODE.s5 === 2) return;   // 조명 배치는 따로 처리한다
  if (step !== POS && !PLAN_MODE[step] && (!g.img || hasPins())) {   // 공간 켜기·끄기 → 이 공정의 수량·금액이 따라 바뀐다 (현장 정보의 ‘위치 표시’는 늘 표시만 한다)
    let r = rectAt(g, px, py);
    if (!r && g.img) {                               // 올린 도면에서 네모가 없는 방: 가장 가까운 이름표
      const pins = E.planPins || {}, nx = px / g.vw, ny = py / g.vh; let best = null, bd = 0.09;
      for (const id in pins) { const dd = Math.hypot(pins[id].x - nx, (pins[id].y - ny) * g.vh / g.vw); if (dd < bd) { bd = dd; best = id } }
      const sp = best && R.S.list.find(s => s.id === best); if (!sp) { toast(hasBox() ? "방 네모 안쪽을 눌러 주세요. 네모가 없는 방은 ‘현장 정보’에서 그려 주세요." : "방 이름표 가까이를 눌러 주세요."); return }
      r = { s: sp, k: best };
    }
    if (!r) { toast("도면의 방 안쪽을 눌러 주세요."); return }
    if (!stepRooms(step)[r.s.id]) { toast(`${r.s.name}: 이 공정에서 체크한 공사 중 이 공간에 들어가는 것이 없습니다.`); return }
    const sfc = stepSurf(step)[r.s.id] || {};
    if (sfc.opt || sfc.ext) {                         // 발코니 확장부: 이 공정의 바닥·벽 면적에 넣거나 뺀다
      E.inc = E.inc || {}; const ic = E.inc[step] = E.inc[step] || {}, b0 = R.total; if (ic[r.s.id]) delete ic[r.s.id]; else ic[r.s.id] = true;
      refresh(); const d0 = R.total - b0; toast(`${r.s.name} ${ic[r.s.id] ? "확장부로 포함" : "제외"} · 합계 ${d0 >= 0 ? "+" : "−"}${won(Math.abs(d0))}원`); return;
    }
    E.skip = E.skip || {}; E.skipW = E.skipW || {}; const sk = E.skip[step] = E.skip[step] || {}, sw = E.skipW[step] = E.skipW[step] || {}, before = R.total, nm = r.s.name.replace(/ \(.*\)/, "");
    let side = "";                                   // 벽 한 면 선택: 프로그램 도면, 또는 올린 도면에서 네모를 그린 방
    if (r.x !== undefined) {
      const rx = (px - PPAD - r.x * PK) / (r.w * PK), ry = (py - PPAD - r.y * PK) / (r.h * PK), w = r.w * PK, h = r.h * PK, edge = Math.min(0.9 * PK * g.L.k, 0.28 * Math.min(w, h));
      const d = { N: ry * h, S: (1 - ry) * h, W: rx * w, E: (1 - rx) * w }, near = Object.keys(d).sort((p, q) => d[p] - d[q])[0]; side = sfc.wall && d[near] < edge && !(r.inner || {})[near] ? near : "";
    }
    let what;
    if (!side || sk[r.s.id]) {                       // 방 통째로
      if (sk[r.s.id]) delete sk[r.s.id]; else { sk[r.s.id] = true; delete sw[r.s.id] }
      what = `${nm} ${sk[r.s.id] ? "전체 제외" : "다시 포함"}`;
    } else {                                         // 벽 한 면
      const key = r.k + "|" + side, cur = sw[r.s.id] = sw[r.s.id] || {};
      if (WALL_ONLY[step] && !Object.keys(cur).length) { for (const q of g.L.rects.filter(q => q.s.id === r.s.id)) for (const sd of SIDES) if (q.k + "|" + sd !== key) cur[q.k + "|" + sd] = true; what = `${nm} ${SIDE_NAME[side]}만 공사` }
      else if (cur[key]) { delete cur[key]; what = `${nm} ${SIDE_NAME[side]} 다시 포함` } else { cur[key] = true; what = `${nm} ${SIDE_NAME[side]} 제외` }
      if (!Object.keys(cur).length) delete sw[r.s.id];
    }
    refresh(); const df = R.total - before;
    toast(`${what} · 합계 ${df >= 0 ? "+" : "−"}${won(Math.abs(df))}원`); return;
  }
  const hitR = rectAt(g, px, py);
  if (!g.img && !hitR) { toast("도면의 방 안쪽을 눌러 주세요."); return }
  const m = { id: "m" + Date.now(), step, lid: "", t: "", memo: "", img: !!g.img }; let rx = 0.5, ry = 0.5;
  if (g.img) { m.x = px / g.vw; m.y = py / g.vh }
  if (hitR) { const r = hitR, w = r.w * PK, h = r.h * PK, edge = Math.min(0.9 * PK * (g.L.k || 1), 0.28 * Math.min(w, h)); rx = (px - PPAD - r.x * PK) / w; ry = (py - PPAD - r.y * PK) / h;
    const d = { N: ry * h, S: (1 - ry) * h, W: rx * w, E: (1 - rx) * w }, near = Object.keys(d).sort((p, q) => d[p] - d[q])[0];
    Object.assign(m, { room: r.s.id, rk: r.k, side: step !== POS && d[near] < edge && !(r.inner || {})[near] ? near : "", rx, ry }) }   // 위치 표시는 벽 한 면이 아니라 찍은 그 자리다
  const old = step === POS ? null : (E.marks || []).find(q => q.step === step && !!q.img === !!g.img && (g.img ? Math.hypot(q.x - m.x, (q.y - m.y) * g.vh / g.vw) < 0.03 : (q.rk || q.room) === m.rk && (q.side || "") === m.side && (m.side || Math.hypot((q.rx ?? 0.5) - rx, (q.ry ?? 0.5) - ry) < 0.15)));
  openMarkPop(old || m, !!old, ev0.clientX, ev0.clientY, [px / g.vw, py / g.vh]);   // 이미 있는 표시를 누르면 고치기 · 지우기
});
let MK_DRAG = null, MK_EAT = 0;                      // 이름표 끌기(옮기기 · 크기) · 끈 직후의 클릭은 도면이 받지 않게
/* (v62) 모양 표시(싱크대·붙박이장의 바닥 모양) 고치기 — ‘위치·가구 표시’ 화면에서: 모양을 누르면 고르고, 안쪽을 끌면 통째로 옮기고, 고른 모양의 모서리 동그라미를 끌면 크기·팔 길이가 바뀐다.
   반듯한 변(가로·세로)은 끌어도 반듯하게 따라온다 → 일자는 크기가, ㄱ자·ㄷ자는 팔 길이와 깊이가 바뀐다. 이 듣개는 아래 이름표 듣개보다 먼저 달아 고른 모양의 손잡이가 먼저 잡히게 한다. */
let SH_DRAG = null;
function shapeHit(x, y, b, selOnly) {                // 누른 자리(화면 거리): selOnly 면 고른 모양의 모서리(22px)·✕(16px), 아니면 그 자리에 있는 모양(안쪽이거나 가장자리 12px — 얇은 싱크대도 손가락으로 잡힌다)
  const ms = posMarks().filter(m => m.shape), D = q => Math.hypot((q[0] - x) * b.width, (q[1] - y) * b.height); let best = null;
  if (selOnly) { const m = ms.find(q => q.id === SH_SEL); if (!m) return null;
    m.shape.forEach((p, pi) => p.forEach((q, i) => { const k = D(q) / 22; if (k <= 1 && (!best || k < best.k)) best = { id: m.id, mode: "pt", pi, i, k } }));
    const k = D(shapeDel(m)) / 16; if (k <= 1 && (!best || k < best.k)) best = { id: m.id, mode: "del", k }; return best }
  for (const m of ms) if (m.shape.some(p => polyIn(p, x, y) || p.some((q, i) => { const n = p[(i + 1) % p.length]; return segD(q[0] * b.width, q[1] * b.height, n[0] * b.width, n[1] * b.height, x * b.width, y * b.height) <= 12 }))) best = { id: m.id, mode: "mv" };   // 나중에 놓은 것이 위에 있다
  return best;
}
document.addEventListener("pointerdown", ev0 => {
  const sv = ev0.target.closest && ev0.target.closest(`svg[data-plan="${POS}"]`); if (!sv || ev0.button > 0) return;
  const b = sv.getBoundingClientRect(), x = (ev0.clientX - b.left) / b.width, y = (ev0.clientY - b.top) / b.height; let hit = shapeHit(x, y, b, true);
  if (!hit) { if (ev0.target.closest("g[data-mk]") || mkNear(sv, ev0.clientX, ev0.clientY, ev0.pointerType === "mouse" ? 6 : 18)) return; hit = shapeHit(x, y, b) }   // 점 표시의 이름표가 그 자리에 있으면 그쪽이 먼저
  if (!hit) { if (SH_SEL) { SH_SEL = null; MK_EAT = Date.now() - 250; closeMarkPop(); renderInfo() } return }   // 빈 곳을 누르면 고른 것만 푼다 (그 누름으로 새 표시 창을 띄우지 않는다 — 바로 이어 누르는 것은 받게 0.25초만 막는다)
  const m = (E.marks || []).find(q => q.id === hit.id); if (!m) return;
  SH_DRAG = { sv, b, vb: sv.viewBox.baseVal, id: m.id, hit, o: m.shape.map(p => p.map(q => [...q])), n: null, x0: x, y0: y, x1: x, y1: y }; closeMarkPop(); ev0.preventDefault();
  try { sv.setPointerCapture(ev0.pointerId) } catch (e) {}
});
document.addEventListener("pointermove", ev0 => {
  const d = SH_DRAG; if (!d) return; d.x1 = (ev0.clientX - d.b.left) / d.b.width; d.y1 = (ev0.clientY - d.b.top) / d.b.height;
  if (d.hit.mode === "del" || Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height) < 5) return;
  if (d.hit.mode === "mv") { const dx = d.x1 - d.x0, dy = d.y1 - d.y0; d.n = shapeFit(d.o.map(p => p.map(q => [q[0] + dx, q[1] + dy]))) }
  else { const { pi, i } = d.hit, p0 = d.o[pi], n = p0.length, c = v => Math.min(1, Math.max(0, v)), X = c(d.x1), Y = c(d.y1), np = p0.map(q => [...q]), eps = 0.00015; np[i] = [X, Y];
    for (const j of [(i + n - 1) % n, (i + 1) % n]) { if (Math.abs(p0[j][1] - p0[i][1]) < eps) np[j][1] = Y; else if (Math.abs(p0[j][0] - p0[i][0]) < eps) np[j][0] = X }   // 이웃 점과 가로·세로로 반듯하던 변은 반듯한 채로 따라온다
    d.n = d.o.map((p, k) => k === pi ? np : p) }
  const gs = d.sv.querySelector(`g[data-sh="${d.id}"]`); if (!gs) return;                               // 끄는 동안은 모양만 따라 그리고(손잡이·이름은 감춘다) 손을 떼면 다시 그린다
  d.n.forEach((p, k) => { const el = gs.querySelector(`[data-shp="${k}"]`); if (el) el.setAttribute("points", p.map(q => (q[0] * d.vb.width).toFixed(1) + "," + (q[1] * d.vb.height).toFixed(1)).join(" ")) });
  for (const el of gs.querySelectorAll("[data-shh],[data-shl]")) el.setAttribute("visibility", "hidden");
});
const shEnd = ev0 => {
  const d = SH_DRAG; if (!d) return; SH_DRAG = null; MK_EAT = Date.now(); const m = (E.marks || []).find(q => q.id === d.id); if (!m) return;
  const far = Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height);
  if (ev0.type !== "pointerup") { renderInfo(); return }
  if (d.hit.mode === "del") { if (far > 14) return; E.marks = E.marks.filter(q => q !== m); SH_SEL = null; refresh(); toast(`‘${m.t}’ 모양을 지웠습니다. (Ctrl+Z 되돌리기)`); return }
  if (far < 5 || !d.n) { if (SH_SEL === m.id && d.hit.mode === "mv") openMarkPop(m, true, ev0.clientX, ev0.clientY); else { SH_SEL = m.id; renderInfo() } return }   // 누르기만: 고르기 (고른 것을 한 번 더 누르면 이름·메모·크기 창)
  const nw = d.n.map(p => p.map(q => [rd4(q[0]), rd4(q[1])])); SH_SEL = m.id;
  if (d.hit.mode === "pt" && (polyCross(nw[d.hit.pi]) || polyArea(nw[d.hit.pi]) < 1e-5)) { renderInfo(); toast("모양이 뒤집히거나 너무 작아집니다. 다른 자리에 놓아 주세요."); return }
  m.shape = nw; const all = nw.flat(); markRoomSet(m, (Math.min(...all.map(q => q[0])) + Math.max(...all.map(q => q[0]))) / 2, (Math.min(...all.map(q => q[1])) + Math.max(...all.map(q => q[1]))) / 2); refresh();
};
document.addEventListener("pointerup", shEnd); document.addEventListener("pointercancel", shEnd);
/* (v62) 선 표시 — ‘선 표시’ 화면에서: 끌면 두 점짜리 선, 차례로 누르면 꺾인 선(끝점을 한 번 더 누르거나 ‘선 끝내기’). 그어 둔 선은 끝점·꺾인 점을 끌어 고치고, 선을 끌면 통째로 옮기고, 누르면 이름 창.
   ‘직접 그리기’ 모양(LINE_DRAFT.close)도 여기서 찍는다 — 처음 찍은 점을 다시 누르면 닫혀 모양 표시가 된다. */
let LN_DRAG = null;
function lineHit(x, y, b) {                          // 누른 자리(화면 거리)에서 가장 가까운 선: 끝점·꺾인 점(22px)이 먼저, 아니면 선 위(14px)
  const X = x * b.width, Y = y * b.height, ms = posMarks().filter(m => m.line); let best = null;
  for (const m of ms) m.line.forEach((q, i) => { const d = Math.hypot(q[0] * b.width - X, q[1] * b.height - Y); if (d <= 22 && (!best || d < best.d)) best = { id: m.id, mode: "pt", i, d } });
  if (best) return best;
  for (const m of ms) for (let i = 1; i < m.line.length; i++) { const d = segD(m.line[i - 1][0] * b.width, m.line[i - 1][1] * b.height, m.line[i][0] * b.width, m.line[i][1] * b.height, X, Y); if (d <= 14 && (!best || d < best.d)) best = { id: m.id, mode: "mv", d } }
  return best;
}
function lineDone(pts, cx, cy) {                     // 긋던 것을 표시로 남긴다. 선은 곧바로 이름 창을 띄운다(창을 닫아도 선은 남는다 — 지우려면 ‘삭제’나 Ctrl+Z). 직접 그린 모양은 ‘위치·가구 표시’로 돌아가 고른 채로 둔다
  const dr = LINE_DRAFT || {}, cl = dr.close, p = pts.map(q => [rd4(q[0]), rd4(q[1])]).filter((q, i, a) => !i || q[0] !== a[i - 1][0] || q[1] !== a[i - 1][1]);
  if (p.length < (cl ? 3 : 2)) { toast(cl ? "점을 3개 이상 찍어야 모양이 됩니다." : "점을 두 개 이상 찍어야 선이 됩니다. 끝점을 눌러 주세요."); return }
  if (cl && polyCross(p)) { toast("선이 서로 엇갈렸습니다. 둘레를 따라 차례대로 찍어야 합니다. ‘방금 찍은 점 지우기’로 고쳐 주세요."); return }
  const m = { id: "m" + Date.now(), step: POS, lid: "", t: cl ? cl.t : "선", memo: cl ? cl.memo || "" : "", dim: cl ? cl.dim || "" : "", img: !!E.planImg }; LINE_DRAFT = null; E.marks = E.marks || [];
  if (cl) { m.shape = [p]; m.sk = "free"; if (cl.col) m.col = cl.col; const mid = polyMid(p); markRoomSet(m, mid[0], mid[1]); E.marks.push(m); BASE_MODE = "pos"; SH_SEL = m.id; refresh(); toast(`‘${m.t}’ 모양을 그렸습니다. 끌어서 옮기고, 모서리 동그라미로 다듬을 수 있습니다. (Ctrl+Z 되돌리기)`); return }
  m.line = p; E.marks.push(m); refresh(); openMarkPop(m, true, cx, cy);
}
document.addEventListener("pointerdown", ev0 => {
  const sv = ev0.target.closest && ev0.target.closest("svg[data-planline]"); if (!sv || ev0.button > 0) return;
  const b = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal, x = (ev0.clientX - b.left) / b.width, y = (ev0.clientY - b.top) / b.height, hit = lineDraft() || (LINE_DRAFT && LINE_DRAFT.close) ? null : lineHit(x, y, b), m = hit && (E.marks || []).find(q => q.id === hit.id);
  const el = document.createElementNS("http://www.w3.org/2000/svg", "polyline"); for (const [k, v] of Object.entries({ fill: "none", stroke: m ? markCol(m) : POS_COLOR, "stroke-width": 5, "stroke-dasharray": "9 6", "stroke-linejoin": "round", "stroke-linecap": "round", "pointer-events": "none" })) el.setAttribute(k, v);
  sv.appendChild(el); LN_DRAG = { sv, b, vb, el, mouse: ev0.pointerType === "mouse", hit: m ? hit : null, o: m ? m.line.map(q => [...q]) : null, n: null, x0: x, y0: y, x1: x, y1: y }; closeMarkPop(); ev0.preventDefault();
  try { sv.setPointerCapture(ev0.pointerId) } catch (e) {}
});
document.addEventListener("pointermove", ev0 => {
  const d = LN_DRAG, c = v => Math.min(1, Math.max(0, v));
  if (!d) { if (LINE_DRAFT && ev0.pointerType === "mouse" && ev0.target.closest) { const sv = ev0.target.closest("svg[data-planline]"); if (sv) { const b = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal; polyRb(sv, (ev0.clientX - b.left) / b.width * vb.width, (ev0.clientY - b.top) / b.height * vb.height) } } return }
  d.x1 = c((ev0.clientX - d.b.left) / d.b.width); d.y1 = c((ev0.clientY - d.b.top) / d.b.height); const far = Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height), pl = p => d.el.setAttribute("points", p.map(q => q[0] * d.vb.width + "," + q[1] * d.vb.height).join(" "));
  if (d.hit) { if (far < 5) return; const i = d.hit.i, o = d.o;                                           // 그어 둔 선: 점 하나를 끌거나(이웃 점과 거의 가로·세로면 반듯하게) 통째로 옮긴다
    if (d.hit.mode === "pt") { d.n = o.map(q => [...q]); d.n[i] = polySnap([o[i - 1], o[i + 1]].filter(Boolean), d.x1, d.y1, d.b) }
    else { const xs = o.map(q => q[0]), ys = o.map(q => q[1]), dx = Math.min(1 - Math.max(...xs), Math.max(-Math.min(...xs), d.x1 - d.x0)), dy = Math.min(1 - Math.max(...ys), Math.max(-Math.min(...ys), d.y1 - d.y0)); d.n = o.map(q => [q[0] + dx, q[1] + dy]) }
    pl(d.n); return }
  const dr = lineDraft(), [sx, sy] = polySnap(dr ? [dr.pts[dr.pts.length - 1]] : [[d.x0, d.y0]], d.x1, d.y1, d.b);
  if (dr) polyRb(d.sv, sx * d.vb.width, sy * d.vb.height); else if (far >= 12) pl([[d.x0, d.y0], [sx, sy]]);   // 새 선: 찍는 중이면 점선이 따라오고, 처음부터 끌면 두 점짜리 선이 미리 보인다
});
const lnEnd = ev0 => {
  const d = LN_DRAG; if (!d) return; LN_DRAG = null; d.el.remove(); MK_EAT = Date.now(); if (ev0.type !== "pointerup") return;
  const c = v => Math.min(1, Math.max(0, v)); d.x1 = c((ev0.clientX - d.b.left) / d.b.width); d.y1 = c((ev0.clientY - d.b.top) / d.b.height); const far = Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height), px = q => Math.hypot((q[0] - d.x1) * d.b.width, (q[1] - d.y1) * d.b.height);
  if (d.hit) { const m = (E.marks || []).find(q => q.id === d.hit.id); if (!m) return; if (far < 5 || !d.n) { openMarkPop(m, true, ev0.clientX, ev0.clientY); return }   // 누르기만 했다 → 이름을 고치거나 지우는 창
    m.line = d.n.map(q => [rd4(q[0]), rd4(q[1])]); refresh(); return }
  let dr = lineDraft(); const cl = LINE_DRAFT && LINE_DRAFT.close;
  if (!dr && !cl && far >= 12) { lineDone([[d.x0, d.y0], polySnap([[d.x0, d.y0]], d.x1, d.y1, d.b)], ev0.clientX, ev0.clientY); return }   // 끌어서 한 번에 그은 선
  if (!dr) dr = LINE_DRAFT = { src: E.planImg || "", pts: [], t: 0, ...(cl ? { close: cl } : {}) }; const pts = dr.pts, now = Date.now();
  if (pts.length > 2 && px(pts[0]) <= closeR(d)) { if (cl) lineDone(pts, ev0.clientX, ev0.clientY); else if (shapeOk(pts)) openRoomPop(pts, "line", ev0.clientX, ev0.clientY, ""); return }   // 처음 찍은 점을 다시 눌렀다 → 모양 닫기. (v68) 그냥 긋던 선도 처음 점으로 돌아오면 닫힌 모양이 되고, 어느 방인지 고르는 창이 뜬다 (전에는 점이 겹쳐 찍히지도 닫히지도 않았다)
  if (pts.length && px(pts[pts.length - 1]) <= 8) { if (pts.length > (cl ? 2 : 1) && now - dr.t < 600) lineDone(pts, ev0.clientX, ev0.clientY); return }   // 끝점을 한 번 더 눌렀다 → 끝내기 (천천히 누른 것은 겹쳐 찍지 않는다)
  const [x, y] = polySnap([pts[pts.length - 1], (cl || pts.length > 1) && pts[0]].filter(Boolean), d.x1, d.y1, d.b).map(rd4); if (pts.some(q => q[0] === x && q[1] === y)) return;
  pts.push([x, y]); dr.t = now; renderInfo();
};
document.addEventListener("pointerup", lnEnd); document.addEventListener("pointercancel", lnEnd);
document.addEventListener("click", ev0 => {          // 위치·선 표시의 단추들: 목록의 ‘고치기’ · 고른 모양 돌리기·뒤집기 · 선 끝내기·점 지우기·그리기 취소
  const t = ev0.target; if (!t.closest) return; const ed = t.closest("[data-markedit]"), sm = SH_SEL && (E.marks || []).find(q => q.id === SH_SEL);
  if (ed) { const m = (E.marks || []).find(q => q.id === ed.dataset.markedit); if (m) openMarkPop(m, true, ev0.clientX - 150, ev0.clientY - 200); return }
  if (t.closest("[data-shturn]")) { if (sm) { shapeTurn(sm); refresh() } return }
  if (t.closest("[data-shflip]")) { if (sm) { shapeTurn(sm, true); refresh() } return }
  if (t.closest("[data-linedone]")) { const dr = lineDraft(); if (dr) { lineDone(dr.pts, innerWidth / 2 - 150, innerHeight / 2 - 160); renderInfo() } return }
  if (t.closest("[data-lineback]")) { const dr = lineDraft(); if (dr) { dr.pts.pop(); renderInfo() } return }
  if (t.closest("[data-linecancel]")) { const cl = LINE_DRAFT && LINE_DRAFT.close; LINE_DRAFT = null; if (cl) BASE_MODE = "pos"; renderInfo(); toast("그리던 것을 버렸습니다."); return }
});
document.addEventListener("keydown", ev0 => {        // 위치·선 표시 글쇠: (긋는 중) Enter 끝내기 · Backspace·Ctrl+Z 방금 찍은 점 지우기 · Esc 그리기 취소 / (모양을 골랐을 때) Delete 지우기 · Esc 고른 것 풀기
  if (ROOM_DRAFT) return; const md = LINE_DRAFT ? "line" : SH_SEL && !MARK_DRAFT ? "sh" : ""; if (!md || !document.querySelector(md === "line" ? "svg[data-planline]" : `svg[data-plan="${POS}"]`)) return;
  const el = document.activeElement; if (el && (/TEXTAREA|SELECT/.test(el.tagName) || el.isContentEditable || (el.tagName === "INPUT" && !["checkbox", "radio", "button", "file"].includes(el.type)))) return;
  const k = ev0.key, z = (ev0.ctrlKey || ev0.metaKey) && !ev0.altKey && !ev0.shiftKey && k.toLowerCase() === "z", dr = lineDraft();
  if (md === "line") { if (k === "Escape") { const cl = LINE_DRAFT.close; LINE_DRAFT = null; if (cl) BASE_MODE = "pos"; renderInfo() }
    else if (dr && (k === "Backspace" || z)) { ev0.preventDefault(); ev0.stopPropagation(); dr.pts.pop(); renderInfo() }   // 긋는 중의 Ctrl+Z 는 방금 찍은 점만 지운다
    else if (dr && k === "Enter") { ev0.preventDefault(); lineDone(dr.pts, innerWidth / 2 - 150, innerHeight / 2 - 160); renderInfo() } }
  else if (k === "Escape") { SH_SEL = null; renderInfo() }
  else if (k === "Delete" || k === "Backspace") { const m = (E.marks || []).find(q => q.id === SH_SEL); if (m) { ev0.preventDefault(); E.marks = E.marks.filter(q => q !== m); SH_SEL = null; refresh(); toast(`‘${m.t}’ 모양을 지웠습니다. (Ctrl+Z 되돌리기)`) } }
}, true);
function mkNear(svg, cx, cy, r) {                    // (v62) 누른 자리에서 화면 거리로 가장 가까운 이름표 (r px 안). 휴대폰에서는 이름표가 손가락보다 작다
  let best = null, bd = r;
  for (const el of svg.querySelectorAll("g[data-mk]")) { const b = el.getBoundingClientRect(), d = Math.hypot(Math.max(b.left - cx, 0, cx - b.right), Math.max(b.top - cy, 0, cy - b.bottom)); if (d < bd) { bd = d; best = el } }
  return best;
}
function posMove(mk, dx, dy) {                       // (v62) 위치 표시를 끌어 옮긴다: 찍은 자리(점)째로 옮겨진다. 약식 도면은 ‘어느 방의 어디’로 적으므로 방 밖에 놓으면 옮기지 않는다 → 옮겼으면 true
  const g = planGeom(), c = v => Math.round(Math.min(1, Math.max(0, v)) * 1e4) / 1e4; let ax, ay;
  if (mk.img) { ax = mk.x * g.vw + dx; ay = mk.y * g.vh + dy }
  else { const r0 = g.L && markRect(mk, g); if (!r0) return false; ax = PPAD + (r0.x + (mk.rx ?? 0.5) * r0.w) * PK + dx; ay = PPAD + (r0.y + (mk.ry ?? 0.5) * r0.h) * PK + dy }
  const r = rectAt(g, ax, ay); if (!mk.img && !r) { toast("방 안쪽에 놓아 주세요."); return false }
  if (mk.img) { mk.x = c(ax / g.vw); mk.y = c(ay / g.vh) }
  if (r) Object.assign(mk, { room: r.s.id, rk: r.k, rx: c((ax - PPAD - r.x * PK) / (r.w * PK)), ry: c((ay - PPAD - r.y * PK) / (r.h * PK)) }); else { delete mk.room; delete mk.rk }
  return true;
}
document.addEventListener("pointerdown", ev0 => {
  if (!ev0.target.closest || ev0.button > 0 || SH_DRAG) return; let el = ev0.target.closest("g[data-mk]"), near = false;   // (고른 모양의 손잡이를 잡았으면 이름표는 건드리지 않는다)
  if (!el) { const sv = ev0.target.closest(`svg[data-plan="${POS}"]`); el = sv && mkNear(sv, ev0.clientX, ev0.clientY, ev0.pointerType === "mouse" ? 6 : 18); near = !!el }   // 위치 표시: 조금 빗나가게 눌러도 그 이름표를 잡는다
  if (!el) return;
  const svg = el.closest("svg"), b = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, rc = el.querySelector("rect");
  MK_DRAG = { id: el.dataset.mk, el, b, vb, near, x0: ev0.clientX, y0: ev0.clientY, cx: +rc.getAttribute("x") + rc.getAttribute("width") / 2, cy: +rc.getAttribute("y") + rc.getAttribute("height") / 2, zoom: !!ev0.target.closest("[data-mkz]"), moved: false, s: 1, dx: 0, dy: 0 };
  ev0.preventDefault(); try { el.setPointerCapture(ev0.pointerId) } catch (e) {}
});
document.addEventListener("pointermove", ev0 => {
  const d = MK_DRAG; if (!d) return; const kx = d.vb.width / d.b.width, ky = d.vb.height / d.b.height;
  if (!d.moved && Math.hypot(ev0.clientX - d.x0, ev0.clientY - d.y0) < 5) return; d.moved = true;
  if (d.zoom) { const ccx = d.b.left + d.cx / kx, ccy = d.b.top + d.cy / ky, mk = (E.marks || []).find(q => q.id === d.id), s0 = Math.min(4, Math.max(0.4, +(mk || {}).sc || 1));
    d.s = Math.min(4 / s0, Math.max(0.4 / s0, Math.hypot(ev0.clientX - ccx, ev0.clientY - ccy) / Math.max(4, Math.hypot(d.x0 - ccx, d.y0 - ccy))));
    d.el.setAttribute("transform", `translate(${d.cx} ${d.cy}) scale(${d.s.toFixed(3)}) translate(${-d.cx} ${-d.cy})`) }
  else { d.dx = (ev0.clientX - d.x0) * kx; d.dy = (ev0.clientY - d.y0) * ky; d.el.setAttribute("transform", `translate(${d.dx.toFixed(1)} ${d.dy.toFixed(1)})`) }
});
const mkEnd = ev0 => {
  const d = MK_DRAG; if (!d) return; MK_DRAG = null; MK_EAT = Date.now();
  const mk = (E.marks || []).find(q => q.id === d.id); if (!mk) return;
  if (ev0.type === "pointercancel" && d.near) { d.el.removeAttribute("transform"); return }   // 이름표 옆을 잡고 화면을 민 것 — 옮기지 않는다
  if (!d.moved) { if (ev0.type === "pointerup") openMarkPop(mk, true, ev0.clientX, ev0.clientY); return }
  if (d.zoom) mk.sc = Math.round(Math.min(4, Math.max(0.4, (+mk.sc || 1) * d.s)) * 100) / 100;
  else if (mk.step === POS) { if (!posMove(mk, d.dx, d.dy)) { d.el.removeAttribute("transform"); return } }
  else { const c = v => Math.round(Math.min(1, Math.max(0, v)) * 1e4) / 1e4; mk.lx = c((d.cx + d.dx) / d.vb.width); mk.ly = c((d.cy + d.dy) / d.vb.height) }
  refresh();
};
document.addEventListener("pointerup", mkEnd); document.addEventListener("pointercancel", mkEnd);
document.addEventListener("click", ev0 => { if (MK_EAT && Date.now() - MK_EAT < 500 && ev0.target.closest && ev0.target.closest("svg[data-plan],svg[data-planline]")) { MK_EAT = 0; ev0.stopPropagation(); ev0.preventDefault() } }, true);
let MARK_DRAFT = null;
const closeMarkPop = () => { const p = document.getElementById("markPop"); if (p) p.remove(); MARK_DRAFT = null };
function openMarkPop(m, edit, cx, cy, at) {          // at = 누른 자리(도면 비율): 위치 표시를 새로 만들 때 고른 모양을 그 자리에 놓는다
  closeMarkPop(); MARK_DRAFT = { m: { ...m }, edit, at };
  const pos = m.step === POS, ln = pos && !!m.line, sh = pos && !!m.shape, items = pos ? [] : stepItems(m.step), nw = innerWidth < 520, pw = nw ? innerWidth - 16 : 300, left = nw ? 8 : Math.max(8, Math.min(cx + 14, innerWidth - 316)), top = Math.max(8, Math.min(cy + 14, innerHeight - 290));   // 좁은 화면(휴대폰)에서는 창을 화면 폭에 맞춘다 — 이름 단추가 한 줄에 더 들어가 창이 짧아진다
  const more = (pos ? inp0("mpNote", "메모 (예: 상판 인조대리석 / 기존 것 재사용)", m.memo || "") : "") + inp0("mpDim", pos ? "크기 (예: ㄱ자 2400×1800 mm)" : "치수 (예: 3400×1200) — 실장만 보임, 고객 견적서에는 안 나옴", m.dim || "", true, pos);
  const inp = (id, ph, v, dash) => inp0(id, ph, v, dash, pos);
  const pick = ln ? `<div class="layers pre">${LINE_PRE.map(([k, c]) => `<button type="button" data-mppre="${k}" aria-pressed="${m.t === k}"><i style="background:${c}"></i>${k}</button>`).join("")}</div>`   // (v62) 선: 이름을 누르면 그 색으로 바로 저장
    : pos ? `<div class="note" style="margin:0 0 2px"><b>가구·큰 설비</b>${edit ? "" : " — 이름을 누른 뒤 아래에서 <b>모양</b>을 고르세요"}</div><div class="layers pre">${Object.keys(POS_BIG).filter(k => !POS_ROOM.includes(k)).map(k => `<button type="button" data-mpbig="${k}" aria-pressed="${!m.only && m.t === k}">${k}</button>`).join("")}</div>
      <div class="note" style="margin:6px 0 2px"><b>방 목록에 없는 공간</b> — 자리와 이름만 표시합니다${edit ? "" : " (네모 · 직접 그리기)"} · 금액에도 넣으려면 ‘현장 정보 → 공간 → 추가 공간’에서 넣으세요</div><div class="layers pre">${POS_ROOM.map(k => `<button type="button" data-mpbig="${k}" aria-pressed="${!m.only && m.t === k}">${k}</button>`).join("")}</div>
      ${sh ? "" : `<div class="note" style="margin:6px 0 2px"><b>자리만 찍는 것</b> — 누르면 바로 저장</div><div class="layers pre">${POS_PRE.map(k => `<button type="button" data-mppre="${k}" aria-pressed="${!m.only && m.t === k}">${k}</button>`).join("")}</div>`}`
    : items.length ? `<div class="note" style="margin-bottom:4px">무슨 공사인지 고르세요 (메모만 적어도 됩니다)</div><div class="layers" style="max-height:132px;overflow:auto">${items.map(l => `<button type="button" data-mpick="${l.id}" aria-pressed="${m.lid === l.id}">${esc(lineLabel(l))}</button>`).join("")}</div>` : '<div class="note">이 공정에 체크한 공사가 없습니다. 메모만 남길 수 있습니다.</div>';
  document.body.insertAdjacentHTML("beforeend", `<div id="markPop" class="card" style="position:fixed;left:${left}px;top:${top}px;z-index:80;width:${pw}px;max-height:calc(100vh - 16px);overflow:auto;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.3)">
    <div style="font-weight:700;margin-bottom:6px">${ln ? "무슨 선인가요?" : pos ? (edit ? (sh ? "모양 표시 고치기" : "위치 표시 고치기") : "여기에 무엇이 있나요?") : edit ? "표시 고치기" : "여기에 표시"} <span class="note">${ln ? "" : esc(markWhere(m))}</span></div>
    ${pick}
    ${inp("mpMemo", ln ? "직접 적기 (예: 에어컨 배관)" : pos ? "이름 직접 적기 (예: 보조 주방 / 우수관)" : "메모 (예: TV 벽만 / 색상 화이트)", m.only || (ln && m.t === "선") ? "" : m.lid ? m.memo || "" : m.t || "")}
    ${pos && !ln && !edit ? `<div class="note" style="margin:8px 0 2px"><b>모양</b> — 누르면 그 모양으로 놓입니다 (놓은 뒤 끌어서 맞춥니다)</div><div class="layers pre"><button type="button" data-mpshape="">점만 찍기</button>${POS_SHAPES.map(([k, lb]) => `<button type="button" data-mpshape="${k}">${lb}</button>`).join("")}</div>` : ""}
    ${pos && !ln && !edit ? `<details style="margin-top:6px"><summary class="note" style="cursor:pointer;padding:8px 0">메모·크기도 적기 (나중에 목록의 ‘고치기’로 적어도 됩니다)</summary>${more}</details>` : more}
    <div class="toolbar" style="margin-top:8px"><button type="button" class="btn primary sm" data-mpsave>저장 (Enter)</button>${edit ? '<button type="button" class="btn sm" data-mpdel style="color:var(--warn)">삭제</button>' : ""}${edit && (m.lx !== undefined || m.sc) ? '<button type="button" class="btn sm" data-mpreset>자리·크기 원래대로</button>' : ""}<button type="button" class="btn sm" data-mpcancel>${ln ? "닫기" : "취소"}</button></div></div>`);
  const pe = $("#markPop"); pe.style.top = Math.max(8, Math.min(top, innerHeight - pe.offsetHeight - 8)) + "px";   // 창이 화면 아래로 넘치지 않게 (창 높이는 내용에 따라 다르다)
  if (!pos || matchMedia("(pointer:fine)").matches) $("#mpMemo").focus();   // 휴대폰에서는 글자판이 올라와 이름 단추를 가리므로, 위치 표시 창은 칸을 누를 때만 글자판을 띄운다
}
const inp0 = (id, ph, v, dash, big) => `<input id="${id}" style="width:100%;margin-top:6px;padding:${big ? 9 : 7}px 9px;border:1px ${dash ? "dashed" : "solid"} var(--line);border-radius:8px;font:inherit" placeholder="${ph}" value="${esc(v)}">`;   // 표시 창의 글 칸
function markPopSave(kind) {                         // kind = 위치 표시를 새로 만들 때 고른 모양 (I 일자 · L ㄱ자 · U ㄷ자 · 11 · box 네모 · free 직접 그리기). 없으면 점
  const d = MARK_DRAFT; if (!d) return; const memo = $("#mpMemo").value.trim(), l = d.m.lid ? lineById(d.m.lid) : null, pos = d.m.step === POS, fig = pos && (d.m.line || d.m.shape);
  const dim = $("#mpDim").value.trim(), note = pos && $("#mpNote") ? $("#mpNote").value.trim() : "";
  if (kind && !memo) { toast("먼저 이름을 고르거나 적어 주세요."); return }
  if (!l && !memo && !dim && !fig) { toast(pos ? "이름을 고르거나 적어 주세요." : "공사를 고르거나 메모·치수를 적어 주세요."); return }
  const m = { ...d.m, lid: l ? l.id : "", t: l ? lineLabel(l) : (memo || (d.m.line ? "선" : d.m.shape ? "모양" : "치수")), memo: l ? memo : note, dim, only: !l && !memo && !fig }; E.marks = E.marks || [];
  if (pos && !d.m.line) { if (POS_ROOM.includes(m.t)) m.col = POS_ROOM_COL; else delete m.col }   // 공간 이름(보조 주방·다용도실…)은 가구·설비와 다른 색으로
  if (kind === "free") {                             // (v62) 직접 그리기: ‘선 표시’ 화면으로 넘어가 모서리를 차례로 찍는다 (닫으면 lineDone 이 모양 표시로 남긴다)
    closeMarkPop(); LINE_DRAFT = { src: E.planImg || "", pts: [], t: 0, close: { t: m.t, memo: m.memo, dim: m.dim, col: m.col } }; BASE_MODE = "line"; SH_SEL = null; renderInfo();
    toast(`‘${m.t}’ 모양의 모서리를 차례로 누르세요. 처음 찍은 점을 다시 누르면 닫힙니다. (그만두려면 ‘그리기 취소’)`); return;
  }
  if (kind) {                                        // (v62) 모양으로 놓기: 가구 치수 목록(E.furn)에 같은 가구의 가로·깊이가 있으면 그 크기로, 없으면 흔한 크기로
    const big = POS_BIG[m.t], fr = big && big[0] ? (E.furn || []).find(f => f.lid === big[0] && +f.w > 0) : null, W = fr ? fr.w / 1000 : big ? big[1] : 1.2, D = fr && +fr.d > 0 ? fr.d / 1000 : big ? big[2] : 0.6, at = d.at || [0.5, 0.5];
    for (const k of ["x", "y", "rx", "ry", "side"]) delete m[k]; m.shape = shapeMake(kind, at[0], at[1], W, D, planGeom()); m.sk = kind; if (fr && !m.dim) m.dim = `${fr.w}×${Math.round(D * 1000)}`;
    E.marks.push(m); SH_SEL = m.id; closeMarkPop(); refresh();
    toast(`‘${m.t}’ ${(POS_SHAPES.find(q => q[0] === kind) || [])[1] || ""} 모양을 놓았습니다. 끌어서 옮기고, 모서리 동그라미를 끌어 크기를 맞추세요.${fr ? " (가구 치수 목록에 적은 가로·깊이를 썼습니다)" : ""}`); return;
  }
  if (d.edit) E.marks = E.marks.map(q => q.id === m.id ? m : q); else E.marks.push(m);
  closeMarkPop(); refresh(); toast(d.m.line && d.m.t === "선" ? `‘${m.t}’ 선으로 표시했습니다. 끝점을 끌어 고치고, 선을 누르면 이름을 바꾸거나 지웁니다.` : fig ? `‘${m.t}’ ${d.m.line ? "선" : "모양"} 표시를 고쳤습니다.` : `${markWhere(m)}에 ‘${m.t}’ ${d.edit ? "고침" : "표시"}`);
}
document.addEventListener("click", ev0 => {
  const t = ev0.target, d = MARK_DRAFT; if (!d) return;
  const pk = t.closest("[data-mpick]"); if (pk) { d.m.lid = d.m.lid === pk.dataset.mpick ? "" : pk.dataset.mpick; document.querySelectorAll("#markPop [data-mpick]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mpick === d.m.lid)); return }
  const pre = t.closest("[data-mppre]"); if (pre) { const lp = d.m.line && LINE_PRE.find(q => q[0] === pre.dataset.mppre); if (lp) { d.m.col = lp[1]; if (lp[2]) d.m.dash = 1; else delete d.m.dash } $("#mpMemo").value = pre.dataset.mppre; markPopSave(); return }   // 위치 표시: 이름 단추를 누르면 바로 저장 (선은 그 이름의 색으로)
  const big = t.closest("[data-mpbig]"); if (big) { $("#mpMemo").value = big.dataset.mpbig; if (d.edit) { markPopSave(); return }   // 가구·큰 설비: 고칠 때는 이름만 바꾸고, 새로 놓을 때는 이어서 모양을 고르게 한다
    document.querySelectorAll("#markPop [data-mpbig]").forEach(b => b.setAttribute("aria-pressed", b === big)); const sh = document.querySelector("#markPop [data-mpshape]"); if (sh) sh.parentNode.scrollIntoView({ block: "nearest" }); return }
  const shp = t.closest("[data-mpshape]"); if (shp) { markPopSave(shp.dataset.mpshape); return }
  if (t.closest("[data-mpsave]")) { markPopSave(); return }
  if (t.closest("[data-mpreset]")) { const q = (E.marks || []).find(q => q.id === d.m.id); if (q) { delete q.lx; delete q.ly; delete q.sc } closeMarkPop(); refresh(); toast("이름표를 원래 자리·크기로 돌렸습니다."); return }
  if (t.closest("[data-mpdel]")) { E.marks = (E.marks || []).filter(q => q.id !== d.m.id); closeMarkPop(); refresh(); toast("표시를 지웠습니다. (Ctrl+Z 되돌리기)"); return }
  if (t.closest("[data-mpcancel]") || (!t.closest("#markPop") && !t.closest("svg[data-plan]") && !t.closest("[data-markedit]"))) closeMarkPop();
});
document.addEventListener("keydown", ev0 => { if (!MARK_DRAFT) return; if (ev0.key === "Enter" && ["mpMemo", "mpDim", "mpNote"].includes(ev0.target.id)) { ev0.preventDefault(); markPopSave() } else if (ev0.key === "Escape") closeMarkPop() });
document.head.insertAdjacentHTML("beforeend", '<style>#markPop .layers button{opacity:1}#markPop .layers button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}#markPop .layers.pre{margin:2px 0}#markPop .layers.pre button,.pinbar .layers button,.layers.bmode button{min-height:40px;padding:6px 12px;font-size:13px}.layers.bmode button{opacity:1!important}.layers.bmode button[aria-pressed="true"]{box-shadow:0 0 0 2px var(--accent)}.marks .mbt{display:flex;gap:4px}.marks .mbt .btn{min-height:34px}</style>');   // (v62) 도면 아래 단추·위치 이름 단추는 손가락으로 누를 만한 크기로 · 지금 하는 일(진한 단추)만 눈에 띄게, 나머지도 흐리지 않게
document.addEventListener("toggle", ev0 => { if (ev0.target.matches && ev0.target.matches("[data-planbox]")) E.planOpen = ev0.target.open }, true);
document.addEventListener("click", ev0 => {          // 방 영역 지정: 이름 고르기 · 지우기 · 도면 치수로 실측표 채우기
  const t = ev0.target, bs = t.closest("[data-pinsel]");
  if (bs) { PIN_SEL = bs.dataset.pinsel; PIN_EXP = PIN_SEL; PIN_PT = null; renderInfo(); return }   // (v68) 이름을 직접 눌렀다 → 다음에 그리는 모양은 묻지 않고 그 방으로
  if (t.closest("[data-polyarc]")) { polyArc(); return }
  if (t.closest("[data-polyclose]")) { polyClose(); return }
  if (t.closest("[data-polyback]")) { polyBack(); return }
  if (t.closest("[data-polycancel]")) { POLY_DRAFT = null; renderInfo(); return }
  if (t.closest("[data-polyptdel]")) { polyPtDel(); return }
  if (t.closest("[data-pinclear]")) { E.planPins = {}; E.planBox = {}; PIN_SEL = null; refresh(true); return }
  if (t.closest("[data-autozone]")) { if (autoZones()) { PIN_SEL = null; refresh(true); toast("방을 자동으로 다시 나눴습니다. 틀린 곳은 이름을 고르고 그 방을 누르세요.") } else toast("이 도면에서는 방을 자동으로 찾지 못했습니다. 이름을 고르고 끌어서 그려 주세요."); return }
  if (t.closest("[data-pinadd]")) { PIN_ADD = !PIN_ADD; renderInfo(); return }
  if (t.closest("[data-pindel]")) { const s0 = pinCur(); if (s0 && E.planBox) { delete E.planBox[s0]; refresh(true) } return }
  if (t.closest("[data-scfill]")) {
    const id = $("#scRoom").value, len = +$("#scLen").value, b0 = (E.planBox || {})[id]; if (!b0 || !(len > 0)) { toast("기준 방을 고르고 그 방의 가로 길이(m)를 넣으세요."); return }
    const g = planGeom(), k = len / (b0.w * g.vw), r2 = v => Math.round(v * 100) / 100; E.dim = E.dim || {}; let n = 0;
    for (const [rid, b] of Object.entries(E.planBox)) { E.dim[rid] = b.poly ? (p => ({ a: r2(polyArea(p)), p: r2(polyLen(p)) }))(b.poly.map(q => [q[0] * g.vw * k, q[1] * g.vh * k])) : b.more && b.more.length ? { a: r2([b, ...b.more].reduce((a, q) => a + q.w * g.vw * k * q.h * g.vh * k, 0)) } : { w: r2(b.w * g.vw * k), d: r2(b.h * g.vh * k) }; n++ }
    E.dimOpen = true; refresh(true); toast(`방 ${n}곳의 가로·세로를 실측표에 넣었습니다. 아래 ‘실측표’에서 확인하고 고칠 수 있습니다.`);
  }
});
let BOX_DRAG = null;                                 // 올린 도면에서 방 네모를 끌어 그리는 중 (edit 가 있으면 그려 둔 네모를 옮기거나 크기를 바꾸는 중)
/* (v60) 그려 둔 방 네모 고치기: 고른 방의 네모마다 모서리 넷(크기) · 가운데 손잡이(자리) · ✕(그 네모만 지우기). 좌표는 전부 도면 그림의 0~1 비율이다. */
const boxParts = b => [b, ...(b.more || [])];        // 한 방의 네모들 (ㄱ자·ㄷ자 방은 여러 개)
const boxMv = q => [q.x + q.w / 2, q.y + q.h / 2 + Math.min(0.07, q.h * 0.3)];                             // 자리 옮기는 손잡이: 이름표 바로 아래
const boxDel = q => [q.x + q.w - Math.min(0.055, q.w * 0.3), q.y + Math.min(0.055, q.h * 0.3)];             // 그 네모만 지우는 ✕: 오른쪽 위 안쪽
const boxPack = ps => ({ ...rr4(ps[0]), ...(ps.length > 1 ? { more: ps.slice(1).map(rr4) } : {}) });       // 네모들을 저장 모양으로 (자동으로 찾은 칸 표시 rid 는 뗀다 — 손으로 고친 것이다)
const boxAt = (x, y) => (pinList().find(s => { const b = (E.planBox || {})[s.id]; return b && (b.poly ? polyIn(b.poly, x, y) : boxParts(b).some(q => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h)) }) || {}).id || null;   // 그 자리에 있는 방 (점으로 그린 방은 찍은 모양 안쪽)
/* (v62) 점 찍어 그리기: 방 모서리를 차례로 눌러 찍은 모양(poly)이 그 방의 영역이 된다. 고칠 때는 점마다 손잡이(끌기 · 눌러서 고르기), 변 가운데 ＋(점 더하기), 옮기기 · ✕ 는 네모와 같다 */
const polyMv = b => { const [cx, cy] = polyMid(b.poly); return [cx, Math.min(0.98, cy + Math.min(0.07, b.h * 0.3))] };   // 통째로 옮기는 손잡이: 이름표 바로 아래
const polyDel = b => { const [cx, cy] = polyMid(b.poly); return [cx, Math.max(0.02, cy - Math.min(0.07, b.h * 0.3))] };  // 영역을 지우는 ✕: 이름표 바로 위
const polySnap = (nb, x, y, b) => { let bx = 7, by = 7, sx = x, sy = y; for (const q of nb) { const dx = Math.abs(q[0] - x) * b.width, dy = Math.abs(q[1] - y) * b.height; if (dx < bx) { bx = dx; sx = q[0] } if (dy < by) { by = dy; sy = q[1] } } return [sx, sy] };   // 이웃 점과 거의 가로·세로(화면에서 7px 안)면 반듯하게 맞춘다 — 손으로 찍어도 벽이 삐뚤어지지 않게
const polyLong = (a, b) => { const v = imgView(); return Math.hypot((b[0] - a[0]) * v.vw, (b[1] - a[1]) * v.vh) >= 60 };   // 변이 넉넉히 길 때만 가운데에 ＋ 를 둔다 (둥근 모양처럼 점이 촘촘하면 ＋ 가 점을 가린다)
const roundBox = d => { let w = Math.abs(d.x1 - d.x0) * d.b.width, h = Math.abs(d.y1 - d.y0) * d.b.height; if (Math.abs(w - h) < 0.1 * Math.max(w, h)) w = h = (w + h) / 2;   // 끈 네모 → 그 안의 원·타원 (화면에서 거의 정사각형이면 반듯한 원으로)
  const rx = w / 2 / d.b.width, ry = h / 2 / d.b.height; return { cx: d.x0 + (d.x1 < d.x0 ? -rx : rx), cy: d.y0 + (d.y1 < d.y0 ? -ry : ry), rx, ry } };
function roundPts(e) {                               // 원·타원을 다각형의 점들로: 클수록 점을 더 쓰고(16~40개), 다각형 넓이가 진짜 원·타원 넓이와 같도록 반지름을 아주 조금 키운다
  const v = imgView(), a = e.rx * v.vw, b = e.ry * v.vh, n = 4 * Math.round(Math.min(40, Math.max(16, Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))) / 34)) / 4), k = Math.sqrt(2 * Math.PI / (n * Math.sin(2 * Math.PI / n))), c = t => Math.min(1, Math.max(0, t));
  return Array.from({ length: n }, (_, i) => [c(e.cx + e.rx * k * Math.cos(2 * Math.PI * i / n)), c(e.cy + e.ry * k * Math.sin(2 * Math.PI * i / n))]);
}
function polyArc() {                                 // 고른 점에서 둥글게: 꺾인 모서리면 모서리를 깎아 둥글리고, 곧은 변에서 끌어낸 점이면 앞 점 → 그 점 → 뒤 점을 지나는 원호로 (둥근 벽). 곡선은 점 여러 개로 적는다
  const sel = pinCur(), bx = sel && (E.planBox || {})[sel]; if (!bx || !bx.poly || !PIN_PT || PIN_PT.id !== sel || !bx.poly[PIN_PT.i]) return;
  const { vw, vh } = imgView(), p = bx.poly, n = p.length, i = PIN_PT.i, S = q => [q[0] * vw, q[1] * vh], [ax, ay] = S(p[(i + n - 1) % n]), [mx, my] = S(p[i]), [cx, cy] = S(p[(i + 1) % n]);
  const c01 = t => Math.min(1, Math.max(0, t)), l1 = Math.hypot(ax - mx, ay - my), l2 = Math.hypot(cx - mx, cy - my), put = arc => { const nb = polyPack([...p.slice(0, i), ...arc, ...p.slice(i + 1)]); if (nb.poly.length < 3 || polyCross(nb.poly)) { toast("이대로 둥글게 하면 선이 서로 엇갈립니다. 점을 조금 옮긴 뒤 다시 눌러 주세요."); return }
    E.planBox[sel] = nb; PIN_PT = null; refresh(true); toast(`둥글게 바꿨습니다 (곡선을 점 ${arc.length}개로 그렸습니다). 마음에 안 들면 Ctrl+Z.`) };
  if (l1 > 1 && l2 > 1 && ((ax - mx) * (cx - mx) + (ay - my) * (cy - my)) / (l1 * l2) > -0.866) {   // 꺾인 모서리(150°보다 날카로운 곳)는 모서리를 깎아 둥글린다: 두 변에 닿는 원호 (짧은 변의 45% 지점부터)
    const u1 = [(ax - mx) / l1, (ay - my) / l1], u2 = [(cx - mx) / l2, (cy - my) / l2], dd = Math.min(l1, l2) * 0.45, th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))), bl = Math.hypot(u1[0] + u2[0], u1[1] + u2[1]) || 1, oc = dd / Math.cos(th / 2);
    const ox = mx + (u1[0] + u2[0]) / bl * oc, oy = my + (u1[1] + u2[1]) / bl * oc, rr = dd * Math.tan(th / 2), b1 = Math.atan2(my + u1[1] * dd - oy, mx + u1[0] * dd - ox); let sw = Math.atan2(my + u2[1] * dd - oy, mx + u2[0] * dd - ox) - b1; if (sw > Math.PI) sw -= 2 * Math.PI; if (sw < -Math.PI) sw += 2 * Math.PI;
    const k = Math.max(2, Math.min(10, Math.ceil(Math.abs(sw) / (Math.PI / 12)))); put(Array.from({ length: k + 1 }, (_, j) => [c01((ox + rr * Math.cos(b1 + sw * j / k)) / vw), c01((oy + rr * Math.sin(b1 + sw * j / k)) / vh)])); return }
  const d = 2 * (ax * (my - cy) + mx * (cy - ay) + cx * (ay - my)); if (Math.abs(d) < 1e-6 || segD(ax, ay, cx, cy, mx, my) < 4) { toast("이 점이 앞뒤 점과 거의 한 줄에 있습니다. 점을 둥근 쪽으로 더 끌어낸 뒤 눌러 주세요."); return }   // 거의 곧은 곳에 끌어낸 점(둥근 벽): 앞 점 → 이 점 → 뒤 점을 지나는 원호
  const ux = ((ax * ax + ay * ay) * (my - cy) + (mx * mx + my * my) * (cy - ay) + (cx * cx + cy * cy) * (ay - my)) / d, uy = ((ax * ax + ay * ay) * (cx - mx) + (mx * mx + my * my) * (ax - cx) + (cx * cx + cy * cy) * (mx - ax)) / d, r = Math.hypot(ax - ux, ay - uy);   // (ux, uy) = 세 점을 지나는 원의 가운데
  const T = 2 * Math.PI, nz = v => ((v % T) + T) % T, a0 = Math.atan2(ay - uy, ax - ux), dm = nz(Math.atan2(my - uy, mx - ux) - a0), d1 = nz(Math.atan2(cy - uy, cx - ux) - a0), s1 = dm < d1 ? dm : dm - T, s2 = d1 - dm, c = t => Math.min(1, Math.max(0, t));   // s1 = 앞 점 → 고른 점, s2 = 고른 점 → 뒤 점으로 도는 각 (고른 점을 지나는 쪽으로)
  const sub = (from, sw) => { const k = Math.max(2, Math.min(12, Math.ceil(Math.abs(sw) / (Math.PI / 15)))), o = []; for (let j = 1; j < k; j++) { const a = from + sw * j / k; o.push([c((ux + r * Math.cos(a)) / vw), c((uy + r * Math.sin(a)) / vh)]) } return o };   // 12° 마다 점 하나 (적어도 하나)
  put([...sub(a0, s1), p[i], ...sub(a0 + s1, s2)]);   // 고른 점은 그대로 두고 그 앞뒤를 곡선으로 채운다
}
function polyClose(cx, cy) {                         // 찍은 점들을 방의 영역으로 적는다. (v68) 이름을 직접 눌러 고른 방이 있으면 바로 그 방, 아니면 어느 방인지 묻는 창
  const dr = polyDraft(), sel = pinCur(); if (!dr) return;
  const bx = shapeOk(dr.pts); if (!bx) return;
  if (!sel || sel !== PIN_EXP) { openRoomPop(dr.pts, "zone", cx === undefined ? innerWidth / 2 - 184 : cx, cy === undefined ? innerHeight / 2 - 220 : cy, sel || ""); return }
  E.planBox = E.planBox || {}; E.planBox[sel] = bx; if (E.planPins) delete E.planPins[sel]; POLY_DRAFT = null; PIN_PT = null; PIN_EXP = null;
  const nm = roomName(sel).replace(/ \(.*\)/, ""), next = (pinList().find(s => !E.planBox[s.id]) || {}).id; PIN_SEL = next || sel; refresh(true);
  toast(`‘${nm}’ 영역을 찍은 모양(점 ${bx.poly.length}개)으로 정했습니다. ${next ? `모양을 고치려면 아래에서 ‘${nm}’ 이름을 다시 누른 뒤 점을 끌어 옮기세요.` : "점을 끌어 옮겨 고칠 수 있습니다."} (Ctrl+Z 되돌리기)`);
}
const closeR = d => Math.max(d.mouse ? 14 : 22, 15 * hK() * d.b.width / ((d.vb && d.vb.width) || 800) + 3);   // (v68) 처음 점을 ‘다시 눌렀다’고 보는 거리(화면 px): 그려진 큰 점의 반지름 + 3 (적어도 마우스 14 · 손가락 22)
function polyBack() { const dr = polyDraft(); if (!dr) return; dr.pts.pop(); if (!dr.pts.length) POLY_DRAFT = null; renderInfo() }   // 방금 찍은 점 하나 지우기
function polyTap(d) {                                // 손을 뗀 자리에 점 하나. 처음 찍은 점 가까이(또는 같은 자리를 빨리 두 번)면 모양을 닫는다
  const dr = polyDraft() || (POLY_DRAFT = { src: E.planImg, pts: [], t: 0 }), pts = dr.pts, px = q => Math.hypot((q[0] - d.x1) * d.b.width, (q[1] - d.y1) * d.b.height), now = Date.now();
  const cx = d.b.left + d.x1 * d.b.width, cy = d.b.top + d.y1 * d.b.height;
  if (pts.length > 2 && px(pts[0]) <= closeR(d)) { polyClose(cx, cy); return }   // 처음 점 가까이 — (v68) 화면에 보이는 큰 초록 점 어디를 눌러도 닫힌다 (전에는 마우스 14px 안쪽만이라 도면을 크게 보면 점 가장자리를 눌러도 안 닫혔다)
  if (pts.length && px(pts[pts.length - 1]) <= 8) { if (pts.length > 2 && now - dr.t < 600) polyClose(cx, cy); return }   // 같은 자리를 또 눌렀다: 점을 겹쳐 찍지 않는다
  const [x, y] = polySnap([pts[pts.length - 1], pts[0]].filter(Boolean), d.x1, d.y1, d.b).map(rd4); if (pts.some(q => q[0] === x && q[1] === y)) return;
  pts.push([x, y]); dr.t = now; renderInfo();
}
function polyPtDel() {                               // 고른 점 하나를 뺀다 (세 점은 남아야 모양이다)
  const sel = pinCur(), bx = sel && (E.planBox || {})[sel]; if (!bx || !bx.poly || !PIN_PT || PIN_PT.id !== sel || !bx.poly[PIN_PT.i]) return;
  if (bx.poly.length <= 3) { toast("점이 3개는 있어야 모양이 됩니다. 영역을 지우려면 ✕ 를 누르세요."); return }
  const nb = polyPack(bx.poly.filter((q, i) => i !== PIN_PT.i)); if (nb.poly.length < 3 || polyCross(nb.poly)) { toast("이 점을 빼면 선이 서로 엇갈립니다. 다른 점을 먼저 옮겨 주세요."); return }
  E.planBox[sel] = nb; PIN_PT = null; refresh(true); toast("점 하나를 뺐습니다. (Ctrl+Z 되돌리기)");
}
function polyEditEnd(d) {                            // 점으로 그린 모양을 손잡이로 고친 것을 적는다
  const bx = (E.planBox || {})[d.sel]; if (!bx || !bx.poly) return; const m = d.edit.mode, i = d.edit.i, far = Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height);
  if (m === "del") { if (far > 14) return; delete E.planBox[d.sel]; PIN_PT = null; refresh(true); toast("이 방의 영역을 지웠습니다. 다시 그릴 수 있습니다. (Ctrl+Z 되돌리기)"); return }
  if (far < 5 || !d.np) {                            // 누르기만 했다: 점이면 고르기(한 번 더 누르면 풀기) · 변 가운데 ＋ 면 그 자리에 점 하나
    if (m === "pt") { PIN_PT = PIN_PT && PIN_PT.id === d.sel && PIN_PT.i === i ? null : { id: d.sel, i }; renderInfo() }
    else if (m === "mid") { const p = bx.poly.map(q => [...q]), a = p[i], b = p[(i + 1) % p.length]; p.splice(i + 1, 0, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); E.planBox[d.sel] = polyPack(p); PIN_PT = { id: d.sel, i: i + 1 }; refresh(true); toast("점을 하나 더했습니다. 끌어서 자리를 잡으세요. (Ctrl+Z 되돌리기)") }
    return }
  const nb = polyPack(d.np);
  if (nb.poly.length < 3 || nb.w < 0.03 || nb.h < 0.03) { toast("모양이 너무 작아집니다. 조금 더 크게 잡아 주세요."); return }
  if (polyCross(nb.poly)) { toast("선이 서로 엇갈립니다. 다른 자리에 놓아 주세요."); return }
  E.planBox[d.sel] = nb; if (E.planPins) delete E.planPins[d.sel]; PIN_PT = m === "mv" || nb.poly.length !== d.np.length ? null : { id: d.sel, i: m === "mid" ? i + 1 : i }; refresh(true);
}
document.addEventListener("keydown", ev0 => {        // 점 찍어 그리기 글쇠: Enter 닫기 · Backspace·Ctrl+Z 방금 찍은 점 지우기 · Esc 그리던 것 버리기 · Delete 고른 점 지우기
  if (ROOM_DRAFT) return; if (ZONE_TOOL !== "poly" && !PIN_PT) return; if (!document.querySelector("svg[data-planpin]")) return;
  const el = document.activeElement; if (el && (/TEXTAREA|SELECT/.test(el.tagName) || el.isContentEditable || (el.tagName === "INPUT" && !["checkbox", "radio", "button", "file"].includes(el.type)))) return;   // 글자를 치는 칸에서는 건드리지 않는다
  const dr = polyDraft(), k = ev0.key, z = (ev0.ctrlKey || ev0.metaKey) && !ev0.altKey && !ev0.shiftKey && k.toLowerCase() === "z";
  if (dr && (k === "Backspace" || z)) { ev0.preventDefault(); ev0.stopPropagation(); polyBack() }   // 찍는 중의 Ctrl+Z 는 견적 되돌리기가 아니라 방금 찍은 점만 지운다
  else if (dr && k === "Enter") { ev0.preventDefault(); polyClose() }
  else if (dr && k === "Escape") { POLY_DRAFT = null; renderInfo() }
  else if (!dr && PIN_PT && (k === "Delete" || k === "Backspace")) { ev0.preventDefault(); polyPtDel() }
  else if (!dr && PIN_PT && k === "Escape") { PIN_PT = null; renderInfo() }
}, true);
function boxHit(b0, x, y, bw, bh) {                  // 누른 자리에서 가장 가까운 손잡이 (화면 거리로 재서 손가락으로도 잡힌다). 없으면 null
  let best = null; const tryH = (px, py, r, i, mode) => { const d = Math.hypot((px - x) * bw, (py - y) * bh); if (d <= r && (!best || d / r < best.k)) best = { i, mode, k: d / r } };
  if (b0.poly) { const p = b0.poly; p.forEach((q, i) => { const n = p[(i + 1) % p.length]; tryH(q[0], q[1], 22, i, "pt"); if (polyLong(q, n)) tryH((q[0] + n[0]) / 2, (q[1] + n[1]) / 2, 13, i, "mid") }); tryH(...polyMv(b0), 24, 0, "mv"); tryH(...polyDel(b0), 16, 0, "del"); return best }   // 점으로 그린 방: 점(pt) · 변 가운데 ＋(mid) · 옮기기 · ✕
  boxParts(b0).forEach((q, i) => { for (const [c, cx, cy] of [["nw", q.x, q.y], ["ne", q.x + q.w, q.y], ["sw", q.x, q.y + q.h], ["se", q.x + q.w, q.y + q.h]]) tryH(cx, cy, 22, i, c); tryH(...boxMv(q), 24, i, "mv"); tryH(...boxDel(q), 16, i, "del") });
  return best;
}
document.addEventListener("pointerdown", ev0 => {
  const ps = ev0.target.closest && ev0.target.closest("svg[data-planpin]"); if (!ps) return;
  const b = ps.getBoundingClientRect(), vb = ps.viewBox.baseVal, x = (ev0.clientX - b.left) / b.width, y = (ev0.clientY - b.top) / b.height;
  const sel = pinCur(), free = ZONE_TOOL === "poly" || ZONE_TOOL === "round";
  if (!sel && !(free && (polyDraft() || !boxAt(x, y)))) { const at = boxAt(x, y);   // 모든 방을 지정한 뒤: 고칠 방을 도면에서 바로 눌러 고른다 — (v68) 점·둥근 모양으로는 빈 자리에 새 모양을 그릴 수 있다 (닫은 뒤에 어느 방인지 고른다)
    if (at) { PIN_SEL = at; PIN_EXP = at; PIN_PT = null; renderInfo(); toast(E.planBox[at].poly ? "이 방을 골랐습니다. 점(동그라미)을 끌면 모양이, 가운데 손잡이를 끌면 자리가 바뀝니다. 선 가운데의 ＋를 끌면 점이 더 생깁니다." : "이 방을 골랐습니다. 모서리 동그라미를 끌면 크기가, 가운데 손잡이를 끌면 자리가 바뀝니다. 새로 그리려면 끌어서 네모를 그리세요.") } else toast("모든 방을 지정했습니다. 고치려면 그 방을 누르거나 아래에서 이름을 먼저 누르세요."); return }
  const b0 = (E.planBox || {})[sel], hit = b0 && !polyDraft() ? boxHit(b0, x, y, b.width, b.height) : null, q0 = hit && !b0.poly ? boxParts(b0)[hit.i] : null;   // 점을 찍는 중에는 손잡이를 잡지 않는다 (누르는 곳마다 점)
  const pe = hit && b0.poly ? b0.poly.map(q => [...q]) : null, tap = !hit && ZONE_TOOL === "poly", rnd = !hit && ZONE_TOOL === "round";   // (v62) pe = 점으로 그린 모양을 고치는 중 · tap = 점 찍어 그리기로 점 하나를 찍는 중 · rnd = 둥근 모양을 끌어 그리는 중
  if ((pe || tap || rnd) && ev0.button > 0) return;
  const el = document.createElementNS("http://www.w3.org/2000/svg", pe ? "polygon" : tap ? "circle" : rnd ? "ellipse" : "rect");
  for (const [k, v] of Object.entries(tap ? { r: 10, cx: x * vb.width, cy: y * vb.height, fill: "#ffffff", "fill-opacity": 0.6, stroke: "#2d6a58", "stroke-width": 4, "pointer-events": "none" } : hit ? { fill: "#e0672f", "fill-opacity": 0.18, stroke: "#e0672f", "stroke-width": 3.5, "stroke-dasharray": "10 6", "stroke-linejoin": "round", "pointer-events": "none" } : { fill: "#2d6a58", "fill-opacity": 0.25, stroke: "#2d6a58", "stroke-width": 2.5, "pointer-events": "none" })) el.setAttribute(k, v);
  ps.appendChild(el); BOX_DRAG = { ps, b, vb, el, sel, mouse: ev0.pointerType === "mouse", x0: x, y0: y, x1: x, y1: y, ...(pe ? { edit: hit, pp: pe, np: null } : hit ? { edit: hit, q: { x: q0.x, y: q0.y, w: q0.w, h: q0.h }, n: null } : tap ? { tap } : rnd ? { rnd } : {}) }; ev0.preventDefault();
  try { ps.setPointerCapture(ev0.pointerId) } catch (e) {}
});
const polyRb = (sv, vx, vy) => { const ln = sv && sv.querySelector("[data-polyrb]"); if (ln) { ln.setAttribute("x2", vx); ln.setAttribute("y2", vy) } };   // 마지막으로 찍은 점에서 지금 자리까지의 점선
document.addEventListener("pointermove", ev0 => {
  const d = BOX_DRAG, c = v => Math.min(1, Math.max(0, v));
  if (!d) { if (POLY_DRAFT && ev0.pointerType === "mouse" && ev0.target.closest) { const sv = ev0.target.closest("svg[data-planpin]"); if (sv) { const b = sv.getBoundingClientRect(), vb = sv.viewBox.baseVal; polyRb(sv, (ev0.clientX - b.left) / b.width * vb.width, (ev0.clientY - b.top) / b.height * vb.height) } } return }   // 마우스를 그냥 움직일 때: 다음 선이 어디로 갈지 미리 보여 준다
  d.x1 = c((ev0.clientX - d.b.left) / d.b.width); d.y1 = c((ev0.clientY - d.b.top) / d.b.height);
  if (d.tap) {                                       // (v62) 점 찍는 중: 누른 채 움직이면 찍힐 자리가 따라온다 (손을 뗄 때 찍힌다)
    const dr = polyDraft(), [sx, sy] = polySnap(dr ? [dr.pts[dr.pts.length - 1], dr.pts[0]] : [], d.x1, d.y1, d.b);
    d.el.setAttribute("cx", sx * d.vb.width); d.el.setAttribute("cy", sy * d.vb.height); polyRb(d.ps, sx * d.vb.width, sy * d.vb.height); return;
  }
  if (d.rnd) { const e = roundBox(d); d.el.setAttribute("cx", e.cx * d.vb.width); d.el.setAttribute("cy", e.cy * d.vb.height); d.el.setAttribute("rx", e.rx * d.vb.width); d.el.setAttribute("ry", e.ry * d.vb.height); return }   // (v62) 둥근 모양: 끈 네모 안에 꽉 차는 원·타원
  if (d.pp) {                                        // (v62) 점으로 그린 모양: 점 하나를 끌거나(pt) · 변 가운데에서 새 점을 끌어내거나(mid) · 통째로 옮긴다(mv)
    const m = d.edit.mode, i = d.edit.i, n = d.pp.length; if (m === "del") return;
    if (m === "mv") { const xs = d.pp.map(q => q[0]), ys = d.pp.map(q => q[1]), dx = Math.min(1 - Math.max(...xs), Math.max(-Math.min(...xs), d.x1 - d.x0)), dy = Math.min(1 - Math.max(...ys), Math.max(-Math.min(...ys), d.y1 - d.y0)); d.np = d.pp.map(q => [q[0] + dx, q[1] + dy]) }
    else { const nb = m === "mid" ? [d.pp[i], d.pp[(i + 1) % n]] : [d.pp[(i + n - 1) % n], d.pp[(i + 1) % n]], pt = polySnap(nb, d.x1, d.y1, d.b); d.np = d.pp.map(q => [...q]); if (m === "mid") d.np.splice(i + 1, 0, pt); else d.np[i] = pt }
    d.el.setAttribute("points", d.np.map(q => q[0] * d.vb.width + "," + q[1] * d.vb.height).join(" ")); return;
  }
  if (d.edit) {                                      // 그려 둔 네모를 옮기거나(mv) 모서리를 끌어 크기를 바꾸는 중 (맞은편 모서리는 그대로 둔다)
    const q = d.q, m = d.edit.mode; if (m === "del") return;
    if (m === "mv") d.n = { x: Math.min(1 - q.w, Math.max(0, q.x + d.x1 - d.x0)), y: Math.min(1 - q.h, Math.max(0, q.y + d.y1 - d.y0)), w: q.w, h: q.h };
    else { const fx = m[1] === "w" ? q.x + q.w : q.x, fy = m[0] === "n" ? q.y + q.h : q.y; d.n = { x: Math.min(fx, d.x1), y: Math.min(fy, d.y1), w: Math.abs(d.x1 - fx), h: Math.abs(d.y1 - fy) } }
    d.el.setAttribute("x", d.n.x * d.vb.width); d.el.setAttribute("y", d.n.y * d.vb.height); d.el.setAttribute("width", d.n.w * d.vb.width); d.el.setAttribute("height", d.n.h * d.vb.height); return;
  }
  d.el.setAttribute("x", Math.min(d.x0, d.x1) * d.vb.width); d.el.setAttribute("y", Math.min(d.y0, d.y1) * d.vb.height); d.el.setAttribute("width", Math.abs(d.x1 - d.x0) * d.vb.width); d.el.setAttribute("height", Math.abs(d.y1 - d.y0) * d.vb.height);
});
const boxEnd = ev0 => {
  const d = BOX_DRAG; if (!d) return; BOX_DRAG = null; d.el.remove();
  if (d.tap) { if (!ev0 || ev0.type !== "pointerup") return; const c = v => Math.min(1, Math.max(0, v)); d.x1 = c((ev0.clientX - d.b.left) / d.b.width); d.y1 = c((ev0.clientY - d.b.top) / d.b.height); polyTap(d); return }   // (v62) 점 찍어 그리기: 손을 뗀 자리에 점 하나 (끊긴 터치는 찍지 않는다)
  if (d.pp) { polyEditEnd(d); return }               // (v62) 점으로 그린 모양을 고쳤다
  if (d.rnd) {                                       // (v62) 둥근 모양: 원·타원을 점 여러 개의 다각형(poly)으로 적는다 — 넓이·둘레·점 끌기·옮기기는 점으로 그린 모양과 똑같이 된다
    if (ev0 && ev0.type === "pointercancel") return; const e = roundBox(d); if (e.rx * d.b.width < 12 || e.ry * d.b.height < 12) { toast("둥근 곳의 한쪽 끝에서 맞은편 끝까지 끌어서 그려 주세요."); return }
    if (!d.sel || d.sel !== PIN_EXP) { openRoomPop(roundPts(e), "zone", ev0 ? ev0.clientX : innerWidth / 2 - 184, ev0 ? ev0.clientY : innerHeight / 2 - 220, d.sel || ""); return }   // (v68) 이름을 직접 고르지 않았으면 그린 뒤에 어느 방인지 묻는다
    E.planBox = E.planBox || {}; E.planBox[d.sel] = polyPack(roundPts(e)); if (E.planPins) delete E.planPins[d.sel]; PIN_PT = null; PIN_EXP = null;
    const nm = roomName(d.sel).replace(/ \(.*\)/, ""), next = (pinList().find(s => !E.planBox[s.id]) || {}).id; PIN_SEL = next || d.sel; refresh(true);
    toast(`‘${nm}’ 영역을 둥근 모양으로 정했습니다. ${next ? `고치려면 아래에서 ‘${nm}’ 이름을 다시 누르세요.` : "가운데 손잡이로 옮기고, 점을 끌어 다듬을 수 있습니다."} (Ctrl+Z 되돌리기)`); return;
  }
  if (d.edit) {                                      // 손잡이로 고친 것을 적는다
    const bx = (E.planBox || {})[d.sel]; if (!bx) return; const parts = boxParts(bx).map(q => ({ x: q.x, y: q.y, w: q.w, h: q.h })), far = Math.hypot((d.x1 - d.x0) * d.b.width, (d.y1 - d.y0) * d.b.height);
    if (d.edit.mode === "del") { if (far > 14) return; parts.splice(d.edit.i, 1); if (parts.length) E.planBox[d.sel] = boxPack(parts); else delete E.planBox[d.sel]; refresh(true); toast(parts.length ? "그 네모만 지웠습니다. (Ctrl+Z 되돌리기)" : "이 방의 영역을 지웠습니다. 끌어서 다시 그릴 수 있습니다. (Ctrl+Z 되돌리기)"); return }
    if (!d.n || far < 5) return;                     // 손잡이를 누르기만 하고 끌지 않았다
    if (d.n.w < 0.03 || d.n.h < 0.03) { toast("네모가 너무 작습니다. 조금 더 크게 끌어 주세요."); return }
    parts[d.edit.i] = d.n; E.planBox[d.sel] = boxPack(parts); if (E.planPins) delete E.planPins[d.sel]; refresh(true); return;
  }
  const w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0), drawn = rr4({ x: Math.min(d.x0, d.x1), y: Math.min(d.y0, d.y1), w, h }); E.planBox = E.planBox || {};
  if (w < 0.03 || h < 0.03) {                        // 끌지 않고 한 번 눌렀으면: 자동으로 찾은 칸(모양 그대로)을 그 이름으로
    const rg = regionAt(d.x0, d.y0); if (!rg) { toast("자동으로 찾은 칸이 없는 자리입니다. 방의 한쪽 모서리에서 대각선 모서리까지 끌어서 네모로 그려 주세요."); return }
    setZone(d.sel, rg);
  } else if (PIN_ADD && E.planBox[d.sel] && E.planBox[d.sel].poly) { toast("점으로 그린 모양에는 네모를 더할 수 없습니다. 선 가운데의 ＋를 끌어 점을 더해 주세요."); return }
  else if (PIN_ADD && E.planBox[d.sel]) { (E.planBox[d.sel].more = E.planBox[d.sel].more || []).push(drawn); delete E.planBox[d.sel].rid; refresh(true); toast("네모를 더했습니다. 두 네모가 한 방으로 계산됩니다."); return }
  else E.planBox[d.sel] = drawn;
  if (E.planPins) delete E.planPins[d.sel];
  PIN_SEL = (pinList().find(s => !E.planBox[s.id]) || {}).id || null; refresh(true);
};
document.addEventListener("pointerup", boxEnd); document.addEventListener("pointercancel", boxEnd);
let WAIT_CLIP = false, CLIP_PREV = -1;               // 평면도를 찾으러 나간 상태 · 나가기 전에 클립보드에 있던 그림 크기
async function clipImage() {
  if (!navigator.clipboard || !navigator.clipboard.read) return null;
  try { for (const it of await navigator.clipboard.read()) { const tp = it.types.find(t => t.startsWith("image/")); if (tp) return new File([await it.getType(tp)], "clip.png", { type: tp }) } } catch (e) {}
  return null;
}
document.addEventListener("click", async ev0 => {
  if (!ev0.target.closest("[data-planfind]")) return;
  WAIT_CLIP = true; toast("열린 창에서 평면도만 화면 캡처(Win+Shift+S)하고 이 창으로 돌아오면 자동으로 넣습니다. 안 들어가면 Ctrl+V.");
  const f0 = await clipImage(); CLIP_PREV = f0 ? f0.size : -1;
});
window.addEventListener("focus", async () => {
  if (!WAIT_CLIP || !$("#planBase")) return;
  const f0 = await clipImage(); if (!f0 || f0.size === CLIP_PREV) return;   // 새로 캡처한 그림이 있을 때만
  WAIT_CLIP = false; setPlanImage(f0);
});
function setPlanImage(file) {                        // 저장 용량을 위해 긴 변 1100px 로 줄여서 견적 안에 넣는다
  if (!file || !/^image\//.test(file.type || "")) { toast("이미지(사진·캡처)만 넣을 수 있습니다."); return }
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    const k = Math.min(1, 1100 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
    E.planImg = c.toDataURL("image/jpeg", 0.72); E.planImgW = c.width; E.planImgH = c.height; E.planPins = {}; E.planBox = {}; PIN_SEL = null; PIN_EXP = null; delete E.planFit; delete E.planFrom; PLAN_AUTO = E.planImg; URL.revokeObjectURL(url);
    E.step = 0; refresh(true); renderChecklist(); const pb = $("#planBase"); if (pb) pb.scrollIntoView({ block: "center" });
    toast("도면을 넣었습니다. 방을 자동으로 나누는 중…");
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast("이미지를 읽지 못했습니다. 사진(jpg·png) 파일인지 확인하세요.") };
  img.src = url;
}
document.addEventListener("change", ev0 => { const el = ev0.target; if (el.dataset.planimg === undefined) return; const file = el.files[0]; el.value = ""; if (file) setPlanImage(file) });
document.addEventListener("paste", ev0 => {          // 화면 캡처(Win+Shift+S) 후 ‘현장 정보’에서 Ctrl+V
  if (!$("#planBase")) return; const it = [...((ev0.clipboardData || {}).items || [])].find(i => i.type && i.type.startsWith("image/")); if (!it) return;
  ev0.preventDefault(); setPlanImage(it.getAsFile());
});
document.addEventListener("dragover", ev0 => { if ($("#planBase") && ev0.dataTransfer && [...ev0.dataTransfer.types].includes("Files")) ev0.preventDefault() });
document.addEventListener("drop", ev0 => {
  if (!$("#planBase") || !ev0.dataTransfer || !ev0.dataTransfer.files.length) return; const f0 = [...ev0.dataTransfer.files].find(x => /^image\//.test(x.type)); if (!f0) return;
  ev0.preventDefault(); setPlanImage(f0);
});

/* ---------- 엑셀(.xlsx) 견적서 저장 — 설치 없이 브라우저에서 바로 만든다 ---------- */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }
function zipStore(files) {                       // [{name, text}] → Blob (압축 없이 묶은 zip)
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const u16 = n => [n & 255, (n >>> 8) & 255], u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  for (const f of files) {
    const name = enc.encode(f.name), data = enc.encode(f.text), crc = crc32(data);
    const head = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0)];
    parts.push(new Uint8Array(head), name, data);
    cen.push({ name, crc, size: data.length, off }); off += head.length + name.length + data.length;
  }
  let csize = 0; const cstart = off;
  for (const c of cen) {
    const h = [...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(c.crc), ...u32(c.size), ...u32(c.size), ...u16(c.name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(c.off)];
    parts.push(new Uint8Array(h), c.name); csize += h.length + c.name.length;
  }
  parts.push(new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(cen.length), ...u16(cen.length), ...u32(csize), ...u32(cstart), ...u16(0)]));
  return new Blob(parts, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
const xe = s => String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const colL = i => { let s = ""; i++; while (i) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = (i - 1 - r) / 26 } return s };
function xCell(ref, v, st) {                      // v: 빈값 | 숫자 | 글자 | {f: 수식, v: 미리 계산한 값}
  const s = st ? ` s="${st}"` : "";
  if (v && typeof v === "object") return typeof v.v === "number" ? `<c r="${ref}"${s}><f>${xe(v.f)}</f><v>${v.v}</v></c>` : `<c r="${ref}"${s} t="str"><f>${xe(v.f)}</f><v>${xe(v.v)}</v></c>`;
  if (v === null || v === undefined || v === "") return `<c r="${ref}"${s}/>`;
  if (typeof v === "number") return isFinite(v) ? `<c r="${ref}"${s}><v>${v}</v></c>` : `<c r="${ref}"${s}/>`;
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
}
function xSheet(rows, widths, merges, freezeRows, o = {}) {  // rows: [[[값, 서식번호], ...], ...]  o: {fc 고정 열 수, filter 범위, lists [[범위, [값...]]], h1 첫 줄 높이}
  const fc = o.fc || 0;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    + (freezeRows ? `<sheetViews><sheetView workbookViewId="0"><pane${fc ? ` xSplit="${fc}"` : ""} ySplit="${freezeRows}" topLeftCell="${colL(fc)}${freezeRows + 1}" activePane="${fc ? "bottomRight" : "bottomLeft"}" state="frozen"/></sheetView></sheetViews>` : "")
    + `<sheetFormatPr defaultRowHeight="18"/><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols><sheetData>`
    + rows.map((row, r) => `<row r="${r + 1}"${r === 0 && o.h1 ? ` ht="${o.h1}" customHeight="1"` : ""}>${row.map((c, i) => xCell(colL(i) + (r + 1), c[0], c[1])).join("")}</row>`).join("")
    + `</sheetData>` + (o.filter ? `<autoFilter ref="${o.filter}"/>` : "") + (merges && merges.length ? `<mergeCells count="${merges.length}">${merges.map(m => `<mergeCell ref="${m}"/>`).join("")}</mergeCells>` : "")
    + (o.lists ? `<dataValidations count="${o.lists.length}">${o.lists.map(([ref, vals]) => `<dataValidation type="list" allowBlank="1" showErrorMessage="1" errorTitle="입력 확인" error="목록에 있는 값만 넣을 수 있습니다." sqref="${ref}"><formula1>${xe('"' + vals.join(",") + '"')}</formula1></dataValidation>`).join("")}</dataValidations>` : "")
    + `<pageMargins left="0.4" right="0.4" top="0.6" bottom="0.6" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="portrait" fitToHeight="0"/></worksheet>`;
}
// 서식: 1 머리글 · 2 글자 · 3 금액 · 4 공정 제목 · 5 소계 · 6 큰 제목 · 7 굵은 글자 · 8 총액 · 9 수량 · 10 긴 글(줄바꿈)
const X_STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="0.0"/></numFmts>`
  + `<fonts count="5"><font><sz val="10"/><name val="맑은 고딕"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="맑은 고딕"/></font><font><b/><sz val="10"/><name val="맑은 고딕"/></font><font><b/><sz val="20"/><name val="맑은 고딕"/></font><font><b/><sz val="13"/><name val="맑은 고딕"/></font></fonts>`
  + `<fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF2D6A58"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDFEAE3"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF2F3F0"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF6C2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8D9C8"/></patternFill></fill></fills>`
  + `<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFB9BEB8"/></left><right style="thin"><color rgb="FFB9BEB8"/></right><top style="thin"><color rgb="FFB9BEB8"/></top><bottom style="thin"><color rgb="FFB9BEB8"/></bottom><diagonal/></border></borders>`
  + `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="18">`
  + `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>`
  + `<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>`
  + `<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>`
  + `<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>`
  + `<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>`
  + `<xf numFmtId="164" fontId="2" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>`
  + `<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>`
  + `<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>`
  + `<xf numFmtId="164" fontId="4" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>`
  + `<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>`
  + `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`
  // 단가표용: 11 잠금 · 12 입력 글자 · 13 입력 금액 · 14 입력 % · 15 자동 금액 · 16 자동 % · 17 주의
  + [[0, 4], [0, 5], [164, 5], [165, 5], [164, 4], [165, 4], [0, 6]].map(([nf, fill]) => `<xf numFmtId="${nf}" fontId="0" fillId="${fill}" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/>`).join("")
  + `</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
function makeXlsx(sheets) {                        // [{name, xml}]
  const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`;
  const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>${sheets.map((s, i) => `<sheet name="${xe(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets>${sheets.some(s => s.filter) ? `<definedNames>${sheets.map((s, i) => s.filter ? `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${xe(s.name)}'!${s.filter}</definedName>` : "").join("")}</definedNames>` : ""}<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`;
  const rel = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const root = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  return zipStore([{ name: "[Content_Types].xml", text: ct }, { name: "_rels/.rels", text: root }, { name: "xl/workbook.xml", text: wb }, { name: "xl/_rels/workbook.xml.rels", text: rel }, { name: "xl/styles.xml", text: X_STYLES },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, text: s.xml }))]);
}
/* 기존 엑셀 견적서와 같은 짜임: ‘갑지’(공사별 금액·합계·견적조건) + ‘상세견적서’(공사내용·수량·단위·단가·금액·비고, 공정별 소계).
   금액·소계·합계는 수식이라 엑셀에서 수량·단가를 고치면 따라 바뀐다. 관리자 화면에서만 실행단가(원가) 열이 붙는다. */
function buildEstimateXlsx() {
  R = compute();
  const co = D.company || {}, doc = D.doc || {}, info = E.info, adm = isAdmin && !STAFF_DATA;
  const d = [], sub = {}, B = (v, s) => [v, s], pad = (row, st) => { while (row.length < (adm ? 9 : 7)) row.push(B(null, st)); return row };
  d.push(pad(["공사내용", "규격 · 위치", "수량", "단위", "단가", "금액", "비고", ...(adm ? ["실행단가", "예상 실행가"] : [])].map(h => B(h, 1)), 1));
  for (const p of PROCS) {
    let ls = R.lines.filter(l => l.proc === p); if (!ls.length) continue; if (!DOC_EDIT) ls = docRows(ls);
    d.push(pad([B(PROC_LABEL[p], 4)], 4));
    const first = d.length + 1;
    for (const l of ls) {
      const r = d.length + 1, nm = l.docName || aliasOf(l.name);
      d.push(pad([B(custName(nm), 2), B([l.spaceName, custLine(l)].filter(Boolean).join(" · "), 2), B(l.lump ? 1 : l.qty, 9), B(l.lump ? "식" : l.unit, 2),
        B(l.tbd ? null : (l.lump ? l.amt : l.price), 3), B(l.tbd ? "별도 협의" : { f: `C${r}*E${r}`, v: l.amt }, l.tbd ? 9 : 3), B(l.frozen ? "저장 당시 단가" : "", 2),
        ...(adm ? [B(Math.round(l.lump ? l.cost : l.ucost) || null, 3), B({ f: `C${r}*H${r}`, v: Math.round(l.cost) }, 3)] : [])], 2));
      for (const x of l.detail || []) d.push(pad([B("  └ " + x.name, 2), B(detailNote(x), 2), B(x.qty, 9), B(x.unit, 2), B(null, 3), B(null, 3), B("포함", 2)], 2));
    }
    const r = d.length + 1; sub[p] = r;
    d.push(pad([B(PROC_LABEL[p] + " 소계", 5), B(null, 5), B(null, 5), B(null, 5), B(null, 5), B({ f: `SUM(F${first}:F${r - 1})`, v: R.byProc[p].amt }, 5), B(null, 5),
      ...(adm ? [B(null, 5), B({ f: `SUM(I${first}:I${r - 1})`, v: Math.round(R.byProc[p].cost) }, 5)] : [])], 5));
  }
  const subs = Object.values(sub), unit = +D.settings.roundUnit || 10000, vat = D.settings.vat ?? 0.1, biz = +E.biz || 0;
  d.push(pad([], 0));
  const rc = d.length + 1, rb = rc + 1, rj = rc + 2, rn = rc + 3, rv = rc + 4, rt = rc + 5;
  const tot = (label, v, st) => d.push(pad([B(label, 7), B(null, 2), B(null, 2), B(null, 2), B(null, 2), B(v, st || 3), B(null, 2)], 0));
  tot("공사원가", { f: subs.length ? subs.map(r => "F" + r).join("+") : "0", v: R.sum });
  tot("기업이윤", { f: `ROUND(F${rc}*${biz}/100,0)`, v: R.biz });
  tot("절사", { f: `F${rn}-F${rc}-F${rb}`, v: R.cut });
  tot("공사비 합계 (VAT 별도)", { f: `FLOOR(F${rc}+F${rb},${unit})`, v: R.net }, 5);
  tot(`부가세 (${Math.round(vat * 100)}%)`, { f: `ROUND(F${rn}*${vat},0)`, v: R.vat });
  tot("총 합계 (VAT 포함)", { f: `F${rn}+F${rv}`, v: R.total }, 8);
  const xo = R.opt || [], xc = R.cmp || [];   // 옵션 · 비교 견적: 합계 아래에 따로 (위 합계 식에는 들어가지 않는다)
  if (xo.length || xc.length) { d.push(pad([], 0)); d.push(pad([B("옵션 · 비교 견적 (위 합계에 포함되지 않음 · VAT 별도)", 4)], 4)); const o1 = d.length + 1;
    for (const l of xo) { const r = d.length + 1, nm = l.docName || aliasOf(l.name);
      d.push(pad([B("[옵션] " + nm, 2), B([l.spaceName !== "공통공사" ? l.spaceName : "", nm !== l.name ? l.name : "", l.film ? "" : l.note].filter(Boolean).join(" · "), 2), B(l.lump ? 1 : l.qty, 9), B(l.lump ? "식" : l.unit, 2),
        B(l.tbd ? null : (l.lump ? l.amt : l.price), 3), B(l.tbd ? "별도 협의" : { f: `C${r}*E${r}`, v: l.amt }, l.tbd ? 9 : 3), B("별도 (합계 미포함)", 2)], 2)) }
    if (xo.length) { const r = d.length + 1; d.push(pad([B("옵션 합계", 5), B(null, 5), B(null, 5), B(null, 5), B(null, 5), B({ f: `SUM(F${o1}:F${r - 1})`, v: R.optSum }, 5), B(null, 5)], 5));
      d.push(pad([B("옵션을 모두 넣었을 때 공사비 합계", 5), B(null, 5), B(null, 5), B(null, 5), B(null, 5), B({ f: `FLOOR((F${rc}+F${r})*(1+${biz}/100),${unit})`, v: Math.floor((R.sum + R.optSum) * (1 + biz / 100) / unit) * unit }, 5), B(null, 5)], 5)) }
    for (const c of xc) d.push(pad([B("[비교] " + aliasOf(c.label), 2), B(`${aliasOf(c.from)} 대신 ${aliasOf(c.to)}`, 2), B(null, 9), B(null, 2), B(c.diff, 3), B(c.net, 3), B("단가 칸 = 차액 · 금액 칸 = 바꿨을 때 공사비 합계", 2)], 2)) }
  const q = "'상세견적서'!F";
  const g = [], gm = [], line = (t, st) => { g.push([B(t, st === undefined ? 10 : st), B(null, 0), B(null, 0), B(null, 0)]); gm.push(`A${g.length}:D${g.length}`) };
  line("견   적   서", 6); g.push([]);
  g.push([B("제출처", 7), B((info.client || "") + (info.client && !/고객님$/.test(info.client) ? " 고객님" : ""), 2), B("담당자", 7), B(info.manager || co.manager || "", 2)]);
  g.push([B("견적대상", 7), B(info.site || "", 2), B("연락처", 7), B(co.tel || "", 2)]);
  g.push([B("견적일자", 7), B(info.date || "", 2), B("업체명", 7), B(co.name || "시도디자인", 2)]);
  g.push([B("구분", 7), B(`${info.kind} v${info.ver}`, 2), B("규모", 7), B(`공급 ${E.py}평 (${R.S.supplyM2}㎡) · 전용 ${R.S.exclM2}㎡ · 방 ${E.rooms} 욕실 ${E.baths}${bathDocTxt()} 발코니 ${E.balconies}`, 2)]);
  g.push([B("공사기간", 7), B(durTxt(), 2), B("유효기간", 7), B(validTo() + "까지", 2)]);
  g.push([]);
  g.push([B("견적합계 (VAT 포함)", 7), B({ f: q + rt, v: R.total }, 8), B(null, 0), B(null, 0)]); g.push([]);
  g.push(["공사명", "공사내용", "금액", "비고"].map(h => B(h, 1)));
  for (const p of PROCS) if (sub[p]) g.push([B(PROC_LABEL[p], 2), B("상세견적서 참조", 2), B({ f: q + sub[p], v: R.byProc[p].amt }, 3), B("", 2)]);
  for (const [label, r, v, st] of [["공사원가", rc, R.sum], ["기업이윤", rb, R.biz], ["절사", rj, R.cut], ["공사비 합계 (VAT 별도)", rn, R.net, 5], ["부가세", rv, R.vat], ["총 합계 (VAT 포함)", rt, R.total, 8]])
    g.push([B(label, 7), B(null, 2), B({ f: q + r, v }, st || 3), B(null, 2)]);
  if (xo.length) g.push([B(`옵션 ${xo.length}건 (별도 · 합계 미포함)`, 7), B(xo.map(l => aliasOf(l.name) + (l.spaceName && l.spaceName !== "공통공사" ? " · " + l.spaceName : "")).join(", "), 2), B(R.optSum, 3), B("VAT 별도 · 상세견적서 아래 참조", 2)]);
  for (const c of xc) g.push([B("비교 (별도 · 합계 미포함)", 7), B(`${aliasOf(c.from)} 대신 ${aliasOf(c.to)}`, 2), B(c.diff, 3), B(`차액 · 바꿨을 때 공사비 합계 ${won(c.net)}원 (VAT 별도)`, 2)]);
  g.push([]);
  if (info.kind === "가견적") line("※ 본 금액은 현장 실측 전 가견적이며 확정 금액이 아닙니다. 현장 실측 후 확정 견적을 드리며, 확정 견적 금액이 계약 금액이 됩니다.");
  line("견적조건", 7);
  (doc.terms || []).forEach((t, i) => line(`${i + 1}. ${t}`));
  if ((doc.include || []).length) line("포함: " + doc.include.join(" / "));
  if (docExclude(doc).length) line("불포함(별도): " + docExclude(doc).join(" / "));
  if ((doc.payment || []).length) line("대금 지급: " + doc.payment.map(([n, r, w]) => `${n} ${r}% (${w})`).join(" → "));
  if (profitItems().length) line("기업이윤: 공사를 처음부터 끝까지 책임지고 관리하는 비용입니다 — " + profitItems().map(x => x[0]).join(" / "));
  if (E.memo) line("메모: " + E.memo);
  line(`견적 유효기간: ${validTo()}까지 · 면적은 ${R.S.list.some(s => s.measured) ? "실측 치수(입력한 공간)와 평형 추정" : "평형 기준 추정"} · 수량에는 시공에 필요한 여유분이 포함되어 있습니다.`);
  return makeXlsx([{ name: "갑지", xml: xSheet(g, [22, 46, 20, 34], gm) }, { name: "상세견적서", xml: xSheet(d, adm ? [30, 38, 9, 7, 12, 14, 18, 12, 14] : [30, 38, 9, 7, 12, 14, 18], null, 1) }]);
}
function downloadBlob(name, blob) { if (capSave(name, blob)) return; const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500) }
function saveXlsx() {
  try { snapshotPrices(); save(); downloadBlob(`견적서_${(E.info.client || "고객").replace(/[\\/:*?"<>|]/g, "")}_${kindTag()}v${E.info.ver}.xlsx`, buildEstimateXlsx()); if (!DL_CAP) toast("엑셀 견적서를 저장했습니다. 엑셀에서 수량·단가를 고치면 금액이 따라 바뀝니다.") }
  catch (e) { toast("엑셀 파일을 만들지 못했습니다: " + e.message) }
}
document.addEventListener("click", ev0 => { if (ev0.target.closest('[data-act="xlsx"]')) saveXlsx() });

/* ---------- 실장 화면 안내 (원가·마진율은 보여 주지 않는다) ---------- */
function staffNote() {
  const n = R.lines.filter(l => l.manualPrice !== undefined && l.manualPrice !== "" && !l.costInput).length;
  return `<p class="note" style="margin-top:10px">회사 표준 단가(목표 마진 반영)로 계산한 견적입니다.${n ? ` <span class="down">직접 넣은 단가 ${n}건은 관리자 확인이 필요합니다.</span>` : ""}</p>`;
}

/* ---------- 관리자: 단가표 엑셀 받기·올리기 (관리자 로그인 후에만 · 설치 없이 어느 PC에서나) ---------- */
const PT_HEAD = ["id (고치지 마세요)", "공정", "품목", "규격·비고", "단위", "구분", "원가 ★", "출처", "개별 마진 %\n(비우면 공정 기본)", "고정 판매가\n(있으면 이 값)", "적용 마진 %\n(자동)", "판매단가\n(자동)", "과거 견적가", "그룹", "상태", "쓰임"];
const itemState = i => i.tier ? "수량별 고정가 (" + i.tier.map(t => (t[0] === t[1] ? t[0] : t[1] > 90 ? t[0] + "~" : t[0] + "~" + t[1]) + "개 " + Math.round(t[2] / 10000) + "만").join(" · ") + ")" : i.costTable ? "층수 운임표 (자동)" : i.costVar ? "업체 견적 (견적 때 입력)" : i.fixedPrice ? "판매가 고정" : !i.cost ? "★ 단가 미정" : i.src === "추정" ? "★ 추정값 확인" : "";
function buildPriceXlsx() {
  const n = D.catalog.length + 1, r2 = x => Math.round(x * 100) / 100;
  const rows = [PT_HEAD.map(h => [h, 1])];
  D.catalog.forEach((i, k) => {
    const r = k + 2, auto = !!(i.costTable || i.costVar), st = itemState(i), raw = `G${r}/(1-K${r}/100)`;
    rows.push([[i.id, 11], [i.proc, 12], [i.name, 12], [i.spec || "", 12], [i.unit || "", 12], [i.kind || "자재", 12],
      auto ? [null, 11] : [i.cost || null, 13], [i.src || "", 12], [i.margin == null || i.margin === "" ? null : r2(i.margin * 100), 14], [i.fixedPrice || null, 13],
      [{ f: `IF(I${r}="",VLOOKUP(B${r},'공정마진'!$A$2:$B$${PROCS.length + 1},2,FALSE),I${r})`, v: r2(marginOf(i) * 100) }, 16],
      auto ? [i.costTable ? "운임표" : "업체 견적", 11] : [{ f: `IF(N(J${r})>0,J${r},IF(N(G${r})>0,IF(${raw}<10000,ROUND(${raw},-2),ROUND(${raw},-3)),0))`, v: staffPrice(i) }, 15],
      [i.past || null, 15], [i.group || "", 11], [st, st.startsWith("★") ? 17 : 11], [USED.has(i.name) ? "기본 공정" : "추가 품목", 11]]);
  });
  const Bn = (D.analysis || {}).bench || {}, p1 = x => x != null ? Math.round(x * 1000) / 10 : null;
  const m = [["공정", "마진율 % ★", "실적 가중평균 % (참고)", "실적 중앙값 % (참고)", "표본 현장 수"].map(h => [h, 1]),
    ...PROCS.map(p => { const b = Bn[GROUP_OF[p]] || {}; return [[p, 11], [r2((D.margins[p] || 0) * 100), 14], [p1(b.wavg), 16], [p1(b.median), 16], [b.n ?? null, 11]] })];
  const S = D.settings, s = [["항목", "값 ★", "설명"].map(h => [h, 1]),
    [["기업이윤 %", 11], [r2((S.bizProfit ?? 0.07) * 100), 14], ["견적 합계에 더하는 기업이윤 기본값", 2]],
    [["목표 마진 %", 11], [r2((S.targetMargin ?? 0.21) * 100), 14], ["관리자 화면에서 이 값보다 낮으면 빨간색", 2]],
    [["절사 단위 (원)", 11], [S.roundUnit ?? 10000, 13], ["공사비 합계를 이 단위로 버림", 2]],
    [["인건비 여유 인원 (명)", 11], [S.laborBuffer ?? 0, 13], ["인건비 품목에 더하는 여유 인원", 2]]];
  const guide = ["시도디자인 단가표 사용방법", "",
    "1. 노란 칸만 고칩니다. 회색 칸은 자동이거나 참고용이라 고쳐도 반영되지 않습니다.",
    "2. 원가(G열)를 넣으면 판매단가(L열)가 바로 계산됩니다. 판매단가 = 원가 ÷ (1 − 마진율), 1만 원 미만은 100원, 그 이상은 1,000원 단위 반올림.",
    "3. 상태가 ‘★ 단가 미정’, ‘★ 추정값 확인’이고 쓰임이 ‘기본 공정’인 줄부터 채우세요. 필터(▼)로 골라 볼 수 있습니다.",
    "4. 개별 마진(I열)을 비우면 그 공정의 기본 마진율(‘공정마진’ 시트)을 씁니다. 고정 판매가(J열)를 넣으면 그 값으로 팝니다.",
    "5. 새 품목은 맨 아래 빈 줄에 id 를 비운 채 공정·품목·단위·구분·원가를 넣습니다. 품목 이름을 바꾸면 공정 규칙 안의 이름도 함께 바뀝니다. 줄을 지워도 품목은 삭제되지 않습니다.",
    "6. 저장한 뒤 관리자 화면 ‘단가·원가’의 ‘단가표 엑셀 올리기’로 올리면, 바뀐 내용을 먼저 보여 주고 ‘반영’을 눌러야 적용됩니다. 오류가 있으면 반영되지 않습니다.",
    "", `데이터 버전: ${BASE.version}`].map(t => [[t, 0]]);
  return makeXlsx([{ name: "단가표", filter: `$A$1:$P$${n}`, xml: xSheet(rows, [9, 8, 30, 34, 7, 7, 12, 10, 12, 12, 10, 12, 12, 20, 22, 11], null, 1, { fc: 3, h1: 44, filter: `A1:P${n}`, lists: [[`B2:B${n + 500}`, PROCS], [`F2:F${n + 500}`, ["자재", "노무", "경비"]]] }) },
    { name: "공정마진", xml: xSheet(m, [12, 14, 24, 22, 14], null, 1) }, { name: "설정", xml: xSheet(s, [24, 14, 50], null, 1) }, { name: "사용방법", xml: xSheet(guide, [150]) }]);
}
/* xlsx 읽기: zip 을 풀고(브라우저 기본 기능) 시트를 [[칸 값...], ...] 로 만든다 */
async function unzipX(buf) {
  const u = new Uint8Array(buf), dv = new DataView(buf), td = new TextDecoder(), out = {};
  let e = u.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error("엑셀(.xlsx) 파일이 아닙니다");
  let p = dv.getUint32(e + 16, true);
  for (let i = 0, n = dv.getUint16(e + 10, true); i < n; i++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
    const ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
    out[td.decode(u.subarray(p + 46, p + 46 + nl))] = { method, raw: u.subarray(ds, ds + csize) }; p += 46 + nl + el + cl;
  }
  return async name => { const f = out[name]; if (!f) return null; if (f.method === 0) return td.decode(f.raw); return await new Response(new Blob([f.raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text() };
}
async function readXlsx(file) {
  const z = await unzipX(await file.arrayBuffer()), P = t => new DOMParser().parseFromString(t, "application/xml"), kids = (el, n) => [...el.children].filter(c => c.localName === n);
  const siText = si => [...si.children].map(c => c.localName === "t" ? c.textContent : c.localName === "r" ? kids(c, "t").map(x => x.textContent).join("") : "").join("");
  const sst = await z("xl/sharedStrings.xml"), ss = sst ? kids(P(sst).documentElement, "si").map(siText) : [], rels = {}, out = {};
  for (const r of P(await z("xl/_rels/workbook.xml.rels")).documentElement.children) { const t = r.getAttribute("Target"); rels[r.getAttribute("Id")] = t.startsWith("/") ? t.slice(1) : "xl/" + t }
  for (const s of P(await z("xl/workbook.xml")).getElementsByTagName("sheet")) {
    const rows = [], xml = await z(rels[s.getAttribute("r:id")]); if (!xml) continue;
    for (const r of P(xml).getElementsByTagName("row")) {
      const row = [];
      for (const c of kids(r, "c")) {
        let ci = 0; for (const ch of c.getAttribute("r").replace(/\d+/g, "")) ci = ci * 26 + ch.charCodeAt(0) - 64;
        const t = c.getAttribute("t"), vEl = kids(c, "v")[0], isEl = kids(c, "is")[0]; let v = null;
        if (t === "inlineStr") v = isEl ? siText(isEl) : null;
        else if (vEl) { const x = vEl.textContent; v = t === "s" ? ss[+x] : t === "str" ? x : t === "e" ? null : t === "b" ? x === "1" : (x === "" || isNaN(+x) ? x : +x) }
        if (v !== null && v !== "") row[ci - 1] = v;
      }
      rows[+r.getAttribute("r") - 1] = row;
    }
    out[s.getAttribute("name")] = rows;
  }
  return out;
}
const numX = x => { if (x === null || x === undefined || x === "" || typeof x === "boolean") return null; if (typeof x === "number") return x; const m = String(x).replace(/,/g, "").match(/-?\d+(\.\d+)?/); return m ? +m[0] : null };
const txtX = (row, c) => { const v = row[c]; return v === null || v === undefined ? "" : String(v).trim() };
function catalogErrors() {
  const e = [], names = new Set();
  for (const i of D.catalog) {
    const tag = `${i.name} (${i.id})`;
    if (!String(i.name || "").trim()) e.push(`품목 이름이 비었습니다 (id ${i.id})`);
    if (names.has(i.name)) e.push("품목 이름 중복: " + i.name); names.add(i.name);
    if (!PROCS.includes(i.proc)) e.push(`공정이 잘못됨: ${tag} → '${i.proc}' (가능: ${PROCS.join("·")})`);
    if (!["자재", "노무", "경비"].includes(i.kind)) e.push(`구분이 잘못됨: ${tag} → '${i.kind}' (자재·노무·경비 중 하나)`);
    if (!String(i.unit || "").trim()) e.push("단위가 비었습니다: " + tag);
    if (typeof i.cost !== "number" || !(i.cost >= 0)) e.push("원가가 숫자가 아니거나 음수: " + tag);
    if (i.margin != null && i.margin !== "" && !(i.margin >= 0 && i.margin < 0.9)) e.push("개별 마진이 0~90% 범위를 벗어남: " + tag);
  }
  for (const p of PROCS) if (!(D.margins[p] >= 0 && D.margins[p] < 0.9)) e.push("공정 마진율이 0~90% 범위를 벗어남: " + p);
  return e;
}
/* 올린 단가표를 지금 데이터의 복사본에 적용해 보고 (바뀐 내용 · 주의 · 오류)를 돌려준다. 실제 반영은 ‘반영’을 눌렀을 때만. */
function planPriceTable(book) {
  if (!book["단가표"] || !book["공정마진"]) throw new Error("‘단가표’·‘공정마진’ 시트가 없습니다. ‘단가표 엑셀 받기’로 받은 파일인지 확인하세요");
  const keepD = D, next = deep(D), changes = [], warns = [], errs = [], renames = [];
  const before = {}; for (const i of D.catalog) before[i.id] = staffPrice(i);
  const prices = [];
  D = next; indexCatalog();
  try {
    const byId = {}, seen = new Set(); for (const i of D.catalog) byId[i.id] = i;
    const number = (row, c, label, tag, rn) => {
      const raw = row[c]; if (raw === undefined || raw === null || raw === "") return null;
      const v = numX(raw); if (v === null) { errs.push(`${rn}행 ${tag}: ${label} 칸이 숫자가 아닙니다 → '${raw}'`); return null }
      if (typeof raw !== "number") warns.push(`${rn}행 ${tag}: ${label} 칸 '${raw}' 을(를) ${won(v)} (으)로 읽었습니다`); return v;
    };
    book["단가표"].forEach((row, idx) => {
      if (!idx || !row) return; const rn = idx + 1, rid = txtX(row, 0), name = txtX(row, 2); if (!rid && !name) return;
      let it = rid ? byId[rid] : byName[name];
      if (rid && !it) { errs.push(`${rn}행: 모르는 id '${rid}' (id 칸은 고치지 마세요. 새 품목은 id 를 비워 둡니다)`); return }
      if (it && seen.has(it.id)) { errs.push(`${rn}행: 같은 품목이 두 번 나옵니다 → ${it.name}`); return }
      const isNew = !it;
      if (isNew) { let k = D.catalog.length + 1; const nid = () => "x" + String(k).padStart(4, "0"); while (byId[nid()]) k++; it = { id: nid(), proc: "", name, spec: "", unit: "", cost: 0, src: "수정", margin: null, past: null, auto: null, kind: "자재" }; D.catalog.push(it); byId[it.id] = it; byName[name] = it; changes.push(`[새 품목] ${name}`) }
      seen.add(it.id); const tag = it.name;
      if (name && name !== it.name) {
        if (byName[name] && byName[name] !== it) errs.push(`${rn}행: 바꾼 이름 '${name}' 이(가) 이미 있는 품목입니다`);
        else { changes.push(`[이름] ${it.name} → ${name}`); renames.push([it.name, name]); const o = it.name; it.name = name; renameItem(o, name, true); delete byName[o]; byName[name] = it }
      }
      for (const [c, key, label] of [[1, "proc", "공정"], [3, "spec", "규격"], [4, "unit", "단위"], [5, "kind", "구분"]]) {
        let v = txtX(row, c); if (key !== "spec" && !v && !isNew) v = it[key] || "";      // 실수로 지운 칸은 원래 값 유지
        if (v !== (it[key] || "")) { if (!isNew) changes.push(`[${label}] ${tag}: ${it[key] || "(없음)"} → ${v || "(없음)"}`); it[key] = v }
      }
      if (!it.costTable && !it.costVar) {
        const cost = number(row, 6, "원가", tag, rn) || 0, old = +it.cost || 0; let src = txtX(row, 7);
        if (cost !== old) {
          it.cost = cost; if (!isNew) changes.push(`[원가] ${tag}: ${won(old)} → ${won(cost)}`);
          if (old && !isNew && Math.abs(cost - old) > old * 0.3) warns.push(`원가가 30% 넘게 바뀜: ${tag} (${won(old)} → ${won(cost)})`);
          if ((src === "" || src === it.src) && ["추정", "단가 미정", "", null, undefined].includes(it.src)) src = cost ? "수정" : "단가 미정";
        }
        if (src && src !== it.src) it.src = src;
        const fx = number(row, 9, "고정 판매가", tag, rn) || null;
        if (fx !== (it.fixedPrice || null)) { changes.push(`[고정 판매가] ${tag}: ${it.fixedPrice ? won(it.fixedPrice) : "없음"} → ${fx ? won(fx) : "없음"}`); if (fx) it.fixedPrice = fx; else delete it.fixedPrice }
      }
      const mg = number(row, 8, "개별 마진", tag, rn), nm = mg === null ? null : Math.round(mg * 100) / 10000, om = it.margin === "" || it.margin === undefined ? null : it.margin;
      if ((nm === null) !== (om === null) || (nm !== null && Math.abs(nm - om) > 1e-9)) { changes.push(`[개별 마진] ${tag}: ${om === null ? "공정 기본" : r1(om * 100) + "%"} → ${nm === null ? "공정 기본" : mg + "%"}`); it.margin = nm }
    });
    const missing = D.catalog.filter(i => !seen.has(i.id));
    if (missing.length) warns.push(`단가표에 없는 품목 ${missing.length}개는 그대로 두었습니다: ${missing.slice(0, 5).map(i => i.name).join(", ")}${missing.length > 5 ? " 외" : ""}`);
    book["공정마진"].forEach((row, idx) => {
      if (!idx || !row) return; const p = txtX(row, 0); if (!PROCS.includes(p)) return;
      const v = number(row, 1, "마진율", p, idx + 1); if (v === null) { errs.push(`공정마진 ${idx + 1}행: ${p} 마진율이 비었습니다`); return }
      const nv = Math.round(v * 100) / 10000; if (Math.abs(nv - (D.margins[p] || 0)) > 1e-9) { changes.push(`[공정 마진] ${p}: ${r1((D.margins[p] || 0) * 100)}% → ${v}%`); D.margins[p] = nv }
    });
    const keys = { "기업이윤 %": ["bizProfit", 100], "목표 마진 %": ["targetMargin", 100], "절사 단위 (원)": ["roundUnit", 1], "인건비 여유 인원 (명)": ["laborBuffer", 1] };
    (book["설정"] || []).forEach((row, idx) => {
      if (!idx || !row) return; const k = keys[txtX(row, 0)]; if (!k) return; const v = number(row, 1, txtX(row, 0), "설정", idx + 1); if (v === null) return;
      const nv = k[1] === 1 ? v : Math.round(v * 100) / 10000; if (nv !== D.settings[k[0]]) { changes.push(`[설정] ${txtX(row, 0)}: ${D.settings[k[0]]} → ${nv}`); D.settings[k[0]] = nv }
    });
    indexCatalog(); for (const k in fnCache) delete fnCache[k];
    errs.push(...catalogErrors(), ...checkRules());
    for (const i of D.catalog) { const a = before[i.id], b = staffPrice(i); if (a !== undefined && a !== b) prices.push([i.name, a, b]) }
  } finally { D = keepD; indexCatalog(); rebuildUsed(); for (const k in fnCache) delete fnCache[k] }
  return { next, changes, warns, errs, renames, prices };
}
let XL_PLAN = null;
function showPricePlan(p) {
  XL_PLAN = p; const li = a => a.map(x => `<li>${esc(x)}</li>`).join(""), more = (a, n) => a.length > n ? `<li>… 외 ${a.length - n}건</li>` : "";
  $("#xlBox").innerHTML = `<div class="card" style="margin-bottom:12px"><div class="hd"><h2>단가표 엑셀 확인</h2><span class="note">${p.errs.length ? "오류가 있어 반영할 수 없습니다. 엑셀에서 고친 뒤 다시 올리세요." : p.changes.length ? "아래 내용을 확인하고 ‘반영’을 누르세요. 누르기 전에는 아무것도 바뀌지 않습니다." : "바뀐 내용이 없습니다. 엑셀에서 저장했는지 확인하세요."}</span></div><div class="bd">
    ${p.errs.length ? `<h3 class="down">오류 ${p.errs.length}건</h3><ul class="note down">${li(p.errs.slice(0, 40))}${more(p.errs, 40)}</ul>` : ""}
    ${p.changes.length ? `<h3>바뀐 내용 ${p.changes.length}건</h3><ul class="note">${li(p.changes.slice(0, 60))}${more(p.changes, 60)}</ul>` : ""}
    ${p.prices.length ? `<h3>판매단가가 바뀌는 품목 ${p.prices.length}개</h3><ul class="note">${li(p.prices.slice(0, 40).map(([n, a, b]) => `${n}: ${won(a)} → ${won(b)}`))}${more(p.prices, 40)}</ul>` : ""}
    ${p.warns.length ? `<h3>주의 ${p.warns.length}건</h3><ul class="note">${li(p.warns.slice(0, 20))}${more(p.warns, 20)}</ul>` : ""}
    <div class="toolbar" style="margin-top:8px">${!p.errs.length && p.changes.length ? '<button class="btn primary" id="xlApply">반영</button>' : ""}<button class="btn" id="xlCancel">닫기</button></div></div></div>`;
}
/* 실장 쪽에 보내는 값: 계산이 끝난 판매단가만 (원가·마진율 없음) */
function makePub() {
  const prices = {}, vm = {};
  for (const i of D.catalog) { if (i.costTable || i.costVar) vm[i.id] = round3(marginOf(i)); else prices[i.id] = staffPrice(i) }
  return { base: BASE.version, prices, vm, bizProfit: D.settings.bizProfit, laborBuffer: D.settings.laborBuffer ?? 0, updatedAt: Date.now() };
}
document.addEventListener("click", ev0 => {
  if (!isAdmin) return; const b = ev0.target.closest("button"); if (!b) return;
  if (b.id === "xlExport") { try { downloadBlob(`단가표_${BASE.version}.xlsx`, buildPriceXlsx()); toast("단가표를 받았습니다. 노란 칸을 고쳐 저장한 뒤 ‘단가표 엑셀 올리기’로 올리세요.") } catch (e) { toast("단가표를 만들지 못했습니다: " + e.message) } }
  if (b.id === "xlCancel") { XL_PLAN = null; $("#xlBox").innerHTML = "" }
  if (b.id === "xlApply" && XL_PLAN && !XL_PLAN.errs.length) {
    const p = XL_PLAN; XL_PLAN = null; D = p.next; indexCatalog(); rebuildUsed(); for (const k in fnCache) delete fnCache[k];
    for (const [o, n] of p.renames) { for (const x of E.extras || []) if (x.item === o) x.item = n; if (E.floorItem === o) E.floorItem = n; if (E.paperItem === o) E.paperItem = n }
    $("#xlBox").innerHTML = ""; refresh(true); renderPrices(); $("#applyData").click();
    toast(`단가표를 반영하고 이 PC에 저장했습니다 (${p.changes.length}건). 다른 PC·실장에게는 data.js 내보내기로 전달하세요.`);
  }
  if (b.id === "pubFile") { download(`실장단가_${BASE.version}.json`, JSON.stringify(makePub()), "application/json"); toast("실장 URL용 단가 파일을 받았습니다. 실장 견적 URL을 편집 권한 계정으로 열어 ‘관리자 단가 파일 올리기’로 올리세요.") }
});
document.addEventListener("change", async ev0 => {
  const el = ev0.target;
  if (el.id === "xlImport") { const f = el.files[0]; el.value = ""; if (!f || !isAdmin) return; try { showPricePlan(planPriceTable(await readXlsx(f))) } catch (e) { toast("엑셀 파일을 읽지 못했습니다: " + e.message) } }
  if (el.id === "pubUpIn") {     // 실장 URL: 관리자 화면에서 받은 단가 파일을 편집 권한자가 올리면 모든 실장 화면에 적용
    const f = el.files[0]; el.value = ""; if (!f || !SHARED || !SHARED.canEdit) return;
    try {
      const pub = JSON.parse(await f.text());
      if (!pub || !pub.prices || !pub.base) throw new Error("관리자 화면의 ‘실장 URL용 단가 파일 받기’로 받은 파일이 아닙니다");
      if (pub.base !== BASE.version) throw new Error(`데이터 버전이 다릅니다 (파일 ${pub.base} / 이 화면 ${BASE.version})`);
      await SHARED.db.doc("pub/settings").set(pub); applyPub(pub); refresh(); toast("단가를 올렸습니다. 이 주소를 쓰는 실장 화면에 바로 적용됩니다.");
    } catch (e) { toast("올리지 못했습니다: " + (e && e.message || e)) }
  }
});

/* ---------- 회사 저장소: 대표님 PC의 서버(서버\sido_server.py)에서 열었을 때만 켜진다 ----------
   실장은 서버의 첫 화면(/)에서 아이디와 번호로 로그인하면 /s/<로그인 열쇠>/ 로 들어오고 자기 견적만 본다. 관리자(/admin/ + 관리자 키 · 서버 PC에서만)는 전체를 본다. 파일로 열거나 다른 주소에서 열면 꺼져 있고 전과 똑같이 동작한다. */
/* ---------- (v81) 내 견적을 이 기기에 받아 두기: 연결돼 있는 동안 회사에 보관된 내 견적을 이 기기(IndexedDB)에 받아 둔다 ----------
   사용자(2026-11-21): “회사pc가 켜져야 저장된 견적서를 볼 수 있다는 게 별로야 … 자기가 사용했던 혹은 작성, 저장했던 견적서는 계속해서 보이는 방식으로”.
   회사 컴퓨터가 꺼져 있어도 ‘저장된 견적’에 내 견적이 전부 보이고 열린다(마지막으로 연결됐을 때까지의 내용). 다른 기기에서 쓴 견적도 이 기기로 한 번 연결하면 받아진다.
   목록 요약은 sido_keep_list, 받아 둔 때는 sido_keep_idx { who, at: { 견적 번호: 저장 시각 } }, 견적 내용은 IndexedDB(sido_keep · 용량이 넉넉하다). 로그아웃하면 지운다. */
function keepOk() { try { return !!(SRV && SRV.token && !NS && window.indexedDB) } catch (e) { return false } }
function keepDb() { return new Promise((res, rej) => { try { const r = indexedDB.open("sido_keep", 1); r.onupgradeneeded = () => r.result.createObjectStore("est"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) } catch (e) { rej(e) } }) }
async function keepDo(mode, fn) { const db = await keepDb(); return new Promise((res, rej) => { let rq; const tx = db.transaction("est", mode); try { rq = fn(tx.objectStore("est")) } catch (e) { db.close(); rej(e); return } tx.oncomplete = () => { db.close(); res(rq ? rq.result : undefined) }; tx.onerror = tx.onabort = () => { db.close(); rej(tx.error) } }) }
function keepIdx() { const i = store.get("sido_keep_idx", null); return i && i.who && i.at ? i : { who: "", at: {} } }
function keepList() { if (!keepOk()) return null; const i = keepIdx(); return i.who && i.who === pendWho() ? store.get("sido_keep_list", []) || [] : null }   // 꺼져 있을 때 보여 줄 목록 (이 기기에 받아 둔 내 견적)
async function keepGet(id) { const i = keepIdx(); if (!keepOk() || !i.who || !(id in i.at)) return null; try { const v = await keepDo("readonly", st => st.get(i.who + "|" + id)); return v && v.x ? v.x : null } catch (e) { return null } }
function keepClear() { try { store.del("sido_keep_idx"); store.del("sido_keep_list"); if (window.indexedDB) indexedDB.deleteDatabase("sido_keep") } catch (e) { } }
async function keepPut(X) {                           // 방금 회사에 올린 견적은 다시 받지 않고 바로 넣어 둔다
  if (!keepOk() || !SRV.me || SRV.me.role !== "staff" || !X || !X.id) return; const me = SRV.me.id, i = keepIdx(); if (i.who && i.who !== me) return;
  try { await keepDo("readwrite", st => st.put({ at: X.savedAt || "", x: deep(X) }, me + "|" + X.id)); i.who = me; i.at[X.id] = X.savedAt || ""; store.set("sido_keep_idx", i);
    const L = (store.get("sido_keep_list", []) || []).filter(s => s.id !== X.id), f = X.info || {};
    L.unshift({ id: X.id, owner: me, staffName: SRV.me.name, client: f.client || "", site: f.site || "", region: f.region || "", kind: f.kind || "", ver: f.ver || 1, manager: f.manager || "", total: X.total || 0, savedAt: X.savedAt || "", py: X.py, draft: !!X.draft, savedBy: SRV.me.name }); store.set("sido_keep_list", L) } catch (e) { }
}
async function keepSync() {                           // 회사에 보관된 내 견적 가운데 이 기기에 없거나 옛것인 것만 받아 둔다 (지워진 것은 지운다)
  if (!keepOk() || !SRV.me || SRV.me.role !== "staff" || SRV.down || keepSync.busy) return; keepSync.busy = true;
  try { const me = SRV.me.id, all = await srv("GET", "/api/est"), list = all.filter(s => s.owner === me); let i = keepIdx(); if (!SRV.list) SRV.list = all;
    if (i.who && i.who !== me) { await keepDo("readwrite", st => st.clear()); i = { who: me, at: {} } } i.who = me;
    const want = new Set(list.map(s => s.id));
    for (const id of Object.keys(i.at)) if (!want.has(id)) { await keepDo("readwrite", st => st.delete(me + "|" + id)); delete i.at[id] }
    let n = 0;
    for (const s of list) { if (i.at[s.id] === (s.savedAt || "")) continue; if (SRV.down || !SRV.me) break;
      const x = await srv("GET", `/api/est/${me}/${s.id}`); await keepDo("readwrite", st => st.put({ at: s.savedAt || "", x }, me + "|" + s.id)); i.at[s.id] = s.savedAt || "";
      if (++n % 4 === 0) { store.set("sido_keep_idx", i); await new Promise(r => setTimeout(r, 250)) } }   // 한꺼번에 몰아 받지 않는다
    store.set("sido_keep_idx", i); store.set("sido_keep_list", list); keepSync.at = Date.now();
  } catch (e) { } finally { keepSync.busy = false }
}
setInterval(() => { if (document.visibilityState !== "hidden" && Date.now() - (keepSync.at || 0) > 5 * 60000) keepSync() }, 60000);
/* ---------- (v81) 항상 열리는 주소: 깃허브 Pages 에 올려 둔 실장 화면 — 회사 컴퓨터가 꺼져 있어도 주소가 열린다 ----------
   사용자(2026-11-21): “직원이 집에 가서 작업을 하려는데 회사 컴퓨터가 꺼져 있다고 로그인이 안 된다 … 실장들 url은 언제든지 켜져야”, “회사pc가 켜져야 저장된 견적서를 볼 수 있다는 게 별로야”,
   “실장들의 각 개인 아이디에서 자기가 사용했던 혹은 작성, 저장했던 견적서는 계속해서 보이는 방식으로”.
   · 로그인·저장은 회사 서버(FRONT.api = 밖에서 들어오는 https 주소)에 건다. 이 화면 안에서 아이디·비밀번호를 받는다(frontLogin).
   · 회사 컴퓨터가 꺼져 있으면: 전에 로그인한 기기는 그대로 쓰고, 회사에 보관해 둔 내 견적의 ‘잠근 사본’을 깃허브에서 받아 이 기기의 열쇠로 풀어 보여 준다(mirLoad · mirGet).
     (v84) 로그인해야만 쓴다 — 사용자(2026-11-21): “처음 쓰는 기기에서 견적서 작성을 하려면 똑같이 로그인해야 … 한마디로 로그인을 해야 프로그램을 쓸 수 있는 거야”.
     처음인 기기도 꺼져 있을 때 로그인할 수 있게, 실장마다 ‘전용 주소’(#u=코드)를 주고 그 코드 + 아이디 + 비밀번호로 잠근 로그인 꾸러미를 보관본 옆(o/…)에 둔다(frontOffLogin · 서버 15판).
     꺼져 있는 동안 아이디가 사용 중지되거나 비밀번호가 바뀌었는지는 보관본 옆의 ok.json(지금 쓰는 실장들의 폴더 목록)으로 알아본다(mirLoad).
     (v81~v83에는 처음인 기기가 로그인 없이 쓰는 임시 길이 있었다 — 그때 주인 없이 적힌 ‘올릴 것’은 지금도 로그인하면 올라간다.)
   · 열쇠(256비트)는 로그인했을 때 회사 서버가 그 실장에게만 준다. 비밀번호(6자리)로 만들지 않는다 — 공개된 곳의 사본은 열쇠 없이는 풀 수 없다. */
function frontKeep(me) {                              // 로그인돼 있는 동안: 꺼졌을 때 쓸 열쇠를 이 기기에 적어 둔다
  if (!me || me.role !== "staff") return; const S = frontSess() || { tok: SRV.token, keep: true };
  if (me.mir && me.mir.id && me.mir.key) S.mir = { id: me.mir.id, key: me.mir.key }; S.who = me.id;
  if (me.off) S.off = me.off; if (me.now) S.at = me.now; frontSess(S) }   // (v84) off = 내 전용 코드(꺼져 있을 때 다시 로그인할 때 쓴다) · at = 서버와 마지막으로 맞춘 때(서버 시각)
function frontOut() { frontSess(null); keepClear(); SRV.token = "0"; SRV.me = null; SRV.list = null; SRV.mirList = null; srvChip() }   // 로그아웃: 이 기기의 로그인 열쇠와 보관본 열쇠를 지운다
function frontHide() { const o = $("#frontLogin"); if (o) o.remove() }
function frontAfter() {                               // 연결해 본 뒤: 로그인 화면을 띄울지 · 보관본을 받을지 — (v84) 로그인하지 않으면 쓸 수 없다
  if (!SRV.front) return;
  if (SRV.me) { frontHide(); SRV.mirList = null; return }
  const has = SRV.token !== "0", cur = $("#frontLogin");
  if (SRV.down) {
    if (has && tokDead(SRV.token)) { const c = offCode(); frontOut(); offCode(c); frontLogin("down", "로그인한 지 30일이 지났습니다. 다시 로그인해 주세요."); return }   // 꺼져 있어도 기한은 지킨다 (전용 코드는 이 창에 남겨 둬서 바로 다시 로그인할 수 있다)
    if (has) { frontHide(); mirLoad(); return }
    if (!cur || cur.dataset.mode !== "down") frontLogin("down"); return }
  const exp = frontAfter.exp; frontAfter.exp = false; if (exp || !cur || cur.dataset.mode !== "up") frontLogin(exp ? "expired" : "");
}
const OFF_IT = 200000;                                // PBKDF2 횟수 — 서버(sido_server.py 의 OFF_IT)와 같아야 한다
const tokDead = t => { const m = /^s\d+x([0-9a-f]+)x/.exec(t || ""); return !!m && parseInt(m[1], 16) * 1000 < Date.now() };   // 로그인 열쇠의 기한이 지났는가 — 꺼져 있을 때는 서버가 알려 주지 못하므로 화면이 본다
async function offKdf(pw, salt, n) { const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]); return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: OFF_IT }, k, n * 8)) }
async function frontOffLogin(id, code, keep, off) {   // 꺼져 있을 때의 로그인 → "" 됨 · "nocode" 전용 주소(코드)가 없음 · "nofile" 그 코드의 꾸러미가 없음 · "bad" 아이디·비밀번호가 틀림 · "net" 받지 못함
  off = offNorm(off) || offCode(); if (!off) return "nocode";
  if (!FRONT || !FRONT.mir || !window.crypto || !crypto.subtle) return "net";
  let buf; try { const loc = [...await offKdf(off, new TextEncoder().encode("sido-off-loc-v1"), 16)].map(b => b.toString(16).padStart(2, "0")).join("");
    const r = await fetch(FRONT.mir + "o/" + loc + ".bin", { cache: "no-store" }); if (r.status === 404) return "nofile"; if (!r.ok) return "net"; buf = new Uint8Array(await r.arrayBuffer()) } catch (e) { return "net" }
  if (buf.length < 48 || buf[0] !== 83 || buf[1] !== 79 || buf[2] !== 49) return "nofile";
  let j; try { const key = await crypto.subtle.importKey("raw", await offKdf(off + "|" + String(id).replace(/\s+/g, "").toLowerCase() + "|" + code, buf.slice(3, 19), 32), "AES-GCM", false, ["decrypt"]);
    j = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(19, 31) }, key, buf.slice(31)))) } catch (e) { return "bad" }
  if (!j || !j.tok || !j.id || tokDead(j.tok)) return "bad";
  frontSess({ tok: j.tok, keep: !!keep, mir: j.mir, who: j.id, off, at: +j.at || 0 }); offCode(""); store.set("sido_srv_who", { id: j.id, name: j.name, login: j.login || "" });
  SRV.token = j.tok; SRV.me = null; SRV.down = true; SRV.mirList = null; return "" }
/* (v85) 문지기: 통합 주소 하나 + 아이디 · 비밀번호만으로, 회사 컴퓨터가 꺼져 있어도 처음 쓰는 기기에서 로그인.
   사용자(2026-11-21): “어차피 실장들한테 다 한개주소만 보낼거야 … 새 기기에서도 아이디 비번만 알면 로그인되야하는데”.
   꺼져 있을 때는 바깥의 작은 서버(문지기 · FRONT.gate)가 아이디 · 비밀번호를 확인하고(5번 틀리면 15분 막음) 그 실장의 전용 코드를 돌려준다 → 그 코드로 로그인 꾸러미를 푼다(frontOffLogin).
   문지기에 닿지 못할 때만 이 기기에 있던 코드나 ‘내 전용 주소’ 칸으로 한다. */
async function gateLogin(id, code) {                  // → { off } · { err: "bad" | "wait:분" | "empty" | "net" }
  if (!FRONT || !FRONT.gate) return { err: "net" };
  try { const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 12000);
    const r = await fetch(FRONT.gate + "/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: id, code }), signal: ac.signal, cache: "no-store" }); clearTimeout(tm);
    const j = await r.json().catch(() => ({}));
    return r.ok && j.off ? { off: j.off } : r.status === 401 ? { err: "bad" } : r.status === 429 ? { err: "wait:" + (j.min || 15) } : r.status === 503 ? { err: "empty" } : { err: "net" } }
  catch (e) { return { err: "net" } } }
const OFF_SAY = { nocode: "회사 컴퓨터가 꺼져 있어, 지금은 ‘내 전용 주소’가 있어야 로그인됩니다. 관리자에게 받은 주소를 아래 칸에 붙여 넣어 주세요.", nofile: "전용 주소가 맞지 않거나 바뀌었습니다(사용이 중지된 아이디여도 이렇게 나옵니다). 비밀번호를 새로 받았다면 주소도 새로 받아야 합니다 — 관리자에게 받은 가장 최근 주소를 넣어 주세요.", bad: "아이디 또는 비밀번호가 맞지 않습니다.", net: "인터넷 연결을 확인한 뒤 다시 눌러 주세요." };
function frontOffIn() {                               // 꺼져 있을 때 로그인됐다: 화면을 로그인한 상태로 맞추고 내 견적의 사본을 받는다
  frontHide(); const w = store.get("sido_srv_who", {}) || {}; if (w.name && !E.info.manager) { E.info.manager = w.name; save(); if ($("#info")) renderInfo() }
  srvChip(); const eb = document.querySelector(".estbar"); if (eb) eb.outerHTML = estBar(); if ($("#view-saved") && !$("#view-saved").hidden) renderSaved(); mirLoad();
  toast(`${w.name ? w.name + " 실장님, " : ""}로그인했습니다. 회사 컴퓨터가 꺼져 있어 저장해 둔 견적은 사본으로 보여 드리고, 여기서 쓴 견적은 회사 컴퓨터가 켜지면 저절로 올라갑니다.`) }
async function frontDoLogin(id, code, keep) {         // → "" 됨 · "bad" · "wait:분" · "blocked" · "down"
  let r, j = {}; try { r = await fetch(srvU("/api/login"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: id, code }) }); j = await r.json().catch(() => ({})) } catch (e) { return "down" }
  if (r.ok && j.token) { frontSess({ tok: j.token, keep: !!keep, off: offCode() }); offCode(""); SRV.token = j.token; await srvConnect(); return SRV.me ? "" : SRV.down ? "down" : "bad" }
  return r.status === 429 ? "wait:" + (j.min || 10) : r.status === 403 ? "blocked" : r.status >= 500 ? "down" : "bad";
}
function frontLogin(why, note) {                      // 로그인 창 (화면을 덮는다 — 로그인해야 쓸 수 있다). why "down" = 회사 컴퓨터가 꺼져 있음 → 전용 주소의 코드로 로그인
  const o0 = $("#frontLogin"), v0 = o0 ? { id: ($("#flId") || {}).value, pw: ($("#flPw") || {}).value, u: ($("#flU") || {}).value, keep: ($("#flKeep") || {}).checked } : {};   // 다시 그려도 치던 글자는 남긴다
  frontHide(); const down = why === "down", w = store.get("sido_srv_who", {}) || {}, hasU = !!offCode(), gate = !!(FRONT && FRONT.gate), askU = down && !hasU && (!gate || !!frontLogin.askU);   // askU = ‘내 전용 주소’ 칸을 보일 것인가 (문지기가 있으면, 거기에 닿지 못했을 때만)
  const bt = "font:inherit;font-weight:700;font-size:1.05em;width:100%;padding:13px;border-radius:12px;cursor:pointer;margin-top:12px;", inp = "display:block;font:inherit;font-size:1.25em;width:100%;padding:11px 13px;border:2px solid #aab5af;border-radius:12px;background:#fff;color:#1c2320;margin-top:4px;box-sizing:border-box", lb = "display:block;font-size:.9em;font-weight:700;color:#3d4843";
  document.body.insertAdjacentHTML("beforeend", `<div id="frontLogin" data-mode="${down ? "down" : "up"}" role="dialog" aria-modal="true" aria-label="실장 로그인" style="position:fixed;inset:0;z-index:99999;background:rgba(238,242,240,.97);display:flex;align-items:flex-start;justify-content:center;padding:5vh 16px 16px;overflow:auto">
  <form style="background:#fff;border:1px solid #d5dbd7;border-radius:18px;max-width:27em;width:100%;box-shadow:0 10px 32px rgba(20,50,35,.12);overflow:hidden;font-size:18px;line-height:1.6;color:#1c2320">
    <div style="background:#2f7d59;color:#fff;padding:20px 24px 16px"><b style="display:block;font-size:1.4em;line-height:1.3">시도디자인 견적프로그램</b><span style="font-size:.92em;opacity:.95">실장 로그인</span></div>
    <div style="padding:16px 24px 22px">${down ? `
      <p style="margin:0 0 12px;padding:10px 12px;background:#fff6e5;border:1px solid #e8cf9a;border-radius:10px;font-size:.92em;line-height:1.55"><b>지금 회사 컴퓨터가 꺼져 있습니다.</b> ${hasU || (gate && !askU) ? "그래도 로그인됩니다. 저장해 둔 내 견적이 보이고, 새로 쓴 견적은 회사 컴퓨터가 켜지면 저절로 올라갑니다." : "이 기기에서 처음이면 <b>내 전용 주소</b>가 있어야 로그인됩니다 — 관리자에게 받은 글에 있는 주소입니다."}</p>` : ""}
      <label style="${lb}">아이디<input id="flId" autocomplete="username" autocapitalize="off" spellcheck="false" value="${esc(v0.id || w.login || "")}" style="${inp}"></label>
      <label style="${lb};margin-top:12px">비밀번호 (숫자 6자리)<input id="flPw" type="password" inputmode="numeric" autocomplete="current-password" maxlength="12" value="${esc(v0.pw || "")}" style="${inp}"></label>${askU ? `
      <label style="${lb};margin-top:12px">내 전용 주소 <small style="font-weight:500;color:#5c6661">(받은 주소를 그대로 붙여 넣으세요)</small><input id="flU" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="https://…/#u=…" value="${esc(v0.u || "")}" style="${inp};font-size:1em"></label>` : ""}
      <label style="display:flex;gap:10px;align-items:flex-start;margin-top:14px;cursor:pointer;font-size:.95em"><input type="checkbox" id="flKeep"${v0.keep === false ? "" : " checked"} style="width:22px;height:22px;margin:4px 0 0;flex:none"><span><b>이 기기에서 로그인 유지 (30일)</b><small style="display:block;color:#5c6661">여럿이 쓰는 컴퓨터에서는 끄세요.</small></span></label>
      <button type="submit" id="flGo" style="${bt}border:0;background:#2f7d59;color:#fff">로그인</button>${down ? `
      <button type="button" id="flRetry" style="${bt}border:1px solid #c5cfc9;background:#eef2f0;color:#2f5d49;font-weight:600">회사 컴퓨터에 다시 연결해 보기</button>` : ""}
      <div id="flMsg" role="alert" style="min-height:1.6em;margin-top:8px;color:#b3261e;font-weight:600">${esc(note || (why === "expired" ? "로그인한 지 오래됐거나 비밀번호가 바뀌었습니다. 다시 로그인해 주세요." : ""))}</div>
      <p style="margin:6px 0 0;color:#5c6661;font-size:.88em">${down && !gate ? "전용 주소가 없으면, 회사 컴퓨터가 켜져 있을 때 한 번 로그인해 두세요. 그 뒤로는 그 기기에서 꺼져 있어도 열립니다." : "로그인해야 프로그램을 쓸 수 있습니다. 아이디·비밀번호를 모르면 관리자에게 문의하세요."}</p>
    </div></form></div>`);
  const box = $("#frontLogin"), say = t => { const m = $("#flMsg"); if (m) m.textContent = t };
  if (down) $("#flRetry").onclick = async () => { say("연결해 보는 중…"); await srvConnect(); if ($("#frontLogin") && SRV.down) say("아직 꺼져 있습니다. 위에 아이디·비밀번호를 넣고 로그인하거나, 잠시 뒤 다시 눌러 주세요.") };
  box.querySelector("form").onsubmit = async ev => { ev.preventDefault(); const id = $("#flId").value.trim(), pw = $("#flPw").value.replace(/\D/g, ""), keep = $("#flKeep").checked, go = $("#flGo");
    if (!id || !pw) { say("아이디와 비밀번호를 넣어 주세요."); return } go.disabled = true; go.textContent = "확인하는 중…"; say("");
    const r = await frontDoLogin(id, pw, keep);
    if (r === "down") {                               // 회사 컴퓨터가 대답하지 않는다 → ‘꺼져 있을 때의 로그인’: 문지기에 물어 코드를 받는다(v85). 문지기가 없거나 닿지 않으면 이 기기의 코드 · ‘내 전용 주소’ 칸으로
      let u = ($("#flU") || {}).value || "", via = false; const again = m => { if ($("#frontLogin")) frontLogin("down", m) };
      if (gate && !offNorm(u)) { const g = await gateLogin(id, pw);
        if (g.off) { u = g.off; via = true }
        else if (g.err === "bad") return again("아이디 또는 비밀번호가 맞지 않습니다.");
        else if (g.err.startsWith("wait:")) return again(`여러 번 틀려 잠시 막혔습니다. ${g.err.slice(5)}분 뒤에 다시 해 주세요.`);
        else frontLogin.askU = true }                 // 문지기에 닿지 못했다 → 전에 받아 둔 코드가 있으면 그것으로, 없으면 ‘내 전용 주소’ 칸을 보여 준다
      const o = await frontOffLogin(id, pw, keep, u);
      if (!o) { frontLogin.askU = false; frontOffIn(); return }
      return again(via && o !== "net" ? "로그인 정보를 아직 받지 못했습니다. 비밀번호를 방금 새로 받았다면 몇 분 뒤에 다시 눌러 주세요." : gate && o === "nocode" ? "지금은 로그인을 확인하는 곳에 연결되지 않습니다. 잠시 뒤 다시 누르거나, 관리자에게 받은 ‘내 전용 주소’를 아래 칸에 붙여 넣어 주세요." : OFF_SAY[o] || OFF_SAY.net) }
    if (!$("#frontLogin")) return; go.disabled = false; go.textContent = "로그인";
    say(r === "bad" ? "아이디 또는 비밀번호가 맞지 않습니다." : r === "blocked" ? "사용이 중지된 아이디입니다. 관리자에게 문의하세요." : r.startsWith("wait:") ? `여러 번 틀려 잠시 막혔습니다. ${r.slice(5)}분 뒤에 다시 해 주세요.` : "") };
  setTimeout(() => { const f = $("#flId"), u = $("#flU"); if (f) (!f.value ? f : !$("#flPw").value ? $("#flPw") : u && !u.value ? u : $("#flPw")).focus() }, 50);
}
function myLink() { const off = SRV && SRV.me && SRV.me.off || (SRV && SRV.front ? (frontSess() || {}).off : "") || "", base = SRV && SRV.front ? location.origin + location.pathname : SRV && SRV.me && SRV.me.front || ""; return off && base ? base + "#u=" + off : "" }   // 내 전용 주소 (로그인한 본인 화면에만)
function myLinkHtml() { return myLink() && !(FRONT && FRONT.gate) && !(SRV && SRV.me && SRV.me.gate) ? `<p class="note" style="margin:0 0 10px">집 컴퓨터 · 휴대폰처럼 <b>다른 기기에서 처음 쓸 때</b>는 <b>내 전용 주소</b>로 여세요 — 회사 컴퓨터가 꺼져 있어도 로그인됩니다. <button type="button" class="btn sm" data-mylink>내 전용 주소 복사</button> <span class="note">남에게는 보내지 마세요.</span></p>` : "" }
document.addEventListener("click", async ev0 => { const b = ev0.target.closest && ev0.target.closest("[data-mylink]"); if (!b) return; const u = myLink(); if (!u) return; const ok = await copyText(u);
  toast(ok ? "내 전용 주소를 복사했습니다. 카카오톡 ‘나에게 보내기’ 등으로 쓸 기기에 보내서 여세요. 남에게는 보내지 마세요." : "복사하지 못했습니다. 관리자에게 ‘알려 줄 글’을 다시 받아 주세요.") });
function frontDownNote() {                            // ‘저장된 견적’ 맨 위: 꺼져 있을 때 무엇이 보이는지
  const S = frontSess(), n = pendIds().length, up = n ? ` (올릴 견적 <b>${n}건</b>)` : "", re = ' <button type="button" class="btn ghost sm" data-srvretry>지금 다시 연결해 보기</button>';
  if (!S || !S.tok) return `<p class="note down"><b>회사 컴퓨터가 꺼져 있고, 로그인돼 있지 않습니다.</b> 로그인하면 저장해 둔 내 견적이 보입니다${up}.${re}</p>`;
  if (Array.isArray(SRV.mirList)) return `<p class="note down"><b>회사 컴퓨터가 꺼져 있어</b> 회사에 보관해 둔 내 견적은 <b>사본</b>으로 보여 드립니다 (꺼지기 몇 분 전까지 저장한 것 · ${SRV.mirList.length}건). 그대로 열어서 쓸 수 있고, 여기서 저장한 견적${up}은 켜지면 저절로 회사에도 보관됩니다.${re}</p>`;
  return `<p class="note down"><b>회사 컴퓨터가 꺼져 있습니다.</b> ${mirLoad.busy ? "회사에 보관해 둔 내 견적의 사본을 불러오는 중입니다…" : keepList() ? "회사에 보관해 둔 내 견적은 이 기기에 받아 둔 사본(마지막으로 연결됐을 때까지)으로 보여 드립니다." : "회사에 보관해 둔 내 견적의 사본을 불러오지 못해, 지금은 이 기기에 있는 견적만 보입니다."} 여기서 저장한 견적${up}은 켜지면 저절로 회사에도 보관됩니다.${re}</p>`;
}
function b64u8(s) { return Uint8Array.from(atob(s), c => c.charCodeAt(0)) }
async function mirDec(rel) {                          // 잠근 사본 한 파일을 받아 이 기기의 열쇠로 푼다 → 글자
  const S = frontSess(); if (!S || !S.mir || !FRONT || !FRONT.mir || !window.crypto || !crypto.subtle) throw new Error("no key");
  const r = await fetch(FRONT.mir + S.mir.id + "/" + rel, { cache: "no-store" }); if (!r.ok) { const e = new Error("mirror " + r.status); e.status = r.status; throw e }
  const buf = new Uint8Array(await r.arrayBuffer()); if (buf.length < 32 || buf[0] !== 83 || buf[1] !== 77 || buf[2] !== 49) throw new Error("bad file");
  const key = await crypto.subtle.importKey("raw", b64u8(S.mir.key), "AES-GCM", false, ["decrypt"]);
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(3, 15) }, key, buf.slice(15)));
}
async function mirLoad() {                            // 꺼져 있을 때: 회사에 보관해 둔 내 견적 목록(사본)을 받는다
  if (!SRV || !SRV.front || mirLoad.busy) return; const S = frontSess(); if (!S || !S.mir) return; mirLoad.busy = true; let gone = false;
  try { const ok = await fetch(FRONT.mir + "ok.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);   // (v84) 내 아이디가 그 사이 사용 중지됐거나 비밀번호가 바뀌었는가: 이 기기가 서버와 마지막으로 맞춘 뒤에 만든 목록에 내 폴더가 없으면 그렇다
    if (SRV.down && ok && Array.isArray(ok.ids) && +ok.t > (+S.at || 0) && !ok.ids.includes(S.mir.id)) gone = true;
    else { const j = JSON.parse(await mirDec("i.bin")); if (SRV.down) SRV.mirList = Array.isArray(j.list) ? j.list : [] } } catch (e) { }
  finally { mirLoad.busy = false; SRV.mirAt = Date.now() }
  if (gone) { frontOut(); frontLogin("down", "사용이 중지됐거나 비밀번호가 바뀐 아이디입니다. 다시 로그인해 주세요 (모르면 관리자에게 문의하세요)."); return }
  if ($("#view-saved") && !$("#view-saved").hidden) renderSaved(); const eb = document.querySelector(".estbar"); if (eb) eb.outerHTML = estBar();
}
async function mirGet(id) {                           // 사본에서 견적 하나를 꺼낸다 (따로 떼어 둔 큰 그림도 다시 붙인다)
  const s = (SRV.mirList || []).find(x => x.id === id); if (!s || !s.f) { const e = new Error("사본에 없는 견적입니다"); e.status = 404; throw e }
  const fill = async o => { if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = await fill(o[i]); return o }
    if (o && typeof o === "object") { if (typeof o.$mirblob === "string" && Object.keys(o).length === 1) return mirDec("b" + o.$mirblob + ".bin"); for (const k of Object.keys(o)) o[k] = await fill(o[k]) } return o };
  return fill(JSON.parse(await mirDec("e" + s.f + ".bin")));
}
const SRV = FRONT ? { token: (frontSess() || {}).tok || "0", me: null, list: null, staff: null, plan: {}, front: true, base: FRONT.api } : (() => { const m = location.pathname.match(/^\/s\/([A-Za-z0-9]+)\//); return /^https?:$/.test(location.protocol) && (m || /^\/admin(\/|$)/.test(location.pathname)) ? { token: m ? m[1] : "", me: null, list: null, staff: null, plan: {} } : null })();
const ADM_OUT = !!SRV && !SRV.token && NS === "adm:";   // (v69) 밖에서 여는 관리자 문으로 연 관리자 화면 — 관리자 키 대신 승인한 기기 + 관리자 비밀번호로 들어온다 (서버가 쿠키로 알아본다)
const srvHead = () => { const h = { "Content-Type": "application/json" }; if (SRV.token) h["X-Sido-Token"] = SRV.token; else { h["X-Sido-Admin"] = store.get("sido_srv_admin", "") || ""; h["X-Sido-Adm"] = "1" } return h };   // X-Sido-Adm = 우리 화면이 건 요청이라는 표시 (다른 사이트가 쿠키를 빌려 요청하지 못하게 서버가 확인한다)
const srvU = p => (SRV && SRV.base || "") + p;      // (v81) 항상 열리는 주소에서는 회사 서버 주소를 앞에 붙인다
const srvMine = () => !SRV ? null : SRV.down ? (SRV.front && Array.isArray(SRV.mirList) ? SRV.mirList : keepList()) : SRV.me ? SRV.list : null;   // 회사에 보관된 내 견적 목록 — 꺼져 있을 때는 깃허브에서 받은 사본(항상 열리는 주소) 또는 이 기기에 받아 둔 사본
const srvMeId = () => SRV && SRV.me ? SRV.me.id : pendWho();
async function srv(method, path, body) {
  if (SRV.down && method === "GET") { const m = path.match(/^\/api\/est\/[^/]+\/([^/]+)$/);   // 꺼져 있을 때 ‘열기’는 사본에서
    if (m) { if (SRV.front && Array.isArray(SRV.mirList) && SRV.mirList.some(x => x.id === m[1])) { try { return await mirGet(m[1]) } catch (e) { } } const k = await keepGet(m[1]); if (k) return k } }
  const h = srvHead();
  const r = await fetch(srvU(path), { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  if (r.status === 401 && ADM_OUT && SRV.me) { SRV.me = null; srvChip(); if ($("#view-saved") && !$("#view-saved").hidden) setTimeout(renderSrv, 0) }   // (v69) 밖 관리자: 로그인이 풀렸으면(12시간 지남 · 다른 곳에서 잠금 · 기기 지움) 화면 위 표시를 ‘다시 들어가기’로 바꾼다
  if (!r.ok) { const e = new Error(r.status === 401 ? "저장소에 들어갈 권한이 없습니다" : "저장소 오류 " + r.status); e.status = r.status; try { e.body = await r.json(); e.msg = (e.body && e.body.msg) || "" } catch (x) { e.msg = "" } throw e }
  return r.json();
}
/* (v64) 회사 컴퓨터(서버)가 꺼져 있어도 쓰기: 한 번 들어온 기기는 화면 파일을 기억해 두고(서버의 /sw.js), 꺼져 있으면 그것으로 같은 주소가 열린다.
   그동안 ‘저장’·‘임시저장’한 견적은 이 기기에 두고 ‘올릴 것’으로 적어 둔다(sido_srv_pend: { 견적 번호: 실장 id }). 30초마다 다시 연결해 보고, 연결되면 저절로 올린다(pendSync).
   다른 곳에서 그 사이 고친 더 새 내용이 있으면 덮어쓰지 않는다(이 기기 목록에는 그대로 남는다). SRV.down = 서버가 대답하지 않음(또는 5xx) · 로그인이 풀린 것(401)과는 다르다. */
const PEND_K = "sido_srv_pend";
const pendWho = () => SRV && SRV.me ? SRV.me.id : (store.get("sido_srv_who", {}) || {}).id || "?";
const pendIds = () => { const P = store.get(PEND_K, {}) || {}, w = pendWho(); return Object.keys(P).filter(id => P[id] === "?" || w === "?" || P[id] === w) };
function pendAdd(X) { if (!SRV || !SRV.token || SRV.token === "0" || !X || !X.id) return;   /* "0" = 항상 열리는 주소에서 로그인하지 않은 상태 — 로그인해야 쓰므로 올릴 것도 적지 않는다 (v84) */ srvMap(PEND_K, X.id, pendWho()); srvChip() }
function srvChip() {                                  // 화면 위 표시: 연결됨 · 회사 컴퓨터 꺼짐(이 기기에 저장 중) · 다시 로그인
  if (!SRV || !document.querySelector(".topin")) return; for (const id of ["#srvChip", "#srvOut"]) { const old = $(id); if (old) old.remove() }
  const down = !!(SRV.token && SRV.down), n = down ? pendIds().length : 0, w = SRV.me || (SRV.token ? store.get("sido_srv_who", {}) || {} : {});
  const who = SRV.me && SRV.me.role === "admin" ? "관리자" : w.name ? esc(w.name) + " 실장님" : "", lg = SRV.token && w.login ? ` (${esc(w.login)})` : "";   // (v65) 누가 로그인했는지 오른쪽 위에: ‘박재성 실장님 (sido100) 로그인 중’
  const txt = down ? `${who ? who + " · " : ""}회사 컴퓨터 꺼짐 · 이 기기에 저장 중${n ? ` (올릴 견적 ${n}건)` : ""}` : SRV.me ? (SRV.token ? `<b>${who}</b>${lg} 로그인 중` : "회사 저장소 연결 · 관리자" + (ADM_OUT && SRV.me.dev ? ` (${esc(SRV.me.dev)})` : "")) : SRV.token ? "회사 저장소 연결 안 됨 · 눌러서 다시 로그인" : ADM_OUT ? "관리자 로그인이 풀림 · 눌러서 다시 들어가기" : "회사 저장소: 관리자 키 필요";
  const at = down ? ' data-srvretry role="button" tabindex="0" style="cursor:pointer" title="회사 컴퓨터가 켜지면 저절로 다시 연결되고, 그동안 이 기기에 저장한 견적도 회사 저장소에 올라갑니다. 누르면 지금 다시 연결해 봅니다"' : SRV.me ? (SRV.token ? ' title="로그인돼 있습니다. 저장한 견적은 회사에도 보관됩니다"' : ' title="회사 저장소에 연결돼 있습니다. 저장한 견적은 회사 저장소에 올라갑니다"') : SRV.token ? ' data-srvout role="button" tabindex="0" style="cursor:pointer" title="누르면 로그인 화면으로 갑니다"' : ADM_OUT ? ' data-admre role="button" tabindex="0" style="cursor:pointer" title="들어온 지 12시간이 지났거나 다른 곳에서 잠갔습니다. 누르면 관리자 비밀번호를 다시 넣는 화면으로 갑니다 (쓰던 내용은 이 기기에 남아 있습니다)"' : "";
  document.querySelector(".topin").insertAdjacentHTML("beforeend", `<span class="chip ${SRV.me && !down ? "ok" : "warn"}" id="srvChip"${at}>${txt}</span>${(SRV.me && SRV.token && !down) || (SRV.front && down && SRV.token !== "0") ? '<span class="chip" id="srvOut" data-srvout role="button" tabindex="0" style="cursor:pointer" title="다른 아이디로 들어가거나, 여럿이 쓰는 컴퓨터에서 쓰고 난 뒤에 누르세요">로그아웃</span>' : SRV.me && ADM_OUT ? '<span class="chip" id="srvOut" data-admout role="button" tabindex="0" style="cursor:pointer" title="관리자 화면을 잠급니다. 다시 열려면 관리자 비밀번호를 넣어야 합니다. 자리를 비울 때 누르세요">잠그기</span>' : ""}`);
  if (!SRV.front && SRV.token && SRV.me && SRV.me.front && !$("#frontTip")) document.querySelector(".topin").insertAdjacentHTML("beforeend", `<a class="chip ok" id="frontTip" href="${esc(SRV.me.front + (SRV.me.off && !SRV.me.gate ? "#u=" + SRV.me.off : ""))}" target="_blank" rel="noopener" style="text-decoration:none" title="회사 컴퓨터가 꺼져 있어도 열리는 주소입니다. 아이디·비밀번호는 같고, 회사에 보관된 내 견적이 그대로 보입니다. 즐겨찾기를 이 주소로 바꿔 주세요">꺼져 있어도 열리는 새 주소 →</a>`);   // (v81)
}
function srvLost() { if (!SRV || !SRV.token || SRV.down) return; SRV.down = true; if (SRV.front) mirLoad(); srvChip(); const eb = document.querySelector(".estbar"); if (eb) eb.outerHTML = estBar(); if ($("#view-saved") && !$("#view-saved").hidden) renderSrv() }   // 쓰는 중에 서버가 대답하지 않게 됐다
function swKeep() {                                   // 이 기기에 화면 파일을 기억시켜 둔다 (연결될 때마다 새 판으로 갈아 둔다)
  try { if (swKeep.done || !SRV || !SRV.token || !HELP_BASE || !("serviceWorker" in navigator)) return; swKeep.done = true;
    navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(reg => { if (reg && reg.active) reg.active.postMessage({ keep: HELP_BASE }) }).catch(() => { swKeep.done = false }) } catch (e) { } }
async function pendSync() {                           // 끊긴 동안 이 기기에 저장한 견적을 회사 저장소에 올린다
  if (!SRV || !SRV.me || SRV.me.role !== "staff" || SRV.down || pendSync.busy) return; pendSync.busy = true;
  try { const ids = pendIds(); if (!ids.length) return; const L = store.get("sido3_list", []); let up = 0, clash = 0;
    for (const id of ids) { const x = L.find(y => y.id === id); if (!x) { srvMap(PEND_K, id, null); continue }
      const r = await srvSave(false, "", x); if (r === true) up++; else if (r && r.clash) { clash++; srvMap(PEND_K, id, null) } else break }   // 올리지 못하면(다시 끊김) 남겨 두고 다음에
    if (up || clash) toast((up ? `회사 컴퓨터에 다시 연결됐습니다. 그동안 이 기기에 저장한 견적 ${up}건을 회사 저장소에 올렸습니다.` : "회사 컴퓨터에 다시 연결됐습니다.") + (clash ? ` ${clash}건은 그 사이 다른 곳에서 고친 더 새 내용이 있어 올리지 않았습니다 — 이 기기의 ‘저장된 견적’에 그대로 있으니, 열어서 ‘저장’을 누르면 어느 쪽을 남길지 고를 수 있습니다.` : ""));
    SRV.list = null; srvChip(); if ($("#view-saved") && !$("#view-saved").hidden) renderSaved();
  } catch (e) { } finally { pendSync.busy = false }
}
async function srvRetry(byUser) {                     // 끊긴 회사 컴퓨터에 다시 연결해 본다 (30초마다 · 화면으로 돌아올 때 · 인터넷이 다시 잡힐 때 · 표시를 눌렀을 때)
  if (!SRV || !SRV.token || !SRV.down || srvRetry.busy) return; srvRetry.busy = true;
  try { const r = await fetch(srvU("/api/ping"), { cache: "no-store" }); if (!r.ok) throw 0;
    await srvConnect(); if (SRV.me && !pendIds().length) toast("회사 컴퓨터에 다시 연결됐습니다.") }
  catch (e) { if (byUser) toast("아직 회사 컴퓨터에 연결되지 않습니다. 켜지면 저절로 다시 연결됩니다. 그동안 쓴 내용은 이 기기에 남습니다.") }
  finally { srvRetry.busy = false }
}
setInterval(() => { if (SRV && SRV.token && SRV.down && document.visibilityState !== "hidden") srvRetry() }, 30000);
window.addEventListener("online", () => srvRetry());
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") srvRetry() });
document.addEventListener("click", ev0 => { if (ev0.target.closest && ev0.target.closest("[data-srvretry]")) srvRetry(true) });
async function srvConnect() {
  if (!SRV) return;
  try { SRV.me = await srv("GET", "/api/me"); SRV.down = false; if (SRV.front) frontKeep(SRV.me); if (SRV.me.role === "staff") store.set("sido_srv_who", { id: SRV.me.id, name: SRV.me.name, login: SRV.me.login || "" }); if (SRV.me.role === "staff" && !E.info.manager) { E.info.manager = SRV.me.name; save(); if ($("#info")) renderInfo() } }
  catch (e) { SRV.me = null; SRV.down = !!SRV.token && (!e.status || e.status >= 500); if (SRV.front && e.status === 401 && SRV.token !== "0") { frontAfter.exp = true; frontOut() } }   // 대답이 없거나 5xx = 회사 컴퓨터가 꺼져 있음 (401 = 로그인이 풀림)
  if (SRV.me && SRV.me.ai && !KB_AI) { KB_AI = srvAi; try { helpDraw() } catch (e) { } }   // 서버에 AI 키가 있으면 회사 주소의 챗봇도 AI 로 답한다 (없으면 저장된 답만)
  if (ADM_OUT && location.search) { try { history.replaceState(null, "", "/admin/") } catch (e) { } }
  if (SRV.token && SRV.me && !SRV.front) { try { history.replaceState(null, "", "/") } catch (e) { } }   // 주소 칸에 로그인 열쇠가 남지 않게 한다 — 주소를 복사해 남에게 보내도 로그인까지 넘어가지 않는다. 새로 고치면 첫 화면이 이 기기에 남은 열쇠로 다시 들여보낸다
  srvChip(); costSync();                               // (v87) 공정별 마진: 실장 = 원가표 받기 · 관리자 = 원가표 올리기
  SRV.list = null; if (!$("#view-saved").hidden) renderSaved(); planLibCheck(); srvNewer(); verCheck();   // 쓰던 견적이 다른 곳(관리자·다른 기기)에서 고쳐졌으면 그 내용으로 맞춘다
  if (SRV.me && SRV.token) { swKeep(); pendSync(); setTimeout(keepSync, 2500) }   // 이 기기에 화면 파일을 기억시키고, 끊긴 동안 저장한 견적이 있으면 올린다
  if (SRV.token) { const eb = document.querySelector(".estbar"); if (eb) eb.outerHTML = estBar() }   // ‘현장 정보’ 맨 위 안내(회사 저장소에 저절로 임시저장 · 지금은 꺼져 있음)를 연결 상태에 맞춘다
  if (SRV.front) frontAfter();                        // (v81) 로그인 화면을 띄우거나, 꺼져 있으면 내 견적의 사본을 받는다
}
/* (v71) 새 판 알림: 화면을 열어 둔 채로 프로그램이 바뀌면(서버의 app.js 판이 이 화면의 APP_VER 와 다르면) 화면 위에 알린다 — 누르면 쓰던 것을 남기고 새로 고친다.
   사용자(2026-11-20): “회사저장소가 보이는 방식은 전혀 바뀌지 않았어” — 올린 뒤에도 열어 둔 화면은 새로 고치기 전까지 옛 프로그램이라 생긴 일. */
function verCheck() {
  if (!SRV || verCheck.busy || $("#verChip")) return; verCheck.busy = true;
  fetch(SRV.front ? "ver.json?t=" + Date.now() : "/api/ping", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(j => { const v = SRV.front ? j && j.ver : j && j.ver && j.ver[SRV.token ? "s" : "admin"];   // 항상 열리는 주소는 그 주소에 올라간 판(ver.json)과 견준다
    if (v && v !== APP_VER && document.querySelector(".topin")) document.querySelector(".topin").insertAdjacentHTML("beforeend", '<span class="chip warn" id="verChip" role="button" tabindex="0" style="cursor:pointer" title="프로그램이 새 판으로 바뀌었습니다. 누르면 쓰던 견적을 남기고 화면을 새로 고칩니다 (로그인은 그대로입니다)">프로그램이 새로 바뀌었습니다 · 눌러서 새로 고침</span>') })
    .catch(() => {}).then(() => { verCheck.busy = false }) }
setInterval(() => { if (document.visibilityState !== "hidden") verCheck() }, 5 * 60000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") verCheck() });
document.addEventListener("click", ev0 => { if (!(ev0.target.closest && ev0.target.closest("#verChip"))) return; try { save(); autoStash(true) } catch (e) { } setTimeout(() => location.reload(), 300) });
/* 양방향 반영 (v58): 관리자가 실장의 견적을 회사 저장소에서 열어 고쳐 ‘저장’하면 그 실장의 견적이 바뀐다(전에는 관리자 쪽에 따로 쌓여 실장에게 보이지 않았다). 실장 화면은 다음에 열 때 그 내용으로 바뀐다.
   같은 견적을 다른 곳(관리자·다른 기기)에서 그 사이에 저장했으면 덮어쓰기 전에 먼저 알린다. 이 기기가 회사 저장소와 마지막으로 맞춘 때(base)·그때의 내용(sig)·누구 견적인지(owner, 관리자만)를 견적 번호별로 이 기기에 적어 둔다. */
function srvMap(k, id, v) { const m = store.get(k, {}) || {}; if (v === undefined) return m[id]; delete m[id]; if (v !== null) m[id] = v; const ks = Object.keys(m); for (const x of ks.slice(0, Math.max(0, ks.length - 300))) delete m[x]; store.set(k, m) }
const sigH = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h + ":" + s.length };
const srvOwnOf = X => SRV.me.role === "admin" ? (srvMap("sido_srv_owner", X.id) || "admin") : SRV.me.id, srvOwn = () => srvOwnOf(E);   // 지금 견적이 회사 저장소에서 누구 것인가 (관리자가 실장의 견적을 열었으면 그 실장)
const srvDirty = () => sigH(estSig(E)) !== srvMap("sido_srv_sig", E.id);                                   // 회사 저장소와 맞춘 뒤에 여기서 고친 것이 있는가
const whoSay = w => !w ? "다른 곳에서" : w === "관리자" ? "관리자가" : SRV.me && w === SRV.me.name ? "다른 기기에서" : w + " 님이";
function srvSynced(at, X) { X = X || E; srvMap("sido_srv_base", X.id, at || ""); srvMap("sido_srv_sig", X.id, sigH(estSig(X))); if (X.id === E.id) { const c = $("#srvNewer"); if (c) c.remove() } }   // 지금 화면의 견적이 회사 저장소와 같아졌다
function srvNewerChip() {                            // 화면 위에 ‘회사 저장소에 더 새 내용’을 띄운다 — 누르면 그 내용으로 바꾼다 (여기서 고치던 것은 따로 남긴다)
  if ($("#srvNewer")) return;
  document.querySelector(".topin").insertAdjacentHTML("beforeend", '<span class="chip warn" id="srvNewer" role="button" tabindex="0" style="cursor:pointer" title="이 견적을 다른 곳(관리자 또는 다른 기기)에서 고쳐 저장했습니다. 누르면 그 내용으로 바꿉니다. 여기서 고치던 내용은 ‘저장된 견적’에 따로 남습니다">회사 저장소에 더 새 내용 · 눌러서 불러오기</span>');
}
async function srvLoadNewer(keepMine) {              // 회사 저장소의 최신 내용으로 바꾼다. keepMine = 여기서 고치던 내용을 ‘저장된 견적’에 따로 남긴다
  const x = await srv("GET", `/api/est/${srvOwn()}/${E.id}`); let L = store.get("sido3_list", []);
  if (keepMine) { const mine = deep(E); mine.id = "e" + Date.now(); mine.info = { ...mine.info, client: (mine.info.client || mine.info.site || "견적") + " (내가 고치던 것)" }; mine.savedAt = new Date().toISOString(); mine.total = R.total; mine.draft = true; delete mine.savedBy; L.unshift(mine) }
  const cp = deep(x); delete cp.draft; L = L.filter(y => y.id !== x.id); L.unshift(cp);   // 이 기기의 ‘저장된 견적’도 같은 내용으로 맞춘다
  if (!store.set("sido3_list", L) && keepMine) { toast("이 기기의 저장 공간이 모자라 고치던 내용을 남길 수 없어 불러오지 않았습니다. ‘저장된 견적’에서 끝난 견적을 지운 뒤 다시 눌러 주세요."); return false }
  openEst(x, `${whoSay(x.savedBy)} 고쳐 저장한 내용으로 바꿨습니다 (${fmtAt(x.savedAt)} 저장).` + (keepMine ? " 여기서 고치던 내용은 ‘저장된 견적’에 ‘(내가 고치던 것)’으로 남겼습니다." : ""));
  srvSynced(x.savedAt); return true;
}
async function srvNewer() {                          // 지금 쓰는 견적이 다른 곳에서 고쳐졌는지 본다: 여기서 고친 것이 없으면 바로 그 내용으로 바꾸고, 있으면 화면 위에 알린다
  if (!SRV || !SRV.me || srvNewer.busy) return; srvNewer.busy = true;
  try {
    const own = srvOwn(), base = srvMap("sido_srv_base", E.id); if (!base) return;   // 이 기기에서 회사 저장소와 맞춘 적이 없는 견적은 저장할 때 묻는다
    const cur = (SRV.list || (SRV.list = await srv("GET", "/api/est"))).find(x => x.id === E.id && x.owner === own);
    if (!cur || !cur.savedAt || cur.savedAt === base) { const c = $("#srvNewer"); if (c) c.remove(); return }
    if (srvDirty()) srvNewerChip(); else await srvLoadNewer(false);
  } catch (e) { } finally { srvNewer.busy = false }
}
document.addEventListener("visibilitychange", () => {   // 다른 일을 하다 이 화면으로 돌아오면 그 사이에 바뀐 것이 있는지 다시 본다 (1분에 한 번까지)
  if (document.visibilityState !== "visible" || !SRV || !SRV.me || Date.now() - (srvNewer.t || 0) < 60000) return; srvNewer.t = Date.now(); SRV.list = null;
  srvNewer().then(() => { if ($("#view-saved") && !$("#view-saved").hidden) renderSrv() });
});
async function srvSave(force, prevAt, X0) { const X = X0 || E;   // X0 = 올릴 견적 (임시저장하고 다른 견적으로 넘어갈 때는 그 사이 E 가 바뀌므로 잡아 둔 것을 쓴다)              // prevAt = 이 기기에서 이 견적을 바로 전에 저장한 때 (맞춘 기록이 없는 견적은 이것과 견준다)
  if (!SRV) return null;
  if (!SRV.me || SRV.down) { pendAdd(X); return null }   // (v64) 연결이 끊겨 있으면 이 기기에만 두고 ‘올릴 것’으로 적어 둔다 (관리자 화면은 적지 않는다 — pendAdd 가 실장 화면만 받는다)
  try {
    const own = srvOwnOf(X);
    if (!force) {                                    // 그 사이에 다른 곳에서 저장한 것이 있으면 덮어쓰지 않고 먼저 알린다
      const cur = (await srv("GET", "/api/est")).find(x => x.id === X.id && x.owner === own);
      if (cur && cur.savedAt && cur.savedAt !== (srvMap("sido_srv_base", X.id) || prevAt || "")) { const who = cur.savedBy || ""; if (X.id === E.id) srvNewerChip(); return { clash: true, at: cur.savedAt, who } }
    }
    const body = { ...X, savedBy: SRV.me.name }; if (SRV.me.role === "admin" && own !== "admin") body._owner = own;   // 관리자가 실장의 견적을 고쳤으면 그 실장의 견적으로 저장한다
    await srv("PUT", "/api/est/" + X.id, body); srvSynced(X.savedAt, X); keepPut(X); if (SRV.token) srvMap(PEND_K, X.id, null); SRV.list = null; if (X.id === E.id) measPush(); return true
  } catch (e) { if (!e.status || e.status >= 500) { pendAdd(X); srvLost() } return false }   // 서버가 대답하지 않으면 올릴 것으로 적어 두고 ‘꺼짐’으로 바꾼다 → 30초마다 다시 연결해 본다
}
const SENT_HOW = { print: "인쇄", export: "파일", copy: "엑셀복사", xlsx: "엑셀" };
function srvSent(how) {                              // 고객에게 나가는 견적(인쇄·엑셀·파일)을 회사 저장소에 따로 남긴다 — 서버가 달·실장별로 쌓고, 같은 내용은 다시 남기지 않는다
  if (!SRV || !SRV.me) return; try { const e = deep(E); e.total = R.total; srv("PUT", "/api/sent", { est: e, how }).then(() => { SRV.sent = null; SRV.sentErr = "" }).catch(() => {}) } catch (x) { } }
async function srvAi(input, opts = {}) {             // 회사 주소의 챗봇 AI: 서버(서버\AI키.txt 의 키)를 거쳐 묻는다 — claude.ai 주소의 AI 와 같은 모양으로 답을 돌려준다
  const msgs = (Array.isArray(input) ? input : [{ role: "user", content: String(input) }]).map(m => ({ role: m.role, content: String(m.content) }));
  let system = ""; const at = msgs[0].content.indexOf("\n\n[자료]\n");   // 늘 같은 ‘답하는 규칙’은 따로 보낸다 (서버가 캐시해서 입력 값이 싸진다)
  if (at > 0) { system = msgs[0].content.slice(0, at); msgs[0].content = msgs[0].content.slice(at + 2) }
  const h = srvHead();
  let r; try { r = await fetch(srvU("/api/ai"), { method: "POST", headers: h, body: JSON.stringify({ system, messages: msgs, tier: opts.modelTier === "default" ? "default" : "quick", stream: true }), signal: opts.signal }) }
  catch (e) { throw { code: e && e.name === "AbortError" ? "cancelled" : "network" } }
  if (r.ok && /event-stream/.test(r.headers.get("Content-Type") || "") && r.body && r.body.getReader) {   // (v72) 답을 받는 대로 보여 준다 — 사용자: “답변속도도 좀 늦은 편”. 다 만들어질 때까지 기다리지 않고 첫 글자부터 화면에 나온다
    const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "", text = "", done = null, err = "";
    try { for (;;) { const { value, done: end } = await rd.read(); if (end) break; buf += dec.decode(value, { stream: true }); let i;
        while ((i = buf.indexOf("\n\n")) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 2); if (!line.startsWith("data: ")) continue; let ev; try { ev = JSON.parse(line.slice(6)) } catch (e) { continue }
          if (ev.t) { text += ev.t; if (opts.onText) try { opts.onText({ text }) } catch (e) { } } else if (ev.done) done = ev; else if (ev.error) err = ev.error } } }
    catch (e) { if (e && e.name === "AbortError") throw { code: "cancelled", text }; if (!text) throw { code: "network" } }
    if (!text) throw { code: err ? "failed" : "network" };
    return { text, truncated: !done || !!done.truncated };   // 끝났다는 표시 없이 끊겼으면 잘린 답으로 본다
  }
  let j = {}; try { j = await r.json() } catch (e) { }
  if (!r.ok) throw { code: r.status === 429 ? (j.error === "day" ? "day_limit" : "rate_limited") : r.status === 503 || r.status === 401 ? "capability_disabled" : "failed" };
  return { text: String(j.text || ""), truncated: !!j.truncated };
}
async function copyText(t, ta) {                     // 글을 클립보드에 넣는다. 안 되면(http 주소·권한 없음) 글 칸에 넣고 골라서 옛 방식으로 복사 → 그것도 안 되면 false (ta 를 줬으면 그 칸에 남겨 둔다)
  try { await navigator.clipboard.writeText(t); return true } catch (e) { }
  const own = !ta; if (own) { ta = document.createElement("textarea"); ta.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.appendChild(ta) }
  ta.value = t; ta.focus(); ta.select(); let ok = false; try { ok = document.execCommand("copy") } catch (e) { }
  if (own) ta.remove(); else if (ok) ta.value = ""; return ok }
const measSig = () => JSON.stringify([E.dim || {}, E.meas || {}, E.ceilH || ""]);
function measPush() {                                // 직접 잰 값(불러온 값 그대로가 아닌 것)만 올린다
  const key = planBaseKey(), dim = E.dim || {}, u = planUnit(); if (!key || !Object.keys(dim).length) return;
  if (E.measFrom && E.measSnap === measSig()) return;
  srv("PUT", "/api/meas", { key, name: planName(), estId: E.id, unit: E.info.addr2 || "", line: u ? `${u.d}동|${u.ln}` : "", dim, meas: E.meas || {}, ceilH: E.ceilH || "", layout: { rooms: E.rooms, baths: E.baths, balconies: E.balconies } })
    .then(() => { if (SRV.meas) SRV.meas[key] = undefined; measLibCheck() }).catch(() => {});
}
const measTag = r => `${r.unit || "동·호수 미기재"} · ${r.by} · ${r.at}`;
function measApply(r, auto) {
  E.dim = JSON.parse(JSON.stringify(r.dim || {})); E.meas = { ...(r.meas || {}) }; if (+r.ceilH > 0) E.ceilH = +r.ceilH;
  E.measFrom = measTag(r); E.measSnap = measSig(); delete E.measSkip; E.dimOpen = true; refresh(true);
  toast(`${auto ? "같은 동·호 라인의 " : ""}실측 기록(${measTag(r)})을 실측표에 넣었습니다. 현장에서 다시 재면 고쳐서 저장하세요.`);
}
function measLibCheck() {
  const el = $("#measLib"); if (!el) return; const key = planBaseKey();
  if (!SRV || !SRV.me || !key) { el.innerHTML = ""; return }
  SRV.meas = SRV.meas || {};
  if (SRV.meas[key] === undefined) { SRV.meas[key] = null; srv("GET", "/api/meas?key=" + encodeURIComponent(key)).then(r => { SRV.meas[key] = r.list || []; measLibCheck() }).catch(() => { SRV.meas[key] = [] }); el.innerHTML = ""; return }
  const ls = SRV.meas[key]; if (!ls) return;
  const u = planUnit(), ln = u ? `${u.d}동|${u.ln}` : "", r = ls.find(x => ln && x.line === ln) || ls[0], same = !!(r && ln && r.line === ln), has = Object.keys(E.dim || {}).length > 0;
  if (r && same && !has && !E.measFrom && E.measSkip !== key && !measLibCheck.busy) { measLibCheck.busy = true; try { measApply(r, true) } finally { measLibCheck.busy = false } return }
  el.innerHTML = !ls.length ? "이 단지·평형의 실측 기록이 아직 없습니다. 실측표를 채우고 ‘저장’하면 회사 저장소에 쌓입니다."
    : `<b>이 단지·평형 실측 기록 ${ls.length}건</b> · ${E.measFrom ? `지금 실측표는 ‘${esc(E.measFrom)}’ 기록에서 가져온 값입니다.` : `가장 가까운 기록: ${esc(measTag(r))}${same ? " (같은 동·호 라인)" : ""}`} <button type="button" class="btn sm" data-measload>${E.measFrom ? "다시 불러오기" : "이 실측값 불러오기"}</button>`;
}
document.addEventListener("click", ev0 => {
  if (!ev0.target.closest("[data-measload]") || !SRV || !SRV.meas) return;
  const ls = SRV.meas[planBaseKey()] || [], u = planUnit(), ln = u ? `${u.d}동|${u.ln}` : "", r = ls.find(x => ln && x.line === ln) || ls[0]; if (r) measApply(r);
});
document.addEventListener("keydown", ev0 => { const t = ev0.target; if ((ev0.key === "Enter" || ev0.key === " ") && t && t.matches && t.matches("[data-srvout],[data-admout],[data-admre],#srvNewer")) { ev0.preventDefault(); t.click() } });
document.addEventListener("keydown", ev0 => { const t = ev0.target; if (ev0.key === "Enter" && t && t.matches && t.matches("[data-staffid]")) { const b = t.parentNode.querySelector("[data-staffidsave]"); if (b && !b.hidden) { ev0.preventDefault(); b.click() } } });
document.addEventListener("input", ev0 => { const t = ev0.target; if (t && t.matches && t.matches("[data-staffid]")) { const b = t.parentNode.querySelector("[data-staffidsave]"); if (b) b.hidden = t.value.replace(/\s+/g, "").toLowerCase() === t.dataset.old } });   // 아이디를 고쳐 적으면 ‘아이디 저장’이 나온다
const staffKey = s => String(s == null ? "" : s).toLowerCase().replace(/\s+/g, "");   // 실장 찾기: 띄어쓰기·대소문자를 가리지 않는다 (sido 100 = sido100)
function staffFilter() {                             // 관리자: 실장 목록에서 이름·아이디·상태(사용/중지)로 찾기 — 목록을 다시 그려도 찾던 말은 남는다
  const inp = $("#staffQ"); if (!inp || !SRV) return; SRV.staffQ = inp.value; const q = staffKey(inp.value); let n = 0;
  document.querySelectorAll("#srvBox li[data-sq]").forEach(li => { const hit = !q || li.dataset.sq.includes(q); li.hidden = !hit; if (hit) n++ });
  const none = $("#staffNone"), cnt = $("#staffCnt"); if (none) none.hidden = !q || n > 0; if (cnt) cnt.textContent = q ? `${n}명 찾음` : "";
}
function srvListFilter() {                           // 관리자: 회사 저장소(전체 실장 견적)에서 고객명·주소·실장 이름으로 찾기 — 이 기기에 저장된 견적이 없어도 찾을 수 있게
  const inp = $("#srvQ"); if (!inp || !SRV) return; SRV.listQ = inp.value; const q = inp.value.trim().toLowerCase(); let n = 0;
  document.querySelectorAll("#srvBox li[data-q]").forEach(li => { const hit = !q || li.dataset.q.includes(q); li.hidden = !hit; if (hit) n++ });
  document.querySelectorAll("#srvBox li[data-grp]").forEach(h => { h.hidden = !!q && !document.querySelector(`#srvBox li[data-own="${h.dataset.grp}"]:not([hidden])`) });   // (v70) 찾는 중에는 견적이 하나도 안 남은 실장의 머리 줄을 감춘다
  const cnt = $("#srvQCnt"); if (cnt) cnt.textContent = q ? `${n}건 찾음` : "";
}
document.addEventListener("input", ev0 => { const t = ev0.target, id = t && t.id; if (id === "staffQ") staffFilter(); else if (id === "srvQ") srvListFilter(); else if (id === "learnQ") learnDraw(); else if (SRV && t && t.matches && t.matches("[data-learna]")) (SRV.learnDraft = SRV.learnDraft || {})[t.dataset.learna] = t.value });   // 배운 답을 고치던 글은 적어 둔다 — 목록을 다시 그려도 사라지지 않게
/* 챗봇이 배운 답 (관리자): 챗봇 AI 가 답한 것이 회사 저장소(챗봇답)에 쌓이고, 같은 질문에는 그 답이 바로 나간다 → 여기서 읽어 보고 고치기 · 확인함 · 쓰지 않기 · 삭제.
   목록은 묶음을 펼칠 때 불러오고(수천 개까지 쌓인다), 줄은 learnDraw 가 그 목록 칸만 다시 그린다 — 하나를 손봐도 화면 전체를 다시 그리지 않아 보던 자리가 그대로다. */
const LEARN_ST = { new: ["검토 전", "warn"], ok: ["확인함", "ok"], off: ["쓰지 않음", ""] }, LEARN_SHOW = 60;   // 상태 이름과 표시 색 · 한 번에 그리는 개수 (나머지는 찾아서 본다)
const learnHay = x => x._k || (x._k = staffKey([x.q, x.a, (LEARN_ST[x.state] || LEARN_ST.new)[0], x.by, +x.bad ? "부족해요" : ""].join("|")));   // 찾기: 질문 · 답 · 상태 이름 · 물은 사람 · ‘부족’(실장이 부족해요를 누른 답) (띄어쓰기·대소문자를 가리지 않는다)
const learnSum = () => { const L = SRV.learn, n = L ? L.length : +((SRV.info || {}).ai || {}).learn || 0, nw = L ? L.filter(x => x.state !== "ok" && x.state !== "off").length : 0, nb = L ? L.filter(x => +x.bad > 0).length : 0; return (n ? `<span class="chip">${n}개</span> ` : "") + (nw ? `<span class="chip warn">검토 전 ${nw}개</span> ` : "") + (nb ? `<span class="chip warn">부족해요 ${nb}개</span> ` : "") };
function learnLoad() {
  if (!SRV || !SRV.me || SRV.me.role !== "admin" || SRV.learn || learnLoad.busy) return; learnLoad.busy = true; learnLoad.fail = false;
  srv("GET", "/api/learn").then(l => { SRV.learn = Array.isArray(l) ? l : []; learnLoad.fail = false }, () => { learnLoad.fail = true }).then(() => { learnLoad.busy = false; learnDraw() });
}
function learnDraw() {                               // 배운 답 목록과 개수 표시만 다시 그린다 (찾던 말 · 고치던 글은 그대로 둔다)
  const ul = $("#learnList"); if (!ul || !SRV) return; const inp = $("#learnQ"); if (inp) SRV.learnQ = inp.value;
  const all = SRV.learn, q = staffKey(SRV.learnQ), hit = !all ? [] : q ? all.filter(x => learnHay(x).includes(q)) : all, D = SRV.learnDraft || {}, bs = 'style="min-height:40px"';
  const row = x => { const s = LEARN_ST[x.state] || LEARN_ST.new, id = esc(x.id), off = s === LEARN_ST.off, hold = !!x.hold && s === LEARN_ST.new, live = s === LEARN_ST.ok || (!off && x.gen && !hold);   // hold = 실장이 ‘부족해요’를 눌러 쉬는 검토 전 답
    return `<li data-learn="${id}"><b style="flex:1 1 100%;min-width:0;overflow-wrap:anywhere;font-size:15px">${esc(x.q)}</b><span class="chip ${s[1]}">${s[0]}</span>${+x.bad ? `<span class="chip warn" title="실장이 이 답에 ‘부족해요’를 누른 횟수입니다. 답을 고쳐 저장하면 0부터 다시 셉니다">부족해요 ${+x.bad}번</span>` : ""}<span class="note" style="flex:1 1 200px;min-width:0">${esc(x.by || "")} · ${esc(fmtAt(x.at))} · 다시 쓴 횟수 ${+x.n || 0}번${x.editedBy ? ` · ${esc(x.editedBy)} 고침 ${esc(fmtAt(x.editedAt))}` : ""} · ${off ? "같은 질문이 와도 이 답은 나가지 않습니다" : hold ? "‘부족해요’를 받아 쉬는 중 — 같은 질문이 오면 AI가 새로 답해 이 답을 바꿉니다 (그대로 쓰려면 ‘확인함’)" : live ? "같은 질문에 바로 나갑니다" : "앞 대화나 그때의 견적에 기댄 답일 수 있어 ‘확인함’을 눌러야 나갑니다"}</span>
      <textarea data-learna="${id}" rows="4" maxlength="6000" spellcheck="false" style="flex:1 1 100%;font-size:15px;line-height:1.6;resize:vertical" aria-label="${esc(helpCut(String(x.q || ""), 40))} — 답">${esc(D[x.id] != null ? D[x.id] : x.a)}</textarea>
      <button class="btn" data-learnsave="${id}" ${bs} title="위 칸에서 고친 글을 저장합니다. 저장하면 ‘확인함’이 되고 같은 질문에 이 답이 나갑니다">고친 답 저장</button>${s === LEARN_ST.new ? `<button class="btn primary" data-learnset="${id}|ok" ${bs} title="읽어 보니 맞는 답입니다. 같은 질문에 이 답이 그대로 나가고, AI의 새 답으로 바뀌지 않습니다">확인함</button>` : ""}<button class="btn" data-learnset="${id}|${off ? "new" : "off"}" ${bs} title="${off ? "‘쓰지 않음’을 풀고 검토 전으로 되돌립니다" : "같은 질문이 와도 이 답을 내보내지 않습니다 (AI가 새로 답합니다)"}">${off ? "다시 쓰기" : "쓰지 않기"}</button><span class="spacer"></span><button class="btn danger" data-learndel="${id}" ${bs}>삭제</button></li>` };
  ul.innerHTML = !all ? `<li class="note">${learnLoad.fail ? "배운 답 목록을 불러오지 못했습니다. ‘목록 새로 고침’을 눌러 주세요. (서버가 옛 판이면 서버를 새 판으로 바꾼 뒤에 됩니다)" : "불러오는 중…"}</li>`
    : !all.length ? '<li class="note">아직 배운 답이 없습니다. 챗봇 AI가 질문에 답하면 여기에 쌓입니다.</li>'
    : !hit.length ? '<li class="note">찾는 답이 없습니다. 질문이나 답에 든 낱말로 찾아 주세요. (‘검토’ · ‘확인’ · ‘쓰지’ · ‘부족’으로도 찾을 수 있습니다)</li>'
    : hit.slice(0, LEARN_SHOW).map(row).join("") + (hit.length > LEARN_SHOW ? `<li class="note">${hit.length - LEARN_SHOW}개가 더 있습니다. 찾는 말을 적어 좁혀 주세요.</li>` : "");
  const cnt = $("#learnCnt"), sum = $("#learnSum"); if (cnt) cnt.textContent = q && all ? `${hit.length}개 찾음` : ""; if (sum) sum.innerHTML = learnSum();
}
function learnHtml() {                               // 관리자만: ‘챗봇이 배운 답’ 묶음의 틀 (줄은 learnDraw 가 채운다)
  return `<details class="more" id="learnBox"${SRV.learnOpen ? " open" : ""}><summary>챗봇이 배운 답 <span id="learnSum">${learnSum()}</span><span class="note">AI가 답한 내용이 쌓이고, 같은 질문에는 이 답이 바로 나갑니다 · 읽어 보고 고치거나 끌 수 있습니다</span></summary><div class="bd">
      <p class="note">챗봇 AI가 답한 내용이 여기에 쌓이고, 같은 질문이 다시 오면 AI를 다시 부르지 않고 이 답이 그대로 나갑니다(누구에게나 같은 답). 읽어 보고 틀린 곳은 고쳐서 ‘고친 답 저장’, 맞으면 ‘확인함’, 나가면 안 되는 답은 ‘쓰지 않기’를 눌러 주세요. ‘확인함’인 답은 AI의 새 답으로 바뀌지 않습니다. 실장이 ‘부족해요’를 누른 답에는 ‘부족해요 N번’이 붙고(‘부족’으로 찾기), 확인 전의 답이면 다음에 AI가 새로 답해 바꿉니다. 답 끝의 [이동:s4] 같은 표시는 그 단계로 가는 단추가 됩니다.</p>
      <div class="toolbar" style="margin-top:6px"><input type="search" id="learnQ" value="${esc(SRV.learnQ || "")}" placeholder="질문 · 답에 든 낱말로 찾기" autocapitalize="none" spellcheck="false" style="flex:1 1 220px;width:auto;min-height:40px" aria-label="배운 답 찾기 (질문·답)"><button class="btn" id="learnReload" style="min-height:40px" title="그 사이에 새로 쌓인 답까지 다시 불러옵니다">목록 새로 고침</button><span class="note" id="learnCnt"></span></div>
      <ul class="list" id="learnList" style="margin-top:6px"></ul></div></details>`;
}
document.addEventListener("toggle", ev0 => { const d = ev0.target; if (!SRV || !d || d.id !== "learnBox") return; SRV.learnOpen = d.open; if (d.open) learnLoad() }, true);   // 묶음을 펼칠 때 목록을 불러온다 (toggle 은 위로 퍼지지 않아 잡는 단계에서 듣는다). 펼쳐 둔 것은 화면을 다시 그려도 펼친 채로 둔다
/* (v69) 밖에서 여는 관리자 문: 회사 주소의 /admin 은 ① 승인한 기기이고 ② 관리자 비밀번호가 맞을 때만 열린다 (서버 10판).
   여기서는 켜짐/꺼짐 · 승인된 기기(지우기) · 승인을 기다리는 기기(승인 번호를 확인하고 승인)를 본다. 펼칠 때 불러온다. 켜는 것은 서버 PC에서만 된다. */
const admFmt = c => String(c == null ? "" : c).replace(/^(\d{3})(\d{3})$/, "$1 $2");
function admDoorHtml() {
  const A = SRV.adm, S = (SRV.info && SRV.info.adminOut) || {}, on = A ? !!A.on : !!S.on, n = A ? (A.devs || []).length : +S.devs || 0, pn = A ? (A.pend || []).length : +S.pend || 0;
  const body = SRV.admErr ? `<p class="note down">${esc(SRV.admErr)}</p>` : !A ? '<p class="note">불러오는 중…</p>' : `
      <p class="note"><b>${A.on ? "켜짐" : "꺼짐"}</b> ${A.on ? `· 주소 ${A.url ? `<input readonly value="${esc(A.url)}" style="width:auto;min-width:290px" onclick="this.select()" aria-label="밖에서 여는 관리자 주소">` : "(밖에서 들어오는 주소를 아직 적어 두지 않았습니다)"} 승인한 기기에서 이 주소를 열고 관리자 비밀번호를 넣습니다. 들어온 뒤 ${+A.hours || 12}시간이 지나거나 브라우저를 닫으면 다시 묻습니다. <b>이 주소는 실장에게 알려 주지 않습니다.</b> <button type="button" class="btn sm" id="admOff" title="끄면 밖에서는 관리자 화면이 열리지 않습니다 (있는지도 알 수 없습니다). 다시 켜는 것은 서버 PC에서만 됩니다">끄기</button>` : `— 밖에서는 관리자 화면이 열리지 않습니다(있는지도 알 수 없습니다).${ADM_OUT ? "" : ' <button type="button" class="btn sm" id="admOn">켜기</button>'}`}</p>
      ${A.on && !A.locked ? '<p class="note down">관리자 자료가 비밀번호로 잠겨 있지 않아 지금은 밖에서 열리지 않습니다. ‘4_관리자_데이터_잠그기.bat’을 실행하면 열립니다.</p>' : ""}
      ${(A.pend || []).length ? `<p class="note" style="margin-bottom:4px"><b>승인을 기다리는 기기</b> — 그 기기의 화면에 뜬 승인 번호와 같은지 꼭 확인하고 승인하세요. 모르는 요청은 지웁니다.</p><ul class="list">${A.pend.map(x => `<li><b style="letter-spacing:.06em">승인 번호 ${esc(admFmt(x.code))}</b><span>${esc(x.name)}</span><span class="note">${esc(x.ua || "")} · ${esc(x.ip || "")} · ${+x.min || 0}분 남음</span><span class="spacer"></span><button type="button" class="btn sm primary" data-admok="${esc(x.code)}">승인</button><button type="button" class="btn sm" data-admno="${esc(x.code)}">지우기</button></li>`).join("")}</ul>` : ""}
      <p class="note" style="margin:8px 0 4px"><b>승인된 기기</b> ${(A.devs || []).length}대 <span class="note">(${+A.max || 10}대까지)</span> <button type="button" class="btn ghost sm" id="admReload">새로 고침</button></p>
      <ul class="list">${(A.devs || []).map(d => `<li><b>${esc(d.name)}</b>${d.me ? '<span class="chip ok">지금 이 기기</span>' : ""}<span class="note">${esc(d.ua || "")} · 승인 ${esc(d.at || "")}${d.by ? " (" + esc(d.by) + ")" : ""} · 마지막으로 들어온 때 ${esc(d.lastAt || "아직 없음")}</span><span class="spacer"></span><button type="button" class="btn sm danger" data-admdel="${esc(d.id)}" title="${d.me ? "지금 쓰는 이 기기입니다. 지우면 이 화면도 바로 잠깁니다" : "이 기기에서는 다시 승인받아야 관리자 화면이 열립니다"}">지우기</button></li>`).join("") || '<li class="note">아직 승인된 기기가 없습니다.</li>'}</ul>
      <p class="note">새 기기를 쓰려면: 그 기기에서 위 주소를 열고 ‘이 기기 승인 요청’을 누릅니다 → 화면에 뜬 승인 번호를 여기서 ‘승인’하거나 클로드에게 알려 줍니다. 승인하지 않은 기기에서는 비밀번호를 맞혀 볼 수도 없습니다. 기기를 잃어버렸으면 바로 ‘지우기’를 누르세요. ${+A.days > 0 ? `${+A.days}일 동안 쓰지 않은 기기는 승인이 저절로 풀립니다.` : ""}</p>`;
  return `<details class="more" id="admBox"${SRV.admOpen ? " open" : ""}><summary>밖에서 여는 관리자 문 <span class="chip ${on ? "ok" : ""}">${on ? "켜짐" : "꺼짐"}</span>${n ? ` <span class="chip">기기 ${n}대</span>` : ""}${pn ? ` <span class="chip warn">승인 기다림 ${pn}</span>` : ""} <span class="note">대표님 컴퓨터에 가지 않고 이 관리자 화면을 여는 길 · 승인한 기기 + 관리자 비밀번호</span></summary><div class="bd">${body}</div></details>`;
}
function admLoad() { if (SRV.admBusy) return; SRV.admBusy = true; SRV.admErr = ""; srv("GET", "/api/adm/devs").then(a => { SRV.adm = a || {} }).catch(() => { SRV.admErr = "불러오지 못했습니다. 서버가 새 판으로 다시 켜진 뒤에 보입니다." }).then(() => { SRV.admBusy = false; renderSrv() }) }
document.addEventListener("toggle", ev0 => { const d = ev0.target; if (!d || d.id !== "admBox" || !SRV) return; SRV.admOpen = d.open; if (d.open && !SRV.adm && !SRV.admErr) admLoad() }, true);
document.addEventListener("click", async ev0 => { const t = ev0.target; if (!SRV || !t.closest) return;
  const re = t.closest("[data-admre]"), out = t.closest("[data-admout]");
  if (re) { location.href = "/admin?why=expired"; return }
  if (out) {                                          // 잠그기 (두 번 눌러야): 서버가 이 기기에 준 로그인을 모두 못 쓰게 하고, 이 탭에 둔 자료 키도 지운다
    if (!out.dataset.armed) { out.dataset.armed = 1; out.textContent = "한 번 더 누르면 잠급니다"; setTimeout(() => { if (out.isConnected && out.dataset.armed) { delete out.dataset.armed; out.textContent = "잠그기" } }, 4000); return }
    save(); try { await fetch("/api/adm/logout", { method: "POST", headers: srvHead(), body: "{}" }) } catch (e) { }
    try { sessionStorage.removeItem("sido3_k"); sessionStorage.removeItem("sido3_admin") } catch (e) { } location.href = "/admin?out=1"; return }
  if (!SRV.me || SRV.me.role !== "admin") return;
  if (t.id === "admReload") { SRV.adm = null; SRV.admErr = ""; SRV.admOpen = true; admLoad(); renderSrv(); return }
  const ok = t.closest("[data-admok]"), no = t.closest("[data-admno]"), del = t.closest("[data-admdel]"), off = t.id === "admOff", onb = t.id === "admOn";
  if (!ok && !no && !del && !off && !onb) return;
  const two = del || (off ? t : null);                // 지우기 · 끄기는 두 번 눌러야
  if (two && !two.dataset.armed) { two.dataset.armed = 1; const was = two.textContent; two.textContent = off ? "한 번 더 누르면 끕니다" : "한 번 더 누르면 지움"; setTimeout(() => { if (two.isConnected && two.dataset.armed) { delete two.dataset.armed; two.textContent = was } }, 4000); return }
  let r; try { r = await srv("POST", "/api/adm/devs", ok ? { approve: ok.dataset.admok } : no ? { deny: no.dataset.admno } : del ? { remove: del.dataset.admdel } : { on: !!onb }) }
  catch (e) { toast(e.msg || e.message); SRV.adm = null; SRV.admOpen = true; admLoad(); return }
  SRV.adm = r; SRV.info = null; SRV.admOpen = true; renderSrv();
  toast(ok ? "승인했습니다. 그 기기의 화면이 곧 비밀번호 넣는 화면으로 바뀝니다." : no ? "그 요청을 지웠습니다." : del ? "그 기기를 지웠습니다. 그 기기에서는 다시 승인받아야 열립니다." : onb ? "밖에서 여는 관리자 문을 켰습니다. 쓸 기기에서 주소를 열어 승인을 요청하세요." : "밖에서 여는 관리자 문을 껐습니다. 이제 밖에서는 관리자 화면이 열리지 않습니다. 다시 켜는 것은 서버 PC에서 합니다.");
});
function srvAdminHtml() {                            // 관리자만: 실장 아이디·번호 관리 + 서버 상태(챗봇 AI · 프로그램 새 판)
  const I = SRV.info || {}, ai = I.ai, up = I.update;
  return `<details class="more" style="margin-top:8px"${SRV.staffOpen ? " open" : ""}><summary>실장 아이디·번호 관리 ${(SRV.staff || []).length ? `<span class="chip">${SRV.staff.length}명</span> ` : ""}<span class="note">실장마다 아이디와 번호를 주면 그것으로 로그인해서 들어옵니다 · 퇴사자는 ‘사용 중지’</span></summary><div class="bd">
      ${I.front && I.front.url ? `<p class="note"><b>실장 접속 주소 (언제나 열림)</b> <input readonly value="${esc(I.front.url)}" style="width:auto;min-width:320px" onclick="this.select()" aria-label="언제나 열리는 실장 접속 주소"> 회사 컴퓨터가 꺼져 있어도 열리는 주소입니다. <span class="note">${I.front.gate && I.front.gate.on ? "<b>실장에게는 이 주소 하나만 알려 주면 됩니다</b> — 회사 컴퓨터가 꺼져 있어도, 처음 쓰는 기기에서도 아이디·번호로 로그인됩니다. 꺼져 있을 때 로그인을 확인하는 곳(문지기): " + (I.front.gate.ok === false ? "<b>연결 안 됨</b> — " + esc(I.front.gate.msg || "") : esc(I.front.gate.msg || "") + (I.front.gate.at ? " (" + esc(I.front.gate.at) + ")" : "")) + "." : I.front.offline ? "<b>‘알려 줄 글 복사’에는 실장마다 다른 ‘전용 주소’가 들어갑니다</b> — 그 주소로 열면 회사 컴퓨터가 꺼져 있어도 처음 쓰는 기기에서 로그인됩니다(본인에게만 보내세요)." : "실장에게는 이 주소를 알려 주세요 (아이디·번호는 같습니다)."} 꺼져 있을 때 실장이 보는 내 견적 사본: ${I.front.mirror && I.front.mirror.on ? (I.front.mirror.ok === false ? "<b>올리지 못함</b> — " + esc(I.front.mirror.msg || "") : "올리는 중" + (I.front.mirror.at ? " (마지막 " + esc(I.front.mirror.at) + ")" : "")) : "꺼짐"}</span></p>` : ""}
      ${I.lan ? `<p class="note"><b>${I.front && I.front.url ? "회사 주소 (회사 컴퓨터가 켜져 있을 때)" : "실장 접속 주소"}</b> ${I.outside && I.outside.url ? `<input readonly value="${esc(I.outside.url + "/")}" style="width:auto;min-width:270px" onclick="this.select()" aria-label="밖에서도 되는 실장 접속 주소"> 사무실 안팎 어디서나 이 주소를 열고 아이디와 번호를 넣습니다. <span class="note">실장에게는 이 주소만 알려 주세요.</span>` : `<input readonly value="${esc(I.lan + "/")}" style="width:auto;min-width:230px" onclick="this.select()" aria-label="실장 접속 주소"> 같은 사무실 인터넷에 연결된 기기에서 이 주소를 열고 아이디와 번호를 넣습니다. <span class="note">밖(집·카페)에서는 이 주소가 열리지 않습니다.</span>`}<br><b>저장 위치</b> ${esc(I.data || "")} <span class="note">· 견적 ${I.est || 0}건 · 보낸 견적 ${I.sent || 0}건 · 도면 ${I.plans || 0}건${I.backup ? " · 백업 " + esc(I.backup) : " · 백업 둘 곳 아직 없음"}</span></p>` : ""}
      <div class="toolbar"><input id="staffName" placeholder="실장 이름" style="flex:0 1 150px;width:auto" aria-label="새 실장 이름"><input id="staffLogin" placeholder="아이디 (비우면 ${esc(I.nextLogin || "자동")})" maxlength="24" autocapitalize="none" spellcheck="false" style="flex:0 1 190px;width:auto" aria-label="새 실장 아이디"><button class="btn sm" id="staffAdd">실장 추가</button></div>
      ${(SRV.staff || []).length ? `<div class="toolbar" style="margin-top:6px"><input type="search" id="staffQ" value="${esc(SRV.staffQ || "")}" placeholder="이름 · 아이디로 찾기 (실장 ${SRV.staff.length}명 · 사용 중 ${SRV.staff.filter(s => s.active !== false).length}명)" autocapitalize="none" spellcheck="false" style="flex:1 1 240px;width:auto" aria-label="실장 찾기 (이름·아이디)"><span class="note" id="staffCnt"></span></div>` : ""}
      <ul class="list" style="margin-top:6px">${(SRV.staff || []).map(s => `<li data-sq="${esc(staffKey(s.name) + "|" + staffKey(s.login) + "|" + (s.active === false ? "중지" : "사용중"))}"><b>${esc(s.name)}</b><span class="note">아이디</span><input value="${esc(s.login || "")}" data-staffid="${esc(s.id)}" data-old="${esc(s.login || "")}" maxlength="24" autocapitalize="none" spellcheck="false" style="flex:0 1 120px;width:auto;text-align:center;font-weight:700" aria-label="${esc(s.name)} 아이디" title="고쳐 적으면 ‘아이디 저장’이 나옵니다"><button class="btn sm primary" data-staffidsave="${esc(s.id)}" hidden>아이디 저장</button><span class="note">번호(비밀번호)</span><input readonly value="${esc(s.code || "")}" style="flex:0 1 100px;width:auto;text-align:center;font-weight:700;letter-spacing:.08em" onclick="this.select()" aria-label="${esc(s.name)} 번호"><span class="chip ${s.active === false ? "warn" : "ok"}">${s.active === false ? "중지" : "사용 중"}</span><span class="spacer"></span><button class="btn sm" data-staffcopy="${esc(s.id)}" title="주소·아이디·번호를 한 번에 복사합니다. 메신저에 붙여 넣어 본인에게만 보내세요">알려 줄 글 복사</button><button class="btn sm" data-staffgo="${esc(s.id)}" title="${s.active === false ? "사용 중지된 아이디는 들어갈 수 없습니다. ‘다시 사용’을 누른 뒤에 볼 수 있습니다" : "이 실장이 보는 화면을 새 창에 그대로 엽니다 (그 실장의 아이디·번호로 들어간 것과 같습니다)"}"${s.active === false ? " disabled" : ""}>실장 화면 보기</button><button class="btn sm" data-stafftoggle="${esc(s.id)}|${s.active === false ? 1 : 0}">${s.active === false ? "다시 사용" : "사용 중지"}</button><button class="btn sm" data-staffrenum="${esc(s.id)}">번호 새로 만들기</button></li>`).join("") || '<li class="note">아직 실장이 없습니다.</li>'}<li class="note" id="staffNone" hidden>찾는 실장이 없습니다. 이름이나 아이디를 다시 확인해 주세요. (‘중지’·‘사용’으로도 찾을 수 있습니다)</li></ul>
      <p class="note">실장에게는 주소·아이디·번호 세 가지를 알려 줍니다(‘알려 줄 글 복사’). <b>번호가 그 실장의 비밀번호</b>이고, 관리자는 여기서 언제든 볼 수 있습니다. ‘실장 화면 보기’를 누르면 그 실장이 보는 화면이 새 창에 그대로 열립니다(원가·마진은 보이지 않는 실장용 화면). 아이디는 띄어쓰기·대소문자를 가리지 않습니다(sido 100 = sido100). 번호는 본인에게만 알려 주세요. ‘사용 중지’를 누르면 그 아이디로는 바로 들어올 수 없고, 열어 둔 화면도 저장소에 연결되지 않습니다. ‘번호 새로 만들기’를 하면 전 번호와 그 번호로 들어와 있던 화면이 모두 끊깁니다(새 번호를 ‘알려 줄 글’로 다시 보내 주세요 — 전용 주소를 쓰는 방식이면 주소도 바뀝니다). 회사 컴퓨터가 꺼져 있는 동안에는 여기 일을 할 수 없습니다 — 사용 중지·번호 새로 만들기는 켜져 있을 때 하고, 그러면 꺼진 뒤에도 그 실장의 기기는 인터넷에 닿는 대로 로그인이 풀립니다.</p></div></details>
    ${admDoorHtml()}
    ${patchHtml()}
    ${learnHtml()}
    ${ai && up ? `<details class="more"${SRV.updOpen ? " open" : ""}><summary>서버 상태 <span class="note">챗봇 AI ${ai.on ? "켜짐" : "꺼짐"} · 프로그램 새 판 ${up.repo && up.git ? (up.min > 0 ? up.min + "분마다 저절로 받음" : "저절로 받기 꺼 둠") : "저절로 받지 못함"} · 밖에서 접속 ${I.outside && I.outside.port ? "켜짐" : "꺼짐"}</span></summary><div class="bd">
      <p class="note"><b>밖에서 접속</b> ${I.outside && I.outside.port ? `켜짐 · 주소 ${I.outside.url ? esc(I.outside.url + "/") : "아직 적어 두지 않았습니다"} <span class="note">· 밖에서 오는 요청에는 ${I.adminOut && I.adminOut.on ? "승인한 기기에서 관리자 비밀번호로 들어온 경우에만 관리자 화면이 나갑니다(위 ‘밖에서 여는 관리자 문’)" : "관리자 화면이 나가지 않습니다"}. 같은 아이디를 5번 틀리면 그 아이디의 밖 로그인이 15분 막힙니다.</span>` : "꺼짐 — 사무실 인터넷 안에서만 들어옵니다."}</p>
      <p class="note"><b>챗봇 AI</b> ${ai.on ? `켜짐 · ${esc(ai.model)} · 오늘 ${+ai.today || 0}번 · 이번 달 ${+ai.month || 0}번 (입력 ${won(+ai.monthIn || 0)} · 출력 ${won(+ai.monthOut || 0)} 토큰) · 실장 한 명이 하루 ${+ai.daily || 0}번까지` : `꺼짐 — ${esc(ai.why || "")}. 꺼져 있어도 저장된 답으로는 답합니다.`}${+ai.learn ? ` · 배운 답 ${+ai.learn}개` : ""}${ai.err ? `<br><span class="down">마지막 AI 오류 (${esc(ai.errAt || "")}): ${esc(ai.err)}</span>` : ""}</p>
      <p class="note"><b>프로그램 새 판</b> ${!up.repo ? "묶음 파일로 받은 폴더라 새 판을 저절로 받지 못합니다. 새 묶음을 풀어 넣으면 바뀝니다." : !up.git ? "Git 프로그램을 찾지 못해 새 판을 받지 못합니다." : `${up.head ? "지금 판 " + esc(up.head) + " · " : ""}${esc(up.msg || "")}${up.at ? " (" + esc(up.at) + " 확인)" : ""} <button class="btn sm" id="srvUpdate">지금 새 판 받기</button><br>${up.min > 0 ? `다른 PC에서 고쳐 깃허브에 올린 내용은 이 서버가 ${+up.min}분 안에 저절로 받아 옵니다.` : "저절로 받기는 꺼 두었습니다. ‘지금 새 판 받기’를 누르면 받습니다."} 실장 화면은 새로 고치면 새 판으로 보입니다.`}</p></div></details>` : ""}`;
}
/* (v63) 보낸 견적 목록: 인쇄·엑셀·파일로 고객에게 나간 견적은 서버가 ‘보낸견적’에 그때 내용 그대로 쌓아 둔다 — 그것을 목록으로 본다.
   실장은 자기 것, 관리자는 전체(새것부터 300건). 펼칠 때만 불러오고, ‘사본으로 열기’는 새 번호의 임시저장 사본으로 연다(원래 견적과 보낸 기록은 바뀌지 않는다). */
function sentHtml() {
  const L = SRV.sent, adm = SRV.me.role === "admin", names = adm && L ? [...new Set(L.map(x => x.by).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "ko")) : [], sw = names.includes(SRV.sentWho) ? SRV.sentWho : "";   // (v70) 관리자: 실장별로 보기
  return `<details class="more" id="sentBox" ${SRV.sentOpen ? "open" : ""} style="margin-top:10px"><summary>고객에게 보낸 견적 <span class="note">인쇄 · 엑셀 · 파일로 나간 그때 내용이 그대로 남아 있습니다${L ? ` · ${L.length}건` : ""}</span></summary><div class="bd">
    ${SRV.sentErr ? `<p class="note down">${esc(SRV.sentErr)}</p>` : !L ? '<p class="note">불러오는 중…</p>' : !L.length ? '<p class="note">아직 없습니다. 상세견적서에서 인쇄 · 엑셀 저장 · 파일 내보내기를 하면 여기에 남습니다.</p>' : `${names.length > 1 ? `<div class="toolbar" style="margin-bottom:6px"><span class="note">실장별로 보기</span><button type="button" class="btn sm${sw ? "" : " primary"}" data-sentwho="">전체 ${L.length}</button>${names.map(n => `<button type="button" class="btn sm${sw === n ? " primary" : ""}" data-sentwho="${esc(n)}">${esc(n)} ${L.filter(x => x.by === n).length}</button>`).join("")}</div>` : ""}<div class="toolbar" style="margin-bottom:6px"><input type="search" id="sentQ" value="${esc(SRV.sentQ || "")}" placeholder="고객명 · 주소${adm ? " · 실장 이름" : ""}으로 찾기" style="flex:1 1 240px;width:auto" aria-label="보낸 견적 찾기"><span class="note" id="sentQCnt"></span></div>
    <ul class="list">${L.filter(x => !sw || x.by === sw).map(x => `<li data-sq2="${esc([x.client, x.site, x.by].filter(Boolean).join(" ").toLowerCase())}"><b>${esc(x.client || "(고객명 없음)")}</b><span class="note">${esc(x.site || "")}</span>${adm ? `<span class="chip admin">${esc(x.by)}</span>` : ""}<span class="chip">${esc(x.how || "보냄")}</span><span class="chip">v${esc(x.ver)}</span><span class="chip">${won(x.total || 0)}원</span><span class="note">${esc(fmtAt(x.at))}</span><span class="spacer"></span><button class="btn sm" data-sentopen="${esc(x.key)}" title="보낸 그때의 내용을 사본으로 엽니다. 원래 견적은 바뀌지 않습니다">사본으로 열기</button></li>`).join("")}</ul>`}</div></details>`;
}
function sentLoad() { if (SRV.sentBusy) return; SRV.sentBusy = true; SRV.sentErr = ""; srv("GET", "/api/sent").then(L => { SRV.sent = Array.isArray(L) ? L : [] }).catch(() => { SRV.sentErr = "보낸 견적 목록을 불러오지 못했습니다. 서버가 새 판으로 다시 켜진 뒤에 보입니다." }).then(() => { SRV.sentBusy = false; renderSrv() }) }
function sentFilter() { const q = $("#sentQ"), k = String(SRV.sentQ || "").toLowerCase().replace(/\s+/g, ""); if (!q) return; let n = 0, all = 0;
  document.querySelectorAll("#sentBox li[data-sq2]").forEach(li => { all++; const ok = !k || li.dataset.sq2.replace(/\s+/g, "").includes(k); li.hidden = !ok; if (ok) n++ });
  const c = $("#sentQCnt"); if (c) c.textContent = k ? `${n}건 찾음 (전체 ${all}건)` : "" }
document.addEventListener("toggle", ev0 => { const d = ev0.target; if (!d || d.id !== "sentBox" || !SRV) return; SRV.sentOpen = d.open; if (d.open && !SRV.sent && !SRV.sentErr) sentLoad() }, true);
document.addEventListener("input", ev0 => { if (ev0.target && ev0.target.id === "sentQ" && SRV) { SRV.sentQ = ev0.target.value; sentFilter() } });
document.addEventListener("click", async ev0 => { const b = ev0.target.closest && ev0.target.closest("[data-sentopen]"); if (!b || !SRV || !SRV.me) return;
  try { const x = await srv("GET", "/api/sent/" + b.dataset.sentopen), s = x._sent || {}; delete x._sent; x.id = "e" + Date.now(); x.draft = true; delete x.savedBy; x.info = { ...(x.info || {}), client: (x.info && (x.info.client || x.info.site) || "견적") + " (보낸 견적 사본)" };
    openEst(x, `${fmtAt(s.at)}에 ${s.by ? s.by + " 님이 " : ""}보낸 견적의 사본을 열었습니다. 원래 견적과 보낸 기록은 그대로입니다.`) } catch (e) { toast("그 견적을 열지 못했습니다. " + (e && e.msg || "")) } });
function renderSrv() {                               // ‘저장된 견적’ 화면에서 회사 쪽 부분. 관리자 = 목록 위에 회사 저장소(실장별) + 지운 견적 · 실장 아이디·번호 관리 · 서버 상태 / 실장 = 연결 안내뿐 — (v70) 실장의 견적은 아래 한 목록에 합쳐 보여 준다(renderSaved · savedRows)
  if (!SRV) return; let box = $("#srvBox"); if (!box) { $("#savedList").insertAdjacentHTML("beforebegin", '<div id="srvBox" style="margin-bottom:14px"></div>'); box = $("#srvBox") }
  let tail = $("#srvTail"); if (!tail) { $("#savedList").insertAdjacentHTML("afterend", '<div id="srvTail"></div>'); tail = $("#srvTail") }   // 실장 화면: 목록 아래에 ‘고객에게 보낸 견적’
  if (SRV.front && SRV.down) { tail.innerHTML = ""; box.innerHTML = frontDownNote(); if ((frontSess() || {}).mir && Date.now() - (SRV.mirAt || 0) > 120000) mirLoad(); return }   // (v81)
  if (SRV.token && SRV.down) { const n = pendIds().length; tail.innerHTML = ""; box.innerHTML = `<p class="note down"><b>회사 컴퓨터가 꺼져 있어</b> ${keepList() ? "회사에 보관해 둔 내 견적은 <b>이 기기에 받아 둔 사본</b>(마지막으로 연결됐을 때까지)으로 보여 드립니다." : "지금은 이 기기에 있는 견적만 보입니다."} 그대로 쓸 수 있고, 여기서 저장한 견적${n ? ` <b>${n}건</b>` : ""}은 회사 컴퓨터가 켜지면 저절로 회사에도 보관됩니다. <button type="button" class="btn ghost sm" data-srvretry>지금 다시 연결해 보기</button></p>`; return }
  if (!SRV.me) { tail.innerHTML = ""; box.innerHTML = SRV.token ? '<p class="note down">로그인이 풀렸거나 회사 컴퓨터에 연결되지 않았습니다. 화면 위의 ‘회사 저장소 연결 안 됨’을 눌러 다시 로그인해 보세요. 아래 목록은 이 기기에 있는 견적입니다.</p>'
      : ADM_OUT ? '<p class="note down"><b>관리자 로그인이 풀렸습니다.</b> 들어온 지 12시간이 지났거나 다른 곳에서 잠갔습니다. <button type="button" class="btn primary sm" data-admre>다시 들어가기</button> <span class="note">쓰던 내용은 이 기기에 남아 있습니다.</span></p>'
      : '<div class="toolbar"><b>회사 저장소</b><input id="srvKey" type="password" placeholder="저장소 관리자 키 (서버의 관리자키.txt)" style="flex:1 1 220px;width:auto"><button class="btn primary sm" id="srvKeyBtn">연결</button></div>'; return }
  const adm = SRV.me.role === "admin";
  if (!SRV.list) { box.innerHTML = adm ? '<p class="note">회사 저장소 목록을 불러오는 중…</p>' : ""; if (!adm) tail.innerHTML = "";
    if (!SRV.listBusy) { SRV.listBusy = true; srv("GET", "/api/est").then(L => { SRV.listBusy = false; SRV.list = Array.isArray(L) ? L : []; if (!adm && $("#view-saved") && !$("#view-saved").hidden) renderSaved(); else renderSrv() })
      .catch(e => { SRV.listBusy = false; if (ADM_OUT && !SRV.me) { renderSrv(); return } box.innerHTML = `<p class="note down">${esc(adm ? e.message : "회사에 보관된 견적을 불러오지 못했습니다. 아래는 이 기기에 있는 견적입니다.")}</p>` }) }
    return }
  if (!adm) {                                        // 실장: ‘회사 저장소’ 칸을 따로 두지 않는다 — 내 견적은 아래 ‘저장된 견적’ 한 목록에 합쳐져 있다. 목록 아래에 ‘고객에게 보낸 견적’만 둔다
    box.innerHTML = myLinkHtml(); tail.innerHTML = sentHtml(); sentFilter(); if (SRV.sentOpen && !SRV.sent && !SRV.sentErr) sentLoad(); return }
  tail.innerHTML = "";
  const L = SRV.list, B = store.get("sido_srv_base", {}) || {}, OW = store.get("sido_srv_owner", {}) || {};
  const moved = x => B[x.id] && x.savedAt && B[x.id] !== x.savedAt && (OW[x.id] || "admin") === x.owner;   // 이 기기가 맞춘 뒤에 다른 곳(실장·다른 기기)에서 다시 저장한 견적
  if (!SRV.staff) srv("GET", "/api/staff").then(s => { SRV.staff = s; renderSrv() }).catch(() => {});
  if (!SRV.info) { SRV.info = {}; srv("GET", "/api/info").then(i => { SRV.info = i || {}; renderSrv() }).catch(() => {}) }   // 실장이 들어올 주소 · 저장 위치
  /* (v70) 실장별로 나눠 보여 준다: 실장마다 머리 줄(이름 · 아이디 · 건수 · 마지막 저장) 아래에 그 실장의 견적. ‘실장별로 보기’ 단추로 한 사람 것만 볼 수 있다. 아직 견적이 없는 실장도 머리 줄은 나온다 */
  const stf = Array.isArray(SRV.staff) ? SRV.staff : [], lgOf = Object.fromEntries(stf.map(s => [s.id, s.login || ""])), G = new Map();
  const grp = (id, name) => { if (!G.has(id)) G.set(id, { id, name, rows: [] }); return G.get(id) };
  for (const s of stf) if (s.active !== false) grp(s.id, s.name);
  for (const x of L) grp(x.owner, x.owner === "admin" ? "관리자" : x.staffName || x.owner).rows.push(x);
  const groups = [...G.values()].sort((a, b) => (a.id === "admin") - (b.id === "admin") || String(a.name).localeCompare(String(b.name), "ko")), who = SRV.listWho && G.has(SRV.listWho) ? SRV.listWho : "";
  const row = x => `<li data-own="${esc(x.owner)}" data-q="${esc([x.client, x.site, x.region, x.manager, x.staffName].filter(Boolean).join(" ").toLowerCase())}"><b>${esc(x.client || "(고객명 없음)")}</b><span class="note">${esc(x.site || "")}</span><span class="chip admin">${esc(x.owner === "admin" ? "관리자" : x.staffName)}</span>${x.draft ? '<span class="chip warn" title="‘저장’이 아니라 ‘임시저장’으로 올라온 견적입니다(쓰는 중)">임시저장</span>' : ""}<span class="chip">${esc(x.kind)} v${esc(x.ver)}</span><span class="chip">${won(x.total || 0)}원</span>${x.mg && x.mg.net ? `<span class="chip" title="저장할 때의 값 (VAT 별도 · 기업이윤 포함) · 견적 금액 ${won(x.mg.net)}원 − 원가 ${won(x.mg.cost)}원${x.mg.ov ? " · 실장이 공정 " + x.mg.ov + "곳의 원가를 고쳐 적음" : ""}">원가 ${won(x.mg.cost)} · 차액 ${won(x.mg.net - x.mg.cost)} (${mgPct(x.mg.m)}%)${x.mg.ov ? " ✎" : ""}</span>` : ""}<span class="note">${esc(fmtAt(x.savedAt))}</span>${x.savedBy && x.savedBy !== x.staffName ? `<span class="chip" title="마지막으로 저장한 사람">${esc(x.savedBy)} 저장</span>` : ""}${moved(x) ? '<span class="chip warn" title="이 기기에서 마지막으로 열거나 저장한 뒤에 다른 곳(실장 또는 다른 기기)에서 고쳐 저장했습니다. ‘열기’를 누르면 그 내용이 열립니다">다른 곳에서 고침 · ‘열기’로 최신</span>' : ""}<span class="spacer"></span>
      <button class="btn sm" data-srvopen="${esc(x.owner)}|${esc(x.id)}">열기</button><button class="btn sm danger" data-srvdel="${esc(x.owner)}|${esc(x.id)}" title="지우면 아래 ‘지운 견적’으로 옮겨집니다 (되살릴 수 있습니다)">삭제</button></li>`;
  const head = g => { const dr = g.rows.filter(x => x.draft).length; return `<li data-grp="${esc(g.id)}" style="background:rgba(127,127,127,.14);border-radius:8px;margin-top:6px"><b>${esc(g.name)}</b>${lgOf[g.id] ? `<span class="note">아이디 ${esc(lgOf[g.id])}</span>` : ""}<span class="chip">견적 ${g.rows.length}건</span>${dr ? `<span class="chip warn">임시저장 ${dr}건</span>` : ""}<span class="note">${g.rows.length ? "마지막 저장 " + esc(fmtAt(g.rows[0].savedAt)) : "아직 저장한 견적이 없습니다"}</span></li>` };
  box.innerHTML = `<h3 style="font-size:14px;margin:0 0 6px">회사 저장소 <span class="note">전체 실장 견적 ${L.length}건 · 실장별로 나눠 보여 줍니다</span></h3>
    ${groups.length ? `<div class="toolbar" style="margin-bottom:6px"><span class="note">실장별로 보기</span><button type="button" class="btn sm${who ? "" : " primary"}" data-srvwho="">전체 ${L.length}</button>${groups.map(g => `<button type="button" class="btn sm${who === g.id ? " primary" : ""}" data-srvwho="${esc(g.id)}">${esc(g.name)} ${g.rows.length}</button>`).join("")}</div>` : ""}
    ${L.length ? `<div class="toolbar" style="margin-bottom:6px"><input type="search" id="srvQ" value="${esc(SRV.listQ || "")}" placeholder="고객명 · 주소 · 실장 이름으로 찾기 (전체 실장 견적 ${L.length}건)" style="flex:1 1 240px;width:auto" aria-label="회사 저장소 견적 찾기"><span class="note" id="srvQCnt"></span></div>` : ""}
    <ul class="list">${groups.length ? groups.filter(g => !who || g.id === who).map(g => head(g) + g.rows.map(row).join("")).join("") : '<li class="note">아직 올라온 견적이 없습니다. 실장이 견적 합계의 ‘저장’을 누르면 여기에 올라옵니다.</li>'}</ul>
    ${sentHtml()}
    ${goneHtml()}
    ${srvAdminHtml()}
    <h3 style="font-size:14px;margin:14px 0 0">이 기기에 저장된 견적</h3>`;
  sentFilter(); if (SRV.sentOpen && !SRV.sent && !SRV.sentErr) sentLoad();   // 펼쳐 둔 채 새로 보낸 것이 생기면 다시 불러온다
  staffFilter(); srvListFilter(); learnDraw(); if (SRV.learnOpen) learnLoad(); if (SRV.admOpen && !SRV.adm && !SRV.admErr) admLoad();   // 찾던 말이 있으면 다시 그린 목록에도 그대로 건다 · 배운 답은 펼쳐 둔 때만 불러온다
  if (SRV.goneOpen && !SRV.gone && !SRV.goneErr) goneLoad(); if (SRV.patchOpen && !SRV.patch && !SRV.patchErr && !SRV.patchRes) patchLoad();
}
/* (v70) 지운 견적 (관리자): 실장이나 관리자가 지운 견적은 서버가 ‘지움’ 폴더로 옮겨 둔다 — 여기서 목록으로 보고 그 실장의 견적으로 되살린다. 펼칠 때만 불러온다 */
function goneHtml() {
  const L = SRV.gone;
  return `<details class="more" id="goneBox"${SRV.goneOpen ? " open" : ""} style="margin-top:10px"><summary>지운 견적 <span class="note">실장이나 관리자가 지운 견적이 회사에 남아 있습니다 · 되살릴 수 있습니다${L ? ` · ${L.length}건` : ""}</span></summary><div class="bd">
    ${SRV.goneErr ? `<p class="note down">${esc(SRV.goneErr)}</p>` : !L ? '<p class="note">불러오는 중…</p>' : !L.length ? '<p class="note">지운 견적이 없습니다.</p>' : `<ul class="list">${L.map(x => `<li><b>${esc(x.client || "(고객명 없음)")}</b><span class="note">${esc(x.site || "")}</span><span class="chip admin">${esc(x.owner === "admin" ? "관리자" : x.staffName)}</span>${x.draft ? '<span class="chip warn">임시저장</span>' : ""}<span class="chip">${esc(x.kind)} v${esc(x.ver)}</span><span class="chip">${won(x.total || 0)}원</span><span class="note">지운 때 ${esc(fmtAt(x.goneAt))}</span><span class="spacer"></span><button type="button" class="btn sm" data-goneback="${esc(x.key)}" title="그 실장의 견적으로 되돌립니다. 실장 화면의 ‘저장된 견적’에도 다시 나옵니다">되살리기</button></li>`).join("")}</ul>`}</div></details>`;
}
function goneLoad() { if (SRV.goneBusy) return; SRV.goneBusy = true; SRV.goneErr = ""; srv("GET", "/api/gone").then(L => { SRV.gone = Array.isArray(L) ? L : [] }).catch(() => { SRV.goneErr = "지운 견적 목록을 불러오지 못했습니다. 서버가 새 판으로 다시 켜진 뒤에 보입니다." }).then(() => { SRV.goneBusy = false; renderSrv() }) }
/* (v70) 수정사항 반영 (관리자): 전에는 대표님 컴퓨터에서 ‘5_수정사항_반영하기.bat’을 돌려 비밀번호를 쳐야 했다 — 이제 이 화면에서 관리자 비밀번호를 넣으면 서버가 같은 일을 한다.
   반영할 것 = ① 서버의 tools\patch.json (Claude가 만들어 미리 돌려 본 수정사항) ② 견적 입력 화면에서 바꾼 기본 단가(sido3_price_edits · ‘바꾼 단가 파일 받기’와 같은 내용).
   비밀번호는 보내지 않는다 — 이 화면이 비밀번호로 만든 키(관리자\gate.js 와 같은 방식)를 그때 한 번 보내고, 서버는 그 키로 관리자 자료를 열어 고친 뒤 같은 키로 다시 잠근다(잠금 값이 그대로라 이 화면의 로그인이 끊기지 않는다). */
function pePatch() { const pe = store.get("sido3_price_edits", {}) || {}; return { note: "관리자 견적 입력 화면에서 바꾼 기본 단가 " + new Date().toISOString().slice(0, 10), items: Object.entries(pe).map(([name, v]) => ({ name, set: +v > 0 ? { fixedPrice: +v, src: "확정" } : { fixedPrice: null } })) } }
async function admKeyHex(pw, lock) {                  // 관리자 비밀번호 → 관리자 자료의 키(64바이트 · 16진수)
  if (!lock || !lock.salt || !(window.crypto && crypto.subtle)) throw new Error("이 브라우저에서는 키를 만들 수 없습니다. 크롬·엣지 최신 버전으로 열어 주세요.");
  const salt = Uint8Array.from(atob(lock.salt), c => c.charCodeAt(0)), k = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  return Array.from(new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: +lock.iter }, k, 512))).map(x => x.toString(16).padStart(2, "0")).join("");
}
function patchHtml() {
  const P = SRV.patch, R0 = SRV.patchRes, pe = typeof STAFF_DATA !== "undefined" && STAFF_DATA ? {} : store.get("sido3_price_edits", {}) || {}, pn = Object.keys(pe).length;
  const pre = t => t ? `<pre style="white-space:pre-wrap;word-break:break-all;max-height:280px;overflow:auto;font-size:12.5px;line-height:1.5;background:rgba(127,127,127,.12);padding:8px 10px;border-radius:8px;margin:6px 0">${esc(t)}</pre>` : "";
  const form = (mode, label) => `<div class="toolbar" style="margin-top:8px"><input type="password" id="patchPw" placeholder="관리자 비밀번호" autocomplete="off" style="flex:0 1 220px;width:auto" aria-label="관리자 비밀번호 (반영 확인)"><button type="button" class="btn primary sm" id="patchGo" data-mode="${mode}">${label}</button></div><p class="note">원가 자료를 고치는 일이라 비밀번호를 한 번 더 넣습니다. 비밀번호 자체는 보내지 않고, 이 화면에서 만든 키가 그때만 쓰입니다. 5번 틀리면 15분 잠깁니다.</p>`;
  let body, tag = "";
  if (R0) body = `<p class="note"><b>${R0.changed ? "반영했습니다." : "이미 반영되어 있어 바뀐 것이 없습니다."}</b>${R0.changed ? ` 새 데이터 버전 <b>${esc(R0.ver)}</b>` : ""}${R0.pub ? " · " + esc(R0.pub) : ""}</p>${pre(R0.out)}<p class="note">실장 화면은 새로 고치면 새 자료로 보입니다. 이 관리자 화면도 새로 고쳐야 새 자료로 계산합니다. <button type="button" class="btn primary sm" id="patchReload">지금 새로 고침</button><br>게시 주소(claude.ai)와 한 파일 판은 Claude에게 “데이터 바뀌었어, 게시해 줘”라고 하면 맞춥니다.</p>`;
  else if (SRV.patchErr) body = `<p class="note down">${esc(SRV.patchErr)}</p>${pre(SRV.patchOut)}<div class="toolbar"><button type="button" class="btn sm" id="patchRetry">다시 불러오기</button></div>`;
  else if (!P) body = '<p class="note">불러오는 중…</p>';
  else if (!P.tools) body = '<p class="note">이 서버 폴더에는 반영 도구가 없어 여기서는 반영할 수 없습니다.</p>';
  else if (!P.locked) body = '<p class="note down">관리자 자료가 비밀번호로 잠겨 있지 않아 여기서는 반영하지 않습니다. 대표님 컴퓨터에서 ‘4_관리자_데이터_잠그기.bat’을 먼저 실행해야 합니다.</p>';
  else if (P.pending) { tag = '<span class="chip warn">기다리는 수정사항 있음</span>';
    body = P.bad ? '<p class="note down">기다리는 수정사항 파일을 읽지 못했습니다. Claude에게 확인을 부탁해 주세요.</p>' : `<p class="note"><b>반영을 기다리는 수정사항</b> ${+P.count || 0}건 <span class="note">(${esc(P.at || "")}에 준비됨)</span>${P.note ? "<br>" + esc(P.note) : ""}</p>
      <p class="note" style="margin-bottom:0"><b>미리 돌려 본 결과</b> — ${P.dry && P.dry.ok ? "통과했습니다. 아래 내용대로 바뀝니다 (여기 보이는 원가는 검사용 값입니다)." : '<span class="down">걸린 것이 있어 반영할 수 없습니다. Claude에게 이 내용을 알려 주세요.</span>'}</p>${pre(P.dry && P.dry.out)}
      ${P.dry && P.dry.ok ? form("file", "이 수정사항 반영하기") : ""}${pn ? `<p class="note">견적 입력 화면에서 바꾼 기본 단가 ${pn}건은 위 수정사항을 먼저 반영한 뒤에 반영할 수 있습니다.</p>` : ""}` }
  else if (pn) { tag = `<span class="chip warn">바꾼 단가 ${pn}건</span>`;
    body = `<p class="note"><b>견적 입력 화면에서 바꾼 기본 단가 ${pn}건</b> — 반영하면 실장 화면에도 이 단가가 기본으로 나옵니다.</p><ul class="list">${Object.entries(pe).map(([n, v]) => `<li><b>${esc(n)}</b><span class="note">${+v > 0 ? "고정 판매가 " + won(+v) + "원" : "고정 판매가 없앰 (원가와 마진으로 다시 계산)"}</span></li>`).join("")}</ul>${form("pe", "바꾼 단가 반영하기")}` }
  else body = '<p class="note">지금 반영을 기다리는 수정사항이 없습니다. Claude에게 단가·공정 수정을 시키면 여기에 “기다리는 수정사항”으로 나타나고, 견적 입력 화면에서 기본 단가를 바꿔도 여기에 나타납니다.</p>';
  return `<details class="more" id="patchBox"${SRV.patchOpen ? " open" : ""}><summary>수정사항 반영 (단가·공정 자료) ${tag || (SRV.info && SRV.info.patchPending ? '<span class="chip warn">기다리는 수정사항 있음</span>' : pn ? `<span class="chip warn">바꾼 단가 ${pn}건</span>` : "")} <span class="note">대표님 컴퓨터에서 bat을 돌리지 않고, 여기서 관리자 비밀번호를 넣어 반영합니다${P && P.ver ? " · 지금 데이터 " + esc(P.ver) : ""}</span></summary><div class="bd">${body}</div></details>`;
}
function patchLoad() { if (SRV.patchBusy) return; SRV.patchBusy = true; SRV.patchErr = ""; SRV.patchOut = ""; srv("GET", "/api/adm/patch").then(p => { SRV.patch = p || {} }).catch(() => { SRV.patchErr = "불러오지 못했습니다. 서버가 새 판으로 다시 켜진 뒤에 보입니다." }).then(() => { SRV.patchBusy = false; renderSrv() }) }
document.addEventListener("toggle", ev0 => { const d = ev0.target; if (!d || !SRV) return;
  if (d.id === "goneBox") { SRV.goneOpen = d.open; if (d.open && !SRV.gone && !SRV.goneErr) goneLoad() }
  if (d.id === "patchBox") { SRV.patchOpen = d.open; if (d.open && !SRV.patch && !SRV.patchErr && !SRV.patchRes) patchLoad() } }, true);
document.addEventListener("click", async ev0 => { const t = ev0.target; if (!SRV || !SRV.me || !t.closest) return;
  const wb = t.closest("[data-srvwho]"), sw = t.closest("[data-sentwho]");
  if (wb) { SRV.listWho = wb.dataset.srvwho; renderSrv(); return }      // 실장별로 보기
  if (sw) { SRV.sentWho = sw.dataset.sentwho; renderSrv(); return }
  if (SRV.me.role !== "admin") return;
  const gb = t.closest("[data-goneback]");
  if (gb) { try { await srv("POST", "/api/gone", { restore: gb.dataset.goneback }); toast("되살렸습니다. 그 실장의 견적 목록에 다시 나옵니다.") } catch (e) { toast(e.msg || "되살리지 못했습니다.") } SRV.gone = null; SRV.list = null; SRV.goneOpen = true; renderSrv(); return }
  if (t.id === "patchRetry") { SRV.patch = null; SRV.patchErr = ""; SRV.patchOut = ""; SRV.patchOpen = true; patchLoad(); renderSrv(); return }
  if (t.id === "patchReload") { location.reload(); return }
  if (t.id === "patchGo") {
    const pw = ($("#patchPw") || {}).value || "", mode = t.dataset.mode, P = SRV.patch || {}; if (!pw) { toast("관리자 비밀번호를 넣어 주세요."); const i = $("#patchPw"); if (i) i.focus(); return }
    if (SRV.patchRun) return; SRV.patchRun = true; t.disabled = true; t.textContent = "반영하는 중… (10초쯤 걸립니다)";
    try { const key = await admKeyHex(pw, P.lock), body = { key }; if (mode === "pe") body.patch = pePatch();
      const r = await srv("POST", "/api/adm/patch", body); SRV.patchRes = r; SRV.patch = null; SRV.info = null; if (mode === "pe") store.del("sido3_price_edits");
      toast(r.changed ? "반영했습니다. 화면을 새로 고치면 새 자료로 보입니다." : "이미 반영되어 있어 바뀐 것이 없습니다.") }
    catch (e) { const b = e.body || {};
      if (e.status === 401 || e.status === 429) { toast(e.status === 401 && b.left != null ? `관리자 비밀번호가 맞지 않습니다. (남은 횟수 ${b.left}번)` : e.msg || "관리자 비밀번호가 맞지 않습니다."); SRV.patchRun = false; t.disabled = false; t.textContent = mode === "pe" ? "바꾼 단가 반영하기" : "이 수정사항 반영하기"; const i = $("#patchPw"); if (i) { i.value = ""; i.focus() } return }
      SRV.patchErr = e.msg || e.message || "반영하지 못했습니다."; SRV.patchOut = b.out || "" }
    SRV.patchRun = false; SRV.patchOpen = true; renderSrv(); return }
});
/* 단지 도면 저장소: 주소(단지)·평형이 같으면 누가 올린 도면이든 다시 불러 쓴다 (도면과 방 위치만 저장, 고객 정보 없음) */
const planUnit = () => { const a = String(E.info.addr2 || ""), d = (a.match(/(\d+)\s*동/) || [])[1], h = (a.match(/(\d+)\s*호/) || [])[1]; return d && h ? { d, ln: h.slice(-2) } : null };   // 같은 동의 같은 호 라인(끝 두 자리)은 구조가 같다
const planBaseKey = () => { const b = String(E.info.bname || E.info.addr || "").replace(/\s+/g, ""); return b ? b + "|" + (+E.py || 0) + "평" : "" };
const planKeys = () => { const k = planBaseKey(), u = planUnit(); return !k ? [] : u ? [`${k}|${u.d}동|${u.ln}라인`, k] : [k] };   // 동·라인 도면을 먼저 찾고, 없으면 단지·평형 공통 도면
const planName = unit => { const u = unit && planUnit(); return `${E.info.bname || E.info.addr || ""} ${+E.py || 0}평${u ? ` ${u.d}동 ${u.ln}호 라인` : ""}` };
async function planLoad(key, auto) {
  const r = await srv("GET", "/api/plan?full=1&key=" + encodeURIComponent(key)); if (!r.found) return; const p = r.plan;
  E.planImg = p.img; E.planImgW = p.w; E.planImgH = p.h; E.planPins = p.pins || {}; E.planBox = p.box || {}; E.planFrom = p.name; delete E.planSkip; delete E.planFit;   // (v68) 도면을 새로 넣으면 ‘그린 크기대로’는 꺼진 채로 시작한다 (자동으로 나눈 칸으로 넓이가 저절로 바뀌지 않게)
  for (const k of ["rooms", "baths", "balconies"]) if (p.layout && p.layout[k] !== undefined && +p.layout[k] >= 0) E[k] = +p.layout[k];
  refresh(true); toast(`${auto ? "주소에 맞는 " : ""}‘${p.name}’ 도면을 불러왔습니다. 방·욕실·발코니 수도 그 도면에 맞췄습니다.`);
}
function planLibCheck() {
  measLibCheck();
  const el = $("#planLib"); if (!el) return;
  if (!SRV || !SRV.me) { el.innerHTML = E.planImg ? "" : "지금은 방·욕실·발코니 수로 그린 <b>약식 도면 기준</b>으로 작업합니다. 회사 저장소 주소로 열면 주소·동호수에 맞는 저장 도면을 자동으로 불러옵니다."; return }
  const keys = planKeys(), u = planUnit(); if (!keys.length) { el.innerHTML = "주소(단지)와 동·호수를 넣으면 회사에 저장된 도면을 자동으로 불러옵니다."; return }
  if (E.planImg) {
    el.innerHTML = (E.planFrom ? `<b>‘${esc(E.planFrom)}’ 저장 도면 기준으로 작업 중</b> · ` : "") + (hasPins() ? `${u ? `<button type="button" class="btn sm" data-plansave="u">‘${esc(planName(true))}’ 도면으로 올리기</button> ` : ""}<button type="button" class="btn sm" data-plansave="c">‘${esc(planName())}’ 공통 도면으로 올리기</button> <span class="note">올려 두면 다음부터 같은 주소에서 자동으로 불러옵니다.${u ? " 타입이 여러 가지인 단지는 동·호 라인 도면으로 올리세요." : " 동·호수를 넣으면 그 동·호 라인 전용으로도 올릴 수 있습니다."}</span>` : "방 영역을 지정하면 이 도면을 회사 저장소에 올릴 수 있습니다.");
    return;
  }
  for (const key of keys) if (SRV.plan[key] === undefined) { SRV.plan[key] = null; srv("GET", "/api/plan?key=" + encodeURIComponent(key)).then(r => { SRV.plan[key] = r.found ? r.plan : false; planLibCheck() }).catch(() => { SRV.plan[key] = false; planLibCheck() }) }
  if (keys.some(k => SRV.plan[k] === null)) { el.innerHTML = "회사 저장소에서 이 주소의 도면을 찾는 중…"; return }
  const key = keys.find(k => SRV.plan[k]), c = key && SRV.plan[key];
  if (c && E.planSkip !== key) {                     // 찾으면 묻지 않고 바로 불러온다 (‘약식 도면으로 돌아가기’를 누른 뒤에는 다시 불러오지 않음)
    if (!planLibCheck.busy) { planLibCheck.busy = true; planLoad(key, true).catch(e => { E.planSkip = key; toast(e.message || "도면을 불러오지 못했습니다.") }).finally(() => { planLibCheck.busy = false }) }
    el.innerHTML = "저장된 도면을 불러오는 중…"; return;
  }
  el.innerHTML = c ? `<button type="button" class="btn primary sm" data-planload="${esc(key)}">회사에 저장된 ‘${esc(c.name)}’ 도면 다시 불러오기</button> <span class="note">${esc(c.by)} · ${esc(c.at)} 등록 · 지금은 약식 도면 기준</span>`
    : "<b>이 주소로 저장된 도면이 없습니다.</b> 방·욕실·발코니 수로 그린 <b>약식 도면 기준</b>으로 작업하고, 견적서에도 약식 도면 기준이라고 적힙니다. 실제 도면을 올려 방 영역을 지정해 두면 다음부터 이 주소에서 자동으로 불러옵니다.";
}
document.addEventListener("click", async ev0 => {
  if (!SRV) return; const t = ev0.target;
  try {
    if (t.id === "srvKeyBtn") { store.set("sido_srv_admin", $("#srvKey").value.trim()); await srvConnect(); if (!SRV.me) toast("관리자 키가 맞지 않습니다."); return }
    const op = t.closest("[data-srvopen]"), dl = t.closest("[data-srvdel]"), tg = t.closest("[data-stafftoggle]"), du = t.closest("[data-srvdup]");
    if (du) { const [o, id] = du.dataset.srvdup.split("|"), x = await srv("GET", `/api/est/${o}/${id}`); x.id = "e" + Date.now(); x.info = { ...(x.info || {}), ver: 1, client: ((x.info && x.info.client) || "") + " (복사)" }; delete x.fp; delete x.fpVer; delete x.savedAt; delete x.draft; delete x.savedBy; openEst(x, "복제했습니다. 현재 단가로 계산합니다."); return }   // (v70) 회사에만 있는 내 견적을 복제
    if (op) { const [o, id] = op.dataset.srvopen.split("|"), x = await srv("GET", `/api/est/${o}/${id}`), adm = !!SRV.me && SRV.me.role === "admin", stf = adm && o !== "admin";
      if (op.dataset.sync) { const L0 = store.get("sido3_list", []); if (L0.some(y => y.id === x.id)) store.set("sido3_list", [deep(x)].concat(L0.filter(y => y.id !== x.id))) }   // (v70) 이 기기에 있던 옛 내용을 회사에 보관된 더 새 내용으로 맞춘다
      if (adm) srvMap("sido_srv_owner", id, stf ? o : null);   // 관리자가 실장의 견적을 열었으면 누구 것인지 적어 둔다 → ‘저장’하면 그 실장의 견적이 바뀐다
      openEst(x, (adm ? "회사 저장소에서 열었습니다." : x.draft ? "임시저장한 견적을 이어서 씁니다." : "저장된 견적을 열었습니다.") + (stf ? " 고쳐서 ‘저장’하면 그 실장의 견적이 바뀌고, 실장 화면에도 그 내용이 보입니다." : "")); srvSynced(x.savedAt); return }
    const nw = t.closest("#srvNewer");                // 화면 위 ‘회사 저장소에 더 새 내용’: 두 번 눌러야 바꾼다 (여기서 고치던 것은 따로 남긴다)
    if (nw) { if (!nw.dataset.armed) { nw.dataset.armed = 1; nw.textContent = "한 번 더 누르면 회사 저장소의 내용으로 바꿉니다"; setTimeout(() => { if (nw.isConnected && nw.dataset.armed) { delete nw.dataset.armed; nw.textContent = "회사 저장소에 더 새 내용 · 눌러서 불러오기" } }, 5000); return } await srvLoadNewer(srvDirty()); return }
    if (dl) { if (!dl.dataset.armed) { dl.dataset.armed = 1; dl.textContent = "한 번 더 누르면 삭제"; return } const [o, id] = dl.dataset.srvdel.split("|"); await srv("DELETE", `/api/est/${o}/${id}`); SRV.list = null; SRV.gone = null; setTimeout(keepSync, 800); if (SRV.me.role === "staff") { srvMap(PEND_K, id, null); toast("지웠습니다. 잘못 지웠으면 관리자에게 되살려 달라고 하세요.") } renderSaved(); return }
    const so = t.closest("[data-srvout]");            // 화면 위 ‘회사 저장소 연결 · 이름’: 다른 아이디로 들어가기(두 번 눌러야) · 끊겼으면 로그인 화면으로
    if (so) { const inn = !!(SRV.me || (SRV.front && SRV.down && SRV.token !== "0"));   // 로그인돼 있는가 (꺼져 있을 때의 로그인 포함)
      if (inn && !so.dataset.armed) { so.dataset.armed = 1; so.textContent = "한 번 더 누르면 로그아웃"; setTimeout(() => { if (so.isConnected && so.dataset.armed) { delete so.dataset.armed; so.textContent = "로그아웃" } }, 4000); return }
      if (SRV.me) { save(); try { autoStash(true) } catch (e) { } }   // 로그아웃 전에 쓰던 견적을 한 번 남긴다 (새 견적·임시저장 상태일 때)
      if (SRV.front) { if (inn) frontOut(); if (SRV.down) frontLogin("down"); else frontLogin(""); return }   // (v81) 항상 열리는 주소: 이 화면 안에서 다시 로그인
      if (SRV.me) keepClear();                        // 로그아웃하면 이 기기에 받아 둔 내 견적 사본도 지운다
      location.href = SRV.me ? "/?out=1" : "/"; return }
    if (t.id === "staffAdd") { const n = $("#staffName").value.trim(), lg = $("#staffLogin") ? $("#staffLogin").value.trim() : ""; if (!n) { toast("실장 이름을 적어 주세요."); return } let r; try { r = await srv("POST", "/api/staff", lg ? { name: n, login: lg } : { name: n }) } catch (e) { toast(e.msg || e.message); return } SRV.staff = null; SRV.info = null; SRV.staffOpen = true; renderSrv(); toast(`${n} 실장을 추가했습니다. 아이디 ${r.login} · 번호 ${r.code} — ‘알려 줄 글 복사’로 본인에게만 전하세요.`); return }
    const sv = t.closest("[data-staffidsave]");       // 아이디 바꾸기
    if (sv) { const inp = sv.parentNode.querySelector("[data-staffid]"); let r; try { r = await srv("POST", "/api/staff", { id: sv.dataset.staffidsave, login: inp.value }) } catch (e) { toast(e.msg || e.message); return } SRV.staff = null; SRV.info = null; SRV.staffOpen = true; renderSrv(); toast(`아이디를 ${r.login}(으)로 바꿨습니다. 전 아이디로는 들어올 수 없으니 본인에게 알려 주세요.`); return }
    const go = t.closest("[data-staffgo]");           // 관리자가 그 실장의 화면으로 들어가 본다 (그 실장의 아이디·번호로 로그인한 것과 같다). 이 화면과 쓰던 견적이 섞이지 않게 주소 이름을 달리해 연다(localhost ↔ 127.0.0.1)
    if (go) { const u = (SRV.staff || []).find(x => x.id === go.dataset.staffgo); if (!u) return; const w = window.open("", "_blank"); let r = null;
      try { const f = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: u.login, code: u.code }) }); r = f.ok ? await f.json() : null } catch (e) { }
      if (!r || !r.url) { if (w) w.close(); toast(`${u.name} 실장의 화면을 열지 못했습니다.` + (u.active === false ? " 사용 중지된 아이디입니다." : " 잠시 뒤 다시 눌러 주세요.")); return }
      const h = location.hostname === "localhost" ? "127.0.0.1" : location.hostname === "127.0.0.1" ? "localhost" : location.hostname, url = `${location.protocol}//${h}${location.port ? ":" + location.port : ""}${r.url}${ADM_OUT ? "#view" : ""}`;   // (v69) 밖에서는 주소 이름을 달리할 수 없어 ‘#view’ 표시로 저장 공간을 따로 쓴다 (맨 위 NS)
      if (w) w.location.href = url; else location.href = url; toast(`${u.name} 실장의 화면을 새 창에 열었습니다. 그 실장이 보는 화면 그대로입니다.`); return }
    const cp = t.closest("[data-staffcopy]");         // 실장에게 알려 줄 글(주소·아이디·번호)을 한 번에 복사
    if (cp) { const u = (SRV.staff || []).find(x => x.id === cp.dataset.staffcopy); if (!u) return; const out = SRV.info && SRV.info.outside && SRV.info.outside.url, fr = SRV.info && SRV.info.front && SRV.info.front.url, ok = await copyText(`시도디자인 견적 프로그램\n주소: ${u.link || fr || (out || (SRV.info && SRV.info.lan) || location.origin) + "/"}\n아이디: ${u.login}\n번호(비밀번호): ${u.code}\n${u.link && /#u=/.test(u.link) ? "크롬에서 주소를 열고 아이디와 번호를 넣으세요. 집에서도, 회사 컴퓨터가 꺼져 있어도 됩니다. 위 주소는 내 전용 주소입니다 — 즐겨찾기에 넣어 두고, 다른 기기에서 처음 쓸 때도 꼭 이 주소로 여세요. 주소와" : u.link ? "크롬에서 주소를 열고 아이디와 번호를 넣으세요. 집에서도, 새 기기에서도, 회사 컴퓨터가 꺼져 있어도 로그인됩니다." : fr ? "크롬에서 주소를 열고 아이디와 번호를 넣으세요. 집에서도, 회사 컴퓨터가 꺼져 있어도 열립니다." : out ? "크롬에서 주소를 열고 아이디와 번호를 넣으세요. 사무실 밖에서도 됩니다." : "사무실 인터넷에 연결된 기기에서 주소를 열고 아이디와 번호를 넣으세요."} 번호는 남에게 알려 주지 마세요.`); toast(ok ? `${u.name} 실장에게 알려 줄 글을 복사했습니다. 메신저에 붙여 넣어 본인에게만 보내세요.` : "복사하지 못했습니다. 아이디와 번호 칸을 눌러 직접 복사해 주세요."); return }
    if (t.id === "srvUpdate") { t.disabled = true; t.textContent = "받는 중…"; let r = null; try { r = await srv("POST", "/api/update", {}) } catch (e) { toast(e.msg || e.message) } SRV.info = null; SRV.updOpen = true; renderSrv(); if (r) toast(r.msg + (r.restart ? " 잠시 뒤 이 화면을 새로 고치세요." : r.got ? " 화면을 새로 고치면 새 판으로 보입니다." : "")); return }
    if (tg) { const [id, a] = tg.dataset.stafftoggle.split("|"); await srv("POST", "/api/staff", { id, active: a === "1" }); SRV.staff = null; SRV.staffOpen = true; renderSrv(); toast(a === "1" ? "다시 쓸 수 있게 했습니다." : "사용을 중지했습니다. 그 아이디로는 더 들어올 수 없습니다."); return }
    const rn = t.closest("[data-staffrenum]");
    if (rn) { if (!rn.dataset.armed) { rn.dataset.armed = 1; rn.textContent = "한 번 더 누르면 새 번호"; return } await srv("POST", "/api/staff", { id: rn.dataset.staffrenum, renum: true }); SRV.staff = null; SRV.staffOpen = true; renderSrv(); toast(SRV.info && SRV.info.front && SRV.info.front.gate && SRV.info.front.gate.on ? "번호를 새로 만들었습니다. 전 번호는 더 쓸 수 없습니다 — ‘알려 줄 글 복사’로 새 번호를 본인에게 보내 주세요(주소는 그대로입니다)." : "번호를 새로 만들었습니다. 전 번호와 전에 보낸 전용 주소는 더 쓸 수 없습니다 — ‘알려 줄 글 복사’로 새 주소·번호를 본인에게 다시 보내 주세요."); return }
    if (t.id === "learnReload") { SRV.learn = null; SRV.learnOpen = true; learnLoad(); learnDraw(); return }
    const lsv = t.closest("[data-learnsave]"), lst = t.closest("[data-learnset]"), ldl = t.closest("[data-learndel]");   // 챗봇이 배운 답 (관리자): 고친 답 저장 · 확인함 / 쓰지 않기 / 다시 쓰기 · 삭제(두 번 눌러야)
    if (lsv || lst || ldl) { const id = lsv ? lsv.dataset.learnsave : lst ? lst.dataset.learnset.split("|")[0] : ldl.dataset.learndel, cur = (SRV.learn || []).find(x => x.id === id); let body, say;
      if (lsv) { const ta = lsv.parentNode.querySelector("[data-learna]"), a = ta ? ta.value.trim() : ""; if (!a) { toast("답이 비어 있습니다. 이 답을 내보내지 않으려면 ‘쓰지 않기’나 ‘삭제’를 눌러 주세요."); return }
        if (cur && cur.a === a) { toast("고친 내용이 없습니다. 이대로 쓰려면 ‘확인함’을 눌러 주세요."); return } body = { id, a }; say = "고친 답을 저장했습니다. 같은 질문에는 이제 이 답이 나갑니다." }
      else if (lst) { const s = lst.dataset.learnset.split("|")[1]; body = { id, state: s }; say = s === "ok" ? "확인했습니다. 같은 질문에 이 답이 그대로 나가고, AI의 새 답으로 바뀌지 않습니다." : s === "off" ? "이 답은 더 내보내지 않습니다. 같은 질문이 오면 AI가 새로 답합니다." : "‘쓰지 않음’을 풀었습니다 (검토 전)." }
      else { if (!ldl.dataset.armed) { ldl.dataset.armed = 1; ldl.textContent = "한 번 더 누르면 삭제"; return } body = { id, del: true }; say = "삭제했습니다. 같은 질문이 오면 AI가 새로 답하고, 그 답이 다시 쌓입니다." }
      let r; try { r = await srv("POST", "/api/learn", body) } catch (e) { toast(e.msg || e.message); if (e.status === 404) { SRV.learn = null; learnLoad(); learnDraw() } return }
      if (!lst && SRV.learnDraft) delete SRV.learnDraft[id];   // 상태만 바꿀 때는 고치던 글을 남긴다
      if (SRV.learn) SRV.learn = r.item ? SRV.learn.map(x => x.id === id ? r.item : x) : SRV.learn.filter(x => x.id !== id);
      SRV.learnOpen = true; learnDraw(); toast(say); return }
    const psv = t.closest("[data-plansave]");
    if (psv) { const unit = psv.dataset.plansave === "u", key = unit ? planKeys()[0] : planBaseKey(), name = planName(unit); if (!key) return;
      await srv("PUT", "/api/plan", { key, name, img: E.planImg, w: E.planImgW, h: E.planImgH, pins: E.planPins, box: E.planBox, layout: { rooms: E.rooms, baths: E.baths, balconies: E.balconies, py: E.py } });
      SRV.plan[key] = undefined; E.planFrom = name; save(); planLibCheck(); toast(`‘${name}’ 도면을 회사 저장소에 올렸습니다. 다음부터 이 주소에서 자동으로 불러옵니다.`); return }
    const pld = t.closest("[data-planload]"); if (pld) { await planLoad(pld.dataset.planload); return }
  } catch (e) { toast(e.message || "저장소 연결에 실패했습니다.") }
});

/* ---------- 새 견적 · 임시저장 ---------- */
function fmtAt(s) { const d = new Date(s || ""); if (isNaN(d)) return String(s || "").slice(0, 16).replace("T", " "); const z = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}` }
function estSig(x, loose) {                           // 견적 내용을 견주는 글자열. 화면 상태·저장 시각은 빼고, 빈 값은 없는 것으로 본다. loose = 빈 견적과 견줄 때(번호·날짜·담당자 무시)
  const SKIP = { step: 1, savedAt: 1, savedBy: 1, total: 1, mg: 1, draft: 1, planOpen: 1, planView: 1, space: 1, dataVer: 1, dfv: 1 };   // mg = 저장할 때 적는 마진 요약(합계처럼 계산해서 나오는 값)
  const norm = v => { if (Array.isArray(v)) return v.map(norm); if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v).sort()) { const c = norm(v[k]); if (c == null || c === "" || (typeof c === "object" && !Object.keys(c).length)) continue; o[k] = c } return o } return v };
  const c = {}; for (const k of Object.keys(x)) if (!SKIP[k] && !(loose && k === "id")) c[k] = x[k];
  if (c.pk) c.pk = Object.fromEntries(Object.entries(c.pk).filter(([, y]) => y && (y.on || y.g || (y.v !== undefined && y.v !== ""))));   // 눌러 본 적 없는 묶음은 뺀다
  if (loose && c.info) { c.info = { ...c.info }; delete c.info.date; delete c.info.manager }
  return JSON.stringify(norm(c));
}
function blankSig() { const keep = E; try { E = blankEst(); if (D.stepLines) applyPreset2(0); else applyPreset(0); applyPackages(); return estSig(E, true) } finally { E = keep } }
const estHas = () => estSig(E, true) !== blankSig();  // 쓰던 내용이 있는지 (빈 견적과 다르면 있는 것)
function stashEst(draft) {                            // 지금 견적을 ‘저장된 견적’ 목록에 넣는다. draft = 임시저장 (단가를 고정하지 않고, 열면 쓰던 단계에서 이어 쓴다)
  const L = store.get("sido3_list", []).filter(x => x.id !== E.id), prevAt = E.savedAt || ""; E.savedAt = new Date().toISOString(); E.total = R.total; mgSnap(); if (draft) E.draft = true; else delete E.draft; L.unshift(deep(E)); const ok = store.set("sido3_list", L);
  stashEst.up = draft && SRV && (SRV.me || SRV.token) ? srvSave(false, prevAt, E) : null;   // (v64) 실장 화면은 연결이 끊겨 있어도 부른다 — 올릴 것으로 적어 두었다가 다시 연결되면 올린다   // (v61) 임시저장도 회사 저장소에 올린다 — 실장이 쓰던 내용이 그 기기에만 남지 않게. 다른 곳에서 고친 더 새 내용이 있으면 올리지 않는다(덮어쓰지 않는다)
  return ok }
function keepCur(nextId) {                            // 다른 견적으로 넘어가기 전에 쓰던 견적을 남긴다. "" = 남길 것 없음 · 글 = 남긴 뒤의 안내 · false = 저장하지 못함
  if (nextId && nextId === E.id) return "";          // 같은 견적의 저장본을 다시 여는 것 = 그 뒤에 고친 것을 버리겠다는 뜻
  if (!estHas()) return "";
  const cur = store.get("sido3_list", []).find(x => x.id === E.id), nm = E.info.client || E.info.site ? `‘${E.info.client || E.info.site}’` : "쓰던";
  if (cur && estSig(cur) === estSig(E)) return `${nm} 견적은 ‘저장된 견적’에 그대로 있습니다.`;
  return stashEst(true) ? `${nm} 견적은 ‘저장된 견적’에 임시저장해 두었습니다.` : false;
}
function newEst(b) {                                  // 새 견적: 쓰던 견적은 지우지 않고 ‘저장된 견적’에 남겨 둔 뒤 빈 견적으로 시작한다
  const kept = keepCur();
  if (kept === false && !(b && b.dataset.armed)) { if (b) { b.dataset.armed = 1; b.textContent = "한 번 더 누르면 지우고 새로 시작" } toast("이 브라우저에는 더 저장할 수 없어 쓰던 견적을 남기지 못했습니다. ‘견적 파일 내보내기’로 보관하세요." + (b ? " 한 번 더 누르면 쓰던 견적을 지우고 새로 시작합니다." : "")); return false }
  E = blankEst(); if (D.stepLines) applyPreset2(0); else applyPreset(0); refresh(true); show(D.stepLines ? "check" : "est"); window.scrollTo({ top: 0 }); toast((kept ? kept + " " : "") + "새 견적을 시작합니다."); return true }
function estBar() {                                   // 현장 정보 맨 위: 지금 쓰는 견적 · 새 견적 만들기 · 임시저장 · 이어 쓰기
  const L = store.get("sido3_list", []), cur = L.find(x => x.id === E.id), nm = E.info.client || E.info.site || "";
  return `<div class="estbar"><div class="esn"><div class="esh"><b>${nm ? esc(nm) + " 견적 작성 중" : "새 견적 작성 중"}</b>${cur ? ` <span class="chip ${cur.draft ? "warn" : "ok"}">${cur.draft ? "임시저장 목록에 있음" : "저장된 견적에 있음"}</span>` : ""}${storeWarn()}</div><span class="note">쓰는 내용은 이 기기에 자동으로 남아, 창을 닫았다 열어도 이어집니다.${typeof SRV !== "undefined" && SRV && SRV.me && SRV.me.role === "staff" ? ` <b>회사에도 ${AUTO_MIN}분마다 저절로 임시저장됩니다</b>${autoStash.at ? ` (방금 ${String(autoStash.at.getHours()).padStart(2, "0")}:${String(autoStash.at.getMinutes()).padStart(2, "0")})` : ""} — 저장해 둔 견적을 고칠 때는 ‘저장’을 눌러야 바뀝니다.` : typeof SRV !== "undefined" && SRV && SRV.token && SRV.down ? " <b>지금은 회사 컴퓨터가 꺼져 있어 이 기기에만 남습니다.</b> 켜지면 저절로 회사 저장소에 올라갑니다." : ""} 다른 고객 견적은 ‘새 견적 만들기’로 시작하세요 — 쓰던 견적은 지워지지 않고 ‘저장된 견적’에 남습니다.</span></div>
    <div class="esb"><button type="button" class="btn primary" data-act="new">＋ 새 견적 만들기</button><button type="button" class="btn" data-act="draft">임시저장</button><button type="button" class="btn" data-act="savedgo">저장된 견적${savedCount() ? " " + savedCount() + "건" : ""} · 이어 쓰기</button></div></div>`;
}
function storeUse(force) {                            // 이 기기(브라우저) 저장 공간을 얼마나 썼는지. 크롬은 한 주소에 약 524만 글자까지 (그림이 든 견적 한 건이 10~30만 글자)
  const now = Date.now(); if (!force && storeUse.v !== undefined && now - storeUse.t < 4000) return storeUse.v; let n = 0;
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += k.length + (localStorage.getItem(k) || "").length } } catch (e) { }
  storeUse.t = now; return storeUse.v = n / 5242880 }
function storeWarn(force) { const pc = Math.round(storeUse(force) * 100); return save.full ? '<span class="chip warn">저장 공간이 꽉 참 · 쓰는 내용이 자동으로 남지 않습니다</span>' : pc >= 80 ? `<span class="chip warn">이 기기 저장 공간 약 ${Math.min(pc, 100)}% 사용</span>` : "" }
function estBarUp() { const eb = document.querySelector(".estbar"); if (eb) eb.outerHTML = estBar(); if ($("#view-saved") && !$("#view-saved").hidden) renderSaved() }
/* (v63) 자동 임시저장: 실장이 회사 주소로 들어와 쓰는 중인 견적은 ‘임시저장’을 누르지 않아도 3분마다 회사 저장소에 남긴다 (그 기기가 고장 나거나 브라우저 기록을 지워도 남게).
   · 대상: 한 번도 저장하지 않은 새 견적과, 임시저장 상태인 견적. ‘저장’해 둔 견적을 고치는 중이면 올리지 않는다 — 저장본을 덜 된 내용으로 덮어쓰지 않게.
   · 빈 견적 · 지난번에 남긴 뒤 바뀐 것이 없는 견적은 건너뛴다. 다른 곳에서 더 새로 저장한 것이 있으면 올리지 않는다(srvSave 가 막고 화면 위에 알린다). 관리자 화면에서는 돌지 않는다. */
const AUTO_MIN = 3; let AUTO_SIG = "";
async function autoStash(leaving) {                   // leaving = 다른 창으로 넘어가는 순간 (글자를 치던 중이어도 바로 남긴다)
  if (autoStash.busy) return;
  try {
    if (typeof SRV === "undefined" || !SRV || !(SRV.me ? SRV.me.role === "staff" : SRV.token && SRV.token !== "0" && SRV.down) || (leaving !== true && (document.visibilityState === "hidden" || Date.now() - TYPE_T < 5000))) return;   // 회사 컴퓨터가 꺼져 있을 때도 이 기기에 남기고 ‘올릴 것’으로 적어 둔다
    const cur = store.get("sido3_list", []).find(x => x.id === E.id); if ((cur && !cur.draft) || (!E.draft && srvMap("sido_srv_base", E.id))) return;   // ‘저장’해 둔 견적(이 기기 목록에 있거나, 회사 저장소에서 연 것)
    if (!estHas()) return; const sig = E.id + "|" + sigH(estSig(E)); if (sig === AUTO_SIG) return;
    if (cur && estSig(cur) === estSig(E) && srvMap("sido_srv_sig", E.id) === sigH(estSig(E))) { AUTO_SIG = sig; return }   // 이미 같은 내용이 올라가 있다
    autoStash.busy = true; save(); if (!stashEst(true)) return;   // 이 기기 목록에 못 남기면(저장 공간) 올리지 않는다 — 알림은 save 가 한다
    const up = await stashEst.up; if (up === true) { AUTO_SIG = E.id + "|" + sigH(estSig(E)); autoStash.at = new Date() } else if (up === null) AUTO_SIG = E.id + "|" + sigH(estSig(E));   // 끊겨 있어 이 기기에만 남긴 것: 내용이 바뀌기 전에는 다시 남기지 않는다
    estBarUp();
  } catch (e) { } finally { autoStash.busy = false }
}
setInterval(() => autoStash(), AUTO_MIN * 60000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") autoStash(true) });   // 화면을 떠날 때도 한 번 (휴대폰에서 다른 앱으로 넘어갈 때)
const savedHead = () => { const w = storeWarn(true), pc = Math.round(storeUse() * 100);
  return `<li class="savednew"><button type="button" class="btn primary" data-act="new">＋ 새 견적 만들기</button><span class="note">쓰던 견적은 지워지지 않고 여기에 ‘임시저장’으로 남습니다. ‘이어 쓰기’를 누르면 쓰던 단계에서 다시 시작합니다.${SRV && SRV.token ? " <b>저장한 견적은 회사에도 보관되어, 다른 컴퓨터·휴대폰에서 로그인해도 이 목록이 그대로 보입니다</b> (내 견적만 보입니다)." : ""}</span>${w || (pc >= 50 ? `<span class="chip">이 기기 저장 공간 약 ${pc}% 사용</span>` : "")}${w ? `<span class="note" style="flex:1 1 100%">저장된 견적은 이 기기의 브라우저에 보관됩니다. 공간이 차면 더 저장되지 않으니, 끝난 견적은 ‘② 상세견적서’의 ‘견적 파일 내보내기’로 파일로 보관한 뒤 여기서 ‘삭제’해 주세요. 평면도 그림이 든 견적이 공간을 많이 씁니다.</span>` : ""}</li>` };
function savedChips(x) { const same = x.id === E.id; return (x.draft ? '<span class="chip warn">임시저장</span>' : "") + (same ? '<span class="chip ok">지금 쓰는 견적</span>' + (estSig(x) !== estSig(E) ? `<span class="chip warn">${x.draft ? "임시저장" : "저장"} 뒤 고친 내용 있음</span>` : "") : "") }
function savedOpenBtn(x) {                            // 지금 쓰는 견적은 ‘계속 쓰기’(바꿔치기하지 않는다) · 저장본으로 되돌리기는 따로
  if (x.id !== E.id) return `<button class="btn sm${x.draft ? " primary" : ""}" data-open="${x.id}">${x.draft ? "이어 쓰기" : "열기"}</button>`;
  return `<button type="button" class="btn sm primary" data-act="backest">계속 쓰기</button>` + (estSig(x) !== estSig(E) ? `<button class="btn sm" data-open="${x.id}" data-rev="1" title="그 뒤에 고친 내용을 버리고 ${x.draft ? "임시저장" : "저장"}했을 때의 내용으로 돌아갑니다">${x.draft ? "임시저장" : "저장"}했을 때로 되돌리기</button>` : "") }
/* ---------- 저장된 견적 ---------- */
function openEst(x, msg) {
  const kept = keepCur(x.id);                        // 다른 견적을 열기 전에 쓰던 견적을 ‘저장된 견적’에 남긴다
  const old = !!D.stepLines && !x.ln;               // 공정 체크 방식(v4) 이전에 만든 견적
  E = normEst(deep(x));
  E.step = old ? 0 : x.draft && +x.step >= 0 ? Math.min(+x.step, STEPS().length - 1) : STEPS().length - 1;   // 확인 단계에서 전체 내용을 먼저 보여 준다 (임시저장한 견적은 쓰던 단계에서 이어 쓴다)
  refresh(true); show(D.stepLines ? "check" : "est");
  toast((old ? "이전 버전에서 만든 견적이라 체크 내용은 불러오지 못했습니다. 현장 정보만 가져왔습니다." : msg) + (kept ? " " + kept : kept === false ? " 쓰던 견적은 저장 공간이 모자라 남기지 못했습니다 — ‘↶ 되돌리기’로 돌아갈 수 있습니다." : ""));
}
function estClean(x) {                                // 밖에서 들어온 견적(파일·붙여 넣기)을 받기 전에 모양을 확인하고, 화면에 찍히는 값(번호·버전·합계)을 다듬는다. 견적이 아니면 null
  if (!x || typeof x !== "object" || Array.isArray(x) || !x.info || typeof x.info !== "object" || !(x.sel || x.ln)) return null;
  x = deep(x); if (!/^[A-Za-z0-9_\-]{1,64}$/.test(String(x.id || ""))) x.id = "e" + Date.now() + Math.floor(Math.random() * 1000);
  x.info.ver = Math.max(1, Math.floor(+x.info.ver) || 1); x.total = +x.total || 0; if (x.savedAt != null) x.savedAt = String(x.savedAt).slice(0, 40);
  return x }
function renderMove() {                               // ‘저장된 견적’ 아래: 다른 주소 · 다른 기기로 옮기기 (파일을 내려받지 못하는 화면에서도 되게 — 복사해서 붙여 넣는다)
  if (!$("#savedList")) return; const n = store.get("sido3_list", []).length;
  if (!$("#moveBox")) $("#savedList").insertAdjacentHTML("afterend", `<details class="more" id="moveBox" style="margin-top:12px"><summary>다른 주소 · 다른 기기로 옮기기 <span class="note">저장된 견적을 복사해서 옮길 곳에 붙여 넣습니다 (파일이 받아지지 않는 화면에서도 됩니다)</span></summary><div class="bd">
    <p class="note"><b>① 보내는 쪽</b> 여기서 ‘모두 복사’를 누릅니다. <b>② 받는 쪽</b> 옮길 주소의 ‘저장된 견적’에서 이 칸을 펼쳐, 아래 칸에 붙여 넣고 ‘가져오기’를 누릅니다. 회사 주소에 로그인한 화면에서 가져오면 회사 저장소에도 함께 올라갑니다. 복사한 글에는 견적 내용이 다 들어 있으니 다른 사람에게 보내지 마세요.</p>
    <div class="toolbar"><button type="button" class="btn sm" id="moveCopy"></button></div>
    <textarea id="moveText" rows="3" placeholder="다른 곳에서 복사한 견적을 여기에 붙여 넣으세요" aria-label="옮길 견적 붙여 넣는 칸" style="width:100%;margin-top:8px"></textarea>
    <div class="toolbar" style="margin-top:6px"><button type="button" class="btn sm primary" id="moveIn">붙여 넣은 견적 가져오기</button></div></div></details>`);
  const b = $("#moveCopy"); if (b) { b.textContent = n ? `저장된 견적 ${n}건 모두 복사` : "복사할 견적이 없습니다"; b.disabled = !n }
}
document.addEventListener("click", async ev0 => {
  const t = ev0.target; if (!t || (t.id !== "moveCopy" && t.id !== "moveIn")) return; const ta = $("#moveText");
  if (t.id === "moveCopy") {
    const L = store.get("sido3_list", []); if (!L.length) return;
    const ok = await copyText(JSON.stringify({ sido_move: 1, at: new Date().toISOString(), list: L }), ta);
    toast(ok ? `견적 ${L.length}건을 복사했습니다. 옮길 주소의 ‘저장된 견적’ → ‘다른 주소 · 다른 기기로 옮기기’에 붙여 넣으세요.` : "자동으로 복사하지 못했습니다. 아래 칸에 넣어 둔 글을 전부 골라(Ctrl+A) 직접 복사해 주세요."); return }
  let got = []; try { const j = JSON.parse(ta.value.trim()); got = (Array.isArray(j) ? j : j && Array.isArray(j.list) ? j.list : [j]).map(estClean).filter(Boolean) } catch (e) { }
  if (!got.length) { toast(ta.value.trim() ? "붙여 넣은 글에서 견적을 찾지 못했습니다. 보내는 쪽에서 ‘모두 복사’를 다시 누르고, 빠짐없이 붙여 넣어 주세요." : "먼저 위 칸에 복사한 견적을 붙여 넣어 주세요."); return }
  const ids = new Set(got.map(x => x.id));
  if (!store.set("sido3_list", got.concat(store.get("sido3_list", []).filter(y => !ids.has(y.id))))) { toast("이 기기의 저장 공간이 모자라 가져오지 못했습니다. ‘저장된 견적’에서 끝난 견적을 지운 뒤 다시 해 주세요."); return }
  ta.value = ""; renderSaved();
  let up = null; if (SRV && SRV.me && SRV.me.role === "staff") { up = 0; for (const x of got) { try { const at = x.savedAt || new Date().toISOString(); await srv("PUT", "/api/est/" + x.id, { ...x, savedAt: at, savedBy: SRV.me.name }); srvMap("sido_srv_base", x.id, at); up++ } catch (e) { } } SRV.list = null; renderSrv() }
  toast(`견적 ${got.length}건을 가져왔습니다.` + (up === null ? "" : up === got.length ? " 회사 저장소에도 올렸습니다." : ` 회사 저장소에는 ${up}건만 올라갔습니다. 연결을 확인한 뒤 그 견적을 열어 ‘저장’을 눌러 주세요.`));
});
/* (v70) 실장 화면은 ‘저장된 견적’ 한 목록: 이 기기에 있는 견적과 회사에 보관된 내 견적을 견적 번호로 합쳐 한 줄씩 보여 준다 (‘회사 저장소’ 칸을 따로 두지 않는다 — 사용자: “실장들한테는 안 보여야지 … 한 목록으로 합치기”).
   어느 기기에서 로그인해도 같은 목록이 보인다. 다른 곳(관리자·다른 기기)에서 더 새로 고친 견적은 ‘열기’가 그 내용을 연다. ‘삭제’는 이 기기와 회사 보관분을 함께 지운다(회사에는 ‘지운 견적’으로 남아 관리자가 되살릴 수 있다).
   관리자 화면 · 회사 주소가 아닌 화면 · 회사 컴퓨터가 꺼져 있을 때는 전처럼 이 기기에 있는 견적만 보여 준다. */
function stfMerge() { return !!(SRV && SRV.token && (!SRV.me || SRV.me.role === "staff") && Array.isArray(srvMine())) }   // (v81) 꺼져 있을 때도 깃허브에서 받은 사본이 있으면 한 목록으로
function tNum(s) { const t = Date.parse(s || ""); return isNaN(t) ? 0 : t }
function savedRows() {                                // [{ x: 이 기기의 견적, s: 회사에 보관된 요약, t, pend, newer, both, ahead }] 새것부터
  const L = store.get("sido3_list", []); if (!stfMerge()) return L.map(x => ({ x }));
  const meId = srvMeId(), mine = srvMine().filter(s => s.owner === meId), S = new Map(mine.map(s => [s.id, s])), P = store.get(PEND_K, {}) || {}, B = store.get("sido_srv_base", {}) || {};
  const rows = L.map(x => { const s = S.get(x.id) || null, xT = tNum(x.savedAt), sT = s ? tNum(s.savedAt) : 0, pend = !!P[x.id], base = B[x.id];
    const newer = !!s && !pend && sT > xT;            // 회사에 보관된 쪽이 더 새것 (다른 기기·관리자가 고쳐 저장했다)
    return { x, s, pend, newer, both: newer && (!base || xT > tNum(base)), ahead: !!s && !pend && xT > sT, t: Math.max(xT, sT) } });   // both = 이 기기에서도 맞춘 뒤에 고친 것이 있다 → 두 내용을 다 열 수 있게 한다 · ahead = 이 기기 것이 더 새것(아직 안 올라감)
  const has = new Set(L.map(x => x.id));
  for (const s of mine) if (!has.has(s.id)) rows.push({ s, t: tNum(s.savedAt) });       // 회사에만 있는 내 견적 (다른 기기에서 쓴 것)
  return rows.sort((a, b) => b.t - a.t);
}
function savedCount() { try { return savedRows().length } catch (e) { return store.get("sido3_list", []).length } }   // ‘현장 정보’ 맨 위 단추의 건수 (화면이 처음 그려질 때는 아직 연결 전이라 이 기기 것만 센다)
function savedRowHtml(r) {
  const by = s => s && s.savedBy && SRV && SRV.me && s.savedBy !== SRV.me.name ? `<span class="chip" title="마지막으로 저장한 사람">${esc(s.savedBy)} 저장</span>` : "";
  if (!r.x) { const s = r.s, cur = s.id === E.id, ok = `${esc(s.owner)}|${esc(s.id)}`;
    return `<li data-q="${esc([s.client, s.site, s.region, s.manager].filter(Boolean).join(" ").toLowerCase())}"><b>${esc(s.client || "(고객명 없음)")}</b><span class="note">${esc(s.site || "")}</span>${s.draft ? '<span class="chip warn">임시저장</span>' : ""}${cur ? '<span class="chip ok">지금 쓰는 견적</span>' : ""}<span class="chip">${esc(s.kind)} v${esc(s.ver)}</span><span class="chip">${won(s.total || 0)}원</span><span class="note">${esc(fmtAt(s.savedAt))}</span>${by(s)}<span class="spacer"></span>
    ${cur ? '<button type="button" class="btn sm primary" data-act="backest">계속 쓰기</button>' : `<button class="btn sm${s.draft ? " primary" : ""}" data-srvopen="${ok}">${s.draft ? "이어 쓰기" : "열기"}</button>`}<button class="btn sm" data-srvdup="${ok}">복제</button>${SRV.down ? "" : `<button class="btn sm danger" data-srvdel="${ok}">삭제</button>`}</li>` }
  const x = r.x, s = r.s || null, ok = s ? `${esc(s.owner)}|${esc(s.id)}` : "", cur = x.id === E.id, v = r.newer && !r.both && !cur ? s : null;   // v = 회사에 보관된 쪽이 더 새것이라 그 내용을 보여 주고 ‘열기’도 그것을 연다
  const info = v ? { client: v.client, site: v.site, kind: v.kind, ver: v.ver, draft: v.draft } : { client: x.info.client, site: x.info.site, kind: x.info.kind, ver: x.info.ver, draft: x.draft };
  const st = !stfMerge() ? "" : v ? '<span class="chip warn" title="다른 기기나 관리자가 고쳐 저장했습니다. ‘열기’를 누르면 그 내용이 열립니다">다른 곳에서 고침 · 열면 그 내용</span>'
    : r.both ? '<span class="chip warn" title="이 기기에서 고친 내용과, 다른 곳(다른 기기·관리자)에서 고쳐 저장한 내용이 서로 다릅니다. 둘 다 열어 볼 수 있습니다">다른 곳에서도 고침</span>'
    : r.pend ? '<span class="chip warn" title="회사 컴퓨터가 꺼져 있을 때 저장한 견적입니다. 켜지면 저절로 회사에도 보관됩니다">회사에 올릴 것</span>'
    : r.ahead ? '<span class="chip warn" title="이 기기에서 고친 내용이 회사에는 아직 올라가지 않았습니다. 열어서 ‘저장’을 누르면 올라갑니다">회사에 아직 안 올라감</span>'
    : !s ? '<span class="chip" title="이 기기에만 있는 견적입니다. 열어서 ‘저장’이나 ‘임시저장’을 누르면 회사에도 보관되어 다른 기기에서도 보입니다">이 기기에만 있음</span>' : "";
  const open = v ? `<button class="btn sm${v.draft ? " primary" : ""}" data-srvopen="${ok}" data-sync="1">${v.draft ? "이어 쓰기" : "열기"}</button>` : savedOpenBtn(x) + (r.both && !cur ? `<button class="btn sm" data-srvopen="${ok}" title="다른 기기나 관리자가 고쳐 저장한 내용을 엽니다. 이 기기에서 고친 내용은 이 줄에 그대로 남습니다">다른 곳에서 고친 내용 열기</button>` : "");
  return `<li data-q="${esc([info.client, info.site, x.info.region, x.info.manager].filter(Boolean).join(" ").toLowerCase())}"><b>${esc(info.client || "(고객명 없음)")}</b><span class="note">${esc(info.site || "")}</span>${v ? (v.draft ? '<span class="chip warn">임시저장</span>' : "") : savedChips(x)}${st}<span class="chip">${esc(info.kind)} v${esc(info.ver)}</span><span class="chip">${won((v ? v.total : x.total) || 0)}원</span><span class="note">${esc(fmtAt(v ? v.savedAt : x.savedAt))}</span>${by(v || (s && !r.ahead && !r.pend ? s : null))}<span class="spacer"></span>
    ${open}<button class="btn sm" data-dup="${x.id}">복제</button><button class="btn sm danger" data-rm="${x.id}"${s && stfMerge() && !SRV.down ? ` data-rmsrv="${ok}"` : ""}>삭제</button></li>`;
}
function renderSaved() {
  renderMove(); renderSrv();                           // 옮기기 칸을 먼저 만들어 둔다 → 실장 화면의 ‘고객에게 보낸 견적’(srvTail)이 목록과 옮기기 칸 사이에 놓인다
  const rows = savedRows(), old = $("#savedQ"), q0 = old ? old.value : "", wait = !!(SRV && SRV.token && SRV.me && SRV.me.role === "staff" && !SRV.down && !SRV.list);
  $("#savedList").innerHTML = savedHead() + (wait ? '<li class="note">회사에 보관된 내 견적을 불러오는 중…</li>' : "") + (rows.length ? `<li><input type="search" id="savedQ" placeholder="고객명 · 주소 · 지역으로 찾기 (저장된 견적 ${rows.length}건)" style="flex:1 1 100%"></li>` + rows.map(savedRowHtml).join("") : wait ? "" : `<li class="note">저장된 견적이 없습니다. 견적 합계의 ‘저장’이나 ‘임시저장’을 누르면 여기에 쌓입니다.</li>`);
  if (q0 && $("#savedQ")) { const i = $("#savedQ"); i.value = q0; i.dispatchEvent(new Event("input", { bubbles: true })) }   // 찾던 말은 목록을 다시 그려도 남긴다
}
document.addEventListener("click", ev0 => {
  const b = ev0.target.closest("#savedList button"); if (!b) return; const L = store.get("sido3_list", []);
  if (b.dataset.open) { if (b.dataset.rev && !b.dataset.armed) { b.dataset.armed = 1; b.textContent = "한 번 더 누르면 그 뒤에 고친 내용을 버립니다"; return }
    const x = L.find(x => x.id === b.dataset.open); if (x) openEst(x, b.dataset.rev ? "저장해 둔 내용으로 되돌렸습니다." : x.draft ? "임시저장한 견적을 이어서 씁니다." : "저장된 견적을 열었습니다.") }
  if (b.dataset.dup) { const x = deep(L.find(x => x.id === b.dataset.dup)); x.id = "e" + Date.now(); x.info.ver = 1; x.info.client = (x.info.client || "") + " (복사)"; delete x.fp; delete x.fpVer; delete x.savedAt; delete x.draft; openEst(x, "복제했습니다. 현재 단가로 계산합니다.") }
  if (b.dataset.rm) { if (b.dataset.armed) { store.set("sido3_list", L.filter(x => x.id !== b.dataset.rm));
      if (b.dataset.rmsrv && SRV && SRV.me && !SRV.down) { const [o, id] = b.dataset.rmsrv.split("|"); srvMap(PEND_K, id, null); if (SRV.list) SRV.list = SRV.list.filter(y => !(y.id === id && y.owner === o));   // (v70) 실장의 한 목록: 회사에 보관된 것도 함께 지운다 (회사에는 ‘지운 견적’으로 남아 관리자가 되살릴 수 있다)
        srv("DELETE", `/api/est/${o}/${id}`).then(() => toast("지웠습니다. 잘못 지웠으면 관리자에게 되살려 달라고 하세요.")).catch(() => toast("이 기기에서는 지웠지만 회사에 보관된 것은 지우지 못했습니다. 연결을 확인하세요.")).then(() => { SRV.list = null; if ($("#view-saved") && !$("#view-saved").hidden) renderSaved() }) }
      renderSaved() } else { b.dataset.armed = 1; b.textContent = "한 번 더 누르면 삭제" } }
});
$("#importEst") && ($("#importEst").onchange = async ev0 => {
  const f = ev0.target.files[0]; if (!f) return;
  try { const x = estClean(JSON.parse(await f.text())); if (!x) throw 0; const L = store.get("sido3_list", []).filter(y => y.id !== x.id); L.unshift(x); store.set("sido3_list", L); openEst(x, "견적 파일을 열었습니다.") }
  catch (e) { toast("견적 파일을 읽지 못했습니다. 이 프로그램에서 내보낸 .json 파일인지 확인하세요.") }
  ev0.target.value = "";
});

/* ---------- 관리자: 단가·원가 ---------- */
const GROUP_OF = { 가설: "가설·철거", 철거: "가설·철거", 설비: "설비·타일·욕실", 타일: "설비·타일·욕실", 욕실: "설비·타일·욕실", 창호: "창호", 목공: "목공", 전기: "전기·조명", 도어: "도어·중문", 바닥: "바닥", 도배: "도배", 필름: "필름", 가구: "가구", 기타: "기타(청소·탄성·마감)" };
function renderPrices() {
  if (!isAdmin) return;
  const f = $("#catFilter").value, q = $("#catSearch").value.trim();
  if (!$("#catFilter").options.length) $("#catFilter").innerHTML = `<option value="">전체 공정</option>` + PROCS.map(p => `<option>${p}</option>`).join("");
  const rows = D.catalog.filter(i => (!f || i.proc === f) && (!q || (i.name + i.spec).includes(q)));
  $("#catTbl").innerHTML = `<thead><tr><th>공정</th><th>품목</th><th>규격·비고</th><th>단위</th><th>구분</th><th class="num">원가</th><th>출처</th><th class="num">개별 마진%</th><th class="num">판매단가</th><th class="num">과거 견적가</th><th></th></tr></thead><tbody>` +
    rows.map(i => { const sp = unitPrice(i, E), d = i.past ? (sp - i.past) / i.past : null; return `<tr data-id="${i.id}">
    <td><select data-c="proc">${PROCS.map(p => `<option ${p === i.proc ? "selected" : ""}>${p}</option>`).join("")}</select></td>
    <td><input data-c="name" value="${esc(i.name)}" style="min-width:150px"></td><td><input data-c="spec" value="${esc(i.spec)}" style="min-width:160px"></td>
    <td><input data-c="unit" value="${esc(i.unit)}" style="width:58px"></td>
    <td><select data-c="kind">${["자재", "노무", "경비"].map(k => `<option ${k === i.kind ? "selected" : ""}>${k}</option>`).join("")}</select></td>
    <td class="num"><input class="p" type="number" step="10" data-c="cost" value="${i.cost}"></td><td><span class="pill ${esc(i.src)}">${esc(i.src)}</span></td>
    <td class="num"><input type="number" step="1" data-c="margin" value="${i.margin == null || i.margin === "" ? "" : Math.round(i.margin * 100)}" placeholder="${Math.round((D.margins[i.proc] || 0) * 100)}" style="width:62px"></td>
    <td class="num"><b data-sp>${won(sp)}</b></td><td class="num">${i.past ? won(i.past) : "-"} ${d != null ? `<span class="${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${(d * 100).toFixed(0)}%</span>` : ""}</td>
    <td><button class="btn ghost sm" data-delitem="${i.id}">삭제</button></td></tr>` }).join("") + "</tbody>";
}
/* 전체 마진 슬라이더: 공정 간 비율(현장 실적 기준 = data.js의 기본 마진)을 유지하고 배율만 찾는다 */
const MBASE = { ...BASE.margins };
function setScale(k) { for (const p in MBASE) D.margins[p] = Math.min(0.8, Math.round(MBASE[p] * k * 1000) / 1000) }
function refEstimate() { const ref = (document.querySelector('input[name="mref"]:checked') || {}).value || "std"; if (ref === "cur") { const c = deep(E); delete c.fp; return c } const keep = E; E = blankEst(); if (D.stepLines) applyPreset2(0); else applyPreset(0); const t = E; E = keep; return t }
function solveScale(target) {
  const keep = E, keepM = { ...D.margins }, ref = refEstimate(); E = ref;
  let lo = 0.05, hi = 3;
  for (let i = 0; i < 28; i++) { const mid = (lo + hi) / 2; setScale(mid); if (compute().margin > target) hi = mid; else lo = mid }
  E = keep; Object.assign(D.margins, keepM);
  return (lo + hi) / 2;
}
function sliderInfo() {
  if (!$("#mInfo")) return;
  const keep = E; E = refEstimate(); const r = compute(); E = keep;
  if ($("#mSlider") && document.activeElement !== $("#mSlider")) { $("#mSlider").value = Math.round(r.margin * 200) / 2; $("#mVal").textContent = pct(r.margin) }
  const ref = (document.querySelector('input[name="mref"]:checked') || {}).value === "cur" ? "지금 견적" : "33평 전체 리모델링";
  $("#mInfo").textContent = `${ref} 기준: 총액 ${won(r.total)}원 (VAT 포함) · 마진 ${pct(r.margin)} · 공정 마진 ` + PROCS.map(p => `${p} ${Math.round((D.margins[p] || 0) * 1000) / 10}%`).join(", ") + " — 바꾼 뒤 ‘실장 페이지에 적용’을 누르세요.";
}
document.addEventListener("change", ev0 => { if (ev0.target.name === "mref") sliderInfo() });
function renderSettings() {
  if (!isAdmin && !canTune) return;
  setTimeout(sliderInfo, 0);
  document.querySelectorAll("#view-settings .adminOnly").forEach(x => x.hidden = !isAdmin);
  const B = (D.analysis || {}).bench || {};
  $("#marginTbl").innerHTML = `<thead><tr><th>공정</th><th class="num">적용 마진율 %</th><th class="num">실적 가중평균</th><th class="num">실적 중앙값</th><th class="num">잘 된 현장 (상위 절반)</th><th class="num">표본</th></tr></thead><tbody>` +
    PROCS.map(p => { const b = B[GROUP_OF[p]] || {}; return `<tr><td>${PROC_LABEL[p]}${b.procs && b.procs.length > 1 ? ` <span class="note">(${GROUP_OF[p]} 묶음)</span>` : ""}</td>
    <td class="num" style="white-space:nowrap"><input type="range" min="0" max="60" step="0.5" data-m="${p}" value="${Math.round((D.margins[p] || 0) * 1000) / 10}" aria-label="${PROC_LABEL[p]} 마진율"> <input type="number" step="0.5" data-m="${p}" value="${Math.round((D.margins[p] || 0) * 1000) / 10}" style="width:72px"></td>
    <td class="num">${b.wavg != null ? pct(b.wavg) : "-"}</td><td class="num">${b.median != null ? pct(b.median) : "-"}</td><td class="num">${b.top != null ? pct(b.top) : "-"}</td><td class="num">${b.n || "-"}</td></tr>` }).join("") + "</tbody>";
  const S = D.settings, L = D.layout, co = D.company;
  $("#settingsForm").innerHTML = `
   <label class="f">기업이윤 기본 %<input type="number" step="0.5" data-s="bizProfit" value="${Math.round(S.bizProfit * 1000) / 10}"></label>
   <label class="f">실장 화면 목표 마진 %<input type="number" step="1" data-s="targetMargin" value="${Math.round(S.targetMargin * 100)}"></label>
   <label class="f">절사 단위 (원)<input type="number" step="1000" data-s="roundUnit" value="${S.roundUnit}"></label>
   <label class="f">인건비 여유 인원 (명)<input type="number" step="1" min="0" data-s="laborBuffer" value="${S.laborBuffer ?? 0}"></label>
   <label class="f" style="grid-column:span 2">여유 인원을 더할 인건비 품목 (쉼표로 구분)<input data-bi value="${esc((S.bufferItems || []).join(", "))}"></label>
   <label class="f">회사명<input data-co="name" value="${esc(co.name)}"></label><label class="f">대표 전화<input data-co="tel" value="${esc(co.tel)}"></label><label class="f">주소<input data-co="addr" value="${esc(co.addr)}"></label>
   <label class="f">관리자 비밀번호 변경<input type="password" data-pw placeholder="새 비밀번호" autocomplete="new-password"></label>`;
  $("#layoutForm").innerHTML = [["exclRatio", "전용률 (공급 대비)"], ["living", "거실 비율 (전용 대비)"], ["kitchen", "주방 비율"], ["masterShare", "안방 비율 (방 합계 대비)"], ["entry", "현관 면적 ㎡"], ["bath", "욕실 1칸 바닥 ㎡"], ["balcony", "발코니 1칸 ㎡"], ["ceilH", "천장고 m"], ["openingCut", "벽 면적 중 창·문 제외 계수"]]
    .map(([k, l]) => `<label class="f">${l}<input type="number" step="0.01" data-l="${k}" value="${L[k]}"></label>`).join("");
}
function renderRules() {
  if (!isAdmin) return;
  // 지금 계산에 실제로 쓰는 규칙만 보여 준다 (공정 체크 방식이면 stepLines, 아니면 예전 공간별 규칙)
  const o = {}; RULE_KEYS().forEach(k => { if (D[k] !== undefined) o[k] = D[k] });
  $("#rulesJson").value = JSON.stringify(o, null, 1);
  $("#rulesMsg").textContent = "";
  const note = document.querySelector("#view-rules p.note");
  if (note && D.stepLines) note.textContent = "steps = 단계 목록 · cats = 단계 안의 큰 공사 카드(lines에 줄 id) · stepLines = 줄(품목·수량식) · presets2 = 공사 유형(tag) · alias = 화면에 보이는 쉬운 이름 · doc = 견적서 특기사항. "
    + "수량식에 쓸 수 있는 값: FT 바닥 시공 합계㎡, perimAll 둘레 합계m, paperM2 도배㎡, bathWallM2 욕실 벽타일㎡, bathFloorM2 욕실 바닥㎡, livingA 거실㎡, exclM2 전용㎡, supplyM2 공급㎡, py 평형, rooms·baths·balconies·level, ON('줄 id') 체크 여부(1/0), L('줄 id') 그 줄의 수량. items 의 품목명은 ‘단가·원가’ 화면의 품목명과 똑같아야 합니다.";
}
const RULE_KEYS = () => D.stepLines ? ["steps", "cats", "presets2", "stepLines", "alias", "doc"] : ["global", "spaceTypes", "auto", "doc"];
/* 규칙 검사: 없는 품목, 겹치는 줄 id, 카드가 가리키는 없는 줄, 수량식 오류 */
function checkRules() {
  const errs = []; if (!D.stepLines) return compute().errors;
  const ids = new Set(), V = lineVars(spaces());
  for (const [sk, rows] of Object.entries(D.stepLines)) for (const l of rows || []) {
    if (!l.id || !Array.isArray(l.items) || !l.items.length) { errs.push(`${sk}: id 또는 items 가 없는 줄`); continue }
    if (ids.has(l.id)) errs.push("줄 id 중복: " + l.id); ids.add(l.id);
    if (typeof l.tags !== "string") l.tags = "";
    for (const n of l.items) if (!byName[n]) errs.push(`품목 없음: ${n} (${l.id})`);
    try { if (!isFinite(+ev(l.qty, V[sk]))) errs.push(`수량식 결과가 숫자가 아님 (${l.id}): ${l.qty}`) } catch (e) { errs.push(`수량식 오류 (${l.id}): ${l.qty}`) }
    for (const b of (l.bom || {}).items || []) {
      if (l.bom.mode === "replace" && !byName[b.name]) errs.push(`품목 없음: ${b.name} (${l.id})`);
      try { +ev(b.qty, V[sk]) } catch (e) { errs.push(`수량식 오류 (${l.id} · ${b.name}): ${b.qty}`) }
    }
  }
  for (const [sk, cs] of Object.entries(D.cats || {})) for (const c of cs || []) for (const id of c.lines || []) if (!ids.has(id)) errs.push(`카드 ‘${c.label}’ 의 줄 id 없음: ${id}`);
  for (const st of D.steps || []) if (!D.stepLines[st.key]) errs.push("단계에 줄 목록 없음: " + st.key);
  return errs;
}
function renderAnalysis() {
  const A = D.analysis; if (!isAdmin || !A) return;
  const s = A.sites, ms = s.map(x => x.margin).sort((a, b) => a - b);
  $("#anaKpis").innerHTML = [["분석 현장", s.length + "곳"], ["순매출 합계", won(A.total.net) + "원"], ["원가 합계", won(A.total.cost) + "원"], ["전체 마진", pct(A.total.margin)], ["현장 마진 중앙값", pct(ms[Math.floor(ms.length / 2)])]]
    .map(([k, v]) => `<div class="card kpi"><div class="k">${k}</div><div class="v">${v}</div></div>`).join("");
  $("#benchTbl").innerHTML = `<thead><tr><th>공정</th><th class="num">표본</th><th class="num">가중평균</th><th class="num">중앙값</th><th class="num">상위 절반</th><th class="num">하위 절반</th></tr></thead><tbody>` +
    Object.entries(A.bench).map(([g, b]) => `<tr><td>${g}</td><td class="num">${b.n}</td><td class="num">${pct(b.wavg)}</td><td class="num">${pct(b.median)}</td><td class="num">${pct(b.top)}</td><td class="num ${b.bottom < 0 ? "down" : ""}">${pct(b.bottom)}</td></tr>`).join("") + "</tbody>";
  $("#siteTbl").innerHTML = `<thead><tr><th>현장</th><th>부가세 판단</th><th class="num">견적 (VAT 별도)</th><th class="num">순매출</th><th class="num">추가·할인</th><th class="num">원가</th><th class="num">마진</th></tr></thead><tbody>` +
    s.map(x => `<tr><td>${esc(x.site)}</td><td><span class="pill">${esc(x.vat)}</span></td><td class="num">${x.estimate ? won(x.estimate) : "-"}</td><td class="num">${won(x.net)}</td><td class="num">${x.estimate ? won(x.extra) : "-"}</td><td class="num">${won(x.cost)}</td><td class="num"><span class="chip ${x.margin >= (D.settings.targetMargin || 0.2) ? "ok" : "warn"}">${pct(x.margin)}</span></td></tr>`).join("") + "</tbody>";
  $("#anaNotes").innerHTML = (A.notes || []).map(n => `<li>${esc(n)}</li>`).join("");
}
document.addEventListener("input", ev0 => {
  if (!isAdmin && !canTune) return; const el = ev0.target;
  if (el.dataset.m) { D.margins[el.dataset.m] = (+el.value || 0) / 100; document.querySelectorAll(`[data-m="${el.dataset.m}"]`).forEach(x => { if (x !== el) x.value = el.value }); R = compute(); renderSummary(); sliderInfo() }
  if (el.id === "mSlider") { const t = +el.value / 100; const k = solveScale(t); setScale(k); $("#mVal").textContent = (+el.value).toFixed(1) + "%"; document.querySelectorAll("#marginTbl [data-m]").forEach(x => x.value = Math.round((D.margins[x.dataset.m] || 0) * 1000) / 10); R = compute(); renderSummary(); sliderInfo() }
  if (el.dataset.s) { const k = el.dataset.s; D.settings[k] = ["bizProfit", "targetMargin"].includes(k) ? (+el.value || 0) / 100 : +el.value }
  if (el.dataset.co) D.company[el.dataset.co] = el.value;
  if (el.dataset.bi !== undefined) { D.settings.bufferItems = el.value.split(",").map(x => x.trim()).filter(Boolean); R = compute(); renderSummary() }
  if (el.dataset.s === "laborBuffer") { R = compute(); renderSummary() }
  if (el.dataset.l) { D.layout[el.dataset.l] = +el.value || 0; R = compute(); renderSummary() }
  if (el.dataset.c) {
    const tr = el.closest("tr[data-id]"), it = D.catalog.find(x => x.id === tr.dataset.id), k = el.dataset.c, old = it.name;
    it[k] = k === "cost" ? (+el.value || 0) : k === "margin" ? (el.value === "" ? null : +el.value / 100) : el.value;
    if (k === "cost" && it.src === "추정") it.src = "수정";
    if (k === "name") renameItem(old, it.name);
    indexCatalog(); const b = tr.querySelector("[data-sp]"); if (b) b.textContent = won(unitPrice(it, E));
  }
});
function renameItem(o, n, dataOnly) {
  if (!n || o === n) return;
  const walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === "object") { if (x.item === o) x.item = n; Object.values(x).forEach(walk) } }; walk(D.spaceTypes); walk(D.auto); walk(D.packages);
  for (const k of ["floorOpts", "paperOpts"]) if ((D.global || {})[k]) D.global[k] = D.global[k].map(x => x === o ? n : x);
  // 공정 체크 방식의 줄·자재 구성·쉬운 이름·작성 중인 견적도 같이 바꾼다
  for (const l of Object.values(D.stepLines || {}).flat()) { l.items = l.items.map(x => x === o ? n : x); for (const b of (l.bom || {}).items || []) if (b.name === o) b.name = n }
  if (D.alias && D.alias[o] !== undefined) { D.alias[n] = D.alias[o]; delete D.alias[o] }
  if (D.settings.bufferItems) D.settings.bufferItems = D.settings.bufferItems.map(x => x === o ? n : x);
  if (!dataOnly) { for (const x of E.extras || []) if (x.item === o) x.item = n; if (E.floorItem === o) E.floorItem = n; if (E.paperItem === o) E.paperItem = n }
  for (const k in fnCache) delete fnCache[k];
  rebuildUsed();
}
document.addEventListener("change", ev0 => {
  if (!isAdmin) return; const el = ev0.target;
  if (el.dataset.pw !== undefined && el.value) { D.settings.adminHash = sha256(el.value); try { sessionStorage.setItem("sido3_admin", D.settings.adminHash) } catch (e) {} if (window.SIDO_ENC) SIDO_ENC.setPassword(el.value).catch(() => {}); toast("비밀번호를 바꿨습니다. ‘변경 저장’ 후 ‘관리자용 data.js 내보내기’를 해야 파일에 반영됩니다 (새 비밀번호로 잠겨서 나옵니다).") }
  if (el.dataset.c === "proc" || el.dataset.c === "kind") { const it = D.catalog.find(x => x.id === el.closest("tr").dataset.id); it[el.dataset.c] = el.value }
  if (el.id === "catFilter") renderPrices();
});
document.addEventListener("click", ev0 => {
  if (!isAdmin) return; const b = ev0.target.closest("button"); if (!b) return;
  if (b.dataset.delitem) { if (b.dataset.armed) { D.catalog = D.catalog.filter(x => x.id !== b.dataset.delitem); indexCatalog(); renderPrices() } else { b.dataset.armed = 1; b.textContent = "확인" } }
  if (b.id === "addItemBtn") { D.catalog.unshift({ id: "u" + Date.now(), proc: $("#catFilter").value || "기타", name: "새 품목 " + (D.catalog.length + 1), spec: "", unit: "식", kind: "자재", cost: 0, src: "수정", margin: null, past: null }); indexCatalog(); renderPrices() }
  if (b.id === "applyData") { store.set("sido3_override", { base: BASE.version, data: { catalog: D.catalog, margins: D.margins, settings: D.settings, layout: D.layout, company: D.company, spaceTypes: D.spaceTypes, auto: D.auto, global: D.global, doc: D.doc, stepLines: D.stepLines, steps: D.steps, cats: D.cats, presets2: D.presets2, alias: D.alias } }) ? toast("이 브라우저에 저장했습니다. 다른 PC에는 데이터 파일을 내보내 바꿔 넣으세요.") : toast("저장하지 못했습니다."); refresh(true) }
  if (b.id === "exportFull") exportData(false);
  if (b.id === "exportStaff") exportData(true);
  if (b.id === "resetData") { if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = "한 번 더 누르면 되돌립니다"; return } store.del("sido3_override"); D = deep(BASE); indexCatalog(); rebuildUsed(); for (const k in fnCache) delete fnCache[k]; b.dataset.armed = ""; b.textContent = "파일 기본값으로 되돌리기"; refresh(true); show("prices"); toast("data.js 기본값으로 되돌렸습니다.") }
  if (b.id === "applyRules") {
    let j; try { j = JSON.parse($("#rulesJson").value) } catch (e) { $("#rulesMsg").textContent = "JSON 형식이 맞지 않습니다: " + e.message; return }
    // 먼저 넣어 보고, 오류가 있으면 원래 규칙으로 되돌린다 (잘못된 규칙으로 견적이 깨지지 않게)
    const keys = RULE_KEYS(), keep = {}; keys.forEach(k => keep[k] = D[k]);
    keys.forEach(k => { if (j[k]) D[k] = j[k] }); for (const k in fnCache) delete fnCache[k];
    let errs; try { errs = checkRules() } catch (e) { errs = ["규칙 형식 오류: " + e.message] }
    if (errs.length) { keys.forEach(k => D[k] = keep[k]); for (const k in fnCache) delete fnCache[k]; $("#rulesMsg").textContent = `적용하지 않았습니다. 오류 ${errs.length}건: ${errs.slice(0, 5).join(" / ")}`; return }
    rebuildUsed(); refresh(true); $("#rulesMsg").textContent = "적용했습니다. 오류 없음. ‘단가·원가’ 화면의 ‘변경 저장’을 눌러야 이 PC에 유지됩니다.";
  }
});
/* 실장용 품목: 판매단가만. 원가·마진율·출처·과거 견적가는 넣지 않는다.
   (층수 운임표·업체 견적처럼 실장이 넣는 값으로 단가가 정해지는 품목만 그 품목의 마진율 m 을 둔다) */
const round3 = x => Math.round(x * 1000) / 1000;
function staffItem(i) {
  const o = { id: i.id, proc: i.proc, name: i.name, spec: i.spec, unit: i.unit, kind: i.kind, price: staffPrice(i) };
  if (i.group) o.group = i.group;
  if (i.tier) o.tier = i.tier;
  if (i.costVar) { o.costVar = i.costVar; o.m = round3(marginOf(i)) }
  if (i.costTable) { o.costTable = i.costTable; o.m = round3(marginOf(i)) }
  return o;
}
let EXPORT_VER = "";   // 관리자용·실장용을 같은 버전으로 내보내야 ‘실장 페이지에 적용’이 맞물린다
async function exportData(staff) {
  const out = deep(D), t = new Date(), p2 = n => String(n).padStart(2, "0");
  EXPORT_VER = EXPORT_VER || `${t.getFullYear()}-${p2(t.getMonth() + 1)}-${p2(t.getDate())}-${p2(t.getHours())}${p2(t.getMinutes())}`;
  out.version = EXPORT_VER;
  if (staff) {
    out.staffOnly = true; delete out.analysis; delete out.margins; delete out.settings.adminHash; delete out.settings.targetMargin;
    out.catalog = D.catalog.map(staffItem);
  }
  let text;
  if (staff) text = "// 시도디자인 견적 - 실장용 데이터 (원가 없음)\nwindow.SIDO_DATA = " + JSON.stringify(out, null, 1) + ";\n";
  else if (window.SIDO_ENC) {                         // 관리자용은 비밀번호로 잠가서 내보낸다 (파일만 가져가서는 원가를 볼 수 없게)
    try {
      if (!SIDO_ENC.ready) {
        const pw = prompt("내보내는 관리자 데이터를 잠글 비밀번호(관리자 비밀번호)를 입력하세요."); if (!pw) return;
        if (await SIDO_ENC.sha256hex(pw) !== D.settings.adminHash) { toast("비밀번호가 맞지 않습니다."); return }
        await SIDO_ENC.setPassword(pw);
      }
      text = await SIDO_ENC.encryptText(JSON.stringify(out));
    } catch (e) { toast("관리자 데이터를 잠그지 못했습니다: " + (e && e.message || e)); return }
  } else text = "// 시도디자인 견적 - 관리자용 데이터 (원가 포함, 외부 공유 금지)\nwindow.SIDO_DATA = " + JSON.stringify(out, null, 1) + ";\n";
  download("data.js", text, "text/javascript");
  toast(staff ? "실장용 data.js를 받았습니다. 실장용 폴더의 data.js와 바꿔 넣으세요." : "관리자용 data.js를 받았습니다. 관리자 폴더의 data.js와 바꿔 넣으세요.");
}

/* ---------- 실장 페이지에 마진 적용 (같은 PC: localStorage, 온라인: db) ---------- */
let SHARED = null, canTune = false;
async function connectShared() {
  if (!window.claude || typeof window.claude.use !== "function") return;
  try {
    const db = await window.claude.use("db"); if (!db) return;
    const user = await window.claude.use("user");
    const canEdit = user ? await user.canEdit() : false;
    SHARED = { db, canEdit };
    db.doc("pub/settings").onSnapshot(s => {
      if (!s.exists) return; const pub = s.data();
      if (MODE === "staff" && pub.base === BASE.version) { applyPub(pub); refresh() }
    }, () => {});
    // 실장용 데이터에는 원가·마진이 없으므로 마진 조정은 관리자 페이지에서만 한다.
    // 이 주소의 편집 권한자에게만 ‘관리자 단가 파일 올리기’가 보인다 (파일은 관리자 로그인 후에만 받을 수 있다).
    if (canEdit && MODE === "staff" && !document.querySelector("#pubUpIn")) document.querySelector(".topin").insertAdjacentHTML("beforeend",
      '<label class="btn sm" style="cursor:pointer" title="관리자 화면에서 받은 실장단가 파일(.json)을 올리면 이 주소를 쓰는 모든 실장 화면의 단가가 바뀝니다">관리자 단가 파일 올리기<input type="file" id="pubUpIn" accept=".json" hidden></label>');
  } catch (e) {}
}
async function publishPub() {
  if (STAFF_DATA) return;
  // 실장 쪽에는 마진율이 아니라 계산이 끝난 판매단가만 보낸다
  const prices = {}, vm = {};
  for (const i of D.catalog) { if (i.costTable || i.costVar) vm[i.id] = round3(marginOf(i)); else prices[i.id] = staffPrice(i) }
  const pub = { base: BASE.version, prices, vm, bizProfit: D.settings.bizProfit, laborBuffer: D.settings.laborBuffer ?? 0, updatedAt: Date.now() };
  store.set("sido3_pub", pub);
  let online = false;
  if (SHARED && SHARED.canEdit) { try { await SHARED.db.doc("pub/settings").set(pub); online = true } catch (e) {} }
  toast(online ? "온라인 실장 페이지에 적용했습니다. 열려 있는 실장 화면도 바로 바뀝니다." : "이 PC의 실장 페이지에 적용했습니다. 다른 PC는 ‘실장용 data.js 내보내기’로 교체하세요.");
}
document.addEventListener("click", ev0 => { if (ev0.target.closest("#publishPub")) publishPub() });

/* ---------- 시작 ---------- */
document.querySelector("nav.tabs").addEventListener("click", ev0 => { const b = ev0.target.closest("button[data-view]"); if (b) show(b.dataset.view) });
$("#catSearch") && ($("#catSearch").oninput = renderPrices);
function boot() {
  document.body.classList.toggle("admin-mode", isAdmin);
  document.querySelectorAll(".adm").forEach(x => x.hidden = !isAdmin);
  if (freshStart) { if (D.stepLines) applyPreset2(0); else applyPreset(0) }
  if (D.stepLines) document.querySelector('nav.tabs [data-view="est"]').hidden = true;
  if (isAdmin && !$("#xlExport")) {   // 관리자 로그인 후에만 생기는 버튼
    const tb = document.querySelector("#view-prices .toolbar");
    tb.insertAdjacentHTML("beforeend", '<button class="btn" id="xlExport">단가표 엑셀 받기</button><label class="btn" style="cursor:pointer">단가표 엑셀 올리기<input type="file" id="xlImport" accept=".xlsx" hidden></label>');
    tb.insertAdjacentHTML("afterend", '<div id="xlBox"></div>');
    $("#publishPub").insertAdjacentHTML("afterend", '<button class="btn" id="pubFile">실장 URL용 단가 파일 받기</button>');
  }
  const cp = document.querySelector('.docbar [data-act="copy"]');
  if (cp && !document.querySelector('[data-act="xlsx"]')) cp.insertAdjacentHTML("beforebegin", '<button class="btn" data-act="xlsx">엑셀 견적서 저장 (.xlsx)</button>');
  refresh(true); show("check");
  connectShared(); if (SRV && SRV.front && SRV.token === "0") frontLogin("");   // (v84) 로그인하지 않은 기기는 서버의 대답을 기다리지 않고 바로 로그인 창을 덮는다
  srvConnect();
  if (isAdmin && D.settings.adminHash === sha256("sido1234")) toast("관리자 비밀번호가 처음 값 그대로입니다. ‘마진·설정’에서 바꾼 뒤 ‘변경 저장’을 눌러 주세요.");
  else if (verChanged) toast("단가표가 새 버전으로 바뀌었습니다. 작성 중이던 견적은 그대로 두었습니다.");
}
if (MODE === "admin") {
  if (STAFF_DATA) { $("#gateMsg").textContent = "이 폴더의 data.js는 실장용(원가 없음)입니다. 관리자용 data.js를 넣어 주세요."; $("#gate").hidden = false }
  else {
    try { isAdmin = sessionStorage.getItem("sido3_admin") === D.settings.adminHash } catch (e) {}
    if (isAdmin) { $("#gate").hidden = true; boot() } else $("#gate").hidden = false;
    $("#gateForm").onsubmit = ev0 => { ev0.preventDefault(); if (sha256($("#gatePw").value) === D.settings.adminHash) { isAdmin = true; try { sessionStorage.setItem("sido3_admin", D.settings.adminHash) } catch (e) {} $("#gate").hidden = true; boot() } else $("#gateMsg").textContent = "비밀번호가 맞지 않습니다." };
  }
} else boot();
