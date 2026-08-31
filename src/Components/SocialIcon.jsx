export function SocialIcon({ children }) {
  return (
    <button
      className="
        h-12
        w-12
        rounded-full
        border
        border-white/50
        flex
        items-center
        justify-center
        hover:bg-white
        hover:text-black
        transition-all
        duration-300
      "
    >
      {children}
    </button>
  );
}
