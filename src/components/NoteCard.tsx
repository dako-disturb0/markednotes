import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, ViewMode } from '../types/note';
import { CATEGORY_COLORS } from '../constants/theme';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
  onPress: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  onPress,
  onTogglePin,
  onToggleFavorite,
}) => {
  const isDark = useColorScheme() === 'dark';
  const categoryStyle = CATEGORY_COLORS[note.category] || CATEGORY_COLORS.Personal;

  // Clean Markdown markers for preview text
  const cleanSnippet = (content: string): string => {
    return content
      .replace(/#+\s+/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{3}[\s\S]*?`{3}/g, '[Kode]')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/>\s+/g, '')
      .replace(/-\s+\[[ x]\]\s+/gi, '')
      .trim();
  };

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isGrid = viewMode === 'grid';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isGrid ? styles.gridCard : styles.listCard,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header Row: Category Badge & Pin/Fav */}
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: isDark ? '#334155' : categoryStyle.bg, borderColor: categoryStyle.border },
          ]}
        >
          <Ionicons name={categoryStyle.icon as any} size={12} color={categoryStyle.text} />
          <Text style={[styles.categoryText, { color: categoryStyle.text }]}>{note.category}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onTogglePin} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={note.isPinned ? 'pin' : 'pin-outline'}
              size={18}
              color={note.isPinned ? '#F59E0B' : isDark ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={note.isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={note.isFavorite ? '#EF4444' : isDark ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Title */}
      <Text
        style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
        numberOfLines={2}
      >
        {note.title || 'Tanpa Judul'}
      </Text>

      {/* Snippet Preview */}
      <Text
        style={[styles.snippet, { color: isDark ? '#94A3B8' : '#64748B' }]}
        numberOfLines={isGrid ? 3 : 2}
      >
        {cleanSnippet(note.content) || 'Kosong...'}
      </Text>

      {/* Tags */}
      {note.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {note.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={[styles.tagPill, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
              <Text style={[styles.tagText, { color: isDark ? '#CBD5E1' : '#475569' }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer Date */}
      <View style={styles.cardFooter}>
        <Ionicons name="time-outline" size={12} color={isDark ? '#64748B' : '#94A3B8'} />
        <Text style={[styles.dateText, { color: isDark ? '#64748B' : '#94A3B8' }]}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  gridCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  listCard: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  snippet: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
  },
});
