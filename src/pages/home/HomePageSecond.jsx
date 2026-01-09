/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/HomePageSecond.css";
import donors from "../../images/whoAreWe/donors.png";
import livesSaved from "../../images/whoAreWe/livesSaved.png";
import expertSupport from "../../images/whoAreWe/expertSupport.png";
import featuredIn from "../../images/featuredIn/ads.png";
import footerImg from "../../images/footer/footer.png";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HomePageSecond = () => {
  const navigate = useNavigate();

  const handleRaiseFundClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      Swal.fire({
        title: "Please Login",
        text: "You need to log in to raise a fund.",
        icon: "warning",
        confirmButtonText: "Login Now",
        confirmButtonColor: "#039695",
      }).then(() => {
        navigate("/login");
      });
    } else {
      navigate("/createfund");
    }
  };
  
  return (
    <div>
      <Container className="fundraiser-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', paddingLeft: '15px', paddingRight: '15px' }}>
        <Row className="align-items-center">
          <Col xs={12} md={7}>
            <h1 className="text-center text-md-start">Start a Fundraiser in three simple steps</h1>
            <div className="step home-page-2">
              <div className="icon home-page-2">🚀</div>
              <div className="contents-home-page-2">
                <h3>Start your fundraiser</h3>
                <p>
                  It’ll take only 2 minutes. Just tell us a few details about
                  you and the ones you are raising funds for.
                </p>
              </div>
            </div>
            <div className="step home-page-2">
              <div className="icon home-page-2">🔗</div>
              <div className="contents-home-page-2">
                <h3>Share your fundraiser</h3>
                <p>
                  All you need to do is share the fundraiser with your friends
                  and family. In no time, support will start pouring in.
                </p>
                <p className="light-para">
                  Share your fundraiser directly from the dashboard on social
                  media.
                </p>
              </div>
            </div>
            <div className="step home-page-2">
              <div className="icon home-page-2">💸</div>
              <div className="contents-home-page-2">
                <h3 className="home-page-2">Withdraw Funds</h3>
                <p className="home-page-2">
                  The funds raised can be withdrawn without any hassle directly
                  to your bank account.
                </p>
                <p className="light-para home-page-2">
                  It takes only 5 minutes to withdraw funds on Helping Hands.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              className="main-button"
              onClick={handleRaiseFundClick}
            >
              START A FUNDRAISER FOR FREE
            </Button>
          </Col>
        </Row>
      </Container>
      <Container className="home-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', paddingLeft: '15px', paddingRight: '15px' }}>
        <h2 className="mt-5 text-center">
          Why Join <span className="green-text">Helping Hands?</span>
        </h2>
        <p className="text-center">
          Every 2 minutes, a child dies because they can't afford medical aid.
          With <span className="green-text">Helping Hands?</span>, we are on a
          mission to make healthcare a reality for everyone, no matter who you
          are.
        </p>
        <div className="video-container my-4">
          <div className="video-responsive" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
            <iframe
              src="https://www.youtube.com/embed/IOgqKLMPAVc?si=B7UyAfu2W3AE2hIm"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            ></iframe>
          </div>
        </div>
        <Row className="mt-5">
          <Col xs={12} sm={6} md={3} className="text-center mb-4 mb-md-0">
            <div className="icon money" />
            <h5 className="head">It's Affordable</h5>
            <p className="para">
              No matter what you give, every donation will make an impact.
            </p>
          </Col>
          <Col xs={12} sm={6} md={3} className="text-center mb-4 mb-md-0">
            <div className="icon public" />
            <h5 className="head">It's a Community</h5>
            <p className="para">
              Be part of an inspiring group, changing lives every month.
            </p>
          </Col>
          <Col xs={12} sm={6} md={3} className="text-center mb-4 mb-md-0">
            <div className="icon love" />
            <h5 className="head">It's Transparent</h5>
            <p className="para">
              You'll receive regular updates on your donations.
            </p>
          </Col>
          <Col xs={12} sm={6} md={3} className="text-center mb-4 mb-md-0">
            <div className="icon magic" />
            <h5 className="head">It's an Investment</h5>
            <p className="para">
              Your contributions will fund your medical emergencies.
            </p>
          </Col>
        </Row>
      </Container>

      <div className="impact-section" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <header className="header-section" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
          <div className="container-fluid text-white text-center py-5" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            <h1>Who Are We?</h1>
            <h2>
              Helping Hands is a Crowdfunding Platform based out of India.
            </h2>
            <p>
              We believe in 'Healthcare for All' & we're on a journey to make
              that a reality.
            </p>
          </div>
          <div
            className="containerBack my-5"
            style={{ marginTop: "0px", width: '100%', maxWidth: '100%', overflowX: 'hidden', overflowY: 'hidden', paddingLeft: '15px', paddingRight: '15px' }}
          >
            <div className="cardHeight row g-3" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden' }}>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="card" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                  <div className="card-body" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                    <img src={donors} alt="Donors Icon" className="mb-3" style={{ width: "50px", height: "50px" }} />
                    <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                      4,21,908 <br />
                      <span className="info-about-whoarewe">
                        members donating monthly
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="card" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                  <div className="card-body" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                    <img
                      src={livesSaved}
                      alt="Lives Saved Icon"
                      className="mb-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                      1,40,000
                      <br />
                      <span className="info-about-whoarewe">
                        Lives saved & counting
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="card" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                  <div className="card-body" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden', height: 'auto', minHeight: 'auto' }}>
                    <img
                      src={expertSupport}
                      alt="Support Icon"
                      className="mb-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <h3 style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                      24x7
                      <br />
                      <span className="info-about-whoarewe">
                        Expert Support Available
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* featured-in-section */}
      <Container className="featured-in-section" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', overflowY: 'hidden', marginBottom: '60px', paddingBottom: '40px', paddingTop: '40px' }}>
        <h2 className="featured-in-title">Featured In</h2>
        <img src={featuredIn} className="featured-image" alt="/" style={{ maxWidth: '100%', height: 'auto' }} />
      </Container>

      {/* footer */}
      <footer className="footer text-white py-4" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', overflowY: 'hidden', margin: 0, marginTop: '40px', paddingTop: '3rem' }}>
        <div className="container" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', margin: '0 auto', paddingLeft: '15px', paddingRight: '15px' }}>
          <div className="row g-3 g-md-4">
            <div className="col-12 col-sm-6 col-md-3">
              <h5
                style={{ borderBottom: "1px solid #ffffff4f", height: "40px" }}
              >
                Helping Hands
              </h5>
              <div className="social-icons">
                <FaFacebookSquare />
                <FaTwitter />
                <FaLinkedin />
                <FaYoutube />
                <FaInstagram />
                <FaWhatsapp />
              </div>
              <br></br>
              <p>
                <b>2.5M+</b>
                <br />
                <span className="footer-details">Followers</span>
              </p>
              <br />
              <p>
                For any queries
                <br />
                <span className="footer-details">
                  Email: info@helpinghands.org
                </span>
                <br />
                <span className="footer-details">
                  Contact No: +91 9930088522
                </span>
              </p>
              <br />
              <p>
                For any Media & PR queries
                <br />
                <span className="footer-details">
                  Email: pr@helpinghands.org
                </span>
                <br />
                <span className="footer-details">
                  Contact No: +91 9930088551
                </span>
              </p>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <h5>Causes</h5>
              <ul className="list-unstyled">
                <li>Medical crowdfunding</li>
                <li>Cancer Crowdfunding</li>
                <li>Transplant Crowdfunding</li>
                <li>Child Welfare</li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <h5>How it works?</h5>
              <ul className="list-unstyled">
                <li>Fundraising for NGOs</li>
                <li>Sponsor A Child</li>
                <li>Fundraising Tips</li>
                <li>What is Crowdfunding?</li>
                <li>Corporates</li>
                <li>Withdraw Funds</li>
                <li>Browse Fundraiser</li>
                <li>Find Hospitals</li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <h5>About Us</h5>
              <ul className="list-unstyled">
                <li>Team Helping Hands</li>
                <li>In The News</li>
                <li>Web Stories</li>
                <li>Careers</li>
                <li>Helping Hands Blog</li>
                <li>Success Stories</li>
                <li>Is Helping Hands Genuine?</li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <h5>Support</h5>
              <ul className="list-unstyled">
                <li>Medical Finance</li>
                <li>FAQs & Help Center</li>
                <li>Are Helping Hands Campaigns Genuine?</li>
                <li>Fundraiser Video</li>
                <li>Trust & Safety</li>
                <li>Plans & Pricing*</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
              <img src={footerImg} alt="Visa" className="payment-icon" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
              <p style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.875rem)", wordWrap: "break-word" }}>
                &copy; 2025 Helping Hands. All Rights Reserved. | Terms of Use |
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePageSecond;
