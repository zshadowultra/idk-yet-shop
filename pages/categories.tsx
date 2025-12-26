import Layout from '@/components/Layout';
import Link from 'next/link';

const ALL_CATEGORIES = [
  { id: '1', name: 'Men', image: 'https://placehold.co/400x400/282c3f/fff?text=Men', color: 'bg-blue-50' },
  { id: '2', name: 'Women', image: 'https://placehold.co/400x400/ff3f6c/fff?text=Women', color: 'bg-pink-50' },
  { id: '3', name: 'Kids', image: 'https://placehold.co/400x400/FFA500/fff?text=Kids', color: 'bg-orange-50' },
  { id: '4', name: 'Beauty', image: 'https://placehold.co/400x400/e0e0e0/282c3f?text=Beauty', color: 'bg-gray-50' },
  { id: '5', name: 'Home', image: 'https://placehold.co/400x400/e0e0e0/282c3f?text=Home', color: 'bg-gray-50' },
  { id: '6', name: 'Footwear', image: 'https://placehold.co/400x400/e0e0e0/282c3f?text=Shoes', color: 'bg-gray-50' },
  { id: '7', name: 'Gadgets', image: 'https://placehold.co/400x400/e0e0e0/282c3f?text=Gadgets', color: 'bg-gray-50' },
  { id: '8', name: 'Jewelry', image: 'https://placehold.co/400x400/e0e0e0/282c3f?text=Jewelry', color: 'bg-gray-50' },
];

export default function Categories() {
  return (
    <Layout title="Categories">
      <div className="p-4">
        <h1 className="text-xl font-bold text-secondary mb-6">Shop by Category</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <Link 
                href={`/category/${cat.id}`} 
                key={cat.id} 
                className={`flex flex-col items-center rounded-xl p-4 gap-4 ${cat.color} transition-transform hover:scale-95`}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-white">
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-secondary text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
