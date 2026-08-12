import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  useColorScheme,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onInsert }) => {
  const isDark = useColorScheme() === 'dark';
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [imageAltInput, setImageAltInput] = useState<string>('');

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Ditolak 🚫', 'Aplikasi memerlukan izin galeri untuk memilih gambar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        onInsert(`\n![Gambar](${uri})\n`, '');
        setIsImageModalOpen(false);
      }
    } catch (e) {
      console.error('Gallery picker error', e);
      Alert.alert('Gagal', 'Gagal mengambil gambar dari galeri.');
    }
  };

  const handleInsertUrlImage = () => {
    if (!imageUrlInput.trim()) {
      Alert.alert('Peringatan', 'Masukkan URL gambar yang valid dari internet.');
      return;
    }
    const altText = imageAltInput.trim() || 'Gambar';
    onInsert(`\n![${altText}](${imageUrlInput.trim()})\n`, '');
    setImageUrlInput('');
    setImageAltInput('');
    setIsImageModalOpen(false);
  };

  const tools = [
    { label: 'H1', action: () => onInsert('# ', '') },
    { label: 'H2', action: () => onInsert('## ', '') },
    { label: 'H3', action: () => onInsert('### ', '') },
    { icon: 'text-outline', action: () => onInsert('**', '**', 'teks tebal') },
    { icon: 'text', action: () => onInsert('*', '*', 'teks miring') },
    { label: 'S', action: () => onInsert('~~', '~~', 'teks coret') },
    { icon: 'image-outline', action: () => setIsImageModalOpen(true) },
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

      {/* Image Modal */}
      <Modal visible={isImageModalOpen} transparent animationType="fade" onRequestClose={() => setIsImageModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsImageModalOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Sisipkan Gambar Markdown 🖼️
              </Text>
              <TouchableOpacity onPress={() => setIsImageModalOpen(false)}>
                <Ionicons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Gallery Option */}
            <TouchableOpacity style={styles.galleryBtn} onPress={handlePickFromGallery} activeOpacity={0.8}>
              <Ionicons name="images-outline" size={20} color="#FFFFFF" />
              <Text style={styles.galleryBtnText}>Pilih dari Galeri Android / HP</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.line, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
              <Text style={[styles.dividerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>atau masukan URL Internet</Text>
              <View style={[styles.line, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
            </View>

            <TextInput
              style={[styles.input, { color: isDark ? '#F8FAFC' : '#0F172A', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
              placeholder="Deskripsi Gambar (Alt text)"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={imageAltInput}
              onChangeText={setImageAltInput}
            />

            <TextInput
              style={[styles.input, { color: isDark ? '#F8FAFC' : '#0F172A', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={imageUrlInput}
              onChangeText={setImageUrlInput}
              autoCapitalize="none"
              keyboardType="url"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleInsertUrlImage} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Sisipkan Gambar URL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 14,
  },
  galleryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    marginBottom: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
