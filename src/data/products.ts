import { Product } from "../types"

export const products: Product[] = [
  {
    id: 1,
    name: "Élan Sculpted Tote",
    subtitle: "Italian calfskin",
    category: "Italian calfskin",
    categoryType: "leather",
    price: 1280,
    rating: 4.9,
    reviewsCount: 48,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1546241183-0ed3f8a4a824?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "A masterclass in modern geometry and heritage saddlery. The Élan Tote features architectural curves hand-beveled from full-grain Tuscan calfskin, accented with 24k gold-plated brass hardware.",
    details: [
      "Hand-painted raw edges, burnished in our Paris atelier",
      "Interior zip pocket and dedicated key lanyard",
      "Custom magnetic lock clasp with subtle Aurélia crest",
      "Includes protective organic cotton dustbag",
    ],
    dimensions: "36cm (W) x 28cm (H) x 14cm (D)",
    materials: "100% Full-grain Italian calfskin, Suede lining",
    inStock: true,
  },
  {
    id: 2,
    name: "No. 04 Eau de Parfum",
    subtitle: "Sandalwood · Iris",
    category: "Sandalwood · Iris",
    categoryType: "fragrance",
    price: 240,
    rating: 4.8,
    reviewsCount: 64,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "An ethereal balance of rare Florentine iris and aged Australian sandalwood, elevated by smoky cardamom and dry ambergris. A fragrance that whispers quiet opulence.",
    details: [
      "Extrait concentration with 28% pure fragrance oils",
      "Hand-blown flacon with magnetic heavy-weight cap",
      "Macerated for six months in Grasse, France",
      "Genderless signature composition",
    ],
    dimensions: "100ml / 3.4 fl. oz.",
    materials: "Glass flacon, organic alcohol, rare botanical essences",
    inStock: true,
  },
  {
    id: 3,
    name: "Atelier Frame Bag",
    subtitle: "Hand-finished leather",
    category: "Hand-finished leather",
    categoryType: "leather",
    price: 980,
    rating: 5.0,
    reviewsCount: 32,
    badge: "Exclusive",
    image:
      "https://images.unsplash.com/photo-1575403538007-acb790100421?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "Drawing inspiration from mid-century doctor bags, the Atelier Frame Bag pairs vintage hinged mechanics with minimalist lines. Perfectly sized for daytime poise and evening soirees.",
    details: [
      "Solid brass frame with brushed pale-gold patina",
      "Detachable slender leather crossbody strap",
      "Cardholder slot with debossed serial number",
      "Reinforced structured base with protective metal feet",
    ],
    dimensions: "26cm (W) x 18cm (H) x 10cm (D)",
    materials: "Box-calf leather, Lambskin interior",
    inStock: true,
  },
  {
    id: 4,
    name: "Ligne Silk Scarf",
    subtitle: "Mulberry silk",
    category: "Mulberry silk",
    categoryType: "silk",
    price: 190,
    rating: 4.9,
    reviewsCount: 51,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1605619082574-e92eee603b95?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "Spun from weightless 18-momme mulberry silk twill, printed by hand in Lyon using traditional screen stencils. Featuring lyrical architectural line drawings of Paris.",
    details: [
      "Hand-rolled and hand-stitched roulotté edges",
      "Natural organic silk dyes with archival longevity",
      "Presented in an embossed Aurélia presentation box",
    ],
    dimensions: "90cm x 90cm square",
    materials: "100% Grade 6A Mulberry Silk Twill",
    inStock: true,
  },
  {
    id: 5,
    name: "Sienna Fold Crossbody",
    subtitle: "Grained saddle leather",
    category: "Grained saddle leather",
    categoryType: "leather",
    price: 850,
    rating: 4.9,
    reviewsCount: 29,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1590739225287-bd31519780c3?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "Form follows tactile serenity in the Sienna Fold. Designed with an origami-inspired folded gusset that expands gracefully while retaining a trim profile against the body.",
    details: [
      "Adjustable strap with discreet teardrop pin closure",
      "Exterior slip pocket for fast phone retrieval",
      "Polished edge lacquer applied in four coats",
    ],
    dimensions: "24cm (W) x 16cm (H) x 8cm (D)",
    materials: "Full-grain French saddle calfskin",
    inStock: true,
  },
  {
    id: 6,
    name: "Cèdre Blanc Extrait",
    subtitle: "Atlas Cedar · Bergamot",
    category: "Atlas Cedar · Bergamot",
    categoryType: "fragrance",
    price: 310,
    rating: 5.0,
    reviewsCount: 19,
    badge: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "An olfactory journey to high mountain mist. Crisp Calabrian bergamot gives way to sacred Atlas cedarwood, white moss, and velvety musk.",
    details: [
      "Numbered production limited to 500 bottles annually",
      "Includes travel atomizer in matching pebbled leather sleeve",
      "Cold-extracted botanical notes",
    ],
    dimensions: "100ml / 3.4 fl. oz.",
    materials: "Hand-polished crystal glass, aged wood extract",
    inStock: true,
  },
  {
    id: 7,
    name: "L'Ombre Silk Carré",
    subtitle: "Chiaroscuro weave",
    category: "Chiaroscuro weave",
    categoryType: "silk",
    price: 220,
    rating: 4.8,
    reviewsCount: 37,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "Draped in twilight tones of espresso and champagne, this carré celebrates shadow and light with a soft fluid drape that glides effortlessly across the skin.",
    details: [
      "Double-sided chromatic contrast printing",
      "French hand-rolled hem finish",
      "Ultra-soft matte silk finish",
    ],
    dimensions: "70cm x 70cm square",
    materials: "100% Organic Mulberry Silk",
    inStock: true,
  },
  {
    id: 8,
    name: "Vendôme Pocket Wallet",
    subtitle: "Calfskin & Gold trim",
    category: "Calfskin & Gold trim",
    categoryType: "leather",
    price: 380,
    rating: 4.9,
    reviewsCount: 82,
    badge: "Essential",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    additionalImages: [
      "https://images.unsplash.com/photo-1606503829068-d069c9705a5b?auto=format&fit=crop&w=900&q=85",
    ],
    description:
      "Slender yet accommodating, the Vendôme slides effortlessly into jacket or bag pockets. Features eight card slots, a central currency slip, and reinforced corners.",
    details: [
      "RFID blocking security membrane integrated",
      "Subtle foil-stamped gold foil monogramming option",
      "Hand-waxed linen thread stitching",
    ],
    dimensions: "11.5cm (W) x 9cm (H) x 1.2cm (D)",
    materials: "Vegetable-tanned full-grain leather",
    inStock: true,
  },
]
