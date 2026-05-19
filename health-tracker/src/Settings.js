import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings({ profile, setProfile, theme, toggleTheme }) {
  const navigate = useNavigate();

  // Local form state
  const [form, setForm] = useState({ ...profile });
  const [notifications, setNotifications] = useState(true);
  const [hydrationInterval, setHydrationInterval] = useState("Every 2 Hours");

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarSelect = (url) => {
    setForm(prev => ({
      ...prev,
      avatarUrl: url
    }));
  };

  const saveSettings = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("⚠️ Profile name and mobile number are required!");
      return;
    }

    setProfile(form);
    alert("✓ Settings and profile details saved successfully!");
    navigate("/");
  };

  // Mock Avatar List
  const avatars = [
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png", // Woman avatar
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Man avatar
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png", // Doctor avatar
    "https://cdn-icons-png.flaticon.com/512/1154/1154448.png"  // Child avatar
  ];

  return (
    <div className="pageContainer">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontWeight: "800" }}>⚙️ Personalize Settings</h1>
        <button onClick={() => navigate("/")} className="backBtn" style={{ margin: 0, padding: "10px 20px" }}>
          ⬅ Dashboard
        </button>
      </div>

      <div className="card">
        <div className="settings-grid">
          
          {/* PROFILE SECTION */}
          <div style={{ paddingRight: "15px" }}>
            <h3 style={{ margin: "0 0 20px", color: "var(--primary-accent)", fontWeight: "700" }}>👤 User Profile</h3>
            
            {/* Avatar Selector */}
            <div className="profile-avatar-row">
              <img src={form.avatarUrl} alt="Active User Avatar" />
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "5px" }}>
                  Choose Account Avatar:
                </label>
                <div className="avatar-selector">
                  {avatars.map((url, i) => (
                    <img 
                      key={i}
                      src={url}
                      alt={`Avatar option ${i + 1}`}
                      className={`avatar-opt ${form.avatarUrl === url ? "selected" : ""}`}
                      onClick={() => handleAvatarSelect(url)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700" }}>Full Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  placeholder="e.g. Manaswini" 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700" }}>Age</label>
                  <input 
                    name="age" 
                    type="number" 
                    value={form.age} 
                    onChange={handleChange} 
                    placeholder="e.g. 26"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700" }}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700" }}>Email ID</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="e.g. email@example.com" 
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700" }}>Mobile Number</label>
                <input 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210" 
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SYSTEM CONTROLS */}
          <div style={{ borderLeft: "1px solid var(--neutral-border)", paddingLeft: "25px" }}>
            <div className="settings-section">
              <h3>🚨 Emergency Contacts Setup</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 15px" }}>
                Used in the live Emergency SOS broadcast tracker.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700" }}>Emergency Contact Name</label>
                  <input 
                    name="emergencyContactName" 
                    value={form.emergencyContactName} 
                    onChange={handleChange}
                    placeholder="e.g. Father" 
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700" }}>Emergency Mobile Number</label>
                  <input 
                    name="emergencyContactPhone" 
                    value={form.emergencyContactPhone} 
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210" 
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>🤖 AI Engine Integration</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px" }}>
                Configure your Google Gemini API Key to enable real clinical responses in the AI Copilot.
              </p>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700" }}>Google Gemini API Key</label>
                <input 
                  name="geminiApiKey" 
                  type="password" 
                  value={form.geminiApiKey || ""} 
                  onChange={handleChange}
                  placeholder="AIzaSy..." 
                  style={{ width: "100%", marginTop: "5px" }}
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>🎨 Visual & Notification Settings</h3>
              
              {/* Dynamic Theme Toggle Switch */}
              <div className="toggle-row">
                <div>
                  <b style={{ fontSize: "15px" }}>Dark Mode Theme</b>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                    Toggle dark screen visual layouts
                  </p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={theme === "dark"} 
                    onChange={toggleTheme} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Notification Switch */}
              <div className="toggle-row">
                <div>
                  <b style={{ fontSize: "15px" }}>Dynamic Sound Notifications</b>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                    Play audio sounds on warnings
                  </p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={() => setNotifications(!notifications)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Hydration Dropdown */}
              <div style={{ marginTop: "15px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700" }}>Hydration Reminders Interval</label>
                <select 
                  value={hydrationInterval} 
                  onChange={(e) => setHydrationInterval(e.target.value)}
                >
                  <option value="Every 1 Hour">Every 1 Hour</option>
                  <option value="Every 2 Hours">Every 2 Hours</option>
                  <option value="Every 3 Hours">Every 3 Hours</option>
                  <option value="Disabled">Disable water prompts</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <button 
          onClick={saveSettings} 
          style={{ width: "100%", padding: "14px", borderRadius: "14px", fontSize: "16px", marginTop: "30px" }}
        >
          ✓ Synchronize Profile & System Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;