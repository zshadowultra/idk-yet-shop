import Link from 'next/link';

const CATEGORIES = [
  { id: '1', name: 'Men', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Men' },
  { id: '2', name: 'Women', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Women' },
  { id: '3', name: 'Kids', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Kids' },
  { id: '4', name: 'Beauty', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Beauty' },
  { id: '5', name: 'Home', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Home' },
  { id: '6', name: 'Footwear', image: 'https://placehold.co/100x100/e0e0e0/282c3f?text=Shoes' },
];

export default function CategoryRail() {
  return (
    <div className="py-4 bg-surface mb-2">
      <div className="flex overflow-x-auto px-4 gap-6 no-scrollbar snap-x">
        {CATEGORIES.map((cat) => (
          <Link href={`/category/${cat.id}`} key={cat.id} className="flex flex-col items-center gap-2 snap-start min-w-[70px]">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-background p-0.5">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-xs font-medium text-secondary">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
