import QRCode from 'qrcode';
import sharp from 'sharp';

// Generate QR code as Buffer
async function generateQRCodeBuffer(url) {
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 500,
    margin: 1,
  });

  return await sharp(qrBuffer).resize(500, 500).png().toBuffer();
}

export {
  generateQRCodeBuffer
}
