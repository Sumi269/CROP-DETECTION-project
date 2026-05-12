import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/chatbot.css";

export default function Chatbot() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hello Farmer! Ask me anything about crops, weather, or farming."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  // =============================
  // VOICE INPUT 🎤
  // =============================
  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognitionRef.current = recognition;
  };

  // =============================
  // SEND MESSAGE
  // =============================
  const sendMessage = async (textInput) => {

    const msg = textInput || input;

    if (!msg.trim()) return;

    const updated = [...messages, { role: "user", text: msg }];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {

      const res = await API.post("/chat", {
        message: msg
      });

      setMessages([
        ...updated,
        { role: "ai", text: res.data.reply }
      ]);

    } catch (err) {
      setMessages([
        ...updated,
        { role: "ai", text: "⚠ AI service failed" }
      ]);
    }

    setLoading(false);
  };

  // =============================
  // TEXT TO SPEECH 🔊
  // =============================
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <>
      <Navbar />

      <div className="chat-container">

        <h1>🌾 Smart Agriculture AI (ChatGPT Style)</h1>

        <div className="chat-box">

          {messages.map((m, i) => (
            <div key={i} className={m.role}>
              <p>{m.text}</p>

              {m.role === "ai" && (
                <button onClick={() => speak(m.text)}>
                  🔊
                </button>
              )}
            </div>
          ))}

          {loading && <p>🤖 Thinking...</p>}

        </div>

        <div className="chat-input">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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