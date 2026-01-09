import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import "./styles/DisplayPatientVerification.css"
import "../../styles/common-styles.css"
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS"

const DisplayPatientVerification = () => {
  const { fundraiserId } = useParams()
  const [patientVerificationData, setPatientVerificationData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPatientVerification = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_PATIENT_VERIFICATIONS_BY_FUNDRAISERID(fundraiserId))
        setPatientVerificationData(response.data)
      } catch (error) {
        setError("Error fetching patient verification details.")
      }
    }

    if (fundraiserId) {
      fetchPatientVerification()
    }
  }, [fundraiserId])

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="container mt-5 p-0">
      {patientVerificationData ? (
        <div className="card patient-verification-card">
          <div className="card-header theme-colour">
            <h5 className="mb-0">Patient Verification</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="verification-item">
                  <i className="fas fa-id-card verification-icon"></i>
                  <div>
                    <h6 className="verification-label">Adhaar Number</h6>
                    <p className="verification-value">{patientVerificationData.adhaarNumber}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="verification-item">
                  <i className="fas fa-file-alt verification-icon"></i>
                  <div>
                    <h6 className="verification-label">PAN Number</h6>
                    <p className="verification-value">{patientVerificationData.panNumber}</p>
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
          <p className="mt-2">Loading patient verification details...</p>
        </div>
      )}
    </div>
  )
}

export default DisplayPatientVerification