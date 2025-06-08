import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const UserAction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    password: "",
    credits: 500,
    domain: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "/user/create",
        formData
      );
      if (response?.data) {
        setSuccess(true);
        navigate('/users')
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="UserName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="DisplayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Sub domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Full domain name: {`${formData.domain}.${process.env.DOMAIN || 'com'}`}
            </Typography>
            <TextField
              type="number"
              fullWidth
              label="Credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </Paper>
    </Container>
  );
};

export default UserAction;
