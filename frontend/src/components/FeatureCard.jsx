import { useInView } from "../hooks/useInView";

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-outline-variant bg-surface-container p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-shadow/5 focus-within:-translate-y-1 ${isInView ? "animate-slide-up" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container transition-colors group-hover:bg-primary group-hover:text-on-primary">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold text-on-surface">{title}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  );
}
