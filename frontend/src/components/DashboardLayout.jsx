import { Outlet } from "react-router";
import DashboardNav from "./DashboardNav";
import Footer from "./Footer";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex flex-1 flex-col bg-gradient-to-b from-surface-container-low to-background px-5 pt-24 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
