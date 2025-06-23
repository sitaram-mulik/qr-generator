import React, { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axiosInstance';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Alert,
  CircularProgress,
  Box,
  Button,
  Paper,
  Container,
  TextField,
  MenuItem,
  Checkbox
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Progress from '../Lib/Progress';

const patternTypes = ['geopattern', 'Polygons'];

const CreateAssets = () => {
  const [count, setCount] = useState(1);
  const [patternType, setPatternType] = useState(patternTypes[0]);
  const [size, setSize] = useState(500);
  const [includePattern, setIncludePattern] = useState(true);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [batchProgress, setBatchProgress] = useState(0);
  const [processingStats, setProcessingStats] = useState(null);
  const { fetchUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns().finally(() => {
      setInitialLoading(false);
    });
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/campaigns');
      setCampaigns(response.data);

      const params = new URLSearchParams(window.location.search);
      const campaignFromUrl = params.get('campaign');

      if (campaignFromUrl) {
        setSelectedCampaign(campaignFromUrl);
      } else {
        setSelectedCampaign(response.data[0]?.name || '');
      }
    } catch (err) {
      setError('Failed to load campaigns');
    }
  };

  const processBatch = async batchSize => {
    try {
      const response = await axios.post('assets/generate', {
        count: batchSize,
        campaignName: selectedCampaign,
        patternType,
        size,
        includePattern
      });
      return response.data.codes;
    } catch (err) {
      console.log('Batch processing error:', err);
      throw err;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setCodes([]);
    setProcessingStats(null);

    const numberCount = parseInt(count);
    if (numberCount < 1 || numberCount > 10000) {
      setError('Please enter a number between 1 and 10000');
      return;
    }

    const numberSize = parseInt(size);

    if (numberSize < 100 || numberSize > 800) {
      setError('Please enter size between 100 and 800');
      return;
    }

    if (usageStats && numberCount > usageStats.remaining) {
      setError(
        `Cannot generate ${numberCount} assets. You only have ${usageStats.remaining} assets remaining in your limit.`
      );
      return;
    }

    try {
      setLoading(true);
      setBatchProgress(0);
      setProcessingStats({
        total: numberCount,
        processed: 0,
        success: 0,
        failed: 0
      });

      const batchSize = 100;
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
          console.log('Failed to process batch:', err);
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
      // Wait for 1.5 seconds after completion before hiding loading and showing modal
      setTimeout(() => {
        setLoading(false);
        setBatchProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate assets');
      setLoading(false);
      setBatchProgress(0);
    } finally {
      fetchUserDetails();
    }
  };

  const handleCampaignClick = () => {
    navigate('/campaigns/action');
  };

  const handleClose = () => {
    setCodes([]);
    navigate('/assets');
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Generate unique assets for your products</h2>
        <>
          {campaigns.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                select
                label="Select Campaign"
                value={selectedCampaign}
                onChange={e => setSelectedCampaign(e.target.value)}
                required
                sx={{ minWidth: 300 }}
              >
                {campaigns.map(({ name: c }) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ) : (
            <div className="no-campaigns">
              <p>No campaigns found.</p>
              <Button
                type="button"
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleCampaignClick}
              >
                Create Your First Campaign
              </Button>
            </div>
          )}

          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              type="number"
              id="count"
              label="Count"
              value={count}
              onChange={e => setCount(e.target.value)}
              min="1"
              max={usageStats?.remaining || 10000}
              required
              style={{ width: 300 }}
            />
            {usageStats && <small className="input-help">Max: {usageStats.remaining}</small>}
          </Box>

          <Box
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: 300
            }}
          >
            <Checkbox
              checked={includePattern}
              onChange={() => setIncludePattern(state => !state)}
              sx={{ pl: 0 }}
            />
            <label>Include pattern image</label>
          </Box>

          {includePattern && (
            <>
              <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                  select
                  label="Pattern type"
                  value={patternType}
                  onChange={e => setPatternType(e.target.value)}
                  sx={{ minWidth: 300 }}
                >
                  {patternTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ mt: 2, mb: 3 }}>
                <TextField
                  type="number"
                  label="Size in pixel"
                  id="size"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  slotProps={{ htmlInput: { min: 100, max: 500 } }}
                  style={{ width: 300 }}
                />
              </Box>
            </>
          )}

          <Button
            color="inherit"
            variant="primary"
            startIcon={<AddCircleOutlineIcon />}
            disabled={loading || !campaigns.length}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Generating...
              </>
            ) : (
              'Generate Assets'
            )}
          </Button>
        </>

        <Progress
          start={loading}
          progress={batchProgress}
          processingStats={processingStats}
          onClose={handleClose}
          operationCount={count}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default CreateAssets;
