import React from "react";
import { render } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary.jsx";

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <div>Child</div>
      </ErrorBoundary>,
    );
    expect(getByText("Child")).toBeInTheDocument();
  });

  it("renders fallback on error", () => {
    const Problem = () => {
      throw new Error("fail");
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Problem />
      </ErrorBoundary>,
    );
    expect(getByText("Fallback")).toBeInTheDocument();
    console.error.mockRestore();
  });

  it("renders null if no children and no fallback", () => {
    const { container } = render(<ErrorBoundary />);
    expect(container).toBeEmptyDOMElement();
  });
});
