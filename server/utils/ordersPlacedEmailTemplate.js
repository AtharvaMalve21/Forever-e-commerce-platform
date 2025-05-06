const ordersPlacedEmailTemplate = (
  name,
  orderId,
  shippingAddress,
  totalPrice
) => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h2 {
              text-align: center;
              color: #2c3e50;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin: 10px 0;
            }
            .order-details {
              background-color: #ecf0f1;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
              box-sizing: border-box;
            }
            .order-details h4 {
              margin: 0;
              color: #2980b9;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              text-align: center;
              color: #7f8c8d;
            }
            .highlight {
              font-weight: bold;
              color: #e74c3c;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Order Confirmation</h2>
            <p>Dear ${name},</p>
            <p>Thank you for your order! We're happy to let you know that your order has been successfully placed.</p>
            <div class="order-details">
              <h4>Order Details</h4>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
              <p><strong>Total Price:</strong> <span class="highlight">$${totalPrice}</span></p>
            </div>
            <p>If you have any questions or concerns, feel free to contact our support team.</p>
            <p>We appreciate your business and look forward to serving you again!</p>
            <div class="footer">
              <p>Best regards,</p>
              <p>Your Company Name</p>
              <p><a href="mailto:support@yourcompany.com">support@yourcompany.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = ordersPlacedEmailTemplate;
