import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NOTE_TEMPLATES } from '../constants/templates';
import { NoteTemplate } from '../types/note';
import { CATEGORY_COLORS } from '../constants/theme';

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NoteTemplate) => void;
  onSelectBlank: () => void;
  onImportFromUrl?: (title: string, content: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  visible,
  onClose,
  onSelectTemplate,
  onSelectBlank,
  onImportFromUrl,
}) => {
  const isDark = useColorScheme() === 'dark';
  const [showImportUrlInput, setShowImportUrlInput] = useState<boolean>(false);
  const [importUrl, setImportUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);

  const handleFetchMarkdownUrl = async () => {
    if (!importUrl.trim()) {
      Alert.alert('Peringatan', 'Masukkan URL berkas Markdown (RAW .md URL).');
      return;
    }

    try {
      setIsFetchingUrl(true);
      const res = await fetch(importUrl.trim());
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }
      const text = await res.text();
      setIsFetchingUrl(false);

      // Extract title from URL filename or first heading
      let derivedTitle = 'Hasil Impor Internet 🌐';
      const headingMatch = text.match(/^#\s+(.+)$/m);
      if (headingMatch && headingMatch[1]) {
        derivedTitle = headingMatch[1].trim();
      } else {
        const urlParts = importUrl.trim().split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.endsWith('.md')) {
          derivedTitle = lastPart.replace('.md', '');
        }
      }

      if (onImportFromUrl) {
        onImportFromUrl(derivedTitle, text);
      }
      setImportUrl('');
      setShowImportUrlInput(false);
      onClose();
    } catch (e: any) {
      setIsFetchingUrl(false);
      console.error('Fetch markdown failed', e);
      Alert.alert('Gagal Mengimpor 🚫', `Gagal mengambil berkas Markdown dari URL internet: ${e.message || e}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Pilih Template Catatan
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Mulai cepat dengan format Markdown yang telah disiapkan
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Blank Note Option */}
            <TouchableOpacity
              style={[
                styles.card,
                styles.blankCard,
                { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: '#3B82F6' },
              ]}
              onPress={() => {
                onSelectBlank();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#2563EB" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Catatan Kosong 📝
                </Text>
                <Text style={[styles.cardDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Buat dokumen Markdown baru dari awal
                </Text>
              </View>
            </TouchableOpacity>

            {/* Import from Internet URL Option */}
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: isDark ? '#1E293B' : '#ECFDF5', borderColor: '#10B981' },
              ]}
              onPress={() => setShowImportUrlInput(!showImportUrlInput)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="globe-outline" size={24} color="#059669" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Impor dari Internet 🌐
                </Text>
                <Text style={[styles.cardDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Ambil berkas Markdown dari URL publik (GitHub RAW, Gist, web)
                </Text>
              </View>
            </TouchableOpacity>

            {showImportUrlInput && (
              <View style={[styles.importBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                <TextInput
                  style={[styles.importInput, { color: isDark ? '#F8FAFC' : '#0F172A', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
                  placeholder="https://raw.githubusercontent.com/.../README.md"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  value={importUrl}
                  onChangeText={setImportUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <TouchableOpacity
                  style={styles.importBtn}
                  onPress={handleFetchMarkdownUrl}
                  disabled={isFetchingUrl}
                  activeOpacity={0.8}
                >
                  {isFetchingUrl ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.importBtnText}>Unduh & Buat</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              TEMPLATE POPULER
            </Text>

            {/* Template List */}
            {NOTE_TEMPLATES.map((tmpl) => {
              const catStyle = CATEGORY_COLORS[tmpl.category];
              return (
                <TouchableOpacity
                  key={tmpl.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: isDark ? '#334155' : catStyle.bg }]}>
                    <Ionicons name={tmpl.icon as any} size={22} color={catStyle.text} />
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        {tmpl.title}
                      </Text>
                      <View style={[styles.catTag, { backgroundColor: isDark ? '#334155' : catStyle.bg }]}>
                        <Text style={[styles.catTagText, { color: catStyle.text }]}>{tmpl.category}</Text>
                      </View>
                    </View>
                    <Text style={[styles.cardDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      {tmpl.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  scroll: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  blankCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  catTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  catTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  importBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  importInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  importBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
