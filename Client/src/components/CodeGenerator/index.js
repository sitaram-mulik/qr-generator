import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";

export const codeGeneratedEvent = new Event("codesGenerated");

const CodeGenerator = () => {
  const [count, setCount] = useState(1);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patternOptions, setPatternOptions] = useState({
    patternTypes: [],
  });
  const [selectedPattern, setSelectedPattern] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatternOptions();
  }, []);

  const fetchPatternOptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pattern-options");
      setPatternOptions(response.data);
      setSelectedPattern(response.data.patternTypes[0]);
    } catch (err) {
      setError("Failed to load pattern options");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCodes([]);

    const numberCount = parseInt(count);
    if (numberCount < 1 || numberCount > 1000) {
      setError("Please enter a number between 1 and 1000");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/generate-codes",
        {
          count: numberCount,
          patternType: selectedPattern,
        }
      );
      setCodes(response.data.codes);
      window.dispatchEvent(codeGeneratedEvent);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate codes");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeClick = (code) => {
    window.open(`/code/${code}`, "_blank");
  };

  return (
    <div className="container">
      <h2>Generate Unique Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="count">Number of codes (1-1000):</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="1000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pattern">Pattern Type:</label>
          <select
            id="pattern"
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            required
          >
            {patternOptions.patternTypes.map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Codes"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {codes.length > 0 && (
        <div className="codes-container">
          <h3>Generated Codes:</h3>
          <ul>
            {codes.map((code, index) => (
              <li key={index} onClick={() => handleCodeClick(code.code)}>
                <span className="code-text">{code.code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
