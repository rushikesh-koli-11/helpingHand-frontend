import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaClipboard, FaMagic } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./display-details/styles/SocialMediaPostGenerator.css";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

const SocialMediaPostGenerator = () => {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { fundraiserId } = useParams();
  const [fundraiser, setFundraiser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraisers = async () => {
      const response = await axios.get(
        API_ENDPOINTS.GET_FUNDRAISERS_BY_ID(fundraiserId)
      );
      setFundraiser(response.data);
    };

    fetchFundraisers();
  }, [fundraiserId]);

  const generatePost = async () => {
    setLoading(true);
    setError("");

    const prompt = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate an engaging social media post for a crowdfunding campaign.
          Fundraiser Title: ${fundraiser.title}
          Goal Amount: ${fundraiser.goalAmount}
          Cause: Unknown
          Description: ${fundraiser.description}
          Include an emotional appeal, hashtags, and a call-to-action.`,
        },
      ],
      max_tokens: 300,
    };

    try {
      const response = await axios.post(
        API_ENDPOINTS.POST_OPENAI ,
        prompt,
        {
          headers: {
            Authorization: `Bearer ${API_ENDPOINTS.OPENAI_SITE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPostContent(response.data.choices[0].message.content.trim());
    } catch (err) {
      setError("Failed to generate post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postContent);
    Swal.fire("Copied to clipboard!", "", "success");
  };

  return (
    <div className="social-post-gradient-background">
      <div className="social-post-card animate__animated animate__fadeIn">
        <Typography variant="h4" className="social-post-title">
          Generate Social Media Post
        </Typography>
        <Button
          className="social-post-btn btn-primary btn-lg styled-button mt-2 p-2"
          onClick={generatePost}
          disabled={loading}
          startIcon={<FaMagic />}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Generate Post"
          )}
        </Button>

        {error && <Typography color="error">{error}</Typography>}

        {postContent && (
          <div className="mt-4">
            <div className="post-content shadow-sm">
              <p>{postContent}</p>
            </div>
            <div className="d-flex gap-3">
              <Button
                className="main-button"
                onClick={copyToClipboard}
                startIcon={<FaClipboard />}
              >
                Copy to Clipboard
              </Button>
              <button 
              className="main-button"
              onClick={()=>{
                navigate("/home");
              }}>
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPostGenerator;
