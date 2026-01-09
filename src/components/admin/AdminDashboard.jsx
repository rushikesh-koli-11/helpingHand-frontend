/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaProcedures,
  FaUserCircle,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import "./styles/AdminDashboard.css";
import "../styles/common-styles.css";
import { CircularProgress, Tabs, Tab } from "@mui/material";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import PaginationComponent from "../Pagination";

const AdminDashboard = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [filteredFundraisers, setFilteredFundraisers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [coverPictures, setCoverPictures] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchFundraisers();
  }, []);

  useEffect(() => {
    if (!loading) {
      const results = fundraisers.filter((fundraiser) =>
        fundraiser.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFundraisers(results);
    }
  }, [searchTerm, fundraisers, loading]);

  useEffect(() => {
    filterFundraisers();
  }, [tabIndex, fundraisers, searchTerm]);

  const filterFundraisers = () => {
    let filtered = fundraisers;
    console.log("fundsss - ", fundraisers);
    switch (tabIndex) {
      case 0: // Pending Fundraisers
        filtered = fundraisers.filter((f) => f.status === "pending");
        break;
      case 1: // Approved Fundraisers
        filtered = fundraisers.filter(
          (f) =>
            f.status === "approved" &&
            (f.remainingAmount === undefined || f.remainingAmount > 0)
        );
        break;
      case 2: // Rejected Fundraisers
        filtered = fundraisers.filter((f) => f.status === "rejected");
        break;
      case 3: // Completed Fundraisers
        filtered = fundraisers.filter(
          (f) => f.status === "approved" && f.remainingAmount === 0
        );
        break;
      default:
        break;
    }
    setFilteredFundraisers(
      filtered.filter((fundraiser) =>
        fundraiser.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const fetchFundraisers = async () => {
    try {
      const [fundraisersResponse, fundraiserDetailsResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.GET_FUNDRAISER),
        axios.get(API_ENDPOINTS.GET_FUNDRAISER_DETAILS),
      ]);
  
      const fundraisersData = fundraisersResponse.data;
      const fundraiserDetailsData = fundraiserDetailsResponse.data;
  
      console.log("Fundraisers:", fundraisersData);
      console.log("Fundraiser Details:", fundraiserDetailsData);
  
      // Map fundraiser details to their respective fundraisers
      const mergedFundraisers = fundraisersData.map((fundraiser) => {
        const details = fundraiserDetailsData.find(
          (detail) => detail.id === fundraiser.fundraiserId
        );
        return {
          ...fundraiser,
          remainingAmount: details ? details.remainingAmount : undefined,
        };
      });
  
      setFundraisers(mergedFundraisers);
      setFilteredFundraisers(mergedFundraisers);
  
      const coverPicturesMap = {};
      fundraiserDetailsData.forEach((data) => {
        if (data.coverPicture) {
          coverPicturesMap[data.id] = `data:image/jpeg;base64,${data.coverPicture}`;
        }
      });
      setCoverPictures(coverPicturesMap);
    } catch (err) {
      setError("Error fetching fundraisers");
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="loading-container w-100">
        <CircularProgress />
      </div>
    );
  }

  const handleViewDetails = (fundraiserId) => {
    navigate(`/fundraiser-details/fundraiser/${fundraiserId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const ITEMS_PER_PAGE = 6;

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFundraisers = filteredFundraisers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFundraisers.length / ITEMS_PER_PAGE)
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h1 className="dashboard-title">
          <FaUserCircle className="admin-icon" /> Admin Dashboard
        </h1>
        <div className="admin-navbar-right">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        centered
      >
        <Tab label="Pending" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
        <Tab label="Completed" />
      </Tabs>

      <div className="admin-content">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="fundraiser-grid">
          {loading ? (
            <p className="loading-text">Loading fundraisers...</p>
          ) : currentFundraisers.length > 0 ? (
            currentFundraisers.map((fundraiser) => (
              <div className="fundraiser-card" key={fundraiser.fundraiserId}>
                <div
                  className={
                    fundraiser.status === "approved"
                      ? "approved-label"
                      : fundraiser.status === "pending"
                      ? "pending-label"
                      : "rejected-label"
                  }
                  style={{ marginTop: "10px" }}
                >
                  <p style={{ marginRight: "8px" }}>{fundraiser.status}</p>
                </div>
                <div className="card-img-top">
                  {coverPictures[fundraiser.fundraiserId] ? (
                    <img
                      src={coverPictures[fundraiser.fundraiserId]}
                      alt={fundraiser.title}
                    />
                  ) : (
                    <div className="no-image">
                      <FaProcedures />
                      <span>No Cover Image</span>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{fundraiser.title}</h5>
                  <p className="card-text description">
                    {fundraiser.description}
                  </p>
                  <p className="card-text">
                    <strong>Goal Amount:</strong> ₹{fundraiser.goalAmount}
                  </p>
                  <p className="card-text">
                    <strong>Current Amount:</strong> ₹{fundraiser.currentAmount}
                  </p>
                  <p className="card-text">
                    <strong>Mobile:</strong> {fundraiser.mobileNumber}
                  </p>
                </div>
                <div className="card-footer d-flex gap-1">
                  <button
                    className="view-details-button"
                    onClick={() => handleViewDetails(fundraiser.fundraiserId)}
                  >
                    View Details
                  </button>
                  <button
                    className="call-button"
                    href={`tel:${fundraiser.mobileNumber}`}
                    onClick={() => {
                      window.location.href = `tel:${fundraiser.mobileNumber}`;
                    }}
                  >
                    Call For Verification
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-fundraisers">No fundraisers found</p>
          )}
        </div>
      </div>

      <div className="pagination-container">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
