export const services = [
  {
    title: "Property Buying & Selling",
    description:
      "Buy or sell residential and commercial plots and homes across Multan's leading societies.",
    icon: "home",
    href: "/properties",
  },
  {
    title: "House Maps & Design",
    description:
      "Build-ready 3 Marla to 1 Kanal maps with accurate rooms, elevations and site planning.",
    icon: "map",
    href: "/house-maps",
  },
  {
    title: "Construction Services",
    description:
      "End-to-end house construction — from grey structure to finishing — on time and on budget.",
    icon: "construction",
    href: "/construction",
  },
  {
    title: "Interior Design",
    description:
      "Modern interiors, kitchens and fittings that match your map, lifestyle and finishing budget.",
    icon: "interior",
    href: "/interior-design",
  },
  {
    title: "Commercial Projects",
    description:
      "Shops, offices and mixed-use buildings planned and built for strong rental and resale value.",
    icon: "commercial",
    href: "/properties",
    filterType: "Commercial",
  },
  {
    title: "Rental Services",
    description:
      "Find or list rental homes and commercial units with verified tenants and clear documentation.",
    icon: "rental",
    href: "/properties",
    filterType: "Rental",
  },
] as const;

export type ServiceIcon = (typeof services)[number]["icon"];

/** sessionStorage key — home services → properties filter (no URL query). */
export const PROPERTIES_FILTER_KEY = "amb-properties-type-filter";
