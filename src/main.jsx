import React, { lazy, Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./util/ErrorBoundary.jsx";
const App = lazy(() => import("./components/App.jsx"));
const root = createRoot(document.querySelector("#root"));

root.render(
  <StrictMode>
    <ErrorBoundary fallback="An error has occurred">
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
