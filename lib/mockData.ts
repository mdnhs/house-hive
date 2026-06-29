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
  propertyType?: "Flat" | "Plot" | "Commercial Space";

  // Real Estate Property Overview fields
  bathrooms?: number;
  floor?: string;
  parking?: string;
  balconies?: number;
  facing?: string;
  furnishedStatus?: "Unfurnished" | "Semi-Furnished" | "Fully Furnished";
  nearby?: {
    schools: string[];
    hospitals: string[];
    shopping: string[];
  };
  company?: {
    logo: string;
    name: string;
    verified: boolean;
    totalListings: number;
  };
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

  // Interior Design execution specs
  completionTime?: string; // e.g. "8 Weeks"
  materialsUsed?: string[];
  estimatedBudgetRange?: string; // e.g. "৳12L - ৳18L"
  company?: {
    logo: string;
    name: string;
    verified: boolean;
    totalProjects: number;
    experienceYears: number;
  };
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
    amenities: ["Lift", "Security Guard", "Gas supply", "Broadband ready"],
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
  {
    id: "f10",
    title: "Well-Decorated 3-Bed Flat in Mirpur DOHS",
    location: "Mirpur DOHS",
    zone: "Mirpur",
    priceLakh: 115, // 1.15 Cr
    bedrooms: 3,
    sizeSqft: 1600,
    images: [
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["CCTV", "Modern Kitchen", "Generator Backup", "Lift"],
    category: "Cozy",
  },
  {
    id: "f11",
    title: "Luxury 4-Bedroom Suite in Road 27",
    location: "Dhanmondi Road 27",
    zone: "Dhanmondi",
    priceLakh: 210, // 2.1 Cr
    bedrooms: 4,
    sizeSqft: 2450,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Servant Quarter", "24/7 Security Guard", "2 Car Parking", "Lift"],
    category: "Luxury",
  },
  {
    id: "f12",
    title: "Sleek 2-Bedroom Flat with Balcony",
    location: "Gulshan 1",
    zone: "Gulshan",
    priceLakh: 165, // 1.65 Cr
    bedrooms: 2,
    sizeSqft: 1500,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["CCTV Security", "Dedicated Parking", "Elevator", "Generator"],
    category: "Cozy",
  },
  {
    id: "f13",
    title: "Premium 3-Bedroom Flat in Block E",
    location: "Banani Block E",
    zone: "Banani",
    priceLakh: 260, // 2.6 Cr
    bedrooms: 3,
    sizeSqft: 2100,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Top Tier Security", "Substation", "Modern Lobby", "Lift"],
    category: "Luxury",
  },
  {
    id: "f14",
    title: "Compact 1-Bedroom Studio Apartment",
    location: "Bashundhara Block C",
    zone: "Bashundhara",
    priceLakh: 48, // 48 Lakh
    bedrooms: 1,
    sizeSqft: 800,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Intercom", "Secure Gate Access", "Prepaid Gas Meter"],
    category: "Cozy",
  },
  {
    id: "f15",
    title: "Family Apartment in Sector 7",
    location: "Uttara Sector 7",
    zone: "Uttara",
    priceLakh: 125, // 1.25 Cr
    bedrooms: 3,
    sizeSqft: 1700,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Elevator", "Gas connection", "Car park slot", "Guard"],
    category: "Cozy",
  },
  {
    id: "f16",
    title: "Budget-Friendly 2-Bed Flat in Mirpur 2",
    location: "Mirpur 2",
    zone: "Mirpur",
    priceLakh: 38, // 38 Lakh
    bedrooms: 2,
    sizeSqft: 950,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Intercom", "Secure Entry", "Prepaid Gas"],
    category: "Cozy",
  },
  {
    id: "f17",
    title: "Comfortable 2-Bed Apartment on Road 15",
    location: "Dhanmondi Road 15",
    zone: "Dhanmondi",
    priceLakh: 90, // 90 Lakh
    bedrooms: 2,
    sizeSqft: 1200,
    images: [
      "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lift", "CCTV", "Car Parking", "Generator Support"],
    category: "Cozy",
  },
  {
    id: "f18",
    title: "Presidential Duplex Penthouse in Circle 2",
    location: "Gulshan Circle 2",
    zone: "Gulshan",
    priceLakh: 450, // 4.5 Cr
    bedrooms: 4,
    sizeSqft: 3600,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Duplex Layout", "High Speed Lift", "Private Terrace", "Pool Access"],
    category: "Penthouse",
  },
  {
    id: "f19",
    title: "Luxury 3-Bed Residence in Block H",
    location: "Banani Block H",
    zone: "Banani",
    priceLakh: 180, // 1.8 Cr
    bedrooms: 3,
    sizeSqft: 1800,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Generator Backup", "Lift", "CCTV", "Guard Room"],
    category: "Luxury",
  },
  {
    id: "f20",
    title: "Charming 2-Bedroom Flat in Block I",
    location: "Bashundhara Block I",
    zone: "Bashundhara",
    priceLakh: 75, // 75 Lakh
    bedrooms: 2,
    sizeSqft: 1150,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Lift", "Secure Compound Gate", "Balcony"],
    category: "Cozy",
  },
  {
    id: "f21",
    title: "Elegant 3-Bedroom Apartment in Sector 13",
    location: "Uttara Sector 13",
    zone: "Uttara",
    priceLakh: 185, // 1.85 Cr
    bedrooms: 3,
    sizeSqft: 1950,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Generator", "Dedicated Parking slot", "Lift", "CCTV Camera"],
    category: "Luxury",
  },
  {
    id: "f22",
    title: "Cozy 2-Bedroom Flat in Sector 11",
    location: "Mirpur 11",
    zone: "Mirpur",
    priceLakh: 52, // 52 Lakh
    bedrooms: 2,
    sizeSqft: 1050,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Broadband ready", "Lift", "24/7 Security guard", "Gas connection"],
    category: "Cozy",
  },
  {
    id: "f23",
    title: "Stately 4-Bed Residence on Road 32",
    location: "Dhanmondi Road 32",
    zone: "Dhanmondi",
    priceLakh: 310, // 3.1 Cr
    bedrooms: 4,
    sizeSqft: 3200,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Private Terrace", "2 Dedicated Parking spaces", "Lift", "Generator backup"],
    category: "Duplex",
  },
  {
    id: "f24",
    title: "Lovely 2-Bedroom Flat in Block A",
    location: "Banani Block A",
    zone: "Banani",
    priceLakh: 98, // 98 Lakh
    bedrooms: 2,
    sizeSqft: 1300,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Roof Garden access", "Intercom", "Secure Entrance Gate", "Lift"],
    category: "Cozy",
  },
  {
    id: "f25",
    title: "10 Katha Prime Residential Plot for Sale",
    location: "Bashundhara Block I",
    zone: "Bashundhara",
    priceLakh: 450, // 4.5 Cr
    bedrooms: 0,
    sizeSqft: 7200, // 10 Katha ~ 7200 sqft
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1444653389962-8149286c578a?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Corner Plot", "Boundary Wall", "30ft Wide Road", "Electricity Connection"],
    category: "Luxury",
    propertyType: "Plot",
  },
  {
    id: "f26",
    title: "Premium Office Space in Corporate Tower",
    location: "Gulshan Avenue",
    zone: "Gulshan",
    priceLakh: 620, // 6.2 Cr
    bedrooms: 0,
    sizeSqft: 3400,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=60"
    ],
    amenities: ["Central AC", "Fire Safety", "4 Elevators", "Double Glazed Glass", "2 Parking slots"],
    category: "Luxury",
    propertyType: "Commercial Space",
  }
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
  {
    id: "i9",
    title: "Industrial Modern Kitchen Workspace",
    location: "Banani Road 11",
    zone: "Banani",
    spaceType: "Kitchen",
    designStyle: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Vanguard Studio",
    category: "Contemporary",
  },
  {
    id: "i10",
    title: "Classic Mahogany Full Home Remodel",
    location: "Dhanmondi Road 27",
    zone: "Dhanmondi",
    spaceType: "Full Home",
    designStyle: "Classic",
    images: [
      "https://images.unsplash.com/photo-1505693395321-883724634266?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Heritage Interiors",
    category: "Classic",
  },
  {
    id: "i11",
    title: "Trendy Contemporary Living Area",
    location: "Gulshan 2",
    zone: "Gulshan",
    spaceType: "Living Room",
    designStyle: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Aura Interiors BD",
    category: "Contemporary",
  },
  {
    id: "i12",
    title: "Scandinavian Modern Bedroom layout",
    location: "Uttara Sector 3",
    zone: "Uttara",
    spaceType: "Bedroom",
    designStyle: "Modern",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Vanguard Studio",
    category: "Modern",
  },
  {
    id: "i13",
    title: "Sleek Minimalist Dining & Kitchen Concept",
    location: "Mirpur 12",
    zone: "Mirpur",
    spaceType: "Kitchen",
    designStyle: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Studio Hive Design",
    category: "Minimalist",
  },
  {
    id: "i14",
    title: "Luxury Executive Work Suite design",
    location: "Bashundhara Block G",
    zone: "Bashundhara",
    spaceType: "Office",
    designStyle: "Luxury",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Pixel & Line Co.",
    category: "Luxury",
  },
  {
    id: "i15",
    title: "Contemporary Mahogany Dining Room Design",
    location: "Dhanmondi Road 15",
    zone: "Dhanmondi",
    spaceType: "Dining",
    designStyle: "Contemporary",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Deco Crafts BD",
    category: "Contemporary",
  },
  {
    id: "i16",
    title: "Minimalist Full Home Renovation Project",
    location: "Uttara Sector 11",
    zone: "Uttara",
    spaceType: "Full Home",
    designStyle: "Minimalist",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=60"
    ],
    designer: "Studio Hive Design",
    category: "Minimalist",
  }
];

export const LOCATION_COORDINATES: Record<string, [number, number]> = {
  // [longitude, latitude] for maplibre (note that MapLibre uses [lng, lat])
  "Gulshan 1": [90.4152, 23.7796],
  "Gulshan 2": [90.4158, 23.7925],
  "Gulshan Avenue": [90.4145, 23.7865],
  "Gulshan Circle 1": [90.4152, 23.7796],
  "Gulshan Circle 2": [90.4158, 23.7925],
  
  "Banani Block A": [90.4020, 23.7940],
  "Banani Block B": [90.4005, 23.7960],
  "Banani Block C": [90.3985, 23.7930],
  "Banani Block E": [90.4040, 23.7905],
  "Banani Block H": [90.4060, 23.7925],
  "Banani Road 11": [90.4035, 23.7937],
  
  "Bashundhara R/A": [90.4255, 23.8194],
  "Bashundhara Block A": [90.4220, 23.8160],
  "Bashundhara Block B": [90.4260, 23.8175],
  "Bashundhara Block C": [90.4290, 23.8190],
  "Bashundhara Block D": [90.4315, 23.8210],
  "Bashundhara Block G": [90.4340, 23.8240],
  "Bashundhara Block I": [90.4365, 23.8270],
  
  "Uttara Sector 1": [90.3840, 23.8640],
  "Uttara Sector 3": [90.3830, 23.8690],
  "Uttara Sector 4": [90.3875, 23.8670],
  "Uttara Sector 7": [90.3820, 23.8730],
  "Uttara Sector 11": [90.3780, 23.8820],
  "Uttara Sector 13": [90.3750, 23.8860],
  
  "Dhanmondi Road 27": [90.3725, 23.7535],
  "Dhanmondi Road 32": [90.3770, 23.7505],
  "Dhanmondi Road 15": [90.3740, 23.7445],
  "Dhanmondi R/A": [90.3742, 23.7461],
  
  "Mirpur 1": [90.3540, 23.7950],
  "Mirpur 2": [90.3620, 23.8010],
  "Mirpur 10": [90.3695, 23.8070],
  "Mirpur 11": [90.3720, 23.8120],
  "Mirpur 12": [90.3670, 23.8215],
  "Mirpur DOHS": [90.3760, 23.8320],
};

export const ZONE_COORDINATES: Record<string, [number, number]> = {
  "Gulshan": [90.4158, 23.7925],
  "Banani": [90.4042, 23.7937],
  "Bashundhara": [90.4267, 23.8194],
  "Uttara": [90.3795, 23.8759],
  "Dhanmondi": [90.3742, 23.7461],
  "Mirpur": [90.3687, 23.8069],
  "Dhaka": [90.4125, 23.8103],
};

export function getCoordinates(location: string, zone?: string): [number, number] {
  if (LOCATION_COORDINATES[location]) {
    return LOCATION_COORDINATES[location];
  }
  if (zone && ZONE_COORDINATES[zone]) {
    return ZONE_COORDINATES[zone];
  }
  
  // Fuzzy matching for location
  const locLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (locLower.includes(key.toLowerCase()) || key.toLowerCase().includes(locLower)) {
      return coords;
    }
  }
  
  if (zone) {
    const zoneLower = zone.toLowerCase();
    for (const [key, coords] of Object.entries(ZONE_COORDINATES)) {
      if (zoneLower.includes(key.toLowerCase()) || key.toLowerCase().includes(zoneLower)) {
        return coords;
      }
    }
  }
  
  return ZONE_COORDINATES["Dhaka"];
}
