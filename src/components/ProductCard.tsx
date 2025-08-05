'use client';

import styles from '@/styles/ProductCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  image: string;
  name: string;
  price?: number; // ✅ sửa thành optional
  sold?: number;
  category?: string;
  variants?: {
    color: string;
    size: string;
    price: number;
    stock: number;
  }[];
}

interface Category {
  _id: string;
  name: string;
  parent?: string | null;
  children?: Category[];
}

interface Props {
  product?: Product;
  admin?: boolean;
  onDelete?: () => void;
  categories?: Category[];
}

export default function ProductCard({ product, admin, onDelete, categories = [] }: Props) {
  if (!product) return null;

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : product.image
    ? `http://localhost:5001${product.image.startsWith('/') ? '' : '/'}${product.image}`
    : '/default-image.jpg';

  const flattenCategories = (cats: Category[]): Category[] => {
    let result: Category[] = [];
    for (const cat of cats) {
      result.push(cat);
      if (cat.children?.length) {
        result = result.concat(flattenCategories(cat.children));
      }
    }
    return result;
  };

  const categoryName =
    flattenCategories(categories).find((c) => c._id === product.category)?.name || 'Không rõ';

  const displayPrice =
    typeof product.price === 'number'
      ? product.price
      : product.variants?.[0]?.price;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product._id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.category}>Danh mục: {categoryName}</p>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {typeof displayPrice === 'number'
                ? displayPrice.toLocaleString('vi-VN') + '₫'
                : 'Giá chưa cập nhật'}
            </span>
            {product.sold && <span className={styles.sold}>Đã bán {product.sold}</span>}
          </div>
        </div>
      </Link>

      {admin && (
        <button
          className={styles.delete}
          onClick={(e) => {
            e.preventDefault(); // ✅ Ngăn link điều hướng
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
