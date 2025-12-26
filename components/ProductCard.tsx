import Link from 'next/link';
import { Product } from '@/types';
import { FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate discount percentage if original price exists
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="block bg-surface rounded-lg overflow-hidden border border-transparent hover:border-border transition-all">
      <div className="relative aspect-[3/4] bg-gray-100">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-secondary hover:text-primary backdrop-blur-sm">
          <FiHeart />
        </button>
        {discount > 0 && (
          <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-secondary uppercase tracking-wide rounded-sm">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-secondary truncate mb-1">{product.title}</h3>
        <p className="text-xs text-muted truncate mb-2">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-secondary">₹{product.price}</span>
          {product.original_price && (
            <span className="text-xs text-muted line-through">₹{product.original_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
