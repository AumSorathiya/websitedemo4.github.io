export const CATEGORIES = [
  { value: "all", label: "All Items" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
] as const;

export const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "0-100", label: "$0 - $100" },
  { value: "100-300", label: "$100 - $300" },
  { value: "300+", label: "$300+" },
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
] as const;

export const BRAND_COLORS = {
  gold: "hsl(45, 85%, 52%)",
  lightGold: "hsl(45, 78%, 85%)",
  dark: "hsl(0, 0%, 4%)",
  charcoal: "hsl(0, 0%, 10%)",
} as const;
