/* =========================================================
   PYTHON QUEST — data-lessons.js
   SEMUA MATERI ada di sini. Mau menambah lesson baru?
   Cukup tambahkan objek baru ke array LESSONS.

   Format lesson:
   {
     id: "w1-1",            // unik
     world: 1,              // nomor world
     icon: "🐣",
     title: "Judul Quest",
     topic: "print()",      // topik singkat
     story: "Cerita pendek",
     concept: ["paragraf 1", "paragraf 2"],   // boleh pakai <code> dan <b>
     analogy: "Analogi kehidupan sehari-hari",
     example: `kode contoh`,
     inputs: ["jawaban input"],               // opsional, untuk input()
     breakdown: [["potongan kode", "penjelasan"]],
     flow: ["langkah 1", "langkah 2"],        // opsional, visualisasi alur
     tryNote: "Instruksi coba sendiri",
     challenge: {
       task: "Instruksi challenge",
       starter: `kode awal`,
       inputs: [],
       expect: {
         output: [/regex/ atau [/regex/, "pesan jika gagal"]],
         notOutput: [...],
         code: [...],          // dicek pada kode (tanpa comment)
       },
       tests: [{ inputs: [...], output: /regex/ }],  // opsional, beberapa kali tes
       check: (code, output) => null | "pesan error",  // opsional
       hints: ["hint kecil", "hint lebih jelas", "hampir jawaban"],
       success: "Pesan sukses",
     }
   }
   ========================================================= */

const WORLDS = [
  { id: 1, icon: "🌱", name: "Python Village", desc: "Fondasi: print, variable, angka, string, input", color: "#22c55e" },
  { id: 2, icon: "🌲", name: "Logic Forest", desc: "Boolean, perbandingan, if, elif, else, and/or/not", color: "#16a34a" },
  { id: 3, icon: "🏜️", name: "Loop Desert", desc: "Mengulang perintah: while, for, range, break, continue", color: "#f59e0b" },
  { id: 4, icon: "🏰", name: "Function Castle", desc: "Membuat mesin sendiri: def, parameter, return, scope", color: "#8b5cf6" },
  { id: 5, icon: "🌊", name: "Data Ocean", desc: "Menyimpan banyak data: list, tuple, dictionary, set", color: "#0ea5e9" },
  { id: 6, icon: "🦇", name: "Bug Cave", desc: "Membaca error & debugging tanpa panik", color: "#ef4444" },
  { id: 7, icon: "⚔️", name: "Python Adventure", desc: "Mini project: gabungkan semua ilmu + FINAL QUEST", color: "#0f766e" },
];

const LESSONS = [
  /* ===================== WORLD 1 — PYTHON VILLAGE ===================== */
  {
    id: "w1-1", world: 1, icon: "🐣", title: "Bertemu Python", topic: "Apa itu programming & print()",
    story: "Selamat datang di <b>Python Village</b>! 🌱 Kamu adalah seorang <b>Python Explorer</b> yang baru tiba. Kepala desa tersenyum dan berkata: <i>\"Untuk memulai petualangan, kamu harus membuat Python berbicara!\"</i>",
    concept: [
      "<b>Programming</b> itu sebenarnya cuma <b>memberi perintah ke komputer</b>. Mirip memberi resep ke koki: langkah demi langkah, berurutan.",
      "<b>Python</b> adalah salah satu \"bahasa\" untuk memberi perintah itu. Tulisannya mirip bahasa Inggris sederhana, makanya cocok untuk pemula.",
      "Cara kerjanya: kamu menulis perintah → Python membacanya dari <b>atas ke bawah</b> → hasilnya muncul di layar. Hasil ini disebut <b>output</b>.",
      "Perintah pertama kita: <code>print()</code>. Artinya: <i>\"Python, tolong tampilkan ini ke layar!\"</i>",
    ],
    analogy: "🗣️ <code>print()</code> itu seperti pengeras suara. Apa pun yang kamu taruh di dalam kurungnya akan diumumkan ke layar.",
    example: `print("Halo Dunia!")`,
    breakdown: [
      ["print", "Nama perintahnya. Artinya: tampilkan!"],
      ["( )", "Kurung = tempat menaruh apa yang mau ditampilkan."],
      ["\"Halo Dunia!\"", "Tulisan yang mau ditampilkan. Tulisan harus diapit tanda kutip supaya Python tahu ini teks biasa, bukan perintah."],
    ],
    flow: ["✍️ Kamu menulis print(\"Halo Dunia!\")", "🐍 Python membaca perintahnya", "🖥️ Layar menampilkan: Halo Dunia!"],
    tryNote: "Coba ganti tulisan di dalam tanda kutip dengan kalimat apa saja, lalu tekan RUN. Bebas bereksperimen, tidak ada yang bisa rusak!",
    challenge: {
      task: "Buat Python berbicara! Tulis kode yang menampilkan tulisan <code>Halo Dunia!</code> ke layar.",
      starter: `# Tulis kodemu di bawah baris ini\n`,
      expect: {
        output: [[/Halo Dunia!/, "Output-nya harus berisi tulisan Halo Dunia! (perhatikan huruf besar-kecil dan tanda seru)."]],
        code: [[/print\s*\(/, "Gunakan perintah print() untuk menampilkan tulisan."]],
      },
      hints: [
        "Perintah untuk menampilkan sesuatu ke layar namanya <code>print</code>.",
        "Tulisannya harus ada di dalam kurung dan diapit tanda kutip: <code>print(\"...\")</code>",
        "Hampir! Formatnya: <code>print(\"Halo ......!\")</code> — isi titik-titiknya.",
      ],
      success: "Python akhirnya berbicara! 🐍💬",
    },
  },
  {
    id: "w1-2", world: 1, icon: "📦", title: "Kotak Ajaib", topic: "Variable",
    story: "Seorang NPC bernama <b>Budi</b> kehilangan kotak penyimpan namanya. 😢 <i>\"Tolong bantu aku membuat kotak bernama <code>nama</code>!\"</i>",
    concept: [
      "Variable itu seperti <b>kotak yang punya nama</b>. Kita bisa memasukkan sesuatu ke dalam kotak itu, lalu memakainya lagi nanti.",
      "Tanda <code>=</code> di Python <b>bukan</b> \"sama dengan\" seperti di matematika. Artinya: <b>masukkan</b> yang di kanan ke dalam kotak di kiri.",
      "Saat kita menulis <code>print(nama)</code> <b>tanpa tanda kutip</b>, Python membuka kotak <code>nama</code> dan menampilkan isinya.",
    ],
    analogy: "📦 Bayangkan kotak sepatu yang ditempel label \"nama\". Di dalamnya ada kertas bertuliskan \"Budi\".",
    example: `nama = "Budi"\nprint(nama)`,
    breakdown: [
      ["nama", "Nama kotaknya (label di luar kotak)."],
      ["=", "Masukkan ke dalam kotak."],
      ["\"Budi\"", "Isi kotaknya — sebuah tulisan."],
      ["print(nama)", "Buka kotak bernama nama, lalu tampilkan isinya → Budi"],
    ],
    flow: ["📦 Buat kotak bernama nama", "✉️ Masukkan \"Budi\" ke dalamnya", "🔓 print(nama) membuka kotak", "🖥️ Output: Budi"],
    tryNote: "Ganti \"Budi\" dengan namamu sendiri. Coba juga print(\"nama\") pakai kutip — apa bedanya?",
    challenge: {
      task: "Buat kotak bernama <code>nama</code> yang berisi <code>\"Miftah\"</code>, lalu tampilkan isinya dengan <code>print</code>.",
      starter: `nama = ""\nprint(nama)`,
      expect: {
        output: [[/Miftah/, "Output-nya harus menampilkan Miftah."]],
        code: [
          [/nama\s*=\s*["']Miftah["']/, "Masukkan \"Miftah\" ke kotak nama: nama = \"Miftah\""],
          [/print\s*\(\s*nama\s*\)/, "Tampilkan isi kotak dengan print(nama) — tanpa tanda kutip di dalam kurung."],
        ],
      },
      hints: [
        "Perhatikan tanda <code>=</code>. Kita sedang memasukkan sesuatu ke dalam variable.",
        "Isi kotaknya adalah tulisan, jadi harus diapit tanda kutip, di antara <code>\"\"</code> yang sudah ada.",
        "Coba: <code>nama = \"Mi....h\"</code> lalu biarkan <code>print(nama)</code>.",
      ],
      success: "Budi senang sekali! Kotaknya sudah kembali 📦✨",
    },
  },
  {
    id: "w1-3", world: 1, icon: "⌨️", title: "Python Bertanya", topic: "input()",
    story: "Penjaga gerbang desa ingin tahu nama setiap pengunjung. Tapi dia pemalu. Bantu dia membuat program yang bisa <b>bertanya</b>!",
    concept: [
      "<code>input()</code> membuat Python <b>bertanya</b> kepada pengguna, lalu <b>menunggu</b> jawaban yang diketik.",
      "Jawabannya bisa langsung disimpan ke dalam kotak (variable).",
      "Di website ini, jawaban user ditulis di kotak <b>📝 Input Program</b> di bawah editor. Satu baris = satu jawaban.",
    ],
    analogy: "🎤 <code>input()</code> itu seperti wawancara: Python mengajukan pertanyaan, kamu menjawab, lalu jawabannya dicatat.",
    example: `nama = input("Siapa nama kamu? ")\nprint("Halo", nama)`,
    inputs: ["Miftah"],
    breakdown: [
      ["input(\"Siapa nama kamu? \")", "Python bertanya dan menunggu jawaban."],
      ["nama =", "Jawabannya disimpan ke kotak bernama nama."],
      ["print(\"Halo\", nama)", "Tampilkan \"Halo\" lalu isi kotak nama. Tanda koma = beri spasi di antaranya."],
    ],
    flow: ["🐍 Python: \"Siapa nama kamu?\"", "⌨️ User mengetik: Miftah", "📦 nama = \"Miftah\"", "⚙️ Python memproses", "🖥️ Output: Halo Miftah"],
    tryNote: "Ganti jawaban di kotak Input Program (misalnya namamu), lalu RUN lagi.",
    challenge: {
      task: "Buat program yang bertanya <code>Kamu dari kota mana? </code>, simpan jawabannya ke variable <code>kota</code>, lalu tampilkan <code>Selamat datang, orang</code> diikuti nama kotanya.<br><small>Jawaban tes: <b>Bandung</b></small>",
      starter: `kota = \nprint("Selamat datang, orang", kota)`,
      inputs: ["Bandung"],
      expect: {
        output: [[/Selamat datang, orang Bandung/, "Output-nya harus: Selamat datang, orang Bandung"]],
        code: [[/kota\s*=\s*input\s*\(/, "Simpan jawaban input() ke dalam kotak kota: kota = input(...)"]],
      },
      hints: [
        "Kotak <code>kota</code> harus diisi dengan jawaban dari pertanyaan.",
        "Untuk bertanya, pakai <code>input(\"pertanyaan\")</code>.",
        "Lengkapi baris pertama: <code>kota = input(\"Kamu dari kota ....? \")</code>",
      ],
      success: "Penjaga gerbang sekarang bisa menyapa semua pengunjung! 🏡",
    },
  },
  {
    id: "w1-4", world: 1, icon: "🧮", title: "Pedang Kalkulator", topic: "Operator matematika",
    story: "Di toko senjata desa, sebuah pedang dijual <b>Rp10.000</b>. Kamu ingin membeli <b>3</b>. Daripada menghitung manual, ayo suruh Python! ⚔️",
    concept: [
      "Python bisa jadi kalkulator super. Simbolnya: <code>+</code> tambah, <code>-</code> kurang, <code>*</code> kali (bukan x!), <code>/</code> bagi.",
      "Ada juga: <code>//</code> bagi dibulatkan ke bawah, <code>%</code> sisa bagi, <code>**</code> pangkat.",
      "Angka <b>tidak</b> pakai tanda kutip. <code>\"5\"</code> itu tulisan, <code>5</code> itu angka. Ribuan juga tanpa titik: tulis <code>10000</code>, bukan <code>10.000</code>.",
    ],
    analogy: "🛒 Seperti kasir di minimarket: harga × jumlah = total. Bedanya, Python tidak pernah salah hitung.",
    example: `harga = 10000\njumlah = 3\n\ntotal = harga * jumlah\n\nprint(total)`,
    breakdown: [
      ["harga = 10000", "Kotak harga berisi angka 10000."],
      ["jumlah = 3", "Kotak jumlah berisi angka 3."],
      ["total = harga * jumlah", "Python menghitung 10000 × 3 = 30000, lalu hasilnya disimpan di kotak total."],
      ["print(total)", "Tampilkan isi kotak total → 30000"],
    ],
    tryNote: "Coba ganti operatornya dengan +, -, / atau ** dan lihat hasilnya. Coba juga 10 % 3!",
    challenge: {
      task: "Kamu membeli <b>4</b> ramuan seharga <code>2500</code> per botol, dan membayar dengan uang <code>20000</code>. Hitung <code>total</code>, lalu <code>kembalian</code>, dan tampilkan kembaliannya.<br><small>Hasil yang benar: <b>10000</b></small>",
      starter: `harga = 2500\njumlah = 4\nuang = 20000\n\n# hitung total, lalu kembalian\n\n\nprint(kembalian)`,
      expect: {
        output: [[/(^|\n)\s*10000\s*($|\n)/, "Kembaliannya seharusnya 10000."]],
        code: [
          [/\*/, "Gunakan * untuk mengalikan harga dengan jumlah."],
          [/kembalian\s*=[^\n]*-/, "Hitung kembalian dengan pengurangan (-), jangan langsung menulis angkanya ya 😉"],
        ],
      },
      hints: [
        "Langkahnya: total dulu, baru kembalian. Kembalian = uang dikurangi total.",
        "<code>total = harga * jumlah</code>",
        "Tambahkan juga: <code>kembalian = uang - ....</code>",
      ],
      success: "Kamu berhasil belanja tanpa kalkulator! 🧮⚔️",
    },
  },
  {
    id: "w1-5", world: 1, icon: "📝", title: "Catatan Rahasia", topic: "Comment (#)",
    story: "Kamu menemukan gulungan kode tua penuh catatan kecil. Anehnya, Python tidak pernah membaca catatan itu... Ternyata itu <b>catatan rahasia</b>!",
    concept: [
      "Tanda <code>#</code> membuat <b>comment</b> (komentar). Semua tulisan setelah <code>#</code> di baris itu akan <b>diabaikan</b> Python.",
      "Gunanya: memberi catatan untuk <b>manusia</b> — untuk dirimu di masa depan, atau temanmu yang membaca kode.",
      "Comment juga bisa dipakai untuk \"mematikan\" sementara satu baris kode tanpa menghapusnya.",
    ],
    analogy: "🗒️ Seperti tulisan pensil di pinggir buku resep: \"jangan terlalu asin!\". Kokinya membaca, tapi itu bukan bagian dari resep.",
    example: `# Program sapaan pertamaku\nprint("Halo!")  # ini juga comment\n# print("Baris ini tidak dijalankan")`,
    breakdown: [
      ["# Program sapaan pertamaku", "Comment satu baris penuh. Diabaikan Python."],
      ["print(\"Halo!\")  # ini juga comment", "Kodenya dijalankan, tapi bagian setelah # diabaikan."],
      ["# print(...)", "Baris kode yang \"dimatikan\". Tidak akan muncul di output."],
    ],
    tryNote: "Hapus tanda # di baris terakhir, lalu RUN. Sekarang baris itu ikut dijalankan!",
    challenge: {
      task: "Kode di bawah menampilkan 2 baris. Jadikan baris <code>print(\"Rahasia bocor!\")</code> sebagai comment supaya hanya <code>Halo Explorer</code> yang muncul. Tambahkan juga <b>satu comment</b> berisi catatanmu sendiri.",
      starter: `print("Halo Explorer")\nprint("Rahasia bocor!")`,
      expect: {
        output: [[/Halo Explorer/, "Baris Halo Explorer harus tetap muncul."]],
        notOutput: [[/Rahasia bocor/, "Tulisan Rahasia bocor! masih muncul. Tambahkan # di depan baris itu."]],
      },
      check: (code) => ((code.match(/#/g) || []).length >= 2 ? null : "Tambahkan juga satu comment berisi catatanmu sendiri, misalnya: # program pertamaku"),
      hints: [
        "Tanda untuk membuat comment adalah <code>#</code>.",
        "Letakkan <code>#</code> di paling depan baris yang ingin \"dimatikan\".",
        "Contoh: <code># print(\"Rahasia bocor!\")</code> dan tambahkan baris baru <code># catatanku</code>",
      ],
      success: "Rahasia aman! 🤫 Sekarang kamu bisa menulis catatan di dalam kode.",
    },
  },
  {
    id: "w1-6", world: 1, icon: "🔢", title: "Dua Jenis Angka", topic: "Integer & Float",
    story: "Pedagang buah di pasar menimbang: <b>2</b> buah apel, beratnya <b>0.75</b> kg. Kenapa yang satu bulat dan yang satu ada komanya? 🍎",
    concept: [
      "Python punya 2 jenis angka utama: <b>int</b> (integer) = bilangan bulat seperti <code>2</code>, <code>100</code>, <code>-5</code>.",
      "<b>float</b> = bilangan desimal seperti <code>0.75</code> atau <code>3.14</code>. Di Python, desimal pakai <b>titik</b>, bukan koma!",
      "Mau tahu jenis data sebuah nilai? Pakai <code>type()</code>. Fakta unik: pembagian <code>/</code> selalu menghasilkan float, jadi <code>10 / 2</code> = <code>5.0</code>.",
    ],
    analogy: "🍎 int itu seperti menghitung buah (1, 2, 3 buah). float itu seperti menimbang (0.75 kg, 1.5 kg).",
    example: `apel = 2\nberat = 0.75\nprint(type(apel))\nprint(type(berat))\nprint(10 / 2)`,
    breakdown: [
      ["apel = 2", "Kotak apel berisi bilangan bulat (int)."],
      ["berat = 0.75", "Kotak berat berisi bilangan desimal (float)."],
      ["type(apel)", "Menanyakan jenis isi kotak apel → <class 'int'>"],
      ["10 / 2", "Pembagian selalu menghasilkan float → 5.0"],
    ],
    tryNote: "Coba print(type(\"halo\")) atau print(7 // 2). Apa hasilnya?",
    challenge: {
      task: "Buat variable <code>tinggi</code> berisi <code>1.65</code> dan <code>umur</code> berisi <code>20</code>. Tampilkan keduanya, lalu tampilkan <code>type(tinggi)</code>.",
      starter: `# buat variable tinggi dan umur\n\n\n# tampilkan keduanya\n\n\n# tampilkan jenis data tinggi\n`,
      expect: {
        output: [[/1\.65/, "Isi tinggi (1.65) harus ditampilkan."], [/(^|\D)20(\D|$)/, "Isi umur (20) harus ditampilkan."], [/float/, "Tampilkan juga type(tinggi), hasilnya harus menyebut float."]],
        code: [[/tinggi\s*=\s*1\.65/, "Buat tinggi = 1.65 (pakai titik)."], [/umur\s*=\s*20\b/, "Buat umur = 20."], [/type\s*\(\s*tinggi\s*\)/, "Gunakan type(tinggi)."]],
      },
      hints: [
        "Ingat: desimal pakai titik → <code>1.65</code>",
        "Kamu butuh 3 perintah print: untuk tinggi, umur, dan type(tinggi).",
        "<code>tinggi = 1.65</code>, <code>umur = 20</code>, lalu <code>print(tinggi)</code>, <code>print(umur)</code>, <code>print(type(....))</code>",
      ],
      success: "Kamu sekarang bisa membedakan int dan float! 🔢",
    },
  },
  {
    id: "w1-7", world: 1, icon: "🔤", title: "Tali Kata", topic: "String",
    story: "Penyair desa ingin merangkai kata-kata menjadi kalimat indah. Di Python, rangkaian huruf disebut <b>String</b>! ✍️",
    concept: [
      "<b>String</b> = tulisan/teks. Selalu diapit tanda kutip: <code>\"...\"</code> atau <code>'...'</code>.",
      "String bisa disambung dengan <code>+</code>, seperti menyambung tali. Tapi spasi tidak otomatis ditambahkan, jadi harus ditulis sendiri.",
      "Cara paling enak: <b>f-string</b>. Tulis huruf <code>f</code> sebelum kutip, lalu taruh variable di dalam <code>{ }</code>. Contoh: <code>f\"Halo {nama}\"</code>.",
      "Bonus: <code>len(teks)</code> menghitung jumlah huruf, <code>teks.upper()</code> mengubah jadi huruf besar.",
    ],
    analogy: "🧵 String itu seperti kalung manik-manik huruf. f-string itu seperti formulir dengan kolom kosong { } yang diisi otomatis.",
    example: `depan = "Python"\nbelakang = "Quest"\ngabung = depan + " " + belakang\nprint(gabung)\nprint(f"Aku sedang main {gabung}!")\nprint(len(depan))`,
    breakdown: [
      ["depan + \" \" + belakang", "Sambung \"Python\" + spasi + \"Quest\" → \"Python Quest\""],
      ["f\"Aku sedang main {gabung}!\"", "{gabung} diganti isi kotak gabung."],
      ["len(depan)", "Menghitung jumlah huruf \"Python\" → 6"],
    ],
    tryNote: "Coba print(depan.upper()) atau print(depan * 3).",
    challenge: {
      task: "Buat variable <code>nama</code> = <code>\"Sari\"</code> dan <code>hobi</code> = <code>\"membaca\"</code>. Gunakan <b>f-string</b> untuk menampilkan: <code>Sari suka membaca</code>",
      starter: `nama = "Sari"\nhobi = "membaca"\n\n# tampilkan dengan f-string\n`,
      expect: {
        output: [[/Sari suka membaca/, "Output-nya harus: Sari suka membaca"]],
        code: [[/f["']/, "Gunakan f-string ya: f\"...\""], [/\{\s*nama\s*\}/, "Masukkan {nama} ke dalam f-string."], [/\{\s*hobi\s*\}/, "Masukkan {hobi} ke dalam f-string."]],
      },
      hints: [
        "f-string diawali huruf <code>f</code> sebelum tanda kutip.",
        "Variable ditaruh di dalam kurung kurawal: <code>{nama}</code>",
        "<code>print(f\"{nama} suka {....}\")</code>",
      ],
      success: "Kalimatmu indah sekali! Sang penyair terkesan 🔤✨",
    },
  },
  {
    id: "w1-8", world: 1, icon: "🧪", title: "Ramuan Pengubah", topic: "Type conversion",
    story: "Penyihir desa memperingatkan: <i>\"Hati-hati! Jawaban dari input() selalu berupa <b>tulisan</b>, walaupun yang diketik angka.\"</i> Kamu butuh <b>ramuan pengubah</b>! 🧪",
    concept: [
      "<code>input()</code> selalu menghasilkan <b>string</b>. Jadi kalau user mengetik 5, yang tersimpan adalah <code>\"5\"</code> (tulisan).",
      "Masalahnya: <code>\"5\" + \"3\"</code> hasilnya <code>\"53\"</code> (disambung), bukan 8!",
      "Ramuan pengubahnya: <code>int()</code> mengubah ke bilangan bulat, <code>float()</code> ke desimal, <code>str()</code> ke tulisan.",
    ],
    analogy: "🧊 Seperti es batu: harus dicairkan dulu (diubah jenisnya) sebelum bisa diminum (dihitung).",
    example: `umur = input("Umur kamu? ")\numur = int(umur)\nprint(umur + 1)`,
    inputs: ["19"],
    breakdown: [
      ["umur = input(...)", "Jawaban \"19\" disimpan sebagai tulisan."],
      ["umur = int(umur)", "Ubah tulisan \"19\" menjadi angka 19, lalu simpan lagi ke kotak umur."],
      ["umur + 1", "Sekarang bisa dihitung → 20"],
    ],
    flow: ["⌨️ User mengetik 19", "📦 umur = \"19\" (tulisan)", "🧪 int(umur) → 19 (angka)", "🖥️ 19 + 1 = 20"],
    tryNote: "Hapus baris kedua (int), lalu RUN. Lihat error yang muncul — itu yang terjadi kalau lupa mengubah!",
    challenge: {
      task: "Tanyakan <code>Berapa koin kamu? </code>, ubah jawabannya menjadi angka, lalu tampilkan jumlah koin setelah ditambah <code>50</code>.<br><small>Jawaban tes: <b>120</b> → output <b>170</b></small>",
      starter: `koin = input("Berapa koin kamu? ")\n\n# ubah koin menjadi angka, lalu tampilkan koin + 50\n`,
      inputs: ["120"],
      expect: {
        output: [[/170/, "Hasilnya seharusnya 170. Kalau keluar error atau 12050, berarti koin belum diubah menjadi angka."]],
        code: [[/int\s*\(/, "Gunakan int() untuk mengubah tulisan menjadi angka."]],
      },
      hints: [
        "Jawaban input masih berupa tulisan. Ubah dulu pakai ramuan <code>int()</code>.",
        "<code>koin = int(koin)</code> lalu tampilkan hasil penjumlahan.",
        "<code>koin = int(koin)</code> lalu <code>print(koin + ..)</code>",
      ],
      success: "Ramuanmu berhasil! Tulisan berubah jadi angka 🧪✨",
    },
  },
  {
    id: "w1-9", world: 1, icon: "🎯", title: "Mini Challenge: Kasir Desa", topic: "Gabungan World 1",
    story: "Kepala desa memberimu ujian terakhir di Python Village: <b>buat program kasir</b> untuk warung desa! 🏪",
    concept: [
      "Saatnya menggabungkan semua yang sudah kamu pelajari: <code>input()</code>, <code>int()</code>, operator <code>*</code>, dan <b>f-string</b>.",
      "Tips programmer: pecah masalah besar jadi langkah kecil. 1) Tanya data → 2) Ubah ke angka → 3) Hitung → 4) Tampilkan.",
    ],
    analogy: "🧱 Seperti menyusun LEGO: setiap balok (perintah) kecil, tapi kalau disusun jadi bangunan utuh.",
    example: `barang = "Roti"\nharga = 5000\njumlah = 2\ntotal = harga * jumlah\nprint(f"{jumlah} {barang} = Rp{total}")`,
    breakdown: [
      ["barang, harga, jumlah", "Tiga kotak berisi data belanja."],
      ["total = harga * jumlah", "Hitung total belanja."],
      ["f\"{jumlah} {barang} = Rp{total}\"", "Rangkai jadi kalimat struk → 2 Roti = Rp10000"],
    ],
    tryNote: "Ubah data belanjanya. Bisakah kamu membuat programnya bertanya pakai input()?",
    challenge: {
      task: "Buat program yang bertanya <code>Nama barang? </code>, <code>Harga? </code>, dan <code>Jumlah? </code>. Lalu tampilkan <code>Total: Rp</code> diikuti hasil harga × jumlah.<br><small>Jawaban tes: <b>Susu</b>, <b>7000</b>, <b>3</b> → <b>Total: Rp21000</b></small>",
      starter: `barang = input("Nama barang? ")\n# tanya harga dan jumlah (jangan lupa ubah ke angka)\n\n\n# hitung total\n\n# tampilkan "Total: Rp..."\n`,
      inputs: ["Susu", "7000", "3"],
      expect: {
        output: [[/Total: ?Rp ?21000/, "Output-nya harus memuat: Total: Rp21000"]],
        code: [[/int\s*\(/, "Harga dan jumlah perlu diubah menjadi angka dengan int()."]],
      },
      check: (code) => ((code.match(/input\s*\(/g) || []).length >= 3 ? null : "Program harus menanyakan 3 hal: nama barang, harga, dan jumlah."),
      hints: [
        "Kamu butuh 3 input. Dua di antaranya (harga & jumlah) harus diubah dengan <code>int()</code>.",
        "<code>harga = int(input(\"Harga? \"))</code> — input dan int bisa digabung dalam satu baris!",
        "Terakhir: <code>total = harga * jumlah</code> lalu <code>print(f\"Total: Rp{total}\")</code>",
      ],
      success: "Warung desa sekarang punya kasir digital! Kamu resmi lulus Python Village 🌱🏆",
    },
  },

  /* ===================== WORLD 2 — LOGIC FOREST ===================== */
  {
    id: "w2-1", world: 2, icon: "💡", title: "Saklar Lampu", topic: "Boolean",
    story: "Kamu memasuki <b>Logic Forest</b>. 🌲 Di gerbangnya ada lampu ajaib yang hanya punya dua keadaan: <b>menyala</b> atau <b>mati</b>.",
    concept: [
      "<b>Boolean</b> adalah jenis data yang hanya punya 2 nilai: <code>True</code> (benar/ya) dan <code>False</code> (salah/tidak).",
      "Huruf depannya <b>wajib kapital</b>: <code>True</code>, bukan <code>true</code>. Dan tanpa tanda kutip!",
      "Boolean sering muncul dari pertanyaan, misalnya <code>5 > 3</code> → Python menjawab <code>True</code>.",
    ],
    analogy: "💡 Boolean itu seperti saklar lampu: cuma ON (True) atau OFF (False). Tidak ada setengah menyala.",
    example: `lampu_nyala = True\nprint(lampu_nyala)\nprint(5 > 3)\nprint(2 > 10)`,
    breakdown: [
      ["lampu_nyala = True", "Kotak berisi nilai True (ya)."],
      ["5 > 3", "Pertanyaan: apakah 5 lebih besar dari 3? → True"],
      ["2 > 10", "Apakah 2 lebih besar dari 10? → False"],
    ],
    tryNote: "Coba print(type(True)). Coba juga tulis true (huruf kecil) dan lihat errornya.",
    challenge: {
      task: "Buat variable <code>sudah_makan</code> berisi <code>False</code>, lalu tampilkan. Setelah itu tampilkan hasil pertanyaan <code>10 > 20</code>.",
      starter: `# buat variable sudah_makan\n\n# tampilkan\n\n# tampilkan hasil 10 > 20\n`,
      expect: {
        output: [[/False[\s\S]*False/, "Seharusnya muncul False dua kali."]],
        code: [[/sudah_makan\s*=\s*False/, "Isi sudah_makan dengan False (F kapital, tanpa kutip)."], [/10\s*>\s*20/, "Tampilkan juga hasil 10 > 20."]],
      },
      hints: ["Nilai Boolean untuk \"tidak/salah\" adalah <code>False</code>.", "Ingat huruf F kapital dan tanpa kutip.", "<code>sudah_makan = False</code>, <code>print(sudah_makan)</code>, <code>print(10 > 20)</code>"],
      success: "Lampu ajaib menyala! Gerbang Logic Forest terbuka 💡🌲",
    },
  },
  {
    id: "w2-2", world: 2, icon: "⚖️", title: "Timbangan Ajaib", topic: "Comparison (perbandingan)",
    story: "Seekor burung hantu bijak menunjukkan <b>timbangan ajaib</b>. 🦉 <i>\"Timbangan ini bisa menjawab pertanyaan apa pun dengan True atau False.\"</i>",
    concept: [
      "Operator perbandingan: <code>==</code> sama dengan, <code>!=</code> tidak sama, <code>></code> lebih besar, <code><</code> lebih kecil, <code>>=</code> lebih besar atau sama, <code><=</code> lebih kecil atau sama.",
      "<b>Penting!</b> <code>=</code> (satu) untuk <b>mengisi kotak</b>. <code>==</code> (dua) untuk <b>bertanya</b> apakah sama.",
      "Hasil perbandingan selalu Boolean: True atau False.",
    ],
    analogy: "⚖️ Seperti timbangan: kamu menaruh dua benda, timbangan menjawab mana yang lebih berat.",
    example: `nilai = 80\nprint(nilai >= 75)\nprint(nilai == 100)\nprint(nilai != 50)`,
    breakdown: [
      ["nilai >= 75", "Apakah 80 lebih besar atau sama dengan 75? → True"],
      ["nilai == 100", "Apakah 80 sama dengan 100? → False"],
      ["nilai != 50", "Apakah 80 tidak sama dengan 50? → True"],
    ],
    tryNote: "Coba bandingkan tulisan: print(\"apel\" == \"Apel\"). Huruf besar-kecil berpengaruh lho!",
    challenge: {
      task: "Buat <code>nilai = 75</code>. Tampilkan apakah nilai <b>lebih besar atau sama dengan</b> 70 (harus True), lalu apakah nilai <b>sama dengan</b> 100 (harus False).",
      starter: `nilai = 75\n`,
      expect: {
        output: [[/True[\s\S]*False/, "Output-nya harus True lalu False."]],
        code: [[/>=\s*70/, "Gunakan >= 70."], [/==\s*100/, "Gunakan == 100 (dua tanda sama dengan)."]],
      },
      hints: ["Bertanya \"lebih besar atau sama dengan\" pakai <code>>=</code>.", "Bertanya \"sama dengan\" pakai <code>==</code> (dua tanda =).", "<code>print(nilai >= 70)</code> lalu <code>print(nilai == ...)</code>"],
      success: "Burung hantu mengangguk bangga 🦉⚖️",
    },
  },
  {
    id: "w2-3", world: 2, icon: "🚪", title: "Penjaga Gerbang", topic: "if",
    story: "Di tengah hutan ada gerbang dengan penjaga yang tegas. 💂 Ia hanya mengizinkan orang berumur 18 tahun ke atas.",
    concept: [
      "<code>if</code> artinya <b>\"kalau\"</b>. Python hanya menjalankan kode di bawahnya <b>kalau</b> kondisinya True.",
      "Aturan penulisan: setelah kondisi wajib ada <b>titik dua</b> <code>:</code>, lalu baris di bawahnya <b>menjorok ke dalam</b> (4 spasi). Ini disebut <b>indentasi</b>.",
      "Baris yang menjorok = baris yang \"dijaga\" oleh if.",
    ],
    analogy: "💂 IF itu seperti penjaga gerbang: \"Kalau umur kamu 18 tahun atau lebih → boleh masuk.\"",
    example: `umur = 20\n\nif umur >= 18:\n    print("Boleh masuk")\n\nprint("Selesai")`,
    breakdown: [
      ["if umur >= 18:", "Penjaga bertanya: umurnya 18 atau lebih? Ya (True)."],
      ["    print(\"Boleh masuk\")", "Baris yang menjorok — hanya dijalankan kalau jawabannya True."],
      ["print(\"Selesai\")", "Tidak menjorok, jadi selalu dijalankan."],
    ],
    flow: ["📦 umur = 20", "💂 Apakah 20 >= 18?", "✅ True → masuk ke dalam if", "🖥️ Boleh masuk"],
    tryNote: "Ganti umur menjadi 15, lalu RUN. Baris \"Boleh masuk\" hilang!",
    challenge: {
      task: "Ada <code>saldo = 50000</code> dan <code>harga = 30000</code>. Gunakan <code>if</code>: <b>kalau</b> saldo lebih besar atau sama dengan harga, tampilkan <code>Beli berhasil!</code>",
      starter: `saldo = 50000\nharga = 30000\n\n# tulis if di sini\n`,
      expect: {
        output: [[/Beli berhasil!/, "Output-nya harus: Beli berhasil!"]],
        code: [[/if\s+[^\n]*saldo[^\n]*>=?[^\n]*:/, "Gunakan if dengan kondisi saldo >= harga, diakhiri titik dua."], [/\n[ \t]+print/, "print harus menjorok (4 spasi) di bawah if."]],
      },
      hints: ["Struktur: <code>if kondisi:</code> lalu baris berikutnya menjorok.", "Kondisinya: <code>saldo >= harga</code>. Jangan lupa titik dua!", "<code>if saldo >= harga:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"Beli ........!\")</code>"],
      success: "Penjaga gerbang membuka pintunya untukmu 🚪✅",
    },
  },
  {
    id: "w2-4", world: 2, icon: "🔀", title: "Rencana B", topic: "else",
    story: "Penjaga gerbang ditanya: <i>\"Kalau umurnya kurang, kok kamu diam saja?\"</i> Ia butuh <b>Rencana B</b>!",
    concept: [
      "<code>else</code> artinya <b>\"kalau tidak\"</b>. Dijalankan saat kondisi if bernilai False.",
      "<code>else</code> tidak punya kondisi sendiri, tapi tetap butuh titik dua <code>:</code> dan isinya menjorok.",
      "Jadi selalu ada salah satu yang dijalankan: isi if, <b>atau</b> isi else. Tidak pernah dua-duanya.",
    ],
    analogy: "☔ \"Kalau hujan, bawa payung. Kalau tidak, pakai topi.\"",
    example: `umur = int(input("Umur? "))\n\nif umur >= 18:\n    print("Boleh masuk")\nelse:\n    print("Belum boleh masuk")`,
    inputs: ["15"],
    breakdown: [
      ["if umur >= 18:", "Apakah 15 >= 18? False."],
      ["else:", "Karena False, Python lompat ke else."],
      ["    print(\"Belum boleh masuk\")", "Ini yang dijalankan."],
    ],
    tryNote: "Ganti input menjadi 25, lalu RUN lagi.",
    challenge: {
      task: "Tanyakan <code>Tebak angka rahasia: </code> (ubah ke int). Kalau tebakan sama dengan <code>7</code>, tampilkan <code>Tepat!</code>, kalau tidak tampilkan <code>Salah, coba lagi</code>.",
      starter: `tebakan = int(input("Tebak angka rahasia: "))\n\n`,
      tests: [
        { inputs: ["7"], output: [/Tepat!/, "Saat menebak 7, harus muncul Tepat!"] },
        { inputs: ["3"], output: [/Salah, coba lagi/, "Saat menebak 3, harus muncul Salah, coba lagi"] },
      ],
      expect: { code: [[/else\s*:/, "Gunakan else: untuk rencana B."], [/==\s*7|7\s*==/, "Bandingkan dengan == 7."]] },
      hints: ["Pakai <code>if tebakan == 7:</code>", "Setelah blok if, tambahkan <code>else:</code> (sejajar dengan if).", "<code>if tebakan == 7:</code> → print Tepat!, <code>else:</code> → print Salah, coba lagi"],
      success: "Sekarang programmu punya Rencana B 🔀",
    },
  },
  {
    id: "w2-5", world: 2, icon: "🚦", title: "Banyak Pintu", topic: "elif",
    story: "Kamu menemukan lorong dengan <b>banyak pintu</b>. Setiap pintu terbuka untuk kondisi yang berbeda. 🚪🚪🚪",
    concept: [
      "<code>elif</code> = singkatan <b>else if</b> = \"kalau tidak, coba cek ini\".",
      "Python mengecek dari atas ke bawah. Begitu ketemu yang True, ia menjalankannya dan <b>berhenti</b> mengecek yang lain.",
      "Kamu bisa punya banyak elif, dan else di akhir sebagai pilihan terakhir.",
    ],
    analogy: "🚦 Seperti lampu lalu lintas: kalau merah → berhenti, kalau kuning → pelan-pelan, selain itu → jalan.",
    example: `nilai = 82\n\nif nilai >= 85:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelif nilai >= 55:\n    print("C")\nelse:\n    print("D")`,
    breakdown: [
      ["if nilai >= 85:", "82 >= 85? False → lanjut cek."],
      ["elif nilai >= 70:", "82 >= 70? True → tampilkan B, lalu berhenti."],
      ["elif ... / else", "Tidak dicek lagi karena sudah ketemu."],
    ],
    tryNote: "Coba nilai 90, 60, dan 30. Pintu mana yang terbuka?",
    challenge: {
      task: "Tanya <code>Suhu? </code> (int). Kalau suhu <b>lebih dari 30</b> tampilkan <code>Panas</code>, kalau <b>lebih dari 20</b> tampilkan <code>Sejuk</code>, selain itu <code>Dingin</code>.",
      starter: `suhu = int(input("Suhu? "))\n\n`,
      tests: [
        { inputs: ["35"], output: [/Panas/, "Suhu 35 seharusnya Panas."] },
        { inputs: ["25"], output: [/Sejuk/, "Suhu 25 seharusnya Sejuk."] },
        { inputs: ["10"], output: [/Dingin/, "Suhu 10 seharusnya Dingin."] },
      ],
      expect: { code: [[/elif\s/, "Gunakan elif untuk pintu kedua."]] },
      hints: ["Urutannya: if (> 30) → elif (> 20) → else.", "Lebih dari = <code>></code>. Jangan lupa titik dua di setiap baris.", "<code>if suhu > 30:</code> … <code>elif suhu > 20:</code> … <code>else:</code> …"],
      success: "Semua pintu terbuka di saat yang tepat 🚦",
    },
  },
  {
    id: "w2-6", world: 2, icon: "🪆", title: "Pintu di Dalam Pintu", topic: "Nested if",
    story: "Untuk masuk ke konser peri hutan, kamu harus punya <b>tiket</b>. Setelah itu, petugas kedua mengecek <b>umurmu</b>. 🎫",
    concept: [
      "<b>Nested if</b> = if di dalam if. Pengecekan kedua hanya terjadi kalau pengecekan pertama lolos.",
      "If yang di dalam harus menjorok <b>lebih dalam lagi</b> (8 spasi).",
    ],
    analogy: "🪆 Seperti boneka matryoshka: buka boneka luar dulu, baru bisa membuka boneka di dalamnya.",
    example: `punya_tiket = True\numur = 20\n\nif punya_tiket:\n    if umur >= 17:\n        print("Silakan masuk")\n    else:\n        print("Umur belum cukup")\nelse:\n    print("Beli tiket dulu")`,
    breakdown: [
      ["if punya_tiket:", "Pengecekan pertama: punya tiket?"],
      ["    if umur >= 17:", "Pengecekan kedua (menjorok), hanya kalau punya tiket."],
      ["else: (paling luar)", "Untuk yang tidak punya tiket."],
    ],
    tryNote: "Ubah punya_tiket menjadi False. Ubah umur menjadi 12. Perhatikan output-nya.",
    challenge: {
      task: "Ada <code>punya_kunci = True</code> dan <code>level = 3</code>. Kalau punya kunci: cek lagi, kalau level >= 5 tampilkan <code>Peti terbuka!</code>, kalau tidak tampilkan <code>Level belum cukup</code>. Kalau tidak punya kunci tampilkan <code>Cari kunci dulu</code>.",
      starter: `punya_kunci = True\nlevel = 3\n\n`,
      expect: {
        output: [[/Level belum cukup/, "Dengan level 3, harus muncul: Level belum cukup"]],
        code: [[/if\s+punya_kunci[^\n]*:\s*\n\s+if\s/, "Gunakan if di dalam if punya_kunci (nested)."]],
      },
      hints: ["Pertama cek <code>if punya_kunci:</code>, lalu di dalamnya <code>if level >= 5:</code>", "If yang di dalam menjorok 4 spasi, print di dalamnya menjorok 8 spasi.", "Lihat contoh di atas — strukturnya persis sama, tinggal ganti nama variabel dan tulisannya."],
      success: "Peti misterius berhasil kamu analisis 🪆",
    },
  },
  {
    id: "w2-7", world: 2, icon: "🔗", title: "Mantra Penghubung", topic: "and, or, not",
    story: "Penyihir pohon mengajarkan 3 <b>mantra penghubung</b>: <code>and</code>, <code>or</code>, dan <code>not</code>. 🧙",
    concept: [
      "<code>and</code> = <b>dan</b>. True hanya kalau <b>kedua</b> kondisi True.",
      "<code>or</code> = <b>atau</b>. True kalau <b>salah satu</b> saja True.",
      "<code>not</code> = <b>kebalikan</b>. <code>not True</code> → False.",
    ],
    analogy: "🚗 Boleh menyetir kalau umur ≥ 17 <b>dan</b> punya SIM. Boleh libur kalau hari Sabtu <b>atau</b> Minggu.",
    example: `umur = 18\npunya_sim = True\n\nif umur >= 17 and punya_sim:\n    print("Boleh menyetir")\n\nhari = "Minggu"\nif hari == "Sabtu" or hari == "Minggu":\n    print("Libur!")\n\nprint(not punya_sim)`,
    breakdown: [
      ["umur >= 17 and punya_sim", "True and True → True."],
      ["hari == \"Sabtu\" or hari == \"Minggu\"", "False or True → True."],
      ["not punya_sim", "Kebalikan dari True → False."],
    ],
    tryNote: "Ubah punya_sim jadi False. Apa yang berubah?",
    challenge: {
      task: "Ada <code>punya_tiket = True</code> dan <code>uang = 20000</code>. Kalau punya tiket <b>dan</b> uang lebih dari atau sama dengan 15000, tampilkan <code>Siap berangkat!</code>",
      starter: `punya_tiket = True\nuang = 20000\n\n`,
      expect: {
        output: [[/Siap berangkat!/, "Output-nya harus: Siap berangkat!"]],
        code: [[/\band\b/, "Gunakan and untuk menggabungkan dua kondisi."]],
      },
      hints: ["Dua kondisi digabung pakai <code>and</code>.", "Kondisi kedua: <code>uang >= 15000</code>", "<code>if punya_tiket and uang >= 15000:</code>"],
      success: "Mantra penghubung berhasil kamu kuasai 🔗✨",
    },
  },
  {
    id: "w2-8", world: 2, icon: "🎓", title: "Logic Challenge: Sistem Nilai", topic: "Gabungan World 2",
    story: "Kampus di tepi hutan butuh <b>sistem nilai otomatis</b>. Dosen-dosen kewalahan menilai ratusan mahasiswa! 🎓",
    concept: [
      "Gabungkan <code>input</code>, <code>int</code>, <code>if/elif/else</code>.",
      "Aturan: nilai ≥ 85 → <b>A</b>, ≥ 70 → <b>B</b>, ≥ 55 → <b>C</b>, selain itu → <b>D</b>.",
      "Program akan dites dengan beberapa nilai berbeda secara otomatis.",
    ],
    analogy: "🏫 Seperti dosen yang mencocokkan nilai dengan tabel grade.",
    example: `nilai = int(input("Nilai: "))\nif nilai >= 85:\n    print("Grade A")\n# lanjutkan sendiri...`,
    inputs: ["90"],
    breakdown: [["int(input(...))", "Tanya nilai sekaligus ubah ke angka."], ["if / elif / else", "Cek dari grade tertinggi ke terendah."]],
    tryNote: "Lengkapi contoh di atas sebagai pemanasan.",
    challenge: {
      task: "Buat program yang menanyakan <code>Nilai: </code> lalu menampilkan <code>Grade A</code>, <code>Grade B</code>, <code>Grade C</code>, atau <code>Grade D</code> sesuai aturan.",
      starter: `nilai = int(input("Nilai: "))\n\n`,
      tests: [
        { inputs: ["90"], output: [/Grade A/, "Nilai 90 harus Grade A."] },
        { inputs: ["78"], output: [/Grade B/, "Nilai 78 harus Grade B."] },
        { inputs: ["60"], output: [/Grade C/, "Nilai 60 harus Grade C."] },
        { inputs: ["40"], output: [/Grade D/, "Nilai 40 harus Grade D."] },
      ],
      hints: ["Mulai dari kondisi paling tinggi: <code>if nilai >= 85:</code>", "Lanjutkan dengan <code>elif nilai >= 70:</code> dan <code>elif nilai >= 55:</code>", "Terakhir <code>else:</code> untuk Grade D."],
      success: "Para dosen berterima kasih! Kamu menaklukkan Logic Forest 🌲🏆",
    },
  },

  /* ===================== WORLD 3 — LOOP DESERT ===================== */
  {
    id: "w3-1", world: 3, icon: "🔁", title: "Kenalan dengan Loop", topic: "Apa itu loop?",
    story: "Selamat datang di <b>Loop Desert</b>! 🏜️ Kepala karavan menyuruhmu meneriakkan \"Halo\" 5 kali ke arah oasis. Masa kamu tulis print 5 kali?",
    concept: [
      "<b>Loop</b> (perulangan) = menyuruh Python melakukan sesuatu <b>berkali-kali</b> tanpa menulis ulang kodenya.",
      "Bentuk paling sederhana: <code>for i in range(5):</code> → ulangi 5 kali.",
      "Kode yang diulang ditulis menjorok di bawahnya (sama seperti if).",
    ],
    analogy: "🔁 Loop itu seperti menyuruh seseorang: \"Tolong lompat 5 kali.\" Kamu cukup bilang sekali, dia melakukannya 5 kali.",
    example: `for i in range(5):\n    print("Halo")`,
    breakdown: [
      ["for i in range(5):", "Python, ulangi sebanyak 5 kali."],
      ["    print(\"Halo\")", "Yang diulang: bilang Halo."],
    ],
    flow: ["🔁 Putaran 1 → Halo", "🔁 Putaran 2 → Halo", "🔁 … sampai putaran 5", "✅ Selesai"],
    tryNote: "Ganti 5 menjadi 10. Atau ganti tulisannya!",
    challenge: {
      task: "Gunakan loop <code>for</code> untuk menampilkan <code>Semangat!</code> sebanyak <b>3 kali</b>.",
      starter: `# gunakan for dan range\n`,
      expect: { code: [[/for\s+\w+\s+in\s+range\s*\(/, "Gunakan for ... in range(...)."]] },
      check: (code, out) => ((out.match(/Semangat!/g) || []).length === 3 ? null : `"Semangat!" harus muncul tepat 3 kali (sekarang ${(out.match(/Semangat!/g) || []).length} kali).`),
      hints: ["Strukturnya: <code>for i in range(berapa kali):</code>", "Jangan lupa print-nya menjorok ke dalam.", "<code>for i in range(3):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"Semangat!\")</code>"],
      success: "Teriakanmu menggema di gurun 🔁🏜️",
    },
  },
  {
    id: "w3-2", world: 3, icon: "⏳", title: "Selama Masih...", topic: "while",
    story: "Untanya bisa berjalan <b>selama</b> energinya masih ada. Setiap langkah, energi berkurang satu. 🐫",
    concept: [
      "<code>while</code> artinya <b>\"selama\"</b>. Loop terus berjalan <b>selama</b> kondisinya True.",
      "<b>Hati-hati!</b> Harus ada sesuatu yang berubah di dalam loop. Kalau tidak, loop tidak akan pernah berhenti (infinite loop).",
      "<code>energi -= 1</code> adalah singkatan dari <code>energi = energi - 1</code>.",
    ],
    analogy: "⏳ \"Selama masih lapar, terus makan.\" Begitu kenyang (kondisi False), berhenti.",
    example: `energi = 3\n\nwhile energi > 0:\n    print("Unta berjalan... energi:", energi)\n    energi -= 1\n\nprint("Unta istirahat")`,
    breakdown: [
      ["while energi > 0:", "Selama energi lebih dari 0, ulangi."],
      ["energi -= 1", "Kurangi energi 1. Tanpa ini, loop tidak berhenti!"],
      ["print(\"Unta istirahat\")", "Dijalankan setelah loop selesai."],
    ],
    tryNote: "Ganti energi awal menjadi 5.",
    challenge: {
      task: "Buat hitung mundur roket dengan <code>while</code>: tampilkan <code>5</code>, <code>4</code>, <code>3</code>, <code>2</code>, <code>1</code> (satu per baris), lalu <code>Meluncur!</code>",
      starter: `hitung = 5\n\n`,
      expect: {
        output: [[/5\s+4\s+3\s+2\s+1\s+Meluncur!/, "Output-nya harus 5 4 3 2 1 (per baris) lalu Meluncur!"]],
        code: [[/while\s/, "Gunakan while."]],
      },
      hints: ["Kondisi: selama hitung lebih dari 0.", "Di dalam loop: print(hitung), lalu kurangi hitung 1.", "<code>while hitung > 0:</code> → <code>print(hitung)</code> → <code>hitung -= 1</code>, lalu di luar loop <code>print(\"Meluncur!\")</code>"],
      success: "3... 2... 1... 🚀 Meluncur!",
    },
  },
  {
    id: "w3-3", world: 3, icon: "🐾", title: "Satu per Satu", topic: "for",
    story: "Kamu menemukan jejak kaki di pasir yang membentuk huruf. Ayo periksa jejaknya <b>satu per satu</b>! 🐾",
    concept: [
      "<code>for</code> bisa mengambil isi sesuatu <b>satu per satu</b>. Misalnya setiap huruf dari sebuah string.",
      "<code>for huruf in \"PASIR\":</code> → putaran 1 huruf = \"P\", putaran 2 huruf = \"A\", dan seterusnya.",
      "Nama variabel setelah <code>for</code> bebas, pilih yang mudah dimengerti.",
    ],
    analogy: "🍡 Seperti makan sate: tusuk satu, makan, lanjut tusuk berikutnya sampai habis.",
    example: `for huruf in "PASIR":\n    print(huruf)`,
    breakdown: [
      ["for huruf in \"PASIR\":", "Ambil huruf satu per satu dari \"PASIR\"."],
      ["    print(huruf)", "Tampilkan huruf yang sedang diambil."],
    ],
    tryNote: "Ganti \"PASIR\" dengan namamu.",
    challenge: {
      task: "Tampilkan setiap huruf dari kata <code>\"UNTA\"</code> satu per baris, menggunakan <code>for</code>.",
      starter: `kata = "UNTA"\n\n`,
      expect: {
        output: [[/U\s*\n\s*N\s*\n\s*T\s*\n\s*A/, "Output-nya harus U, N, T, A — satu huruf per baris."]],
        code: [[/for\s+\w+\s+in\s+/, "Gunakan for ... in ..."]],
      },
      hints: ["Loop langsung ke variabel kata.", "<code>for huruf in kata:</code>", "Lalu di dalamnya <code>print(huruf)</code>"],
      success: "Jejak berhasil dibaca: U-N-T-A! 🐪",
    },
  },
  {
    id: "w3-4", world: 3, icon: "📏", title: "Penggaris Range", topic: "range()",
    story: "Penjual di pasar gurun memakai <b>penggaris ajaib</b> bernama range untuk menghitung barang. 📏",
    concept: [
      "<code>range(5)</code> → 0, 1, 2, 3, 4. Mulai dari <b>0</b> dan <b>berhenti sebelum</b> 5!",
      "<code>range(1, 6)</code> → 1, 2, 3, 4, 5. (mulai, berhenti-sebelum)",
      "<code>range(0, 10, 2)</code> → 0, 2, 4, 6, 8. Angka ketiga = lompatannya.",
    ],
    analogy: "📏 Seperti tangga: range(1, 6) = naik dari anak tangga 1 sampai 5. Anak tangga ke-6 tidak diinjak.",
    example: `for i in range(1, 6):\n    print(i)\n\nfor i in range(0, 10, 2):\n    print("Lompat ke", i)`,
    breakdown: [
      ["range(1, 6)", "Angka 1 sampai 5."],
      ["range(0, 10, 2)", "Mulai 0, lompat 2-2, berhenti sebelum 10."],
    ],
    tryNote: "Coba range(10, 0, -1). Hitung mundur!",
    challenge: {
      task: "Tampilkan bilangan genap <code>2, 4, 6, 8, 10</code> (satu per baris) menggunakan <code>range</code> dengan lompatan.",
      starter: `for i in range( ):\n    print(i)`,
      expect: {
        output: [[/^\s*2\s+4\s+6\s+8\s+10\s*$/, "Output-nya harus 2 4 6 8 10 (per baris), tidak lebih tidak kurang."]],
        code: [[/range\s*\([^)]*,[^)]*,/, "Gunakan range dengan 3 angka: mulai, berhenti, lompatan."]],
      },
      hints: ["Mulai dari 2, lompat 2.", "Angka berhenti harus lebih besar dari 10, karena range berhenti <b>sebelum</b> angka itu.", "<code>range(2, 11, 2)</code>"],
      success: "Penggaris ajaib sekarang milikmu 📏",
    },
  },
  {
    id: "w3-5", world: 3, icon: "🛑", title: "Tombol Berhenti", topic: "break",
    story: "Kamu menyusuri gurun mencari oasis. Begitu oasis ditemukan, tidak perlu jalan lagi! 🏝️",
    concept: [
      "<code>break</code> = <b>hentikan loop sekarang juga</b>, walaupun belum selesai.",
      "Biasanya dipakai bersama <code>if</code>: \"kalau sudah ketemu, berhenti\".",
    ],
    analogy: "🛑 Seperti mencari kunci di laci-laci: begitu ketemu di laci ke-3, kamu tidak membuka laci ke-4 dan seterusnya.",
    example: `for langkah in range(1, 100):\n    print("Langkah", langkah)\n    if langkah == 4:\n        print("Oasis ditemukan!")\n        break`,
    breakdown: [
      ["range(1, 100)", "Rencananya 99 langkah..."],
      ["if langkah == 4:", "...tapi di langkah 4 oasis ketemu."],
      ["break", "Loop langsung berhenti."],
    ],
    tryNote: "Pindahkan break ke tempat lain atau ganti angka 4.",
    challenge: {
      task: "Tampilkan angka mulai dari 1 menggunakan loop. Saat angkanya <code>7</code>, tampilkan <code>Ketemu oasis!</code> lalu <b>hentikan</b> loop dengan <code>break</code>. (Angka 7 tidak perlu ditampilkan.)",
      starter: `for angka in range(1, 20):\n    # cek dulu apakah angka == 7\n    \n    print(angka)`,
      expect: {
        output: [[/1\s+2\s+3\s+4\s+5\s+6\s+Ketemu oasis!/, "Output-nya harus 1 sampai 6 lalu Ketemu oasis!"]],
        notOutput: [[/(^|\n)\s*(7|8|9)\s*(\n|$)/, "Loop belum berhenti. Pastikan break dijalankan saat angka == 7, sebelum print(angka)."]],
        code: [[/break/, "Gunakan break."]],
      },
      hints: ["Pengecekan <code>if angka == 7:</code> harus diletakkan <b>sebelum</b> print(angka).", "Di dalam if: print(\"Ketemu oasis!\") lalu break.", "<code>if angka == 7:</code> → <code>print(\"Ketemu oasis!\")</code> → <code>break</code> (semuanya menjorok lebih dalam)"],
      success: "Oasis ditemukan! Kamu bisa minum air segar 🏝️💧",
    },
  },
  {
    id: "w3-6", world: 3, icon: "⏭️", title: "Lewati Saja", topic: "continue",
    story: "Di sepanjang jalan ada kaktus berduri di setiap langkah kelipatan 3. Kamu harus <b>melompatinya</b>! 🌵",
    concept: [
      "<code>continue</code> = <b>lewati sisa putaran ini</b>, langsung lanjut ke putaran berikutnya.",
      "Bedanya dengan break: break menghentikan seluruh loop, continue hanya melewati satu putaran.",
      "Operator <code>%</code> (sisa bagi) berguna di sini: <code>angka % 3 == 0</code> artinya angka habis dibagi 3.",
    ],
    analogy: "⏭️ Seperti tombol skip lagu: lagu itu dilewati, tapi playlist tetap lanjut.",
    example: `for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)`,
    breakdown: [
      ["if i == 3:", "Kalau putaran ke-3..."],
      ["continue", "...lewati (print tidak dijalankan)."],
      ["print(i)", "Hasilnya: 1 2 4 5"],
    ],
    tryNote: "Ganti continue dengan break. Apa bedanya?",
    challenge: {
      task: "Tampilkan angka 1 sampai 10, tapi <b>lewati</b> angka kelipatan 3 (3, 6, 9) menggunakan <code>continue</code>.",
      starter: `for angka in range(1, 11):\n    \n    print(angka)`,
      check: (code, out) => (out.trim().split(/\s+/).join(" ") === "1 2 4 5 7 8 10" ? null : "Output-nya harus: 1 2 4 5 7 8 10 (per baris)."),
      expect: { code: [[/continue/, "Gunakan continue."]] },
      hints: ["Cek apakah angka habis dibagi 3 dengan <code>angka % 3 == 0</code>.", "Kalau iya, <code>continue</code>.", "<code>if angka % 3 == 0:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;continue</code> (sebelum print)"],
      success: "Semua kaktus berhasil kamu lompati 🌵⏭️",
    },
  },
  {
    id: "w3-7", world: 3, icon: "🧩", title: "Loop di Dalam Loop", topic: "Nested loop",
    story: "Pedagang permadani ingin membuat pola kotak-kotak. Setiap <b>baris</b> punya beberapa <b>kolom</b>. 🧶",
    concept: [
      "<b>Nested loop</b> = loop di dalam loop. Loop dalam berjalan sampai selesai untuk <b>setiap</b> putaran loop luar.",
      "Kalau loop luar 3 kali dan loop dalam 3 kali, total = 3 × 3 = 9 putaran.",
    ],
    analogy: "🕐 Seperti jam: jarum menit berputar penuh (60 kali) untuk setiap 1 putaran jarum jam.",
    example: `for baris in range(1, 4):\n    for kolom in range(1, 4):\n        print(baris, "x", kolom, "=", baris * kolom)`,
    breakdown: [
      ["for baris in range(1, 4):", "Loop luar: baris 1, 2, 3."],
      ["    for kolom in range(1, 4):", "Loop dalam: kolom 1, 2, 3 untuk setiap baris."],
    ],
    tryNote: "Coba ubah agar membentuk pola bintang: print(\"*\" * kolom).",
    challenge: {
      task: "Buat segitiga bintang dengan nested loop. Hasilnya:<br><code>*</code><br><code>**</code><br><code>***</code><br><code>****</code>",
      starter: `for baris in range(1, 5):\n    garis = ""\n    for i in range(baris):\n        # tambahkan "*" ke garis\n        \n    print(garis)`,
      expect: {
        output: [[/^\s*\*\s*\n\*\*\s*\n\*\*\*\s*\n\*\*\*\*\s*$/, "Output-nya harus segitiga 4 baris: *, **, ***, ****"]],
        code: [[/for[\s\S]*\n\s+for/, "Gunakan loop di dalam loop."]],
      },
      hints: ["Di loop dalam, tambahkan satu bintang ke string garis.", "Ingat <code>+=</code> bisa dipakai untuk string juga.", "<code>garis += \"*\"</code> (menjorok 8 spasi)"],
      success: "Permadani bintangmu indah sekali 🧩⭐",
    },
  },
  {
    id: "w3-8", world: 3, icon: "🏆", title: "Loop Challenge: Penjumlah Pasir", topic: "Gabungan World 3",
    story: "Raja gurun ingin tahu jumlah total butir pasir dari 1 sampai n. Ia menantangmu membuat <b>mesin penjumlah</b>! 👑",
    concept: [
      "Teknik penting: buat kotak <code>total = 0</code> sebelum loop, lalu tambahkan sedikit demi sedikit di dalam loop.",
      "Ini disebut <b>akumulator</b>, seperti celengan yang diisi setiap hari.",
    ],
    analogy: "🐷 Seperti celengan: awalnya 0, setiap hari ditambah. Di akhir, kamu tahu totalnya.",
    example: `total = 0\nfor i in range(1, 4):\n    total += i\n    print("Tambah", i, "-> total", total)`,
    breakdown: [["total = 0", "Celengan kosong."], ["total += i", "Masukkan i ke celengan."]],
    tryNote: "Ubah range menjadi range(1, 11). Berapa totalnya?",
    challenge: {
      task: "Tanya <code>n = </code> (int), lalu hitung jumlah 1 + 2 + … + n dengan loop. Tampilkan hanya totalnya.<br><small>Contoh: n = 10 → 55</small>",
      starter: `n = int(input("n = "))\ntotal = 0\n\n\nprint(total)`,
      tests: [
        { inputs: ["10"], output: [/(^|\D)55(\D|$)/, "Untuk n = 10, totalnya harus 55."] },
        { inputs: ["100"], output: [/5050/, "Untuk n = 100, totalnya harus 5050."] },
      ],
      expect: { code: [[/for|while/, "Gunakan loop (for atau while)."]] },
      hints: ["Loop dari 1 sampai n. Ingat range berhenti sebelum angka terakhir.", "<code>for i in range(1, n + 1):</code>", "Di dalam loop: <code>total += i</code>"],
      success: "Raja gurun terpukau! Kamu menaklukkan Loop Desert 🏜️🏆",
    },
  },

  /* ===================== WORLD 4 — FUNCTION CASTLE ===================== */
  {
    id: "w4-1", world: 4, icon: "⚙️", title: "Mesin Ajaib", topic: "Apa itu function?",
    story: "Di <b>Function Castle</b> 🏰 ada ruangan penuh mesin. Masukkan bahan → mesin bekerja → keluar hasil!",
    concept: [
      "<b>Function</b> = kumpulan perintah yang diberi nama, supaya bisa dipakai berulang kali cukup dengan memanggil namanya.",
      "Sebenarnya kamu sudah sering pakai function: <code>print()</code>, <code>input()</code>, <code>len()</code>. Itu function bawaan Python!",
      "Sekarang kamu akan belajar membuat function <b>sendiri</b>.",
    ],
    analogy: "🧃 Function itu seperti blender: masukkan buah (input), blender bekerja, keluar jus (hasil). Kamu tidak perlu tahu isi mesinnya setiap kali memakai.",
    example: `def sapa():\n    print("Halo, petualang!")\n    print("Selamat datang di kastil")\n\nsapa()\nsapa()`,
    breakdown: [
      ["def sapa():", "Membuat (define) mesin bernama sapa."],
      ["isi yang menjorok", "Perintah-perintah di dalam mesin."],
      ["sapa()", "Menyalakan mesinnya. Dipanggil 2 kali = jalan 2 kali."],
    ],
    tryNote: "Panggil sapa() 3 kali.",
    challenge: {
      task: "Function <code>teriak</code> sudah dibuat. Tugasmu: <b>panggil</b> function itu 2 kali.",
      starter: `def teriak():\n    print("Untuk Python Quest!")\n\n# panggil function teriak 2 kali\n`,
      check: (code, out) => ((out.match(/Untuk Python Quest!/g) || []).length === 2 ? null : "Tulisan Untuk Python Quest! harus muncul tepat 2 kali."),
      hints: ["Memanggil function = tulis namanya diikuti kurung.", "<code>teriak()</code> — tanpa def, tanpa titik dua.", "Tulis <code>teriak()</code> dua kali di baris terpisah, tidak menjorok."],
      success: "Mesin menyala! ⚙️",
    },
  },
  {
    id: "w4-2", world: 4, icon: "🔨", title: "Membuat Mesin", topic: "def",
    story: "Pandai besi kastil memberimu palu: <i>\"Sekarang buat mesinmu sendiri!\"</i> 🔨",
    concept: [
      "Cara membuat function: <code>def nama_function():</code> lalu isi perintah di bawahnya, menjorok.",
      "Function harus <b>dibuat dulu</b> (di atas), baru bisa <b>dipanggil</b> (di bawah).",
      "Membuat function saja tidak menjalankan apa pun. Isinya baru berjalan saat dipanggil.",
    ],
    analogy: "📖 def itu seperti menulis resep. Menulis resep tidak membuat kue jadi. Kue baru jadi saat resepnya dipraktikkan (dipanggil).",
    example: `def buka_gerbang():\n    print("Kreeek...")\n    print("Gerbang terbuka!")\n\nbuka_gerbang()`,
    breakdown: [["def buka_gerbang():", "Menulis resep."], ["buka_gerbang()", "Mempraktikkan resep."]],
    tryNote: "Hapus baris buka_gerbang() di bawah, lalu RUN. Tidak ada output, kan? Karena function belum dipanggil.",
    challenge: {
      task: "Buat function bernama <code>salam_kastil</code> yang menampilkan <code>Selamat datang di Function Castle</code>. Lalu panggil function itu.",
      starter: `# buat function salam_kastil\n\n\n# panggil function\n`,
      expect: {
        output: [[/Selamat datang di Function Castle/, "Output-nya harus: Selamat datang di Function Castle"]],
        code: [[/def\s+salam_kastil\s*\(\s*\)\s*:/, "Buat function dengan: def salam_kastil():"], [/(^|\n)salam_kastil\s*\(\s*\)/, "Jangan lupa panggil salam_kastil() di luar function (tidak menjorok)."]],
      },
      hints: ["Mulai dengan <code>def salam_kastil():</code>", "Di baris berikutnya (menjorok): print tulisannya.", "Terakhir, di baris tanpa spasi: <code>salam_kastil()</code>"],
      success: "Mesin pertamamu berfungsi sempurna 🔨⚙️",
    },
  },
  {
    id: "w4-3", world: 4, icon: "🥣", title: "Lubang Bahan", topic: "Parameter",
    story: "Mesin sapa milikmu selalu menyapa dengan kalimat yang sama. Bagaimana kalau mesinnya bisa menyapa <b>nama yang berbeda</b>?",
    concept: [
      "<b>Parameter</b> = \"lubang bahan\" pada mesin. Ditulis di dalam kurung saat membuat function.",
      "Di dalam function, parameter bisa dipakai seperti variable biasa.",
    ],
    analogy: "🥣 Seperti mesin jus dengan lubang untuk memasukkan buah. Buahnya bisa berbeda-beda setiap kali.",
    example: `def sapa(nama):\n    print(f"Halo {nama}, selamat datang!")\n\nsapa("Budi")\nsapa("Sari")`,
    breakdown: [
      ["def sapa(nama):", "nama = parameter (lubang bahan)."],
      ["sapa(\"Budi\")", "Masukkan \"Budi\" ke lubang nama."],
    ],
    tryNote: "Panggil sapa dengan namamu sendiri.",
    challenge: {
      task: "Buat function <code>kenalan(nama)</code> yang menampilkan <code>Namaku [nama], siap bertualang!</code>. Panggil dengan <code>\"Raka\"</code>.",
      starter: `def kenalan(nama):\n    \n\nkenalan("Raka")`,
      expect: {
        output: [[/Namaku Raka, siap bertualang!/, "Output-nya harus: Namaku Raka, siap bertualang!"]],
        code: [[/def\s+kenalan\s*\(\s*nama\s*\)/, "Function harus bernama kenalan dengan parameter nama."]],
      },
      check: (code) => (/print\s*\(\s*["']Namaku Raka/.test(code) ? "Jangan tulis Raka langsung. Gunakan parameter nama, misalnya f\"Namaku {nama}, ...\"" : null),
      hints: ["Di dalam function, gunakan f-string.", "<code>f\"Namaku {nama}, siap bertualang!\"</code>", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(f\"Namaku {nama}, siap bertualang!\")</code>"],
      success: "Mesinmu sekarang bisa mengenal siapa saja 🥣",
    },
  },
  {
    id: "w4-4", world: 4, icon: "🎁", title: "Bahan yang Dikirim", topic: "Argument & default",
    story: "Penjaga gudang bertanya: <i>\"Parameter dan argument itu sama, ya?\"</i> Hampir! Mari kita bedakan. 🎁",
    concept: [
      "<b>Parameter</b> = nama lubang saat <b>membuat</b> function. <b>Argument</b> = nilai yang <b>dikirim</b> saat memanggil.",
      "Function bisa punya banyak parameter, dipisah koma. Argument dikirim sesuai urutan.",
      "Parameter bisa punya <b>nilai default</b>: <code>def f(kelas=\"Explorer\")</code>. Kalau argument-nya tidak dikirim, pakai nilai default.",
    ],
    analogy: "📮 Parameter itu kotak surat bertuliskan \"untuk: ...\". Argument itu suratnya.",
    example: `def perkenalan(nama, kelas="Explorer"):\n    print(f"{nama} adalah {kelas}")\n\nperkenalan("Dina", "Mage")\nperkenalan("Joko")`,
    breakdown: [
      ["nama, kelas=\"Explorer\"", "Dua parameter, kelas punya nilai default."],
      ["perkenalan(\"Dina\", \"Mage\")", "Dua argument → Dina adalah Mage."],
      ["perkenalan(\"Joko\")", "Tanpa kelas → pakai default → Joko adalah Explorer."],
    ],
    tryNote: "Coba panggil perkenalan() tanpa argument. Baca errornya!",
    challenge: {
      task: "Buat function <code>serang(musuh, damage=10)</code> yang menampilkan <code>Menyerang [musuh] dengan [damage] damage</code>. Panggil <code>serang(\"Slime\")</code> dan <code>serang(\"Naga\", 50)</code>.",
      starter: `def serang(musuh, damage=10):\n    \n\n`,
      expect: {
        output: [[/Menyerang Slime dengan 10 damage/, "serang(\"Slime\") harus menampilkan: Menyerang Slime dengan 10 damage"], [/Menyerang Naga dengan 50 damage/, "serang(\"Naga\", 50) harus menampilkan: Menyerang Naga dengan 50 damage"]],
      },
      hints: ["Isi function: print dengan f-string memakai {musuh} dan {damage}.", "<code>print(f\"Menyerang {musuh} dengan {damage} damage\")</code>", "Lalu di bawah (tidak menjorok): <code>serang(\"Slime\")</code> dan <code>serang(\"Naga\", 50)</code>"],
      success: "Slime dan Naga kabur ketakutan ⚔️🎁",
    },
  },
  {
    id: "w4-5", world: 4, icon: "📤", title: "Hasil Mesin", topic: "return",
    story: "Mesin-mesinmu sejauh ini hanya <b>menampilkan</b>. Tapi kadang kita ingin mesin <b>memberikan hasil</b> yang bisa disimpan dan dipakai lagi. 📤",
    concept: [
      "<code>return</code> = <b>kirim hasil keluar dari function</b>. Hasilnya bisa disimpan ke variable.",
      "Bedanya dengan print: print hanya menampilkan ke layar. return memberikan nilai yang bisa dipakai lagi.",
      "Setelah return dijalankan, function langsung selesai.",
    ],
    analogy: "🏧 Seperti mesin ATM: kamu masukkan kartu & nominal, mesin <b>mengeluarkan</b> uang yang bisa kamu bawa dan pakai.",
    example: `def tambah(a, b):\n    return a + b\n\nhasil = tambah(3, 4)\nprint(hasil)\nprint(tambah(10, 20) * 2)`,
    breakdown: [
      ["return a + b", "Kirim hasil a + b keluar."],
      ["hasil = tambah(3, 4)", "Hasil 7 disimpan ke kotak hasil."],
      ["tambah(10, 20) * 2", "Hasil 30 langsung dipakai lagi → 60."],
    ],
    flow: ["📥 Masukkan 3 dan 4", "⚙️ Mesin menghitung 3 + 4", "📤 return 7", "📦 hasil = 7"],
    tryNote: "Ganti return dengan print di dalam function. Apa yang terjadi pada variable hasil?",
    challenge: {
      task: "Buat function <code>luas_persegi(sisi)</code> yang <b>me-return</b> sisi × sisi. Lalu tampilkan <code>luas_persegi(7)</code>.<br><small>Hasil: 49</small>",
      starter: `def luas_persegi(sisi):\n    \n\nprint(luas_persegi(7))`,
      expect: {
        output: [[/(^|\D)49(\D|$)/, "Hasilnya harus 49."]],
        code: [[/return\s/, "Gunakan return untuk mengirim hasilnya."]],
      },
      check: (code, out) => (/None/.test(out) ? "Muncul None — artinya function belum me-return apa pun. Ganti print dengan return di dalam function." : null),
      hints: ["Di dalam function tulis <code>return ...</code>", "Luas persegi = sisi dikali sisi.", "<code>&nbsp;&nbsp;&nbsp;&nbsp;return sisi * sisi</code>"],
      success: "Mesinmu sekarang bisa memberikan hasil 📤✨",
    },
  },
  {
    id: "w4-6", world: 4, icon: "🏠", title: "Rahasia Ruangan", topic: "Scope sederhana",
    story: "Di kastil ada aturan: <b>barang di dalam kamar tidak bisa dilihat dari luar kamar</b>. 🏠",
    concept: [
      "Variable yang dibuat <b>di dalam</b> function hanya ada di dalam function itu. Ini disebut variable <b>lokal</b>.",
      "Dari luar function, variable itu <b>tidak bisa diakses</b> → muncul NameError.",
      "Solusinya: kirim keluar dengan <code>return</code>, lalu simpan ke variable di luar.",
    ],
    analogy: "🚪 Function itu seperti kamar dengan pintu tertutup. Barang di dalam kamar (variable lokal) tidak terlihat dari ruang tamu.",
    example: `def masak():\n    makanan = "Nasi goreng"\n    return makanan\n\nhasil = masak()\nprint(hasil)\n# print(makanan)  <- ini akan error`,
    breakdown: [
      ["makanan = \"Nasi goreng\"", "Variable lokal, hanya ada di dalam masak()."],
      ["return makanan", "Kirim keluar lewat pintu."],
      ["hasil = masak()", "Di luar, disimpan ke kotak baru."],
    ],
    tryNote: "Hapus tanda # di baris terakhir, lalu RUN. Baca pesan NameError-nya.",
    challenge: {
      task: "Kode ini error karena <code>emas</code> hanya ada di dalam function. Perbaiki: buat function <b>me-return</b> emas, lalu simpan hasilnya: <code>emas = hitung_emas()</code>.<br><small>Hasil: 300</small>",
      starter: `def hitung_emas():\n    emas = 100 * 3\n\nhitung_emas()\nprint(emas)`,
      expect: {
        output: [[/300/, "Hasilnya harus 300."]],
        code: [[/return\s+emas/, "Tambahkan return emas di dalam function."], [/emas\s*=\s*hitung_emas\s*\(\s*\)/, "Simpan hasilnya: emas = hitung_emas()"]],
      },
      hints: ["Variable emas harus dikirim keluar dari function.", "Tambahkan <code>return emas</code> di dalam function (menjorok).", "Ganti baris <code>hitung_emas()</code> menjadi <code>emas = hitung_emas()</code>"],
      success: "Emas berhasil dibawa keluar ruangan 🏠💰",
    },
  },
  {
    id: "w4-7", world: 4, icon: "🏆", title: "Function Challenge: Toko Diskon", topic: "Gabungan World 4",
    story: "Pedagang kastil sedang festival diskon! Ia butuh mesin penghitung harga setelah diskon. 🛍️",
    concept: [
      "Gabungkan: <code>def</code>, beberapa parameter, operasi matematika, dan <code>return</code>.",
      "Rumus: harga akhir = harga − (harga × persen ÷ 100).",
    ],
    analogy: "🏷️ Seperti label diskon di mal: \"Diskon 20%\" — kasir otomatis menghitung harga barunya.",
    example: `def pajak(harga):\n    return harga * 11 / 100\n\nprint(pajak(100000))`,
    breakdown: [["harga * 11 / 100", "Menghitung 11% dari harga."]],
    tryNote: "Coba hitung pajak barang lain.",
    challenge: {
      task: "Buat function <code>diskon(harga, persen)</code> yang me-return harga setelah diskon.<br><small><code>diskon(100000, 20)</code> → 80000, <code>diskon(50000, 10)</code> → 45000</small>",
      starter: `def diskon(harga, persen):\n    \n\nprint(diskon(100000, 20))\nprint(diskon(50000, 10))`,
      expect: {
        output: [[/80000(\.0)?/, "diskon(100000, 20) harus menghasilkan 80000."], [/45000(\.0)?/, "diskon(50000, 10) harus menghasilkan 45000."]],
        code: [[/return/, "Gunakan return."]],
      },
      hints: ["Hitung dulu potongannya: <code>harga * persen / 100</code>", "Harga akhir = harga dikurangi potongan.", "<code>&nbsp;&nbsp;&nbsp;&nbsp;return harga - harga * persen / 100</code>"],
      success: "Festival diskon sukses besar! Kamu menaklukkan Function Castle 🏰🏆",
    },
  },

  /* ===================== WORLD 5 — DATA OCEAN ===================== */
  {
    id: "w5-1", world: 5, icon: "🎒", title: "Tas Petualang", topic: "List",
    story: "Kamu berlayar ke <b>Data Ocean</b>! 🌊 Sebelum berangkat, kamu butuh <b>tas</b> untuk membawa banyak barang sekaligus.",
    concept: [
      "<b>List</b> = satu variable yang bisa menyimpan <b>banyak nilai</b> sekaligus, berurutan. Ditulis dengan kurung siku <code>[ ]</code>.",
      "Tambah barang: <code>tas.append(\"barang\")</code>. Hitung jumlah: <code>len(tas)</code>.",
    ],
    analogy: "🎒 Kalau variable itu kotak, list itu seperti tas dengan banyak kantong berurutan.",
    example: `tas = ["pedang", "perisai", "ramuan"]\nprint(tas)\n\ntas.append("peta")\nprint(tas)\nprint(len(tas))`,
    breakdown: [
      ["[\"pedang\", \"perisai\", \"ramuan\"]", "List berisi 3 barang, dipisah koma."],
      ["tas.append(\"peta\")", "Masukkan peta ke kantong paling belakang."],
      ["len(tas)", "Jumlah barang → 4"],
    ],
    tryNote: "Coba tas.remove(\"perisai\").",
    challenge: {
      task: "Ada <code>tas = [\"peta\", \"kompas\"]</code>. Tambahkan <code>\"teropong\"</code> dengan append, lalu tampilkan isi tas dan jumlah barangnya.",
      starter: `tas = ["peta", "kompas"]\n\n`,
      expect: {
        output: [[/\[['"]peta['"], ['"]kompas['"], ['"]teropong['"]\]/, "Isi tas harus ['peta', 'kompas', 'teropong']"], [/(^|\n)\s*3\s*($|\n)/, "Tampilkan juga jumlah barang (3) dengan len(tas)."]],
        code: [[/append\s*\(/, "Gunakan append()."]],
      },
      hints: ["<code>tas.append(\"...\")</code>", "Lalu <code>print(tas)</code>", "Terakhir <code>print(len(tas))</code>"],
      success: "Tas petualangmu siap 🎒",
    },
  },
  {
    id: "w5-2", world: 5, icon: "🔢", title: "Nomor Kantong", topic: "Index & Slicing",
    story: "Kamu ingin mengambil barang tertentu dari tas tanpa mengeluarkan semuanya. Caranya: pakai <b>nomor kantong</b>!",
    concept: [
      "Setiap item di list punya nomor urut yang disebut <b>index</b>. Index dimulai dari <b>0</b>, bukan 1!",
      "<code>ikan[0]</code> = item pertama. <code>ikan[-1]</code> = item terakhir.",
      "<b>Slicing</b> = mengambil potongan: <code>ikan[1:3]</code> → index 1 dan 2 (berhenti sebelum 3).",
    ],
    analogy: "🚃 Seperti gerbong kereta yang dinomori mulai dari 0. Gerbong -1 = gerbong paling belakang.",
    example: `ikan = ["nemo", "dory", "marlin", "bruce"]\nprint(ikan[0])\nprint(ikan[-1])\nprint(ikan[1:3])`,
    breakdown: [
      ["ikan[0]", "Item pertama → nemo"],
      ["ikan[-1]", "Item terakhir → bruce"],
      ["ikan[1:3]", "Index 1 sampai 2 → ['dory', 'marlin']"],
    ],
    tryNote: "Coba ikan[10]. Baca errornya!",
    challenge: {
      task: "Dari list <code>ikan</code>, tampilkan: item <b>pertama</b>, item <b>terakhir</b> (pakai -1), dan potongan <b>3 item di tengah</b> (dory, marlin, bruce).",
      starter: `ikan = ["nemo", "dory", "marlin", "bruce", "squirt"]\n\n`,
      expect: {
        output: [[/nemo/, "Tampilkan item pertama (nemo)."], [/squirt/, "Tampilkan item terakhir (squirt)."], [/\[['"]dory['"], ['"]marlin['"], ['"]bruce['"]\]/, "Tampilkan potongan ['dory', 'marlin', 'bruce']."]],
        code: [[/\[\s*-1\s*\]/, "Gunakan index -1 untuk item terakhir."], [/\[\s*\d*\s*:\s*-?\d*\s*\]/, "Gunakan slicing [awal:akhir]."]],
      },
      hints: ["Index pertama adalah 0.", "Dory ada di index 1, bruce di index 3. Slicing berhenti sebelum angka kedua.", "<code>print(ikan[0])</code>, <code>print(ikan[-1])</code>, <code>print(ikan[1:4])</code>"],
      success: "Kamu menemukan semua ikan 🐠",
    },
  },
  {
    id: "w5-3", world: 5, icon: "🔒", title: "Peti Terkunci", topic: "Tuple",
    story: "Kapten kapal menyimpan koordinat harta karun di <b>peti terkunci</b>. Isinya tidak boleh diubah siapa pun! 🗝️",
    concept: [
      "<b>Tuple</b> mirip list, tapi <b>tidak bisa diubah</b> setelah dibuat. Ditulis dengan kurung biasa <code>( )</code>.",
      "Cocok untuk data yang tetap: koordinat, tanggal lahir, warna bendera.",
      "Index dan slicing tetap bisa dipakai untuk <b>membaca</b>.",
    ],
    analogy: "🔒 List itu seperti papan tulis (bisa dihapus & ditulis ulang). Tuple itu seperti prasasti batu (permanen).",
    example: `harta = (12, 45)\nprint(harta)\nprint(harta[0])\n# harta[0] = 99  <- error! tuple tidak bisa diubah`,
    breakdown: [["(12, 45)", "Tuple berisi 2 angka."], ["harta[0]", "Membaca boleh → 12"]],
    tryNote: "Hapus tanda # di baris terakhir dan lihat TypeError-nya.",
    challenge: {
      task: "Buat tuple <code>bendera = (\"merah\", \"putih\")</code>. Tampilkan seluruh tuple, lalu tampilkan item pertamanya.",
      starter: `# buat tuple bendera\n\n`,
      expect: {
        output: [[/\(['"]merah['"], ['"]putih['"]\)/, "Tampilkan tuple: ('merah', 'putih')"], [/(^|\n)merah\s*($|\n)/, "Tampilkan juga item pertama: merah"]],
        code: [[/bendera\s*=\s*\(/, "Buat tuple dengan kurung biasa ( )."]],
      },
      hints: ["Tuple pakai kurung biasa: <code>( )</code>", "<code>bendera = (\"merah\", \"putih\")</code>", "Lalu <code>print(bendera)</code> dan <code>print(bendera[0])</code>"],
      success: "Peti terkunci dengan aman 🔒",
    },
  },
  {
    id: "w5-4", world: 5, icon: "📖", title: "Kamus Ajaib", topic: "Dictionary",
    story: "Penyihir laut punya <b>kamus ajaib</b>. Sebut kata kuncinya, keluar jawabannya! 📖",
    concept: [
      "<b>Dictionary</b> menyimpan data berpasangan: <b>kunci → nilai</b>. Ditulis dengan <code>{ }</code>.",
      "Ambil nilai pakai kuncinya: <code>hero[\"nama\"]</code>.",
      "Ubah atau tambah: <code>hero[\"hp\"] = 80</code>.",
    ],
    analogy: "📒 Seperti buku kontak di HP: nama (kunci) → nomor telepon (nilai). Kamu cari pakai nama, bukan nomor urut.",
    example: `hero = {"nama": "Raka", "level": 3}\nprint(hero["nama"])\n\nhero["level"] = 4\nhero["senjata"] = "busur"\nprint(hero)`,
    breakdown: [
      ["{\"nama\": \"Raka\", \"level\": 3}", "Dua pasang kunci: nilai."],
      ["hero[\"nama\"]", "Ambil nilai dari kunci nama → Raka"],
      ["hero[\"senjata\"] = \"busur\"", "Tambah pasangan baru."],
    ],
    tryNote: "Coba print(hero[\"umur\"]). Kunci yang tidak ada → KeyError.",
    challenge: {
      task: "Buat dictionary <code>hero</code> dengan <code>\"nama\": \"Lina\"</code> dan <code>\"hp\": 100</code>. Lalu ubah hp menjadi <code>80</code>, tampilkan <code>hero[\"hp\"]</code>, lalu tampilkan seluruh hero.",
      starter: `hero = {}\n\n`,
      expect: {
        output: [[/(^|\n)80\s*($|\n)/, "Tampilkan hero[\"hp\"] yang sudah bernilai 80."], [/['"]nama['"]: ['"]Lina['"]/, "Dictionary harus berisi 'nama': 'Lina'."]],
        code: [[/hero\s*\[\s*["']hp["']\s*\]\s*=\s*80/, "Ubah hp dengan: hero[\"hp\"] = 80"]],
      },
      hints: ["Isi dictionary: <code>{\"nama\": \"Lina\", \"hp\": 100}</code>", "Ubah nilai: <code>hero[\"hp\"] = 80</code>", "Lalu <code>print(hero[\"hp\"])</code> dan <code>print(hero)</code>"],
      success: "Kamus ajaibmu bekerja 📖✨",
    },
  },
  {
    id: "w5-5", world: 5, icon: "🐚", title: "Koleksi Unik", topic: "Set",
    story: "Kamu mengoleksi kerang dari berbagai pulau. Tapi kamu tidak mau menyimpan kerang yang <b>sama dua kali</b>. 🐚",
    concept: [
      "<b>Set</b> = kumpulan data yang <b>tidak boleh kembar</b>. Item yang sama otomatis hanya disimpan sekali.",
      "Set tidak punya urutan, jadi tidak bisa pakai index.",
      "Trik populer: <code>set(list)</code> untuk menghapus data kembar.",
    ],
    analogy: "🎫 Seperti daftar hadir: walaupun Budi absen 3 kali, namanya tetap tercatat sekali.",
    example: `kerang = {"merah", "biru", "merah", "hijau"}\nprint(len(kerang))\n\nkerang.add("ungu")\nprint("ungu" in kerang)`,
    breakdown: [["{\"merah\", \"biru\", \"merah\", ...}", "\"merah\" kembar → disimpan sekali."], ["\"ungu\" in kerang", "Cek apakah ada → True"]],
    tryNote: "Coba print(kerang). Urutannya mungkin acak!",
    challenge: {
      task: "Ada list <code>kunjungan</code> berisi tempat yang dikunjungi (ada yang kembar). Ubah menjadi set, lalu tampilkan <b>jumlah tempat unik</b>.<br><small>Hasil: 3</small>",
      starter: `kunjungan = ["pantai", "gua", "pantai", "karang", "gua"]\n\n`,
      expect: {
        output: [[/(^|\n)\s*3\s*($|\n)/, "Jumlah tempat unik seharusnya 3."]],
        code: [[/set\s*\(/, "Gunakan set() untuk menghapus yang kembar."]],
      },
      hints: ["<code>unik = set(kunjungan)</code>", "Hitung jumlahnya dengan len().", "<code>print(len(unik))</code>"],
      success: "Koleksimu sekarang rapi dan unik 🐚",
    },
  },
  {
    id: "w5-6", world: 5, icon: "🐋", title: "Menjelajah Data", topic: "Looping data",
    story: "Kamu menyelam dan ingin melihat setiap ikan di terumbu karang <b>satu per satu</b>. 🐋",
    concept: [
      "List bisa di-loop: <code>for item in daftar:</code>",
      "Dictionary bisa di-loop dengan <code>.items()</code> untuk mendapat kunci dan nilainya sekaligus: <code>for nama, nilai in data.items():</code>",
    ],
    analogy: "🔦 Seperti menyorot senter ke setiap ikan secara bergiliran.",
    example: `teman = ["Budi", "Sari"]\nfor t in teman:\n    print("Halo", t)\n\nstok = {"apel": 5, "jeruk": 3}\nfor buah, jumlah in stok.items():\n    print(buah, "=", jumlah)`,
    breakdown: [["for t in teman:", "t berisi setiap nama bergantian."], ["stok.items()", "Pasangan (kunci, nilai)."], ["for buah, jumlah in ...", "Dua variable sekaligus."]],
    tryNote: "Tambahkan buah baru ke stok.",
    challenge: {
      task: "Tampilkan setiap nama dan nilai dari dictionary <code>nilai</code> dengan format <code>Budi: 80</code>.",
      starter: `nilai = {"Budi": 80, "Sari": 92, "Andi": 75}\n\n`,
      expect: {
        output: [[/Budi: 80/, "Harus ada baris Budi: 80"], [/Sari: 92/, "Harus ada baris Sari: 92"], [/Andi: 75/, "Harus ada baris Andi: 75"]],
        code: [[/for\s/, "Gunakan loop for."], [/\.items\s*\(/, "Gunakan .items()."]],
      },
      hints: ["<code>for nama, n in nilai.items():</code>", "Gunakan f-string untuk formatnya.", "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(f\"{nama}: {n}\")</code>"],
      success: "Semua data berhasil dijelajahi 🐋",
    },
  },
  {
    id: "w5-7", world: 5, icon: "🏆", title: "Data Challenge: Daftar Belanja", topic: "Gabungan World 5",
    story: "Koki kapal butuh total belanja untuk perjalanan panjang. Daftar harganya disimpan dalam dictionary. 🛒",
    concept: ["Gabungkan dictionary, loop, dan akumulator (total = 0)."],
    analogy: "🧾 Seperti menjumlahkan semua baris di struk belanja.",
    example: `harga = [1000, 2000, 3000]\ntotal = 0\nfor h in harga:\n    total += h\nprint(total)`,
    breakdown: [["total += h", "Tambahkan setiap harga ke total."]],
    tryNote: "Coba juga fungsi bawaan sum(harga).",
    challenge: {
      task: "Hitung total semua harga di dictionary <code>belanja</code> menggunakan loop, lalu tampilkan <code>Total: 25000</code>.",
      starter: `belanja = {"apel": 5000, "susu": 12000, "roti": 8000}\ntotal = 0\n\n`,
      expect: {
        output: [[/Total:?\s*25000/, "Output-nya harus: Total: 25000"]],
        code: [[/for\s/, "Gunakan loop for."]],
      },
      hints: ["Loop nilai-nilainya: <code>for h in belanja.values():</code>", "Di dalam loop: <code>total += h</code>", "Terakhir: <code>print(\"Total:\", total)</code>"],
      success: "Kapal siap berlayar dengan perbekalan penuh! Kamu menaklukkan Data Ocean 🌊🏆",
    },
  },

  /* ===================== WORLD 6 — BUG CAVE ===================== */
  {
    id: "w6-1", world: 6, icon: "🔍", title: "Membaca Pesan Error", topic: "Cara membaca error",
    story: "Kamu memasuki <b>Bug Cave</b> 🦇. Di dinding gua tertulis pesan merah yang menakutkan... Tenang! Error itu sebenarnya <b>petunjuk</b>, bukan hukuman.",
    concept: [
      "Error adalah cara Python bilang: <i>\"Aku bingung di bagian ini.\"</i> Semua programmer — bahkan yang jago — melihat error setiap hari.",
      "Cara membaca: lihat <b>baris paling bawah</b> dulu. Formatnya: <code>JenisError: penjelasan</code>.",
      "Lalu cari nomor <b>line</b> (baris) untuk tahu di mana masalahnya.",
    ],
    analogy: "🧭 Error itu seperti GPS yang bilang \"Jalan ditutup di Jl. Merdeka\". Bukan memarahimu, tapi memberi tahu lokasinya.",
    example: `print("Masuk gua...")\npritn("Ada kelelawar!")`,
    breakdown: [
      ["line 2", "Masalahnya di baris 2."],
      ["NameError", "Jenis error: ada nama yang tidak dikenal."],
      ["name 'pritn' is not defined", "Python tidak kenal 'pritn' — typo dari print!"],
    ],
    tryNote: "RUN dulu dan baca errornya. Lalu perbaiki typo-nya.",
    challenge: {
      task: "Kode ini error. Baca pesannya, lalu perbaiki supaya menampilkan <code>Halo Gua!</code>",
      starter: `pritn("Halo Gua!")`,
      expect: { output: [[/Halo Gua!/, "Output-nya harus: Halo Gua!"]] },
      hints: ["RUN dulu, lalu lihat baris paling bawah pesan error.", "Nama perintahnya salah ketik.", "Seharusnya <code>print</code>, bukan <code>pritn</code>."],
      success: "Kelelawar pertama berhasil kamu usir 🦇",
    },
  },
  {
    id: "w6-2", world: 6, icon: "✏️", title: "Salah Tulis", topic: "SyntaxError",
    story: "Monster tata bahasa menyerang! Ia membuat kode jadi tidak sesuai aturan penulisan Python. ✏️",
    concept: [
      "<b>SyntaxError</b> = aturan penulisan dilanggar. Python bahkan tidak bisa mulai menjalankan kodenya.",
      "Penyebab paling umum: tanda kutip tidak ditutup, kurung tidak ditutup, lupa titik dua <code>:</code> setelah if/for/while/def.",
    ],
    analogy: "📝 Seperti kalimat tanpa titik dan huruf kapital: masih bisa ditebak, tapi Python sangat ketat soal aturan.",
    example: `if 10 > 5\n    print("Sepuluh lebih besar")`,
    breakdown: [["if 10 > 5", "Kurang titik dua di akhir!"], ["expected ':'", "Python memberi tahu: aku menunggu tanda ':'"]],
    tryNote: "Tambahkan : setelah 5, lalu RUN.",
    challenge: {
      task: "Ada <b>2 SyntaxError</b> di kode ini. Perbaiki semuanya!",
      starter: `print("Selamat datang di gua)\nif 5 > 3\n    print("Lima lebih besar")`,
      expect: { output: [[/Selamat datang di gua/, "Baris pertama harus menampilkan: Selamat datang di gua"], [/Lima lebih besar/, "Harus muncul juga: Lima lebih besar"]] },
      hints: ["Cek baris 1: tanda kutipnya berpasangan?", "Cek baris 2: if harus diakhiri apa?", "Tambahkan <code>\"</code> sebelum <code>)</code> di baris 1, dan <code>:</code> di akhir baris 2."],
      success: "Monster tata bahasa kabur! ✏️",
    },
  },
  {
    id: "w6-3", world: 6, icon: "❓", title: "Nama Misterius", topic: "NameError",
    story: "Hantu gua suka mengganti nama-nama variable. Python jadi kebingungan! 👻",
    concept: [
      "<b>NameError</b> = Python tidak kenal sebuah nama.",
      "Penyebab: salah ketik nama variable, memakai variable sebelum dibuat, atau lupa tanda kutip pada tulisan (jadi dianggap nama variable).",
    ],
    analogy: "📞 Seperti memanggil teman dengan nama yang salah. Dia tidak akan menoleh.",
    example: `nama = "Arga"\nprint(nmaa)`,
    breakdown: [["nmaa", "Typo. Kotak yang ada bernama 'nama'."]],
    tryNote: "Perbaiki typo-nya.",
    challenge: {
      task: "Perbaiki semua NameError supaya menampilkan <code>Arga</code> lalu <code>Selamat berjuang</code>.",
      starter: `nama_hero = "Arga"\nprint(nama_heroo)\nprint(Selamat berjuang)`,
      expect: { output: [[/Arga/, "Baris pertama harus menampilkan Arga."], [/Selamat berjuang/, "Harus muncul: Selamat berjuang"]] },
      hints: ["Ada 2 masalah: satu typo, satu lupa sesuatu.", "Nama variable-nya nama_hero (satu o).", "Tulisan Selamat berjuang harus diapit tanda kutip."],
      success: "Hantu gua kehilangan triknya 👻",
    },
  },
  {
    id: "w6-4", world: 6, icon: "🧱", title: "Jenis yang Bertabrakan", topic: "TypeError",
    story: "Golem batu mencoba menggabungkan tulisan dengan angka. BOOM! TypeError! 🧱",
    concept: [
      "<b>TypeError</b> = jenis datanya tidak cocok untuk operasi itu.",
      "Contoh klasik: <code>\"Umur \" + 20</code> → tulisan tidak bisa ditambah angka.",
      "Solusi: ubah angka menjadi tulisan dengan <code>str()</code>, atau pakai f-string.",
    ],
    analogy: "🍎➕🚗 Seperti menjumlahkan apel dengan mobil. Tidak masuk akal!",
    example: `umur = 20\n# print("Umur " + umur)  <- TypeError\nprint("Umur " + str(umur))\nprint(f"Umur {umur}")`,
    breakdown: [["str(umur)", "Ubah 20 menjadi \"20\"."], ["f\"Umur {umur}\"", "f-string otomatis mengubahnya."]],
    tryNote: "Hapus # di baris 2 dan lihat errornya.",
    challenge: {
      task: "Perbaiki TypeError supaya menampilkan <code>Umur kamu 20 tahun</code>",
      starter: `umur = 20\nprint("Umur kamu " + umur + " tahun")`,
      expect: { output: [[/Umur kamu 20 tahun/, "Output-nya harus: Umur kamu 20 tahun"]] },
      hints: ["Masalahnya: tulisan + angka.", "Ubah umur menjadi tulisan dengan <code>str()</code>.", "<code>\"Umur kamu \" + str(umur) + \" tahun\"</code> atau pakai f-string."],
      success: "Golem batu runtuh! 🧱",
    },
  },
  {
    id: "w6-5", world: 6, icon: "🎯", title: "Nilai Nyasar", topic: "ValueError & IndexError",
    story: "Dua monster kembar menghadang: <b>ValueError</b> si pengacau nilai dan <b>IndexError</b> si pencuri urutan! 👹👹",
    concept: [
      "<b>ValueError</b> = jenisnya benar tapi nilainya tidak bisa diproses. Contoh: <code>int(\"sepuluh\")</code>.",
      "<b>IndexError</b> = mengambil index yang tidak ada. List dengan 3 item hanya punya index 0, 1, 2.",
    ],
    analogy: "🏨 IndexError itu seperti mencari kamar nomor 5 di hotel yang hanya punya 3 kamar.",
    example: `daftar = ["a", "b", "c"]\nprint(daftar[2])\nprint(len(daftar))`,
    breakdown: [["daftar[2]", "Index terakhir = len - 1 = 2."]],
    tryNote: "Coba int(\"abc\") dan daftar[3].",
    challenge: {
      task: "Perbaiki kedua error supaya menampilkan <code>15</code> lalu <code>c</code>.",
      starter: `angka = int("sepuluh")\ndaftar = ["a", "b", "c"]\nprint(angka + 5)\nprint(daftar[3])`,
      expect: { output: [[/(^|\n)15\s*\n/, "Baris pertama harus 15."], [/(^|\n)c\s*($|\n)/, "Baris kedua harus c."]] },
      hints: ["int() hanya bisa mengubah tulisan berisi angka, seperti \"10\".", "Item c ada di index berapa? Ingat mulai dari 0.", "<code>int(\"10\")</code> dan <code>daftar[2]</code>"],
      success: "Monster kembar dikalahkan! 👹⚔️",
    },
  },
  {
    id: "w6-6", world: 6, icon: "🏆", title: "Debugging Challenge: Bos Gua", topic: "Debugging sederhana",
    story: "Bos terakhir Bug Cave: kode dengan <b>3 bug sekaligus</b>! Gunakan semua ilmumu. 🐉",
    concept: [
      "Strategi debugging: 1) RUN, 2) baca error dari bawah, 3) perbaiki satu bug, 4) RUN lagi. Ulangi sampai bersih.",
      "Trik pro: tambahkan <code>print()</code> di tengah kode untuk melihat isi variable. Ini disebut <b>print debugging</b>.",
    ],
    analogy: "🕵️ Seperti detektif: kumpulkan petunjuk satu per satu, jangan panik.",
    example: `nilai = [80, 90]\ntotal = sum(nilai)\nprint("cek total:", total)  # print debugging\nprint(total / len(nilai))`,
    breakdown: [["print(\"cek total:\", total)", "Mengintip isi variable saat program berjalan."]],
    tryNote: "Pakai print debugging untuk melihat isi variable.",
    challenge: {
      task: "Perbaiki 3 bug supaya program menampilkan <code>Rata-rata: 80.0</code>",
      starter: `def hitung_rata(nilai)\n    total = 0\n    for n in nilai:\n        total = total + n\n    return total / len(nilaii)\n\ndata = [80, 90, 70]\nprint("Rata-rata: " + hitung_rata(data))`,
      expect: { output: [[/Rata-rata:\s*80(\.0)?/, "Output-nya harus: Rata-rata: 80.0"]] },
      hints: ["Bug 1 adalah SyntaxError di baris def.", "Bug 2: typo nama variable. Bug 3: menggabungkan tulisan dengan angka.", "Tambahkan <code>:</code> setelah def, ganti <code>nilaii</code> jadi <code>nilai</code>, dan bungkus hasilnya dengan <code>str()</code>."],
      success: "BOS GUA DIKALAHKAN! Kamu resmi Bug Hunter 🐉🏆",
    },
  },

  /* ===================== WORLD 7 — PYTHON ADVENTURE (PROJECT) ===================== */
  {
    id: "w7-1", world: 7, icon: "🧮", title: "Project: Kalkulator Sederhana", topic: "input + if + operator",
    story: "Petualangan terakhir dimulai! ⚔️ Kota pertama butuh <b>kalkulator</b> untuk para pedagang.",
    concept: [
      "Rencana: 1) tanya angka pertama, 2) tanya operator (+, -, *, /), 3) tanya angka kedua, 4) pakai if/elif untuk memilih operasi.",
      "Gunakan <code>float()</code> agar bisa menghitung desimal juga.",
    ],
    analogy: "🧱 Project = menyusun potongan-potongan ilmu yang sudah kamu kumpulkan.",
    example: `a = float(input("Angka 1: "))\nop = input("Operator: ")\nb = float(input("Angka 2: "))\n\nif op == "+":\n    print(a + b)`,
    inputs: ["8", "+", "2"],
    breakdown: [["float(input(...))", "Tanya angka & ubah ke desimal."], ["if op == \"+\":", "Pilih operasi sesuai operator."]],
    tryNote: "Lengkapi untuk operator lainnya.",
    challenge: {
      task: "Lengkapi kalkulator untuk <code>+</code>, <code>-</code>, <code>*</code>, dan <code>/</code>. Tampilkan hasilnya dengan format <code>Hasil: ...</code>",
      starter: `a = float(input("Angka 1: "))\nop = input("Operator (+ - * /): ")\nb = float(input("Angka 2: "))\n\nif op == "+":\n    print("Hasil:", a + b)\n# lanjutkan dengan elif...\n`,
      tests: [
        { inputs: ["8", "+", "2"], output: [/Hasil:?\s*10(\.0)?/, "8 + 2 harus Hasil: 10.0"] },
        { inputs: ["9", "-", "4"], output: [/Hasil:?\s*5(\.0)?/, "9 - 4 harus Hasil: 5.0"] },
        { inputs: ["8", "*", "2"], output: [/Hasil:?\s*16(\.0)?/, "8 * 2 harus Hasil: 16.0"] },
        { inputs: ["8", "/", "2"], output: [/Hasil:?\s*4(\.0)?/, "8 / 2 harus Hasil: 4.0"] },
      ],
      expect: { code: [[/elif/, "Gunakan elif untuk operator lainnya."]] },
      hints: ["Tambahkan elif untuk setiap operator.", "<code>elif op == \"-\":</code> lalu print hasil a - b.", "Ulangi pola yang sama untuk <code>\"*\"</code> dan <code>\"/\"</code>."],
      success: "Kalkulator jadi! Para pedagang berterima kasih 🧮",
    },
  },
  {
    id: "w7-2", world: 7, icon: "🌡️", title: "Project: Konversi Suhu", topic: "function + input",
    story: "Pelancong dari negeri jauh bingung dengan satuan suhu. Bantu mereka mengubah <b>Celsius ke Fahrenheit</b>! 🌡️",
    concept: ["Rumus: <code>F = C × 9 / 5 + 32</code>.", "Bungkus rumus dalam function supaya bisa dipakai berulang."],
    analogy: "🌍 Seperti penerjemah bahasa, tapi untuk angka suhu.",
    example: `def ke_kelvin(c):\n    return c + 273.15\n\nprint(ke_kelvin(25))`,
    breakdown: [["return c + 273.15", "Rumus Celsius ke Kelvin."]],
    tryNote: "Coba berbagai suhu.",
    challenge: {
      task: "Buat function <code>ke_fahrenheit(c)</code> yang me-return hasil konversi. Tanya <code>Suhu Celsius: </code> (float), lalu tampilkan <code>Fahrenheit: ...</code>",
      starter: `def ke_fahrenheit(c):\n    \n\nc = float(input("Suhu Celsius: "))\n`,
      tests: [
        { inputs: ["100"], output: [/Fahrenheit:?\s*212(\.0)?/, "100°C harus menjadi Fahrenheit: 212.0"] },
        { inputs: ["0"], output: [/Fahrenheit:?\s*32(\.0)?/, "0°C harus menjadi Fahrenheit: 32.0"] },
      ],
      expect: { code: [[/def\s+ke_fahrenheit/, "Buat function ke_fahrenheit."], [/return/, "Gunakan return."]] },
      hints: ["Di function: <code>return c * 9 / 5 + 32</code>", "Panggil function dengan suhu dari input.", "<code>print(\"Fahrenheit:\", ke_fahrenheit(c))</code>"],
      success: "Para pelancong tidak bingung lagi 🌡️",
    },
  },
  {
    id: "w7-3", world: 7, icon: "🧾", title: "Project: Kasir Sederhana", topic: "loop + akumulator + if",
    story: "Pasar besar butuh kasir yang bisa menghitung banyak barang dan memberi <b>diskon</b> untuk belanja besar. 🧾",
    concept: [
      "Tanya jumlah barang, lalu loop sebanyak itu untuk menanyakan harga setiap barang.",
      "Jika total lebih dari 100000, beri diskon 10% (total × 0.9).",
    ],
    analogy: "🛒 Kasir men-scan barang satu per satu, lalu memberi potongan kalau belanjaannya banyak.",
    example: `n = 2\ntotal = 0\nfor i in range(n):\n    total += 1000\nprint(total)`,
    breakdown: [["for i in range(n):", "Ulangi sebanyak jumlah barang."]],
    tryNote: "Ganti 1000 dengan input harga.",
    challenge: {
      task: "Tanya <code>Jumlah barang: </code>, lalu untuk setiap barang tanya <code>Harga: </code>. Jumlahkan. Jika total &gt; 100000, kalikan 0.9. Tampilkan <code>Total bayar: ...</code>",
      starter: `n = int(input("Jumlah barang: "))\ntotal = 0\n\n# loop untuk tanya harga\n\n# cek diskon\n\nprint("Total bayar:", total)`,
      tests: [
        { inputs: ["2", "50000", "70000"], output: [/Total bayar:?\s*108000(\.0)?/, "Belanja 120000 harus didiskon jadi 108000."] },
        { inputs: ["2", "10000", "5000"], output: [/Total bayar:?\s*15000(\.0)?\b/, "Belanja 15000 tidak didiskon, tetap 15000."] },
      ],
      expect: { code: [[/for|while/, "Gunakan loop untuk menanyakan harga."], [/if\s/, "Gunakan if untuk cek diskon."]] },
      hints: ["<code>for i in range(n):</code> lalu di dalamnya tanya harga dan tambahkan ke total.", "<code>total += int(input(\"Harga: \"))</code>", "Setelah loop: <code>if total > 100000:</code> → <code>total = total * 0.9</code>"],
      success: "Antrean pasar jadi lancar 🧾",
    },
  },
  {
    id: "w7-4", world: 7, icon: "🎓", title: "Project: Sistem Nilai Mahasiswa", topic: "dict + function + loop",
    story: "Universitas kerajaan ingin mengolah nilai satu kelas sekaligus. 🎓",
    concept: ["Simpan data di dictionary, buat function <code>grade(n)</code>, lalu loop setiap mahasiswa."],
    analogy: "📊 Seperti spreadsheet nilai yang otomatis mengisi kolom grade.",
    example: `def lulus(n):\n    return n >= 55\n\nprint(lulus(70))`,
    breakdown: [["return n >= 55", "Function bisa me-return Boolean."]],
    tryNote: "Coba lulus(40).",
    challenge: {
      task: "Buat function <code>grade(n)</code> (A ≥ 85, B ≥ 70, C ≥ 55, selain itu D). Loop dictionary <code>kelas</code> dan tampilkan <code>Nama: Grade</code>, misal <code>Andi: A</code>.",
      starter: `kelas = {"Andi": 88, "Bela": 72, "Citra": 59, "Dodi": 45}\n\ndef grade(n):\n    \n\n`,
      expect: {
        output: [[/Andi: A/, "Harus ada Andi: A"], [/Bela: B/, "Harus ada Bela: B"], [/Citra: C/, "Harus ada Citra: C"], [/Dodi: D/, "Harus ada Dodi: D"]],
        code: [[/def\s+grade/, "Buat function grade."], [/for\s/, "Gunakan loop."], [/return/, "grade harus me-return hurufnya."]],
      },
      hints: ["Di function: if/elif/else yang masing-masing me-return \"A\", \"B\", \"C\", atau \"D\".", "Loop: <code>for nama, n in kelas.items():</code>", "<code>print(f\"{nama}: {grade(n)}\")</code>"],
      success: "Rapor seluruh kelas selesai dalam sekejap 🎓",
    },
  },
  {
    id: "w7-5", world: 7, icon: "✅", title: "Project: To-Do List", topic: "while + list + menu",
    story: "Para ksatria sering lupa tugasnya. Buatkan mereka <b>aplikasi to-do list</b>! ✅",
    concept: [
      "Gunakan <code>while True:</code> untuk menu yang terus berulang, dan <code>break</code> saat user mengetik \"keluar\".",
      "Simpan tugas di list dengan append. Tampilkan bernomor pakai <code>enumerate(list, 1)</code>.",
    ],
    analogy: "📋 Seperti papan tugas: tambah catatan, lihat semua, lalu tutup.",
    example: `tugas = ["Latihan pedang"]\nfor i, t in enumerate(tugas, 1):\n    print(f"{i}. {t}")`,
    breakdown: [["enumerate(tugas, 1)", "Memberi nomor mulai dari 1."]],
    tryNote: "Tambah tugas lain ke list.",
    challenge: {
      task: "Lengkapi program menu: perintah <code>tambah</code> (lalu tanya tugasnya), <code>lihat</code> (tampilkan bernomor <code>1. ...</code>), <code>keluar</code> (berhenti).<br><small>Input tes: tambah, Belajar Python, tambah, Main game, lihat, keluar</small>",
      starter: `tugas = []\n\nwhile True:\n    perintah = input("Perintah: ")\n    if perintah == "tambah":\n        \n    elif perintah == "lihat":\n        \n    elif perintah == "keluar":\n        print("Sampai jumpa!")\n        break`,
      inputs: ["tambah", "Belajar Python", "tambah", "Main game", "lihat", "keluar"],
      expect: {
        output: [[/1\.\s*Belajar Python/, "Saat lihat, harus tampil: 1. Belajar Python"], [/2\.\s*Main game/, "Harus tampil juga: 2. Main game"], [/Sampai jumpa!/, "Program harus berhenti dengan Sampai jumpa!"]],
        code: [[/append/, "Gunakan append untuk menambah tugas."]],
      },
      hints: ["Di bagian tambah: tanya tugas dengan input, lalu append ke list.", "<code>tugas.append(input(\"Tugas: \"))</code>", "Di bagian lihat: <code>for i, t in enumerate(tugas, 1):</code> → <code>print(f\"{i}. {t}\")</code>"],
      success: "Para ksatria tidak pernah lupa tugas lagi ✅",
    },
  },
  {
    id: "w7-6", world: 7, icon: "🗺️", title: "Project: Text Adventure", topic: "function + if + input",
    story: "Seorang pendongeng ingin cerita interaktif: pembaca memilih jalannya sendiri! 🗺️",
    concept: ["Buat function untuk setiap ruangan/kejadian. Pilihan user menentukan function mana yang dipanggil.", "Gunakan <code>.lower()</code> supaya \"KIRI\" dan \"kiri\" dianggap sama."],
    analogy: "📚 Seperti buku \"pilih petualanganmu sendiri\".",
    example: `def gua():\n    print("Kamu masuk gua yang gelap...")\n\npilihan = input("Masuk gua? (ya/tidak) ").lower()\nif pilihan == "ya":\n    gua()`,
    inputs: ["YA"],
    breakdown: [[".lower()", "Ubah ke huruf kecil agar mudah dibandingkan."]],
    tryNote: "Tambahkan pilihan lain.",
    challenge: {
      task: "Tanya <code>Kamu di persimpangan. Kiri atau kanan? </code>. Jika <code>kiri</code> panggil function <code>jalan_kiri()</code> yang menampilkan <code>Kamu menemukan harta karun!</code>. Jika <code>kanan</code> panggil <code>jalan_kanan()</code> yang menampilkan <code>Ada naga! Lari!</code>. Selain itu tampilkan <code>Kamu tersesat...</code>",
      starter: `def jalan_kiri():\n    \n\ndef jalan_kanan():\n    \n\npilihan = input("Kamu di persimpangan. Kiri atau kanan? ").lower()\n`,
      tests: [
        { inputs: ["kiri"], output: [/harta karun/, "Pilihan kiri harus menampilkan: Kamu menemukan harta karun!"] },
        { inputs: ["KANAN"], output: [/Ada naga! Lari!/, "Pilihan KANAN harus menampilkan: Ada naga! Lari! (pakai .lower())"] },
        { inputs: ["atas"], output: [/tersesat/, "Pilihan lain harus menampilkan: Kamu tersesat..."] },
      ],
      expect: { code: [[/def\s+jalan_kiri/, "Buat function jalan_kiri."], [/def\s+jalan_kanan/, "Buat function jalan_kanan."]] },
      hints: ["Isi setiap function dengan print yang sesuai.", "Lalu if/elif/else berdasarkan pilihan.", "<code>if pilihan == \"kiri\":</code> → <code>jalan_kiri()</code>, <code>elif pilihan == \"kanan\":</code> → <code>jalan_kanan()</code>, <code>else:</code> → print tersesat."],
      success: "Ceritamu hidup! Pembaca bisa memilih takdirnya 🗺️",
    },
  },
  {
    id: "w7-7", world: 7, icon: "👑", title: "FINAL QUEST: Tebak Angka", topic: "Gabungan SEMUA materi",
    story: "Inilah <b>FINAL QUEST</b>! 👑 Raja Python menantangmu membuat mini game <b>Tebak Angka</b>. Python memilih angka rahasia, pemain menebak, dan program memberi petunjuk.",
    concept: [
      "<code>import random</code> lalu <code>random.randint(1, 100)</code> memilih angka acak 1–100.",
      "Gabungkan: <b>variable</b>, <b>input</b>, <b>if/elif/else</b>, <b>while loop</b>, <b>function</b>, dan <b>random</b>.",
      "Untuk tes otomatis, kami akan menebak 1, 2, 3, … sampai benar. Jadi pastikan loop berhenti (break) saat tebakan benar!",
    ],
    analogy: "🎲 Seperti permainan tebak-tebakan dengan teman, tapi temanmu adalah Python.",
    example: `import random\n\nrahasia = random.randint(1, 10)\nprint("Angka rahasia (ssst):", rahasia)`,
    breakdown: [["import random", "Memanggil modul acak."], ["random.randint(1, 10)", "Angka acak dari 1 sampai 10."]],
    tryNote: "RUN beberapa kali, angkanya berubah-ubah!",
    challenge: {
      task: "Buat game Tebak Angka:<br>1) Function <code>cek(tebakan, rahasia)</code> me-return <code>\"Terlalu besar.\"</code>, <code>\"Terlalu kecil.\"</code>, atau <code>\"Benar!\"</code><br>2) Angka rahasia dari <code>random.randint(1, 100)</code><br>3) Loop <code>while</code>: tanya <code>Tebakan: </code>, tampilkan hasil <code>cek</code>, berhenti jika benar.",
      starter: `import random\n\ndef cek(tebakan, rahasia):\n    # return "Terlalu besar.", "Terlalu kecil.", atau "Benar!"\n    \n\nrahasia = random.randint(1, 100)\n\nwhile True:\n    tebakan = int(input("Tebakan: "))\n    hasil = cek(tebakan, rahasia)\n    print(hasil)\n    # berhenti jika benar\n`,
      inputs: Array.from({ length: 100 }, (_, i) => String(i + 1)),
      expect: {
        output: [[/Benar!/, "Game harus menampilkan Benar! saat tebakan tepat."]],
        notOutput: [[/Terlalu besar/, "Tes menebak dari 1 ke atas, jadi seharusnya tidak pernah muncul \"Terlalu besar\" sebelum benar. Cek lagi kondisi di function cek."]],
        code: [[/import\s+random/, "Jangan lupa import random."], [/randint\s*\(/, "Gunakan random.randint(1, 100)."], [/def\s+cek/, "Buat function cek."], [/while/, "Gunakan while loop."], [/break/, "Gunakan break saat tebakan benar."]],
      },
      hints: [
        "Di function cek: <code>if tebakan > rahasia:</code> return \"Terlalu besar.\" dan seterusnya.",
        "Di dalam loop, setelah print(hasil): <code>if hasil == \"Benar!\":</code> lalu <code>break</code>.",
        "Function: <code>if tebakan > rahasia: return \"Terlalu besar.\"</code> / <code>elif tebakan < rahasia: return \"Terlalu kecil.\"</code> / <code>else: return \"Benar!\"</code>",
      ],
      success: "KAMU BERHASIL! 👑 Kamu sekarang seorang PYTHON ADVENTURER sejati!",
    },
  },
];

/* ---------- helper ---------- */
function getLesson(id) { return LESSONS.find((l) => l.id === id); }
function getWorld(id) { return WORLDS.find((w) => w.id === id); }
function lessonsOfWorld(w) { return LESSONS.filter((l) => l.world === w); }
function lessonNumber(l) { return LESSONS.indexOf(l) + 1; }
function isLessonUnlocked(l, p) {
  if (p.freeMode) return true;
  const i = LESSONS.indexOf(l);
  if (i <= 0) return true;
  return p.completedLessons.includes(LESSONS[i - 1].id);
}
function nextLesson(p) { return LESSONS.find((l) => !p.completedLessons.includes(l.id)) || null; }
function worldProgress(w, p) {
  const ls = lessonsOfWorld(w);
  const done = ls.filter((l) => p.completedLessons.includes(l.id)).length;
  return { done, total: ls.length, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
}
