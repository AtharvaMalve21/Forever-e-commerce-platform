const passwordResetEmailTemplate = (name, email, otp) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hello, ${name}</h2>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset the password for your account associated with this email: <strong>${email}</strong>.
        </p>
        <p style="font-size: 16px; color: #555;">
          Please use the following OTP (One-Time Password) to reset your password:
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #999;">
          This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support.
        </p>
        <p style="font-size: 16px; color: #555;">
          Regards,<br />
          <strong>The Green-Cart Team</strong>
        </p>
      </div>
    `;
};

module.exports = passwordResetEmailTemplate;
