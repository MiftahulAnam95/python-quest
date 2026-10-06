# 🐍 PYTHON QUEST — Petualangan Belajar Python

> “Belajar Python dari nol, satu quest demi satu quest!”

Website edukasi interaktif ala game RPG untuk belajar Python dari nol.
Seluruh aplikasi ini memakai **HTML, CSS, dan Vanilla JavaScript** — tanpa backend dan tanpa database. Progress disimpan pada `localStorage` browser.

> **Catatan deployment:** jika folder ini berada di dalam proyek Next.js, jangan mengunggah folder proyek secara manual ke GitHub Pages dengan mode Branch Root. Gunakan workflow root repository di `.github/workflows/deploy-pages.yml`. Workflow tersebut akan memublikasikan isi folder ini sebagai root situs GitHub Pages.

## 🚀 Deploy ke GitHub Pages

### Cara terbaik: GitHub Actions

1. Push seluruh repository ke GitHub, termasuk folder `.github/`.
2. Buka **Settings → Pages** di repository GitHub.
3. Pada **Source**, pilih **GitHub Actions**.
4. Workflow **Deploy Python Quest to GitHub Pages** akan mengunggah folder ini secara otomatis.
5. Setelah workflow hijau, buka URL Pages yang diberikan GitHub.

Dengan cara ini, situs tampil langsung pada:

```text
https://<username>.github.io/<nama-repository>/
```

Tanpa `/public/python-quest/` pada URL.

### Cara alternatif: folder ini sebagai repository tersendiri

Kalau kamu membuat repository khusus hanya untuk Python Quest, upload **isi folder ini** (bukan folder induknya) ke root repository:

```text
index.html
css/
js/
assets/
.nojekyll
```

Lalu di **Settings → Pages**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.

## 📁 Struktur aplikasi

```text
python-quest/
├── index.html          → Landing page
├── dashboard.html      → Dashboard (level, XP, quest berikutnya)
├── roadmap.html        → World Map
├── lessons.html        → Daftar lesson & lesson player (?id=w1-1)
├── playground.html     → Code Playground
├── quiz.html           → Quiz
├── games.html          → 4 Mini Game
├── achievements.html   → Achievement
├── profile.html        → Profile + pengaturan + reset progress
├── progress.html       → Progress detail
├── css/
│   ├── style.css
│   ├── lesson.css
│   └── landing.css
├── js/
│   ├── storage.js      → saveProgress, loadProgress, addXP, completeLesson, unlockAchievement, updateStreak
│   ├── data-lessons.js → Semua materi (tambahkan lesson baru di sini)
│   ├── data-extra.js   → Quiz, mini game, challenge playground
│   ├── pyrunner.js     → Menjalankan Python (Pyodide + fallback Mini Python)
│   ├── ui.js           → Layout, toast, modal, editor, pengecek challenge
│   ├── pages.js        → Dashboard, World Map, Achievement, Profile, Progress
│   ├── lesson.js       → Lesson player 7 langkah
│   ├── activities.js   → Playground, Quiz, Mini Game
│   └── app.js          → Titik awal setiap halaman
└── assets/images/hero.png
```

## 🐍 Menjalankan Python di browser

- **Pyodide** (Python asli via WebAssembly) dimuat dari CDN di Web Worker, dengan timeout untuk loop tak berujung.
- Jika Pyodide belum siap atau perangkat sedang offline, aplikasi otomatis memakai **Mini Python**, interpreter sederhana berbasis JavaScript yang mendukung materi kursus ini.
- Saat kode yang dijalankan memanggil `input()`, jawaban diminta lewat popup interaktif bergaya SweetAlert; jawaban terakhir ditawarkan kembali pada run berikutnya. Tes challenge tetap berjalan otomatis dengan data uji.

## ➕ Menambah lesson

Buka `js/data-lessons.js`, salin satu objek lesson, lalu ubah `id`, `world`, `title`, materi, dan `challenge`.
