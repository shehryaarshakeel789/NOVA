import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/api/products";

const LOW_STOCK_THRESHOLD = 5;

function isLowStock(product) {
  return product.sizes.some(
    (s) => s.stock > 0 && s.stock < LOW_STOCK_THRESHOLD,
  );
}

function ProductSlider() {
  const slider = useRef();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const data = await getProducts({ isNewArrival: true, limit: 10 });
        setProducts(data.products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  function next() {
    slider.current.scrollBy({ left: 350, behavior: "smooth" });
  }
  function previous() {
    slider.current.scrollBy({ left: -350, behavior: "smooth" });
  }

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <>
      <div className="mx-auto flex my-4 justify-between items-center px-4 scrollbar-hide">
        <h1 className="underline tracking-wide">NEW ARRIVALS</h1>
        <div className="flex gap-1">
          <CircleChevronLeft onClick={previous} strokeWidth={1} size={40} />
          <CircleChevronRight onClick={next} strokeWidth={1} size={40} />
        </div>
      </div>
      <div
        ref={slider}
        className="flex px-4 gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="relative snap-start shrink-0 w-[320px] cursor-pointer"
          >
            <span className="px-3 py-1 absolute top-2 left-2 z-10 rounded-full border bg-olive-200">
              new
            </span>
            {isLowStock(product) && (
              <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full">
                Low Stock
              </span>
            )}
            <div className="h-[400px] w-full overflow-hidden rounded-xl">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-lg font-bold mt-2 text-foreground">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">{product.color}</p>
            <span className="text-sm">
              <strong>${product.price}</strong>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductSlider;
