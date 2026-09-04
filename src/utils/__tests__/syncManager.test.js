import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import {
  generateScanId,
  enqueueMutation,
  flushQueue,
  fetchAndCacheScans,
  getCachedScans
} from '../syncManager';

// Mock dependencies with proper AsyncStorage implementation
jest.mock('@react-native-async-storage/async-storage', () => {
  let storage = {};
  return {
    setItem: jest.fn((key, value) => {
      storage[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key) => {
      return Promise.resolve(storage[key] || null);
    }),
    removeItem: jest.fn((key) => {
      delete storage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      storage = {};
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => ({
    unsubscribe: jest.fn()
  }))
}));

jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn(() => new ArrayBuffer(8))
}));

// Mock supabase with proper implementation
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(),
    storage: {
      from: jest.fn()
    }
  }
}));

describe('Sync Manager', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    
    // Setup default mock implementations
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test_user' } }
    });
    
    // Mock successful storage operations
    supabase.storage.from.mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      remove: jest.fn().mockResolvedValue({ error: null })
    });
  });

  test('1. enqueueMutation persists a mutation to AsyncStorage', async () => {
    const mutation = {
      type: 'CREATE_SCAN',
      scanId: 'test_scan_123',
      payload: { test: 'data' }
    };

    await enqueueMutation(mutation);
    const queue = JSON.parse(await AsyncStorage.getItem('rootcare_sync_queue'));
    
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('CREATE_SCAN');
    expect(queue[0].scanId).toBe('test_scan_123');
  });

  test('2. Enqueueing SET_SAVED(true) then SET_SAVED(false) collapses', async () => {
    const scanId = 'scan_456';
    
    await enqueueMutation({
      type: 'SET_SAVED',
      scanId,
      payload: { isSaved: true }
    });
    
    await enqueueMutation({
      type: 'SET_SAVED',
      scanId,
      payload: { isSaved: false }
    });

    const queue = JSON.parse(await AsyncStorage.getItem('rootcare_sync_queue'));
    expect(queue).toHaveLength(1);
    expect(queue[0].payload.isSaved).toBe(false);
  });

  test('3. DELETE_FOREVER removes other mutations for the same scanId', async () => {
    const scanId = 'scan_789';
    
    await enqueueMutation({
      type: 'SET_SAVED',
      scanId,
      payload: { isSaved: true }
    });
    
    await enqueueMutation({
      type: 'UPDATE_NOTES',
      scanId,
      payload: { notes: 'test note' }
    });
    
    await enqueueMutation({
      type: 'DELETE_FOREVER',
      scanId,
      payload: {}
    });

    const queue = JSON.parse(await AsyncStorage.getItem('rootcare_sync_queue'));
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('DELETE_FOREVER');
  });

    test('4. flushQueue() successfully empties queue', async () => {
    // Chainable + "thenable" builder, matching how the real Supabase
    // query builder behaves: .delete()/.update() return the builder
    // itself so .eq() can be chained after them, and awaiting the
    // builder at the end of any chain resolves it.
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { image_path: 'test/path.jpg' },
        error: null
      }),
      then: jest.fn((resolve) => resolve({ data: null, error: null }))
    };

    supabase.from.mockReturnValue(mockQueryBuilder);

    await enqueueMutation({
      type: 'DELETE_FOREVER',
      scanId: 'test_scan',
      payload: {}
    });

    const result = await flushQueue();
    expect(result.flushed).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.remaining).toBe(0);

    const queue = await AsyncStorage.getItem('rootcare_sync_queue');
    expect(JSON.parse(queue)).toHaveLength(0);
  });

  test('5. flushQueue() leaves mutation on network error', async () => {
    // Create a mock that simulates network error with specific message
    const networkError = new Error('Network request failed');
    // Make sure it has the right message format that flushQueue checks
    networkError.message = 'network error';
    
    // Mock the from method to return a query builder that fails
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockRejectedValue(networkError),
      delete: jest.fn().mockRejectedValue(networkError),
      update: jest.fn().mockRejectedValue(networkError)
    };
    
    supabase.from.mockReturnValue(mockQueryBuilder);

    // Add a mutation to the queue
    await enqueueMutation({
      type: 'DELETE_FOREVER',
      scanId: 'test_scan',
      payload: {}
    });

    const result = await flushQueue();
    expect(result.flushed).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.remaining).toBe(1);

    const queue = JSON.parse(await AsyncStorage.getItem('rootcare_sync_queue'));
    expect(queue).toHaveLength(1);
  });

  test('6. fetchAndCacheScans() overlays pending mutations', async () => {
    const userId = 'test_user';
    const scanId = 'scan_123';

    const mockScan = {
      id: scanId,
      user_id: userId,
      crop_type: 'cassava',
      is_archived: false,
      is_saved: false,
      is_deleted: false,
      plant_results: [{
        diagnosis_code: 'CBB',
        confidence: 0.95
      }]
    };

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    };
    
    // For fetchAndCacheScans, we need two eq calls
    // First eq for user_id, second eq for is_deleted
    mockQueryBuilder.eq.mockReturnValueOnce(mockQueryBuilder);
    mockQueryBuilder.eq.mockResolvedValueOnce({
      data: [mockScan],
      error: null
    });
    
    supabase.from.mockReturnValue(mockQueryBuilder);

    await enqueueMutation({
      type: 'SET_ARCHIVED',
      scanId,
      payload: { isArchived: true }
    });

    const result = await fetchAndCacheScans(userId);
    
    expect(result[0].is_archived).toBe(true);
    expect(result[0].is_saved).toBe(false);
    
    const cached = JSON.parse(await AsyncStorage.getItem('rootcare_scan_cache'));
    expect(cached[0].is_archived).toBe(true);
  });
});
