import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

const shapeOptions = [
  { value: "triangle", label: "Triangle" },
  { value: "circle", label: "Circle" },
  { value: "box", label: "Box" },
  { value: "hexagon", label: "Hexagon" },
  { value: "octagon", label: "Octagon" },
  { value: "star", label: "Star" },
  { value: "diamond", label: "Diamond" },
];

const PatternGenerator = () => {
  const [shape, setShape] = useState("triangle");
  const [numShapes, setNumShapes] = useState(3);
  const [size, setSize] = useState(50);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageSrc(null);
    try {
      const response = await axios.post(
        "/generate-shape",
        { shape, numShapes, size },
        { responseType: "blob" }
      );
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSrc(imageUrl);
    } catch (err) {
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setGeneratedImage(null);
      setUploadError(null);
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!uploadedImage) {
      setUploadError("Please upload an image first");
      return;
    }
    setUploadLoading(true);
    setUploadError(null);
    setGeneratedImage(null);
    try {
      const fileInput = document.getElementById("image-upload-input");
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/upload-pattern", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setUploadError("Failed to generate image from uploaded pattern");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", padding: 20 }}>
      <div style={{ flex: "0 0 300px", paddingRight: 20 }}>
        <h3>Pattern Customization</h3>
        <div>
          <label htmlFor="shape-select">Shape:</label>
          <select
            id="shape-select"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
          >
            {shapeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 20 }}>
          <label htmlFor="num-shapes-range">Number of Shapes: {numShapes}</label>
          <input
            id="num-shapes-range"
            type="range"
            min="1"
            max="10"
            value={numShapes}
            onChange={(e) => setNumShapes(parseInt(e.target.value, 10))}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <label htmlFor="size-range">Size: {size}</label>
          <input
            id="size-range"
            type="range"
            min="10"
            max="200"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        <hr style={{ margin: "20px 0" }} />
        <h3>Upload Pattern Image</h3>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleUploadAndGenerate} disabled={uploadLoading}>
            {uploadLoading ? "Processing..." : "Upload & Generate"}
          </button>
        </div>
        {uploadError && <div style={{ color: "red", marginTop: 10 }}>{uploadError}</div>}
      </div>
      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: 10,
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <h4>Original Image</h4>
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded pattern"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          ) : (
            <div>No image uploaded</div>
          )}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h4>Generated Image</h4>
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated pattern"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          ) : (
            <div>No generated image</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternGenerator;
