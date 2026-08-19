import { useRef, useState, useEffect, useCallback } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const optionsRef = useRef(options);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    optionsRef.current = options;
  }, [options.threshold, options.rootMargin]);

  const setupObserver = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...optionsRef.current },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = setupObserver();
    return cleanup;
  }, [setupObserver]);

  return { ref, isInView };
}
