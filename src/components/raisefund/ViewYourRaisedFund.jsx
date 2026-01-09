/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Handshake,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../view-fundraisers/styles/ViewFundraisers.css";
import "../styles/common-styles.css";
import "../raisefund/display-details/styles/ViewYourRaisedFunds.css";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

const ViewYourRaisedFund = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [coverPictures, setCoverPictures] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectedAmounts, setCollectedAmounts] = useState({});
  const collectedAmountMap = {};

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchFundraisers = async () => {
      setLoading(true);
      if (userId) {
        try {
          const response = await axios.get(API_ENDPOINTS.GET_FUNDRAISER);

          if (response.status === 200) {
            const approvedFundraisers = response.data.filter(
              // eslint-disable-next-line eqeqeq
              (fundraiser) => fundraiser.userId == userId
            );

            // Fetching cover pictures
            const fundraiserDetailsResponse = await axios.get(
              API_ENDPOINTS.GET_FUNDRAISER_DETAILS
            );
            const coverPicturesMap = {};
            fundraiserDetailsResponse.data.forEach((data) => {
              if (data.coverPicture) {
                const base64String = `data:image/jpeg;base64,${data.coverPicture}`;
                coverPicturesMap[data.id] = base64String;
              }
              if (data.remainingAmount !== undefined) {
                collectedAmountMap[data.id] = data.remainingAmount;
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
      }
      setLoading(false);
    };

    fetchFundraisers();
  }, []);

  const handleViewDetails = (fundraiserId) => {
    navigate(`/fundraiser-details/fundraiser/${fundraiserId}`);
  };

  const handleSocialMediaPosts = (fundraiserId) => {
    navigate(`/socialmediapostgenerator/${fundraiserId}`);
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

  const handleNoRaisedFunds = () => {
    Swal.fire({
      title: "No raised funds!",
      text: "You haven't raised any fund! Start you fund today?",
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "cancel",
      showConfirmButton: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/createfund";
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container w-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="fundraisers-container fixfromtop ">
      {error && <Typography color="error">{error}</Typography>}

      <div className="fundraiser-grid">
        {filteredFundraisers.length > 0 ? (
          filteredFundraisers.map((fundraiser, index) => {
            const remainingAmount =
              collectedAmounts[fundraiser.fundraiserId] ?? 0;
            const goalAmount = fundraiser.goalAmount;
            const progress =
              goalAmount > 0
                ? ((goalAmount - remainingAmount) / goalAmount) * 100
                : 0;
            return (
              <motion.div
                key={fundraiser.fundraiserId}
                className="fundraiser-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="card">
                  <div>
                    <Tooltip title="Share">
                      <IconButton
                        onClick={() => handleShare(fundraiser.fundraiserId)}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {coverPictures[fundraiser.fundraiserId] ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={coverPictures[fundraiser.fundraiserId]}
                      alt={fundraiser.title}
                      className="card-media"
                    />
                  ) : (
                    <div className="no-image">
                      <Typography variant="body2">No Cover Image</Typography>
                    </div>
                  )}
                  <CardContent className="card-content">
                    <Typography variant="h6" className="card-title">
                      {fundraiser.title}
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      {fundraiser.description}
                    </Typography>
                    <Typography variant="body2" className="card-goal mt-3">
                      Goal Amount: ₹{fundraiser.goalAmount}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      className="mt-3"
                    />
                    <Typography
                      variant="body2"
                      className="card-progress-text mt-1"
                    >
                      {Math.round(progress)}% funded
                    </Typography>

                    <div>
                      <Typography
                        variant="body2"
                        className="status-check mt-2 w-50 d-flex justify-content-left align-items-center fs-5"
                      >
                        Status:
                        <p
                          className={`mb-0 ${
                            fundraiser.status.toLowerCase() === "approved"
                              ? "text-success"
                              : fundraiser.status.toLowerCase() === "pending"
                              ? "text-warning"
                              : fundraiser.status.toLowerCase() === "rejected"
                              ? "text-danger"
                              : "text-secondary"
                          }`}
                          style={{ marginLeft: "5px" }}
                        >
                          {fundraiser.status.toUpperCase()}
                        </p>
                      </Typography>
                    </div>

                    <div className="d-flex w-100 gap-2">
                      <button
                        className="theme-colour mt-2 w-50"
                        onClick={() =>
                          handleViewDetails(fundraiser.fundraiserId)
                        }
                        style={{
                          border: "none",
                          height: "50px",
                          borderRadius: "5px",
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="theme-colour mt-2 w-50 Generate-social-media-button"
                        disabled={
                          fundraiser.status === "pending" ||
                          fundraiser.status === "rejected"
                        }
                        onClick={() =>
                          handleSocialMediaPosts(fundraiser.fundraiserId)
                        }
                        style={{
                          border: "none",
                          height: "50px",
                          borderRadius: "5px",
                        }}
                      >
                        Generate Social Media Post
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Typography style={{ height: "78.2vh" }}>
            {handleNoRaisedFunds()}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ViewYourRaisedFund;
