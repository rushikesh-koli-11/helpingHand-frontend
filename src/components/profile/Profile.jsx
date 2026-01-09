/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaUpload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import { CircularProgress } from "@mui/material";
import GoogleSignIn from "../Steps/GoogleSignIn";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: "",
    contactNumber: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId || "";

  useEffect(() => {
    if (!userId) {
      console.error("No userId found in localStorage");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(API_ENDPOINTS.GET_USER(userId));
        setUserData(userResponse.data);
        setUpdatedUserData({
          name: userResponse.data.name,
          contactNumber: userResponse.data.contactNumber,
        });

        const profileImageResponse = await axios.get(
          API_ENDPOINTS.POST_PROFILE_PICTURE_BY_USERID(userId)
        );
        if (profileImageResponse.data) {
          // Backend now returns Cloudinary URL (string) instead of Base64
          const imageUrl = profileImageResponse.data;
          // Check if it's already a URL or needs formatting
          if (imageUrl.startsWith("http")) {
            setPreviewUrl(imageUrl);
          } else {
            // Fallback for any edge cases
            setPreviewUrl(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching user data or profile image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || !userId) {
      Swal.fire("Please select a file and provide a user ID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await axios.put(
        API_ENDPOINTS.UPLOAD_PROFILE_PICTURE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.profilePicture) {
        // Backend now returns Cloudinary URL instead of byte array
        const imageUrl = response.data.profilePicture;
        setPreviewUrl(imageUrl);
      }

      Swal.fire("Success", "Profile uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Error", "Failed to upload file", "error");
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setUpdatedUserData({
      name: userData.name,
      contactNumber: userData.contactNumber,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!updatedUserData.name) {
      Swal.fire("Error", "Enter Name", "error");
      return false;
    }
    if (
      !updatedUserData.contactNumber ||
      updatedUserData.contactNumber.length !== 10
    ) {
      Swal.fire(
        "Error",
        "Contact Number must be exactly 10 characters long",
        "error"
      );
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
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_USER(userData.userId),
        updatedUserData
      );
      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container w-100">
        <CircularProgress />
      </div>
    );
  }

  if (!userData) {
    return <div className="container mt-5">No user data available.</div>;
  }

  return (
    <div className="profile-container fade-in">
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-image-container">
            <img
              src={
                previewUrl ||
                "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
              }
              alt="Profile"
              className="profile-image"
            />
          </div>
          <h1 className="profile-name">{userData.name}</h1>
          <br />
          <div className="button-group">
            {!editMode && (
              <button
                className="btn-creative btn-edit m-0"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            )}
            <Link
              to={`/donationHistory/${userId}`}
              className="btn-creative btn-donation"
            >
              Donation History
            </Link>
          </div>
        </div>
        <div className="profile-right">
          {editMode ? (
            <div className="edit-form slide-in">
              <h2>Edit Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={updatedUserData.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number:</label>
                  <input
                    type="number"
                    name="contactNumber"
                    value={updatedUserData.contactNumber}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="btn-creative btn-save">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-creative btn-cancel"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="info-section">
              <h2>Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <h3>Email</h3>
                  <p>{userData.email || "helpinghandsngo@gmail.com"}</p>
                </div>
                <div className="info-item">
                  <h3>Phone</h3>
                  <p>{userData.contactNumber}</p>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
              </div>

              <div className="upload-section">
                <form onSubmit={handleUpload}>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="file-upload"
                      className="file-input"
                    />
                    <label htmlFor="file-upload" className="file-label">
                      <FaUpload className="upload-icon" />
                      <span>Choose Profile Picture</span>
                    </label>
                  </div>
                  {file && (
                    <button type="submit" className="btn-creative btn-upload">
                      Update Profile Picture
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <GoogleSignIn /> */}
    </div>
  );
};

export default Profile;
