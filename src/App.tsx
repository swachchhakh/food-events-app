import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './theme';
import { Navigation } from './navigation'; // your custom navigator

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  // const scheme = useColorScheme();
  // const isDarkMode = scheme === 'dark';

  // const paperTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider>
      <Navigation
       
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </PaperProvider>
  );
}
