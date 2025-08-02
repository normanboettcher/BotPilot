import { useMediaQuery, useTheme } from '@mui/material';

const useBotResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');

  return {
    isMobile,
    isDarkTheme,
  };
};
export default useBotResponsive;
