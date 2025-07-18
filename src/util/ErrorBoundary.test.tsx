import { render } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup console.error spy before each test
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Cleanup after each test
    consoleSpy.mockRestore();
  });

  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <div>Child</div>
      </ErrorBoundary>,
    );
    expect(getByText("Child")).toBeInTheDocument();
  });

  it("renders fallback when error occurs", () => {
    const Problem = () => {
      throw new Error("fail");
    };

    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Problem />
      </ErrorBoundary>,
    );
    expect(getByText("Fallback")).toBeInTheDocument();
  });

  it("renders null when no children and no fallback provided", () => {
    const { container } = render(<ErrorBoundary />);
    expect(container).toBeEmptyDOMElement();
  });

  it("logs warning when fallback is not provided", () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    render(<ErrorBoundary />);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "ErrorBoundary fallback not set!",
    );
    consoleWarnSpy.mockRestore();
  });
});
