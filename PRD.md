# PRD Website Portofolio Saiynuddin Usman

Oct 20, 2026 · @iyan

## Ringkasan

Website ini adalah portofolio pribadi Saiynuddin Usman yang menampilkan karyanya sebagai fotografer, videografer, desainer grafis, dan editor, dengan dua agency miliknya, Mementa dan 404, sebagai penguat kredibilitas.

Tujuan utamanya: calon klien melihat kualitas karya dalam hitungan detik, memahami layanan yang tersedia, lalu menghubungi lewat satu klik. Website dibangun dengan Vue 3 sebagai single-page application.

**Arah produk (asumsi, belum dikonfirmasi):** personal branding menjadi sorotan utama, sedangkan Mementa dan 404 tampil sebagai pendukung di section khusus dan sebagai penanda pada karya.

## Tujuan dan metrik keberhasilan

Website dianggap berhasil jika pengunjung cepat melihat karya terbaik dan mudah menghubungi Saiynuddin. Angka di bawah adalah target usulan yang bisa disesuaikan.

| Tujuan | Metrik | Target usulan |
| --- | --- | --- |
| Karya terbaik terlihat cepat | Waktu muat halaman utama (LCP) di HP | Di bawah 2,5 detik |
| Website terasa ringan | Skor Lighthouse Performance (mobile) | 90 atau lebih |
| Pengunjung mau menghubungi | Klik tombol kontak (WhatsApp, email, form) | Dilacak sejak hari pertama; target ditetapkan setelah sebulan data |
| Kredibilitas agency terbaca | Klik ke Mementa dan 404 dari section Agencies | Dilacak sejak hari pertama |
| Mudah ditemukan | Muncul saat nama "Saiynuddin Usman" dicari | Halaman utama terindeks di mesin pencari |

## Target pengguna

Pengunjung utama adalah orang yang menilai karya sebelum memutuskan bekerja sama. Persona di bawah adalah usulan awal.

| Persona | Kebutuhan | Yang dicari di website |
| --- | --- | --- |
| Calon klien (brand, UMKM, event) | Memastikan gaya dan kualitas cocok, lalu tahu cara memesan | Karya unggulan, layanan, testimoni, kontak cepat |
| Rekan atau agency lain | Menilai kapasitas dan peluang kolaborasi | Profil Mementa dan 404, riwayat project, tools |
| Calon pemberi kerja atau kolaborator | Melihat keahlian lintas bidang | Halaman About, tools, studi kasus |

## Ruang lingkup versi 1

Versi 1 fokus pada website statis yang cepat, dengan konten dikelola lewat file data, tanpa panel admin.

**Masuk versi 1**

- Landing page dengan section Hero, Selected Works, Kategori Karya, About, Agencies, Services, Testimonials, Contact, Footer
- Halaman galeri untuk Photography, Videography, Graphic Design, dan Editing
- Halaman detail project
- Lightbox foto, embed video, slider before/after
- Filter karya per kategori dan per asal (personal, Mementa, 404)
- Tampilan responsif dan dark mode
- SEO dasar dan pelacakan klik kontak

**Tidak masuk versi 1**

- Panel admin atau CMS
- Toko online dan pembayaran
- Booking online
- Blog
- Dukungan dua bahasa

## Sitemap dan struktur halaman

Website terdiri dari satu landing page berisi section berurutan, ditambah empat halaman galeri dan satu halaman detail project yang dikelola Vue Router.

&#91;embedded content: sitemap · 1 landing page, 4 galeri, 1 detail\]

Landing page menjadi pintu masuk, setiap kategori membuka galerinya sendiri, dan setiap karya bisa dibuka di halaman detail.

## Kebutuhan fungsional

P0 berarti wajib ada saat rilis pertama, P1 berarti menyusul jika waktu cukup.

| Bagian | Kebutuhan | Prioritas |
| --- | --- | --- |
| Navbar | Menu Work, About, Services, Contact; tetap terlihat saat scroll; menu hamburger di HP; toggle dark/light | P0 |
| Hero | Nama, tagline peran, keterangan "Founder of Mementa & 404", satu visual utama (foto, slideshow, atau reel pendek), tombol "Lihat Karya" dan "Hubungi Saya" | P0 |
| Selected Works | 6 sampai 8 karya terbaik lintas bidang, klik membuka detail | P0 |
| Kategori Karya | Empat kartu (Photography, Videography, Graphic Design, Editing) menuju galeri masing-masing | P0 |
| About | Foto, cerita singkat, daftar keahlian dan tools | P0 |
| Agencies | Dua kartu untuk Mementa dan 404 berisi logo, deskripsi singkat, dan tautan eksternal | P0 |
| Services | Daftar layanan dengan deskripsi singkat dan tombol tanya layanan | P0 |
| Testimonials | Kutipan klien dan logo brand yang pernah bekerja sama | P1 |
| Contact | Form (nama, email, pesan), tautan WhatsApp, email, dan sosial media | P0 |
| Footer | Navigasi singkat, sosial media, hak cipta | P0 |
| Galeri foto | Grid masonry, filter, lightbox dengan navigasi keyboard dan geser di HP | P0 |
| Galeri video | Daftar video dengan thumbnail dan embed YouTube atau Vimeo | P0 |
| Galeri desain | Grid karya dengan tautan ke halaman detail | P0 |
| Editing | Slider before/after untuk foto dan reel atau breakdown untuk video | P1 |
| Detail project | Judul, klien, tahun, peran, deskripsi singkat, media, tag asal (personal, Mementa, 404) | P0 |
| Filter asal | Saring karya berdasarkan personal, Mementa, atau 404 | P1 |
| Pelacakan | Catat klik tombol kontak dan tautan agency | P1 |

## Kebutuhan non-fungsional

- **Performa:** gambar memakai format WebP atau AVIF dengan lazy loading; video tidak diunggah ke server sendiri, cukup embed atau klip pendek yang dikompres untuk hero.
- **Responsif:** dirancang mobile first; diuji di lebar HP, tablet, dan laptop.
- **SEO:** judul dan deskripsi per halaman, tag Open Graph untuk pratinjau saat dibagikan, sitemap, dan teks alternatif pada gambar.
- **Aksesibilitas:** kontras warna memadai, navigasi keyboard di menu dan lightbox, hormati pengaturan "kurangi animasi".
- **Keamanan:** form kontak memakai layanan pihak ketiga atau endpoint sendiri dengan perlindungan spam; tidak ada data pribadi pengunjung yang disimpan di website.
- **Hak cipta:** karya klien hanya ditampilkan dengan izin; sertakan watermark atau resolusi terbatas pada foto unggulan.

## Arah desain dan branding

Portofolio visual sebaiknya membiarkan karya yang berbicara, jadi antarmukanya dibuat tenang dan minimal.

- **Gaya:** bersih, banyak ruang kosong, karya sebagai pusat perhatian.
- **Warna:** netral (hitam, putih, abu) dengan satu warna aksen yang bisa diambil dari identitas Saiynuddin; warna aksen untuk Mementa dan 404 hanya dipakai di section Agencies.
- **Tipografi:** satu font untuk judul dan satu untuk teks isi, maksimal dua keluarga font.
- **Animasi:** transisi halus saat scroll dan berpindah halaman; tidak mengganggu pemuatan.
- **Tema:** dark mode dan light mode, mengikuti pengaturan perangkat.
- **Aset yang perlu disiapkan:** logo pribadi, logo Mementa dan 404, foto profil, dan kumpulan karya terbaik beserta keterangannya.

## Arsitektur teknis

Website dibangun sebagai aplikasi Vue 3 statis yang bisa di-hosting gratis atau murah.

| Kebutuhan | Pilihan usulan |
| --- | --- |
| Framework | Vue 3 dengan Vite |
| Routing | Vue Router |
| Styling | Tailwind CSS |
| Animasi | GSAP atau @vueuse/motion |
| Lightbox foto | vue-easy-lightbox |
| SEO per halaman | @unhead/vue |
| Form kontak | Layanan form pihak ketiga atau endpoint serverless |
| Hosting | Netlify, Vercel, atau Cloudflare Pages |

Struktur folder usulan:

```text
src/
  assets/        gambar dan font
  components/    Navbar, Hero, WorkCard, Lightbox, BeforeAfter, ...
  data/          works.json, services.json, agencies.json, testimonials.json
  views/         HomeView, GalleryView, ProjectView, ContactView
  router/        index.js
  App.vue
  main.js
```

## Model data konten

Semua karya disimpan di file JSON supaya menambah karya baru cukup dengan menambah satu entri, tanpa mengubah komponen. Contoh satu entri di works.json:

```json
{
  "id": "proyek-contoh",
  "title": "Judul Karya",
  "category": "photography",
  "origin": "personal",
  "year": 2026,
  "client": "Nama Klien",
  "role": "Fotografer",
  "cover": "/img/proyek-contoh/cover.webp",
  "media": [
    { "type": "image", "src": "/img/proyek-contoh/1.webp", "alt": "Deskripsi gambar" },
    { "type": "video", "provider": "youtube", "id": "ID_VIDEO" }
  ],
  "description": "Deskripsi singkat project.",
  "featured": true
}
```

Nilai category: photography, videography, graphic-design, editing. Nilai origin: personal, mementa, 404.

## Timeline dan milestone

Pengerjaan dibagi menjadi empat fase berurutan, dan setiap fase selesai sebelum fase berikutnya dimulai.

&#91;embedded content: alur pengerjaan · 4 fase\]

Tanggal pasti menunggu keputusan target tayang di bagian pertanyaan terbuka.

## Risiko dan asumsi

| Risiko atau asumsi | Dampak | Penanganan |
| --- | --- | --- |
| Aset (foto, video, logo) belum siap tepat waktu | Pengerjaan tertunda | Kumpulkan dan pilih karya terbaik sebelum mulai membangun galeri |
| File gambar dan video terlalu besar | Website lambat | Kompres ke WebP atau AVIF, embed video dari YouTube atau Vimeo |
| Fokus website (pribadi atau agency) berubah di tengah jalan | Struktur halaman utama harus disusun ulang | Putuskan arah sebelum desain dimulai |
| Izin menampilkan karya klien belum ada | Karya tidak bisa dipublikasikan | Minta izin tertulis atau tampilkan versi terbatas |
| Asumsi: konten dikelola lewat file data, bukan CMS | Setiap perubahan konten perlu edit file dan deploy ulang | Tambahkan CMS ringan di versi berikutnya jika terlalu merepotkan |

## Pertanyaan terbuka

- [ ] Apakah fokus utama website personal branding dengan agency sebagai pendukung, atau agency yang menjadi sorotan utama?
- [ ] Mementa dan 404 bergerak di bidang apa, dan apakah punya identitas visual yang berbeda?
- [ ] Apakah ada warna, font, atau logo yang sudah dipakai dan harus diikuti?
- [ ] Form kontak dikirim ke mana (email atau WhatsApp), dan apakah perlu notifikasi otomatis?
- [ ] Nama domain apa yang akan dipakai?
- [ ] Karya klien mana yang sudah boleh ditampilkan?
- [ ] Kapan target website mulai tayang?
