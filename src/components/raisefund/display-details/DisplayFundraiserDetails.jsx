import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import PatientVerification from "./DisplayPatientVerification";
import DisplayHospitalDetails from "./DisplayHospitalDetails";
import DisplayBackgroundDetails from "./DisplayBackgroundDetails";
import DisplayMedicalDocuments from "./DisplayMedicalDocuments";
import DisplayBankDetails from "./DisplayBankDetails";
import "../../styles/common-styles.css";
import "./styles/DisplayFundraiserDetails.css";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";
import UpdateModal from "../details/PostUpdateModal ";
import DisplayUpdates from "./DisplayUpdates";

const DisplayFundraiserDetails = () => {
  const { fundraiserId } = useParams();
  const [fundraiserData, setFundraiserData] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  const [goalAmount, setGoalAmount] = useState();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLoggedIn(true);
    if (storedUser) {
      if (storedUser.role === "admin") {
        setIsAdmin(true);
      } else if (storedUser.role === "user") {
        setIsUser(true);
      }
    } else {
      setIsUser(true);
    }

    const fetchFundraisers = async () => {
      const response = await axios.get(
        API_ENDPOINTS.GET_FUNDRAISERS_BY_ID(fundraiserId)
      );
      setGoalAmount(response.data.goalAmount);
      setUserId(response.data.userId);
      if (response.data.status === "approved") {
        setIsApproved(true); // Disabled the approve button if already approved
      }
    };

    const fetchFundraiserDetails = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_FUNDRAISER_DETAILS_BY_FUNDRAISERID(fundraiserId)
        );
        setFundraiserData(response.data);
      } catch (error) {
        setError("Error fetching fundraiser details.");
      }
    };

    if (fundraiserId) {
      fetchFundraiserDetails();
      fetchFundraisers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundraiserId]);

  const handleApproval = async (status) => {
    try {
      await axios.patch(API_ENDPOINTS.PATCH_APPROVE_FUNDRAISER(fundraiserId), {
        status,
      });

      Swal.fire({
        title:
          status === "approved"
            ? "Fundraiser Approved!"
            : "Fundraiser Rejected!",
        text: `The fundraiser has been ${status}.`,
        icon: status === "approved" ? "success" : "error",
        confirmButtonText: "OK",
      });

      setIsApproved(true);
      navigate("/admin-dashboard");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `An error occurred while trying to ${status} the fundraiser.`,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
    }
  };

  const handleDonate = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Please Login",
        text: "You need to be logged in to donate.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      navigate(`/donate/${fundraiserId}`);
    }
  };

  const handleUpdates = () => {
    setIsModalOpen(true); // Open modal when button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const postUpdate = async (content) => {
      console.log("content" , content);
      const response = await axios.post(API_ENDPOINTS.POST_UPDATES  ,content)
      console.log("dataaa - ", response.data);
  };

  if (error) {
    return <div className="alert alert-danger h-100 w-100">{error}</div>;
  }

  return (
    <div className="container mt-5 fundraiser-details-page">
      {fundraiserData ? (
        <div className="p-1">
          <div className="card">
            <div className="display-fundraiser-details-card-body">
              <h5 className="card-header theme-colour">Fundraiser Details</h5>
              <div className="row card-body">
                <div className="col-md-6">
                  <h1 style={{ color: "#016463" }} className="mb-4">
                    {fundraiserData.patientName}
                  </h1>
                  <p className="fundraiser-details-information">
                    <h6 className="verification-label w-0">Age: </h6>{" "}
                    <p>{fundraiserData.patientAge}</p>
                  </p>
                  <p className="fundraiser-details-information">
                    <h6 className="verification-label w-0">Gender:</h6>{" "}
                    <p>{fundraiserData.patientGender}</p>
                  </p>
                  <p className="fundraiser-details-information">
                    <h6 className="verification-label w-0">
                      Medical Condition:
                    </h6>{" "}
                    <p>{fundraiserData.medicalCondition}</p>
                  </p>
                </div>
                <div className="col-md-6">
                  <h4 className="text-success">Goal Amount: ₹{goalAmount}</h4>
                  <p className="mt-3">
                    <h6 className="verification-label w-0">Story:</h6>
                  </p>
                  <p className="story-text">{fundraiserData.story}</p>
                  {fundraiserData.videoAppeal && (
                    <button
                      target="_blank"
                      rel="noopener noreferrer"
                      className="main-button mt-3"
                      onClick={() => {
                        window.open(`${fundraiserData.videoAppeal}`, "_blank");
                      }}
                    >
                      Watch Video Appeal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-sections">
            {isAdmin && <PatientVerification fundraiserId={fundraiserId} />}

            <DisplayHospitalDetails fundraiserId={fundraiserId} />
            <DisplayBackgroundDetails fundraiserId={fundraiserId} />
            <DisplayMedicalDocuments fundraiserId={fundraiserId} />
            <DisplayBankDetails fundraiserId={fundraiserId} />
            <DisplayUpdates />
          </div>

          {isAdmin && (
            <div className="d-flex justify-content-center mb-5 admin-operation-btn">
              <Button
                className="main-button-with-mediumsize btn-success btn-lg me-3 animate__animated animate__pulse"
                onClick={() => handleApproval("approved")}
                disabled={isApproved}
              >
                {isApproved ? "Approved" : "Approve"}
              </Button>
              <Button
                className="reject-btn btn-danger animate__animated animate__pulse"
                onClick={() => handleApproval("rejected")}
                disabled={isApproved}
                main-button-with-mediumsize
              >
                Reject
              </Button>
            </div>
          )}

          {isUser &&
            storedUser.userId !== userId &&
            fundraiserData.remainingAmount !== 0 && (
              <div className="text-center">
                <button
                  className=" mb-4 main-button-with-mediumsize animate__animated animate__pulse"
                  onClick={
                    isLoggedIn
                      ? handleDonate
                      : Swal.fire("Login", "Please Login to Donate!", "error")
                  }
                >
                  Donate Now
                </button>
              </div>
            )}
          {storedUser.userId === userId && (
            <div className="d-flex justify-content-center mb-4">
              <button
                className="main-button-with-mediumsize"
                onClick={handleUpdates}
              >
                Post Updates
              </button>
              <UpdateModal isOpen={isModalOpen} closeModal={closeModal} postUpdate={postUpdate} fundraiserId={fundraiserId}/>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading fundraiser details...</p>
        </div>
      )}
    </div>
  );
};

export default DisplayFundraiserDetails;
