export type Organization = "UNIDO" | "UN" | "IAEA" | "CTBTO" | "OTHER";
export type ListingType = "rent" | "sell";
export type ListingStatus = "active" | "pending" | "closed";
export type PropertyType = "apartment" | "house" | "studio" | "penthouse" | "townhouse";
export type ViewingStatus = "pending" | "confirmed" | "cancelled";
export type MessageType = "chat" | "email";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  organization: Organization;
  is_un_staff: boolean;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  price: number;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  floor?: number;
  total_floors?: number;
  address: string;
  district: string;
  latitude?: number;
  longitude?: number;
  available_from: string;
  furnished: boolean;
  parking: boolean;
  balcony: boolean;
  elevator: boolean;
  pets_allowed: boolean;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Viewing {
  id: string;
  listing_id: string;
  requester_id: string;
  proposed_date: string;
  proposed_time: string;
  status: ViewingStatus;
  notes?: string;
  created_at: string;
  listings?: Listing;
  profiles?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  created_at: string;
  profiles?: Profile;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  listings?: Listing;
  buyer?: Profile;
  seller?: Profile;
  last_message?: Message;
}

export interface ListingFilters {
  type?: ListingType;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  district?: string;
  furnished?: boolean;
  parking?: boolean;
  pets_allowed?: boolean;
  available_from?: string;
}
