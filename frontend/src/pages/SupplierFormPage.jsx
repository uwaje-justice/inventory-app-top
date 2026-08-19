import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Truck } from "lucide-react";
import { getSupplier, createSupplier, updateSupplier } from "../api/services";

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. AutoZone, NAPA" },
  { name: "contactName", label: "Contact Name", type: "text", placeholder: "Optional contact person" },
  { name: "email", label: "Email", type: "email", placeholder: "supplier@example.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
];

export default function SupplierFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState({ name: "", contactName: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getSupplier(id)
      .then((sup) => {
        if (cancelled) return;
        setValues({ name: sup.name || "", contactName: sup.contactName || "", email: sup.email || "", phone: sup.phone || "" });
      })
      .catch(() => { if (!cancelled) setApiError("Failed to load supplier."); })
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
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Must be a valid email";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = { name: values.name.trim() };
      if (values.contactName.trim()) payload.contactName = values.contactName.trim();
      if (values.email.trim()) payload.email = values.email.trim();
      if (values.phone.trim()) payload.phone = values.phone.trim();

      if (isEdit) { await updateSupplier(id, payload); }
      else { await createSupplier(payload); }
      navigate("/suppliers");
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
      <Link to="/suppliers" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Suppliers
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
          <Truck size={24} className="text-secondary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
          {isEdit ? "Edit Supplier" : "New Supplier"}
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
            <legend className="sr-only">{isEdit ? "Edit" : "Create"} supplier form</legend>
            {FIELDS.map((field, i) => (
              <div key={field.name} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-on-surface">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
                </label>
                <input
                  id={field.name} name={field.name} type={field.type} value={values[field.name]} onChange={handleChange}
                  aria-required={field.required} aria-invalid={!!errors[field.name]}
                  placeholder={field.placeholder}
                  className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors[field.name] ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant"}`}
                />
                {errors[field.name] && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors[field.name]}</p>}
              </div>
            ))}
          </fieldset>

          <div className="mt-8 flex gap-3 animate-slide-up" style={{ animationDelay: "240ms" }}>
            <Link to="/suppliers" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high">
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
              ) : isEdit ? "Save Changes" : "Create Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
