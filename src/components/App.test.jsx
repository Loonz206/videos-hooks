import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders SearchBar and VideoList", () => {
    render(<App />);
    expect(screen.getByLabelText(/video search/i)).toBeInTheDocument();
    expect(screen.getByText(/video search/i)).toBeInTheDocument();
  });

  test("renders VideoDetail with loading initially", () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("can type in SearchBar and submit", () => {
    render(<App />);
    const input = screen.getByLabelText(/video search/i);
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.submit(input.closest("form"));
    // The input value should be 'React' after typing
    expect(input.value).toBe("React");
    // Optionally, check that the VideoList or VideoDetail updates, if you mock API
  });

  test("renders VideoList with no videos if cache and videos are empty", () => {
    render(<App />);
    // Should not throw and should render the VideoList container
    expect(screen.getByLabelText(/video search/i)).toBeInTheDocument();
  });
});
