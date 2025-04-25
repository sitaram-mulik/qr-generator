const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "margarita.schumm88@ethereal.email",
    pass: "AFvcC5aNpP6T3UzE52",
  },
});

const sendVerificationEmail = async (email, verificationToken, appUrl) => {
  const verificationLink = `${appUrl}/verify/${verificationToken}`;
  console.log("args", process.env.EMAIL_USER); // Log the verification link for debugging
  console.log("args", process.env.EMAIL_PASS);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Welcome to QR Generator</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};
