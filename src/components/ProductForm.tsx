'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import type { Product } from '@/types/Product';

interface Props {
  onCreated: () => void;
}

interface Category {
  _id: string;
  name: string;
  parent?: Category | null | string;
}

export default function ProductForm({ onCreated }: Props) {
  const [form, setForm] = useState<Omit<Product, '_id' | 'image'>>({
    name: '',
    price: 0,
    description: '',
    material: '',
    colors: '',
    sizes: '',
    category: '',
    status: 'Còn hàng',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error('Lỗi khi tải danh mục:', err);
        alert('Không thể tải danh mục sản phẩm');
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) return alert('Vui lòng chọn ảnh');
    if (imageFile.size > 5 * 1024 * 1024) return alert('Ảnh vượt quá 5MB');
    if (!imageFile.type.startsWith('image/')) return alert('Tệp không phải ảnh');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      formData.append('image', imageFile);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('✅ Thêm sản phẩm thành công');
      onCreated();
      setForm({
        name: '',
        price: 0,
        description: '',
        material: '',
        colors: '',
        sizes: '',
        category: '',
        status: 'Còn hàng',
      });
      setImageFile(null);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(`❌ Lỗi khi thêm sản phẩm: ${err.response?.data?.message || 'Không xác định'}`);
    }
  };

  // ✅ Render tất cả danh mục con theo dạng cây rẽ nhánh (vô tận cấp)
const renderCategoryOptions = (parentId: string | null = null, level = 0): React.ReactNode[] => {


    return categories
      .filter((cat) => {
        const parent = typeof cat.parent === 'string' ? cat.parent : cat.parent?._id || null;
        return parent === parentId;
      })
      .flatMap((cat) => [
        <option key={cat._id} value={cat._id}>
          {'— '.repeat(level) + cat.name}
        </option>,
        ...renderCategoryOptions(cat._id, level + 1),
      ]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: '1fr 1fr',
        padding: '2rem',
        background: '#1a1a1a',
        borderRadius: '10px',
        marginBottom: '2rem',
        color: '#fff',
      }}
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên sản phẩm"
        required
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Giá"
        required
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        required
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />
      <input
        name="material"
        value={form.material}
        onChange={handleChange}
        placeholder="Chất liệu"
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />
      <input
        name="colors"
        value={form.colors}
        onChange={handleChange}
        placeholder="Màu sắc"
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />
      <input
        name="sizes"
        value={form.sizes}
        onChange={handleChange}
        placeholder="Size"
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      >
        <option value="">-- Chọn danh mục --</option>
        {renderCategoryOptions()}
      </select>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
      >
        <option value="Còn hàng">Còn hàng</option>
        <option value="Hết hàng">Hết hàng</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả sản phẩm"
        rows={4}
        style={{ gridColumn: 'span 2', padding: '10px', borderRadius: '5px', border: 'none' }}
      />

      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="preview"
          style={{
            gridColumn: 'span 2',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '8px',
            marginTop: '10px',
          }}
        />
      )}

      <button
        type="submit"
        style={{
          gridColumn: 'span 2',
          padding: '12px',
          backgroundColor: '#e60023',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Thêm sản phẩm
      </button>
    </form>
  );
}
