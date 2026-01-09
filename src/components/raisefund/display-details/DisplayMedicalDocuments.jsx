import { useEffect, useState } from "react"
import axios from "axios"
import "./styles/DisplayMedicalDocuments.css"
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS"

const DisplayMedicalDocuments = ({ fundraiserId }) => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.GET_MEDICAL_DOCUMENTS_BY_FUNDRAISERID(fundraiserId))
      .then((response) => {
        const { medicalEstimate, consentLetterFromPatient, medicalReports, otherDocs } = response.data
        const imageList = [medicalEstimate, consentLetterFromPatient, medicalReports, otherDocs]
        const filteredImages = imageList.filter((img) => img)
        setImages(filteredImages)
        setSelectedImage(filteredImages[0])
      })
      .catch((error) => console.error("Error fetching images:", error))
  }, [fundraiserId])

  return (
    <div className="medical-documents-container mt-5">
      <div className="card">
        <div className="card-header theme-colour">
          <h5 className="mb-0">Medical Documents</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="large-image-container">
                {selectedImage ? (
                  <img src={selectedImage.startsWith('http') ? selectedImage : `data:image/png;base64,${selectedImage}`} alt="Selected Document" className="img-fluid" />
                ) : (
                  <div className="no-image-placeholder">
                    <i className="fas fa-file-medical fa-3x mb-3"></i>
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="thumbnails-container">
                {images.map((img, index) => (
                  <div key={index} className="thumbnail-outer-div mb-3">
                    <div
                      className={`thumbnail-wrapper ${selectedImage === img ? "selected" : ""}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img.startsWith('http') ? img : `data:image/png;base64,${img}`} alt={`Document ${index + 1}`} className="img-fluid" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayMedicalDocuments

