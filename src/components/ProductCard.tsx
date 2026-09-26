import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { getDiscountPercent } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import Rating from './Rating';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const wished = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      wished
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-teal-600 rounded-lg shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-rose-500 rounded-lg shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              wished
                ? 'fill-rose-500 text-rose-500'
                : 'text-gray-500'
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <span className="text-xs font-medium text-teal-600">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {product.name}
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-1.5 flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-600 hover:text-white transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
