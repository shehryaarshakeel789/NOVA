function Product({ src, alt, name, price, color, releaseDate }) {
  return (
    <div className="relative snap start shrink-0 w-[320px]">
      <span className="px-3 py-1 absolute top-1/30 left-1/20 rounded-full border bg-olive-200">
        {releaseDate ? "new" : ""}
      </span>
      <img src={src} alt={alt} className="max-h-150 rounded-xl"></img>
      <h1 className="absolute bottom-1/10 text-lg font-bold left-1/30 ">
        {name}
      </h1>
      <p className="absolute bottom-1/18 left-1/30">{color}</p>

      <span className="absolute bottom-1/80 left-1/30">
        <strong>${price}</strong>
      </span>
    </div>
  );
}

export default Product;
