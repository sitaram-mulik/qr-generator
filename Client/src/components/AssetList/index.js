import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";

function AssetList() {
  const { code } = useParams();
  const [codeDetails, setCodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();

  }, []);

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const campaignFromUrl = params.get('campaign');
      const response = await axios.get(`/assets/codes/?campaign=${campaignFromUrl || ''}`);
      console.log('response data:', response.data);
      setAssets(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load code details");
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="assets">
      {assets.map((asset) => (
        <div key={asset.id} className="asset-item">
          <h3>{asset.code}</h3>
          {/* <img src={asset.imageUrl} alt={`Asset for code ${asset.code}`} /> */}
        </div>
      ))}
      {error && <div className="error">{error}</div>}
      {assets.length === 0 && <div className="no-assets">No assets found for this campaign.</div>}
      <div className="back-link">
        <a href="/campaigns">Back to Campaigns</a>  
      </div>
    </div>
  );
}

export default AssetList;
