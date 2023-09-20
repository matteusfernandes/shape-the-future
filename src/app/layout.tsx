import { ToastContainer } from 'react-toastify';

import './global.css';
import 'react-toastify/dist/ReactToastify.css';

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
          <WrapperPage>
            {children}
            <ToastContainer />
          </WrapperPage>
        </Providers>
      </body>
    </html>
  );
}
