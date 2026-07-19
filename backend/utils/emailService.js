const nodemailer = require('nodemailer');

const sendAuthorizationEmail = async (email, attemptId) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.log('No SMTP credentials found in .env, using ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const authUrl = `http://localhost:5000/api/auth/authorize-login?attempt_id=${attemptId}`;

    const info = await transporter.sendMail({
      from: '"GapFinder Authentication" <noreply@gapfinder.app>',
      to: email,
      subject: "Authorize Login Attempt",
      text: `We detected a login attempt to your account. Please click this link to authorize it: ${authUrl}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Login Authorization</h2>
          <p>We detected a login attempt to your account. If this was you, please click the button below to authorize the login.</p>
          <a href="${authUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 15px 30px; text-decoration: none; font-size: 18px; font-weight: bold; margin: 20px 0; border-radius: 5px;">
            Authorize Login
          </a>
          <p style="font-size: 12px; color: #777;">This link will expire in 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (!process.env.SMTP_HOST) {
      console.log("==========================================");
      console.log("TEST EMAIL SENT! Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log("==========================================");
    }
    
    return true;
  } catch (error) {
    console.error("Error sending Authorization email: ", error);
    return false;
  }
};

module.exports = { sendAuthorizationEmail };
