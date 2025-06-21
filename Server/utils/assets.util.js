import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';
import { generateQRCodeBuffer } from './qr.utils.js';
import { createCanvas } from 'canvas';
import { drawPattern } from './basicShapes.util.js';
import geoPattern from 'geopattern';

// Generate unique pattern image with customizable type
// async function generateImageFromWithPattern(uniqueCode, options = {}) {
//   const width = 500;
//   const height = 500;
//   const patternType = options.patternType || "Shapes";

//   const hash = uniqueCode
//     .split("")
//     .reduce((acc, char) => acc + char.charCodeAt(0), 0);

//   const pixels = new Uint8Array(width * height * 4);
//   const patternFunc = patternTypes[patternType] || patternTypes.waves;

//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       const idx = (y * width + x) * 4;
//       const color = patternFunc(x, y, hash);
//       pixels[idx] = color.r; // R
//       pixels[idx + 1] = color.g; // G
//       pixels[idx + 2] = color.b; // B
//       pixels[idx + 3] = color.alpha; // A
//     }
//   }

//   return await sharp(Buffer.from(pixels), {
//     raw: {
//       width,
//       height,
//       channels: 4,
//     },
//   })
//     .png()
//     .toBuffer();
// }

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

async function getPatternBuffer(code, patternType, size) {
  if (patternType === 'geopattern') {
    const pattern = geoPattern.generate(code);
    const image = pattern.toSvg();
    return await sharp(Buffer.from(image)).resize(size, size).png().toBuffer();
  }

  const image = createCanvas(size, size);

  const shapesCount = getRandomNumber(150, 500);
  const shapeSides = getRandomNumber(2, 100);
  const scale = getRandomNumber(1, 10);
  const rotationAngle = getRandomNumber(0, 360);
  const shapeSize = 250;
  const shapeBorder = 1;
  drawPattern(image, shapesCount, shapeSides, scale, rotationAngle, shapeSize, shapeBorder);

  // Convert canvas to buffer
  return await sharp(image.toBuffer('image/png')).png().toBuffer();
}

// Generate combined image
async function generateImage(uniqueCode, baseDir, appUrl, patternType, size, includePattern) {
  try {
    const codeDir = path.join(baseDir, uniqueCode);
    await fs.ensureDir(codeDir);
    const qrBuffer = await generateQRCodeBuffer(
      `${appUrl}/verify/${uniqueCode}?image=${includePattern}`,
      size
    );
    if (includePattern) {
      const patternBuffer = await getPatternBuffer(uniqueCode, patternType, size);
      const imageOptions = {
        create: {
          width: size * 2,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      };
      return await sharp(imageOptions)
        .png()
        .composite([
          { input: qrBuffer, left: 0, top: 0 },
          { input: patternBuffer, left: size, top: 0 }
        ])
        .toBuffer();
    }
    return await sharp(qrBuffer).png().toBuffer();
  } catch (error) {
    console.log('Error in saveCombinedImage:', error);
    throw error;
  }
}

const buildAssetsDBQuery = req => {
  const { campaign, verified, downloaded, createdAfter } = req.query;
  const query = req.user.isSuperAdmin ? {} : { userId: req.userId };
  if (campaign && campaign !== 'all') query.campaign = campaign;
  if (verified) query.verifiedAt = { $exists: verified };
  if (downloaded !== undefined) {
    if (downloaded === 'true') {
      query.downloads = { $gt: 0 }; // downloaded > 0
    } else {
      query.downloads = 0; // downloaded == 0
    }
  }

  if (createdAfter) {
    query.createdAt = { $gte: new Date(createdAfter) };
  }

  return query;
};

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export { generateImage, buildAssetsDBQuery, streamToBuffer };
