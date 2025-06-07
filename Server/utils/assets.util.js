import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';
import { generateQRCodeBuffer } from './qr.utils.js';
import { createCanvas } from 'canvas';
import { drawPattern } from './basicShapes.util.js';



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
}

async function getPatternBuffer() {
  const width = 500;
  const height = 500;
  const canvas = createCanvas(width, height);

  const shapesCount = getRandomNumber(150, 500);
  const shapeSides = getRandomNumber(2, 100)
  const scale = getRandomNumber(1, 10); 
  const rotationAngle = getRandomNumber(0, 360); 
  const shapeSize = 250; 
  const shapeBorder = 1;
  drawPattern(canvas, shapesCount, shapeSides, scale, rotationAngle, shapeSize, shapeBorder);
  
  // Convert canvas to buffer
  return await sharp(canvas.toBuffer('image/png'))
    .png()
    .toBuffer();
}

// Generate combined image
async function generateImage(uniqueCode, baseDir, appUrl) {
  const codeDir = path.join(baseDir, uniqueCode);
  await fs.ensureDir(codeDir);

  try {
    const [qrBuffer, patternBuffer] = await Promise.all([
      generateQRCodeBuffer(`${appUrl}/verify/${uniqueCode}`),
      getPatternBuffer(),
    ]);

    const combinedImagePath = path.join(codeDir, `${uniqueCode}.png`);

    return await sharp({
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
      .toBuffer();
      //.toFile(combinedImagePath);

    //return `/storage/codes/${uniqueCode}/${uniqueCode}.png`;
  } catch (error) {
    console.error("Error in saveCombinedImage:", error);
    throw error;
  }
}

const buildAssetsDBQuery = (req) => {
  const { campaign, verified, downloaded, createdAfter } = req.query; 
  const query = { userId: req.userId };
  if(campaign) query.campaign = campaign;
  if(verified) query.verifiedAt = { $exists: verified };
  if (downloaded !== undefined) {
    if (downloaded === 'true') {
      query.downloads = { $gt: 0 };  // downloaded > 0
    } else {
      query.downloads = 0;            // downloaded == 0
    }
  }

  if (createdAfter) {
    query.createdAt = { $gte: new Date(createdAfter) };
  }



  return query;
}

export {
  generateImage,
  buildAssetsDBQuery
};
