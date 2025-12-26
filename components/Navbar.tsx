import Link from 'next/link';
import { useState } from 'react';
import { FiSearch, FiShoppingBag, FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-surface shadow-sm border-b border-border h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 -ml-1 text-secondary md:hidden">
            <FiMenu className="text-2xl" />
          </button>
          <Link href="/" className="text-2xl font-bold text-primary tracking-tighter">
            DesiThreads
          </Link>
        </div>

        <div className="hidden md:flex flex-1 mx-10 max-w-lg relative">
          <input 
            type="text" 
            placeholder="Search for products, brands and more"
            className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
          />
          <FiSearch className="absolute left-3 top-2.5 text-muted" />
        </div>

        <div className="flex items-center gap-4">
          <FiSearch className="text-2xl text-secondary md:hidden" />
          <Link href="/cart" className="relative">
            <FiShoppingBag className="text-2xl text-secondary" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
