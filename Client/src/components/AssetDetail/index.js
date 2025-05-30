import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import axios from "../../utils/axiosInstance";

function AssetDetails() {
  const { code } = useParams();
  const [codeDetails, setCodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodeDetails = async () => {
      try {
        const response = await axios.get(`/assets/codes/${code}`);
        setCodeDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCodeDetails();
  }, [code]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!codeDetails) {
    return <div className="error">Code not found</div>;
  }

  const formatTimestamp = (timestamp) => {
    return new Date(parseInt(timestamp)).toLocaleString();
  };

  return (
    <div className="code-detail">
      <div className="code-info">
        <h2>Code Details</h2>
        <p className="code-text">Code: {codeDetails.code}</p>
      </div>
      <div className="image-container">
        <img
          src={codeDetails.imageUrl}
          alt="Generated Code"
          className="full-image"
        />
      </div>
    </div>
  );
}

export default AssetDetails;
