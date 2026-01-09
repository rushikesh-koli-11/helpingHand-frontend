import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Dropdown } from "react-bootstrap";
import {
  FaUserCircle,
  FaHome,
  FaSearch,
  FaHandHoldingHeart,
  FaEnvelope,
} from "react-icons/fa";
import Swal from "sweetalert2";
import logo from "../../images/Helping Hands Logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserId(JSON.parse(localStorage.getItem("user")).userId);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setNavExpanded(false);
    navigate("/");
  }; 

  const handleRaiseFundClick = () => {
    if (!isLoggedIn) {
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
    setNavExpanded(false);
  };

  const handleToggle = (nextState) => {
    // Only allow toggle on mobile/tablet (below lg breakpoint)
    if (isMobile) {
      setNavExpanded(nextState !== undefined ? nextState : !navExpanded);
    } else {
      // On desktop, always keep it closed (menu should be visible without toggle)
      setNavExpanded(false);
    }
  };

  // Handle window resize and initialize mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // On desktop, ensure menu is not expanded (it should be visible without toggle)
      // On mobile, keep current state
      if (!mobile) {
        setNavExpanded(false);
      }
    };

    // Initialize: set mobile state
    const initialMobile = window.innerWidth < 992;
    setIsMobile(initialMobile);
    if (!initialMobile) {
      setNavExpanded(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BootstrapNavbar
      expand="lg"
      className="navbar-custom"
      fixed="top"
      expanded={isMobile ? navExpanded : false}
      onToggle={handleToggle}
    >
      <BootstrapNavbar.Brand as={Link} to="/home" className="brand">
        <img
          src={logo}
          alt="logo"
          width="40"
          height="40"
          className="logo-svg ml-2"
        />
        <span className="brand-name">Helping Hands</span>
      </BootstrapNavbar.Brand>

      <BootstrapNavbar.Toggle
        aria-controls="basic-navbar-nav"
        aria-label="Toggle navigation"
        aria-expanded={navExpanded}
      />

      <BootstrapNavbar.Collapse 
        id="basic-navbar-nav" 
        in={isMobile ? navExpanded : true}
      >
        <Nav className="ml-auto">
          <Nav.Link
            as={Link}
            to="/home"
            className={location.pathname === "/home" || location.pathname === "/" ? "active" : ""}
            onClick={() => setNavExpanded(false)}
          >
            <FaHome /> About
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/view-fundraiser"
            className={location.pathname === "/view-fundraiser" ? "active" : ""}
            onClick={() => setNavExpanded(false)}
          >
            <FaSearch /> Browse Fundraisers
          </Nav.Link>
          <Nav.Link
            onClick={handleRaiseFundClick}
            className={location.pathname === "/createfund" ? "active" : ""}
          >
            <FaHandHoldingHeart /> Raise a Fund
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/contact-us"
            className={location.hash === "#contact" ? "active" : ""}
            onClick={() => setNavExpanded(false)}
          >
            <FaEnvelope /> Contact us
          </Nav.Link>
        </Nav>

        <Nav>
          {isLoggedIn ? (
            <Dropdown align="end">
              <Dropdown.Toggle as={Nav.Link} id="dropdown-user">
                <FaUserCircle className="user-icon" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to="/profile"
                  onClick={() => setNavExpanded(false)}
                >
                  View Profile
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/view-fundraiser"
                  onClick={() => setNavExpanded(false)}
                >
                  Browse Fundraisers
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={`/donationHistory/${userId}`}
                  onClick={() => setNavExpanded(false)}
                >
                  Donation History
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={`/saved-funds`}
                  onClick={() => setNavExpanded(false)}
                >
                  Saved Funds
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={`/your-raised-funds/${userId}`}
                  onClick={() => setNavExpanded(false)}
                >
                  Your Raised Funds
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link
              as={Link}
              to="/login"
              className="login-btn"
              onClick={() => setNavExpanded(false)}
            >
              Login
            </Nav.Link>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
