import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import CartModal from "@/components/cart-modal";
import AuthModals from "@/components/auth-modals";
import SearchModal from "@/components/search-modal";
import EnhancedCheckout from "@/components/enhanced-checkout";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { ChevronDown, Instagram, Facebook, Twitter, Linkedin, Truck, RotateCcw, Shield } from "lucide-react";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  // Fetch all products
  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch bestsellers
  const { data: bestSellers = [], isLoading: isLoadingBestSellers } = useQuery<Product[]>({
    queryKey: ["/api/products", "bestsellers"],
    queryFn: () => fetch("/api/products?bestsellers=true").then(res => res.json()),
  });

  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      
      if (selectedPriceRange !== "all") {
        const price = parseFloat(product.price);
        switch (selectedPriceRange) {
          case "0-100":
            if (price > 100) return false;
            break;
          case "100-300":
            if (price < 100 || price > 300) return false;
            break;
          case "300+":
            if (price < 300) return false;
            break;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.bestseller ? 1 : -1;
      }
    });

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await apiRequest("POST", "/api/newsletter", { email });
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contactData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      await apiRequest("POST", "/api/contact", contactData);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message! We'll get back to you soon.",
      });
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bravenza-dark text-white">
      <Navigation 
        onLoginClick={() => setShowLoginModal(true)}
        onCartClick={() => setShowCartModal(true)}
        onSearchClick={() => setShowSearchModal(true)}
      />

      <HeroSection onExploreClick={() => {
        document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
      }} />

      {/* Featured Categories */}
      <section className="py-20 bg-bravenza-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-light mb-4">Curated Collections</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover our meticulously crafted pieces designed for those who understand true elegance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Women's Collection */}
            <div className="group relative overflow-hidden bg-gray-900 rounded-lg cursor-pointer"
                 onClick={() => setSelectedCategory("women")}>
              <img 
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Women's Collection" 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-playfair text-2xl font-medium mb-2">Women's Collection</h3>
                <p className="text-gray-300 mb-4">Sophisticated elegance for every occasion</p>
                <button className="text-bravenza-gold hover:text-white transition-colors duration-300">
                  Shop Now <ChevronDown className="inline w-4 h-4 ml-2 -rotate-90" />
                </button>
              </div>
            </div>

            {/* Men's Collection */}
            <div className="group relative overflow-hidden bg-gray-900 rounded-lg cursor-pointer"
                 onClick={() => setSelectedCategory("men")}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Men's Collection" 
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-playfair text-2xl font-medium mb-2">Men's Collection</h3>
                <p className="text-gray-300 mb-4">Timeless sophistication redefined</p>
                <button className="text-bravenza-gold hover:text-white transition-colors duration-300">
                  Shop Now <ChevronDown className="inline w-4 h-4 ml-2 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section id="bestsellers" className="py-20 bg-bravenza-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-light mb-4">Best Sellers</h2>
            <p className="text-gray-400 text-lg">Our most coveted pieces, loved by fashion connoisseurs worldwide</p>
          </div>

          {isLoadingBestSellers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 h-80 rounded-lg mb-4"></div>
                  <div className="bg-gray-800 h-4 rounded mb-2"></div>
                  <div className="bg-gray-800 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-20 bg-bravenza-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-bravenza-dark p-6 rounded-lg sticky top-24">
                <h3 className="font-playfair text-xl font-medium mb-6">Filter Products</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Items" },
                      { value: "women", label: "Women" },
                      { value: "men", label: "Men" }
                    ].map((category) => (
                      <label key={category.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={selectedCategory === category.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-bravenza-gold focus:ring-bravenza-gold"
                        />
                        <span className="ml-2 text-sm">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Prices" },
                      { value: "0-100", label: "$0 - $100" },
                      { value: "100-300", label: "$100 - $300" },
                      { value: "300+", label: "$300+" }
                    ].map((range) => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={selectedPriceRange === range.value}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="text-bravenza-gold focus:ring-bravenza-gold"
                        />
                        <span className="ml-2 text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    Showing {filteredProducts.length} products
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-bravenza-dark border border-gray-600 rounded px-3 py-2 text-sm focus:border-bravenza-gold focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-800 h-80 rounded-lg mb-4"></div>
                      <div className="bg-gray-800 h-4 rounded mb-2"></div>
                      <div className="bg-gray-800 h-4 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-bravenza-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-light mb-6">Our Legacy</h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Founded on the principle that true elegance is timeless, BRAVENZA represents more than just fashion—it's a statement of refined taste and uncompromising quality.
                </p>
                <p>
                  Each piece in our collection is meticulously crafted using the finest materials sourced from around the world. Our designers draw inspiration from classical elegance while embracing contemporary innovation.
                </p>
                <p>
                  When you choose BRAVENZA, you're not just wearing clothing—you're embracing a legacy of sophistication that speaks to those who understand that true style transcends trends.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-playfair text-bravenza-gold mb-2">25+</div>
                  <div className="text-sm text-gray-400">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-playfair text-bravenza-gold mb-2">50K+</div>
                  <div className="text-sm text-gray-400">Satisfied Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-playfair text-bravenza-gold mb-2">100%</div>
                  <div className="text-sm text-gray-400">Premium Quality</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="BRAVENZA Atelier" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-bravenza-gold/10 rounded-lg"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-bravenza-gold/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section id="instagram" className="py-20 bg-bravenza-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-light mb-4">@bravenza</h2>
            <p className="text-gray-400 text-lg">Follow us for daily style inspiration and behind-the-scenes moments</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
            ].map((src, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer">
                <img 
                  src={src}
                  alt={`Instagram Post ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-bravenza-gold text-bravenza-gold hover:bg-bravenza-gold hover:text-black transition-all duration-300 px-8 py-3"
            >
              Follow @bravenza
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-bravenza-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-light mb-6">Stay in Style</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive events, and style insights from the world of BRAVENZA.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 bg-bravenza-charcoal border-gray-600 focus:border-bravenza-gold"
            />
            <Button 
              type="submit"
              className="bg-bravenza-gold text-black hover:bg-bravenza-light-gold px-6 py-3"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-bravenza-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-light mb-6">Get in Touch</h2>
              <p className="text-gray-400 text-lg mb-8">
                Have questions about our collections or need styling advice? Our team is here to help you discover your perfect look.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="text-bravenza-gold w-6">📍</div>
                  <span className="ml-4">123 Fashion Avenue, New York, NY 10001</span>
                </div>
                <div className="flex items-center">
                  <div className="text-bravenza-gold w-6">📞</div>
                  <span className="ml-4">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <div className="text-bravenza-gold w-6">✉️</div>
                  <span className="ml-4">hello@bravenza.com</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">Store Hours</h3>
                <div className="text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    required
                    className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    required
                    className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                  />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
                <Input
                  name="subject"
                  placeholder="Subject"
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  required
                  className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold resize-none"
                />
                <Button 
                  type="submit"
                  className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold py-3"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bravenza-dark border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-bravenza-gold font-playfair text-2xl font-bold tracking-wider mb-4">
                <span className="text-4xl">B</span>RAVENZA
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Drape yourself in legacy. Experience timeless elegance with our curated collection of premium fashion pieces.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-bravenza-gold transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-bravenza-gold transition-colors duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-bravenza-gold transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-bravenza-gold transition-colors duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#shop" className="hover:text-white transition-colors duration-300">Shop</a></li>
                <li><a href="#bestsellers" className="hover:text-white transition-colors duration-300">Best Sellers</a></li>
                <li><a href="#about" className="hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-medium mb-4">Customer Care</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Care Instructions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 BRAVENZA. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCheckout={() => setShowCheckoutModal(true)}
      />

      <EnhancedCheckout 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)}
      />

      <AuthModals
        showLogin={showLoginModal}
        showSignup={showSignupModal}
        onCloseLogin={() => setShowLoginModal(false)}
        onCloseSignup={() => setShowSignupModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onProductClick={(product) => {
          setSelectedProduct(product);
          setShowSearchModal(false);
        }}
      />
    </div>
  );
}
