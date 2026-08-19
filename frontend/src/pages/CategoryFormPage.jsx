import { useParams, useNavigate } from "react-router";
import { Boxes } from "lucide-react";
import { getCategory, createCategory, updateCategory } from "../api/services";
import { useEntityForm } from "../hooks/useEntityForm";
import LoadingSpinner from "../components/LoadingSpinner";
import EntityFormLayout from "../components/EntityFormLayout";
import FormInput from "../components/FormInput";

const DEFAULTS = { name: "", description: "" };

function validate(values) {
  const errs = {};
  if (!values.name.trim()) errs.name = "Name is required";
  return errs;
}

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { values, errors, apiError, loading, submitting, setField, handleSubmit } = useEntityForm({
    defaultValues: DEFAULTS,
    fetcher: isEdit ? getCategory : null,
    createFn: (data) => createCategory({ name: data.name.trim(), description: data.description?.trim() || undefined }),
    updateFn: (eid, data) => updateCategory(eid, { name: data.name.trim(), description: data.description?.trim() || undefined }),
    id,
    isEdit,
  });

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <EntityFormLayout
      backTo="/categories"
      backLabel="Back to Categories"
      icon={Boxes}
      title={isEdit ? "Edit Category" : "New Category"}
      apiError={apiError}
      submitting={submitting}
      submittingLabel={isEdit ? "Save Changes" : "Create Category"}
    >
      <form id="entity-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(validate, () => navigate("/categories")); }} noValidate>
        <fieldset disabled={submitting} className="space-y-5 border-none p-0 m-0">
          <legend className="sr-only">{isEdit ? "Edit" : "Create"} category form</legend>
          <FormInput label="Name" name="name" required value={values.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} placeholder="e.g. Brakes, Engine, Electrical" />
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-on-surface">Description</label>
            <textarea id="description" name="description" rows={3} value={values.description} onChange={(e) => setField("description", e.target.value)} placeholder="Optional description" className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </fieldset>
      </form>
    </EntityFormLayout>
  );
}
