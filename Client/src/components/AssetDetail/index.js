import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Box, Container, List, ListItem, ListItemText, Paper } from '@mui/material';
import { formatTimestamp } from '../../utils/common';

function AssetDetail() {
  const { code } = useParams();
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
    <Container>
      {codeDetails?.imagePath && (
        <Paper elevation={3} sx={{ m: 2, p: 2 }}>
          <List sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <ListItem>
              <ListItemText primary="Campaign Name" secondary={codeDetails.campaign} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Created at"
                secondary={formatTimestamp(codeDetails.createdAt)}
              />
            </ListItem>
            {codeDetails.downloadedAt && (
              <ListItem>
                <ListItemText
                  primary="Downloaded at"
                  secondary={formatTimestamp(codeDetails.downloadedAt)}
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText primary="Total downloads" secondary={codeDetails.downloads} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Verified at"
                secondary={
                  codeDetails.verifiedAt ? formatTimestamp(codeDetails.verifiedAt) : 'Not verified'
                }
              />
            </ListItem>
          </List>
          <img
            src={`${process.env.REACT_APP_API_URL || ''}/api/assets/pattern/${codeDetails.code}`}
            alt="Generated Code"
            className="full-image"
          />
          {/* <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={codeDetails.imagePath} alt="Generated Code" className="full-image" />
          </Box> */}
        </Paper>
      )}
    </Container>
  );
}

export default AssetDetail;
