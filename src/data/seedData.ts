import { Product, Review, Coupon, BlogPost, SiteSettings, User } from '../types';

export const initialSiteSettings: SiteSettings = {
  announcementText: "Free Delivery Across Pakistan on Orders Above Rs. 3,000 | Complimentary Luxury Sample with Every Order",
  isAnnouncementActive: true,
  freeShippingThreshold: 3000,
  standardShippingFee: 450,
  heroHeadline: "Discover Your",
  heroHighlight: "Signature Scent",
  heroSubtext: "Haute perfumerie crafted to leave an unforgettable aura. Rare ouds, French florals, and regal oriental notes curated for the distinguished Pakistani connoisseur.",
  supportPhone: "+92 300 007-7227",
  supportWhatsApp: "+92 300 007-S2BR",
  supportEmail: "concierge@s2brfragrances.com"
};

export const initialProducts: Product[] = [
  {
    id: "s2br-imperial-noir",
    name: "S2BR Imperial Noir Extrait",
    subtitle: "Extrait de Parfum • 100 ML",
    description: "A monumental oriental extrait balancing spicy green cardamom, wild Persian saffron, and smoked Cambodian agarwood, resting on rich Italian saddle leather and fossilized golden amber.",
    category: "Luxury Perfumes",
    gender: "Men",
    family: "Woody Smoky",
    price: 5850,
    originalPrice: 7000,
    rating: 4.9,
    reviewCount: 248,
    stock: 45,
    sku: "S2BR-NOIR-100",
    batchNo: "#S2-PK26",
    badge: "FLAGSHIP LAUNCH",
    isBestSeller: true,
    isFeatured: true,
    concentration: "35% Pure Extrait",
    longevity: "14 - 16 Hours (Extraordinarily High)",
    longevityScore: 9.8,
    sillage: "Heavy Enveloping Scent Trail (Up to 6ft)",
    sillageScore: 9.5,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNWoooSFkfDBTcaGiiRbANR001zvrQRDBAyAtmj7S4EgQAkM-Yj-WLeTkj_HcN1ux3ZmZdnjOkFWFPDcvDy_z3IK2ImmeHhu281bJt17P2DIQinYRZ0dDufQ2yA1v5OVRreYG-JDzYMGmsEjUqrofFkevzmNeL07SlmjIIEOHKXHSjupZ14rhv2kE1iqgMh8OsPJkVyFeHZN7W41VoZ0Td1zVVWfwU5zEMTcalZl_AF-Xf17GSKWzkrQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiKU8ICGk7qC_zhKDLnIwDYsdzxwynfYyQ7wBeCcs6gACH7Gz6kyqsFrSqBTLPn6U0mn_babcgR_YmoX1sGQnf9VOJl7x7dDrDiQFYpt2UmdPyAV88g6qKD-MIdmSXpN-fcQfl4uEB7Xc5hdQabx1nLHOCXtgepicoWwiXFX5o0H6mHViv59ZSmsaS-4kOaYb_hYbKSuMhiY8M7z92Hzjccx7YM0oy4MUW1MbYqGAvlN_ixPYd63py2w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDT-JAK7NvYFCONsbvIPHi6nz7CyzstQowHST1jDu12MQc42xxfabbCO8O5b6aJ1ijNkOCfE4MDtuNtHtsLfI2t_VRWXIF5Ng9qhy2IMETr0tAzfkM8S2fb4Y-j1UeD5rD8gW5jcAvqeyrLLgEjmaLYeRanPNDwQd20Acn7Ky3dibuPUifrsHyD6giS22-Rj6wM9ZKTYJgArOfxEFLfXnCDrdKZWq4AvLK47peUN48zls2QTVIMtqi7dg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcdODgxIEZeBPfprl6Pwxax-dCyLt0FtdukehRou-gPYrF3jmb1IgzqRRoOUxufCXaJODHB4VrL1I1KA2eD6wDgOGVCSE7xFbdti7J2KPIYY4NvAaG0SLTp14qKPZbWLLg7FGIWS5XUuMuDgkBwBqmE6SXWXWsz3-bmzF7nAW8RTOeWKElXAbhZxOKNVXYflERGc3Y-4etTr3soJM76s4ARdQo0r0O1CsD4MS3gXGCFYqBhGj_ySsMhQ"
    ],
    notes: {
      top: ["Calabrian Bergamot", "Green Cardamom Pods", "Pink Peppercorn", "Wild Persian Saffron"],
      heart: ["Black Baccara Rose", "Smoky Cambodian Oud", "Orris Butter", "Aged Atlas Cedarwood"],
      base: ["Fossilized Golden Amber", "Italian Saddle Leather", "Indonesian Dark Patchouli", "Madagascar Vanilla Bourbon"]
    },
    story: "Formulated as an ode to leadership, poise, and dignified gravitas. S2BR Imperial Noir balances the razor-sharp zesty exhilaration of wild saffron with deep, ancient Assam Agarwood and soft velvety rose petals. Engineered specifically for Pakistan's climate to maintain persistent projection.",
    applicationGuide: "Mist from 6 inches onto warm pulse points: the carotid hollows of the neck, wrist tendons, and collarbones. For ceremonial gatherings, mist one spray across wool or raw silk attire.",
    variants: [
      { size: "50ml", type: "Spray EdP", price: 4200, originalPrice: 5000 },
      { size: "100ml", type: "Signature Flacon", price: 5850, originalPrice: 7000 },
      { size: "12ml", type: "Pure Non-Alcoholic Attar", price: 3500, originalPrice: 4200 }
    ],
    createdAt: "2026-01-15T00:00:00.000Z"
  },
  {
    id: "oud-al-sultani",
    name: "Oud Al Sultani Concentrated",
    subtitle: "Concentrated Pure Oil • 12 ML / 1 Tola",
    description: "Pure vintage Assam dehn al oud infused with saffron threads and taif rose distilled in copper vessels. A rich, viscous, royal attar devoid of synthetic fillers.",
    category: "Concentrated Attars",
    gender: "Unisex",
    family: "Royal Oud",
    price: 4850,
    originalPrice: 5400,
    rating: 5.0,
    reviewCount: 182,
    stock: 28,
    sku: "S2BR-OUD-SULTAN",
    batchNo: "#S2-AS09",
    badge: "BESTSELLER",
    isBestSeller: true,
    isFeatured: true,
    concentration: "100% Pure Perfume Oil",
    longevity: "24+ Hours on Skin & Garments",
    longevityScore: 9.9,
    sillage: "Regal Subtle Intimacy with Distant Trail",
    sillageScore: 9.3,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB3w3ZntHar7L4B9fdfNUtf-Zc1QrcX4s2ui_8k9absLUTqN3tVaf586gJfBqvWMiV5umzSAVrHKWpiiSwB70iiWjoa-OSDhueFYhAaVYsPtoVsCbN5ht7Va8ZfmrHlxl6w5oD8jNioobFDx9V_UNaddFGWSgAZtbEX-5aimUrwMSYB0O1xexyWffkRDq3cpLjchSEGxVdfLsHcPDIL_REFBHqnYlh9VzqpOFkDCWcVO3OKr0qj05ldA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5dsIECPDyhnqbAqH_CdFlwsUHHF_nCF28R7t7Uk2siNI3wVUOlpRv-C5xaeOXvzCKr6AcaDuu5bJAjkKj40MBiNQCjXegHEm1kolGhDuO5OyUHemxbOij7NK8uHQwpxl3ueacg00cBqh-oLHy6ZaxJa6t4KbCqPp2-g8ZhLCXoL9jmkifcpF6tYzZ_xZyRAO3NLylH3aOmlRiTYhW-0LglzfG95YeQBmS-zFR3n8wzenE8gudHNUCJQ"
    ],
    notes: {
      top: ["Aged Hindi Dehn Al Oud", "Kashmiri Saffron"],
      heart: ["Wardh Taifi (Taif Rose)", "Smoked Sandalwood", "Nutmeg"],
      base: ["Ambergris Tincture", "Resinous Cambodian Agarwood"]
    },
    variants: [
      { size: "6ml", type: "Half Tola Flacon", price: 2900, originalPrice: 3400 },
      { size: "12ml", type: "Full 1 Tola Crystal Flacon", price: 4850, originalPrice: 5400 }
    ],
    createdAt: "2026-02-10T00:00:00.000Z"
  },
  {
    id: "velvet-rose-ambergris",
    name: "Velvet Rose & Ambergris",
    subtitle: "Eau de Parfum • 100 ML",
    description: "Opulent Turkish rose petals, madagascan vanilla pod, grounded by mineral salted ambergris and white musk cashmere for unmatched ethereal sillage.",
    category: "Luxury Perfumes",
    gender: "Women",
    family: "French Floral",
    price: 3950,
    originalPrice: 4600,
    rating: 4.8,
    reviewCount: 154,
    stock: 35,
    sku: "S2BR-ROSE-AMBER",
    batchNo: "#S2-VR22",
    badge: "FEMININE FAVORITE",
    isBestSeller: true,
    isFeatured: true,
    concentration: "28% Eau de Parfum Intense",
    longevity: "12 - 14 Hours",
    longevityScore: 9.4,
    sillage: "Enchanting Scent Cloud",
    sillageScore: 9.2,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjAlUrl55PTsDmVOT_IFGTfC0IvezXQYUgdBXBXFZe6iZWjUuuKkh8imYxNyq8I4PTNUPinDgT3NC-zkPjjFvDfxmZbUuq7AyJMFePqTesm5ToF4vIYU1OpjfzodfFYffOHhuj8z2CtZ6JAzh1XgoptGK3RXT1oDKilMBddGkriNimOe4aPf5T7C0rqXIWgnyuEYtBmMQ7_rAw-EQJ9hRSvFXKLtR6DHLqjWI_cNf0h7HPiHTJFQbPDw"
    ],
    notes: {
      top: ["Lychee Blossom", "Italian Mandarin", "Bergamot"],
      heart: ["Damask Rose Absolu", "Peony", "Jasmine Sambac"],
      base: ["Natural Ambergris", "Bourbon Vanilla", "White Cedar"]
    },
    variants: [
      { size: "50ml", type: "Spray Flacon", price: 2850, originalPrice: 3400 },
      { size: "100ml", type: "Signature Flacon", price: 3950, originalPrice: 4600 }
    ],
    createdAt: "2026-02-20T00:00:00.000Z"
  },
  {
    id: "celestial-musk-elixir",
    name: "Celestial Musk Elixir",
    subtitle: "Extrait de Parfum • 100 ML",
    description: "White musk cashmere, clean crisp bergamot zest, cedarwood heart, and sensual amber crystals creating a radiant second-skin luxury experience.",
    category: "Luxury Perfumes",
    gender: "Unisex",
    family: "Sweet Amber",
    price: 7500,
    originalPrice: 8900,
    rating: 4.9,
    reviewCount: 96,
    stock: 20,
    sku: "S2BR-CEL-MUSK",
    batchNo: "#S2-CM11",
    badge: "PRESTIGE EDITION",
    isBestSeller: true,
    isFeatured: true,
    concentration: "38% Pure Extrait",
    longevity: "18+ Hours",
    longevityScore: 9.7,
    sillage: "Hypnotic Radiance",
    sillageScore: 9.6,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMSYTXh4Hge62yZ6syi74QLBbyp9vlPAYDQGGJOwrmf3Sl2XUtKWWkGngZ_XHOF8QN3nfkTHqCFuiobY6AeJaN5ZBDMBjLj5XlVAwffzkjMO6KQ04QmT9eR1Tik28_8gbuqHG19zIrPvM52eIPhw4QA8T4tlDwzEKyUJjS1brg0xDs3XbwXP_LKL6hVfJdyzVivK4REvlZ5M7MeTPtiWXb3h9lCGB07aUSqJfJfbzhnVyCG3wP7-dUEg"
    ],
    notes: {
      top: ["White Freesia", "Frosted Bergamot", "Aldehydes"],
      heart: ["Cashmere Musks", "Iris Orris", "White Lily"],
      base: ["Precious Amber Crystals", "Atlas Cedar", "Ambrette Seed"]
    },
    variants: [
      { size: "50ml", type: "Spray Flacon", price: 4800, originalPrice: 5600 },
      { size: "100ml", type: "Prestige Flacon", price: 7500, originalPrice: 8900 }
    ],
    createdAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "velvet-santal-extrait",
    name: "Velvet Santal Extrait",
    subtitle: "Extrait de Parfum • 50 ML",
    description: "Mysore sandalwood aged in charred oak barrels with Ceylon cardamom, creamy tonka bean, and warm frankincense resins.",
    category: "Luxury Perfumes",
    gender: "Men",
    family: "Oriental Spicy",
    price: 4950,
    originalPrice: 5800,
    rating: 4.9,
    reviewCount: 88,
    stock: 22,
    sku: "S2BR-VEL-SANTAL",
    batchNo: "#S2-VS04",
    badge: "LIMITED EDITION",
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    concentration: "32% Pure Extrait",
    longevity: "16+ Hours",
    longevityScore: 9.6,
    sillage: "Warm Enveloping Aura",
    sillageScore: 9.4,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5-VhtNWPLGp8jmziUMCPoMSaPZNq7SIJwGzVmZW9OozqGLp6NgccgQ_umqboV1bVwgBrjAl8pa2_nQQkygrPPQOaA0s79wNth5VgClMozss8TxdMIvIcv_RrhFZaU4CLitmSfgThybr-H2DjeFx261oAc9eYT-2UMrYVyXVovnoYdcP9nX8HMbkLwzFSPGRqDZyMGCu2fo8yI8TpN9qBG7adxqOy__UVUjhgxFErkmidpis_zuvPnnQ"
    ],
    notes: {
      top: ["Ceylon Cardamom", "Ginger Lily", "Pink Pepper"],
      heart: ["Mysore Sandalwood", "Virginia Cedar", "Smoked Papyrus"],
      base: ["Oak Barrel Resins", "Golden Amber", "Tonka Bean"]
    },
    variants: [
      { size: "50ml", type: "Extrait Spray", price: 4950, originalPrice: 5800 },
      { size: "100ml", type: "Extrait Spray", price: 6800, originalPrice: 7900 }
    ],
    createdAt: "2026-03-05T00:00:00.000Z"
  },
  {
    id: "rose-damascena-royale",
    name: "Rose Damascena Royale",
    subtitle: "Extrait de Parfum • 100 ML",
    description: "First-distillation Bulgarian rose enveloped in smoked vanilla bourbon, royal saffron threads, and warm labdanum amber.",
    category: "Luxury Perfumes",
    gender: "Women",
    family: "French Floral",
    price: 6100,
    originalPrice: 7200,
    rating: 4.9,
    reviewCount: 112,
    stock: 19,
    sku: "S2BR-ROSE-ROYALE",
    batchNo: "#S2-RDR01",
    badge: "PRESTIGE EDITION",
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    concentration: "34% Pure Extrait",
    longevity: "15+ Hours",
    longevityScore: 9.6,
    sillage: "Romantic Velvety Trail",
    sillageScore: 9.3,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Xw3YcNskhL5ofmE1_hPdRCNb8GSZHmpeeVV33e5ld436rDnjbtC2A4yVblggWBewRKK2_dti9zHWnfAosDobMseU8SNc0QNMbe9baXNLUV_CDtBLNL-Ndtp3ApQgkuo8bZvuz4lqFlDzpSNSl2NgDAsKNL3izejgu-m8BcadtHWM0yT2ao6pEglbxYX9hcBOafjINRyVtjxyCJ5oR5nS0HIdBqs4aFlRXMLr9d3T2QTlA5hx-FKE3w"
    ],
    notes: {
      top: ["Bulgarian Rose Petals", "Pink Grapefruit", "Saffron"],
      heart: ["Taif Rose", "Orris", "Dark Plum Liqueur"],
      base: ["Bourbon Vanilla", "Oud Resins", "Golden Labdanum"]
    },
    variants: [
      { size: "50ml", type: "Signature Flacon", price: 4400, originalPrice: 5200 },
      { size: "100ml", type: "Prestige Flacon", price: 6100, originalPrice: 7200 }
    ],
    createdAt: "2026-03-12T00:00:00.000Z"
  },
  {
    id: "s2br-sultan-noir",
    name: "S2BR Sultan Noir",
    subtitle: "Extrait De Parfum • 100 ML",
    description: "Deep Cambodian Oud paired with velvet damask rose petals, Spanish saffron, and warm golden amber in an heirloom black crystal flacon.",
    category: "Oud Collection",
    gender: "Men",
    family: "Royal Oud",
    price: 6250,
    originalPrice: 7500,
    rating: 4.9,
    reviewCount: 74,
    stock: 18,
    sku: "S2BR-SULT-NOIR",
    batchNo: "#S2-SN88",
    badge: "LIMITED EDITION",
    isBestSeller: true,
    isFeatured: true,
    concentration: "36% Pure Extrait",
    longevity: "18+ Hours",
    longevityScore: 9.8,
    sillage: "Monolithic Enveloping Presence",
    sillageScore: 9.7,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDT_VvuFe4HLmR90yPs9u3oJBkcuEKG2vxJ9BFV2YiqniaqrE2JHIuJ0P-wVdwDwbiP65MeZ-GV4mxCEvTAnc_9PDzDsGsvDgX2LK0PqH8h-QsJNDlxgxjtMYSNqa1faqa_3ALKS8_q6L_HRZM8Q7uSoM4TmoFO-BTFXXLwCMGJedmb1TyfOs3m8Yi9TyIMD4TPHXE7-f7Yl0wk10uopUP93nmLXHoBmNZtoFPDhbr1BVPVp_6AMViMdg"
    ],
    notes: {
      top: ["Smoked Bergamot", "Wild Saffron", "Black Pepper"],
      heart: ["Cambodian Oud", "Damask Rose", "Castoreum Accord"],
      base: ["Birch Tar", "Aged Amber", "Rich Leather"]
    },
    variants: [
      { size: "100ml", type: "Master Flacon", price: 6250, originalPrice: 7500 }
    ],
    createdAt: "2026-03-14T00:00:00.000Z"
  },
  {
    id: "velvet-tobacco-vanilla",
    name: "Velvet Tobacco & Vanilla",
    subtitle: "Eau De Parfum Intense • 50 ML",
    description: "Cured Cuban tobacco leaf steeped in Madagascar bourbon vanilla, cocoa bean, and golden tonka, creating a warm, comforting, and sophisticated statement.",
    category: "Luxury Perfumes",
    gender: "Unisex",
    family: "Leather & Tobacco",
    price: 3300,
    originalPrice: 3900,
    rating: 4.8,
    reviewCount: 65,
    stock: 30,
    sku: "S2BR-TOB-VAN",
    batchNo: "#S2-TV50",
    badge: "NEW ARRIVAL",
    isNewArrival: true,
    concentration: "30% Eau de Parfum Intense",
    longevity: "14+ Hours",
    longevityScore: 9.5,
    sillage: "Rich Warm Sillage",
    sillageScore: 9.1,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuOegXS4PQ4XX1GTmG-doRbyMmdVrAlj5yXLnsgnPNY-sQnm0xK7mxt77NkmM4XC3kOnsAp7wtK1ZkY9C9cP_aTyrij2D9UOva55T_cFGeexhLPLUrdeYWCEKqnp_KYciLvL877nTiRix_zBIocyxVvqtZTrL7GJ3KUxtwbht9XMTLKlA72xOtjx3dkqYjzrfeUWWjRB4Y-DjNObKYIEbUDHBuPug_2-N8wkSuKzplE38Fv5c8RykM3A"
    ],
    notes: {
      top: ["Cured Tobacco Leaf", "Spicy Accords"],
      heart: ["Bourbon Vanilla", "Cacao", "Tonka Bean", "Tobacco Blossom"],
      base: ["Dried Fruits Accord", "Sweet Wood Sap"]
    },
    variants: [
      { size: "50ml", type: "Flacon Spray", price: 3300, originalPrice: 3900 },
      { size: "100ml", type: "Full Flacon", price: 5400, originalPrice: 6200 }
    ],
    createdAt: "2026-03-18T00:00:00.000Z"
  },
  {
    id: "the-grand-discovery-wardrobe",
    name: "The Grand Discovery Wardrobe",
    subtitle: "5 x 5 ML Curated Artisanal Atomizers",
    description: "An invitation to explore the full spectrum of S2BR Haute Parfumerie. Five 5ml travel atomizers featuring Imperial Noir, Oud Al Sultani, Velvet Rose, Celestial Musk, and Velvet Santal. Full purchase price credited toward any 100ml flacon.",
    category: "Discovery Sets",
    gender: "Unisex",
    family: "Royal Oud",
    price: 3800,
    originalPrice: 4500,
    rating: 5.0,
    reviewCount: 310,
    stock: 50,
    sku: "S2BR-DISC-SET",
    batchNo: "#S2-DW05",
    badge: "MASTER COFFRET",
    isBestSeller: true,
    isFeatured: true,
    concentration: "35% Extrait Samples",
    longevity: "14 - 18 Hours",
    longevityScore: 9.8,
    sillage: "Varies per blend",
    sillageScore: 9.5,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFXZfmQOWj4DwyhTObtZYHlxDm-1nVSFV08R27JWuIjXVGYlvQNI__i3AJjXKQwifnJAv9xLTd3ZkPUatkprKdDpLP8Fn_2LGJzDOtgDz_0-6ldNKoYVG-njkLykqQPVgE96pqxBDq_TowQsnx4rjV6X58KtIHZsKF2sTcvOPXW6lHEyEDF_PfYR0i2vKJkNbtK_Br9MQFfN1t0DgSwZvdjO9HTphYC5E5GyCWqWMBBgaiXPzsqdo3qw"
    ],
    notes: {
      top: ["Saffron", "Cardamom", "Taif Rose", "Bergamot", "Aldehydes"],
      heart: ["Assam Oud", "Cambodian Oud", "Damask Rose", "Cashmere Musks"],
      base: ["Golden Amber", "Saddle Leather", "Vanilla Bourbon", "Atlas Cedar"]
    },
    variants: [
      { size: "5 x 5ml", type: "Coffret Presentation Box", price: 3800, originalPrice: 4500 }
    ],
    createdAt: "2026-03-20T00:00:00.000Z"
  }
];

export const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "s2br-imperial-noir",
    productName: "S2BR Imperial Noir Extrait",
    authorName: "Shahmeer Zaman",
    authorLocation: "DHA Phase 6, Lahore",
    rating: 5,
    title: "Unbelievable Sillage in Lahore's Heat",
    comment: "Imperial Noir lasted easily past 14 hours during a family wedding in Lahore's chilly December evening. Countless people asked what I was wearing. The presentation box alone is collector's grade.",
    date: "2 days ago",
    isVerified: true,
    status: "approved"
  },
  {
    id: "rev-2",
    productId: "s2br-imperial-noir",
    productName: "S2BR Imperial Noir Extrait",
    authorName: "Barrister Daniyal S.",
    authorLocation: "Clifton, Karachi",
    rating: 5,
    title: "Better Than French Niche Houses",
    comment: "Having collected perfumes for 15 years, Imperial Noir completely exceeded my expectations. The presentation box feels like a Rs. 50,000 heirloom coffret. Cash on delivery courier arrived in Clifton within 24 hours.",
    date: "1 week ago",
    isVerified: true,
    status: "approved"
  },
  {
    id: "rev-3",
    productId: "oud-al-sultani",
    productName: "Oud Al Sultani Concentrated",
    authorName: "Fawad Malik",
    authorLocation: "F-7/2, Islamabad",
    rating: 5,
    title: "Warm Amber & Genuine Oud Mastery",
    comment: "Oud Al Sultani concentrated perfume oil matches and exceeds bottles I purchased in Dubai for triple the price. The depth of genuine oud is unmistakably authentic.",
    date: "2 weeks ago",
    isVerified: true,
    status: "approved"
  },
  {
    id: "rev-4",
    productId: "velvet-rose-ambergris",
    productName: "Velvet Rose & Ambergris",
    authorName: "Ayesha Khanani",
    authorLocation: "Clifton Block 4, Karachi",
    rating: 5,
    title: "Survives Karachi's Coastal Humidity",
    comment: "Finding an Extrait that survives Karachi's coastal humidity is almost impossible—until S2BR. Velvet Rose & Ambergris is breathtaking. Fast 2-day delivery to Clifton was flawless.",
    date: "3 weeks ago",
    isVerified: true,
    status: "approved"
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: "coup-1",
    code: "S2BRVIP",
    discountType: "fixed",
    discountValue: 500,
    minOrderAmount: 4000,
    expiryDate: "2026-12-31",
    isActive: true,
    usageCount: 142
  },
  {
    id: "coup-2",
    code: "ROYALPRIVILEGE",
    discountType: "fixed",
    discountValue: 1000,
    minOrderAmount: 8000,
    expiryDate: "2026-12-31",
    isActive: true,
    usageCount: 89
  },
  {
    id: "coup-3",
    code: "DISCOVER10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 3000,
    maxDiscount: 1500,
    expiryDate: "2026-12-31",
    isActive: true,
    usageCount: 312
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "the-science-of-scent-longevity-in-pakistans-climate",
    title: "The Architecture of Tenacity: Formulating for Pakistan's Climate",
    excerpt: "Why European formulations often dissipate in Karachi's humidity and Lahore's dry summers—and how S2BR compounds 35% pure extraits to overcome the heat barrier.",
    content: `Perfumery is fundamentally the chemistry of vapor pressure and molecular evaporation. In temperate European climates, standard 15% Eau de Parfum formulations evaporate gradually across an 8-hour workday. However, when subjected to the harsh climatic extremes of Pakistan—such as Karachi's high saline humidity or Lahore's intense summer temperatures—volatile top notes can evaporate in minutes.

At S2BR Fragrances, our master compounders solved this through three proprietary formulation techniques:

1. High Extrait Oil Ratio: We compound our formulations at an extraordinary 32% to 38% pure perfume oil concentration, significantly slowing the rate of volatile evaporation.
2. Resinous Anchor Fixatives: Utilizing fossilized amber, pure agarwood resin, and natural ambergris as molecular anchors that latch onto keratin in skin.
3. 45-Day Maturation Curing: Every batch rests in temperature-regulated glass containers for a minimum of 45 days, allowing the oils to form stable molecular complexes before bottling.`,
    author: "Master Perfumer Tariq Al-Jilani",
    readTime: "4 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDCdDsCQunC_tlr89P1ArsGwnWcplNElw9yJTsO2SCah16JINlGLqsZLzeGB7sonmJ8MFDEwz378yvBLWGVqA3W73Y_udnWCkxrII9qpj4-2YhZTzItaly1Pj4-bo-8M2mWhpjae9lgBU1xpn4xSdxvN5w7cZxHC0YnkcbjNvcxNRj2HJ0dI0dqn1qW_p6BsOYMVg2YW3zH6xBQPfuh12talhIbxbyIW4UfiTf77myAe36YGGiOjBH5g",
    publishedAt: "2026-03-10",
    category: "Olfactory Science"
  },
  {
    id: "post-2",
    slug: "the-majesty-of-assam-and-cambodian-oud",
    title: "Oud Royalty: Distinguishing Assam Dehn Al Oud from Cambodian Agarwood",
    excerpt: "An in-depth connoisseur guide to the dark, animalic smokiness of wild Indian Assam versus the sweet, fruity resinous honey notes of Cambodian woods.",
    content: `For centuries, the royal courts of the subcontinent celebrated pure Dehn Al Oud above all precious jewels. Yet many modern perfume enthusiasts struggle to distinguish the terroir of different agarwood species.

Assam Dehn Al Oud (Aquilaria Agallocha) is renowned for its intense opening: deep barnyard nuances, leather, dried tobacco, and an intoxicating smoky dry-down. It commands immediate presence and represents regal strength.

In contrast, Cambodian Oud leans toward sweet, sun-dried apricots, warm caramel, and a smooth balsamic woodiness with zero harsh edges. At S2BR, our flagship Imperial Noir fuses both worlds: Cambodian oud provides the opulent heart, while aged Assam oud guarantees an unyielding base.`,
    author: "Zainab Shah, Lead Evaluator",
    readTime: "5 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5dsIECPDyhnqbAqH_CdFlwsUHHF_nCF28R7t7Uk2siNI3wVUOlpRv-C5xaeOXvzCKr6AcaDuu5bJAjkKj40MBiNQCjXegHEm1kolGhDuO5OyUHemxbOij7NK8uHQwpxl3ueacg00cBqh-oLHy6ZaxJa6t4KbCqPp2-g8ZhLCXoL9jmkifcpF6tYzZ_xZyRAO3NLylH3aOmlRiTYhW-0LglzfG95YeQBmS-zFR3n8wzenE8gudHNUCJQ",
    publishedAt: "2026-03-18",
    category: "Heritage Ingredients"
  }
];

export const initialAdminUser: User = {
  id: "admin-s2br",
  name: "S2BR Atelier Administrator",
  email: "admin@s2br.pk",
  phone: "+92 300 0077227",
  role: "admin",
  createdAt: "2026-01-01T00:00:00.000Z"
};

export const initialCustomerUser: User = {
  id: "user-daniyal",
  name: "Syed Daniyal Shah",
  email: "daniyal.shah@gmail.com",
  phone: "+92 300 8472910",
  role: "customer",
  address: {
    fullName: "Syed Daniyal Shah",
    phone: "+92 300 8472910",
    email: "daniyal.shah@gmail.com",
    streetAddress: "Bungalow 42-A, Street 7, Phase VI, DHA",
    city: "Karachi",
    province: "Sindh",
    postalCode: "75500",
    specialNotes: "Ring secondary bell, leave with estate guard"
  },
  createdAt: "2026-02-15T00:00:00.000Z"
};
