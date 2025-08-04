import styles from '@/styles/QuickActionMenu.module.css';
import { FaBoxOpen, FaTicketAlt, FaCommentDots, FaMapMarkerAlt, FaMoneyCheckAlt } from 'react-icons/fa';

const actions = [
  { icon: <FaBoxOpen />, label: 'Sản phẩm' },         // 🔁 Đổi icon và label tại đây
  { icon: <FaTicketAlt />, label: 'Voucher' },
  { icon: <FaCommentDots />, label: 'Tin nhắn' },
  { icon: <FaMapMarkerAlt />, label: 'Địa chỉ' },
  { icon: <FaMoneyCheckAlt />, label: 'Thanh toán' },
];

export default function QuickActionMenu() {
  return (
    <div className={styles.menuWrapper}>
      {actions.map((item, index) => (
        <div key={index} className={styles.menuItem}>
          <div className={styles.icon}>{item.icon}</div>
          <div className={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
