// Formulário para criar post com título, conteúdo e (opcional) imagem
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export default function NewPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // { uri, width, height, ... }

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) {
      setImage(res.assets[0]); // guarda apenas o primeiro selecionado
    }
  };

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Preencha título e conteúdo');
      return;
    }

    try {
      // Se tiver imagem, manda multipart; senão, JSON simples
      if (image) {
        const form = new FormData();
        form.append('title', title);
        form.append('content', content);
        // o backend espera o campo "image" (multer.single('image'))
        form.append('image', {
          uri: image.uri,
          name: 'post.jpg',
          type: 'image/jpeg',
        });

        await api.post('/posts', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/posts', { title, content });
      }

      // volta para a Home; lá vamos recarregar a lista
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao criar post');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Post</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        value={content}
        onChangeText={setContent}
        placeholder="Escreva seu post..."
        multiline
      />

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={styles.btnSecondary} onPress={pickImage}>
          <Text style={styles.btnSecondaryText}>{image ? 'Trocar imagem' : 'Adicionar imagem'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={submit}>
          <Text style={styles.btnPrimaryText}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, padding: 16, gap: 8, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { fontWeight: '600', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  preview: { width: '100%', height: 220, borderRadius: 8, marginTop: 8, resizeMode: 'cover' },
  btnPrimary: { backgroundColor: '#222', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnSecondary: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnSecondaryText: { color: '#111', fontWeight: '600' },
});
