// app/src/screens/PostDetailScreen.js
// detalha o post e lista/enviar comentários
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import api from '../services/api';

export default function PostDetailScreen({ route }) {
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
      const c = await api.get(`/comments/post/${id}`);
      setComments(c.data);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!content.trim()) return;
    await api.post('/comments', { post_id: id, content });
    setContent('');
    load();
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={{ marginBottom: 12 }}>{post.content}</Text>

      <Text style={{ fontWeight: '600', marginTop: 8 }}>Comentários</Text>
      <FlatList
        data={comments}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <Text style={{ paddingVertical: 6 }}><Text style={{ fontWeight: '600' }}>@{item.username}:</Text> {item.content}</Text>}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TextInput style={styles.input} placeholder="Comentar..." value={content} onChangeText={setContent} />
        <TouchableOpacity style={styles.btn} onPress={send}><Text style={{ color: '#fff' }}>Enviar</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  btn: { backgroundColor: '#222', paddingHorizontal: 12, justifyContent: 'center', borderRadius: 8 },
});
