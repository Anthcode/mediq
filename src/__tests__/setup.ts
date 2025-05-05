import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock dla Supabase
const mockSupabaseResponse = {
  data: null,
  error: null,
  status: 200,
  statusText: '',
  count: null,
};

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    insert: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    update: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    delete: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    eq: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
    in: jest.fn(() => Promise.resolve(mockSupabaseResponse)),
  })),
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
};

jest.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
}));