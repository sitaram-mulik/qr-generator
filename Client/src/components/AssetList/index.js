import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Box,
  Link,
  IconButton,
  CardActions,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AssetList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSummary, setDownloadSummary] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const campaignFromUrl = params.get('campaign');
      const response = await axios.get(`/assets/codes/?campaign=${campaignFromUrl || ''}`);
      setAssets(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load code details");
      setLoading(false);
    }
  }

  const downloadBatch = async (assetsBatch, startIndex) => {
    const downloads = assetsBatch.map(async (asset, i) => {
      try {
        const res = await axios(asset.imageUrl, {
          responseType: 'blob',
          withCredentials: false,
        });
        const blob = res.data;
        const downloadUrl = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${asset.code}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        return true;
      } catch (err) {
        console.error(`Error downloading image ${startIndex + i + 1}`, err);
        return false;
      }
    });

    return Promise.all(downloads);
  };

  const downloadAllAssets = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadSummary(null);
    
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < assets.length; i += batchSize) {
      batches.push(assets.slice(i, i + batchSize));
    }

    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const results = await downloadBatch(batches[i], i * batchSize);
      const batchSuccesses = results.filter(Boolean).length;
      const batchFailures = results.filter(result => !result).length;
      
      successCount += batchSuccesses;
      failureCount += batchFailures;
      
      const progress = Math.round(((i + 1) * batchSize) / assets.length * 100);
      setDownloadProgress(Math.min(progress, 100));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setDownloadSummary({
      success: successCount,
      failed: failureCount,
      total: assets.length
    });
    setIsDownloading(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/campaigns"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Campaigns
        </Button>
        
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                onClick={downloadAllAssets}
                disabled={isDownloading}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isDownloading ? 'Downloading...' : 'Download All Assets'}
              </Button>

              {isDownloading && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={downloadProgress} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {downloadProgress}%
                  </Typography>
                </Box>
              )}

              {downloadSummary && !isDownloading && (
                <Alert severity={downloadSummary.failed > 0 ? "warning" : "success"} sx={{ mt: 2 }}>
                  Download complete: {downloadSummary.success} successful, 
                  {' '}{downloadSummary.failed} failed 
                  {' '}(Total: {downloadSummary.total})
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2}>
        {assets.map((asset) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
                <Button 
                  size="small"
                  onClick={() => window.open(`/assets/code/${asset.code}`, "_blank")}
                >
                  {asset.code}
                </Button>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {assets.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No assets found for this campaign.
        </Alert>
      )}
    </Container>
  );
}

export default AssetList;
