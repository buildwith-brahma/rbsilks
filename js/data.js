/**
 * R B SILKS - Official Product Database & Store Configuration
 * Store Location: College Road, Viswanathapuram, Podili, Andhra Pradesh 523240
 * Contact / WhatsApp: +91 77990 58291
 */

// Paste your Google Sheet "Publish to web" CSV link here (see guide).
// Leave empty ('') to use the built-in SAREES list below.
const SHEET_CSV_URL = '';

// Product catalogue (search, categories, saree grid, category tiles, wishlist).
// false = hidden, the site shows only store info with WhatsApp / Call / Directions.
// Set to true to show the catalogue again.
const ENABLE_CATALOG = false;

// Inquiry Bag (multi-item cart). false = hidden, customers order directly via WhatsApp.
// Set to true to turn the bag back on.
const ENABLE_BAG = false;

const SAREE_CATEGORIES = [
    { id: 'all', name: 'All Collections', icon: 'fa-gem' },
    { id: 'pattu-sarees', name: 'Pattu & Wedding Sarees', icon: 'fa-crown' },
    { id: 'fancy-sarees', name: 'Fancy & Designer Sarees', icon: 'fa-sparkles' },
    { id: 'daily-wear', name: 'Daily Wear Sarees', icon: 'fa-shirt' },
    { id: 'dress-materials', name: 'Dress Materials', icon: 'fa-vest-patches' },
    { id: 'nightwear-innerwear', name: 'Nightwear & Innerwear', icon: 'fa-bed' }
];

const SAREES = [
    // --- 1. Pattu & Wedding Sarees ---
    {
        id: 'RBS-P101',
        title: 'Shubha Muhurtham Crimson Red Pure Kanchi Pattu Bridal Saree',
        category: 'pattu-sarees',
        tags: ['wedding', 'pattu', 'bridal', 'bestseller'],
        price: 24500,
        originalPrice: 29900,
        rating: 5.0,
        reviewsCount: 38,
        color: 'Crimson Red & Rich Antique Gold',
        fabric: '100% Pure Mulberry Silk (Silk Mark Certified)',
        zari: 'Tested Pure Gold & Silver Zari with Korvai Border',
        weave: 'Authentic Traditional Handloom Weave',
        blouse: 'Unstitched Heavy Brocade Blouse Piece (0.8m) included',
        description: 'An auspicious bridal Kanchi Pattu saree adorned with classic Mayil (peacock) & temple gopuram motifs with a grand contrast rich zari pallu.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 'RBS-P102',
        title: 'Emerald Green & Ruby Pink Dharmavaram Pure Silk Pattu',
        category: 'pattu-sarees',
        tags: ['pattu', 'festive', 'traditional'],
        price: 16800,
        originalPrice: 21000,
        rating: 4.9,
        reviewsCount: 27,
        color: 'Deep Emerald Green & Ruby Pink Border',
        fabric: 'Pure Dharmavaram Handloom Silk',
        zari: 'Heavy Gold Zari Butta with Rich Contrast Pallu',
        weave: 'Dharmavaram Double-Warp Interlock Weave',
        blouse: 'Contrast Ruby Pink Blouse Piece with Zari Border',
        description: 'Traditional South Indian Dharmavaram Pattu saree renowned for its rich borders and lustrous gold motifs, perfect for family weddings and festivals.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 'RBS-P103',
        title: 'Rani Pink & Mango Yellow Gadwal Pure Silk Saree',
        category: 'pattu-sarees',
        tags: ['pattu', 'festive', 'bestseller'],
        price: 14200,
        originalPrice: 17500,
        rating: 4.8,
        reviewsCount: 31,
        color: 'Rani Pink with Mango Yellow Border',
        fabric: 'Pure Gadwal Silk Body with Silk Zari Border',
        zari: 'Kuttu Weave Gold Zari Temple Border',
        weave: 'Authentic Gadwal Handloom Weave',
        blouse: 'Contrast Yellow Silk Blouse Piece',
        description: 'Handwoven Gadwal silk saree featuring lightweight body and heavy temple zari borders, giving royal look with lightweight comfort.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: true
    },

    // --- 2. Fancy & Designer Sarees ---
    {
        id: 'RBS-F201',
        title: 'Pastel Lilac Organza Silk Fancy Saree with Cutwork Border',
        category: 'fancy-sarees',
        tags: ['fancy', 'party-wear', 'trending'],
        price: 3450,
        originalPrice: 4800,
        rating: 4.9,
        reviewsCount: 22,
        color: 'Pastel Lilac & Silver Shimmer',
        fabric: 'Fine Glass Organza Silk',
        zari: 'Subtle Silver Zari Embroidery with Scallop Cutwork',
        weave: 'Modern Designer Weave',
        blouse: 'Heavy Embroidered Banglori Silk Blouse',
        description: 'Contemporary fancy organza saree featuring delicate floral thread embroidery and scalloped zari borders for parties and receptions.',
        image: 'https://images.unsplash.com/photo-1610030469668-9321598293c4?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1610030469668-9321598293c4?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 'RBS-F202',
        title: 'Royal Navy Blue Georgette Brass & Sequin Fancy Saree',
        category: 'fancy-sarees',
        tags: ['fancy', 'party-wear', 'bestseller'],
        price: 2850,
        originalPrice: 3800,
        rating: 4.8,
        reviewsCount: 19,
        color: 'Midnight Navy Blue & Rose Gold',
        fabric: 'Pure Viscose Georgette with Sequin Work',
        zari: 'Tone-on-tone Resham with Gota Patti Lace Border',
        weave: 'Designer Crushed Georgette',
        blouse: 'Unstitched Designer Art Silk Blouse',
        description: 'Glamorous partywear fancy saree with graceful drape and sparkling sequin work, perfect for sangeet and festive gatherings.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 'RBS-F203',
        title: 'Peach Blossom Foil Print Chiffon Fancy Saree with Pearl Lace',
        category: 'fancy-sarees',
        tags: ['fancy', 'lightweight'],
        price: 1950,
        originalPrice: 2600,
        rating: 4.7,
        reviewsCount: 15,
        color: 'Soft Peach & Gold Shimmer',
        fabric: 'Featherlight Pure Chiffon',
        zari: 'Golden Metallic Foil Print with Pearl Border',
        weave: 'Digital Foil Print',
        blouse: 'Jacquard Silk Blouse Piece',
        description: 'Lightweight and flowy fancy chiffon saree with subtle gold foil accents and pearl lace border, effortless to carry all day long.',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: false
    },

    // --- 3. Daily Wear Sarees ---
    {
        id: 'RBS-D301',
        title: 'Floral Kalamkari Printed Soft Cotton Silk Daily Saree',
        category: 'daily-wear',
        tags: ['daily-wear', 'cotton-silk', 'bestseller'],
        price: 850,
        originalPrice: 1200,
        rating: 4.8,
        reviewsCount: 42,
        color: 'Teal Green & Mustard Floral',
        fabric: 'Breathable Soft Cotton Silk Blend',
        zari: 'Soft Woven Zari Line Border',
        weave: 'Smooth Daily Comfort Weave',
        blouse: 'Running Printed Blouse Piece included',
        description: 'Ultra-comfortable daily wear saree with traditional Kalamkari floral motifs. Wrinkle-resistant, easy to wash, and soft on the skin for office or home wear.',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 'RBS-D302',
        title: 'Ikat Geometric Print Lightweight Linen Silk Daily Saree',
        category: 'daily-wear',
        tags: ['daily-wear', 'lightweight'],
        price: 990,
        originalPrice: 1450,
        rating: 4.7,
        reviewsCount: 28,
        color: 'Rust Orange & Off-White',
        fabric: 'Pure Linen Cotton Blend',
        zari: 'Contrast Zari Border',
        weave: 'Ikat Digital Print',
        blouse: 'Contrast Solid Blouse Piece',
        description: 'Smart and classy daily wear saree featuring geometric Ikat prints with contrast borders, ideal for teachers, office goers, and daily pujas.',
        image: 'https://images.unsplash.com/photo-1610030469824-3a5c184080dc?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1610030469824-3a5c184080dc?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 'RBS-D303',
        title: 'Classic Bandhani Print Daily Crepe Silk Saree',
        category: 'daily-wear',
        tags: ['daily-wear', 'budget-friendly'],
        price: 650,
        originalPrice: 950,
        rating: 4.6,
        reviewsCount: 35,
        color: 'Maroon & Yellow Bandhej Print',
        fabric: 'Soft French Crepe Silk',
        zari: 'Golden Lace Border',
        weave: 'Traditional Bandhani Print',
        blouse: 'Running Contrast Blouse Piece',
        description: 'Vibrant and durable Bandhej print daily wear saree. Zero maintenance, highly durable fabric, and all-season comfort.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: false
    },

    // --- 4. Dress Materials & Churidars ---
    {
        id: 'RBS-M401',
        title: 'Pure Chanderi Silk Unstitched Dress Material with Heavy Dupatta',
        category: 'dress-materials',
        tags: ['dress-material', 'festive', 'bestseller'],
        price: 1850,
        originalPrice: 2500,
        rating: 4.9,
        reviewsCount: 24,
        color: 'Royal Bottle Green & Antique Gold',
        fabric: 'Top: Pure Chanderi Silk (2.5m), Bottom: Shantoon (2.0m), Dupatta: Banarasi Silk Dupatta (2.25m)',
        zari: 'Resham Threadwork & Zari Booti',
        weave: 'Chanderi Jacquard with Zari Dupatta',
        blouse: 'Complete 3-Piece Unstitched Suit Set',
        description: 'Rich festive Chanderi silk unstitched dress material with a majestic contrast Banarasi woven silk dupatta for celebrations and family functions.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 'RBS-M402',
        title: 'Jaipuri Pure Cotton Handblock Printed Daily Dress Material Set',
        category: 'dress-materials',
        tags: ['dress-material', 'pure-cotton', 'daily-wear'],
        price: 950,
        originalPrice: 1350,
        rating: 4.8,
        reviewsCount: 30,
        color: 'Indigo Blue & White Handblock Print',
        fabric: '100% Pure Cambric Cotton (Top: 2.25m, Bottom: 2.0m, Dupatta: Cotton Mulmul 2.25m)',
        zari: 'None (Pure Soft Organic Cotton)',
        weave: 'Jaipuri Sanganeri Handblock Print',
        blouse: '3-Piece Cotton Salwar Suit Material',
        description: '100% pure premium cotton unstitched dress material with soft mulmul dupatta. Super cool and breathable for daily wear and hot climates.',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: false
    },

    // --- 5. Nightwear & Innerwear ---
    {
        id: 'RBS-N501',
        title: 'Premium Pure Cotton Embroidered Daily Nighty / Maxi Gown',
        category: 'nightwear-innerwear',
        tags: ['nightwear', 'pure-cotton', 'bestseller'],
        price: 450,
        originalPrice: 650,
        rating: 4.9,
        reviewsCount: 48,
        color: 'Sky Blue Floral / Multi-color prints',
        fabric: '100% Super Combed Soft Cotton',
        zari: 'Delicate Neckline Thread Embroidery',
        weave: 'Breathable Cotton Knit / Woven',
        blouse: 'Full Length Free Size / XL / XXL with Side Pocket',
        description: 'High-grade 100% pure cotton nighty with front zip/buttons and elegant neck embroidery. Non-shrinkable, ultra-soft, and colourfast guarantee.',
        image: 'https://images.unsplash.com/photo-1610030469668-9321598293c4?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1610030469668-9321598293c4?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 'RBS-N502',
        title: 'Satin Silk 2-Piece Luxury Nightwear Robe & Slip Gown Set',
        category: 'nightwear-innerwear',
        tags: ['nightwear', 'luxury'],
        price: 850,
        originalPrice: 1250,
        rating: 4.8,
        reviewsCount: 20,
        color: 'Wine Maroon & Dusty Rose',
        fabric: 'Glossy Smooth Satin Silk with French Lace Trim',
        zari: 'Floral Lace Accents',
        weave: 'Smooth Satin Weave',
        blouse: '2-Piece Set: Inner Slip Nightdress + Outer Robe with Belt',
        description: 'Luxurious 2-piece satin nightwear set crafted for supreme comfort and elegance with delicate lace borders.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        ],
        inStock: true,
        isNew: false,
        isFeatured: false
    }
];

const STORE_CONFIG = {
    storeName: 'R B SILKS',
    tagline: 'Pattu Sarees, Wedding & Fancy Sarees, Daily Wear, Dress Materials, Nightwear & Innerwear',
    phone: '+91 77990 58291',
    whatsappNumber: '917799058291', // +91 77990 58291
    email: 'rbsilkspodili@gmail.com',
    address: 'College Road, Viswanathapuram, Podili, Andhra Pradesh 523240',
    timings: 'Open 24 Hours (Mon–Sat) | 8:00 AM – 10:00 PM (Sunday)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=R+B+SILKS+College+Road+Viswanathapuram+Podili+Andhra+Pradesh+523240',
    currency: '₹',
    rating: '5.0',
    reviewsCount: '5.0 Rating on Google Maps',
    socials: {
        whatsapp: 'https://wa.me/917799058291',
        directions: 'https://www.google.com/maps/search/?api=1&query=R+B+SILKS+College+Road+Viswanathapuram+Podili+Andhra+Pradesh+523240'
    }
};

const TESTIMONIALS = [
    {
        name: 'Lakshmi Prasanna',
        location: 'Podili, Andhra Pradesh',
        occasion: 'Daughter\'s Wedding Shopping',
        rating: 5,
        review: 'Best saree shop in Podili! We purchased all our wedding pattu sarees and dress materials here. High quality, wholesale prices, and very polite customer service. WhatsApp support is very fast!',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        verified: true
    },
    {
        name: 'Kavitha Reddy',
        location: 'Ongole / Podili',
        occasion: 'Festive & Daily Wear Sarees',
        rating: 5,
        review: 'Their fancy sarees and cotton daily wear collections are unmatched. The shop is open 24 hours on College Road, and their WhatsApp ordering makes it so easy to book sarees from home.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verified: true
    },
    {
        name: 'Sravani V.',
        location: 'Viswanathapuram, Podili',
        occasion: 'Dress Materials & Nightwear',
        rating: 5,
        review: 'Very good collection of dress materials, nightwear, and innerwear along with rich pattu sarees. 5-star quality and genuine rates for all budgets.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        verified: true
    }
];

const FAQS = [
    {
        q: 'Where is R B SILKS located in Podili?',
        a: 'R B SILKS is conveniently located at College Road, Viswanathapuram, Podili, Andhra Pradesh 523240. You can click "Directions" on our portal to navigate directly via Google Maps.'
    },
    {
        q: 'What are the store timings for R B SILKS Podili?',
        a: 'Our shop is Open 24 Hours from Monday to Saturday, and open from 8:00 AM to 10:00 PM on Sundays to serve all our valued customers and wedding families.'
    },
    {
        q: 'What types of clothing and sarees are available at R B SILKS?',
        a: 'We offer an extensive collection of Daily wear sarees, Fancy & Designer sarees, Wedding & Bridal sarees, Pure Pattu sarees (Kanchi, Dharmavaram, Gadwal), Unstitched Dress materials, Nightwear, and Innerwear for women. We also stock Blankets, Bed Sheets (4x6, 5x6, 6x6, 7x6), Towels of all sizes, Shirting cloth (Ramraj, Deeksha) and Door Curtains.'
    },
    {
        q: 'How can I order or inquire via WhatsApp / Phone?',
        a: 'You can directly call us or send a message on WhatsApp at +91 77990 58291. Clicking "Order via WhatsApp" on any item on this portal will automatically send the saree code and photo to our WhatsApp for instant confirmation.'
    }
];
