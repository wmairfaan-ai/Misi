# Dokumen Reka Bentuk Sistem: "Misi Jeti Kuala Senyum" (Versi Digital)

**Sains KSSR (Semakan) Tahun 4: Ketumpatan | 40 minit | 30 murid, 6 bot | Aplikasi web statik luar talian**

> **Status: DRAF 2. Untuk kelulusan akhir guru.** Kod belum dibina. Jawapan guru kepada soalan terbuka telah digabungkan (lihat Bahagian 10.3). Pembinaan bermula selepas guru meluluskan draf ini. Semua fail projek akan dibina dalam folder `Education Games\misi-jeti\`.

### Perubahan dalam DRAF 2
| # | Perubahan | Bahagian |
|---|---|---|
| 1 | Kucing kedua dinamakan **Si Kiko** (baka Ragdoll), warna **blue point kelabu-putih** dengan garis luar gelap untuk projektor | 4.0, 4.1, seluruh dokumen |
| 2 | **Belai dibenarkan dalam Mod Projektor**. Hover tetikus pada badan kucing menghasilkan **"meow" sintesis** dan reaksi kecil, dengan had kekerapan. | 4.3.2, 4.3.3, 5.3, R12, R15 |
| 3 | Bunyi **lalai HIDUP pada 40%** (julat 35–45%) | 5.3, 6.3 |
| 4 | Interaksi kucing-dengan-kucing: **`bermain-kejar`** dan **`bergomol`** melalui koreografi berpasangan | 4.3.1(g), 4.3.3, R12, R13 |
| 5 | Kotak **Panduan Guru: Extend di Windows** | 7.1 |
| 6 | Kod misi disimpan sebagai **cincangan (hash)**, dan Kunci Jawapan dalam fail tempatan yang tidak diterbitkan | 6.4, 8.1, 8.3, R5 |
| 7 | Soalan terbuka ditukar kepada **Keputusan guru** dan **Diputuskan (lalai)** | 10.3 |

---

## 1. Ringkasan dan matlamat

### 1.1 Apa yang dibina
Sebuah aplikasi web statik (HTML, CSS dan JavaScript biasa, tanpa framework, tanpa internet) yang **menemani** eksperimen air sebenar dalam rancangan "Misi Jeti Kuala Senyum". Murid masih meramal dan menguji objek fizikal di meja mereka. Aplikasi pula menjalankan tugas berikut:
- membimbing misi melalui naratif dan dua kucing peneman yang hidup, **Si Oyen** dan **Si Kiko**;
- menerima kod misi dan merekod ramalan serta keputusan (terperinci dalam mod tablet);
- memaparkan infografik interaktif, seperti objek terapung/tenggelam dan menara lapisan cecair;
- mengurus **Carta Muara** (Bintang Laut), **Kerang Petunjuk** (tangga P1→P2→P3), **Peti Mak Tok** (bersama) dan **Upacara Jeti**;
- menyimpan **metrik penguasaan secara tersembunyi** dalam Panel Guru.

Struktur asal dikekalkan: 3 misi, fasa bersama, upacara dan Tiket Keluar dalam 40 minit untuk 30 murid (6 bot × 5).

### 1.2 Mengapa versi digital lebih menarik dan kurang membosankan

| Masalah dalam versi kertas | Penyelesaian digital |
|---|---|
| Naratif bergantung sepenuhnya pada suara guru. | Kucing bercakap melalui gelembung dialog, bergerak ke elemen yang dibincangkan, dan bermain sesama sendiri. Surat watak manusia "dihantar" oleh Kiko. Cerita kelihatan hidup. |
| Maklum balas lambat kerana guru perlu ke setiap meja. | Peti Kod memberi maklum balas **segera** yang tidak menghukum. Kucing bereaksi serta-merta. |
| Carta Muara di papan putih statik. | Bot bergerak di sepanjang sungai, Bintang Laut "jatuh" ke dalam bot dan gelaran muncul sebagai reben. |
| Ramalan yang salah terasa seperti kegagalan. | Ramalan yang tidak sepadan dengan keputusan dikira sebagai **"Kejutan Lautan"** dan diraikan sebagai penemuan. |
| Konsolidasi bergantung pada lukisan guru. | Galeri Hukum Muara menunjukkan animasi konsep selepas semua bot selesai, jadi tiada jawapan bocor lebih awal. |
| Upacara sukar dijadikan dramatik. | Loceng jeti, skrol pengisytiharan, sorakan ombak, kucing bertopi nakhoda dan pusingan kemenangan berkejaran. |

### 1.3 Prinsip reka bentuk (tidak boleh dilanggar)
1. **Air sebenar ialah sumber kebenaran.** Aplikasi **tidak pernah** memaparkan sama ada sesuatu objek terapung atau tenggelam, atau susunan sebenar cecair, sebelum murid menguji sendiri. Animasi "fizik betul" hanya dibuka selepas Peti Mak Tok dibuka.
2. **Tiada jawapan diberi terus.** Tiada butang "Tunjuk Jawapan" di skrin murid. Kunci jawapan hanya wujud dalam Panel Guru.
3. **Metrik penguasaan tidak pernah dipaparkan di skrin murid**, termasuk dalam bentuk ikon, warna atau kurungan.
4. **Skrin tidak boleh mencuri tumpuan daripada air.** Semasa murid menguji, skrin bertukar kepada "Mod Uji": paparan tenang tanpa interaksi, tanpa meow dan tanpa permainan kucing.
5. **Bacaan ringan.** Setiap gelembung dialog mengandungi paling banyak lebih kurang 20 perkataan, dan setiap skrin hanya mempunyai satu arahan utama.

---

## 2. Aliran skrin

### 2.1 Senarai skrin

| Kod | Skrin | Tujuan |
|---|---|---|
| S0 | **Skrin Mula** | Tajuk, pilihan mod (Projektor / Tablet), telegram pembukaan daripada Kapten Hamzah |
| S1 | **Daftar Krew** | 6 bot, peranan (Kapten, Penguji, Jurutulis, Pemerhati, Juruhubung) dan Surat Lantikan Krew. **Tiada nama murid disimpan.** |
| S2 | **Peta Jeti (hab)** | Carta Muara, status misi setiap bot, pemasa pasang surut, dan pintu ke misi, petunjuk dan Botol Misteri |
| S3 | **Misi 1: Rakit dan Sauh** | S3a Taklimat → S3b Ramal → S3c Mod Uji → S3d Rekod → S3e Selak dan Susun Kod → S3f Jelaskan dan Cop |
| S4 | **Misi 2: Menara Pak Din** | S4a Taklimat → S4b Ramal Menara → S4c Mod Uji (Tuang) → S4d Rekod Pemerhatian → S4e Kod dan Jelaskan → Cop |
| S5 | **Misi 3: Telegram Kapten** | S5a Kad Situasi (selak) → S5b Jelaskan → Cop → Serpihan Hukum Muara |
| S6 | **Surat Petunjuk** (tindanan) | Kiko menghantar surat P1/P2/P3. Satu Kerang Petunjuk ditebus. |
| S7 | **Bantu Dahulu dan Peti Bonus** | Gerbang berantai yang terbuka selepas Cop Penolong, kemudian Cabaran Rakit (rekod klip) |
| S8 | **Botol Misteri** (laluan explorer) | Dibuka dengan kata rahsia daripada Gulungan Rahsia fizikal |
| S9 | **Peti Mak Tok** (bersama) | Seret 6 serpihan ke dalam papan Hukum Muara, kelas melengkapkan secara lisan, kemudian peti terbuka |
| S10 | **Galeri Hukum Muara** | Infografik konsep dengan animasi fizik betul (konsolidasi) |
| S11 | **Upacara Jeti** | Loceng, skrol pengisytiharan, gelaran, akses, kuasa dan sorakan ombak |
| S12 | **Tiket Keluar** | 3 soalan dipaparkan besar-besar. Murid menjawab **di atas kertas**. |
| PG | **Panel Guru** (tersembunyi) | Metrik 0–3, kelulusan (Cop), masa, buka kunci, gelaran, eksport dan reset |

### 2.2 Rajah aliran

```
S0 Skrin Mula
   ├─[Mod Projektor]──────────────┐
   └─[Mod Tablet: pilih 1 bot]────┤
                                  ▼
                         S1 Daftar Krew (6 bot / 1 bot)
                                  ▼
            ┌──────────────► S2 PETA JETI (hab) ◄───────────────┐
            │                     │                              │
            │      ┌──────────────┼───────────────┬─────────┐    │
            │      ▼              ▼               ▼         ▼    │
            │   S3 Misi 1 ──► S4 Misi 2 ──► S5 Misi 3   S8 Botol │
            │   (kod+cop)     (kod+cop)     (cop+serpihan) Misteri│
            │      │  ▲           │  ▲           │   (selepas M1)│
            │      │  └─S6 Surat Petunjuk (bila-bila, guna Kerang)│
            │      ▼              ▼               ▼              │
            └──────┴──────────────┴───────────────┤              │
                                                  ▼              │
                          [Bot siap awal] ─► S7 BANTU DAHULU ────┘
                                  (Cop Penolong) ─► Peti Bonus Rakit
                                                  │
           [Guru buka Fasa bersama dalam PG, minit 28]
                                                  ▼
                                   S9 PETI MAK TOK (seluruh kelas)
                                                  ▼
                                   S10 Galeri Hukum Muara (2 minit)
                                                  ▼
                                   S11 UPACARA JETI (minit 33–37)
                                                  ▼
                                   S12 TIKET KELUAR (kertas, minit 37–40)

   PG Panel Guru: Ctrl+Shift+G (atau tekan lama logo 3 saat) + PIN, boleh dibuka di mana-mana skrin
```

### 2.3 Dua mod penggunaan

| Aspek | **Mod Projektor (utama)** | **Mod Tablet (pilihan)** |
|---|---|---|
| Peranti | 1 komputer guru dan projektor | 1 tablet setiap bot. Komputer guru menjadi "papan induk". **Mod campuran dibenarkan**: bot tanpa tablet menggunakan kertas dan Peti Kod di projektor. |
| Rekod terperinci | Ditulis dalam **Log Krew kertas** | Dalam aplikasi (seret kad, rekod keputusan). Penjelasan bertulis **kekal di kertas**. |
| Interaksi bot dengan skrin | Juruhubung datang ke "Jeti Guru" untuk **memasukkan kod** (±15 saat) dan menebus petunjuk | Sepenuhnya di meja kumpulan |
| Carta Muara | Dikemas kini secara automatik | Tablet tidak disegerakkan (tiada pelayan). Guru menambah bintang pada papan induk melalui PG. |
| Infografik data bot | Ringkas (status kod dan Cop) | Penuh (Kejutan Lautan, menara pemerhatian bot sendiri) |
| Interaksi kucing | Belai dengan klik; **meow apabila tetikus dihalakan (hover)** | Belai dengan sentuhan (tiada hover pada skrin sentuh) |

**Pengurusan giliran dalam Mod Projektor:** aplikasi tidak menambah masa kepada jadual. Rekod terperinci kekal di atas kertas. Skrin hanya digunakan untuk (a) taklimat dan dialog kucing bersama seluruh kelas, (b) kemasukan kod pendek, dan (c) petunjuk. **Barisan Jeti** di penjuru skrin menunjukkan bot yang sedang menunggu giliran, paling banyak 2 bot.

### 2.4 Pemetaan masa (kekal 40 minit)

| Minit | Skrin | Nota |
|---|---|---|
| 0–3 | S0 → S1 → S2 | Aplikasi sudah dibuka dan bot sudah didaftarkan sebelum kelas. Telegram pembukaan dimainkan dengan animasi. |
| 3–13 | S3 | Mod Uji aktif ketika murid menguji objek dalam air. |
| 13–21 | S4 | |
| 21–28 | S5, S7, S8 | Bantu Dahulu dan Peti Bonus |
| 28–31 | S9 | Penguji mengemas jeti secara serentak. Kucing `bergomol` apabila peti dibuka. |
| 31–33 | S10 | Galeri Hukum Muara |
| 33–37 | S11 | Pusingan kemenangan `bermain-kejar` selepas gelaran terakhir |
| 37–40 | S12 | |

---

## 3. Wireframe ASCII (skrin utama)

Reka letak sasaran ialah 16:9 dengan resolusi minimum 1280×720. Simbol `[ ]` mewakili butang, dan `(Oyen)` / `(Kiko)` mewakili kucing SVG yang hidup. Kucing duduk di atas **jalur lantai papan jeti** (kayu, warna sederhana gelap) di bahagian bawah skrin, supaya bulu Kiko yang pucat tetap jelas.

### 3.1 S2 Peta Jeti dan Carta Muara (Mod Projektor)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ MISI JETI KUALA SENYUM        Fasa: MISI 1  ≈≈≈≈≈≈≈≈≈≈░░░░  06:42   [Bunyi]  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~ SUNGAI MUARA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
│  JETI ═╗                                                     ╔═ SEBERANG      │
│        ║  [Kenyalang]──*──*────────────>                      ║  (kampung)    │
│        ║  [Penyu]─────*─────────>                             ║               │
│        ║  [Pari]──────*──*──*─────────────────>   Pegawai     ║               │
│        ║  [Belangkas]─*──────────>                Pelabuhan   ║               │
│        ║  [Dugong]────*──*──────────────>                     ║               │
│        ║  [Kerapu]────────────>                               ║               │
│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
│   * = Bintang Laut     reben = gelaran                                        │
├───────────────────────────────┬──────────────────────────────────────────────┤
│   (Oyen)  .-------------------│  BARISAN JETI: Penyu > Dugong                 │
│   /\_/\  < Bot Pari dah dapat │                                              │
│  ( ^.^ )   cop pertama! Siapa │  [ Masuk Kod ]  [ Kerang Petunjuk ]           │
│   > ^ <    seterusnya?        │                                              │
│ ▓▓▓▓▓▓▓▓▓ lantai jeti ▓▓▓▓▓▓▓▓│  [ Peti Bonus (berantai) ]       (Kiko) /\_/\ │
└───────────────────────────────┴──────────────────────────────────────────────┘
```
**Infografik:** sungai menjadi carta kemajuan. Bot bergerak ke kanan apabila menerima bintang. Kod huruf **tidak pernah** dipaparkan di sini.

Lantai jeti di bahagian bawah juga menjadi "laluan main" untuk `bermain-kejar` dan `bergomol` (Bahagian 4.3.1(g)). Kucing tidak pernah melintasi baris bot atau butang.

### 3.2 S3b/S3d Misi 1: Ramal dan Rekod (Mod Tablet, satu bot)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BOT PENYU · MISI 1: RAKIT & SAUH       Langkah: [1 RAMAL] 2 UJI 3 REKOD 4 KOD │
├──────────────────────────────────────────────────────────────────────────────┤
│  Kad Objek (seret ke tikar):                                                  │
│  [pensel kayu] [gabus] [penutup botol] [straw] [batang aiskrim]               │
│  [guli] [syiling 10 sen] [klip kertas] [batu kecil]                           │
│                                                                              │
│  ┌──────────── TIKAR JETI ─────────────────────────────────────────────┐     │
│  │  ATAS AIR     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     │     │
│  │               [            seret kad ke sini             ]           │     │
│  │  ─────────────────────────────────────────────────────────────────── │     │
│  │  DASAR SUNGAI [            seret kad ke sini             ]           │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│  Siapa yang meramal?  kad pensel kayu: (Ahli 1)(Ahli 2)(Ahli 3)(Ahli 4)(Ahli 5)│
├──────────────────────────┬───────────────────────────────────────────────────┤
│   /\_/\   .--------------│   /\_/\   .--------------------------------.       │
│  ( o.o )< Aku tak sabar! │  ( -.- )< Setiap ahli ramal sekurang-        │       │
│   (Oyen)  Ramal dulu,    │   (Kiko)   kurangnya satu objek. Berbeza     │       │
│           baru uji!      │            pendapat? Bagus!                  │       │
│                          │                    [ KUNCI RAMALAN → UJI ]    │       │
└──────────────────────────┴───────────────────────────────────────────────────┘
```
**Langkah 3 Rekod:** setiap kad menunjukkan ikon bekas kecil, dan krew mengetik "terapung" atau "tenggelam" mengikut **pemerhatian mereka sendiri**. Selepas semua keputusan direkod, kad diselak (animasi putaran 3D) dan huruf kod didedahkan.

**Infografik Kejutan Lautan:** objek yang keputusannya berbeza daripada ramalan dipaparkan dengan ikon ombak, contohnya *"3 Kejutan Lautan = 3 penemuan baharu!"*. Aplikasi tidak menilai sama ada keputusan itu betul.

### 3.3 S4b/S4d Misi 2: Menara Pak Din

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BOT DUGONG · MISI 2: MENARA GERAI PAK DIN    [1 RAMAL] 2 TUANG 3 REKOD 4 KOD  │
├──────────────────────────────────────────────────────────────────────────────┤
│   Blok cecair (seret):                                                       │
│   [ AIR  ...biru... ]  [ MINYAK  ===kuning=== ]  [ SIRAP  ///merah/// ]       │
│                                                                              │
│        RAMALAN KAMI                         PEMERHATIAN KAMI (langkah 3)     │
│        ┌─────────┐   ATAS                   ┌─────────┐                      │
│        │  [   ]  │                          │  [   ]  │   /\_/\  <- Kiko     │
│        │  [   ]  │   TENGAH                 │  [   ]  │  ( -.- )   duduk di  │
│        │  [   ]  │   BAWAH                  │  [   ]  │            sebelah   │
│        └─────────┘                          └─────────┘            menara    │
│                                     (selepas direkod: animasi titisan "duduk"│
│                                      mengikut PEMERHATIAN bot sendiri)      │
├──────────────────────────────┬───────────────────────────────────────────────┤
│   /\_/\  .------------------.│  .---------------------------------.          │
│  ( o.O )< Pekat? Berat? Yang││  Lukis juga menara kamu dalam log, │          │
│   (Oyen)  dituang dulu? Aku ││  ya. Mata kamu saintis terbaik.    │(Kiko)    │
│           keliru!           │'---------------------------------'            │
│                             │  [ Kerang Petunjuk (2) ]   [ SETERUSNYA ]      │
└──────────────────────────────┴───────────────────────────────────────────────┘
```
Setiap cecair dipaparkan dengan **warna, corak dan label teks** sekali gus (mesra buta warna dan sesuai untuk projektor yang pudar).

### 3.4 S6 Surat Petunjuk (tindanan)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│      /\_/\        ┌──────────────────────────────────────────────────┐       │
│     ( ^.^ )  ===> │ [potret]  SURAT DARIPADA MAK TOK JETI            │       │
│      (Kiko)       │           Petunjuk 1 daripada 3                  │       │
│   (membawa sampul │                                                  │       │
│    di mulut)      │  "Cu, cuba tengok semula objek yang duduk di     │       │
│                   │   atas air dan objek yang turun ke dasar. Apa    │       │
│                   │   yang sama pada setiap kumpulan objek itu?"     │       │
│                   │                                                  │       │
│                   │  Kerang Petunjuk tinggal:  (o) (o) ( )           │       │
│                   │                                                  │       │
│                   │  [ Simpan surat ]   [ Hadiahkan kerang ke bot lain]│     │
│                   └──────────────────────────────────────────────────┘       │
│   Petunjuk seterusnya (P2) hanya boleh dibuka dengan satu kerang lagi.        │
└──────────────────────────────────────────────────────────────────────────────┘
```
Surat yang sudah dibuka boleh dibaca semula tanpa kos (dalam "Beg Surat" bot). Soalan misi **tidak** berubah selepas petunjuk diberi.

### 3.5 S9 Peti Mak Tok (bersama, Mod Projektor)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                 PETI MAK TOK: HUKUM MUARA (perlukan SEMUA 6 bot)             │
├──────────────────────────────────────────────────────────────────────────────┤
│   Serpihan (seret):  [Kenyalang] [Penyu] [Pari] [Belangkas] [Dugong] [Kerapu]│
│                                                                              │
│   ┌────────────────────── PAPAN HUKUM MUARA ───────────────────────────┐     │
│   │ 1 [________________] objek yang ____ tumpat daripada air terapung. │     │
│   │ 2 [________________] objek yang ____ tumpat daripada air tenggelam.│     │
│   │ 3 [________________] cecair paling tumpat berada di ____ .         │     │
│   │ 4 [________________] saiz sahaja ____ menentukan objek terapung.   │     │
│   │ 5 [ ... ]   6 [ ... ]                                              │     │
│   └────────────────────────────────────────────────────────────────────┘     │
│        ____ = kelas sebut dengan lantang; guru tekan [Isi] dalam PG          │
│                                                                              │
│          ___________                                                         │
│         |  PETI     |   kunci: ○ ○ ○ ○ ○ ○   (●  apabila serpihan tepat)     │
│         |__MAK TOK__|                                                        │
│   /\_/\                                                         /\_/\        │
│  ( >.< )< Berat betul peti ni! Semua bot, tolong!   Satu lagi! >( ^.^ )      │
│   (Oyen)                                                        (Kiko)       │
└──────────────────────────────────────────────────────────────────────────────┘
```
**Nota:** perkataan dalam ruang kosong **tidak** ditawarkan sebagai pilihan di skrin. Kelas menyebutnya, dan guru mengisinya melalui PG. Ini mengelakkan bank perkataan yang menjadi "jawapan percuma".

Apabila peti terbuka, Kiko bercakap dahulu. Selepas dialog tamat, kedua-dua kucing **`bergomol`** di lantai jeti sebagai perayaan.

### 3.6 PG Panel Guru (tersembunyi)

```
┌─────────────────── PANEL GURU (tutup auto selepas 60s tiada aktiviti) ───────┐
│ [Metrik] [Kelulusan] [Masa] [Kunci] [Gelaran] [Kunci Jawapan] [Data] [Reset] │
├──────────────────────────────────────────────────────────────────────────────┤
│ METRIK 0–3      OP1  OP2  OP3   Kerang  Cubaan  Miskonsepsi      Catatan     │
│ Kenyalang       [2]  [1]  [-]    1      2       [x] saiz                     │
│ Penyu           [3]  [2]  [-]    0      1       [ ] pekat=berat              │
│ ...                                                                          │
│ Dicadang auto*: OP1 Penyu 2→3?  (*cadangan sahaja, guru yang memutuskan)     │
│                                                                              │
│ [Mod Tirai: skrin kosong]   [Cetak Laporan]   [Eksport JSON/CSV]             │
│ Kucing: [x] Meow hover  [x] Main berpasangan  [ ] Kurangkan animasi          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spesifikasi kucing peneman

### 4.0 Rupa kedua-dua kucing

| | **Si Oyen** | **Si Kiko** |
|---|---|---|
| Baka/rupa | Kucing kampung oren berjalur, badan bulat dan padat, pipi tembam, telinga tegak runcing, ekor sederhana kembang | **Kucing Ragdoll, corak blue point**: badan dan bulu panjang gebu **putih/krim pucat**; **muka (topeng), telinga dan ekor kelabu kebiruan**; **mata biru** besar; kaki depan putih; surai leher gebu; ekor panjang seperti bulu pelepah |
| Palet (cadangan) | Oren `#F08A24`, jalur `#C2621A`, perut krim `#FFE7C2`, **garis luar `#5A2E0E`** | Badan `#F3F0E8`, titik kelabu `#7F8C9D`, mata `#3E86D6`, **garis luar `#2F3B4A`** |
| Garis luar | 3 px, gelap | **3.5 px, gelap**, supaya badan pucat tidak "hilang" di projektor yang pudar atau latar terang |
| Aksesori | Selendang merah kecil ala pekerja gerai | Reben biru tua dengan loceng kecil (hadiah Mak Tok) |
| Gaya gerak | Laju, melantun, kadang-kadang tergelincir sedikit | Perlahan, anggun, lembut |
| Siluet | **Bulat padat**, lebih kecil, telinga tajam, ekor pendek | **Besar dan gebu**, tepi bulu bergerigi lembut, surai leher, ekor panjang berbulu lebat |

**Kontras projektor:**
- Kedua-dua kucing duduk di atas **jalur lantai papan jeti** (kayu, sederhana gelap), bukan terus di atas latar putih.
- Setiap kucing ada bayang lembut di lantai.
- Kedua-dua kucing mesti boleh dibezakan **melalui siluet sahaja** (diuji dalam skala kelabu), bukan warna sahaja.

### 4.1 Hubungan dengan watak manusia
- **Si Kiko** ialah **kucing Ragdoll kesayangan Mak Tok Jeti**. Kiko menjadi **posmen dunia permainan**: dia membawa surat Mak Tok (Misi 1), nota Pak Din (Misi 2) dan telegram Kapten Hamzah (Misi 3). Setiap petunjuk dipaparkan sebagai surat dengan potret watak manusia di kepala surat. Dengan cara ini, **suara petunjuk kekal milik watak manusia**, manakala Kiko menyampaikannya.
- **Si Oyen** ialah **kucing gerai Pak Din**. Dia ceria, suka mencuba, dan kadang-kadang tersilap. Oyen memodelkan cara **menyemak semula idea**, bukan menjadi bahan ketawa.
- Oyen dan Kiko **sahabat baik**. Mereka berkejaran dan bergomol apabila jeti tenang atau semasa perayaan (Bahagian 4.3.1(g)).
- Watak manusia tidak dianimasikan sepenuhnya. Mereka hanya dipaparkan sebagai potret SVG ringkas dalam surat dan skrol upacara.
- **Diputuskan (lalai):** Oyen **tidak** berjenaka "hampir terjatuh ke dalam air", supaya tidak menggalakkan murid bermain dengan air.

### 4.2 Personaliti dan peraturan dialog

| | Si Oyen | Si Kiko |
|---|---|---|
| Personaliti | Ceria, tergesa-gesa, suka mencuba, cepat teruja, mudah terkejut, kadang-kadang tersilap ramal | Tenang, bijak, penyabar, lembut, memuji proses |
| Fungsi pedagogi | Menyuarakan **beberapa idea yang bersaing** (termasuk miskonsepsi) sebagai soalan; memodelkan perubahan fikiran **selepas** ujian; menjadi suara maklum balas yang menyeronokkan | Menghantar petunjuk; mengingatkan langkah saintifik (ramal → uji → rekod → jelaskan); memuji usaha dan kerjasama |
| **Peraturan wajib** | (1) Tidak pernah meramal nasib objek atau cecair **misi** secara khusus sebelum ujian. (2) Idea pra-ujian sentiasa berbentuk senarai beberapa kemungkinan, jadi murid tidak boleh "pilih lawan Oyen". (3) Reaksi pasca-ujian berdasarkan **data bot sendiri** (ramalan lawan rekod), bukan kunci jawapan. | (1) Tidak pernah menyatakan jawapan, kata akarnya atau huruf awalnya. (2) Hanya menyampaikan petunjuk apabila Kerang Petunjuk ditebus. (3) Tidak menulis semula soalan misi. |

> **Rasional peraturan Oyen:** jika Oyen selalu tersilap tentang objek tertentu, murid akan memilih "lawan Oyen", dan itu sama dengan memberi jawapan. Oleh sebab itu, Oyen hanya bercakap tentang **cara berfikir**, bukan tentang keputusan.
>
> **Interaksi bukan dialog** (belai, meow hover, berkejaran, bergomol) **tidak pernah** membawa kandungan misi atau petunjuk.

### 4.3 Animasi hidup: peneman, bukan avatar statik

Kucing **sentiasa hidup** di skrin. Mereka:
- bernafas dan berkelip;
- berjalan atau melompat masuk dan keluar skrin;
- bergerak ke elemen yang sedang dibincangkan;
- bereaksi dengan emosi dan menggerakkan mulut semasa bercakap;
- bertindak balas apabila disentuh atau dihalakan tetikus;
- bermain sesama sendiri apabila keadaan sesuai.

Semua animasi dibina dengan **SVG berlapis serta CSS/JS**, tanpa sebarang fail imej, GIF, video, fail audio atau pustaka luar.

#### 4.3.1 Teknik pelaksanaan

**(a) SVG berlapis (rig ringkas)**
Setiap kucing ialah satu SVG sebaris (inline) yang terdiri daripada kumpulan `<g>` bernama. Setiap kumpulan mempunyai `transform-origin` sendiri pada sendinya:

```
<svg class="kucing kucing--oyen" viewBox="0 0 200 200">
  <g class="k-bayang"/>                       // bayang di lantai (skala ikut lompatan)
  <g class="k-badan">                          // naik-turun bernafas
    <g class="k-ekor"/>                        // berayun dari pangkal
    <g class="k-kaki-belakang"/>
    <g class="k-kaki-depan k-kiri"/>  <g class="k-kaki-depan k-kanan"/>   // kaki kanan boleh naik ke dagu
    <g class="k-kepala">                       // senget, angguk, pandang kursor
      <g class="k-telinga k-kiri"/> <g class="k-telinga k-kanan"/>       // kedut, lipat ke belakang
      <g class="k-mata"> <g class="k-kelopak"/> <g class="k-anak-mata"/> </g>  // kelip, ikut sasaran
      <g class="k-mulut"> <path class="m-tutup"/> <path class="m-buka"/> <path class="m-senyum"/> </g>
      <g class="k-pipi-merah"/>
    </g>
    <g class="k-aksesori"/>                    // selendang / reben+loceng / topi nakhoda / sampul
  </g>
  <g class="k-efek"/>                          // "?", "!", kilauan, hati kecil, "zzz", nota muzik meow
  <path class="k-zon-hover"/>                  // laluan siluet badan (lutsinar) untuk hover/klik
</svg>
```
- **Kiko:** tepi bulu dilukis sebagai laluan bergerigi lembut, ditambah lapisan `k-surai` (surai leher). Lapisan `k-bulu-gebu` bergoyang sedikit (≤2°) mengikut pergerakan, dan ekor pelepahnya berayun lebih perlahan daripada ekor Oyen. Titik kelabu (topeng, telinga, ekor) ialah laluan berasingan supaya warnanya boleh dilaras melalui pemboleh ubah CSS.
- Bilangan laluan dihadkan kepada **≤ 40 elemen** dan saiz **≤ 15 KB** setiap kucing. SVG dijana oleh `kucing-rig.js` daripada satu templat. Satu rig digunakan untuk dua rupa; warna, ketebalan garis luar dan bentuk bulu ditukar melalui pemboleh ubah CSS dan laluan tambahan.

**(b) Tiga lapisan keadaan selari (state machine)**
Setiap kucing mempunyai tiga mesin keadaan kecil yang berjalan serentak. Hasilnya, kucing boleh **berjalan sambil bercakap** atau **terfikir sambil bernafas**:

```
LAPISAN 1: LOKASI   luar-skrin ─masuk─► di-labuh ─gerak-ke(sasaran)─► di-labuh ─keluar─► luar-skrin
                                        └──────── dikawal-pasangan (4.3.1 g) ─────────┘
LAPISAN 2: EMOSI    rehat ⇄ { gembira | terfikir | terkejut | sedih-semangat | meraikan |
                              menonton | membawa-surat | dibelai | hover-meow | mengantuk |
                              bermain-kejar* | bergomol* | lerai* }      (* keadaan berpasangan)
LAPISAN 3: MULUT    diam ⇄ bercakap  (juga "meow" 0.3–0.5 s, tanpa gelembung)
```
- **Peristiwa permainan** (cth. `kodDiterima`, `kodBelumTerbentuk`, `petunjukDitebus`, `modUjiMula`, `kucingDisentuh`, `kucingDihover`, `petiDibuka`) dihantar ke `kucingMesin.hantar(peristiwa)`. Mesin itu memetakan peristiwa kepada keadaan berdasarkan jadual 4.3.3.
- **Tangga keutamaan** (paling tinggi di atas):
  1. Peristiwa permainan (reaksi misi, dialog, Mod Uji, surat petunjuk)
  2. Interaksi sentuh/klik (`dibelai`)
  3. Hover (`hover-meow`)
  4. Permainan berpasangan (`bermain-kejar`, `bergomol`)
  5. Aksi mikro rehat dan `mengantuk`
- Peristiwa yang lebih tinggi **sentiasa memintas** keadaan yang lebih rendah. Peristiwa yang tiba semasa reaksi yang sama atau lebih tinggi berlangsung akan **dibariskan** (paling banyak 2). Peristiwa lama dibuang supaya kucing tidak "tertinggal" daripada permainan.
- Setiap keadaan emosi sementara mempunyai durasi tetap. Selepas tamat, kucing **sentiasa kembali ke `rehat`**.
- Keadaan dipaparkan dengan menukar kelas CSS pada SVG (cth. `.kucing--gembira`). Keyframes CSS menjalankan animasi itu sendiri, jadi JavaScript tidak perlu mengira setiap bingkai.

**(c) Pergerakan ke elemen yang dibincangkan ("titik labuh")**
- Elemen penting ditanda dengan atribut `data-labuh` (cth. `data-labuh="bekas-air"`, `"menara"`, `"peti-kod"`, `"peti-mak-tok"`, `"bot-penyu"`).
- `gerak-ke(sasaran)` membaca `getBoundingClientRect()` sasaran, kemudian kucing bergerak dengan `transform: translate()` dan CSS transition.
  - **Berjalan:** kaki berayun bergilir-gilir dan badan sedikit melantun. Kelajuan Oyen lebih kurang 400 px/s, manakala Kiko lebih kurang 250 px/s.
  - **Melompat:** dua pembalut bersarang. Pembalut luar bergerak secara mendatar dan linear, manakala pembalut dalam bergerak secara menegak dengan lengkung `cubic-bezier` (naik kemudian turun) untuk menghasilkan lengkung lompatan. Bayang di lantai mengecil semasa di udara.
  - Kucing berpaling (`scaleX(-1)`) ke arah pergerakan, dan matanya memandang sasaran.
- Contoh: Oyen melompat ke tepi ilustrasi bekas air (M1), dan Kiko berjalan lalu duduk di sebelah menara cecair (M2).
- Kucing tidak boleh menutupi butang atau teks penting. Setiap titik labuh menetapkan kedudukan duduk di **tepi** elemen (kiri/kanan/atas). Jika ruang tidak cukup, kucing kembali ke "sudut rumah" masing-masing (Oyen di kiri bawah, Kiko di kanan bawah).

**(d) Mulut bergerak semasa bercakap**
- Gelembung dialog dipaparkan secara "taip" (lebih kurang 30 aksara sesaat).
- Selama teks sedang ditaip, lapisan Mulut berada dalam keadaan `bercakap`. Laluan `m-buka` dan `m-tutup` ditukar setiap lebih kurang 120 ms (`animation: steps(2)`). Mulut berhenti seketika pada tanda baca (`,` `.` `!` `?`) supaya kelihatan semula jadi.
- Teks penuh dipaparkan serta-merta jika guru atau murid mengetik gelembung. Mulut kemudian kembali ke `diam` atau `m-senyum`.
- Hanya **seekor kucing bercakap pada satu masa**. Kucing yang mendengar akan memandang kucing yang bercakap dan sesekali mengangguk.

**(e) Hidup semasa rehat (idle)**
- **Pernafasan:** `k-badan` naik-turun dengan `scaleY` 1.00 → 1.02, kitaran 3 s (Oyen) dan 4 s (Kiko) yang berterusan.
- **Kelip mata:** JavaScript menjadualkan kelipan secara rawak setiap 2–6 s (150 ms setiap kelipan), dengan 20% peluang kelip berganda.
- **Ekor:** berayun berterusan. Oyen pantas (2 s), Kiko perlahan dan lembut (3.5 s).
- **Aksi mikro rawak** setiap 8–15 s, satu pada satu masa:
  - Telinga berkedut
  - Oyen meregangkan badan atau menguap
  - Kiko menjilat kaki atau menyisir bulu
  - Memandang ke arah kursor atau sentuhan terakhir
- **Mengantuk:** jika tiada aktiviti selama 90 s di skrin hab, kucing duduk dengan mata separuh tertutup dan "zzz" kecil muncul. Mereka bangun serta-merta apabila ada peristiwa.

**(f) Ringan untuk laptop sekolah**
- Hanya `transform` dan `opacity` yang dianimasikan, supaya tiada reflow dan pemaparan dipercepatkan oleh GPU. `filter` dan `box-shadow` tidak dianimasikan.
- Hanya **satu** gelung `requestAnimationFrame` dikongsi oleh kedua-dua kucing, dan ia hidup semasa ada kucing sedang bergerak sahaja. Selebihnya, animasi bergantung pada keyframes CSS.
- Semua animasi dijeda apabila tab tersembunyi (`visibilitychange`), Panel Guru dibuka, atau Mod Tirai aktif.
- **Mod Ringan** (suis dalam PG, atau dihidupkan automatik jika kadar bingkai < 30 fps selama 5 s):
  - Hanya pernafasan, kelipan dan reaksi emosi dikekalkan.
  - Kucing berpindah tempat dengan pudar keluar dan masuk, bukan berjalan.
  - Permainan berpasangan diganti dengan versi pendek, iaitu `bersentuh-hidung` selama 1.5 s.
- **`prefers-reduced-motion`** atau suis "Kurangkan animasi": tiada lompatan, perjalanan atau permainan berpasangan. Kucing berpindah dengan pudar, emosi dipaparkan melalui ekspresi muka dan ikon efek sahaja, dan pernafasan dihentikan.
- Sasaran prestasi: 60 fps pada laptop kelas Celeron/Pentium dengan RAM 4 GB, dan **≤ 5% CPU** semasa idle.

**(g) Koordinasi dua kucing: koreografi berpasangan**
Permainan berpasangan memerlukan kedua-dua mesin keadaan bergerak secara serentak. Ini diuruskan oleh satu modul kecil, **`kucingPasangan`** (koreografer):

1. **Kunci bersama (mutex):** koreografer hanya boleh bermula jika **kedua-dua** kucing berada dalam `rehat`, tiada gelembung dialog atau surat terbuka, dan **semua syarat dibenarkan** di bawah dipenuhi. Koreografer kemudian memegang "kunci pasangan" dan menukar Lapisan Lokasi kedua-dua kucing kepada `dikawal-pasangan`.
2. **Garis masa rentak (beat timeline):** setiap koreografi ialah senarai rentak bermasa. Contoh `bermain-kejar`:

```
t=0.0  Oyen: tepuk ekor Kiko (kaki depan)    Kiko: telinga kedut, pandang Oyen
t=0.4  Oyen: lari ke kanan (pengejar)        Kiko: lari ke kanan (dikejar), ekor tegak
t=1.8  kedua-dua berpusing di hujung lantai; Kiko menjadi pengejar
t=3.2  Kiko: lompat lembut melepasi Oyen     Oyen: tunduk, terguling kecil
t=4.2  kedua-dua berlari pulang ke sudut rumah masing-masing
t=5.0  kedua-dua duduk, tercungap comel (0.5 s) → rehat
```
3. **Satu jam, dua pelakon:** gelung `requestAnimationFrame` yang sama menggerakkan kedua-dua kucing. Susunan lapisan (`z-index`) ditukar apabila mereka bersilang supaya kelihatan seperti satu melintas di hadapan yang lain.
4. **Gomol sebagai sprite gabungan:** untuk `bergomol`, kedua-dua SVG disembunyikan seketika dan diganti dengan satu SVG gabungan kecil, **"bola bulu"**, yang mengandungi bahagian rig kedua-dua kucing (kepala, ekor dan kaki oren serta krim-kelabu). Bola bulu berguling perlahan dengan kaki menepuk lembut. Cara ini lebih ringan daripada mengira pertindihan dua rig.
5. **Batal serta-merta (lerai):** sebarang peristiwa permainan, sentuhan pada aplikasi, peralihan skrin, PG dibuka atau Mod Tirai akan menyebabkan koreografer melepaskan kunci. Kedua-dua kucing masuk ke **`lerai`**: mereka "terpisah" dengan lucu, menggeleng kepala, dan melompat ke sudut rumah dalam 0.3–0.5 s. Peristiwa yang membatalkan permainan kemudian diproses seperti biasa.
6. **Syarat dibenarkan.** Permainan berpasangan hanya boleh berlaku jika **semua** syarat berikut dipenuhi:
   - skrin S2 Peta Jeti (hab), atau perayaan tertentu (Peti Mak Tok dibuka, tamat Upacara);
   - **bukan** Mod Uji;
   - **bukan** skrin misi aktif (S3–S5), S6 Surat, S7 Peti Kod, S8, S10 atau S12;
   - tiada dialog atau surat sedang dipaparkan;
   - Barisan Jeti kosong, dan tiada interaksi dalam 10 s terakhir;
   - suis "Main berpasangan" dalam PG hidup, dan "Kurangkan animasi" mati.
7. **Kekerapan:** di hab, sekali sahaja selepas **45 s** tiada aktiviti (sebelum `mengantuk` pada 90 s), dengan peluang 50%. Selepas itu ada tempoh bertenang **3 minit**, dan maksimum **3 kali** setiap sesi. Perayaan tidak dikira dalam had ini.

**Panduan kelembutan `bergomol`:**
- Bergusti lembut, berguling bersama, kaki menepuk perlahan, ekor berbelit, hati dan kilauan kecil.
- **Dilarang:** gigitan, kuku, desisan, bulu tegak marah, awan "pergaduhan" atau bunyi pukulan.
- Mesti berakhir dengan kedua-dua kucing berbaring bersebelahan, dan Kiko menjilat kepala Oyen.

#### 4.3.2 Interaksi: belai (klik/sentuh) dan hover tetikus

**Belai dibenarkan dalam Mod Projektor dan Mod Tablet.**

| Kucing | Klik/sentuh pertama | Klik/sentuh berulang (dalam 10 s) | Had |
|---|---|---|---|
| **Oyen** | Mata pejam, "purr" (getaran badan 2 Hz dan bunyi dengkur lembut), hati kecil timbul | **Berguling** menunjukkan perut, kemudian bangun dengan kepala sedikit pening | Selepas 3 sentuhan dalam 30 s: *"Hehe, cukup dulu! Jom fokus pada misi."* Interaksi bertenang selama 20 s. |
| **Kiko** | Mata separuh pejam dan "purr" yang dalam | **"Melembik"** (sifat sebenar baka Ragdoll): badan lembik terbaring dengan ekor mengibas perlahan | Sama seperti Oyen |

**Hover tetikus (Mod Projektor dan komputer sahaja; skrin sentuh tiada hover):**
- **Pencetus:** `pointerenter` pada **laluan siluet badan kucing** (`k-zon-hover`, `pointer-events: visiblePainted`), bukan kotak segi empat. Ini supaya tetikus berhampiran butang tidak mencetuskan meow.
- **Reaksi visual:** telinga berkedut ke arah kursor, dan kepala serta mata memandang kursor (putaran kepala ≤ 10°) selama tetikus berada di atas badan. Sebuah nota kecil "~" timbul.
- **Bunyi:** satu **"meow" sintesis** (Bahagian 5.3), dengan mulut terbuka seketika (0.3–0.5 s) tanpa gelembung dialog.
- **Had kekerapan dan mitigasi:**

| Peraturan | Nilai |
|---|---|
| Had setiap kucing | **Sekali setiap 4 s** |
| Had global (kedua-dua kucing) | Meow seterusnya tidak boleh berlaku dalam 1.5 s selepas meow kucing lain |
| Syarat "keluar dahulu" | Tetikus mesti meninggalkan badan kucing selama ≥ 0.5 s sebelum hover baharu dikira (gerakan kecil di atas badan tidak mencetuskan meow berulang) |
| Had sesi | Selepas 6 meow dalam 60 s, kucing hanya memandang dan berkelip (tanpa bunyi) selama 30 s |
| **Tiada meow** semasa | Mod Uji; kucing sedang bercakap (dialog atau surat); Mod Tirai; PG dibuka; butang **Senyap** aktif; permainan berpasangan sedang berjalan; suis "Meow hover" dalam PG dimatikan |
| Semasa Mod Uji | Tiada reaksi hover langsung, selain kelipan biasa |
| Papan kekunci | Fokus pada kucing (Tab) dikira sebagai hover dengan had yang sama, dan Enter dikira sebagai belai |

**Peraturan umum:**
- Semasa **Mod Uji**, klik atau sentuh hanya menghasilkan kelipan dan purr kecil tanpa berguling, supaya perhatian murid kekal pada air.
- Klik, sentuh dan hover **tidak pernah** mencetuskan dialog berkaitan misi atau petunjuk. Ini mengelakkan "petunjuk percuma".
- Kucing mempunyai label kebolehcapaian, cth. `aria-label="Belai Si Oyen"` dan `aria-label="Belai Si Kiko"`.

#### 4.3.3 Jadual keadaan animasi → pencetus → durasi

| Keadaan | Kucing | Rupa animasi | Pencetus | Durasi | Keutamaan | Selepas itu |
|---|---|---|---|---|---|---|
| `rehat` | Kedua-dua | Bernafas, kelip rawak, ekor berayun, aksi mikro setiap 8–15 s | Lalai, atau tamat keadaan lain | Berterusan | 5 | – |
| `masuk` | Oyen | Berlari dari tepi skrin, lompat ke sudut rumah, mendarat dengan sedikit melantun | Skrin baharu dibuka | 0.8 s | 1 | `rehat` dan dialog pembuka |
| `masuk` | Kiko | Berjalan anggun dari tepi bertentangan, duduk perlahan | Skrin baharu dibuka (0.4 s selepas Oyen) | 1.2 s | 1 | `rehat` |
| `keluar` | Kedua-dua | Berpaling dan berjalan atau melompat keluar skrin | Peralihan skrin, Mod Tirai | 0.6 s | 1 | `luar-skrin` |
| `gerak-ke` | Oyen | **Melompat** ke titik labuh (cth. tepi bekas air, Peti Kod) | Langkah misi baharu yang memfokuskan elemen tertentu | 0.5–1.0 s (ikut jarak) | 1 | `rehat` di titik labuh |
| `gerak-ke` | Kiko | **Berjalan** ke titik labuh (cth. duduk di sebelah menara cecair, tepi Peti Mak Tok) | Sama | 0.8–1.6 s | 1 | `rehat` di titik labuh |
| `bercakap` (lapisan mulut) | Kedua-dua | Mulut buka-tutup, kepala angguk kecil, kucing pendengar memandang | Gelembung dialog dipaparkan | Panjang teks ÷ 30 aksara/s, ditambah 0.3 s | 1 | `diam` |
| `gembira` | Oyen | Melompat 2 kali, telinga tegak, kilauan, ekor tegak bergetar | Kod diterima, Cop Pelabuhan, Bintang Laut, serpihan diletak | 1.5 s | 1 | `rehat` |
| `gembira` | Kiko | Mata senyum, angguk perlahan, loceng reben bergoyang, hati kecil | Sama | 1.5 s | 1 | `rehat` |
| `terfikir` | Oyen | Kepala senget, mata ke atas, "?" berpusing, ekor melingkar | Skrin Ramal dan Jelaskan dibuka; murid tiada tindakan selama 30 s | Berulang selagi skrin itu aktif (kitaran 3 s), diselang `rehat` | 1 | `rehat` |
| `terfikir` | Kiko | **Kaki kanan di dagu**, mata separuh pejam, "..." dalam gelembung | Sama | Sama | 1 | `rehat` |
| `terkejut` | Oyen | Bulu kembang, lompat kecil di tempat, "!" muncul, telinga tegak | **Kejutan Lautan** (ramalan bot berbeza daripada rekodnya); peti terbuka | 1.0 s | 1 | `rehat` dan dialog teruja (bukan sedih) |
| `terkejut` | Kiko | Telinga ke belakang, mata biru membulat, kemudian tersenyum | Sama | 1.0 s | 1 | `rehat` |
| `sedih-semangat` | Oyen | Telinga layu dan bahu turun (0.6 s), **kemudian** tegak semula, kaki depan dikepal ke atas, dan "Jom cuba lagi!" | **Kod belum terbentuk**; guru menekan "Belum lagi" | 1.8 s (0.6 s sedih + 1.2 s semangat) | 1 | `rehat` |
| `sedih-semangat` | Kiko | Kepala tunduk perlahan, kemudian mendongak dan mengangguk memberi semangat, ekor mengibas sekali | Sama | 1.8 s | 1 | `rehat` |
| `membawa-surat` | Kiko | Masuk dengan **sampul di mulut** (mulut tidak boleh bercakap), letak sampul, sampul terbuka menjadi Surat Petunjuk | Kerang Petunjuk ditebus | 1.5 s | 1 | `rehat` di sebelah surat, dan baru boleh bercakap |
| `menonton` | Oyen | Melompat ke tepi ilustrasi bekas air, duduk, mata mengikut "riak" air, ekor bergoyang perlahan | **Mod Uji** bermula (Bendera Uji diangkat) | Sepanjang Mod Uji | 1 | `rehat` apabila Mod Uji tamat |
| `menonton` | Kiko | Duduk tegak di sebelah menara cecair (M2) atau bekas (M1), sesekali mengangguk | Sama | Sepanjang Mod Uji | 1 | `rehat` |
| `meraikan` | Oyen | Topi nakhoda, menari kiri-kanan, lompat berputar, konfeti kertas | **Upacara Jeti**: setiap gelaran diumumkan; sorakan ombak | 2.5 s setiap gelaran | 1 | `rehat` bertopi |
| `meraikan` | Kiko | Topi nakhoda, membongkok hormat, ekor pelepah melambai seperti bendera | Sama | 2.5 s setiap gelaran | 1 | `rehat` bertopi |
| `dibelai` | Oyen | Purr, kemudian **berguling** jika disentuh berulang | Murid/guru klik atau sentuh kucing | 1.2 s (purr) / 1.8 s (berguling) | 2 | `rehat` |
| `dibelai` | Kiko | Purr dalam, kemudian **melembik** jika disentuh berulang | Sama | 1.2 s / 2.0 s | 2 | `rehat` |
| `hover-meow` | Oyen | Telinga kedut, kepala dan mata pandang kursor, mulut buka seketika, **meow tinggi dan riang**, nota "~" | Tetikus masuk ke siluet badan (had: 1 kali / 4 s) | 0.6 s (bunyi 0.35 s); pandangan kekal selama tetikus di atas badan | 3 | `rehat` |
| `hover-meow` | Kiko | Telinga kedut perlahan, kepala condong ke kursor, mata biru berkelip lambat, **meow lembut dan dalam** | Sama | 0.8 s (bunyi 0.55 s) | 3 | `rehat` |
| `bermain-kejar` | Kedua-dua (koreografi) | Oyen menepuk ekor Kiko, berkejaran di lantai jeti, bertukar pengejar, pulang ke sudut rumah dan tercungap comel | (a) Hab S2 tiada aktiviti ≥ 45 s (peluang 50%, bertenang 3 min, maks 3 kali/sesi); (b) **pusingan kemenangan** selepas gelaran terakhir Upacara | 5.0 s | 4 (perayaan: 1) | `rehat` di sudut rumah |
| `bergomol` | Kedua-dua (sprite "bola bulu") | Bergusti lembut, berguling bersama, kaki menepuk perlahan, hati kecil, berakhir berbaring bersebelahan dan Kiko menjilat kepala Oyen | (a) Alternatif rawak kepada `bermain-kejar` di hab dengan syarat yang sama; (b) **Peti Mak Tok dibuka** (selepas dialog Kiko tamat) | 3.5 s | 4 (perayaan: 1) | `rehat` bersebelahan, kemudian berjalan ke sudut rumah |
| `lerai` | Kedua-dua | Terpisah dengan lucu, menggeleng kepala, melompat atau berjalan ke sudut rumah | Sebarang peristiwa permainan, interaksi, peralihan skrin, PG atau Tirai semasa permainan berpasangan | 0.3–0.5 s | 1 | Proses peristiwa yang membatalkan |
| `bersentuh-hidung` | Kedua-dua | Duduk bersebelahan, hidung bersentuh, hati kecil (tiada pergerakan besar) | Pengganti `bermain-kejar`/`bergomol` dalam Mod Ringan (perayaan sahaja) | 1.5 s | 4 | `rehat` |
| `mengantuk` | Kedua-dua | Mata separuh, kepala jatuh perlahan, "zzz" | 90 s tiada aktiviti di skrin hab | Sehingga ada peristiwa | 5 | `rehat` (terjaga dengan telinga tegak) |

*Keutamaan: 1 = paling tinggi (peristiwa permainan), 5 = paling rendah (idle). Keadaan dengan nombor lebih kecil sentiasa memintas yang lebih besar.*

> **Nota pedagogi:** `terkejut` digunakan untuk **Kejutan Lautan** dan sentiasa diikuti nada teruja, kerana ramalan yang berbeza ialah penemuan, bukan kesalahan. `sedih-semangat` hanya digunakan apabila **kod belum terbentuk** atau guru menekan **"Belum lagi"**. Fasa "sedih" sangat singkat (0.6 s) dan **sentiasa** berakhir dengan semangat. Tiada keadaan menangis, marah atau kecewa yang berpanjangan. Permainan berpasangan ialah **ganjaran suasana**, bukan ganjaran prestasi. Ia tidak dikaitkan dengan mana-mana bot dan tidak pernah berlaku semasa murid bekerja.

### 4.4 Contoh dialog (semua telah disemak supaya tidak membocorkan jawapan)

**Skrin Mula dan Daftar Krew**
- Oyen: *"Meow! Jeti rosak, kampung perlukan bekalan. Kita perlukan krew paling hebat!"*
- Kiko: *"Aku Kiko, kucing Mak Tok. Pilih nama bot dan peranan masing-masing. Setiap peranan penting."*

**Misi 1: Rakit dan Sauh**
- Taklimat, Oyen: *"Rakit perlu benda yang duduk atas air. Sauh perlu benda yang turun ke dasar. Mana satu? Aku pun nak tahu!"*
- Ramal, Kiko: *"Setiap ahli ramal sekurang-kurangnya satu objek. Tak sama pendapat? Itu tanda krew yang berfikir."*
- Mod Uji, Oyen: *"Shhh... aku tengok dari sini. Penguji, perlahan-lahan ya!"*
- Selepas rekod, ada kejutan (berdasarkan data bot), Oyen `terkejut`: *"Eh! Ramalan dan keputusan tak sama? Kejutan Lautan! Sebab itulah kita uji."* Kiko: *"Apa yang membuat kamu meramal begitu tadi? Fikirkan."*
- Selepas rekod, tiada kejutan, Oyen `gembira`: *"Semua ramalan sepadan! Tapi... kenapa ya? Itu misteri seterusnya."*
- Pasca-ujian (memodelkan semakan idea, tanpa merujuk objek tertentu), Oyen: *"Dulu aku fikir besar atau kecil yang penting. Sekarang aku pening! Krew, bantu aku fikir."*
- Kod belum terbentuk, Oyen `sedih-semangat`: *"Alamak, huruf-huruf ni bersepah! Aku pun pernah tersusun terbalik. Jom cuba lagi!"* Kiko: *"Ambil masa. Semak rekod ujian kamu satu demi satu."*
- Kod diterima, Kiko: *"Kod diterima. Tunjukkan ayat penjelasan kamu kepada Pegawai Pelabuhan."*

**Misi 2: Menara Pak Din**
- Taklimat, Oyen: *"Tiga cecair, satu cawan! Pekat? Berat? Yang dituang dulu? Aku keliru apa yang menentukan tempat duduk!"*
- Ramal, Kiko: *"Susun ramalan krew dahulu. Selepas itu, tuang perlahan-lahan mengikut dinding cawan."*
- Mod Uji, Oyen: *"Perlahan... perlahan... aku tahan nafas ni!"*
- Selepas rekod, Kiko: *"Lukis menara kamu dalam log. Kemudian, terangkan mengapa setiap cecair duduk di situ."*

**Misi 3: Telegram Kapten**
- Taklimat, Oyen: *"Kapten hantar misteri dunia sebenar! Aku harap ada pasal ikan."*
- Kad dibuka, Oyen (mengulang premis kad sahaja): *"Kapal besi tapi tak tenggelam?! Ini misteri besar!"*
- Jelaskan, Kiko: *"Tulis dengan ayat krew sendiri. Gunakan apa yang air ajar tadi."*

**Bantu Dahulu**
- Kiko: *"Bot kamu laju! Peraturan jeti: bantu satu bot lain dahulu. Tanya soalan, jangan beri jawapan."*
- Oyen: *"Peti Bonus berantai... tapi rantai itu putus bila kamu menolong!"*

**Peti Mak Tok**
- Oyen: *"Berat betul peti ni! Satu bot tak boleh angkat, semua bot kena tolong!"*
- Kiko (apabila peti terbuka): *"Hukum Muara milik seluruh krew Kuala Senyum."* (Selepas itu: `bergomol`.)

**Upacara**
- Oyen (`meraikan`): *"Sorakan ombak! Dari kiri ke kanan!"*
- Selepas gelaran terakhir, Oyen: *"Pusingan kemenangan! Kejar aku, Kiko!"* (`bermain-kejar`)

**Belai (bukan dialog misi)**
- Oyen selepas had: *"Hehe, cukup dulu! Jom fokus pada misi."*
- Kiko selepas had: *"Prrr... nanti kita main lagi. Misi dulu."*

---

## 5. Elemen interaktif dan infografik

### 5.1 Interaksi

| Elemen | Di mana | Perincian teknikal |
|---|---|---|
| **Seret dan lepas** | Kad objek ke Tikar Jeti (M1), blok cecair ke menara (M2), serpihan ke papan (S9) | Pointer Events (tetikus dan sentuh). **Alternatif ketik-ketik:** ketik kad, kemudian ketik zon, untuk murid yang sukar menyeret dan untuk papan kekunci. |
| **Kad selak** | Huruf kod (M1), Kad Situasi (M3), Gulungan Rahsia | Putaran 3D CSS (`transform: rotateY`). Hanya boleh diselak selepas keputusan direkod. |
| **Peti Kod** | M1 dan M2 (Mod Projektor) | Input huruf dipaparkan sebagai titik (●), jadi kelas lain tidak dapat melihat kod. Disemak dengan membandingkan **cincangan** (Bahagian 6.4). Tiada had cubaan, tetapi bilangan cubaan direkod untuk guru. |
| **Kerang Petunjuk** | Semua misi | 3 kerang bagi setiap bot. Boleh dihadiahkan kepada bot lain, dan bot pemberi mendapat Cop Penolong (maksimum 2 dikira). |
| **Bendera Uji** | Sebelum Mod Uji | Butang besar "ANGKAT BENDERA UJI" menukar skrin kepada Mod Uji dan mengunci ramalan. |
| **Loceng jeti** | Amaran 2 minit, upacara | Bunyi sintesis dan animasi loceng berayun |
| **Mod Tirai** | PG (kekunci `T`) | Skrin dijadikan gelap serta-merta, dengan logo jeti sahaja. |
| **Belai kucing** | Semua skrin, semua mod | Klik/sentuh dikira sebagai `dibelai` (Bahagian 4.3.2) |
| **Hover kucing** | Komputer (Mod Projektor) | Meow sintesis dan pandang kursor, dengan had kekerapan (Bahagian 4.3.2) |

### 5.2 Infografik

| Infografik | Bila dipaparkan | Apa yang ditunjukkan |
|---|---|---|
| **Sungai Carta Muara** | Sepanjang sesi | Kemajuan bot, Bintang Laut dan reben gelaran |
| **Pasang Surut** | Bar atas | Masa fasa dipaparkan sebagai paras air yang surut, beserta mm:ss |
| **Kejutan Lautan** (tablet) | Selepas rekod M1 | Ramalan lawan pemerhatian **bot sendiri**, diraikan sebagai penemuan |
| **Menara Pemerhatian** (tablet) | Selepas rekod M2 | Animasi titisan yang "duduk" mengikut **pemerhatian bot**, bukan jawapan sebenar |
| **Galeri Hukum Muara** | **Hanya selepas Peti Mak Tok dibuka** (minit 31–33) | (a) Bekas air dengan 9 objek yang terapung atau tenggelam; (b) Menara 3 lapisan; (c) **Timbangan Muara**, iaitu neraca yang membandingkan setiap objek dengan "blok air sama saiz" untuk memvisualkan ketumpatan dan menangkis miskonsepsi saiz. **Madu tidak dipaparkan** kerana ia muncul dalam Tiket Keluar. |

### 5.3 Bunyi

**Tetapan lalai:** bunyi **HIDUP**, kelantangan induk **40%**. Guru boleh melaraskannya antara 35% dan 45% dengan gelangsar dalam PG (julat penuh 0–100% tersedia). Tetapan disimpan dalam `mjks.v1.tetapan`.

- Semua bunyi **disintesis dengan Web Audio API**, jadi tiada fail audio diperlukan. Bunyi termasuk:
  - "plup" air
  - loceng jeti
  - deringan lembut untuk kod diterima
  - ombak untuk upacara
  - "prrr" kucing (belai)
  - **"meow" kucing (hover)**
- **Tiada bunyi "salah" atau buzzer.** Jika kod belum terbentuk, bunyi yang dimainkan ialah ombak kecil yang neutral.
- Butang **Senyap** sentiasa kelihatan di penjuru kanan atas (kekunci `M`). Apabila Senyap aktif, **semua** bunyi termasuk meow dan purr dimatikan.
- Bunyi `AudioContext` hanya dimulakan selepas interaksi pertama (klik di Skrin Mula), mengikut dasar autoplay pelayar.

**Spesifikasi meow sintesis (tiada fail audio):**

| Parameter | **Oyen** (tinggi, riang) | **Kiko** (lembut, dalam) |
|---|---|---|
| Sumber | Pengayun segitiga dan gergaji (campuran 70/30) | Pengayun segitiga |
| Kontur nada ("me-ow") | 650 Hz → naik ke 900 Hz → turun ke 600 Hz | 380 Hz → naik ke 520 Hz → turun ke 360 Hz |
| Durasi | 0.35 s | 0.55 s |
| Penapis "formant" | Jalur lulus sekitar 1.2 kHz (kedengaran "terbuka") | Laluan rendah sekitar 1.5 kHz (kedengaran "lembut") |
| Sampul gain | Serangan 20 ms, lepas 120 ms | Serangan 40 ms, lepas 200 ms |
| Kelantangan relatif | 1.0 × kelantangan induk × 0.6 | **0.7 ×** kelantangan Oyen |
| Variasi | Nada rawak ±5%, durasi ±10% (supaya tidak berulang sama) | Sama |

Kelantangan meow dan purr sengaja dihadkan kepada paling banyak 60% daripada kelantangan induk, supaya tidak mengatasi suara guru.

### 5.4 Maklum balas tidak menghukum (contoh teks sistem)

| Situasi | Teks |
|---|---|
| Kod belum terbentuk | *"Ombak belum tenang. Kod belum terbentuk. Semak semula rekod krew."* |
| Cubaan ketiga | *"Tiga cubaan! Pelaut hebat tak berputus asa. Mahu surat daripada Mak Tok?"* |
| Ramalan berbeza dengan keputusan | *"Kejutan Lautan! Penemuan baharu untuk krew."* |
| Penjelasan belum diluluskan | Guru menekan "Belum lagi". Skrin memaparkan: *"Pegawai Pelabuhan mahu dengar lebih lanjut. Tambah satu sebab lagi."* |

---

## 6. Model data dan keadaan (state)

### 6.1 Prinsip
- Semua data disimpan dalam **localStorage** pelayar. Tiada pelayan dan tiada internet.
- **Tiada nama murid disimpan.** Hanya nama bot dan "Ahli 1–5" (inisial pilihan, lalainya kosong).
- Dua kunci berasingan disimpan: **data permainan** dan **data guru**. Skrin murid tidak pernah membaca kunci guru.
- Semua tulisan berlaku serta-merta. Muat semula halaman tidak menghilangkan kemajuan.
- Keadaan animasi kucing **tidak disimpan**, kerana ia ditentukan semula daripada fasa semasa. Hanya kiraan had (cth. bilangan permainan berpasangan dalam sesi) disimpan dalam `sessionStorage`.

### 6.2 Kunci localStorage

| Kunci | Isi |
|---|---|
| `mjks.v1.permainan` | Keadaan sesi dan bot |
| `mjks.v1.guru` | Metrik, catatan, hash PIN, cincangan kod, log kelulusan |
| `mjks.v1.tetapan` | Mod, bunyi, saiz fon, bot tablet, suis kucing |
| `mjks.v1.sesiSeterusnya` | Pilihan kuasa (Objek Misteri, peraturan rakit) untuk pelajaran akan datang |

### 6.3 Struktur ringkas

```js
// mjks.v1.permainan
{
  versi: 1,
  fasa: "misi1",            // mula|daftar|misi1|misi2|misi3|peti|galeri|upacara|tiket
  pemasa: { fasaMulaPada: 1763000000000, bakiSaat: 600, dijeda: false },
  barisanJeti: ["penyu", "dugong"],
  bot: {
    penyu: {
      nama: "Penyu", warna: "#1f7a5a", corak: "jalur",
      peranan: { kapten: 1, penguji: 2, jurutulis: 3, pemerhati: 4, juruhubung: 5 },
      peranti: "kertas",          // "kertas" | "tablet" (mod campuran)
      misi1: {
        ramalan:   { /* objekId: "atas" | "dasar" (jawapan: lihat js/kunci-jawapan.js) */ },
        ramalanOleh: { pensel: 2, guli: 4 },
        keputusan: { /* objekId: "atas" | "dasar" */ },   // pemerhatian bot
        kodDiterima: true, cubaanKod: 2, cop: true
      },
      misi2: { ramalan: [/* 3 warna, bawah -> atas; jawapan: lihat js/kunci-jawapan.js */], pemerhatian: [...],
               kodDiterima: false, cubaanKod: 0, cop: false },
      misi3: { kadSituasi: [2, 5], cop: false, serpihan: false },  // penjelasan kekal di kertas
      kerang: 2,
      suratDibuka: [ { misi: 1, tahap: 1, masa: 1763000123000 } ],
      copPenolong: 1,             // dikira maksimum 2 untuk bintang
      membantu: ["kerapu"],
      penjejakRahsia: false,
      bonusKlip: null,
      gelaran: []                 // "nakhoda" | "pegawai" | "jurutera" | "penjejak"
    }
    /* kenyalang, pari, belangkas, dugong, kerapu */
  },
  peti: { serpihanDiletak: { "1": "penyu" }, ruangDiisi: ["1a"], dibuka: false }
}
// Bintang Laut tidak disimpan. Ia DIKIRA: cop misi (≤3) + min(copPenolong, 2) + bonus rakit (1).
```

```js
// mjks.v1.guru  (hanya dibaca oleh Panel Guru dan penyemak kod)
{
  pinHash: "...",              // SHA-256 PIN 4–6 digit (penghalang ringan, bukan keselamatan sebenar)
  kodHash: { m1Atas: "...", m1Dasar: "...", m2: "..." },   // cincangan SHA-256 + garam (kod: lihat js/kunci-jawapan.js)
  metrik: {
    penyu: { op1: 2, op2: null, op3: null,
             miskonsepsi: ["saiz"], catatan: "Ahli 3 masih kata 'ringan'" }
  },
  logKelulusan: [ { bot: "penyu", jenis: "copM1", masa: 1763000300000 } ]
}
```

```js
// mjks.v1.tetapan
{
  mod: "projektor",            // "projektor" | "tablet"
  botTablet: null,
  bunyi: { hidup: true, kelantangan: 0.40 },     // lalai: HIDUP, 40%
  saizFon: "besar",
  kucing: { meowHover: true, mainBerpasangan: true, kurangkanAnimasi: false, modRingan: "auto" }
}
```

### 6.4 Kandungan diasingkan daripada logik, dan kunci jawapan dilindungi
- Semua teks (dialog, surat petunjuk, objek, Kad Situasi, serpihan, soalan Tiket Keluar) disimpan dalam **`js/kandungan.js`**. Guru boleh menyuntingnya tanpa menyentuh logik aplikasi.
- **Kod misi tidak pernah ditulis sebagai teks biasa** dalam `kandungan.js`. Peti Kod menyemak input murid dengan membandingkan cincangan SHA-256 (Web Crypto, luar talian), jadi kod tidak boleh dibaca daripada kod sumber laman awam.
- **Kunci jawapan yang boleh dibaca** (nasib 9 objek, kod, susunan menara, contoh penjelasan model) disimpan dalam **`js/kunci-jawapan.js`**. Fail ini:
  - hanya wujud di komputer guru;
  - disenaraikan dalam `.gitignore`, jadi **tidak diterbitkan** ke GitHub Pages;
  - dimuatkan oleh tab "Kunci Jawapan" dalam PG jika ada. Jika fail tiada, tab memaparkan *"Kunci jawapan tidak tersedia pada peranti ini."*
- Jika senarai objek diubah, guru memasukkan kod baharu melalui PG (tab Kunci). Aplikasi menjana cincangan baharu secara automatik.

### 6.5 Tangga petunjuk dalam kandungan (dengan semakan kumulatif)

**Misi 1** (jawapan terbuka: menerangkan mengapa sesetengah objek terapung dan yang lain tenggelam; nasib objek: lihat js/kunci-jawapan.js)
- P1 (Mak Tok): *"Cu, cuba tengok semula objek yang duduk di atas air dan objek yang turun ke dasar. Apa yang sama pada setiap kumpulan objek itu?"*
- P2 (Mak Tok): *"Cu, bayangkan dua benda yang sama besar. Satu terasa berat di tangan, satu terasa ringan. Apa yang ada di dalamnya yang membuatkan rasanya berbeza?"* (ditulis semula atas keputusan guru, QA-011)
- P3 (Mak Tok, contoh selari dan langkah separa): *"Mak Tok pernah nampak kayu balak sebesar lori terapung, tapi paku kecil tenggelam. Lengkapkan: 'Objek terapung bukan kerana ia kecil, tetapi kerana jika dibandingkan dengan air, ia ______.'"*
- **Semakan:** soalan ini jawapan terbuka, jadi tiada pilihan yang disingkir. Keputusan setiap objek datang daripada ujian fizikal, dan tiada petunjuk menyatakan nasib mana-mana objek misi.

**Misi 2** (peringkat ramalan; 6 susunan dari bawah ke atas)
- P1 (Pak Din): *"Bila air dalam cawan dah duduk diam, apa agaknya yang menentukan siapa duduk di bawah dan siapa di atas?"*
- P2 (Pak Din): *"Pak Din ada dua cawan yang sama penuh, satu sirap dan satu minyak. Angkat kedua-duanya. Mana yang lebih berat?"*
- P3 (Pak Din, contoh selari): *"Masa mak kamu cuci kuali berminyak, minyak itu pergi ke mana dalam air basuhan? Sekarang tinggal satu teka-teki untuk kamu selesaikan sendiri."*

| Selepas | Susunan yang masih munasabah (bawah → atas) | Sebab |
|---|---|---|
| P1 | Kesemua 6 | Soalan terbuka, tiada maklumat yang menyingkir |
| P2 | 3 susunan (senarai: lihat js/kunci-jawapan.js) | Tiga susunan tersingkir. |
| P3 | **2 susunan** (senarai: lihat js/kunci-jawapan.js) | Satu lagi susunan tersingkir. Tinggal **2**, jadi petunjuk **tidak boleh menyempitkan lagi**. |

> **Nota (keputusan guru, QA-044):** P3 Misi 1 dan Misi 2 dikunci sehingga selepas krew menguji (Bendera Uji dalam Mod Projektor; selepas Rekod/Tuang dalam Mod Tablet). P1 dan P2 boleh dibuka bila-bila masa, dan tiada kerang ditolak semasa P3 dikunci.

Jika bot masih buntu selepas P3, aplikasi **tidak menawarkan P4**. Kiko sebaliknya berkata: *"Tuang, perhati, dan terangkan dengan ayat sendiri mengapa setiap cecair duduk di situ."* (respons terbuka)

**Misi 3** (telegram umum, semua Kad Situasi berbentuk jawapan terbuka)
- P1: *"KRU STOP BAYANGKAN KAMU DALAM SITUASI ITU STOP APA YANG BERLAKU PADA BENDA ITU DAN APA YANG ADA DI DALAMNYA STOP"*
- P2: *"KRU STOP FIKIRKAN BAHAN ATAU RUANG DI DALAM BENDA ITU STOP JIKA DIMASUKKAN KE BEKAS AIR KAMU TADI KE MANA IA PERGI STOP"*
- P3: *"KRU STOP LENGKAPKAN 'Secara keseluruhan benda ini menjadi ____ tumpat daripada air maka ia ____' STOP"*
- **Semakan:** tiada pilihan jawapan, jadi murid masih perlu menamakan perbandingan ketumpatan dan hasilnya sendiri.

> **Ujian penerimaan semasa pembinaan:** satu skrip semakan akan memastikan tiada teks petunjuk atau dialog dalam `kandungan.js` mengandungi perkataan jawapan yang disenaraikan bagi misi itu (cth. perkataan dalam ruang kosong Hukum Muara), dan tiada kod misi wujud sebagai teks biasa.

---

## 7. Panel Guru (tersembunyi)

### 7.1 Akses
- **Ctrl+Shift+G** pada komputer, atau **tekan lama logo jeti selama 3 saat** pada tablet. Kemudian masukkan PIN 4–6 digit (ditetapkan semasa kali pertama aplikasi digunakan).
- Panel ditutup secara automatik selepas 60 saat tanpa aktiviti, atau dengan kekunci `Esc`.
- **Dua laluan yang disokong:**
  1. **Disyorkan: paparan Extend.** Projektor menunjukkan skrin murid, manakala skrin laptop guru menunjukkan PG dalam tingkap kedua (`#/guru`). Kedua-dua tingkap berkongsi data melalui localStorage, dan peristiwa `storage` mengemas kini tingkap yang satu lagi serta-merta.
  2. **Jika Extend tiada atau tidak berfungsi:** **Mod Tirai (`T`) WAJIB** ditekan sebelum membuka PG, supaya kelas tidak nampak metrik atau kunci jawapan. Untuk keselamatan tambahan, PG dibuka dalam keadaan Tirai secara automatik jika aplikasi mengesan hanya satu skrin dan mod Projektor aktif.

> **Panduan Guru: cara tetapkan Extend di Windows**
> 1. Sambungkan kabel projektor (HDMI/VGA) ke laptop.
> 2. Tekan **kekunci Windows + P** serentak.
> 3. Pilih **"Extend"** (Lanjutkan). *Jangan* pilih "Duplicate" (Pendua), kerana itu menunjukkan skrin yang sama di kedua-dua tempat.
> 4. Buka aplikasi di pelayar, kemudian **seret tingkap pelayar ke kanan** sehingga ia muncul di projektor. Tekan **F11** untuk skrin penuh.
> 5. Di skrin laptop, buka tingkap pelayar kedua ke alamat yang sama, ditambah `#/guru`, untuk Panel Guru.
> 6. **Uji sebelum kelas:** gerakkan tetikus ke kanan sehingga ia "hilang" ke projektor, dan pastikan murid tidak nampak skrin laptop.
> 7. Untuk kembali seperti biasa selepas kelas: **Windows + P**, kemudian pilih **"Duplicate"** atau **"PC screen only"**.
>
> *Jika pilihan Extend tidak muncul, laptop mungkin hanya mengesan satu paparan. Gunakan laluan 2 (Mod Tirai).*

### 7.2 Tab dan fungsi

| Tab | Fungsi |
|---|---|
| **Metrik** | Grid 6 bot × OP1–OP3, nilai 0–3 (atau "–" jika belum dinilai). Kotak tanda miskonsepsi: "saiz menentukan", "ringan = terapung", "pekat = paling bawah", "dituang dulu = bawah". Catatan bebas. **Cadangan automatik** (hanya cadangan): contohnya kod diterima tanpa petunjuk ditambah Cop → cadang OP1 ≥ 2. Guru yang memutuskan. |
| **Kelulusan** | Butang Cop Pelabuhan (M1, M2, M3), "Belum lagi" (menghantar mesej lembut ke skrin), Cop Penolong, Penjejak Rahsia, dan rekod klip Peti Bonus |
| **Masa** | Mula, jeda dan sambung pemasa fasa; ±1 minit; loceng manual; amaran 2 minit automatik; jadual lalai mengikut rancangan (boleh disunting) |
| **Kunci** | Buka atau kunci misi secara global atau bagi setiap bot; **pintasan untuk bot yang ketinggalan** (M2 terus ke M3 dengan 1 Kad Situasi sahaja); bahagian **"Fasa bersama"** (buka Peti Mak Tok); isi ruang kosong Hukum Muara selepas kelas menyebutnya; **tetapkan atau tukar kod misi** (dicincang secara automatik) |
| **Gelaran** | Cadangan automatik (Nakhoda: bintang paling banyak, seri dipecahkan oleh Cop Penolong; Pegawai: bot pertama yang siap dan membantu; Jurutera: klip paling banyak). Guru mengesahkan atau menukar. Rekod pilihan kuasa untuk sesi seterusnya. |
| **Kunci Jawapan** | Nasib 9 objek, kod misi (lihat js/kunci-jawapan.js), susunan menara, contoh penjelasan model. Dimuatkan daripada `kunci-jawapan.js` tempatan sahaja. **Hanya dalam PG.** |
| **Data** | Cetak laporan sesi A4 (metrik, petunjuk digunakan, cubaan, miskonsepsi); eksport **CSV** (untuk rekod TP) dan **JSON** (sandaran); import JSON (cth. dari tablet ke papan induk) |
| **Tetapan** | Kelantangan (lalai 40%); suis **Meow hover**, **Main berpasangan**, **Kurangkan animasi**, **Mod Ringan** (auto/hidup/mati); saiz fon A+/A− |
| **Reset** | Reset sesi (taip "RESET" untuk mengesahkan); reset satu bot; tukar PIN |

---

## 8. Struktur fail projek dan cara menjalankan

### 8.1 Struktur
Lokasi projek: `C:\Users\wmair\OneDrive\Desktop\Claude Code Project\Education Games\`

```
Education Games/
├── reka-bentuk-sistem.md          # dokumen ini
└── misi-jeti/
    ├── index.html                 # satu halaman; penghala berasaskan hash (#/peta, #/misi1, #/guru ...)
    ├── .gitignore                 # mengecualikan js/kunci-jawapan.js
    ├── css/
    │   ├── asas.css               # pemboleh ubah warna, fon, saiz (mod projektor/tablet)
    │   ├── susun-atur.css         # grid skrin, panel dialog, jalur lantai jeti
    │   ├── kucing.css             # keyframes: nafas, kelip, ekor, emosi, jalan, lompat, mulut, hover
    │   ├── kucing-rupa.css        # rupa Oyen (oren) & Kiko (Ragdoll blue point, garis luar gelap)
    │   ├── kucing-pasangan.css    # keyframes kejar, bola bulu gomol, lerai, sentuh hidung
    │   ├── animasi.css            # air, kad selak, menara, loceng, ombak
    │   └── panel-guru.css
    ├── js/
    │   ├── kandungan.js           # SEMUA teks, objek, petunjuk, cincangan kod (boleh disunting guru)
    │   ├── kunci-jawapan.js       # TEMPATAN SAHAJA, tidak diterbitkan
    │   ├── keadaan.js             # baca/tulis localStorage, kiraan bintang, segerak antara tingkap
    │   ├── penghala.js            # navigasi hash, kawalan fasa
    │   ├── kucing-rig.js          # jana SVG berlapis (templat satu rig, dua rupa) + zon hover
    │   ├── kucing-mesin.js        # 3 mesin keadaan selari (lokasi/emosi/mulut), keutamaan, baris peristiwa
    │   ├── kucing-gerak.js        # titik labuh (data-labuh), jalan/lompat, satu gelung rAF, Mod Ringan
    │   ├── kucing-pasangan.js     # koreografer: kunci bersama, garis masa rentak, lerai, syarat & had
    │   ├── kucing-interaksi.js    # belai, hover-meow, had kekerapan
    │   ├── dialog.js              # gelembung "taip" + segerak mulut
    │   ├── seret.js               # Pointer Events + alternatif ketik-ketik
    │   ├── bunyi.js               # Web Audio: loceng, plup, ombak, purr, meow Oyen/Kiko, senyap
    │   ├── cincang.js             # SHA-256 (Web Crypto) untuk PIN dan kod
    │   ├── pemasa.js
    │   ├── skrin/                 # satu fail setiap skrin
    │   │   ├── mula.js  daftar.js  peta.js  misi1.js  misi2.js  misi3.js
    │   │   ├── surat.js  bonus.js  botol.js  peti.js  galeri.js  upacara.js  tiket.js
    │   ├── panel-guru.js
    │   └── utama.js               # permulaan
    └── assets/
        └── svg/                   # objek, bendera bot, latar jeti, potret Mak Tok/Pak Din/Kapten
```

**Keputusan teknikal:**
- Gunakan tag `<script>` biasa (bukan ES modules), supaya aplikasi juga berfungsi jika `index.html` dibuka terus dengan dwiklik (`file://`).
- Web Crypto (untuk cincangan) memerlukan konteks selamat. `localhost` dan GitHub Pages (https) memenuhi syarat ini. Untuk `file://`, aplikasi menggunakan pelaksanaan SHA-256 JavaScript kecil sebagai sandaran.
- Gunakan fon sistem sahaja ("Segoe UI", Verdana, sans-serif), tanpa Google Fonts.
- Semua laluan fail adalah relatif, jadi aplikasi sedia untuk GitHub Pages.

### 8.2 Menjalankan di localhost (komputer guru, Windows)
1. Buka PowerShell, kemudian jalankan:
   `cd "C:\Users\wmair\OneDrive\Desktop\Claude Code Project\Education Games\misi-jeti"`
2. Jalankan `py -m http.server 8000` (atau `python -m http.server 8000`).
3. Buka pelayar dan pergi ke `http://localhost:8000`. Untuk Panel Guru di tingkap kedua, gunakan `http://localhost:8000/#/guru`.
4. Alternatif tanpa Python: pasang sambungan "Live Server" dalam VS Code, atau dwiklik `index.html` (sandaran).

> **Disyorkan: gunakan localhost, bukan `file://`.** Sesetengah pelayar mengendalikan localStorage secara berbeza untuk fail tempatan. Gunakan **pelayar dan profil yang sama** setiap kali supaya data kekal.
>
> **Nota OneDrive:** folder projek berada dalam OneDrive. Ini tidak menjejaskan data aplikasi, kerana data disimpan dalam pelayar, bukan dalam folder. Pastikan fail projek ditanda "Sentiasa simpan pada peranti ini" supaya aplikasi boleh dibuka tanpa internet di sekolah.

### 8.3 Penerbitan kemudian (GitHub Pages)
Muat naik folder `misi-jeti` ke repositori, kemudian aktifkan Pages (cabang `main`, folder akar).
- `kunci-jawapan.js` tidak dimuat naik (`.gitignore`).
- Kod misi hanya wujud dalam bentuk cincangan.
- Data tetap disimpan dalam peranti pengguna sahaja, dan tiada data murid dihantar ke mana-mana.

---

## 9. Kebolehcapaian dan kesesuaian projektor

| Aspek | Spesifikasi |
|---|---|
| Saiz teks | Mod Projektor: teks badan ≥ 32 px, tajuk ≥ 48 px, gelembung dialog ≥ 30 px. Mod Tablet: ≥ 22 px. Terdapat butang A+/A− dalam PG. |
| Kontras | Teks ≥ 7:1 (projektor kelas selalunya pudar). Latar terang dengan teks gelap. Tiada teks di atas imej sibuk. |
| Kontras kucing | Garis luar gelap 3–3.5 px; jalur lantai jeti sederhana gelap di belakang kucing; siluet Oyen dan Kiko diuji dalam skala kelabu |
| Warna | Warna **tidak pernah** menjadi satu-satunya isyarat. Cecair dan bot mempunyai **warna, corak dan label**. Palet diuji untuk buta warna merah-hijau. |
| Sasaran sentuh | ≥ 64 px untuk butang dan kad (sesuai untuk jari murid 10 tahun) |
| Gerakan | Menghormati `prefers-reduced-motion`, dengan suis "Kurangkan animasi" dalam PG (mematikan perjalanan, lompatan dan permainan berpasangan). Tiada kelipan melebihi 3 kali sesaat. |
| Bunyi | Bunyi tidak pernah membawa maklumat penting yang tidak dipaparkan secara visual. Meow dan purr hanya hiasan. Butang Senyap sentiasa kelihatan. |
| Papan kekunci | Semua tindakan boleh dicapai dengan Tab, Enter dan anak panah (seret mempunyai alternatif ketik-ketik atau kekunci). Kucing boleh difokus (fokus = hover, Enter = belai). |
| Pembaca skrin | Gelembung dialog berada dalam `aria-live="polite"`, dan semua SVG mempunyai `<title>`. Animasi hiasan (main berpasangan, meow) ditanda `aria-hidden`. |
| Beban bacaan | Satu arahan utama setiap skrin, dan setiap gelembung mengandungi ≤ 20 perkataan. Ikon disertakan dengan perkataan. |
| Tanpa internet | Tiada CDN, fon luar, fail audio atau analitik. Semua aset tempatan dan bunyi disintesis. |
| Resolusi | Direka untuk 1280×720, dan berskala hingga 1920×1080. Diuji pada nisbah 4:3 (projektor lama). |

---

## 10. Risiko, batasan dan keputusan guru

### 10.1 Risiko dan mitigasi

| # | Risiko | Mitigasi |
|---|---|---|
| R1 | **Skrin projektor membocorkan jawapan** kepada bot lain | Peti Kod bertopeng (●); kod dan animasi fizik betul tidak dipaparkan sebelum Peti Mak Tok; Mod Tirai; PG di skrin Extend |
| R2 | **Skrin mencuri tumpuan daripada eksperimen air** | Mod Uji tanpa interaksi, tanpa meow dan tanpa permainan kucing; Penguji kekal di meja; Juruhubung sahaja yang ke Jeti Guru |
| R3 | **Barisan di projektor melambatkan kelas** | Hanya kod pendek dimasukkan (±15 saat); rekod terperinci kekal di atas kertas; Barisan Jeti dipaparkan |
| R4 | **Data hilang** (cache dipadam, pelayar ditukar) | Simpanan automatik; butang eksport JSON pada akhir sesi; arahan "pelayar yang sama" |
| R5 | PIN dan Kunci Jawapan **bukan keselamatan sebenar** (boleh dibaca melalui DevTools atau kod sumber) | Mencukupi untuk bilik darjah. Kod misi disimpan sebagai cincangan, dan `kunci-jawapan.js` tidak diterbitkan (Bahagian 6.4, Keputusan no. 10). |
| R6 | Mod Tablet **tidak disegerakkan** | Guru menambah bintang pada papan induk melalui PG, atau mengimport JSON dari tablet selepas sesi |
| R7 | Murid "meneka" kod daripada huruf | Huruf hanya diselak selepas rekod; Cop memerlukan penjelasan bertulis yang diluluskan guru |
| R8 | Oyen secara tidak sengaja menjadi "petunjuk terbalik" | Peraturan dialog dalam 4.2; skrip semakan kandungan; semakan guru terhadap `kandungan.js` |
| R9 | Projektor pudar menyebabkan warna cecair atau Kiko yang pucat tidak jelas | Corak dan label pada setiap cecair; garis luar gelap dan lantai jeti di belakang kucing; kontras tinggi |
| R10 | Kebaharuan cepat pudar (novelty effect) | `kandungan.js` membolehkan objek, situasi dan dialog ditukar untuk sesi ulangan; pilihan kuasa disimpan untuk sesi seterusnya |
| R11 | Masa pembinaan dan beban guru | Watak manusia dipaparkan sebagai potret statik; satu rig kucing dikongsi oleh dua rupa; aplikasi dibuka dan bot didaftarkan sebelum kelas |
| R12 | **Kucing yang terlalu hidup mengganggu tumpuan** (murid asyik membelai, guru atau murid sengaja menghalakan tetikus untuk mendengar meow, murid menonton kucing bermain) | Belai: had 3 sentuhan dalam 30 s, kemudian bertenang 20 s. Hover: 1 meow/4 s setiap kucing, jarak global 1.5 s, senyap 30 s selepas 6 meow/minit. Main berpasangan hanya di hab selepas 45 s tiada aktiviti (maks 3 kali/sesi, bertenang 3 min) atau sebagai perayaan, dan **sentiasa dibatalkan** oleh peristiwa permainan. Tiada meow, belai berguling atau permainan semasa Mod Uji. Tiada kandungan misi melalui interaksi kucing. Semua boleh dimatikan dalam PG. |
| R13 | **Animasi lambat pada laptop sekolah lama**, terutamanya apabila dua kucing bergerak serentak | Hanya `transform`/`opacity` dianimasikan; **satu** gelung rAF dikongsi oleh kedua-dua kucing; gomol menggunakan **satu sprite gabungan**, bukan dua rig bertindih; jeda apabila tab tersembunyi; Mod Ringan automatik jika < 30 fps (permainan berpasangan diganti dengan sentuh hidung 1.5 s); ujian prestasi pada laptop sekolah sebenar sebelum kelas |
| R14 | Rig SVG berlapis mengambil masa untuk dilukis dengan cantik | Bina rig Oyen dahulu, kemudian tukar rupa kepada Kiko menggunakan rig yang sama. Mulakan dengan bentuk ringkas (bulatan dan lengkung), kemudian perhalusi selepas guru meluluskan rupa. |
| R15 | **Meow mengganggu atau terlalu kuat** di bilik darjah | Meow dihadkan kepada ≤ 60% kelantangan induk (lalai 40%); meow Kiko 0.7× Oyen; variasi nada supaya tidak menjengkelkan; ikut butang Senyap; suis "Meow hover" boleh dimatikan dalam PG |
| R16 | Pelayar menyekat bunyi sebelum interaksi pertama (dasar autoplay) | `AudioContext` dimulakan pada klik pertama di Skrin Mula |

### 10.2 Batasan
- Aplikasi **tidak dapat menilai penjelasan bertulis** murid. Kelulusan (Cop) dan metrik sentiasa bergantung pada pertimbangan guru.
- Aplikasi tidak mengesan keputusan eksperimen sebenar. Ketepatan rekod bergantung pada pemerhatian murid, dan ini disengajakan.
- Tiada sintesis suara bahasa Melayu yang boleh dipastikan tersedia luar talian, jadi dialog hanya dipaparkan dalam bentuk teks.
- Meow sintesis ialah anggaran bunyi kucing yang comel, bukan rakaman sebenar.
- Hover tidak wujud pada skrin sentuh. Dalam Mod Tablet, hanya belai (sentuh) tersedia.

### 10.3 Keputusan guru

| # | Perkara | Keputusan | Status |
|---|---|---|---|
| 1 | Paparan Extend | Dua laluan dikekalkan: **Extend disyorkan**; jika tiada, **Mod Tirai `T` wajib** sebelum PG. Kotak panduan Win+P disediakan (7.1). Pak Cik akan menerangkan kepada guru. | **Keputusan guru** |
| 2 | Tablet | Mod Tablet kekal pilihan. **Mod campuran dibenarkan**: bot tanpa tablet menggunakan kertas dan Peti Kod di projektor. | Diputuskan (lalai) |
| 3 | Penjelasan murid | **Kekal di Log kertas** (juga dalam Mod Tablet). Aplikasi hanya merekod Cop daripada guru. | Diputuskan (lalai) |
| 4 | PIN guru | 4–6 digit, ditetapkan semasa kali pertama digunakan, boleh ditukar dalam tab Reset | Diputuskan (lalai) |
| 5 | Bunyi | **Lalai HIDUP, 40%** (julat 35–45%) | **Keputusan guru** |
| 6 | Kucing | Oyen dan **Kiko** diluluskan. Oyen **tidak** berjenaka hampir terjatuh ke dalam air. | Keputusan guru (nama/rupa); Diputuskan (lalai) (jenaka air) |
| 7 | Botol Misteri | **Dikekalkan** sebagai laluan explorer. Kata rahsia dalam Gulungan Rahsia fizikal: lihat js/kunci-jawapan.js (neutral, tidak membayangkan jawapan). Disimpan sebagai cincangan SHA-256 sahaja (seperti kod misi, QA-045); ditetapkan dalam `kunci-jawapan.js` atau Panel Guru > Kunci. | Diputuskan (lalai) |
| 8 | Kod Misi 1 | **9 objek termasuk batu kecil**. Kod: lihat js/kunci-jawapan.js. Jika objek diubah, guru menetapkan kod baharu dalam PG. | Diputuskan (lalai) |
| 9 | Galeri Hukum Muara | **2 minit pada minit 31–33**, sebelum upacara | Diputuskan (lalai) |
| 10 | Penerbitan awam | **Ya, kunci jawapan dikeluarkan** daripada versi awam: kod disimpan sebagai cincangan, dan `kunci-jawapan.js` tempatan sahaja (`.gitignore`) | Diputuskan (lalai) |
| 11 | Tulisan | **Bahasa Melayu (Rumi) sahaja** untuk versi 1. Teks dalam `kandungan.js` memudahkan penambahan Jawi kemudian. | Diputuskan (lalai) |
| 12 | Laporan | **Kedua-duanya**: cetakan A4 dan eksport CSV (untuk rekod TP), ditambah JSON sebagai sandaran | Diputuskan (lalai) |
| 13 | Nama kucing Ragdoll | **Si Kiko** | **Keputusan guru** |
| 14 | Belai dalam Mod Projektor | **Dibenarkan**, ditambah **hover meow** dengan had kekerapan | **Keputusan guru** |
| 15 | Rupa Kiko | **Blue point kelabu-putih**: badan putih/krim pucat, muka/telinga/ekor kelabu kebiruan, mata biru, garis luar gelap | **Keputusan guru** |
| 16 | Interaksi kucing-dengan-kucing | **`bermain-kejar`** dan **`bergomol`** (lembut, tiada unsur ganas), dengan syarat dan had dalam 4.3.1(g) | **Keputusan guru** |

**Baki soalan:** tiada soalan yang menghalang pembinaan. Dua pengesahan pilihan boleh dibuat semasa semakan prototaip:
- (a) Adakah kata rahsia (lihat js/kunci-jawapan.js) sesuai, atau guru mahu perkataan lain?
- (b) Selepas melihat prototaip pertama Kiko di projektor sekolah, adakah ketebalan garis luar dan warna kelabu perlu dilaras?

---

## Lampiran: Peta 4 jenis pemain dan tangga ganjaran dalam aplikasi

| Jenis pemain | Ciri aplikasi |
|---|---|
| **Achiever** | Bot bergerak di sungai, Bintang Laut, langkah misi bertanda (1 RAMAL → 4 KOD), reben gelaran |
| **Explorer** | Botol Misteri (kata rahsia daripada Gulungan Rahsia fizikal), Beg Surat, Galeri Hukum Muara, Timbangan Muara interaktif, reaksi tersembunyi kucing (melembik, berguling, meow) |
| **Socializer** | Peranan krew, Hadiah Kerang, Cop Penolong (bernilai sama dengan satu misi), Peti Mak Tok bersama, sorakan ombak, persahabatan Oyen dan Kiko sebagai model kerjasama |
| **Competitor** | Carta Muara antara 6 bot, papan klip Peti Bonus Rakit, gelaran tunggal Nakhoda Muara |

| Tangga | Dalam aplikasi | Upacara |
|---|---|---|
| **Status** | Nakhoda Muara, Pegawai Pelabuhan, Jurutera Rakit dan Penjejak Rahsia sebagai reben pada bot dan nama di "Papan Nakhoda" (skrin dan sudut kelas) | Loceng 3 kali, skrol pengisytiharan Mak Tok dibuka perlahan, setiap gelaran diumumkan satu demi satu, kucing `meraikan`, sorakan ombak, pusingan kemenangan `bermain-kejar` |
| **Akses** | Peti Bonus (hanya selepas Cop Penolong); Penjejak Rahsia melihat siluet Objek Misteri minggu depan; Pegawai Pelabuhan menyemak log bersama guru | Gerbang berantai "putus" dengan animasi apabila Cop Penolong diberi |
| **Kuasa** | Nakhoda memilih Objek Misteri sesi seterusnya dan bot yang dicabar; Jurutera Rakit menetapkan peraturan rakit minggu depan (disimpan dalam `sesiSeterusnya`) | Pilihan dibuat di hadapan kelas pada skrin upacara |
| **Barang (tambahan)** | Tiada barang digital. Pelekat sauh fizikal hanya diberi selepas gelaran. | – |

**Peraturan Bantu Dahulu dalam sistem:** Peti Bonus kekal berantai bagi setiap bot sehingga `copPenolong ≥ 1`. Cop ini diperoleh apabila (a) bot yang dibantu mengesahkan "Kami dibantu oleh: [bot]" dan guru meluluskan, atau (b) bot itu menghadiahkan satu Kerang Petunjuk kepada bot lain.
