import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  
} from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { loginUser } from '../../services/AuthService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { colors } = useTheme(); 
  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (!user) {
        throw new Error('Login failed. Please check your credentials.');
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('User logged in:', user);
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('HomeTabs'); // Navigate to Home screen on successful login
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Title style={styles.title}>Welcome Back</Title>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
  style={styles.input}
  keyboardType="email-address"
  autoCapitalize="none"
  left={<TextInput.Icon icon="email-outline" />}
  outlineColor="#ccc"
  activeOutlineColor="#6200ee"
/>
<TextInput
  label="Password"
  value={password}
  secureTextEntry
  onChangeText={setPassword}
  mode="outlined"
  style={styles.input}
  left={<TextInput.Icon icon="lock-outline" />}
  outlineColor="#ccc"
  activeOutlineColor="#6200ee"
/>
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        >
          Go to Register
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8, // will work if you use `theme` overrides
  },
  button: {
    marginTop: 8,
  },

});
