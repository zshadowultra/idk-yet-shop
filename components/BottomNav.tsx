import Link from 'next/link';
import { FiHome, FiGrid, FiUser, FiHeart } from 'react-icons/fi';

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-16 flex justify-around items-center z-50 pb-safe">
      <Link href="/" className="flex flex-col items-center gap-1 text-primary">
        <FiHome className="text-xl" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/categories" className="flex flex-col items-center gap-1 text-secondary">
        <FiGrid className="text-xl" />
        <span className="text-[10px] font-medium">Categories</span>
      </Link>
      <Link href="/wishlist" className="flex flex-col items-center gap-1 text-secondary">
        <FiHeart className="text-xl" />
        <span className="text-[10px] font-medium">Wishlist</span>
      </Link>
      <Link href="/admin" className="flex flex-col items-center gap-1 text-secondary">
        <FiUser className="text-xl" />
        <span className="text-[10px] font-medium">Account</span>
      </Link>
    </div>
  );
}
