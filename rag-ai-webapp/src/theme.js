// theme.js
import { defineStyle, defineStyleConfig, createMultiStyleConfigHelpers } from '@chakra-ui/react';

// Define your custom colors here
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    600: '#7122ff', // Primary purple
  },
};

const theme = {
  colors: colors,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
};

export default theme;
