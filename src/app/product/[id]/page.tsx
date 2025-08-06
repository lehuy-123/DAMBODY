'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext'; // ✅ import context giỏ hàng

interface Variant {
  color: string;
  size: string;
  price: number;
  stock: number;
  material?: string;
  description?: string;
  status?: string;
  image?: string;
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
  const [selectedIndex, setSelectedIndex] = useState<string>(''); // giữ index dạng string

  const { addToCart } = useCart(); // ✅ dùng context giỏ hàng

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

  const selectedVariant =
    selectedIndex === '' ? null : product?.variants?.[parseInt(selectedIndex)];

  const displayedImage = selectedVariant?.image
    ? `http://localhost:5001${selectedVariant.image}`
    : product?.image?.startsWith('http')
    ? product.image
    : `http://localhost:5001${product?.image}`;

  const displayedPrice =
    selectedVariant?.price ?? product?.price ?? product?.variants?.[0]?.price;

  const displayedMaterial = selectedVariant?.material ?? product?.material;
  const displayedDescription = selectedVariant?.description ?? product?.description;
  const displayedColor = selectedVariant?.color ?? product?.colors;
  const displayedSize = selectedVariant?.size ?? product?.sizes;
  const displayedStatus = selectedVariant?.status ?? product?.status;

  const handleOrderNow = () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn biến thể trước khi đặt hàng.');
      return;
    }

    alert(
      `Bạn đã đặt sản phẩm: ${product?.name}\nMàu: ${selectedVariant.color}\nKích cỡ: ${selectedVariant.size}\nGiá: ${selectedVariant.price.toLocaleString('vi-VN')}₫`
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      name: product.name,
      image: displayedImage,
      price: displayedPrice || 0,
      variant: selectedVariant
        ? {
            color: selectedVariant.color,
            size: selectedVariant.size,
          }
        : undefined,
      quantity: 1,
    };

    addToCart(cartItem);
    alert('✅ Đã thêm vào giỏ hàng!');
  };

  if (loading) return <p className={styles.loading}>Đang tải...</p>;
  if (!product) return <p className={styles.error}>Không tìm thấy sản phẩm.</p>;

  return (
    <main className={styles.detailContainer}>
      <div className={styles.imageBox}>
        <Image
          src={displayedImage}
          alt={product.name}
          width={500}
          height={500}
          className={styles.productImage}
        />
      </div>

      <div className={styles.infoBox}>
        <h1 className={styles.productName}>{product.name}</h1>

        {product.variants && product.variants.length > 0 && (
          <>
            <label><strong>Chọn biến thể:</strong></label>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
            >
              <option value="">Sản phẩm chính</option>
              {product.variants.map((variant, index) => (
                <option key={index} value={index}>
                  {variant.color} / {variant.size} - {variant.price.toLocaleString('vi-VN')}₫ (Còn {variant.stock})
                </option>
              ))}
            </select>
          </>
        )}

        <p className={styles.price}>
          {displayedPrice?.toLocaleString('vi-VN')}₫
        </p>

        <p className={styles.status}>
          <strong>Trạng thái:</strong> {displayedStatus || 'Đang cập nhật'}
        </p>

        <div className={styles.meta}>
          {displayedDescription && <p><strong> Mô tả:</strong> {displayedDescription}</p>}
          {displayedMaterial && <p><strong> Chất liệu:</strong> {displayedMaterial}</p>}
          {displayedColor && <p><strong> Màu sắc:</strong> {displayedColor}</p>}
          {displayedSize && <p><strong> Kích cỡ:</strong> {displayedSize}</p>}
          {categoryName && <p><strong>📂 Danh mục:</strong> {categoryName}</p>}
        </div>

        <div className={styles.actions}>
          <button className={styles.buyBtn} onClick={handleAddToCart}>🛒 Thêm vào giỏ hàng</button>
          <button className={styles.orderBtn} onClick={handleOrderNow}>🧾 Đặt hàng ngay</button>
          <a href="tel:0123456789" className={styles.contactBtn}>📞 Liên hệ tư vấn</a>
        </div>
      </div>
    </main>
  );
}
