import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from '../../utils/axiosInstance';

const AssetFilters = ({ filters, onFilterChange }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCampaignOptions = async () => {
      try {
        const response = await axios.get('/campaigns');
        setCampaignOptions(response.data);
      } catch (error) {
        console.log('Failed to fetch campaign options:', error);
      }
    };
    fetchCampaignOptions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filterContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: 2,
        mb: 2
      }}
    >
      <TextField
        select
        label="Filter by Campaign"
        value={filters.campaign || ''}
        onChange={e => onFilterChange('campaign', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All Campaigns</MenuItem>
        {campaignOptions.map(campaign => (
          <MenuItem key={campaign.id} value={campaign.name}>
            {campaign.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Filter by Verified"
        value={filters.verified || ''}
        onChange={e => onFilterChange('verified', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Verified</MenuItem>
        <MenuItem value="false">Not verified</MenuItem>
      </TextField>

      <TextField
        select
        label="Filter by Donwloaded"
        value={filters.downloaded || ''}
        onChange={e => onFilterChange('downloaded', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Downloaded</MenuItem>
        <MenuItem value="false">Not downloaded</MenuItem>
      </TextField>

      <TextField
        label="Filter by Created After"
        type="date"
        value={filters.createdAfter || ''}
        onChange={e => onFilterChange('createdAfter', e.target.value)}
        sx={{ minWidth: 200 }}
        InputLabelProps={{
          shrink: true
        }}
      />
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button variant="outlined" onClick={handleOpen} sx={{ mb: 2 }}>
          Filters
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Filters</DialogTitle>
          <DialogContent>{filterContent}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return filterContent;
};

export default AssetFilters;
