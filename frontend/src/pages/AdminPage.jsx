import { useState, useEffect } from 'react';
import { productsAPI, ordersAPI, categoriesAPI, brandsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiPackage, FiBox } from 'react-icons/fi';

export default function AdminPage() {
  const [tab,      setTab]      = useState('products');
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands,   setBrands]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    stock: '', sku: '', imageUrl: '', specifications: '',
    isFeatured: false, categoryId: '', brandId: ''
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, oRes, cRes, bRes] = await Promise.all([
        productsAPI.getAll({ pageSize: 100 }),
        ordersAPI.getAllOrders({ pageSize: 100 }),
        categoriesAPI.getAll(),
        brandsAPI.getAll()
      ]);
      setProducts(pRes.data.data);
      setOrders(oRes.data.data);
      setCategories(cRes.data);
      setBrands(bRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        price:         parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        stock:         parseInt(form.stock),
        categoryId:    parseInt(form.categoryId),
        brandId:       parseInt(form.brandId),
      };
      if (editProduct) {
        await productsAPI.update(editProduct.productId, { ...payload, productId: editProduct.productId });
        toast.success('Product updated');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created');
      }
      setShowForm(false);
      setEditProduct(null);
      setForm({ name:'', description:'', price:'', discountPrice:'', stock:'',
        sku:'', imageUrl:'', specifications:'', isFeatured:false, categoryId:'', brandId:'' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success('Status updated');
      fetchAll();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description || '',
      price: p.price.toString(),
      discountPrice: p.discountPrice?.toString() || '',
      stock: p.stock.toString(), sku: p.sku || '',
      imageUrl: p.imageUrl || '', specifications: p.specifications || '',
      isFeatured: p.isFeatured,
      categoryId: p.categoryId.toString(),
      brandId: p.brandId.toString()
    });
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products', value: products.length,  icon: <FiBox /> },
          { label: 'Orders',   value: orders.length,    icon: <FiPackage /> },
          { label: 'Categories', value: categories.length, icon: '📂' },
          { label: 'Brands',   value: brands.length,    icon: '🏷️' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="text-primary-600 text-2xl">{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['products', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition
              ${tab === t
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Products ({products.length})</h2>
            <button onClick={() => { setShowForm(true); setEditProduct(null); }}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2
                rounded-lg text-sm font-medium hover:bg-primary-700 transition">
              <FiPlus /> Add Product
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">
                {editProduct ? 'Edit Product' : 'New Product'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['name',        'Product Name',   'text'],
                  ['price',       'Price (₹)',       'number'],
                  ['discountPrice','Discount Price', 'number'],
                  ['stock',       'Stock',           'number'],
                  ['sku',         'SKU',             'text'],
                  ['imageUrl',    'Image URL',       'text'],
                ].map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input type={type} value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2
                        text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select value={form.brandId}
                    onChange={e => setForm({ ...form, brandId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select brand</option>
                    {brands.map(b => (
                      <option key={b.brandId} value={b.brandId}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                  <textarea rows={3} value={form.specifications}
                    onChange={e => setForm({ ...form, specifications: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                      text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.isFeatured}
                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg
                    font-medium text-sm hover:bg-primary-700 transition">
                  {editProduct ? 'Update' : 'Create'} Product
                </button>
                <button onClick={() => { setShowForm(false); setEditProduct(null); }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg
                    font-medium text-sm hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Product', 'Category', 'Brand', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold
                      text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.productId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.categoryName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.brandName}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                      {p.discountPrice && (
                        <p className="text-xs text-green-600">
                          ₹{p.discountPrice.toLocaleString('en-IN')} sale
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full
                        ${p.stock > 10 ? 'bg-green-100 text-green-700'
                          : p.stock > 0 ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="text-blue-500 hover:text-blue-700 p-1">
                          <FiEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.productId)}
                          className="text-red-400 hover:text-red-600 p-1">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          <h2 className="font-bold text-gray-800 mb-4">Orders ({orders.length})</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Update'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold
                      text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm">#{o.orderId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{o.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(o.orderDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-medium text-sm">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${o.status === 'Delivered' ? 'bg-green-100 text-green-700'
                          : o.status === 'Cancelled' ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.status}
                        onChange={e => handleStatusUpdate(o.orderId, e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1
                          text-xs focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}