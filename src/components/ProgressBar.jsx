export default function ProgressBar({ value = 0 }) {
  return (
    <div className="progress-track">
      <div className="progress-fill transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  );
}
