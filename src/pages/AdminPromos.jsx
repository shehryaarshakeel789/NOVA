import { useEffect, useState } from "react";
import { getPromos, createPromo, updatePromo, deletePromo } from "@/api/promos";
import AdminSidebar from "@/Components/AdminSidebar";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import Skeleton from "@/Components/Skeleton";
import SearchBar from "@/Components/SearchBar";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  expiryDate: "",
  usageLimit: "",
  isActive: true,
};

function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");

  const toast = useToast();
  const confirm = useConfirm();
  const filteredPromos = promos.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    fetchPromos();
  }, []);

  async function fetchPromos() {
    setLoading(true);
    try {
      const data = await getPromos();
      setPromos(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(promo) {
    setEditingId(promo._id);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderAmount: promo.minOrderAmount,
      expiryDate: promo.expiryDate.slice(0, 10),
      usageLimit: promo.usageLimit ?? "",
      isActive: promo.isActive,
    });
    setFormError("");
    setFormOpen(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = {
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      expiryDate: form.expiryDate,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await updatePromo(editingId, payload);
        toast.success("Promo updated");
      } else {
        await createPromo(payload);
        toast.success("Promo created");
      }
      setFormOpen(false);
      await fetchPromos();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = await confirm("Delete this promo code? This can't be undone.");
    if (!ok) return;
    try {
      await deletePromo(id);
      toast.success("Promo deleted");
      await fetchPromos();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function isExpired(promo) {
    return new Date(promo.expiryDate) < new Date();
  }

  return (
    <AdminSidebar activeItem="Promos">
      <div className="px-6 py-8 mx-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Promo Codes</h1>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search..."
          />
          <button
            onClick={openCreateForm}
            className="bg-black text-white px-5 py-2 rounded-full"
          >
            + Add Promo
          </button>
        </div>

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="border rounded-2xl p-6 mb-8 space-y-4"
          >
            <h2 className="font-semibold text-lg">
              {editingId ? "Edit Promo" : "New Promo"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">Code</p>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                  disabled={!!editingId}
                  className="border rounded px-3 py-2 w-full uppercase disabled:bg-zinc-100"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Discount Type</p>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>
              <div>
                <p className="text-sm mb-1">Discount Value</p>
                <input
                  name="discountValue"
                  type="number"
                  min="0"
                  value={form.discountValue}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Min Order Amount ($)</p>
                <input
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Expiry Date</p>
                <input
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Usage Limit (blank = unlimited)</p>
                <input
                  name="usageLimit"
                  type="number"
                  min="0"
                  value={form.usageLimit}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-6 py-2 rounded-full disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Promo"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-6 py-2 rounded-full border"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Code</th>
                <th className="py-2">Discount</th>
                <th className="py-2">Expires</th>
                <th className="py-2">Used</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPromos.map((promo) => (
                <tr key={promo._id} className="border-b">
                  <td className="py-2 font-mono">{promo.code}</td>
                  <td className="py-2">
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue}`}
                  </td>
                  <td className="py-2">
                    {new Date(promo.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {promo.usedCount}
                    {promo.usageLimit !== null ? ` / ${promo.usageLimit}` : ""}
                  </td>
                  <td className="py-2">
                    {isExpired(promo) ? (
                      <span className="text-red-600">Expired</span>
                    ) : promo.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-muted-foreground">Inactive</span>
                    )}
                  </td>
                  <td className="py-2 text-right space-x-3">
                    <button
                      onClick={() => openEditForm(promo)}
                      className="text-sm underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="text-sm text-red-500 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminSidebar>
  );
}

export default AdminPromos;
