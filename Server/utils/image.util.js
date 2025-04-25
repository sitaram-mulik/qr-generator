const QRCode = require("qrcode");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");

// Pattern types and their generation functions
const patternTypes = {
  concentricWaves: (x, y, hash) => {
    const centerX = 250;
    const centerY = 250;

    // Calculate distance from center
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    // Create center dot
    if (dist < 1) {
      return hslToRgb(hash % 1, 0.8, 0.5);
    }

    // Create wavy concentric circles with more distortion
    const numCircles = 7;
    const waveAmplitude = 5;
    const baseFreq = 0.02;
    const distortionFreq = 5;

    // Add multiple wave components for more complex distortion
    const angle = Math.atan2(y - centerY, x - centerX);
    const waveOffset =
      Math.sin(angle * distortionFreq) * waveAmplitude +
      Math.sin(angle * (distortionFreq / 2) + hash) * (waveAmplitude / 2) +
      Math.cos(angle * (distortionFreq * 1.5) + hash) * (waveAmplitude / 3);

    const adjustedDist = dist + waveOffset;

    // Create sharp rings with smooth wave effect
    const circlePattern = Math.sin(adjustedDist * baseFreq * numCircles);

    // Thicker lines with smooth edges
    const lineWidth = 0.7; // Changed from 0.25 to 0.4 for thicker lines
    const isLine = Math.abs(circlePattern) < lineWidth;

    // If this pixel is not part of a line, make it white
    if (!isLine) {
      return { r: 255, g: 255, b: 255, alpha: 255 };
    }

    // Calculate different hue for each circle based on distance and hash
    const circleNumber = Math.floor(
      (adjustedDist * baseFreq * numCircles) / Math.PI
    );
    const hue = (((circleNumber * 0.618033988749895 + hash) % 1) + 1) % 1; // Golden ratio for nice color distribution

    return hslToRgb(hue, 0.8, 0.5);
  },
  waves: (x, y, hash) => {
    const frequency = 0.02; // Lower frequency for smoother waves
    const waveHeight = 150; // Height of the waves
    const numWaves = 2; // Number of wave lines

    // Create multiple wave lines with different phases
    let value = 0;
    for (let i = 0; i < numWaves; i++) {
      const yOffset = 150 + i * 100; // Space out the waves vertically
      const phase = hash * (i + 1) * 0.1; // Different phase for each wave
      const waveY = yOffset + Math.sin(x * frequency + phase) * waveHeight;

      // Calculate distance from the wave line and create a fade effect
      const distFromWave = Math.abs(y - waveY);
      const fadeDistance = 20; // How quickly the wave fades out
      const waveIntensity = Math.max(0, 1 - distFromWave / fadeDistance);
      value = Math.max(value, waveIntensity);
    }

    return hslToRgb(value, 0.8, 0.5);
  },
  circles: (x, y, hash) => {
    const centerX = 250;
    const centerY = 250;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const value = (Math.sin(dist * 0.05 * hash) + 1) * 0.5;
    return hslToRgb(value, 0.8, 0.5);
  },
  mosaic: (x, y, hash) => {
    const size = 20;
    const value =
      (Math.sin(Math.floor(x / size) * hash) +
        Math.cos(Math.floor(y / size) * hash)) *
        0.5 +
      0.5;
    return hslToRgb(value, 0.8, 0.5);
  },
  gradient: (x, y, hash) => {
    const value = (x + y) / 1000;
    return hslToRgb(value, 0.8, 0.5);
  },
  lines: (x, y, hash) => {
    const lineSpacing = 20;
    const angle = (hash % 180) * (Math.PI / 180); // Random angle based on hash
    const rotatedX = x * Math.cos(angle) + y * Math.sin(angle);
    const value = (Math.sin(rotatedX / lineSpacing) + 1) * 0.5;
    return hslToRgb(value, 0.8, 0.5);
  },
  boxes: (x, y, hash) => {
    const boxSize = 30;
    const offsetX = hash % boxSize;
    const offsetY = (hash * 31) % boxSize;
    const gridX = Math.floor((x + offsetX) / boxSize);
    const gridY = Math.floor((y + offsetY) / boxSize);
    const value =
      (Math.abs(Math.sin(gridX * gridY * hash)) + Math.cos(gridX + gridY)) *
        0.5 +
      0.5;
    return hslToRgb(value, 0.8, 0.5);
  },
  bigwaves: (x, y, hash) => {
    const centerX = 250;
    const centerY = 250;
    const frequency = 0.02; // Lower frequency for bigger waves
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const wave =
      (Math.sin(dist * frequency * hash) + Math.cos(dist * frequency * hash)) *
        0.5 +
      0.5;
    return hslToRgb(wave, 0.8, 0.5);
  },
  eegwaves: (x, y, hash) => {
    const amplitude = 100; // Height of the waves
    const baseFrequency = 0.005; // Base frequency for smoother waves
    const yOffset = 250; // Center point for the waves

    // Create multiple wave components with different frequencies
    const wave1 = Math.sin(x * baseFrequency * hash) * amplitude;
    const wave2 =
      Math.sin(x * baseFrequency * (hash * 0.7)) * (amplitude * 0.5);
    const wave3 =
      Math.sin(x * baseFrequency * (hash * 1.3)) * (amplitude * 0.3);

    // Combine waves and normalize
    const combinedWave = wave1 + wave2 + wave3;
    const distFromWave = Math.abs(y - (yOffset + combinedWave));
    const fadeDistance = 50; // How quickly the wave fades out

    // Create a fading effect from the wave line
    const value = Math.max(0, 1 - distFromWave / fadeDistance);
    return hslToRgb(value, 0.8, 0.5);
  },
  flowwaves: (x, y, hash) => {
    const frequency = 0.015; // Lower frequency for smoother waves
    const scale = 1.5; // Larger scale for more pronounced waves
    const yOffset = y - 250; // Center the pattern vertically

    // Create a smooth flowing wave pattern
    const wave =
      Math.sin(
        x * frequency * hash + Math.sin(yOffset * frequency * 0.5) * scale
      ) *
        0.5 +
      0.5;

    return hslToRgb(wave, 0.8, 0.5);
  },
  biomorphic: (x, y, hash) => {
    const scale = 0.01;
    const complexity = 3;
    let value = 0;

    // Create multiple overlapping organic shapes
    for (let i = 0; i < complexity; i++) {
      const offset = hash * (i + 1) * 100;
      const xOffset = Math.sin(hash * (i + 1)) * 250;
      const yOffset = Math.cos(hash * (i + 1)) * 250;

      // Create flowing, organic shapes using noise-like functions
      const shape = Math.sin(
        (x - xOffset) * scale * (i + 1) +
          Math.cos((y - yOffset) * scale * (i + 1)) +
          Math.sin(
            Math.sqrt(
              Math.pow((x - xOffset) * scale, 2) +
                Math.pow((y - yOffset) * scale, 2)
            ) *
              hash *
              (i + 1)
          )
      );

      // Add circular cutouts
      const dist = Math.sqrt(
        Math.pow(x - xOffset, 2) + Math.pow(y - yOffset, 2)
      );
      const circle = Math.sin(dist * 0.02 * hash) * 0.5 + 0.5;

      value += shape * circle;
    }

    // Normalize and create high contrast
    value = value / complexity;
    value = value > 0 ? 1 : 0; // Create sharp black and white contrast

    return hslToRgb(value, 0.8, 0.5);
  },
  topographic: (x, y, hash) => {
    const scale = 0.008; // Scale of the waves
    const frequency = 15; // Number of contour lines
    const centerX = 250;
    const centerY = 250;

    // Create multiple overlapping wave fields
    let value = 0;
    for (let i = 0; i < 3; i++) {
      const angle = (hash * (i + 1) * Math.PI) / 3;
      const distortX = Math.sin(angle) * 100;
      const distortY = Math.cos(angle) * 100;

      // Create flowing distortions
      const distortion = Math.sin(
        (x - centerX + distortX) * scale * (i + 1) +
          (y - centerY + distortY) * scale * (i + 1) +
          Math.sin(
            Math.sqrt(
              Math.pow((x - centerX) * scale, 2) +
                Math.pow((y - centerY) * scale, 2)
            ) *
              hash *
              (i + 0.5)
          )
      );

      // Create contour lines effect
      const contour = Math.sin(distortion * frequency);
      value += contour;
    }

    // Normalize and create sharp lines
    value = value / 3;
    value = Math.abs(value) < 0.1 ? 1 : 0; // Create thin, sharp lines

    return hslToRgb(value, 0.8, 0.5);
  },
  ripples: (x, y, hash) => {
    const numDrops = 3; // Fewer drop points for clearer patterns
    const frequency = 0.05; // Lower frequency for longer waves
    const cycles = 8; // More cycles for complete circles
    let value = 0;

    // Create multiple ripple points
    for (let i = 0; i < numDrops; i++) {
      // Create evenly spaced drop positions in a triangle formation
      const angle = (i * 2 * Math.PI) / numDrops + hash * 0.5;
      const radius = 150;
      const dropX = 250 + Math.cos(angle) * radius;
      const dropY = 250 + Math.sin(angle) * radius;

      // Calculate distance from ripple center
      const dist = Math.sqrt(Math.pow(x - dropX, 2) + Math.pow(y - dropY, 2));

      // Create multiple complete circular waves
      const ripple = Math.sin(dist * frequency * cycles);

      // Add the ripple effect with smooth falloff
      const falloff = Math.exp(-dist * 0.002); // Slower falloff for longer waves
      value += ripple * falloff;
    }

    // Normalize and create sharp circular lines
    value = (value + numDrops) / (2 * numDrops);
    value = Math.abs(value - 0.5) < 0.08 ? 1 : 0; // Slightly thicker lines

    return hslToRgb(value, 0.8, 0.5);
  },
};

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    alpha: 255,
  };
}

// Generate unique pattern image with customizable type
async function generatePatternImage(uniqueCode, options = {}) {
  const width = 500;
  const height = 500;
  const patternType = options.patternType || "waves";

  const hash = uniqueCode
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const pixels = new Uint8Array(width * height * 4);
  const patternFunc = patternTypes[patternType] || patternTypes.waves;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      const color = patternFunc(x, y, hash);
      pixels[idx] = color.r; // R
      pixels[idx + 1] = color.g; // G
      pixels[idx + 2] = color.b; // B
      pixels[idx + 3] = color.alpha; // A
    }
  }

  return await sharp(Buffer.from(pixels), {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

// Generate QR code as Buffer
async function generateQRCodeBuffer(url) {
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 500,
    margin: 1,
  });

  return await sharp(qrBuffer).resize(500, 500).png().toBuffer();
}

// Save combined image
async function saveCombinedImage(uniqueCode, baseDir, appUrl, options = {}) {
  const codeDir = path.join(baseDir, uniqueCode);
  await fs.ensureDir(codeDir);

  try {
    const [qrBuffer, patternBuffer] = await Promise.all([
      generateQRCodeBuffer(`${appUrl}/code/${uniqueCode}`),
      generatePatternImage(uniqueCode, options),
    ]);

    const combinedImagePath = path.join(codeDir, `${uniqueCode}-combined.png`);

    await sharp({
      create: {
        width: 1000,
        height: 500,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .composite([
        { input: qrBuffer, left: 0, top: 0 },
        { input: patternBuffer, left: 500, top: 0 },
      ])
      .toFile(combinedImagePath);

    return {
      imagePath: `/storage/codes/${uniqueCode}/${uniqueCode}-combined.png`,
    };
  } catch (error) {
    console.error("Error in saveCombinedImage:", error);
    throw error;
  }
}

module.exports = {
  generatePatternImage,
  generateQRCodeBuffer,
  saveCombinedImage,
  patternTypes: Object.keys(patternTypes),
};
