import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const isDark = useColorScheme() === 'dark';

  const markdownStyles = StyleSheet.create({
    body: {
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: isDark ? '#F8FAFC' : '#0F172A',
      fontSize: 26,
      fontWeight: '700',
      marginTop: 18,
      marginBottom: 10,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#E2E8F0',
    },
    heading2: {
      color: isDark ? '#F1F5F9' : '#1E293B',
      fontSize: 21,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
    },
    heading3: {
      color: isDark ? '#E2E8F0' : '#334155',
      fontSize: 18,
      fontWeight: '600',
      marginTop: 14,
      marginBottom: 6,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
      lineHeight: 24,
    },
    link: {
      color: '#2563EB',
      textDecorationLine: 'underline',
    },
    code_inline: {
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      color: isDark ? '#38BDF8' : '#0284C7',
      fontFamily: 'monospace',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 14,
    },
    code_block: {
      backgroundColor: isDark ? '#0F172A' : '#1E293B',
      color: '#F8FAFC',
      fontFamily: 'monospace',
      borderRadius: 8,
      padding: 12,
      marginVertical: 10,
      fontSize: 14,
    },
    blockquote: {
      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
      borderLeftColor: '#3B82F6',
      borderLeftWidth: 4,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginVertical: 10,
      borderRadius: 4,
    },
    table: {
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      borderRadius: 6,
      marginVertical: 10,
    },
    th: {
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      fontWeight: '600',
      padding: 8,
    },
    td: {
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E2E8F0',
    },
    hr: {
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      height: 1,
      marginVertical: 16,
    },
    list_item: {
      marginVertical: 4,
    },
    bullet_list: {
      marginVertical: 6,
    },
    ordered_list: {
      marginVertical: 6,
    },
  });

  return (
    <View style={styles.container}>
      <Markdown style={markdownStyles}>{content || '*Tidak ada konten*'}</Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
