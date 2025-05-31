export const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    // Check if it's not already HTTPS
    const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
    return res.redirect(301, httpsUrl);
  }
  next();
};