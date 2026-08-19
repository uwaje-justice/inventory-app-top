import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Package, Car } from "lucide-react";
import { getItem, deleteItem } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import EntityDetailHeader from "../components/EntityDetailHeader";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: item, loading, error, refetch } = useFetch(() => getItem(id), [id]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteItem(id);
      navigate("/items");
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [id, navigate]);

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error || !item) return <ErrorAlert message={error || "Item not found."} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={showConfirm}
        title="Delete item"
        message="This will permanently delete this item. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <EntityDetailHeader
        backTo="/items"
        backLabel="Back to Items"
        icon={Package}
        name={item.name}
        description={item.description}
        editTo={`/items/${id}/edit`}
        onDelete={() => setShowConfirm(true)}
        deleting={deleting}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Category", value: item.category?.name || "—" },
          { label: "Supplier", value: item.supplier?.name || "—" },
          { label: "Quantity", value: item.quantity },
          { label: "Price", value: formatPrice(item.price) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">{label}</p>
            <p className="mt-1 font-data text-lg font-bold text-on-surface">{value}</p>
          </div>
        ))}
      </div>

      {item.vehicles?.length > 0 ? (
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-on-surface">
            Compatible Vehicles ({item.vehicles.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {item.vehicles.map((iv) => (
              <Link
                key={iv.vehicle.id}
                to={`/vehicles/${iv.vehicle.id}`}
                className="rounded-2xl border border-outline-variant bg-surface-container p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-heading text-sm font-semibold text-on-surface">
                  {iv.vehicle.year} {iv.vehicle.make} {iv.vehicle.model}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Car size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No compatible vehicles yet.</p>
        </div>
      )}
    </div>
  );
}
