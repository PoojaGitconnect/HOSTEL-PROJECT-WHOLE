import React, { useEffect } from 'react';
// import RNBootSplash from 'react-native-bootsplash';
import AppWithTheme from './src/main-navigator/AppwithTheme.js';
import { ThemeProvider } from './src/Context/ThemeContext.js';
import {ApiProvider} from './src/Context/Context';


export default function App() {
  // useEffect(() => {
  //   if (!isPlatformIOS) {
  //     // Hide the splash screen with fade effect after a delay
  //     setTimeout(() => {
  //       RNBootSplash.hide({fade: true, duration: 500});
  //     }, 200); // Set the time duration for which the splash screen is visible
  //     return () => {};
  //   }
  // }, []);

  return (
    <>
      <ApiProvider>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
      </ApiProvider>
    </>
  );
}
