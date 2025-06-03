import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Button,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { auth, db } from '../../services/firebaseConfig';
import { ref, get } from 'firebase/database';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/placeholder';

export function Profile() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isloggedIn, setLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // 🔄 Fetch user data
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoggedIn(false);
      setUserInfo(null);
      return;
    }

    try {
      const snapshot = await get(ref(db, `users/${currentUser.uid}`));
      const profileData = snapshot.val();

      setUserInfo({
        email: currentUser.email,
        displayName: currentUser.displayName || profileData?.name || 'Anonymous',
        phone: currentUser.phoneNumber || profileData?.phone || 'Not provided',
        avatar: profileData?.avatar || DEFAULT_AVATAR,
      });
      setLoggedIn(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Unable to fetch profile data.');
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Check auth and load data
  const checkUser = async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchUserData();
    } else {
      setLoggedIn(false);
      setUserInfo(null);
      setLoading(false);
    }
  };

  // ✅ Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        setUserInfo(null);
        setLoggedIn(false);
        setLoading(false);
      }
    });

    return unsubscribe; // cleanup
  }, []);

  // ⏱ Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkUser();
    setRefreshing(false);
  }, []);

  // 🔓 Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUserInfo(null);
      setLoggedIn(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  // ⌛ Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#444" />
      </View>
    );
  }

  // 👤 Profile or Login prompt
  return (
    <ScrollView
      contentContainerStyle={isloggedIn ? styles.container : styles.center}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {isloggedIn && userInfo ? (
        <>
          <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{userInfo.displayName}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
          <Text style={styles.phone}>📞 {userInfo.phone}</Text>

          <Button title="Logout" onPress={handleLogout} color="#d9534f" />
        </>
      ) : (
        <>
          <Text style={styles.error}>Please login to view your profile.</Text>
          <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
