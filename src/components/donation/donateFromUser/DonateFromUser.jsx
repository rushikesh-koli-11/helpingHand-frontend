import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./styles/DonateFromUser.css";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";
import Swal from "sweetalert2";

const stripePromise = loadStripe(API_ENDPOINTS.STRIPE_PUBLIC_KEY);

const DonateFromUser = () => {
  const [remainingAmount, setRemainingAmount] = useState();
  const { fundraiserId } = useParams();
  const userId = JSON.parse(localStorage.getItem("user")).userId;

  const [formData, setFormData] = useState({
    amount: "",
    currency: "INR",
    title: "",
    fundraiserId: fundraiserId,
    userId: userId,
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  const [currencies] = useState(["INR", "USD", "EUR", "GBP", "JPY"]);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_FUNDRAISERS_BY_ID(fundraiserId))
      .then((response) => {
        setFormData((prevState) => ({
          ...prevState,
          title: response.data.title,
        }));
      })
      .catch((error) =>
        console.error("Error fetching fundraiser title:", error)
      );

    axios
      .get(API_ENDPOINTS.GET_BANK_DETAILS_BY_FUNDRAISERID(fundraiserId))
      .then((response) => {
        setBankDetails(response.data);
      })
      .catch((error) => console.error("Error fetching bank details:", error));

    axios
      .get(API_ENDPOINTS.GET_FUNDRAISER_DETAILS_BY_FUNDRAISERID(fundraiserId))
      .then((response) => {
        setRemainingAmount(response.data.remainingAmount);
      });
  }, [fundraiserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.amount > remainingAmount) {
        Swal.fire(
          "Enter valid amount",
          "Amount should be less than or equal to the remaining amount in the fund!",
          "info"
        );
      } else {
        const response = await axios.post(
          API_ENDPOINTS.PAYMENT_CHECKOUT_URL,
          formData
        );
        const stripe = await stripePromise;
        const { sessionId } = response.data;
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-card">
        <div className="donate-header">
          <h2>Change a life through your contribution</h2>
          <p className="fundraiser-title mb-0">{formData.title}</p>
        </div>
        <form onSubmit={handleSubmit} className="donate-form">
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <div className="input-group">
              <span className="input-group-text">{formData.currency}</span>
              <input
                type="number"
                id="amount"
                name="amount"
                min="1"
                value={formData.amount}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency:</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="form-control"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="bank-details mt-1">
            <h3>Bank Details</h3>
            <p>
              <strong>Account Number:</strong> {bankDetails.accountNumber}
            </p>
            <p>
              <strong>Bank Name:</strong> {bankDetails.bankName}
            </p>
            <p>
              <strong>IFSC Code:</strong> {bankDetails.ifscCode}
            </p>
          </div>

          <button type="submit" className="btn btn-donate">
            <i className="fas fa-heart mr-2"></i> Donate Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonateFromUser;
