import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !name.trim()) e.name = 'Name is required';
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Please enter a valid email';
    }
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (mode === 'login') {
      login(email);
      showToast('Welcome back to ShopNest!');
    } else {
      signup(name, email);
      showToast('Account created successfully!');
    }
    navigate(redirect);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-3">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'login'
                  ? 'Sign in to continue shopping'
                  : 'Join ShopNest to start shopping'}
              </p>
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  mode === 'signup'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                        errors.name
                          ? 'border-rose-300 focus:border-rose-500'
                          : 'border-gray-200 focus:border-teal-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                      errors.email
                        ? 'border-rose-300 focus:border-rose-500'
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                      errors.password
                        ? 'border-rose-300 focus:border-rose-500'
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to your email')}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-xs text-center text-gray-400 mt-4">
              This is a demo. No real authentication is performed. Your data is
              stored locally in your browser.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          <div className="text-center mt-2">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
