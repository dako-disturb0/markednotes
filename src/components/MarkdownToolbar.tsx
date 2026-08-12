import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onInsert }) => {
  const isDark = useColorScheme() === 'dark';

  const tools = [
    { label: 'H1', action: () => onInsert('# ', '') },
    { label: 'H2', action: () => onInsert('## ', '') },
    { label: 'H3', action: () => onInsert('### ', '') },
    { icon: 'text-outline', action: () => onInsert('**', '**', 'teks tebal') },
    { icon: 'text', action: () => onInsert('*', '*', 'teks miring') },
    { label: 'S', action: () => onInsert('~~', '~~', 'teks coret') },
    { icon: 'list-outline', action: () => onInsert('\n- ', '') },
    { icon: 'checkbox-outline', action: () => onInsert('\n- [ ] ', '') },
    { icon: 'code-slash-outline', action: () => onInsert('`', '`', 'kode') },
    { icon: 'code-working-outline', action: () => onInsert('\n```typescript\n', '\n```\n', '// kode di sini') },
    { icon: 'chatbox-ellipses-outline', action: () => onInsert('\n> ', '') },
    { icon: 'link-outline', action: () => onInsert('[', '](https://example.com)', 'Judul Link') },
    { icon: 'grid-outline', action: () => onInsert('\n| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Data 1 | Data 2 |\n') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tools.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: isDark ? '#334155' : '#FFFFFF', borderColor: isDark ? '#475569' : '#CBD5E1' }]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            {item.icon ? (
              <Ionicons name={item.icon as any} size={18} color={isDark ? '#94A3B8' : '#475569'} />
            ) : (
              <Text style={[styles.label, { color: isDark ? '#F1F5F9' : '#334155' }]}>{item.label}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  button: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
