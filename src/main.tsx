import { lazy, Suspense, StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import AppLoadingScreen from './components/AppLoadingScreen.tsx';
import ErrorBoundary from './util/ErrorBoundary.tsx';
const App = lazy(() => import('./components/App.tsx'));
const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Unable to mount app: missing #root element');
}

const root = createRoot(rootElement);

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
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <Suspense fallback={<AppLoadingScreen />}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
