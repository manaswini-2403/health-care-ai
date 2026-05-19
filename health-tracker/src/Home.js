import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Charts from "./Charts";
import ECGLine from "./ECGLine";

function Home({ records, appointments, profile }) {
  const navigate = useNavigate();

  // Active checkboxes for gamified reminders
  const [dailyReminders, setDailyReminders] = useState([
    { id: 1, text: "💧 Drink 3L of water today", completed: false },
    { id: 2, text: "💊 Take daily multi-vitamins", completed: false },
    { id: 3, text: "🚶 Achieve 10,000 steps goal", completed: false }
  ]);

  const toggleReminder = (id) => {
    setDailyReminders(prev => 
      prev.map(rem => rem.id === id ? { ...rem, completed: !rem.completed } : rem)
    );
  };

  const lastRecord = records.length > 0 ? records[records.length - 1] : null;

  // Extract numeric vitals for status styling
  const weight = lastRecord ? parseFloat(lastRecord.weight) : 0;
  const heartRate = lastRecord ? parseInt(lastRecord.heartRate) : 0;

  const weightStatus = weight > 85 ? "high" : weight > 0 ? "normal" : "";
  const heartStatus = heartRate > 120 ? "high" : heartRate > 0 && heartRate < 55 ? "low" : heartRate > 0 ? "normal" : "";

  // Time-based greetings helper
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good morning";
    if (hrs < 17) return "Good afternoon";
    return "Good evening";
  };

  // PDR objective 5: Dynamic Guidance
  const getSuggestion = (symptoms) => {
    if (!symptoms) return "";
    const lower = symptoms.toLowerCase();

    if (lower.includes("no symptoms")) {
      return "💚 Outstanding! You are in excellent condition. Keep up your active routine, maintain a balanced diet, and hit your daily hydration goals!";
    }
    if (lower.includes("chest pain")) {
      return "⚠️ CRITICAL WARNING: Chest pain can indicate a cardiac concern. Sit upright, avoid any strain, and call an ambulance immediately. Consider consulting our Cardiologist.";
    }
    if (lower.includes("fever")) {
      return "🌡️ Fever detected: Keep drinking fluids (water, soups), get plenty of rest, and take Paracetamol if needed. Consult our General Physician if fever persists beyond 3 days.";
    }
    if (lower.includes("headache")) {
      return "💆 Headache detected: Reduce screen exposure, rest in a quiet, dark room, and maintain hydration. Consult a General Physician if pain is sharp or recurring.";
    }
    if (lower.includes("stomach pain")) {
      return "🍲 Stomach pain noted: Keep meals extremely light, avoid dairy/spicy foods, drink warm herbal tea, and consult a General Physician if severe.";
    }
    if (lower.includes("back pain")) {
      return "🚶 Back pain noted: Avoid heavy lifting, maintain an ergonomic posture, perform very light stretches, and consult an Orthopedic specialist if movement is restricted.";
    }
    if (lower.includes("cold")) {
      return "🤧 Cold symptoms detected: Stay warm, perform warm water gargles, use a steam inhaler, and stay hydrated.";
    }
    return "💡 Symptom registered. Monitor your condition closely. Rest, stay hydrated, and consult the recommended specialist if symptoms worsen.";
  };

  return (
    <div className="pageContainer">
      {/* Dynamic Floating ECG Animations */}
      <ECGLine className="ecg1" />
      <ECGLine className="ecg2" />
      <ECGLine className="ecg3" />
      <ECGLine className="ecg4" />
      <ECGLine className="ecg5" />
      <ECGLine className="ecg6" />

      {/* Dynamic Emergency Vitals Trigger Warning (PDR Objective 8 Integration) */}
      {lastRecord && (heartRate > 120 || (heartRate > 0 && heartRate < 50)) && (
        <div className="alertBanner">
          <div className="alertLeft">
            <span className="alertIcon">🚨</span>
            <div className="alertText">
              <h3>Critical Vitals Warning</h3>
              <p>
                An abnormal heart rate of <b>{heartRate} bpm</b> was detected. Please rest, avoid physical exertion, and seek immediate assistance.
              </p>
            </div>
          </div>
          <button 
            className="alertBtn" 
            onClick={() => navigate("/doctor?emergency=true")}
          >
            🚨 Get Emergency Support
          </button>
        </div>
      )}

      {/* DASHBOARD HERO HEADER */}
      <div className="dashboardHero">
        <div>
          <h1>👋 {getGreeting()}, {profile.name}!</h1>
          <p>Here is your comprehensive health snapshot for today.</p>
        </div>
        <img
          src={profile.avatarUrl || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
          alt="User Profile Avatar"
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
          }}
        />
      </div>

      {/* DASHBOARD VITALS GRID */}
      <div className="dashboard">
        <div className={`dashCard ${weightStatus}`}>
          <img src="https://cdn-icons-png.flaticon.com/512/2966/2966482.png" alt="Weight Scale Icon" />
          <h3>Weight</h3>
          <p>{lastRecord ? lastRecord.weight : "--"}</p>
          <span className="hoverInfo">Last updated weight</span>
        </div>

        <div className={`dashCard ${heartStatus}`}>
          <img
            className="heartIcon"
            src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
            alt="Pulsing Heart Icon"
          />
          <h3>Heart Rate</h3>
          <p>{lastRecord ? lastRecord.heartRate : "--"}</p>
          <span className="hoverInfo">Live Rest BPM</span>
        </div>

        <div className="dashCard normal">
          <img src="https://cdn-icons-png.flaticon.com/512/4149/4149670.png" alt="Health Status Shield Icon" />
          <h3>Vitals Rating</h3>
          <p>
            {lastRecord
              ? heartStatus === "high" || heartStatus === "low" || weightStatus === "high"
                ? "Warning Alert"
                : "Perfect Stable"
              : "--"}
          </p>
          <span className="hoverInfo">Automatic diagnostic rating</span>
        </div>
      </div>

      {/* SUMMARY LAST RECORD CARD */}
      {lastRecord && (
        <div className="card">
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px", color: "var(--primary-accent)" }}>
            <span>🕒 Last Logged Record</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
            <p style={{ margin: 0 }}><b>Weight:</b> {lastRecord.weight}</p>
            <p style={{ margin: 0 }}><b>Heart Rate:</b> {lastRecord.heartRate}</p>
            <p style={{ margin: 0, gridColumn: "span 2" }}><b>Symptoms:</b> {lastRecord.symptoms}</p>
            {lastRecord.notes && (
              <p style={{ margin: 0, gridColumn: "span 2", fontSize: "14px", color: "var(--text-secondary)" }}>
                <b>Notes:</b> {lastRecord.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* DYNAMIC SYMPTOM GUIDANCE SUGGESTION */}
      {lastRecord && lastRecord.symptoms && (
        <div className="tipCard">
          <h3>💡 AI Health Guidance</h3>
          <p>{getSuggestion(lastRecord.symptoms)}</p>
        </div>
      )}

      {/* CHARTS GRAPH */}
      <Charts records={records} />

      {/* QUICK ACTION BUTTONS */}
      <h2 className="sectionTitle">⚡ Quick Health Actions</h2>
      <div className="actions">
        <div className="actionCard" onClick={() => navigate("/add")}>
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" alt="Add Vitals Icon" />
          <h4>Log Vitals</h4>
          <p>Add new records</p>
        </div>

        <div className="actionCard" onClick={() => navigate("/doctor")}>
          <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Consult Doctor Icon" />
          <h4>Consult Doctor</h4>
          <p>Book consultations</p>
        </div>

        <div className="actionCard" onClick={() => navigate("/medicine")}>
          <img src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png" alt="Buy Medicines Icon" />
          <h4>Order Pharmacy</h4>
          <p>Instant drug delivery</p>
        </div>
      </div>

      {/* DYNAMIC APPOINTMENT REMINDERS & CHECKLIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "35px" }}>
        
        {/* Dynamic Consultation Reminders */}
        <div className="tipCard" style={{ margin: 0 }}>
          <h3>🔔 Consultation Reminders</h3>
          {appointments.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No upcoming appointments scheduled.</p>
          ) : (
            appointments.map((appt, i) => (
              <p key={i}>
                📅 <b>{appt.doctor}</b> ({appt.specialization})<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{appt.date} at <b>{appt.time}</b> [{appt.mode}]
              </p>
            ))
          )}
        </div>

        {/* Dynamic Gamified Daily Vitals Checkoff */}
        <div className="tipCard" style={{ margin: 0 }}>
          <h3>✅ Interactive Daily Vitals</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
            {dailyReminders.map(rem => (
              <div 
                key={rem.id} 
                className="reminder-item" 
                onClick={() => toggleReminder(rem.id)}
              >
                <div className={`reminder-checkbox ${rem.completed ? "checked" : ""}`}>
                  {rem.completed && "✓"}
                </div>
                <span className={`reminder-text ${rem.completed ? "completed" : ""}`}>
                  {rem.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DAILY WELLNESS TIP */}
      <div className="tipCard">
        <h3>💡 Daily Wellness Tip</h3>
        <p>Ensure you rest 7-8 hours tonight. Premium cell recovery, cognitive restoration, and immune maintenance happen during deep REM sleep cycles! 🌙</p>
      </div>
    </div>
  );
}

export default Home;