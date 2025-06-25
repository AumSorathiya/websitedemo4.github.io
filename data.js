// Product data
const products = [
    {
        id: 1,
        name: "Elegant Silk Blouse",
        description: "Luxurious silk blouse with contemporary tailoring and elegant drape.",
        price: "289.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1564257577-d18f494f8fdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: true
    },
    {
        id: 2,
        name: "Classic Tailored Blazer",
        description: "Perfectly tailored blazer crafted from premium wool blend.",
        price: "459.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: false
    },
    {
        id: 3,
        name: "Luxury Cashmere Sweater",
        description: "Ultra-soft cashmere sweater for ultimate comfort and style.",
        price: "325.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: true
    },
    {
        id: 4,
        name: "Designer Evening Dress",
        description: "Stunning evening dress perfect for special occasions.",
        price: "695.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1566479179817-9e44bb54a5de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: true
    },
    {
        id: 5,
        name: "Premium Trench Coat",
        description: "Classic trench coat with modern details and superior craftsmanship.",
        price: "589.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        featured: false
    },
    {
        id: 6,
        name: "Sophisticated Midi Skirt",
        description: "Elegant midi skirt with pleated details and premium fabric.",
        price: "245.00",
        category: "women",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: false,
        featured: false
    },
    {
        id: 7,
        name: "Classic Oxford Shirt",
        description: "Timeless oxford shirt crafted from premium cotton.",
        price: "189.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: true
    },
    {
        id: 8,
        name: "Tailored Wool Suit",
        description: "Impeccably tailored suit in premium wool for the modern gentleman.",
        price: "895.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: true
    },
    {
        id: 9,
        name: "Luxury Cashmere Coat",
        description: "Sophisticated cashmere coat with minimalist design.",
        price: "756.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        featured: true
    },
    {
        id: 10,
        name: "Designer Wool Sweater",
        description: "Premium wool sweater with contemporary cut and luxurious feel.",
        price: "289.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        featured: false
    },
    {
        id: 11,
        name: "Classic Leather Jacket",
        description: "Timeless leather jacket with superior craftsmanship and attention to detail.",
        price: "645.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: true,
        featured: false
    },
    {
        id: 12,
        name: "Premium Chinos",
        description: "Perfectly fitted chinos in premium cotton twill.",
        price: "156.00",
        category: "men",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        featured: false
    }
];

// Categories
const categories = {
    women: "Women's Collection",
    men: "Men's Collection"
};

// Export for use in other files
window.productsData = products;
window.categoriesData = categories;