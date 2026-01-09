import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterUserForm from "./components/users/Register.jsx";
import LoginForm from "./components/users/Login";
import Home from "./components/Home.jsx";
import Profile from "./components/profile/Profile";
import CreateFund from "./components/raisefund/CreateFund";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ViewFundraisers from "./components/view-fundraisers/ViewFundraisers";
import DonateFromUser from "./components/donation/donateFromUser/DonateFromUser";
import PaymentSuccess from "./components/donation/donateFromUser/PaymentSuccess";
import PaymentCancel from "./components/donation/donateFromUser/PaymentCancel";
import DonationHistory from "./components/donation/donationHistory/DonationHistory";
import DownloadReceipt from "./components/donation/donationHistory/DownloadReceipt";
import Navbar from "./components/Navbar/Navbar.jsx";
import SidebarComponent from "./components/raisefund/details/SidebarComponent.jsx";
import FundraiserDetails from "./components/raisefund/details/FundraiserDetails";
import MedicalDocuments from "../src/components/raisefund/details/MedicalDocuments.jsx";
import PatientVerification from "../src/components/raisefund/details/PatientVerification.jsx";
import HospitalDetails from "../src/components/raisefund/details/HospitalDetails.jsx";
import Background from "../src/components/raisefund/details/Background.jsx";
import BankDetails from "../src/components/raisefund/details/BankDetails.jsx";
import "./App.css";
import ContactForm from "./components/contactus/ContactUs.jsx";
import ViewYourRaisedFund from "./components/raisefund/ViewYourRaisedFund.jsx";
import SocialMediaPostGenerator from "./components/raisefund/SocialMediaPostGenerator.jsx";
import SavedFunds from "./components/raisefund/SavedFunds.jsx";
import DisplayFundraiserDetails from "./components/raisefund/display-details/DisplayFundraiserDetails.jsx";

function App() {
  const [relationWithPatient, setRelationWithPatient] = useState("");

  const handleRelationChange = (event) => {
    setRelationWithPatient(event.target.value);
  };

  return (
    <Router>
      <div
        className="app-raisefund"
        style={{ display: "flex", height: "100%" }}
      >
        <div className="content" style={{ display: "flex" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                  </>
                }
              />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterUserForm />} />
              <Route
                path="/home"
                element={
                  <>
                    <Navbar />
                    <Home />
                  </>
                }
              />

              <Route path="/profile" element={<Profile />} />

              <Route
                path="/createfund"
                element={
                  <>
                    <Navbar />
                    <CreateFund />
                  </>
                }
              />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route
                path="/fundraiser-details/fundraiser/:fundraiserId"
                element={
                  <>
                    <DisplayFundraiserDetails />
                  </>
                }
              />
              <Route
                path="/view-fundraiser"
                element={
                  <>
                    <Navbar />
                    <ViewFundraisers />
                  </>
                }
              />
              <Route
                path="/view-fundraisers/:fundraiserId"
                element={
                  <>
                    <Navbar />
                    <ViewFundraisers />
                  </>
                }
              />
              <Route
                path="/donate/:fundraiserId"
                element={<DonateFromUser />}
              />
              <Route path="/donations/success" element={<PaymentSuccess />} />
              <Route path="/donations/cancel" element={<PaymentCancel />} />
              <Route
                path="/donationHistory/:userId"
                element={<DonationHistory />}
              />
              <Route path="/download-receipt" element={<DownloadReceipt />} />
              <Route
                path="/fundraiser-details"
                element={
                  <>
                    <Navbar />
                    <SidebarComponent />
                    <FundraiserDetails />
                  </>
                }
              />
              <Route
                path="/medical-documents"
                element={
                  <>
                    <Navbar />
                    <SidebarComponent />
                    <MedicalDocuments />
                  </>
                }
              />
              <Route
                path="/patient-verification"
                element={
                  <>
                    <SidebarComponent />
                    <Navbar />
                    <PatientVerification />
                  </>
                }
              />
              <Route
                path="/background"
                element={
                  <>
                    <SidebarComponent />
                    <Navbar />
                    <Background
                      relationWithPatient={relationWithPatient}
                      handleRelationChange={handleRelationChange}
                    />
                  </>
                }
              />
              <Route
                path="/hospital-details"
                element={
                  <>
                    <SidebarComponent />
                    <Navbar />
                    <HospitalDetails />
                  </>
                }
              />

              <Route
                path="/bank-details"
                element={
                  <>
                    <SidebarComponent />
                    <Navbar />
                    <BankDetails />
                  </>
                }
              />
              <Route
                path="/contact-us"
                element={
                  <>
                    <ContactForm />
                  </>
                }
              />
              <Route
                path="/your-raised-funds/:userId"
                element={
                  <>
                    <Navbar />
                    <ViewYourRaisedFund />
                  </>
                }
              />
              <Route
                path="/socialmediapostgenerator/:fundraiserId"
                element={
                  <>
                    <SocialMediaPostGenerator />
                  </>
                }
              />
              <Route
                path="/saved-funds"
                element={
                  <>
                    <SavedFunds />
                  </>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
