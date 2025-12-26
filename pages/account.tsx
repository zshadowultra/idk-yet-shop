import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiBox, FiHeart, FiSettings, FiCreditCard, FiHeadphones, FiChevronRight, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function Account() {
    const { user, profile, isAdmin, loading, signOut } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            setIsLoginOpen(true);
        }
    }, [loading, user]);

    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Guest';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://placehold.co/100x100/1e293b/fff?text=U';
    const email = user?.email || '';

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <Layout title="My Account">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="My Account">
            <div className="bg-gradient-to-br from-secondary to-gray-900 dark:from-primary dark:to-primary-dark text-white p-6 pb-14 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                {user ? (
                    <div className="flex items-center gap-4 relative z-10 mt-4">
                        <div className="w-16 h-16 bg-white p-1 rounded-full relative overflow-hidden shadow-lg">
                            <Image
                                src={avatarUrl}
                                width={64}
                                height={64}
                                className="w-full h-full rounded-full object-cover"
                                alt="Profile"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold truncate">{displayName}</h1>
                            <p className="text-sm opacity-70 truncate">{email}</p>
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1 mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    <FiShield className="text-[10px]" /> Admin
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 mt-4">
                        <h1 className="text-xl font-bold">Welcome</h1>
                        <p className="text-sm opacity-70">Sign in to manage your account</p>
                    </div>
                )}
            </div>

            <div className="-mt-6 px-4 pb-8 space-y-4 relative z-20">
                {/* Quick Actions Card */}
                <div className="bg-surface rounded-xl shadow-lg p-4 grid grid-cols-2 gap-4 border border-border">
                    <Link href="/orders" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-surface-elevated transition-colors">
                        <FiBox className="text-2xl text-primary" />
                        <span className="text-xs font-semibold text-secondary">Orders</span>
                    </Link>
                    <Link href="/wishlist" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-surface-elevated transition-colors">
                        <FiHeart className="text-2xl text-primary" />
                        <span className="text-xs font-semibold text-secondary">Wishlist</span>
                    </Link>
                </div>

                {/* Menu Options */}
                <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-surface-elevated transition-colors">
                        <div className="flex items-center gap-4">
                            <FiCreditCard className="text-muted text-xl" />
                            <div>
                                <h4 className="font-semibold text-secondary text-sm">Saved Cards & Wallets</h4>
                                <p className="text-xs text-muted">Save cards for faster checkout</p>
                            </div>
                        </div>
                        <FiChevronRight className="text-muted" />
                    </div>
                    <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-surface-elevated transition-colors">
                        <div className="flex items-center gap-4">
                            <FiSettings className="text-muted text-xl" />
                            <div>
                                <h4 className="font-semibold text-secondary text-sm">Account Settings</h4>
                                <p className="text-xs text-muted">Manage your preferences</p>
                            </div>
                        </div>
                        <FiChevronRight className="text-muted" />
                    </div>
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-elevated transition-colors">
                        <div className="flex items-center gap-4">
                            <FiHeadphones className="text-muted text-xl" />
                            <div>
                                <h4 className="font-semibold text-secondary text-sm">Help Center</h4>
                                <p className="text-xs text-muted">FAQs, Contact Support</p>
                            </div>
                        </div>
                        <FiChevronRight className="text-muted" />
                    </div>
                </div>

                {user ? (
                    <button
                        onClick={handleSignOut}
                        className="w-full py-3 border border-border bg-surface text-error font-semibold text-sm rounded-xl shadow-sm hover:bg-error/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiLogOut /> Sign Out
                    </button>
                ) : (
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className="w-full py-3 bg-primary text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-primary-dark transition-colors"
                    >
                        Login / Sign Up
                    </button>
                )}

                <div className="text-center text-xs text-muted mt-8">
                    App Version 1.0.0
                </div>
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </Layout>
    );
}
