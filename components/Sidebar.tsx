import Link from 'next/link';
import { FiX, FiChevronRight, FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser, FiPhone, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-surface z-50 transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-40 bg-gradient-to-br from-primary to-primary-dark p-6 flex flex-col justify-end text-white relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
            <FiX className="text-2xl" />
          </button>
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white rounded-full p-1 shadow-lg">
               <img src="https://placehold.co/100x100/png?text=User" className="w-full h-full rounded-full object-cover" alt="User" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Welcome Guest</h3>
              <p className="text-xs opacity-80">Login to view orders</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-160px)] py-2">
          
          {/* Menu Section */}
          <div className="px-4 py-2">
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-4 px-2">Shop</h4>
            <div className="space-y-1">
              <Link href="/" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                <FiHome className="text-xl text-muted" />
                <span className="font-medium text-sm">Home</span>
              </Link>
              <Link href="/categories" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                <FiGrid className="text-xl text-muted" />
                <span className="font-medium text-sm">Categories</span>
              </Link>
              <Link href="/wishlist" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                <FiHeart className="text-xl text-muted" />
                <span className="font-medium text-sm">Wishlist</span>
              </Link>
              <Link href="/cart" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                <FiShoppingBag className="text-xl text-muted" />
                <span className="font-medium text-sm">My Bag</span>
              </Link>
            </div>

            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-6 px-2">Account</h4>
            <div className="space-y-1">
              <Link href="/account" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                <FiUser className="text-xl text-muted" />
                <span className="font-medium text-sm">Profile</span>
              </Link>
              <Link href="/admin" onClick={onClose} className="flex items-center justify-between px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex items-center gap-4">
                    <FiUser className="text-xl text-muted" />
                    <span className="font-medium text-sm">Admin Panel</span>
                 </div>
                 <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">NEW</span>
              </Link>
              <div className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <FiPhone className="text-xl text-muted" />
                <span className="font-medium text-sm">Help Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-gray-50">
           <button className="flex items-center justify-center gap-2 w-full text-primary font-bold text-sm py-2">
             <FiLogOut /> Log Out
           </button>
        </div>
      </div>
    </>
  );
}
