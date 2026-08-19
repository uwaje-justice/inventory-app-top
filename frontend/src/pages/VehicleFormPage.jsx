import { useParams, useNavigate } from "react-router";
import { Car } from "lucide-react";
import { getVehicle, createVehicle, updateVehicle } from "../api/services";
import { useEntityForm } from "../hooks/useEntityForm";
import { FIRST_CAR_YEAR } from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
import EntityFormLayout from "../components/EntityFormLayout";
import FormInput from "../components/FormInput";

const currentYear = new Date().getFullYear();
const DEFAULTS = { make: "", model: "", year: "" };

function validate(values) {
  const errs = {};
  if (!values.make.trim()) errs.make = "Make is required";
  if (!values.model.trim()) errs.model = "Model is required";
  if (!values.year) errs.year = "Year is required";
  else if (!Number.isInteger(Number(values.year)) || Number(values.year) < FIRST_CAR_YEAR || Number(values.year) > currentYear) errs.year = `Year must be between ${FIRST_CAR_YEAR} and ${currentYear}`;
  return errs;
}

export default function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { values, errors, apiError, loading, submitting, setField, handleSubmit } = useEntityForm({
    defaultValues: DEFAULTS,
    fetcher: isEdit ? getVehicle : null,
    createFn: (data) => createVehicle({ make: data.make.trim(), model: data.model.trim(), year: Number(data.year) }),
    updateFn: (eid, data) => updateVehicle(eid, { make: data.make.trim(), model: data.model.trim(), year: Number(data.year) }),
    id,
    isEdit,
  });

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <EntityFormLayout
      backTo="/vehicles"
      backLabel="Back to Vehicles"
      icon={Car}
      title={isEdit ? "Edit Vehicle" : "New Vehicle"}
      apiError={apiError}
      submitting={submitting}
      submittingLabel={isEdit ? "Save Changes" : "Create Vehicle"}
    >
      <form id="entity-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(validate, () => navigate("/vehicles")); }} noValidate>
        <fieldset disabled={submitting} className="space-y-5 border-none p-0 m-0">
          <legend className="sr-only">{isEdit ? "Edit" : "Create"} vehicle form</legend>
          <FormInput label="Make" name="make" required value={values.make} onChange={(e) => setField("make", e.target.value)} error={errors.make} placeholder="e.g. Toyota, Ford, Honda" />
          <FormInput label="Model" name="model" required value={values.model} onChange={(e) => setField("model", e.target.value)} error={errors.model} placeholder="e.g. Corolla, F-150, Civic" />
          <FormInput label="Year" name="year" type="number" required min={FIRST_CAR_YEAR} max={currentYear} value={values.year} onChange={(e) => setField("year", e.target.value)} error={errors.year} placeholder={`e.g. ${currentYear}`} />
        </fieldset>
      </form>
    </EntityFormLayout>
  );
}
