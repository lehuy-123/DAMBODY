import './globals.css';
import Header from '@/components/Header';
import QuickActionMenu from '@/components/QuickActionMenu';

export const metadata = {
  title: 'TikTok Shop Clone',
  description: 'Website bán hàng giao diện TikTok Shop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <QuickActionMenu />
        <main>{children}</main>
      </body>
    </html>
  );
}
