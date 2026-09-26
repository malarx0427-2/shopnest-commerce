import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  LogOut,
  Edit2,
  Check,
  X,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            You're not logged in
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to view your profile and orders.
          </p>
          <Link
            to="/login?redirect=/profile"
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    updateUser(name.trim());
    setEditing(false);
    showToast('Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 md:pb-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-4">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-teal-700">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                  }}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-teal-600 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Link
          to="/orders"
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">My Orders</h3>
            <p className="text-xs text-gray-500">Track and view your orders</p>
          </div>
        </Link>
        <Link
          to="/wishlist"
          className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Wishlist</h3>
            <p className="text-xs text-gray-500">Your saved products</p>
          </div>
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-rose-600 font-semibold rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}
