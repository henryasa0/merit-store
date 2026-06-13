import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { FORMAT_CURRENCY } from '../data';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewDetails
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-xl border border-gray-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      id={`product_card_${product.id}`}
    >
      
      {/* Visual Image & Badge Container */}
      <div className="relative pt-[70%] bg-gray-50 rounded-t-xl overflow-hidden cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
            -{product.discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-xs text-gray-400 hover:text-emerald-700 hover:shadow-md transition-all cursor-pointer"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          id={`wishlist_toggle_${product.id}`}
        >
          <Heart 
            className={`w-4 h-4 transition ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500'}`} 
          />
        </button>

        {/* Stock Alert */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-wider">
            Only {product.stock} Left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-gray-800">
            Out of Stock
          </span>
        )}
      </div>

      {/* Meta details & naming */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category row */}
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            <span>{product.brand}</span>
            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm">
              {product.categories ? product.categories.join(' / ') : product.category}
            </span>
          </div>

          {/* Product Name Title */}
          <h3 
            onClick={() => onViewDetails(product.id)}
            className="font-bold text-gray-800 hover:text-emerald-700 text-sm leading-snug line-clamp-2 h-10 cursor-pointer transition-colors"
            title={product.name}
            id={`product_title_click_${product.id}`}
          >
            {product.name}
          </h3>

          {/* Star Rating details */}
          <div className="flex items-center space-x-1 mt-2">
            <span className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                />
              ))}
            </span>
            <span className="text-xs font-bold text-gray-500">({product.rating})</span>
          </div>
        </div>

        {/* Action Row - Pricing and CTA checkout */}
        <div className="pt-4 border-t border-gray-50 mt-4 flex items-end justify-between gap-2">
          
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {FORMAT_CURRENCY(product.oldPrice)}
              </span>
            )}
            <span className="text-base font-extrabold text-gray-900 tracking-tight">
              {FORMAT_CURRENCY(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.stock === 0}
            className={`cursor-pointer shrink-0 p-2.5 rounded-lg font-bold flex items-center justify-center transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 shadow-sm'
            }`}
            title="Add to Cart"
            id={`add_to_cart_btn_${product.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
