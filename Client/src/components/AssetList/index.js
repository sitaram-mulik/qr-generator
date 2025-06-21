import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';
import axios from '../../utils/axiosInstance';
import {
  Container,
  Card,
  CardContent,
  LinearProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  TextField,
  Paper,
  IconButton,
  Dialog,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import { formatTimestamp } from '../../utils/common';
import AssetFilters from './AssetFilters';
import { useNavigate, useLocation } from 'react-router-dom';
import JSZip from 'jszip';
import Progress from '../Lib/Progress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from '../../context/AuthContext';
import AssetDetail from '../AssetDetail';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const initialFilterState = {
  campaign: '',
  verified: '',
  downloaded: '',
  createdAfter: ''
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    case 'RESET_FILTERS':
      return { ...initialFilterState };
    default:
      return state;
  }
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

function AssetList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [count, setCount] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSummary, setDownloadSummary] = useState(null);
  const [filters, dispatchFilters] = useReducer(filterReducer, initialFilterState);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssetCode, setSelectedAssetCode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramsObj = Object.fromEntries(params.entries());
    dispatchFilters({ type: 'SET_FILTERS', payload: { ...paramsObj } });
  }, [location.search]);

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const response = await axios.get(`/assets?${params.toString()}`);
      setAssets(response.data.assets);
      setCount(response.data.count);
      setLoading(false);
    } catch (err) {
      setError('Failed to load code list ');
      setLoading(false);
    }
  };

  const downloadAllAssets = async () => {
    setIsDownloading(true);
    setDownloadSummary(null);
    try {
      const params = new URLSearchParams(location.search);
      params.append('count', count);
      const res = await axios(`/assets/download?${params.toString()}`, {
        responseType: 'blob'
      });
      const blob = res.data;
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${filters.campaign || 'all'}-assets.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      // 🔍 Read summary.txt from the ZIP
      const zip = await JSZip.loadAsync(blob);
      const summaryJson = await zip.file('summary.json')?.async('string');

      if (summaryJson) {
        const summary = JSON.parse(summaryJson);
        setIsDownloading(false);
        setDownloadSummary(summary);
        //setModalOpen(true);
      }
      fetchUserDetails();
    } catch (error) {
      setError('Failed to download assets ', error);
      setIsDownloading(false);
      fetchUserDetails();
      return;
    }
  };

  const onFilterChange = (filterName, value) => {
    const params = new URLSearchParams(location.search);
    if (typeof value === undefined || value === '') {
      params.delete(filterName);
    } else {
      params.set(filterName, value);
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const onFilterReset = useCallback(() => {
    dispatchFilters({ type: 'RESET_FILTERS' });
    navigate('/assets');
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box>
          <AssetFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onFilterReset={onFilterReset}
          />
          <Box
            sx={{
              pt: 2,
              pb: 2,
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <TextField
              label="Result"
              type="number"
              value={count}
              onChange={e => setCount(e.target.value)}
              size="small"
              sx={{ width: '100px' }}
            />
            <Button startIcon={<GetAppIcon />} sx={{ mr: 1, ml: 2 }} onClick={downloadAllAssets}>
              Download
            </Button>
            <Button startIcon={<AddCircleIcon />} onClick={() => navigate('/assets/create')}>
              Create
            </Button>
          </Box>

          {downloadSummary && !isDownloading && (
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Alert
                    severity={downloadSummary.failed > 0 ? 'warning' : 'success'}
                    sx={{ mt: 2 }}
                  >
                    Last download status: {downloadSummary.success} successful,{' '}
                    {downloadSummary.failure} failed (Total: {downloadSummary.total})
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        <TableContainer component={Box} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="assets table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Campaign</TableCell>
                <TableCell>Verified at</TableCell>
                <TableCell>Downloads</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell align="right">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.code} hover>
                  <TableCell component="th" scope="row">
                    {asset.code}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {asset.campaign}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {asset.verifiedAt ? formatTimestamp(asset.verifiedAt) : 'Not verified'}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {asset.downloads}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatTimestamp(asset.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedAssetCode(asset.code);
                        setModalOpen(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {assets.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No matching assets found for this filter.
          </Alert>
        )}
      </Paper>
      <Progress start={isDownloading} processingStats={downloadSummary} operationCount={count} />

      <BootstrapDialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <IconButton
          aria-label="close"
          onClick={() => setModalOpen(false)}
          sx={theme => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        {selectedAssetCode && <AssetDetail code={selectedAssetCode} />}
      </BootstrapDialog>
    </Container>
  );
}

export default AssetList;
