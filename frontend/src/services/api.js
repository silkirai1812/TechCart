import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5144/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
};

// ── Products ─────────────────────────────────────────────
export const productsAPI = {
  getAll:    (params) => api.get('/products',    { params }),
  getById:   (id)     => api.get(`/products/${id}`),
  create:    (data)   => api.post('/products',   data),
  update:    (id, data) => api.put(`/products/${id}`, data),
  delete:    (id)     => api.delete(`/products/${id}`),
};

// ── Categories ───────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

// ── Brands ───────────────────────────────────────────────
export const brandsAPI = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
};

// ── Cart ─────────────────────────────────────────────────
export const cartAPI = {
  getCart:    ()     => api.get('/cart'),
  addToCart:  (data) => api.post('/cart',        data),
  updateCart: (data) => api.put('/cart',         data),
  removeItem: (id)   => api.delete(`/cart/${id}`),
  clearCart:  ()     => api.delete('/cart/clear'),
};

// ── Orders ───────────────────────────────────────────────
export const ordersAPI = {
  getMyOrders:  ()     => api.get('/orders'),
  getById:      (id)   => api.get(`/orders/${id}`),
  placeOrder:   (data) => api.post('/orders',    data),
  getAllOrders:  (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, JSON.stringify(status)),
};

// ── Reviews ──────────────────────────────────────────────
export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  addReview:         (data)      => api.post('/reviews', data),
  deleteReview:      (id)        => api.delete(`/reviews/${id}`),
};