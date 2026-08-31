import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import AdminSidebar from "@/Components/AdminSidebar";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { uploadImage } from "@/api/upload";
import SearchBar from "@/Components/SearchBar";
import Skeleton from "@/Components/Skeleton";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  images: "",
  category: "men",
  color: "",
  sizes: [{ size: "", stock: "" }],
  isNewArrival: false,
  isOnSale: false,
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
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

  function openEditForm(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      images: (product.images || []).join(", "),
      category: product.category,
      color: product.color || "",
      sizes: product.sizes.map((s) => ({ size: s.size, stock: s.stock })),
      isNewArrival: product.isNewArrival,
      isOnSale: product.isOnSale,
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

  function handleSizeRowChange(index, field, value) {
    setForm((prev) => {
      const updatedSizes = [...prev.sizes];
      updatedSizes[index] = { ...updatedSizes[index], [field]: value };
      return { ...prev, sizes: updatedSizes };
    });
  }

  function addSizeRow() {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: "" }],
    }));
  }

  function removeSizeRow(index) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${url}` : url,
      }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const cleanedSizes = form.sizes
      .filter((s) => s.size.trim())
      .map((s) => ({ size: s.size.trim(), stock: Number(s.stock) || 0 }));

    if (cleanedSizes.length === 0) {
      setFormError("Add at least one size");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: form.category,
      color: form.color,
      sizes: cleanedSizes,
      isNewArrival: form.isNewArrival,
      isOnSale: form.isOnSale,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setFormOpen(false);
      await fetchProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = await confirm("Delete this product? This can't be undone.");
    if (!ok) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      await fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminSidebar activeItem="Products">
      <div className="px-6 py-8 mx-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <div className="flex items-center gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
            />
            <button
              onClick={openCreateForm}
              className="bg-black text-white px-5 py-2 rounded-full"
            >
              + Add Product
            </button>
          </div>
        </div>

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="border rounded-2xl p-6 mb-8 space-y-4"
          >
            <h2 className="font-semibold text-lg">
              {editingId ? "Edit Product" : "New Product"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">Name</p>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Price</p>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <p className="text-sm mb-1">Category</p>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
              <div>
                <p className="text-sm mb-1">Color</p>
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">Sizes & Stock</p>
              <div className="space-y-2">
                {form.sizes.map((row, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      placeholder="Size (e.g. M)"
                      value={row.size}
                      onChange={(e) =>
                        handleSizeRowChange(index, "size", e.target.value)
                      }
                      className="border rounded px-3 py-2 w-32"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Stock"
                      value={row.stock}
                      onChange={(e) =>
                        handleSizeRowChange(index, "stock", e.target.value)
                      }
                      className="border rounded px-3 py-2 w-28"
                    />
                    <button
                      type="button"
                      onClick={() => removeSizeRow(index)}
                      disabled={form.sizes.length === 1}
                      className="text-red-500 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSizeRow}
                className="text-sm underline mt-2"
              >
                + Add another size
              </button>
            </div>

            <div>
              <p className="text-sm mb-2">Product Images</p>
              <label
                htmlFor="product-image-upload"
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${
                  uploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-zinc-100"
                }`}
              >
                {uploading ? "Uploading..." : "+ Upload Image"}
              </label>
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />

              {form.images && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.images
                    .split(",")
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images
                                .split(",")
                                .map((u) => u.trim())
                                .filter((u) => u && u !== url)
                                .join(", "),
                            }))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm mb-1">Description</p>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={form.isNewArrival}
                  onChange={handleChange}
                />
                New Arrival
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={form.isOnSale}
                  onChange={handleChange}
                />
                On Sale
              </label>
            </div>

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
                    : "Create Product"}
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
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Total Stock</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const totalStock = product.sizes.reduce(
                  (sum, s) => sum + s.stock,
                  0,
                );
                return (
                  <tr key={product._id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2 capitalize">{product.category}</td>
                    <td className="py-2">${product.price}</td>
                    <td className="py-2">{totalStock}</td>
                    <td className="py-2 text-right space-x-3">
                      <button
                        onClick={() => openEditForm(product)}
                        className="text-sm underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-sm text-red-500 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminSidebar>
  );
}

export default Admin;
