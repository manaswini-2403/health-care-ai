import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddRecord({ setRecords }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    weight: "",
    heartRate: "",
    symptoms: "",
    other: "",
    notes: ""
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomsList = [
    "No Symptoms",
    "Headache",
    "Stomach Pain",
    "Back Pain",
    "Fever",
    "Cold",
    "Chest Pain", // ✅ Add Chest Pain for cardiologist triggers
    "Other"
  ];

  // handle text input changes
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // handle symptom toggles
  const toggleSymptom = (item) => {
    let updated;

    if (item === "No Symptoms") {
      // Selecting No Symptoms clears all other selections
      updated = selectedSymptoms.includes("No Symptoms") ? [] : ["No Symptoms"];
    } else {
      // Selecting any other symptom clears "No Symptoms"
      updated = selectedSymptoms.filter(s => s !== "No Symptoms");
      if (selectedSymptoms.includes(item)) {
        updated = updated.filter(s => s !== item);
      } else {
        updated = [...updated, item];
      }
    }

    setSelectedSymptoms(updated);
    setForm(prev => ({
      ...prev,
      symptoms: updated.join(", ")
    }));
  };

  // submit handler
  const handleSubmit = () => {
    const rawWeight = form.weight.trim();
    const rawHeart = form.heartRate.trim();

    if (!rawWeight || !rawHeart) {
      alert("⚠️ Please enter both weight and heart rate metrics.");
      return;
    }

    if (isNaN(rawWeight) || isNaN(rawHeart)) {
      alert("⚠️ Vitals must be numeric values.");
      return;
    }

    // Determine final symptoms string
    const finalSymptoms = selectedSymptoms.includes("No Symptoms")
      ? "No Symptoms"
      : selectedSymptoms.includes("Other")
      ? selectedSymptoms.filter(s => s !== "Other").join(", ") + (form.other ? (selectedSymptoms.length > 1 ? ", " : "") + form.other : "")
      : form.symptoms || "No Symptoms";

    const newRecord = {
      date: new Date().toLocaleString(),
      weight: parseFloat(rawWeight) + " kg",
      heartRate: parseInt(rawHeart) + " bpm",
      symptoms: finalSymptoms,
      notes: form.notes.trim()
    };

    setRecords(prev => [...prev, newRecord]);
    navigate("/records");
  };

  return (
    <div className="pageContainer">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontWeight: "800" }}>➕ Log New Health Record</h1>
        <button onClick={() => navigate("/")} className="backBtn" style={{ margin: 0, padding: "10px 20px" }}>
          ⬅ Home
        </button>
      </div>

      <div className="card">
        <h3 style={{ margin: "0 0 20px", color: "var(--primary-accent)", fontWeight: "700" }}>
          📊 Fill Daily Vitals Information
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ fontWeight: "700", fontSize: "14px" }}>Weight (kg) <span style={{ color: "var(--danger)" }}>*</span></label>
            <input
              name="weight"
              type="text"
              placeholder="e.g. 68.5"
              value={form.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: "700", fontSize: "14px" }}>Heart Rate (bpm) <span style={{ color: "var(--danger)" }}>*</span></label>
            <input
              name="heartRate"
              type="text"
              placeholder="e.g. 72"
              value={form.heartRate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SYMPTOMS SELECTOR */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: "700", fontSize: "14px", display: "block", marginBottom: "10px" }}>
            Select Symptoms (Select all that apply)
          </label>
          
          <div className="options">
            {symptomsList.map((item) => (
              <button
                key={item}
                type="button"
                className={`option ${selectedSymptoms.includes(item) ? "active" : ""}`}
                onClick={() => toggleSymptom(item)}
              >
                {item === "No Symptoms" ? "🟢 No Symptoms" : item}
              </button>
            ))}
          </div>

          {/* OTHER INPUT */}
          {selectedSymptoms.includes("Other") && (
            <input
              name="other"
              placeholder="Type specific symptoms details..."
              value={form.other}
              onChange={handleChange}
              style={{ marginTop: "15px" }}
            />
          )}
        </div>

        {/* HEALTH NOTES (PDR Objective 4 Integration) */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: "700", fontSize: "14px" }}>Health Notes & Observations</label>
          <textarea
            name="notes"
            placeholder="Describe how you are feeling, specific pain parameters, diet status, medication notes..."
            value={form.notes}
            onChange={handleChange}
            style={{ width: "100%", height: "120px", marginTop: "10px", resize: "none" }}
          />
        </div>

        <button 
          onClick={handleSubmit} 
          style={{ width: "100%", padding: "14px", borderRadius: "14px", fontSize: "16px", marginTop: "10px" }}
        >
          ✓ Complete & Save Vitals Record
        </button>
      </div>
    </div>
  );
}

export default AddRecord;