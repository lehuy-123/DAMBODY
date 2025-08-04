import ProductDetail from '@/components/ProductDetail';

type Props = {
  params: { id: string };
};

export default function ProductPage({ params }: Props) {
  const { id } = params;

  // Tạm thời test dữ liệu cứng
  const product = {
    id,
    name: 'Tai nghe Bluetooth Gaming RGB',
    price: 359000,
    description: 'Tai nghe Bluetooth thiết kế đèn RGB, kết nối nhanh, âm thanh nổi.',
    image: '/test1.jpg',
  };

  return <ProductDetail product={product} />;
}
