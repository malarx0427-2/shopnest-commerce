import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const items = [
    { to: '/', icon: Home, label: 'Home', active: isActive('/') },
    {
      to: '/products',
      icon: Search,
      label: 'Shop',
      active: location.pathname.startsWith('/products'),
    },
    {
      to: '/wishlist',
      icon: Heart,
      label: 'Wishlist',
      active: isActive('/wishlist'),
    },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', active: isActive('/cart') },
    {
      to: '/profile',
      icon: User,
      label: 'Profile',
      active: isActive('/profile'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5"
          >
            <item.icon
              className={`w-5 h-5 ${
                item.active ? 'text-teal-600' : 'text-gray-400'
              }`}
            />
            <span
              className={`text-[10px] font-medium ${
                item.active ? 'text-teal-600' : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
