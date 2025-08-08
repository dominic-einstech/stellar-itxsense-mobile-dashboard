import React, { useState, useEffect } from 'react';
import './Tickets.css';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all'); // all | inProgress | open
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tickets`);
        if (!response.ok) throw new Error('Failed to fetch tickets');

        const data = await response.json();
        const ticketList = data.data || data; // API may return {data: [...]}

        // Sort newest first
        const sortedTickets = [...ticketList].sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setTickets(sortedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const openTickets = tickets.filter(t => t.status?.toLowerCase() === 'open');
  const inProgressTickets = tickets.filter(t => t.status?.toLowerCase() === 'in progress');

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'inProgress') return ticket.status?.toLowerCase() === 'in progress';
    if (filter === 'open') return ticket.status?.toLowerCase() === 'open';
    return true; // all
  });

  return (
    <div className="tickets-container">
      <h1>Tickets</h1>

      {/* Filter buttons with counts */}
      <div className="ticket-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({tickets.length})
        </button>
        <button
          className={filter === 'inProgress' ? 'active' : ''}
          onClick={() => setFilter('inProgress')}
        >
          In Progress ({inProgressTickets.length})
        </button>
        <button
          className={filter === 'open' ? 'active' : ''}
          onClick={() => setFilter('open')}
        >
          Open ({openTickets.length})
        </button>
      </div>

      {/* Ticket list */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading tickets...</p>
      ) : (
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Viewer ID</th>
              <th>Bus Stop Code</th>
              <th>Fault</th>
              <th>Status</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.id || '-'}</td>
                  <td>{ticket.viewerId || '-'}</td>
                  <td>{ticket.busStopCode || '-'}</td>
                  <td>{ticket.fault || '-'}</td>
                  <td>{ticket.status || '-'}</td>
                  <td>
                    {ticket.dateCreated
                      ? new Date(ticket.dateCreated).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
