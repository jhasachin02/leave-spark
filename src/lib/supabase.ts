// Mock Supabase client for development
// This will be replaced by the actual Supabase client once the integration is set up

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async (credentials: any) => ({ data: { user: null }, error: new Error("Please set up Supabase integration") }),
    signUp: async (options: any) => ({ data: { user: null }, error: new Error("Please set up Supabase integration") }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      }),
    }),
    insert: async (data: any) => ({ data: null, error: new Error("Please set up Supabase integration") }),
    update: (data: any) => ({
      eq: async (column: string, value: any) => ({ data: null, error: new Error("Please set up Supabase integration") }),
    }),
  }),
};