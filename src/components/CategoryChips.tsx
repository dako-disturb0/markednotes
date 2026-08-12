import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoteCategory } from '../types/note';
import { CATEGORY_COLORS } from '../constants/theme';

interface CategoryChipsProps {
  selectedCategory: NoteCategory | 'All';
  onSelectCategory: (category: NoteCategory | 'All') => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
}

const CATEGORIES: (NoteCategory | 'All')[] = ['All', 'Personal', 'Work', 'Ideas', 'Study', 'Journal', 'Code'];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  onlyFavorites,
  onToggleFavorites,
}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Favorites Chip */}
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: onlyFavorites ? '#EF4444' : isDark ? '#1E293B' : '#FFFFFF',
            borderColor: onlyFavorites ? '#EF4444' : isDark ? '#334155' : '#E2E8F0',
          },
        ]}
        onPress={onToggleFavorites}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={14} color={onlyFavorites ? '#FFFFFF' : '#EF4444'} />
        <Text style={[styles.chipText, { color: onlyFavorites ? '#FFFFFF' : isDark ? '#E2E8F0' : '#475569' }]}>
          Favorit
        </Text>
      </TouchableOpacity>

      {/* Category Chips */}
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const colorConfig = cat !== 'All' ? CATEGORY_COLORS[cat] : null;

        return (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? '#2563EB'
                  : isDark
                  ? '#1E293B'
                  : '#FFFFFF',
                borderColor: isSelected
                  ? '#2563EB'
                  : isDark
                  ? '#334155'
                  : '#E2E8F0',
              },
            ]}
            onPress={() => onSelectCategory(cat)}
            activeOpacity={0.7}
          >
            {cat !== 'All' && colorConfig && (
              <Ionicons
                name={colorConfig.icon as any}
                size={14}
                color={isSelected ? '#FFFFFF' : colorConfig.text}
              />
            )}
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? '#FFFFFF' : isDark ? '#E2E8F0' : '#475569',
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {cat === 'All' ? 'Semua' : cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
  },
});
