import { renderHook } from "@testing-library/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useVideos from "./useVideos";

// Mock the entire @tanstack/react-query module
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    prefetchQuery: jest.fn(),
  })),
}));

// Mock youtube API
jest.mock("../api/youtube", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: {
        items: [
          {
            id: { kind: "youtube#video", videoId: "1" },
            snippet: {
              title: "Test Video",
              description: "Test Description",
              thumbnails: {
                default: { url: "test.jpg", width: 120, height: 90 },
                medium: { url: "test.jpg", width: 320, height: 180 },
                high: { url: "test.jpg", width: 480, height: 360 },
              },
            },
          },
        ],
      },
    }),
  ),
}));

// Mock session cache
jest.mock("../util/sessionCache", () => {
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

const sessionCache = require("../util/sessionCache");
const mockedUseQuery = useQuery as jest.Mock;
const mockedUseQueryClient = useQueryClient as jest.Mock;

describe("useVideos", () => {
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

  it("should return videos and search function", () => {
    const { result } = renderHook(() => useVideos("test"));

    expect(Array.isArray(result.current[0])).toBe(true);
    expect(typeof result.current[1]).toBe("function");
  });

  it("should handle search function call", async () => {
    // Setup mock data and functions
    const mockVideos = [
      {
        id: { kind: "youtube#video", videoId: "new" },
        snippet: {
          title: "New Video",
          description: "Test Description",
          thumbnails: {
            default: { url: "test.jpg", width: 120, height: 90 },
            medium: { url: "test.jpg", width: 320, height: 180 },
            high: { url: "test.jpg", width: 480, height: 360 },
          },
        },
      },
    ];

    // Mock the query client methods
    const mockRefetch = jest.fn().mockResolvedValue({ data: mockVideos });
    const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
    const mockPrefetchQuery = jest.fn().mockResolvedValue(undefined);

    // Setup useQuery mock to return data and refetch function
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      refetch: mockRefetch,
    }));

    // Setup useQueryClient mock
    mockedUseQueryClient.mockImplementation(() => ({
      invalidateQueries: mockInvalidateQueries,
      prefetchQuery: mockPrefetchQuery,
    }));

    const { result } = renderHook(() => useVideos("initial"));

    // Call search function
    await result.current[1]("new search");

    // Verify correct sequence of calls
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["videos"],
    });

    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ["videos", "new search"],
      queryFn: expect.any(Function),
    });

    expect(mockRefetch).toHaveBeenCalled();

    // Verify calls were made in correct order
    expect(mockInvalidateQueries.mock.invocationCallOrder[0]).toBeLessThan(
      mockPrefetchQuery.mock.invocationCallOrder[0],
    );

    expect(mockPrefetchQuery.mock.invocationCallOrder[0]).toBeLessThan(
      mockRefetch.mock.invocationCallOrder[0],
    );
  });

  it("should return cached data if available", () => {
    const cachedVideos = [
      {
        id: { kind: "youtube#video", videoId: "cached" },
        snippet: {
          title: "Cached Video",
          description: "Cached Description",
          thumbnails: {
            default: { url: "cached.jpg", width: 120, height: 90 },
            medium: { url: "cached.jpg", width: 320, height: 180 },
            high: { url: "cached.jpg", width: 480, height: 360 },
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

    const { result } = renderHook(() => useVideos("cached"));

    expect(result.current[0]).toEqual(cachedVideos);
  });

  it("should handle error states", () => {
    mockedUseQuery.mockImplementation(() => ({
      data: [],
      isLoading: false,
      error: new Error("API Error"),
      refetch: jest.fn(),
    }));

    const { result } = renderHook(() => useVideos("error"));

    expect(result.current[0]).toEqual([]);
  });
});
