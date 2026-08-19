import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Package } from "lucide-react";
import { getItem, createItem, updateItem, getCategories, getSuppliers } from "../api/services";

export default function ItemFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState({ name: "", description: "", price: "", quantity: "", categoryId: "", supplierId: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCategories(), getSuppliers()])
      .then(([cats, sups]) => {
        if (!cancelled) { setCategories(cats); setSuppliers(sups); }
      })
      .catch(() => { if (!cancelled) setApiError("Failed to load categories/suppliers."); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getItem(id)
      .then((item) => {
        if (cancelled) return;
        setValues({
          name: item.name || "",
          description: item.description || "",
          price: item.price?.toString() || "",
          quantity: item.quantity?.toString() || "",
          categoryId: item.categoryId || "",
          supplierId: item.supplierId || "",
        });
      })
      .catch(() => { if (!cancelled) setApiError("Failed to load item."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; }); }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = "Name is required";
    if (!values.price) errs.price = "Price is required";
    else if (isNaN(Number(values.price)) || Number(values.price) < 0) errs.price = "Price must be a positive number";
    if (values.quantity && (isNaN(Number(values.quantity)) || Number(values.quantity) < 0 || !Number.isInteger(Number(values.quantity)))) errs.quantity = "Quantity must be a non-negative integer";
    if (!values.categoryId) errs.categoryId = "Category is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: values.name.trim(),
        price: Number(values.price),
        categoryId: values.categoryId,
      };
      if (values.description.trim()) payload.description = values.description.trim();
      if (values.quantity) payload.quantity = Number(values.quantity);
      if (values.supplierId) payload.supplierId = values.supplierId;

      if (isEdit) { await updateItem(id, payload); }
      else { await createItem(payload); }
      navigate("/items");
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
      <Link to="/items" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Items
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/10">
          <Package size={24} className="text-tertiary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
          {isEdit ? "Edit Item" : "New Item"}
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
            <legend className="sr-only">{isEdit ? "Edit" : "Create"} item form</legend>

            <div className="animate-slide-up">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-on-surface">
                Name <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <input id="name" name="name" type="text" value={values.name} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.name}
                placeholder="e.g. Brake Pads (Front)"
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-error" : "border-outline-variant"}`}
              />
              {errors.name && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.name}</p>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "60ms" }}>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-on-surface">Description</label>
              <textarea id="description" name="description" rows={3} value={values.description} onChange={handleChange}
                placeholder="Optional description"
                className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "120ms" }}>
              <div>
                <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-on-surface">
                  Price <span className="ml-0.5 text-error" aria-hidden="true">*</span>
                </label>
                <input id="price" name="price" type="number" step="0.01" min="0" value={values.price} onChange={handleChange}
                  aria-required="true" aria-invalid={!!errors.price}
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.price ? "border-error" : "border-outline-variant"}`}
                />
                {errors.price && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-on-surface">Quantity</label>
                <input id="quantity" name="quantity" type="number" min="0" step="1" value={values.quantity} onChange={handleChange}
                  aria-invalid={!!errors.quantity}
                  placeholder="0"
                  className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.quantity ? "border-error" : "border-outline-variant"}`}
                />
                {errors.quantity && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.quantity}</p>}
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "180ms" }}>
              <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-on-surface">
                Category <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <select id="categoryId" name="categoryId" value={values.categoryId} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.categoryId}
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.categoryId ? "border-error" : "border-outline-variant"}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.categoryId}</p>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "240ms" }}>
              <label htmlFor="supplierId" className="mb-1.5 block text-sm font-medium text-on-surface">Supplier</label>
              <select id="supplierId" name="supplierId" value={values.supplierId} onChange={handleChange}
                className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>
          </fieldset>

          <div className="mt-8 flex gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link to="/items" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high">
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
              ) : isEdit ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
