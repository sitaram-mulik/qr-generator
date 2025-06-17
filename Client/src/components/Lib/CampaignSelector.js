import { MenuItem, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CampaignSelector = ({ setCampaignsData }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [searchParams] = useSearchParams();
  const selectedCampaign = searchParams.get('campaign');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const onSelectCampaign = val => {
    navigate(`?campaign=${val || 'all'}`);
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axiosInstance.get('/campaigns');
      setCampaignOptions(response.data);
      setCampaignsData(response.data);
    } catch (err) {
      console.log('Failed to load campaigns ', err);
    }
  };

  return (
    <TextField
      select
      label="Campaign"
      value={selectedCampaign}
      onChange={e => onSelectCampaign(e.target.value)}
      required
      sx={{ minWidth: 300 }}
    >
      <MenuItem key="all" value="all">
        All
      </MenuItem>
      {campaignOptions.map(({ name, _id }) => (
        <MenuItem key={_id} value={name}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default memo(CampaignSelector);
