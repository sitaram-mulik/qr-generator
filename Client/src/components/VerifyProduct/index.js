import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import axios from "../../utils/axiosInstance";

function VerifyProduct() {
  const { code } = useParams();
  const [codeDetails, setCodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodeDetails = async () => {
      try {
        const response = await axios.get(`/assets/verify/${code}`)
        const details = response.data;
        console.log('details ', details);
        if (details?.code) {
          setCodeDetails(details);
        }
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


  return (
    <div className="code-detail">
      <div className="code-info">
        {!codeDetails?.code ?
          <h1 className="error">The product is possible counterfiet</h1>
          : <h1 className="sucess">Congratulations, Your product is valid</h1>}
      </div>
      {codeDetails?.imagePath && <div className="image-container">
        <img
          src={`http://localhost:8001/api/assets/pattern/${codeDetails.code}`}
          alt="Generated Code"
          className="full-image"
        />
      </div>}
    </div>
  );
}

export default VerifyProduct;
