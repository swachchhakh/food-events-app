// components/RequireAuth.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export function RequireAuth(WrappedComponent: React.ComponentType<any>) {
  return function (props: any) {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
      const checkAuth = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setLoggedIn(true);
        }
        else {
          setLoggedIn(false);
        }
        
      };
      checkAuth();
    }, []);

    if (loading) {
      return <ActivityIndicator />;
    }

    if (!loggedIn) {
      navigation.navigate('Login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
