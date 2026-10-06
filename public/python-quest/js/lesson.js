/* =========================================================
   PYTHON QUEST — lesson.js
   Daftar lesson + pemutar lesson bertahap (7 langkah).
   ========================================================= */

const LESSON_STEPS = [
  { key: "story", icon: "📜", label: "Cerita" },
  { key: "concept", icon: "🧠", label: "Konsep" },
  { key: "example", icon: "👀", label: "Contoh" },
  { key: "breakdown", icon: "🔬", label: "Bedah Kode" },
  { key: "try", icon: "🧪", label: "Coba Sendiri" },
  { key: "challenge", icon: "⚔️", label: "Challenge" },
  { key: "reward", icon: "🎁", label: "Reward" },
];

function renderLessons() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (id && getLesson(id)) return renderLessonPlayer(getLesson(id));
  renderLessonList();
}

function renderLessonList() {
  const p = loadProgress();
  $("#page").innerHTML = `
    <div class="page-head">
      <h1 class="h1">Lessons</h1>
      <p class="muted">Semua materi dari nol sampai bisa membuat mini game. Pilih quest yang sudah terbuka.</p>
    </div>
    ${WORLDS.map((w) => {
      const wp = worldProgress(w.id, p);
      return `<section class="card lesson-group">
        <div class="wp-head"><h2 class="h2">${w.icon} World ${w.id} — ${w.name}</h2><span class="tag">${wp.done}/${wp.total} selesai</span></div>
        <div class="lesson-list">
          ${lessonsOfWorld(w.id).map((l) => {
            const st = lessonStatus(l, p);
            return `<a class="lesson-item ${st.key}" href="${st.key === "locked" ? "#" : lessonUrl(l)}" data-locked="${st.key === "locked"}" aria-label="${questLabel(l)} ${escapeHtml(l.title)}, ${st.text}">
              <span class="lesson-icon" aria-hidden="true">${st.key === "locked" ? "🔒" : l.icon}</span>
              <span class="grow"><span class="lesson-num">${questLabel(l)}</span><span class="lesson-title">${l.title}</span><span class="muted small">${l.topic}</span></span>
              <span class="lesson-meta"><span class="tag ${st.key === "done" ? "tag-ok" : ""}">${st.icon} ${st.text}</span><span class="tag tag-xp">+${XP.lesson} XP</span></span>
            </a>`;
          }).join("")}
        </div>
      </section>`;
    }).join("")}`;
  $$(".lesson-item[data-locked='true']").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    toast("🔒 Selesaikan quest sebelumnya dulu ya! (Atau aktifkan Mode Jelajah Bebas di Profile)", "info", 4000);
  }));
}

function renderLessonPlayer(lesson) {
  const p = loadProgress();
  const world = getWorld(lesson.world);
  if (!isLessonUnlocked(lesson, p)) {
    const nx = nextLesson(p);
    $("#page").innerHTML = `<div class="card center empty-state">
      <div class="empty-emoji" aria-hidden="true">🔒</div>
      <h1 class="h2">Quest ini masih terkunci</h1>
      <p class="muted">Selesaikan quest sebelumnya dulu supaya materinya nyambung. Pelan-pelan saja!</p>
      <div class="btn-row center">${nx ? `<a class="btn btn-primary" href="${lessonUrl(nx)}">Ke ${questLabel(nx)}</a>` : ""}<a class="btn btn-ghost" href="roadmap.html">🗺️ World Map</a></div></div>`;
    return;
  }
  const state = {
    step: 0,
    maxStep: p.completedLessons.includes(lesson.id) ? LESSON_STEPS.length - 1 : 0,
    wrong: 0,
    hintsShown: 0,
    gained: 0,
    perfect: false,
    alreadyDone: p.completedLessons.includes(lesson.id),
  };
  const idx = LESSONS.indexOf(lesson);
  const nextL = LESSONS[idx + 1];

  $("#page").innerHTML = `
    <div class="lesson-head">
      <a class="back-link" href="roadmap.html">${icon("arrowLeft")} World Map</a>
      <div class="lesson-banner" style="--wc:${world.color}">
        <div class="lesson-big-icon" aria-hidden="true">${lesson.icon}</div>
        <div class="grow">
          <p class="eyebrow">${questLabel(lesson)} · ${world.name}</p>
          <h1 class="h1">${lesson.title}</h1>
          <div class="tag-row"><span class="tag">${icon("layers")} ${lesson.topic}</span><span class="tag">${icon("clock")} ± 5 menit</span><span class="tag tag-xp">${icon("star")} +${XP.lesson} XP</span>${state.alreadyDone ? `<span class="tag tag-ok">${icon("check")} Sudah selesai</span>` : ""}</div>
        </div>
      </div>
      <nav class="stepper" aria-label="Langkah lesson"></nav>
    </div>
    <div id="step-body" class="step-body"></div>
    <div class="step-nav">
      <button class="btn btn-ghost" id="prev-step">${icon("arrowLeft")} Kembali</button>
      <span class="step-count" id="step-count"></span>
      <button class="btn btn-primary" id="next-step">Lanjut</button>
    </div>`;

  const stepper = $(".stepper");
  const body = $("#step-body");
  const prevBtn = $("#prev-step");
  const nextBtn = $("#next-step");

  function drawStepper() {
    stepper.innerHTML = LESSON_STEPS.map((s, i) => {
      const reachable = i <= state.maxStep;
      const isDone = i !== state.step && (i < state.maxStep || state.alreadyDone);
      const cls = i === state.step ? "current" : isDone ? "done" : "";
      return `<button class="step ${cls}" data-i="${i}" ${reachable ? "" : "disabled"} aria-current="${i === state.step ? "step" : "false"}" aria-label="Langkah ${i + 1}: ${s.label}${reachable ? "" : " (terkunci)"}">
        <span class="step-dot" aria-hidden="true">${isDone ? icon("check") : i + 1}</span><span class="step-label">${s.label}</span></button>`;
    }).join("");
    $$(".step", stepper).forEach((b) => b.addEventListener("click", () => go(+b.dataset.i)));
    const sc = $("#step-count");
    if (sc) sc.textContent = `Langkah ${state.step + 1} dari ${LESSON_STEPS.length}`;
  }

  function go(i) {
    state.step = Math.max(0, Math.min(i, state.maxStep));
    drawStepper();
    renderStep();
    const top = $(".lesson-head");
    if (top && window.scrollY > top.offsetTop + 50) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function unlockNext() {
    if (state.maxStep < state.step + 1) state.maxStep = state.step + 1;
  }

  function renderStep() {
    const key = LESSON_STEPS[state.step].key;
    prevBtn.style.visibility = state.step === 0 ? "hidden" : "visible";
    nextBtn.style.display = "";
    nextBtn.disabled = false;
    nextBtn.innerHTML = `Lanjut ${icon("arrowRight")}`;

    if (key === "story") {
      body.innerHTML = `<div class="card story">
        <div class="npc"><span class="npc-avatar" aria-hidden="true">${world.icon}</span><span class="npc-name">Narator</span></div>
        <div class="bubble"><p>${lesson.story}</p></div></div>`;
      unlockNext();
    }
    if (key === "concept") {
      body.innerHTML = `<div class="concept-list">
        ${lesson.concept.map((c, i) => `<div class="card concept"><span class="concept-num" aria-hidden="true">${i + 1}</span><p>${c}</p></div>`).join("")}
        ${lesson.analogy ? `<div class="card analogy"><b>Analogi sehari-hari</b><p>${lesson.analogy}</p></div>` : ""}</div>`;
      unlockNext();
    }
    if (key === "example") {
      body.innerHTML = `<div class="card">
        <h2 class="h3">Contoh kode</h2>
        ${codeBlock(lesson.example)}
        ${lesson.inputs && lesson.inputs.length ? `<p class="muted small">Contoh jawaban disarankan: <code>${escapeHtml(lesson.inputs.join(", "))}</code> — bisa kamu ubah di popup.</p>` : ""}
        <button class="btn btn-run" id="see-output">▶ Lihat hasilnya</button>
        <pre class="output hidden" id="ex-output" aria-live="polite"></pre></div>`;
      $("#see-output").addEventListener("click", async () => {
        const out = $("#ex-output");
        out.classList.remove("hidden");
        out.innerHTML = '<span class="spinner" aria-hidden="true"></span> Menjalankan…';
        const res = await runCodeWithPrompts(lesson.example, lesson.inputs || []);
        out.innerHTML = escapeHtml(res.output) + (res.cancelled ? '<span class="muted">Input dibatalkan.</span>' : res.error ? `<span class="out-error">${escapeHtml(res.error.type)}: ${escapeHtml(res.error.msg)}</span>` : "");
      });
      unlockNext();
    }
    if (key === "breakdown") {
      body.innerHTML = `<div class="card">
        <h2 class="h3">Bedah kode baris demi baris</h2>
        ${codeBlock(lesson.example)}
        <ul class="breakdown">${lesson.breakdown.map(([c, t]) => `<li><code class="bd-code">${escapeHtml(c)}</code><span class="bd-arrow" aria-hidden="true">→</span><span>${t}</span></li>`).join("")}</ul>
        ${lesson.flow ? `<h3 class="h3">Alur program</h3><ol class="flow">${lesson.flow.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ol>` : ""}
      </div>`;
      unlockNext();
    }
    if (key === "try") {
      body.innerHTML = `<div class="split">
        <div class="card split-left"><h2 class="h3">Coba sendiri</h2><p>${lesson.tryNote || "Ubah kodenya sesukamu lalu tekan RUN. Tidak ada yang bisa rusak!"}</p>
          <div class="tip">💡 Eksperimen adalah cara belajar paling cepat. Salah itu normal!</div></div>
        <div class="split-right"><div id="try-editor"></div><div id="try-run"></div></div></div>`;
      const ed = createEditor($("#try-editor"), { code: lesson.example, label: "Editor coba sendiri", autoClosePairs: true, onRun: () => run() });
      const panel = createRunPanel($("#try-run"), { inputs: lesson.inputs || [] });
      async function run() {
        panel.showRunning();
        const res = await runCodeWithPrompts(ed.getCode(), panel.getInputs());
        showInteractiveRunResult(panel, res, "✨ Kode berjalan! Coba ubah sesuatu lagi, atau lanjut ke Challenge.", "ok");
      }
      panel.runBtn.addEventListener("click", run);
      unlockNext();
    }
    if (key === "challenge") renderChallenge();
    if (key === "reward") renderReward();
    if (state.step >= LESSON_STEPS.length - 2 && key === "challenge") {
      nextBtn.disabled = state.maxStep < LESSON_STEPS.length - 1;
      nextBtn.innerHTML = `Lihat Reward ${icon("arrowRight")}`;
    }
    if (key === "reward") nextBtn.style.display = "none";
  }

  function renderChallenge() {
    const ch = lesson.challenge;
    const draftKey = "pq_draft_" + lesson.id;
    const draft = localStorage.getItem(draftKey);
    body.innerHTML = `<div class="split">
      <div class="card split-left">
        <p class="eyebrow">⚔️ CHALLENGE</p>
        <h2 class="h3">Misi kamu</h2>
        <p class="task">${ch.task}</p>
        ${state.alreadyDone ? '<div class="tip">✅ Quest ini sudah selesai. Kamu boleh mengulang challenge untuk latihan (tanpa XP tambahan).</div>' : '<div class="tip">💎 Selesaikan tanpa salah untuk bonus <b>+25 XP Perfect</b>!</div>'}
        <div id="hint-area" aria-live="polite"></div>
        <button class="btn btn-ghost btn-sm" id="hint-btn">💡 Minta hint (${state.hintsShown}/3)</button>
      </div>
      <div class="split-right"><div id="ch-editor"></div><div id="ch-run"></div></div></div>`;
    const ed = createEditor($("#ch-editor"), {
      code: ch.starter,
      label: "Editor challenge",
      autoClosePairs: true,
      onRun: () => run(),
      onChange: (v) => { try { localStorage.setItem(draftKey, v); } catch (e) { /* ignore */ } },
    });
    if (draft && draft !== ch.starter) ed.setCode(draft);
    const panel = createRunPanel($("#ch-run"), { inputs: ch.inputs || (ch.tests && ch.tests[0] ? ch.tests[0].inputs : []), checkLabel: `${icon("check")} Cek Jawaban` });
    const hintArea = $("#hint-area");
    const hintBtn = $("#hint-btn");
    const drawHints = () => {
      hintArea.innerHTML = hintHtml(ch.hints, state.hintsShown);
      hintBtn.textContent = `💡 Minta hint (${state.hintsShown}/3)`;
      hintBtn.disabled = state.hintsShown >= ch.hints.length;
    };
    drawHints();
    hintBtn.addEventListener("click", () => { state.hintsShown = Math.min(ch.hints.length, state.hintsShown + 1); drawHints(); });

    panel.runBtn.addEventListener("click", run);
    panel.checkBtn.addEventListener("click", check);

    async function run() {
      panel.showRunning();
      const res = await runCodeWithPrompts(ed.getCode(), panel.getInputs());
      showInteractiveRunResult(panel, res, "Kode berjalan. Kalau sudah yakin, tekan <b>✅ Cek Jawaban</b>.", "info");
    }

    async function check() {
      panel.checkBtn.disabled = true;
      panel.showRunning();
      const r = await evaluateChallenge(ch, ed.getCode());
      panel.checkBtn.disabled = false;
      panel.showResult(r.res || { output: "" });
      if (r.ok) {
        localStorage.removeItem(draftKey);
        if (!state.alreadyDone) {
          state.perfect = state.wrong === 0;
          state.gained = completeLesson(lesson.id, state.perfect);
          state.alreadyDone = true;
        }
        panel.feedback(`<div class="fb-title">🎉 Benar!</div><p>${ch.success || "Quest selesai!"}</p>`, "ok");
        state.maxStep = LESSON_STEPS.length - 1;
        setTimeout(() => go(LESSON_STEPS.length - 1), 900);
        return;
      }
      state.wrong++;
      if (state.hintsShown < Math.min(state.wrong, ch.hints.length)) { state.hintsShown = Math.min(state.wrong, ch.hints.length); drawHints(); }
      const base = r.error ? errorFeedbackHtml(r.error) : `<div class="fb-title">❌ Belum benar</div><p>${r.message}</p>`;
      panel.feedback(`${base}<p class="muted small">Tidak apa-apa, programmer juga sering salah. Cek hint di sebelah kiri 👈</p>`, "warn");
    }
  }

  function renderReward() {
    const isFirst = lesson.id === "w1-1";
    const isFinal = lesson.id === "w7-7";
    const worldDoneNow = worldDone(loadProgress(), lesson.world) && lessonsOfWorld(lesson.world).slice(-1)[0].id === lesson.id;
    body.innerHTML = `<div class="card reward center">
      <div class="reward-emoji bounce" aria-hidden="true">${isFinal ? "👑" : "🎉"}</div>
      <p class="eyebrow">${isFirst ? "MISSION COMPLETE!" : "QUEST COMPLETE!"}</p>
      <h2 class="h1">${lesson.challenge.success || "Quest selesai!"}</h2>
      ${state.gained ? `<div class="reward-xp"><span class="xp-pop">+${XP.lesson} XP</span>${state.perfect ? `<span class="xp-pop perfect">💎 +${XP.perfect} Perfect</span>` : ""}</div>` : '<p class="muted">Kamu sudah pernah menyelesaikan quest ini. Latihan ulang tetap bagus! 💪</p>'}
      ${isFirst ? '<div class="badge-mini center-inline"><span aria-hidden="true">🚀</span><div><b>Badge: First Code</b><div class="muted small">Menjalankan kode Python pertama</div></div></div>' : ""}
      ${isFinal ? '<div class="badge-mini center-inline"><span aria-hidden="true">⚔️</span><div><b>PYTHON ADVENTURER</b><div class="muted small">Kamu menamatkan seluruh petualangan!</div></div></div>' : ""}
      ${worldDoneNow && !isFinal ? `<p class="world-clear">🏆 World ${lesson.world} — ${world.name} selesai!</p>` : ""}
      <div class="btn-row center">
        ${nextL ? `<a class="btn btn-primary btn-lg" href="${lessonUrl(nextL)}">Quest berikutnya: ${nextL.title} →</a>` : `<a class="btn btn-primary btn-lg" href="achievements.html">🏆 Lihat Achievements</a>`}
        <a class="btn btn-ghost" href="roadmap.html">🗺️ Kembali ke Map</a>
        <a class="btn btn-ghost" href="quiz.html">❓ Latihan Quiz</a>
      </div></div>`;
    if (state.gained) confetti();
  }

  prevBtn.addEventListener("click", () => go(state.step - 1));
  nextBtn.addEventListener("click", () => { unlockNext(); go(state.step + 1); });
  drawStepper();
  renderStep();
}
