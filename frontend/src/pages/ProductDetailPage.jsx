import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiStar, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id }         = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty,     setQty]     = useState(1);
  const [review,  setReview]  = useState({ rating: 5, comment: '' });
  const { addToCart }         = useCart();
  const { isLoggedIn }        = useAuth();

  useEffect(() => {
    productsAPI.getById(id)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { toast.error('Please login first'); return; }
    try {
      await addToCart(product.productId, qty);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleReview = async () => {
    if (!isLoggedIn) { toast.error('Please login to review'); return; }
    try {
      await reviewsAPI.addReview({ ...review, productId: product.productId });
      toast.success('Review added!');
      const res = await productsAPI.getById(id);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount  = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="bg-gray-100 rounded-xl flex items-center justify-center h-80 md:h-96">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name}
                className="h-full w-full object-cover rounded-xl" />
            ) : (
              <span className="text-8xl">📱</span>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {product.brandName} · {product.categoryName}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s}
                      className={s <= Math.round(product.averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'}
                      size={18} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-medium">
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% off
                </span>
              )}
            </div>

            <p className={`text-sm mb-4 font-medium
              ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </p>

            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Quantity + Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-100 transition rounded-l-lg">
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 font-medium">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="p-3 hover:bg-gray-100 transition rounded-r-lg">
                    <FiPlus size={16} />
                  </button>
                </div>
                <button onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg
                    font-semibold hover:bg-primary-700 transition flex items-center
                    justify-center gap-2">
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            )}

            {/* Specs */}
            {product.specifications && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Specifications</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {product.specifications}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Customer Reviews ({product.reviewCount})
          </h3>

          {/* Add Review */}
          {isLoggedIn && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-700 mb-4">Write a Review</h4>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReview(r => ({ ...r, rating: s }))}>
                    <FiStar
                      className={s <= review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'}
                      size={24} />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={review.comment}
                onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={3}
              />
              <button onClick={handleReview}
                className="mt-3 bg-primary-600 text-white px-6 py-2 rounded-lg
                  hover:bg-primary-700 transition font-medium text-sm">
                Submit Review
              </button>
            </div>
          )}

          {/* Review List */}
          <div className="space-y-4">
            {product.reviews?.map(r => (
              <div key={r.reviewId} className="bg-white border border-gray-100
                rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{r.userName}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <FiStar key={s}
                          className={s <= r.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'}
                          size={14} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
              </div>
            ))}
            {product.reviewCount === 0 && (
              <p className="text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}