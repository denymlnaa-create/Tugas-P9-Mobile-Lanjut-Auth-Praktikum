import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password tidak boleh kosong');
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(cred.user);
      
      await signOut(auth); 
      
      Alert.alert(
        'Sukses', 
        'Registrasi berhasil. Silakan cek email Anda untuk verifikasi sebelum melakukan login.'
      );

      navigation.goBack(); 
    } catch (e) {
      Alert.alert('Registrasi Gagal', 'Periksa koneksi internet Anda dan pastikan email belum terdaftar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        style={styles.input}
      />
      
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input}
      />

      <Button title="Daftar" onPress={handleRegister} />

      <Text 
        onPress={() => navigation.goBack()} 
        style={styles.link}
      >
        Sudah punya akun? Login di sini
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 22, 
    marginBottom: 30, 
    textAlign: 'center',
    fontWeight: 'bold' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc',
    marginBottom: 20, 
    padding: 10 
  },
  link: { 
    marginTop: 25, 
    color: 'blue', 
    textAlign: 'center' 
  }
});