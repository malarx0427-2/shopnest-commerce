import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth, useOrders } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import type { Address, Order, OrderItem } from '@/types';

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_THRESHOLD = 499;

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryCharge =
    cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = cartTotal + deliveryCharge;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.fullName.trim()) e.fullName = 'Required';
    if (!address.phone.trim()) {
      e.phone = 'Required';
    } else if (!/^\d{10}$/.test(address.phone)) {
      e.phone = 'Enter a valid 10-digit phone number';
    }
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!address.pincode.trim()) {
      e.pincode = 'Required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      e.pincode = 'Enter a valid 6-digit pincode';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast('Please fill in all required fields');
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
      variant: item.variant,
    }));

    const order: Order = {
      id: 'SN' + Date.now().toString().slice(-8),
      items: orderItems,
      total,
      deliveryCharge,
      address,
      paymentMethod:
        paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Demo)',
      status: 'Processing',
      date: Date.now(),
    };

    addOrder(order);
    clearCart();
    showToast('Order placed successfully!');
    navigate(`/order-confirmation/${order.id}`);
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
      errors[field]
        ? 'border-rose-300 focus:border-rose-500'
        : 'border-gray-200 focus:border-teal-500'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-4">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Address */}
          <section className="p-5 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Delivery Address
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className={inputClass('fullName')}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-500 mt-0.5">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  placeholder="9876543210"
                  maxLength={10}
                  className={inputClass('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-0.5">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Pincode *
                </label>
                <input
                  type="tel"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  placeholder="560001"
                  maxLength={6}
                  className={inputClass('pincode')}
                />
                {errors.pincode && (
                  <p className="text-xs text-rose-500 mt-0.5">
                    {errors.pincode}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                  placeholder="House no, Building, Street"
                  className={inputClass('line1')}
                />
                {errors.line1 && (
                  <p className="text-xs text-rose-500 mt-0.5">
                    {errors.line1}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) =>
                    setAddress({ ...address, line2: e.target.value })
                  }
                  placeholder="Apartment, Area, Landmark"
                  className={inputClass('line2')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="Bangalore"
                  className={inputClass('city')}
                />
                {errors.city && (
                  <p className="text-xs text-rose-500 mt-0.5">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  placeholder="Karnataka"
                  className={inputClass('state')}
                />
                {errors.state && (
                  <p className="text-xs text-rose-500 mt-0.5">
                    {errors.state}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="p-5 bg-white rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-teal-600"
                />
                <Banknote className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay with cash when your order arrives
                  </p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'online'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="accent-teal-600"
                />
                <CreditCard className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Online Payment (Demo)
                  </p>
                  <p className="text-xs text-gray-500">
                    Demo payment - no real transaction will occur
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 p-5 bg-white rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                      {item.variant && ` • ${item.variant}`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium text-gray-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
