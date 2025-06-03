// src/theme.ts
import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme, MD3Theme, DefaultTheme } from 'react-native-paper';

// theme.ts
export const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
      primary: '#6200ee',
      text: '#000',
      card: '#fff',           // for tab bar background
      border: '#ccc',
      notification: '#f50057',
      tabActive: '#6200ee',
      tabInactive: '#888',
    },
  };
  
  export const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
      primary: '#bb86fc',
      text: '#fff',
      card: '#1f1f1f',         // tab bar background for dark
      border: '#272727',
      notification: '#ff80ab',
      tabActive: '#bb86fc',
      tabInactive: '#888',
    },
  };
  