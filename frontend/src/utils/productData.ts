const products = [
  {
    id: 1,
    name: "Elegant Ankara Midi Dress",
    price: 45000,
    originalPrice: 55000,
    image: "/ronkz.jpg",
    rating: 4.9,
    reviews: 24,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red", "Green"],
    badge: "Best Seller",
    category: "Dresses",
    subcategory: "Ankara Gown",
    description: "A beautiful Ankara midi dress perfect for any occasion.",
  },
  {
    id: 2,
    name: "Office Blazer Set",
    price: 65000,
    image: "/ronkz.jpg",
    rating: 4.8,
    reviews: 18,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
    badge: "New",
    category: "Office Wear",
    subcategory: "Blazer Set",
    description: "A stylish office blazer set that exudes professionalism.",
  },
  {
    id: 3,
    name: "Evening Cocktail Dress",
    price: 85000,
    originalPrice: 95000,
    image: "/ronkz.jpg",
    rating: 5.0,
    reviews: 31,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Wine", "Emerald"],
    badge: "Limited",
    category: "Dresses",
    subcategory: "Evening Gown",
    description: "A stunning evening cocktail dress that makes a statement.",
  },
  {
    id: 4,
    name: "Ankara Wrap Dress",
    price: 38000,
    image: "/ronkz.jpg",
    rating: 4.7,
    reviews: 42,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi", "Orange", "Purple"],
    badge: "",
    category: "Dresses",
    subcategory: "Ankara Gown",
    description: "A beautiful Ankara wrap dress that flatters all body types.",
  },
  {
    id: 5,
    name: "Senator Material Gown",
    price: 72000,
    image: "/ronkz.jpg",
    rating: 4.9,
    reviews: 28,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Cream", "Gold"],
    badge: "Premium",
    category: "Dresses",
    subcategory: "Senator Gown",
    description: "A luxurious senator gown made from premium materials.",
  },
  {
    id: 6,
    name: "Casual Office Shirt",
    price: 28000,
    image: "/ronkz.jpg",
    rating: 4.6,
    reviews: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    badge: "",
    category: "Office Wear",
    subcategory: "Shirts",
    description: "A comfortable casual office shirt for everyday wear.",
  },
  {
    id: 7,
    name: "Casual Office Shirt",
    price: 28000,
    image: "/ronkz.jpg",
    rating: 4.6,
    reviews: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    badge: "",
    category: "Office Wear",
    subcategory: "Shirts",
    description: "A comfortable casual office shirt for everyday wear.",
  },
  {
    id: 8,
    name: "Casual Office Shirt",
    price: 28000,
    image: "/ronkz.jpg",
    rating: 4.6,
    reviews: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    badge: "",
    category: "Office Wear",
    subcategory: "Shirts",
    description: "A comfortable casual office shirt for everyday wear.",
  },
  {
    id: 9,
    name: "Casual Office Shirt",
    price: 28000,
    image: "/ronkz.jpg",
    rating: 4.6,
    reviews: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    badge: "",
    category: "Office Wear",
    subcategory: "Shirts",
    description: "A comfortable casual office shirt for everyday wear.",
  },
  {
    id: 10,
    name: "Casual Office Shirt",
    price: 28000,
    image: "/ronkz.jpg",
    rating: 4.6,
    reviews: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    badge: "",
    category: "Office Wear",
    subcategory: "Shirts",
    description: "A comfortable casual office shirt for everyday wear.",
  },
];
export default products;

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  badge?: string;
  category: string;
  subcategory: string;
  description: string;
}

export interface ProductList {
  products: Product[];
}

export const productDetails = {
  id: 1,
  name: "Elegant Ankara Midi Dress",
  price: 45000,
  originalPrice: 55000,
  image: "/ronkz.jpg",
  rating: 4.9,
  reviews: 24,
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue", "Red", "Green"],
  badge: "Best Seller",
  category: "Dresses",
  subcategory: "Ankara Gown",
  description: "A beautiful Ankara midi dress perfect for any occasion.",
};


