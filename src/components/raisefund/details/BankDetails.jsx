import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem } from "@mui/material";

import axios from "axios";
import "./styles/MedicalDocuments.css";
import "../../styles/common-styles.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const BankDetails = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    branchName: "",
    branchAddress: "",
  });
  const [fundraiserId, setFundraiserId] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [bankDetailsId, setBankDetailsId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [allDetailsSubmitted, setAllDetailsSubmitted] = useState(false);
  const navigate = useNavigate();

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

  // fetch bank details if it already exists
  useEffect(() => {
    const fetchBankDetails = async () => {
      if (fundraiserId) {
        const response = await axios.get(
          API_ENDPOINTS.GET_BANK_DETAILS_BY_FUNDRAISERID(fundraiserId)
        );
        setBankDetailsId(response.data.bankId);
        setFormData({
          accountHolderName: response.data.accountHolderName,
          accountNumber: response.data.accountNumber,
          branchName: response.data.branchName,
          bankName: response.data.bankName,
          ifscCode: response.data.ifscCode,
          accountType: response.data.accountType,
          branchAddress: response.data.branchAddress,
        });
      }
    };
    fetchBankDetails();
  }, [fundraiserId]);

  // checl all details are submitted or not
  const checkAllDetailsSubmitted = async () => {
    const endpoints = [
      "bank-details",
      "fundraiser-details",
      "medical-documents/fetch",
      "backgrounds",
      "hospital-details",
      "patient-verifications",
    ];

    let missingDetails = [];

    for (let endpoint of endpoints) {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_ENDPOINT_BY_ID(endpoint, fundraiserId)
        );
        if (!response.data) missingDetails.push(endpoint.replace(/-/g, " "));
      } catch (error) {
        missingDetails.push(endpoint.replace(/-/g, " "));
      }
    }

    if (missingDetails.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Details",
        text: `Please fill the following details: ${missingDetails.join(", ")}`,
      });
    } else {
      setAllDetailsSubmitted(true);
      Swal.fire({
        icon: "success",
        title: "All Details Submitted Successfully!",
        confirmButtonText: "Go to Home",
      }).then(() => navigate("/home"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData || typeof formData !== "object") {
      Swal.fire("Error", "Form data is missing", "error");
      return false;
    }
  
    if (!formData.accountHolderName || formData.accountHolderName.trim().length < 1) {
      Swal.fire("Error", "Account holder name must be at least 1 character long", "error");
      return false;
    }
  
    if (!formData.accountNumber || formData.accountNumber.length !== 12) {
      Swal.fire("Error", "Account Number must be exactly 12 characters long", "error");
      return false;
    }
  
    if (!formData.bankName || formData.bankName.trim().length < 1) {
      Swal.fire("Error", "Bank Name must be at least 1 character long", "error");
      return false;
    }
  
    if (!formData.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      Swal.fire("Error", "Enter a valid IFSC code", "error");
      return false;
    }
  
    if (!formData.branchName || formData.branchName.trim().length < 1) {
      Swal.fire("Error", "Branch Name must be at least 1 character long", "error");
      return false;
    }
  
    if (!formData.branchAddress || formData.branchAddress.trim().length < 1) {
      Swal.fire("Error", "Branch Address must be at least 1 character long", "error");
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async () => {
    if (!fundraiserId) {
      Swal.fire("Error","Fundraiser ID not found. Please create a fundraiser first.", "error");
      return;
    }

    if (!validateForm()) {
      return
    }

    const bankDetailsData = {
      ...formData,
      fundraiserId,
    };

    try {
      if (bankDetailsId) {
        await axios.put(
          API_ENDPOINTS.GET_BANK_DETAILS_BY_ID(bankDetailsId),
          bankDetailsData
        );
        Swal.fire("Success", "Bank details updated successfully!", "success");
      } else {
        const response = await axios.post(
          API_ENDPOINTS.GET_BANK_DETAILS,
          bankDetailsData
        );
        setBankDetailsId(response.data.bankId);
        Swal.fire("Success", "Bank details submitted successfully!", "success");
      }
      setIsEditable(false);
    } catch (error) {
      console.error("Error submitting bank details:", error);
      Swal.fire("Error", "Failed to submit bank details.", "error");
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  return (
    <div className="form-div">
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="row">
          <div className="col-md-6">
            <TextField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
          <div className="col-md-6">
            <TextField
              label="Account Number"
              name="accountNumber"
              type="number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
          <div className="col-md-6">
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextField
              label="Account Type"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
              select
            >
              <MenuItem value="current">Current</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </TextField>
          </div>
          <div className="col-md-6">
            <TextField
              label="Branch Name"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField
              label="Branch Address"
              name="branchAddress"
              value={formData.branchAddress}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="d-flex  align-items-center gap-3">
          {isEditable ? (
            <Button
              className="submit-button"
              onClick={handleSubmit}
              disabled={!fundraiserId}
            >
              {bankDetailsId ? "Update Bank Details" : "Submit Bank Details"}
            </Button>
          ) : (
            <Button
              className="submit-button"
              onClick={handleEdit}
            >
              Edit Details
            </Button>
          )}
          <Button
            onClick={checkAllDetailsSubmitted}
            style={{
              backgroundColor: "blue",
              color: "white",
              width: "300px",
              height: "40px",
            }}
          >
            Submit All Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
