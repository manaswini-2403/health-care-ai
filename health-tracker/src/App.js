import { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AddRecord from "./AddRecord";
import Home from "./Home";
import Doctor from "./Doctor";
import Login from "./Login";
import Medicine from "./Medicine";
import Navbar from "./Navbar";
import Records from "./Records";
import Settings from "./Settings";
import Signup from "./Signup";
import AICopilot from "./AICopilot";

// Helper keys for LocalStorage
const STORAGE_KEYS = {
  RECORDS: "healthapp_records",
  APPOINTMENTS: "healthapp_appointments",
  PRESCRIPTIONS: "healthapp_prescriptions",
  PROFILE: "healthapp_profile",
  THEME: "healthapp_theme"
};

function App() {
  // --- 1. DEFAULT PROFILE INITIALIZATION ---
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : {
      name: "Manaswini",
      email: "manaswini@example.com",
      age: 26,
      gender: "Female",
      phone: "+91 98765 43210",
      emergencyContactName: "Father",
      emergencyContactPhone: "+91 91234 56789",
      avatarUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
    };
  });

  // --- 2. DEFAULT RECORDS INITIALIZATION ---
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : [
      {
        date: "5/10/2026, 10:00:00 AM",
        weight: "68 kg",
        heartRate: "72 bpm",
        symptoms: "No Symptoms",
        notes: "Felt very energetic today. Drinking 3L water."
      },
      {
        date: "5/15/2026, 3:30:00 PM",
        weight: "67.5 kg",
        heartRate: "85 bpm",
        symptoms: "Headache",
        notes: "Mild headache after long screen hours. Slept early."
      }
    ];
  });

  // --- 3. DEFAULT APPOINTMENTS INITIALIZATION ---
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : [
      {
        doctor: "Dr. Ananya Rao",
        specialization: "General Physician",
        date: "2026-05-20",
        time: "3:00 PM",
        mode: "Online"
      }
    ];
  });

  // --- 4. DEFAULT PRESCRIPTIONS INITIALIZATION ---
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : [
      {
        date: "5/5/2026, 11:20:00 AM",
        doctor: "Dr. Ananya Rao",
        fileName: "crocin_prescription.pdf",
        notes: "Crocin 650mg for mild fever. Take twice a day after meals."
      },
      {
        date: "5/12/2026, 4:45:00 PM",
        doctor: "Dr. Priya Sharma",
        fileName: "ecg_report_may.pdf",
        notes: "Routine cardiovascular checkup report. Vitals normal."
      }
    ];
  });

  // --- 5. THEME SYSTEM INITIALIZATION ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || "light";
  });

  // --- EFFECTS FOR PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      {/* GLOBAL FLOATING BACKGROUND SPHERES */}
      <div className="bgCircle bg1"></div>
      <div className="bgCircle bg2"></div>
      <div className="bgCircle bg3"></div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              records={records} 
              appointments={appointments} 
              setAppointments={setAppointments} 
              profile={profile} 
            />
          } 
        />
        <Route
          path="/records"
          element={<Records records={records} setRecords={setRecords} />}
        />
        <Route
          path="/add"
          element={<AddRecord setRecords={setRecords} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/settings" 
          element={
            <Settings 
              profile={profile} 
              setProfile={setProfile} 
              theme={theme} 
              toggleTheme={toggleTheme} 
            />
          } 
        />
        <Route 
          path="/doctor" 
          element={
            <Doctor 
              records={records} 
              appointments={appointments} 
              setAppointments={setAppointments}
              prescriptions={prescriptions}
              setPrescriptions={setPrescriptions}
              profile={profile}
            />
          } 
        />
        <Route path="/medicine" element={<Medicine />} />
      </Routes>

      <AICopilot profile={profile} records={records} appointments={appointments} />
    </Router>
  );
}

export default App;