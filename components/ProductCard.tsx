import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="block bg-surface rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-300 group focus-ring"
    >
      <div className="relative aspect-[3/4] bg-surface-elevated overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
          <button
            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider roundedShadow-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Quick Add
            }}
          >
            Quick Add
          </button>
        </div>

        <button
          className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
        >
          <FiHeart className="w-5 h-5" />
        </button>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-secondary truncate mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
        <p className="text-xs text-muted truncate mb-3">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-secondary">₹{product.price}</span>
          {product.original_price && (
            <span className="text-xs text-muted line-through decoration-slate-400">₹{product.original_price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
