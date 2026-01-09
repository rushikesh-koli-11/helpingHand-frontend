import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const BackgroundForm = () => {
  const [formData, setFormData] = useState({
    relationWithPatient: "",
    monthlyIncomeOfPatientsFamily: "", // keep as string for input
  });

  const [fundraiserId, setFundraiserId] = useState(null);
  const [backgroundId, setBackgroundId] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get latest fundraiser
        const fundraiserRes = await axios.get(
          API_ENDPOINTS.GET_LATEST_FUNDRAISER
        );

        const fId = fundraiserRes.data.fundraiserId;
        setFundraiserId(fId);

        // 2. Try fetching background details
        const backgroundRes = await axios.get(
          API_ENDPOINTS.GET_BACKGROUND_DETAILS_BY_FUNDRAISERID(fId)
        );

        if (backgroundRes.data) {
          setFormData({
            relationWithPatient:
              backgroundRes.data.relationWithPatient ?? "",
            monthlyIncomeOfPatientsFamily:
              backgroundRes.data.monthlyIncomeOfPatientsFamily?.toString() ??
              "",
          });

          setBackgroundId(backgroundRes.data.backgroundId);
          setIsEditable(false);
        }
      } catch (error) {
        // 404 / 400 means background not created yet → allow creation
        setIsEditable(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.relationWithPatient) {
      Swal.fire("Error", "Relation with patient is required", "error");
      return false;
    }

    const income = Number(formData.monthlyIncomeOfPatientsFamily);
    if (!formData.monthlyIncomeOfPatientsFamily || isNaN(income) || income <= 0) {
      Swal.fire(
        "Error",
        "Monthly income must be a valid number greater than 0",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!fundraiserId) {
      Swal.fire("Error", "Fundraiser not found", "error");
      return;
    }

    const payload = {
      fundraiserId,
      relationWithPatient: formData.relationWithPatient,
      monthlyIncomeOfPatientsFamily: Number(
        formData.monthlyIncomeOfPatientsFamily
      ),
    };

    try {
      let response;

      if (backgroundId) {
        // UPDATE
        response = await axios.put(
          API_ENDPOINTS.GET_BACKGROUND_DETAILS_BY_BACKGROUNDID(backgroundId),
          payload
        );
        Swal.fire("Success", "Background updated successfully", "success");
      } else {
        // CREATE
        response = await axios.post(
          API_ENDPOINTS.GET_BACKGROUND_DETAILS,
          payload
        );
        Swal.fire("Success", "Background created successfully", "success");
      }

      setBackgroundId(response.data.backgroundId);
      setFormData({
        relationWithPatient: response.data.relationWithPatient,
        monthlyIncomeOfPatientsFamily:
          response.data.monthlyIncomeOfPatientsFamily.toString(),
      });

      setIsEditable(false);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to submit background information",
        "error"
      );
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  if (loading) return null;

  /* ================= UI ================= */
  return (
    <div className="form-div">
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Relation With Patient</InputLabel>
          <Select
            name="relationWithPatient"
            value={formData.relationWithPatient}
            label="Relation With Patient"
            onChange={handleInputChange}
            disabled={!isEditable}
          >
            {[
              "self",
              "mother",
              "father",
              "brother",
              "sister",
              "husband",
              "spouse",
              "son",
              "daughter",
              "grandfather",
              "grandmother",
              "other",
            ].map((relation) => (
              <MenuItem key={relation} value={relation}>
                {relation.charAt(0).toUpperCase() + relation.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Monthly Income of Patient's Family"
          name="monthlyIncomeOfPatientsFamily"
          type="number"
          value={formData.monthlyIncomeOfPatientsFamily}
          onChange={handleInputChange}
          disabled={!isEditable}
          fullWidth
        />

        {isEditable ? (
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Submit Background Information
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleEdit} fullWidth>
            Edit Background Information
          </Button>
        )}
      </form>
    </div>
  );
};

export default BackgroundForm;
