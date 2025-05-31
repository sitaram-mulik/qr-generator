import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Alert, CircularProgress, Box, LinearProgress, Typography } from "@mui/material";

const CreateAssets = () => {
  const [count, setCount] = useState(1);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [batchProgress, setBatchProgress] = useState(0);
  const [processingStats, setProcessingStats] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchCampaigns(), fetchUsageStats()]).finally(() => {
      setInitialLoading(false);
    });
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await axios.get("/assets/codes");
      setUsageStats({
        used: response.data.length,
        total: user.usageLimit,
        remaining: user.usageLimit - response.data.length
      });
    } catch (err) {
      console.error("Failed to fetch usage stats:", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("/campaigns");
      setCampaigns(response.data);

      const params = new URLSearchParams(window.location.search);
      const campaignFromUrl = params.get('campaign');

      if (campaignFromUrl) {
        setSelectedCampaign(campaignFromUrl);
      } else {
        setSelectedCampaign(response.data[0]?.name || "");
      }
    } catch (err) {
      setError("Failed to load campaigns");
    }
  };

  const processBatch = async (batchSize, totalCount, processedCount) => {
    try {
      const response = await axios.post(
        "assets/generate",
        {
          count: batchSize,
          campaignName: selectedCampaign,
          domain: user.domain
        }
      );
      return response.data.codes;
    } catch (err) {
      console.error("Batch processing error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCodes([]);
    setProcessingStats(null);

    const numberCount = parseInt(count);
    if (numberCount < 1) {
      setError("Please enter a number between 1 and 1000");
      return;
    }

    if (usageStats && numberCount > usageStats.remaining) {
      setError(`Cannot generate ${numberCount} assets. You only have ${usageStats.remaining} assets remaining in your limit.`);
      return;
    }

    try {
      setLoading(true);
      setBatchProgress(0); // Set initial progress immediately
      setProcessingStats({ // Initialize processing stats with zeros
        total: numberCount,
        processed: 0,
        success: 0,
        failed: 0
      });
      
      const batchSize = 20;
      let processedCount = 0;
      let successCount = 0;
      let failedCount = 0;
      const allGeneratedCodes = [];

      while (processedCount < numberCount) {
        const currentBatchSize = Math.min(batchSize, numberCount - processedCount);
        try {
          const batchCodes = await processBatch(currentBatchSize, numberCount, processedCount);
          allGeneratedCodes.push(...batchCodes);
          successCount += batchCodes.length;
        } catch (err) {
          failedCount += currentBatchSize;
          console.error("Failed to process batch:", err);
        }

        processedCount += currentBatchSize;
        const progress = (processedCount / numberCount) * 100;
        setBatchProgress(progress);
        
        setProcessingStats({
          total: numberCount,
          processed: processedCount,
          success: successCount,
          failed: failedCount
        });
      }

      setCodes(allGeneratedCodes);
      await fetchUsageStats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate assets");
    } finally {
      setLoading(false);
      setBatchProgress(0);
    }
  };

  const handleCampaignClick = () => {
    navigate('/campaign');
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container">
      <h2>Generate unique assets for your products</h2>

      {usageStats && (
        <div className="usage-stats">
          <Alert severity="info" sx={{ mb: 3 }}>
            Usage: {usageStats.used} / {usageStats.total} assets generated
            <br />
            Remaining: {usageStats.remaining} assets
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="campaign">Select campaign:</label>
          {campaigns.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="no-campaigns">
              <p>No campaigns found.</p>
              <button type="button" onClick={handleCampaignClick}>
                Create Your First Campaign
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="count">Asset counts:</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max={usageStats?.remaining || 1000}
            required
            style={{ width: '200px' }}
          />
          {usageStats && (
            <small className="input-help">Max: {usageStats.remaining}</small>
          )}
        </div>

        <div className="form-group">
          Generate unique code:
          <input
            type="checkbox"
            id="uniqueCode"
            checked
            disabled
          />
        </div>

        <div className="form-group">
         Generate QR code:
          <input
            type="checkbox"
            id="qr"
            checked
            disabled
          />
        </div>

        <div className="form-group">
          Generate unique patterned images
          <input
            type="checkbox"
            id="image"
            checked
            disabled
          />
        </div>


        <button 
          type="submit" 
          disabled={loading || !campaigns.length || (usageStats && usageStats.remaining <= 0)}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Generating...
            </>
          ) : (
            "Generate Assets"
          )}
        </button>
      </form>

      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={batchProgress} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {Math.round(batchProgress)}% Complete
          </Typography>
          {processingStats && (
            <Typography variant="body2" color="text.secondary" align="center">
              Generated: {processingStats.success} / Failed: {processingStats.failed} / Total: {processingStats.total}
            </Typography>
          )}
        </Box>
      )}

      {error && <div className="error">{error}</div>}

      {codes.length > 0 && (
        <div className="codes-container">
          <h3>Assets generated successfully</h3>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Successfully generated: {codes.length} assets
          </Typography>
          <a href={`/assets?campaign=${selectedCampaign}`}>View/download the assets</a>        
        </div>
      )}
    </div>
  );
};

export default CreateAssets;
