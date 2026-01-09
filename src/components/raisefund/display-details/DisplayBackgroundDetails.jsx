import { useState, useEffect } from "react"
import axios from "axios"
import "./styles/DisplayBackgroundDetails.css"
import "./../../styles/common-styles.css"
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS"

const DisplayBackgroundDetails = ({ fundraiserId }) => {
  const [backgroundDetailsData, setBackgroundDetailsData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBackgroundDetails = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_BACKGROUND_DETAILS_BY_FUNDRAISERID(fundraiserId))
        setBackgroundDetailsData(response.data)
      } catch (error) {
        setError("Error fetching background details.")
      }
    }

    if (fundraiserId) {
      fetchBackgroundDetails()
    }
  }, [fundraiserId])

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="background-details-container mt-5">
      {backgroundDetailsData ? (
        <div className="card background-details-card">
          <div className="card-header theme-colour">
            <h5 className="mb-0">Background Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-user-friends detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Relation with Patient</h6>
                    <p className="detail-value">{backgroundDetailsData.relationWithPatient || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-money-bill-wave detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Monthly Income of Patient's Family</h6>
                    <p className="detail-value">{backgroundDetailsData.monthlyIncomeOfPatientsFamily || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading background details...</p>
        </div>
      )}
    </div>
  )
}

export default DisplayBackgroundDetails

