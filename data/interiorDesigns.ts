export type InteriorCategory =
  | "Living Room"
  | "Bedroom"
  | "Kitchen"
  | "Bathroom"
  | "Dining Room"
  | "Office"
  | "Complete Home";

export type InteriorDesign = {
  id: string;
  title: string;
  category: InteriorCategory;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  images?: string[];
  features?: string[];
};

export const interiorCategories: { id: InteriorCategory | "All"; label: string; icon: string }[] = [
  { id: "Living Room", label: "Living Room", icon: "sofa" },
  { id: "Bedroom", label: "Bedroom", icon: "bed" },
  { id: "Kitchen", label: "Kitchen", icon: "chef" },
  { id: "Bathroom", label: "Bathroom", icon: "bath" },
  { id: "Dining Room", label: "Dining Room", icon: "utensils" },
  { id: "Office", label: "Office", icon: "briefcase" },
  { id: "Complete Home", label: "Complete Home", icon: "home" },
];

/** Static demos removed — use getPublishedInteriors() from admin store */
export const interiorDesigns: InteriorDesign[] = [];

export const interiorConsultMessage =
  "Assalam o Alaikum, mujhe interior design / custom design ke bare mein baat karni hai";
