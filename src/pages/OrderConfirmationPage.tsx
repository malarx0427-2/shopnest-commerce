import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, ArrowRight } from 'lucide-react';
import { useOrders } from '@/context/AppContext';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Order not found
        </h1>
        <Link
          to="/products"
          className="text-teal-600 font-medium hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 md:pb-0">
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-gray-500">
          Thank you for shopping with ShopNest. Your order is being processed.
        </p>
        <div className="mt-3 px-4 py-2 bg-teal-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Order ID:{' '}
            <span className="font-bold text-teal-700">{order.id}</span>
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="p-5 bg-white rounded-2xl border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-gray-900">
            Ordered Items ({order.items.length})
          </h2>
        </div>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}
                  {item.variant && ` • ${item.variant}`}
                </p>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>
              ₹{(order.total - order.deliveryCharge).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>
              {order.deliveryCharge === 0
                ? 'FREE'
                : `₹${order.deliveryCharge}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total Paid</span>
            <span>₹{order.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400 pt-1">
            Payment Method: {order.paymentMethod}
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="p-5 bg-white rounded-2xl border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-gray-900">
            Delivery Information
          </h2>
        </div>
        <div className="text-sm text-gray-600 space-y-0.5">
          <p className="font-medium text-gray-900">{order.address.fullName}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.line1}</p>
          {order.address.line2 && <p>{order.address.line2}</p>}
          <p>
            {order.address.city}, {order.address.state} -{' '}
            {order.address.pincode}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/orders"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Package className="w-5 h-5" /> View My Orders
        </Link>
        <Link
          to="/products"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
