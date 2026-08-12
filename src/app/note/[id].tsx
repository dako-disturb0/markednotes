import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../hooks/useNotes';
import { MarkdownView } from '../../components/MarkdownView';
import { MarkdownToolbar } from '../../components/MarkdownToolbar';
import { NoteStatsModal } from '../../components/NoteStatsModal';
import { NoteCategory } from '../../types/note';
import { CATEGORY_COLORS } from '../../constants/theme';

type ViewModeType = 'edit' | 'preview' | 'split';

const CATEGORIES: NoteCategory[] = ['Personal', 'Work', 'Ideas', 'Study', 'Journal', 'Code'];

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const { notes, updateNote, deleteNote, togglePin, toggleFavorite } = useNotes();
  const currentNote = notes.find((n) => n.id === id);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<NoteCategory>('Personal');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [mode, setMode] = useState<ViewModeType>('edit');
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  const contentInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCategory(currentNote.category);
      setTags(currentNote.tags || []);
    }
  }, [currentNote?.id]);

  // Auto-save changes
  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (id) updateNote(id, { title: text });
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    if (id) updateNote(id, { content: text });
  };

  const handleCategorySelect = (cat: NoteCategory) => {
    setCategory(cat);
    if (id) updateNote(id, { category: cat });
    setIsCategoryModalOpen(false);
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setTags(updated);
      if (id) updateNote(id, { tags: updated });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setTags(updated);
    if (id) updateNote(id, { tags: updated });
  };

  const handleInsertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const insertion = `${prefix}${defaultText}${suffix}`;
    const updated = content + insertion;
    setContent(updated);
    if (id) updateNote(id, { content: updated });
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Hapus Catatan?',
      'Catatan ini akan dihapus secara permanen.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            if (id) deleteNote(id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!currentNote && !title && !content) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <View style={styles.center}>
          <Text style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>Catatan tidak ditemukan</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: '#2563EB' }}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Personal;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={[styles.header, { borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <Ionicons name="arrow-back" size={22} color={isDark ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>

          {/* Mode Switcher Tabs */}
          <View style={[styles.modeTabs, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'edit' && styles.activeModeTab]}
              onPress={() => setMode('edit')}
            >
              <Ionicons
                name="create-outline"
                size={14}
                color={mode === 'edit' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  { color: mode === 'edit' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, mode === 'preview' && styles.activeModeTab]}
              onPress={() => setMode('preview')}
            >
              <Ionicons
                name="eye-outline"
                size={14}
                color={mode === 'preview' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  { color: mode === 'preview' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, mode === 'split' && styles.activeModeTab]}
              onPress={() => setMode('split')}
            >
              <Ionicons
                name="bar-chart-outline"
                size={14}
                color={mode === 'split' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  { color: mode === 'split' ? '#2563EB' : isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Split
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Tools */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity onPress={() => { if (currentNote) togglePin(currentNote.id); }}>
              <Ionicons
                name={currentNote?.isPinned ? 'pin' : 'pin-outline'}
                size={20}
                color={currentNote?.isPinned ? '#F59E0B' : isDark ? '#94A3B8' : '#64748B'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { if (currentNote) toggleFavorite(currentNote.id); }}>
              <Ionicons
                name={currentNote?.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={currentNote?.isFavorite ? '#EF4444' : isDark ? '#94A3B8' : '#64748B'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsStatsModalOpen(true)}>
              <Ionicons name="analytics-outline" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDeleteConfirm}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category & Tags Header */}
        <View style={[styles.metaBar, { borderColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <TouchableOpacity
            style={[styles.catBadge, { backgroundColor: isDark ? '#334155' : categoryStyle.bg }]}
            onPress={() => setIsCategoryModalOpen(true)}
          >
            <Ionicons name={categoryStyle.icon as any} size={14} color={categoryStyle.text} />
            <Text style={[styles.catText, { color: categoryStyle.text }]}>{category}</Text>
            <Ionicons name="chevron-down" size={12} color={categoryStyle.text} />
          </TouchableOpacity>

          {/* Tags Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
            {tags.map((t) => (
              <View key={t} style={[styles.tagPill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Text style={[styles.tagPillText, { color: isDark ? '#CBD5E1' : '#475569' }]}>#{t}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(t)}>
                  <Ionicons name="close" size={12} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addTagInputContainer}>
              <TextInput
                style={[styles.addTagInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                placeholder="+ Tag baru"
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                value={newTagInput}
                onChangeText={setNewTagInput}
                onSubmitEditing={handleAddTag}
                blurOnSubmit={false}
              />
            </View>
          </ScrollView>
        </View>

        {/* Main Content Area based on Mode */}
        <View style={styles.mainContent}>
          {mode === 'edit' && (
            <ScrollView style={styles.scrollSection} contentContainerStyle={styles.editContainer}>
              <TextInput
                style={[styles.titleInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                placeholder="Judul Catatan..."
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                value={title}
                onChangeText={handleTitleChange}
                multiline={false}
              />
              <TextInput
                ref={contentInputRef}
                style={[styles.contentInput, { color: isDark ? '#E2E8F0' : '#1E293B' }]}
                placeholder="Tuliskan catatan berbasis Markdown di sini..."
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                value={content}
                onChangeText={handleContentChange}
                multiline
                textAlignVertical="top"
              />
            </ScrollView>
          )}

          {mode === 'preview' && (
            <ScrollView style={styles.scrollSection} contentContainerStyle={styles.previewContainer}>
              {title ? (
                <Text style={[styles.previewTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {title}
                </Text>
              ) : null}
              <MarkdownView content={content} />
            </ScrollView>
          )}

          {mode === 'split' && (
            <View style={styles.splitView}>
              <View style={[styles.splitHalf, { borderRightWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
                <ScrollView style={styles.scrollSection} contentContainerStyle={styles.editContainer}>
                  <TextInput
                    style={[styles.titleInput, { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 18 }]}
                    placeholder="Judul..."
                    placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                    value={title}
                    onChangeText={handleTitleChange}
                  />
                  <TextInput
                    style={[styles.contentInput, { color: isDark ? '#E2E8F0' : '#1E293B', fontSize: 14 }]}
                    placeholder="Markdown..."
                    placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                    value={content}
                    onChangeText={handleContentChange}
                    multiline
                    textAlignVertical="top"
                  />
                </ScrollView>
              </View>

              <View style={styles.splitHalf}>
                <ScrollView style={styles.scrollSection} contentContainerStyle={styles.previewContainer}>
                  <Text style={[styles.previewTitle, { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 20 }]}>
                    {title || 'Preview'}
                  </Text>
                  <MarkdownView content={content} />
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        {/* Quick Format Markdown Toolbar (shown in edit/split mode) */}
        {(mode === 'edit' || mode === 'split') && (
          <MarkdownToolbar onInsert={handleInsertFormatting} />
        )}

        {/* Note Stats & Export Modal */}
        <NoteStatsModal
          visible={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          title={title}
          content={content}
        />

        {/* Category Picker Modal */}
        <Modal visible={isCategoryModalOpen} transparent animationType="fade" onRequestClose={() => setIsCategoryModalOpen(false)}>
          <TouchableOpacity style={styles.catModalOverlay} activeOpacity={1} onPress={() => setIsCategoryModalOpen(false)}>
            <View style={[styles.catModalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
              <Text style={[styles.catModalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Pilih Kategori</Text>
              {CATEGORIES.map((cat) => {
                const cStyle = CATEGORY_COLORS[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catOption,
                      category === cat && { backgroundColor: isDark ? '#334155' : '#EFF6FF' },
                    ]}
                    onPress={() => handleCategorySelect(cat)}
                  >
                    <Ionicons name={cStyle.icon as any} size={18} color={cStyle.text} />
                    <Text style={[styles.catOptionText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{cat}</Text>
                    {category === cat && <Ionicons name="checkmark" size={18} color="#2563EB" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerIconBtn: {
    padding: 6,
  },
  modeTabs: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  activeModeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagsScroll: {
    alignItems: 'center',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  addTagInputContainer: {
    paddingHorizontal: 4,
  },
  addTagInput: {
    fontSize: 12,
    minWidth: 70,
  },
  mainContent: {
    flex: 1,
  },
  scrollSection: {
    flex: 1,
  },
  editContainer: {
    padding: 16,
    flexGrow: 1,
  },
  previewContainer: {
    padding: 16,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 300,
  },
  previewTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  splitView: {
    flex: 1,
    flexDirection: 'row',
  },
  splitHalf: {
    flex: 1,
  },
  catModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  catModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 18,
  },
  catModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
  },
  catOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
