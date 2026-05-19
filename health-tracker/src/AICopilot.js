import { useState, useEffect, useRef } from "react";

function AICopilot({ profile, records, appointments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `👋 Hello! I am your **AI Health Copilot**. Ask me anything about your current vitals, medical records, or search clinical topics!\n\n*💡 Tip: Go to **Settings** to add a real **Google Gemini API Key** for active live AI intelligence!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchWebMode, setSearchWebMode] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages(prev => [...prev, { sender: "user", text: userText, timestamp: userTime }]);
    setInputValue("");
    setLoading(true);

    // Active AI/API Response logic
    try {
      const apiKey = profile?.geminiApiKey;
      let replyText = "";

      if (apiKey) {
        // --- LIVE GOOGLE GEMINI API FLOW ---
        // Build contextual prompt using active records/profile details
        const lastRecord = records && records.length > 0 ? records[records.length - 1] : null;
        
        let systemContext = `You are an expert AI Health Copilot integrated into "HealthApp", a premium personal health tracker dashboard.
User Profile: Name: ${profile.name}, Age: ${profile.age}, Gender: ${profile.gender}.
`;
        if (lastRecord) {
          systemContext += `Latest logged vitals: Weight: ${lastRecord.weight}, Heart Rate: ${lastRecord.heartRate}, Symptoms: ${lastRecord.symptoms}, Notes: ${lastRecord.notes}.\n`;
        }
        if (appointments && appointments.length > 0) {
          systemContext += `Upcoming consults: ${appointments.map(a => `${a.doctor} on ${a.date} at ${a.time}`).join("; ")}.\n`;
        }

        systemContext += `\nGuidelines: Give positive, supportive, medically-sound wellness coaching. Never claim to replace professional clinicians. Format responses using clean markdown (bold, bullet points). Keep answers concise and readable.`;

        let prompt = `${systemContext}\n\nUser Question: ${userText}`;

        if (searchWebMode) {
          prompt = `[Web Search Active] Search query: "${userText}"\n\n${prompt}\nInclude high-fidelity mock web search citations and links!`;
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData?.error?.message || "API Connection failed.");
        }

        const resData = await response.json();
        replyText = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";

      } else {
        // --- PREMIUM MOCK AI + WEB SEARCH RESPONDER ---
        // Simulate a slight network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lower = userText.toLowerCase();
        const lastRecord = records && records.length > 0 ? records[records.length - 1] : null;

        if (searchWebMode) {
          replyText = `🔍 **Simulated Web Search Results for:** "${userText}"\n\n* **[1] Mayo Clinic - Clinical Guidelines:** Standard protocols for registered physiological vitals recommend keeping a resting pulse between 60-100 bpm.\n* **[2] Harvard Health Publishing:** Routine hydration targets indicate drinking 2.7 to 3.7 liters of fluids daily to support kidney function.\n* **[3] National Institutes of Health (NIH):** Mild fever guidelines suggest rest and thermal regulation before considering clinical medications.\n\n*AI Summary:* Based on web intelligence, your symptoms are common. Rest, remain well hydrated, and contact emergency centers if you notice acute chest pain!`;
        } else if (lower.includes("vitals") || lower.includes("heart rate") || lower.includes("health")) {
          if (lastRecord) {
            replyText = `📊 **Analyzing Your Current Health Snapshot:**\n\n* Your latest logged **Heart Rate** is **${lastRecord.heartRate}**.\n* Your registered weight is **${lastRecord.weight}**.\n* Active symptoms logged: **${lastRecord.symptoms}**.\n\n${
              parseInt(lastRecord.heartRate) > 120 
                ? "⚠️ **Alert:** Your pulse is quite elevated! Please rest, stay seated, and consider consults with our Cardiologist." 
                : "💚 Your vitals look perfectly stable. Continue with your hydration checkoffs and daily walking routine!"
            }`;
          } else {
            replyText = `📊 I don't see any logged vitals history yet! Go to the **Log Vitals** quick-action button on the dashboard to log weight and heart rate metrics so I can analyze them.`;
          }
        } else if (lower.includes("fever") || lower.includes("cold")) {
          replyText = `🌡️ **Clinical Wellness Advice (Fever/Cold):**\n\n1. **Hydration:** Target drinking warm broths, herbal infusions, and 3L of water.\n2. **Thermoregulation:** Keep clothing light, avoid excess ambient heating, and rest.\n3. **Pharmacy:** If fever persists, consider Paracetamol (available in our **E-Pharmacy** catalog!).\n\n*💡 Consult Dr. Ananya Rao if symptoms persist beyond 3 days.*`;
        } else if (lower.includes("chest pain")) {
          replyText = `🚨 **CRITICAL EMERGENCY PROTOCOL:**\n\nChest pain symptoms can indicate cardiovascular strain. \n\n* **Action Plan:** Sit upright, avoid any strain, and **Dispatch an Ambulance** immediately using our dashboard's emergency center.\n* **Specialist:** We highly recommend booking an urgent slot with our Cardiologist **Dr. Priya Sharma**.`;
        } else if (lower.includes("diet") || lower.includes("water") || lower.includes("weight")) {
          replyText = `🍏 **Diet & Weight Management advice:**\n\n* Maintain consistent protein-to-carb ratios in your meals.\n* Drink water regularly at the **${profile.name || "Manaswini"}** setting intervals (configured for *Every 2 Hours*!).\n* Balance caloric deficits if aiming to trim resting weight. Keep up the high energy!`;
        } else {
          replyText = `🤖 **Copilot Insight:** Thank you for reaching out! I am fully aware of your profile (**${profile.name}**, **${profile.age} years old**).\n\nIf you want custom real-time generative responses, paste a Google Gemini API Key in the **Settings** panel! In the meantime, you can toggle the **Web Search** icon in the input row to fetch clinical search results!`;
        }
      }

      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: "ai", text: replyText, timestamp: aiTime }]);

    } catch (err) {
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev, 
        { 
          sender: "ai", 
          text: `❌ **Error Connecting to Gemini API:**\n\n${err.message || "Please check your network connection and ensure your API Key is correct in Settings."}`, 
          timestamp: errorTime 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Helper to render markdown-like lists and bolding
  const formatMessageText = (text) => {
    return text.split("\n").map((line, i) => {
      // Bold rendering
      let processed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      processed = processed.replace(boldRegex, "<strong>$1</strong>");
      
      // Italic rendering
      const italicRegex = /\*(.*?)\*/g;
      processed = processed.replace(italicRegex, "<em>$1</em>");

      if (line.startsWith("* ") || line.startsWith("- ")) {
        return <li key={i} dangerouslySetInnerHTML={{ __html: processed.substring(2) }} style={{ marginLeft: "15px", marginBottom: "4px" }} />;
      }
      if (line.match(/^\d+\.\s/)) {
        const content = processed.replace(/^\d+\.\s/, "");
        return <ol key={i} start={line.match(/^\d+/)[0]} style={{ marginLeft: "15px", marginBottom: "4px" }}><li dangerouslySetInnerHTML={{ __html: content }} /></ol>;
      }
      if (line.trim() === "") {
        return <div key={i} style={{ height: "8px" }} />;
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} style={{ margin: "0 0 6px 0" }} />;
    });
  };

  return (
    <>
      {/* FLOATING TRIGGER PILL */}
      <button 
        className={`copilot-trigger ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Copilot Chat"
        aria-label="Toggle AI Health Copilot Window"
      >
        <span className="copilot-icon">🤖</span>
        {!isOpen && <span className="copilot-badge-text">AI Copilot</span>}
        {isOpen && <span className="copilot-badge-text">Minimize</span>}
      </button>

      {/* CHAT WINDOW COMPONENT */}
      {isOpen && (
        <div className="copilot-window">
          <div className="copilot-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontWeight: "800", fontSize: "14px" }}>AI Health Copilot</h4>
                <span style={{ fontSize: "10px", opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#4cc9f0", borderRadius: "50%", display: "inline-block" }}></span>
                  {profile?.geminiApiKey ? "Connected via Gemini" : "Clinical Assistant Active"}
                </span>
              </div>
            </div>
            <button className="copilot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* MESSAGES BODY */}
          <div className="copilot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`copilot-bubble-row ${msg.sender}`}>
                <div className="copilot-bubble">
                  <div className="copilot-bubble-text">
                    {formatMessageText(msg.text)}
                  </div>
                  <div className="copilot-bubble-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="copilot-bubble-row ai">
                <div className="copilot-bubble">
                  <div className="typing-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="copilot-input-area">
            {/* Search Web Toggle */}
            <button 
              className={`copilot-search-toggle ${searchWebMode ? "active" : ""}`}
              onClick={() => setSearchWebMode(!searchWebMode)}
              title={searchWebMode ? "Web Search Active" : "Enable Web Search"}
            >
              🔍
            </button>
            
            <input
              type="text"
              placeholder={searchWebMode ? "Search medical web topics..." : "Ask clinical questions..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button className="copilot-send-btn" onClick={handleSend} disabled={loading}>
              ➔
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AICopilot;
