export function FooterColumn({ title, items }) {
  return (
    <div>
      <h3 className="uppercase tracking-[3px] text-xs font-semibold mb-6">
        {title}
      </h3>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
