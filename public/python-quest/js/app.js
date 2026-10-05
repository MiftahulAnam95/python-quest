/* =========================================================
   PYTHON QUEST — app.js
   Titik awal setiap halaman. Membaca <body data-page="...">
   lalu menampilkan halaman yang sesuai.
   ========================================================= */

const PAGES = {
  dashboard: renderDashboard,
  roadmap: renderRoadmap,
  lessons: renderLessons,
  playground: renderPlayground,
  quiz: renderQuiz,
  games: renderGames,
  achievements: renderAchievements,
  profile: renderProfile,
  progress: renderProgress,
};
const NEEDS_PYTHON = ["lessons", "playground", "games", "quiz"];

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (!PAGES[page]) return;
  try {
    loadProgress();
    renderShell(page);
    PAGES[page]();
    checkAchievements();
    refreshStats();
  } catch (e) {
    console.error(e);
    if (!document.getElementById("page")) {
      document.getElementById("app-shell").innerHTML = '<main id="page" class="page"></main>';
    }
    showFatal();
  }
  // Muat Python asli (Pyodide) di background untuk halaman yang butuh menjalankan kode
  if (NEEDS_PYTHON.includes(page)) {
    const start = () => { try { PyRunner.init(); } catch (e) { /* fallback Mini Python */ } };
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1200);
  }
});
