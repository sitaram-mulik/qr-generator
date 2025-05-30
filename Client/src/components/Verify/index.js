import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const Verify = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const hasCalledVerify = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `/api/auth/verify/${code}`
        );
        if (response.data.message) {
          console.log("response.data.message", response);
          setStatus("success");
          setMessage(response.data.message);
        } else {
          setStatus("error");
          setMessage("Verification failed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            "Verification failed. Please try again."
        );
      }
    };

    if (code && !hasCalledVerify.current) {
      hasCalledVerify.current = true;
      verifyEmail();
    } else if (!code) {
      setStatus("error");
      setMessage("Invalid verification code.");
    }
  }, [code, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </>
        )}
        {(status === "success" || status === "error") && (
          <Typography
            variant="h6"
            color={status === "success" ? "green" : "error"}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Verify;
