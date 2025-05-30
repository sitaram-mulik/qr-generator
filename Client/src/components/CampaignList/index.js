import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from "react-router-dom";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [codes, setCodes] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/campaigns');
      setCampaigns(response.data);
    } catch (err) {
      setError('Failed to load campaigns');
    }
  };

  const handleCampaignClick = async (campaignName) => {
    navigate(`/assets?campaign=${campaignName}`);    
    try {
      const response = await axios.get(`/codes?campaign=${campaignName}`);
      setCodes(response.data.codes);
    } catch (err) {
      setError('Failed to load codes for campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeClick = (code) => {
    window.open(`/assets/code/${code}`, "_blank");
  };

  return (
    <div className="my-campaigns-container">
      <h2>My Campaigns</h2>
      
      <div className="campaigns-list">
        {campaigns.map(({name}, index) => (
          <button
            key={index}
            onClick={() => handleCampaignClick(name)}
            className={`campaign-button ${selectedCampaign === name ? 'selected' : ''}`}
          >
            {name}
          </button>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        selectedCampaign && codes.length > 0 && (
          <div className="codes-container">
            <h3>Codes for {selectedCampaign}:</h3>
            <ul>
              {codes.map((code, index) => (
                <li key={index} onClick={() => handleCodeClick(code.code)}>
                  <span className="code-text">{code.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default CampaignList;