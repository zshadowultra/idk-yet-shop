import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiX, FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser, FiPhone, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Guest';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://placehold.co/100x100/1e293b/fff?text=U';
  const email = user?.email || 'Login to view orders';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-surface z-50 transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="h-44 bg-gradient-to-br from-primary to-primary-dark p-6 flex flex-col justify-end text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors z-20">
            <FiX className="text-xl" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white rounded-full p-0.5 shadow-lg overflow-hidden">
              <Image
                src={avatarUrl}
                width={56}
                height={56}
                className="w-full h-full rounded-full object-cover"
                alt="User avatar"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight truncate">
                {loading ? 'Loading...' : (user ? displayName : 'Welcome Guest')}
              </h3>
              <p className="text-xs opacity-80 truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-176px-72px)] py-4">

          {/* Login Button for guests */}
          {!user && !loading && (
            <div className="px-4 mb-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Login / Sign Up
              </button>
            </div>
          )}

          {/* Menu Section */}
          <div className="px-4">
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-3">Shop</h4>
            <div className="space-y-1">
              <Link href="/" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiHome className="text-lg text-muted" />
                <span className="font-medium text-sm">Home</span>
              </Link>
              <Link href="/categories" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiGrid className="text-lg text-muted" />
                <span className="font-medium text-sm">Categories</span>
              </Link>
              <Link href="/wishlist" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiHeart className="text-lg text-muted" />
                <span className="font-medium text-sm">Wishlist</span>
              </Link>
              <Link href="/cart" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiShoppingBag className="text-lg text-muted" />
                <span className="font-medium text-sm">My Bag</span>
              </Link>
            </div>

            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-6 px-3">Account</h4>
            <div className="space-y-1">
              <Link href="/account" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiUser className="text-lg text-muted" />
                <span className="font-medium text-sm">Profile</span>
              </Link>
              <Link href="/orders" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                <FiSettings className="text-lg text-muted" />
                <span className="font-medium text-sm">My Orders</span>
              </Link>

              {/* Admin Panel - only for admins */}
              {isAdmin && (
                <Link href="/admin" onClick={onClose} className="flex items-center justify-between px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <FiShield className="text-lg text-primary" />
                    <span className="font-medium text-sm">Admin Panel</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                </Link>
              )}

              <div className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-elevated rounded-xl transition-colors cursor-pointer">
                <FiPhone className="text-lg text-muted" />
                <span className="font-medium text-sm">Help Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full text-error font-semibold text-sm py-3 rounded-xl hover:bg-error/10 transition-colors"
            >
              <FiLogOut /> Sign Out
            </button>
          ) : (
            <p className="text-xs text-center text-muted">v1.0.0</p>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
