import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Car, Package } from "lucide-react";
import { getVehicle, deleteVehicle } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import EntityDetailHeader from "../components/EntityDetailHeader";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: vehicle, loading, error, refetch } = useFetch(() => getVehicle(id), [id]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteVehicle(id);
      navigate("/vehicles");
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [id, navigate]);

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error || !vehicle) return <ErrorAlert message={error || "Vehicle not found."} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={showConfirm}
        title="Delete vehicle"
        message="This will permanently delete this vehicle. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <EntityDetailHeader
        backTo="/vehicles"
        backLabel="Back to Vehicles"
        icon={Car}
        name={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        editTo={`/vehicles/${id}/edit`}
        onDelete={() => setShowConfirm(true)}
        deleting={deleting}
      />

      <h2 className="font-heading text-lg font-semibold text-on-surface">
        Compatible Items ({vehicle.items?.length ?? 0})
      </h2>

      {!vehicle.items?.length ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No compatible items yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          <div className="flex items-center border-b border-outline-variant bg-surface-container-high px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-xs">
            <span className="flex-1">Name</span>
            <div className="flex items-center gap-4">
              <span className="w-10 text-right">Qty</span>
              <span className="w-20 text-right">Price</span>
            </div>
          </div>
          {vehicle.items.map((iv, i) => (
            <Link
              key={iv.item.id}
              to={`/items/${iv.item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high ${
                i < vehicle.items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <div>
                <span className="font-medium text-on-surface">{iv.item.name}</span>
                {iv.item.category && (
                  <span className="ml-2 text-on-surface-variant">/ {iv.item.category.name}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="w-10 text-right font-data text-on-surface-variant">x{iv.item.quantity}</span>
                <span className="w-20 text-right font-data text-on-surface-variant">{formatPrice(iv.item.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
