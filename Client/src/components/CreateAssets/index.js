import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";

// export const codeGeneratedEvent = new Event("codesGenerated");

const CreateAssets = () => {
  const [count, setCount] = useState(1);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patternTypes, setPatternTypes] = useState([
    "shapes"
  ]);
  const [selectedPattern, setSelectedPattern] = useState("shapes");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
    // Check for campaign query parameter
    const params = new URLSearchParams(window.location.search);
    const campaignFromUrl = params.get('campaign');

  }, []);

  const fetchCampaigns = async () => {

    try {
      const response = await axios.get("/campaigns");
      setCampaigns(response.data);

      const params = new URLSearchParams(window.location.search);
      const campaignFromUrl = params.get('campaign');

      if (campaignFromUrl) {
        setSelectedCampaign(campaignFromUrl);
      } else {
        console.log('response.data[0] ', response.data[0]?.name)
        setSelectedCampaign(response.data[0]?.name || "");
      }

      console.log("Fetched campaigns:", response.data);
    } catch (err) {
      setError("Failed to load pattern options");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCodes([]);

    const numberCount = parseInt(count);
    if (numberCount < 1) {
      setError("Please enter a number between 1 and 1000");
      return;
    }
    console.log("Selected Campaign:", selectedCampaign);
    try {
      setLoading(true);
      const response = await axios.post(
        "assets/generate",
        {
          count: numberCount,
          campaignName: selectedCampaign
        }
      );
      setCodes(response.data.codes);
      // window.dispatchEvent(codeGeneratedEvent);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate codes");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeClick = (code) => {
    window.open(`/assets/code/${code}`, "_blank");
  };

  const handleCampaignClick = () => {
    navigate('/campaign');
  };

  return (
    <div className="container">
      <h2>Generate Unique Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="count">Asset counts:</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="1000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="campaign">Select campaign:</label>
          <select
            id="campaign"
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            required
          >
            {campaigns.map(({name: c}) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ marginTop: '8px' }}>
            <a href="#" onClick={handleCampaignClick} style={{ color: '#1976d2', textDecoration: 'none' }}>Create new campaign</a>
          </div>
        </div>

        {/* <div className="form-group">
          <label htmlFor="pattern">Select campaign:</label>
          <select
            id="pattern"
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            required
            disabled
          >
            {patternTypes.map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </option>
            ))}
          </select>
        </div> */}

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Assets"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {codes.length > 0 && (
        <div className="codes-container">
          <h3>Generated Codes:</h3>
          <ul>
            {codes.map((code, index) => (
              <li key={index} onClick={() => handleCodeClick(code.code)}>
                <span className="code-text">{code.code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateAssets;
