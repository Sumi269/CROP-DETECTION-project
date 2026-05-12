import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/profile.css";

export default function Profile() {

  const user =
    JSON.parse(localStorage.getItem("user")) || {

      name: "Admin User",

      email: "admin@gmail.com",

      role: "AI Agriculture Administrator",

      phone: "+91 9876543210",

      location: "Kolkata, India",

      bio:
        "Passionate about AI-powered agriculture systems, crop disease analytics, and smart farming innovation."

    };

  const [profile, setProfile] = useState({

    ...user,

    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"

  });

  // IMAGE
  const handleImage = (e) => {

    const file = e.target.files[0];

    if(file){

      setProfile({
        ...profile,
        image: URL.createObjectURL(file)
      });

    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };

  // SAVE
  const saveProfile = () => {

    localStorage.setItem(
      "user",
      JSON.stringify(profile)
    );

    alert("Profile Updated Successfully");

  };

  return (

    <div>

      <Navbar />

      <div className="profile-layout">

        <Sidebar />

        <div className="profile-page">

          {/* HERO */}

          <div className="profile-hero">

            {/* LEFT */}

            <div className="profile-left">

              <div className="image-wrapper">

                <img
                  src={profile.image}
                  alt=""
                  className="profile-image"
                />

              </div>

              <label className="upload-btn">

                Change Profile Photo

                <input
                  type="file"
                  hidden
                  onChange={handleImage}
                />

              </label>

            </div>

            {/* RIGHT */}

            <div className="profile-right">

              <h1>
                {profile.name}
              </h1>

              <p className="profile-role">
                {profile.role}
              </p>

              <p className="profile-bio">
                {profile.bio}
              </p>

              <div className="tag-box">

                <span>
                  🌱 Smart Farming
                </span>

                <span>
                  🤖 AI Analytics
                </span>

                <span>
                  📊 Crop Monitoring
                </span>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="profile-form-card">

            <h2>
              Edit Profile
            </h2>

            <div className="profile-grid">

              <div className="input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group full-width">

                <label>
                  Bio
                </label>

                <textarea
                  rows="5"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                />

              </div>

            </div>

            <button
              className="save-btn"
              onClick={saveProfile}
            >
              Save Profile
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}