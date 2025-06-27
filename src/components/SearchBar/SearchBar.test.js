import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  test("renders input and label", () => {
    render(<SearchBar onFormSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/video search/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("updates input value when typed into", () => {
    render(<SearchBar onFormSubmit={jest.fn()} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "React" } });
    expect(input.value).toBe("React");
  });

  test("calls onFormSubmit with input value on submit", () => {
    const mockOnFormSubmit = jest.fn();
    render(<SearchBar onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Redux" } });
    fireEvent.submit(input.closest("form"));
    expect(mockOnFormSubmit).toHaveBeenCalledWith("Redux");
    expect(mockOnFormSubmit).toHaveBeenCalledTimes(1);
  });

  test("calls onFormSubmit with empty string if input is empty", () => {
    const mockOnFormSubmit = jest.fn();
    render(<SearchBar onFormSubmit={mockOnFormSubmit} />);
    fireEvent.submit(screen.getByRole("textbox").closest("form"));
    expect(mockOnFormSubmit).toHaveBeenCalledWith("");
  });
});
