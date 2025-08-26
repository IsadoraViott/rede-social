// app/src/components/PostCard.js
import React from 'react';
import { API_ORIGIN } from '../services/api';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// card reutilizável para post
export default function PostCard({ post, onPress, onLike, onFavorite, onEdit, onDelete }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.user}>@{post.username}</Text>
        <Text style={styles.time}>{new Date(post.created_at).toLocaleString()}</Text>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text>{post.content}</Text>
      {!!post.image_url && <Image source={{ uri: post.image_url }} style={styles.image} />}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike}><Text>Curtir</Text></TouchableOpacity>
        <TouchableOpacity onPress={onFavorite}><Text>Favoritar</Text></TouchableOpacity>
        {onEdit && <TouchableOpacity onPress={onEdit}><Text>Editar</Text></TouchableOpacity>}
        {onDelete && <TouchableOpacity onPress={onDelete}><Text>Excluir</Text></TouchableOpacity>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  user: { fontWeight: '600' },
  time: { opacity: 0.6 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 6, marginBottom: 6 },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 8, resizeMode: 'cover' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
