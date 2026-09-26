import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { useOrders } from '@/context/AppContext';
import type { OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
};

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            No orders yet
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your order history will appear here once you place an order.
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
        My Orders
      </h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white rounded-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {order.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">
                ₹{order.total.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {order.items.map((item, idx) => (
                <Link
                  key={idx}
                  to={`/product/${item.productId}`}
                  className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-500">
                {order.items.length}{' '}
                {order.items.length === 1 ? 'item' : 'items'} •{' '}
                {order.paymentMethod}
              </p>
              <Link
                to={`/order-confirmation/${order.id}`}
                className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
