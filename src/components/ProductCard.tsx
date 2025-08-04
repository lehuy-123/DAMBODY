'use client';

import styles from '@/styles/ProductCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
  sold?: number;
  category?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Props {
  product?: Product;
  admin?: boolean;
  onDelete?: () => void;
  categories?: Category[];
}

export default function ProductCard({ product, admin, onDelete, categories }: Props) {
  if (!product) return null;

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : product.image
    ? `http://localhost:5001${product.image.startsWith('/') ? '' : '/'}${product.image}`
    : '/default-image.jpg';

  const categoryName = categories?.find((c) => c._id === product.category)?.name || 'Không rõ';

  return (
    <div className={styles.card}>
      <Link href={`/product/${product._id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={styles.image}
            priority
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.category}>Danh mục: {categoryName}</p>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            {product.sold && <span className={styles.sold}>Đã bán {product.sold}</span>}
          </div>
        </div>
      </Link>

      {admin && (
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          Xoá
        </button>
      )}
    </div>
  );
}