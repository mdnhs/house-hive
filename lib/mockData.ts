export interface FlatItem {
  id: string;
  title: string;
  location: string; // e.g. "Bashundhara R/A"
  zone: string; // e.g. "Bashundhara"
  priceLakh: number; // in Lakhs (e.g. 150 for 1.5 Cr)
  bedrooms: number; // 1, 2, 3, 4
  sizeSqft: number; // e.g. 1650
  images: string[]; // Slideshow images
  amenities: string[];
  category: "Luxury" | "Cozy" | "Penthouse" | "Lake View" | "Duplex";
}

export interface InteriorItem {
  id: string;
  title: string;
  location: string;
  zone: string;
  spaceType: string; // "Living Room", "Bedroom", "Kitchen", "Dining", "Office", "Full Home"
  designStyle: string; // "Modern", "Luxury", "Minimalist", "Classic", "Contemporary"
  images: string[]; // Slideshow images
  designer: string;
  category: "Minimalist" | "Luxury" | "Modern" | "Classic" | "Contemporary";
}

export const DHAKA_ZONES = [
  "Gulshan",
  "Banani",
  "Bashundhara",
  "Uttara",
  "Dhanmondi",
  "Mirpur",
];

// Mapping zones to sub-locations for autocomplete suggestions
export const ZONE_SUGGESTIONS: Record<string, string[]> = {
  Gulshan: [
    "Gulshan 1",
    "Gulshan 2",
    "Gulshan Avenue",
    "Gulshan Circle 1",
    "Gulshan Circle 2",
  ],
  Banani: [
    "Banani Block A",
    "Banani Block B",
    "Banani Block C",
    "Banani Block E",
    "Banani Block H",
    "Banani Road 11",
  ],
  Bashundhara: [
    "Bashundhara R/A",
    "Bashundhara Block A",
    "Bashundhara Block B",
    "Bashundhara Block C",
    "Bashundhara Block D",
    "Bashundhara Block G",
    "Bashundhara Block I",
  ],
  Uttara: [
    "Uttara Sector 1",
    "Uttara Sector 3",
    "Uttara Sector 4",
    "Uttara Sector 7",
    "Uttara Sector 11",
    "Uttara Sector 13",
  ],
  Dhanmondi: [
    "Dhanmondi Road 27",
    "Dhanmondi Road 32",
    "Dhanmondi Road 15",
    "Dhanmondi R/A",
  ],
  Mirpur: [
    "Mirpur 1",
    "Mirpur 2",
    "Mirpur 10",
    "Mirpur 11",
    "Mirpur 12",
    "Mirpur DOHS",
  ],
};

// Flattened suggestions helper
export const ALL_SUGGESTIONS: string[] = Object.values(ZONE_SUGGESTIONS).flat();

export const FLATS_DATA: FlatItem[] = [
  {
    id: "f1",
    title: "Premium 3-Bedroom Apartment with Lake View",
    location: "Gulshan 2",
    zone: "Gulshan",
    priceLakh: 280, // 2.8 Cr
    bedrooms: 3,
    sizeSqft: 2200,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lake view", "Generator", "24/7 Security", "Lift", "Car Parking"],
    category: "Lake View",
  },
  {
    id: "f2",
    title: "Modern Cozy 2-Bed Flat near Road 11",
    location: "Banani Road 11",
    zone: "Banani",
    priceLakh: 140, // 1.4 Cr
    bedrooms: 2,
    sizeSqft: 1250,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lift", "Car Parking", "CCTV Security", "Gas connection"],
    category: "Cozy",
  },
  {
    id: "f3",
    title: "Affordable 3-Bed Family Apartment in Block B",
    location: "Bashundhara Block B",
    zone: "Bashundhara",
    priceLakh: 85, // 85 Lakh
    bedrooms: 3,
    sizeSqft: 1450,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Security", "Lift", "Generator Backup", "Balcony"],
    category: "Cozy",
  },
  {
    id: "f4",
    title: "Luxury Duplex Penthouse with Private Terrace",
    location: "Gulshan Avenue",
    zone: "Gulshan",
    priceLakh: 520, // 5.2 Cr
    bedrooms: 4,
    sizeSqft: 4100,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Private Terrace", "Duplex", "Swimming Pool access", "Elevator", "3 Parking slots"],
    category: "Penthouse",
  },
  {
    id: "f5",
    title: "Charming Compact 1-Bed Apartment",
    location: "Uttara Sector 11",
    zone: "Uttara",
    priceLakh: 45, // 45 Lakh
    bedrooms: 1,
    sizeSqft: 750,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Intercom", "24/7 Guard", "Prepaid Gas"],
    category: "Cozy",
  },
  {
    id: "f6",
    title: "Spacious 3-Bed Flat in Dhanmondi R/A",
    location: "Dhanmondi R/A",
    zone: "Dhanmondi",
    priceLakh: 195, // 1.95 Cr
    bedrooms: 3,
    sizeSqft: 1850,
    images: [
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lift", "Generator", "Parking", "Geyser", "CCTV"],
    category: "Luxury",
  },
  {
    id: "f7",
    title: "Well-Planned 3-Bed Apartment in Mirpur 12",
    location: "Mirpur 12",
    zone: "Mirpur",
    priceLakh: 65, // 65 Lakh
    bedrooms: 3,
    sizeSqft: 1350,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lift", "Security Guard", "Gas supply", "Broadband internet ready"],
    category: "Cozy",
  },
  {
    id: "f8",
    title: "Brand New 4-Bed Residence in Block G",
    location: "Bashundhara Block G",
    zone: "Bashundhara",
    priceLakh: 230, // 2.3 Cr
    bedrooms: 4,
    sizeSqft: 2600,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Servant Room", "Lift", "Substation", "Generator", "2 Car Parking slots"],
    category: "Duplex",
  },
  {
    id: "f9",
    title: "Cosy 2-Bed Apartment in Sector 3",
    location: "Uttara Sector 3",
    zone: "Uttara",
    priceLakh: 95, // 95 Lakh
    bedrooms: 2,
    sizeSqft: 1100,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Security", "Roof garden access", "Elevator"],
    category: "Cozy",
  },
];

export const INTERIORS_DATA: InteriorItem[] = [
  {
    id: "i1",
    title: "Minimalist Japandi Living Room Oasis",
    location: "Banani Block H",
    zone: "Banani",
    spaceType: "Living Room",
    designStyle: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Studio Hive Design",
    category: "Minimalist",
  },
  {
    id: "i2",
    title: "Luxury Contemporary Penthouse Living",
    location: "Gulshan Avenue",
    zone: "Gulshan",
    spaceType: "Full Home",
    designStyle: "Luxury",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Aura Interiors BD",
    category: "Luxury",
  },
  {
    id: "i3",
    title: "Modern Scandinavian Kitchen Setup",
    location: "Bashundhara R/A",
    zone: "Bashundhara",
    spaceType: "Kitchen",
    designStyle: "Modern",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Vanguard Studio",
    category: "Modern",
  },
  {
    id: "i4",
    title: "Classic Mahogany Royal Master Bedroom",
    location: "Dhanmondi R/A",
    zone: "Dhanmondi",
    spaceType: "Bedroom",
    designStyle: "Classic",
    images: [
      "https://images.unsplash.com/photo-1505693395321-883724634266?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Heritage Interiors",
    category: "Classic",
  },
  {
    id: "i5",
    title: "Sleek Contemporary Executive Office Studio",
    location: "Gulshan 1",
    zone: "Gulshan",
    spaceType: "Office",
    designStyle: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Pixel & Line Co.",
    category: "Contemporary",
  },
  {
    id: "i6",
    title: "Elegant Luxury Dining Room with Marble Accents",
    location: "Uttara Sector 7",
    zone: "Uttara",
    spaceType: "Dining",
    designStyle: "Luxury",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Deco Crafts BD",
    category: "Luxury",
  },
  {
    id: "i7",
    title: "Cozy Modern Living Room with Accent Wall",
    location: "Mirpur DOHS",
    zone: "Mirpur",
    spaceType: "Living Room",
    designStyle: "Modern",
    images: [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Crafted Spaces",
    category: "Modern",
  },
  {
    id: "i8",
    title: "Minimalist Zen Master Bedroom Sanctuary",
    location: "Bashundhara Block D",
    zone: "Bashundhara",
    spaceType: "Bedroom",
    designStyle: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Studio Hive Design",
    category: "Minimalist",
  },
];
