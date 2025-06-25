import { useState } from "react";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface NavigationProps {
  onLoginClick: () => void;
  onCartClick: () => void;
  onSearchClick: () => void;
}

export default function Navigation({ onLoginClick, onCartClick, onSearchClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-bravenza-dark/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-bravenza-gold font-playfair text-2xl font-bold tracking-wider cursor-pointer"
                 onClick={() => scrollToSection("home")}>
              <span className="text-4xl">B</span>RAVENZA
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("shop")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection("bestsellers")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Best Sellers
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection("instagram")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Instagram
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onSearchClick}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={onLoginClick}
              className="text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={onCartClick}
              className="relative text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-bravenza-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bravenza-charcoal border-t border-gray-800">
          <div className="px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection("home")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("shop")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection("bestsellers")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Best Sellers
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection("instagram")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Instagram
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="block text-white hover:text-bravenza-gold transition-colors duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
