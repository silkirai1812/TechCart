import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cart }     = useCart();
  const navigate     = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">⚡ TechCart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products"
              className="text-gray-600 hover:text-primary-600 font-medium transition">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin"
                className="text-gray-600 hover:text-primary-600 font-medium transition">
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600">
              <FiShoppingCart size={22} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white
                  text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/orders"
                  className="flex items-center gap-1 text-gray-600 hover:text-primary-600">
                  <FiUser size={18} />
                  <span className="text-sm font-medium">{user?.fullName}</span>
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg
                    hover:bg-primary-700 transition font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t space-y-3">
            <Link to="/products" className="block px-4 py-2 text-gray-700"
              onClick={() => setOpen(false)}>Products</Link>
            <Link to="/cart" className="block px-4 py-2 text-gray-700"
              onClick={() => setOpen(false)}>Cart ({cart.itemCount})</Link>
            {isLoggedIn ? (
              <>
                <Link to="/orders" className="block px-4 py-2 text-gray-700"
                  onClick={() => setOpen(false)}>My Orders</Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-gray-700"
                    onClick={() => setOpen(false)}>Admin</Link>
                )}
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="block px-4 py-2 text-red-500 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700"
                  onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-gray-700"
                  onClick={() => setOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}