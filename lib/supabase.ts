import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock client for when environment variables are missing
const createMockClient = () => {
  if (typeof window !== 'undefined') {
    console.warn('Supabase environment variables missing. Using mock client.');
  }
  
  const errorResponse = { data: null, error: { message: 'Supabase not configured (Demo Mode)' } };

  // Helper to mimic a promise-like object that also supports chaining methods
  const mockChain: any = {
    select: () => mockChain,
    order: () => mockChain,
    eq: () => mockChain,
    single: () => Promise.resolve(errorResponse),
    insert: () => Promise.resolve(errorResponse),
    // Standard Promise methods
    then: (onfulfilled: any, onrejected: any) => Promise.resolve(errorResponse).then(onfulfilled, onrejected),
    catch: (onrejected: any) => Promise.resolve(errorResponse).catch(onrejected),
    finally: (onfinally: any) => Promise.resolve(errorResponse).finally(onfinally)
  };

  return {
    from: (table: string) => mockChain,
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient();
