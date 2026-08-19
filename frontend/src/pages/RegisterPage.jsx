import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock } from "lucide-react";
import { register as registerApi } from "../api/services";
import { setToken } from "../utils/auth";
import BackLink from "../components/BackLink";
import ThemeToggle from "../components/ThemeToggle";
import FormInput from "../components/FormInput";
import ErrorAlert from "../components/ErrorAlert";
import Footer from "../components/Footer";

const FIELDS = [
  { name: "username", label: "Username", type: "text", autoComplete: "username", icon: User },
  { name: "email", label: "Email", type: "email", autoComplete: "email", icon: Mail },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password", icon: Lock },
  { name: "confirmPassword", label: "Confirm Password", type: "password", autoComplete: "new-password", icon: Lock },
];

function validate(values) {
  const errors = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  } else if (values.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Must be a valid email";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      const result = await registerApi({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setToken(result.token);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
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
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Start managing your vehicle parts inventory today.
                </p>
              </div>
              <ThemeToggle />
            </div>

            {apiError && <ErrorAlert message={apiError} />}

            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={loading} className="space-y-5 border-none p-0 m-0">
                <legend className="sr-only">Registration form</legend>
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

              <div className="mt-8 animate-slide-up" style={{ animationDelay: "500ms" }}>
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-b-on-primary" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant animate-slide-up" style={{ animationDelay: "580ms" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary transition-opacity hover:opacity-80"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
