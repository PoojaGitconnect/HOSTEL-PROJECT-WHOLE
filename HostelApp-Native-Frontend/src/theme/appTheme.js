import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const commonColors = {
  primary_light: '#A2D5AB', // soft green
  primary_main: '#4CAF50', // hostel green (trusted, clean)
  primary_dark: '#357A38', // deep green

  iconGray: '#8A8A8A',
  iconhigh: '#B0BEC5',
  error_main: '#D32F2F',
  iconColor: '#7D7D7D',
  gray: '#757575',
  green: '#4CAF50',

  header: '#E3F2FD', // calm blue header background
  divider: '#C8E6C9', // soft green divider
  base: '#FAFAFA',
};

export const lightTheme = {
  ...MD3LightTheme,
  custom: 'lightTheme',
  colors: {
    ...MD3LightTheme.colors,
    ...commonColors,
    background_paper: '#FFFFFF',
    background_default: '#F5F5F5',
    background_neutral: '#E0F2F1', // minty neutral

    text_primary: '#1B5E20',
    text_secondary: '#4E342E',
    text_disabled: '#9E9E9E',
    text_temp:'#000000',//black
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  custom: 'darkTheme',
  colors: {
    ...MD3DarkTheme.colors,
    ...commonColors,
    background_paper: '#263238',
    background_default: '#121212',
    background_neutral: '#1E1E1E',

    text_primary: '#FFFFFF',
    text_secondary: '#B0BEC5',
    text_disabled: '#757575',
    text_temp:'#FFFFFF',
  },
  roundness: 12,
};
