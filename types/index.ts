export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Database Row Types ────────────────────────────────────────────────────

export interface ShopStatus {
  id: number
  is_open: boolean
  updated_at: string
}

export interface Category {
  id: string
  name: string
  display_order: number
  is_active: boolean
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  stock_count: number | null
  created_at: string
  // joined
  category?: Category
  option_groups?: ProductOptionsGroup[]
}

export interface ProductOptionsGroup {
  id: string
  product_id: string
  group_name: string
  is_required: boolean
  max_select: number
  // joined
  options?: ProductOption[]
}

export interface ProductOption {
  id: string
  group_id: string
  option_name: string
  additional_price: number
}

export interface SiomaiType {
  id: string
  name: string
  meat_type: string
  available_count: number
  is_available: boolean
}

// ─── UI / View Types ───────────────────────────────────────────────────────

export type AvailabilityStatus = 'available' | 'limited' | 'sold-out'

export function getAvailabilityStatus(
  isAvailable: boolean,
  stockCount: number | null
): AvailabilityStatus {
  if (!isAvailable) return 'sold-out'
  if (stockCount !== null && stockCount <= 5) return 'limited'
  return 'available'
}

export interface ProductWithOptions extends Product {
  option_groups: (ProductOptionsGroup & { options: ProductOption[] })[]
}

// ─── Supabase Database Type (for createClient generics) ───────────────────

export type Database = {
  public: {
    Tables: {
      shop_status: {
        Row: ShopStatus
        Insert: { id?: number; is_open?: boolean; updated_at?: string }
        Update: { id?: number; is_open?: boolean; updated_at?: string }
      }
      categories: {
        Row: Category
        Insert: { id?: string; name: string; display_order?: number; is_active?: boolean }
        Update: { id?: string; name?: string; display_order?: number; is_active?: boolean }
      }
      products: {
        Row: Product
        Insert: { id?: string; category_id: string; name: string; description?: string | null; price: number; image_url?: string | null; is_available?: boolean; stock_count?: number | null; created_at?: string }
        Update: { id?: string; category_id?: string; name?: string; description?: string | null; price?: number; image_url?: string | null; is_available?: boolean; stock_count?: number | null; created_at?: string }
      }
      product_options_groups: {
        Row: ProductOptionsGroup
        Insert: { id?: string; product_id: string; group_name: string; is_required?: boolean; max_select?: number }
        Update: { id?: string; product_id?: string; group_name?: string; is_required?: boolean; max_select?: number }
      }
      product_options: {
        Row: ProductOption
        Insert: { id?: string; group_id: string; option_name: string; additional_price?: number }
        Update: { id?: string; group_id?: string; option_name?: string; additional_price?: number }
      }
      siomai_types: {
        Row: SiomaiType
        Insert: { id?: string; name: string; meat_type: string; available_count?: number; is_available?: boolean }
        Update: { id?: string; name?: string; meat_type?: string; available_count?: number; is_available?: boolean }
      }
    }
  }
}
