export type HousePlan = {
  id: string;
  title: string;
  badge: string;
  beds: number;
  baths: number;
  sqft: number;
  floors: number;
  description: string;
  price: string;
  image: string;
  images?: string[];
  features?: string[];
};

/** Static demos removed — use getPublishedHouseMaps() from admin store */
export const housePlans: HousePlan[] = [];

export const bedOptions = ["Select Beds", "2", "3", "4", "5"] as const;
export const areaOptions = ["Select Area (Sq. Ft.)", "600", "1000", "2000", "4000"] as const;
export const floorOptions = ["Select Floors", "1", "2"] as const;
