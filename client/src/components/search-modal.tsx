import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { Product } from "@shared/schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onProductClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", "search", searchQuery],
    queryFn: () => 
      searchQuery.length > 0 
        ? fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`).then(res => res.json())
        : Promise.resolve([]),
    enabled: searchQuery.length > 0,
  });

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-bravenza-charcoal border-gray-700" aria-describedby="search-description">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              autoFocus
            />
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div id="search-description" className="sr-only">Search for products by name or description</div>
            {searchQuery.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Start typing to search products...</p>
            ) : isLoading ? (
              <p className="text-gray-400 text-center py-8">Searching...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No products found</p>
            ) : (
              <div className="space-y-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className="flex items-center space-x-4 p-4 hover:bg-bravenza-dark rounded cursor-pointer transition-colors duration-300"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-400">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
