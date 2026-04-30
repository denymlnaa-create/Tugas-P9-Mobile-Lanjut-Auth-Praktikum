import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext'; 

export default function HomeScreen() {
   const { user, logout } = useAuth(); 

   return (
     <View style={styles.container}>
       <Text style={styles.welcome}>Halo!</Text>
       <Text style={styles.email}>{user?.email}</Text> 

       <View style={{ marginTop: 20 }}>
         <Button 
           title="Logout" 
           onPress={() => logout()} 
           color="red" 
         />
       </View>
     </View>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
});