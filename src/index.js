import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import ErrorBoundry from "./components/ErrorBoundry";
const App = lazy(() => import("./components/App"));
ReactDOM.render(
  <ErrorBoundry fallback={"An error has occurred"}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </ErrorBoundry>,
  document.querySelector("#root")
);
