import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPackage } from 'react-icons/fi';

const statusColors = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Processing:'bg-blue-100 text-blue-700',
  Shipped:   'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Start shopping to place your first order</p>
      <Link to="/products"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold
          hover:bg-primary-700 transition">
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.orderId}
            className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-gray-800">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString('en-IN',
                    { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
                <p className="font-bold text-gray-900 mt-2">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              {order.shippingAddress && (
                <p className="text-xs text-gray-400 mt-3">
                  📍 {order.shippingAddress}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}