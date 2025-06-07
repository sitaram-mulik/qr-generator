import React, { useState, useEffect, useReducer } from "react";
import axios from "../../utils/axiosInstance";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Backdrop,
  Alert,
} from "@mui/material";
import ResultModal from "../Shared/ResultModal";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { formatTimestamp } from "../../utils/common";
import AssetFilters from "./AssetFilters";
import { useNavigate, useLocation } from 'react-router-dom';
import JSZip from "jszip";

const initialFilterState = {
  campaign: "",
  verified: "",
  downloaded: ""
};

function filterReducer(state, action) {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function AssetList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSummary, setDownloadSummary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, dispatchFilters] = useReducer(filterReducer, initialFilterState);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // const campaignFromUrl = params.get("campaign") || "";
    // const verifiedFromUrl = params.get("verified") || "";
    const paramsObj = Object.fromEntries(params.entries());
    console.log('paramsObj ', paramsObj);
    dispatchFilters({ type: "SET_FILTERS", payload: { ...paramsObj } });
  }, [location.search]);

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const response = await axios.get(`/assets?${params.toString()}`);
      setAssets(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load code list ");
      setLoading(false);
    }
  };

  const downloadAllAssets = async () => {
    setIsDownloading(true);
    setDownloadSummary(null);
    try {
      const params = new URLSearchParams(location.search);
      const res = await axios(`/assets/download?${params.toString()}`, {
        responseType: "blob",
      });
      const blob = res.data;
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${filters.campaign || 'all'}-assets.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      // 🔍 Read summary.txt from the ZIP
      const zip = await JSZip.loadAsync(blob);
      const summaryJson = await zip.file("summary.json")?.async("string");

      if (summaryJson) {
        const summary = JSON.parse(summaryJson);
        setIsDownloading(false);
        setDownloadSummary(summary);
        setModalOpen(true);
      }
    } catch (error) {
      setError("Failed to download assets ", error);
      setIsDownloading(false);
      return;
    }
  };

  const onFilterChange = (filterName, value) => {
    console.log('filterName ', filterName, value)
    const params = new URLSearchParams(location.search);
    if(typeof value === undefined || value === '') {
      params.delete(filterName);
    } else {
      params.set(filterName, value);
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDownloading}
      >
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
      <Box sx={{ mb: 4 }}>
        <AssetFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />

        <Box sx={{mb: 1}}>
            <Button variant="contained" startIcon={<GetAppIcon />} onClick={downloadAllAssets} sx={{ mb: 2, mr: 2 }}>
                Download assets
            </Button>
        </Box>

        {downloadSummary && !isDownloading && (<Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              
                <Alert severity={downloadSummary.failed > 0 ? "warning" : "success"} sx={{ mt: 2 }}>
                  Download complete: {downloadSummary.success} successful, {downloadSummary.failure} failed (Total: {downloadSummary.total})
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
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.code} hover>
                <TableCell component="th" scope="row">
                  {asset.code}
                </TableCell>
                <TableCell component="th" scope="row">
                  {asset.campaign}
                </TableCell>
                <TableCell component="th" scope="row">
                  {asset.verifiedAt ? formatTimestamp(asset.verifiedAt) : "Not verified"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {asset.downloads}
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatTimestamp(asset.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained" onClick={() => window.open(`/verify/${asset.code}`, "_blank")}>
                    Verify
                  </Button>
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

      <ResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Download complete"
        message={`Download complete: ${downloadSummary?.success || 0} successful, ${downloadSummary?.failure || 0} failed (Total: ${downloadSummary?.total || 0})`}
        actions={[]}
      />

      {assets.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No matching assets found for this filter.
        </Alert>
      )}
    </Container>
  );
}

export default AssetList;
