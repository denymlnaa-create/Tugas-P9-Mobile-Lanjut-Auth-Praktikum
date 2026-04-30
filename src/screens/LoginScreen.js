import React, { useState } from 'react'; 
import { View, TextInput, Button, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native'; 
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { auth } from '../config/firebase'; 
import * as LocalAuthentication from 'expo-local-authentication'; 
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => { 
    if (!email || !password) return Alert.alert("Error", "Masukkan email dan password terlebih dahulu.");
    setLoading(true);
    
    try { 
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && !user.emailVerified) {
        Alert.alert("Verifikasi", "Silakan verifikasi email Anda di Gmail terlebih dahulu.");
        await signOut(auth); 
        setLoading(false);
        return;
      }

      await SecureStore.setItemAsync('user_email', email);
      await SecureStore.setItemAsync('user_password', password);
      
    } catch (e) { 
      Alert.alert('Gagal', 'Email atau Password salah.'); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const handleBiometric = async () => { 
    const savedEmail = await SecureStore.getItemAsync('user_email');
    const savedPassword = await SecureStore.getItemAsync('user_password');
    
    if (!savedEmail || !savedPassword) {
      return Alert.alert('Error', 'Login manual dulu untuk mengaktifkan biometrik.');
    }

    const result = await LocalAuthentication.authenticateAsync({ 
      promptMessage: 'Login Biometrik' 
    }); 

    if (result.success) { 
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
      } catch (e) {
        Alert.alert("Gagal", "Sesi biometrik kadaluarsa.");
      } finally {
        setLoading(false);
      }
    } 
  };

  return ( 
    <View style={styles.container}> 
      <Text style={styles.title}>Login</Text>
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        autoCapitalize="none" 
      /> 
      
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      /> 

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <View style={{ marginTop: 10 }}>
        <Button title="Login dengan Biometrik" onPress={handleBiometric} color="green" />
      </View>

      <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
        Belum Punya Akun? Daftar Disini!
      </Text> 
      
      <Text onPress={() => navigation.navigate('ForgotPassword')} style={styles.link}>
        Lupa Password?
      </Text> 
    </View> 
  ); 
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 8 },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' }
});