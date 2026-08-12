import { NoteTemplate } from '../types/note';

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'daily-journal',
    title: 'Jurnal Harian 📖',
    category: 'Journal',
    description: 'Catatan harian untuk merefleksikan aktivitas, rasa syukur, dan target hari ini.',
    icon: 'book-outline',
    content: `# Jurnal Harian - ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

## 🎯 Target Utama Hari Ini
- [ ] 
- [ ] 
- [ ] 

## 💡 Mood & Pikiran
> Bagaimana perasaanmu hari ini? Apa yang sedang kamu pikirkan?

## 🌟 Hal yang Disyukuri Hari Ini
1. 
2. 
3. 

## 📝 Catatan Tambahan
*Tuliskan catatan bebas di sini...*
`,
  },
  {
    id: 'meeting-notes',
    title: 'Catatan Rapat 🤝',
    category: 'Work',
    description: 'Format terstruktur untuk agenda rapat, peserta, pembahasan, dan tindakan (action items).',
    icon: 'people-outline',
    content: `# Catatan Rapat: [Judul Topik Rapat]

**Tanggal:** ${new Date().toLocaleDateString('id-ID')}  
**Waktu:** 10:00 - 11:00  
**Peserta:**  
- Person A  
- Person B  

---

### 📌 Agenda Rapat
1. Pembahasan Progress Sprint
2. Review Desain & Fitur Baru
3. Pembagian Tugas

---

### 💬 Ringkasan Diskusi
* Topik 1: ...
* Topik 2: ...

---

### 🚀 Action Items (Tindak Lanjut)
- [ ] **[PIC]** Kerjakan fitur login
- [ ] **[PIC]** Buat dokumentasi API
- [ ] **[PIC]** Jadwalkan sync minggu depan
`,
  },
  {
    id: 'project-plan',
    title: 'Rencana Proyek 💡',
    category: 'Ideas',
    description: 'Template perancangan ide aplikasi atau proyek baru dari konsep hingga roadmap.',
    icon: 'bulb-outline',
    content: `# 🚀 [Nama Proyek Barumu]

### 🎯 Tujuan & Visi Proyek
Deskripsikan latar belakang dan solusi yang ingin diberikan oleh proyek ini.

---

### 🔥 Fitur Utama (MVP)
* **Fitur 1**: Otentikasi pengguna
* **Fitur 2**: Manajemen data real-time
* **Fitur 3**: Ekspor & impor data

---

### 🛠️ Spesifikasi Teknologi
\`\`\`json
{
  "frontend": "React Native Expo",
  "styling": "CSS / Tailwind",
  "database": "AsyncStorage / Supabase",
  "language": "TypeScript"
}
\`\`\`

---

### 🗓️ Roadmap & Milestones
- [ ] **Fase 1**: Wireframe & Prototyping
- [ ] **Fase 2**: Pengembangan Backend API
- [ ] **Fase 3**: Integrasi UI & Testing
- [ ] **Fase 4**: Release v1.0
`,
  },
  {
    id: 'code-snippet',
    title: 'Code Snippet 💻',
    category: 'Code',
    description: 'Simpan potongan kode penting lengkap dengan penjelasan dan contoh penggunaan.',
    icon: 'code-slash-outline',
    content: `# 💻 Snippet: [Nama Fungsi / Utility]

**Kategori:** React Native / TypeScript  
**Deskripsi:** Penjelasan singkat tentang apa yang dilakukan oleh fungsi ini.

### 📝 Kode Sumber
\`\`\`typescript
export const useCustomHook = <T>(initialValue: T) => {
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    // Perform custom operation
  }, []);

  return { data, setData };
};
\`\`\`

### 🧪 Contoh Penggunaan
\`\`\`tsx
const MyComponent = () => {
  const { data } = useCustomHook('Hello World');
  return <Text>{data}</Text>;
};
\`\`\`
`,
  },
  {
    id: 'todo-checklist',
    title: 'Daftar Tugas (To-Do) ✅',
    category: 'Personal',
    description: 'Daftar prioritas tugas harian/mingguan dengan format checkbox Markdown.',
    icon: 'checkbox-outline',
    content: `# ✅ Checklist Tugas Minggu Ini

### 🔥 Prioritas Tinggi (Urgent)
- [ ] Selesaikan tugas fitur Markdown Editor
- [ ] Kirim laporan ke tim
- [ ] Reviu kode pull request

### ⚡ Prioritas Sedang
- [ ] Perbarui dokumentasi proyek
- [ ] Rapikan struktur folder

### ☕ Prioritas Rendah / Waktu Luang
- [ ] Baca artikel teknologi terbaru
- [ ] Olahraga sore 30 menit
`,
  },
];
