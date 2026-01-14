export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${value}%` }} />
    </div>
  );
}
