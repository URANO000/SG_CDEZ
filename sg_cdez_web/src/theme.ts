import { createTheme } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export const zurquiTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: generateColors('#c1c98e'),
    secondary: generateColors('#90b6bf'),
  },
});