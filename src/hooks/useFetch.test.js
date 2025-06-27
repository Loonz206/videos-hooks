import { renderHook } from "@testing-library/react-hooks";
import useFetch from "./useFetch";

global.fetch = jest.fn();

describe("useFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns error if url is missing", async () => {
    const { result } = renderHook(() => useFetch(null));
    expect(result.current.error).toMatch(/missing url/i);
  });

  test("returns loading then data", async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => [1, 2, 3],
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-url")
    );
    expect(result.current.status).toBe("fetching");
    await waitForNextUpdate();
    expect(result.current.data).toEqual([1, 2, 3]);
    expect(result.current.status).toBe("fetched");
  });

  test("returns error on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("fail"));
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/fail-url")
    );
    await waitForNextUpdate();
    expect(result.current.error).toMatch(/error occurred/i);
    expect(result.current.status).toBe("Errored");
  });

  test("returns error on non-200 status", async () => {
    fetch.mockResolvedValueOnce({ status: 404 });
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/bad-url")
    );
    await waitForNextUpdate();
    expect(result.current.error).toMatch(/error occurred/i);
  });
});
