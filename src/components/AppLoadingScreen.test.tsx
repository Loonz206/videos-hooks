import { render, screen } from '@testing-library/react';
import AppLoadingScreen from './AppLoadingScreen';

describe('AppLoadingScreen', () => {
  it('renders the boot loading state with accessibility hints', () => {
    render(<AppLoadingScreen />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading videos…')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We are setting up the app and fetching the latest content.',
      ),
    ).toBeInTheDocument();
  });
});
