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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockChain: any = {
    select: () => mockChain,
    order: () => mockChain,
    eq: () => mockChain,
    single: () => Promise.resolve(errorResponse),
    insert: () => Promise.resolve(errorResponse),
    // Standard Promise methods
    then: (onfulfilled: ((value: unknown) => unknown) | null | undefined, onrejected: ((reason: unknown) => unknown) | null | undefined) => Promise.resolve(errorResponse).then(onfulfilled, onrejected),
    catch: (onrejected: ((reason: unknown) => unknown) | undefined) => Promise.resolve(errorResponse).catch(onrejected),
    finally: (onfinally: (() => void) | null | undefined) => Promise.resolve(errorResponse).finally(onfinally)
  };

  return {
    from: (_table: string) => mockChain,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
