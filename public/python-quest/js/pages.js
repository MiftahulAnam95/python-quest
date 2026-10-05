/* =========================================================
   PYTHON QUEST — pages.js
   Halaman: Dashboard, World Map, Achievements, Profile, Progress
   ========================================================= */

function lessonUrl(l) { return `lessons.html?id=${encodeURIComponent(l.id)}`; }
function questLabel(l) { return `Quest #${String(lessonNumber(l)).padStart(2, "0")}`; }
function lessonStatus(l, p) {
  if (p.completedLessons.includes(l.id)) return { key: "done", icon: "✅", text: "Selesai" };
  if (isLessonUnlocked(l, p)) return { key: "open", icon: "🔓", text: "Belum selesai" };
  return { key: "locked", icon: "🔒", text: "Terkunci" };
}

/* ======================= DASHBOARD ======================= */
function statCard(ic, tone, value, label) {
  return `<div class="stat card"><span class="stat-icon tone-${tone}">${icon(ic)}</span><div><div class="stat-num">${value}</div><div class="stat-label">${label}</div></div></div>`;
}
function weekStrip(p) {
  const names = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = todayStr(d), on = p.studyDays.includes(key);
    out.push(`<li class="wk-day ${on ? "on" : ""} ${i === 0 ? "today" : ""}" aria-label="${names[d.getDay()]} ${on ? "belajar" : "belum belajar"}">
      <span class="wk-dot">${on ? icon("flame") : ""}</span><span class="wk-name">${names[d.getDay()]}</span></li>`);
  }
  return `<ol class="week">${out.join("")}</ol>`;
}

function renderDashboard() {
  const p = loadProgress();
  const info = getLevelInfo(p.xp);
  const next = nextLesson(p);
  const doneCount = p.completedLessons.length;
  const isEmpty = doneCount === 0 && p.xp === 0;
  const studiedToday = p.lastStudyDate === todayStr();
  const recent = p.achievements.slice(-3).reverse().map((id) => ACHIEVEMENTS.find((a) => a.id === id)).filter(Boolean);
  const toNext = info.next ? info.target - info.xp : 0;
  const totalPct = Math.round((doneCount / LESSONS.length) * 100);

  $("#page").innerHTML = `
    <section class="player-card">
      <div class="player-main">
        ${levelRing(p, info, "lg")}
        <div class="grow">
          <p class="player-eyebrow">Halo, ${escapeHtml(p.name)} 👋</p>
          <h1 class="player-title">Level ${info.level} · ${info.title}</h1>
          ${xpBar(info)}
          <p class="player-sub">${info.next ? `<b>${toNext} XP</b> lagi menuju <b>${info.next.title}</b>` : "Kamu sudah mencapai level tertinggi!"}</p>
        </div>
      </div>
      ${next ? `<a class="btn btn-primary btn-lg player-cta" href="${lessonUrl(next)}">${isEmpty ? "Mulai Quest Pertama" : "Lanjutkan Quest"} ${icon("arrowRight")}</a>` : ""}
    </section>

    <section class="stats-grid" aria-label="Statistik">
      ${statCard("flame", "orange", `${p.streak} hari`, "Streak")}
      ${statCard("star", "amber", p.xp, "Total XP")}
      ${statCard("trophy", "violet", p.achievements.length, "Badge")}
      ${statCard("checkCircle", "green", `${doneCount}<small>/${LESSONS.length}</small>`, "Quest selesai")}
    </section>

    ${isEmpty ? `
    <section class="card empty-state">
      <div class="empty-emoji" aria-hidden="true">🌱</div>
      <div class="grow"><h2 class="h2">Petualanganmu baru saja dimulai.</h2>
      <p class="muted">Yuk selesaikan quest pertama! Tidak perlu pengalaman coding sama sekali — cukup 5 menit.</p></div>
      <a class="btn btn-primary" href="${lessonUrl(LESSONS[0])}">Mulai Quest Pertama ${icon("arrowRight")}</a>
    </section>` : ""}

    <div class="grid-dash">
      <section class="card">
        <div class="card-head"><h2 class="h2">Quest Berikutnya</h2>${next ? `<span class="tag">${getWorld(next.world).name}</span>` : ""}</div>
        ${next ? `
          <a class="quest-card" href="${lessonUrl(next)}">
            <div class="quest-icon" aria-hidden="true">${next.icon}</div>
            <div class="grow">
              <p class="eyebrow">${questLabel(next)}</p>
              <h3 class="h3">${next.title}</h3>
              <p class="muted small">${next.topic}</p>
              <div class="tag-row"><span class="tag">${icon("clock")} Belum selesai</span><span class="tag tag-xp">${icon("star")} +${XP.lesson} XP</span></div>
            </div>
            <span class="quest-go" aria-hidden="true">${icon("play")}</span>
          </a>
        ` : `
          <div class="center"><div class="empty-emoji" aria-hidden="true">👑</div>
          <h3 class="h3">Semua quest selesai!</h3><p class="muted">Kamu luar biasa. Asah terus skill-mu di Playground & Mini Games.</p>
          <a class="btn btn-primary" href="playground.html">Buka Playground</a></div>`}
        <div class="divider"></div>
        <div class="card-head"><h3 class="h3">Progress keseluruhan</h3><b>${totalPct}%</b></div>
        ${progressBar(totalPct, "", "Total progress")}
        <p class="muted small mt-s">Kamu sudah menyelesaikan <b>${doneCount}</b> dari <b>${LESSONS.length}</b> quest.</p>
      </section>

      <section class="card">
        <div class="card-head"><h2 class="h2">Streak Minggu Ini</h2><span class="tag tag-orange">${icon("flame")} ${p.streak} hari</span></div>
        ${weekStrip(p)}
        <p class="muted small">${studiedToday ? "Kamu sudah belajar hari ini. Mantap! 🔥" : "Selesaikan 1 aktivitas hari ini untuk menjaga streak — santai saja, tidak wajib."}</p>
        <div class="divider"></div>
        <h3 class="h3">Latihan cepat</h3>
        <div class="quick-list">
          <a class="quick" href="quiz.html"><span class="quick-ic tone-blue">${icon("quiz")}</span><span class="grow"><b>Quiz</b><span class="muted small">+${XP.quiz} XP / jawaban</span></span>${icon("arrowRight", "quick-arrow")}</a>
          <a class="quick" href="games.html"><span class="quick-ic tone-violet">${icon("game")}</span><span class="grow"><b>Mini Games</b><span class="muted small">+${XP.game} XP / game</span></span>${icon("arrowRight", "quick-arrow")}</a>
          <a class="quick" href="playground.html"><span class="quick-ic tone-green">${icon("terminal")}</span><span class="grow"><b>Playground</b><span class="muted small">+${XP.challenge} XP / challenge</span></span>${icon("arrowRight", "quick-arrow")}</a>
        </div>
      </section>
    </div>

    <section class="card">
      <div class="card-head"><h2 class="h2">Progress World</h2><a class="link-more" href="roadmap.html">Lihat World Map ${icon("arrowRight")}</a></div>
      <ul class="world-rows">
        ${WORLDS.map((w) => {
          const wp = worldProgress(w.id, p);
          return `<li class="world-row"><span class="world-row-ic" style="--wc:${w.color}" aria-hidden="true">${w.icon}</span>
            <div class="grow"><div class="wp-head"><span><span class="muted small">World ${w.id}</span> <b>${w.name}</b></span><span class="muted small">${wp.done}/${wp.total} · <b>${wp.pct}%</b></span></div>
            ${progressBar(wp.pct, w.color, `Progress World ${w.id}`)}</div></li>`;
        }).join("")}
      </ul>
    </section>

    ${recent.length ? `<section class="card"><div class="card-head"><h2 class="h2">Achievement Terbaru</h2><a class="link-more" href="achievements.html">Semua ${icon("arrowRight")}</a></div><div class="badge-row">
      ${recent.map((a) => `<div class="badge-mini"><span class="badge-ic" aria-hidden="true">${a.icon}</span><div><b>${a.title}</b><div class="muted small">${a.desc}</div></div></div>`).join("")}
    </div></section>` : ""}
  `;
}

/* ======================= WORLD MAP ======================= */
function renderRoadmap() {
  const p = loadProgress();
  $("#page").innerHTML = `
    <div class="page-head">
      <h1 class="h1">World Map</h1>
      <p class="muted">Selesaikan quest berurutan untuk membuka quest berikutnya. Setiap world adalah satu topik besar.</p>
      <div class="legend"><span>✅ Selesai</span><span>🔓 Terbuka</span><span>🔒 Terkunci</span></div>
    </div>
    ${WORLDS.map((w) => {
      const wp = worldProgress(w.id, p);
      const ls = lessonsOfWorld(w.id);
      return `<section class="world card" style="--wc:${w.color}">
        <header class="world-head">
          <div class="world-emoji" aria-hidden="true">${w.icon}</div>
          <div class="grow"><p class="eyebrow">WORLD ${w.id}</p><h2 class="h2">${w.name}</h2><p class="muted small">${w.desc}</p></div>
          <div class="world-pct"><b>${wp.done}/${wp.total}</b><span class="muted small">quest</span></div>
        </header>
        ${progressBar(wp.pct, w.color, `Progress World ${w.id}`)}
        <ol class="path">
          ${ls.map((l, i) => {
            const st = lessonStatus(l, p);
            const isFinal = l.id === "w7-7";
            return `<li class="path-item ${i % 2 ? "right" : "left"}">
              <a href="${st.key === "locked" ? "#" : lessonUrl(l)}" class="node node-${st.key} ${isFinal ? "node-final" : ""}" data-locked="${st.key === "locked"}"
                 aria-label="${questLabel(l)}: ${escapeHtml(l.title)} — ${st.text}">
                <span class="node-circle" aria-hidden="true">${st.key === "locked" ? "🔒" : l.icon}</span>
                <span class="node-text"><span class="node-num">${questLabel(l)} ${st.icon}</span><span class="node-title">${l.title}</span><span class="node-status">${st.text}</span></span>
              </a></li>`;
          }).join("")}
        </ol>
      </section>`;
    }).join("")}`;
  $$(".node[data-locked='true']").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    toast("🔒 Quest ini masih terkunci. Selesaikan quest sebelumnya dulu ya!", "info");
  }));
}

/* ======================= ACHIEVEMENTS ======================= */
function renderAchievements() {
  const p = loadProgress();
  const progressText = {
    "bug-hunter": `${Math.min(p.bugsFixed.length, 10)}/10 bug`,
    "quiz-whiz": `${Math.min(countQuizCorrect(p), 10)}/10 benar`,
    "consistency": `streak terbaik ${p.bestStreak}/7`,
    "seven-day": `${Math.min(p.studyDays.length, 7)}/7 hari`,
    "perfectionist": `${Math.min(p.perfectLessons.length, 5)}/5`,
  };
  $("#page").innerHTML = `
    <div class="page-head">
      <h1 class="h1">Achievements</h1>
      <p class="muted">Kamu sudah membuka <b>${p.achievements.length}</b> dari <b>${ACHIEVEMENTS.length}</b> badge.</p>
      ${progressBar(Math.round((p.achievements.length / ACHIEVEMENTS.length) * 100), "#f59e0b", "Progress achievement")}
    </div>
    <div class="achv-grid">
      ${ACHIEVEMENTS.map((a) => {
        const got = p.achievements.includes(a.id);
        return `<div class="achv card ${got ? "got" : "locked"}">
          <div class="achv-icon" aria-hidden="true">${a.icon}</div>
          <h3 class="h3">${a.title}</h3>
          <p class="muted small">${a.desc}</p>
          <span class="tag ${got ? "tag-ok" : ""}">${got ? "✅ Terbuka" : "🔒 Terkunci"}${!got && progressText[a.id] ? ` · ${progressText[a.id]}` : ""}</span>
        </div>`;
      }).join("")}
    </div>`;
}

/* ======================= PROFILE ======================= */
const AVATARS = ["🧑‍💻", "👩‍💻", "👨‍💻", "🧙", "🥷", "🧝", "🦸", "🐍", "🦊", "🐱", "🐼", "🤖"];
function renderProfile() {
  const p = loadProgress();
  const info = getLevelInfo(p.xp);
  $("#page").innerHTML = `
    <section class="player-card profile-hero">
      <div class="player-main">
        ${levelRing(p, info, "lg")}
        <div class="grow">
          <p class="player-eyebrow">Python Explorer</p>
          <h1 class="player-title">${escapeHtml(p.name)}</h1>
          <p class="player-level">Level ${info.level} · ${info.title}</p>
          ${xpBar(info)}
        </div>
      </div>
    </section>
    <section class="stats-grid">
      ${statCard("star", "amber", p.xp.toLocaleString("id-ID"), "XP")}
      ${statCard("map", "green", `${p.completedLessons.length}<small>/${LESSONS.length}</small>`, "Quest")}
      ${statCard("trophy", "violet", p.achievements.length, "Achievements")}
      ${statCard("flame", "orange", `${p.streak} hari`, "Streak")}
    </section>

    <div class="grid-2">
      <section class="card">
        <h2 class="h2">Edit Profil</h2>
        <form id="profile-form" class="form">
          <label for="pname">Nama petualang</label>
          <input id="pname" class="input" maxlength="30" value="${escapeHtml(p.name)}" required>
          <fieldset class="avatar-pick"><legend>Pilih avatar</legend>
            ${AVATARS.map((a) => `<label class="avatar-opt"><input type="radio" name="avatar" value="${a}" ${a === p.avatar ? "checked" : ""}><span aria-label="avatar ${a}">${a}</span></label>`).join("")}
          </fieldset>
          <button class="btn btn-primary" type="submit">Simpan perubahan</button>
        </form>
      </section>
      <section class="card">
        <h2 class="h2">World Progress</h2>
        <ul class="world-progress-list">
          ${WORLDS.map((w) => { const wp = worldProgress(w.id, p); return `<li><div class="wp-head"><span>${w.icon} ${w.name}</span><b>${wp.done}/${wp.total}</b></div>${progressBar(wp.pct, w.color, w.name)}</li>`; }).join("")}
        </ul>
      </section>
    </div>

    <section class="card">
      <h2 class="h2">Pengaturan</h2>
      <div class="setting-row">
        <div><b>🧭 Mode Jelajah Bebas</b><p class="muted small">Buka semua quest tanpa harus berurutan. Cocok untuk mengulang materi atau yang sudah sedikit paham.</p></div>
        <label class="switch"><input type="checkbox" id="free-mode" ${p.freeMode ? "checked" : ""}><span class="slider" aria-hidden="true"></span><span class="sr-only">Mode jelajah bebas</span></label>
      </div>
      <div class="setting-row">
        <div><b>🗑️ Reset Progress</b><p class="muted small">Menghapus semua XP, quest, dan achievement dari browser ini.</p></div>
        <button class="btn btn-danger" id="reset-btn">Reset Progress</button>
      </div>
      <p class="muted small">💾 Semua progress disimpan otomatis di <code>localStorage</code> browser ini — tanpa akun, tanpa server.</p>
    </section>`;

  $("#profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#pname").value.trim() || "Python Explorer";
    const av = ($("input[name=avatar]:checked") || {}).value || p.avatar;
    updateProfile({ name, avatar: av });
    toast("✅ Profil tersimpan!", "ok");
    renderProfile();
    refreshStats();
  });
  $("#free-mode").addEventListener("change", (e) => {
    updateProfile({ freeMode: e.target.checked });
    toast(e.target.checked ? "🧭 Mode jelajah bebas aktif. Semua quest terbuka!" : "Mode jelajah bebas dimatikan.", "info");
  });
  $("#reset-btn").addEventListener("click", () => {
    confirmDialog("Reset Progress?", "Yakin ingin menghapus semua progress? XP, quest, dan achievement akan hilang dan tidak bisa dikembalikan.", "Ya, hapus semua", () => {
      resetProgress();
      Object.keys(localStorage).filter((k) => k.startsWith("pq_draft_")).forEach((k) => localStorage.removeItem(k));
      toast("Progress sudah direset. Petualangan baru dimulai! 🌱", "info");
      renderProfile();
      refreshStats();
    });
  });
}

/* ======================= PROGRESS ======================= */
function renderProgress() {
  const p = loadProgress();
  const quizTotal = QUIZZES.length;
  const quizCorrect = countQuizCorrect(p);
  const days = [];
  for (let i = 27; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(todayStr(d)); }
  const games = [["debug", "⚔️ Debugging Monster"], ["sort", "🧩 Code Sorting"], ["output", "🎯 Output Hunter"], ["varbox", "📦 Variable Box"]];

  $("#page").innerHTML = `
    <div class="page-head">
      <h1 class="h1">Progress</h1>
      <p class="muted">Kamu sudah menyelesaikan <b>${p.completedLessons.length}</b> dari <b>${LESSONS.length}</b> quest.</p>
      ${progressBar(Math.round((p.completedLessons.length / LESSONS.length) * 100), "#22c55e", "Total progress quest")}
    </div>
    <div class="grid-3">
      <section class="card"><h2 class="h3">Quiz</h2><p class="stat-num">${quizCorrect}/${quizTotal}</p><p class="muted small">soal dijawab benar</p></section>
      <section class="card"><h2 class="h3">Playground</h2><p class="stat-num">${p.playgroundDone.length}/${PLAYGROUND_CHALLENGES.length}</p><p class="muted small">challenge selesai</p></section>
      <section class="card"><h2 class="h3">Bug diperbaiki</h2><p class="stat-num">${p.bugsFixed.length}</p><p class="muted small">di Debugging Monster</p></section>
    </div>
    <section class="card">
      <h2 class="h2">Kalender Belajar (28 hari)</h2>
      <div class="calendar" role="list">
        ${days.map((d) => { const on = p.studyDays.includes(d); return `<span role="listitem" class="cal-day ${on ? "on" : ""}" title="${d}${on ? " — belajar" : ""}" aria-label="${d} ${on ? "belajar" : "tidak belajar"}">${on ? "🔥" : ""}</span>`; }).join("")}
      </div>
      <p class="muted small">Streak sekarang: <b>${p.streak} hari</b> · Streak terbaik: <b>${p.bestStreak} hari</b> · Total hari belajar: <b>${p.studyDays.length}</b></p>
    </section>
    <section class="card">
      <h2 class="h2">Mini Games</h2>
      <ul class="check-list">${games.map(([id, name]) => `<li>${p.gamesCompleted.includes(id) ? "✅" : "⬜"} ${name} <span class="muted small">${p.gamesCompleted.includes(id) ? "— selesai" : "— belum"}</span></li>`).join("")}</ul>
    </section>
    ${WORLDS.map((w) => {
      const wp = worldProgress(w.id, p);
      return `<section class="card">
        <div class="wp-head"><h2 class="h3">${w.icon} World ${w.id} — ${w.name}</h2><b>${wp.pct}%</b></div>
        ${progressBar(wp.pct, w.color, w.name)}
        <ul class="check-list">${lessonsOfWorld(w.id).map((l) => { const st = lessonStatus(l, p); return `<li>${st.icon} <a href="${st.key === "locked" ? "roadmap.html" : lessonUrl(l)}">${questLabel(l)} — ${l.title}</a> <span class="muted small">${st.text}${p.perfectLessons.includes(l.id) ? " · 💎 perfect" : ""}</span></li>`; }).join("")}</ul>
      </section>`;
    }).join("")}`;
}
