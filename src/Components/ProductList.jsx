import { useNavigate } from "react-router-dom";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import Image from "./Image.jsx";
import Skeleton from "./Skeleton.jsx";

const LOW_STOCK_THRESHOLD = 5;

function isLowStock(product) {
  return product.sizes.some(
    (s) => s.stock > 0 && s.stock < LOW_STOCK_THRESHOLD,
  );
}

export default function ProductList({ products, loading, error }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex w-full gap-6 px-6 py-6 flex-wrap">
        <div className="grid grid-cols-4 gap-4 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p className="px-6 py-6 text-red-500">{error}</p>;
  if (!products || products.length === 0) {
    return <p className="px-6 py-6">No products found.</p>;
  }

  return (
    <div className="flex w-full gap-6 px-6 py-6 flex-wrap">
      <ItemGroup className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <Item
            key={product._id}
            variant="outline"
            onClick={() => navigate(`/product/${product._id}`)}
            className="cursor-pointer relative bg-primary-foreground"
          >
            {isLowStock(product) && (
              <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full">
                Low Stock
              </span>
            )}
            <ItemHeader>
              <Image
                src={product.images?.[0]}
                alt={product.name}
                width={128}
                height={128}
                className="aspect-square w-full rounded-sm object-cover"
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{product.name}</ItemTitle>
              <ItemDescription>${product.price}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
