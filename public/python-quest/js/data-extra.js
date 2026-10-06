/* =========================================================
   PYTHON QUEST — data-extra.js
   Data quiz, mini game, dan challenge playground.
   ========================================================= */

/* ---------------- QUIZ (pilihan ganda) ---------------- */
const QUIZZES = [
  // World 1
  { id: "q1-1", world: 1, q: "Apa output kode berikut?", code: `nama = "Budi"\nprint(nama)`, options: ["nama", "Budi", "\"nama\"", "Error"], answer: 1, explain: "Ingat, <code>print(nama)</code> berarti kita meminta Python melihat <b>isi</b> kotak bernama <code>nama</code>, yaitu Budi." },
  { id: "q1-2", world: 1, q: "Perintah untuk menampilkan sesuatu ke layar adalah…", options: ["show()", "display()", "print()", "tampil()"], answer: 2, explain: "Di Python, perintah untuk menampilkan adalah <code>print()</code>." },
  { id: "q1-3", world: 1, q: "Apa arti tanda = pada kode <code>umur = 20</code>?", options: ["umur sama dengan 20 (matematika)", "Masukkan 20 ke dalam kotak umur", "Bandingkan umur dengan 20", "Hapus umur"], answer: 1, explain: "Tanda <code>=</code> artinya <b>memasukkan</b> nilai ke dalam variable. Untuk membandingkan, pakai <code>==</code>." },
  { id: "q1-4", world: 1, q: "Apa output kode berikut?", code: `print(10 / 2)`, options: ["5", "5.0", "10/2", "Error"], answer: 1, explain: "Pembagian <code>/</code> di Python selalu menghasilkan float, jadi hasilnya <code>5.0</code>." },
  { id: "q1-5", world: 1, q: "Jika user mengetik 5, apa output kode ini?", code: `a = input()\nprint(a + a)`, options: ["10", "55", "a + a", "Error"], answer: 1, explain: "Hasil <code>input()</code> selalu berupa <b>tulisan</b>. \"5\" + \"5\" = \"55\" (disambung). Pakai <code>int()</code> agar jadi angka." },
  { id: "q1-6", world: 1, q: "Baris mana yang diabaikan oleh Python?", options: ["print(\"#halo\")", "# ini catatan", "nama = \"#\"", "Semua dijalankan"], answer: 1, explain: "Baris yang diawali <code>#</code> adalah comment dan diabaikan. Tanda # di dalam tanda kutip hanyalah tulisan biasa." },
  { id: "q1-7", world: 1, q: "Apa output kode berikut?", code: `nama = "Sari"\nprint(f"Halo {nama}!")`, options: ["Halo {nama}!", "Halo nama!", "Halo Sari!", "f\"Halo Sari!\""], answer: 2, explain: "Di f-string, <code>{nama}</code> diganti dengan isi kotak nama → Halo Sari!" },
  // World 2
  { id: "q2-1", world: 2, q: "Apa output kode berikut?", code: `print(7 > 3)`, options: ["7", "True", "False", "Error"], answer: 1, explain: "7 memang lebih besar dari 3, jadi Python menjawab <code>True</code>." },
  { id: "q2-2", world: 2, q: "Operator untuk bertanya \"apakah sama?\" adalah…", options: ["=", "==", "===", "!="], answer: 1, explain: "<code>==</code> untuk membandingkan. <code>=</code> (satu) untuk mengisi variable." },
  { id: "q2-3", world: 2, q: "Apa output kode berikut?", code: `umur = 15\nif umur >= 18:\n    print("Dewasa")\nelse:\n    print("Remaja")`, options: ["Dewasa", "Remaja", "Dewasa Remaja", "Tidak ada"], answer: 1, explain: "15 >= 18 bernilai False, sehingga yang dijalankan adalah bagian <code>else</code> → Remaja." },
  { id: "q2-4", world: 2, q: "Apa hasil dari <code>True and False</code>?", options: ["True", "False", "None", "Error"], answer: 1, explain: "<code>and</code> hanya True jika <b>kedua</b> sisi True. Karena salah satunya False, hasilnya False." },
  { id: "q2-5", world: 2, q: "Apa yang wajib ada di akhir baris <code>if</code>?", options: ["Titik koma ;", "Titik dua :", "Kurung kurawal {", "Tidak ada"], answer: 1, explain: "Setiap if, elif, else, for, while, dan def diakhiri titik dua <code>:</code>" },
  { id: "q2-6", world: 2, q: "Apa output kode berikut?", code: `nilai = 75\nif nilai >= 85:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelse:\n    print("C")`, options: ["A", "B", "C", "B C"], answer: 1, explain: "75 >= 85? Tidak. 75 >= 70? Ya → B. Setelah ketemu, sisanya tidak dicek." },
  // World 3
  { id: "q3-1", world: 3, q: "Berapa kali \"Halo\" ditampilkan?", code: `for i in range(4):\n    print("Halo")`, options: ["3", "4", "5", "1"], answer: 1, explain: "<code>range(4)</code> menghasilkan 0, 1, 2, 3 → 4 kali putaran." },
  { id: "q3-2", world: 3, q: "Angka berapa saja yang dihasilkan <code>range(1, 4)</code>?", options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3", "2, 3, 4"], answer: 1, explain: "range berhenti <b>sebelum</b> angka kedua. Jadi 1, 2, 3." },
  { id: "q3-3", world: 3, q: "Apa fungsi <code>break</code>?", options: ["Melewati satu putaran", "Menghentikan loop", "Mengulang dari awal", "Menghapus loop"], answer: 1, explain: "<code>break</code> menghentikan loop saat itu juga. Yang melewati satu putaran adalah <code>continue</code>." },
  { id: "q3-4", world: 3, q: "Apa yang terjadi pada kode ini?", code: `x = 1\nwhile x > 0:\n    print(x)`, options: ["Tampil 1 sekali", "Tidak tampil apa-apa", "Loop tidak pernah berhenti", "Error"], answer: 2, explain: "x tidak pernah berubah, jadi <code>x > 0</code> selalu True → infinite loop. Harus ada yang berubah di dalam loop!" },
  { id: "q3-5", world: 3, q: "Apa output kode berikut?", code: `for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)`, options: ["1 2", "1 2 3 4 5", "1 2 4 5", "3"], answer: 2, explain: "Saat i == 3, <code>continue</code> melewati print. Hasil: 1 2 4 5." },
  { id: "q3-6", world: 3, q: "Apa output kode berikut?", code: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`, options: ["3", "4", "6", "10"], answer: 2, explain: "total = 0 + 1 + 2 + 3 = 6." },
  // World 4
  { id: "q4-1", world: 4, q: "Kata kunci untuk membuat function adalah…", options: ["function", "def", "func", "make"], answer: 1, explain: "Function dibuat dengan <code>def</code>, singkatan dari define." },
  { id: "q4-2", world: 4, q: "Apa output kode berikut?", code: `def kali2(x):\n    return x * 2\n\nprint(kali2(5))`, options: ["5", "10", "x * 2", "None"], answer: 1, explain: "kali2(5) me-return 5 × 2 = 10." },
  { id: "q4-3", world: 4, q: "Pada <code>def sapa(nama):</code>, <code>nama</code> disebut…", options: ["Argument", "Parameter", "Return", "Module"], answer: 1, explain: "Saat membuat function, nama di dalam kurung disebut <b>parameter</b>. Nilai yang dikirim saat memanggil disebut <b>argument</b>." },
  { id: "q4-4", world: 4, q: "Apa output kode berikut?", code: `def halo():\n    print("Hai")`, options: ["Hai", "Tidak ada output", "halo", "Error"], answer: 1, explain: "Function hanya dibuat, tapi <b>tidak dipanggil</b>. Jadi tidak ada output." },
  { id: "q4-5", world: 4, q: "Apa output kode berikut?", code: `def sapa(nama="Teman"):\n    print("Halo", nama)\n\nsapa()`, options: ["Halo", "Halo nama", "Halo Teman", "Error"], answer: 2, explain: "Karena tidak ada argument, parameter memakai nilai default \"Teman\"." },
  { id: "q4-6", world: 4, q: "Variable yang dibuat di dalam function disebut…", options: ["Variable global", "Variable lokal", "Variable bebas", "Constant"], answer: 1, explain: "Variable di dalam function adalah variable <b>lokal</b>, hanya ada di dalam function itu." },
  // World 5
  { id: "q5-1", world: 5, q: "Apa output kode berikut?", code: `buah = ["apel", "jeruk", "mangga"]\nprint(buah[1])`, options: ["apel", "jeruk", "mangga", "Error"], answer: 1, explain: "Index dimulai dari 0. Index 1 adalah item kedua → jeruk." },
  { id: "q5-2", world: 5, q: "Bagaimana cara mengambil item terakhir dari list <code>data</code>?", options: ["data[last]", "data[0]", "data[-1]", "data[end]"], answer: 2, explain: "Index <code>-1</code> selalu menunjuk item terakhir." },
  { id: "q5-3", world: 5, q: "Apa output kode berikut?", code: `hero = {"nama": "Raka", "hp": 100}\nprint(hero["hp"])`, options: ["hp", "Raka", "100", "Error"], answer: 2, explain: "Dictionary diakses dengan kunci. <code>hero[\"hp\"]</code> → 100." },
  { id: "q5-4", world: 5, q: "Jenis data mana yang TIDAK bisa diubah setelah dibuat?", options: ["List", "Dictionary", "Tuple", "Set"], answer: 2, explain: "Tuple bersifat permanen (immutable), seperti prasasti batu." },
  { id: "q5-5", world: 5, q: "Apa output kode berikut?", code: `angka = {1, 2, 2, 3, 3}\nprint(len(angka))`, options: ["5", "3", "2", "Error"], answer: 1, explain: "Set tidak menyimpan data kembar. Isinya {1, 2, 3} → 3 item." },
  { id: "q5-6", world: 5, q: "Apa output kode berikut?", code: `x = [10, 20, 30, 40]\nprint(x[1:3])`, options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"], answer: 1, explain: "Slicing [1:3] mengambil index 1 dan 2 (berhenti sebelum 3) → [20, 30]." },
  // World 6
  { id: "q6-1", world: 6, q: "Error apa yang muncul dari kode ini?", code: `print(halo)`, options: ["SyntaxError", "NameError", "TypeError", "IndexError"], answer: 1, explain: "halo tanpa kutip dianggap nama variable yang belum dibuat → NameError." },
  { id: "q6-2", world: 6, q: "Error apa yang muncul dari kode ini?", code: `print("Umur: " + 20)`, options: ["ValueError", "NameError", "TypeError", "SyntaxError"], answer: 2, explain: "Tulisan tidak bisa ditambah angka → TypeError. Solusi: <code>str(20)</code>." },
  { id: "q6-3", world: 6, q: "Saat membaca pesan error, bagian mana yang sebaiknya dibaca dulu?", options: ["Baris paling atas", "Baris paling bawah", "Bagian tengah", "Tidak perlu dibaca"], answer: 1, explain: "Baris paling bawah berisi jenis error dan penjelasannya." },
  { id: "q6-4", world: 6, q: "Error apa yang muncul dari kode ini?", code: `int("abc")`, options: ["ValueError", "TypeError", "NameError", "Tidak error"], answer: 0, explain: "\"abc\" bukan angka sehingga nilainya tidak bisa diubah → ValueError." },
  { id: "q6-5", world: 6, q: "Error apa yang muncul dari kode ini?", code: `if 5 > 3\n    print("ya")`, options: ["NameError", "SyntaxError", "IndexError", "Tidak error"], answer: 1, explain: "Lupa titik dua setelah if → SyntaxError." },
  { id: "q6-6", world: 6, q: "Error apa yang muncul dari kode ini?", code: `a = [1, 2, 3]\nprint(a[3])`, options: ["IndexError", "KeyError", "ValueError", "Tidak error"], answer: 0, explain: "List 3 item hanya punya index 0–2. Index 3 tidak ada → IndexError." },
  // World 7
  { id: "q7-1", world: 7, q: "Modul untuk membuat angka acak adalah…", options: ["math", "random", "acak", "time"], answer: 1, explain: "<code>import random</code>, lalu gunakan <code>random.randint(a, b)</code>." },
  { id: "q7-2", world: 7, q: "<code>random.randint(1, 6)</code> bisa menghasilkan angka…", options: ["1 sampai 5", "0 sampai 6", "1 sampai 6", "Hanya 1 atau 6"], answer: 2, explain: "Berbeda dengan range, randint <b>termasuk</b> angka terakhir: 1 sampai 6, seperti dadu." },
  { id: "q7-3", world: 7, q: "Untuk loop menu yang terus berulang sampai user memilih keluar, biasanya dipakai…", options: ["for i in range(1)", "while True + break", "if True", "def True"], answer: 1, explain: "<code>while True:</code> berulang selamanya, dan <code>break</code> dipakai untuk keluar." },
  { id: "q7-4", world: 7, q: "Apa output kode berikut?", code: `pilihan = "KIRI".lower()\nprint(pilihan == "kiri")`, options: ["False", "True", "kiri", "KIRI"], answer: 1, explain: "<code>.lower()</code> mengubah \"KIRI\" menjadi \"kiri\", jadi perbandingannya True." },
];

/* ---------------- MINI GAME 1: Debugging Monster ---------------- */
const DEBUG_ROUNDS = [
  { id: "b1", monster: "🐛", name: "Typo Worm", code: `nama = "Budi"\nprint(nma)`, expected: /Budi/, goal: "Program harus menampilkan Budi", hint: "Cek ejaan nama variable di dalam print." },
  { id: "b2", monster: "🦗", name: "Quote Cricket", code: `print("Halo Dunia!)`, expected: /Halo Dunia!/, goal: "Program harus menampilkan Halo Dunia!", hint: "Tanda kutipnya berpasangan?" },
  { id: "b3", monster: "🕷️", name: "Colon Spider", code: `umur = 20\nif umur >= 18\n    print("Dewasa")`, expected: /Dewasa/, goal: "Program harus menampilkan Dewasa", hint: "if wajib diakhiri tanda apa?" },
  { id: "b4", monster: "🦂", name: "Type Scorpion", code: `skor = 100\nprint("Skor: " + skor)`, expected: /Skor: ?100/, goal: "Program harus menampilkan Skor: 100", hint: "Tulisan tidak bisa ditambah angka. Ubah dengan str()." },
  { id: "b5", monster: "🐌", name: "Indent Snail", code: `for i in range(3):\nprint("Lari!")`, expected: /Lari![\s\S]*Lari![\s\S]*Lari!/, goal: "Program harus menampilkan Lari! 3 kali", hint: "Isi loop harus menjorok (4 spasi)." },
  { id: "b6", monster: "🦇", name: "Index Bat", code: `warna = ["merah", "hijau", "biru"]\nprint(warna[3])`, expected: /biru/, goal: "Program harus menampilkan biru", hint: "Index terakhir dari list 3 item adalah 2." },
  { id: "b7", monster: "🐍", name: "Bracket Snake", code: `angka = int(input("Angka: ")\nprint(angka * 2)`, inputs: ["21"], expected: /42/, goal: "Dengan input 21, program harus menampilkan 42", hint: "Hitung jumlah kurung buka dan kurung tutup di baris pertama." },
  { id: "b8", monster: "🦎", name: "Equal Lizard", code: `kunci = "rahasia"\nif kunci = "rahasia":\n    print("Pintu terbuka")`, expected: /Pintu terbuka/, goal: "Program harus menampilkan Pintu terbuka", hint: "Untuk membandingkan, pakai == (dua tanda sama dengan)." },
  { id: "b9", monster: "🐙", name: "Return Octopus", code: `def kali3(x):\n    hasil = x * 3\n\nprint(kali3(4))`, expected: /(^|\D)12(\D|$)/, goal: "Program harus menampilkan 12", hint: "Function belum mengirim hasilnya keluar. Tambahkan return." },
  { id: "b10", monster: "🐲", name: "Loop Dragon", code: `hitung = 1\nwhile hitung <= 3:\n    print(hitung)`, expected: /^\s*1\s+2\s+3\s*$/, goal: "Program harus menampilkan 1, 2, 3 lalu berhenti", hint: "Loop ini tidak pernah berhenti! Tambahkan hitung += 1 di dalam loop." },
];

/* ---------------- MINI GAME 2: Code Sorting ---------------- */
const SORT_ROUNDS = [
  { id: "s1", title: "Simpan lalu tampilkan nama", lines: [`nama = "Miftah"`, `print(nama)`], output: "Miftah" },
  { id: "s2", title: "Hitung total belanja", lines: [`harga = 5000`, `jumlah = 3`, `total = harga * jumlah`, `print(total)`], output: "15000" },
  { id: "s3", title: "Tanya umur lalu cek", lines: [`umur = int(input("Umur? "))`, `if umur >= 17:`, `    print("Boleh buat KTP")`, `else:`, `    print("Belum boleh")`], output: "(tergantung input)" },
  { id: "s4", title: "Hitung mundur", lines: [`n = 3`, `while n > 0:`, `    print(n)`, `    n -= 1`, `print("Mulai!")`], output: "3 2 1 Mulai!" },
  { id: "s5", title: "Function sapa", lines: [`def sapa(nama):`, `    print("Halo", nama)`, `sapa("Sari")`], output: "Halo Sari" },
  { id: "s6", title: "Isi tas lalu tampilkan", lines: [`tas = []`, `tas.append("peta")`, `for barang in tas:`, `    print(barang)`], output: "peta" },
];

/* ---------------- MINI GAME 3: Output Hunter ---------------- */
const OUTPUT_ROUNDS = [
  { id: "o1", code: `x = 5\nx = x + 2\nprint(x)`, options: ["5", "7", "x + 2", "52"], answer: 1, explain: "x mula-mula 5, lalu diisi ulang dengan 5 + 2 = 7." },
  { id: "o2", code: `print("3" + "4")`, options: ["7", "34", "3 + 4", "Error"], answer: 1, explain: "Keduanya tulisan, jadi disambung → 34." },
  { id: "o3", code: `print("ha" * 3)`, options: ["ha3", "hahaha", "ha ha ha", "Error"], answer: 1, explain: "String dikali angka = diulang. → hahaha" },
  { id: "o4", code: `a = 10\nb = 3\nprint(a % b)`, options: ["3", "1", "3.33", "0"], answer: 1, explain: "% adalah sisa bagi. 10 dibagi 3 = 3 sisa 1." },
  { id: "o5", code: `for i in range(3):\n    print(i)`, options: ["1 2 3", "0 1 2", "0 1 2 3", "3"], answer: 1, explain: "range(3) dimulai dari 0 → 0, 1, 2." },
  { id: "o6", code: `nama = "python"\nprint(nama.upper())`, options: ["python", "Python", "PYTHON", "upper"], answer: 2, explain: ".upper() mengubah semua huruf menjadi kapital." },
  { id: "o7", code: `data = [4, 8, 15]\nprint(len(data))`, options: ["27", "3", "15", "2"], answer: 1, explain: "len() menghitung jumlah item, bukan menjumlahkan isinya." },
  { id: "o8", code: `def f(x):\n    return x * x\nprint(f(3) + 1)`, options: ["7", "9", "10", "16"], answer: 2, explain: "f(3) = 9, lalu + 1 = 10." },
  { id: "o9", code: `n = 7\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")`, options: ["Genap", "Ganjil", "7", "Error"], answer: 1, explain: "7 % 2 = 1, bukan 0 → Ganjil." },
  { id: "o10", code: `kata = "QUEST"\nprint(kata[0] + kata[-1])`, options: ["QT", "QU", "ST", "Q-1"], answer: 0, explain: "kata[0] = Q, kata[-1] = T → QT." },
];

/* ---------------- MINI GAME 4: Variable Box ---------------- */
const VARBOX_ROUNDS = [
  { id: "v1", code: `nama = "Miftah"\numur = 23`, vars: [{ name: "nama", answer: "Miftah" }, { name: "umur", answer: "23" }], explain: "Setiap kotak menyimpan nilai yang dimasukkan dengan tanda =." },
  { id: "v2", code: `a = 5\nb = a\na = 10`, vars: [{ name: "a", answer: "10" }, { name: "b", answer: "5" }], explain: "b mendapat salinan isi a saat itu (5). Setelah a diganti 10, b tetap 5." },
  { id: "v3", code: `koin = 100\nkoin = koin - 30\nkoin += 5`, vars: [{ name: "koin", answer: "75" }], explain: "100 - 30 = 70, lalu + 5 = 75." },
  { id: "v4", code: `x = 3\ny = x * 2\nz = x + y`, vars: [{ name: "x", answer: "3" }, { name: "y", answer: "6" }, { name: "z", answer: "9" }], explain: "y = 3 × 2 = 6, z = 3 + 6 = 9." },
  { id: "v5", code: `depan = "Py"\nbelakang = "thon"\nkata = depan + belakang`, vars: [{ name: "kata", answer: "Python" }], explain: "String disambung: \"Py\" + \"thon\" = \"Python\"." },
  { id: "v6", code: `a = 1\nb = 2\na, b = b, a`, vars: [{ name: "a", answer: "2" }, { name: "b", answer: "1" }], explain: "a, b = b, a menukar isi kedua kotak!" },
];

/* ---------------- PLAYGROUND CHALLENGES ---------------- */
const PLAYGROUND_CHALLENGES = [
  {
    id: "p1", title: "Kotak Nama", icon: "📦",
    instruction: "Masukkan nama kamu ke dalam variable <code>nama</code>, lalu jalankan.",
    starter: `nama = ""\nprint(nama)`,
    expect: { code: [[/nama\s*=\s*["'][^"'\s][^"']*["']/, "Isi tanda kutip dengan namamu, misalnya nama = \"Miftah\""]], output: [[/\S/, "Output masih kosong. Isi dulu kotak nama-nya."]] },
    hints: ["Kotak nama masih kosong: <code>\"\"</code>", "Ketik namamu di antara tanda kutip.", "Contoh: <code>nama = \"Miftah\"</code>"],
  },
  {
    id: "p2", title: "Sapa Teman", icon: "👋",
    instruction: "Tanyakan nama teman dengan <code>input()</code>, lalu tampilkan <code>Halo, [nama]!</code> menggunakan f-string. Jawaban akan diminta lewat popup saat program dijalankan.",
    starter: `teman = input("Nama teman? ")\n`,
    inputs: ["Rina"],
    expect: { output: [[/Halo, \S+!/, "Tampilkan dengan format: Halo, [nama]!"]], code: [[/f["']/, "Gunakan f-string."]] },
    hints: ["Gunakan <code>print(f\"...\")</code>", "Masukkan <code>{teman}</code> ke dalam f-string.", "<code>print(f\"Halo, {teman}!\")</code>"],
  },
  {
    id: "p3", title: "Luas Kamar", icon: "📐",
    instruction: "Buat variable <code>panjang = 4</code> dan <code>lebar = 3</code>, hitung <code>luas</code>, lalu tampilkan <code>Luas kamar: 12</code>.",
    starter: `panjang = 4\nlebar = 3\n`,
    expect: { output: [[/Luas kamar:?\s*12/, "Output-nya harus: Luas kamar: 12"]], code: [[/luas\s*=/, "Simpan hasilnya ke variable luas."]] },
    hints: ["Luas = panjang × lebar.", "<code>luas = panjang * lebar</code>", "<code>print(\"Luas kamar:\", luas)</code>"],
  },
  {
    id: "p4", title: "Genap atau Ganjil", icon: "⚖️",
    instruction: "Tanyakan sebuah angka (int). Tampilkan <code>Genap</code> jika habis dibagi 2, selain itu <code>Ganjil</code>.",
    starter: `angka = int(input("Angka: "))\n`,
    inputs: ["8"],
    tests: [{ inputs: ["8"], output: [/Genap/, "8 seharusnya Genap."] }, { inputs: ["7"], output: [/Ganjil/, "7 seharusnya Ganjil."] }],
    hints: ["Gunakan sisa bagi <code>%</code>.", "<code>if angka % 2 == 0:</code>", "Lalu <code>else:</code> untuk Ganjil."],
  },
  {
    id: "p5", title: "Tabel Perkalian", icon: "✖️",
    instruction: "Tampilkan tabel perkalian 5 dari <code>5 x 1 = 5</code> sampai <code>5 x 10 = 50</code> menggunakan loop.",
    starter: `for i in range(1, 11):\n    `,
    expect: { output: [[/5 x 1 = 5\b/, "Baris pertama harus: 5 x 1 = 5"], [/5 x 10 = 50/, "Baris terakhir harus: 5 x 10 = 50"]], code: [[/for|while/, "Gunakan loop."]] },
    hints: ["Gunakan f-string di dalam loop.", "<code>f\"5 x {i} = {5 * i}\"</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(f\"5 x {i} = {5 * i}\")</code>"],
  },
  {
    id: "p6", title: "Nilai Terbesar", icon: "🏅",
    instruction: "Buat function <code>terbesar(daftar)</code> yang me-return angka terbesar dari list <b>tanpa</b> memakai max(). Tampilkan <code>terbesar([3, 9, 2, 7])</code> → 9.",
    starter: `def terbesar(daftar):\n    hasil = daftar[0]\n    \n\nprint(terbesar([3, 9, 2, 7]))`,
    expect: { output: [[/(^|\D)9(\D|$)/, "Hasilnya harus 9."]], code: [[/for\s/, "Gunakan loop untuk membandingkan setiap angka."], [/return/, "Gunakan return."]] },
    check: (code) => (/max\s*\(/.test(code) ? "Coba tanpa max() ya — pakai loop dan if." : null),
    hints: ["Loop setiap angka di daftar.", "Jika angka lebih besar dari hasil, ganti hasil dengan angka itu.", "<code>for a in daftar:</code> → <code>if a > hasil:</code> → <code>hasil = a</code>, lalu <code>return hasil</code> di luar loop."],
  },
];
