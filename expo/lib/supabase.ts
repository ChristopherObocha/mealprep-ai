import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          diet: string | null;
          allergies: string[] | null;
          goal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          diet?: string | null;
          allergies?: string[] | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          diet?: string | null;
          allergies?: string[] | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_meals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          ingredients: string[];
          steps: string[];
          nutrition: {
            calories: string;
            protein: string;
            carbs?: string;
            fat?: string;
          };
          prep_time: string | null;
          difficulty: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          ingredients: string[];
          steps: string[];
          nutrition: {
            calories: string;
            protein: string;
            carbs?: string;
            fat?: string;
          };
          prep_time?: string | null;
          difficulty?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          ingredients?: string[];
          steps?: string[];
          nutrition?: {
            calories: string;
            protein: string;
            carbs?: string;
            fat?: string;
          };
          prep_time?: string | null;
          difficulty?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
