import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Truck, ArrowRight, Award } from 'lucide-react';

interface HeroProps {
  onShopCatalog: () => void;
  onFilterCategory: (cat: string) => void;
}

const SLIDES = [
  {
    tagline: '100% ORGANIC HERBAL FORMULA',
    title: 'Ignite Your Pure Stamina with Strong Man Syrup',
    highlight: 'Formulated mainly for men with wild forest honey, organic ginger, and active botanical ingredients.',
    bgColor: 'from-emerald-800 via-teal-700 to-emerald-950',
    btnText: 'Shop Strong Man Syrup',
    categoryTarget: 'Herbal Syrup'
  },
  {
    tagline: 'FORMULATED MAINLY FOR MEN',
    title: 'Uncompromised Performance & Vitality, Guaranteed',
    highlight: '100% natural, bioactive ingredients designed to support daily stamina and rapid recovery.',
    bgColor: 'from-emerald-900 via-emerald-800 to-emerald-950',
    btnText: 'Order Strong Man Power',
    categoryTarget: 'Herbal Syrup'
  },
  {
    tagline: 'PREMIUM QUALITY STANDARDS',
    title: 'Authentic Batches From Merit Online Store',
    highlight: 'Pharmaceutical grade amber bottles and thick packaging ensure unmatched purity and potency.',
    bgColor: 'from-slate-900 via-teal-950 to-emerald-950',
    btnText: 'Check Ingredients & Dosage',
    categoryTarget: 'Herbal Syrup'
  }
];

export default function Hero({ onShopCatalog, onFilterCategory }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="bg-gray-50 pb-8">
      {/* Slider Hero Outer */}
      <div className="relative overflow-hidden">
        <div className={`transition-all duration-1000 ease-in-out bg-gradient-to-r ${slide.bgColor} text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative`}>
          
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
            
            {/* Promo Content Column */}
            <div className="md:col-span-7 space-y-5">
              <span className="inline-block bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {slide.tagline}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl">
                {slide.title}
              </h1>
              <p className="text-lg text-emerald-100 font-medium tracking-wide max-w-xl">
                {slide.highlight}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => onFilterCategory(slide.categoryTarget)}
                  className="bg-white text-emerald-950 hover:bg-neutral-100 px-6 py-3.5 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer animate-pulse"
                  id={`hero_shop_cat_${slide.categoryTarget}`}
                >
                  {slide.btnText}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onShopCatalog}
                  className="bg-transparent border border-white/40 hover:bg-white/15 px-6 py-3.5 rounded-lg text-sm font-bold text-white transition-all cursor-pointer"
                  id="hero_shop_all_btn"
                >
                  Browse Full Catalog
                </button>
              </div>
            </div>

            {/* Graphics / Interactive Indicators Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-5">
              <div className="relative group w-full max-w-sm">
                {/* Glowing decorative backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-2xl blur-md opacity-30 group-hover:opacity-40 transition duration-1000" />
                
                <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center overflow-hidden flex flex-col items-center">
                  <div className="relative w-full h-56 bg-white rounded-xl p-3 flex items-center justify-center shadow-inner mb-3">
                    <img 
                      src="/images/strong_man_syrup_1781212742827.jpg" 
                      alt="Strong Man Power" 
                      className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      Free Rivers State Shipping
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white flex items-center justify-center gap-1">
                    <span>Strong Man Power Syrup</span>
                    <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded text-white font-extrabold animate-pulse">100% NATURAL</span>
                  </h4>
                  <p className="text-[11px] text-emerald-100 mt-1 font-medium">Free delivery, zero transport fees to your door anywhere in Rivers State or Port Harcourt city zones!</p>
                </div>
              </div>

              {/* Slider Dots indicators */}
              <div className="flex space-x-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === idx ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Trust Badges - Highly Professional Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 py-6 px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-x-0 sm:divide-x divide-gray-100">
            
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <dt className="text-sm font-bold text-gray-900">100% Organic</dt>
                <dd className="text-xs text-gray-500 mt-0.5">Bioactive clinical extracts</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pl-0 md:pl-6">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <dt className="text-sm font-bold text-gray-900">Pay on Delivery</dt>
                <dd className="text-xs text-gray-500 mt-0.5">Nationwide logistics drops</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pl-0 md:pl-6">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <dt className="text-sm font-bold text-gray-900">Pure Biologicals</dt>
                <dd className="text-xs text-gray-500 mt-0.5">No synthetic chemical additives</dd>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pl-0 md:pl-6">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <dt className="text-sm font-bold text-gray-900">Merit Store Chat</dt>
                <dd className="text-xs text-gray-500 mt-0.5">Direct WhatsApp consults</dd>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
