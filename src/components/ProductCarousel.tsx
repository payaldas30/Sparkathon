// components/ProductCarousel.tsx
import { Product } from '@/lib/walmart-scrapper';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="text-sm font-medium text-gray-300 mb-2">Products you might like:</div>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {products.map((product) => (
          <div key={product.link} className="flex-shrink-0 w-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-white line-clamp-2">{product.title}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-yellow-400">★ {product.stars}</span>
                <span className="text-xs text-gray-400 ml-2">({product.reviewCount} reviews)</span>
              </div>
              <div className="mt-2">
                <span className="text-sm font-bold text-white">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}