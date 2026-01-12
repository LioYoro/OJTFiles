import TasksChart from '../../components/TasksChart';
import StatsSummary from '../../components/StatsSummary';

export default function StatsPage() {
  return (
    <main className="py-8">
      <div className="site-container">
        <h1 className="text-3xl font-bold mb-4">Stats</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsSummary />
          <div className="card">
            <TasksChart />
          </div>
        </div>
      </div>
    </main>
  );
}
