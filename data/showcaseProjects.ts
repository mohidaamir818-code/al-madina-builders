export type ShowcaseStatus = "Ongoing" | "Upcoming";
export type ShowcaseType = "Residential" | "Commercial" | "Mixed-Use";

export type ShowcaseProject = {
  id: string;
  title: string;
  status: ShowcaseStatus;
  location: string;
  type: ShowcaseType;
  features: [string, string, string];
  price: string;
  priceValue: number;
  image: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "dha-multan-villas",
    title: "DHA Multan Villas",
    status: "Ongoing",
    location: "DHA Multan",
    type: "Residential",
    features: ["5 Marla – 1 Kanal", "3 – 6 Bedrooms", "Modern Design & Facilities"],
    price: "PKR 2,50,00,000+",
    priceValue: 25000000,
    image: "/images/listing-villa.jpg",
  },
  {
    id: "royal-orchard-apartments",
    title: "Royal Orchard Apartments",
    status: "Ongoing",
    location: "Royal Orchard, Multan",
    type: "Residential",
    features: ["2 – 3 Bedrooms", "Modern Amenities", "Secure Gated Community"],
    price: "PKR 45,00,000+",
    priceValue: 4500000,
    image: "/images/listing-apartment.jpg",
  },
  {
    id: "buch-villas",
    title: "Buch Villas",
    status: "Upcoming",
    location: "Buch Villas, Multan",
    type: "Residential",
    features: ["5 Marla – 1 Kanal", "3 – 5 Bedrooms", "Parks & Green Area"],
    price: "PKR 8,50,00,000+",
    priceValue: 85000000,
    image: "/images/listing-house-day.jpg",
  },
  {
    id: "commercial-plaza",
    title: "Commercial Plaza",
    status: "Ongoing",
    location: "Commercial Plaza, Multan",
    type: "Commercial",
    features: ["Shops & Offices", "High Footfall Area", "Investment Opportunity"],
    price: "PKR 12,00,000+",
    priceValue: 1200000,
    image: "/images/listing-plaza.jpg",
  },
];

export const projectTypeFilterOptions = ["All Types", "Residential", "Commercial", "Mixed-Use"] as const;
export const projectLocationFilterOptions = [
  "All Locations",
  "DHA Multan",
  "Royal Orchard",
  "Buch Villas",
  "Commercial Plaza",
] as const;
export const projectPriceFilterOptions = [
  "Any Price",
  "Under PKR 50 Lakh",
  "PKR 50 Lakh – 2 Crore",
  "PKR 2 – 5 Crore",
  "PKR 5 Crore+",
] as const;

export const projectConsultMessage =
  "Assalam o Alaikum, mujhe project ke bare mein maloomat chahiye";
