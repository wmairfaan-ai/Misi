/* =====================================================================
   kandungan.js - SEMUA teks permainan (boleh disunting guru)
   ---------------------------------------------------------------------
   PERATURAN PENTING (Spesifikasi 1.3, 4.2, 6.5):
   - JANGAN tulis kod misi (jawapan) dalam fail ini sebagai teks biasa.
     Kod disimpan sebagai cincangan sahaja (kodHashLalai) atau ditetapkan
     oleh guru melalui Panel Guru > Kunci.
   - Petunjuk tidak boleh mengandungi perkataan jawapan, kata akarnya
     atau huruf awalnya.
   - Oyen tidak pernah meramal nasib objek/cecair misi sebelum ujian.
   - SUSUNAN objek dan cecair di bawah ialah SUSUNAN PAPARAN TETAP.
     Ia sengaja BUKAN susunan jawapan (tidak dikumpul ikut nasib, dan
     cecair bukan susunan menara). Jangan susun semula ikut jawapan.
   - Teks dalam teksSkrin boleh guna **tebal** (dua bintang) untuk huruf tebal.
   ===================================================================== */
window.MJ = window.MJ || {};

MJ.KANDUNGAN = {
  versi: 2,

  /* Garam untuk cincangan kod. Jika ditukar, semua kod perlu ditetapkan semula. */
  garam: 'mjks-garam-v1',

  /* Cincangan SHA-256 bagi (garam + '|' + KOD). Biarkan null jika belum dijana.
     Jika js/kunci-jawapan.js wujud (komputer guru), cincangan dijana automatik.
     Untuk versi awam (GitHub Pages), salin cincangan dari Panel Guru > Kunci. */
  kodHashLalai: { m1Atas: null, m1Dasar: null, m2: null },

  /* Kata rahsia Gulungan Rahsia fizikal (laluan explorer, Botol Misteri).
     QA-045: disimpan sebagai cincangan sahaja (garam + '|' + KATA, sama seperti kod).
     Teks biasa hanya dalam js/kunci-jawapan.js. Untuk versi awam, salin cincangan
     dari Panel Guru > Kunci > Papar cincangan. */
  kataRahsiaHashLalai: null,

  bot: [
    { id: 'kenyalang', nama: 'Kenyalang', warna: '#B03A2E', corak: 'serong' },
    { id: 'penyu',     nama: 'Penyu',     warna: '#1E7A5A', corak: 'titik' },
    { id: 'pari',      nama: 'Pari',      warna: '#2C5DA8', corak: 'ombak' },
    { id: 'belangkas', nama: 'Belangkas', warna: '#6E4A9A', corak: 'petak' },
    { id: 'dugong',    nama: 'Dugong',    warna: '#4F5B66', corak: 'mendatar' },
    { id: 'kerapu',    nama: 'Kerapu',    warna: '#A35400', corak: 'bintik' }
  ],

  peranan: [
    { id: 'kapten',     nama: 'Kapten',     tugas: 'Urus masa, angkat Bendera Uji' },
    { id: 'penguji',    nama: 'Penguji',    tugas: 'Satu-satunya yang sentuh air' },
    { id: 'jurutulis',  nama: 'Jurutulis',  tugas: 'Rekod ramalan sebelum uji' },
    { id: 'pemerhati',  nama: 'Pemerhati',  tugas: 'Lapor apa yang dilihat' },
    { id: 'juruhubung', nama: 'Juruhubung', tugas: 'Ke Jeti Guru, bantu bot lain' }
  ],

  fasa: [
    { id: 'mula',    nama: 'Permulaan',              minit: 3,  skrin: '#/peta' },
    { id: 'misi1',   nama: 'Misi 1: Rakit & Sauh',   minit: 10, skrin: '#/misi1' },
    { id: 'misi2',   nama: 'Misi 2: Menara Pak Din', minit: 8,  skrin: '#/misi2' },
    { id: 'misi3',   nama: 'Misi 3: Telegram Kapten',minit: 7,  skrin: '#/misi3' },
    { id: 'peti',    nama: 'Peti Mak Tok',           minit: 3,  skrin: '#/peti' },
    { id: 'galeri',  nama: 'Galeri Hukum Muara',     minit: 2,  skrin: '#/galeri' },
    { id: 'upacara', nama: 'Upacara Jeti',           minit: 4,  skrin: '#/upacara' },
    { id: 'tiket',   nama: 'Tiket Keluar',           minit: 3,  skrin: '#/tiket' }
  ],

  /* Huruf di belakang kad objek (sama seperti kad fizikal). Huruf sahaja
     tidak mendedahkan nasib objek. Susunan = susunan paparan tetap (bercampur).
     Jika huruf ditukar, kemas kini kod dalam kunci-jawapan.js atau Panel Guru. */
  objek: [
    { id: 'pensel',   nama: 'Pensel kayu',              huruf: 'E' },
    { id: 'guli',     nama: 'Guli',                     huruf: 'U' },
    { id: 'gabus',    nama: 'Gabus',                    huruf: 'K' },
    { id: 'straw',    nama: 'Penyedut minuman (straw)', huruf: 'L' },
    { id: 'syiling',  nama: 'Syiling 10 sen',           huruf: 'B' },
    { id: 'batu',     nama: 'Batu kecil',               huruf: 'U' },
    { id: 'penutup',  nama: 'Penutup botol plastik',    huruf: 'K' },
    { id: 'klip',     nama: 'Klip kertas',              huruf: 'B' },
    { id: 'aiskrim',  nama: 'Batang aiskrim',           huruf: 'O' }
  ],

  /* Susunan paparan tetap (BUKAN susunan menara, bukan juga terbalik). */
  cecair: [
    { id: 'air',    nama: 'Air',          label: 'Biru',   huruf: 'B' },
    { id: 'minyak', nama: 'Minyak masak', label: 'Kuning', huruf: 'K' },
    { id: 'sirap',  nama: 'Sirap',        label: 'Merah',  huruf: 'M' }
  ],

  situasi: [
    { id: 1, tajuk: 'Jaket keselamatan',
      teks: 'Nelayan yang memakai jaket keselamatan terapung apabila terjatuh ke dalam sungai. Mengapa?',
      oyen: 'Jaket kecil boleh bantu orang dewasa?! Wah!' },
    { id: 2, tajuk: 'Kapal besi',
      teks: 'Kapal Kapten diperbuat daripada besi yang sangat berat, tetapi kapal itu terapung. Mengapa?',
      oyen: 'Kapal besi tapi tak tenggelam?! Ini misteri besar!' },
    { id: 3, tajuk: 'Tumpahan minyak',
      teks: 'Minyak yang tumpah dari kapal membentuk lapisan di permukaan laut. Mengapa?',
      oyen: 'Minyak tumpah di laut? Aku nak tahu kenapa!' },
    { id: 4, tajuk: 'Pelampung pukat',
      teks: 'Nelayan mengikat pelampung pada pukat supaya pukat tidak tenggelam. Mengapa pelampung berfungsi?',
      oyen: 'Pelampung kecil jaga pukat besar? Hebat!' },
    { id: 5, tajuk: 'Ais dalam sirap',
      teks: 'Ais batu terapung dalam segelas air sirap. Mengapa?',
      oyen: 'Ais batu dalam sirap? Aku haus pula!' },
    { id: 6, tajuk: 'Kapal selam',
      teks: 'Kapal selam boleh timbul dan tenggelam dengan mengisi tangkinya dengan air atau udara. Bagaimana?',
      oyen: 'Kapal yang boleh timbul DAN tenggelam? Hebat!' }
  ],
  /* Pasangan Kad Situasi bagi setiap bot (indeks ikut susunan bot). */
  pasanganSituasi: [[0, 1], [2, 3], [4, 5], [1, 2], [3, 4], [5, 0]],

  /* Hukum Muara: 6 serpihan (satu bagi setiap bot, ikut susunan bot).
     Tajuk slot mesti NEUTRAL: tidak boleh mengandungi perkataan isian. */
  hukum: [
    { id: 1, tajuk: 'Objek terapung',      serpihan: 'Objek yang ____ tumpat daripada air akan terapung.', isian: 'kurang' },
    { id: 2, tajuk: 'Objek tenggelam',     serpihan: 'Objek yang ____ tumpat daripada air akan tenggelam.', isian: 'lebih' },
    { id: 3, tajuk: 'Susunan cecair (1)',  serpihan: 'Cecair yang paling tumpat berada di ____.', isian: 'bawah' },
    { id: 4, tajuk: 'Susunan cecair (2)',  serpihan: 'Cecair yang paling kurang tumpat berada di ____.', isian: 'atas' },
    { id: 5, tajuk: 'Saiz',                serpihan: 'Saiz sahaja ____ menentukan sama ada objek terapung atau tenggelam.', isian: 'tidak' },
    { id: 6, tajuk: 'Kapal dan pelampung', serpihan: 'Kapal dan pelampung terapung kerana keseluruhannya ____ tumpat daripada air.', isian: 'kurang' }
  ],

  /* Galeri: contoh umum jika kunci-jawapan.js tiada (versi awam). */
  galeriUmum: [
    { nama: 'Kayu balak',  nasib: 'atas',  k: 0.6 },
    { nama: 'Bola pantai', nasib: 'atas',  k: 0.1 },
    { nama: 'Paku besi',   nasib: 'dasar', k: 7.8 },
    { nama: 'Batu sungai', nasib: 'dasar', k: 2.6 }
  ],

  tiket: [
    'Sebiji epal yang besar terapung, tetapi sebutir batu kecil tenggelam. Terangkan dengan menggunakan perkataan "tumpat".',
    'Madu lebih tumpat daripada air. Lukis susunan lapisan apabila madu, air dan minyak dituang ke dalam satu cawan.',
    'Kapal diperbuat daripada besi tetapi terapung di laut. Berikan satu sebab.'
  ],

  objekMisteri: ['Epal', 'Telur', 'Ais batu', 'Lilin', 'Span', 'Kunci besi'],
  peraturanRakit: ['Rakit mesti muat 15 klip', 'Rakit mesti muat 20 klip', 'Guna separuh bola plastisin sahaja'],

  gelaran: {
    nakhoda:  { nama: 'Nakhoda Muara',    huraian: 'Bot dengan Bintang Laut paling banyak',
                akses: 'Kuasa: pilih Objek Misteri minggu depan dan bot yang dicabar.' },
    pegawai:  { nama: 'Pegawai Pelabuhan', huraian: 'Bot pertama yang siap dan membantu',
                akses: 'Akses: semak Log Krew bersama guru.' },
    jurutera: { nama: 'Jurutera Rakit',   huraian: 'Rakit paling banyak muat klip',
                akses: 'Kuasa: tetapkan peraturan rakit minggu depan.' },
    penjejak: { nama: 'Penjejak Rahsia',  huraian: 'Menyelesaikan Botol Misteri',
                akses: 'Akses: lihat siluet Objek Misteri minggu depan.' }
  },

  telegramPembukaan: 'KREW KUALA SENYUM STOP BANJIR ROSAKKAN JETI STOP PENDUDUK SEBERANG PERLUKAN BEKALAN STOP SAYA PERLU RAKIT DAN SAUH STOP HANYA MAK TOK JETI TAHU HUKUM MUARA STOP BUKTIKAN KAMU FAHAM RAHSIA AIR STOP KAPTEN HAMZAH',

  pengisytiharan: 'Dengan ini, Mak Tok Jeti menyerahkan Hukum Muara kepada seluruh krew Kuala Senyum. Jeti kita selamat, bekalan sampai ke seberang!',

  /* ---------------- SURAT PETUNJUK (P1 -> P2 -> P3) ----------------
     Semakan kumulatif ada dalam dokumen reka bentuk 6.5.
     Misi 1 P2 ditulis semula atas keputusan guru (QA-011): tiada objek
     misi dinamakan, satu ciri konsep sahaja, tiada contoh selari.
     Misi 2: selepas P3 tinggal 2 susunan munasabah, maka TIADA P4. */
  surat: {
    1: {
      watak: 'Mak Tok Jeti', potret: 'maktok', jenis: 'SURAT DARIPADA MAK TOK JETI',
      p: [
        'Cu, cuba tengok semula objek yang duduk di atas air dan objek yang turun ke dasar. Apa yang sama pada setiap kumpulan objek itu?',
        'Cu, bayangkan dua benda yang sama besar. Satu terasa berat di tangan, satu terasa ringan. Apa yang ada di dalamnya yang membuatkan rasanya berbeza?',
        'Mak Tok pernah nampak kayu balak sebesar lori terapung, tapi paku kecil tenggelam. Lengkapkan: "Objek terapung bukan kerana ia kecil, tetapi kerana jika dibandingkan dengan air, ia ______."'
      ],
      terbuka: 'Kamu sudah ada semua surat Mak Tok. Bincang dengan krew, uji semula jika perlu, dan terangkan dengan ayat sendiri.',
      /* QA-044: P3 dikunci sehingga krew menguji di air (tiada kerang ditolak) */
      kunciP3: 'Mak Tok sedang menulis surat ketiga, cu. Surat itu akan sampai selepas krew menguji objek di dalam air. Uji dahulu, ya!'
    },
    2: {
      watak: 'Pak Din Gerai Sirap', potret: 'pakdin', jenis: 'NOTA DARIPADA PAK DIN',
      p: [
        'Bila air dalam cawan dah duduk diam, apa agaknya yang menentukan siapa duduk di bawah dan siapa di atas?',
        'Pak Din ada dua cawan yang sama penuh, satu sirap dan satu minyak. Angkat kedua-duanya. Mana yang lebih berat?',
        'Masa mak kamu cuci kuali berminyak, minyak itu pergi ke mana dalam air basuhan? Sekarang tinggal satu teka-teki untuk kamu selesaikan sendiri.'
      ],
      terbuka: 'Tuang, perhati, dan terangkan dengan ayat sendiri mengapa setiap cecair duduk di situ.',
      kunciP3: 'Pak Din masih menulis nota ketiga. Nota itu akan sampai selepas krew menuang cecair ke dalam cawan. Tuang dahulu, ya!'
    },
    3: {
      watak: 'Kapten Hamzah', potret: 'kapten', jenis: 'TELEGRAM DARIPADA KAPTEN HAMZAH',
      p: [
        'KREW STOP BAYANGKAN KAMU DALAM SITUASI ITU STOP APA YANG BERLAKU PADA BENDA ITU DAN APA YANG ADA DI DALAMNYA STOP',
        'KREW STOP FIKIRKAN BAHAN ATAU RUANG DI DALAM BENDA ITU STOP JIKA DIMASUKKAN KE BEKAS AIR KAMU TADI KE MANA IA PERGI STOP',
        'KREW STOP LENGKAPKAN "Secara keseluruhan benda ini menjadi ____ tumpat daripada air maka ia ____" STOP'
      ],
      terbuka: 'KREW STOP SEMUA TELEGRAM SUDAH SAMPAI STOP BINCANG DAN TULIS DENGAN AYAT SENDIRI STOP'
    }
  },

  /* ---------------- DIALOG KUCING ----------------
     k: 'oyen' | 'kiko', t: teks (<= ~20 perkataan), e: emosi (pilihan) */
  dialog: {
    mula: [
      { k: 'oyen', t: 'Meow! Jeti rosak, kampung perlukan bekalan. Kita perlukan krew paling hebat!', e: 'gembira' },
      { k: 'kiko', t: 'Aku Kiko, kucing Mak Tok. Mari baca telegram Kapten Hamzah.' }
    ],
    daftar: [
      { k: 'kiko', t: 'Lantik krew setiap bot. Setiap peranan penting.' },
      { k: 'oyen', t: 'Aku nak jadi Penguji! Eh... kucing tak boleh sentuh air. Hehe.' }
    ],
    peta: [
      { k: 'oyen', t: 'Inilah Sungai Muara! Bot kita bergerak bila dapat Bintang Laut.' }
    ],
    m1Taklimat: [
      { k: 'oyen', t: 'Rakit perlu benda yang duduk atas air. Sauh perlu benda yang turun ke dasar. Mana satu? Aku pun nak tahu!', e: 'terfikir' },
      { k: 'kiko', t: 'Setiap ahli ramal sekurang-kurangnya satu objek. Tak sama pendapat? Itu tanda krew yang berfikir.' }
    ],
    m1Uji: [
      { k: 'oyen', t: 'Shhh... aku tengok dari sini. Penguji, perlahan-lahan ya!' }
    ],
    m1Kejutan: [
      { k: 'oyen', t: 'Eh! Ramalan dan keputusan tak sama? Kejutan Lautan! Sebab itulah kita uji.', e: 'terkejut' },
      { k: 'kiko', t: 'Apa yang membuat kamu meramal begitu tadi? Fikirkan.' }
    ],
    m1TiadaKejutan: [
      { k: 'oyen', t: 'Semua ramalan sepadan! Tapi... kenapa ya? Itu misteri seterusnya.', e: 'gembira' }
    ],
    m1Renung: [
      { k: 'oyen', t: 'Dulu aku fikir besar atau kecil yang penting. Sekarang aku pening! Krew, bantu aku fikir.', e: 'terfikir' }
    ],
    kodBelum: [
      { k: 'oyen', t: 'Alamak, huruf-huruf ni bersepah! Aku pun pernah tersusun terbalik. Jom cuba lagi!', e: 'sedih-semangat' },
      { k: 'kiko', t: 'Ambil masa. Semak rekod ujian kamu satu demi satu.' }
    ],
    kodBelumM2: [
      { k: 'oyen', t: 'Alamak, warna-warna ni belum tersusun! Aku pun pernah keliru. Jom cuba lagi!', e: 'sedih-semangat' },
      { k: 'kiko', t: 'Lihat semula menara krew kamu, dari bawah ke atas.' }
    ],
    kodDiterima: [
      { k: 'kiko', t: 'Kod diterima. Tunjukkan ayat penjelasan kamu kepada Pegawai Pelabuhan.', e: 'gembira' }
    ],
    cubaan3: [
      { k: 'kiko', t: 'Tiga cubaan! Pelaut hebat tak berputus asa. Mahu surat daripada Mak Tok?' }
    ],
    cubaan3M2: [
      { k: 'kiko', t: 'Tiga cubaan! Pelaut hebat tak berputus asa. Mahu nota daripada Pak Din?' }
    ],
    m2Taklimat: [
      { k: 'oyen', t: 'Tiga cecair, satu cawan! Pekat? Berat? Yang dituang dulu? Aku keliru apa yang menentukan tempat duduk!', e: 'terfikir' },
      { k: 'kiko', t: 'Susun ramalan krew dahulu. Selepas itu, tuang perlahan-lahan mengikut dinding cawan.' }
    ],
    m2Uji: [
      { k: 'oyen', t: 'Perlahan... perlahan... aku tahan nafas ni!' }
    ],
    m2Rekod: [
      { k: 'kiko', t: 'Lukis menara kamu dalam log. Kemudian, terangkan mengapa setiap cecair duduk di situ.' }
    ],
    m3Taklimat: [
      { k: 'oyen', t: 'Kapten hantar misteri dunia sebenar! Aku harap ada pasal ikan.', e: 'gembira' },
      { k: 'kiko', t: 'Tulis dengan ayat krew sendiri. Gunakan apa yang air ajar tadi.' }
    ],
    m3Jelaskan: [
      { k: 'kiko', t: 'Tulis dengan ayat krew sendiri. Gunakan apa yang air ajar tadi.' }
    ],
    bantu: [
      { k: 'kiko', t: 'Bot kamu laju! Peraturan jeti: bantu satu bot lain dahulu. Tanya soalan, jangan beri jawapan.' },
      { k: 'oyen', t: 'Peti Bonus berantai... tapi rantai itu putus bila kamu menolong!' }
    ],
    bonusBuka: [
      { k: 'oyen', t: 'Rantai putus! Jom bina rakit plastisin paling hebat!', e: 'gembira' }
    ],
    botol: [
      { k: 'oyen', t: 'Limau yang sama, nasib berbeza?! Misteri!', e: 'terkejut' },
      { k: 'kiko', t: 'Tulis jawapan krew dalam log, kemudian tunjukkan kepada guru.' }
    ],
    peti: [
      { k: 'oyen', t: 'Berat betul peti ni! Satu bot tak boleh angkat, semua bot kena tolong!' }
    ],
    petiBuka: [
      { k: 'kiko', t: 'Hukum Muara milik seluruh krew Kuala Senyum.', e: 'gembira' }
    ],
    galeri: [
      { k: 'kiko', t: 'Inilah Hukum Muara dalam gambar. Bandingkan dengan apa yang krew temui tadi.' }
    ],
    upacara: [
      { k: 'oyen', t: 'Sorakan ombak! Dari kiri ke kanan!', e: 'meraikan' }
    ],
    kemenangan: [
      { k: 'oyen', t: 'Pusingan kemenangan! Kejar aku, Kiko!', e: 'gembira' }
    ],
    tiket: [
      { k: 'kiko', t: 'Jawab sendiri di atas kertas. Tunjukkan apa yang kamu faham.' }
    ],
    cop: [
      { k: 'oyen', t: 'Cop Pelabuhan! Hebat, krew!', e: 'gembira' }
    ],
    belumLagi: [
      { k: 'oyen', t: 'Sikit lagi! Jom tambah satu sebab.', e: 'sedih-semangat' }
    ],
    hadBelaiOyen: [ { k: 'oyen', t: 'Hehe, cukup dulu! Jom fokus pada misi.' } ],
    hadBelaiKiko: [ { k: 'kiko', t: 'Prrr... nanti kita main lagi. Misi dulu.' } ]
  },

  teksSistem: {
    kodBelum: 'Ombak belum tenang. Kod belum terbentuk. Semak semula rekod krew.',
    kodKosong: 'Isi kedua-dua kod dahulu.',
    cubaan3: 'Tiga cubaan! Pelaut hebat tak berputus asa. Mahu surat daripada Mak Tok?',
    cubaan3M2: 'Tiga cubaan! Pelaut hebat tak berputus asa. Mahu nota daripada Pak Din?',
    bukaKerang: 'Buka Kerang Petunjuk',
    kejutan: 'Kejutan Lautan! Penemuan baharu untuk krew.',
    belumLagi: 'Pegawai Pelabuhan mahu dengar lebih lanjut. Tambah satu sebab lagi.',
    kodTiada: 'Kod misi belum ditetapkan. Minta guru tetapkan dalam Panel Guru (tab Kunci).',
    pgBelumSedia: 'Panel Guru belum disediakan pada peranti ini.',
    hadiahDihantar: 'Terima kasih! Cikgu akan sahkan bantuan kamu. Kerang sudah sampai kepada Bot {sasaran}.',
    hadiahMenunggu: 'Hadiah kepada Bot {sasaran} sedang menunggu Cikgu sahkan. Kerang tetap dihantar.',
    simpanGagal: 'Data tidak dapat disimpan dalam pelayar ini. Beritahu guru.'
  },

  /* ---------------- TEKS SKRIN (arahan & mesej murid) ----------------
     **teks** = huruf tebal. Tiada jawapan atau nasib objek di sini. */
  teksSkrin: {
    kembaliJeti: 'Kembali ke Jeti',
    /* ---- Umum (pusingan 4, QA-035 baki) ---- */
    tutup: 'Tutup',
    batal: 'Batal',
    ahli: 'Ahli {n}',
    siapa: 'Siapa?',
    botSendiri: 'Bot sendiri',
    belumDibuka: 'Belum dibuka',
    kerangPetunjuk: 'Kerang Petunjuk',
    /* ---- Label pembaca skrin, title & toast (sesi 5, QA-035 baki). Tajuk misi h1
       dibaca daripada fasa[].nama di atas. ---- */
    klipKurang: 'Kurang satu',
    klipTambah: 'Tambah satu',
    titikKodTitle: 'Warna disembunyikan sebagai titik',
    mejaObjekLabel: 'Objek di atas meja',
    dulangKadLabel: 'Dulang kad',
    dulangCecairLabel: 'Dulang cecair',
    menaraPemerhatianLabel: 'Menara pemerhatian krew',
    locengToast: 'Loceng jeti!',
    /* ---- Surat / Beg Surat ---- */
    suratTabMisi: 'Misi {n}',
    suratBeg: 'Beg Surat',
    suratTahap: 'Petunjuk {n} daripada 3',
    suratKembaliBeg: 'Kembali ke Beg Surat',
    suratSudahDibuka: 'Surat yang sudah dibuka (baca semula percuma):',
    suratBaca: 'Baca Petunjuk {n}',
    suratTiada: 'Belum ada surat untuk misi ini.',
    suratTebus: 'Tebus 1 Kerang: Petunjuk {n}',
    suratKerangHabis: 'Kerang sudah habis. Minta bot lain hadiahkan kerang, atau bincang semula dengan krew.',
    suratHadiah: 'Hadiahkan Kerang ke Bot Lain',
    suratDibawa: 'Kiko sedang membawa surat...',
    suratUntukBot: 'Surat untuk Bot {bot}!',
    pilihHadiah: 'Hadiahkan 1 kerang kepada bot mana?',
    /* ---- Peta Jeti ---- */
    petaFasa: { misi: 'Taklimat Misi {n}', peti: 'Peti Mak Tok', galeri: 'Galeri Hukum Muara', upacara: 'Upacara Jeti', tiket: 'Tiket Keluar', daftar: 'Lantik Krew' },
    petaKod: 'Misi Bot / Masuk Kod',
    petaDibantu: 'Kami Dibantu!',
    petaBonus: 'Peti Bonus',
    petaBotol: 'Botol Misteri',
    petaBeratur: 'Beratur di Jeti',
    pilihBotKod: 'Bot mana?',
    pilihBotKerang: 'Kerang Petunjuk untuk bot mana?',
    pilihDibantu: 'Bot mana yang TELAH DIBANTU?',
    pilihPenolong: 'Siapa yang MEMBANTU Bot {bot}?',
    dibantuToast: 'Terima kasih! Pegawai Pelabuhan akan mengesahkan Cop Penolong untuk Bot {bot}.',
    pilihBotBonus: 'Peti Bonus bot mana?',
    pilihBotBotol: 'Botol Misteri: bot mana?',
    selepasCopM1: 'Selepas Cop Misi 1',
    pilihBotBeratur: 'Bot mana mahu beratur?',
    sudahBeratur: 'Sudah beratur',
    bintangSr: '{n} Bintang Laut',
    barisanJeti: 'Barisan Jeti',
    barisanKosong: 'kosong',
    labelJeti: 'JETI',
    labelSeberang: 'SEBERANG',
    /* ---- Daftar Krew ---- */
    daftarTajuk: 'Lantik Krew',
    daftarKePeta: 'Ke Peta Jeti',
    daftarSub: 'Setiap bot ada 5 peranan. Tiada nama murid disimpan, hanya Ahli 1 hingga 5.',
    daftarSudah: 'Krew sudah dilantik',
    daftarBelum: 'Belum dilantik',
    daftarUbah: 'Ubah',
    daftarLantik: 'Lantik Krew',
    daftarSuratTajuk: 'Surat Lantikan Krew',
    daftarNota: 'Penguji boleh bertukar setiap misi supaya adil.',
    daftarTandatangan: 'Tandatangani Surat Lantikan',
    daftarToast: 'Krew {bot} dilantik!',
    /* ---- Misi 1-3 (label & butang) ---- */
    modUjiTajuk: 'MOD UJI',
    selesaiUji: 'Selesai Uji',
    angkatBendera: 'Angkat Bendera Uji',
    labelKodAtas: 'Kod Atas Air',
    labelKodDasar: 'Kod Dasar Sungai',
    hantarKod: 'Hantar Kod',
    padam: 'Padam',
    zonAtas: 'ATAS AIR',
    zonDasar: 'DASAR SUNGAI',
    kunciRamalan: 'Kunci Ramalan, Angkat Bendera Uji',
    terapung: 'Terapung',
    tenggelam: 'Tenggelam',
    simpanRekod: 'Simpan Rekod',
    kejutanBilangan: '{n} Kejutan Lautan = {n} penemuan baharu!',
    semuaSepadan: 'Semua ramalan sepadan!',
    hurufAtas: 'Huruf objek ATAS AIR',
    hurufDasar: 'Huruf objek DASAR SUNGAI',
    ubahRekod: 'Ubah Rekod',
    statusBot: 'Status Bot {bot}',
    statusKodYa: 'Kod: Diterima',
    statusKodBelum: 'Kod: Belum',
    statusCopAda: 'Cop Pelabuhan: Ada',
    statusCopMenunggu: 'Cop Pelabuhan: Menunggu Pegawai Pelabuhan',
    statusSerpihanYa: 'Serpihan Hukum Muara: Ada',
    statusSerpihanBelum: 'Serpihan Hukum Muara: Belum',
    statusKerang: 'Kerang:',
    ringkasCop: 'Cop diterima',
    ringkasKod: 'Kod diterima',
    ringkasBelum: 'Belum siap',
    pilihMisi: 'Pilih misi',
    ramalanKami: 'RAMALAN KAMI',
    pemerhatianKami: 'PEMERHATIAN KAMI',
    simpanPemerhatian: 'Simpan Pemerhatian',
    menaraPemerhatian: 'Menara Pemerhatian Krew',
    bukaKadSituasi: 'Buka Kad Situasi Bot',
    pilihBotSituasi: 'Kad Situasi bot mana?',
    kadSituasi: 'KAD SITUASI',
    ketikBuka: 'Ketik untuk buka',
    /* ---- Skrin Mula ---- */
    mulaTajuk: 'Misi Jeti Kuala Senyum',
    mulaSub: 'Sains Tahun 4: Ketumpatan',
    mulaPilihMod: 'Pilih mod',
    mulaModProjektor: 'Mod Projektor',
    mulaModTablet: 'Mod Tablet (1 bot)',
    mulaModSemasa: 'Mod semasa:',
    mulaNamaProjektor: 'Projektor',
    mulaNamaTablet: 'Tablet',
    mulaTelegram: 'TELEGRAM',
    mulaKeDaftar: 'Lantik Krew',
    mulaPilihBotTablet: 'Tablet ini untuk bot mana?',
    /* ---- Botol Misteri ---- */
    botolTajukPendek: 'Botol Misteri',
    botolTajukPenuh: 'Botol Misteri Mak Tok',
    langkahM1: ['Ramal', 'Uji', 'Rekod', 'Kod'],
    langkahM2: ['Ramal', 'Tuang', 'Rekod', 'Kod'],
    upacaraToast: '{gelaran}: Bot {bot}!',
    botolBelumTetap: 'Kata rahsia belum ditetapkan. Minta guru tetapkan dalam Panel Guru (tab Kunci).',
    botolLabel: 'Kata rahsia',
    botolBuka: 'Buka',
    limauBerkulit: 'Limau berkulit',
    limauTanpaKulit: 'Limau tanpa kulit',
    penjejakLulus: 'Penjejak Rahsia: Diluluskan!',
    penjejakMenunggu: 'Penjejak Rahsia: Menunggu guru',
    /* ---- Peti Mak Tok ---- */
    petiTajuk: 'Peti Mak Tok: Hukum Muara',
    petiSub: 'Perlukan SEMUA 6 bot.',
    petiBuka: 'Buka Peti!',
    petiKeGaleri: 'Galeri Hukum Muara',
    petiCipDiletak: 'serpihan sudah diletak',
    petiCipSedia: 'serpihan sedia, ketik untuk papar',
    petiCipMenunggu: 'menunggu serpihan',
    petiSemuaDiletak: 'Semua serpihan sudah diletak.',
    petiMenungguSerpihan: 'Menunggu serpihan daripada bot lain.',
    /* ---- Galeri ---- */
    galeriTajuk: 'Galeri Hukum Muara',
    galeriTabBekas: 'Bekas Air',
    galeriTabMenara: 'Menara Cecair',
    galeriTabTimbangan: 'Timbangan Muara',
    galeriTerkunci: 'Galeri dibuka selepas Peti Mak Tok dibuka oleh seluruh krew.',
    galeriKePeti: 'Ke Peti Mak Tok',
    galeriKeUpacara: 'Ke Upacara Jeti',
    galeriBekasLabel: 'Bekas air: objek terapung di permukaan, objek tenggelam di dasar',
    galeriContohUmum: 'Contoh umum dipaparkan.',
    galeriMenaraTiada: 'Menara sebenar dipaparkan apabila kunci jawapan tersedia pada komputer guru. Rujuk lukisan menara dalam Log Krew.',
    galeriMenaraLabel: 'Menara tiga lapisan cecair',
    galeriTimbanganLabel: 'Timbangan: {objek} lawan air sama saiz',
    galeriTimbanganArahan: 'Bandingkan setiap objek dengan **blok air yang sama saiz**. Pilih objek:',
    galeriAnggaran: '(anggaran {k} g/cm³, air = 1)',
    galeriTimbangBerat: '{objek} lebih berat daripada air yang **sama saiz**: ia **lebih tumpat** daripada air, jadi ia tenggelam.',
    galeriTimbangRingan: '{objek} lebih ringan daripada air yang **sama saiz**: ia **kurang tumpat** daripada air, jadi ia terapung.',
    galeriTiadaObjek: 'Tiada objek.',
    /* ---- Upacara ---- */
    upacaraTajuk: 'Upacara Jeti',
    upacaraSkrol: 'PENGISYTIHARAN MAK TOK JETI',
    upacaraSorotanKosong: 'Gelaran akan diumumkan satu demi satu.',
    upacaraTiadaGelaran: 'Gelaran belum ditetapkan. Pegawai Pelabuhan boleh menetapkannya dalam Panel Guru (tab Gelaran).',
    upacaraLoceng: 'Bunyikan Loceng Jeti',
    upacaraUmum: 'Umumkan Gelaran',
    upacaraTerus: 'Teruskan',
    upacaraMenang: 'Pusingan Kemenangan!',
    upacaraKeTiket: 'Ke Tiket Keluar',
    upacaraKuasaTajuk: 'Kuasa untuk minggu depan',
    upacaraTiadaKuasa: 'Tiada kuasa untuk dipilih kali ini.',
    upacaraPilihObjek: 'Pilih Objek Misteri:',
    upacaraBotDicabar: 'Bot yang dicabar:',
    upacaraPilihRakit: 'Pilih peraturan rakit:',
    upacaraSimpanKuasa: 'Simpan Pilihan Kuasa',
    upacaraKuasaDisimpan: 'Pilihan kuasa disimpan untuk sesi seterusnya!',
    /* ---- Tiket Keluar ---- */
    tiketTajuk: 'Tiket Keluar',
    tiketSub: 'Jawab sendiri di atas kertas. Tiada jawapan ditaip di skrin.',
    tiketSebelum: 'Soalan sebelum',
    tiketSeterusnya: 'Soalan seterusnya',
    tiketNo: 'SOALAN {n} DARIPADA {jumlah}',
    terkunciTajuk: 'Misi {n} belum dibuka',
    terkunciTeks: 'Tunggu arahan Pegawai Pelabuhan.',
    kodDiterimaTajuk: 'Kod diterima!',
    kodDiterimaTeks: 'Tunjukkan ayat penjelasan dalam Log Krew kepada Pegawai Pelabuhan untuk mendapat Cop.',
    modUjiTeks: 'Penguji sahaja yang sentuh air. Perlahan-lahan.',
    modUjiM1: 'Tolak setiap objek ke bawah air dengan jari, kemudian lepaskan. Lihat ke mana ia pergi.',
    petiKodM1Tajuk: 'Peti Kod: Misi 1',
    petiKodM1Nota: 'Huruf disembunyikan supaya bot lain tidak nampak.',
    petiKodM2Tajuk: 'Peti Kod: Misi 2',
    petiKodM2Arahan: 'Ketik warna menara krew, **dari bawah ke atas**.',
    misi1Arahan: [
      'Setiap ahli **ramal** sekurang-kurangnya satu objek dalam Log Krew.',
      'Kapten angkat **Bendera Uji**.',
      'Penguji uji **satu demi satu**: tolak objek ke bawah air, kemudian **lepaskan**.',
      'Selak kad, susun huruf menjadi **kod**.',
      'Juruhubung bawa kod ke **Jeti Guru**.'
    ],
    misi1Ramal: 'Seret setiap kad ke tikar mengikut **ramalan** krew. Ketik "Siapa?" untuk tanda ahli yang meramal.',
    misi1Rekod: 'Rekod apa yang krew **LIHAT** dalam air, bukan ramalan. Ingat: tolak objek ke bawah air, kemudian lepaskan.',
    misi2Arahan: [
      'Krew **ramal** susunan lapisan dengan kad warna.',
      'Kapten angkat **Bendera Uji**.',
      'Penguji **tuang perlahan-lahan** mengikut dinding cawan, ikut urutan pada kad Pak Din.',
      '**Lukis** menara dalam Log Krew.',
      'Kod = warna **dari bawah ke atas**. Bawa ke Jeti Guru.'
    ],
    misi2Ramal: 'Seret blok cecair ke cawan mengikut **ramalan** krew.',
    misi2Rekod: 'Seret blok cecair mengikut apa yang krew **LIHAT** dalam cawan.',
    misi3Telegram: 'KREW STOP SETIAP BOT TERIMA DUA KAD SITUASI DUNIA SEBENAR STOP TERANGKAN DENGAN AYAT SENDIRI DALAM LOG KREW STOP GUNA PERKATAAN TUMPAT STOP TUNJUK KEPADA PEGAWAI PELABUHAN STOP',
    misi3Arahan: 'Tulis penjelasan dalam **Log Krew** dengan ayat sendiri. Gunakan perkataan **"tumpat"**. Tunjukkan kepada Pegawai Pelabuhan.',
    bonusTajukBantu: 'Peraturan Jeti: Bantu Dahulu',
    bonusArahanBantu: [
      'Hantar Juruhubung untuk membantu **satu bot lain**.',
      'Tanya soalan sahaja, **jangan beri jawapan**. Jangan sentuh bahan bot lain.',
      'Bot yang dibantu tekan **"Kami Dibantu!"** di Peta Jeti.',
      'Atau hadiahkan satu **Kerang Petunjuk** kepada bot lain. Cikgu akan sahkan bantuan kamu.'
    ],
    bonusTajukRakit: 'Cabaran Rakit',
    bonusArahanRakit: [
      'Ambil satu bola plastisin. Uji: adakah ia terapung?',
      'Bentukkan menjadi **rakit** tanpa menambah bahan lain.',
      'Masukkan klip kertas satu demi satu. Berapa klip sebelum rakit tenggelam?'
    ],
    bonusLabelKlip: 'Bilangan klip',
    bonusSimpan: 'Hantar kepada Cikgu',
    bonusMenunggu: 'Rekod kamu: {n} klip. Menunggu Cikgu sahkan.',
    bonusDisahkan: 'Rekod disahkan: {n} klip.',
    bonusToast: 'Rekod rakit Bot {bot}: {n} klip. Cikgu akan sahkan.',
    bonusPapan: 'Papan Rakit',
    bonusPapanKosong: 'Belum ada rekod yang disahkan.',
    botolTerkunci: 'Laluan rahsia ini dibuka selepas Cop Misi 1.',
    botolCari: 'Cari **Gulungan Rahsia** di bawah bekas air krew. Tulis kata rahsianya di sini.',
    botolSalah: 'Belum tepat. Baca semula Gulungan Rahsia dengan teliti.',
    botolTajuk: 'Limau yang sama, nasib berbeza. Mengapa?',
    botolTeks: 'Bincang dengan krew. Tulis jawapan dalam Log Krew, kemudian tunjukkan kepada guru.',
    botolSiluet: 'Akses Penjejak Rahsia: inilah siluet Objek Misteri minggu depan. Apa agaknya?',
    petiSeret: 'Seret serpihan ke tempat yang betul.',
    petiSebut: 'Sebut perkataan yang hilang dengan lantang. Pegawai Pelabuhan akan mengisinya.',
    petiBelumPadan: 'Belum padan. Baca semula serpihan.',
    galeriBekasTajuk: 'Apa yang air tunjukkan',
    galeriBekas: [
      'Objek yang **kurang tumpat** daripada air **terapung**.',
      'Objek yang **lebih tumpat** daripada air **tenggelam**.',
      'Saiz sahaja **tidak** menentukan.'
    ],
    galeriMenaraTajuk: 'Menara Pak Din',
    galeriMenara: [
      'Cecair **paling tumpat** duduk di **bawah**.',
      'Cecair **paling kurang tumpat** duduk di **atas**.',
      'Yang menentukan ialah ketumpatan, bukan "pekat" atau cecair yang dituang dahulu.'
    ]
  }
};
