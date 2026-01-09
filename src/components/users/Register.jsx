import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./scss/register.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setUser({ ...user, profilePicture: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const validateForm = () => {
    const { name, email, password, contactNumber } = user;

    // Name validation
    if (!name.trim()) {
      toast.error("Name is required.");
      return false;
    }

    // Email validation
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (email === "admin@galaxe.com") {
      toast.error("This email is not allowed for registration.");
      return false;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters, include a digit, a lowercase letter, and an uppercase letter."
      );
      return false;
    }

    // Contact number validation
    if (!contactNumber) {
      toast.error("Contact number is required.");
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      toast.error("Contact number must be a valid 10-digit number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // First register the user (JSON payload -- no file)
      const payload = {
        name: user.name,
        email: user.email,
        password: user.password,
        contactNumber: user.contactNumber,
      };

      const res = await axios.post(API_ENDPOINTS.REGISTER, payload);
      const registeredUser = res.data || {};
      const userId = registeredUser.userId || registeredUser.id || registeredUser._id;

      // If a profile picture was selected, upload it separately using the upload endpoint
      if (user.profilePicture && userId) {
        try {
          const fileData = new FormData();
          fileData.append("file", user.profilePicture);
          fileData.append("userId", userId);

          await axios.put(API_ENDPOINTS.UPLOAD_PROFILE_PICTURE, fileData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (uploadError) {
          console.error("Profile picture upload failed:", uploadError);
          Swal.fire("Warning", "User registered but profile picture upload failed.", "warning");
          // Continue to show success for registration
        }
      }

      Swal.fire("Success", "User Registered Successfully!", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration: ", error);
      // Prefer showing server provided message when available
      const serverMessage = error?.response?.data?.details || error?.response?.data?.message || error?.response?.data || error.message;
      Swal.fire("Error", serverMessage || "Error during registration. Please try again.", "error");
    }
  };

  return (
    <>
      <div className="register">
        <div className="register-card">
          <div className="left">
            <h1>Helping Hands</h1>
            <p>
              Join the HelpingHands Community! By registering, you can start
              your own fundraisers, contribute to the causes that matter to you,
              and connect with a community of passionate individuals dedicated
              to making a difference.
            </p>
            <span>Already have an account?</span>
              <button onClick={() => {
                navigate("/login");
              }}>Login</button>
          </div>
          <div className="right">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="contactNumber"
                  value={user.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                />
              </div>
              <div>
                <label htmlFor="profilePicture">Profile Picture (optional)</label>
                <input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Register;
