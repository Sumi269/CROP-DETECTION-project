import React from "react";

export default function ProfileCard({
  preview,
  changeImage
}) {

  return (

    <div className="profile-card">

      <img
        src={preview}
        alt="profile"
      />

      <input
        type="file"
        onChange={changeImage}
      />

      <h1>Admin Profile</h1>

      <div className="profile-info">

        <p>
          <strong>Name:</strong> Admin
        </p>

        <p>
          <strong>Email:</strong> admin@gmail.com
        </p>

        <p>
          <strong>Role:</strong> System Administrator
        </p>

        <p>
          <strong>Access:</strong> Full Database Control
        </p>

      </div>

    </div>
  );
}