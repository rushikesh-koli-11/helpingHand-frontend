import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast, Card, Container, Row, Col } from "react-bootstrap";
import { CheckCircleFill, House, List } from "react-bootstrap-icons";
import { IoMdDownload } from "react-icons/io";
import Confetti from "react-confetti";
import "./styles/PaymentSuccess.css";
import DownloadReceipt from "../donationHistory/DownloadReceipt";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const localId = localStorage.getItem("user");
  const userIdFromLocalstorage = JSON.parse(localId).userId;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const donationId = queryParams.get("donationId");

  const [fund, setFund] = useState(null);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_DONATIONS_BY_DONATIONID(donationId))
      .then((response) => {
        setFund(response.data);
      });

    axios.get(API_ENDPOINTS.DONATION_SUCCESS_URL(donationId))
    
  }, [donationId]);

  const GoToDownloadReceipt = async (donationId) => {
    DownloadReceipt(donationId);
  };

  return (
    <Container fluid className="payment-success-container">
      {showToast && (
        <Toast
          className="success-toast"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Payment Successful</strong>
          </Toast.Header>
          <Toast.Body>Thank you for your generous donation!</Toast.Body>
        </Toast>
      )}

      <Confetti /> {/* Confetti animation */}

      <Row className="success-page-container justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={6}>
          <Card className="text-center payment-success-card">
            <Card.Body>
              <div className="success-icon mb-4">
                <CheckCircleFill className="success-icon" />
              </div>
              <Card.Title className="mb-3">Payment Successful!</Card.Title>
              <Card.Text>
                Thank you for your generosity. Your contribution will make a
                difference.
              </Card.Text>
              {fund && (
                <p className="success-donation-amount">
                  Donation Amount: ₹{fund.amount}
                </p>
              )}
              <div className="d-grid gap-2">
                <div className="row">
                  <div className="col-md-12">
                    <button
                      className="payment-success-button theme-colour"
                      onClick={() =>
                        navigate(`/view-fundraisers/${userIdFromLocalstorage}`)
                      }
                    >
                      <List className="me-2" /> View More Fundraisers
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="payment-success-button theme-colour"
                      onClick={() => navigate("/home")}
                    >
                      <House className="me-2" /> Home
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      className="payment-success-button theme-colour"
                      variant="secondary"
                      onClick={() => {
                        GoToDownloadReceipt(donationId);
                      }}
                    >
                      <IoMdDownload className="me-2" /> Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
