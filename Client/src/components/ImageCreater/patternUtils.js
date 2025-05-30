/**
 * Utility functions for generating random pattern images on canvas.
 */

// Generate a random color in hsl format
export const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

// Generate random points for a polygon with given sides and size
export const calculatePolygonPoints = (sides, size) => {
  const angle = (2 * Math.PI) / sides;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const x = size * Math.cos(i * angle - Math.PI / 2);
    const y = size * Math.sin(i * angle - Math.PI / 2);
    points.push({ x, y });
  }
  return points;
};

// Draw a polygon on canvas context at (cx, cy) with given points and color and rotation
export const drawPolygon = (ctx, cx, cy, points, color, rotation = 0) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
};

export const drawRandomPolygon = (ctx, width, height, sides, cx = null, cy = null, rotation = null) => {
  const size = Math.floor(Math.min(width, height) / 6);
  if (cx === null) {
    cx = Math.random() * (width - 2 * size) + size;
  }
  if (cy === null) {
    cy = Math.random() * (height - 2 * size) + size;
  }
  const color = getRandomColor();
  const points = calculatePolygonPoints(sides, size);
  if (rotation === null) {
    const centerX = width / 2;
    const centerY = height / 2;
    rotation = Math.atan2(centerY - cy, centerX - cx);
  }
  drawPolygon(ctx, cx, cy, points, color, rotation);
};
