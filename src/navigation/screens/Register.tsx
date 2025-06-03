import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig'; // adjust path if needed
import { Navigation } from '..';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';

export  function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('Login')

    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TextInput
        style={styles.input}
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        left={<TextInput.Icon icon="email-outline" />}
        outlineColor="#ccc"
        activeOutlineColor="#6200ee"
      />

      <TextInput
       style={styles.input}
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        mode="outlined"
      left={<TextInput.Icon icon="lock-outline" />}
      outlineColor="#ccc"
      activeOutlineColor="#6200ee"
      />

      <Button mode="outlined" onPress={handleRegister}>Register</Button>
      <Button style={{marginTop: 10}} mode='text' onPress={() => navigation.navigate("Login")}>Already Have an account. Login Here</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  heading: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8, // will work if you use `theme` overrides
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});
