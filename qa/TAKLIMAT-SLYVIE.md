# Taklimat QA untuk Slyvie: Misi Jeti Kuala Senyum (pusingan 1)

Daripada: Pak Cik (ejen utama). Guru: Cikgu Afiq.

**Aliran kelulusan:**
1. Slyvie menguji.
2. Hanis membaiki sehingga berpuas hati.
3. Pak Cik membuat keputusan akhir.
4. Hasil diserahkan kepada guru.

## Baca dahulu
1. `CLAUDE.md` (project root): seni bina dan peraturan yang tidak boleh dilanggar.
2. `misi-jeti/NOTA-PEMBINAAN.md`:
   - penyimpangan no. 1–21;
   - Bahagian 6, iaitu senarai ujian berisiko daripada Hanis.
3. `reka-bentuk-sistem.md`: spesifikasi dan sumber kebenaran. Rujuk bahagian 1.3, 4.2, 4.3, 5, 6.4–6.5, 7 dan 9.

## Status
- Semua fail sudah ditulis, tetapi **tiada kod pernah dijalankan**. Ini larian pertama.
- Jangka ralat asas, contohnya:
  - susunan skrip;
  - nama global tidak sepadan;
  - kelas CSS tiada.

## Cara menjalankan
```
cd "C:\Users\wmair\OneDrive\Desktop\Claude Code Project\Education Games\misi-jeti"
py -m http.server 8000
```
- Jalankan pelayan di latar belakang dan hentikan apabila selesai.
- Murid: `http://localhost:8000`
- Guru: `http://localhost:8000/#/guru`

## Ujian keutamaan (ikut urutan)

**1. Asap (Blocker)**
- `node --check` setiap fail JS, jika Node ada.
- Setiap fail yang dirujuk dalam `index.html` memulangkan HTTP 200.
- Tiada permintaan ke luar (CDN, fon, analitik).
- Nama global yang dirujuk antara fail benar-benar ditakrifkan, dan susunan `<script>` betul.

**2. Kod misi**
- Cincangan dijana automatik daripada `kunci-jawapan.js`.
- Aplikasi tetap boleh dibuka **tanpa** `kunci-jawapan.js`.
- Tiada kod misi dalam teks biasa di luar `kunci-jawapan.js`.

**3. Peraturan pedagogi.** Grep `js/kandungan.js` dan fail skrin untuk perkara berikut:
- Tiada jawapan, kata akar atau huruf awal jawapan dalam petunjuk atau dialog.
- Tangga P1 → P2 → P3 betul, dan tiada P4 untuk Misi 2.
- Oyen tidak meramal objek atau cecair misi.
- Metrik dan Kunci Jawapan tiada pada skrin murid.
- Tiada bunyi "salah".
- Peti Bonus terkunci sehingga ada Cop Penolong.

**4. Panel Guru**
- PIN.
- Gate "Tunjuk" pada Metrik dan Kunci Jawapan dalam mod Projektor.
- Tirai `T`.
- Segerak antara tetingkap `#/guru` dan projektor (peristiwa `storage`).
- Kemas kini panel tidak memadam teks yang guru sedang taip.

**5. Kucing**
- Had meow dan belai (spesifikasi 4.3.2).
- Senyap semasa Mod Uji, dialog, surat, Tirai dan Panel Guru.
- Main berpasangan dibatalkan oleh peristiwa.
- Mod Ringan dan reduced-motion berfungsi.
- Simbol "?" dan "!" pada Kiko tidak terbalik cermin.

**6. Huru-hara murid**
- Klik bertubi-tubi.
- Muat semula di tengah misi.
- Butang back.
- Seret berulang-ulang.

**7. Susun atur dan kebolehcapaian**
- 1280×720 dan 4:3.
- Saiz teks projektor: Hanis melaporkan ~29 px, sedangkan spesifikasi ≥ 32 px.
- Kontras.
- Papan kekunci dan alternatif ketik-ketik.

**8. Bahasa Melayu**
- Ejaan dan tatabahasa DBP, nada sesuai untuk murid 10 tahun.
- Gunakan **bahasa Melayu Malaysia baku**, tanpa istilah Indonesia. Guru meminta ini secara jelas.

## Had alat
- Jika anda tidak dapat menguji dalam pelayar sebenar (animasi, bunyi, seret), nyatakan dengan jujur apa yang **tidak disahkan**.
- Untuk bahagian itu, sediakan senarai semak manual bernombor untuk Cikgu Afiq.

## Output
- Tulis laporan dalam `qa/laporan-YYYY-MM-DD.md` mengikut format bug dalam definisi ejen anda.
- Pulangkan ringkasan kepada Pak Cik:
  - kiraan lulus/gagal setiap kategori;
  - keputusan (Sedia / Sedia dengan isu kecil / Belum sedia);
  - senarai bug mengikut keterukan.
- **Jangan ubah fail dalam `misi-jeti/`** kecuali `misi-jeti/tests/`.
