# 🐍 Python Quest — GitHub Pages

Website Python Quest yang siap dipublikasikan sebagai situs statis di GitHub Pages.
Aplikasi utamanya berada di `public/python-quest/` agar tetap dapat dipreview oleh proyek Next.js ini. **Jangan pindahkan folder tersebut.** Workflow di repository ini akan memublikasikan isi folder itu sebagai root GitHub Pages secara otomatis.

## Cara deploy yang direkomendasikan (GitHub Actions)

Ini adalah cara yang menghasilkan URL bersih seperti:

```text
https://miftahulanam95.github.io/python-quest/
```

1. Push semua file repository ini ke GitHub, termasuk folder tersembunyi `.github/` dan file `.nojekyll`.
2. Di repository GitHub, buka **Settings → Pages**.
3. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
4. Push lagi ke branch `main` (atau buka tab **Actions**, pilih workflow **Deploy Python Quest to GitHub Pages**, lalu klik **Run workflow**).
5. Tunggu workflow hijau. Buka URL Pages yang ditampilkan oleh GitHub.

Workflow `.github/workflows/deploy-pages.yml` mengunggah **`public/python-quest` sebagai root website**. Jadi `index.html`, `css/`, `js/`, dan `assets/` semuanya berada di lokasi yang benar untuk GitHub Pages.

## Jika memilih “Deploy from a branch”

Root repository sekarang juga punya `index.html` fallback. Ia otomatis mengarahkan pengunjung ke:

```text
/public/python-quest/index.html
```

Mode ini tetap berfungsi, tetapi URL akan mengandung `/public/python-quest/`. Karena itu, **GitHub Actions tetap pilihan terbaik**.

## Jangan upload

`.gitignore` sudah menandai file yang tidak boleh diunggah:

- `node_modules/`
- `.next/`
- `.env` dan file rahasia lain

## Struktur penting

```text
.github/workflows/deploy-pages.yml  # Deploy GitHub Pages otomatis
public/python-quest/                # Website statis yang benar-benar dipublikasikan
├── index.html
├── dashboard.html
├── roadmap.html
├── css/
├── js/
└── assets/
```

## Mengapa sebelumnya hanya muncul “python-quest”?

GitHub Pages sedang membaca root repository, sedangkan file landing page ada satu tingkat lebih dalam pada `public/python-quest/index.html`. Akibatnya GitHub tidak menemukan landing page pada root dan hanya menampilkan halaman folder. Workflow baru memperbaiki struktur publikasinya.
