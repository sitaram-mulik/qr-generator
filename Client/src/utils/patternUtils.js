/**
 * Utility functions and constants for shape calculations and color generation.
 */

const shapeOptions = [
  { value: "triangle", label: "Triangle" },
  { value: "circle", label: "Circle" },
  { value: "box", label: "Box" },
  { value: "hexagon", label: "Hexagon" },
  { value: "octagon", label: "Octagon" },
  { value: "star", label: "Star" },
  { value: "diamond", label: "Diamond" },
];

// Generate unique colors for main shapes
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

// Calculate points for polygons
const calculatePolygonPoints = (sides, size) => {
  if (sides <= 0) return null; // circle or special case
  const angle = (2 * Math.PI) / sides;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const x = size * Math.cos(i * angle - Math.PI / 2);
    const y = size * Math.sin(i * angle - Math.PI / 2);
    points.push([x, y]);
  }
  return points;
};

// Calculate points for star shape
const calculateStarPoints = (size, spikes) => {
  const points = [];
  const outerRadius = size;
  const innerRadius = size / 2.5;
  const step = Math.PI / spikes;
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    points.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }
  return points;
};

// Calculate points for diamond shape
const calculateDiamondPoints = (size) => {
  return [
    [0, -size],
    [size, 0],
    [0, size],
    [-size, 0],
  ];
};

// Generate main shape positions arranged in circle
const calculateMainShapePositions = (count, boundarySize) => {
  const angleStep = (2 * Math.PI) / count;
  const radius = boundarySize;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2; // start from top
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const rotation = (angle * 180) / Math.PI + 90; // face outward
    positions.push({ x, y, rotation });
  }
  return positions;
};

/**
 * Calculate positions for nested shapes arranged in concentric circles with equal spacing.
 * @param {number} count - Number of shapes per level.
 * @param {number} levels - Number of nested levels.
 * @param {number} baseRadius - Starting radius for the innermost level.
 * @param {number} spacing - Distance between each nested level.
 * @returns {Array} Array of position objects with x, y, rotation, and level.
 */
const calculateNestedShapePositions = (count, levels, baseRadius, spacing) => {
  const allPositions = [];
  for (let level = 0; level < levels; level++) {
    const radius = baseRadius + level * spacing;
    const angleStep = (2 * Math.PI) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2; // start from top
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI + 90; // face outward
      allPositions.push({ x, y, rotation, level });
    }
  }
  return allPositions;
};

module.exports = {
  shapeOptions,
  generateColors,
  calculatePolygonPoints,
  calculateStarPoints,
  calculateDiamondPoints,
  calculateMainShapePositions,
  calculateNestedShapePositions,
};
