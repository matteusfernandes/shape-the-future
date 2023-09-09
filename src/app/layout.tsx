export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-Br">
      <body>{children}</body>
    </html>
  );
}
