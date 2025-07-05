import React, { lazy, Suspense, StrictMode } from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "./util/ErrorBoundary";
const App = lazy(() => import("./components/App"));
ReactDOM.render(
  <StrictMode>
    <ErrorBoundary fallback={"An error has occurred"}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
  document.querySelector("#root")
);
