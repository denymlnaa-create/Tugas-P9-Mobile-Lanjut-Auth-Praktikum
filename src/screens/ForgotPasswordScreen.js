import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

const handleReset = async () => {
  if (!email) {
    return Alert.alert('Error', 'Silakan masukkan email terlebih dahulu');
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    
    Alert.alert(
      'Informasi', 
      'Jika email terdaftar, ikuti instruksi yang dikirim ke kotak masuk Anda.'
    );
    navigation.navigate('Login');
    
  } catch (e) {
    Alert.alert('Error', 'Gunakan alamat email yang valid.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password</Text>
      
      <TextInput 
        placeholder="Masukkan Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        style={styles.input}
      />

      <Button title="Kirim Link Reset" onPress={handleReset} />

      <Text 
        onPress={() => navigation.goBack()} 
        style={styles.backLink}
      >
        Kembali ke Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  backLink: { marginTop: 20, color: 'blue', textAlign: 'center' }
});