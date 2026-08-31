import { useEffect, useState } from "react";
import Filter from "@/Components/Filter.jsx";
import ProductList from "@/Components/ProductList";
import Paging from "@/Components/Paging";
import ShowCase from "@/Components/ShowCase";
import Footer from "@/Components/Footer";
import { getProducts } from "@/api/products";

function Women() {
  const category = "women";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const params = { category, page };
        if (sort) params.sort = sort;
        const data = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, sort, page]);

  function handleSortChange(newSort) {
    setSort(newSort);
    setPage(1);
  }

  return (
    <div>
      <Filter productNo={total} sort={sort} onSortChange={handleSortChange} />
      <ProductList products={products} loading={loading} error={error} />
      <Paging page={page} totalPages={totalPages} onPageChange={setPage} />
      <ShowCase />
      <Footer />
    </div>
  );
}

export default Women;
