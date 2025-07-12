// components/ProductCarousel.tsx
import { Product } from '@/lib/walmart-scrapper';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!products || products.length === 0) return null;

  const previewCount = isMobile ? 3 : 4;

  return (
    <>
      {/* Clickable Response Box */}
      <div
        className="w-full mb-4 cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 group-hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white mb-1">
                🛍️ Product Recommendations
              </h3>
              <p className="text-xs text-gray-400">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center text-gray-400 group-hover:text-white transition-colors ml-4">
              <span className="text-xs mr-2 hidden sm:inline">Click to view</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Preview thumbnails */}
          <div className="flex gap-2 mt-3 overflow-hidden">
            {products.slice(0, previewCount).map((product, index) => (
              <div key={index} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-500 text-xs">📷</span>
                )}
              </div>
            ))}
            {products.length > previewCount && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs">+{products.length - previewCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                🛍️ Product Recommendations ({products.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 hover:bg-gray-800 rounded-lg ml-2 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable product grid */}
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {products.map((product, index) => (
                  <div
                    key={product.link || index}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg flex flex-col"
                  >
                    <div className="h-32 sm:h-40 md:h-48 bg-gray-700 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title || 'Product'}
                          width={200}
                          height={200}
                          className="object-contain max-h-full max-w-full"
                          unoptimized
                        />
                      ) : (
                        <div className="text-gray-500 text-sm text-center">
                          📷<br />No Image
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h3 className="text-xs sm:text-sm font-medium text-white mb-2 line-clamp-2 flex-1">
                        {product.title || 'Product Title'}
                      </h3>

                      {(product.stars || product.reviewCount) && (
                        <div className="flex items-center mb-2 sm:mb-3">
                          {product.stars && (
                            <span className="text-xs sm:text-sm text-yellow-400">★ {product.stars}</span>
                          )}
                          {product.reviewCount && (
                            <span className="text-xs sm:text-sm text-gray-400 ml-2">({product.reviewCount})</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="text-sm sm:text-base font-bold text-white truncate">
                          {product.price || 'N/A'}
                        </span>
                        {product.link && (
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm transition-colors flex-shrink-0"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (min-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
