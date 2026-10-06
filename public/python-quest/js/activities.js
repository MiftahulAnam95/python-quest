/* =========================================================
   PYTHON QUEST — activities.js
   Playground, Quiz, dan 4 Mini Game.
   ========================================================= */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ======================= PLAYGROUND ======================= */
const FREE_CODE = `# 💻 Mode Bebas — tulis kode Python apa saja!\nnama = input("Siapa nama kamu? ")\nprint(f"Halo {nama}, selamat datang di Playground!")\n\nfor i in range(1, 4):\n    print("Hitungan ke-" + str(i))\n`;

function renderPlayground() {
  const p = loadProgress();
  const params = new URLSearchParams(location.search);
  let current = params.get("c") || "free";
  if (current !== "free" && !PLAYGROUND_CHALLENGES.find((c) => c.id === current)) current = "free";

  $("#page").innerHTML = `
    <div class="page-head"><h1 class="h1">Code Playground</h1>
      <p class="muted">Tulis & jalankan Python langsung di browser. Pilih challenge untuk dapat <b>+${XP.challenge} XP</b>, atau main bebas.</p></div>
    <div class="pg-tabs" role="tablist" aria-label="Pilih challenge">
      <button role="tab" class="pg-tab" data-c="free">🆓 Mode Bebas</button>
      ${PLAYGROUND_CHALLENGES.map((c) => `<button role="tab" class="pg-tab" data-c="${c.id}">${p.playgroundDone.includes(c.id) ? "✅" : c.icon} ${c.title}</button>`).join("")}
    </div>
    <div class="split">
      <div class="card split-left" id="pg-info"></div>
      <div class="split-right"><div id="pg-editor"></div><div id="pg-run"></div></div>
    </div>`;

  function load(id) {
    current = id;
    history.replaceState(null, "", id === "free" ? "playground.html" : `playground.html?c=${id}`);
    $$(".pg-tab").forEach((t) => { const on = t.dataset.c === id; t.classList.toggle("active", on); t.setAttribute("aria-selected", on); });
    const ch = PLAYGROUND_CHALLENGES.find((c) => c.id === id);
    let wrong = 0, hints = 0;
    const info = $("#pg-info");
    if (!ch) {
      info.innerHTML = `<p class="eyebrow">🆓 MODE BEBAS</p><h2 class="h3">Eksperimen sesukamu</h2>
        <p>Tidak ada benar atau salah di sini. Coba semua yang sudah kamu pelajari!</p>
        <ul class="check-list small"><li>📝 Jawab popup yang muncul setiap kali kode memanggil <code>input()</code>.</li><li>⌨️ <kbd>Ctrl</kbd>+<kbd>Enter</kbd> untuk menjalankan.</li><li>⚡ Python asli (Pyodide) dimuat otomatis. Kalau offline, Mini Python dipakai.</li></ul>`;
    } else {
      const done = loadProgress().playgroundDone.includes(ch.id);
      info.innerHTML = `<p class="eyebrow">${ch.icon} CHALLENGE ${done ? "· ✅ SELESAI" : `· +${XP.challenge} XP`}</p>
        <h2 class="h3">${ch.title}</h2><p class="task">${ch.instruction}</p>
        <div id="pg-hints" aria-live="polite"></div>
        <button class="btn btn-ghost btn-sm" id="pg-hint-btn">💡 Minta hint (0/3)</button>`;
      $("#pg-hint-btn").addEventListener("click", () => { hints = Math.min(3, hints + 1); drawHints(); });
    }
    function drawHints() {
      if (!ch) return;
      $("#pg-hints").innerHTML = hintHtml(ch.hints, hints);
      $("#pg-hint-btn").textContent = `💡 Minta hint (${hints}/3)`;
      $("#pg-hint-btn").disabled = hints >= 3;
    }
    const ed = createEditor($("#pg-editor"), {
      code: ch ? ch.starter : FREE_CODE,
      autoClosePairs: true,
      onRun: () => run(),
    });
    const panel = createRunPanel($("#pg-run"), { inputs: ch ? ch.inputs || (ch.tests ? ch.tests[0].inputs : []) : ["Miftah"], checkLabel: ch ? `${icon("check")} Cek Jawaban` : null });
    async function run() {
      panel.showRunning();
      const res = await runCodeWithPrompts(ed.getCode(), panel.getInputs());
      showInteractiveRunResult(panel, res, "", "info");
    }
    async function check() {
      panel.showRunning();
      const r = await evaluateChallenge(ch, ed.getCode(), panel.getInputs());
      panel.showResult(r.res || { output: "" });
      if (r.ok) {
        const g = completePlayground(ch.id);
        panel.feedback(`<div class="fb-title">🎉 Benar!</div><p>${g ? `<b>+${g} XP</b> — challenge selesai!` : "Kamu sudah pernah menyelesaikan ini. Tetap keren! 💪"}</p>`, "ok");
        if (g) confetti();
        const tab = $(`.pg-tab[data-c="${ch.id}"]`);
        if (tab) tab.textContent = `✅ ${ch.title}`;
        return;
      }
      wrong++;
      if (hints < Math.min(wrong, 3)) { hints = Math.min(wrong, 3); drawHints(); }
      panel.feedback(r.error ? errorFeedbackHtml(r.error) : `<div class="fb-title">❌ Belum benar</div><p>${r.message}</p>`, "warn");
    }
    panel.runBtn.addEventListener("click", run);
    if (panel.checkBtn) panel.checkBtn.addEventListener("click", check);
  }
  $$(".pg-tab").forEach((t) => t.addEventListener("click", () => load(t.dataset.c)));
  load(current);
}

/* ======================= QUIZ ======================= */
function renderQuiz() {
  const p = loadProgress();
  const params = new URLSearchParams(location.search);
  const w = parseInt(params.get("w"), 10);
  if (w && WORLDS.find((x) => x.id === w)) return runQuiz(w);
  $("#page").innerHTML = `
    <div class="page-head"><h1 class="h1">Quiz</h1>
      <p class="muted">Uji pemahamanmu! Setiap jawaban benar pertama kali = <b>+${XP.quiz} XP</b>. Salah? Tidak apa-apa, ada penjelasannya.</p></div>
    <div class="quiz-grid">
      ${WORLDS.map((wd) => {
        const qs = QUIZZES.filter((q) => q.world === wd.id);
        const correct = qs.filter((q) => p.quizAnswered[q.id] === true).length;
        const wp = worldProgress(wd.id, p);
        return `<a class="card quiz-world" href="quiz.html?w=${wd.id}" style="--wc:${wd.color}">
          <div class="world-emoji" aria-hidden="true">${wd.icon}</div>
          <div class="grow"><p class="eyebrow">WORLD ${wd.id}</p><h2 class="h3">${wd.name}</h2>
          <p class="muted small">${qs.length} soal · ${correct} benar ${wp.pct < 100 ? `· disarankan setelah World ${wd.id} selesai` : "· ✅ materi selesai"}</p>
          ${progressBar(Math.round((correct / qs.length) * 100), wd.color, `Quiz world ${wd.id}`)}</div>
          <span class="btn btn-primary btn-sm">Mulai</span></a>`;
      }).join("")}
    </div>`;
}

function runQuiz(worldId) {
  const world = getWorld(worldId);
  const qs = shuffle(QUIZZES.filter((q) => q.world === worldId));
  let i = 0, score = 0, gained = 0;
  const letters = ["A", "B", "C", "D"];

  function show() {
    const q = qs[i];
    $("#page").innerHTML = `
      <a class="back-link" href="quiz.html">← Semua quiz</a>
      <div class="card quiz-card">
        <div class="quiz-top"><span class="eyebrow">${world.icon} ${world.name} · Soal ${i + 1}/${qs.length}</span><span class="tag">⭐ Skor ${score}</span></div>
        ${progressBar(Math.round((i / qs.length) * 100), world.color, "Progress quiz")}
        <h1 class="h2 quiz-q">${q.q}</h1>
        ${q.code ? codeBlock(q.code) : ""}
        <div class="options" role="group" aria-label="Pilihan jawaban">
          ${q.options.map((o, k) => `<button class="option" data-k="${k}"><span class="opt-letter">${letters[k]}</span><span>${escapeHtml(o).replace(/&lt;code&gt;|&lt;\/code&gt;/g, "")}</span></button>`).join("")}
        </div>
        <div id="quiz-fb" aria-live="polite"></div>
      </div>`;
    $$(".option").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.k)));
    const first = $(".option");
    if (first) first.focus();
  }

  function answer(k) {
    const q = qs[i];
    const correct = k === q.answer;
    $$(".option").forEach((b) => {
      b.disabled = true;
      const kk = +b.dataset.k;
      if (kk === q.answer) { b.classList.add("correct"); b.insertAdjacentHTML("beforeend", '<span class="opt-mark">✓ Benar</span>'); }
      else if (kk === k) { b.classList.add("wrong"); b.insertAdjacentHTML("beforeend", '<span class="opt-mark">✗ Pilihanmu</span>'); }
    });
    if (correct) score++;
    const g = recordQuizAnswer(q.id, correct);
    gained += g;
    $("#quiz-fb").innerHTML = `<div class="fb ${correct ? "fb-ok" : "fb-warn"}">
      <div class="fb-title">${correct ? `🎉 Mantap!${g ? ` +${g} XP` : ""}` : "🤔 Belum tepat."}</div>
      <p>${q.explain}</p></div>
      <button class="btn btn-primary" id="quiz-next">${i + 1 < qs.length ? "Soal berikutnya →" : "Lihat hasil 🏁"}</button>`;
    $("#quiz-next").focus();
    $("#quiz-next").addEventListener("click", () => { i++; if (i < qs.length) show(); else finish(); });
  }

  function finish() {
    const pct = Math.round((score / qs.length) * 100);
    $("#page").innerHTML = `<div class="card center reward">
      <div class="reward-emoji bounce" aria-hidden="true">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "🌱"}</div>
      <p class="eyebrow">QUIZ SELESAI</p>
      <h1 class="h1">Skor kamu: ${score}/${qs.length}</h1>
      <p class="muted">${pct >= 80 ? "Luar biasa! Kamu benar-benar paham." : pct >= 50 ? "Bagus! Sedikit lagi sempurna." : "Tidak apa-apa! Coba baca lagi materinya, lalu ulangi quiz ini."}</p>
      ${gained ? `<div class="reward-xp"><span class="xp-pop">+${gained} XP</span></div>` : ""}
      <div class="btn-row center"><a class="btn btn-primary" href="quiz.html?w=${worldId}">🔁 Ulangi</a><a class="btn btn-ghost" href="quiz.html">Pilih quiz lain</a><a class="btn btn-ghost" href="roadmap.html">🗺️ World Map</a></div></div>`;
    if (pct >= 80) confetti();
  }
  show();
}

/* ======================= MINI GAMES ======================= */
const GAMES = [
  { id: "debug", icon: "⚔️", title: "Debugging Monster", desc: "Monster hanya bisa dikalahkan jika kamu memperbaiki kodenya. Melatih membaca error.", rounds: () => DEBUG_ROUNDS.length },
  { id: "sort", icon: "🧩", title: "Code Sorting", desc: "Urutkan baris kode yang teracak agar programnya benar. Melatih alur program.", rounds: () => SORT_ROUNDS.length },
  { id: "output", icon: "🎯", title: "Output Hunter", desc: "Tebak output dari sebuah kode sebelum dijalankan. Melatih membaca kode.", rounds: () => OUTPUT_ROUNDS.length },
  { id: "varbox", icon: "📦", title: "Variable Box", desc: "Tebak isi setiap kotak variable setelah kode dijalankan. Melatih konsep variable.", rounds: () => VARBOX_ROUNDS.length },
];

function renderGames() {
  const params = new URLSearchParams(location.search);
  const g = params.get("g");
  const map = { debug: gameDebug, sort: gameSort, output: gameOutput, varbox: gameVarBox };
  if (g && map[g]) return map[g]();
  const p = loadProgress();
  $("#page").innerHTML = `
    <div class="page-head"><h1 class="h1">Mini Games</h1>
      <p class="muted">Setiap game melatih konsep Python yang nyata. Tamatkan game untuk mendapat <b>+${XP.game} XP</b>.</p></div>
    <div class="games-grid">
      ${GAMES.map((gm) => `<a class="card game-card" href="games.html?g=${gm.id}">
        <div class="game-icon" aria-hidden="true">${gm.icon}</div>
        <h2 class="h3">${gm.title}</h2><p class="muted">${gm.desc}</p>
        <div class="tag-row"><span class="tag">${gm.rounds()} ronde</span>${p.gamesCompleted.includes(gm.id) ? '<span class="tag tag-ok">✅ Tamat</span>' : `<span class="tag tag-xp">+${XP.game} XP</span>`}</div>
        <span class="btn btn-primary btn-block">Main ▶</span></a>`).join("")}
    </div>
    <p class="muted small center">🐛 Bug diperbaiki: <b>${p.bugsFixed.length}</b>/10 untuk badge <b>Bug Hunter</b></p>`;
}

function gameHeader(gm, round, total, extra) {
  return `<a class="back-link" href="games.html">← Mini Games</a>
    <div class="game-head"><h1 class="h2">${gm.icon} ${gm.title}</h1><div class="tag-row"><span class="tag">Ronde ${Math.min(round + 1, total)}/${total}</span>${extra || ""}</div></div>
    ${progressBar(Math.round((round / total) * 100), "#8b5cf6", "Progress game")}`;
}

function gameFinish(gameId, title, sub, allowXP) {
  const g = allowXP ? completeGame(gameId) : 0;
  $("#page").innerHTML = `<div class="card center reward">
    <div class="reward-emoji bounce" aria-hidden="true">🏆</div>
    <p class="eyebrow">GAME SELESAI</p><h1 class="h1">${title}</h1><p class="muted">${sub}</p>
    ${g ? `<div class="reward-xp"><span class="xp-pop">+${g} XP</span></div>` : allowXP ? '<p class="muted small">Kamu sudah pernah menamatkan game ini (XP hanya sekali). Latihan tetap berharga!</p>' : ""}
    <div class="btn-row center"><a class="btn btn-primary" href="games.html?g=${gameId}">🔁 Main lagi</a><a class="btn btn-ghost" href="games.html">🎮 Game lain</a></div></div>`;
  if (g) confetti();
}

/* ---------- GAME 1: Debugging Monster ---------- */
function gameDebug() {
  const gm = GAMES[0];
  let queue = DEBUG_ROUNDS.slice();
  let defeated = 0;
  const total = DEBUG_ROUNDS.length;
  let hearts = 3;

  function show() {
    if (!queue.length) return gameFinish("debug", "Semua monster dikalahkan! ⚔️", `Kamu memperbaiki ${total} bug. Kamu memang Bug Hunter!`, true);
    const r = queue[0];
    let hintLevel = 0;
    $("#page").innerHTML = `${gameHeader(gm, defeated, total, `<span class="tag" aria-label="${hearts} nyawa">${"❤️".repeat(hearts)}${"🤍".repeat(3 - hearts)}</span>`)}
      <div class="split">
        <div class="card split-left monster-card">
          <div class="monster" id="monster" aria-hidden="true">${r.monster}</div>
          <h2 class="h3 center">${r.name}</h2>
          <div class="hp"><span class="small">HP</span><div class="pbar"><div class="pbar-fill hp-fill" id="hp-fill" style="width:100%"></div></div></div>
          <p class="task"><b>🎯 Misi:</b> ${r.goal}. Perbaiki bug di kode, lalu serang!</p>
          <div id="dbg-hint" aria-live="polite"></div>
          <div class="btn-row"><button class="btn btn-ghost btn-sm" id="dbg-hint-btn">💡 Hint</button><button class="btn btn-ghost btn-sm" id="dbg-skip">⏭️ Lewati dulu</button></div>
        </div>
        <div class="split-right"><div id="dbg-editor"></div><div id="dbg-run"></div></div>
      </div>`;
    const ed = createEditor($("#dbg-editor"), { code: r.code, onRun: () => run() });
    const panel = createRunPanel($("#dbg-run"), { inputs: r.inputs || [], checkLabel: "⚔️ Serang!" });
    panel.runBtn.addEventListener("click", run);
    panel.checkBtn.addEventListener("click", attack);
    $("#dbg-hint-btn").addEventListener("click", () => {
      hintLevel = Math.min(2, hintLevel + 1);
      $("#dbg-hint").innerHTML = hintHtml(["Tekan ▶ RUN CODE dulu dan baca pesan errornya dari baris paling bawah.", r.hint], hintLevel);
    });
    $("#dbg-skip").addEventListener("click", () => { queue.push(queue.shift()); toast("Monster ini akan muncul lagi nanti 👀", "info"); show(); });

    async function run() {
      panel.showRunning();
      const res = await runCodeWithPrompts(ed.getCode(), panel.getInputs());
      showInteractiveRunResult(panel, res, "", "info");
    }

    async function attack() {
      panel.showRunning();
      const res = await runCode(ed.getCode(), r.inputs || []);
      panel.showResult(res);
      if (!res.error && r.expected.test(res.output)) {
        $("#hp-fill").style.width = "0%";
        $("#monster").classList.add("defeated");
        panel.feedback(`<div class="fb-title">⚔️ MONSTER DEFEATED!</div><p>Bug berhasil diperbaiki.</p>`, "ok");
        recordBugFixed(r.id);
        defeated++;
        queue.shift();
        setTimeout(show, 1400);
      } else {
        hearts--;
        $("#monster").classList.add("shake");
        setTimeout(() => { const m = $("#monster"); if (m) m.classList.remove("shake"); }, 500);
        const why = res.error ? errorFeedbackHtml(res.error) : `<div class="fb-title">❌ Belum benar</div><p>Kodenya berjalan, tapi hasilnya belum sesuai misi: ${r.goal}.</p>`;
        if (hearts <= 0) {
          hearts = 3;
          panel.feedback(`${why}<p>💫 Monster menyerang balik! Nyawamu habis, tapi tenang — nyawa dipulihkan. Coba lagi dengan hint!</p>`, "warn");
        } else panel.feedback(`${why}<p class="small">Monster menyerang balik! Sisa nyawa: ${"❤️".repeat(hearts)}</p>`, "warn");
        const tagRow = $(".game-head .tag-row");
        if (tagRow) tagRow.lastElementChild.textContent = "❤️".repeat(hearts) + "🤍".repeat(3 - hearts);
      }
    }
  }
  show();
}

/* ---------- GAME 2: Code Sorting ---------- */
function gameSort() {
  const gm = GAMES[1];
  let round = 0;
  const total = SORT_ROUNDS.length;

  function show() {
    if (round >= total) return gameFinish("sort", "Semua kode tersusun rapi! 🧩", "Kamu paham bahwa Python membaca kode dari atas ke bawah.", true);
    const r = SORT_ROUNDS[round];
    let order = shuffle(r.lines.map((_, i) => i));
    let tries = 0;
    while (order.every((v, i) => v === i) && r.lines.length > 1 && tries++ < 10) order = shuffle(order);

    $("#page").innerHTML = `${gameHeader(gm, round, total)}
      <div class="card">
        <h2 class="h3">🎯 ${r.title}</h2>
        <p class="muted">Susun baris-baris kode ini agar urutannya benar. Gunakan tombol ⬆️ ⬇️ (atau drag di desktop). Spasi di depan baris menunjukkan baris itu ada di dalam blok.</p>
        <ol class="sort-list" id="sort-list"></ol>
        <p class="muted small">Output yang diharapkan: <code>${escapeHtml(r.output)}</code></p>
        <div class="btn-row"><button class="btn btn-primary" id="sort-check">✅ Cek Urutan</button></div>
        <div id="sort-fb" aria-live="polite"></div>
      </div>`;
    const list = $("#sort-list");
    let dragFrom = null;
    function draw(marks) {
      list.innerHTML = order.map((li, pos) => `<li class="sort-item ${marks ? (marks[pos] ? "ok" : "bad") : ""}" draggable="true" data-pos="${pos}">
        <span class="sort-num">${pos + 1}</span>
        <code class="sort-code">${highlightPython(r.lines[li]).replace(/^( +)/, (m) => "&nbsp;".repeat(m.length))}</code>
        ${marks ? `<span class="sort-mark">${marks[pos] ? "✓" : "✗"}</span>` : ""}
        <span class="sort-btns"><button class="icon-btn" data-up="${pos}" aria-label="Naikkan baris ${pos + 1}" ${pos === 0 ? "disabled" : ""}>⬆️</button>
        <button class="icon-btn" data-down="${pos}" aria-label="Turunkan baris ${pos + 1}" ${pos === order.length - 1 ? "disabled" : ""}>⬇️</button></span></li>`).join("");
      $$("[data-up]", list).forEach((b) => b.addEventListener("click", () => { const k = +b.dataset.up; [order[k - 1], order[k]] = [order[k], order[k - 1]]; draw(); const nb = $(`[data-up="${k - 1}"]`, list) || $(`[data-down="${k - 1}"]`, list); if (nb) nb.focus(); }));
      $$("[data-down]", list).forEach((b) => b.addEventListener("click", () => { const k = +b.dataset.down; [order[k + 1], order[k]] = [order[k], order[k + 1]]; draw(); const nb = $(`[data-down="${k + 1}"]`, list) || $(`[data-up="${k + 1}"]`, list); if (nb) nb.focus(); }));
      $$(".sort-item", list).forEach((it) => {
        it.addEventListener("dragstart", () => { dragFrom = +it.dataset.pos; it.classList.add("dragging"); });
        it.addEventListener("dragend", () => it.classList.remove("dragging"));
        it.addEventListener("dragover", (e) => e.preventDefault());
        it.addEventListener("drop", (e) => {
          e.preventDefault();
          const to = +it.dataset.pos;
          if (dragFrom === null || dragFrom === to) return;
          const [m] = order.splice(dragFrom, 1);
          order.splice(to, 0, m);
          dragFrom = null;
          draw();
        });
      });
    }
    draw();
    $("#sort-check").addEventListener("click", () => {
      const marks = order.map((v, i) => r.lines[v] === r.lines[i]);
      draw(marks);
      if (marks.every(Boolean)) {
        $("#sort-fb").innerHTML = `<div class="fb fb-ok"><div class="fb-title">🎉 Urutannya benar!</div><p>Python membaca dari atas ke bawah, jadi urutan sangat penting.</p></div><button class="btn btn-primary" id="sort-next">Lanjut ${icon("arrowRight")}</button>`;
        $("#sort-check").disabled = true;
        $("#sort-next").addEventListener("click", () => { round++; show(); });
        $("#sort-next").focus();
        updateStreak();
      } else {
        $("#sort-fb").innerHTML = `<div class="fb fb-warn"><div class="fb-title">🤔 Belum tepat</div><p>Baris bertanda ✗ belum di posisi yang benar. Ingat: variable harus dibuat <b>sebelum</b> dipakai, dan baris yang menjorok berada di bawah baris yang diakhiri <code>:</code>.</p></div>`;
      }
    });
  }
  show();
}

/* ---------- GAME 3: Output Hunter ---------- */
function gameOutput() {
  const gm = GAMES[2];
  const rounds = shuffle(OUTPUT_ROUNDS);
  let round = 0, score = 0;
  const total = rounds.length;
  const need = Math.ceil(total * 0.6);

  function show() {
    if (round >= total) {
      const pass = score >= need;
      return gameFinish("output", `Skor: ${score}/${total} 🎯`, pass ? "Mata elangmu tajam! Kamu bisa membaca kode seperti Python." : `Butuh minimal ${need} benar untuk menamatkan game. Coba lagi ya!`, pass);
    }
    const r = rounds[round];
    $("#page").innerHTML = `${gameHeader(gm, round, total, `<span class="tag">🎯 ${score} benar</span>`)}
      <div class="card">
        <h2 class="h3">Apa output kode ini?</h2>
        ${codeBlock(r.code)}
        <div class="options">${r.options.map((o, k) => `<button class="option" data-k="${k}"><span class="opt-letter">${"ABCD"[k]}</span><code>${escapeHtml(o)}</code></button>`).join("")}</div>
        <div id="oh-fb" aria-live="polite"></div>
      </div>`;
    $$(".option").forEach((b) => b.addEventListener("click", async () => {
      const k = +b.dataset.k;
      const ok = k === r.answer;
      if (ok) score++;
      $$(".option").forEach((x) => {
        x.disabled = true;
        const kk = +x.dataset.k;
        if (kk === r.answer) { x.classList.add("correct"); x.insertAdjacentHTML("beforeend", '<span class="opt-mark">✓</span>'); }
        else if (kk === k) { x.classList.add("wrong"); x.insertAdjacentHTML("beforeend", '<span class="opt-mark">✗</span>'); }
      });
      $("#oh-fb").innerHTML = `<div class="fb ${ok ? "fb-ok" : "fb-warn"}"><div class="fb-title">${ok ? "🎯 Tepat sasaran!" : "💨 Meleset!"}</div><p>${r.explain}</p></div>
        <div class="btn-row"><button class="btn btn-ghost" id="oh-prove">${icon("play")} Buktikan dengan Run</button><button class="btn btn-primary" id="oh-next">Lanjut ${icon("arrowRight")}</button></div><pre class="output hidden" id="oh-out"></pre>`;
      $("#oh-next").focus();
      $("#oh-prove").addEventListener("click", async () => { const o = $("#oh-out"); o.classList.remove("hidden"); const res = await runCode(r.code, []); o.textContent = res.output + (res.error ? `${res.error.type}: ${res.error.msg}` : ""); });
      $("#oh-next").addEventListener("click", () => { round++; show(); });
      updateStreak();
    }));
  }
  show();
}

/* ---------- GAME 4: Variable Box ---------- */
function gameVarBox() {
  const gm = GAMES[3];
  let round = 0;
  const total = VARBOX_ROUNDS.length;
  const norm = (s) => String(s).trim().replace(/^["']|["']$/g, "").trim().toLowerCase();

  function show() {
    if (round >= total) return gameFinish("varbox", "Semua kotak terbuka! 📦", "Kamu paham bagaimana variable menyimpan dan berubah isinya.", true);
    const r = VARBOX_ROUNDS[round];
    $("#page").innerHTML = `${gameHeader(gm, round, total)}
      <div class="card">
        <h2 class="h3">Setelah kode ini dijalankan, apa isi setiap kotak?</h2>
        ${codeBlock(r.code)}
        <form id="vb-form" class="boxes">
          ${r.vars.map((v, i) => `<div class="box"><div class="box-lid" aria-hidden="true">📦</div><label for="vb-${i}" class="box-name"><code>${v.name}</code></label>
            <input id="vb-${i}" class="input box-input" autocomplete="off" placeholder="isi kotak?" required><span class="box-mark" id="vb-mark-${i}"></span></div>`).join("")}
          <div class="btn-row"><button class="btn btn-primary" type="submit">✅ Buka Kotak</button></div>
        </form>
        <div id="vb-fb" aria-live="polite"></div>
      </div>`;
    $("#vb-0").focus();
    $("#vb-form").addEventListener("submit", (e) => {
      e.preventDefault();
      let all = true;
      r.vars.forEach((v, i) => {
        const ok = norm($(`#vb-${i}`).value) === norm(v.answer);
        if (!ok) all = false;
        $(`#vb-mark-${i}`).textContent = ok ? "✓ benar" : "✗ belum";
        $(`#vb-mark-${i}`).className = "box-mark " + (ok ? "ok" : "bad");
      });
      if (all) {
        $("#vb-fb").innerHTML = `<div class="fb fb-ok"><div class="fb-title">🎉 Semua kotak benar!</div><p>${r.explain}</p></div><button class="btn btn-primary" id="vb-next">Lanjut ${icon("arrowRight")}</button>`;
        $("#vb-next").addEventListener("click", () => { round++; show(); });
        $("#vb-next").focus();
        updateStreak();
      } else {
        $("#vb-fb").innerHTML = `<div class="fb fb-warn"><div class="fb-title">🤔 Ada kotak yang belum tepat</div><p>Baca kodenya dari atas ke bawah, satu baris demi satu baris. Setiap tanda <code>=</code> mengganti isi kotak di sebelah kirinya.</p></div>`;
      }
    });
  }
  show();
}
