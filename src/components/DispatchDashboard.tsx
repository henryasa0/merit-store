import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  MapPin, 
  Phone, 
  Truck, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  ExternalLink, 
  Navigation,
  Check,
  Send,
  User,
  ShoppingBag,
  Bell,
  Search,
  CheckSquare
} from 'lucide-react';
import { Order, StoreNotificationConfig, NotificationLog } from '../types';
import { FORMAT_CURRENCY } from '../data';

interface DispatchDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onClose: () => void;
  notificationConfig: StoreNotificationConfig;
  notificationLogs: NotificationLog[];
}

export default function DispatchDashboard({
  orders,
  onUpdateOrderStatus,
  onClose,
  notificationConfig,
  notificationLogs
}: DispatchDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Selected order for live tracking / routing details
  const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);

  // Authenticate helper
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dispatch123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('❌ Invalid code. Use: dispatch123');
    }
  };

  // Filter orders matching searching params
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderID) || filteredOrders[0] || null;

  // Compute logistics metrics
  const totalInLogistics = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const transitCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const currentLogs = notificationLogs.filter(log => selectedOrder && log.orderId === selectedOrder.id);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 animate-scaleIn" id="dispatch_auth_container">
        <div className="bg-zinc-950 text-white border border-neutral-850 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-amber-600/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-600/20">
            <Truck className="w-7 h-7 animate-bounce text-amber-500" />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">Logistics Gateway</h1>
          <p className="text-xs text-neutral-400 mt-1">Authenticate as secondary Logistics / Courier service team member.</p>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Logistics Code (dispatch123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-center font-bold tracking-widest text-white focus:outline-none focus:border-amber-500"
                required
              />
              {authError && <p className="text-red-500 font-bold text-[11px] mt-2">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition shadow-md"
            >
              Sign In to Logistics Desk
            </button>
          </form>

          <p className="text-[10px] text-neutral-500 mt-6 font-mono">
            Security hint: <strong>dispatch123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn" id="dispatch_dashboard_view">
      
      {/* Top Banner layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-150 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-black text-amber-600 tracking-wider uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Logistics & Fulfillment Console
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5 flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-600 shrink-0" />
            <span>Merit Courier Dispatcher Desk</span>
          </h1>
          <p className="text-xs text-gray-500">Maintain order payloads, verify Port Harcourt route pathways, and broadcast live SMS configs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-gray-50 border border-gray-150 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node Host Active: Port Harcourt GRA Hub</span>
          </span>
          
          <button
            onClick={onClose}
            className="border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Switch Workspace
          </button>
        </div>
      </div>

      {/* Metrics Row Grid layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-3xs flex items-center space-x-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Ledger</div>
            <div className="text-lg font-black text-gray-950 font-mono mt-0.5">{totalInLogistics}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-3xs flex items-center space-x-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Hub Checkout</div>
            <div className="text-lg font-black text-gray-950 font-mono mt-0.5">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-3xs flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active In-Transit</div>
            <div className="text-lg font-black text-gray-950 font-mono mt-0.5">{transitCount}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-3xs flex items-center space-x-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivered Drops</div>
            <div className="text-lg font-black text-gray-950 font-mono mt-0.5">{deliveredCount}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SHEET: ORDERS CHECKLIST DATABASE (6 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-3xs space-y-4">
            
            {/* Table Search & Parameters block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
              <h3 className="text-sm font-black text-gray-950 uppercase tracking-wide">Fulfillment Orders Ledger</h3>
              
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Status Tab switchers */}
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Operations</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Dispatched (Transit)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Quick Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipient name, invoice ID, delivery road address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-950 focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-450" />
            </div>

            {/* Orders list rendering */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 px-4 border border-dashed border-gray-150 rounded-xl">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2.5 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-gray-700 tracking-wide">No logistics parcels found</h4>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                  Either no items match your searching filter, or the customer storefront has not placed orders to checkout!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredOrders.map((o) => {
                  const isCurrent = selectedOrder && selectedOrder.id === o.id;
                  const itemSummaries = o.items.map(it => `${it.product.name} (x${it.quantity})`).join(', ');

                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrderID(o.id)}
                      className={`border p-4 rounded-xl text-left cursor-pointer transition-all ${
                        isCurrent 
                          ? 'border-amber-500 bg-amber-50/20 shadow-xs' 
                          : 'border-gray-150 hover:bg-gray-50/40 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
                              #{o.id}
                            </span>
                            <span className="text-xs font-black text-gray-950">{o.customerName}</span>
                          </div>
                          
                          <div className="text-[10.5px] text-gray-500 mt-1 font-semibold truncate max-w-sm">
                            {itemSummaries}
                          </div>

                          <div className="text-[10.5px] text-gray-400 italic flex items-center space-x-1 mt-1.5">
                            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[280px]">{o.customerAddress}</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className="text-xs font-black text-gray-950 font-mono">{FORMAT_CURRENCY(o.total)}</span>
                          
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            o.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 font-bold' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {o.status === 'Shipped' ? 'In Transit / Dispatched' : o.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* PORT HARCOURT ROUTING SIMULATION BOARD */}
          <div className="bg-zinc-950 border border-neutral-900 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold">Port Harcourt Route Planner Simulation</span>
                <h4 className="text-sm font-extrabold tracking-tight">Active GPS Coordinates System</h4>
              </div>
              <Compass className="w-5 h-5 text-amber-500 animate-spin" />
            </div>

            {selectedOrder ? (
              <div className="space-y-4 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-850">
                  <div>
                    <span className="text-neutral-500 uppercase block text-[9px]">Hub Origin:</span>
                    <span className="text-neutral-200">Port Harcourt Showroom Terminal</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase block text-[9px]">Destination Transit Point:</span>
                    <span className="text-amber-400 font-bold truncate block">{selectedOrder.customerAddress.split(',')[0]}</span>
                  </div>
                </div>

                <div className="relative border-l border-amber-600/30 pl-4 space-y-4 py-1">
                  {/* Point 1: Origin */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-amber-600 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                      1
                    </span>
                    <div>
                      <span className="text-white font-bold block">Loaded at Warehouse (Ikeja Plaza)</span>
                      <span className="text-neutral-400 text-[10px]">Verification checkout log processed. Courier verified stock availability.</span>
                    </div>
                  </div>

                  {/* Point 2: Dispatched */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${
                      ['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'bg-indigo-600' : 'bg-neutral-800'
                    }`}>
                      2
                    </span>
                    <div>
                      <span className={`font-bold block ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'text-indigo-400' : 'text-neutral-500'}`}>
                        Dispatched Courier Courier Ring Alert
                      </span>
                      <span className="text-neutral-400 text-[10px]">Triggered Automated Broadcast to email configured: <strong className="text-neutral-200">{notificationConfig.storeEmail}</strong></span>
                    </div>
                  </div>

                  {/* Point 3: In Transit */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${
                      selectedOrder.status === 'Shipped' ? 'bg-amber-500' : 
                      selectedOrder.status === 'Delivered' ? 'bg-indigo-600' : 
                      'bg-neutral-800'
                    }`}>
                      3
                    </span>
                    <div>
                      <span className={`font-bold block ${selectedOrder.status === 'Shipped' ? 'text-amber-500 animate-pulse' : selectedOrder.status === 'Delivered' ? 'text-indigo-400' : 'text-neutral-500'}`}>
                        In Transit / Logistics Shipping
                      </span>
                      <span className="text-neutral-400 text-[10px]">Parcels currently on-site delivery team road pathing. WA/SMS ping formulated.</span>
                    </div>
                  </div>

                  {/* Point 4: Delivered */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${
                      selectedOrder.status === 'Delivered' ? 'bg-emerald-600' : 'bg-neutral-800'
                    }`}>
                      4
                    </span>
                    <div>
                      <span className={`font-bold block ${selectedOrder.status === 'Delivered' ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        Delivered successfully
                      </span>
                      <span className="text-neutral-400 text-[10px]">Signed and stamped waybill validation finalized. Pay on Delivery receipt checked.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 py-6 text-center text-xs">
                Select an order block above to simulate live logistics route progression.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SHEET: LIVE DISPATCH ACTION PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedOrder ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs space-y-6">
              
              {/* Order specifications header */}
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block font-mono">Invoice Ledger ID</span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="text-lg font-black text-gray-900 font-mono">#{selectedOrder.id}</h3>
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                    selectedOrder.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                    selectedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 font-bold' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer data profile */}
              <div className="space-y-4 text-xs">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Customer Demographics</span>
                </h4>
                
                <div className="bg-gray-50 rounded-2xl p-4.5 space-y-3.5 border border-gray-100">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Contact Name</span>
                      <span className="text-gray-900 font-bold">{selectedOrder.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Contact Phone</span>
                      <span className="text-gray-900 font-bold font-mono">{selectedOrder.customerPhone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-bold">Shipping Destination</span>
                    <span className="text-gray-900 font-medium">{selectedOrder.customerAddress}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-gray-150/55">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Payment Method</span>
                      <span className="text-gray-900 font-black text-[10.5px]">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Subtotal Amount</span>
                      <span className="text-gray-900 font-bold font-mono">{FORMAT_CURRENCY(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package detailed models checklist */}
              <div className="space-y-2.5 text-xs">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Package Item Specification</span>
                </h4>

                <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50/50">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-gray-800 font-semibold">{it.product.name}</span>
                      </div>
                      <span className="font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded border text-[11px] font-semibold">
                        Qty: {it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfillment state manipulation Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Logistics Action Triggers</h4>
                
                {selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Shipped')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-xs tracking-wider py-4 rounded-xl cursor-pointer transition shadow-sm flex items-center justify-center space-x-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>🚀 Mark as Dispatched (Shipped)</span>
                    </button>
                    <p className="text-[10px] text-center text-amber-700 leading-relaxed bg-amber-50 rounded-lg p-2">
                      ⚠️ <strong>Automated alert trigger:</strong> Dispatching this order will formulate and broadcast real-time Email alerts, SMS templates, and log WhatsApp payloads automatically!
                    </p>
                  </div>
                ) : selectedOrder.status === 'Shipped' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Delivered')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-wider py-4 rounded-xl cursor-pointer transition shadow-sm flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>✅ Confirm Final Drop-Off / Delivered</span>
                    </button>
                    <p className="text-[10px] text-center text-gray-405 leading-relaxed">
                      Confirming final drop-off moves this order out of dispatcher active transit queue of Port Harcourt state logistics.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 text-center text-xs text-gray-500 p-4 rounded-xl">
                    🎉 This order transaction status is <strong className="text-gray-800 uppercase">{selectedOrder.status}</strong>. No logistics actions are pending.
                  </div>
                )}

                {/* Cancel logistics action trigger */}
                {['Pending', 'Processing', 'Shipped'].includes(selectedOrder.status) && (
                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Cancelled')}
                    className="w-full border border-red-200 hover:bg-red-50 text-red-600 font-bold uppercase text-[10px] py-2.5 rounded-lg transition"
                  >
                    Cancel Courier Shipment Route
                  </button>
                )}
              </div>

              {/* simulated notification messages formulation output specific to selected order */}
              {currentLogs.length > 0 && (
                <div className="pt-4 border-t border-gray-150 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center space-x-1.5 text-xs font-black text-gray-900 uppercase">
                    <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                    <span>Triggered Outbound Alerts Log</span>
                  </div>

                  <div className="space-y-3">
                    {currentLogs.map((lg) => (
                      <div key={lg.id} className="bg-neutral-950 text-neutral-300 border border-neutral-850 p-3 rounded-lg space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between text-neutral-400">
                          <span className="font-bold text-amber-500 tracking-wide uppercase">{lg.type} ALERT SENT</span>
                          <span>{lg.timestamp}</span>
                        </div>
                        <div className="text-[9.5px] text-neutral-400">Recipient: <span className="text-amber-400 font-bold">{lg.recipient}</span></div>
                        <pre className="whitespace-pre-wrap font-mono leading-relaxed max-h-[80px] overflow-y-auto bg-neutral-900 px-2 py-1.5 rounded">{lg.message}</pre>
                        
                        {lg.type === 'WhatsApp' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                const encoded = encodeURIComponent(lg.message);
                                const sanitizedContact = lg.recipient.replace(/\s+/g, '').replace('+', '');
                                window.open(`https://wa.me/${sanitizedContact}?text=${encoded}`, '_blank');
                              }}
                              className="bg-emerald-600 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-1 rounded hover:bg-emerald-700 transition cursor-pointer flex items-center space-x-1"
                            >
                              <span>Send on WhatsApp</span>
                              <Send className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center text-gray-400 shadow-3xs">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">No Target Package Selected</h3>
              <p className="text-xs text-gray-500 mt-1">Select an order entry from the left checklist pane to verify logistics, coordinate pipelines, and activate message templates.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
