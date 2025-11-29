import React, {createContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Theme_key = '@app_theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(null);

  // Load theme on mount
  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(Theme_key);
      const systemTheme = Appearance.getColorScheme() || 'light';
      setTheme(storedTheme || systemTheme);
    };

    loadStoredTheme();

    const appearanceListener = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(prev => {
        if (!prev || prev === 'system') return colorScheme;
        return prev;
      });
    });

    return () => appearanceListener.remove();
  }, []);

  // Save selected theme
  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem(Theme_key, newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, setTheme: updateTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
