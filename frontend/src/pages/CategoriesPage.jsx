import { Link } from "react-router";
import { Plus, Boxes, ArrowRight } from "lucide-react";
import { getCategories } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function CategoriesPage() {
  const { data: categories, loading, error, refetch } = useFetch(() => getCategories());

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Organize your inventory by grouping related parts together.</p>
        </div>
        <Link to="/categories/new" className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Add Category
        </Link>
      </div>

      {categories?.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Boxes size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No categories yet. Create your first category to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="group rounded-2xl border border-outline-variant bg-surface-container p-5 transition-shadow hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Boxes size={20} className="text-primary" aria-hidden="true" />
                </div>
                <ArrowRight size={16} className="text-on-surface-variant/40 transition-transform group-hover:translate-x-0.5 group-hover:text-on-surface-variant" aria-hidden="true" />
              </div>
              <h2 className="mt-3 font-heading text-lg font-semibold text-on-surface">{cat.name}</h2>
              {cat.description && (
                <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">{cat.description}</p>
              )}
              <p className="mt-3 font-data text-sm text-on-surface-variant">
                {cat._count?.items ?? 0} items
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
