export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-medium">Weekly Progress</h2>
          <div className="mt-4 h-72 bg-gray-50 rounded-lg border flex items-center justify-center text-gray-400">
            Line chart placeholder
          </div>
        </div>
        <div className="card p-4">
          <h2 className="font-medium">Completion Breakdown</h2>
          <div className="mt-4 h-72 bg-gray-50 rounded-lg border flex items-center justify-center text-gray-400">
            Bar chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
