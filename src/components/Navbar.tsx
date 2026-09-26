import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Package,
  LogOut,
  Store,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AppContext';
import { categories } from '@/data/products';

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <button
              className="md:hidden p-2 -ml-2 text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Shop<span className="text-teal-600">Nest</span>
              </span>
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-4"
            >
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-100 border border-transparent rounded-l-xl focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 bg-gray-100 border border-l-0 border-transparent rounded-r-xl hover:bg-gray-200 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1 ml-auto md:ml-0">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-teal-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">Login</span>
                </Link>
              )}

              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-6 h-6 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-bold text-white bg-teal-600 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 h-11 -ml-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85%] bg-white shadow-xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-lg font-bold">
                Shop<span className="text-teal-600">Nest</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-100 rounded-l-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 bg-teal-600 text-white rounded-r-xl"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="px-2">
              <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-700"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
