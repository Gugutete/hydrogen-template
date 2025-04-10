import { extendTheme } from '@chakra-ui/react';

// Color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Custom colors
const colors = {
  brand: {
    500: '#7122ff', // Primary purple
    600: '#5a1acc',
  },
};

// Create the theme
const theme = extendTheme({
  config,
  colors,
});

export default theme;
