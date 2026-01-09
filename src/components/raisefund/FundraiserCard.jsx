import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Share as ShareIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import "../styles/common-styles.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./display-details/styles/FundraiserCard.css"

const FundraiserCard = ({
  fundraiser,
  coverPicture,
  collectedAmount,
  saved,
  index,
  onShare,
  onToggleSave,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleViewDetails = () => {
    Swal.fire({
      title: "Please Login",
      text: "You need to log in to view details.",
      icon: "warning",
      confirmButtonText: "Login Now",
      confirmButtonColor: "#039695",
    }).then(() => {
      navigate("/login");
    });
  };

  const goalAmount = fundraiser.goalAmount || 0; // Default to 0 if goalAmount is missing
  const remainingAmount = collectedAmount ?? 0;
  const progress =
    goalAmount > 0 ? ((goalAmount - remainingAmount) / goalAmount) * 100 : 0;

  return (
    <motion.div
      key={fundraiser.fundraiserId}
      className="fundraiser-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="card">
        {/* Completed Label */}
        {remainingAmount === 0 && (
          <div className="completed-label">Completed</div>
        )}
        <div>
          <Tooltip title="Share">
            <IconButton onClick={() => onShare(fundraiser.fundraiserId)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton onClick={() => onToggleSave(fundraiser.fundraiserId)}>
              {saved ? (
                <Favorite style={{ color: "red" }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
          </Tooltip>
        </div>
        {coverPicture ? (
          <CardMedia
            component="img"
            height="200"
            image={coverPicture}
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
            Goal Amount: ₹{goalAmount}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            className="mt-3"
          />
          <Typography variant="body2" className="card-progress-text mt-1">
            {Math.round(progress)}% funded
          </Typography>

          <button
            className="main-button-with-mediumsize mt-2"
            onClick={() =>
              isLoggedIn
                ? onViewDetails(fundraiser.fundraiserId)
                : handleViewDetails()
            }
            style={{ border: "none" }}
          >
            View Details
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FundraiserCard;
