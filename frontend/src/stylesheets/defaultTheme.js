import { extendTheme } from 'native-base';

function defaultTheme() {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#f1fbe9',
        100: '#e3f7d1',
        200: '#c7ef9f',
        300: '#a9e66d',
        400: '#8cde3b',
        500: '#6fd509',
        600: '#5fbf08',
        700: '#4da707',
        800: '#3b9006',
        900: '#2a7905',
      },
      secondary: {
        50: '#f1f1f1',
        100: '#e3e3e3',
        200: '#c7c7c7',
        300: '#a9a9a9',
        400: '#8c8c8c',
        500: '#6f6f6f',
        600: '#5f5f5f',
        700: '#4d4d4d',
        800: '#3b3b3b',
        900: '#2a2a2a',
      },
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to system settings
      useSystemColorMode: true,
    },
  });
  return theme;
}

export default defaultTheme;
