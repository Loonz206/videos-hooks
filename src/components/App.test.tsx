import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App.tsx';

jest.mock('../api/youtube', () => ({
  get: jest.fn(),
}));

jest.mock('../util/sessionCache', () => ({
  getSessionCache: jest.fn(() => ({ data: {} })),
  setDataToCache: jest.fn(),
}));

const youtube = require('../api/youtube');

const createVideo = (videoId: string, title: string) => ({
  id: { kind: 'youtube#video', videoId },
  snippet: {
    title,
    description: `${title} description`,
    thumbnails: {
      default: { url: `${videoId}-default.jpg`, width: 120, height: 90 },
      medium: { url: `${videoId}-medium.jpg`, width: 320, height: 180 },
      high: { url: `${videoId}-high.jpg`, width: 480, height: 360 },
    },
  },
});

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

describe('App search flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    youtube.get.mockImplementation(
      async (_path: string, { params }: { params: { q: string } }) => ({
        status: 200,
        data: {
          items:
            {
              'bacon cheeseburgers': [
                createVideo('bacon-1', 'Bacon Cheeseburgers Result'),
              ],
              'react hooks': [createVideo('react-1', 'React Hooks Result')],
              'mobile ui': [createVideo('mobile-1', 'Mobile UI Result')],
            }[params.q] ?? [],
        },
      }),
    );
  });

  test('updates the rendered results when the search button is clicked', async () => {
    renderApp();

    await screen.findAllByText('Bacon Cheeseburgers Result');

    const input = screen.getByRole('textbox', { name: /video search/i });
    fireEvent.change(input, { target: { value: 'react hooks' } });
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getAllByText('React Hooks Result').length).toBeGreaterThan(
        0,
      );
      expect(screen.getByTitle('video player')).toHaveAttribute(
        'src',
        expect.stringContaining('react-1'),
      );
    });

    expect(
      screen.queryByText('Bacon Cheeseburgers Result'),
    ).not.toBeInTheDocument();
  });

  test('updates the rendered results when the form is submitted directly', async () => {
    renderApp();

    await screen.findAllByText('Bacon Cheeseburgers Result');

    const input = screen.getByRole('textbox', { name: /video search/i });
    fireEvent.change(input, { target: { value: 'mobile ui' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getAllByText('Mobile UI Result').length).toBeGreaterThan(0);
      expect(screen.getByTitle('video player')).toHaveAttribute(
        'src',
        expect.stringContaining('mobile-1'),
      );
    });

    expect(
      screen.queryByText('Bacon Cheeseburgers Result'),
    ).not.toBeInTheDocument();
  });
});
