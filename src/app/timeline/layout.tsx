import { Lexend } from 'next/font/google';

// Fonte de leitura fácil usada no conteúdo do cronograma; o header segue
// com a fonte do site
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

export default function TimelineLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={lexend.className}
      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {children}
    </div>
  );
}
