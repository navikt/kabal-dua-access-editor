import '@/app/globals.css';

interface Props {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<Props>) => (
  <html lang="nb">
    <body className="w-fit">{children}</body>
  </html>
);

export default RootLayout;
