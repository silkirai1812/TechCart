import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

export default function HomePage() {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getAll({ featured: true, pageSize: 8 }),
          categoriesAPI.getAll()
        ]);
        setFeatured(prodRes.data.data);
        setCategories(catRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = ['📱', '💻', '🎧', '📱', '🔌'];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700
        to-primary-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Next-Gen Electronics<br />
            <span className="text-yellow-300">At Your Fingertips</span>
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover the latest smartphones, laptops, audio devices and more.
            Premium brands, unbeatable prices.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/products"
              className="bg-white text-primary-700 px-8 py-3 rounded-full
                font-semibold hover:bg-primary-50 transition flex items-center gap-2">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?featured=true"
              className="border-2 border-white text-white px-8 py-3 rounded-full
                font-semibold hover:bg-white hover:text-primary-700 transition">
              Featured Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FiTruck />,      title: 'Free Shipping',    sub: 'On orders above ₹999' },
              { icon: <FiShield />,     title: 'Secure Payment',   sub: '100% secure checkout' },
              { icon: <FiRefreshCw />,  title: 'Easy Returns',     sub: '30-day return policy' },
              { icon: <FiHeadphones />, title: '24/7 Support',     sub: 'Dedicated support team' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="text-primary-600 text-2xl">{f.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.categoryId}
              to={`/products?categoryId=${cat.categoryId}`}
              className="bg-white rounded-xl p-4 text-center shadow-sm
                hover:shadow-md hover:border-primary-200 border-2 border-transparent
                transition cursor-pointer">
              <div className="text-4xl mb-2">{categoryIcons[i] || '📦'}</div>
              <p className="font-semibold text-gray-700 text-sm">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.productCount} products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium
              flex items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.productId} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}