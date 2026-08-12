import React, { useState, useEffect } from 'react';
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
import { SecurityService } from '../services/security';

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
  const [appSecurityHash, setAppSecurityHash] = useState<string>('LOADING...');
  const [contentChecksum, setContentChecksum] = useState<string>('...');

  useEffect(() => {
    if (visible) {
      SecurityService.getAppSecurityHash().then(setAppSecurityHash);
      SecurityService.generateContentHash(content).then(setContentChecksum);
    }
  }, [visible, content]);

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

  const handleCopySecurityHash = async () => {
    await Clipboard.setStringAsync(`AppHash: ${appSecurityHash} | Checksum: ${contentChecksum}`);
    Alert.alert('Hash Keamanan 🔒', 'Hash Keamanan & Checksum telah disalin!');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Statistik & Keamanan 📊
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          {/* App Security Hash Badge */}
          <TouchableOpacity
            style={[styles.securityBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}
            onPress={handleCopySecurityHash}
            activeOpacity={0.7}
          >
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={[styles.securityTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Kode Hash Enkripsi Aplikasi
              </Text>
            </View>
            <Text style={[styles.hashText, { color: isDark ? '#38BDF8' : '#0284C7' }]} numberOfLines={1}>
              {appSecurityHash}
            </Text>
            <Text style={[styles.checksumText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Checksum Dokumen: <Text style={{ fontWeight: '700' }}>#{contentChecksum}</Text>
            </Text>
          </TouchableOpacity>

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
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  securityBadge: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  hashText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
    marginBottom: 2,
  },
  checksumText: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
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
