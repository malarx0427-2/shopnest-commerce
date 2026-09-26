import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { categories } from '@/data/products';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-teal-500">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop shop for everything you love. Quality products,
              unbeatable prices, delivered to your door.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-teal-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-teal-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-teal-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-teal-500" />
                support@shopnest.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-teal-500" />
                1800-123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-teal-500" />
                Tech Park, Bangalore
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            This is a demo project. No real payments are processed.
          </p>
        </div>
      </div>
    </footer>
  );
}
