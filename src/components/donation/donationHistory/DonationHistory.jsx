import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/DonationHistory.css";
import DownloadReceipt from "./DownloadReceipt";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const DonationHistory = () => {
  const { userId } = useParams();
  const [donationHistory, setDonationHistory] = useState([]);
  const [fundraiserDetails, setFundraiserDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_DONATIONS_BY_USERID(userId))
      .then((response) => {
        const data = response.data;
        const successDonations = data.filter(
          (item) => item.status === "SUCCESS"
        );

        // Set only the successful donations
        setDonationHistory(successDonations);

        const fundraiserIds = Array.isArray(data)
          ? [...new Set(data.map((donation) => donation.fundraiserId))]
          : [data.fundraiserId];

        const fundraiserRequests = fundraiserIds.map((id) =>
          axios.get(API_ENDPOINTS.GET_FUNDRAISERS_BY_ID(id))
        );

        Promise.all(fundraiserRequests)
          .then((responses) => {
            const fundraiserMap = {};
            responses.forEach((response) => {
              fundraiserMap[response.data.fundraiserId] = response.data;
            });
            setFundraiserDetails(fundraiserMap);
          })
          .catch((error) => {
            console.error("Error fetching fundraiser details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching donation history:", error);
        setDonationHistory([]);
      });
  }, [userId]);

  const GoToDownloadReceipt = async (donationId) => {
    DownloadReceipt(donationId);
  };

  return (
    <div className="donation-history-container">
      <h2 className="donation-history-header">Donation History</h2>
      {donationHistory.length === 0 ? (
        <p className="no-donations">No donations found.</p>
      ) : (
        donationHistory.map((donation) => (
          <div className="donation-card" key={donation.donationId}>
            <p>
              <strong>Amount:</strong> ₹{donation.amount}
            </p>
            <p>
              <strong>Donation Date:</strong> {donation.donationDate}
            </p>
            <p>
              <strong>Transaction ID:</strong> {donation.transactionId}
            </p>
            <p>
              <strong>Fundraiser Title:</strong>{" "}
              {fundraiserDetails[donation.fundraiserId]?.title || "Loading..."}
            </p>
            <p>
              <strong>Fundraiser Description:</strong>{" "}
              {fundraiserDetails[donation.fundraiserId]?.description ||
                "Loading..."}
            </p>
            <div className="button-group-2 d-flex gap-3">
              <button
                className="view-details-button"
                onClick={() =>
                  navigate(`/fundraiser-details/${donation.fundraiserId}`)
                }
              >
                View Details
              </button>
              <button
                className="download-receipt-button"
                onClick={() => {
                  GoToDownloadReceipt(donation.donationId);
                }}
              >
                Download Receipt
              </button>
            </div>
          </div>
        ))
      )}
      <div className="d-flex justify-content-center gap-3">
        <button className="main-button-with-mediumsize" onClick={() => navigate("/profile")}>
          Back to Profile
        </button>
        <button className="main-button-with-mediumsize" onClick={() => navigate("/home")}>
          Home
        </button>
      </div>
    </div>
  );
};

export default DonationHistory;
