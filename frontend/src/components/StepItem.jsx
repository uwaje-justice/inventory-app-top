import { useInView } from "../hooks/useInView";

export default function StepItem({ number, title, description, delay = 0 }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`flex gap-5 ${isInView ? "animate-slide-up" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-data text-3xl font-bold text-primary md:text-4xl">
        {number}
      </span>
      <div>
        <h3 className="mb-1 font-heading text-lg font-bold text-on-surface">{title}</h3>
        <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
