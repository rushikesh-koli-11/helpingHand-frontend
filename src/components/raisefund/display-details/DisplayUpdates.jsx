import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";
import "./styles/DisplayUpdates.css";

const DisplayUpdates = () => {
  const { fundraiserId } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_UPDATES_BY_FUNDRAISERID(fundraiserId)
        );
        setUpdates(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching updates:", error);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    if (fundraiserId) {
      fetchUpdates();
    }
  }, [fundraiserId]);

  return (
    <div className="container mt-5 p-0">
      <div className="card mb-4">
        <div className="card-header theme-colour">
          <h5 className="mb-0">Recent Updates</h5>
        </div>

        {loading ? (
          <div className="text-center p-3">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading updates...</span>
            </div>
          </div>
        ) : updates.length === 0 ? (
          <div className="alert alert-info text-center mb-0" role="alert">
            No updates available yet. Check back soon!
          </div>
        ) : (
          <div className="timeline">
            {updates.map((update, index) => (
              <div
                key={update.id}
                className={`timeline-item ${
                  index % 2 === 0 ? "left" : "right"
                }`}
              >
                <div className="timeline-content">
                  <div className="date">{update.createdAt}</div>
                  <p>{update.content}</p>
                  {/* <span className="time">
                  {update.createdAt}
                </span> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayUpdates;
