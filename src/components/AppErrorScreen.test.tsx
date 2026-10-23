import { fireEvent, render, screen } from '@testing-library/react';
import AppErrorScreen from './AppErrorScreen';

describe('AppErrorScreen', () => {
  it('renders a friendly message and calls the provided retry callback', () => {
    const onRetry = jest.fn();

    render(
      <AppErrorScreen
        error={new Error('Could not fetch videos')}
        errorId="err-123"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('We could not load this app.')).toBeInTheDocument();
    expect(screen.getByText('Reference ID: err-123')).toBeInTheDocument();
    expect(screen.getByText('Could not fetch videos')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses the built-in reload fallback when no retry callback is provided', () => {
    render(<AppErrorScreen error={null} errorId={undefined} />);

    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Reference ID:')).not.toBeInTheDocument();
  });
});
