import { createBrowserRouter, RouterProvider } from "react-router";
import { Suspense } from "react";
import routes from "./routes";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
