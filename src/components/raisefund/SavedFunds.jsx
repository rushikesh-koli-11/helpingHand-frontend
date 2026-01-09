import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import FundraiserCard from "./FundraiserCard"; // Assuming this is the correct import path
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

const SavedFunds = () => {
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const [fundraisers, setFundraisers] = useState([]);
  const [coverPictures, setCoverPictures] = useState({});
  const [collectedAmounts, setCollectedAmounts] = useState({});
  const [savedFundraisers, setSavedFundraisers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      setLoading(true);

      if (userId) {
        try {
          // Fetch saved fundraisers for the user
          const savedResponse = await axios.get(
            API_ENDPOINTS.GET_SAVED_FUNDRAISER
          );
          const savedData = savedResponse.data.filter(
            (entry) => entry.userId === userId
          );

          const savedMap = {};
          savedData.forEach((entry) => {
            savedMap[entry.fundraiserId] = true;
          });

          setSavedFundraisers(savedMap);

          //fetching the details of the saved fundraisers
          const fundraiserResponse = await axios.get(
            API_ENDPOINTS.GET_FUNDRAISER
          );
          const approvedFundraisers = fundraiserResponse.data.filter(
            (fundraiser) => savedMap[fundraiser.fundraiserId]
          );

          // Fetching cover pictures and collected amounts
          const fundraiserDetailsResponse = await axios.get(
            API_ENDPOINTS.GET_FUNDRAISER_DETAILS
          );
          const coverPicturesMap = {};
          const collectedAmountMap = {};

          fundraiserDetailsResponse.data.forEach((data) => {
            if (data.coverPicture) {
              const base64String = `data:image/jpeg;base64,${data.coverPicture}`;
              coverPicturesMap[data.id] = base64String;
            }
            if (data.remainingAmount !== undefined) {
              collectedAmountMap[data.id] = data.remainingAmount;
            }
          });

          setFundraisers(approvedFundraisers);
          setCoverPictures(coverPicturesMap);
          setCollectedAmounts(collectedAmountMap);
        } catch (err) {
          setError("Error fetching saved fundraisers.");
        }
      } else {
        setError("User not found in local storage.");
      }

      setLoading(false);
    };

    fetchFundraisers();
  }, [userId]); 

  const handleViewDetails = (fundraiserId) => {
    navigate(`/fundraiser-details/fundraiser/${fundraiserId}`);
  };

  const handleShare = (fundraiserId) => {
    const shareUrl = `${window.location.origin}/fundraiser-details/fundraiser/${fundraiserId}`;
    if (navigator.share) {
      navigator.share({
        title: "Support this fundraiser!",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      Swal.fire("URL copied to clipboard!");
    }
  };

  const handleToggleSave = async (fundraiserId) => {
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    try {
      const response = await axios.get(
        API_ENDPOINTS.GET_SAVED_FUNDRAISER
      );
      const savedFundraisersList = response.data;

      const existingSave = savedFundraisersList.find(
        (entry) =>
          entry.userId === userId && entry.fundraiserId === fundraiserId
      );

      if (existingSave) {
        Swal.fire({
          title: "Remove from Saved?",
          text: "Do you really want to remove this fundraiser from your saved list?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Remove",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setSavedFundraisers((prev) => {
              const updatedSavedFundraisers = { ...prev };
              delete updatedSavedFundraisers[fundraiserId]; 
              return updatedSavedFundraisers;
            });
            await axios.delete(
              API_ENDPOINTS.DELETE_SAVED_FUNDRAISER(existingSave.saveId)
            );

            Swal.fire(
              "Removed!",
              "The fundraiser has been removed from your saved list.",
              "success"
            );
            navigate("/view-fundraiser");
          }
        });
      } else {
        const saveData = {
          userId: userId,
          fundraiserId: fundraiserId,
        };
        await axios.post(API_ENDPOINTS.POST_SAVED_FUNDRAISER, saveData);

        setSavedFundraisers((prev) => ({
          ...prev,
          [fundraiserId]: true,
        }));

        Swal.fire(
          "Saved!",
          "The fundraiser has been added to your saved list.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error handling saved fundraiser:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container w-100 h-100">
        <CircularProgress />
      </div>
    );
  }

  const handleNoSavedFunds = () => {
    Swal.fire({
      title: "No Saved Funds",
      text: "You haven't saved any funds yet! Would you like to explore fundraisers?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/view-fundraiser"; 
      }
    });
  };

  return (
    <div
      className="fundraisers-container"
      
    >
      {error && <Typography color="error">{error}</Typography>}
      <Typography
        variant="h4"
        className="mb-4 w-100 h-100 d-flex justify-content-center align-items-center"
        color="#005c5b"
      >
        Saved Funds
      </Typography>

      <div className="fundraiser-grid">
        {fundraisers.length > 0 ? (
          fundraisers.map((fundraiser) => {
            const coverPicture = coverPictures[fundraiser.fundraiserId];
            const collectedAmount =
              collectedAmounts[fundraiser.fundraiserId] || 0;
            const saved = savedFundraisers[fundraiser.fundraiserId];

            return (
              <FundraiserCard
                key={fundraiser.fundraiserId}
                fundraiser={fundraiser}
                coverPicture={coverPicture}
                collectedAmount={collectedAmount}
                saved={saved}
                onShare={handleShare}
                onToggleSave={handleToggleSave}
                onViewDetails={handleViewDetails}
              />
            );
          })
        ) : (
          <Typography style={{height: "78.1vh"}}>{handleNoSavedFunds()}</Typography>
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
