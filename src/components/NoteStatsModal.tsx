import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface NoteStatsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const NoteStatsModal: React.FC<NoteStatsModalProps> = ({
  visible,
  onClose,
  title,
  content,
}) => {
  const isDark = useColorScheme() === 'dark';

  // Calculate stats
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content ? content.split('\n').length : 0;
  const readingTime = Math.ceil(wordCount / 200); // Avg 200 WPM

  const handleCopyMarkdown = async () => {
    const fullText = `# ${title}\n\n${content}`;
    await Clipboard.setStringAsync(fullText);
    Alert.alert('Sukses 📋', 'Konten Markdown telah disalin ke clipboard!');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Statistik & Ekspor 📊
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.grid}>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
              <Ionicons name="text-outline" size={20} color="#2563EB" />
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {charCount.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Karakter</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
              <Ionicons name="document-text-outline" size={20} color="#059669" />
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {wordCount.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Kata</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
              <Ionicons name="list-outline" size={20} color="#D97706" />
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {lineCount.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Baris</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
              <Ionicons name="time-outline" size={20} color="#7E22CE" />
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                ~{readingTime} mnt
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Estimasi Baca</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.btn, styles.primaryBtn]}
            onPress={handleCopyMarkdown}
            activeOpacity={0.8}
          >
            <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Salin Markdown Mentah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
