import { Menu } from "lucide-react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

function Filter({ productNo = 0, sort, onSortChange }) {
  return (
    <div className="items-center flex gap-2 my-5 mx-7 px-5 py-2 rounded-full bg-olive-300 ">
      <Menu className="w-7 h-7 px-1 border border-solid border-black border-1/2 rounded-full" />
      <h1 className="text-lg">
        Filter <span className="text-sm">( {productNo} Products)</span>
      </h1>
      <div className="ml-auto border border-solid border-black rounded-full ">
        <NativeSelect
          className="px-2"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <NativeSelectOption value="">Featured</NativeSelectOption>
          <NativeSelectOption value="priceAsc">
            Price: Low to High
          </NativeSelectOption>
          <NativeSelectOption value="priceDesc">
            Price: High to Low
          </NativeSelectOption>
          <NativeSelectOption value="newest">Newest</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  );
}

export default Filter;
