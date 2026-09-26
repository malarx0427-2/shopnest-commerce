import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getDiscountPercent } from '@/data/products';
import Rating from '@/components/Rating';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (product: typeof items[0]) => {
    addToCart(product, 1, product.variants?.[0]);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Save your favorite items here for later.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
          >
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-4">
        My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((product) => {
          const discount = getDiscountPercent(
            product.price,
            product.originalPrice
          );
          return (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100"
            >
              <Link to={`/product/${product.id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-teal-600 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
