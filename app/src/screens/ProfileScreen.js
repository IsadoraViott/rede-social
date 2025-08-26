// exibe favoritos do usuário e navega para editar perfil
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import PostCard from '../components/PostCard';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  const loadFav = async () => {
    const { data } = await api.get('/users/me/favorites');
    setFavorites(data);
  };

  useEffect(() => { loadFav(); }, []);

  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <View style={{ paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>@{user?.username}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}><Text>Voltar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}><Text>Editar</Text></TouchableOpacity>
          <TouchableOpacity onPress={logout}><Text>Sair</Text></TouchableOpacity>
        </View>
      </View>

      <Text style={{ margin: 12, fontWeight: '600' }}>Favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => <PostCard post={item} onPress={() => {}} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}
