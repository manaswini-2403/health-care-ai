import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Doctor({ records, appointments, setAppointments, prescriptions, setPrescriptions, profile }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Core Booking States
  const [consultType, setConsultType] = useState("Online");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [justBooked, setJustBooked] = useState(null);

  // Upload States
  const [uploadNote, setUploadNote] = useState("");
  const fileInputRef = useRef(null);

  // Emergency Modal States
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyTab, setEmergencyTab] = useState("ambulance");
  const [dispatchStep, setDispatchStep] = useState(0); // 0: Requesting, 1: Dispatched, 2: Arriving
  const [ambulanceETA, setAmbulanceETA] = useState(8);
  const [sosSent, setSosSent] = useState(false);
  const dispatchTimerRef = useRef(null);
  const etaTimerRef = useRef(null);

  // Static Doctors Data
  const doctors = [
    {
      name: "Dr. Ananya Rao",
      specialization: "General Physician",
      rating: "4.9",
      experience: "8 Years",
      image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      rating: "4.8",
      experience: "12 Years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Dr. Rahul Verma",
      specialization: "Orthopedic",
      rating: "4.7",
      experience: "10 Years",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
    }
  ];

  // Static Time slots
  const slots = ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  // Nearby Hospital Mock Data
  const hospitals = [
    { name: "City Cardiology Center", distance: "1.2 km", phone: "+91 99998 88812", specialty: "Cardiac Emergency Support" },
    { name: "Metro Trauma & General Hospital", distance: "2.8 km", phone: "+91 99998 88828", specialty: "24/7 Level 1 Trauma Care" },
    { name: "Central Mercy Care Clinic", distance: "4.1 km", phone: "+91 99998 88841", specialty: "Pediatric & General OPD" }
  ];

  // 1. Dynamic AI Specialist Recommendation based on active symptoms
  const lastRecord = records.length > 0 ? records[records.length - 1] : null;
  const activeSymptoms = lastRecord ? lastRecord.symptoms : "No Symptoms";

  const getAIRecommendation = () => {
    const sym = activeSymptoms.toLowerCase();
    if (sym.includes("chest pain")) {
      return {
        specialty: "Cardiologist",
        doctorName: "Dr. Priya Sharma",
        reason: "⚠️ Alert: Chest pain registered in your latest vitals. Immediate Cardiologist review is critical."
      };
    }
    if (sym.includes("back pain")) {
      return {
        specialty: "Orthopedic",
        doctorName: "Dr. Rahul Verma",
        reason: "Back pain symptoms registered. An Orthopedic specialist consultation is recommended for posture/stretches."
      };
    }
    if (sym.includes("fever") || sym.includes("headache") || sym.includes("cold") || sym.includes("stomach pain")) {
      return {
        specialty: "General Physician",
        doctorName: "Dr. Ananya Rao",
        reason: "Fever, cold, headache, or abdominal pain logged. A General Physician checkup is advised."
      };
    }
    return {
      specialty: "General Physician",
      doctorName: "Dr. Ananya Rao",
      reason: "No active critical symptoms logged. A general health review helps maintain your stable vitals."
    };
  };

  const recommendation = getAIRecommendation();

  // Quick Book Suggested Doctor
  const handleQuickBook = () => {
    setSelectedDoctor(recommendation.doctorName);
    setSelectedTime("10:00 AM");
    
    // Set date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);

    alert(`🤖 AI Choice: Pre-selected ${recommendation.doctorName} (10:00 AM, Tomorrow). Click "Book Appointment" to confirm.`);
  };

  // Trigger Emergency modal on Mount if URL contains ?emergency=true
  useEffect(() => {
    if (searchParams.get("emergency") === "true") {
      triggerEmergency("ambulance");
    }
  }, [searchParams]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (dispatchTimerRef.current) clearTimeout(dispatchTimerRef.current);
      if (etaTimerRef.current) clearInterval(etaTimerRef.current);
    };
  }, []);

  // Trigger Smart Emergency Modal
  const triggerEmergency = (tabName) => {
    setEmergencyTab(tabName);
    setEmergencyOpen(true);
    setSosSent(false);

    if (tabName === "ambulance") {
      setDispatchStep(0);
      setAmbulanceETA(8);

      if (dispatchTimerRef.current) clearTimeout(dispatchTimerRef.current);
      if (etaTimerRef.current) clearInterval(etaTimerRef.current);

      // Simulate ambulance progress
      dispatchTimerRef.current = setTimeout(() => {
        setDispatchStep(1); // Ambulance Dispatched
        
        etaTimerRef.current = setInterval(() => {
          setAmbulanceETA(prev => {
            if (prev <= 1) {
              setDispatchStep(2); // Ambulance Arrived
              clearInterval(etaTimerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 8000); // countdown speed
      }, 3000);
    }
  };

  // Book Appointment
  const handleBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("⚠️ Please select doctor, date, and consultation time.");
      return;
    }

    const docObj = doctors.find(d => d.name === selectedDoctor);

    const newAppointment = {
      doctor: selectedDoctor,
      specialization: docObj ? docObj.specialization : "General Physician",
      date: selectedDate,
      time: selectedTime,
      mode: consultType
    };

    setAppointments(prev => [...prev, newAppointment]);
    setJustBooked(newAppointment);

    // Reset inputs
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Mock upload of prescription file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newPresc = {
      date: new Date().toLocaleString(),
      doctor: selectedDoctor || "Self Upload",
      fileName: file.name,
      notes: uploadNote.trim() || "Prescription report uploaded."
    };

    setPrescriptions(prev => [...prev, newPresc]);
    setUploadNote("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    alert(`💊 File "${file.name}" uploaded successfully and linked to your timeline!`);
  };

  // Send Mock SOS Message
  const sendSosSignal = () => {
    setSosSent(true);
    setTimeout(() => {
      alert(`⚠️ SOS BROADCAST SUCCESS: Coordinates shared with ${profile.emergencyContactName} (${profile.emergencyContactPhone}). Emergency responders notified!`);
    }, 1500);
  };

  // 2. Chronological Medical History Timeline Merger
  const getTimelineItems = () => {
    const items = [];

    // Parse Vitals Records
    records.forEach(rec => {
      items.push({
        type: "record",
        timestamp: Date.parse(rec.date) || new Date(rec.date).getTime() || 0,
        title: "📊 Vitals Record Logged",
        subtitle: `Weight: ${rec.weight} | Heart Rate: ${rec.heartRate}`,
        pill: rec.symptoms,
        notes: rec.notes,
        rawDate: rec.date
      });
    });

    // Parse Uploaded Prescriptions
    prescriptions.forEach(pre => {
      items.push({
        type: "prescription",
        timestamp: Date.parse(pre.date) || new Date(pre.date).getTime() || 0,
        title: "💊 Prescription Uploaded",
        subtitle: `Linked File: ${pre.fileName}`,
        pill: `Dr: ${pre.doctor}`,
        notes: pre.notes,
        rawDate: pre.date
      });
    });

    // Parse Appointments
    appointments.forEach(appt => {
      const apptTimestamp = Date.parse(`${appt.date} ${appt.time}`) || new Date(appt.date).getTime() || 0;
      items.push({
        type: "appointment",
        timestamp: apptTimestamp,
        title: "⏰ Consultation Scheduled",
        subtitle: `Doctor: ${appt.doctor} (${appt.specialization})`,
        pill: appt.mode,
        notes: `Consultation confirmed at ${appt.time}`,
        rawDate: appt.date
      });
    });

    // Sort chronologically descending
    return items.sort((a, b) => b.timestamp - a.timestamp);
  };

  const timelineItems = getTimelineItems();

  return (
    <div className="pageContainer">
      {/* CONSULTATION HERO */}
      <div className="doctorHero">
        <div>
          <h1>🩺 Professional Consultation</h1>
          <p>Schedule dynamic specialist appointments and upload medical histories.</p>
        </div>
      </div>

      {/* DYNAMIC AI CONSULT SPECIALIST ADVICE BOX */}
      <div className="aiBox">
        <div className="aiLeft" style={{ maxWidth: "70%" }}>
          <h2>🤖 AI Clinical Recommendation</h2>
          <p style={{ margin: "5px 0 0", fontSize: "15px", lineHeight: "1.4" }}>
            Based on registered symptoms (<b>{activeSymptoms}</b>):<br />
            {recommendation.reason}
          </p>
        </div>
        <button className="aiBookBtn" onClick={handleQuickBook}>
          ⚡ Auto-Book Recommended Doctor
        </button>
      </div>

      {/* CONSULTATION SETTING MODE */}
      <div className="consultBox">
        <button
          className={`consultBtn ${consultType === "Online" ? "activeConsult" : ""}`}
          onClick={() => setConsultType("Online")}
        >
          📹 Live Video Consultation (Online)
        </button>
        <button
          className={`consultBtn ${consultType === "Offline" ? "activeConsult" : ""}`}
          onClick={() => setConsultType("Offline")}
        >
          🏥 In-Clinic Checkup (Offline)
        </button>
      </div>

      {/* DATE SELECTOR & APPOINTMENT RESERVER */}
      <div className="dateBox" style={{ background: "var(--card-bg)", padding: "28px", borderRadius: "24px", marginBottom: "30px", border: "1px solid var(--card-border)" }}>
        <h3 style={{ margin: "0 0 15px", fontWeight: "700" }}>📅 Choose Consultation Schedule</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Select Time Slot</label>
            <div className="slotContainer">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  className={`slotBtn ${selectedTime === slot ? "activeSlot" : ""}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DOCTORS GRID SELECTION */}
      <h2 className="sectionTitle">👨‍⚕️ Choose Medical Specialist</h2>
      <div className="doctorGrid">
        {doctors.map((doc, index) => (
          <div className="doctorCard" key={index}>
            <img src={doc.image} alt={doc.name} />
            <h3>{doc.name}</h3>
            <p className="specialty">{doc.specialization}</p>
            <div className="rating-exp">
              <span>⭐ {doc.rating} Rating</span>
              <span>•</span>
              <span>{doc.experience} Exp</span>
            </div>
            <button
              className={`selectDoctor ${selectedDoctor === doc.name ? "activeDoctor" : ""}`}
              onClick={() => setSelectedDoctor(doc.name)}
            >
              {selectedDoctor === doc.name ? "Specialist Pre-Selected ✓" : "Choose Specialist"}
            </button>
          </div>
        ))}
      </div>

      {/* BOOK BUTTON */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button onClick={handleBooking} className="bookBtn" style={{ padding: "15px 40px", borderRadius: "30px", fontSize: "16px" }}>
          Confirm Consultation Booking
        </button>
      </div>

      {/* SUCCESS CONFIRMATION BOX */}
      {justBooked && (
        <div className="successBox" style={{ marginBottom: "35px" }}>
          <h2>✅ Consultation Booking Confirmed</h2>
          <p>
            Your appointment with <b>{justBooked.doctor}</b> on <b>{justBooked.date}</b> at <b>{justBooked.time}</b> ({justBooked.mode}) has been booked. Reminder linked to your Dashboard!
          </p>
        </div>
      )}

      {/* PDR OBJECTIVE 8: EMERGENCY SUPPORT SYSTEM */}
      <div className="emergencyBox">
        <h2>🚨 Emergency Medical Assistance</h2>
        <p style={{ margin: "5px 0 0", fontSize: "15px" }}>
          If you are experiencing critical discomfort or dynamic vital alarms, trigger emergency responses instantly.
        </p>
        <div className="emergencyButtons">
          <button onClick={() => triggerEmergency("ambulance")}>📞 Dispatch Ambulance</button>
          <button onClick={() => triggerEmergency("hospitals")}>🏥 Locate Nearby Hospitals</button>
          <button onClick={() => triggerEmergency("sos")}>👨‍👩‍👧 Broadcast SOS Signal</button>
        </div>
      </div>

      {/* PDR OBJECTIVE 9: PRESCRIPTION FILE LOADER */}
      <div className="uploadBox">
        <h2 style={{ margin: "0 0 10px", fontWeight: "800" }}>💊 Central Prescription Repository</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 20px" }}>
          Upload new clinical advice reports or prescriptions to chronologically link them with your timeline records.
        </p>
        <textarea
          placeholder="Add clinical directions or prescription dosage notes (e.g. Crocin 650mg, 1-0-1)..."
          value={uploadNote}
          onChange={(e) => setUploadNote(e.target.value)}
          style={{ height: "70px", resize: "none", marginBottom: "15px" }}
        />
        <br />
        <label className="custom-file-upload">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.png,.jpg,.jpeg" 
          />
          📂 Upload Medical Document (PDF/Image)
        </label>
      </div>

      {/* PDR OBJECTIVE 9: CHRONOLOGICAL UNIFIED MEDICAL TIMELINE */}
      <div className="timelineBox">
        <h2 style={{ margin: "0", fontWeight: "800" }}>📄 Complete Medical History Timeline</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "5px 0 0" }}>
          A chronological directory merging vitals logs, clinician appointments, and prescription uploads.
        </p>

        {timelineItems.length === 0 ? (
          <p style={{ textAlign: "center", margin: "30px 0", color: "var(--text-secondary)" }}>No timeline logs registered.</p>
        ) : (
          <div className="timelineList">
            {timelineItems.map((item, idx) => (
              <div key={idx} className={`timelineItem ${item.type === "prescription" ? "prescriptionItem" : ""}`}>
                <div className="timelineContent">
                  <div className="timelineLeft">
                    <h4 style={{ color: item.type === "record" ? "var(--text-primary)" : "var(--primary-accent)" }}>
                      {item.title}
                    </h4>
                    <p>{item.subtitle}</p>
                    {item.notes && (
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        <i>Note: {item.notes}</i>
                      </p>
                    )}
                  </div>
                  <div className="timelineRight">
                    {item.pill}
                    <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px", textAlign: "right" }}>{item.rawDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center" }}>
        <button className="backBtn" onClick={() => navigate("/")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* SMART EMERGENCY MODAL COMPONENT */}
      {emergencyOpen && (
        <div className="modal-backdrop" onClick={() => setEmergencyOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2 style={{ color: "var(--danger)" }}>🚨 Smart Emergency Center</h2>
              <button className="modal-close" onClick={() => setEmergencyOpen(false)}>×</button>
            </div>

            <div className="emergency-tabs">
              <button 
                className={`emergency-tab-btn ${emergencyTab === "ambulance" ? "active" : ""}`}
                onClick={() => triggerEmergency("ambulance")}
              >
                🚑 Ambulance Dispatch
              </button>
              <button 
                className={`emergency-tab-btn ${emergencyTab === "hospitals" ? "active" : ""}`}
                onClick={() => setEmergencyTab("hospitals")}
              >
                🏥 Find Nearby Hospitals
              </button>
              <button 
                className={`emergency-tab-btn ${emergencyTab === "sos" ? "active" : ""}`}
                onClick={() => setEmergencyTab("sos")}
              >
                👨‍👩‍👧 SOS Alert Broadcast
              </button>
            </div>

            <div className="modal-body" style={{ minHeight: "220px" }}>
              {/* TAB 1: Ambulance Dispatch Simulation */}
              {emergencyTab === "ambulance" && (
                <div className="dispatch-tracker">
                  <div className="radar-circle">🚑</div>
                  
                  {dispatchStep === 0 && (
                    <div>
                      <h3>Locating Ambulance Responders...</h3>
                      <p style={{ color: "var(--text-secondary)" }}>Pinging GPS tracking systems for closest hospital ambulance vehicle...</p>
                    </div>
                  )}

                  {dispatchStep === 1 && (
                    <div>
                      <h3 style={{ color: "var(--danger)" }}>Ambulance En-Route!</h3>
                      <p>A cardiac ambulance vehicle from <b>City General Hospital</b> has been dispatched.</p>
                      <h2 style={{ margin: "10px 0", color: "var(--primary-accent)" }}>ETA: {ambulanceETA} Mins</h2>
                    </div>
                  )}

                  {dispatchStep === 2 && (
                    <div>
                      <h3 style={{ color: "var(--success)" }}>Ambulance Arrived</h3>
                      <p>The medical dispatch team has reached your registered coordinates.</p>
                    </div>
                  )}

                  <div className="dispatch-timeline">
                    <div className={`dispatch-step ${dispatchStep >= 0 ? "completed" : "active"}`}>
                      <div className="dispatch-dot">1</div>
                      <p>Requested</p>
                    </div>
                    <div className={`dispatch-step ${dispatchStep > 0 ? "completed" : dispatchStep === 0 ? "active" : ""}`}>
                      <div className="dispatch-dot">2</div>
                      <p>En Route</p>
                    </div>
                    <div className={`dispatch-step ${dispatchStep === 2 ? "completed" : ""}`}>
                      <div className="dispatch-dot">3</div>
                      <p>Arrived</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Nearby Hospital Directory */}
              {emergencyTab === "hospitals" && (
                <div className="hospital-list">
                  <h3>🏥 Closest Emergency Facilities</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "15px" }}>
                    Location tracking shared. The following institutions have active ICU beds available:
                  </p>
                  {hospitals.map((hosp, i) => (
                    <div key={i} className="hospital-card">
                      <div>
                        <h4 style={{ margin: 0 }}>{hosp.name}</h4>
                        <p style={{ fontSize: "13px", opacity: 0.8 }}>📍 {hosp.distance} away | <b>{hosp.specialty}</b></p>
                      </div>
                      <button 
                        style={{ padding: "8px 14px", background: "none", border: "1px solid var(--danger)", color: "var(--danger)", fontSize: "13px" }}
                        onClick={() => alert(`Dialing emergency desk at ${hosp.name}: ${hosp.phone}`)}
                      >
                        📞 Call Desk
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: SOS Broadcast */}
              {emergencyTab === "sos" && (
                <div style={{ textAlign: "center" }}>
                  <h3>👨‍👩‍👧 Emergency Contacts Broadcast</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    Immediately send your dynamic vital parameters and GPS map links to registered family members.
                  </p>

                  <div className="sos-list" style={{ maxWidth: "350px", margin: "0 auto 25px", textAlign: "left" }}>
                    <div className="sos-row">
                      <span>👤 {profile.emergencyContactName} (Emergency)</span>
                      <b>{profile.emergencyContactPhone}</b>
                    </div>
                  </div>

                  {!sosSent ? (
                    <button 
                      onClick={sendSosSignal} 
                      className="bookBtn" 
                      style={{ background: "linear-gradient(135deg, #d90429, #ef233c)", padding: "15px 30px", animation: "radarPulse 1.5s infinite" }}
                    >
                      ⚠️ BROADCAST SOS ALERTS NOW
                    </button>
                  ) : (
                    <div className="successBox">
                      <h3 style={{ color: "var(--success)", margin: 0 }}>✓ SOS ALERT SUCCESS</h3>
                      <p style={{ fontSize: "14px", marginTop: "5px" }}>
                        Broadcast details: Heart Rate ({lastRecord ? lastRecord.heartRate : "--"}) and location maps sent to {profile.emergencyContactName}!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ textAlign: "right", marginTop: "25px", borderTop: "1px solid var(--neutral-border)", paddingTop: "15px" }}>
              <button className="backBtn" onClick={() => setEmergencyOpen(false)} style={{ margin: 0, padding: "10px 25px" }}>
                Close Responding Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctor;