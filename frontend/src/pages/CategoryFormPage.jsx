import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Boxes } from "lucide-react";
import { getCategory, createCategory, updateCategory } from "../api/services";

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getCategory(id)
      .then((cat) => {
        if (cancelled) return;
        setValues({ name: cat.name || "", description: cat.description || "" });
      })
      .catch(() => {
        if (!cancelled) setApiError("Failed to load category.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = "Name is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = { name: values.name.trim(), description: values.description.trim() || undefined };
      if (isEdit) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }
      navigate("/categories");
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-b-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Categories
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Boxes size={24} className="text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
          {isEdit ? "Edit Category" : "New Category"}
        </h1>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 sm:p-8">
        {apiError && (
          <div role="alert" className="mb-6 rounded-xl border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container animate-slide-up">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={submitting} className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">{isEdit ? "Edit" : "Create"} category form</legend>

            <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-on-surface">
                Name <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="name" name="name" type="text" value={values.name} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.name}
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant"}`}
                placeholder="e.g. Brakes, Engine, Electrical"
              />
              {errors.name && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.name}</p>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "60ms" }}>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-on-surface">
                Description
              </label>
              <textarea
                id="description" name="description" rows={3} value={values.description} onChange={handleChange}
                className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Optional description"
              />
            </div>
          </fieldset>

          <div className="mt-8 flex gap-3 animate-slide-up" style={{ animationDelay: "120ms" }}>
            <Link to="/categories" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high">
              Cancel
            </Link>
            <button
              type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-b-on-primary" />
                  Saving...
                </>
              ) : isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
