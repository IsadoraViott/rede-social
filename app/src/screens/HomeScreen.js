// lista de posts com paginação e ações curtir/favoritar
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PostCard from '../components/PostCard';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pg = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/posts?page=${pg}&limit=10`);
      if (pg === 1) setPosts(data.data);
      else setPosts((prev) => [...prev, ...data.data]);
      setHasMore(pg < data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts(1);
      setPage(1);
    }, [])
  );

  const onEnd = () => {
    if (hasMore && !loading) {
      const next = page + 1;
      setPage(next);
      fetchPosts(next);
    }
  };

  const like = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
    } catch {}
  };

  const favorite = async (postId) => {
    try {
      await api.post(`/posts/${postId}/favorite`);
    } catch {}
  };

  const renderItem = ({ item }) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate('PostDetail', { id: item.id })}
      onLike={() => like(item.id)}
      onFavorite={() => favorite(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Forum</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('NewPost')}>
            <Text style={{ fontWeight: '700' }}>Novo</Text>
          </TouchableOpacity>
          <Text>Olá, {user?.username}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={onEnd}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  header: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { fontSize: 20, fontWeight: '700' },
});
