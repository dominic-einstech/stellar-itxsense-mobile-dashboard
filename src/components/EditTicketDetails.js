import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import "./EditTicketDetails.css";

const API_URL = process.env.REACT_APP_API_URL;

const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" },
];

// Dark theme styles for react-select
const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2a2a40",
    borderColor: "#44445e",
    color: "#fff",
    minHeight: "32px",
    fontSize: "0.8rem",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e1e2f",
    color: "#fff",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#3b3b55"
      : state.isSelected
      ? "#00897b"
      : "transparent",
    color: "#fff",
    cursor: "pointer",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#bbb",
  }),
};

export default function EditTicketDetails({ ticket, onClose, onTicketUpdated }) {
  const [form, setForm] = useState({ ...ticket });
  const [faultMedia, setFaultMedia] = useState(null);
  const [actionMedia, setActionMedia] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff`);
        const data = await res.json();
        setStaffOptions(data.map((s) => ({ value: s.name, label: s.name })));
      } catch (err) {
        toast.error("Failed to load staff");
        console.error("Staff fetch failed:", err);
      }
    };
    fetchStaff();
  }, []);

  const renderMedia = (url, type) => {
    if (!url) return null;
    const fullUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${API_URL}${url}`;
    const ext = fullUrl.split(".").pop().toLowerCase();
    return (
      <div className="edit-ticket-media">
        <span className="label">Current {type} Media</span>
        {["mp4", "webm", "mov"].includes(ext) ? (
          <video controls width="100%">
            <source src={fullUrl} type={`video/${ext}`} />
          </video>
        ) : ["jpg", "jpeg", "png", "gif"].includes(ext) ? (
          <img src={fullUrl} alt={`${type} Media`} />
        ) : (
          <p>Unsupported file format</p>
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    Object.entries(form).forEach(([key, val]) => payload.append(key, val || ""));

    if (faultMedia) payload.append("faultMedia", faultMedia);
    if (actionMedia) payload.append("actionMedia", actionMedia);

    try {
      const res = await fetch(`${API_URL}/api/tickets/${ticket.id}`, {
        method: "PUT",
        body: payload,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("✅ Ticket updated");
        onTicketUpdated?.();
        onClose?.();
      } else {
        toast.error(data.message || "Failed to update ticket");
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Network or server error during update");
    }
  };

  return (
    <div className="edit-ticket-details-container">
      <div className="edit-ticket-details">
        <h2>Edit Ticket Details</h2>

        <label>Bus Stop Code:</label>
        <input
          type="text"
          value={form.busStopCode || ""}
          onChange={(e) => setForm({ ...form, busStopCode: e.target.value })}
        />

        <label>Viewer ID:</label>
        <input
          type="text"
          value={form.viewerId || ""}
          onChange={(e) => setForm({ ...form, viewerId: e.target.value })}
        />

        <label>Panel Type:</label>
        <input
          type="text"
          value={form.panelType || ""}
          onChange={(e) => setForm({ ...form, panelType: e.target.value })}
        />

        <label>Location:</label>
        <input
          type="text"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <label>Status:</label>
        <Select
          styles={selectStyles}
          options={statusOptions}
          value={statusOptions.find((o) => o.value === form.status)}
          onChange={(sel) => setForm({ ...form, status: sel?.value || "" })}
        />

        <label>Assigned To:</label>
        <Select
          styles={selectStyles}
          options={staffOptions}
          value={staffOptions.find((o) => o.value === form.assignedTo)}
          onChange={(sel) => setForm({ ...form, assignedTo: sel?.value || "" })}
          isClearable
        />

        <label>Root Cause:</label>
        <textarea
          value={form.rootCause || ""}
          onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
        />

        <label>Action Taken:</label>
        <textarea
          value={form.actionTaken || ""}
          onChange={(e) => setForm({ ...form, actionTaken: e.target.value })}
        />

        {/* Fault Media */}
        <label>Fault Media:</label>
        {ticket.faultMedia && renderMedia(ticket.faultMedia, "Fault")}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFaultMedia(e.target.files[0])}
        />

        {/* Action Media */}
        <label>Action Media:</label>
        {ticket.actionMedia && renderMedia(ticket.actionMedia, "Action")}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setActionMedia(e.target.files[0])}
        />
      </div>

      {/* Sticky Buttons */}
      <div className="form-buttons sticky-buttons">
        <button className="save-btn" onClick={handleSubmit}>
          Save Changes
        </button>
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
