import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate       = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');

  const handlePlaceOrder = async () => {
    if (!address) { toast.error('Please enter shipping address'); return; }
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        productId: i.productId,
        quantity:  i.quantity
      }));
      const res = await ordersAPI.placeOrder({
        shippingAddress: address,
        paymentMethod:   payment,
        items
      });
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!isLoggedIn) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Please login</h2>
      <p className="text-gray-500 mb-6">Login to view your cart</p>
      <Link to="/login"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold
          hover:bg-primary-700 transition">
        Login
      </Link>
    </div>
  );

  if (cart.items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/products"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold
          hover:bg-primary-700 transition">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.cartItemId}
              className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center
                justify-center flex-shrink-0">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.productName}
                      className="w-full h-full object-cover rounded-lg" />
                  : <span className="text-3xl">📱</span>
                }
              </div>
              <div className="flex-1">
                <Link to={`/products/${item.productId}`}
                  className="font-semibold text-gray-800 hover:text-primary-600">
                  {item.productName}
                </Link>
                <p className="text-primary-600 font-bold mt-1">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateItem(item.cartItemId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition rounded-l-lg">
                      <FiMinus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateItem(item.cartItemId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition rounded-r-lg">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.cartItemId)}
                    className="text-red-400 hover:text-red-600 transition">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ₹{item.lineTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-20">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Order Summary</h3>

          <div className="space-y-3 mb-6">
            {cart.items.map(item => (
              <div key={item.cartItemId} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.lineTotal.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">
                ₹{cart.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <textarea rows={3} value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter full shipping address..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select value={payment} onChange={e => setPayment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="NetBanking">Net Banking</option>
            </select>
          </div>

          <button onClick={handlePlaceOrder} disabled={placing}
            className="w-full bg-primary-600 text-white py-3 rounded-lg
              font-semibold hover:bg-primary-700 transition disabled:opacity-60">
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}