const transporter = require("../utils/nodemailerConfig");

exports.sendConfirmationEmail = async (to, tranId, name) => {
  try {
    await transporter.sendMail({
      from: `"Event Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Payment Confirmation - Event Registration",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>✅ Payment Successful!</h2>
          <p>Dear ${name}</p>
          <p>Your payment for the event has been confirmed.</p>
          <p><strong>Transaction ID:</strong> ${tranId}</p>
          <p>Thank you for registering with us. See you at the event!</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>Event Team</strong></p>
        </div>
      `,
    });

    console.log("✅ Confirmation email sent!");
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
