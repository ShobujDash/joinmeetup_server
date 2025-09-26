const transporter = require("../utils/nodemailerConfig");


exports.sendOTPEmail = async (to, otp, name) => {
  try {
    await transporter.sendMail({
      from: `"Event Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🔐 Your One-Time Password (OTP)`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            
            <h2 style="text-align:center; color:#4CAF50; margin-bottom:20px;">🔐 OTP Verification</h2>
            
            <p style="font-size:16px; color:#333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size:15px; color:#555;">
              Please use the following <strong>One-Time Password (OTP)</strong> to complete your login/registration:
            </p>
            
            <div style="text-align:center; margin:30px 0;">
              <span style="display:inline-block; background:#4CAF50; color:#fff; font-size:28px; font-weight:bold; letter-spacing:5px; padding:15px 30px; border-radius:8px;">
                ${otp}
              </span>
            </div>

            <p style="font-size:14px; color:#666;">⚠️Do not share it with anyone for your account’s safety.</p>
            
            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

            <p style="font-size:13px; color:#999; text-align:center;">
              If you did not request this OTP, please ignore this email.<br/>
              Thank you for using <strong>Event Team</strong>.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent!");
  } catch (err) {
    console.error("❌ Error sending OTP email:", err);
  }
};
