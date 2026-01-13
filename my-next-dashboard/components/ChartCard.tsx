export default function ChartCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        <div className="text-3xl font-bold text-primary-500">{value}</div>
      </div>
      <div className="mt-3 h-2 rounded bg-gradient-to-r from-primary-100 to-primary-500" />
    </div>
  );
}
