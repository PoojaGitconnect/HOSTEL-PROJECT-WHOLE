import React, { useContext, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './AppNavigator.js';
import { darkTheme, lightTheme } from '../theme/appTheme';
import { ThemeContext } from '../Context/ThemeContext';

export default function AppWithTheme() {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme == 'dark' ? darkTheme : lightTheme;
  return (
    <>
      {/* Paper Provider for REACT-NATIVE-PAPER */}
      <PaperProvider theme={currentTheme}>
        {/* Theme Provider to provide the theme */}
        <AppNavigator />
        {/* Main App Navigator */}
      </PaperProvider>
    </>
  );
}
