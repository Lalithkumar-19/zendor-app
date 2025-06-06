"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import ProductCard from './ProductCard';
import axiosInstance from '@/utils/AxiosInstance';

const AllProducts = ({ name, subcategory }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch categories based on product type
  useEffect(() => {
    
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const endpoint = name === "wallpapers" 
          ? "/wallpapers/getCategories" 
          : "/wooden-floors/getCategories";
          
        const response = await axiosInstance.get(endpoint);
        if (response.data && response.data.data) {
          const categoryNames = response.data.data.map(category => category.name);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error(`Error fetching ${name} categories:`, error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    if (name === "wallpapers" || name === "wooden-floorings") {
      fetchCategories();
    }
  }, [name]);

  // Fetch products when page, search, or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filterParams = selectedFilters.length > 0 
          ? `&subCategories=${selectedFilters.join(',')}` 
          : '';
          
        const url =
          name === "wallpapers"
            ? `/wallpapers/products?page=${currentPage}&limit=10${filterParams}&search=${searchTerm}`
            : `/wooden-floors/products?page=${currentPage}&limit=10${filterParams}&search=${searchTerm}`;
          
        const res = await axiosInstance.get(url);
        
        if (res.data) {
          const newProducts = res.data.data || [];
          if (currentPage === 1) {
            setProducts(newProducts);
          } else {
            setProducts(prev => [...prev, ...newProducts]);
          }
          setHasMore(newProducts.length === 10);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedFilters, name]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/wooden-floors/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleProductClick = async (productId) => {
    try {
      const endpoint = name === "wallpapers"
        ? `/wallpapers/product/${productId}`
        : `/wooden-floors/product/${productId}`;
      
      const res = await axiosInstance.get(endpoint);
      if (res.data.status === "success") {
        router.push(`/admin/products/${name}/${productId}`);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleFilterChange = (category) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category];
      
      if (JSON.stringify(newFilters) !== JSON.stringify(prev)) {
        setProducts([]);
      }
      
      return newFilters;
    });
  };

  if (name === "wallpapers" || name === "wooden-floorings") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#003f62] capitalize">{name}</h1>
          </div>
          <button 
            onClick={() => router.push(`/admin/products/${name}/add`)}
            className="flex items-center gap-2 bg-[#003f62] text-white px-4 py-2 rounded-lg hover:bg-[#003f62]/90 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
  
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md mb-3 border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#003f62]/20 focus:border-[#003f62] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
  
              <div className="flex gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${showFilters ? 'bg-gray-50 border-[#003f62] text-[#003f62]' : ''}`}
                  >
                    <Filter size={20} />
                    <span className="hidden md:inline font-medium">Filters</span>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute top-full mt-2 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Sub Categories</h3>
                      </div>
                      <div className="p-4 max-h-64 overflow-y-auto">
                        {loadingCategories ? (
                          <div className="text-center py-4 text-gray-500">Loading categories...</div>
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <label key={category} className="flex items-center gap-3 py-2 px-1 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(category)}
                                onChange={() => handleFilterChange(category)}
                                className="w-4 h-4 rounded border-gray-300 text-[#003f62] focus:ring-[#003f62] transition-colors"
                              />
                              <span className="text-gray-700">{category}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">No categories found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#003f62]/20 focus:border-[#003f62] font-medium text-gray-700">
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Stock: Low to High</option>
                </select>
              </div>
            </div>
          </div>
          
          {selectedFilters.length > 0 && (
            <div className="px-4 md:px-6 py-3 bg-gray-50 rounded-b-xl flex flex-wrap gap-2">
              {selectedFilters.map(filter => (
                <span key={filter} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700">
                  {filter}
                  <button
                    onClick={() => handleFilterChange(filter)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedFilters.length > 1 && (
                <button 
                  onClick={() => setSelectedFilters([])} 
                  className="text-xs text-[#003f62] hover:underline ml-2 self-center"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
  
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {products.map((product, index) => {
            const isLastProduct = products.length === index + 1;
            return (
              <div 
                ref={isLastProduct ? lastProductElementRef : null}
                key={product._id || product.id}
                onClick={() => handleProductClick(product._id || product.id)}
                className="cursor-pointer"
              >
                <ProductCard 
                  category={name}
                  product={{
                    id: product._id || product.id,
                    name: product.name,
                    price: `₹${product.sampleCost || product.price}`,
                    image: product.images?.[0] || product.image,
                    summary: product.description,
                    brand: product.brand,
                    finish: product.finish,
                    surface: product.surface,
                    subCategory: product.subCategory,
                    sampleCost: product.sampleCost,
                    stock: product.stock,
                    tags: product.tags || []
                  }}
                  onDelete={handleDelete}
                />
              </div>
            );
          })}
          {loading && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003f62]"></div>
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#003f62] capitalize">No {name} Products</h1>
          </div>
        </div>
      </div>
    );
  }
};

export default AllProducts;