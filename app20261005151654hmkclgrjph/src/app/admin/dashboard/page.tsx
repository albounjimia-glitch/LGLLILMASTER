'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order, Product } from '@/types';
import { Package, ShoppingCart, DollarSign, TrendingUp, LogOut, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  useEffect(() => {
    // Check admin auth
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setProducts(productsData);
      setRecentOrders(ordersData.slice(0, 5));

      const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.total, 0);
      setStats({
        products: productsData.length,
        orders: ordersData.length,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e94560]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="text-[#e94560]">LGLLIL</span>MASTER Admin
              </h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d63d56] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.products}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.orders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-white">{stats.revenue.toFixed(2)} MAD</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'text-[#e94560] border-b-2 border-[#e94560]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders ({recentOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'text-[#e94560] border-b-2 border-[#e94560]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products ({products.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'orders' ? (
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No orders yet</p>
                ) : (
                  recentOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
                        <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                        <p><span className="font-medium">Total:</span> {order.total.toFixed(2)} MAD</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] text-black"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 capitalize text-gray-600">{product.category}</td>
                        <td className="py-4 font-semibold text-[#e94560]">{product.price.toFixed(2)} MAD</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/product/${product.id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/products/edit/${product.id}`}
                              className="p-2 text-gray-500 hover:text-[#e94560] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
