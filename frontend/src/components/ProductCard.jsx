import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.productId, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount  = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/products/${product.productId}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
        duration-200 overflow-hidden group flex flex-col">

      {/* Image */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105
              transition-transform duration-200" />
        ) : (
          <div className="text-6xl">📱</div>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white
            text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white
            text-xs px-2 py-1 rounded-full font-medium">
            Sale
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">
          {product.brandName} · {product.categoryName}
        </p>
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-sm text-gray-600">
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock */}
        <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        {/* Add to Cart */}
        <button onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2
            bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700
            transition disabled:bg-gray-300 disabled:cursor-not-allowed
            font-medium text-sm">
          <FiShoppingCart size={16} />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}