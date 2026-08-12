import { NoteCategory } from '../types/note';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const MaxContentWidth = 1200;
export const BottomTabInset = 60;
export const Fonts = {
  regular: 'System',
  bold: 'System',
};
export type ThemeColor = 'light' | 'dark';

export const CATEGORY_COLORS: Record<NoteCategory, { bg: string; text: string; border: string; icon: string }> = {
  Personal: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', icon: 'person-outline' },
  Work: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', icon: 'briefcase-outline' },
  Ideas: { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF', icon: 'bulb-outline' },
  Study: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', icon: 'school-outline' },
  Journal: { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8', icon: 'book-outline' },
  Code: { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', icon: 'code-slash-outline' },
};

export const INITIAL_NOTES = [
  {
    id: 'welcome-note',
    title: 'Selamat Datang di Markdown Notes 🚀',
    content: `# Selamat Datang di Markdown Notes! 🎉

Aplikasi ini dirancang untuk memberikan pengalaman mencatat berbasis **Markdown** yang cepat, fleksibel, dan bersih.

---

### ✨ Fitur Unggulan
1. **Live Markdown Preview**: Lihat hasil format secara langsung.
2. **Kategori & Tag**: Kelola catatan berdasarkan *Personal*, *Work*, *Ideas*, *Study*, *Journal*, & *Code*.
3. **Template Siap Pakai**: Gunakan template untuk *Catatan Rapat*, *Jurnal Harian*, *Code Snippet*, dan *Checklist*.
4. **Toolbar Markdown Quick Format**: Sisipkan judul, tebal, miring, daftar, tabel, dan blok kode dengan satu ketukan.
5. **Pin & Favorit**: Sematkan catatan penting ke bagian paling atas.
6. **Ekspor & Salin**: Salin teks Markdown atau bagikan catatan kapan saja.

---

> *"Pikiran yang jernih berawal dari catatan yang rapi."*

Coba edit catatan ini atau buat catatan baru dengan menekan tombol **+** di bawah!
`,
    category: 'Ideas' as NoteCategory,
    tags: ['Welcome', 'Guide', 'Markdown'],
    isPinned: true,
    isFavorite: true,
    color: '#F3E8FF',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'markdown-cheatsheet',
    title: 'Panduan Format Markdown 📝',
    content: `# Panduan Lengkap Sintaks Markdown

Gunakan sintaks berikut untuk memformat catatan Anda dengan mudah:

## 1. Judul (Headings)
# Judul Utama (H1)
## Subjudul (H2)
### Subjudul Kecil (H3)

## 2. Format Teks
* **Teks Tebal (Bold)**: \`**teks tebal**\`
* *Teks Miring (Italic)*: \`*teks miring*\`
* ~~Teks Coret (Strikethrough)~~: \`~~teks coret~~\`

## 3. Daftar & Checklist
### Daftar Berpoin:
- Item 1
- Item 2
  - Subitem 2.1

### Checklist Tugas:
- [x] Fitur 1 Selesai
- [ ] Fitur 2 Dalam Pengerjaan

## 4. Kutipan (Blockquotes)
> Ini adalah contoh blok kutipan untuk menyoroti poin penting.

## 5. Blok Kode (Code Block)
\`\`\`typescript
const greet = (name: string): string => {
  return \`Halo, \${name}!\`;
};
\`\`\`

## 6. Tabel
| Fitur | Status | Prioritas |
| :--- | :---: | ---: |
| Editor | ✅ Ready | High |
| Preview | ✅ Ready | High |
| Export | ✅ Ready | Medium |
`,
    category: 'Study' as NoteCategory,
    tags: ['Markdown', 'Cheatsheet', 'Tutorial'],
    isPinned: false,
    isFavorite: true,
    color: '#ECFDF5',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
