"use client";

import React, { useEffect, useState, useCallback } from "react";

import {
  ShoppingCart,
  Menu,
  X,
  Plus,
  Minus,
  Search,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  RefreshCw,
  Mail,
  ArrowRight,
  Heart,
  Package,
  Award,
  Globe,
  Users,
  Clock,
  Sparkles,
  Zap,
  CheckCircle,
  TrendingUp,
  Leaf,
  Droplets,
  Recycle,
  TreePine,
  Filter,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Grid3x3,
  List,
  Calendar,
  Tag,
  Eye,
  Share2,
  Bookmark,
  Flower,
  Camera,
  Palette,
  Layers,
  Truck,
  CreditCard,
  Headphones,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Define types for better type safety
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  isBestSeller?: boolean;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface Cart {
  [key: string]: CartItem;
}

interface LookbookCollection {
  id: string;
  title: string;
  description: string;
  season: string;
  images: string[];
  products: number[]; // Product IDs
  video?: string;
  designer?: string;
  inspiration?: string;
  colorPalette?: string[];
  fabrics?: string[];
}

/**
 * Final single-file page: app/page.jsx
 *
 * Notes:
 * - Replace firebaseConfig with your project's config.
 * - Firestore products collection path used: `artifacts/afimah-store/products`.
 *   Each product doc should include at least: { id, name, category, price, description, image }.
 * - Local images should be placed in /public (e.g. /product1.png).
 */

// Firebase is initialized centrally in `src/lib/firebase.ts` and `db` is imported above.

/* ========== Static fallback PRODUCTS ========== */
const STATIC_PRODUCTS: Product[] = [
  { id: 1, name: "Elegant winter-inspired prints", category: "Linen", price: 1999, description: "Soft and warm winter linen 3-piece set with elegant prints.", image: "/product1.png", rating: 4.5, isBestSeller: true },
  { id: 2, name: "Dhanak Embroidery Wool Shawl", category: "Warm Wool Shawl", price: 2500, description: "Hand-embroidered wool shawl to keep you cozy and stylish in winter.", image: "/product2.png", rating: 4.8, isBestSeller: true },
  { id: 3, name: "Maya Ali Branded Lawn 3pc", category: "Suits", price: 2400, description: "Designer lawn 3-piece set with vibrant prints, perfect for casual and semi-formal wear.", image: "/product3.png", rating: 4.2 },
  { id: 4, name: "Khaadi Fabrics 3pc Printed Lawn", category: "Printed Lawn", price: 2399, description: "Classic 3-piece lawn set with timeless prints for daily elegance.", image: "/product4.png", rating: 4.7, isBestSeller: true },
  { id: 20, name: "Khaadi Fabrics 3pc Printed Lawn", category: "Printed Lawn", price: 2399, description: "Designer lawn 3-piece set with vibrant prints and stylish cuts.", image: "/product20.png", rating: 4.7 },
  { id: 30, name: "Khaadi Fabrics 3pc Printed Lawn", category: "Printed Lawn", price: 2399, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product30.png", rating: 4.4 },
  { id: 6, name: "Big Brand Alkaram studio Winter Khaddar 2pc", category: "Kurtas", price: 3500, description: "Warm Khaddar kurta set with elegant winter embroidery.", image: "/product6.png", rating: 4.6 },
  { id: 7, name: "Alkaram Doria Linen 3pc", category: "Doria Linen 3pc", price: 2500, description: "Elegant doria linen 3-piece with chiffon dupatta, perfect for festive wear.", image: "/product7.png", rating: 4.3 },
  { id: 8, name: "Alkaram Doria Linen 3pc", category: "Doria Linen 3pc", price: 2500, description: "Soft doria linen 3-piece set with traditional patterns and comfortable fit.", image: "/product8.png", rating: 4.6 },
  { id: 9, name: "Alkaram Doria Linen 3pc", category: "Doria Linen 3pc", price: 2500, description: "Luxurious doria linen 3-piece set with intricate embroidery for special occasions.", image: "/product9.png", rating: 4.7 },
  { id: 10, name: "Alkaram Doria Linen 3pc", category: "Doria Linen 3pc", price: 2500, description: "Handblock printed kurti with modern cut and elegant chiffon dupatta.", image: "/product10.png", rating: 4.4 },
  { id: 5, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Lightweight winter linen 3-piece set with subtle, classy prints.", image: "/product5.png", rating: 4.9, isBestSeller: true },
  { id: 11, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Warm winter linen 3-piece set with cozy and stylish prints.", image: "/product11.png", rating: 4.2 },
  { id: 12, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Winter linen 3-piece set with subtle embroidery and elegant patterns.", image: "/product12.png", rating: 4.8 },
  { id: 13, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Comfortable winter linen 3-piece outfit with printed motifs.", image: "/product13.png", rating: 4.5 },
  { id: 14, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Cozy winter linen 3-piece set with subtle elegance and soft texture.", image: "/product14.png", rating: 4.6 },
  { id: 15, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Classic winter linen 3-piece ensemble with elegant prints.", image: "/product15.png", rating: 4.7 },
  { id: 16, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Lightweight and comfortable winter linen 3-piece set for everyday wear.", image: "/product16.png", rating: 4.4 },
  { id: 17, name: "Alkaram Winter Linen 3pc Printed", category: "Winter linen 3pc", price: 2399, description: "Elegant winter linen 3-piece set with soft texture and premium finish.", image: "/product17.png", rating: 4.6 },
  { id: 18, name: "Maya Ali Branded Lawn 3pc Printed", category: "Suits", price: 2400, description: "Designer lawn 3-piece set with vibrant prints and stylish cuts.", image: "/product18.png", rating: 4.7 },
  { id: 19, name: "Maya Ali Branded Lawn 3pc Printed", category: "Suits", price: 2400, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product19.png", rating: 4.4 },
  { id: 21, name: "Dhanak Embroidery with wool shawal ", category: "Warm Wool Shawl", price: 2500, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product21.png", rating: 4.4 },
  { id: 22, name: "Dhanak Embroidery with wool shawal ", category: "Warm Wool Shawl", price: 2500, description: "Designer lawn 3-piece set with vibrant prints and stylish cuts.", image: "/product22.png", rating: 4.7 },
  { id: 23, name: "Dhanak Embroidery with wool shawal ", category: "Warm Wool Shawl", price: 2500, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product23.png", rating: 4.4 },
  { id: 24, name: "Winter PRINTED Linen 3pc ", category: "Printed Linen 3pc", price: 1999, description: "Designer lawn 3-piece set with vibrant prints and stylish cuts.", image: "/product24.png", rating: 4.7 },
  { id: 25, name: "Winter PRINTED Linen 3pc", category: "Printed Linen 3pc", price: 1999, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product25.png", rating: 4.4 },
  { id: 26, name: "Winter PRINTED Linen 3pc", category: "Printed Linen 3pc", price: 1999, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product26.png", rating: 4.4 },
  { id: 27, name: "Winter PRINTED Linen 3pc", category: "Printed Linen 3pc", price: 1999, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product27.png", rating: 4.4 },
  { id: 28, name: "Winter PRINTED Linen 3pc", category: "Printed Linen 3pc", price: 1999, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product28.png", rating: 4.4 },
  { id: 29, name: "Winter PRINTED Linen 3pc", category: "Printed Linen 3pc", price: 1999, description: "Comfortable and stylish lawn 3-piece set suitable for daily wear.", image: "/product29.png", rating: 4.4 },
];

// Enhanced lookbook collections with more details
const LOOKBOOK_COLLECTIONS: LookbookCollection[] = [
  {
    id: "spring-2023",
    title: "Floral Harmony",
    description: "Embrace the freshness of spring with our vibrant floral prints and pastel hues. This collection captures the essence of renewal and growth with delicate blossoms and soft color palettes.",
    season: "Spring 2023",
    images: [
      "/product7.png",
      "/product8.png",
      "/product9.png",
      "/product10.png",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop"
    ],
    products: [1, 3, 7, 11],
    designer: "Ayesha Malik",
    inspiration: "Spring gardens in full bloom after winter",
    colorPalette: ["#E8F5E9", "#F8BBD0", "#E1BEE7", "#BBDEFB", "#FFECB3"],
    fabrics: ["Organic Cotton", "Linen Blend", "Chiffon", "Silk"]
  },
  {
    id: "summer-2023",
    title: "Crimson Charm",
    description: "Light, airy fabrics in bright colors perfect for those warm summer days. Our summer collection features breathable materials and bold patterns that make a statement.",
    season: "Summer 2023",
    images: [
      "/product20.png",
      "/product4.png",
      "/product30.png",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f2a3214755?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1200&fit=crop"
    ],
    products: [2, 4, 8],
    designer: "Sara Khan",
    inspiration: "Tropical sunsets and ocean waves",
    colorPalette: ["#FFEBEE", "#F3E5F5", "#E3F2FD", "#E0F2F1", "#FFF3E0"],
    fabrics: ["Lawn", "Cotton Voile", "Mesh", "Rayon"]
  },
  {
    id: "autumn-2023",
    title: "Ocean Mist",
    description: "Warm tones and cozy textures that capture the essence of the fall season. Our autumn collection features rich colors and comfortable fabrics perfect for transitional weather.",
    season: "Autumn 2023",
    images: [
      "/product12.png",
      "/product13.png",
      "/product14.png",
      "/product15.png",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop"
    ],
    products: [5, 6, 9, 13],
    designer: "Fatima Sheikh",
    inspiration: "Morning mist over the ocean and autumn forests",
    colorPalette: ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63"],
    fabrics: ["Khaddar", "Wool Blend", "Velvet", "Flannel"]
  },
  {
    id: "festive-2023",
    title: "Golden Radiance",
    description: "Elegant ensembles with intricate details for special celebrations. Our festive collection combines traditional craftsmanship with contemporary designs for memorable occasions.",
    season: "Festive 2023",
    images: [
      "/product21.png",
      "/product22.png",
      "/product23.png",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1200&fit=crop"
    ],
    products: [10, 14, 21, 22, 23, 24],
    designer: "Zara Ahmed",
    inspiration: "Traditional celebrations and modern festivities",
    colorPalette: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFEE58", "#FFEB3B"],
    fabrics: ["Silk", "Jamawar", "Brocade", "Organza"]
  }
];

export default function Page() {
  const { toast } = useToast();

  // App state with proper typing
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS); // replaced by Firestore if available
  const [currentView, setCurrentView] = useState("home"); // home | shop | detail | cart | checkout | lookbook | about | contact
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart>({}); // Properly typed cart state
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", address: "" });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [subscribed, setSubscribed] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Lookbook specific state
  const [selectedCollection, setSelectedCollection] = useState<LookbookCollection | null>(LOOKBOOK_COLLECTIONS[0]);
  const [selectedLookbookImage, setSelectedLookbookImage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCollectionDetails, setShowCollectionDetails] = useState(false);
  const [selectedLook, setSelectedLook] = useState<number>(0);
  const [activeFloralTab, setActiveFloralTab] = useState("inspiration");

  // Instagram gallery state
  const galleryImages = [
    "/product27.png",
    "/product1.png",
    "/product30.png",
    "/product23.png",
    "/product9.png",
    "/product25.png"
  ];
  const [instaOpen, setInstaOpen] = useState(false);
  const [instaIndex, setInstaIndex] = useState(0);

  // Testimonials data - duplicated for marquee effect
  const testimonials = [
    { id: 1, name: "Ayesha Khan", text: "The quality of Afimah's clothing is exceptional. I've been a customer for years and never disappointed.", rating: 5 },
    { id: 2, name: "Sara Ahmed", text: "Beautiful designs and comfortable fabrics. The customer service is also outstanding!", rating: 5 },
    { id: 3, name: "Fatima Sheikh", text: "I love how Afimah blends traditional aesthetics with modern styles. Perfect for any occasion.", rating: 4 },
    { id: 4, name: "Ayesha Khan", text: "The quality of Afimah's clothing is exceptional. I've been a customer for years and never disappointed.", rating: 5 },
    { id: 5, name: "Sara Ahmed", text: "Beautiful designs and comfortable fabrics. The customer service is also outstanding!", rating: 5 },
    { id: 6, name: "Fatima Sheikh", text: "I love how Afimah blends traditional aesthetics with modern styles. Perfect for any occasion.", rating: 4 }
  ];

  // ---------- Load products ----------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("🔄 Loading products...");
        console.log("📦 Using static products");
        setProducts(STATIC_PRODUCTS);
      } catch (error) {
        console.error("❌ Error loading products:", error);
        toast({
          title: "Products Loading Error",
          description: "Unable to load products. Using static data.",
          variant: "destructive",
        });
        setProducts(STATIC_PRODUCTS);
      }
    };

    loadProducts();
  }, [toast]);

  // ---------- Load cart data ----------
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Generate a simple user ID (you can improve this later)
        const userId = localStorage.getItem('userId') || 'user_' + Date.now();
        localStorage.setItem('userId', userId);
        setUserId(userId);
        
        console.log("🔄 Loading cart...");
        console.log("📦 Starting with empty cart");
        setCart({});
        
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error loading cart:", error);
        toast({
          title: "Cart Loading Error",
          description: "Unable to load cart. Starting with empty cart.",
          variant: "destructive",
        });
        setCart({});
        setIsLoading(false);
      }
    };

    loadCart();
  }, [toast]);

  const saveCartToLocalStorage = async (newCart: Cart) => {
    if (!userId) return;
    try {
      console.log("🔄 Saving cart to local storage...");
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      console.log("✅ Cart saved to local storage!");
    } catch (error) {
      console.error("❌ Error saving cart:", error);
    }
  };

  // ---------- Cart actions ----------
  const addToCart = (productId: number, size: string, quantity: number) => {
    const product = products.find(p => p.id === productId) || STATIC_PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const cartKey = `${productId}-${size}`;
    const newCart: Cart = {
      ...cart,
      [cartKey]: {
        productId,
        name: product.name,
        price: product.price,
        size,
        quantity: (cart[cartKey]?.quantity || 0) + quantity,
        image: product.image
      }
    };
    setCart(newCart);
    saveCartToLocalStorage(newCart);
    toast?.({ title: "Added to cart", description: `${product.name} • Size ${size}` });
  };

  const updateCartQuantity = (cartKey: string, delta: number) => {
    const item = cart[cartKey];
    if (!item) return;
    
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      const newCart = { ...cart };
      delete newCart[cartKey];
      setCart(newCart);
      saveCartToLocalStorage(newCart);
    } else {
      const newCart = { 
        ...cart, 
        [cartKey]: { ...item, quantity: newQuantity } 
      };
      setCart(newCart);
      saveCartToLocalStorage(newCart);
    }
  };

  const removeFromCart = (cartKey: string) => {
    const newCart = { ...cart };
    delete newCart[cartKey];
    setCart(newCart);
    saveCartToLocalStorage(newCart);
  };

const placeOrder = async () => {
  try {
    // Prepare order data
    const orderData = {
      customerName: checkoutForm.name,
      customerPhone: checkoutForm.phone,
      customerAddress: checkoutForm.address,
      customerEmail: '', // You can add email field if needed
      items: Object.values(cart),
      total: cartTotal + 500, // Including shipping
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    console.log("🔄 Saving order to local storage...");
    // Save order to local storage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    console.log("✅ Order saved to local storage!");
    
    // Create WhatsApp message with order details
    const whatsappMessage = `*New Order - Afimah Clothing Store*%0A%0A*Customer Details:*%0AName: ${checkoutForm.name}%0APhone: ${checkoutForm.phone}%0AAddress: ${checkoutForm.address}%0A%0A*Order Items:*%0A${Object.values(cart).map(item => `${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - Rs. ${item.price * item.quantity}`).join('%0A')}%0A%0A*Total Amount: Rs. ${cartTotal + 500}*%0A%0A*Order Date:* ${new Date().toLocaleDateString()}%0A%0APlease confirm this order. Thank you!`;
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/923182355949?text=${whatsappMessage}`, '_blank');
    
    // Clear cart and show success modal
    setCart({});
    await saveCartToLocalStorage({});
    setCheckoutForm({ name: "", phone: "", address: "" });
    
    // Show thank you message instead of order confirmation
    setShowOrderModal(true);
  } catch (error) {
    console.error("❌ Error placing order:", error);
    toast({
      title: "Order Error",
      description: "There was an error placing your order. Please try again.",
      variant: "destructive",
    });
  }
};
  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log("Contact form submitted:", contactForm);
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  // ---------- Derived values ----------
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  // ---------- Filtered products for shop ----------
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ---------- New Arrivals: exactly 4 unique items ----------
  const newArrivals = products.slice(0, 4); // Changed from 3 to 4
  
  // ---------- Best Sellers ----------
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  // ---------- Instagram keyboard navigation ----------
  const instaKeyHandler = useCallback((e: KeyboardEvent) => {
    if (!instaOpen) return;
    if (e.key === "Escape") setInstaOpen(false);
    if (e.key === "ArrowLeft") setInstaIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
    if (e.key === "ArrowRight") setInstaIndex(i => (i + 1) % galleryImages.length);
  }, [instaOpen]);

  useEffect(() => {
    if (instaOpen) window.addEventListener("keydown", instaKeyHandler);
    return () => window.removeEventListener("keydown", instaKeyHandler);
  }, [instaOpen, instaKeyHandler]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ---------- UI components ----------

  const Header = () => (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between rounded-full border border-black/10 shadow-sm px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img src="/logo.png" alt="Afimah" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-medium">Afimah Clothing Store</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {["home","shop","lookbook","about","contact"].map(id => (
              <button key={id} onClick={() => setCurrentView(id)} className="text-sm text-muted-foreground hover:text-foreground">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="pl-9 h-9 w-44 lg:w-56" />
            </div>

            <button onClick={() => setCurrentView("cart")} className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full h-4 w-4 flex items-center justify-center text-[10px]">{cartCount}</span>}
            </button>

            {/* Network Status Indicator */}
            <div className="flex items-center gap-2">
              {/* Network Status */}
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} title={isOnline ? 'Online' : 'Offline'}></div>
              
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <Button onClick={() => setCurrentView("shop")} size="sm" className="bg-accent text-accent-foreground">Shop Now</Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setCurrentView("cart")} className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full h-4 w-4 flex items-center justify-center text-[10px]">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 flex flex-col gap-3 pb-3">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products" className="pl-9" />
            <button onClick={() => { setCurrentView("home"); setMobileMenuOpen(false); }}>Home</button>
            <button onClick={() => { setCurrentView("shop"); setMobileMenuOpen(false); }}>Shop</button>
            <button onClick={() => { setCurrentView("lookbook"); setMobileMenuOpen(false); }}>Lookbook</button>
            <button onClick={() => { setCurrentView("about"); setMobileMenuOpen(false); }}>About</button>
            <button onClick={() => { setCurrentView("contact"); setMobileMenuOpen(false); }}>Contact</button>
          </nav>
        )}
      </div>
    </header>
  );

  const HomeView = () => (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(82vh - 72px)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f6f2ec] to-[#ebe4da]" />
        <div className="container relative z-10 mx-auto px-4 pt-0 pb-8 md:pb-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-[10px] uppercase">New Season</div>
              <h1 className="mt-5 text-5xl md:text-6xl font-bold">Modern Elegance,<br/>Effortlessly Yours</h1>
              <p className="mt-6 text-muted-foreground max-w-lg">Curated silhouettes in luxurious fabrics designed to elevate everyday moments.</p>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => setCurrentView("shop")} className="bg-accent text-accent-foreground">Shop Collection</Button>
                <Button variant="outline" onClick={() => setCurrentView("lookbook")}>View Lookbook</Button>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto w-full md:w-[90%]">
                <img src="/hero.png" alt="Hero" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Shop by Category */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <Grid3x3 className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-4xl font-bold mb-4">Shop by Category</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Explore our curated collections organized by style and occasion</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { 
              name: "Linen", 
              image: "/product13.png", 
              count: 12,
              description: "Breathable comfort for everyday elegance",
              icon: <Leaf className="h-5 w-5" />,
              color: "from-green-50 to-green-100"
            },
            { 
              name: "Suits", 
              image: "/product18.png", 
              count: 8,
              description: "Sophisticated ensembles for special occasions",
              icon: <Award className="h-5 w-5" />,
              color: "from-purple-50 to-purple-100"
            },
            { 
              name: "Printed Lawn", 
              image: "/product4.png", 
              count: 15,
              description: "Vibrant prints that express your personality",
              icon: <Palette className="h-5 w-5" />,
              color: "from-pink-50 to-pink-100"
            },
            { 
              name: "Winter Collection", 
              image: "/product28.png", 
              count: 10,
              description: "Warm fabrics to keep you cozy in style",
              icon: <Sparkles className="h-5 w-5" />,
              color: "from-blue-50 to-blue-100"
            }
          ].map((category, index) => (
            <div key={index} className="group relative">
              {/* Category Card */}
              <div 
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                onClick={() => { setSelectedCategory(category.name); setCurrentView("shop"); }}
              >
                {/* Image Container */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                    <div className={`text-accent`}>
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-xl font-bold text-white mb-1">{category.name}</h4>
                      <p className="text-white/90 text-sm mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{category.count} items</span>
                        <button className="bg-white text-gray-900 rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Name Below */}
                <div className="p-4 text-center">
                  <h4 className="font-medium text-lg">{category.name}</h4>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {category.count}
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => setCurrentView("shop")} 
            className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors"
          >
            View All Categories <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl">New Arrivals</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setCurrentView("shop")}>View All</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(p => (
            <div key={p.id} className="group cursor-pointer" onClick={() => { setSelectedProduct(p.id); setCurrentView("detail"); }}>
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h4 className="font-medium">{p.name}</h4>
              <p className="text-accent font-semibold">Rs. {Number(p.price).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limited Edition Collection */}
      <section className="bg-gradient-to-r from-[#f6f2ec] to-[#ebe4da] py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-[10px] uppercase mb-4">Limited Edition</div>
              <h3 className="text-3xl font-bold mb-4">Artisan's Touch Collection</h3>
              <p className="text-lg text-muted-foreground mb-6">Handcrafted pieces featuring intricate embroidery and premium fabrics. Limited quantities available.</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span className="text-sm">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="text-sm">Limited Time</span>
                </div>
              </div>
              <Button onClick={() => setCurrentView("shop")} className="bg-accent text-accent-foreground">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {products.slice(5, 9).map(p => (
                <div key={p.id} className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Best Sellers
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our most-loved pieces that have captured the hearts of our customers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => { setSelectedProduct(product.id); setCurrentView("detail"); }}>
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3 relative">
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">BESTSELLER</div>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
              </div>
              <p className="text-accent font-semibold">Rs. {Number(product.price).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Style Inspiration */}
      <section className="relative overflow-hidden bg-white py-20 text-center">
      {/* Soft rose-gold glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#b76e79]/10 via-white to-[#b76e79]/10 blur-3xl"></div>

      {/* Floating elegant ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="w-[400px] h-[400px] border border-[#b76e79]/30 rounded-full animate-[spin_40s_linear_infinite]"></div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 px-6">
        <h2 className="text-5xl md:text-6xl font-semibold uppercase tracking-[0.3em] text-[#b76e79] mb-6 animate-[textGlow_4s_ease-in-out_infinite]">
          Afimah Clothing Store
        </h2>
        <p className="text-black/80 text-lg md:text-xl tracking-wide font-light">
          Redefining Modern Modesty with a Touch of Luxury
        </p>
      </div>

      {/* Animated shimmer line */}
      <div className="absolute bottom-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b76e79] to-transparent animate-[shine_6s_linear_infinite]"></div>

      {/* Inline animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(183,110,121,0.4); }
          50% { text-shadow: 0 0 14px rgba(183,110,121,0.7); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); opacity: 0.2; }
          50% { opacity: 0.9; }
          100% { transform: translateX(100%); opacity: 0.2; }
        }
      `}</style>
    </section>

      {/* Behind the Scenes */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-lg overflow-hidden">
            <img src="https://img.freepik.com/premium-photo/online-clothing-store-with-laptop-notebook-clothing-rack-mannequin-object-decoration-desk-home-office-small-business-work-home_49071-7349.jpg" alt="Atelier" className="w-full h-full object-cover rounded-lg shadow-md" />
          </div>
          <div>
            <h3 className="text-3xl font-light mb-4">Behind the Scenes</h3>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Step into our design studio where creativity meets craftsmanship. 
              Our team of skilled artisans brings each design to life with meticulous attention to detail.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Design Concept</h4>
                  <p className="text-sm text-muted-foreground">Our designers sketch concepts inspired by cultural heritage and modern trends</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Fabric Selection</h4>
                  <p className="text-sm text-muted-foreground">Premium materials sourced from local artisans and sustainable suppliers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Artisan Craftsmanship</h4>
                  <p className="text-sm text-muted-foreground">Skilled hands bring each piece to life with traditional techniques</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setCurrentView("lookbook")} className="bg-accent text-accent-foreground">
              View Our Process <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Meet the Designer */}
      <section className="relative bg-white py-32 px-6 md:px-12 overflow-hidden">
  {/* Subtle background accents */}
  <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#B89D94]/10 rounded-full blur-3xl -z-10"></div>
  <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#B89D94]/10 rounded-full blur-3xl -z-10"></div>

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
    {/* Left Image Side */}
    <div className="relative group">
      <div className="overflow-hidden rounded-3xl shadow-lg">
        <img
          src="https://gulaal.pk/cdn/shop/files/01_ee9a2b8e-887c-47e7-83d4-b50862636dc1.jpg"
          alt="Afimah Designer Portrait"
          className="w-full h-[650px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="absolute -bottom-12 -left-10 bg-[#B89D94]/10 backdrop-blur-md p-6 rounded-2xl shadow-sm max-w-[280px]">
        <p className="text-[#B89D94] text-sm uppercase tracking-widest">
          Afimah Atelier
        </p>
        <h3 className="text-lg font-medium text-gray-800 mt-1">
          Where elegance meets art.
        </h3>
      </div>
    </div>

    {/* Right Text Side */}
    <div>
      <h2
        className="text-sm uppercase tracking-[0.3em] mb-4 font-light"
        style={{ color: "#B89D94" }}
      >
        The Afimah Philosophy
      </h2>

      <h1 className="text-5xl font-serif font-semibold text-gray-900 leading-tight mb-6">
        Redefining Grace in Every Stitch
      </h1>

      <p className="text-gray-600 text-lg leading-relaxed mb-10">
        Inspired by timeless femininity, Afimah blends heritage craftsmanship
        with modern silhouettes. Each creation tells a story of subtle power —
        for the woman who walks with quiet confidence.
      </p>

      <button
        className="px-8 py-3 border border-[#B89D94] text-[#B89D94] rounded-full hover:bg-[#B89D94] hover:text-white transition-all duration-300 text-sm tracking-wider"
      >
        Discover More
      </button>
    </div>
  </div>
</section>

      {/* Brand Values */}
      <section className="relative bg-white py-24 px-6 md:px-10 text-center overflow-hidden">
  {/* Soft rose-gold background glows */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#B89D94]/10 blur-3xl rounded-full -z-10"></div>
  <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#B89D94]/10 blur-3xl rounded-full -z-10"></div>

  {/* Title */}
  <div className="max-w-2xl mx-auto mb-14">
    <h2
      className="text-sm uppercase tracking-[0.3em] mb-3 font-light"
      style={{ color: "#B89D94" }}
    >
      A Touch of Afimah
    </h2>
    <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-snug">
      Where Style Becomes Poetry
    </h3>
    <p className="text-gray-600 mt-4 text-base max-w-md mx-auto">
      More than fabric — every Afimah piece tells a story of grace, artistry, and emotion.
    </p>
  </div>

  {/* Values Grid */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16">
    {[
      {
        title: "Grace",
        desc: "Soft silhouettes that celebrate femininity through elegance and flow.",
      },
      {
        title: "Artistry",
        desc: "Each stitch, a deliberate brushstroke in the canvas of timeless fashion.",
      },
      {
        title: "Emotion",
        desc: "Designed to make you feel — confident, beautiful, and unforgettable.",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="group relative p-6 rounded-2xl border border-[#B89D94]/20 transition-all duration-500 hover:border-[#B89D94]/40 hover:bg-[#B89D94]/5"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#B89D94]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h4
          className="text-2xl font-medium mb-3 text-gray-900 transition-colors duration-300 group-hover:text-[#B89D94]"
        >
          {item.title}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>

{/* 🌿 Elegant Services Section */}
<section className="relative py-20 bg-gradient-to-b from-white via-rose-50/30 to-white overflow-hidden">
  {/* Soft background accents */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-[#C6A280]/10 blur-3xl rounded-full -z-10"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#E8D3C2]/10 blur-3xl rounded-full -z-10"></div>

  <div className="container mx-auto px-6 md:px-12 text-center">
    {/* Heading */}
    <h2 className="text-sm uppercase tracking-[0.3em] text-[#C6A280] mb-3">Our Promise</h2>
    <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-12">
      Services Crafted with Care
    </h3>

    {/* Service Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          icon: Truck,
          title: "Swift Dispatch",
          desc: "We ship every order with priority, ensuring your pieces reach you quickly and safely.",
        },
        {
          icon: RefreshCw,
          title: "Hassle-Free Exchanges",
          desc: "Not in love yet? Enjoy an effortless exchange experience within 14 days.",
        },
        {
          icon: Shield,
          title: "Trusted Payments",
          desc: "Your trust is sacred — we use encrypted, globally secure payment gateways.",
        },
      ].map(({ icon: Icon, title, desc }, i) => (
        <div
          key={i}
          className="group bg-white/80 backdrop-blur-sm border border-[#C6A280]/20 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500"
        >
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#C6A280]/10 group-hover:bg-[#C6A280]/20 transition-colors duration-500">
              <Icon className="h-8 w-8 text-[#C6A280] transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
          <h4 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-[#C6A280] transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="relative py-24 px-6 md:px-12 bg-gradient-to-b from-white via-[#F7F4F3] to-white text-center">
  {/* Subtle background texture */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,157,148,0.08),transparent_70%)]"></div>

  <div className="max-w-6xl mx-auto relative z-10">
    {/* Heading */}
    <h2 className="text-xs uppercase tracking-[0.3em] text-[#B89D94]/70 mb-3">
      What They Say
    </h2>
    <h3 className="text-4xl md:text-5xl font-serif font-semibold text-[#3C2E2B] mb-16">
      Every Detail, Every Compliment
    </h3>

    {/* Testimonials */}
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          name: "Areeba Khan",
          text: "Absolutely loved the outfit — soft, elegant, and perfectly tailored. Felt like a dream.",
        },
        {
          name: "Fatima Malik",
          text: "Minimal yet striking. The fabric, the cut — everything spoke luxury in silence.",
        },
        {
          name: "Laiba Noor",
          text: "The craftsmanship is flawless. Afimah's design language is beauty without noise.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="relative bg-white border border-[#B89D94]/30 rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(184,157,148,0.25)] transition-all duration-500 hover:-translate-y-1"
        >
          <span className="absolute -top-5 left-6 text-[80px] font-serif text-[#B89D94]/15 select-none leading-none">
            "
          </span>

          <p className="text-[#4B3E3A] italic leading-relaxed mb-8 relative z-10">
            "{item.text}"
          </p>

          <p className="font-semibold text-[#B89D94] uppercase tracking-wide text-sm">
            {item.name}
          </p>
        </div>
      ))}
    </div>

    {/* Accent line */}
    <div className="mt-20 flex justify-center">
      <div className="w-24 h-[1.5px] bg-[#B89D94]/70 rounded-full"></div>
    </div>
  </div>
</section>

      {/* Instagram gallery */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl">From Instagram</h3>
          <a href="#" className="inline-flex items-center gap-2 text-muted-foreground"><Instagram className="h-5 w-5" /> <span>@afimah</span></a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <button key={i} onClick={() => { setInstaIndex(i); setInstaOpen(true); }} className="group relative overflow-hidden rounded-md">
              <img src={img} alt={`Gallery ${i+1}`} className="h-40 md:h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-full p-2">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-[#f6f2ec] to-[#ebe4da] py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl mb-4">Stay Connected</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration from Afimah.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                className="pl-10" 
              />
            </div>
            <Button onClick={handleSubscribe} className="bg-accent text-accent-foreground">
              {subscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer is now global */}
    </div>
  );

  // ---------- Shop / Detail / Cart / Checkout / Modals ----------

  const ShopView = () => {
    // Get unique categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl mb-6">Shop Collection</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Updated Category Buttons */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Button 
            className={`${
              selectedCategory === "All" 
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
            } rounded-full px-4 py-2 text-sm font-medium transition-colors`}
            onClick={() => setSelectedCategory("All")} 
          >
            All
          </Button>
          
          {uniqueCategories.map(cat => (
            <Button 
              key={cat} 
              className={`${
                selectedCategory === cat 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-white text-black border border-gray-300 hover:bg-gray-100"
              } rounded-full px-4 py-2 text-sm font-medium transition-colors`}
              onClick={() => setSelectedCategory(cat)} 
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => { setSelectedProduct(product.id); setCurrentView("detail"); }}>
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <p className="text-accent font-semibold">Rs. {Number(product.price).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        {/* Footer is now global */}
      </div>
    );
  };

  // --- UPDATED LOOKBOOK VIEW ---
  const LookbookView = () => {
    const floralCollection = LOOKBOOK_COLLECTIONS.find(c => c.id === "spring-2023");
    
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf8f4] via-[#f9f2ec] to-[#f3e5d8] py-20">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c7a07a] via-[#d6b28d] to-[#f4e8de]" />

          {/* Main content container */}
          <div className="relative z-10 container mx-auto px-6 md:px-10 h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-16 items-center w-full">

              {/* Left side content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f3e5d8] text-[#7d4b2d] px-4 py-2 text-sm font-medium mb-6 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  New Collection 2025
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#2e1a10]">
                  Artistry in <br /> Every Thread
                </h1>

                <p className="text-lg text-[#5a463a] max-w-lg mb-8 leading-relaxed">
                  Discover our latest collection where traditional craftsmanship meets 
                  contemporary design. Each piece tells a story of elegance reimagined 
                  for the modern wardrobe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setCurrentView("shop")} 
                    className="bg-[#a06c44] text-white hover:bg-[#8c5e39] px-8 py-3 text-lg font-medium transition rounded-full shadow-md"
                  >
                    Explore Collection
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#a06c44] text-[#a06c44] hover:bg-[#f3e5d8] px-8 py-3 text-lg font-medium transition rounded-full"
                  >
                    View Lookbook
                  </Button>
                </div>

                {/* Collection preview indicators */}
                <div className="flex items-center gap-8 mt-12">
                  <div>
                    <p className="text-3xl font-bold text-[#2e1a10]">4</p>
                    <p className="text-sm text-[#5a463a]">Collections</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2e1a10]">24+</p>
                    <p className="text-sm text-[#5a463a]">Designs</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2e1a10]">100%</p>
                    <p className="text-sm text-[#5a463a]">Handcrafted</p>
                  </div>
                </div>
              </div>

              {/* Right side - Split image gallery */}
              <div className="relative h-[550px] md:h-[600px]">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4">
                  {[
                    "https://5.imimg.com/data5/SELLER/Default/2025/1/482997690/MT/SV/JQ/4067967/alkaram-nigar-vol-03-karachi-dress-material.jpg",
                    "https://www.pakstyle.pk/cdn/shop/files/embroidered-linen-winter-dress-18269.webp?v=1760010312&width=1100",
                    "https://i.pinimg.com/736x/ce/80/77/ce80776a7358cfb816c030d7e8800fb0.jpg",
                    "https://i.pinimg.com/1200x/58/87/a1/5887a1ec8c948e2a073e70f730104424.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl shadow-xl transform hover:scale-105 transition-all duration-500 bg-white"
                    >
                      <img
                        src={src}
                        alt={`Collection ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Center overlay with brand logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md rounded-full p-6 shadow-xl border border-[#f0e5da]">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#f3e5d8]">
                      <img
                        src="/logo.png" // replace with your logo path
                        alt="Afimah"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enhanced Floral Harmony Section */}
        {floralCollection && (
  <section className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-[#F8F6F5] to-[#F3EFED]">
    {/* Subtle background accents */}
    <div className="absolute top-10 left-10 w-32 h-32 bg-[#B89D94]/15 rounded-full blur-2xl" />
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#B89D94]/15 rounded-full blur-2xl" />
    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#B89D94]/10 rounded-full blur-2xl" />
    
    <div className="container mx-auto px-4 relative z-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B89D94] rounded-full mb-6 shadow-md">
          <Flower className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-3">
          Floral Harmony
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover timeless femininity in our nature-inspired designs — crafted with grace and subtle charm.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-white/80 backdrop-blur-sm p-1 shadow-sm">
          {[
            { id: "inspiration", label: "Inspiration", icon: Sparkles },
            { id: "palette", label: "Color Palette", icon: Palette },
            { id: "fabrics", label: "Fabrics", icon: Layers },
            { id: "gallery", label: "Gallery", icon: Camera }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFloralTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFloralTab === tab.id
                  ? "bg-[#B89D94] text-white"
                  : "text-gray-600 hover:text-[#B89D94]"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content (same structure — just adjusted styling) */}
      <div className="max-w-6xl mx-auto">
        {activeFloralTab === "inspiration" && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Inspired by Nature's Softest Touch
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The Floral Harmony collection draws from the elegance of spring blooms and the serenity of soft earth tones — designed for women who embody poise and warmth.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#B89D94]/15 rounded-full flex items-center justify-center">
                    <Flower className="h-4 w-4 text-[#B89D94]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Natural Motifs</h4>
                    <p className="text-gray-600">Delicate prints inspired by blooming gardens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#B89D94]/15 rounded-full flex items-center justify-center">
                    <Palette className="h-4 w-4 text-[#B89D94]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Muted Elegance</h4>
                    <p className="text-gray-600">Soft beige, sand, and blush tones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#B89D94]/15 rounded-full flex items-center justify-center">
                    <Layers className="h-4 w-4 text-[#B89D94]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Comfort Fabrics</h4>
                    <p className="text-gray-600">Light, breathable materials for timeless wear</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-[#B89D94] text-white hover:bg-[#a58b82] transition-all">
                Shop Floral Harmony
              </Button>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop"
                  alt="Floral Harmony Inspiration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <p className="text-sm font-medium text-gray-800">Designer: Ayesha Malik</p>
              </div>
            </div>
          </div>
        )}

        {/* Keep your other tab sections (palette, fabrics, gallery, products) same */}
      </div>
    </div>
  </section>
)}


        {/* Unique Collection Showcase Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Seasonal Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each collection is a narrative woven with fabric, color, and imagination. 
                Explore our seasonal interpretations of timeless elegance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {LOOKBOOK_COLLECTIONS.map((collection, index) => (
                <div 
                  key={collection.id} 
                  className={`group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    selectedCollection?.id === collection.id ? 'ring-4 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedCollection(collection)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                  
                  {/* Collection image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={collection.images[0]} 
                      alt={collection.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium mb-2 opacity-90">{collection.season}</p>
                      <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                      <p className="text-sm opacity-80 line-clamp-2">{collection.description}</p>
                    </div>
                    
                    {/* Hover reveal button */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 text-sm font-medium py-2 px-4">
                        Explore Collection
                      </Button>
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-20">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Collection Selector */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl">Our Collections</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by season</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="p-2"
                >
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {LOOKBOOK_COLLECTIONS.map((collection) => (
                <div 
                  key={collection.id} 
                  className={`group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedCollection?.id === collection.id ? 'border-accent' : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                    <img 
                      src={collection.images[0]} 
                      alt={collection.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm">{collection.season}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-medium text-lg">{collection.title}</h3>
                    <p className="text-sm text-muted-foreground">{collection.season}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {LOOKBOOK_COLLECTIONS.map((collection) => (
                <div 
                  key={collection.id} 
                  className={`group cursor-pointer rounded-lg overflow-hidden border-2 transition-all flex ${
                    selectedCollection?.id === collection.id ? 'border-accent' : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="w-1/3 aspect-[3/4] bg-muted overflow-hidden relative">
                    <img 
                      src={collection.images[0]} 
                      alt={collection.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="w-2/3 p-6 bg-white flex flex-col justify-center">
                    <h3 className="font-medium text-xl mb-2">{collection.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{collection.season}</p>
                    <p className="text-sm line-clamp-2">{collection.description}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">New Collection</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Enhanced Selected Collection Gallery */}
       

        {/* Enhanced Trending Now Section */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-3xl mb-4">Trending Now</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Discover the latest fashion trends and how to incorporate them into your wardrobe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group cursor-pointer" onClick={() => setCurrentView("shop")}>
                <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-4 relative">
                  <img src="https://www.alkaramstudio.com/cdn/shop/files/SL-10-25-Cream-1_95f003d8-f360-4bc9-91ff-5d33e9eb22f6.jpg?v=1760165232&width=933" alt="Trend 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-lg font-medium">Earthy Tones</h4>
                    <p className="text-sm">Shop Now</p>
                  </div>
                </div>
                <h4 className="text-xl font-medium mb-2">Earthy Tones</h4>
                <p className="text-muted-foreground">Warm, natural colors that ground your look in sophistication</p>
              </div>
              <div className="text-center group cursor-pointer" onClick={() => setCurrentView("shop")}>
                <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-4 relative">
                  <img src="https://www.alkaramstudio.com/cdn/shop/files/DSC07010_1.jpg?v=1759332945&width=933" alt="Trend 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-lg font-medium">Modern Minimalism</h4>
                    <p className="text-sm">Shop Now</p>
                  </div>
                </div>
                <h4 className="text-xl font-medium mb-2">Modern Minimalism</h4>
                <p className="text-muted-foreground">Clean lines and simple silhouettes for effortless elegance</p>
              </div>
              <div className="text-center group cursor-pointer" onClick={() => setCurrentView("shop")}>
                <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-4 relative">
                  <img src="https://www.alkaramstudio.com/cdn/shop/files/SG73-8-2P25_1_3ece7c94-41cd-4d0c-81bf-521a7094197e.jpg?v=1759232815&width=933" alt="Trend 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-lg font-medium">Artisanal Details</h4>
                    <p className="text-sm">Shop Now</p>
                  </div>
                </div>
                <h4 className="text-xl font-medium mb-2">Artisanal Details</h4>
                <p className="text-muted-foreground">Handcrafted elements that add character to your outfits</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Style Inspiration Section */}
        <section className="relative py-28 bg-[#F8F6F5] overflow-hidden">
  <div className="container mx-auto px-4 text-center relative z-10">
    <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-wide">
      Get Inspired
    </h2>
    <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto mb-16">
      Explore daily inspirations and creative ideas from Afimah — where elegance meets imagination.
    </p>

    {/* Two-layer marquee */}
    <div className="overflow-hidden">
      <div className="animate-marquee flex gap-16 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B89D94] to-[#a58b82]">
        {["Elegance", "Creativity", "Grace", "Style", "Confidence", "Luxury", "Artistry", "Inspiration"].map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </div>
      <div className="animate-marquee-reverse flex gap-16 text-3xl md:text-4xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-[#a58b82] to-[#B89D94]">
        {["Inspiration", "Artistry", "Luxury", "Confidence", "Style", "Grace", "Creativity", "Elegance"].map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </div>
    </div>

    <div className="mt-16">
      <button className="px-10 py-4 bg-gradient-to-r from-[#B89D94] to-[#a58b82] text-white rounded-full hover:scale-105 transition-all">
        Discover More
      </button>
    </div>
  </div>

  {/* Floating decorative circles */}
  <div className="absolute top-0 left-10 w-40 h-40 bg-[#B89D94]/15 rounded-full blur-3xl animate-bounce-slow"></div>
  <div className="absolute bottom-10 right-20 w-60 h-60 bg-[#B89D94]/20 rounded-full blur-3xl animate-spin-slow"></div>
  <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#B89D94]/10 rounded-full blur-2xl animate-ping-slow"></div>
</section>

<style>{`
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes marquee-reverse {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-marquee {
    display: inline-flex;
    animation: marquee 25s linear infinite;
  }
  .animate-marquee-reverse {
    display: inline-flex;
    animation: marquee-reverse 25s linear infinite;
  }
  .animate-bounce-slow {
    animation: bounce 8s infinite alternate;
  }
  .animate-spin-slow {
    animation: spin 40s linear infinite;
  }
  .animate-ping-slow {
    animation: ping 6s infinite;
  }
`}</style>

        {/* Footer is now global */}
      </div>
    );
  };

  const ProductDetailView = () => {
    const product = products.find(p => p.id === selectedProduct) || STATIC_PRODUCTS.find(p => p.id === selectedProduct);
    if (!product) return null;
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="outline" onClick={() => setCurrentView("shop")}>← Back to Shop</Button>
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h2 className="text-2xl md:text-3xl font-light mb-4">{product.name}</h2>
            <p className="text-xl text-accent font-semibold mb-4">Rs. {Number(product.price).toLocaleString()}</p>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2">
                {["S","M","L","XL"].map(sz => (
                  <button key={sz} onClick={() => setSelectedSize(sz)} className={`px-4 py-2 border rounded ${selectedSize === sz ? "bg-accent text-white" : "hover:bg-muted"}`}>{sz}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))} className="p-2 border rounded"><Minus /></button>
                <span className="w-10 text-center">{selectedQuantity}</span>
                <button onClick={() => setSelectedQuantity(selectedQuantity + 1)} className="p-2 border rounded"><Plus /></button>
              </div>
            </div>

            <Button onClick={() => addToCart(product.id, selectedSize, selectedQuantity)} className="bg-accent text-accent-foreground w-full">Add to Cart</Button>
          </div>
        </div>
        
        {/* Footer is now global */}
      </div>
    );
  };

  const CartView = () => {
    const cartItems = Object.entries(cart);
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl mb-6">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Button onClick={() => setCurrentView("shop")}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(([key, item]) => (
                <div key={key} className="flex gap-4 p-4 border rounded-lg">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                    <p className="text-accent font-semibold mt-1">Rs. {Number(item.price).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(key)} className="text-sm text-destructive">Remove</button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(key, -1)} className="p-1 border rounded"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(key, 1)} className="p-1 border rounded"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Rs. {Number(cartTotal).toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Rs. 500</span></div>
              <div className="border-t pt-4 flex justify-between font-semibold"><span>Total</span><span>Rs. {Number(cartTotal + 500).toLocaleString()}</span></div>
              <Button onClick={() => setCurrentView("checkout")} className="w-full bg-accent">Proceed to Checkout</Button>
            </div>
          </div>
        )}
        
        {/* Footer is global */}
      </div>
    );
  };

  interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    notes: string;
  }
  
  interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    notes: string;
  }
  
  const CheckoutView: React.FC = () => {
    const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
      notes: "",
    });
  
    const cartTotal = 1200; // Example static value (replace with dynamic total)
    const shippingCharge = 250;
  
    // Handle field change dynamically
    const handleChange = (field: keyof CheckoutForm, value: string) => {
      setCheckoutForm((prev) => ({ ...prev, [field]: value }));
    };
  
    const placeOrder = () => {
      // ✅ Validation
      if (
        !checkoutForm.name ||
        !checkoutForm.phone ||
        !checkoutForm.address ||
        !checkoutForm.city ||
        !checkoutForm.postalCode
      ) {
        alert("Please fill in all required fields before placing the order.");
        return;
      }
  
      if (!/^\d{11}$/.test(checkoutForm.phone)) {
        alert("Phone number must be exactly 11 digits (e.g., 03XXXXXXXXX).");
        return;
      }
  
      if (!/^\d{5}$/.test(checkoutForm.postalCode)) {
        alert("Postal code must be exactly 5 digits.");
        return;
      }
  
      // ✅ Beautified WhatsApp Order Message
      const orderMessage = `
  🛍 *New Order Received - Afimah Clothing Store* 🛍
  
  ━━━━━━━━━━━━━━━
  👤 *Customer Details*
  ━━━━━━━━━━━━━━━
  • Name: ${checkoutForm.name}
  • Phone: ${checkoutForm.phone}
  • Email: ${checkoutForm.email || "Not provided"}
  • Address: ${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.province}, ${checkoutForm.country}
  • Postal Code: ${checkoutForm.postalCode}
  
  ━━━━━━━━━━━━━━━
  📦 *Order Summary*
  ━━━━━━━━━━━━━━━
  • Subtotal: Rs. ${cartTotal}
  • Shipping Charges: Rs. ${shippingCharge}
  💰 *Total Payable: Rs. ${cartTotal + shippingCharge}*
  
  ━━━━━━━━━━━━━━━
  💳 *Payment Method*
  ━━━━━━━━━━━━━━━
  • Cash on Delivery (COD)
  
  ━━━━━━━━━━━━━━━
  📝 *Customer Notes*
  ━━━━━━━━━━━━━━━
  ${checkoutForm.notes || "No special instructions"}
  
  ━━━━━━━━━━━━━━━
  📅 *Thank you for shopping with Afimah Clothing!*  
  Our team will contact you soon to confirm your order. 💖
      `;
  
      const whatsappURL = `https://wa.me/923279441855?text=${encodeURIComponent(orderMessage)}`;
      window.open(whatsappURL, "_blank");
      
      // Show thank you message after opening WhatsApp
      setShowOrderModal(true);
    };
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Checkout</h2>
  
        <div className="space-y-5 bg-white p-6 rounded-lg shadow-sm border">
          {/* Customer Info */}
          <div>
            <label className="block text-sm mb-2 font-medium">Full Name</label>
            <Input
              placeholder="Enter your full name"
              value={checkoutForm.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
  
          <div>
            <label className="block text-sm mb-2 font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={checkoutForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
  
          <div>
            <label className="block text-sm mb-2 font-medium">Phone Number</label>
            <Input
              type="tel"
              placeholder="03XXXXXXXXX"
              value={checkoutForm.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
  
          {/* Address Section */}
          <div>
            <label className="block text-sm mb-2 font-medium">Full Address</label>
            <Input
              placeholder="House #, Street, Area"
              value={checkoutForm.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-medium">City</label>
              <Input
                placeholder="Enter your city"
                value={checkoutForm.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
  
            <div>
              <label className="block text-sm mb-2 font-medium">Province</label>
              <Input
                placeholder="e.g. Punjab, Sindh"
                value={checkoutForm.province}
                onChange={(e) => handleChange("province", e.target.value)}
              />
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-medium">Postal Code</label>
              <Input
                placeholder="e.g. 54000"
                value={checkoutForm.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
              />
            </div>
  
            <div>
              <label className="block text-sm mb-2 font-medium">Country</label>
              <Input
                placeholder="e.g. Pakistan"
                value={checkoutForm.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm mb-2 font-medium">Order Notes (Optional)</label>
            <textarea
              className="w-full border rounded-md p-2 text-sm resize-none"
              rows={3}
              placeholder="Any special instructions for delivery..."
              value={checkoutForm.notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("notes", e.target.value)
              }
            />
          </div>
  
          {/* Payment Method */}
          <div>
            <label className="block text-sm mb-2 font-medium">Payment Method</label>
            <div className="border rounded-md p-3 bg-gray-50 flex items-center justify-between">
              <span>Cash on Delivery (COD)</span>
              <input type="radio" checked readOnly className="accent-accent h-4 w-4" />
            </div>
          </div>
  
          {/* Order Summary */}
          <div className="border rounded-lg p-4 bg-gray-50 mt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {Number(cartTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span>Rs. {shippingCharge}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {Number(cartTotal + shippingCharge).toLocaleString()}</span>
            </div>
          </div>
  
          <Button onClick={placeOrder} className="w-full bg-accent mt-4">
            Place Order
          </Button>
        </div>
      </div>
    );
  };
  
  const AboutView = () => {
    return (
      <div className="relative min-h-screen overflow-x-hidden font-sans">
  
        {/* Hero Section */}
        <section
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1950&q=80')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 animate-fadeInDown">
              Where Elegance Meets Craftsmanship
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8 animate-fadeInUp">
              Every stitch tells a story of beauty, confidence, and style.
            </p>
            <button className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:scale-105 transition-all">
              Explore Our Story
            </button>
          </div>
        </section>
  
        {/* Vision + Mission */}
        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f2ec] to-[#ebe4da] skew-y-[-3deg] transform -translate-y-12"></div>
          <div className="relative container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg animate-fadeInLeft">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become a leading women's clothing brand that blends elegance, comfort, and affordability – making every woman feel confident and beautiful.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg animate-fadeInRight">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Afimah, our mission is to design stitched and unstitched clothing in vibrant colors, unique designs, and quality fabrics. We empower women with fashion that is stylish yet budget-friendly.
              </p>
            </div>
          </div>
        </section>
  
        {/* Story Section */}
        <section className="py-24 bg-[#fdf7f3]">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative">
            <div className="relative">
              <div className="absolute top-0 left-10 w-40 h-60 bg-pink-100 rounded-xl rotate-6 shadow-lg z-0"></div>
              <div className="relative z-10 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Afimah was born from a dream – to step away from routine and build something meaningful. With passion and dedication, we bring trendy, affordable, and graceful clothing for women.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every outfit is crafted to add confidence, charm, and elegance. Clothing is about expressing your unique personality while feeling comfortable in your own skin.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:scale-105 transition-all">
                <Play className="h-5 w-5" /> Watch Founder Story
              </button>
            </div>
          </div>
        </section>
  
        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              The principles that guide everything we do at Afimah
            </p>
            <div className="relative flex justify-center items-center flex-wrap gap-12">
              {[
                { icon: Shield, title: "Quality", desc: "We never compromise on fabrics or craftsmanship" },
                { icon: Users, title: "Inclusivity", desc: "Fashion for every woman, regardless of age, size, or background" },
                { icon: Leaf, title: "Sustainability", desc: "Committed to ethical practices and sustainable fashion" },
              ].map((val, i) => (
                <div key={i} className="relative w-60 h-60 flex flex-col items-center justify-center bg-white rounded-full shadow-lg hover:scale-105 transition-transform">
                  <val.icon className="h-12 w-12 text-accent mb-3" />
                  <h3 className="text-xl font-semibold mb-1">{val.title}</h3>
                  <p className="text-muted-foreground text-center px-4">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* New Craftsmanship Section */}
        <section className="py-24 bg-[#fdf7f3] relative overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Craftsmanship & Vision</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every piece we create tells a story – from the design table to the finished outfit.
            </p>
          </div>
  
          {/* Image Panels */}
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            {[
              {
                img: "https://textilebuzz.b-cdn.net/image/catalog/25-10-04/sarees-wholesaler-surat-ff9d9902e7dee8ca876ed3e26e130d22.jpeg",
                title: "Premium Fabrics",
                desc: "Handpicked fabrics for comfort and elegance."
              },
              {
                img: "https://i.pinimg.com/736x/de/31/61/de31617c1fd0faaadc01cf2e36c4c462.jpg",
                title: "Exquisite Detailing",
                desc: "Delicate embroidery and perfect stitching in every outfit."
              },
              {
                img: "https://i.pinimg.com/236x/c6/42/2f/c6422f9945f3598765943607936a90b3.jpg",
                title: "Sustainable Fashion",
                desc: "Eco-conscious practices and ethical production."
              }
            ].map((item, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <img src={item.img} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/90">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
  
        {/* Footer is global */}
      </div>
    );
  };
  
  
  // Team Member subcomponent
  const TeamMember = ({ name, role, img }) => (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-gray-700">{role}</p>
    </div>
  );
  

 
  const ContactView = () => {
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleContactSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        // Save to local storage
        console.log("🔄 Saving contact form to local storage...");
        const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        existingContacts.push(contactForm);
        localStorage.setItem('contacts', JSON.stringify(existingContacts));
        
        console.log("✅ Contact form saved to local storage!");
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for your message. We'll get back to you soon.",
        });
        
        // Also send email as fallback
        const subject = encodeURIComponent(contactForm.subject);
        const body = encodeURIComponent(
          `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
        );
        window.location.href = `mailto:an3710828@gmail.com?subject=${subject}&body=${body}`;
        
        // Show success message
        setContactSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setContactSubmitted(false);
          setContactForm({ name: "", email: "", subject: "", message: "" });
        }, 3000);
      } catch (error) {
        console.error("❌ Error saving contact form:", error);
        toast({
          title: "Error Sending Message",
          description: "There was an error sending your message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-[#F8F6F5]">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf8f4] via-[#f9f2ec] to-[#f3e5d8] py-24">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#B89D94]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#a58b82]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-br from-[#d6b28d]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 opacity-10 animate-float-slow">
            <div className="w-20 h-20 border-2 border-[#B89D94] rounded-full"></div>
          </div>
          <div className="absolute bottom-20 right-20 opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>
            <div className="w-16 h-16 border-2 border-[#a58b82] rounded-lg transform rotate-45"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 opacity-10 animate-float-slow" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-[#B89D94]/20 rounded-full"></div>
          </div>
          
          {/* Main content container with glassmorphism effect */}
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="bg-white/25 backdrop-blur-lg rounded-3xl p-8 md:p-16 shadow-2xl border border-white/30 overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#B89D94]/10 to-transparent rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#a58b82]/10 to-transparent rounded-tl-full"></div>
              
              {/* Brand logo with enhanced animation */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B89D94] to-[#a58b82] rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full flex items-center justify-center shadow-inner">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#B89D94] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#a58b82] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-3 h-3 bg-[#d6b28d] rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-3 h-3 bg-[#B89D94] rounded-full transform -translate-y-1/2 translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Title with enhanced gradient and animation */}
              <div className="text-center mb-8">
                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wide bg-gradient-to-r from-[#2e1a10] via-[#B89D94] to-[#2e1a10] bg-clip-text text-transparent animate-gradient">
                  Contact Us
                </h1>
                <div className="mt-4 flex justify-center">
                  <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#B89D94] to-transparent"></div>
                </div>
              </div>
              
              {/* Enhanced description with better typography */}
              <p className="text-xl md:text-2xl text-[#5a463a] max-w-4xl mx-auto leading-relaxed text-center mb-12">
                We'd love to hear from you. Reach out with any questions, feedback, or just to say hello. Our team is ready to assist you.
              </p>
              
              {/* Interactive contact cards with enhanced design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94]/20 to-[#a58b82]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70"></div>
                  <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-8 hover:bg-white/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer border border-white/30">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Phone className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-[#2e1a10] mb-2">Call Us</h3>
                      <p className="text-[#5a463a] font-medium">+92 300 1234567</p>
                      <p className="text-sm text-[#5a463a]/70 mt-1">Mon-Fri: 9AM-6PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94]/20 to-[#a58b82]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70"></div>
                  <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-8 hover:bg-white/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer border border-white/30">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-[#2e1a10] mb-2">Email Us</h3>
                      <p className="text-[#5a463a] font-medium">Afimahclothingstore@gmail.com</p>
                      <p className="text-sm text-[#5a463a]/70 mt-1">24/7 Support</p>
                    </div>
                  </div>
                </div>
                
                
                
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94]/20 to-[#a58b82]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70"></div>
                  <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-8 hover:bg-white/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer border border-white/30">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#B89D94] to-[#a58b82] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-[#2e1a10] mb-2">Visit Us</h3>
                      <p className="text-[#5a463a] font-medium">Lahore, Pakistan</p>
                      <p className="text-sm text-[#5a463a]/70 mt-1">123 Fashion Street</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced decorative element */}
              <div className="mt-12 flex justify-center">
                <div className="relative">
                  <div className="h-1 w-40 bg-gradient-to-r from-transparent via-[#B89D94] to-transparent"></div>
                  <div className="absolute top-0 left-0 h-1 w-40 bg-gradient-to-r from-transparent via-[#B89D94] to-transparent animate-pulse"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#B89D94] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced floating brand elements */}
          <div className="absolute top-10 right-10 opacity-20 animate-float">
            <div className="text-7xl text-[#B89D94] font-serif">A</div>
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="text-7xl text-[#B89D94] font-serif">F</div>
          </div>
          
          {/* Custom animation styles */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            @keyframes float-slow {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
            .animate-float-slow {
              animation: float-slow 6s ease-in-out infinite;
            }
            .animate-spin-slow {
              animation: spin-slow 20s linear infinite;
            }
            .animate-gradient {
              background-size: 200% 200%;
              animation: gradient 5s ease infinite;
            }
          `}</style>
        </section>
  
        {/* Contact Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-700 mb-8">
                Whether you have a question about our products, need assistance with an order, or want to share your feedback, our team is here to help.
              </p>
  
              {/* Contact Methods */}
              {[
                { icon: MapPin, title: "Visit Our Store", text: "123 Fashion Street, Lahore, Pakistan" },
                { icon: Phone, title: "Call Us", text: "+92 300 1234567" },
                { icon: Mail, title: "Email Us", text: "Afimahclothingstore@gmail.com" },
                { icon: MessageCircle, title: "WhatsApp", text: "+92 300 1234567" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-14 h-14 rounded-full bg-[#B89D94]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#B89D94]/20 transition-all">
                    <item.icon className="h-6 w-6 text-[#B89D94]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
  
              {/* Social Links */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/photo/?fbid=615462898233354&set=a.107091452403837"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-[#B89D94]/10 flex items-center justify-center hover:bg-[#B89D94]/20 transition-all hover:scale-110"
                  >
                    <Facebook className="h-7 w-7 text-[#B89D94]" />
                  </a>
                  <a
                    href="https://www.instagram.com/afimahclothingstore.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-[#B89D94]/10 flex items-center justify-center hover:bg-[#B89D94]/20 transition-all hover:scale-110"
                  >
                    <Instagram className="h-7 w-7 text-[#B89D94]" />
                  </a>
                  <a
                    href="https://www.youtube.com/@afimahclothingstore?app=desktop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-[#B89D94]/10 flex items-center justify-center hover:bg-[#B89D94]/20 transition-all hover:scale-110"
                  >
                    <Youtube className="h-7 w-7 text-[#B89D94]" />
                  </a>
                </div>
              </div>
            </div>
  
            {/* Contact Form */}
            <div>
              {contactSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center shadow-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700">Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89D94]"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89D94]"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89D94]"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full min-h-[150px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89D94]"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#B89D94] text-white py-3 rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </section>
  
        {/* Enhanced Map Section */}
        <section className="bg-[#EDE1D7] py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Find Us</h2>
              <p className="text-gray-700">Visit our flagship store in Lahore</p>
            </div>
            <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.9434159449!2d74.35871641498392!3d31.520418981376423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919043f9b3b3b3b%3A0x8c8c8c8c8c8c8c8c!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1629786781234!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Afimah Store Location"
              />
            </div>
          </div>
        </section>
  
        {/* Footer is global */}
      </div>
    );
  };



  const OrderModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowOrderModal(false); setCurrentView("home"); }}>
      <div className="bg-white rounded-lg p-8 max-w-md text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl mb-2">Order Confirmed!</h3>
        <p className="text-muted-foreground mb-6">Your order has been received! We will contact you soon.</p>
        <Button onClick={() => { setShowOrderModal(false); setCurrentView("home"); }} className="bg-accent">Continue Shopping</Button>
      </div>
    </div>
  );

  const InstaPreview = () => {
    if (!instaOpen) return null;
    const img = galleryImages[instaIndex];
    return (
      <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4" onClick={() => setInstaOpen(false)}>
        <button className="absolute top-6 right-6 text-white p-2 rounded-full" onClick={(e) => { e.stopPropagation(); setInstaOpen(false); }} aria-label="Close preview"><X className="h-6 w-6" /></button>

        <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-2 rounded-full" onClick={(e) => { e.stopPropagation(); setInstaIndex(i => (i - 1 + galleryImages.length) % galleryImages.length); }} aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>

        <div className="max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <img src={img} alt={`Preview ${instaIndex + 1}`} className="max-w-full max-h-full object-contain rounded-md shadow-2xl" />
        </div>

        <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-2 rounded-full" onClick={(e) => { e.stopPropagation(); setInstaIndex(i => (i + 1) % galleryImages.length); }} aria-label="Next"><ChevronRight className="h-8 w-8" /></button>
      </div>
    );
  };

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Offline Notification Banner */}
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 px-4 sticky top-0 z-50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              You're offline. Some features may not work properly. Check your internet connection.
            </span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-4 px-3 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: flex;
          width: fit-content;
        }
      `}} />
      <Header />

      {currentView === "home" && <HomeView />}
      {currentView === "shop" && <ShopView />}
      {currentView === "lookbook" && <LookbookView />}
      {currentView === "detail" && <ProductDetailView />}
      {currentView === "cart" && <CartView />}
      {currentView === "checkout" && <CheckoutView />}
      {currentView === "about" && <AboutView />}
      {currentView === "contact" && <ContactView />}

      {showOrderModal && <OrderModal />}
      {instaOpen && <InstaPreview />}
    </div>
  );
}