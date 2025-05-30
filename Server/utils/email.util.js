import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

const sendVerificationEmail = async (email, verificationToken, appUrl) => {
  const verificationLink = `${appUrl}/verify/${verificationToken}`;
  console.log("args", process.env);
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

export {
  sendVerificationEmail,
};
