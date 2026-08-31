import { NavLink } from "react-router-dom";
function Categories() {
  return (
    <div className="flex px-3 py-4 gap-3">
      <div className="group relative overflow-hidden">
        <img
          className="rounded-3xl brightness-87 transition-all duration-500 ease-in-out group-hover:rounded-[25rem]"
          src="/assets/New_arrival.png"
          alt="Best Seller"
        ></img>
        <button className="absolute bottom-2/5 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:-translate-y-10 group-hover:border-none">
          New Arrival
        </button>
        <NavLink to="/men">
          <button className="hidden absolute bottom-3/10 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Men
          </button>
        </NavLink>
        <NavLink to="/women">
          <button className="hidden absolute bottom-1/5 left-3/8 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Women
          </button>
        </NavLink>
      </div>
      <div className="group relative overflow-hidden">
        <img
          className="rounded-3xl brightness-87 transition-all duration-500 ease-in-out group-hover:rounded-[25rem]"
          src="/assets/Men.png"
          alt="Best Seller"
        ></img>
        <button className="absolute bottom-2/5 left-9/20 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:-translate-y-10 group-hover:border-none">
          Men
        </button>
        <NavLink to="/men">
          <button className="hidden absolute bottom-3/10 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Men
          </button>
        </NavLink>
      </div>

      <div className="group relative overflow-hidden">
        <img
          className="rounded-3xl brightness-87 transition-all duration-500 ease-in-out group-hover:rounded-[25rem]"
          src="/assets/Women.png"
          alt="Best Seller"
        ></img>
        <button className="absolute bottom-2/5 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:-translate-y-10 group-hover:border-none">
          Women
        </button>
        <NavLink to="/women">
          <button className="hidden absolute bottom-3/10 left-4/11 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Women
          </button>
        </NavLink>
      </div>

      <div className="group relative overflow-hidden">
        <img
          className="rounded-3xl brightness-87 transition-all duration-500 ease-in-out group-hover:rounded-[25rem]"
          src="/assets/Best_seller.png"
          alt="Best Seller"
        ></img>
        <button className="absolute bottom-2/5 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:-translate-y-10 group-hover:border-none">
          Best Seller
        </button>
        <NavLink to="/men">
          <button className="hidden absolute bottom-3/10 left-2/5 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Men
          </button>
        </NavLink>
        <NavLink to="/women">
          <button className="hidden absolute bottom-1/5 left-3/8 border border-white text-primary-foreground px-3 py-1 rounded-full font-semibold tansition-all duration-500 group-hover:border-white group-hover:inline group-hover:-translate-y-10">
            Shop Women
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Categories;
