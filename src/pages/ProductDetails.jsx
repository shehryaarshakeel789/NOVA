import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/api/products";
import { addToCart } from "@/api/cart";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Skeleton from "@/Components/Skeleton";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { refreshCart, addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const selectedSizeEntry = product?.sizes.find((s) => s.size === size);
  const availableStock = selectedSizeEntry?.stock ?? null;

  async function handleAddToCart() {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    try {
      await addItem(product, quantity, size);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-6 max-w-3xl mx-auto">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-6 w-1/2 mt-4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
    );
  }
  if (!product) return null;

  return (
    <div className="px-6 py-6 mx-8 my-8 rouded-5xl flex justify-center">
      <div className="flex gap-2">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="max-h-150 rounded-xl ml-20"
        />
        <div className="bg-primary-foreground px-5 py-5 my-2 rounded-3xl h-fit">
          <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
          <p className="text-muted-foreground">{product.description}</p>
          <p className="font-bold text-lg mt-2">${product.price}</p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                disabled={s.stock === 0}
                onClick={() => setSize(s.size)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  size === s.size ? "bg-black text-white" : ""
                } ${s.stock === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {selectedSizeEntry && (
            <p className="text-sm mt-1">
              {availableStock === 0 ? (
                <span className="text-muted-foreground">Out of stock</span>
              ) : availableStock < 5 ? (
                <span className="text-red-500 font-medium">
                  Only {availableStock} left!
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {availableStock} in stock
                </span>
              )}
            </p>
          )}

          <input
            type="number"
            min="1"
            max={availableStock || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 mt-3 w-20"
          />

          <button
            onClick={handleAddToCart}
            disabled={!size || availableStock === 0}
            className="block mt-4 bg-black text-white px-6 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
