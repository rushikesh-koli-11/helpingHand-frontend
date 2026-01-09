import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";
import "./details/styles/CreateFund.css";
import "../styles/common-styles.css";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

const CreateFundraiserForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [userId, setUserId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const userIdFromLocalstorage = JSON.parse(
    localStorage.getItem("user")
  ).userId;

  const fetchUser = async () => {
    try {
      if (userIdFromLocalstorage) {
        setUserId(userIdFromLocalstorage);
      } else {
        setError("Current user not found");
      }
    } catch (err) {
      setError("Error fetching current user");
    }
  };

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire("Error", "User not found.", "error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const fundraiserDTO = {
      title,
      description,
      goalAmount: Number.parseFloat(goalAmount),
      currentAmount: Number.parseFloat(currentAmount),
      userId,
      status: "pending",
      mobileNumber,
    };



    try {
      await axios.post(API_ENDPOINTS.GET_FUNDRAISER, fundraiserDTO);
      Swal.fire("Success", "Fundraiser created successfully", "success");
      resetForm();
      navigate("/fundraiser-details");
    } catch (err) {
      Swal.fire("Error", "Error creating fundraiser", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (title.length < 5) {
      Swal.fire("Error", "Title must be at least 5 characters long", "error");
      return false;
    }
    if (description.length < 20) {
      Swal.fire(
        "Error",
        "Description must be at least 20 characters long",
        "error"
      );
      return false;
    }
    if (Number.parseInt(goalAmount) <= 0) {
      Swal.fire("Error", "Goal amount must be greater than 0", "error");
      return false;
    }
    if (Number.parseFloat(currentAmount) < 0) {
      Swal.fire("Error", "Current amount cannot be negative", "error");
      return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      Swal.fire(
        "Error",
        "Please enter a valid 10-digit mobile number",
        "error"
      );
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGoalAmount("");
    setCurrentAmount("");
    setMobileNumber("");
  };

  return (
    <div
      className="create-fund fixfromtop container animate__animated animate__fadeIn"
      style={{ marginTop: "70px" }}
    >
      <Typography variant="h4" align="center" gutterBottom color="#005c5b">
        Create Fund
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form
        onSubmit={handleSubmit}
        className="createfund-outer-div needs-validation p-3"
        noValidate
      >
        <div className="mb-3">
          <Typography variant="subtitle1">Title</Typography>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength="5"
          />
        </div>

        <div className="mb-3">
          <Typography variant="subtitle1">Description</Typography>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength="20"
          />
        </div>

        <div className="mb-3">
          <Typography variant="subtitle1">Goal Amount</Typography>
          <input
            type="number"
            className="form-control"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="mb-3">
          <Typography variant="subtitle1">Current Amount</Typography>
          <input
            type="number"
            className="form-control"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <Typography variant="subtitle1">Mobile Number</Typography>
          <input
            type="tel"
            className="form-control"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            pattern="^\d{10}$"
          />
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="main-button-with-mediumsize"
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Create Fund
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFundraiserForm;
