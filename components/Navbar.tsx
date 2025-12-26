import Link from 'next/link';
import { useState } from 'react';
import { FiSearch, FiShoppingBag, FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import LoginModal from './LoginModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md shadow-sm border-b border-border h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-1 text-secondary rounded-xl transition-all duration-200 hover:bg-surface-elevated hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FiMenu className="text-xl" />
          </button>
          <Link href="/" className="text-xl md:text-2xl font-bold text-primary tracking-tight transition-opacity duration-200 hover:opacity-80">
            DesiThreads
          </Link>
        </div>

        <div className="hidden md:flex flex-1 mx-8 max-w-xl relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
          />
          <FiSearch className="absolute left-4 top-3 text-muted" />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button className="p-2 text-secondary rounded-xl transition-all duration-200 hover:bg-surface-elevated hover:text-primary md:hidden">
            <FiSearch className="text-xl" />
          </button>

          <Link href="/cart" className="relative p-2 rounded-xl transition-all duration-200 hover:bg-surface-elevated group">
            <FiShoppingBag className="text-xl text-secondary transition-colors duration-200 group-hover:text-primary" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {!user && (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hidden md:block ml-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
