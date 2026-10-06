/* =========================================================
   PYTHON QUEST — ui.js
   Komponen tampilan bersama: layout, navigasi, toast, modal,
   animasi XP, syntax highlighting, code editor, pengecek challenge.
   ========================================================= */

/* ---------------- Ikon SVG (gaya Lucide) ---------------- */
const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  quiz: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  game: '<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22"/><path d="M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m22 4-10 10-3-3"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  play: '<path d="M6 3l14 9-14 9z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
};
function icon(name, cls) {
  return `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

const NAV_GROUPS = [
  { label: "Belajar", items: [
    { href: "dashboard.html", key: "dashboard", icon: "home", label: "Dashboard" },
    { href: "roadmap.html", key: "roadmap", icon: "map", label: "World Map" },
    { href: "lessons.html", key: "lessons", icon: "book", label: "Lessons" },
    { href: "playground.html", key: "playground", icon: "terminal", label: "Playground" },
  ] },
  { label: "Latihan", items: [
    { href: "quiz.html", key: "quiz", icon: "quiz", label: "Quiz" },
    { href: "games.html", key: "games", icon: "game", label: "Mini Games" },
  ] },
  { label: "Pencapaian", items: [
    { href: "achievements.html", key: "achievements", icon: "trophy", label: "Achievements" },
    { href: "progress.html", key: "progress", icon: "chart", label: "Progress" },
    { href: "profile.html", key: "profile", icon: "user", label: "Profile" },
  ] },
];
const NAV = NAV_GROUPS.flatMap((g) => g.items);
const BOTTOM_NAV = [
  { href: "dashboard.html", key: "dashboard", icon: "home", label: "Home" },
  { href: "roadmap.html", key: "roadmap", icon: "map", label: "Map" },
  { href: "lessons.html", key: "lessons", icon: "book", label: "Learn" },
  { href: "games.html", key: "games", icon: "game", label: "Game" },
  { href: "profile.html", key: "profile", icon: "user", label: "Profile" },
];
const PAGE_TITLES = {
  dashboard: ["Dashboard", "Ringkasan petualanganmu"],
  roadmap: ["World Map", "Peta seluruh quest"],
  lessons: ["Lessons", "Materi langkah demi langkah"],
  playground: ["Code Playground", "Tulis & jalankan Python"],
  quiz: ["Quiz", "Uji pemahamanmu"],
  games: ["Mini Games", "Belajar sambil bermain"],
  achievements: ["Achievements", "Koleksi badge"],
  progress: ["Progress", "Statistik belajar"],
  profile: ["Profile", "Akun & pengaturan"],
};

const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function h(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function brandHtml() {
  return `<span class="brand-mark" aria-hidden="true">Py</span><span class="brand-text">Python<b>Quest</b></span>`;
}

/* Avatar dengan cincin progress level */
function levelRing(p, info, size) {
  return `<span class="lvl-ring lvl-${size || "md"}" style="--pct:${info.pct}" aria-hidden="true">
    <span class="lvl-avatar">${escapeHtml(p.avatar)}</span><span class="lvl-badge">${info.level}</span></span>`;
}

/* ---------------- Layout ---------------- */
function renderShell(activeKey) {
  const shell = document.getElementById("app-shell");
  const collapsed = localStorage.getItem("pq_sidebar_collapsed") === "1";
  const [title, sub] = PAGE_TITLES[activeKey] || ["Python Quest", ""];
  shell.innerHTML = `
    <a class="skip-link" href="#page">Lewati ke konten</a>
    <div class="layout ${collapsed ? "is-collapsed" : ""}">
      <aside class="sidebar" aria-label="Navigasi utama">
        <a class="brand" href="index.html" aria-label="Python Quest beranda">${brandHtml()}</a>
        <nav class="side-nav">
          ${NAV_GROUPS.map((g) => `<div class="side-group"><div class="side-group-label">${g.label}</div>
            ${g.items.map((n) => `<a href="${n.href}" class="side-link ${n.key === activeKey ? "active" : ""}" ${n.key === activeKey ? 'aria-current="page"' : ""} title="${n.label}">
              ${icon(n.icon, "side-icon")}<span class="side-label">${n.label}</span></a>`).join("")}</div>`).join("")}
        </nav>
        <a class="side-card" id="side-card" href="profile.html" aria-label="Buka profil"></a>
      </aside>
      <div class="main-wrap">
        <header class="topbar">
          <button class="icon-btn collapse-btn" id="collapse-btn" aria-label="Lipat/buka sidebar" title="Lipat/buka sidebar">${icon("menu")}</button>
          <a class="brand brand-mobile" href="index.html" aria-label="Python Quest beranda">${brandHtml()}</a>
          <div class="top-title"><span class="top-title-main">${title}</span><span class="top-title-sub">${sub}</span></div>
          <div class="top-stats" id="top-stats"></div>
        </header>
        <main id="page" class="page" tabindex="-1"></main>
      </div>
      <nav class="bottom-nav" aria-label="Navigasi bawah">
        ${BOTTOM_NAV.map((n) => `<a href="${n.href}" class="bottom-link ${n.key === activeKey ? "active" : ""}" ${n.key === activeKey ? 'aria-current="page"' : ""}>
            ${icon(n.icon)}<span>${n.label}</span></a>`).join("")}
      </nav>
    </div>
    <div id="toast-root" class="toast-root" aria-live="polite" aria-atomic="false"></div>
    <div id="modal-root"></div>`;
  $("#collapse-btn").addEventListener("click", () => {
    const layout = $(".layout");
    layout.classList.toggle("is-collapsed");
    localStorage.setItem("pq_sidebar_collapsed", layout.classList.contains("is-collapsed") ? "1" : "0");
  });
  refreshStats();
}

function refreshStats() {
  const p = loadProgress();
  const info = getLevelInfo(p.xp);
  const top = $("#top-stats");
  if (top) {
    top.innerHTML = `
      <span class="stat-pill pill-streak" title="Streak belajar">${icon("flame")}<b>${p.streak}</b><span class="hide-sm">hari</span></span>
      <span class="stat-pill pill-xp" id="xp-chip" title="Total XP">${icon("star")}<b id="xp-num">${p.xp}</b><span class="hide-sm">XP</span></span>
      <a class="stat-pill pill-level" href="profile.html" title="Level ${info.level} — ${info.title}">${icon("shield")}<span>Lv <b>${info.level}</b></span></a>`;
  }
  const side = $("#side-card");
  if (side) {
    side.innerHTML = `
      <div class="side-card-top">${levelRing(p, info, "sm")}
        <div class="grow"><div class="side-name">${escapeHtml(p.name)}</div><div class="side-sub">${info.title}</div></div></div>
      ${xpBar(info, true)}`;
  }
}

function xpBar(info, compact) {
  const label = info.next ? `${info.xp} / ${info.target} XP` : `${info.xp} XP · MAX`;
  return `<div class="xpbar ${compact ? "xpbar-sm" : ""}">
      <div class="xpbar-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${info.pct}" aria-label="Progress XP menuju level berikutnya">
        <div class="xpbar-fill" style="width:${info.pct}%"></div></div>
      <div class="xpbar-label"><span>${label}</span>${info.next ? `<span>Lv ${info.next.level}</span>` : ""}</div></div>`;
}

function progressBar(pct, color, label) {
  return `<div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${escapeHtml(label || "Progress")}">
    <div class="pbar-fill" style="width:${pct}%;${color ? `background:${color}` : ""}"></div></div>`;
}

/* ---------------- Toast ---------------- */
function toast(html, type, ms) {
  const root = $("#toast-root");
  if (!root) return;
  const el = h(`<div class="toast toast-${type || "info"}" role="status">${html}</div>`);
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, ms || 3200);
}

/* ---------------- Modal ---------------- */
let _lastFocus = null;
function openModal(html, opts) {
  opts = opts || {};
  const root = $("#modal-root");
  if (!root) return;
  _lastFocus = document.activeElement;
  root.innerHTML = `<div class="modal-backdrop" data-close="1">
    <div class="modal ${opts.className || ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">${html}</div></div>`;
  const backdrop = root.firstElementChild;
  requestAnimationFrame(() => backdrop.classList.add("show"));
  backdrop.addEventListener("click", (e) => {
    if (e.target.dataset.close === "1" && opts.dismissible !== false) closeModal();
  });
  $$("[data-modal-close]", root).forEach((b) => b.addEventListener("click", closeModal));
  const focusable = $$("button, a, input, textarea", root);
  if (focusable.length) focusable[0].focus();
  root.onkeydown = (e) => {
    if (e.key === "Escape" && opts.dismissible !== false) closeModal();
    if (e.key === "Tab" && focusable.length) {
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  return root.querySelector(".modal");
}
function closeModal() {
  const root = $("#modal-root");
  if (!root || !root.firstElementChild) return;
  root.firstElementChild.classList.remove("show");
  setTimeout(() => { root.innerHTML = ""; if (_lastFocus && _lastFocus.focus) _lastFocus.focus(); processModalQueue(); }, 180);
}
const _modalQueue = [];
function queueModal(fn) {
  _modalQueue.push(fn);
  if (_modalQueue.length === 1 && !($("#modal-root") && $("#modal-root").firstElementChild)) processModalQueue();
}
function processModalQueue() {
  const root = $("#modal-root");
  if (root && root.firstElementChild) return;
  const fn = _modalQueue.shift();
  if (fn) fn();
}

function confirmDialog(title, text, okLabel, onOk) {
  openModal(`<div class="modal-body center">
      <div class="modal-emoji" aria-hidden="true">⚠️</div>
      <h2 id="modal-title">${title}</h2><p>${text}</p>
      <div class="btn-row center"><button class="btn btn-ghost" data-modal-close>Batal</button>
      <button class="btn btn-danger" id="confirm-ok">${okLabel}</button></div></div>`);
  $("#confirm-ok").addEventListener("click", () => { closeModal(); onOk(); });
}

/* ---------------- Confetti (ringan) ---------------- */
function confetti() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = h(`<div class="confetti" aria-hidden="true"></div>`);
  const colors = ["#22c55e", "#facc15", "#3b82f6", "#f97316", "#a855f7"];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.4 + "s";
    s.style.animationDuration = 1.2 + Math.random() * 0.9 + "s";
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 2600);
}

/* ---------------- Event: XP, level up, achievement ---------------- */
window.addEventListener("pq:xp", (e) => {
  const { amount, before, after } = e.detail;
  const chip = $("#xp-chip");
  if (chip) {
    const f = h(`<span class="xp-float" aria-hidden="true">+${amount} XP</span>`);
    chip.appendChild(f);
    setTimeout(() => f.remove(), 1400);
    chip.classList.add("pulse");
    setTimeout(() => chip.classList.remove("pulse"), 700);
  }
  animateNumber("#xp-num", before.xp, after.xp);
  setTimeout(refreshStats, 900);
  toast(`<b>+${amount} XP</b> ✨ ${escapeHtml(e.detail.reason || "")}`, "xp");
});
window.addEventListener("pq:levelup", (e) => {
  const info = e.detail;
  queueModal(() => {
    confetti();
    openModal(`<div class="modal-body center levelup">
      <div class="modal-emoji bounce" aria-hidden="true">🎉</div>
      <p class="eyebrow">LEVEL UP!</p>
      <h2 id="modal-title">Kamu sekarang Level ${info.level}</h2>
      <p class="big-title">${info.title}</p>
      ${xpBar(info)}
      <button class="btn btn-primary btn-lg" data-modal-close>Mantap! Lanjut 🚀</button></div>`);
  });
});
window.addEventListener("pq:achievement", (e) => {
  const a = e.detail;
  toast(`<span class="toast-badge" aria-hidden="true">${a.icon}</span><span><b>Achievement terbuka!</b><br>${escapeHtml(a.title)}</span>`, "achv", 4200);
});
window.addEventListener("pq:streak", (e) => {
  const s = e.detail.streak;
  if (s > 1) toast(`🔥 <b>${s} Day Streak!</b> Konsisten itu keren.`, "streak");
});

function animateNumber(sel, from, to) {
  const el = $(sel);
  if (!el) return;
  const start = performance.now(), dur = 800;
  const step = (t) => {
    const k = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(from + (to - from) * k);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------------- Syntax highlighting (Python) ---------------- */
const PY_KW = new Set(["False", "None", "True", "and", "as", "break", "class", "continue", "def", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "not", "or", "pass", "return", "try", "while", "with"]);
const PY_BUILTIN = new Set(["print", "input", "len", "int", "float", "str", "bool", "type", "range", "abs", "round", "min", "max", "sum", "list", "tuple", "dict", "set", "sorted", "enumerate", "zip"]);
function highlightPython(code) {
  const re = /(#[^\n]*)|([fFrR]?"(?:[^"\\\n]|\\.)*"?|[fFrR]?'(?:[^'\\\n]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d])/g;
  let out = "", m;
  while ((m = re.exec(code))) {
    const [tok, com, str, num, name, ws] = m;
    if (com) out += `<span class="tk-com">${escapeHtml(com)}</span>`;
    else if (str) out += `<span class="tk-str">${escapeHtml(str)}</span>`;
    else if (num) out += `<span class="tk-num">${num}</span>`;
    else if (name) {
      if (PY_KW.has(name)) out += `<span class="tk-kw">${name}</span>`;
      else if (PY_BUILTIN.has(name)) out += `<span class="tk-fn">${name}</span>`;
      else if (code[re.lastIndex] === "(") out += `<span class="tk-call">${name}</span>`;
      else out += escapeHtml(name);
    } else if (ws) out += ws;
    else out += `<span class="tk-op">${escapeHtml(tok)}</span>`;
  }
  return out;
}
function codeBlock(code, opts) {
  opts = opts || {};
  return `<div class="codeblock">${opts.label ? `<div class="codeblock-label">${opts.label}</div>` : ""}<pre><code>${highlightPython(code)}</code></pre></div>`;
}

/* ---------------- Code editor ---------------- */
/* Pasangan karakter yang ditutup otomatis: buka kurung & tanda petik. */
const EDITOR_AUTO_CLOSE_PAIRS = { "(": ")", "[": "]", "{": "}", "'": "'", '"': '"' };
const EDITOR_CLOSE_CHARS = new Set(Object.values(EDITOR_AUTO_CLOSE_PAIRS));
const EDITOR_QUOTE_CHARS = new Set(["'", '"']);

/* Cari tahu apakah posisi kursor sedang berada di dalam string Python.
   Dipakai supaya petik untuk menulis isi teks (mis. "aku suka 'kucing'")
   tidak memunculkan pasangan petik baru di tengah string.
   Mengembalikan "" kalau kursor ada di luar string. */
function editorQuoteContext(code, pos) {
  let quote = "";
  for (let i = 0; i < pos && i < code.length; ) {
    const c = code[i];
    if (!quote) {
      if (c === "#") { const nl = code.indexOf("\n", i); i = nl === -1 ? code.length : nl; continue; }
      if (c === '"' || c === "'") {
        const triple = code.startsWith(c + c + c, i);
        quote = triple ? c + c + c : c;
        i += quote.length;
        continue;
      }
      i++;
      continue;
    }
    if (c === "\\") { i += 2; continue; }
    if (quote.length === 1 && c === "\n") { quote = ""; i++; continue; } // string satu baris belum ditutup → anggap selesai
    if (code.startsWith(quote, i)) { quote = ""; i += quote.length; continue; }
    i++;
  }
  return quote;
}

function createEditor(container, opts) {
  opts = opts || {};
  const id = "ed-" + Math.random().toString(36).slice(2, 8);
  const editorTips = opts.autoClosePairs
    ? `Tips: tanda kurung & petik otomatis berpasangan · <kbd>Tab</kbd> = 4 spasi · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> = Run · <kbd>Esc</kbd> lalu <kbd>Tab</kbd> = keluar editor`
    : `Tips: <kbd>Tab</kbd> = 4 spasi · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> = Run · <kbd>Esc</kbd> lalu <kbd>Tab</kbd> = keluar editor`;
  container.innerHTML = `
    <div class="editor">
      <div class="editor-head"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="editor-file">main.py</span>
        <button class="mini-btn" data-act="reset" type="button" title="Kembalikan kode awal">${icon("reset")} Reset</button></div>
      <div class="editor-body">
        <div class="editor-gutter" aria-hidden="true"></div>
        <div class="editor-area">
          <pre class="editor-hl" aria-hidden="true"><code></code></pre>
          <textarea id="${id}" class="editor-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="${escapeHtml(opts.label || "Editor kode Python")}" aria-describedby="${id}-help"></textarea>
        </div>
      </div>
      <p class="editor-help" id="${id}-help">${editorTips}</p>
    </div>`;
  const ta = container.querySelector("textarea");
  const hl = container.querySelector(".editor-hl code");
  const pre = container.querySelector(".editor-hl");
  const gutter = container.querySelector(".editor-gutter");
  let escaped = false;

  function sync() {
    hl.innerHTML = highlightPython(ta.value) + "\n";
    const n = ta.value.split("\n").length;
    gutter.innerHTML = Array.from({ length: n }, (_, i) => `<span>${i + 1}</span>`).join("");
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
    gutter.scrollTop = ta.scrollTop;
  }
  function afterEdit() {
    sync();
    if (opts.onChange) opts.onChange(ta.value);
  }
  function insert(text) {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.setRangeText(text, s, e, "end");
    afterEdit();
  }
  ta.addEventListener("input", () => { sync(); if (opts.onChange) opts.onChange(ta.value); });
  ta.addEventListener("scroll", sync);
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { escaped = true; return; }
    if (e.key === "Tab" && !escaped) {
      e.preventDefault();
      if (e.shiftKey) {
        const s = ta.selectionStart;
        const lineStart = ta.value.lastIndexOf("\n", s - 1) + 1;
        const m = /^ {1,4}/.exec(ta.value.slice(lineStart));
        if (m) { ta.setRangeText("", lineStart, lineStart + m[0].length, "end"); sync(); }
      } else insert("    ");
      return;
    }
    escaped = false;
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (opts.onRun) opts.onRun(); return; }
    const isAltGraph = e.getModifierState && e.getModifierState("AltGraph");
    const hasTextShortcut = e.metaKey || (!isAltGraph && (e.ctrlKey || e.altKey));
    if (opts.autoClosePairs && !hasTextShortcut && !e.isComposing) {
      const s = ta.selectionStart, end = ta.selectionEnd;
      const value = ta.value;
      // Penutup yang diketik sama dengan karakter di depan kursor → lompat saja, jangan dobel.
      if (s === end && EDITOR_CLOSE_CHARS.has(e.key) && value[s] === e.key) {
        e.preventDefault();
        ta.setSelectionRange(s + 1, s + 1);
        return;
      }
      // Backspace di tengah pasangan kosong (mis. "()") → hapus dua-duanya.
      if (e.key === "Backspace" && s === end && s > 0 && EDITOR_AUTO_CLOSE_PAIRS[value[s - 1]] === value[s]) {
        e.preventDefault();
        ta.setRangeText("", s - 1, s + 1, "end");
        afterEdit();
        return;
      }
      const closer = EDITOR_AUTO_CLOSE_PAIRS[e.key];
      if (closer) {
        // Petik di dalam string = sedang menulis isi teks, biarkan jadi karakter biasa.
        if (EDITOR_QUOTE_CHARS.has(e.key) && editorQuoteContext(value, s)) return;
        e.preventDefault();
        const selected = value.slice(s, end);
        ta.setRangeText(e.key + selected + closer, s, end, "end");
        ta.setSelectionRange(s + 1, s + 1 + selected.length);
        afterEdit();
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const s = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf("\n", s - 1) + 1;
      const line = ta.value.slice(lineStart, s);
      let indent = /^ */.exec(line)[0];
      if (/:\s*(#.*)?$/.test(line)) indent += "    ";
      insert("\n" + indent);
    }
  });
  container.querySelector('[data-act="reset"]').addEventListener("click", () => {
    ta.value = opts.code || "";
    sync();
    toast("Kode dikembalikan ke awal ↺", "info", 1800);
  });
  ta.value = opts.code || "";
  sync();
  return {
    el: ta,
    getCode: () => ta.value,
    setCode: (c) => { ta.value = c; sync(); },
    focus: () => ta.focus(),
  };
}

/* ---------------- Panel run (input + output) ---------------- */
function createRunPanel(container, opts) {
  opts = opts || {};
  container.innerHTML = `
    <div class="run-panel">
      <div class="run-actions">
        <button class="btn btn-run" data-act="run" type="button">${icon("play")} Run Code</button>
        ${opts.checkLabel ? `<button class="btn btn-primary" data-act="check" type="button">${opts.checkLabel}</button>` : ""}
        <span class="engine-chip" aria-live="polite"></span>
      </div>
      <details class="input-box" ${opts.inputs && opts.inputs.length ? "open" : ""}>
        <summary>Input Program <span class="muted small">(jawaban untuk input(), satu baris = satu jawaban)</span></summary>
        <textarea class="input-area" rows="3" spellcheck="false" aria-label="Input program, satu baris satu jawaban">${escapeHtml((opts.inputs || []).join("\n"))}</textarea>
      </details>
      <div class="output-box" aria-live="polite">
        <div class="output-head"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>Output</div>
        <pre class="output" tabindex="0"><span class="muted">Tekan Run Code untuk menjalankan kodemu.</span></pre>
      </div>
      <div class="feedback" aria-live="polite"></div>
    </div>`;
  const engineChip = container.querySelector(".engine-chip");
  const updateEngine = (s) => {
    engineChip.innerHTML = s === "ready" ? "<i class=\"dot dot-ok\"></i> Python asli (Pyodide)" : s === "loading" ? '<span class="spinner" aria-hidden="true"></span> Mini Python · Python asli sedang dimuat…' : "<i class=\"dot\"></i> Mini Python (offline)";
    engineChip.className = "engine-chip " + (s === "ready" ? "ok" : "");
  };
  updateEngine(PyRunner.getStatus());
  PyRunner.onStatus(updateEngine);
  const outEl = container.querySelector(".output");
  const fbEl = container.querySelector(".feedback");
  const inputEl = container.querySelector(".input-area");
  return {
    runBtn: container.querySelector('[data-act="run"]'),
    checkBtn: container.querySelector('[data-act="check"]'),
    getInputs: () => inputEl.value.split("\n").filter((x, i, arr) => !(i === arr.length - 1 && x === "")),
    setInputs: (arr) => { inputEl.value = arr.join("\n"); },
    showRunning: () => { outEl.innerHTML = '<span class="muted"><span class="spinner" aria-hidden="true"></span> Menjalankan…</span>'; },
    showResult: (res) => {
      let html = res.output ? escapeHtml(res.output) : res.error ? "" : '<span class="muted">(tidak ada output — sudah pakai print()?)</span>';
      if (res.error) html += `<span class="out-error">${escapeHtml(res.error.type)}${res.error.line ? ` (baris ${res.error.line})` : ""}: ${escapeHtml(res.error.msg)}</span>`;
      outEl.innerHTML = html;
    },
    feedback: (html, type) => { fbEl.innerHTML = html ? `<div class="fb fb-${type || "info"}">${html}</div>` : ""; },
  };
}

/* Jalankan kode + catat statistik */
async function runCode(code, inputs) {
  const res = await PyRunner.run(code, inputs);
  if (!res.error) recordCodeRun();
  return res;
}

function errorFeedbackHtml(err) {
  const ex = explainError(err);
  return `<div class="fb-title">❌ Belum benar — ada error</div><p><code>${escapeHtml(ex.title)}</code></p><p>${ex.text}</p>`;
}

/* ---------------- Pengecek challenge ---------------- */
function stripComments(code) {
  return code.split("\n").map((line) => {
    let q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'") q = c;
      else if (c === "#") return line.slice(0, i);
    }
    return line;
  }).join("\n");
}
const asRule = (r, fallback) => (Array.isArray(r) ? { re: r[0], msg: r[1] } : { re: r, msg: fallback });

async function evaluateChallenge(ch, code, inputsOverride) {
  const clean = stripComments(code);
  const exp = ch.expect || {};
  let lastRes = null;
  if (!clean.trim()) return { ok: false, message: "Editor masih kosong. Yuk tulis kodenya dulu ✍️", res: { output: "", error: null } };

  if (ch.tests && ch.tests.length) {
    for (const t of ch.tests) {
      const res = await runCode(code, t.inputs || []);
      if (!lastRes) lastRes = res;
      if (res.error) return { ok: false, error: res.error, res, testInputs: t.inputs };
      const rule = asRule(t.output, "Output belum sesuai.");
      if (!rule.re.test(res.output)) return { ok: false, message: `${rule.msg}<br><small class="muted">Dites dengan input: <code>${escapeHtml((t.inputs || []).join(", "))}</code></small>`, res, testInputs: t.inputs };
    }
  } else {
    lastRes = await runCode(code, inputsOverride || ch.inputs || []);
    if (lastRes.error) return { ok: false, error: lastRes.error, res: lastRes };
  }
  const out = lastRes.output;
  for (const r of exp.output || []) { const rule = asRule(r, "Output belum sesuai."); if (!rule.re.test(out)) return { ok: false, message: rule.msg, res: lastRes }; }
  for (const r of exp.notOutput || []) { const rule = asRule(r, "Ada output yang tidak seharusnya muncul."); if (rule.re.test(out)) return { ok: false, message: rule.msg, res: lastRes }; }
  for (const r of exp.code || []) { const rule = asRule(r, "Kodenya belum sesuai instruksi."); if (!rule.re.test(clean)) return { ok: false, message: rule.msg, res: lastRes }; }
  if (ch.check) {
    const msg = ch.check(code, out);
    if (msg) return { ok: false, message: msg, res: lastRes };
  }
  return { ok: true, res: lastRes };
}

/* Hint bertahap: kembalikan HTML hint ke-n */
function hintHtml(hints, n) {
  const labels = ["💡 Petunjuk kecil", "💡 Petunjuk lebih jelas", "💡 Hampir jawaban"];
  return hints.slice(0, n).map((t, i) => `<div class="hint hint-${i + 1}"><b>${labels[i] || "💡 Hint"}</b><p>${t}</p></div>`).join("");
}

/* ---------------- Error handling global ---------------- */
function showFatal(target) {
  const el = target || document.getElementById("page") || document.body;
  el.innerHTML = `<div class="fatal card center">
    <div class="modal-emoji" aria-hidden="true">🛠️</div>
    <h2>Oops! Ada sedikit masalah.</h2>
    <p>Tenang, progress kamu tetap aman.</p>
    <button class="btn btn-primary" onclick="location.reload()">🔄 Refresh</button>
    <a class="btn btn-ghost" href="dashboard.html">Ke Dashboard</a></div>`;
}
let _errBannerShown = false;
function showErrorBanner() {
  if (_errBannerShown) return;
  _errBannerShown = true;
  const b = h(`<div class="error-banner" role="alert">⚠️ <span><b>Oops! Ada sedikit masalah.</b> Tenang, progress kamu tetap aman.</span>
    <button class="btn btn-sm btn-primary" onclick="location.reload()">Refresh</button>
    <button class="btn btn-sm btn-ghost" aria-label="Tutup">✕</button></div>`);
  b.querySelector(".btn-ghost").addEventListener("click", () => { b.remove(); _errBannerShown = false; });
  document.body.appendChild(b);
}
window.addEventListener("error", (e) => {
  if (e && e.filename && !/python-quest|\/js\//.test(e.filename) && !/^blob:|^$/.test(e.filename)) return;
  console.error(e.error || e.message);
  const page = document.getElementById("page");
  if (page && !page.children.length) showFatal(page);
  else showErrorBanner();
});
window.addEventListener("unhandledrejection", (e) => { console.error(e.reason); showErrorBanner(); });
