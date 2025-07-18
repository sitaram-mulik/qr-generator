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
  useTheme,
  Stack,
  Typography
} from '@mui/material';
import axios from '../../utils/axiosInstance';
import RestoreIcon from '@mui/icons-material/Restore';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useNavigate } from 'react-router-dom';

const AssetFilters = ({ filters, onFilterChange, onFilterReset }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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

  const resetFilters = () => {
    onFilterReset();
  };

  const filterContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        height: { md: '50px' }
      }}
    >
      <Typography>Filter by</Typography>
      <TextField
        select
        label="Campaign"
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
        label="Scan"
        value={filters.verified || ''}
        onChange={e => onFilterChange('verified', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Scanned</MenuItem>
        <MenuItem value="false">Not scanned</MenuItem>
      </TextField>
      <TextField
        select
        label="Downloads"
        value={filters.downloaded || ''}
        onChange={e => onFilterChange('downloaded', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Downloaded</MenuItem>
        <MenuItem value="false">Not downloaded</MenuItem>
      </TextField>
      <TextField
        label="Created After"
        type="date"
        value={filters.createdAfter || ''}
        onChange={e => onFilterChange('createdAfter', e.target.value)}
        sx={{ minWidth: 200 }}
        InputLabelProps={{
          shrink: true
        }}
      />{' '}
      <Button
        onClick={resetFilters}
        variant="contained"
        startIcon={<RestoreIcon />}
        sx={{ height: { md: '100%' } }}
      >
        Reset
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button variant="outlined" onClick={handleOpen} sx={{ mb: 2 }}>
          Filters
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogContent>
            {filterContent}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button startIcon={<DisabledByDefaultIcon />} onClick={handleClose}>
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return filterContent;
};

export default AssetFilters;
