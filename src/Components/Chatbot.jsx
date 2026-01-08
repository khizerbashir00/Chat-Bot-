import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const API_KEY = import.meta.env.VITE_OPENROUTER_KEY;

    // User message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Khizer Chatbot"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [{ role: "user", content: input }]
        })
      });

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content || "No reply received.";

      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "API Error. Please try again." }
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="container">

      {/* Sidebar */}
      <aside className="sidebar">
        <button className="menu-btn" aria-label="menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <button className="new-chat-btn" aria-label="new chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <div className="sidebar-bottom">
          <button className="settings-btn" aria-label="settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v6m0 6v10M1 12h6m6 0h10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="logo">ChatBot</div>
          <div className="header-actions">
            <button className="upgrade-btn">Upgrade to Google AI Plus</button>
            <div className="profile-icon">+</div>
          </div>
        </header>

        <div className="content-area">
          <div className="welcome-section">
            <h1 className="greeting">Hello, Chatbot</h1>

            {/* Input Box */}
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Ask Gemini"
                  className="search-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <div className="search-actions">
                  <button className="icon-btn add-btn">+</button>

                  <select className="model-select" defaultValue="2.5 Pro">
                    <option>2.5 Pro</option>
                    <option>2.0 Flash</option>
                    <option>1.5 Pro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chat Box */}
            <div className="chat-box">
              {messages.map((msg, i) => (
                <p key={i} className={msg.role}>
                  <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
                  {msg.content}
                </p>
              ))}

              {loading && <p>Bot is typing...</p>}
            </div>

            {/* Action Cards */}
            <div className="action-cards">
              <button className="action-card">Write</button>
              <button className="action-card">Build</button>
              <button className="action-card">Learn</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Chatbot;
