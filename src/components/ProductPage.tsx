import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Send, ShieldAlert, BadgeCheck, Heart, Sparkles, ShieldCheck, Leaf, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { FORMAT_CURRENCY } from '../data';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onViewProductDetails: (productId: string) => void;
}

export default function ProductPage({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onViewProductDetails
}: ProductPageProps) {
  const [qty, setQty] = useState(1);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How should I take the Strong Man Power Herbal Syrup for best results?",
      answer: "For instant stamina, take 1 tablespoon of the syrup 45 minutes before intimacy. For a permanent cure of weak erections, low sperm count, and premature ejaculation, take 1 tablespoon daily (preferably in the morning or evening). Shake the bottle well before use."
    },
    {
      question: "Are there any side effects with this herbal remedy?",
      answer: "Absolutely none! Strong Man Power Herbal Syrup is formulated from 100% natural, premium bio-extracts and wild cold-pressed honey. It does not cause racing heartbeats, headaches, or blood pressure drops, making it completely safe and highly effective."
    },
    {
      question: "What is 'Pay on Delivery' and how fast does shipping take?",
      answer: "We offer 100% Free Delivery in Rivers State with absolutely No Upfront Payment. You only pay the courier when they hand the package over to you! Delivery takes 1–2 working days to your door anywhere in Rivers State (with same-day delivery inside Port Harcourt GRA/city zones)."
    },
    {
      question: "Is the packaging completely private and discreet?",
      answer: "Yes, your privacy is our supreme priority. All orders are secured in a plain, completely unmarked outer package. There are no branding labels, ingredients lists, or shop names on the outer box, ensuring total confidentiality from neighbors or family."
    },
    {
      question: "How long does it take to see permanent size and stamina improvements?",
      answer: "You will experience stronger, rock-solid erections within 45 minutes of your first dose. Permanent structural corrections, including penis thickness and length gains, are fully realized within 2 weeks of consistent daily usage."
    }
  ];

  // Filter 4 related products of the identical category, excluding the active item itself
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Derive package level configurations if available
  const hasPackages = product.packages && product.packages.length > 0;
  const activePackage = hasPackages && product.packages ? product.packages[selectedPackageIndex] : null;

  const activePrice = activePackage ? activePackage.price : product.price;
  const activeOldPrice = activePackage ? activePackage.oldPrice : product.oldPrice;
  const activeDiscount = activeOldPrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : product.discount;

  const getPackagedProductObject = (): Product => {
    if (!activePackage) return product;
    return {
      ...product,
      id: `${product.id}-pack-${activePackage.bottles}`,
      name: `${product.name} - ${activePackage.bottles} ${activePackage.bottles === 1 ? 'Bottle' : 'Bottles'} (${activePackage.label})`,
      price: activePrice,
      oldPrice: activeOldPrice,
      discount: activeDiscount
    };
  };

  const incrementQty = () => {
    if (qty < product.stock) {
      setQty((prev) => prev + 1);
    }
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Back to Results link */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-emerald-700 font-semibold mb-6 transition cursor-pointer"
        id="single_product_back_btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main product card column split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-xs">
        
        {/* Left Side: Image Display of the product */}
        <div className="lg:col-span-6 flex flex-col justify-center bg-gray-50 rounded-xl p-6 relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[420px] w-auto mx-auto object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />

          {/* Quick specs pill */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-gray-100 py-1.5 px-3 rounded-full text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Satisfaction Guaranteed</span>
          </div>
        </div>

        {/* Right Side: Description and Custom Checkout Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Category and Brand taglines */}
            <div className="flex items-center space-x-2 text-xs font-black tracking-widest text-emerald-700 uppercase">
              <span>{product.brand} Official</span>
              <span>•</span>
              <span className="text-gray-400">{product.category} Section</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Tags */}
            <div className="flex items-center space-x-4 mt-4">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {FORMAT_CURRENCY(activePrice)}
              </span>
              {activeOldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {FORMAT_CURRENCY(activeOldPrice)}
                </span>
              )}
              {activeDiscount && (
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded">
                  SAVE {activeDiscount}%
                </span>
              )}
            </div>

            {/* Verified Quality Assurance Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 pb-1 border-t border-b border-gray-100" id="product_assurances_badge_row">
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Quality Assurance</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No Side Effects</span>
              </div>
            </div>

            {/* Urgency Stock Countdown Indicator */}
            <div className="mt-4 bg-amber-50/40 border border-amber-200/50 rounded-xl p-3 flex flex-col gap-2" id="stock_urgency_countdown_indicator">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-900 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span>Extremely High Demand</span>
                </span>
                <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md animate-pulse">
                  Only {product.stock} items left!
                </span>
              </div>
              <div className="w-full bg-gray-200/65 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 to-amber-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(3, Math.min(100, (product.stock / 300) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-amber-900 font-bold leading-none">
                🔥 {Math.round(100 - Math.max(3, Math.min(100, (product.stock / 300) * 100)))}% of today's nationwide delivery batch has been claimed. complete order form now to secure yours.
              </p>
            </div>

            {/* Description text */}
            <p className="text-gray-600 text-sm leading-relaxed mt-5">
              {product.description}
            </p>

            {/* Key product specifications list */}
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Key Remedy Highlights:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-bold hover:border-emerald-200 hover:bg-emerald-50/10 transition-colors">
                      <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Checkout parameters & interactive triggers */}
          <div className="border-t border-gray-100 pt-6 space-y-5">
            
            {/* Promo Packages card selector */}
            {hasPackages && product.packages && (
              <div className="bg-emerald-50/20 border border-emerald-100/70 p-4 rounded-xl">
                <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase mb-3.5 block">
                  🎁 Step 1: Choose Your Money-Saving Bottle Package (Free Delivery)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="package_selection_grid">
                  {product.packages.map((pkg, idx) => {
                    const isSelected = selectedPackageIndex === idx;
                    const savings = pkg.oldPrice ? pkg.oldPrice - pkg.price : 0;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPackageIndex(idx)}
                        className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/5'
                        }`}
                        id={`product_package_card_${pkg.bottles}`}
                      >
                        {pkg.bottles === 2 && (
                          <span className="absolute -top-2.5 -right-2 bg-emerald-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                            Popular
                          </span>
                        )}
                        {pkg.bottles === 3 && (
                          <span className="absolute -top-2.5 -right-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs animate-bounce">
                            Best Value
                          </span>
                        )}
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs flex items-center gap-1.5 text-gray-900">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-emerald-700 bg-emerald-700' : 'border-gray-300'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span>{pkg.bottles} {pkg.bottles === 1 ? 'Bottle' : 'Bottles'}</span>
                            </span>
                            {pkg.oldPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                {FORMAT_CURRENCY(pkg.oldPrice)}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                            {pkg.label}
                          </p>
                        </div>

                        <div className="mt-3.5 flex items-baseline justify-between border-t border-dashed border-gray-100 pt-1.5">
                          <span className="text-xs font-black text-emerald-800">
                            {FORMAT_CURRENCY(pkg.price)}
                          </span>
                          {savings > 0 && (
                            <span className="text-[9px] font-extrabold text-red-600 bg-red-50 px-1 rounded">
                              Save {FORMAT_CURRENCY(savings)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity select row */}
            <div className="flex items-center space-x-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {hasPackages ? 'Order Quantity:' : 'Select Quantity:'}
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={decrementQty}
                  disabled={qty <= 1}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 font-bold bg-white rounded-md border border-gray-200 shadow-3xs disabled:opacity-50 cursor-pointer"
                  id="product_page_qty_dec"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-800">{qty}</span>
                <button
                  type="button"
                  onClick={incrementQty}
                  disabled={qty >= product.stock}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 font-bold bg-white rounded-md border border-gray-200 shadow-3xs disabled:opacity-50 cursor-pointer"
                  id="product_page_qty_inc"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500 font-semibold italic">
                {hasPackages ? 'Securely packaged for privacy' : `${product.stock} units in stock`}
              </span>
            </div>

            {/* Buttons row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onAddToCart(getPackagedProductObject(), qty)}
                disabled={product.stock === 0}
                className={`py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide flex-1 flex items-center justify-center space-x-2 transition cursor-pointer ${
                  product.stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-emerald-700 text-emerald-800 hover:bg-emerald-50 active:scale-98 shadow-2xs'
                }`}
                id="product_page_add_to_cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Package To Cart</span>
              </button>

              <button
                onClick={() => onBuyNow(getPackagedProductObject(), qty)}
                disabled={product.stock === 0}
                className={`py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide flex-1 flex items-center justify-center space-x-2 transition cursor-pointer ${
                  product.stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-98 shadow-md'
                }`}
                id="product_page_buy_now"
              >
                <span>Express Order Now</span>
              </button>

              {/* Wishlist Heart button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3.5 border rounded-xl flex items-center justify-center transition cursor-pointer ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-emerald-700'
                }`}
                aria-label="Wishlist Toggle"
                id="product_page_wishlist_toggle"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Trust guarantees footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-emerald-950 uppercase">100% Secure Transacting</p>
            <p className="text-[11px] text-emerald-900 mt-0.5">Pay safely using our integrated Nigerian Paystack processing gateway or cash at delivery.</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3">
          <BadgeCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-emerald-950 uppercase">Original Bio-Herbal Guarantee</p>
            <p className="text-[11px] text-emerald-900 mt-0.5">We source organic wild honey and bioactive cold-pressed herbal stems directly from local harvesters.</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3">
          <Send className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-emerald-950 uppercase">Urgent Delivery Dispatch</p>
            <p className="text-[11px] text-emerald-950 mt-0.5">Orders verified before 1 PM are eligible for same-day delivery inside Port Harcourt and surrounding Rivers State zones.</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-2xs" id="product_faq_accordion_section">
        <div className="flex items-center space-x-2.5 mb-6 border-b border-gray-100 pb-4">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400 font-medium">Quick answers regarding usage, herbal benefits, and discreet shipping</p>
          </div>
        </div>

        <div className="space-y-4" id="faq_accordion_container">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-200 ${
                  isOpen 
                    ? 'border-emerald-600/30 bg-emerald-50/10 shadow-3xs' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
                id={`faq_accordion_item_${index}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-gray-800 hover:text-emerald-900 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700 font-black" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-dashed border-gray-100/70 animate-fadeIn">
                    <p className="font-medium text-gray-700">{faq.answer}</p>
                    {index === 2 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-sm">✅ Pay on delivery</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-sm">✅ No upfront payment</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-sm">✅ Free delivery Nationwide</span>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-sm">✅ Plain package</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-sm">✅ Completely private</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related items section */}
      {related.length > 0 && (
        <div className="mt-12 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight flex items-center space-x-2">
            <span>Customers Also Explored in</span>
            <span className="text-amber-600 underline font-black">{product.category}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((rp) => (
              <div 
                key={rp.id}
                onClick={() => onViewProductDetails(rp.id)}
                className="bg-white rounded-xl border border-gray-100 p-3 hover:border-amber-300 hover:shadow-xs transition duration-200 cursor-pointer flex flex-col h-full group text-center"
                id={`related_product_${rp.id}`}
              >
                <div className="flex-1 bg-gray-50 rounded-lg p-2 flex items-center justify-center min-h-[120px] max-h-[140px] overflow-hidden">
                  <img
                    src={rp.image}
                    alt={rp.name}
                    className="max-h-[100px] object-contain group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-bold text-xs text-gray-800 group-hover:text-amber-600 mt-3 line-clamp-2 h-8 leading-snug">
                  {rp.name}
                </h4>
                <div className="mt-2 text-xs font-extrabold text-gray-900">
                  {FORMAT_CURRENCY(rp.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
