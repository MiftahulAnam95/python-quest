/* =========================================================
   PYTHON QUEST — storage.js
   Semua data progress disimpan di localStorage browser.
   Fungsi utama: loadProgress, saveProgress, addXP,
   completeLesson, unlockAchievement, updateStreak
   ========================================================= */

const PQ_KEY = "pythonQuest_progress_v1";

/* ---------- Daftar level ---------- */
const LEVELS = [
  { level: 1, title: "Python Newbie", min: 0 },
  { level: 2, title: "Code Explorer", min: 500 },
  { level: 3, title: "Bug Hunter", min: 1200 },
  { level: 4, title: "Logic Apprentice", min: 2000 },
  { level: 5, title: "Loop Warrior", min: 2900 },
  { level: 6, title: "Function Knight", min: 3900 },
  { level: 7, title: "Data Explorer", min: 5000 },
  { level: 8, title: "Python Adventurer", min: 6300 },
  { level: 9, title: "Python Master", min: 7800 },
];

/* ---------- Nilai XP ---------- */
const XP = {
  lesson: 100,
  quiz: 25,
  challenge: 50,
  game: 75,
  perfect: 25,
};

/* ---------- Achievement ---------- */
const ACHIEVEMENTS = [
  { id: "first-code", icon: "🚀", title: "First Code", desc: "Menjalankan kode Python pertama.", check: (p) => p.codeRuns > 0 },
  { id: "first-quest", icon: "🐣", title: "Langkah Pertama", desc: "Menyelesaikan quest pertama.", check: (p) => p.completedLessons.length >= 1 },
  { id: "variable-master", icon: "📦", title: "Variable Master", desc: "Menyelesaikan materi variable.", check: (p) => p.completedLessons.includes("w1-2") },
  { id: "python-explorer", icon: "🌱", title: "Python Explorer", desc: "Menyelesaikan World 1 — Python Village.", check: (p) => worldDone(p, 1) },
  { id: "logic-master", icon: "🌲", title: "Logic Master", desc: "Menyelesaikan World 2 — Logic Forest.", check: (p) => worldDone(p, 2) },
  { id: "loop-warrior", icon: "🏜️", title: "Loop Warrior", desc: "Menyelesaikan semua challenge loop (World 3).", check: (p) => worldDone(p, 3) },
  { id: "function-knight", icon: "🏰", title: "Function Knight", desc: "Menyelesaikan World 4 — Function Castle.", check: (p) => worldDone(p, 4) },
  { id: "data-diver", icon: "🌊", title: "Data Diver", desc: "Menyelesaikan World 5 — Data Ocean.", check: (p) => worldDone(p, 5) },
  { id: "bug-hunter", icon: "🐛", title: "Bug Hunter", desc: "Memperbaiki 10 bug.", check: (p) => p.bugsFixed.length >= 10 },
  { id: "quiz-whiz", icon: "🧠", title: "Quiz Whiz", desc: "Menjawab 10 soal quiz dengan benar.", check: (p) => countQuizCorrect(p) >= 10 },
  { id: "gamer", icon: "🎮", title: "Gamer Sejati", desc: "Menamatkan 1 mini game.", check: (p) => p.gamesCompleted.length >= 1 },
  { id: "perfectionist", icon: "💎", title: "Perfeksionis", desc: "Menyelesaikan 5 challenge tanpa salah sekalipun.", check: (p) => p.perfectLessons.length >= 5 },
  { id: "consistency", icon: "🔥", title: "Consistency Warrior", desc: "Belajar 7 hari berturut-turut.", check: (p) => p.bestStreak >= 7 },
  { id: "seven-day", icon: "📅", title: "7 Day Learner", desc: "Belajar total selama 7 hari.", check: (p) => p.studyDays.length >= 7 },
  { id: "python-adventurer", icon: "⚔️", title: "Python Adventurer", desc: "Menyelesaikan FINAL QUEST — Tebak Angka.", check: (p) => p.completedLessons.includes("w7-7") },
];

function worldDone(p, world) {
  if (typeof LESSONS === "undefined") return false;
  const ids = LESSONS.filter((l) => l.world === world).map((l) => l.id);
  return ids.length > 0 && ids.every((id) => p.completedLessons.includes(id));
}
function countQuizCorrect(p) {
  return Object.values(p.quizAnswered || {}).filter(Boolean).length;
}

/* ---------- Data default ---------- */
function defaultProgress() {
  return {
    name: "Python Explorer",
    avatar: "🧑‍💻",
    level: 1,
    xp: 0,
    completedLessons: [],
    perfectLessons: [],
    completedQuests: [],
    achievements: [],
    streak: 0,
    bestStreak: 0,
    lastStudyDate: null,
    studyDays: [],
    quizAnswered: {},
    gamesCompleted: [],
    bugsFixed: [],
    playgroundDone: [],
    codeRuns: 0,
    freeMode: false,
    createdAt: todayStr(),
  };
}

function todayStr(d) {
  const date = d || new Date();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${day}`;
}

let _progress = null;

function loadProgress() {
  if (_progress) return _progress;
  let data = null;
  try {
    const raw = localStorage.getItem(PQ_KEY);
    data = raw ? JSON.parse(raw) : null;
  } catch (e) {
    data = null;
  }
  _progress = Object.assign(defaultProgress(), data || {});
  // pastikan array tetap array
  ["completedLessons", "perfectLessons", "completedQuests", "achievements", "studyDays", "gamesCompleted", "bugsFixed", "playgroundDone"].forEach((k) => {
    if (!Array.isArray(_progress[k])) _progress[k] = [];
  });
  if (typeof _progress.quizAnswered !== "object" || !_progress.quizAnswered) _progress.quizAnswered = {};
  // streak putus jika sudah lebih dari 1 hari tidak belajar (tanpa menghukum)
  if (_progress.lastStudyDate) {
    const diff = dayDiff(_progress.lastStudyDate, todayStr());
    if (diff > 1) _progress.streak = 0;
  }
  _progress.level = getLevelInfo(_progress.xp).level;
  return _progress;
}

function saveProgress() {
  try {
    localStorage.setItem(PQ_KEY, JSON.stringify(_progress || defaultProgress()));
  } catch (e) {
    console.warn("Gagal menyimpan progress", e);
  }
}

function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function getLevelInfo(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find((l) => l.level === current.level + 1) || null;
  const base = current.min;
  const target = next ? next.min : current.min;
  const pct = next ? Math.min(100, Math.round(((xp - base) / (target - base)) * 100)) : 100;
  return { level: current.level, title: current.title, next, xp, base, target, pct };
}

function dayDiff(a, b) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / 86400000);
}

/* Dipanggil setiap kali user melakukan aktivitas belajar */
function updateStreak() {
  const p = loadProgress();
  const today = todayStr();
  if (p.lastStudyDate === today) return p.streak;
  if (p.lastStudyDate && dayDiff(p.lastStudyDate, today) === 1) p.streak += 1;
  else p.streak = 1;
  p.lastStudyDate = today;
  if (!p.studyDays.includes(today)) p.studyDays.push(today);
  if (p.streak > p.bestStreak) p.bestStreak = p.streak;
  saveProgress();
  emit("pq:streak", { streak: p.streak });
  return p.streak;
}

function addXP(amount, reason) {
  const p = loadProgress();
  const before = getLevelInfo(p.xp);
  p.xp += amount;
  const after = getLevelInfo(p.xp);
  p.level = after.level;
  updateStreak();
  saveProgress();
  emit("pq:xp", { amount, reason, before, after });
  if (after.level > before.level) emit("pq:levelup", after);
  checkAchievements();
  return after;
}

function unlockAchievement(id) {
  const p = loadProgress();
  if (p.achievements.includes(id)) return false;
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return false;
  p.achievements.push(id);
  saveProgress();
  emit("pq:achievement", a);
  return true;
}

function checkAchievements() {
  const p = loadProgress();
  ACHIEVEMENTS.forEach((a) => {
    if (!p.achievements.includes(a.id)) {
      try {
        if (a.check(p)) unlockAchievement(a.id);
      } catch (e) { /* abaikan */ }
    }
  });
}

/* Menyelesaikan lesson/quest. Mengembalikan XP yang didapat. */
function completeLesson(id, perfect) {
  const p = loadProgress();
  if (p.completedLessons.includes(id)) return 0;
  p.completedLessons.push(id);
  if (!p.completedQuests.includes(id)) p.completedQuests.push(id);
  let gained = XP.lesson;
  if (perfect) {
    p.perfectLessons.push(id);
    gained += XP.perfect;
  }
  saveProgress();
  addXP(gained, perfect ? "Quest selesai + Perfect bonus" : "Quest selesai");
  return gained;
}

function recordCodeRun() {
  const p = loadProgress();
  p.codeRuns += 1;
  saveProgress();
  checkAchievements();
}

function recordQuizAnswer(qid, correct) {
  const p = loadProgress();
  const firstTime = !(qid in p.quizAnswered) || (!p.quizAnswered[qid] && correct);
  const alreadyCorrect = p.quizAnswered[qid] === true;
  if (!alreadyCorrect) p.quizAnswered[qid] = !!correct;
  saveProgress();
  if (correct && !alreadyCorrect && firstTime) {
    addXP(XP.quiz, "Jawaban quiz benar");
    return XP.quiz;
  }
  updateStreak();
  checkAchievements();
  return 0;
}

function recordBugFixed(bugId) {
  const p = loadProgress();
  if (!p.bugsFixed.includes(bugId)) {
    p.bugsFixed.push(bugId);
    saveProgress();
  }
  checkAchievements();
}

function completeGame(gameId) {
  const p = loadProgress();
  if (p.gamesCompleted.includes(gameId)) {
    updateStreak();
    return 0;
  }
  p.gamesCompleted.push(gameId);
  saveProgress();
  addXP(XP.game, "Mini game selesai");
  return XP.game;
}

function completePlayground(id) {
  const p = loadProgress();
  if (p.playgroundDone.includes(id)) return 0;
  p.playgroundDone.push(id);
  if (!p.completedQuests.includes("pg-" + id)) p.completedQuests.push("pg-" + id);
  saveProgress();
  addXP(XP.challenge, "Challenge playground selesai");
  return XP.challenge;
}

function updateProfile(fields) {
  const p = loadProgress();
  Object.assign(p, fields);
  saveProgress();
}

function resetProgress() {
  _progress = defaultProgress();
  saveProgress();
}
