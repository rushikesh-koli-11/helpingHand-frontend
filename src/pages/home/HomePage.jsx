/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import home from "../../images/home.jpg"
import "./styles/HomePage.css"
import "./styles/HomePage.responsive.css"
import "../../components/styles/common-styles.css"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const handleRaiseFundClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Please Login",
        text: "You need to log in to raise a fund.",
        icon: "warning",
        confirmButtonText: "Login Now",
        confirmButtonColor: "#039695",
      }).then(() => {
        navigate("/login")
      })
    } else {
      navigate("/createfund")
    }
  }
  return (
    <div className="home-container-one fixfromtop" style={{ 
      backgroundImage: `url(${home})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      backgroundAttachment: 'scroll'
    }}>
      {/* Overlay for better text readability on mobile */}
      <div className="home-banner-overlay"></div>
      
      <Container className="home-banner-content" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', position: 'relative', zIndex: 1 }}>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="d-none d-md-block">
            {/* Empty space for larger screens */}
          </Col>
          <Col xs={12} md={6} className="d-flex flex-column justify-content-center gap-3 gap-md-4 text-center text-md-start" style={{ display: 'flex !important' }}>
            <h2 className="home-banner-heading mb-3 mb-md-4">Need Funds to Pay For <br className="d-none d-md-block" />a Medical Emergency or Social Cause?</h2>
            
            <div className="home-banner-stats d-flex flex-column flex-md-row justify-content-center justify-content-md-between my-3 my-md-4 gap-3 gap-md-0">
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1 mb-md-2'>0%</h3>
                <p className='light-text mb-0'>PLATFORM FEE*</p>
              </div>
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1 mb-md-2'>72 Lakh+</h3>
                <p className='light-text mb-0'>DONORS</p>
              </div>
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1 mb-md-2'>3.2 Lakh+</h3>
                <p className='light-text mb-0'>FUNDRAISERS</p>
              </div>
            </div>
            
            <p className='home-banner-slogan green-text mb-2 mb-md-3'>Helping hands <b>0% Platform fees*</b> ensures maximum funds for you</p>
            
            <button className="home-banner-button main-button btn-primary btn-lg" onClick={handleRaiseFundClick}>
              Start a Fundraiser for FREE
            </button>
            
            <p className="home-banner-hindi green-text mt-2 mt-md-3 mb-0">नि: शुल्क फंडरेजर शुरू करें</p>
          </Col>      
        </Row>     
      </Container>
    </div>
  );
}

export default HomePage;
