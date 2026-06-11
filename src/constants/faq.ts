export const FAQ_DATA = [
  {
    question: "Apa itu SAFRONS?",
    answer: "Smart Agriculture and Fertilizer Recommendation System (SAFRONS) adalah platform sistem informasi geografis analitik spasial pertanian presisi tinggi. Sistem ini memetakan kandungan unsur hara tanah serta menyajikan rekomendasi pemupukan presisi untuk mendukung peningkatan hasil tani secara berkelanjutan."
  },
  {
    question: "Bagaimana cara membaca peta interaktif SAFRONS?",
    answer: "1. Batas wilayah administrasi dan lahan diwakili oleh poligon berwarna pada peta.\n2. Klik pada salah satu poligon untuk membuka panel informasi detail lahan di sebelah kiri layar (atau dari bawah layar pada perangkat seluler).\n3. Anda dapat menggeser peta dengan menyeret kursor atau jari Anda, serta memperbesar dan memperkecil peta menggunakan scroll mouse (pada komputer/laptop) atau gerakan mencubit layar (pada layar sentuh/trackpad)."
  },
  {
    question: "Bagaimana cara mengubah tampilan peta (basemap)?",
    answer: "1. Klik tombol Kontrol Peta (ikon roda gigi/slider pengaturan) yang berada di sudut kanan atas peta interaktif untuk membuka panel Kontrol Peta.\n2. Buka bagian Pilihan Basemap lalu pilih jenis basemap yang Anda inginkan:\n- OpenStreetMap: Menampilkan peta jalan standar, batas administratif, nama wilayah, dan objek penting.\n- Esri World Imagery: Menampilkan citra satelit bumi secara detail untuk melihat vegetasi nyata dan rupa bumi.\n- CartoDB Dark Matter: Menampilkan peta jalan dengan warna gelap yang ramah di mata."
  },
  {
    question: "Bagaimana cara mencari lokasi lahan tertentu di peta?",
    answer: "1. Klik tombol Kontrol Peta (ikon roda gigi/slider pengaturan) di sudut kanan atas peta interaktif untuk membuka panel Kontrol Peta.\n2. Pada kolom Cari Lokasi, ketik nama wilayah atau desa yang ingin Anda cari (khusus area Bogor dan sekitarnya sesuai cakupan data).\n3. Tekan Enter atau klik ikon pencarian. Peta akan otomatis memindahkan fokus dan melakukan zoom ke lokasi tersebut."
  },
  {
    question: "Apa perbedaan dan arti dari status kesesuaian lahan S1, S2, S3, dan N?",
    answer: "Tingkat kesesuaian tanah untuk komoditas tanaman diklasifikasikan menjadi:\n- S1 (Sangat Sesuai): Lahan sangat optimal untuk pertumbuhan tanaman tanpa ada faktor pembatas yang berarti.\n- S2 (Cukup Sesuai): Lahan memiliki sedikit faktor pembatas (seperti tekstur tanah atau kemiringan lereng sedang) yang membutuhkan pengelolaan ringan.\n- S3 (Sesuai Bersyarat): Lahan memiliki faktor pembatas cukup berat, sehingga membutuhkan tindakan perbaikan hara atau pengelolaan khusus agar tanaman dapat berproduksi secara optimal.\n- N (Tidak Sesuai): Lahan memiliki pembatas yang sangat berat atau kritis (seperti lereng yang sangat curam atau keasaman ekstrem) sehingga tidak disarankan untuk budidaya tanaman tersebut."
  },
  {
    question: "Bagaimana cara melihat metrik fisik tanah dan metrik kimia hara lahan?",
    answer: "1. Klik poligon lahan yang ingin Anda periksa di peta.\n2. Pada panel detail informasi lahan, Anda akan melihat:\n- Karakteristik Fisik: Menampilkan kelas kemiringan lereng (dalam persen) dan tekstur tanah (seperti lempung, pasir, atau liat).\n- Kondisi Unsur Hara: Menampilkan nilai kadar hara Nitrogen (N), Fosfor (P), Kalium (K), serta tingkat keasaman tanah (pH)."
  },
  {
    question: "Di mana saya bisa melihat saran pemupukan dan rekomendasi dari pakar?",
    answer: "1. Klik wilayah poligon lahan yang Anda inginkan pada peta.\n2. Di panel informasi, gulir ke bagian paling bawah.\n3. Anda akan menemukan kartu Rekomendasi Pakar yang memuat takaran dosis pupuk (seperti Urea, SP-36, KCl) beserta saran cara aplikasi yang ditulis langsung oleh pakar agronomi tepercaya untuk lahan tersebut."
  },
  {
    question: "Bagaimana cara menyimpan atau menandai wilayah lahan ke akun saya?",
    answer: "1. Pastikan Anda sudah masuk (login) ke akun SAFRONS Anda.\n2. Cari dan klik poligon wilayah lahan yang ingin Anda simpan pada peta.\n3. Klik tombol 'Simpan Lahan Ini' (dengan ikon bookmark) yang terletak di bagian bawah panel detail informasi lahan.\n4. Anda dapat melihat kembali semua daftar lahan yang disimpan kapan saja melalui menu Lahan Tersimpan di bilah navigasi."
  },
  {
    question: "Bagaimana cara mengajukan pendaftaran akun sebagai Pakar (Expert)?",
    answer: "1. Daftarkan akun umum terlebih dahulu melalui halaman Daftar.\n2. Kirim pesan pengajuan peningkatan peran akun ke email resmi kami di admin@safrons.id.\n3. Sertakan informasi akun Anda (nama dan email terdaftar) beserta dokumen bukti kredensial keahlian agronomi, sertifikasi pertanian, atau afiliasi instansi terkait Anda.\n4. Administrator akan meninjau berkas Anda dan mengubah peran akun Anda menjadi Pakar setelah verifikasi berhasil disetujui."
  },
  {
    question: "Apa saja fitur khusus yang didapatkan oleh pengguna dengan peran Pakar (Expert)?",
    answer: "Pengguna dengan peran Pakar yang terverifikasi dapat mengakses Dashboard Pakar untuk:\n- Mengunggah batas area lahan baru menggunakan file dengan format GeoJSON.\n- Mengubah data karakteristik fisik serta metrik unsur hara (N, P, K, pH) pada wilayah lahan terdaftar melalui formulir pengeditan.\n- Menulis, menyunting, dan menerbitkan rekomendasi pemupukan baru yang akan langsung dapat dibaca oleh para petani umum."
  }
];
