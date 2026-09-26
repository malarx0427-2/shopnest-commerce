import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '@/data/products';
import type { Category } from '@/types';
import ProductCard from '@/components/ProductCard';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'discount';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sort = (searchParams.get('sort') as SortOption) || 'relevance';
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0');
  const minRating = parseFloat(searchParams.get('minRating') || '0');

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (maxPrice > 0) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort(
          (a, b) =>
            (b.originalPrice - b.price) / b.originalPrice -
            (a.originalPrice - a.price) / a.originalPrice
        );
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, maxPrice, minRating, sort]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
              !selectedCategory
                ? 'bg-teal-50 text-teal-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => updateParam('category', cat.name)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Price Range
        </h3>
        <div className="space-y-1.5">
          {[
            { label: 'All Prices', value: 0 },
            { label: 'Under ₹500', value: 500 },
            { label: '₹500 - ₹2,000', value: 2000 },
            { label: '₹2,000 - ₹10,000', value: 10000 },
            { label: '₹10,000 - ₹50,000', value: 50000 },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParam('maxPrice', opt.value > 0 ? String(opt.value) : '')
              }
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                (maxPrice === opt.value ||
                  (opt.value === 0 && !maxPrice)) &&
                (opt.value === 0 ? !maxPrice : maxPrice === opt.value)
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Minimum Rating
        </h3>
        <div className="space-y-1.5">
          {[
            { label: 'All Ratings', value: 0 },
            { label: '4★ & above', value: 4 },
            { label: '4.5★ & above', value: 4.5 },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParam(
                  'minRating',
                  opt.value > 0 ? String(opt.value) : ''
                )
              }
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                (opt.value === 0 ? !minRating : minRating === opt.value)
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 md:pb-0">
      <div className="flex items-center justify-between mt-4 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}{' '}
            found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
            <option value="discount">Discount: High to Low</option>
          </select>
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-32 bg-white rounded-2xl border border-gray-100 p-5">
            {FilterPanel}
          </div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 text-lg font-medium">
                No products found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[85%] bg-white shadow-xl overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-4">{FilterPanel}</div>
            <div className="p-4 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-500"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
