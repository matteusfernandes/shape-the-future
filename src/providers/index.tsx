'use client';

import { ThemeProvider } from 'styled-components';
import StyledComponentsRegistry from '@/lib/registry';
import theme from '@/theme';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledComponentsRegistry>
  );
}
