import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiGrid, FiUser, FiHeart } from 'react-icons/fi';

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/categories', icon: FiGrid, label: 'Categories' },
    { href: '/wishlist', icon: FiHeart, label: 'Wishlist' },
    { href: '/account', icon: FiUser, label: 'Account' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border h-16 flex justify-around items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${isActive
                ? 'text-primary'
                : 'text-muted hover:text-primary hover:bg-primary/10'
              }`}
          >
            <item.icon className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
