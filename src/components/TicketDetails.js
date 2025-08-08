import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetails.css';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tickets/${id}`);
        if (!res.ok) throw new Error('Failed to fetch ticket details');
        const data = await res.json();
        setTicket(data.ticket || data);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading ticket...</p>;
  if (!ticket) return <p style={{ textAlign: 'center' }}>Ticket not found</p>;

  const fmt = (d) => (d ? new Date(d).toLocaleString() : '-');

  // Media present check
  const hasMedia = !!(ticket.faultMedia || ticket.actionMedia);

  return (
    <div className={`ticket-details ${hasMedia ? 'has-media' : ''}`}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>Ticket Details</h2>

      {/* Main two-column section */}
      <div className="ticket-two-col">
        {/* Left column */}
        <div className="ticket-col">
          <div><span className="label">Ticket ID:</span> <span className="value">{ticket.id || '-'}</span></div>
          <div><span className="label">Date Created:</span> <span className="value">{fmt(ticket.dateCreated)}</span></div>
          <div><span className="label">Status:</span> <span className={`value status ${ticket.status?.toLowerCase().replace(' ', '-') || ''}`}>{ticket.status || '-'}</span></div>
          <div><span className="label">Assigned To:</span> <span className="value">{ticket.assignedTo || '-'}</span></div>
          <div><span className="label">Viewer ID:</span> <span className="value">{ticket.viewerId || '-'}</span></div>
          <div><span className="label">Bus Stop Code:</span> <span className="value">{ticket.busStopCode || '-'}</span></div>
          <div><span className="label">Location:</span> <span className="value">{ticket.location || '-'}</span></div>
        </div>

        {/* Right column */}
        <div className="ticket-col">
          <div><span className="label">Panel Type:</span> <span className="value">{ticket.panelType || '-'}</span></div>
          <div><span className="label">Fault:</span> <span className="value">{ticket.fault || '-'}</span></div>
          <div><span className="label">Fault Type:</span> <span className="value">{ticket.faultType || '-'}</span></div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="ticket-bottom">
        <div><span className="label">Cause:</span> <span className="value">{ticket.cause || '-'}</span></div>
        <div><span className="label">Root Cause:</span> <span className="value">{ticket.rootCause || '-'}</span></div>
        <div><span className="label">Action Taken:</span> <span className="value">{ticket.actionTaken || '-'}</span></div>
        <div><span className="label">Solution:</span> <span className="value">{ticket.solution || '-'}</span></div>
        <div><span className="label">Created By:</span> <span className="value">{ticket.createdBy || '-'}</span></div>
        <div><span className="label">Ticket Closure Date:</span> <span className="value">{fmt(ticket.ticketClosureDate)}</span></div>
      </div>

      {/* Media section - only render if exists */}
      {hasMedia && (
        <div className="media-wrap">
          {ticket.faultMedia && (
            <div className="media-card">
              <div className="label">Fault Media</div>
              {/\.(png|jpe?g|gif|webp)$/i.test(ticket.faultMedia) ? (
                <img src={ticket.faultMedia} alt="Fault media" />
              ) : (
                <a href={ticket.faultMedia} target="_blank" rel="noreferrer">Open fault media</a>
              )}
            </div>
          )}

          {ticket.actionMedia && (
            <div className="media-card">
              <div className="label">Action Media</div>
              {/\.(png|jpe?g|gif|webp)$/i.test(ticket.actionMedia) ? (
                <img src={ticket.actionMedia} alt="Action media" />
              ) : (
                <a href={ticket.actionMedia} target="_blank" rel="noreferrer">Open action media</a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
