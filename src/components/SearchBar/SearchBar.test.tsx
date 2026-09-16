import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from './SearchBar.tsx';

describe('SearchBar', () => {
  test('renders input and label', () => {
    render(<SearchBar onFormSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/video search/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^search$/i }),
    ).toBeInTheDocument();
  });

  test('updates input value when typed into', () => {
    render(<SearchBar onFormSubmit={jest.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    expect(input.value).toBe('React');
  });

  test('calls onFormSubmit with input value on submit', () => {
    const mockOnFormSubmit = jest.fn();
    render(<SearchBar onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Redux' } });
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(mockOnFormSubmit).toHaveBeenCalledWith('Redux');
    expect(mockOnFormSubmit).toHaveBeenCalledTimes(1);
  });

  test('calls onFormSubmit with empty string if input is empty', () => {
    const mockOnFormSubmit = jest.fn();
    render(<SearchBar onFormSubmit={mockOnFormSubmit} />);
    fireEvent.submit(screen.getByRole('textbox').closest('form'));
    expect(mockOnFormSubmit).toHaveBeenCalledWith('');
  });
});
