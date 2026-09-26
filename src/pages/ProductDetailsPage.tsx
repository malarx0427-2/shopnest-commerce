import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { getProductById, getRelatedProducts, getDiscountPercent } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useRecentlyViewed } from '@/context/AppContext';
import Rating from '@/components/Rating';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.variants?.[0]
  );

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedVariant(product.variants?.[0]);
      setQuantity(1);
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
        <Link
          to="/products"
          className="text-teal-600 font-medium hover:underline"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const related = getRelatedProducts(product);
  const wished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    showToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(
      wished
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mt-4 mb-4 overflow-x-auto scrollbar-hide">
        <Link to="/" className="hover:text-teal-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-teal-600"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">
          {product.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="relative aspect-square bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-semibold text-white bg-teal-600 rounded-lg">
                {product.badge}
              </span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  wished
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-gray-600'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-medium text-teal-600">
            {product.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <Rating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
          </div>

          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-rose-500">
                  {discount}% off
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Inclusive of all taxes. Free shipping on this item.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {product.category === 'Fashion' ? 'Size' : 'Variant'}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                      selectedVariant === v
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-gray-600 hover:text-teal-600 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-gray-600 hover:text-teal-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Subtotal: ₹{(product.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 flex-1 py-3 bg-teal-50 text-teal-700 font-semibold rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  wished ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: RotateCcw, label: '7-Day Returns' },
              { icon: ShieldCheck, label: 'Warranty' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-1"
              >
                <item.icon className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-medium text-gray-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
