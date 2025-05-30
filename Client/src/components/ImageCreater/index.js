import React, { useRef, useState, useEffect } from "react";
import { drawRandomPolygon } from "./patternUtils";

const ImageCreater = () => {
  const canvasRef = useRef(null);
  const [shapesCount, setShapeCount] = useState(100);
  const [shapeSides, setShapeSides] = useState(20);
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      // Translate to center for zoom
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      // Choose a random number of sides for the shape type
      const size = Math.floor(Math.min(width, height) / 6);

      // Generate positions in figure-8 pattern dynamically
      const positions = [];
      for (let i = 0; i < shapesCount; i++) {
        const t = (i / shapesCount) * 2 * Math.PI;
        // Figure-8 parametric equations (lemniscate of Bernoulli)
        const x = (width / 2) + size * Math.sin(t);
        const y = (height / 2) + size * Math.sin(t) * Math.cos(t);
        positions.push({ x, y });
      }

      positions.forEach(({ x, y }) => {
        // Calculate angle to center for rotation
        const centerX = width / 2;
        const centerY = height / 2;
        const angle = Math.atan2(centerY - y, centerX - x);
        // Draw polygon at fixed position with rotation
        drawRandomPolygon(ctx, width, height, shapeSides, x, y, angle);
      });

      ctx.restore();
    }
  }, [shapesCount, shapeSides, scale]);

  const downloadPattern = () => {
    const _canvas = canvasRef.current;
    if (_canvas) {
      const link = document.createElement("a");
      link.download = "pattern.png";
      link.href = _canvas.toDataURL("image/png");
      link.click();
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Image Creater - Random Pattern Generator</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #ccc", marginBottom: "10px", width: 400, height: 400 }}
      />
      <br />
      Shape count:
      <input type="range" onChange={(e) => setShapeCount(e.target.value)} value={shapesCount} placeholder="Shapes Count" max={200} min={1} />
      {shapesCount}
      <br/>
      Shape Sides:
      <input type="range" onChange={(e) => setShapeSides(e.target.value)} value={shapeSides} placeholder="Shape Sides" max={50} min={2} />
      {shapeSides}
      <br/>
      Scale:
      <input type="range" onChange={(e) => setScale(e.target.value)} value={scale} placeholder="Scale" max={5} min={1} step={0.1} />
      {scale}
      <br/>
      <button onClick={downloadPattern}>Download</button>
    </div>
  );
};

export default ImageCreater;
