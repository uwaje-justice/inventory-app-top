import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { login as loginApi } from "../api/services";
import { setToken } from "../utils/auth";
import BackLink from "../components/BackLink";
import ThemeToggle from "../components/ThemeToggle";
import FormInput from "../components/FormInput";
import ErrorAlert from "../components/ErrorAlert";
import Footer from "../components/Footer";

const FIELDS = [
  { name: "email", label: "Email", type: "email", autoComplete: "email", icon: Mail },
  { name: "password", label: "Password", type: "password", autoComplete: "current-password", icon: Lock },
];

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Must be a valid email";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = document.querySelector(
        `[name="${Object.keys(validationErrors)[0]}"]`,
      );
      firstErrorField?.focus();
      return;
    }

    setLoading(true);
    try {
      const result = await loginApi(values.email.trim(), values.password);
      setToken(result.token);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-surface-container-low to-background px-5 py-16 md:px-8">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-tertiary/10 blur-3xl" aria-hidden="true" />

        <div className="relative w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <BackLink />
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Sign in to manage your inventory.
                </p>
              </div>
              <ThemeToggle />
            </div>

            {apiError && <ErrorAlert message={apiError} />}

            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={loading} className="space-y-5 border-none p-0 m-0">
                <legend className="sr-only">Login form</legend>
                {FIELDS.map((field, i) => (
                  <div
                    key={field.name}
                    className="animate-slide-up"
                    style={{ animationDelay: `${(i + 1) * 80}ms` }}
                  >
                    <FormInput
                      {...field}
                      required
                      value={values[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                    />
                  </div>
                ))}
              </fieldset>

              <div className="mt-8 animate-slide-up" style={{ animationDelay: "300ms" }}>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-b-on-primary" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant animate-slide-up" style={{ animationDelay: "380ms" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary transition-opacity hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
