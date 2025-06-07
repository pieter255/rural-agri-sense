export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agricultural_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          expires_at: string | null
          farm_location_id: string | null
          id: string
          is_read: boolean | null
          message: string
          severity: Database["public"]["Enums"]["pest_severity"]
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          expires_at?: string | null
          farm_location_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          severity: Database["public"]["Enums"]["pest_severity"]
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          expires_at?: string | null
          farm_location_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: Database["public"]["Enums"]["pest_severity"]
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_alerts_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agricultural_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_analysis: {
        Row: {
          analysis_result: Json
          analyzed_at: string | null
          confidence_score: number | null
          crop_id: string | null
          disease_detected: Database["public"]["Enums"]["disease_type"] | null
          id: string
          image_url: string
          recommendations: string[] | null
          severity: Database["public"]["Enums"]["pest_severity"] | null
          user_id: string
        }
        Insert: {
          analysis_result: Json
          analyzed_at?: string | null
          confidence_score?: number | null
          crop_id?: string | null
          disease_detected?: Database["public"]["Enums"]["disease_type"] | null
          id?: string
          image_url: string
          recommendations?: string[] | null
          severity?: Database["public"]["Enums"]["pest_severity"] | null
          user_id: string
        }
        Update: {
          analysis_result?: Json
          analyzed_at?: string | null
          confidence_score?: number | null
          crop_id?: string | null
          disease_detected?: Database["public"]["Enums"]["disease_type"] | null
          id?: string
          image_url?: string
          recommendations?: string[] | null
          severity?: Database["public"]["Enums"]["pest_severity"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_analysis_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "user_crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_locations: {
        Row: {
          created_at: string | null
          elevation_meters: number | null
          id: string
          latitude: number
          longitude: number
          name: string
          size_hectares: number
          soil_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          elevation_meters?: number | null
          id?: string
          latitude: number
          longitude: number
          name: string
          size_hectares: number
          soil_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          elevation_meters?: number | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          size_hectares?: number
          soil_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farming_activities: {
        Row: {
          activity_type: string
          cost: number | null
          created_at: string | null
          crop_id: string | null
          date_performed: string
          description: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          cost?: number | null
          created_at?: string | null
          crop_id?: string | null
          date_performed: string
          description: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          cost?: number | null
          created_at?: string | null
          crop_id?: string | null
          date_performed?: string
          description?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farming_activities_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "user_crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farming_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          created_at: string | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          id: string
          location: string
          market_name: string | null
          price_date: string
          price_per_kg: number
        }
        Insert: {
          created_at?: string | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          id?: string
          location: string
          market_name?: string | null
          price_date: string
          price_per_kg: number
        }
        Update: {
          created_at?: string | null
          crop_type?: Database["public"]["Enums"]["crop_type"]
          id?: string
          location?: string
          market_name?: string | null
          price_date?: string
          price_per_kg?: number
        }
        Relationships: []
      }
      pest_reports: {
        Row: {
          affected_area_percentage: number | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          description: string | null
          disease_type: Database["public"]["Enums"]["disease_type"]
          farm_location_id: string | null
          id: string
          image_url: string | null
          pest_name: string
          reported_at: string | null
          severity: Database["public"]["Enums"]["pest_severity"]
          treatment_applied: string | null
          user_id: string
        }
        Insert: {
          affected_area_percentage?: number | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          description?: string | null
          disease_type: Database["public"]["Enums"]["disease_type"]
          farm_location_id?: string | null
          id?: string
          image_url?: string | null
          pest_name: string
          reported_at?: string | null
          severity: Database["public"]["Enums"]["pest_severity"]
          treatment_applied?: string | null
          user_id: string
        }
        Update: {
          affected_area_percentage?: number | null
          crop_type?: Database["public"]["Enums"]["crop_type"]
          description?: string | null
          disease_type?: Database["public"]["Enums"]["disease_type"]
          farm_location_id?: string | null
          id?: string
          image_url?: string | null
          pest_name?: string
          reported_at?: string | null
          severity?: Database["public"]["Enums"]["pest_severity"]
          treatment_applied?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pest_reports_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pest_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          farm_size_hectares: number | null
          farming_experience_years: number | null
          full_name: string
          id: string
          location: string | null
          phone: string | null
          primary_crops: Database["public"]["Enums"]["crop_type"][] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          farm_size_hectares?: number | null
          farming_experience_years?: number | null
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          primary_crops?: Database["public"]["Enums"]["crop_type"][] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          farm_size_hectares?: number | null
          farming_experience_years?: number | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          primary_crops?: Database["public"]["Enums"]["crop_type"][] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_crops: {
        Row: {
          area_hectares: number
          created_at: string | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          expected_harvest_date: string | null
          farm_location_id: string | null
          growth_stage: Database["public"]["Enums"]["growth_stage"] | null
          id: string
          notes: string | null
          planting_date: string
          updated_at: string | null
          user_id: string
          variety: string | null
        }
        Insert: {
          area_hectares: number
          created_at?: string | null
          crop_type: Database["public"]["Enums"]["crop_type"]
          expected_harvest_date?: string | null
          farm_location_id?: string | null
          growth_stage?: Database["public"]["Enums"]["growth_stage"] | null
          id?: string
          notes?: string | null
          planting_date: string
          updated_at?: string | null
          user_id: string
          variety?: string | null
        }
        Update: {
          area_hectares?: number
          created_at?: string | null
          crop_type?: Database["public"]["Enums"]["crop_type"]
          expected_harvest_date?: string | null
          farm_location_id?: string | null
          growth_stage?: Database["public"]["Enums"]["growth_stage"] | null
          id?: string
          notes?: string | null
          planting_date?: string
          updated_at?: string | null
          user_id?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_crops_farm_location_id_fkey"
            columns: ["farm_location_id"]
            isOneToOne: false
            referencedRelation: "farm_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_crops_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          condition: Database["public"]["Enums"]["weather_condition"] | null
          created_at: string | null
          date_recorded: string
          humidity: number | null
          id: string
          latitude: number
          longitude: number
          rainfall_mm: number | null
          temperature_max: number | null
          temperature_min: number | null
          uv_index: number | null
          wind_direction: string | null
          wind_speed_kmh: number | null
        }
        Insert: {
          condition?: Database["public"]["Enums"]["weather_condition"] | null
          created_at?: string | null
          date_recorded: string
          humidity?: number | null
          id?: string
          latitude: number
          longitude: number
          rainfall_mm?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          uv_index?: number | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Update: {
          condition?: Database["public"]["Enums"]["weather_condition"] | null
          created_at?: string | null
          date_recorded?: string
          humidity?: number | null
          id?: string
          latitude?: number
          longitude?: number
          rainfall_mm?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          uv_index?: number | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Relationships: []
      }
      yield_data: {
        Row: {
          actual_yield_kg: number | null
          created_at: string | null
          crop_id: string
          harvest_date: string | null
          id: string
          market_price_per_kg: number | null
          predicted_yield_kg: number | null
          prediction_date: string | null
          quality_grade: string | null
          total_revenue: number | null
          user_id: string
          yield_per_hectare: number | null
        }
        Insert: {
          actual_yield_kg?: number | null
          created_at?: string | null
          crop_id: string
          harvest_date?: string | null
          id?: string
          market_price_per_kg?: number | null
          predicted_yield_kg?: number | null
          prediction_date?: string | null
          quality_grade?: string | null
          total_revenue?: number | null
          user_id: string
          yield_per_hectare?: number | null
        }
        Update: {
          actual_yield_kg?: number | null
          created_at?: string | null
          crop_id?: string
          harvest_date?: string | null
          id?: string
          market_price_per_kg?: number | null
          predicted_yield_kg?: number | null
          prediction_date?: string | null
          quality_grade?: string | null
          total_revenue?: number | null
          user_id?: string
          yield_per_hectare?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "yield_data_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "user_crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      crop_type:
        | "maize"
        | "beans"
        | "wheat"
        | "sorghum"
        | "sunflower"
        | "potato"
        | "tomato"
        | "cabbage"
        | "onion"
        | "carrot"
      disease_type:
        | "fungal"
        | "bacterial"
        | "viral"
        | "pest"
        | "nutrient_deficiency"
        | "environmental"
      growth_stage:
        | "planting"
        | "germination"
        | "vegetative"
        | "flowering"
        | "fruiting"
        | "maturity"
        | "harvest"
      pest_severity: "low" | "medium" | "high" | "critical"
      weather_condition:
        | "sunny"
        | "partly_cloudy"
        | "cloudy"
        | "rainy"
        | "stormy"
        | "foggy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      crop_type: [
        "maize",
        "beans",
        "wheat",
        "sorghum",
        "sunflower",
        "potato",
        "tomato",
        "cabbage",
        "onion",
        "carrot",
      ],
      disease_type: [
        "fungal",
        "bacterial",
        "viral",
        "pest",
        "nutrient_deficiency",
        "environmental",
      ],
      growth_stage: [
        "planting",
        "germination",
        "vegetative",
        "flowering",
        "fruiting",
        "maturity",
        "harvest",
      ],
      pest_severity: ["low", "medium", "high", "critical"],
      weather_condition: [
        "sunny",
        "partly_cloudy",
        "cloudy",
        "rainy",
        "stormy",
        "foggy",
      ],
    },
  },
} as const
