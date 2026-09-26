import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Laptop,
  Shirt,
  Sparkles,
  Home as HomeIcon,
  BookOpen,
  Dumbbell,
  Watch,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { products, categories, getDiscountPercent } from '@/data/products';
import { useRecentlyViewed, useAuth } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

const iconMap: Record<string, typeof Laptop> = {
  Laptop,
  Shirt,
  Sparkles,
  Home: HomeIcon,
  BookOpen,
  Dumbbell,
  Watch,
};

export default function HomePage() {
  const { ids } = useRecentlyViewed();
  const { user } = useAuth();

  const popularProducts = products.filter((p) => p.badge === 'Bestseller').slice(0, 5);
  const bestDeals = [...products]
    .sort(
      (a, b) =>
        getDiscountPercent(b.price, b.originalPrice) -
        getDiscountPercent(a.price, a.originalPrice)
    )
    .slice(0, 5);
  const recentlyViewedProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 mt-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div className="relative px-6 py-12 md:px-16 md:py-20 max-w-2xl">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full mb-4">
            Mega Sale Live Now
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Shop smarter, live better with ShopNest
          </h1>
          <p className="text-teal-50 text-base md:text-lg mb-6 max-w-lg">
            Discover top-quality products across electronics, fashion, beauty
            and more. Up to 50% off on premium brands.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?sort=discount"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/30 text-white font-semibold rounded-xl border border-teal-300/50 hover:bg-teal-500/40 transition-colors"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹499' },
          { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected' },
          { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
          { icon: Tag, title: 'Best Prices', desc: 'Unbeatable deals daily' },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100"
          >
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Laptop;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 p-3 md:p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Products */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Popular Products
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Best Deals Banner */}
      <section className="mt-10">
        <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Best Deals of the Week
          </h2>
          <p className="text-rose-50 text-sm md:text-base">
            Limited time offers. Grab them before they're gone!
          </p>
        </div>
      </section>

      {/* Best Deals Products */}
      <section className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {bestDeals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA for non-logged-in users */}
      {!user && (
        <section className="mt-10 rounded-2xl bg-gray-900 p-6 md:p-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Join ShopNest today
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Create an account to track orders, save wishlist items, and enjoy a
            personalized shopping experience.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
          >
            Sign Up Now <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
