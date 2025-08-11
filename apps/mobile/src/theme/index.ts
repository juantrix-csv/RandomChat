import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import { ColorSchemeName } from 'react-native';

export const LightTheme: Theme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
  },
};

export const DarkTheme: Theme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#000000',
    text: '#ffffff',
  },
};

export const getTheme = (scheme: ColorSchemeName | null): Theme =>
  scheme === 'dark' ? DarkTheme : LightTheme;
