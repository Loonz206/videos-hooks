import { renderHook, waitFor, act } from "@testing-library/react";
import useVideos from "./useVideos";

jest.mock("../api/youtube", () => ({
  get: jest.fn(() =>
    Promise.resolve({ status: 200, data: { items: [{ id: 1 }] } }),
  ),
}));

jest.mock("../util/sessionCache", () => {
  let cache = {};
  return {
    getSessionCache: jest.fn(() => ({ data: cache })),
    setDataToCache: jest.fn((key, value) => {
      cache[key] = { value };
    }),
    __setCache: (newCache) => {
      cache = newCache;
    },
    __clearCache: () => {
      cache = {};
    },
  };
});

const youtube = require("../api/youtube").default || require("../api/youtube");
const sessionCache = require("../util/sessionCache");

describe("useVideos", () => {
  afterEach(() => {
    jest.clearAllMocks();
    sessionCache.__clearCache();
  });

  test("returns videos and search function", async () => {
    const { result } = renderHook(() => useVideos("test"));
    expect(Array.isArray(result.current[0])).toBe(true);
    expect(typeof result.current[1]).toBe("function");
  });

  test("handles empty results", async () => {
    youtube.get.mockResolvedValueOnce({ status: 200, data: { items: [] } });
    const { result } = renderHook(() => useVideos("empty"));
    expect(result.current[0]).toEqual([]);
  });

  test("handles error response", async () => {
    youtube.get.mockRejectedValueOnce(new Error("fail"));
    const { result } = renderHook(() => useVideos("fail"));
    await waitFor(() => Array.isArray(result.current[0]));
    expect(Array.isArray(result.current[0])).toBe(true);
  });

  test("does not call search if term is empty", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useVideos(""));
    expect(result.current[0]).toEqual([]);
    expect(spy).toHaveBeenCalledWith("An error occurred: no term was passed");
    spy.mockRestore();
  });

  test("search function updates videos", async () => {
    const { result } = renderHook(() => useVideos("init"));
    youtube.get.mockResolvedValueOnce({
      status: 200,
      data: { items: [{ id: 2 }] },
    });
    await act(async () => {
      await result.current[1]("new search");
    });
    expect(result.current[0]).toEqual([{ id: 2 }]);
  });

  test("uses cache if available for defaultSearchTerm", async () => {
    sessionCache.__setCache({
      cached: { value: [{ id: "cached" }] },
    });
    const { result } = renderHook(() => useVideos("cached"));
    expect(result.current[0]).toEqual([{ id: "cached" }]);
    expect(youtube.get).not.toHaveBeenCalled();
  });
});
