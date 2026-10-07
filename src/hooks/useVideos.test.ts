import { act, renderHook, waitFor } from '@testing-library/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useVideos from './useVideos';

// Mock the entire @tanstack/react-query module
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    prefetchQuery: jest.fn(),
  })),
}));

// Mock youtube API
jest.mock('../api/youtube', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: {
        items: [
          {
            id: { kind: 'youtube#video', videoId: '1' },
            snippet: {
              title: 'Test Video',
              description: 'Test Description',
              thumbnails: {
                default: { url: 'test.jpg', width: 120, height: 90 },
                medium: { url: 'test.jpg', width: 320, height: 180 },
                high: { url: 'test.jpg', width: 480, height: 360 },
              },
            },
          },
        ],
      },
    }),
  ),
}));

// Mock session cache
jest.mock('../util/sessionCache', () => {
  let cache: { [key: string]: any } = {};
  return {
    getSessionCache: jest.fn(() => ({ data: cache })),
    setDataToCache: jest.fn((key, value) => {
      cache[key] = { value };
    }),
    __clearCache: () => {
      cache = {};
    },
  };
});

const sessionCache = require('../util/sessionCache');
const youtube = require('../api/youtube');
const mockedUseQuery = useQuery as jest.Mock;
const mockedUseQueryClient = useQueryClient as jest.Mock;

describe('useVideos', () => {
  beforeEach(() => {
    sessionCache.__clearCache();
    jest.clearAllMocks();

    // Setup default useQuery mock implementation
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }));
  });

  it('should return videos and search function', () => {
    const { result } = renderHook(() => useVideos('test'));

    expect(Array.isArray(result.current[0])).toBe(true);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should handle search function call', async () => {
    const mockPrefetchQuery = jest.fn().mockResolvedValue(undefined);

    mockedUseQuery.mockImplementation(() => ({
      data: [],
    }));

    mockedUseQueryClient.mockImplementation(() => ({
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('initial'));

    // Call search function
    await act(async () => {
      await result.current[1]('new search');
    });

    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ['videos', 'new search'],
      queryFn: expect.any(Function),
    });
  });

  it('should return cached data if available', () => {
    const cachedVideos = [
      {
        id: { kind: 'youtube#video', videoId: 'cached' },
        snippet: {
          title: 'Cached Video',
          description: 'Cached Description',
          thumbnails: {
            default: { url: 'cached.jpg', width: 120, height: 90 },
            medium: { url: 'cached.jpg', width: 320, height: 180 },
            high: { url: 'cached.jpg', width: 480, height: 360 },
          },
        },
      },
    ];

    mockedUseQuery.mockImplementation(() => ({
      data: cachedVideos,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }));

    const { result } = renderHook(() => useVideos('cached'));

    expect(result.current[0]).toEqual(cachedVideos);
  });

  it('should handle error states', () => {
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: new Error('API Error'),
      refetch: jest.fn(),
    }));

    const { result } = renderHook(() => useVideos('error'));

    expect(result.current[0]).toEqual([]);
  });

  it('should ignore empty search terms', async () => {
    const mockPrefetchQuery = jest.fn();

    mockedUseQueryClient.mockImplementation(() => ({
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('initial'));

    await expect(result.current[1]('')).resolves.toBeUndefined();
    expect(mockPrefetchQuery).not.toHaveBeenCalled();
    expect(youtube.get).not.toHaveBeenCalled();
  });

  it('should call youtube API when data is not cached', async () => {
    youtube.get.mockClear();

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        await queryFn();
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('initial'));

    await act(async () => {
      await result.current[1]('new term');
    });

    await waitFor(() => {
      expect(youtube.get).toHaveBeenCalledWith('/search', {
        params: { q: 'new term' },
      });
    });
  });

  it('should cache data after API call', async () => {
    const mockSetDataToCache = sessionCache.setDataToCache;

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        await queryFn();
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('initial'));

    await act(async () => {
      await result.current[1]('cache test');
    });

    await waitFor(() => {
      expect(mockSetDataToCache).toHaveBeenCalled();
    });
  });

  it('should handle API error response with non-200 status', async () => {
    youtube.get.mockResolvedValueOnce({
      status: 500,
      data: { items: [] },
    });

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        try {
          await queryFn();
        } catch (err) {
          console.error(err);
          throw err;
        }
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('error test'));

    await expect(result.current[1]('error test')).rejects.toThrow(
      'API Error: 500',
    );
  });

  it('should handle cache with non-array value', async () => {
    sessionCache.setDataToCache('invalid', { value: 'not an array' });

    youtube.get.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [
          {
            id: { kind: 'youtube#video', videoId: 'fallback' },
            snippet: {
              title: 'Fallback Video',
              description: 'Fallback Description',
              thumbnails: {
                default: { url: 'fallback.jpg', width: 120, height: 90 },
                medium: { url: 'fallback.jpg', width: 320, height: 180 },
                high: { url: 'fallback.jpg', width: 480, height: 360 },
              },
            },
          },
        ],
      },
    });

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        await queryFn();
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('invalid'));

    await act(async () => {
      await result.current[1]('invalid');
    });

    await waitFor(() => {
      expect(youtube.get).toHaveBeenCalledWith('/search', {
        params: { q: 'invalid' },
      });
    });
  });

  it('should use default data as empty array when useQuery returns undefined', () => {
    mockedUseQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }));

    const { result } = renderHook(() => useVideos('test'));

    expect(result.current[0]).toEqual([]);
  });

  it('should pass correct query configuration to useQuery', () => {
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    }));

    renderHook(() => useVideos('config test'));

    expect(mockedUseQuery).toHaveBeenCalledWith({
      queryKey: ['videos', 'config test'],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  });

  it('should handle empty cache data object', async () => {
    sessionCache.getSessionCache.mockReturnValueOnce({ data: {} });

    youtube.get.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [
          {
            id: { kind: 'youtube#video', videoId: 'new' },
            snippet: {
              title: 'New Video',
              description: 'Test Description',
              thumbnails: {
                default: { url: 'test.jpg', width: 120, height: 90 },
                medium: { url: 'test.jpg', width: 320, height: 180 },
                high: { url: 'test.jpg', width: 480, height: 360 },
              },
            },
          },
        ],
      },
    });

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        await queryFn();
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('empty cache'));

    await act(async () => {
      await result.current[1]('empty cache');
    });

    await waitFor(() => {
      expect(youtube.get).toHaveBeenCalled();
    });
  });

  it('should handle null cache', async () => {
    sessionCache.getSessionCache.mockReturnValueOnce(null);

    youtube.get.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [
          {
            id: { kind: 'youtube#video', videoId: 'null cache' },
            snippet: {
              title: 'Null Cache Video',
              description: 'Test Description',
              thumbnails: {
                default: { url: 'test.jpg', width: 120, height: 90 },
                medium: { url: 'test.jpg', width: 320, height: 180 },
                high: { url: 'test.jpg', width: 480, height: 360 },
              },
            },
          },
        ],
      },
    });

    const mockRefetch = jest.fn().mockImplementation(async () => {
      return { data: [] };
    });

    mockedUseQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };
    });

    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest
      .fn()
      .mockImplementation(async ({ queryFn }) => {
        await queryFn();
      });

    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos('null test'));

    await act(async () => {
      await result.current[1]('null test');
    });

    await waitFor(() => {
      expect(youtube.get).toHaveBeenCalled();
    });
  });
});
