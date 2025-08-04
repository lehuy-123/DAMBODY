'use client';

import styles from '@/styles/ProductDetail.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export default function ProductDetail({ product }: { product: Product }) {
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    setFormattedPrice(product.price.toLocaleString('vi-VN') + '₫');
  }, [product.price]);

  return (
    <div className={styles.container}>
      <div className={styles.imageBox}>
        <Image
          src={`http://localhost:5001${product.image}`} // ✅ Đảm bảo có domain nếu ảnh từ backend
          alt={product.name}
          width={400}
          height={400}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.price}>{formattedPrice}</p>
        <p className={styles.description}>{product.description}</p>
        <button className={styles.addToCart}>Thêm vào giỏ hàng</button>
      </div>
    </div>
  );
}
