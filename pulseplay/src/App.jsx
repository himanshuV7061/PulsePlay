import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "./index.css";

const socket = io("http://localhost:5000");

function App() {
  const [events, setEvents] = useState([
    "🏏 Match Started: India vs Australia",
  ]);

  const [score, setScore] = useState(152);

  const [wickets, setWickets] = useState(3);

  const [momentum, setMomentum] =
    useState(65);

  const [notification, setNotification] =
    useState("");

  const [commentary, setCommentary] =
    useState(
      "AI: Match intensity rising rapidly 🔥"
    );

  const [predictionVisible, setPredictionVisible] =
    useState(false);

  const [points, setPoints] = useState(120);

  /* CHAT */

  const [chatInput, setChatInput] =
    useState("");

  const [messages, setMessages] = useState([
    {
      user: "Alex",
      text: "THIS MATCH IS INSANE 🔥",
    },
    {
      user: "Nilesh",
      text: "@alex bro Kohli is cooking 😭",
    },
  ]);

  /* LEADERBOARD */

  const leaderboard = [
    {
      name: "william",
      score: 120,
    },
    {
      name: "alex",
      score: 90,
    },
    {
      name: "dakota",
      score: 70,
    },
  ];

  useEffect(() => {
    socket.on("match-update", (event) => {
      setEvents((prev) => [
        event.text,
        ...prev,
      ]);

      if (event.score) {
        setScore(event.score);
      }

      if (event.wickets) {
        setWickets(event.wickets);
      }

      if (event.momentum) {
        setMomentum(event.momentum);
      }

      setCommentary(
        `AI: ${event.text} completely shifted the momentum.`
      );

      setNotification(event.text);

      setPredictionVisible(true);

      setTimeout(() => {
        setNotification("");
      }, 2500);

      setTimeout(() => {
        setPredictionVisible(false);
      }, 5000);
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [
        ...prev,
        message,
      ]);
    });

    return () => {
      socket.off("match-update");
      socket.off("receive-message");
    };
  }, []);

  const handlePrediction = (answer) => {
    setPredictionVisible(false);

    if (answer === "YES") {
      setPoints((prev) => prev + 20);

      setEvents((prev) => [
        "✅ Prediction Correct +20",
        ...prev,
      ]);
    } else {
      setEvents((prev) => [
        "❌ Wrong Prediction",
        ...prev,
      ]);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const messageData = {
      user: "Himanshu",
      text: chatInput,
    };

    socket.emit(
      "send-message",
      messageData
    );

    setChatInput("");
  };

  return (
    <div className="app">
      {/* Notification */}
      {notification && (
        <div className="notification">
          🚨 {notification}
        </div>
      )}

      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <h1>PulsePlay 🔥</h1>

          <p>
            Live Second-Screen Experience
          </p>
        </div>

        <div className="points">
          {points} PTS
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="dashboard">
        {/* LEFT */}
        <div className="left-panel">
          {/* MATCH */}
          <div className="glass-card">
            <div className="match-header">
              <h2>
                India 🇮🇳 vs Australia 🇦🇺
              </h2>

              <span className="live-pill">
                LIVE
              </span>
            </div>

            <div className="big-score">
              {score}/{wickets}
            </div>

            {/* STATS */}
            <div className="stats-row">
              <div className="stat-box">
                <h4>Run Rate</h4>
                <p>8.9</p>
              </div>

              <div className="stat-box">
                <h4>Win %</h4>
                <p>72%</p>
              </div>

              <div className="stat-box">
                <h4>Fans</h4>
                <p>12K</p>
              </div>
            </div>

            {/* MOMENTUM */}
            <div className="momentum-section">
              <p>Momentum</p>

              <div className="momentum-bar">
                <div
                  className="momentum-fill"
                  style={{
                    width: `${momentum}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* WAVE */}
            <div className="wave-container">
              <div className="wave"></div>
            </div>
          </div>

          {/* AI */}
          <div className="glass-card">
            <h3>🤖 AI Commentary</h3>

            <p className="commentary">
              {commentary}
            </p>
          </div>

          {/* FEED */}
          <div className="glass-card">
            <h3>📡 Live Feed</h3>

            <div className="feed">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="feed-item"
                >
                  {event}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          {/* PREDICTION */}
          {predictionVisible && (
            <div className="prediction-card">
              <span className="prediction-live">
                LIVE
              </span>

              <h2>
                Will next ball be boundary?
              </h2>

              <div className="prediction-buttons">
                <button
                  onClick={() =>
                    handlePrediction("YES")
                  }
                >
                  YES
                </button>

                <button
                  onClick={() =>
                    handlePrediction("NO")
                  }
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {/* CHAT */}
          <div className="glass-card chat-card">
            <h3>💬 Fan Chat</h3>

            <div className="chat-messages">
              {messages.map(
                (msg, index) => (
                  <div
                    key={index}
                    className="chat-message"
                  >
                    <strong>
                      {msg.user}:
                    </strong>{" "}
                    {msg.text}
                  </div>
                )
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type message..."
                value={chatInput}
                onChange={(e) =>
                  setChatInput(
                    e.target.value
                  )
                }
              />

              <button
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>

          {/* LEADERBOARD */}
          <div className="glass-card">
            <h3>🏆 Top Fans</h3>

            {leaderboard.map(
              (user, index) => (
                <div
                  key={index}
                  className="leader"
                >
                  <span>
                    {user.name}
                  </span>

                  <span>
                    {user.score}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;