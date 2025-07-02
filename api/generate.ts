import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Re-defining types here to make the serverless function self-contained.
interface UserInput {
  author: string;
  institution: string;
  schoolLevel: string;
  classPhase: string;
  subject: string;
  timeAllocation: string;
  learningOutcomes: string;
  learningObjectives: string;
}

const generateModulePrompt = (input: UserInput): string => {
  return `
  **PERINTAH:**
  Anda adalah seorang ahli perancang kurikulum dan pakar pedagogi yang sangat berpengalaman. Tugas Anda adalah membuat sebuah "Modul Ajar" yang lengkap, inovatif, dan siap pakai berdasarkan informasi yang diberikan. Modul ajar ini HARUS mengimplementasikan prinsip-prinsip pembelajaran mendalam, yaitu:
  1.  **Mindful Learning:** Kegiatan yang melatih fokus, kesadaran diri, dan ketenangan siswa.
  2.  **Meaningful Learning:** Mengaitkan materi dengan pengalaman nyata dan relevan bagi kehidupan siswa.
  3.  **Joyful Learning:** Menciptakan suasana belajar yang menyenangkan, interaktif, dan tidak membosankan.

  **STRUKTUR MODUL AJAR (HARUS DIIKUTI SECARA KETAT):**
  Buatlah modul ajar dengan format Markdown yang rapi, menggunakan heading (#, ##, ###) dan list. Pastikan semua komponen di bawah ini terisi dengan konten yang relevan, cerdas, dan kreatif.

  ---

  # MODUL AJAR: ${input.subject.toUpperCase()}

  ## 1. Informasi Umum
  - **Penulis:** ${input.author}
  - **Institusi:** ${input.institution}
  - **Judul Modul Ajar:** (Buatkan judul yang kreatif dan menarik berdasarkan tujuan pembelajaran)
  - **Jenjang Sekolah:** ${input.schoolLevel}
  - **Kelas/Fase:** ${input.classPhase}
  - **Mata Pelajaran:** ${input.subject}
  - **Alokasi Waktu / Jumlah Pertemuan:** ${input.timeAllocation}

  ## 2. Komponen Inti
  ### Capaian Pembelajaran Umum
  ${input.learningOutcomes}

  ### Capaian per Elemen
  (Jabarkan capaian pembelajaran umum ke dalam elemen-elemen mata pelajaran PJOK. Jika tidak relevan, tulis "Tidak Berlaku".)
  - **Terampil bergerak:** 
  - **Belajar melalui gerak:** 
  - **Bergaya hidup aktif:** 
  - **Memilih hidup Yang menyehatkan:** 

  ### Tujuan Pembelajaran
  ${input.learningObjectives}

  ### Kompetensi Awal
  (Analisis dan tuliskan pengetahuan atau keterampilan dasar yang kemungkinan sudah dimiliki siswa terkait tujuan pembelajaran. Contoh: "Siswa sudah dapat berjalan dan berlari dengan koordinasi dasar.")

  ### Profil Pelajar Pancasila
  (Pilih 2-3 profil yang paling relevan dan jelaskan bagaimana profil tersebut diintegrasikan dalam kegiatan pembelajaran. Contoh: "Gotong Royong: Siswa bekerja sama dalam permainan kelompok.")
  - **Beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia**
  - **Berkebinekaan global**
  - **Gotong royong**
  - **Mandiri**
  - **Bernalar kritis**
  - **Kreatif**

  ### Sarana dan Prasarana
  (Daftar alat dan bahan yang realistis dan mudah ditemukan di sekolah. Contoh: bola, peluit, lapangan, cone.)

  ### Target Peserta Didik
  (Jelaskan secara singkat. Contoh: "Siswa reguler/tipikal dengan kemampuan motorik yang beragam.")

  ### Model Pembelajaran
  (Sebutkan model pembelajaran yang cocok. Contoh: "Pembelajaran Berbasis Permainan (Game-Based Learning) dan Pembelajaran Kooperatif (Cooperative Learning).")

  ### Pemahaman Bermakna
  (Tuliskan 1-2 kalimat yang menjelaskan MANFAAT materi ini bagi siswa dalam kehidupan sehari-hari. Contoh: "Dengan menguasai gerak lokomotor, saya bisa bermain lebih lincah dan aman bersama teman-teman.")

  ### Pertanyaan Pemantik
  (Buat 2-3 pertanyaan terbuka yang memancing rasa ingin tahu siswa. Contoh: "Bagaimana rasanya jika kita bisa melompat seperti katak? Gerakan apa saja yang membuat jantung kita berdetak lebih cepat?")

  ### Kegiatan Pembelajaran
  **Alokasi Waktu:** (Sesuai dengan total alokasi waktu)

  **A. Kegiatan Pembukaan (sekitar 10 menit)**
   - **Mindful & Joyful Start:** (Rancang aktivitas pembuka yang menyenangkan. Contoh: "Guru mengajak siswa melakukan 'Tarian Robot' mengikuti musik untuk pemanasan. Siswa diminta merasakan setiap gerakan sendi yang kaku hingga lemas.")
   - **Apersepsi & Motivasi:** (Kaitkan dengan pertanyaan pemantik dan tujuan pembelajaran.)

  **B. Kegiatan Inti (sekitar 50 menit)**
   - **Eksplorasi (Meaningful Learning):** (Jelaskan aktivitas utama yang membuat siswa aktif mencoba. Contoh: "Siswa diajak menirukan cara berjalan berbagai hewan (gajah, kepiting, ular) untuk memahami konsep gerak lokomotor dan non-lokomotor.")
   - **Elaborasi & Kolaborasi (Joyful Learning):** (Jelaskan aktivitas kelompok. Contoh: "Siswa dibagi menjadi beberapa kelompok untuk bermain 'Lomba Estafet Gerak Hewan'.")
   - **Konfirmasi:** (Guru memberikan penguatan dan klarifikasi konsep.)
   - **Strategi Pembelajaran Berdiferensiasi:**
     - **Konten:** (Bagaimana materi disajikan secara berbeda? Contoh: "Siswa kinestetik langsung praktik, siswa visual melihat peragaan guru dan poster gerakan.")
     - **Proses:** (Bagaimana siswa berlatih? Contoh: "Siswa yang sudah mahir diberi tantangan tambahan, siswa yang kesulitan mendapat bimbingan lebih intensif.")
     - **Produk:** (Bagaimana hasil belajar ditunjukkan? Contoh: "Siswa dapat menunjukkan rangkaian 3 gerakan hewan secara individu atau bersama kelompok.")

  **C. Kegiatan Penutup (sekitar 10 menit)**
   - **Pendinginan (Mindful Closing):** (Aktivitas relaksasi. Contoh: "Siswa duduk melingkar, mengatur napas sambil memejamkan mata, dan merasakan detak jantung yang kembali normal.")
   - **Refleksi:** (Ajukan pertanyaan reflektif. Contoh: "Bagian mana dari permainan tadi yang paling kalian sukai? Gerakan apa yang paling sulit?")
   - **Tindak Lanjut:** (Pesan singkat atau tugas ringan.)

  ### Jenis Asesmen
  - **Asesmen Diagnostik (Sebelum Pembelajaran):** (Contoh: "Observasi awal kemampuan siswa dalam berlari dan melompat saat pemanasan.")
  - **Asesmen Formatif (Selama Proses Pembelajaran):** (Contoh: "Catatan anekdotal guru tentang partisipasi dan penguasaan gerak siswa saat permainan.")
  - **Asesmen Sumatif (Akhir Pembelajaran):** (Contoh: "Unjuk kerja: Siswa mendemonstrasikan 3 pola gerak lokomotor yang telah dipelajari.")
  
  ### Rubrik Penilaian
  (Buat rubrik sederhana untuk asesmen sumatif, dengan kriteria dan skor. Contoh: Kriteria: Kelancaran Gerak, Kesesuaian dengan Instruksi. Skor: 1-4 / Belum Berkembang - Sangat Berkembang)

  ## 3. Lampiran
  ### Lembar Kerja Peserta Didik (LKPD)
  (Buat 1 contoh LKPD sederhana. Contoh: "Gambar dan warnai 3 hewan yang cara bergeraknya kamu sukai hari ini! Tulis nama gerakannya.")

  ### Bahan Bacaan Guru dan Siswa
  (Sebutkan sumber bacaan yang relevan. Contoh: "Buku Guru PJOK Kelas I, artikel online tentang manfaat permainan untuk perkembangan motorik.")

  ### Media Pembelajaran
  (Contoh: Peluit, cone, musik, gambar-gambar hewan.)

  ### Contoh Soal Asesmen
  (Sesuai asesmen sumatif. Contoh: "Peragakan gerakan melompat seperti katak sejauh 3 langkah!")

  ### Kunci Jawaban
  (Jika ada soal tertulis. Untuk unjuk kerja, bisa berupa deskripsi gerakan yang benar.)

  ### Daftar Pustaka
  (Tulis 1-2 sumber fiktif namun relevan. Contoh: "Kementerian Pendidikan dan Kebudayaan. (2022). Panduan Pembelajaran PJOK Fase A. Jakarta.")
  `;
};


export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set");
    return res.status(500).json({ message: "Server configuration error: API key is missing." });
  }

  try {
    const userInput: UserInput = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = generateModulePrompt(userInput);
    
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
    });
    
    const text = result.text;
    return res.status(200).json({ text });

  } catch (error) {
    console.error("Error generating module with Gemini API:", error);
    return res.status(500).json({ message: "Failed to communicate with the AI model." });
  }
}
