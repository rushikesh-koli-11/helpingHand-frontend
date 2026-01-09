/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/ViewFundraisers.css";
import "../styles/common-styles.css";
import Swal from "sweetalert2";
import FundraiserCard from "../raisefund/FundraiserCard";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import PaginationComponent from "../Pagination";

const ViewFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [coverPictures, setCoverPictures] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectedAmounts, setCollectedAmounts] = useState({});
  const [savedFundraisers, setSavedFundraisers] = useState({});
  const [userIdForSavedFunds, setUserIdForSavedFunds] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const collectedAmountMap = {};

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      setLoading(true);

      const localId = localStorage.getItem("user");
      const userIdFromLocalstorage = localId
        ? JSON.parse(localId).userId
        : null;

      setUserIdForSavedFunds(userIdFromLocalstorage);

      if (userIdFromLocalstorage) {
        try {
          // Fetching fundraisers by userId
          const response = await axios.get(
            API_ENDPOINTS.GET_FUNDRAISERS_BY_USER(userIdFromLocalstorage)
          );

          if (response.status === 200) {
            const approvedFundraisers = response.data.filter(
              (fundraiser) =>
                fundraiser.status === "approved" &&
                fundraiser.userId !== userIdFromLocalstorage
            );

            // Fetching cover pictures
            const fundraiserDetailsResponse = await axios.get(
              API_ENDPOINTS.GET_FUNDRAISER_DETAILS
            );

            const coverPicturesMap = {};

            fundraiserDetailsResponse.data.forEach((data) => {
              if (data.coverPicture) {
                // Backend now returns Cloudinary URL instead of Base64
                const imageUrl = data.coverPicture.startsWith("http") 
                  ? data.coverPicture 
                  : data.coverPicture; // Already a URL from Cloudinary
                coverPicturesMap[data.fundraiserId || data.id] = imageUrl;
              }
              if (data.remainingAmount !== undefined) {
                collectedAmountMap[data.fundraiserId || data.id] = data.remainingAmount;
              }
            });
            setCollectedAmounts(collectedAmountMap);
            setCoverPictures(coverPicturesMap);
            setFundraisers(approvedFundraisers);
          } else {
            setError("Failed to fetch approved fundraisers.");
          }
        } catch (err) {
          setError("Error fetching data. Showing public fundraisers.");
          const fallbackResponse = await axios.get(
            API_ENDPOINTS.GET_FUNDRAISER
          );
          if (fallbackResponse.status === 200) {
            const approvedFundraisers = fallbackResponse.data.filter(
              (fundraiser) => fundraiser.status === "approved"
            );
            setFundraisers(approvedFundraisers);
          }
        }
      } else {
        const fundraiserDetailsResponse = await axios.get(
          API_ENDPOINTS.GET_FUNDRAISER_DETAILS
        );
        const coverPicturesMap = {};
        fundraiserDetailsResponse.data.forEach((data) => {
          if (data.coverPicture) {
            // Backend now returns Cloudinary URL instead of Base64
            const imageUrl = data.coverPicture.startsWith("http") 
              ? data.coverPicture 
              : data.coverPicture; // Already a URL from Cloudinary
            coverPicturesMap[data.fundraiserId || data.id] = imageUrl;
          }
          if (data.remainingAmount !== undefined) {
            collectedAmountMap[data.fundraiserId || data.id] = data.remainingAmount;
          }
        });
        setCollectedAmounts(collectedAmountMap);
        setCoverPictures(coverPicturesMap);

        try {
          const response = await axios.get(API_ENDPOINTS.GET_FUNDRAISER);
          if (response.status === 200) {
            const approvedFundraisers = response.data.filter(
              (fundraiser) => fundraiser.status === "approved"
            );
            setFundraisers(approvedFundraisers);
          }
        } catch {
          setError("Failed to fetch public fundraisers.");
        }
      }

      setLoading(false);
    };

    fetchFundraisers();
  }, []);

  useEffect(() => {
    const fetchSavedFundraisers = async () => {
      if (!userIdForSavedFunds) return;

      try {
        const response = await axios.get(API_ENDPOINTS.GET_SAVED_FUNDRAISER);
        const savedData = response.data;

        const savedMap = {};
        savedData.forEach((entry) => {
          if (entry.userId == userIdForSavedFunds) {
            savedMap[entry.fundraiserId] = true;
          }
        });

        setSavedFundraisers(savedMap);
      } catch (error) {
        console.error("Error fetching saved fundraisers:", error);
      }
    };

    fetchSavedFundraisers();
  }, [userIdForSavedFunds]);

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

  // Filter fundraisers based on search query
  const filteredFundraisers = fundraisers.filter((fundraiser) =>
    fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container w-100">
        <CircularProgress />
      </div>
    );
  }

  const handleToggleSave = async (fundraiserId) => {
    if (!userIdForSavedFunds) {
      console.error("User ID not found in local storage");
      return;
    }

    try {
      const response = await axios.get(API_ENDPOINTS.GET_SAVED_FUNDRAISER);
      const savedFundraisersList = response.data;

      const existingSave = savedFundraisersList.find(
        (entry) =>
          entry.userId == userIdForSavedFunds &&
          entry.fundraiserId == fundraiserId
      );

      if (existingSave) {
        Swal.fire({
          title: "Remove from Saved?",
          text: "Do you really want to remove this fundraiser from your saved list?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Remove",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete(
              API_ENDPOINTS.GET_SAVED_FUNDRAISER_BY_SAVEID(existingSave.saveId)
            );
            setSavedFundraisers((prev) => ({
              ...prev,
              [fundraiserId]: false,
            }));

            Swal.fire(
              "Removed!",
              "The fundraiser has been removed.",
              "success"
            );
          }
        });
      } else {
        const saveData = {
          userId: userIdForSavedFunds,
          fundraiserId: fundraiserId,
        };

        await axios.post(API_ENDPOINTS.GET_SAVED_FUNDRAISER, saveData);
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

  const ITEMS_PER_PAGE = 6;

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFundraisers = filteredFundraisers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFundraisers.length / ITEMS_PER_PAGE)
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className="fundraisers-container fixfromtop"
      style={{ minHeight: "100vh" }}
    >
      {error && <Typography color="error">{error}</Typography>}

      {/* Search input field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="fundraiser-grid">
        {currentFundraisers.filter(
          (fundraiser) => collectedAmounts[fundraiser.fundraiserId] !== 0
        ).length > 0 ? ( // Exclude fundraisers with 0 remaining amount
          currentFundraisers
            .filter(
              (fundraiser) => collectedAmounts[fundraiser.fundraiserId] !== 0
            ) // Filter again before mapping
            .map((fundraiser) => {
              const remainingAmount =
                collectedAmounts[fundraiser.fundraiserId] || 0;
              const coverPicture = coverPictures[fundraiser.fundraiserId];
              const saved = savedFundraisers[fundraiser.fundraiserId];

              return (
                <FundraiserCard
                  key={fundraiser.fundraiserId}
                  fundraiser={fundraiser}
                  coverPicture={coverPicture}
                  collectedAmount={remainingAmount}
                  saved={saved}
                  onShare={handleShare}
                  onToggleSave={handleToggleSave}
                  onViewDetails={handleViewDetails}
                />
              );
            })
        ) : (
          <Typography>No approved fundraisers available.</Typography>
        )}
      </div>

      <div className="pagination-container">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ViewFundraisers;
