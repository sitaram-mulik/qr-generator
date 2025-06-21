import QRCode from 'qrcode';
import sharp from 'sharp';

// Generate QR code as Buffer
async function generateQRCodeBuffer(url, width) {
  const qrBuffer = await QRCode.toBuffer(url, {
    width,
    margin: 0
  });

  return await sharp(qrBuffer).resize(width, width).png().toBuffer();
}

export { generateQRCodeBuffer };
