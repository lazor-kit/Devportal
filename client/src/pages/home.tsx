import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import TagFilter from "@/components/tag-filter";
import ViewToggle, { ViewMode } from "@/components/view-toggle";
import DappCard from "@/components/product-card";
import ProductListItem from "@/components/product-list-item";
import Pagination from "@/components/pagination";
import { Product, Dapp, ProductTag, DappTag } from "@shared/schema";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Construct API query params
  const queryParams = new URLSearchParams();
  if (debouncedSearchTerm) queryParams.append("search", debouncedSearchTerm);
  if (selectedTags.length === 1) queryParams.append("tag", selectedTags[0]);
  
  const queryKey = selectedTags.length <= 1 
    ? [`/api/products?${queryParams.toString()}`]
    : ['/api/products'];
  
  const { data: rawProducts = [], isLoading } = useQuery<Product[]>({
    queryKey,
  });
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedTags]);
  
  // Filter by multiple tags client-side if more than one tag is selected
  const filteredProducts = selectedTags.length > 1
    ? rawProducts.filter(product => 
        selectedTags.every(tag => product.tags.includes(tag))
      )
    : rawProducts;
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 home-gradient-bg">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'solana-text' : 'text-gray-900'} animate-float`}>Lazor.kit</h1>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'} animate-fade-in-up`}>Discover Solana dApps powered by Lazor.kit - the simple, secure, and fast solution for sign-in-with-Solana without wallet apps</p>
          </div>
          <div className="flex space-x-2">
            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4">
                  <Skeleton className="h-48 md:w-1/4 rounded-lg" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* No Results */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className={`mt-2 text-sm font-semibold ${theme === 'dark' ? 'solana-text' : 'text-gray-900'}`}>No projects found</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              Try adjusting your search or filter to find what you're looking for, or submit your own project!
            </p>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === "grid" && paginatedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`animate-fade-in-up delay-${Math.min(index * 100, 300)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <DappCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === "list" && paginatedProducts.length > 0 && (
          <div className="space-y-4">
            {paginatedProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductListItem product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
