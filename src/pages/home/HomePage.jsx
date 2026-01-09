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
    <div className="home-container-one fixfromtop p-5"  style={{ 
      backgroundImage: `url(${home})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh'
    }}>
      <div className="row">
        <div className="col-md-6">

        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center gap-3">
          <b ><h2 style={{fontWeight: 'bold'}}>Need Funds to Pay For <br></br>a Medical Emergency or Social Cause?</h2></b>
          <div className="d-flex justify-content-between my-3">
            <div>
              <h3 className='green-text'>0%</h3>
              <p className='light-text'>PLATFORM FEE*</p>
            </div>
            <div>
              <h3 className='green-text'>72 Lakh+</h3>
              <p className='light-text'>DONORS</p>
            </div>
            <div>
              <h3 className='green-text'>3.2 Lakh+</h3>
              <p className='light-text'>FUNDRAISERS</p>
            </div>
          </div>
          <p className='green-text'>Helping hands <b style={{fontSize: '25px'}}>0% Platform fees*</b> ensures maximum funds for you</p>
          <button className="main-button btn-primary" onClick={handleRaiseFundClick}>Start a Fundraiser for FREE</button>
          <p className="green-text mt-3">नि: शुल्क फंडरेजर शुरू करें</p>
        </div>      
      </div>     
    </div>
  );
}

export default HomePage;
