'use client';

import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelect = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleQuantityChange = (index: number, change: number) => {
    const item = cart[index];
    const newQty = (item.quantity || 1) + change;
    if (newQty <= 0) return;
    const updated = [...cart];
    updated[index].quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(updated));
    updateCart?.(updated); // Gọi update nếu context có
  };

  const totalPrice = selectedItems.reduce(
    (sum, i) => sum + cart[i].price * (cart[i].quantity || 1),
    0
  );

  const handleOrder = () => {
    if (selectedItems.length === 0) return alert('Vui lòng chọn sản phẩm!');
    alert(
      `Đặt hàng thành công ${selectedItems.length} sản phẩm, tổng ${totalPrice.toLocaleString(
        'vi-VN'
      )}₫`
    );
  };

  const handleRemove = (index: number) => {
    removeFromCart(index);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>🛒 Giỏ hàng của bạn</h1>

      {!isClient ? (
        <p className={styles.empty}>Đang tải...</p>
      ) : cart.length === 0 ? (
        <p className={styles.empty}>Không có sản phẩm nào.</p>
      ) : (
        <>
          <ul className={styles.list}>
            {cart.map((item, index) => (
              <li key={index} className={styles.item}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(index)}
                  onChange={() => handleSelect(index)}
                />
                <img src={item.image} alt={item.name} className={styles.image} />
                <div className={styles.info}>
                  <h3>{item.name}</h3>
                  <p>
                    {item.variant?.color} / {item.variant?.size}
                  </p>
                  <p className={styles.price}>
                    {(item.price * (item.quantity || 1)).toLocaleString('vi-VN')}₫
                  </p>
                </div>

                <div className={styles.qtyBox}>
                  <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className={styles.removeBtn}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.footer}>
            <p>
              Tổng: <strong>{totalPrice.toLocaleString('vi-VN')}₫</strong>
            </p>
            <button onClick={handleOrder} className={styles.orderBtn}>
              Đặt hàng
            </button>
          </div>
        </>
      )}
    </main>
  );
}
