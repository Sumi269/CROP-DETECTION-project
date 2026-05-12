import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/chatbot.css";

export default function Chatbot() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hello Farmer! Ask me anything about crops, weather, fungus, fertilizers, or farming."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  // =============================
  // VOICE INPUT 🎤
  // =============================
  const startVoice = () => {

    try {

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Voice recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(text);
      };

      recognitionRef.current = recognition;

    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // SEND MESSAGE
  // =============================
  const sendMessage = async (textInput) => {

    const msg = textInput || input;

    if (!msg.trim()) return;

    // user message
    const updated = [
      ...messages,
      {
        role: "user",
        text: msg
      }
    ];

    setMessages(updated);

    setInput("");

    setLoading(true);

    try {

      console.log("SENDING:", msg);

      const res = await API.post("/api/chat",  {
        message: msg
      });

      console.log("RESPONSE:", res.data);

      setMessages([
        ...updated,
        {
          role: "ai",
          text:
            res.data.reply ||
            "🌾 No response from AI"
        }
      ]);

    } catch (err) {

      console.log("FULL ERROR:", err);

      setMessages([
        ...updated,
        {
          role: "ai",
          text:
            err?.response?.data?.error ||
            "⚠ Unable to fetch response. Server error."
        }
      ]);
    }

    setLoading(false);
  };

  // =============================
  // TEXT TO SPEECH 🔊
  // =============================
  const speak = (text) => {

    try {

      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = "en-US";
      speech.rate = 1;

      window.speechSynthesis.speak(speech);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-container">

        <h1>🌾 Smart Agriculture AI</h1>

        {/* CHAT BOX */}
        <div className="chat-box">

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "user" : "ai"}
            >

              <p>{m.text}</p>

              {m.role === "ai" && (
                <button
                  className="speak-btn"
                  onClick={() => speak(m.text)}
                >
                  🔊
                </button>
              )}

            </div>
          ))}

          {loading && (
            <div className="ai">
              <p>🤖 Thinking...</p>
            </div>
          )}

        </div>

        {/* INPUT */}
        <div className="chat-input">

          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={() => sendMessage()}>
            Send
          </button>

          <button onClick={startVoice}>
            🎤 Voice
          </button>

        </div>

      </div>
    </>
  );
}