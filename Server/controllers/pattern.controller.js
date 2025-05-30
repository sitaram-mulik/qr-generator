// import { createCanvas, loadImage } from 'canvas';
// import sharp from 'sharp';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// function drawTriangle(ctx, x, y, size) {
//   const height = size * Math.sqrt(3) / 2;
//   ctx.beginPath();
//   ctx.moveTo(x, y - height / 2);
//   ctx.lineTo(x - size / 2, y + height / 2);
//   ctx.lineTo(x + size / 2, y + height / 2);

//   ctx.closePath();
//   ctx.fill();
// }

// function drawCircle(ctx, x, y, size) {
//   ctx.beginPath();
//   ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
//   ctx.fill();
// }

// function drawBox(ctx, x, y, size) {
//   ctx.fillRect(x - size / 2, y - size / 2, size, size);
// }

// function drawPolygon(ctx, x, y, size, sides) {
//   const angle = (2 * Math.PI) / sides;
//   const radius = size / 2;
//   ctx.beginPath();
//   for (let i = 0; i < sides; i++) {
//     const px = x + radius * Math.cos(i * angle - Math.PI / 2);
//     const py = y + radius * Math.sin(i * angle - Math.PI / 2);
//     if (i === 0) {
//       ctx.moveTo(px, py);
//     } else {
//       ctx.lineTo(px, py);
//     }
//   }
//   ctx.closePath();
//   ctx.fill();
// }

// function drawStar(ctx, x, y, size) {
//   const spikes = 5;
//   const outerRadius = size / 2;
//   const innerRadius = outerRadius / 2.5;
//   let rot = Math.PI / 2 * 3;
//   let cx = x;
//   let cy = y;
//   let step = Math.PI / spikes;

//   ctx.beginPath();
//   ctx.moveTo(cx, cy - outerRadius);
//   for (let i = 0; i < spikes; i++) {
//     let x1 = cx + Math.cos(rot) * outerRadius;
//     let y1 = cy + Math.sin(rot) * outerRadius;
//     ctx.lineTo(x1, y1);
//     rot += step;

//     let x2 = cx + Math.cos(rot) * innerRadius;
//     let y2 = cy + Math.sin(rot) * innerRadius;
//     ctx.lineTo(x2, y2);
//     rot += step;
//   }
//   ctx.lineTo(cx, cy - outerRadius);
//   ctx.closePath();
//   ctx.fill();
// }

// function drawDiamond(ctx, x, y, size) {
//   const half = size / 2;
//   ctx.beginPath();
//   ctx.moveTo(x, y - half);
//   ctx.lineTo(x - half, y);
//   ctx.lineTo(x, y + half);
//   ctx.lineTo(x + half, y);
//   ctx.closePath();
//   ctx.fill();
// }

// function calculateZoomFactor(angleDegrees) {
//   const angleRadians = (Math.abs(angleDegrees) % 90) * (Math.PI / 180); // max 0–90
//   const zoom = 1 / (Math.cos(angleRadians) + Math.sin(angleRadians));
//   return zoom;
// }

// const generateShapeImage = async (req, res) => {
//   try {
//     const inputPath = path.join(__dirname, '../storage/input.png');
//     const outputPath = path.join(__dirname, '../storage/output.png');

//     // Ensure input file exists
//     if (!fs.existsSync(inputPath)) {
//       return res.status(400).json({ error: 'Input image not found' });
//     }

//     await sharp(inputPath)
//       .modulate({
//         hue: Math.random() * 360, // Randomly shift hue
//         saturation: 1.2,          // Slightly boost colors
//       })
//       .toFile(outputPath);

//     res.sendFile(outputPath);

//   } catch (error) {
//     console.error('Error generating shape image:', error);
//     res.status(500).json({ error: 'Failed to generate shape image' });
//   }
// };


// const uploadPatternImage = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'No image file uploaded' });
//     }

//     // Multer stores files in req.files array
//     const imageFile = req.files[0];
//     const imageBuffer = imageFile.buffer;

//     const inputPath = path.join(__dirname, '../storage/temp_input.png');
//     const outputPath = path.join(__dirname, '../storage/temp_output.png');

//     // Save uploaded image buffer to temp input file
//     await fs.promises.writeFile(inputPath, imageBuffer);

//     const SIZE = 500;
//     const randomAngle = Math.round(Math.random() * 360);
// //const zoomFactor = calculateZoomFactor(randomAngle);
// const zoomFactor = 30;

//     await sharp(inputPath)

//       .rotate(randomAngle) // random rotation
//      // .resize(SIZE, SIZE, { fit: "cover" })
//       .resize(Math.round(SIZE * zoomFactor), Math.round(SIZE * zoomFactor), { fit: "cover" })
//       .modulate({
//         hue: Math.round(Math.random() * 360), // Randomly shift hue
//         saturation: 1.2,          // Slightly boost colors
//       })
//       .toFile(outputPath);

//     res.sendFile(outputPath);

//   } catch (error) {
//     console.error('Error processing uploaded pattern image:', error);
//     res.status(500).json({ error: 'Failed to process uploaded pattern image' });
//   }
// };

// export {
//   generateShapeImage,
//   uploadPatternImage,
// };
