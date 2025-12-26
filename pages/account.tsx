import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiBox, FiHeart, FiSettings, FiCreditCard, FiHeadphones, FiChevronRight, FiEdit2 } from 'react-icons/fi';

export default function Account() {
  return (
    <Layout title="My Account">
      <div className="bg-gradient-to-br from-secondary to-gray-900 text-white p-6 pb-12 relative overflow-hidden">
         {/* Abstract BG shapes */}
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="flex items-center gap-4 relative z-10 mt-4">
             <div className="w-16 h-16 bg-white p-1 rounded-full relative">
                <img src="https://placehold.co/100x100/png?text=JD" className="w-full h-full rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 bg-primary p-1 rounded-full border-2 border-secondary">
                    <FiEdit2 className="text-[10px]" />
                </div>
             </div>
             <div>
                 <h1 className="text-xl font-bold">John Doe</h1>
                 <p className="text-sm opacity-70">+91 98765 43210</p>
             </div>
         </div>
      </div>

      <div className="-mt-6 px-4 pb-8 space-y-4 relative z-20">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 grid grid-cols-2 gap-4">
             <Link href="/orders" className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-50">
                 <FiBox className="text-2xl text-primary" />
                 <span className="text-xs font-bold text-secondary">Orders</span>
             </Link>
             <Link href="/wishlist" className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-50">
                 <FiHeart className="text-2xl text-primary" />
                 <span className="text-xs font-bold text-secondary">Wishlist</span>
             </Link>
          </div>

          {/* Menu Options */}
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
             <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-gray-50">
                 <div className="flex items-center gap-4">
                    <FiCreditCard className="text-muted text-xl" />
                    <div>
                        <h4 className="font-bold text-secondary text-sm">Saved Cards & Wallets</h4>
                        <p className="text-[10px] text-muted">Save cards for faster checkout</p>
                    </div>
                 </div>
                 <FiChevronRight className="text-muted" />
             </div>
             <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-gray-50">
                 <div className="flex items-center gap-4">
                    <FiSettings className="text-muted text-xl" />
                    <div>
                        <h4 className="font-bold text-secondary text-sm">Account Settings</h4>
                        <p className="text-[10px] text-muted">Change password, address</p>
                    </div>
                 </div>
                 <FiChevronRight className="text-muted" />
             </div>
             <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                 <div className="flex items-center gap-4">
                    <FiHeadphones className="text-muted text-xl" />
                    <div>
                        <h4 className="font-bold text-secondary text-sm">Help Center</h4>
                        <p className="text-[10px] text-muted">FAQs, Contact Support</p>
                    </div>
                 </div>
                 <FiChevronRight className="text-muted" />
             </div>
          </div>
          
           <button className="w-full py-3 border border-border bg-white text-primary font-bold text-sm uppercase rounded shadow-sm">
             Log Out
           </button>
           
           <div className="text-center text-xs text-muted mt-8">
               App Version 1.0.0
           </div>
      </div>
    </Layout>
  );
}
