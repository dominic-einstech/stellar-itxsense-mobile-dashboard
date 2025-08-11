import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css';

function getRange(range) {
  const now = new Date();

  // Normalize to 00:00:00 for comparisons
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const start = new Date(0); // default: epoch (All)
  const end = new Date(8640000000000000); // max date

  if (range === 'today') {
    const s = startOfDay(now);
    const e = new Date(s); e.setDate(e.getDate() + 1);
    return { start: s, end: e };
  }

  if (range === 'thisWeek') {
    // Week starts Monday
    const s = startOfDay(now);
    const day = (s.getDay() + 6) % 7; // Mon=0..Sun=6
    s.setDate(s.getDate() - day);
    const e = new Date(s); e.setDate(e.getDate() + 7);
    return { start: s, end: e };
  }

  if (range === 'lastWeek') {
    // Week starts Monday
    const s = startOfDay(now);
    const day = (s.getDay() + 6) % 7; // Mon=0..Sun=6
    s.setDate(s.getDate() - day - 7); // start of last week
    const e = new Date(s); e.setDate(e.getDate() + 7);
    return { start: s, end: e };
  }

  if (range === 'thisMonth') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start: s, end: e };
  }

  if (range === 'lastMonth') {
    const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const e = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start: s, end: e };
  }

  // all
  return { start, end };
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all'); // all | inProgress | open
  const [timeRange, setTimeRange] = useState('all'); // all | today | thisWeek | lastWeek | thisMonth | lastMonth
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 New search state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tickets`);
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        const ticketList = data.data || data;
        setTickets(
          [...ticketList].sort(
            (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
          )
        );
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Apply time range first
  const { start, end } = getRange(timeRange);
  const withinRangeTickets = tickets.filter(t => {
    const d = t.dateCreated ? new Date(t.dateCreated) : null;
    return d && d >= start && d < end;
  });

  // Then apply status filter
  const filteredByStatus = withinRangeTickets.filter(ticket => {
    if (filter === 'inProgress') return ticket.status?.toLowerCase() === 'in progress';
    if (filter === 'open') return ticket.status?.toLowerCase() === 'open';
    return true;
  });

  // 🔍 Apply search filter
  const filteredTickets = filteredByStatus.filter(ticket => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.busStopCode?.toLowerCase().includes(term) ||
      ticket.location?.toLowerCase().includes(term)
    );
  });

  // Counts respect current time range
  const countAll = withinRangeTickets.length;
  const countInProgress = withinRangeTickets.filter(t => t.status?.toLowerCase() === 'in progress').length;
  const countOpen = withinRangeTickets.filter(t => t.status?.toLowerCase() === 'open').length;

  return (
    <div className="tickets-container">
      <h1>Tickets</h1>

      {/* Time range filter */}
      <div className="ticket-filters" style={{ marginBottom: 10 }}>
        <button className={timeRange === 'all' ? 'active' : ''} onClick={() => setTimeRange('all')}>All Time</button>
        <button className={timeRange === 'today' ? 'active' : ''} onClick={() => setTimeRange('today')}>Today</button>
        <button className={timeRange === 'thisWeek' ? 'active' : ''} onClick={() => setTimeRange('thisWeek')}>This Week</button>
        <button className={timeRange === 'lastWeek' ? 'active' : ''} onClick={() => setTimeRange('lastWeek')}>Last Week</button>
        <button className={timeRange === 'thisMonth' ? 'active' : ''} onClick={() => setTimeRange('thisMonth')}>This Month</button>
        <button className={timeRange === 'lastMonth' ? 'active' : ''} onClick={() => setTimeRange('lastMonth')}>Last Month</button>
      </div>

      {/* Status filter */}
      <div className="ticket-filters" style={{ marginBottom: 10 }}>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All ({countAll})
        </button>
        <button className={filter === 'inProgress' ? 'active' : ''} onClick={() => setFilter('inProgress')}>
          In Progress ({countInProgress})
        </button>
        <button className={filter === 'open' ? 'active' : ''} onClick={() => setFilter('open')}>
          Open ({countOpen})
        </button>
      </div>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search by Bus Stop Code or Location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '6px', marginBottom: '10px' }}
      />

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading tickets...</p>
      ) : (
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Viewer ID</th>
              <th>Bus Stop Code</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.viewerId || '-'}</td>
                  <td>{ticket.busStopCode || '-'}</td>
                  <td>{ticket.status || '-'}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No tickets found for this range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
