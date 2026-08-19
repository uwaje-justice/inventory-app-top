import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Truck } from "lucide-react";
import { getSupplier, createSupplier, updateSupplier } from "../api/services";
import { useEntityForm } from "../hooks/useEntityForm";
import LoadingSpinner from "../components/LoadingSpinner";
import EntityFormLayout from "../components/EntityFormLayout";
import FormInput from "../components/FormInput";

const DEFAULTS = { name: "", contactName: "", email: "", phone: "" };

function validate(values) {
  const errs = {};
  if (!values.name.trim()) errs.name = "Name is required";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Must be a valid email";
  return errs;
}

export default function SupplierFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { values, errors, apiError, loading, submitting, setField, handleSubmit } = useEntityForm({
    defaultValues: DEFAULTS,
    fetcher: isEdit ? getSupplier : null,
    createFn: (data) => {
      const payload = { name: data.name.trim() };
      if (data.contactName?.trim()) payload.contactName = data.contactName.trim();
      if (data.email?.trim()) payload.email = data.email.trim();
      if (data.phone?.trim()) payload.phone = data.phone.trim();
      return createSupplier(payload);
    },
    updateFn: (eid, data) => {
      const payload = { name: data.name.trim() };
      if (data.contactName?.trim()) payload.contactName = data.contactName.trim();
      if (data.email?.trim()) payload.email = data.email.trim();
      if (data.phone?.trim()) payload.phone = data.phone.trim();
      return updateSupplier(eid, payload);
    },
    id,
    isEdit,
  });

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <EntityFormLayout
      backTo="/suppliers"
      backLabel="Back to Suppliers"
      icon={Truck}
      title={isEdit ? "Edit Supplier" : "New Supplier"}
      apiError={apiError}
      submitting={submitting}
      submittingLabel={isEdit ? "Save Changes" : "Create Supplier"}
    >
      <form id="entity-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(validate, () => navigate("/suppliers")); }} noValidate>
        <fieldset disabled={submitting} className="space-y-5 border-none p-0 m-0">
          <legend className="sr-only">{isEdit ? "Edit" : "Create"} supplier form</legend>
          <FormInput label="Name" name="name" required value={values.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} placeholder="e.g. AutoZone, NAPA" />
          <FormInput label="Contact Name" name="contactName" value={values.contactName} onChange={(e) => setField("contactName", e.target.value)} placeholder="Optional contact person" />
          <FormInput label="Email" name="email" type="email" value={values.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} placeholder="supplier@example.com" />
          <FormInput label="Phone" name="phone" type="tel" value={values.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="(555) 123-4567" />
        </fieldset>
      </form>
    </EntityFormLayout>
  );
}
