'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  material: string;
  colors: string;
  sizes: string;
  category: string;
  status: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi load sản phẩm:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi khi load danh mục:', err);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const getCategoryName = (id: string): string => {
    return categories.find((c) => c._id === id)?.name || 'Không rõ';
  };

  return (
    <div style={{ padding: '2rem', background: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '1.5rem' }}>🛍️ Sản phẩm theo danh mục</h2>

      {Object.entries(groupedProducts).map(([categoryId, items]) => (
        <div key={categoryId} style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: '#f43f5e', fontSize: '20px', margin: '1rem 0' }}>{getCategoryName(categoryId)}</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {items.map((product) => (
              <ProductCard key={product._id} product={product} categories={categories} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
