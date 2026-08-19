import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Package } from 'lucide-react';
import {
  getItem,
  createItem,
  updateItem,
  getCategories,
  getSuppliers,
} from '../api/services';
import { useEntityForm } from '../hooks/useEntityForm';
import LoadingSpinner from '../components/LoadingSpinner';
import EntityFormLayout from '../components/EntityFormLayout';
import FormInput from '../components/FormInput';

const DEFAULTS = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  categoryId: '',
  supplierId: '',
};

function validate(values) {
  const errs = {};
  if (!values.name.trim()) errs.name = 'Name is required';
  if (!values.price) errs.price = 'Price is required';
  else if (isNaN(Number(values.price)) || Number(values.price) < 0)
    errs.price = 'Price must be a positive number';
  if (
    values.quantity &&
    (isNaN(Number(values.quantity)) ||
      Number(values.quantity) < 0 ||
      !Number.isInteger(Number(values.quantity)))
  )
    errs.quantity = 'Quantity must be a non-negative integer';
  if (!values.categoryId) errs.categoryId = 'Category is required';
  return errs;
}

function buildPayload(values) {
  const payload = {
    name: values.name.trim(),
    price: Number(values.price),
    categoryId: values.categoryId,
  };
  if (values.description?.trim())
    payload.description = values.description.trim();
  if (values.quantity) payload.quantity = Number(values.quantity);
  if (values.supplierId) payload.supplierId = values.supplierId;
  return payload;
}

export default function ItemFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [dropdownError, setDropdownError] = useState('');

  const {
    values,
    errors,
    apiError,
    loading,
    submitting,
    setField,
    handleSubmit,
  } = useEntityForm({
    defaultValues: DEFAULTS,
    fetcher: isEdit ? getItem : null,
    createFn: data => createItem(buildPayload(data)),
    updateFn: (eid, data) => updateItem(eid, buildPayload(data)),
    id,
    isEdit,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCategories(), getSuppliers()])
      .then(([cats, sups]) => {
        if (!cancelled) {
          setCategories(cats);
          setSuppliers(sups);
        }
      })
      .catch(() => {
        if (!cancelled)
          setDropdownError('Failed to load categories/suppliers.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <EntityFormLayout
      backTo="/items"
      backLabel="Back to Items"
      icon={Package}
      title={isEdit ? 'Edit Item' : 'New Item'}
      apiError={apiError || dropdownError}
      submitting={submitting}
      submittingLabel={isEdit ? 'Save Changes' : 'Create Item'}
    >
      <form
        id="entity-form"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(validate, () => navigate('/items'));
        }}
        noValidate
      >
        <fieldset
          disabled={submitting}
          className="space-y-5 border-none p-0 m-0"
        >
          <legend className="sr-only">
            {isEdit ? 'Edit' : 'Create'} item form
          </legend>

          <FormInput
            label="Name"
            name="name"
            required
            value={values.name}
            onChange={e => setField('name', e.target.value)}
            error={errors.name}
            placeholder="e.g. Brake Pads (Front)"
          />

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-on-surface"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={values.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Optional description"
              className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Price"
              name="price"
              type="number"
              required
              step="0.01"
              min="0"
              value={values.price}
              onChange={e => setField('price', e.target.value)}
              error={errors.price}
              placeholder="0.00"
            />
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={values.quantity}
              onChange={e => setField('quantity', e.target.value)}
              error={errors.quantity}
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="mb-1.5 block text-sm font-medium text-on-surface"
            >
              Category{' '}
              <span className="ml-0.5 text-error" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={values.categoryId}
              onChange={e => setField('categoryId', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.categoryId}
              className={`w-full rounded-xl border bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.categoryId ? 'border-error' : 'border-outline-variant'}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p
                role="alert"
                className="mt-1.5 text-xs text-error animate-slide-up"
              >
                {errors.categoryId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="supplierId"
              className="mb-1.5 block text-sm font-medium text-on-surface"
            >
              Supplier
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={values.supplierId}
              onChange={e => setField('supplierId', e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface py-3 pl-4 pr-4 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">No supplier</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      </form>
    </EntityFormLayout>
  );
}
