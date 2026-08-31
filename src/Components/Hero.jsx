import { NavLink } from "react-router-dom";
export default function Hero() {
  return (
    <div className="relative">
      <img src="/assets/Hero_pic.png" alt="Hero" />
      <div className="absolute bottom-1 left-1 px flex flex-col text-primary-foreground">
        <NavLink to="/new-arrivals">
          <h1 className="text-2xl italic">New Arrivals</h1>
        </NavLink>
        <p className="font-thin text-xs">
          Start the season with comfort, style and versatility
        </p>
      </div>
    </div>
  );
}
