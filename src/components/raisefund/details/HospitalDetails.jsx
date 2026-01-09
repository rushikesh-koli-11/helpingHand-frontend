/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import "./styles/MedicalDocuments.css";
import "../../styles/common-styles.css";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const HospitalDetails = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    patientUHIDNumber: "",
    consultingDoctor: "",
    doctorPhoneNumber: "",
    hospitalAddress: "",
    additionalInformation: "",
  });
  const [fundraiserId, setFundraiserId] = useState(null);
  const [isEditable, setIsEditable] = useState(true); 
  const [hospitalDetailsId, setHospitalDetailsId] = useState(null); 

  // Fetch the latest fundraiser ID
  useEffect(() => {
    const fetchLatestFundraiser = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_LATEST_FUNDRAISER
        );
        setFundraiserId(response.data.fundraiserId);
      } catch (error) {
        Swal.fire("Error", "Error fetching latest fundraiser ID:", "error");
      }
    };

    fetchLatestFundraiser();
  }, []);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (fundraiserId) {
        const response = await axios.get(
          API_ENDPOINTS.GET_HOSPITAL_DETAILS_BY_FUNDRAISERID(fundraiserId)
        );
        if (response.data) {
          setHospitalDetailsId(response.data.id);
          setFormData({
            hospitalName: response.data.hospitalName,
            patientUHIDNumber: response.data.patientUHIDNumber,
            consultingDoctor: response.data.consultingDoctor,
            doctorPhoneNumber: response.data.doctorPhoneNumber,
            hospitalAddress: response.data.hospitalAddress,
            additionalInformation: response.data.additionalInformation,
          });
          setIsEditable(false); // Disable the form fields if data exists
        }
      }
    };
    fetchHospitalDetails();
  }, [fundraiserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.hospitalName) {
      Swal.fire("Error", "Hospital Name required", "error");
      return false;
    }
    if (!formData.patientUHIDNumber || formData.patientUHIDNumber.length !== 14) {
      Swal.fire("Error", "UHID Number must be 14 digits long", "error");
      return false;
    }
    if (!formData.consultingDoctor) {
      Swal.fire("Error", "Consulting Doctor required", "error");
      return false;
    }
    if (!formData.hospitalAddress) {
      Swal.fire("Error", "Hospital Address required", "error");
      return false;
    }
    if (!formData.additionalInformation) {
      Swal.fire("Error", "Additional Information required", "error");
      return false;
    }
    if (!/^\d{10}$/.test(formData.doctorPhoneNumber)) {
      Swal.fire(
        "Error",
        "Please enter a valid 10-digit mobile number",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!fundraiserId) {
      Swal.fire(
        "Error",
        "Fundraiser ID not found. Please create a fundraiser first.",
        "error"
      );
      return;
    }

    const hospitalDetailsData = {
      ...formData,
      fundraiserId,
    };

    try {
      if (hospitalDetailsId) {
        // Updating existing hospital details
        await axios.put(
          API_ENDPOINTS.UPDATE_HOSPITAL_DETAILS_BY_ID(hospitalDetailsId),
          hospitalDetailsData
        );
        Swal.fire(
          "Success",
          "Hospital details updated successfully!",
          "success"
        );
      } else {
        // Creating new hospital details
        const response = await axios.post(
          API_ENDPOINTS.POST_HOSPITAL_DETAILS,
          hospitalDetailsData
        );
        setHospitalDetailsId(response.data.id); 
        Swal.fire("Success", "Hospital details submitted successfully!", "success");
      }
      setIsEditable(false); 
    } catch (error) {
      Swal.fire("Error", "Failed to submit hospital details.", "error");
    }
  };

  const handleEdit = () => {
    setIsEditable(true); 
  };

  return (
    <div className="form-div">
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <TextField
              label="Hospital Name"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
          <div className="col-12 col-md-6">
            <TextField
              label="Patient's UHID Number"
              name="patientUHIDNumber"
              type="number"
              value={formData.patientUHIDNumber}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <TextField
              label="Consulting Doctor"
              name="consultingDoctor"
              value={formData.consultingDoctor}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
          <div className="col-12 col-md-6">
            <TextField
              label="Doctor's Phone Number"
              name="doctorPhoneNumber"
              type="number"
              value={formData.doctorPhoneNumber}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <TextField
          label="Hospital Address"
          name="hospitalAddress"
          value={formData.hospitalAddress}
          onChange={handleInputChange}
          fullWidth
          disabled={!isEditable}
        />
        <TextField
          label="Additional Information"
          name="additionalInformation"
          value={formData.additionalInformation}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          disabled={!isEditable}
        />
        {isEditable ? (
          <Button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!fundraiserId} 
          >
            {hospitalDetailsId
              ? "Update Hospital Details"
              : "Submit Hospital Details"}
          </Button>
        ) : (
          <Button className="submit-button" onClick={handleEdit}>
            Edit Details
          </Button>
        )}
      </form>
    </div>
  );
};

export default HospitalDetails;
