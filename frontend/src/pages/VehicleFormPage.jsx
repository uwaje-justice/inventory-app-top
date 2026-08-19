import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Car } from "lucide-react";
import { getVehicle, createVehicle, updateVehicle } from "../api/services";

const currentYear = new Date().getFullYear();

export default function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState({ make: "", model: "", year: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    getVehicle(id)
      .then((veh) => {
        if (cancelled) return;
        setValues({ make: veh.make || "", model: veh.model || "", year: veh.year?.toString() || "" });
      })
      .catch(() => { if (!cancelled) setApiError("Failed to load vehicle."); })
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
    if (!values.make.trim()) errs.make = "Make is required";
    if (!values.model.trim()) errs.model = "Model is required";
    if (!values.year) errs.year = "Year is required";
    else if (!Number.isInteger(Number(values.year)) || Number(values.year) < 1886 || Number(values.year) > currentYear) errs.year = `Year must be between 1886 and ${currentYear}`;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = { make: values.make.trim(), model: values.model.trim(), year: Number(values.year) };
      if (isEdit) { await updateVehicle(id, payload); }
      else { await createVehicle(payload); }
      navigate("/vehicles");
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
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Vehicles
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/40">
          <Car size={24} className="text-on-primary-container" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
          {isEdit ? "Edit Vehicle" : "New Vehicle"}
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
            <legend className="sr-only">{isEdit ? "Edit" : "Create"} vehicle form</legend>

            <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
              <label htmlFor="make" className="mb-1.5 block text-sm font-medium text-on-surface">
                Make <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="make" name="make" type="text" value={values.make} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.make}
                placeholder="e.g. Toyota, Ford, Honda"
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.make ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant"}`}
              />
              {errors.make && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.make}</p>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "60ms" }}>
              <label htmlFor="model" className="mb-1.5 block text-sm font-medium text-on-surface">
                Model <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="model" name="model" type="text" value={values.model} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.model}
                placeholder="e.g. Corolla, F-150, Civic"
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.model ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant"}`}
              />
              {errors.model && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.model}</p>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
              <label htmlFor="year" className="mb-1.5 block text-sm font-medium text-on-surface">
                Year <span className="ml-0.5 text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="year" name="year" type="number" min={1886} max={currentYear} value={values.year} onChange={handleChange}
                aria-required="true" aria-invalid={!!errors.year}
                placeholder={`e.g. ${currentYear}`}
                className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.year ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant"}`}
              />
              {errors.year && <p role="alert" className="mt-1.5 text-xs text-error animate-slide-up">{errors.year}</p>}
            </div>
          </fieldset>

          <div className="mt-8 flex gap-3 animate-slide-up" style={{ animationDelay: "180ms" }}>
            <Link to="/vehicles" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high">
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
              ) : isEdit ? "Save Changes" : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
