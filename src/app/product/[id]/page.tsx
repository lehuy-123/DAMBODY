'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './page.module.css';

interface Variant {
  color: string;
  size: string;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  price?: number;
  image: string;
  description?: string;
  material?: string;
  colors?: string;
  sizes?: string;
  category: string;
  status?: string;
  variants?: Variant[];
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);

        if (res.data.category) {
          const catRes = await axios.get<Category>(
            `http://localhost:5001/api/categories/${res.data.category}`
          );
          setCategoryName(catRes.data.name);
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrderNow = () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn biến thể trước khi đặt hàng.');
      return;
    }

    alert(
      `Bạn đã đặt sản phẩm: ${product?.name}\nMàu: ${selectedVariant.color}\nKích cỡ: ${selectedVariant.size}\nGiá: ${selectedVariant.price.toLocaleString('vi-VN')}₫`
    );
  };

  if (loading) return <p className={styles.loading}>Đang tải...</p>;
  if (!product) return <p className={styles.error}>Không tìm thấy sản phẩm.</p>;

  const fallbackPrice =
    typeof product.price === 'number'
      ? product.price
      : product.variants?.[0]?.price;

  return (
    <main className={styles.detailContainer}>
      <div className={styles.imageBox}>
        <Image
          src={
            product.image.startsWith('http')
              ? product.image
              : `http://localhost:5001${product.image}`
          }
          alt={product.name}
          width={500}
          height={500}
          className={styles.productImage}
        />
      </div>

      <div className={styles.infoBox}>
        <h1 className={styles.productName}>{product.name}</h1>

        {/* Chọn biến thể nếu có */}
        {product.variants && product.variants.length > 0 && (
          <>
            <label><strong>Chọn biến thể:</strong></label>
            <select
              onChange={(e) => {
                const index = Number(e.target.value);
                if (!isNaN(index) && product.variants && product.variants[index]) {
                  setSelectedVariant(product.variants[index]);
                } else {
                  setSelectedVariant(null);
                }
              }}
            >
              <option value="">Chọn màu / size</option>
              {product.variants.map((variant, index) => (
                <option key={index} value={index}>
                  {variant.color} / {variant.size} - {variant.price.toLocaleString('vi-VN')}₫ (Còn {variant.stock})
                </option>
              ))}
            </select>
          </>
        )}

        {/* Giá hiển thị */}
        <p className={styles.price}>
          {(selectedVariant?.price ?? fallbackPrice)?.toLocaleString('vi-VN')}₫
        </p>

        <p className={styles.status}>
          <strong>Trạng thái:</strong> {product.status || 'Đang cập nhật'}
        </p>

        <div className={styles.meta}>
          {product.description && <p><strong>📝 Mô tả:</strong> {product.description}</p>}
          {product.material && <p><strong>🔧 Chất liệu:</strong> {product.material}</p>}
          {product.colors && <p><strong>🎨 Màu sắc:</strong> {product.colors}</p>}
          {product.sizes && <p><strong>📏 Kích cỡ:</strong> {product.sizes}</p>}
          {categoryName && <p><strong>📂 Danh mục:</strong> {categoryName}</p>}
        </div>

        <div className={styles.actions}>
          <button className={styles.buyBtn}>🛒 Thêm vào giỏ hàng</button>
          <button className={styles.orderBtn} onClick={handleOrderNow}>🧾 Đặt hàng ngay</button>
          <a href="tel:0123456789" className={styles.contactBtn}>📞 Liên hệ tư vấn</a>
        </div>
      </div>
    </main>
  );
}
