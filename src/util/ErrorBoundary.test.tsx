import { render } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <div>Child</div>
      </ErrorBoundary>,
    );
    expect(getByText('Child')).toBeInTheDocument();
  });

  it('renders fallback when error occurs', () => {
    const Problem = () => {
      throw new Error('fail');
    };

    const { getByText } = render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Problem />
      </ErrorBoundary>,
    );
    expect(getByText('Fallback')).toBeInTheDocument();
  });

  it('renders null when no children and no fallback provided', () => {
    const { container } = render(<ErrorBoundary />);
    expect(container).toBeEmptyDOMElement();
  });

  it('logs warning when fallback is not provided', () => {
    render(<ErrorBoundary />);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'ui.error_boundary.fallback_missing',
        message: 'ErrorBoundary fallback not set!',
      }),
    );
  });

  it('renders built-in verbose fallback and logs the error when fallback is omitted', () => {
    const Problem = () => {
      throw new Error('catastrophic failure');
    };

    const { getByRole, getByText } = render(
      <ErrorBoundary showDetails>
        <Problem />
      </ErrorBoundary>,
    );

    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByText('We could not load this app.')).toBeInTheDocument();
    expect(getByText('catastrophic failure')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'ui.error_boundary.caught',
      }),
    );
  });

  it('renders a function fallback and provides the error and id', () => {
    const Problem = () => {
      throw new Error('function fallback failure');
    };

    const fallback = jest.fn((error, errorId) => (
      <div>
        {error?.message} {errorId}
      </div>
    ));

    const { getByText } = render(
      <ErrorBoundary fallback={fallback}>
        <Problem />
      </ErrorBoundary>,
    );

    expect(fallback).toHaveBeenCalled();
    expect(getByText(/function fallback failure/)).toBeInTheDocument();
    expect(getByText(/err-/)).toBeInTheDocument();
  });
});
