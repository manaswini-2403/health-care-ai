import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Records({ records, setRecords }) {
  const navigate = useNavigate();

  // Modal State for Editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    weight: "",
    heartRate: "",
    symptoms: "",
    notes: ""
  });

  const handleDelete = (index) => {
    if (window.confirm("🗑 Are you sure you want to delete this health record?")) {
      const updated = records.filter((_, i) => i !== index);
      setRecords(updated);
    }
  };

  // Open Custom Modal
  const openEditModal = (index) => {
    const record = records[index];
    // Strip units for editing convenience
    const rawWeight = record.weight ? record.weight.replace(" kg", "") : "";
    const rawHeart = record.heartRate ? record.heartRate.replace(" bpm", "") : "";

    setEditingIndex(index);
    setEditForm({
      weight: rawWeight,
      heartRate: rawHeart,
      symptoms: record.symptoms || "No Symptoms",
      notes: record.notes || ""
    });
  };

  // Handle Edit Input changes
  const handleEditChange = (e) => {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Save Modal Changes
  const saveEdit = () => {
    const rawWeight = editForm.weight.trim();
    const rawHeart = editForm.heartRate.trim();

    if (!rawWeight || !rawHeart || isNaN(rawWeight) || isNaN(rawHeart)) {
      alert("⚠️ Please enter valid numeric values for weight and heart rate.");
      return;
    }

    const updated = [...records];
    updated[editingIndex] = {
      ...updated[editingIndex],
      weight: parseFloat(rawWeight) + " kg",
      heartRate: parseInt(rawHeart) + " bpm",
      symptoms: editForm.symptoms,
      notes: editForm.notes
    };

    setRecords(updated);
    setEditingIndex(null); // Close modal
  };

  // Dynamic status badges generator
  const renderHeartBadge = (heartRateStr) => {
    const hr = parseInt(heartRateStr);
    if (isNaN(hr)) return null;

    if (hr > 120) {
      return <span style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "4px 8px", borderRadius: "8px", fontWeight: "700", fontSize: "12px" }}>⚠️ High ({hr})</span>;
    }
    if (hr < 50) {
      return <span style={{ background: "rgba(76, 201, 240, 0.15)", color: "#00b4d8", padding: "4px 8px", borderRadius: "8px", fontWeight: "700", fontSize: "12px" }}>💤 Low ({hr})</span>;
    }
    return <span style={{ background: "var(--success-bg)", color: "var(--success)", padding: "4px 8px", borderRadius: "8px", fontWeight: "700", fontSize: "12px" }}>✓ Normal ({hr})</span>;
  };

  return (
    <div className="pageContainer">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontWeight: "800" }}>📊 Health Vitals Timeline</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/add")} style={{ padding: "10px 20px" }}>
            ➕ Add Record
          </button>
          <button onClick={() => navigate("/")} className="backBtn" style={{ margin: 0, padding: "10px 20px" }}>
            ⬅ Home
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: "0 0 15px", color: "var(--primary-accent)" }}>📂 Logged Health History</h3>
        <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: "14px" }}>
          Below is a record of your logged physiological vitals, registered symptoms, and health notes.
        </p>

        {records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px" }}>No vitals have been logged yet.</p>
            <button onClick={() => navigate("/add")}>Log Your First Record</button>
          </div>
        ) : (
          <div className="recordsWrapper">
            <table className="recordsTable">
              <thead>
                <tr>
                  <th>Logged Date</th>
                  <th>Weight (kg)</th>
                  <th>Heart Rate (bpm)</th>
                  <th>Symptoms Registered</th>
                  <th>Observation Notes</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>{item.date}</td>
                    <td style={{ fontWeight: "700" }}>{item.weight}</td>
                    <td>{renderHeartBadge(item.heartRate)}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {item.symptoms.split(", ").map((sym, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              background: sym === "No Symptoms" ? "var(--success-bg)" : "var(--bg-secondary)", 
                              color: sym === "No Symptoms" ? "var(--success)" : "var(--primary-accent)",
                              padding: "4px 8px", 
                              borderRadius: "10px", 
                              fontSize: "11px", 
                              fontWeight: "700" 
                            }}
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.notes || <i style={{ opacity: 0.5 }}>None</i>}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <button 
                        onClick={() => openEditModal(index)} 
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "8px" }}
                        title="Edit Record"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(index)} 
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "8px", marginLeft: "5px" }}
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOM EDIT MODAL DESIGN */}
      {editingIndex !== null && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>✏️ Edit Health Record</h2>
              <button className="modal-close" onClick={() => setEditingIndex(null)}>×</button>
            </div>
            
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontWeight: "700", fontSize: "14px" }}>Weight (kg)</label>
                <input
                  name="weight"
                  type="text"
                  placeholder="Weight (kg)"
                  value={editForm.weight}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label style={{ fontWeight: "700", fontSize: "14px" }}>Heart Rate (bpm)</label>
                <input
                  name="heartRate"
                  type="text"
                  placeholder="Heart Rate (bpm)"
                  value={editForm.heartRate}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label style={{ fontWeight: "700", fontSize: "14px" }}>Symptoms Registered</label>
                <input
                  name="symptoms"
                  type="text"
                  placeholder="Symptoms"
                  value={editForm.symptoms}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label style={{ fontWeight: "700", fontSize: "14px" }}>Health Observation Notes</label>
                <textarea
                  name="notes"
                  placeholder="Add health notes..."
                  value={editForm.notes}
                  onChange={handleEditChange}
                  style={{ height: "80px", resize: "none" }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "25px" }}>
              <button 
                onClick={() => setEditingIndex(null)} 
                style={{ background: "none", border: "1px solid var(--neutral-border)", color: "var(--text-primary)" }}
              >
                Cancel
              </button>
              <button onClick={saveEdit}>
                ✓ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;