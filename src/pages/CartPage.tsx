import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AppContext';

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_THRESHOLD = 499;

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartSavings,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryCharge =
    cartTotal === 0 || cartTotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_CHARGE;
  const total = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-4">
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variant}`}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100"
            >
              <Link
                to={`/product/${item.product.id}`}
                className="flex-shrink-0"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-teal-600 line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                {item.variant && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.variant}
                  </p>
                )}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{item.product.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-gray-600 hover:text-teal-600 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1.5 text-gray-600 hover:text-teal-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-rose-500 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 p-5 bg-white rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-gray-900">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>You save</span>
                  <span className="font-medium">
                    -₹{cartSavings.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery charge</span>
                <span className="font-medium text-gray-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-400 bg-amber-50 p-2 rounded-lg">
                  Add ₹{(FREE_DELIVERY_THRESHOLD - cartTotal).toLocaleString()}{' '}
                  more for free delivery
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
