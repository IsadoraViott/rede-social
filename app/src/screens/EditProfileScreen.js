// altera username e permite subir/remover foto de perfil
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [remove, setRemove] = useState(false);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (res.canceled) return;
    const file = res.assets[0];
    const form = new FormData();
    form.append('profile_picture', { uri: file.uri, name: 'avatar.jpg', type: 'image/jpeg' });
    form.append('username', username);
    const { data } = await api.put('/users/me', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setUser({ ...user, username, profile_picture_url: data.profile_picture_url });
    navigation.goBack();
  };

  const saveNoImage = async () => {
    const payload = { username, remove_profile_picture: remove ? 'true' : 'false' };
    const { data } = await api.put('/users/me', payload);
    setUser({ ...user, username, profile_picture_url: data.profile_picture_url });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={pick}><Text style={styles.btnText}>Salvar com foto</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={saveNoImage}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setRemove((v) => !v)}>
        <Text style={{ marginTop: 12 }}>{remove ? 'Remover foto: SIM' : 'Remover foto: NÃO'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 },
  btn: { backgroundColor: '#222', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff' },
});
