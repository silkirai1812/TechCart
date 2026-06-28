import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI, brandsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFilter, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const page       = parseInt(searchParams.get('page')       || '1');
  const categoryId = searchParams.get('categoryId') || '';
  const brandId    = searchParams.get('brandId')    || '';
  const search     = searchParams.get('search')     || '';
  const sortBy     = searchParams.get('sortBy')     || 'name';
  const minPrice   = searchParams.get('minPrice')   || '';
  const maxPrice   = searchParams.get('maxPrice')   || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize: 12, sortBy };
        if (categoryId) params.categoryId = categoryId;
        if (brandId)    params.brandId    = brandId;
        if (search)     params.search     = search;
        if (minPrice)   params.minPrice   = minPrice;
        if (maxPrice)   params.maxPrice   = maxPrice;

        const [prodRes, catRes, brandRes] = await Promise.all([
          productsAPI.getAll(params),
          categoriesAPI.getAll(),
          brandsAPI.getAll()
        ]);
        setProducts(prodRes.data.data);
        setTotal(prodRes.data.total);
        setTotalPages(prodRes.data.totalPages);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value;
    else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Filters</h3>
              <button onClick={clearFilters}
                className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                <FiX size={12} /> Clear all
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => updateParam('search', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={categoryId}
                onChange={e => updateParam('categoryId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select value={brandId}
                onChange={e => updateParam('brandId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <input type="number" placeholder="Max" value={maxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select value={sortBy}
                onChange={e => updateParam('sortBy', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="name">Name</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">{total} products found</p>
            <button onClick={() => setShowFilter(!showFilter)}
              className="md:hidden flex items-center gap-2 bg-white border
                border-gray-300 px-4 py-2 rounded-lg text-sm font-medium">
              <FiFilter /> Filters
            </button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => <ProductCard key={p.productId} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p}
                      onClick={() => updateParam('page', p.toString())}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition
                        ${page === p
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-500'
                        }`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}