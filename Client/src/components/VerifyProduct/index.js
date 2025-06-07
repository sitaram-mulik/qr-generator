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
        const response = await axios.get(`/assets/${code}`);
        const details = response.data;
        setCodeDetails(details);
        console.log('data ', response.data)
        setLoading(false);
        if(!details.verifiedAt) {
          const verificationRes = await axios.get(`/assets/verify/${code}`);
          console.log('verificationRes ', verificationRes);
        }

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
        {codeDetails?.code ? codeDetails.verifiedAt ? 
          <h1 className="error">The product is possible counterfiet</h1>
        : <h1 className="sucess">Congratulations, Your product is valid</h1> : <h1 className="error">Sorry, we couldnt find any product associated with this QR.</h1> }
      </div>
      {codeDetails && !codeDetails.verifiedAt && <div className="image-container">
        <img
          src={codeDetails.imagePath}
          alt="Generated Code"
          className="full-image"
        />
      </div>}
    </div>
  );
}

export default VerifyProduct;
