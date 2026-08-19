import { Link } from "react-router";
import { Boxes, Car, Building2, Pencil, Wrench, Cog, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import HeroMockup from "../components/HeroMockup";
import FeatureCard from "../components/FeatureCard";
import StepItem from "../components/StepItem";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";

const features = [
  { icon: Boxes, title: "Categories", description: "Organize parts by type for quick access." },
  { icon: Car, title: "Vehicles", description: "Match parts to compatible vehicles." },
  { icon: Building2, title: "Suppliers", description: "Track vendor info in one place." },
  { icon: Pencil, title: "Full CRUD", description: "Create, read, update, delete everything." },
];

const steps = [
  { title: "Create your account", description: "Sign up in seconds and get started right away." },
  { title: "Add categories and suppliers", description: "Set up your inventory structure and vendor contacts." },
  { title: "Add items and link to vehicles", description: "Stock your inventory and track vehicle compatibility." },
  { title: "Track and manage everything", description: "View, update, and organize from one dashboard." },
];

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-to-b from-surface-container-low to-background md:min-h-[calc(100vh-5rem)]">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-tertiary/10 blur-3xl" aria-hidden="true" />

          {/* Floating icons */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Wrench size={20} className="absolute top-[15%] left-[8%] rotate-12 text-primary/15" />
            <Cog size={24} className="absolute top-[25%] right-[12%] -rotate-45 text-tertiary/15" />
            <Boxes size={18} className="absolute bottom-[30%] left-[15%] rotate-6 text-secondary/15" />
            <Car size={22} className="absolute bottom-[20%] right-[8%] -rotate-12 text-primary/15" />
            <Wrench size={16} className="absolute top-[60%] left-[5%] -rotate-30 text-tertiary/10" />
            <Cog size={20} className="absolute top-[10%] left-[45%] rotate-30 text-secondary/10" />
          </div>

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-5 pt-24 pb-16 md:grid-cols-2 md:gap-12 md:px-8 md:pt-32">
            <div>
              <h1 className="mb-6 max-w-2xl font-heading text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-6xl">
                <span className="block animate-slide-up" style={{ animationDelay: "0ms" }}>
                  Vehicle parts
                </span>
                <span className="block animate-slide-up" style={{ animationDelay: "100ms" }}>
                  inventory, managed.
                </span>
              </h1>
              <p
                className="mb-10 max-w-lg text-base leading-relaxed text-on-surface-variant md:text-lg animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                Track parts, suppliers, and vehicle compatibility in one place. No spreadsheets. No
                guesswork.
              </p>
              <div className="flex flex-wrap items-center gap-4 animate-scale-in" style={{ animationDelay: "500ms" }}>
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex rounded-full border border-outline px-8 py-3.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="w-full">
              <HeroMockup />
            </div>
          </div>

          {/* Scroll indicator */}
          <a
            href="#features"
            aria-label="Scroll to features"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronDown size={28} aria-hidden="true" />
          </a>
        </section>

        {/* Features */}
        <section id="features" className="bg-surface-container-low py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="mb-4 font-heading text-2xl font-bold text-on-surface md:text-3xl">
              Everything you need
            </h2>
            <p className="mb-12 max-w-md text-on-surface-variant">
              One place to organize, track, and manage your vehicle parts inventory.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="mb-4 font-heading text-2xl font-bold text-on-surface md:text-3xl">
              How it works
            </h2>
            <p className="mb-12 max-w-md text-on-surface-variant">
              Four steps from sign-up to full inventory control.
            </p>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <StepItem
                  key={step.title}
                  number={`0${i + 1}`}
                  {...step}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
