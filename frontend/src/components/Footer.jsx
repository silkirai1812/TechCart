import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">⚡ TechCart</h3>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the latest electronics and gadgets.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link to="/products?categoryId=1" className="hover:text-white transition">Smartphones</Link></li>
              <li><Link to="/products?categoryId=2" className="hover:text-white transition">Laptops</Link></li>
              <li><Link to="/products?categoryId=3" className="hover:text-white transition">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login"   className="hover:text-white transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
              <li><Link to="/orders"  className="hover:text-white transition">My Orders</Link></li>
              <li><Link to="/cart"    className="hover:text-white transition">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">support@techcart.in</span></li>
              <li><span className="text-gray-400">1000-123-4567</span></li>
              <li><span className="text-gray-400">Mon-Sat 9AM-6PM</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TechCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
