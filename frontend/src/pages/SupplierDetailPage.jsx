import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Truck, Package } from "lucide-react";
import { getSupplier, deleteSupplier } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmDialog from "../components/ConfirmDialog";
import EntityDetailHeader from "../components/EntityDetailHeader";

export default function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: supplier, loading, error, refetch } = useFetch(() => getSupplier(id), [id]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteSupplier(id);
      navigate("/suppliers");
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [id, navigate]);

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error || !supplier) return <ErrorAlert message={error || "Supplier not found."} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={showConfirm}
        title="Delete supplier"
        message="This will permanently delete this supplier. Items will keep their data. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <EntityDetailHeader
        backTo="/suppliers"
        backLabel="Back to Suppliers"
        icon={Truck}
        name={supplier.name}
        description={supplier.contactName}
        editTo={`/suppliers/${id}/edit`}
        onDelete={() => setShowConfirm(true)}
        deleting={deleting}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {supplier.email && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">Email</p>
            <p className="mt-1 text-sm font-medium text-on-surface">{supplier.email}</p>
          </div>
        )}
        {supplier.phone && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">Phone</p>
            <p className="mt-1 text-sm font-medium text-on-surface">{supplier.phone}</p>
          </div>
        )}
      </div>

      <h2 className="font-heading text-lg font-semibold text-on-surface">
        Items ({supplier.items?.length ?? 0})
      </h2>

      {!supplier.items?.length ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No items from this supplier yet.</p>
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
          {supplier.items.map((item, i) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high ${
                i < supplier.items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <span className="font-medium text-on-surface">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="w-10 text-right font-data text-on-surface-variant">x{item.quantity}</span>
                <span className="w-20 text-right font-data text-on-surface-variant">{formatPrice(item.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
