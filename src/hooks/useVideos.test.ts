import { act, renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import youtube from '../api/youtube';
import { getSessionCache, setDataToCache } from '../util/sessionCache';
import useVideos from './useVideos';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../api/youtube', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../util/sessionCache', () => ({
  getSessionCache: jest.fn(() => ({ data: {} })),
  setDataToCache: jest.fn(),
}));

const mockedUseQuery = useQuery as jest.Mock;
const mockedYoutubeGet = youtube.get as jest.Mock;
const mockedGetSessionCache = getSessionCache as jest.Mock;
const mockedSetDataToCache = setDataToCache as jest.Mock;

const createVideo = (videoId: string, title = 'Test Video') => ({
  id: { kind: 'youtube#video', videoId },
  snippet: {
    title,
    description: `${title} description`,
    thumbnails: {
      default: { url: `${videoId}-default.jpg`, width: 120, height: 90 },
      medium: { url: `${videoId}-medium.jpg`, width: 320, height: 180 },
      high: { url: `${videoId}-high.jpg`, width: 480, height: 360 },
    },
  },
});

describe('useVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetSessionCache.mockReturnValue({ data: {} });
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: null,
    }));
  });

  it('returns videos and a search function', () => {
    const { result } = renderHook(() => useVideos('test'));

    expect(Array.isArray(result.current[0])).toBe(true);
    expect(typeof result.current[1]).toBe('function');
  });

  it('updates the active query key when search is called', async () => {
    mockedUseQuery.mockImplementation(({ queryKey }) => ({
      data: queryKey[1] === 'react hooks' ? [createVideo('react-1')] : [],
      isLoading: false,
      error: null,
    }));

    const { result } = renderHook(() => useVideos('initial'));

    await act(async () => {
      await result.current[1]('react hooks');
    });

    expect(mockedUseQuery).toHaveBeenLastCalledWith({
      queryKey: ['videos', 'react hooks'],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  });

  it('ignores empty search terms', async () => {
    const { result } = renderHook(() => useVideos('initial'));

    await act(async () => {
      await result.current[1]('   ');
    });

    expect(mockedUseQuery).toHaveBeenCalledTimes(1);
  });

  it('returns cached data when useQuery provides it', () => {
    const cachedVideos = [createVideo('cached-1', 'Cached Video')];

    mockedUseQuery.mockImplementation(() => ({
      data: cachedVideos,
      isLoading: false,
      error: null,
    }));

    const { result } = renderHook(() => useVideos('cached'));

    expect(result.current[0]).toEqual(cachedVideos);
  });

  it('returns an empty array for error states', () => {
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: new Error('API Error'),
    }));

    const { result } = renderHook(() => useVideos('error'));

    expect(result.current[0]).toEqual([]);
  });

  it('uses cached queryFn data before calling the API', async () => {
    const cachedVideos = [createVideo('cached-1', 'Cached Video')];

    mockedGetSessionCache.mockReturnValue({
      data: {
        cached: {
          value: cachedVideos,
        },
      },
    });

    renderHook(() => useVideos('cached'));

    const queryFn = mockedUseQuery.mock.calls[0][0].queryFn;

    await expect(queryFn()).resolves.toEqual(cachedVideos);
    expect(mockedYoutubeGet).not.toHaveBeenCalled();
  });

  it('calls the API and caches queryFn results when data is not cached', async () => {
    const apiVideos = [createVideo('fresh-1', 'Fresh Video')];

    mockedYoutubeGet.mockResolvedValueOnce({
      status: 200,
      data: { items: apiVideos },
    });

    renderHook(() => useVideos('fresh term'));

    const queryFn = mockedUseQuery.mock.calls[0][0].queryFn;

    await expect(queryFn()).resolves.toEqual(apiVideos);
    expect(mockedYoutubeGet).toHaveBeenCalledWith('/search', {
      params: { q: 'fresh term' },
    });
    expect(mockedSetDataToCache).toHaveBeenCalledWith('fresh term', apiVideos);
  });

  it('throws for non-200 API responses in queryFn', async () => {
    mockedYoutubeGet.mockResolvedValueOnce({
      status: 500,
      data: { items: [] },
    });

    renderHook(() => useVideos('error term'));

    const queryFn = mockedUseQuery.mock.calls[0][0].queryFn;

    await expect(queryFn()).rejects.toThrow('API Error: 500');
  });

  it('uses an empty array when useQuery returns undefined data', () => {
    mockedUseQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
    }));

    const { result } = renderHook(() => useVideos('test'));

    expect(result.current[0]).toEqual([]);
  });

  it('passes the initial query configuration to useQuery', () => {
    renderHook(() => useVideos('config test'));

    expect(mockedUseQuery).toHaveBeenCalledWith({
      queryKey: ['videos', 'config test'],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  });
});
