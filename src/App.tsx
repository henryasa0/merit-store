import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Heart, 
  Mail, 
  Star, 
  Phone, 
  MapPin, 
  MailWarning, 
  ChevronRight, 
  MessageCircle,
  Clock,
  CheckCircle,
  SlidersHorizontal,
  ShoppingCart
} from 'lucide-react';

import { Product, CartItem, Order, StoreNotificationConfig, NotificationLog } from './types';
import { INITIAL_PRODUCTS, BRANDS, CATEGORIES, FORMAT_CURRENCY } from './data';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import AdminDashboard from './components/AdminDashboard';
import DispatchDashboard from './components/DispatchDashboard';

export default function App() {
  // Navigation & Primary state
  const [currentPortal, setCurrentPortal] = useState<'customer' | 'admin' | 'dispatch'>('customer');
  const [pinModalTarget, setPinModalTarget] = useState<'admin' | 'dispatch' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const ADMIN_PIN = '1234';
  const DISPATCH_PIN = '5678';

  const [activeView, setActiveView] = useState<'home' | 'products' | 'product-detail' | 'cart' | 'wishlist' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Custom synced stores state
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('merit_products');
    if (local) {
      try {
        const parsed = JSON.parse(local) as Product[];
        return parsed.map((p) => {
          const initial = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          if (initial) {
            return {
              ...p,
              name: initial.name,
              category: initial.category,
              categories: initial.categories,
              brand: initial.brand,
              price: initial.price,
              oldPrice: initial.oldPrice,
              discount: initial.discount,
              packages: initial.packages,
              image: initial.image || p.image
            };
          }
          return p;
        });
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('merit_cart_temp');
    return local ? JSON.parse(local) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const local = localStorage.getItem('merit_wishlist_temp');
    return local ? JSON.parse(local) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('merit_orders_temp');
    return local ? JSON.parse(local) : [];
  });

  const [notificationConfig, setNotificationConfig] = useState<StoreNotificationConfig>(() => {
    const local = localStorage.getItem('merit_notification_config');
    return local ? JSON.parse(local) : {
      storeEmail: 'henrytechhub@gmail.com',
      storeWhatsApp: '+234 806 961 3217',
      storeSMS: '+234 806 961 3217',
      enableEmail: true,
      enableWhatsApp: true,
      enableSMS: true
    };
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const local = localStorage.getItem('merit_notification_logs');
    return local ? JSON.parse(local) : [];
  });

  const [recentNotificationAlert, setRecentNotificationAlert] = useState<{
    show: boolean;
    orderId: string;
    customerName: string;
    total: number;
    dispatches: { type: string; recipient: string; payload: string }[];
  } | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortOrder, setSortOrder] = useState<string>('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('merit_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('merit_cart_temp', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('merit_wishlist_temp', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('merit_orders_temp', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('merit_notification_config', JSON.stringify(notificationConfig));
  }, [notificationConfig]);

  useEffect(() => {
    localStorage.setItem('merit_notification_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // Hash-based hidden portal access
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setPinModalTarget('admin');
        setPinInput('');
        setPinError(false);
      } else if (hash === '#dispatch') {
        setPinModalTarget('dispatch');
        setPinInput('');
        setPinError(false);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handlePinSubmit = () => {
    const correctPin = pinModalTarget === 'admin' ? ADMIN_PIN : DISPATCH_PIN;
    if (pinInput === correctPin) {
      setCurrentPortal(pinModalTarget!);
      setPinModalTarget(null);
      setPinInput('');
      setPinError(false);
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handlePortalClose = () => {
    setCurrentPortal('customer');
    setActiveView('home');
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Navigation
  const handleNavigate = (view: typeof activeView, categoryFilter?: string) => {
    if (view === 'admin') {
      setCurrentPortal('admin');
      window.scrollTo(0, 0);
      return;
    }
    setCurrentPortal('customer');
    setActiveView(view);
    if (view === 'products' && categoryFilter !== undefined) {
      setSelectedCategory(categoryFilter);
    }
    window.scrollTo(0, 0);
  };

  const handleSearchAction = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice(800000);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          alert(`⚠️ Only ${product.stock} units are currently in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        if (quantity > product.stock) {
          alert(`⚠️ Only ${product.stock} units are currently in stock.`);
          return prev;
        }
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleBuyNowAction = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    handleNavigate('cart');
  };

  const handleQtyChange = (productId: string, newQty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleViewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    handleNavigate('product-detail');
  };

  const handleRegisterOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setProducts((currentProducts) =>
      currentProducts.map((p) => {
        const orderItem = newOrder.items.find((item) => item.product.id === p.id);
        if (orderItem) {
          return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
        }
        return p;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const oldOrder = orders.find(o => o.id === orderId);
    if (!oldOrder) return;

    setOrders(prevOrders =>
      prevOrders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord)
    );

    if (newStatus === 'Shipped' && oldOrder.status !== 'Shipped') {
      const logs: NotificationLog[] = [];
      const localDispatches: { type: string; recipient: string; payload: string }[] = [];
      const timestamp = new Date().toLocaleString();
      const orderSummary = oldOrder.items.map(it => `${it.product.name} (x${it.quantity})`).join(', ');

      if (notificationConfig.enableEmail) {
        const emailMsg = `ATTENTION: ORDER DISPATCH ALERT\n\nOrder ID: #${oldOrder.id}\nDate Placed: ${oldOrder.date}\n\nClient Profile:\n- Customer Name: ${oldOrder.customerName}\n- Contact Email: ${oldOrder.customerEmail}\n- Contact Phone: ${oldOrder.customerPhone}\n- Shipping Address: ${oldOrder.customerAddress}\n\nOrder Specification:\n- Items: ${orderSummary}\n- Order Value: ${FORMAT_CURRENCY(oldOrder.total)}\n- Payment Term: ${oldOrder.paymentMethod}\n\nThis notification is sent to the configured Store Management Email address:\n👉 ${notificationConfig.storeEmail}\n\nPlease audit store warehouse inventory accordingly.`;
        logs.push({
          id: `NT-EM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          orderId,
          type: 'Email',
          recipient: notificationConfig.storeEmail,
          title: `[Merit.OnlineStore] Dispatched Order Alert: Invoice #${oldOrder.id}`,
          message: emailMsg,
          timestamp,
          status: 'Sent'
        });
        localDispatches.push({ type: 'Email Store Dispatch', recipient: notificationConfig.storeEmail, payload: emailMsg });
      }

      if (notificationConfig.enableWhatsApp) {
        const waMsg = `🔔 *MERIT STORE ALERT: DISPATCHED ORDER* \n\n*Invoice ID:* #${oldOrder.id}\n*Customer:* ${oldOrder.customerName}\n*Phone:* ${oldOrder.customerPhone}\n*Items:* ${orderSummary}\n*Total Value:* ${FORMAT_CURRENCY(oldOrder.total)}\n*Status:* SHIPPED / DISPATCHED\n\n👉 Send notification to WhatsApp: *${notificationConfig.storeWhatsApp}*.\n\n_System Automatic Courier Dispatcher._`;
        logs.push({
          id: `NT-WA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          orderId,
          type: 'WhatsApp',
          recipient: notificationConfig.storeWhatsApp,
          title: `Store WhatsApp Alert - Invoice #${oldOrder.id}`,
          message: waMsg,
          timestamp,
          status: 'Sent'
        });
        localDispatches.push({ type: 'WhatsApp Store Pulse', recipient: notificationConfig.storeWhatsApp, payload: waMsg });
      }

      if (notificationConfig.enableSMS) {
        const smsMsg = `MERIT HUB OUT: Order #${oldOrder.id} for ${oldOrder.customerName} has been DISPATCHED. Total: ${FORMAT_CURRENCY(oldOrder.total)}. Contact: ${oldOrder.customerPhone}. Alerting store ledger @ ${notificationConfig.storeSMS}`;
        logs.push({
          id: `NT-SM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          orderId,
          type: 'SMS',
          recipient: notificationConfig.storeSMS,
          title: `Store SMS Notification - Invoice #${oldOrder.id}`,
          message: smsMsg,
          timestamp,
          status: 'Sent'
        });
        localDispatches.push({ type: 'SMS Store Alert', recipient: notificationConfig.storeSMS, payload: smsMsg });
      }

      if (logs.length > 0) {
        setNotificationLogs(prev => [...logs, ...prev]);
        setRecentNotificationAlert({
          show: true,
          orderId: oldOrder.id,
          customerName: oldOrder.customerName,
          total: oldOrder.total,
          dispatches: localDispatches
        });
      }
    }
  };

  const handleNewsletterJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterStatus(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(false), 5000);
    }
  };

  // Filter & Sort
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categories && p.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? (p.category === selectedCategory || (p.categories && p.categories.includes(selectedCategory)))
      : true;
    const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    if (sortOrder === 'rating') return b.rating - a.rating;
    if (sortOrder === 'deals') return (b.discount || 0) - (a.discount || 0);
    return 0;
  });

  const activeProduct = products.find((p) => p.id === selectedProductId);

  const renderCategoryIcon = (iconName: string) => {
    const defaultClass = "w-6 h-6 text-emerald-700";
    if (iconName === 'Zap') return <Zap className={defaultClass} />;
    if (iconName === 'Heart') return <Heart className={defaultClass} />;
    return <ShoppingCart className={defaultClass} />;
  };

  const cartCounter = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800" id="merit_app_root">

      {/* CUSTOMER PORTAL */}
      {currentPortal === 'customer' && (
        <>
          <Navbar
            cartCount={cartCounter}
            wishlistCount={wishlist.length}
            onNavigate={handleNavigate}
            onSearch={handleSearchAction}
            activeView={activeView}
          />

          <main className="flex-1">

            {/* HOME */}
            {activeView === 'home' && (
              <div className="animate-fadeIn">
                <Hero
                  onShopCatalog={() => handleNavigate('products')}
                  onFilterCategory={(cat) => handleNavigate('products', cat)}
                />

                {/* Categories */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="home_categories_block">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">AUTHENTIC BIOLOGICAL REMEDY</span>
                    <h2 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">Explore Categories</h2>
                    <p className="text-xs text-gray-400 mt-1">Get 100% natural organic biological herbal solutions</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-xl mx-auto gap-4">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat.name}
                        onClick={() => handleNavigate('products', cat.name)}
                        className="bg-white hover:bg-emerald-50 cursor-pointer p-5 rounded-2xl border border-gray-100 hover:border-emerald-300 text-center transition-all duration-300 shadow-xs flex flex-col items-center justify-center group w-full"
                        id={`home_cat_select_${cat.name}`}
                      >
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                          {renderCategoryIcon(cat.icon)}
                        </div>
                        <span className="font-bold text-xs text-gray-800 leading-tight block">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Featured Products */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-100 pb-4 gap-3 text-center sm:text-left">
                    <div>
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">HOTTEST REMEDY OFFERS</span>
                      <h2 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">Today&apos;s Featured Product</h2>
                    </div>
                    <button
                      onClick={() => handleNavigate('products')}
                      className="text-emerald-700 hover:text-emerald-800 font-extrabold text-xs flex items-center gap-1 self-center sm:self-end"
                    >
                      <span>Explore Catalog ({products.length} SKU)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        isWishlisted={wishlist.includes(prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewProductDetail}
                      />
                    ))}
                  </div>
                </section>

                {/* Deals Section */}
                <section className="bg-zinc-900 text-white py-14 mt-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7 space-y-4">
                      <span className="bg-emerald-600 font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full text-white inline-block">
                        ACTIVE HERBAL CLINIC RECOMMEND
                      </span>
                      <h3 className="text-3xl font-extrabold tracking-tight">Men&apos;s Ultimate Bio-Stamina: Strong Man Syrup</h3>
                      <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
                        Unleash raw, clean stamina and physical vitality with a robust blend of local mountain honey, organic ginger root juices, pineapple, and secret active herbal stems. No chemical fillers, no crashes.
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={() => handleViewProductDetail('strong-man-syrup')}
                          className="bg-white text-gray-950 font-black text-xs py-3 px-6 rounded-lg hover:bg-emerald-100 transition duration-150 cursor-pointer"
                        >
                          Read Bio Ingredients
                        </button>
                        <button
                          onClick={() => {
                            const palAc = products.find(p => p.id === 'strong-man-syrup');
                            if (palAc) handleAddToCart(palAc);
                          }}
                          className="bg-transparent border border-white/35 font-bold text-xs py-3 px-5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        >
                          Add To Cart (₦25K)
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-5 flex justify-center">
                      <div className="relative bg-white/5 border border-white/10 p-6 rounded-3xl max-w-sm text-center">
                        <span className="absolute -top-3.5 -right-3.5 bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-full rotate-12 shadow-md">
                          -16% DIRECT OFFER
                        </span>
                        <img
                          src="/images/strong_man_syrup_1781212742827.jpg"
                          alt="Strong Man Syrup"
                          className="max-h-[160px] object-contain rounded-xl mx-auto"
                        />
                        <h4 className="font-extrabold text-sm text-white mt-4">Strong Man Power Syrup</h4>
                        <p className="text-emerald-500 font-extrabold text-xs mt-1">₦25,000 <span className="text-[11px] text-gray-400 line-through">₦30,000</span></p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Reviews */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="customer_reviews_block">
                  <div className="text-center max-w-lg mx-auto mb-10">
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">TESTIMONIALS</span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Over 50,000+ Happy Households</h2>
                    <p className="text-xs text-gray-400 mt-1">Read honest feedback from verified buyers across major Nigerian regions</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { quote: "Ordered the Bronchial honey syrup and double elderberry for my family during the seasonal cold switch. Arrived in GRA Phase 2 in under 3 hours! The bottles are thick premium pharmaceutical grade and the syrup taste is top-tier and entirely natural.", name: "Emeka Obi.", location: "GRA, Port Harcourt" },
                      { quote: "The ZenFlow Ashwagandha sleep syrup has completely resolved my chronic light sleeping. I wake up perfectly calibrated and refreshed, with zero morning brain grogginess. Pay on Delivery guarantees in Abuja are wonderful!", name: "Amina J.", location: "Wuse 2, Abuja" },
                      { quote: "Outstanding natural remedies. Their customer helpers on WhatsApp are super prompt and suggested products based on my dietary profiles. Fast dispatch to Port Harcourt in robust protective wraps. Highly recommended!", name: "Tunde Alao.", location: "Port Harcourt" },
                    ].map((review, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-3xs text-xs font-semibold text-gray-700 relative">
                        <div className="flex text-emerald-500 space-x-0.5 mb-3">
                          {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                        </div>
                        <blockquote className="italic leading-relaxed text-gray-800">&quot;{review.quote}&quot;</blockquote>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="font-bold text-gray-900">{review.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{review.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Newsletter */}
                <section className="bg-emerald-800 text-white py-12 px-4 sm:px-6 lg:px-8 mt-10">
                  <div className="max-w-4xl mx-auto text-center space-y-4">
                    <Mail className="w-10 h-10 mx-auto animate-bounce text-emerald-100" />
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">Access Early Merit Restock Alerts!</h3>
                    <p className="text-xs text-emerald-100 max-w-md mx-auto font-medium">
                      Join our inner circle to get notified immediately when limited botanical batches are cold-pressed or special therapeutic elixirs are crafted.
                    </p>
                    <form onSubmit={handleNewsletterJoin} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
                      <input
                        type="email"
                        placeholder="Enter your email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 bg-white border border-transparent rounded-lg px-4 py-3 text-xs focus:outline-none text-gray-900 font-semibold"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-6 py-3 rounded-lg transition active:scale-95 shrink-0 cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </form>
                    {newsletterStatus && (
                      <p className="text-xs text-emerald-100 font-extrabold flex items-center justify-center gap-1.5 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span>Incredible! Thanks for subscribing. Watch out for your secret coupon!</span>
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* PRODUCTS */}
            {activeView === 'products' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <div className="border-b border-gray-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <nav className="text-xs text-gray-400 font-bold mb-1.5 flex items-center space-x-1">
                      <span className="hover:text-emerald-700 cursor-pointer" onClick={() => handleNavigate('home')}>Home</span>
                      <span>/</span>
                      <span className="text-gray-600">Remedies Library</span>
                    </nav>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                      {selectedCategory ? `${selectedCategory} Remedies` : 'All Botanical Remedies'}
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">Displaying {sortedProducts.length} premium models currently in stock</p>
                  </div>
                  <div className="flex items-center space-x-2.5 self-start">
                    <span className="text-xs text-gray-400 font-bold">Sort By</span>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="popular">Popularity & Rating</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="deals">Best Discount Deals</option>
                    </select>
                  </div>
                </div>

                <div className="lg:hidden mb-5 bg-white border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-3xs">
                  <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{mobileFiltersOpen ? 'Hide Filter Refinements' : 'Show Filter Refinements'}</span>
                  </button>
                  {(selectedCategory || selectedBrand || maxPrice < 50000 || searchQuery) && (
                    <button
                      onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setMaxPrice(50000); setSearchQuery(''); }}
                      className="text-xs text-red-600 font-extrabold hover:underline cursor-pointer"
                    >
                      Clear Active ({[selectedCategory, selectedBrand, maxPrice < 50000 ? 'Price' : '', searchQuery].filter(Boolean).length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <aside className={`lg:col-span-3 bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-gray-50">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                      <span>Filter Specifications</span>
                    </h3>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 mb-2.5">Store Category</h4>
                      <div className="space-y-1.5">
                        <button onClick={() => setSelectedCategory('')} className={`block w-full text-left py-1.5 px-2 text-xs font-semibold rounded-lg ${!selectedCategory ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'text-gray-600 hover:bg-gray-50'}`}>All Categories</button>
                        {CATEGORIES.map((cat) => (
                          <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`block w-full text-left py-1.5 px-2 text-xs font-semibold rounded-lg ${selectedCategory === cat.name ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'text-gray-600 hover:bg-gray-50'}`}>{cat.name}</button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <h4 className="text-xs font-extrabold text-gray-900 mb-2.5">Specific Brand</h4>
                      <div className="space-y-1">
                        <button onClick={() => setSelectedBrand('')} className={`block w-full text-left py-1.5 px-2 text-xs font-semibold rounded-lg ${!selectedBrand ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'text-gray-600 hover:bg-gray-50'}`}>All Brands</button>
                        {BRANDS.map((br) => (
                          <button key={br} onClick={() => setSelectedBrand(br)} className={`block w-full text-left py-1.5 px-2 text-xs font-semibold rounded-lg ${selectedBrand === br ? 'bg-emerald-50 text-emerald-800 font-extrabold' : 'text-gray-600 hover:bg-gray-50'}`}>{br}</button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-extrabold text-gray-900">Maximum Price</h4>
                        <span className="text-xs text-emerald-700 font-mono font-bold">{FORMAT_CURRENCY(maxPrice)}</span>
                      </div>
                      <input type="range" min="5000" max="50000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-700" />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                        <span>₦5k</span><span>₦25k</span><span>₦50k+</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setMaxPrice(800000); setSearchQuery(''); }} className="w-full border border-gray-200 hover:bg-gray-50 py-2.5 text-xs text-gray-600 font-bold rounded-lg cursor-pointer">
                      Reset Active Filters
                    </button>
                  </aside>

                  <div className="lg:col-span-9">
                    {sortedProducts.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-12 text-center rounded-2xl max-w-md mx-auto text-gray-400">
                        <MailWarning className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-bounce" />
                        <h3 className="font-bold text-gray-800">No Matching Product SKU found</h3>
                        <p className="text-xs text-gray-500 mt-1">Try resetting the sliding parameters or keyword search filters!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.map((prod) => (
                          <ProductCard key={prod.id} product={prod} isWishlisted={wishlist.includes(prod.id)} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} onViewDetails={handleViewProductDetail} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCT DETAIL */}
            {activeView === 'product-detail' && activeProduct && (
              <ProductPage
                product={activeProduct}
                allProducts={products}
                onBack={() => handleNavigate('products')}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNowAction}
                isWishlisted={wishlist.includes(activeProduct.id)}
                onToggleWishlist={handleToggleWishlist}
                onViewProductDetails={handleViewProductDetail}
              />
            )}

            {/* CART */}
            {activeView === 'cart' && (
              <CartPage
                cartItems={cart}
                onQtyChange={handleQtyChange}
                onRemoveItem={handleRemoveCartItem}
                onPlaceOrder={handleRegisterOrder}
                onClearCart={() => setCart([])}
                onNavigateToCatalog={() => handleNavigate('products')}
              />
            )}

            {/* WISHLIST */}
            {activeView === 'wishlist' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Your Favorite Products ({wishlist.length})</h1>
                {wishlist.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-sm mx-auto text-gray-400">
                    <Heart className="w-12 h-12 mx-auto text-gray-350 mb-3" />
                    <p className="font-bold text-gray-800">Your favorite shelf is empty</p>
                    <p className="text-[11px] text-gray-400 mt-1">Tap the heart toggle on product thumbnails to stack models here!</p>
                    <button type="button" onClick={() => handleNavigate('products')} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg mt-5 cursor-pointer">
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.filter((p) => wishlist.includes(p.id)).map((prod) => (
                      <ProductCard key={prod.id} product={prod} isWishlisted={true} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} onViewDetails={handleViewProductDetail} />
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>

          {/* FOOTER */}
          <footer className="bg-zinc-950 text-neutral-400 border-t border-neutral-900 pt-16 pb-8" id="store_footer_root">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white font-extrabold text-sm tracking-tight">M</div>
                  <span className="font-extrabold text-xl text-white tracking-tight">Merit<span className="text-emerald-500 italic">.OnlineStore</span></span>
                </div>
                <p className="text-xs leading-relaxed max-w-sm">Nigeria&apos;s premium biological hub for active cold-pressed herbal syrups, restorative immune tonics, sleep-calming remedies and biological bitters.</p>
                <div className="text-[10px] text-neutral-500 font-semibold italic flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Merit Store Help Desk is active 24/7</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider pl-1 border-l-2 border-emerald-700">Categories</h4>
                <ul className="text-xs space-y-2">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.name}><button onClick={() => handleNavigate('products', cat.name)} className="hover:text-emerald-500 transition-colors text-left cursor-pointer text-xs">{cat.displayName}</button></li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider pl-1 border-l-2 border-emerald-700">Verified Crafters</h4>
                <ul className="text-xs space-y-2 font-medium">
                  {['Merit Botanicals', 'Elderglow', 'ZenFlow Labs', 'Nile Remedies', 'Amani Organic'].map((brName) => (
                    <li key={brName}><button onClick={() => { setSelectedBrand(brName); handleNavigate('products'); }} className="hover:text-emerald-500 transition-colors text-left cursor-pointer text-xs">{brName}</button></li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider pl-1 border-l-2 border-emerald-700">Merit Store Hub</h4>
                <div className="text-xs space-y-3">
                  <div className="flex items-start space-x-2"><MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /><span>Plot 23, Ken Saro-Wiwa Road, Opposite Port Harcourt Club, GRA Phase 2, Port Harcourt, Rivers State, Nigeria</span></div>
                  <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-emerald-600 shrink-0" /><span>+234 806 961 3217 (WhatsApp & Consultation)</span></div>
                  <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-emerald-600 shrink-0" /><span>wellness@meritstore.com</span></div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 text-neutral-500">
              <div>&copy; {new Date().getFullYear()} Merit Online Store & Bio-Herbals Ltd. All Rights Reserved.</div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">User Terms of Service</a>
                <a href="#" className="hover:text-white transition">Quality Declarations</a>
              </div>
            </div>
          </footer>

          {/* WHATSAPP BUTTON */}
          <a
            href="https://wa.me/2348069613217?text=Hello%20Merit%20Online%20Store!%20I%20am%20interested%20in%20the%20remedies%20for%20a%20private%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition duration-300 flex items-center justify-center animate-bounce hover:animate-none cursor-pointer group"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 fill-current text-white shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-xs font-black uppercase tracking-wider transition-all duration-300">WhatsApp Help</span>
          </a>
        </>
      )}

      {/* ADMIN PORTAL */}
      {currentPortal === 'admin' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={(p) => setProducts([p, ...products])}
            onEditProduct={(p) => setProducts(products.map((item) => (item.id === p.id ? p : item)))}
            onDeleteProduct={(id) => setProducts(products.filter((item) => item.id !== id))}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClose={handlePortalClose}
            notificationConfig={notificationConfig}
            onUpdateNotificationConfig={setNotificationConfig}
            notificationLogs={notificationLogs}
            onClearNotificationLogs={() => setNotificationLogs([])}
          />
        </div>
      )}

      {/* DISPATCH PORTAL */}
      {currentPortal === 'dispatch' && (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DispatchDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClose={handlePortalClose}
            notificationConfig={notificationConfig}
            notificationLogs={notificationLogs}
          />
        </div>
      )}

      {/* NOTIFICATION ALERT MODAL */}
      {recentNotificationAlert && recentNotificationAlert.show && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 text-white border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="bg-emerald-800 p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Live Notification Dispatch System</span>
                <h3 className="text-xl font-black tracking-tight">Order Dispatched Store Alerts Sent!</h3>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-xs text-neutral-400">
                  Great! Order <span className="font-mono text-white font-bold bg-neutral-900 px-1.5 py-0.5 rounded">#{recentNotificationAlert.orderId}</span> belonging to <span className="text-white font-black">{recentNotificationAlert.customerName}</span> (Total Value: <span className="text-emerald-500 font-bold">{FORMAT_CURRENCY(recentNotificationAlert.total)}</span>) has been marked as <strong>Dispatched (Shipped)</strong>.
                </p>
                <p className="text-xs text-neutral-500 mt-1">The automated notification system has successfully formulated and simulated dispatch delivery alerts to the store contact destinations:</p>
              </div>
              <div className="space-y-4">
                {recentNotificationAlert.dispatches.map((disp, i) => (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-500">{disp.type}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">Recipient: {disp.recipient}</span>
                    </div>
                    <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-neutral-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto">{disp.payload}</div>
                    {disp.type.includes('WhatsApp') && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            const encoded = encodeURIComponent(disp.payload);
                            const sanitizedContact = disp.recipient.replace(/\s+/g, '').replace('+', '');
                            window.open(`https://wa.me/${sanitizedContact}?text=${encoded}`, '_blank');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <span>Open Real WhatsApp Chat with Store</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-400 text-[11px] flex gap-2">
                <span className="text-emerald-500 font-bold shrink-0">ℹ️ Testing Note:</span>
                <span>The logs have been registered under the <strong>Dispatch Alerts</strong> tab inside the Merchant Portal. In production, this trigger executes backend server requests to Twilio SMS, WhatsApp Business API, and Resend mailers.</span>
              </div>
            </div>
            <div className="bg-neutral-900 px-6 py-4 border-t border-neutral-800 flex justify-end">
              <button onClick={() => setRecentNotificationAlert(null)} className="bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer transition shadow-md">
                Close and Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN GATE MODAL */}
      {pinModalTarget && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl text-white">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                {pinModalTarget === 'admin' ? '💼' : '🚚'}
              </div>
              <h2 className="text-lg font-black tracking-tight">
                {pinModalTarget === 'admin' ? 'Merchant Portal' : 'Dispatch Portal'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-medium">Enter your staff PIN to continue</p>
            </div>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              placeholder="Enter PIN"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:border-emerald-600 text-white placeholder:tracking-normal placeholder:text-zinc-600 placeholder:text-sm"
              autoFocus
            />
            {pinError && (
              <p className="text-red-400 text-xs font-bold text-center mt-2">❌ Incorrect PIN. Try again.</p>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setPinModalTarget(null); window.history.replaceState(null, '', window.location.pathname); }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Unlock Access
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}