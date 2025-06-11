import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const CreateCampaign = () => {
  const [name, setName] = useState('');
  // Set default date and time as current date and time in YYYY-MM-DD and HH:mm format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0].slice(0, 5);
  };
  const [validTillDate, setValidTillDate] = useState(getCurrentDate());
  const [validTillTime, setValidTillTime] = useState(getCurrentTime());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/campaigns/create', { name, validTillDate, validTillTime });
      // Navigate back to campaigns list
      navigate('/campaigns');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px' }}>
            Campaign Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="validTillDate" style={{ display: 'block', marginBottom: '8px' }}>
            Valid till
          </label>
          <input
            type="date"
            id="validTillDate"
            value={validTillDate}
            onChange={e => setValidTillDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="time"
            id="validTillTime"
            value={validTillTime}
            onChange={e => setValidTillTime(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
