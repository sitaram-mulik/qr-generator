import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './index.css';
import axios from '../../utils/axiosInstance';
import VerifyHeader from './VerifyHeader';
import Banner from './Banner';
import Failed from './Failed';
import Verified from './Verified';

function VerifyProduct() {
  const { code } = useParams();
  const [codeDetails, setCodeDetails] = useState();
  const [campaignDetails, setCampaignDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  let showImage = searchParams.get('image');
  showImage = typeof showImage === 'undefined' || showImage === null ? true : JSON.parse(showImage);

  const fetchCodeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/assets/verify/${code}`);
      const { campaign, asset } = response.data || {};
      if (asset?.code) {
        setCodeDetails(asset);
        return;
      }
      if (campaign) {
        setCampaignDetails(campaign);
      }
      setCodeDetails(null);
      setLoading(false);
    } catch {
      setCodeDetails(null);
    } finally {
      setLoading(false);
      window.location.hash = 'code_result';
    }
  };

  const verifyCode = () => {
    fetchCodeDetails();
  };

  return (
    <div className="verify-container">
      <VerifyHeader />
      <Banner />

      <section className="section-auth" id="section_authenicate">
        <h2 className="header">Tenetics AUTHENTICATION SITE</h2>
        <p style={{ textAlign: 'center' }}>
          <span style={{ color: 'rgba(44, 62, 80, 1)' }}>
            <strong>
              <span style={{ fontSize: '16px' }}>
                Welcome to the Tenetics's Authentication Site. Please authenticate your product
              </span>
            </strong>
          </span>
        </p>
        <div className="code" id="Code">
          {code}
        </div>
        <button
          onClick={verifyCode}
          type="button"
          className="btn btn-primary authbutton"
          id="authenticationbutton"
        >
          VERIFY MY PRODUCT
        </button>
        {/* {error && <p style={{ color: '#F00' }}>{error}</p>} */}
      </section>

      {/* {campaignDetails.title && (
        <AppBar
          position="static"
          sx={{ p: 2, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}
        >
          <h1>{campaignDetails.title}</h1>
        </AppBar>
      )} */}

      <section id="code_result">
        {typeof codeDetails !== 'undefined' && (
          <>
            {!codeDetails?.code ? <Failed code={code} /> : <Verified code={code} />}
            {/* {campaignDetails.description && (
          <Paper sx={{ p: 2, backgroundColor: 'info.light', color: 'secondary.contrastText' }}>
            <p>{campaignDetails.description}</p>
          </Paper>
        )}
        {!codeDetails?.verifiedAt && codeDetails?.code && showImage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <img
              src={`${process.env.REACT_APP_API_URL || ''}/api/assets/verifyImage/${
                codeDetails.code
              }`}
            />
          </Box>
        )} */}
          </>
        )}
      </section>
    </div>
  );
}

export default VerifyProduct;
