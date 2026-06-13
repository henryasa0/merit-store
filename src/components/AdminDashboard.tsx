import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  PlusCircle, 
  Trash, 
  Edit3, 
  X, 
  FileText, 
  Check, 
  AlertTriangle,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Clock,
  Trash2,
  Send
} from 'lucide-react';
import { Product, Order, StoreNotificationConfig, NotificationLog } from '../types';
import { FORMAT_CURRENCY, BRANDS, CATEGORIES } from '../data';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onClose: () => void;
  notificationConfig: StoreNotificationConfig;
  onUpdateNotificationConfig: (config: StoreNotificationConfig) => void;
  notificationLogs: NotificationLog[];
  onClearNotificationLogs: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onClose,
  notificationConfig,
  onUpdateNotificationConfig,
  notificationLogs,
  onClearNotificationLogs
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Editing / Creation form variables
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'notifications'>('stats');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product local form state
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Herbal Syrup');
  const [pBrand, setPBrand] = useState('Strong Man');
  const [pPrice, setPPrice] = useState(25000);
  const [pOldPrice, setPOldPrice] = useState<number | undefined>(undefined);
  const [pStock, setPStock] = useState(10);
  const [pDesc, setPDesc] = useState('');
  const [pFeatures, setPFeatures] = useState<string>('');
  const [pImage, setPImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('❌ Invalid password. Use: admin123');
    }
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPId(prod.id);
    setPName(prod.name);
    setPCategory(prod.category);
    setPBrand(prod.brand);
    setPPrice(prod.price);
    setPOldPrice(prod.oldPrice);
    setPStock(prod.stock);
    setPDesc(prod.description);
    setPFeatures(prod.features ? prod.features.join(', ') : '');
    setPImage(prod.image || '');
    setShowAddModal(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPId('p-' + Math.floor(1000 + Math.random() * 9000));
    setPName('');
    setPCategory('Herbal Syrup');
    setPBrand('Strong Man');
    setPPrice(25000);
    setPOldPrice(undefined);
    setPStock(8);
    setPDesc('');
    setPFeatures('100% Organic, Dosage: 1 Tablespoon Daily, Shake Well Before Use');
    setPImage('');
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pDesc) {
      alert('Please fill out general fields.');
      return;
    }

    const featureArray = pFeatures
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const savedProd: Product = {
      id: pId,
      name: pName,
      category: pCategory,
      brand: pBrand,
      price: Number(pPrice),
      oldPrice: pOldPrice ? Number(pOldPrice) : undefined,
      discount: pOldPrice ? Math.round(((Number(pOldPrice) - Number(pPrice)) / Number(pOldPrice)) * 100) : undefined,
      description: pDesc,
      features: featureArray,
      image: pImage || `https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80`,
      rating: editingProduct?.rating || 4.5,
      stock: Number(pStock)
    };

    if (editingProduct) {
      onEditProduct(savedProd);
    } else {
      onAddProduct(savedProd);
    }

    setShowAddModal(false);
    setEditingProduct(null);
  };

  // Compute stats metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const productsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 animate-scaleIn">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xs text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Admin Gate Entry</h1>
          <p className="text-xs text-gray-500 mt-1">Please authenticate with the security credentials.</p>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Access Password (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-amber-500 text-center font-bold tracking-widest text-gray-900"
                required
                id="admin_password_input"
              />
            </div>
            {authError && <p className="text-xs font-bold text-red-500">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-lg shadow-sm tracking-wide transition cursor-pointer"
              id="admin_submit_access_btn"
            >
              Sign In to Dashboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-400 font-semibold hover:text-gray-600 mt-2 block mx-auto cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase text-amber-600">
            <Unlock className="w-4 h-4" />
            <span>Secure Management Panel</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Merit Merchant Portal</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-1 self-start">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'stats' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Stats Center
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            View Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer relative ${
              activeTab === 'notifications' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Dispatch Alerts</span>
            {notificationLogs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {notificationLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Display Switcher */}
      {activeTab === 'stats' && (
        <div className="mt-8 space-y-8 animate-fadeIn">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-3xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Revenue</p>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mt-1">{FORMAT_CURRENCY(totalRevenue)}</h3>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Excluding cancelled/refunded invoices</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-3xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Orders</p>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mt-1">{orders.length} orders</h3>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-orange-500 mt-2 font-bold">{pendingOrdersCount} Pending Verification</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-3xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKU catalog</p>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mt-1">{productsCount} products</h3>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Active items online</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-3xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Low Stock Alert</p>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mt-1">{lowStockCount} items</h3>
                </div>
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-red-500 mt-2 font-bold">Needs restock soon</p>
            </div>
          </div>

          {/* Quick Guidance Alert box */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-amber-900">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Welcome Merit Administrator!</p>
              <p className="mt-0.5 text-amber-800">Use any and all capabilities inside this merchant dashboard window. Changes are immediately synced directly inside your browser cache block persistence (and tracked dynamically in React state models).</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Inventory List Product */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-600">Dynamic store inventory status list</span>
            <button
              onClick={handleOpenAddProduct}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-3xs cursor-pointer"
              id="admin_add_new_product_btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Inventory Table Grid */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest py-3">
                    <th className="py-2.5 px-4">Item specification</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Brand</th>
                    <th className="py-2.5 px-4 text-right">Price</th>
                    <th className="py-2.5 px-4 text-center">Remaining Stock</th>
                    <th className="py-2.5 px-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3 max-w-sm">
                          <img src={p.image} alt="" className="w-9 h-9 object-contain bg-gray-50 p-1 rounded-md shrink-0 border border-gray-150" />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-gray-900 truncate" title={p.name}>{p.name}</h4>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase text-gray-500">{p.category}</td>
                      <td className="py-3 px-4 font-black">{p.brand}</td>
                      <td className="py-3 px-4 text-right font-black text-gray-900">{FORMAT_CURRENCY(p.price)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          p.stock === 0 ? 'bg-red-50 text-red-600' : p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Do you really wish to delete ${p.name}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Order Invoices List */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs font-bold text-gray-600">
            Real order logs collected securely during active session
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-bold">No orders placed during this session yet.</p>
              <p className="text-[11px] text-gray-400 mt-1">Please try placing a mockup order on the cart view to test the database tracking flow!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Info block */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-gray-100 text-gray-800 text-xs font-mono font-bold px-2 py-1 rounded">
                        Invoice ID: {ord.id}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Placed At: {ord.date}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        ord.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        ord.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        ord.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                        ord.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-gray-700">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Client Contact</span>
                        <div className="font-bold text-gray-900 mt-0.5">{ord.customerName}</div>
                        <div>{ord.customerPhone}</div>
                        <div className="truncate text-[11px] text-gray-400">{ord.customerEmail}</div>
                      </div>

                      <div className="sm:col-span-1">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Delivery Address</span>
                        <div className="text-gray-900 mt-0.5 leading-snug">{ord.customerAddress}</div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment Status</span>
                        <div className="font-bold mt-0.5">{ord.paymentMethod}</div>
                        <div className="font-black text-amber-600">{FORMAT_CURRENCY(ord.total)}</div>
                      </div>

                      {/* Items order details list */}
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-[11px]">
                        <span className="block font-bold text-gray-400 uppercase tracking-wider mb-1">Items Included:</span>
                        <div className="space-y-1 overflow-y-auto max-h-[80px]">
                          {ord.items.map((it, i) => (
                            <div key={i} className="text-gray-700 truncate font-semibold">
                              • {it.product.name} (x{it.quantity})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status update controls */}
                  <div className="lg:border-l border-gray-100 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-start justify-between gap-4 self-stretch text-right sm:text-left shrink-0">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-right lg:text-left mb-1">Update Status</label>
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none text-gray-900 font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="text-[10px] text-gray-400 font-semibold italic">
                      Admin Action verified
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="mt-8 space-y-8 animate-fadeIn">
          {/* Header introduction banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-amber-900 uppercase tracking-wide">Automated Dispatch Notifications (Store Alerting System)</h4>
                <p className="text-xs text-amber-800 leading-relaxed max-w-4xl">
                  Configure real-time store manager notifications triggered automatically when orders are dispatched (updated to <strong>Shipped</strong> status). Alerts ensure store warehouses are updated and couriers are informed via simulated Email, WhatsApp, and SMS API pipelines.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: CONFIGURATION PANEL */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase text-gray-400">
                    <Settings className="w-4 h-4 text-amber-600" />
                    <span>Notification Settings</span>
                  </div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight mt-1">Recipient Gateways</h3>
                </div>

                {/* Email Gateway */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>Store Email Address</span>
                    </label>
                    <button
                      onClick={() => onUpdateNotificationConfig({
                        ...notificationConfig,
                        enableEmail: !notificationConfig.enableEmail
                      })}
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        notificationConfig.enableEmail 
                          ? 'bg-emerald-50 text-emerald-750 border border-emerald-200' 
                          : 'bg-red-50 text-red-650 border border-red-200'
                      }`}
                    >
                      {notificationConfig.enableEmail ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <input
                    type="email"
                    value={notificationConfig.storeEmail}
                    onChange={(e) => onUpdateNotificationConfig({
                      ...notificationConfig,
                      storeEmail: e.target.value
                    })}
                    placeholder="sales@meritstore.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-400">Receives invoice dispatches and inventory checks.</p>
                </div>

                {/* WhatsApp Gateway */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp Store Contact</span>
                    </label>
                    <button
                      onClick={() => onUpdateNotificationConfig({
                        ...notificationConfig,
                        enableWhatsApp: !notificationConfig.enableWhatsApp
                      })}
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        notificationConfig.enableWhatsApp 
                          ? 'bg-emerald-50 text-emerald-750 border border-emerald-200' 
                          : 'bg-red-50 text-red-650 border border-red-200'
                      }`}
                    >
                      {notificationConfig.enableWhatsApp ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={notificationConfig.storeWhatsApp}
                    onChange={(e) => onUpdateNotificationConfig({
                      ...notificationConfig,
                      storeWhatsApp: e.target.value
                    })}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-400">Sends raw formatted payload with custom WA URL action triggers.</p>
                </div>

                {/* SMS Gateway */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Phone SMS Contact</span>
                    </label>
                    <button
                      onClick={() => onUpdateNotificationConfig({
                        ...notificationConfig,
                        enableSMS: !notificationConfig.enableSMS
                      })}
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        notificationConfig.enableSMS 
                          ? 'bg-emerald-50 text-emerald-750 border border-emerald-200' 
                          : 'bg-red-50 text-red-650 border border-red-200'
                      }`}
                    >
                      {notificationConfig.enableSMS ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={notificationConfig.storeSMS}
                    onChange={(e) => onUpdateNotificationConfig({
                      ...notificationConfig,
                      storeSMS: e.target.value
                    })}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-400">Dispatches micro-shortcodes for instant carrier verification.</p>
                </div>

              </div>

              {/* Status helper info card */}
              <div className="bg-gray-50 border border-gray-250 rounded-2xl p-5 space-y-2.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 block bg-amber-50 rounded px-2 py-0.5 self-start w-fit">How To Trigger</span>
                <div className="text-[11px] text-gray-550 leading-relaxed font-semibold space-y-1">
                  <div>1. Place an order on the checkout screen as a mockup customer.</div>
                  <div>2. Navigate here to the Orders Tab.</div>
                  <div>3. Select the dropdown status of any order and change it to <span className="text-amber-600 font-bold">Shipped</span>.</div>
                  <div>4. The notification triggers instantly! Look at the pop-up notification and the updated Audit Log on this screen.</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DISPATCH HISTORIC LOG LIST */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs space-y-4">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-black uppercase text-gray-400">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Ledger & Logs</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight mt-1">Historic Dispatch Notifications</h3>
                  </div>

                  {notificationLogs.length > 0 && (
                    <button
                      onClick={onClearNotificationLogs}
                      className="text-red-500 hover:text-red-700 text-xs font-bold transition flex items-center space-x-1 hover:bg-red-50 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Audit Logs</span>
                    </button>
                  )}
                </div>

                {notificationLogs.length === 0 ? (
                  <div className="text-center py-16 px-4 border border-dashed border-gray-150 rounded-2xl">
                    <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-750 uppercase tracking-wide">No Broadcast Messages Registered</h4>
                    <p className="text-[11px] text-gray-450 mt-1 max-w-sm mx-auto leading-relaxed">
                      Dispatch alerts triggered on orders updated to Shipped will automatically build audit entries and appear here. Try triggering one now!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {notificationLogs.map((log) => (
                      <div key={log.id} className="border border-gray-150 rounded-2xl p-4 space-y-2.5 hover:bg-gray-50/20 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                          <div className="flex items-center space-x-2.5 flex-wrap">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              log.type === 'Email' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              log.type === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {log.type} ALERT
                            </span>
                            <span className="text-[10.5px] font-mono text-gray-400 bg-gray-50/60 px-1.5 py-0.5 rounded">ID: #{log.orderId}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2.5 text-[10px] text-gray-400 font-bold shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{log.timestamp}</span>
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Destination:</span>
                          <span className="font-mono text-gray-800 font-bold">{log.recipient}</span>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-700 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                          {log.message}
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <div className="flex items-center space-x-1 text-emerald-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Status: DELIVERED</span>
                          </div>

                          {log.type === 'WhatsApp' && (
                            <button
                              onClick={() => {
                                const encoded = encodeURIComponent(log.message);
                                const sanitizedContact = log.recipient.replace(/\s+/g, '').replace('+', '');
                                window.open(`https://wa.me/${sanitizedContact}?text=${encoded}`, '_blank');
                              }}
                              className="text-amber-600 hover:text-amber-800 font-black uppercase tracking-wider text-[10px] flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Launch Chat Integration</span>
                              <Send className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product ADD / EDIT Modal overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-xl border border-gray-150 animate-scaleIn">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                {editingProduct ? 'Modify Product Specifications' : 'Onboard New Product SKU'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-full"
                id="admin_modal_close_btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Product ID / SKU *</label>
                <input
                  type="text"
                  value={pId}
                  onChange={(e) => setPId(e.target.value)}
                  disabled={!!editingProduct}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Commercial Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Hisense 50 Inch Ultra Smart TV"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-900 font-bold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Brand *</label>
                  <select
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-900 font-bold"
                  >
                    {BRANDS.map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Old Price (₦) [optional]</label>
                  <input
                    type="number"
                    value={pOldPrice || ''}
                    onChange={(e) => setPOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Cap *</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Product Description *</label>
                <textarea
                  placeholder="Introduce the cooling power, electricity usage savings, or warranty duration description..."
                  value={pDesc}
                  rows={3}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-900 font-medium resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Product Showcase Image *</label>
                
                <div 
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all relative ${
                    isDragging ? 'border-amber-600 bg-amber-50/50' : 'border-gray-200 hover:border-amber-500 hover:bg-gray-50/30'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setPImage(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => document.getElementById('product-image-file-input')?.click()}
                >
                  <input
                    type="file"
                    id="product-image-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setPImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  {pImage ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img 
                          src={pImage} 
                          alt="Uploaded product sample" 
                          referrerPolicy="no-referrer"
                          className="w-32 h-24 object-cover mx-auto rounded-xl border border-gray-200 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPImage('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-xs cursor-pointer transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">Image loaded successfully! Drop or click to replace</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      <PlusCircle className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-gray-700">Drag & drop your product photo here</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">or <span className="text-amber-600 underline">browse your local files</span></p>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 flex items-center space-x-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Or Image Link:</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={pImage.startsWith('data:') ? '' : pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bullets Technical Specs (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. α5 Gen5 AI Processor, Dolby Vision, Smart Inverter Air cooling system"
                  value={pFeatures}
                  onChange={(e) => setPFeatures(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 font-medium"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 text-xs font-bold flex-1 cursor-pointer"
                  id="admin_modal_cancel_btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 text-xs font-black uppercase tracking-wider flex-1 cursor-pointer"
                  id="admin_modal_save_btn"
                >
                  Save Specification
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
