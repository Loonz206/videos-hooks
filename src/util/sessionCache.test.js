import { getSessionCache, setDataToCache } from "./sessionCache";

// Mock store for isolation
jest.mock("store", () => {
  let storeData = {};
  return {
    get: jest.fn((key) => storeData[key]),
    set: jest.fn((key, value) => {
      storeData[key] = value;
    }),
    clear: () => {
      storeData = {};
    },
  };
});

const store = require("store");

describe("sessionCache", () => {
  beforeEach(() => {
    store.clear();
    window.localStorage.clear();
  });

  test("set and get cache for an id", () => {
    setDataToCache("foo", [1, 2, 3]);
    const cache = getSessionCache();
    expect(cache.data.foo.value).toEqual([1, 2, 3]);
    expect(cache.data.foo.id).toBe("foo");
  });

  test("returns empty cache if nothing set", () => {
    const cache = getSessionCache();
    expect(cache.data).toEqual({});
  });

  test("overwrites existing cache for same id", () => {
    setDataToCache("foo", [1, 2, 3]);
    setDataToCache("foo", [4, 5, 6]);
    const cache = getSessionCache();
    expect(cache.data.foo.value).toEqual([4, 5, 6]);
  });

  test("handles corrupted store data gracefully", () => {
    store.get.mockReturnValueOnce("not-json");
    expect(() => getSessionCache()).not.toThrow();
    // Should return default structure
    expect(getSessionCache().data).toBeDefined();
  });

  test("sets multiple ids and retrieves them", () => {
    setDataToCache("foo", [1]);
    setDataToCache("bar", [2]);
    const cache = getSessionCache();
    expect(cache.data.foo.value).toEqual([1]);
    expect(cache.data.bar.value).toEqual([2]);
  });

  test("cache item has expiry in the future", () => {
    setDataToCache("foo", [1]);
    const cache = getSessionCache();
    expect(cache.data.foo.expiry).toBeGreaterThan(Date.now());
  });

  test("cleanUpStorage removes expired items", () => {
    // Simulate an expired item
    const now = Date.now();
    const expired = { id: "expired", expiry: now - 1000, value: [0] };
    const valid = { id: "valid", expiry: now + 100000, value: [1] };
    const data = { expired, valid };
    // Import cleanUpStorage directly for test
    const { cleanUpStorage } = require("./sessionCache");
    cleanUpStorage(data);
    expect(data.expired).toBeUndefined();
    expect(data.valid).toBeDefined();
  });

  test("cleanUpStorage removes oldest if no expired", () => {
    const now = Date.now();
    const a = { id: "a", expiry: now + 1000, value: [1] };
    const b = { id: "b", expiry: now + 2000, value: [2] };
    const data = { a, b };
    const { cleanUpStorage } = require("./sessionCache");
    cleanUpStorage(data);
    // Only one should remain
    expect(Object.keys(data).length).toBe(1);
  });
});
