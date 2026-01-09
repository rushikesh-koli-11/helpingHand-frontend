import { useState, useEffect } from "react"
import axios from "axios"
import "./styles/DisplayHospitalDetails.css"
import "../../styles/common-styles.css"
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS"

const DisplayHospitalDetails = ({ fundraiserId }) => {
  const [hospitalDetailsData, setHospitalDetailsData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_HOSPITAL_DETAILS_BY_FUNDRAISERID(fundraiserId))
        setHospitalDetailsData(response.data)
      } catch (error) {
        setError("Error fetching hospital details.")
      }
    }

    if (fundraiserId) {
      fetchHospitalDetails()
    }
  }, [fundraiserId])

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="container mt-5 p-0">
      {hospitalDetailsData ? (
        <div className="card hospital-details-card">
          <div className="card-header theme-colour">
            <h5 className="mb-0">Hospital Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-hospital detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Hospital Name</h6>
                    <p className="detail-value">{hospitalDetailsData.hospitalName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Address</h6>
                    <p className="detail-value">{hospitalDetailsData.hospitalAddress}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-user-md detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Doctor's Name</h6>
                    <p className="detail-value">{hospitalDetailsData.consultingDoctor || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-id-card detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Patient UHID Number</h6>
                    <p className="detail-value">{hospitalDetailsData.patientUHIDNumber}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-phone detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Contact Number</h6>
                    <p className="detail-value">{hospitalDetailsData.doctorPhoneNumber || "N/A"}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-sticky-note detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Additional Notes</h6>
                    <p className="detail-value">{hospitalDetailsData.additionalInformation || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hospital details...</p>
        </div>
      )}
    </div>
  )
}

export default DisplayHospitalDetails

