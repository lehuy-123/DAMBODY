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

interface Variant {
  color: string;
  size: string;
  price: number;
  stock: number;
  material?: string;
  description?: string;
  status?: string;
  image?: File | null;
}

export default function ProductForm({ onCreated }: Props) {
  const [form, setForm] = useState<Omit<Product, '_id' | 'image' | 'variants'>>({
    name: '',
    price: 0,
    description: '',
    material: '',
    colors: '',
    sizes: '',
    category: '',
    status: 'Còn hàng',
  });

  const [variants, setVariants] = useState<Variant[]>([]);
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
      formData.append('main', imageFile);

      const variantData = variants.map((v) => {
        const { image, ...rest } = v;
        return {
          ...rest,
          imageName: image?.name || '',
        };
      });
      formData.append('variants', JSON.stringify(variantData));

      variants.forEach((v) => {
        if (v.image) {
          formData.append('variantImages', v.image);
        }
      });

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
      setVariants([]);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      alert(`❌ Lỗi khi thêm sản phẩm: ${err.response?.data?.message || 'Không xác định'}`);
    }
  };

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

  const inputStyle = { padding: '10px', borderRadius: '5px', border: 'none' };

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
      <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" required style={inputStyle} />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá" required style={inputStyle} />
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required style={inputStyle} />
      <input name="material" value={form.material} onChange={handleChange} placeholder="Chất liệu" style={inputStyle} />
      <input name="colors" value={form.colors} onChange={handleChange} placeholder="Màu sắc" style={inputStyle} />
      <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Size" style={inputStyle} />

      <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
        <option value="">-- Chọn danh mục --</option>
        {renderCategoryOptions()}
      </select>

      <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
        <option value="Còn hàng">Còn hàng</option>
        <option value="Hết hàng">Hết hàng</option>
      </select>

      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả sản phẩm" rows={4} style={{ gridColumn: 'span 2', ...inputStyle }} />

      {imageFile && (
        <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ gridColumn: 'span 2', width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px', marginTop: '10px' }} />
      )}

      <div style={{ gridColumn: 'span 2' }}>
        <h4>Tuỳ chọn biến thể</h4>
        {variants.map((v, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <input placeholder="Màu sắc" value={v.color} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].color = e.target.value;
              setVariants(newVars);
            }} style={inputStyle} />

            <input placeholder="Kích cỡ" value={v.size} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].size = e.target.value;
              setVariants(newVars);
            }} style={inputStyle} />

            <input type="number" placeholder="Giá" value={v.price} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].price = Number(e.target.value);
              setVariants(newVars);
            }} style={inputStyle} />

            <input type="number" placeholder="Kho" value={v.stock} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].stock = Number(e.target.value);
              setVariants(newVars);
            }} style={inputStyle} />

            <input placeholder="Chất liệu" value={v.material || ''} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].material = e.target.value;
              setVariants(newVars);
            }} style={inputStyle} />

            <input placeholder="Trạng thái" value={v.status || ''} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].status = e.target.value;
              setVariants(newVars);
            }} style={inputStyle} />

            <input placeholder="Mô tả" value={v.description || ''} onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].description = e.target.value;
              setVariants(newVars);
            }} style={inputStyle} />

            <input type="file" accept="image/*" onChange={(e) => {
              const newVars = [...variants];
              newVars[idx].image = e.target.files?.[0] || null;
              setVariants(newVars);
            }} style={inputStyle} />

            <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== idx))}>❌</button>
          </div>
        ))}

        <button type="button" onClick={() => setVariants([...variants, {
          color: '', size: '', price: 0, stock: 0, image: null,
          material: '', description: '', status: '',
        }])}>
          + Thêm biến thể
        </button>
      </div>

      <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#e60023', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
        Thêm sản phẩm
      </button>
    </form>
  );
}