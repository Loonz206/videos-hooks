import { lazy, Suspense, StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './util/ErrorBoundary.tsx';
const App = lazy(() => import('./components/App.tsx'));
const root = createRoot(document.querySelector('#root')!);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

root.render(
  <StrictMode>
    <ErrorBoundary fallback="An error has occurred">
      <Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
