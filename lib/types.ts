export type PantryItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  created_at: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  cooking_time: number | null;
  servings: number | null;
};
