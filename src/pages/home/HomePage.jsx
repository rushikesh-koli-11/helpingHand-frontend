/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import home from "../../images/home.jpg"
import "./styles/HomePage.css"
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
    <div className="home-container-one fixfromtop p-3 p-md-5"  style={{ 
      backgroundImage: `url(${home})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 d-none d-md-block">
            {/* Empty space for larger screens */}
          </div>
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center gap-3 text-center text-md-start">
            <b><h2 className="mb-3" style={{fontWeight: 'bold'}}>Need Funds to Pay For <br className="d-none d-md-block"></br>a Medical Emergency or Social Cause?</h2></b>
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-between my-3 gap-3 gap-md-0">
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1'>0%</h3>
                <p className='light-text mb-0'>PLATFORM FEE*</p>
              </div>
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1'>72 Lakh+</h3>
                <p className='light-text mb-0'>DONORS</p>
              </div>
              <div className="text-center text-md-start">
                <h3 className='green-text mb-1'>3.2 Lakh+</h3>
                <p className='light-text mb-0'>FUNDRAISERS</p>
              </div>
            </div>
            <p className='green-text'>Helping hands <b style={{fontSize: 'clamp(18px, 4vw, 25px)'}}>0% Platform fees*</b> ensures maximum funds for you</p>
            <button className="main-button btn-primary btn-lg w-100 w-md-auto" onClick={handleRaiseFundClick}>Start a Fundraiser for FREE</button>
            <p className="green-text mt-3 mb-0">नि: शुल्क फंडरेजर शुरू करें</p>
          </div>      
        </div>     
      </div>
    </div>
  );
}

export default HomePage;
