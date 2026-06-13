import React, { useState } from 'react';
import { Trash2, CreditCard, MessageSquare, Loader, CheckCircle2, ShieldAlert, ShoppingBag } from 'lucide-react';
import { CartItem, Product, Order } from '../types';
import { FORMAT_CURRENCY } from '../data';

interface CartPageProps {
  cartItems: CartItem[];
  onQtyChange: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
  onNavigateToCatalog: () => void;
}

export default function CartPage({
  cartItems,
  onQtyChange,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
  onNavigateToCatalog
}: CartPageProps) {
  // Customer details input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Pay On Delivery' | 'Paystack'>('Pay On Delivery');
  
  // Paystack transaction state machine variables
  const [paymentRunning, setPaymentRunning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const deliveryFee = 0; // Deliveries are 100% free with no delivery fee!
  const total = subtotal + deliveryFee;

  const handleQtyClick = (itemId: string, currentQty: number, maxStock: number, direction: 'plus' | 'minus') => {
    if (direction === 'plus' && currentQty < maxStock) {
      onQtyChange(itemId, currentQty + 1);
    } else if (direction === 'minus' && currentQty > 1) {
      onQtyChange(itemId, currentQty - 1);
    }
  };

  const executeOrderCheckout = (methodOverride?: 'Pay On Delivery' | 'Paystack') => {
    if (!name || !email || !phone || !address) {
      alert('Please fill out all contact and delivery address details.');
      return;
    }

    const finalMethod = methodOverride || paymentMethod;
    const orderId = 'ZIT-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      paymentMethod: finalMethod
    };

    if (finalMethod === 'Paystack') {
      // Simulate Paystack interface popup transition
      setPaymentRunning(true);
      setTimeout(() => {
        setPaymentRunning(false);
        setPaymentSuccess(true);
        setGeneratedOrder(newOrder);
        onPlaceOrder(newOrder);
      }, 3500);
    } else {
      // Direct placement
      setGeneratedOrder(newOrder);
      onPlaceOrder(newOrder);
    }
  };

  // Automated Whatsapp message text creation
  const handleWhatsAppCheckout = () => {
    if (!name || !phone || !address) {
      alert('Please provide name, phone, and delivery address before launching WhatsApp assistant.');
      return;
    }

    // Build comprehensive visual string for WhatsApp dispatch
    let msg = `*NEW ORDER - MERIT.ONLINESTORE*\n\n`;
    msg += `👤 *Customer Details:*\n`;
    msg += `Name: ${name}\n`;
    msg += `Phone: ${phone}\n`;
    msg += `Delivery Address: ${address}\n\n`;
    msg += `📦 *Cart Breakdown:*\n`;
    
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${FORMAT_CURRENCY(item.product.price * item.quantity)}\n`;
    });

    msg += `\n💵 *Order Summary:*\n`;
    msg += `Subtotal: ${FORMAT_CURRENCY(subtotal)}\n`;
    msg += `Delivery Fee: ${FORMAT_CURRENCY(deliveryFee)}\n`;
    msg += `*Grand Total: ${FORMAT_CURRENCY(total)}*\n\n`;
    msg += `💳 *Preferred Method:* ${paymentMethod}\n`;
    msg += `Please reply to verify and dispatch my order. Thank you!`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/2348069613217?text=${encoded}`; // Real Nigerian consultation contact number
    window.open(whatsappUrl, '_blank');
  };

  // If order was successfully completed
  if (generatedOrder) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 animate-scaleIn">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your unique tracking identification number is <span className="font-bold text-emerald-800">{generatedOrder.id}</span>
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-left mt-6 space-y-2">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1">Dispatch Details:</h4>
            <div className="text-xs font-semibold text-gray-700 grid grid-cols-3 gap-y-1">
              <span className="text-gray-400">Recipient:</span> <span className="col-span-2 text-gray-900">{generatedOrder.customerName}</span>
              <span className="text-gray-400">Phone:</span> <span className="col-span-2 text-gray-900">{generatedOrder.customerPhone}</span>
              <span className="text-gray-400">Address:</span> <span className="col-span-2 text-gray-900">{generatedOrder.customerAddress}</span>
              <span className="text-gray-400">Total Sum:</span> <span className="col-span-2 font-bold text-gray-900">{FORMAT_CURRENCY(generatedOrder.total)}</span>
              <span className="text-gray-400">Method:</span> <span className="col-span-2 text-gray-900">{generatedOrder.paymentMethod}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg p-3 mt-5">
            🔔 Our Merit dispatch team will call you within 30 minutes to confirm shipping address prior to rider movement.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleWhatsAppCheckout}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 px-4 text-xs font-bold flex-1 flex items-center justify-center gap-2 cursor-pointer"
              id="whatsapp_dispatch_success_btn"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Validate via WhatsApp</span>
            </button>
            <button
              onClick={() => {
                setGeneratedOrder(null);
                setPaymentSuccess(false);
                onClearCart();
                onNavigateToCatalog();
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 px-4 text-xs font-bold flex-1 cursor-pointer"
              id="continue_shopping_success_btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paystack verification loader mockup
  if (paymentRunning) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            <img src="https://placehold.co/40x45/09a5db/ffffff?text=P" alt="Paystack" className="w-5 h-5 rounded-sm" />
            <span>PAYSTACK GATEWAY</span>
          </div>
          <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-6" />
          <h2 className="text-lg font-black text-gray-900">Validating Secured Transaction</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Please do not refresh nor shut the browser window. Communicating secure certificates directly with Central Bank payment servers...
          </p>
        </div>
      </div>
    );
  }

  // If cart is entirely empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 animate-fadeIn">
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
          Explore our respiratory honey, immune booster elderberry extracts, restful sleep elixirs, and focus shrubs!
        </p>
        <button
          onClick={onNavigateToCatalog}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md mt-6 transition cursor-pointer"
          id="cart_browse_empty_btn"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Your Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Orders item list table */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">
                  <th className="py-2.5">Product info</th>
                  <th className="py-2.5 text-center">Quantity</th>
                  <th className="py-2.5 text-right">Price breakdown</th>
                  <th className="py-2.5 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {cartItems.map((item) => (
                  <tr key={item.product.id} className="group">
                    {/* Item identification */}
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg p-1.5 shrink-0 border border-gray-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 leading-snug hover:text-emerald-700 cursor-pointer line-clamp-2 max-w-xs sm:max-w-md">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] bg-gray-150 px-1.5 py-0.5 rounded text-gray-500 font-bold tracking-wider mt-1 inline-block uppercase">
                            {item.product.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Quantity Selector */}
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleQtyClick(item.product.id, item.quantity, item.product.stock, 'minus')}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 bg-white rounded border border-gray-100 shadow-3xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyClick(item.product.id, item.quantity, item.product.stock, 'plus')}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 bg-white rounded border border-gray-100 shadow-3xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Accurate Total Naira display */}
                    <td className="py-4 text-right">
                      <div className="font-bold text-gray-900 text-sm">
                        {FORMAT_CURRENCY(item.product.price * item.quantity)}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {FORMAT_CURRENCY(item.product.price)} each
                      </div>
                    </td>

                    {/* Safe Remove button */}
                    <td className="py-4 text-center">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onNavigateToCatalog}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold cursor-pointer"
              id="nav_cart_add_more_items_btn"
            >
              ← Continue Shopping
            </button>
            <button
              onClick={onClearCart}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              id="cart_clear_all_items_btn"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right: Customer details contact and Checkout Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-50 pb-3">Order Summary</h3>
            <div className="space-y-2 text-xs font-semibold text-gray-600 mt-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} units):</span>
                <span className="text-gray-900">{FORMAT_CURRENCY(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery handling:</span>
                <span className="text-gray-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 uppercase font-bold">FREE Delivery</span> : FORMAT_CURRENCY(deliveryFee)}
                </span>
              </div>
              <div className="bg-gray-50 py-1.5 px-2.5 rounded-lg text-[10px] text-gray-500 mt-2">
                💡 100% Free Delivery to all Addresses in Rivers State!
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-black text-gray-900">
                <span>Grand Total:</span>
                <span className="text-emerald-700 text-base">{FORMAT_CURRENCY(total)}</span>
              </div>
            </div>
          </div>

          {/* Customer delivery shipping inputs */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">Delivery Information</h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chukwuma Obi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-gray-900 font-medium"
                  required
                  id="checkout_input_name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Email Address *</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-gray-900 font-medium"
                  required
                  id="checkout_input_email"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Mobile Line *</label>
                <input
                  type="tel"
                  placeholder="e.g. +234 810 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-gray-900 font-medium"
                  required
                  id="checkout_input_phone"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Detailed Delivery Address *</label>
                <textarea
                  placeholder="Suite number, building identity, street & state details"
                  value={address}
                  rows={2}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-emerald-600 text-gray-900 font-medium resize-none"
                  required
                  id="checkout_input_address"
                />
              </div>
            </div>

            {/* Select preferred payment routing */}
            <div className="pt-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preferred Payment Gateway</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Pay On Delivery')}
                  className={`py-2.5 px-3 border rounded-lg text-xs font-bold text-center transition cursor-pointer ${
                    paymentMethod === 'Pay On Delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  id="option_payment_pod"
                >
                  Pay on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Paystack')}
                  className={`py-2.5 px-3 border rounded-lg text-xs font-bold text-center transition cursor-pointer ${
                    paymentMethod === 'Paystack'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  id="option_payment_paystack"
                >
                  Pay Online (Paystack)
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">
                {paymentMethod === 'Pay On Delivery'
                  ? '✓ Pay Cash or POS Transfer at door after delivery checking.'
                  : '✓ Use secure Nigerian banking transfer, card processing, or USSD code.'}
              </p>
            </div>

            {/* Final triggers */}
            <div className="pt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => executeOrderCheckout()}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl py-3.5 text-xs font-black tracking-widest uppercase shadow-sm flex items-center justify-center space-x-2 transition active:scale-98 cursor-pointer"
                id="cart_submit_checkout_btn"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paymentMethod === 'Paystack' ? 'Execute Paystack Payment' : 'Dispatch Order Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-xs font-black tracking-widest uppercase flex items-center justify-center space-x-2 transition cursor-pointer"
                id="cart_submit_whatsapp_btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Process via WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
