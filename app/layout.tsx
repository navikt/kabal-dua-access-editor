import '@/app/globals.css';

interface Props {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<Props>) => (
  <html lang="nb">
    <body className="min-w-full w-fit min-h-full">{children}</body>
  </html>
);

export default RootLayout;
