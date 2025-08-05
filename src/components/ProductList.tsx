'use client';


import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import styles from '@/styles/ProductList.module.css';

interface Product {
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
  parent?: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5001/api/products');
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5001/api/categories');
    setCategories(res.data);
  };

  const parentCategories = categories.filter((cat) => !cat.parent);
  const getChildCategories = (parentId: string) =>
    categories.filter((cat) => cat.parent === parentId);
  const getProductsByCategory = (categoryId: string) =>
    products.filter((p) => p.category === categoryId);

  return (
    <div className={styles.container}>
      {/* QUICK TAGS */}
      <div className={styles.quickMenu}>
        <div className={styles.tags}>
          <button className={`${styles.tag} ${styles.tagActive}`}>
            <MdOutlineLocalOffer />
            Flash Sale
          </button>
          <button className={styles.tag}>
            <MdOutlineLocalOffer />
            Giá dưới 100K
          </button>
          <button className={styles.tag}>
            <BsCheckCircleFill />
            Đồ công nghệ
          </button>
          <button className={styles.tag}>
            <MdOutlineLocalOffer />
            Hàng mới về
          </button>
        </div>
      </div>

      {/* CATEGORY SECTION */}
      {parentCategories.map((parent) => {
        const children = getChildCategories(parent._id);
        const activeChildId = activeTab[parent._id] || children[0]?._id;

        return (
          <div key={parent._id} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>{parent.name}</h3>

            <div className={styles.tabList}>
              {children.map((child) => (
                <button
                  key={child._id}
                  onClick={() =>
                    setActiveTab((prev) => ({ ...prev, [parent._id]: child._id }))
                  }
                  className={`${styles.tabButton} ${
                    activeChildId === child._id ? styles.tabButtonActive : ''
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>

            <div className={styles.productGrid}>
              {getProductsByCategory(activeChildId!).map((product) => (
                <ProductCard key={product._id} product={product} categories={categories} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
