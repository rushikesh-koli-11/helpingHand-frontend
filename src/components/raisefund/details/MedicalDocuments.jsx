/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import "./styles/MedicalDocuments.css";
import "../../styles/common-styles.css";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const buttonLabels = {
  medicalEstimate: "Upload Medical Estimate",
  consentLetterFromPatient: "Upload Consent Letter",
  medicalReports: "Upload Medical Reports",
  otherDocs: "Other Documents",
};

const MedicalDocuments = () => {
  const getFileNameFromUrl = (url) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0];
    } catch (e) {
      return url;
    }
  };
  const [formData, setFormData] = useState({
    medicalEstimate: "",
    consentLetterFromPatient: "",
    medicalReports: "",
    otherDocs: "",
    additionalInformation: "",
    fundraiserId: "",
    medicalDocumentId: "",
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const [uploadedFileNames, setUploadedFileNames] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [fundId, setFundId] = useState();

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_LATEST_FUNDRAISER)
      .then((response) => {
        setFundId(response.data.fundraiserId);
        setFormData((prevData) => ({
          ...prevData,
          fundraiserId: response.data.fundraiserId,
          medicalDocumentId: response.data.medicalDocumentId || "",
        }));
      })
      .catch((error) => {
        console.error("Error fetching fundraiserId:", error);
        Swal.fire("Error", "Failed to fetch fundraiser ID.", "error");
      });
  }, []);

  useEffect(() => {
    if (formData.fundraiserId) {
      axios
        .get(
          API_ENDPOINTS.GET_MEDICAL_DOCUMENTS_BY_FUNDRAISERID(formData.fundraiserId)
        )
        .then((response) => {
          const data = response.data || {};
          setFormData({
            fundraiserId: data.fundraiserId,
            medicalDocumentId: data.medicalDocumentId,
            medicalEstimate: data.medicalEstimate,
            consentLetterFromPatient: data.consentLetterFromPatient,
            medicalReports: data.medicalReports,
            otherDocs: data.otherDocs,
            additionalInformation: data.additionalInformation,
          });

          // If backend returns Cloudinary URLs, show them as previews
          const previews = {};
          const names = {};
          if (data.medicalEstimate) { previews.medicalEstimate = data.medicalEstimate; names.medicalEstimate = getFileNameFromUrl(data.medicalEstimate); }
          if (data.consentLetterFromPatient) { previews.consentLetterFromPatient = data.consentLetterFromPatient; names.consentLetterFromPatient = getFileNameFromUrl(data.consentLetterFromPatient); }
          if (data.medicalReports) { previews.medicalReports = data.medicalReports; names.medicalReports = getFileNameFromUrl(data.medicalReports); }
          if (data.otherDocs) { previews.otherDocs = data.otherDocs; names.otherDocs = getFileNameFromUrl(data.otherDocs); }

          setImagePreviews(previews);
          setUploadedFileNames(names);
        })
        .catch((error) => {
          console.error("Error fetching medical document details:", error);
        });
    }
  }, [formData.fundraiserId]);

  const handleFileChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [imageKey]: file,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setUploadedFileNames((prev) => ({
        ...prev,
        [imageKey]: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fundraiserId) {
      Swal.fire("Error", "Fundraiser ID is missing.", "error");
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] &&
        key !== "fundraiserId" &&
        key !== "medicalDocumentId"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append("fundraiserId", formData.fundraiserId);

    try {
      let response;
      if (isUpdated && formData.medicalDocumentId) {
        response = await axios.put(
          API_ENDPOINTS.UPDATE_MEDICAL_DOCUMENTS_BY_FUNDRAISERID(formData.fundraiserId),
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          API_ENDPOINTS.UPLOAD_MEDICAL_DOCUMENTS,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setIsUpdated(true);
        setIsEditMode(true);
      }

      if (response.status === 200) {
        Swal.fire("Success", "Images uploaded successfully!", "success");
        const data = response.data || {};
        setFormData((prev) => ({
          ...prev,
          medicalDocumentId: data.medicalDocumentId,
          medicalEstimate: data.medicalEstimate || prev.medicalEstimate,
          consentLetterFromPatient: data.consentLetterFromPatient || prev.consentLetterFromPatient,
          medicalReports: data.medicalReports || prev.medicalReports,
          otherDocs: data.otherDocs || prev.otherDocs,
        }));

        // Update previews and names from returned URLs
        const previews = {};
        const names = {};
        if (data.medicalEstimate) { previews.medicalEstimate = data.medicalEstimate; names.medicalEstimate = getFileNameFromUrl(data.medicalEstimate); }
        if (data.consentLetterFromPatient) { previews.consentLetterFromPatient = data.consentLetterFromPatient; names.consentLetterFromPatient = getFileNameFromUrl(data.consentLetterFromPatient); }
        if (data.medicalReports) { previews.medicalReports = data.medicalReports; names.medicalReports = getFileNameFromUrl(data.medicalReports); }
        if (data.otherDocs) { previews.otherDocs = data.otherDocs; names.otherDocs = getFileNameFromUrl(data.otherDocs); }

        setImagePreviews((prev) => ({ ...prev, ...previews }));
        setUploadedFileNames((prev) => ({ ...prev, ...names }));
      } else {
        Swal.fire("Error", "Failed to upload images. Try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to upload images.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsUpdated(true);
    setIsEditMode(false);
  };

  const handleViewImage = (imageKey) => {
    setViewImage(imagePreviews[imageKey]);
  };

  const handleCloseImageViewer = () => {
    setViewImage(null);
  };

  return (
    <div className="medical-documents-container form-div">
      <form className="medical-documents-form">
        <div className="row">
          {[
            "medicalEstimate",
            "consentLetterFromPatient",
            "medicalReports",
            "otherDocs",
          ].map((imageKey, index) => (
            <div className="col-md-6 d-flex" key={index}>
              <Button
                className="documents-button w-50 mb-3"
                component="label"
                fullWidth
                sx={{
                  color: "#ffffff",
                  backgroundColor: "#039695",
                  "&:hover": { backgroundColor: "#028678" },
                  "&.Mui-disabled": { backgroundColor: "#A5D6D3" },
                }}
                disabled={isEditMode}
              >
                {buttonLabels[imageKey]} 
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, imageKey)}
                />
              </Button>
              {uploadedFileNames[imageKey] && (
                <Typography className="d-flex flex-column justify-content-start align-items-end w-50">
                  <div className="d-flex" style={{fontSize: "small"}}>Uploaded File: {uploadedFileNames[imageKey]}</div>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => handleViewImage(imageKey)}
                  >
                    View Image
                  </Button>
                </Typography>
              )}
            </div>
          ))}
        </div>

        <TextField
          label="Additional Information"
          fullWidth
          multiline
          minRows={5}
          value={formData.additionalInformation}
          onChange={(e) =>
            setFormData({ ...formData, additionalInformation: e.target.value })
          }
          disabled={isEditMode}
        />

        <Box className="button-container">
          {!isEditMode ? (
            <button
              type="submit"
              className="submit-button mt-3"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Submit Images"}
            </button>
          ) : (
            <button
              type="button"
              className="submit-button mt-3"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </Box>
      </form>

      {/* Image Viewer Modal */}
      <Dialog
        open={Boolean(viewImage)}
        onClose={handleCloseImageViewer}
        maxWidth="md"
      >
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageViewer}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {viewImage && (
            <img src={viewImage} alt="Preview" style={{ width: "100%" }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalDocuments;
