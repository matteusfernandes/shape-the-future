import './global.css';

import Providers from '@/providers';
import { WrapperPage } from '@/components/WrapperPage';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-Br">
      <body>
        <Providers>
          <WrapperPage>{children}</WrapperPage>
        </Providers>
      </body>
    </html>
  );
}
