// AuthService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

// Register
export const registerUser = async (email : any, password : any) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const loginUser = async (email : any, password : any) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
   
  } catch (error) {
    console.error(error);
  };

};

// Logout
export const logoutUser = async () => {
  return await signOut(auth);
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    Alert.alert('Logged Out', 'You have been signed out.');
    await AsyncStorage.removeItem('user'); 
   
  } catch (error) {
    console.error('Logout error:', error);
    Alert.alert('Error', 'Failed to log out.');
  }
};

export const checkUserLoggedIn = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}
