
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Collection: {
        Row: {
          authorId: string
          body: string | null
          createdAt: string
          description: string
          fts: unknown | null
          id: number
          imgageUrl: string | null
          slug: string
          title: string
          topicId: number
          updatedAt: string
        }
        Insert: {
          authorId: string
          body?: string | null
          createdAt?: string
          description: string
          fts?: unknown | null
          id?: number
          imgageUrl?: string | null
          slug: string
          title: string
          topicId: number
          updatedAt: string
        }
        Update: {
          authorId?: string
          body?: string | null
          createdAt?: string
          description?: string
          fts?: unknown | null
          id?: number
          imgageUrl?: string | null
          slug?: string
          title?: string
          topicId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Collection_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Collection_topicId_fkey"
            columns: ["topicId"]
            isOneToOne: false
            referencedRelation: "Topic"
            referencedColumns: ["id"]
          }
        ]
      }
      Comment: {
        Row: {
          authorId: string
          createdAt: string
          fts: unknown | null
          id: string
          itemId: number
          text: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          createdAt?: string
          fts?: unknown | null
          id: string
          itemId: number
          text: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          createdAt?: string
          fts?: unknown | null
          id?: string
          itemId?: number
          text?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          }
        ]
      }
      CustomField: {
        Row: {
          collectionId: number
          createdAt: string
          id: number
          state: boolean
          type: Database["public"]["Enums"]["CustomFieldTypes"]
          updatedAt: string
          value: string
        }
        Insert: {
          collectionId: number
          createdAt?: string
          id?: number
          state?: boolean
          type: Database["public"]["Enums"]["CustomFieldTypes"]
          updatedAt: string
          value: string
        }
        Update: {
          collectionId?: number
          createdAt?: string
          id?: number
          state?: boolean
          type?: Database["public"]["Enums"]["CustomFieldTypes"]
          updatedAt?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "CustomField_collectionId_fkey"
            columns: ["collectionId"]
            isOneToOne: false
            referencedRelation: "Collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CustomField_collectionId_fkey"
            columns: ["collectionId"]
            isOneToOne: false
            referencedRelation: "fts"
            referencedColumns: ["id"]
          }
        ]
      }
      CustomFieldValue: {
        Row: {
          booleanValue: boolean | null
          createdAt: string
          customFieldId: number
          dateValue: string | null
          id: number
          intValue: number | null
          itemId: number
          stringValue: string | null
          textValue: string | null
          updatedAt: string
        }
        Insert: {
          booleanValue?: boolean | null
          createdAt?: string
          customFieldId: number
          dateValue?: string | null
          id?: number
          intValue?: number | null
          itemId: number
          stringValue?: string | null
          textValue?: string | null
          updatedAt: string
        }
        Update: {
          booleanValue?: boolean | null
          createdAt?: string
          customFieldId?: number
          dateValue?: string | null
          id?: number
          intValue?: number | null
          itemId?: number
          stringValue?: string | null
          textValue?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "CustomFieldValue_customFieldId_fkey"
            columns: ["customFieldId"]
            isOneToOne: false
            referencedRelation: "CustomField"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CustomFieldValue_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          }
        ]
      }
      Item: {
        Row: {
          collectionId: number
          createdAt: string
          fts: unknown | null
          id: number
          name: string
          slug: string
          updatedAt: string
        }
        Insert: {
          collectionId: number
          createdAt?: string
          fts?: unknown | null
          id?: number
          name: string
          slug: string
          updatedAt: string
        }
        Update: {
          collectionId?: number
          createdAt?: string
          fts?: unknown | null
          id?: number
          name?: string
          slug?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Item_collectionId_fkey"
            columns: ["collectionId"]
            isOneToOne: false
            referencedRelation: "Collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_collectionId_fkey"
            columns: ["collectionId"]
            isOneToOne: false
            referencedRelation: "fts"
            referencedColumns: ["id"]
          }
        ]
      }
      Like: {
        Row: {
          itemId: number
          like: boolean
          userId: string
        }
        Insert: {
          itemId: number
          like?: boolean
          userId: string
        }
        Update: {
          itemId?: number
          like?: boolean
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Like_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Like_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Tag: {
        Row: {
          createdAt: string
          id: number
          name: string
          slug: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
          slug: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
          slug?: string
          updatedAt?: string
        }
        Relationships: []
      }
      TagsOnItems: {
        Row: {
          createdAt: string
          itemId: number
          tagId: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          itemId: number
          tagId: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          itemId?: number
          tagId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "TagsOnItems_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TagsOnItems_tagId_fkey"
            columns: ["tagId"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          }
        ]
      }
      Topic: {
        Row: {
          createdAt: string
          id: number
          name: string
          name_ru: string | null
          slug: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
          name_ru?: string | null
          slug: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
          name_ru?: string | null
          slug?: string
          updatedAt?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          active: boolean
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          role: Database["public"]["Enums"]["Role"]
          slug: string
        }
        Insert: {
          active?: boolean
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
          slug: string
        }
        Update: {
          active?: boolean
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["Role"]
          slug?: string
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      fts: {
        Row: {
          authorname: string | null
          authorslug: string | null
          createdAt: string | null
          description: string | null
          fts: unknown | null
          id: number | null
          imgageUrl: string | null
          slug: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CustomFieldTypes: "INT" | "DATE" | "BOOLEAN" | "STRING" | "TEXT"
      Role: "AUTHOR" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
