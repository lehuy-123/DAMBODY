// src/app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import QuickActionMenu from '@/components/QuickActionMenu';
import { CartProvider } from '@/context/CartContext'; // ✅ thêm dòng này

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
      <body className="min-h-screen bg-black text-white">
        <CartProvider>
          <Header />
          <QuickActionMenu />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
