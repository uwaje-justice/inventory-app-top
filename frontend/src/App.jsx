import { createBrowserRouter, RouterProvider } from "react-router";
import { Suspense } from "react";
import routes from "./routes";
import LoadingSpinner from "./components/LoadingSpinner";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
