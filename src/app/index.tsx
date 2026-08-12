import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../hooks/useNotes';
import { NoteCard } from '../components/NoteCard';
import { CategoryChips } from '../components/CategoryChips';
import { TemplateModal } from '../components/TemplateModal';
import { ViewMode, SortOption, NoteTemplate } from '../types/note';

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const {
    notes,
    allNotesCount,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onlyFavorites,
    setOnlyFavorites,
    addNote,
    togglePin,
    toggleFavorite,
  } = useNotes();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);

  const handleCreateFromTemplate = (template: NoteTemplate) => {
    const newNote = addNote({
      title: template.title,
      content: template.content,
      category: template.category,
      tags: [template.category],
      isPinned: false,
      isFavorite: false,
    });
    router.push(`/note/${newNote.id}`);
  };

  const handleCreateFromUrl = (importedTitle: string, importedContent: string) => {
    const newNote = addNote({
      title: importedTitle,
      content: importedContent,
      category: 'Study',
      tags: ['Imported', 'Markdown'],
      isPinned: false,
      isFavorite: false,
    });
    router.push(`/note/${newNote.id}`);
  };

  const handleCreateBlank = () => {
    const newNote = addNote({
      title: '',
      content: '',
      category: selectedCategory === 'All' ? 'Personal' : selectedCategory,
      tags: [],
      isPinned: false,
      isFavorite: false,
    });
    router.push(`/note/${newNote.id}`);
  };

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Terakhir Diubah', value: 'updatedAt' },
    { label: 'Tanggal Dibuat', value: 'createdAt' },
    { label: 'Judul (A-Z)', value: 'title' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* App Header */}
      <View style={[styles.header, { borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <View style={styles.brandContainer}>
          <Text style={[styles.brandTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Markdown Notes
          </Text>
          <View style={[styles.countBadge, { backgroundColor: isDark ? '#334155' : '#E0E7FF' }]}>
            <Text style={[styles.countText, { color: isDark ? '#93C5FD' : '#3B82F6' }]}>
              {allNotesCount}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={() => setIsSortModalOpen(true)}
          >
            <Ionicons name="swap-vertical" size={18} color={isDark ? '#94A3B8' : '#475569'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
              size={18}
              color={isDark ? '#94A3B8' : '#475569'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
          ]}
        >
          <Ionicons name="search" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            placeholder="Cari catatan, isi, atau tag..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Filter */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
      />

      {/* Main Notes List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBg, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
            <Ionicons name="document-text-outline" size={48} color="#3B82F6" />
          </View>
          <Text style={[styles.emptyTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Tidak Ada Catatan
          </Text>
          <Text style={[styles.emptySubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {searchQuery
              ? `Tidak ada catatan yang cocok dengan "${searchQuery}"`
              : 'Buat catatan baru atau pilih template untuk memulai'}
          </Text>
          <TouchableOpacity
            style={styles.createFirstBtn}
            onPress={() => setIsTemplateModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.createFirstBtnText}>Buat Catatan Baru</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={notes}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              viewMode={viewMode}
              onPress={() => router.push(`/note/${item.id}`)}
              onTogglePin={() => togglePin(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsTemplateModalOpen(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Template Modal */}
      <TemplateModal
        visible={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleCreateFromTemplate}
        onSelectBlank={handleCreateBlank}
        onImportFromUrl={handleCreateFromUrl}
      />

      {/* Sort Options Modal */}
      <Modal visible={isSortModalOpen} transparent animationType="fade" onRequestClose={() => setIsSortModalOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSortModalOpen(false)}
        >
          <View style={[styles.sortModalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.sortTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Urutkan Berdasarkan</Text>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.sortOptionItem,
                  sortBy === opt.value && { backgroundColor: isDark ? '#334155' : '#EFF6FF' },
                ]}
                onPress={() => {
                  setSortBy(opt.value);
                  setIsSortModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    { color: sortBy === opt.value ? '#2563EB' : isDark ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  {opt.label}
                </Text>
                {sortBy === opt.value && <Ionicons name="checkmark" size={18} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  createFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sortModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 18,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sortOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
