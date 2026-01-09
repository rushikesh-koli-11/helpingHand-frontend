import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast, Card, Container, Row, Col } from "react-bootstrap";
import { XCircleFill, House, List } from "react-bootstrap-icons";
import { IoReloadSharp } from "react-icons/io5";
import "./styles/PaymentCancel.css"; 
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const localId = localStorage.getItem("user");
  const userIdFromLocalstorage = JSON.parse(localId).userId;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const donationId = queryParams.get("donationId");

  const [fund, setFund] = useState();
  const [showToast, setShowToast] = useState(true);
  const [fundraiserId, setFundraiserId] = useState();

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_DONATIONS_BY_DONATIONID(donationId))
      .then((response) => {
        setFund(response.data);
        setFundraiserId(response.data.fundraiserId);
      });

    // Mark donation as cancelled
    if (donationId) {
      axios.get(API_ENDPOINTS.DONATION_CANCEL_URL(donationId))
        .catch((error) => {
          console.error("Error marking donation as cancelled:", error);
        });
    }

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [donationId]);

  return (
    <Container
      fluid
      className="payment-cancel-container d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="justify-content-center">
        <Col xs={12} md={12}>
          <Card className="text-center payment-cancel-card">
            <Card.Body>
              <div className="failure-icon-wrapper mb-4">
                <XCircleFill className="failure-icon shake-icon" />
              </div>
              <Card.Title className="mb-4">Payment Failed!</Card.Title>
              <Card.Text>
                Your payment could not be processed. Please try again later.
              </Card.Text>
              {fund && (
                <p className="cancel-donation-amount">
                  Donation Amount: ₹{fund.amount}
                </p>
              )}
              <div className="d-grid gap-2 mt-4">
                <div className="row">
                  <div className="col-md-12">
                    <button
                      className="payment-cancel-button w-100"
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
                    <button className="payment-cancel-button w-100" onClick={() => navigate("/home")}>
                      <House className="me-2" /> Home
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button className="payment-cancel-button w-100" onClick={()=>{navigate(`/donate/${fundraiserId}`)}}>
                    <IoReloadSharp
                    className="me-2" /> Retry payment
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className="cancel-toast position-absolute top-0 end-0 m-3"
      >
        <Toast.Header>
          <strong className="me-auto">Payment Failed</strong>
        </Toast.Header>
        <Toast.Body>
          We encountered an issue with processing your payment. Please try
          again.
        </Toast.Body>
      </Toast>
    </Container>
  );
};

export default PaymentCancel;
