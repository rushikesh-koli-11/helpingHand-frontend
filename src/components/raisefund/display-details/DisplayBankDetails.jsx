import { useState, useEffect } from "react"
import axios from "axios"
import "./styles/DisplayBankDetails.css"
import "../../styles/common-styles.css"
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS"

const DisplayBankDetails = ({ fundraiserId }) => {
  const [bankDetails, setBankDetails] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {

    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_BANK_DETAILS_BY_FUNDRAISERID(fundraiserId))
        setBankDetails(response.data)
      } catch (error) {
        setError("Error fetching bank details.")
      }
    }

    if (fundraiserId) {
      fetchBankDetails()
    }
  }, [fundraiserId]);



  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div className="bank-details-container mt-5">
      {bankDetails ? (
        <div className="card bank-details-card">
          <div className="card-header theme-colour">
            <h5 className="mb-0">Bank Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-university detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Bank Name</h6>
                    <p className="detail-value">{bankDetails.bankName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-user detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Account Holder Name</h6>
                    <p className="detail-value">{bankDetails.accountHolderName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-hashtag detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Account Number</h6>
                    <p className="detail-value">{bankDetails.accountNumber}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-code detail-icon"></i>
                  <div>
                    <h6 className="detail-label">IFSC Code</h6>
                    <p className="detail-value">{bankDetails.ifscCode}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-item">
                  <i className="fas fa-piggy-bank detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Account Type</h6>
                    <p className="detail-value">{bankDetails.accountType}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-building detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Branch Name</h6>
                    <p className="detail-value">{bankDetails.branchName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt detail-icon"></i>
                  <div>
                    <h6 className="detail-label">Branch Address</h6>
                    <p className="detail-value">{bankDetails.branchAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading bank details...</p>
        </div>
      )}
    </div>
  )
}

export default DisplayBankDetails

