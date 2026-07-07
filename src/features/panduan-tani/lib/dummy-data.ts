export interface Uploader {
  name: string;
  avatarUrl?: string;
  role: string;
}

export interface PanduanContent {
  id: string;
  slug: string;
  type: 'artikel' | 'video';
  title: string;
  category: 'limbah' | 'olahan' | 'alat';
  difficulty: 'pemula' | 'menengah';
  imageQuery: string; // keyword for unsplash photo fallback
  imageUrl?: string;  // absolute Unsplash image URL
  youtubeId?: string; // only for videos
  duration: string;   // e.g., "5 menit baca" or "6:32"
  points: number;
  relatedListingSlug: string; // route redirect slug
  content: string; // dummy paragraphs
  uploader: Uploader;
}

export const dummyUploaders: Record<string, Uploader> = {
  ahmad: {
    name: "Ahmad",
    role: "Petani Ahli",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  },
  ebel: {
    name: "Ebel",
    role: "Admin LoopTani",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
  },
  rizky: {
    name: "Rizky",
    role: "Petani Mitra",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80",
  },
};

export const initialPanduanContents: PanduanContent[] = [
  {
    id: "art-1",
    slug: "cara-olah-jerami-briket",
    type: "artikel",
    title: "Cara Mengolah Jerami Padi Menjadi Briket Biomassa Bernilai Tinggi",
    category: "olahan",
    difficulty: "pemula",
    imageQuery: "rice-straw",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80",
    duration: "5 menit baca",
    points: 20,
    relatedListingSlug: "briket-biomassa-jerami",
    uploader: dummyUploaders.ahmad,
    content: `Jerami padi sering kali hanya dibakar setelah masa panen selesai. Padahal, pembakaran jerami menghasilkan polusi udara yang merugikan kesehatan dan lingkungan sekitar. Salah satu solusi terbaik untuk memanfaatkan limbah ini adalah dengan mengolahnya menjadi briket biomassa. Briket dari jerami ini memiliki nilai kalori yang cukup tinggi dan dapat digunakan sebagai bahan bakar alternatif rumah tangga maupun industri kecil.\n\nProses pembuatan briket jerami padi terbilang mudah. Pertama-tama, jerami yang telah dikeringkan harus diarangkan (dikarbonisasi) terlebih dahulu menggunakan drum pembakaran dengan kondisi oksigen minimal. Pengarangan ini bertujuan untuk meningkatkan nilai kalor briket dan meminimalkan asap saat briket digunakan nanti.\n\nSetelah diperoleh arang jerami, haluskan arang tersebut hingga menjadi bubuk kasar. Campurkan bubuk arang jerami dengan perekat alami seperti tepung tapioka (kanji) yang sudah dilarutkan dalam air panas. Perbandingan yang disarankan adalah 90% arang jerami dan 10% perekat tapioka. Aduk adonan hingga merata dan terasa liat.\n\nLangkah terakhir adalah pencetakan. Masukkan adonan ke dalam cetakan briket sederhana (bisa menggunakan pipa paralon bekas atau cetakan besi manual) lalu tekan dengan kuat agar padat. Jemur briket basah di bawah sinar matahari selama 2-3 hari hingga benar-benar kering dan keras. Briket jerami padi siap digunakan sebagai bahan bakar ramah lingkungan!`
  },
  {
    id: "art-2",
    slug: "mengenal-kompos-tkks",
    type: "artikel",
    title: "Mengenal Kompos TKKS (Tandan Kosong Kelapa Sawit) & Manfaat Tanah",
    category: "limbah",
    difficulty: "pemula",
    imageQuery: "compost",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&h=400&q=80",
    duration: "4 menit baca",
    points: 20,
    relatedListingSlug: "pupuk-kompos-tkks-super",
    uploader: dummyUploaders.ebel,
    content: `Tandan Kosong Kelapa Sawit (TKKS) merupakan limbah padat terbesar yang dihasilkan oleh pabrik kelapa sawit. Jika dibiarkan menumpuk, limbah ini dapat menimbulkan bau tidak sedap serta menjadi sarang penyakit bagi tanaman kelapa sawit itu sendiri. Namun, melalui proses pengomposan yang tepat, TKKS dapat diubah menjadi pupuk organik bermutu tinggi yang sangat kaya akan unsur hara kalium.\n\nProses pengomposan TKKS biasanya dikombinasikan dengan limbah cair pabrik kelapa sawit (LCPKS) yang kaya akan nitrogen. Campuran kedua bahan organik ini akan mempercepat proses dekomposi mikroba karena memiliki rasio Karbon (C) dan Nitrogen (N) yang ideal. Bakteri pengurai akan bekerja aktif memecah bahan organik keras dalam TKKS menjadi senyawa tanah yang subur.\n\nManfaat utama penggunaan kompos TKKS adalah untuk memperbaiki struktur fisik tanah, meningkatkan kapasitas menahan air (water holding capacity), serta menyediakan unsur hara makro dan mikro bagi tanaman. Kompos ini sangat cocok diaplikasikan pada tanah berpasir atau lahan marginal yang kekurangan bahan organik aktif.\n\nUntuk menggunakannya, taburkan kompos TKKS secara merata di sekeliling piringan tanaman kelapa sawit atau campurkan ke dalam lubang tanam hortikultura. Dengan memanfaatkan TKKS secara sirkular, biaya pemupukan kimia dapat dipangkas hingga 30%, sekaligus meminimalkan dampak lingkungan negatif pabrik sawit.`
  },
  {
    id: "art-3",
    slug: "servis-mesin-pencacah-rumput",
    type: "artikel",
    title: "Panduan Perawatan Rutin Mesin Pencacah Rumput Petani Mandiri",
    category: "alat",
    difficulty: "menengah",
    imageQuery: "agriculture-waste",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&h=400&q=80",
    duration: "6 menit baca",
    points: 30,
    relatedListingSlug: "mesin-chopper-pakan-multifungsi",
    uploader: dummyUploaders.rizky,
    content: `Mesin pencacah rumput atau chopper pakan ternak adalah investasi penting bagi peternak berskala menengah ke atas. Alat ini mempermudah proses pembuatan pakan silase maupun pencacahan rumput gajah harian. Namun, karena sering berhadapan dengan bahan berserat tinggi dan getah rumput yang lengket, mesin ini memerlukan perawatan ekstra agar kinerjanya tidak cepat menurun.\n\nSalah satu masalah utama yang sering dialami petani adalah pisau pencacah yang tumpul. Pisau yang tumpul akan membuat putaran mesin terasa berat, boros bahan bakar, dan hasil cacahan menjadi tidak merata. Disarankan untuk memeriksa ketajaman pisau setiap 20 jam penggunaan dan mengasahnya secara berkala menggunakan mesin gerinda tangan.\n\nSelain pisau, kebersihan ruang pencacah juga harus diperhatikan. Setiap kali selesai digunakan, bersihkan sisa-sisa rumput dan getah yang menempel pada dinding dalam mesin. Getah rumput yang mengering dan menumpuk dapat mengeras seperti semen, menyumbat saringan, serta memicu karat pada bagian logam sensitif mesin.\n\nJangan lupa untuk secara rutin memeriksa pelumasan pada bearing poros utama dan rantai transmisi motor penggerak. Gunakan gemuk (grease) tahan panas berkuaitas tinggi setiap bulan sekali. Perawatan sederhana dan disiplin ini dapat memperpanjang umur pakai chopper pakan ternak Anda hingga bertahun-tahun lamanya.`
  },
  {
    id: "vid-1",
    slug: "praktik-briket-jerami",
    type: "video",
    title: "Langkah Praktis Membuat Briket Berkualitas dari Jerami Padi",
    category: "olahan",
    difficulty: "pemula",
    imageQuery: "rice-straw",
    youtubeId: "9Kk4Ver3nFE",
    duration: "7:15",
    points: 30,
    relatedListingSlug: "alat-cetak-briket-manual",
    uploader: dummyUploaders.ahmad,
    content: `Video ini mendemonstrasikan langkah demi langkah pembuatan briket biomassa dari jerami padi kering. Tonton detail proses pengarangan tanpa oksigen, penghalusan arang, pencampuran kanji, hingga teknik penekanan cetakan briket buatan sendiri.`
  },
  {
    id: "vid-2",
    slug: "proses-kompos-tkks",
    type: "video",
    title: "Proses Pengomposan Tandan Kosong Kelapa Sawit Secara Cepat",
    category: "limbah",
    difficulty: "pemula",
    imageQuery: "organic-fertilizer",
    youtubeId: "OeqUu_q4Xj4",
    duration: "5:42",
    points: 25,
    relatedListingSlug: "dekomposer-kompos-organik",
    uploader: dummyUploaders.rizky,
    content: `Pelajari rahasia pengomposan cepat limbah padat kelapa sawit (TKKS) menggunakan mikroba aktif. Video ini menunjukkan tata cara tumpukan windrow, penyiraman cairan probiotik, monitoring suhu, serta indikator fisik kompos matang.`
  },
  {
    id: "vid-3",
    slug: "servis-traktor-tangan",
    type: "video",
    title: "Cara Servis Sendiri Traktor Tangan / Hand Tractor yang Mogok",
    category: "alat",
    difficulty: "menengah",
    imageQuery: "rice-field",
    youtubeId: "ZKazVjP4Q1U",
    duration: "8:10",
    points: 40,
    relatedListingSlug: "oli-mesin-diesel-traktor",
    uploader: dummyUploaders.ebel,
    content: `Panduan visual lengkap bagi petani untuk mendiagnosis masalah umum mesin diesel traktor roda dua. Mulai dari membersihkan karburator/injektor, menyetel celah klep, membersihkan filter udara, hingga mengganti oli mesin.`
  }
];
