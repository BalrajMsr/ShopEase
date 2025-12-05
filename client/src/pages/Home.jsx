import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productsSlice";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.products);

  // Filter and Sort States
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, name-az, name-za
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(items.map(p => p.category).filter(Boolean))];
    return cats.length > 0 ? cats : ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books'];
  }, [items]);

  // Filter and Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        selectedCategories.includes(p.category) ||
        (p.category === undefined && selectedCategories.includes('Electronics'))
      );
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [items, sortBy, priceRange, selectedCategories, searchQuery]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSearchQuery('');
    setSortBy('featured');
  };

  const activeFiltersCount = selectedCategories.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Hero Banner */}
        <div className="mb-8 glass rounded-3xl p-8 md:p-12 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="gradient-text">Trending Products</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Explore our curated collection of premium products handpicked just for you
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 animate-slide-in-top">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors glass"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none p-4 pr-12 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors glass cursor-pointer font-semibold"
            >
              <option value="featured">✨ Featured</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name-az">🔤 Name: A to Z</option>
              <option value="name-za">🔤 Name: Z to A</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-6 py-4 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md flex items-center justify-center gap-2"
          >
            <span>🎛️</span>
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-white text-primary-600 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="glass rounded-2xl p-6 sticky top-24 animate-slide-in-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>📂</span>
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label
                      key={category}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-5 h-5 accent-primary-500 cursor-pointer"
                      />
                      <span className="flex-1">{category}</span>
                      <span className="text-xs text-neutral-500">
                        ({items.filter(p => p.category === category || (p.category === undefined && category === 'Electronics')).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span>💰</span>
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-neutral-600 mb-1 block">Min</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full p-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-neutral-600 mb-1 block">Max</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full p-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary-500"
                  />
                  <div className="text-sm text-neutral-600 text-center">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="p-3 bg-primary-50 border-2 border-primary-200 rounded-xl">
                  <div className="text-sm font-semibold text-primary-800 mb-2">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                  </div>
                  <div className="text-xs text-primary-600">
                    Showing {filteredAndSortedProducts.length} of {items.length} products
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-neutral-600">
                <span className="font-bold text-neutral-800">{filteredAndSortedProducts.length}</span> products found
              </p>
            </div>

            {status === "loading" ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="spinner mb-4"></div>
                <p className="text-neutral-600 text-lg">Loading amazing products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
                <p className="text-neutral-600 mb-6">
                  {items.length === 0
                    ? "Check back soon for new arrivals!"
                    : "Try adjusting your filters or search query"}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((p, index) => (
                  <div
                    key={p._id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}