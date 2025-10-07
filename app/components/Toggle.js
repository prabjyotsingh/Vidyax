export default function Toggle({ defaultChecked = true, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-indigo-600 relative transition">
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </span>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}



