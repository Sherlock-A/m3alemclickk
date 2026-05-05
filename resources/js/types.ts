export type Category = {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
};

export type Review = {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  pro_response?: string | null;
  pro_responded_at?: string | null;
  created_at?: string | null;
};

export type Professional = {
  id: number;
  name: string;
  slug: string;
  phone: string;
  profession: string;
  main_city: string;
  travel_cities: string[];
  languages: string[];
  description: string;
  photo?: string | null;
  portfolio?: string[] | null;
  status: 'available' | 'busy';
  views: number;
  whatsapp_clicks: number;
  calls: number;
  rating: number;
  verified: boolean;
  completed_missions: number;
  is_available: boolean;
  latitude?: number | null;
  longitude?: number | null;
  reviews?: Review[];
  category?: Category | null;
  categories?: Category[];
  unavailabilities?: { id: number; from_date: string; to_date: string; reason: string | null }[];
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
