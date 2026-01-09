import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const PatientVerification = () => {
  const [formData, setFormData] = useState({
    adhaarNumber: "",
    panNumber: "",
  });
  const [fundraiserId, setFundraiserId] = useState(null);
  const [patientVerificationId, setPatientVerificationId] = useState(null); 
  const [isEditable, setIsEditable] = useState(true); 

  // Fetch the latest fundraiser ID
  useEffect(() => {
    const fetchLatestFundraiser = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_LATEST_FUNDRAISER
        );
        setFundraiserId(response.data.fundraiserId);
      } catch (error) {
        console.error("Error fetching latest fundraiser ID:", error);
      }
    };

    fetchLatestFundraiser();
  }, []);

  // Fetch existing PatientVerification if it exists
  useEffect(() => {
    const fetchPatientVerification = async () => {
      if (fundraiserId) {
        try {
          const response = await axios.get(
            API_ENDPOINTS.GET_PATIENT_VERIFICATIONS_BY_FUNDRAISERID(fundraiserId)
          );
          if (response.data) {
            const data = response.data;
            setPatientVerificationId(data.verificationId);
            setFormData({
              adhaarNumber: data.adhaarNumber,
              panNumber: data.panNumber,
            });
            setIsEditable(false); 
          }
        } catch (error) {
          console.error("Error fetching patient verification data:", error);
        }
      }
    };

    fetchPatientVerification();
  }, [fundraiserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.adhaarNumber || formData.adhaarNumber.length !== 12) {
      Swal.fire("Error", "Adhaar Number must be exactly 12 digits long", "error");
      return false;
    }
    if (!formData.panNumber || formData.panNumber.length !== 10) {
      Swal.fire("Error", "PAN Number must be exactly 10 characters long", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return
    }

    if (!fundraiserId) {
      Swal.fire("Error","Fundraiser ID not found. Please create a fundraiser first.", "error");
      return;
    }

    const patientVerificationData = {
      ...formData,
      fundraiserId,
    };

    try {
      let response;
      if (patientVerificationId) {
        // Updating existing patient verification
        response = await axios.put(
          API_ENDPOINTS.GET_PATIENT_VERIFICATIONS_BY_FUNDRAISERID(fundraiserId),
          patientVerificationData
        );
        Swal.fire("Success","Patient verification updated successfully!","success");
      } else {
        // Creating new patient verification
        response = await axios.post(
          API_ENDPOINTS.GET_PATIENT_VERIFICATIONS,
          patientVerificationData
        );
        Swal.fire("Success","Patient verification submitted successfully!", "success");
      }

      // Reset form or keep values if editing
      setPatientVerificationId(response.data.verificationId || response.data.id); 
      setFormData({
        adhaarNumber: response.data.adhaarNumber,
        panNumber: response.data.panNumber,
      });
      setIsEditable(false); 
    } catch (error) {
      console.error("Error submitting patient verification:", error);
      Swal.fire("Error", "Failed to submit patient verification.", "error");
    }
  };

  const handleEdit = () => {
    setIsEditable(true); 
  };

  return (
    <div className="form-div">
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <TextField
          label="Patient Aadhar Number"
          name="adhaarNumber"
          type="number"
          value={formData.adhaarNumber}
          onChange={handleInputChange}
          fullWidth
          disabled={!isEditable} 
        />
        <TextField
          label="Patient PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleInputChange}
          fullWidth
          disabled={!isEditable} 
        />
        {isEditable ? (
          <Button
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit Patient Verification
          </Button>
        ) : (
          <Button
            className="submit-button"
            onClick={handleEdit}
          >
            Edit Patient Verification
          </Button>
        )}
      </form>
    </div>
  );
};

export default PatientVerification;
