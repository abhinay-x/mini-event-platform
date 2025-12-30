import { categories } from '../../utils/format.js';
import './EventFilters.css';

const EventFilters = ({ filters, onChange, onReset }) => (
  <div className="event-filters card">
    <div className="filters-grid">
      <input
        type="search"
        placeholder="Search by title, description, or location"
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
      />
      <select value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select value={filters.datePreset} onChange={(e) => onChange('datePreset', e.target.value)}>
        <option value="all">All dates</option>
        <option value="today">Today</option>
        <option value="week">This week</option>
        <option value="upcoming">Upcoming</option>
      </select>
      <label>
        From
        <input type="date" value={filters.dateFrom} onChange={(e) => onChange('dateFrom', e.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={filters.dateTo} onChange={(e) => onChange('dateTo', e.target.value)} />
      </label>
    </div>
    <div className="filters-actions">
      <label>
        <input type="checkbox" checked={filters.showMine} onChange={(e) => onChange('showMine', e.target.checked)} />
        My events
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.showAttending}
          onChange={(e) => onChange('showAttending', e.target.checked)}
        />
        I'm attending
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.includePast}
          onChange={(e) => onChange('includePast', e.target.checked)}
        />
        Include past
      </label>
      <button className="btn btn-outline" onClick={onReset}>
        Reset
      </button>
    </div>
  </div>
);

export default EventFilters;
