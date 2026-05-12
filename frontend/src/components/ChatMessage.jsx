import React from "react";

export default function ChatMessage({ role, text }) {

  return (

    <div className={role === "user" ? "user-row" : "ai-row"}>

      <div
        className={
          role === "user"
            ? "user-bubble"
            : "ai-bubble"
        }
      >
        {text}
      </div>

    </div>
  );
}