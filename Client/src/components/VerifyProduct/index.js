import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import axios from '../../utils/axiosInstance';
import { Alert, AppBar, Box, Container, Paper } from '@mui/material';

function VerifyProduct() {
  const { code } = useParams();
  const [codeDetails, setCodeDetails] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodeDetails = async () => {
      try {
        const response = await axios.get(`/assets/verify/${code}`);
        const { campaign, asset } = response.data || {};
        if (asset?.code) {
          setCodeDetails(asset);
        }
        if (campaign) {
          setCampaignDetails(campaign);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCodeDetails();
  }, [code]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {campaignDetails.title && (
        <AppBar
          position="static"
          sx={{ p: 2, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}
        >
          <h1>{campaignDetails.title}</h1>
        </AppBar>
      )}
      <Container>
        {!codeDetails?.code ? (
          <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
            The product is possible counterfiet!
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
            Congratulations, Your product is valid
          </Alert>
        )}
        {campaignDetails.description && (
          <Paper sx={{ p: 2, backgroundColor: 'info.light', color: 'secondary.contrastText' }}>
            <p>{campaignDetails.description}</p>
          </Paper>
        )}
        {!codeDetails?.verifiedAt && codeDetails?.code && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <img
              src={`${process.env.REACT_APP_API_URL || ''}/api/assets/pattern/${codeDetails.code}`}
            />
          </Box>
        )}
      </Container>
    </>
  );
}

export default VerifyProduct;
