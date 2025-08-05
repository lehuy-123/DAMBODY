'use client';

import styles from '@/styles/Header.module.css';
import Image from 'next/image';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User } from '@/types/user'; // Đảm bảo đúng đường dẫn của bạn

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <>
      <header className={styles.header}>
        {/* Logo bên trái */}
        <div className={styles.logo}>
          <Image src="/images/logo.png" alt="Logo" width={72} height={72} />
        </div>

        {/* Trung tâm - Tìm kiếm */}
        <div className={styles.center}>
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className={styles.searchInput}
          />
          <span className={styles.searchLabel}>Tìm kiếm</span>
        </div>

        {/* Giỏ hàng và User bên phải */}
        <div className={styles.actions}>
          <div className={styles.cart}>
            <FiShoppingCart size={28} color="#fff" />
            <span className={styles.cartBadge}>43</span>
          </div>

          <div className={styles.user}>
            <FiUser size={28} color="#fff" />
            <div className={styles.userDropdown}>
              {user ? (
                <>
                  <p>👋 {user.email}</p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('token');
                      location.reload();
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">Đăng nhập</Link>
                 
                </>
              )}
            </div>
          </div>
        </div>
      </header>

 
     
    </>
  );
}
