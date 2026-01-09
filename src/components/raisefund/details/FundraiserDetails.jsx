/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
} from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./styles/FundraiserDetails.css";
import "../../styles/common-styles.css";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const FundraiserDetails = () => {
  const [formData, setFormData] = useState({
    coverPicture: "",
    videoAppeal: "",
    remainingAmount: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    medicalCondition: "",
    story: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [fundraiserId, setFundraiserId] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditmode] = useState(true);
  const [goalAmount, setGoalAmount] = useState();
  const [currentAmount, setCurrentAmount] = useState();

  useEffect(() => {
    const fetchLatestFundraiser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.GET_LATEST_FUNDRAISER);
        setFundraiserId(response.data.fundraiserId);
        setGoalAmount(response.data.goalAmount);
        setCurrentAmount(response.data.currentAmount);
        
        if (response.data.fundraiserDetailsDTO) {
          const fundraiserDetails = response.data.fundraiserDetailsDTO;
          setFormData({ ...fundraiserDetails });

          if (fundraiserDetails.coverPicture) {
            // backend now returns either a Cloudinary URL or a base64 string
            if (fundraiserDetails.coverPicture.startsWith("http")) {
              setImagePreview(fundraiserDetails.coverPicture);
            } else {
              setImagePreview(`data:image/jpeg;base64,${fundraiserDetails.coverPicture}`);
            }
            setUploadedFileName("Cover Picture");
          }
          setEditmode(false);
          setIsSubmitted(true);
        } else {
        }
      } catch (error) {
        console.error("Error fetching latest fundraiser:", error);
        Swal.fire("Error", "Failed to fetch fundraiser details.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestFundraiser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        coverPicture: file,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadedFileName(file.name);
    }
  };

  const validateForm = () => {
    if (formData.patientName.length <= 0) {
      Swal.fire(
        "Error",
        "Patient Name must be at least 1 characters long",
        "error"
      );
      return false;
    }
    if (Number.parseInt(formData.patientGender) <= 0) {
      Swal.fire(
        "Error",
        "Patient Gender must be at least 1 characters long",
        "error"
      );
      return false;
    }
    if (Number.parseInt(formData.patientAge) <= 0) {
      Swal.fire("Error", "Patient Age must be greater than 0", "error");
      return false;
    }
    if (formData.medicalCondition.length <= 0) {
      Swal.fire("Error", "Goal amount must be greater than 0", "error");
      return false;
    }
    if (formData.story.length <= 0) {
      Swal.fire("Story Required", "Tell us your story!", "error");
      return false;
    }
    if (Number.parseInt(formData.remainingAmount) <= 0) {
      Swal.fire("Error", "Goal amount must be greater than 0", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const fileData = new FormData();
      fileData.append("fundraiserId", fundraiserId);
      if (formData.coverPicture) {
        fileData.append("file", formData.coverPicture);
      }
      Object.keys(formData).forEach((key) => {
        if (key !== "coverPicture") {
          fileData.append(key, formData[key]);
        }
      });

      const isUpdating = isSubmitted; 
      const url = isUpdating
        ? API_ENDPOINTS.UPLOAD_FUNDRAISER_DETAILS
        : API_ENDPOINTS.GET_FUNDRAISER_DETAILS;

      const method = isUpdating ? axios.put : axios.post;
      await method(url, fileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(
        "Success",
        `Fundraiser details ${
          isUpdating ? "updated" : "submitted"
        } successfully!`,
        "success"
      );

      setIsSubmitted(true);
      setIsEditable(false);
      setEditmode(false); 
    } catch (error) {
      console.error("Error submitting fundraiser details:", error);
      Swal.fire(
        "Error",
        "Failed to submit fundraiser details. Please check your input.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditmode(true);
    setIsEditable(true); 
  };

  return (
    <div className="fundraiser-form-container fixfromtop">
      <form className="fundraiser-form">
        <div className="row">
          <div className="col-md-6">
            <TextField
              label="Patient's Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </div>
          <div className="col-md-4">
            <TextField
              label="Patient's Age"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleInputChange}
              fullWidth
              type="number"
              disabled={!editMode}
            />
          </div>
          <div className="col-md-2">
            <FormControl fullWidth disabled={!editMode}>
              <InputLabel>Patient's Gender</InputLabel>
              <Select
                name="patientGender"
                value={formData.patientGender || ""}
                onChange={handleInputChange}
                label="Patient's Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextField
              label="Medical Condition"
              name="medicalCondition"
              value={formData.medicalCondition}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </div>
          <div className="col-md-6">
            <TextField
              label="Remaining Amount"
              name="remainingAmount"
              value={goalAmount - currentAmount}
              fullWidth
              type="number"
              disabled={true}
            />
          </div>
        </div>
        <div className="row video-img">
          <div className="col-md-6">
            <TextField
              label="Video Appeal (YouTube Link)"
              name="videoAppeal"
              value={formData.videoAppeal}
              onChange={handleInputChange}
              fullWidth
              disabled={!editMode}
            />
          </div>
          <div className="upload-img-div col-md-3">
            <Button
              className="upload-img-button"
              variant="contained"
              component="label"
              disabled={!editMode}
              fullWidth
              sx={{
                backgroundColor: "#039695",
                "&:hover": {
                  backgroundColor: "#028678",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#A5D6D3",
                },
              }}
            >
              Upload Cover Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </div>
          {uploadedFileName && (
            <div className="col-md-3">
              <Typography variant="body2">
                Uploaded File: {uploadedFileName}{" "}
                <Button
                  color="primary"
                  size="small"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  View Image
                </Button>
              </Typography>
            </div>
          )}
        </div>
        <div className="col-md-12">
          <TextField
            label="Story"
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            disabled={!editMode}
          />
        </div>
        <Box className="button-container">
          <Button
            className="submit-button"
            onClick={() => {
              if (!editMode) {
                handleEdit();
              } else {
                handleSubmit();
              }
            }}
            disabled={isLoading}
          >
            {!editMode
              ? "Edit Fundraiser Details"
              : "Submit Fundraiser Details"}
          </Button>
          {isLoading && (
            <CircularProgress size={24} className="loading-spinner" />
          )}
        </Box>
      </form>

      {/* Full-Screen Image Viewer */}
      <Dialog
        fullScreen
        open={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        PaperProps={{
          style: { background: "rgba(0,0,0,0.8)" },
        }}
      >
        <IconButton
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => setIsImageViewerOpen(false)}
        >
          <CloseIcon style={{ color: "white", fontSize: "2rem" }} />
        </IconButton>
        <img
          src={imagePreview}
          alt="Full Screen Preview"
          style={{
            width: "auto",
            height: "auto",
            margin: "auto",
            display: "block",
            maxHeight: "90vh",
          }}
        />
      </Dialog>
    </div>
  );
};

export default FundraiserDetails;
