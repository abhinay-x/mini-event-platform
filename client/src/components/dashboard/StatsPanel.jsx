import './StatsPanel.css';

const StatCard = ({ label, value }) => (
  <div className="stat-card card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const StatsPanel = ({ stats }) => (
  <div className="stats-panel">
    <StatCard label="Total events" value={stats.total} />
    <StatCard label="Upcoming" value={stats.upcoming} />
    <StatCard label="My events" value={stats.myEvents} />
    <StatCard label="I'm attending" value={stats.attending} />
  </div>
);

export default StatsPanel;
