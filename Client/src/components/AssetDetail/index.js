import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Box, Container, List, ListItem, ListItemText, Paper } from '@mui/material';
import { formatTimestamp } from '../../utils/common';

function AssetDetail({ code: propCode }) {
  const { code: paramCode } = useParams();
  const code = propCode || paramCode;
  const [codeDetails, setCodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodeDetails = async () => {
      try {
        const response = await axios.get(`/assets/${code}`);
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
    <Container sx={{ mt: 6, mb: 2 }}>
      {codeDetails?.imagePath && (
        <Paper elevation={3}>
          <img
            src={`${process.env.REACT_APP_API_URL || ''}/api/assets/pattern/${codeDetails.code}`}
            alt="Generated Code"
            className="full-image"
            style={{ width: '100%' }}
          />
          <Box sx={{ display: { md: 'flex' } }}>
            <List>
              <ListItem>
                <ListItemText primary="Campaign Name" secondary={codeDetails.campaign} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Created time"
                  secondary={formatTimestamp(codeDetails.createdAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Scanned time"
                  secondary={
                    codeDetails.verifiedAt ? formatTimestamp(codeDetails.verifiedAt) : 'Not scanned'
                  }
                />
              </ListItem>
            </List>
            <List>
              <ListItem>
                <ListItemText primary="Total downloads" secondary={codeDetails.downloads} />
              </ListItem>
              {codeDetails.downloadedAt && (
                <ListItem>
                  <ListItemText
                    primary="Last download time"
                    secondary={formatTimestamp(codeDetails.downloadedAt)}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default AssetDetail;
