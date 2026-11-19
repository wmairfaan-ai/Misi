# Misi Jeti Kuala Senyum: Panduan Guru

Aplikasi web luar talian untuk **Sains KSSR Tahun 4: Ketumpatan** (40 minit, 6 bot). Aplikasi ini menemani eksperimen air sebenar. Murid tetap meramal dan menguji objek di meja; aplikasi membimbing misi, menerima kod, memaparkan petunjuk dan menjalankan upacara.

Tiada internet diperlukan. Tiada nama murid disimpan. Semua data kekal dalam pelayar komputer ini.

---

## 1. Cara menjalankan (Windows)

1. Buka **PowerShell**.
2. Pergi ke folder aplikasi:
   ```
   cd "C:\Users\wmair\OneDrive\Desktop\Claude Code Project\Education Games\misi-jeti"
   ```
3. Mulakan pelayan tempatan (hanya laptop ini boleh membukanya):
   ```
   py -m http.server 8000 --bind 127.0.0.1
   ```
   (Jika `py` tiada, cuba `python -m http.server 8000 --bind 127.0.0.1`.)
4. Buka pelayar (Chrome atau Edge) dan pergi ke **http://localhost:8000**
5. Biarkan tetingkap PowerShell terbuka sepanjang kelas. Tekan `Ctrl+C` di PowerShell untuk berhenti selepas kelas.

**Mengapa `--bind 127.0.0.1`?** Tanpanya, pelayan mendengar pada semua rangkaian. Mana-mana peranti dalam Wi-Fi sekolah boleh memuat turun fail dalam folder ini, termasuk `js/kunci-jawapan.js` (kunci jawapan) dan nota pembinaan.

**Mod Tablet melalui rangkaian (pilihan, dengan amaran):** tablet hanya boleh membuka aplikasi dari laptop guru jika pelayan dijalankan TANPA `--bind` (`py -m http.server 8000`), kemudian tablet membuka `http://<IP laptop>:8000`. Dalam keadaan ini, sesiapa dalam rangkaian yang sama boleh memuat turun kunci jawapan.
- Cara paling selamat: salin folder aplikasi ke setiap tablet **tanpa** `js/kunci-jawapan.js`, atau alihkan `js/kunci-jawapan.js` keluar dari folder ini semasa pelayan rangkaian berjalan.
- Tablet tidak memuatkan kunci jawapan semasa but (hanya laptop guru di `localhost` yang berbuat demikian). Pada tablet, tetapkan kod misi dalam Panel Guru > **Kunci**.

**Penting:**
- Gunakan `localhost`, bukan dwiklik `index.html`. Dwiklik (`file://`) boleh berfungsi, tetapi data dan cincangan kod lebih stabil di localhost.
- Gunakan **pelayar dan profil yang sama** setiap kali, supaya data kekal.
- Folder ini dalam OneDrive. Klik kanan folder, pilih **"Sentiasa simpan pada peranti ini"** supaya boleh dibuka tanpa internet di sekolah.

---

## 2. Panel Guru

Panel Guru menyimpan metrik penguasaan, butang Cop, pemasa, kunci misi, gelaran, laporan dan tetapan. **Murid tidak pernah melihat metrik atau kunci jawapan di skrin mereka.**

### Cara membuka
| Cara | Bila digunakan |
|---|---|
| Tetingkap kedua: **http://localhost:8000/#/guru** | **Disyorkan** dengan paparan Extend (lihat Bahagian 3) |
| **Ctrl+Shift+G** di tetingkap murid | Laptop tanpa Extend |
| **Tekan lama logo** (kiri atas) selama 3 saat | Tablet, **hanya selepas PIN ditetapkan** pada peranti itu |

### PIN kali pertama (WAJIB pada setiap peranti sebelum kelas)
- **Tetapkan PIN pada setiap peranti (laptop dan setiap tablet) SEBELUM kelas.** Jika tidak, murid boleh menetapkan PIN sendiri dan memberi Cop kepada bot mereka.
- PIN kali pertama hanya boleh ditetapkan melalui **http://localhost:8000/#/guru** atau **Ctrl+Shift+G** (pada tablet: buka alamat aplikasi dengan `#/guru` di hujungnya). Tekan lama logo tanpa PIN hanya memaparkan "Panel Guru belum disediakan pada peranti ini".
- Kali pertama Panel Guru dibuka, anda diminta **menetapkan PIN 4 hingga 6 digit** (taip dua kali).
- Selepas itu, PIN diminta setiap kali panel dibuka.
- Panel (tindanan) **ditutup sendiri selepas 60 saat** tanpa aktiviti, atau tekan `Esc`.
- Panel dalam tetingkap `#/guru` **dikunci selepas 10 minit** tanpa aktiviti (masukkan PIN semula).
- Tukar PIN: tab **Reset > Tukar PIN**.
- **Lupa PIN?** Tekan `F12`, pilih tab **Console**, taip `MJ.keadaan.ubahGuru(function (g) { g.pinHash = null; })` dan tekan Enter. Buka panel semula untuk menetapkan PIN baharu. Metrik tidak terpadam.

### Tab
| Tab | Kegunaan |
|---|---|
| Kelulusan | Cop M1/M2/M3, "Belum lagi", Cop Penolong, permintaan Cop Penolong (termasuk hadiah Kerang: Lulus/Tolak), Penjejak Rahsia, pengesahan klip rakit ("Simpan klip"), Barisan Jeti |
| Masa | Pemasa fasa, ±1 minit, loceng, tukar fasa, pindahkan skrin projektor |
| Kunci | Buka misi, buka paksa/pintasan setiap bot, fasa bersama (Peti Mak Tok), isi ruang Hukum Muara, tetapkan kod |
| Metrik | Skala 0–3 bagi OP1–OP3, miskonsepsi, catatan, cadangan automatik |
| Gelaran | Cadangan Nakhoda, Pegawai, Jurutera, Penjejak; pilihan kuasa minggu depan |
| Kunci Jawapan | Nasib objek, kod, susunan menara, contoh penjelasan |
| Data | Cetak laporan A4, eksport CSV (rekod TP) dan JSON (sandaran), import JSON |
| Tetapan | Mod, bunyi (lalai 40%), suis kucing, Mod Ringan, saiz teks A−/A+ |
| Reset | Reset sesi (taip RESET), reset satu bot, tukar PIN |

---

## 3. Projektor: Extend atau satu skrin

### Laluan 1 (disyorkan): paparan Extend
Projektor menunjukkan skrin murid, manakala laptop menunjukkan Panel Guru.
1. Sambungkan kabel projektor ke laptop.
2. Tekan **kekunci Windows + P**, pilih **"Extend"** (Lanjutkan). Jangan pilih "Duplicate".
3. Buka `http://localhost:8000` dan **seret tetingkap pelayar ke kanan** sehingga ia muncul di projektor. Tekan **F11** untuk skrin penuh.
4. Di skrin laptop, buka tetingkap pelayar kedua ke **http://localhost:8000/#/guru**.
5. **Uji sebelum kelas:** gerakkan tetikus ke kanan sehingga ia "hilang" ke projektor, dan pastikan murid tidak nampak skrin laptop.
6. Kedua-dua tetingkap berkongsi data serta-merta. Butang dalam Panel Guru (Cop, pindah skrin, loceng, Tirai) terus mengubah projektor.
7. Selepas kelas: **Windows + P**, pilih "Duplicate" atau "PC screen only".

### Laluan 2: tiada Extend (satu skrin / Duplicate)
Dalam keadaan ini, **apa sahaja di skrin laptop kelihatan di projektor, termasuk Panel Guru.**
- Apabila Panel Guru dibuka dalam mod Projektor tanpa Extend, aplikasi menghidupkan **Mod Tirai** secara automatik dan memaparkan amaran.
- Panel sentiasa dibuka pada tab **Kelulusan** (neutral).
- Tab **Kunci**, **Metrik** dan **Kunci Jawapan** disembunyikan sehingga anda menekan **"Tunjuk"**. Bilangan cubaan kod dalam tab Kelulusan juga disembunyikan sehingga anda menekan "Tunjuk bilangan cubaan". Kandungan disembunyikan semula apabila anda menukar tab atau menutup panel.
- **Sebelum menekan "Tunjuk":** tekan **Windows + P**, pilih **"PC screen only"** supaya projektor tidak menunjukkan skrin laptop. Selepas selesai, tekan Windows + P semula dan pilih "Duplicate".
- Butang Cop dan pemasa boleh digunakan terus (tiada maklumat sulit).

### Kekunci pantas
| Kekunci | Fungsi |
|---|---|
| `T` | Mod Tirai (skrin projektor gelap, logo sahaja). Dalam tetingkap `#/guru`, `T` menghantar arahan Tirai ke projektor. |
| `M` | Senyap / bunyi |
| `Ctrl+Shift+G` | Panel Guru |
| `Esc` | Tutup Panel Guru atau tetingkap kecil |

---

## 4. Sebelum kelas (5 minit)

1. Jalankan `py -m http.server 8000 --bind 127.0.0.1` dan buka aplikasi.
2. **Tetapkan PIN guru** pada laptop ini dan pada setiap tablet (lihat Bahagian 2).
3. Pilih **Mod Projektor** (atau Mod Tablet untuk tablet satu bot).
4. Lantik krew bagi setiap bot (tiada nama murid, hanya Ahli 1–5).
5. Buka Panel Guru > **Kunci**: pastikan ketiga-tiga kod misi bertanda "ditetapkan" atau "lalai", dan tiada amaran "TIDAK SEPADAN". Jika "BELUM" atau "TIDAK SEPADAN", tekan **"Jana semula daripada kunci-jawapan.js"** (atau taip kod di situ).
6. **Kad objek fizikal:** pastikan huruf di belakang setiap kad sama dengan Panel Guru > Kunci Jawapan (lajur "Huruf"). Huruf telah dikemas kini **tiga kali pada November 2026** (kali terakhir 15 November 2026, petang: huruf beberapa objek ditukar). Cetak semula SEMUA kad objek, termasuk kad yang dicetak selepas kemas kini sebelumnya; rujuk lajur "Huruf" dalam Panel Guru > Kunci Jawapan. Jika Panel Guru > Kunci menunjukkan "TIDAK SEPADAN", tekan "Jana semula daripada kunci-jawapan.js". Dalam Log Krew kertas, tambah arahan: "Tolak setiap objek ke bawah air, kemudian lepaskan."
7. Panel Guru > **Masa**: pilih fasa "Permulaan".
8. Uji bunyi (lalai 40%) dan pastikan kucing bergerak lancar. Jika laptop perlahan, hidupkan **Mod Ringan** dalam tab Tetapan.

---

## 5. Kod misi dan kunci jawapan

- Kod misi disimpan sebagai **cincangan** sahaja. Kod tidak tertulis sebagai teks biasa dalam `js/kandungan.js`.
- Fail `js/kunci-jawapan.js` mengandungi jawapan yang boleh dibaca. Fail ini **hanya untuk komputer guru**. Ia disenaraikan dalam `.gitignore` dan **tidak boleh** dimuat naik ke GitHub Pages.
- `kunci-jawapan.js` **tidak** dimuat oleh halaman murid. Aplikasi memuatkannya seketika semasa dibuka di `localhost` (laptop guru) untuk mencincang kod, kemudian membuangnya daripada memori. Ia dimuat semula hanya apabila Panel Guru dibuka (selepas PIN) atau di Galeri selepas Peti Mak Tok dibuka.
- Jika kod dalam `kunci-jawapan.js` ditukar, cincangan dikemas kini sendiri semasa aplikasi dibuka semula di laptop guru, **kecuali** kod yang anda taip sendiri dalam Panel Guru > Kunci (ditanda "manual"). Jika Panel Guru > Kunci menunjukkan "TIDAK SEPADAN", tekan **"Jana semula daripada kunci-jawapan.js"**.
- Huruf di belakang kad objek ada dalam `js/kandungan.js` (`objek[].huruf`). Jika anda menukar huruf, objek atau cecair, kemas kini kod dalam `kunci-jawapan.js` dan cetak semula kad fizikal, atau tetapkan kod baharu dalam Panel Guru > **Kunci**.
- Untuk versi awam (GitHub Pages): Panel Guru > Kunci > **Papar cincangan**, salin baris itu ke `kodHashLalai` dalam `js/kandungan.js`.

Teks permainan (dialog, petunjuk, situasi, Tiket Keluar, label skrin dalam `teksSkrin`) boleh disunting dalam `js/kandungan.js`. Jangan tulis kod misi atau kata rahsia di situ.

**Kata rahsia Botol Misteri:** lihat `js/kunci-jawapan.js` (`kataRahsia`). Ia disimpan sebagai cincangan, sama seperti kod misi, dan dicincang sendiri semasa aplikasi dibuka di laptop guru. Untuk menukarnya: Panel Guru > Kunci > "Kata rahsia Botol Misteri", atau ubah `kunci-jawapan.js`. Pada tablet, tetapkannya dalam Panel Guru > Kunci.

---

## 6. Reset dan sandaran

- **Akhir setiap sesi:** Panel Guru > Data > **Eksport JSON** (sandaran) dan **Eksport CSV** (rekod TP). Cetak laporan jika perlu.
- **Sesi baharu:** Panel Guru > Reset > taip `RESET` > **Reset sesi**. Tandakan kotak "Padam juga metrik" jika mahu kosongkan metrik juga. Projektor kembali ke Skrin Mula.
- **Satu bot sahaja:** Panel Guru > Reset > pilih bot > **Reset bot ini**.
- **Import:** Panel Guru > Data > Pilih fail JSON. Fail dari tablet hanya menggabungkan bot tablet itu.
- Memadam sejarah/cache pelayar akan memadam data aplikasi. Eksport JSON dahulu.

---

## 7. Masalah biasa

| Masalah | Penyelesaian |
|---|---|
| Tiada bunyi | Klik sekali di skrin (pelayar menyekat bunyi sebelum klik pertama). Semak butang bunyi di kanan atas dan tab Tetapan. |
| "Kod misi belum ditetapkan" | Panel Guru > Kunci > tetapkan kod. |
| Kucing tersekat-sekat | Tetapan > Mod Ringan: Hidup, atau Kurangkan animasi. |
| Projektor tidak berubah apabila butang PG ditekan | Pastikan kedua-dua tetingkap menggunakan alamat yang sama (`http://localhost:8000`) dalam pelayar yang sama. |
| Surat Petunjuk 3 (Misi 1 atau 2) belum boleh dibuka | Normal. Surat ketiga dibuka selepas "Angkat Bendera Uji" bagi misi itu (Mod Projektor), atau selepas krew menekan "Selesai Uji" (Misi 1 dan 2) dalam Mod Tablet. Tiada kerang ditolak. Jika krew sudah menguji tanpa Bendera Uji di skrin: Panel Guru > Kunci > "Buka P3 Misi N". |
| Panel Guru tertutup sendiri | Normal selepas 60 saat tanpa aktiviti (keselamatan). Buka semula. |
