import React from "react";
import { MdLocationPin, MdOutlineMailOutline } from "react-icons/md";
import { Container, Row, Col } from "react-bootstrap";
import "./ContactUs.responsive.css";
import "../styles/common-styles.css";
import { FaPhoneAlt } from "react-icons/fa";

const ContactForm = () => {
  return (
    <div className="contact-container w-100" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <main style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <Container className="py-5" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
          <Row className="g-5" style={{ width: '100%', margin: 0 }}>
            {/* Contact Information Block */}
            <Col xl={6} xs={12}>
              <Row className="row-cols-md-2 g-4">
                <div
                  className="aos-item"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="aos-item__inner">
                    <div className="info-box">
                      <div className="info-header">
                        <span className="me-1">
                          <MdOutlineMailOutline />
                        </span>
                        <span className="info-title">Email</span>
                      </div>
                      <span>info@helpinghands.com</span>
                    </div>
                  </div>
                </div>
                <div
                  className="aos-item"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="aos-item__inner">
                    <div className="info-box">
                      <div className="info-header">
                        <span className="me-1"><FaPhoneAlt /></span>
                        <span className="info-title">Phone</span>
                      </div>
                      <span>9767638526</span>
                    </div>
                  </div>
                </div>
              </Row>
              <div
                className="aos-item mt-4"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="aos-item__inner">
                  <div className="info-box">
                    <div className="info-header">
                      <span className="me-1"><MdLocationPin /></span>
                      <span className="info-title">Office Location</span>
                    </div>
                    <span>#007, ITPB, Whitefield Banglore, India</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Contact Form */}
            <Col xl={6} xs={12}>
              <h2 className="pb-4">Leave a message</h2>
              <div className="row g-4">
                <div className="col-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control contact-input" />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control contact-input" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control contact-input" />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control contact-input" />
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <select className="form-select contact-input">
                  <option value="1">India</option>
                  <option value="2">Non India</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control contact-input" rows="3"></textarea>
              </div>
              <button type="button" className="main-button-with-mediumsize">
                Send Message
              </button>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default ContactForm;
