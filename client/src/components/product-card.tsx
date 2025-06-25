import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onProductClick: () => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onProductClick}>
      <div className="relative overflow-hidden rounded-lg bg-gray-900 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.bestseller && (
          <div className="absolute top-4 left-4 bg-bravenza-gold text-black px-2 py-1 text-xs font-medium rounded">
            BESTSELLER
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <button className="bg-white text-black px-6 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
            Quick View
          </button>
        </div>
      </div>
      <h3 className="font-medium mb-2 group-hover:text-bravenza-gold transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-bravenza-gold font-playfair text-lg">${product.price}</p>
    </div>
  );
}
