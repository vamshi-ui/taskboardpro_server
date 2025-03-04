export const verifyEmailBody = (verificationLink: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - TaskBoard Pro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fffaf0;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .header {
            text-align: center;
            color: #b5651d;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            margin-top: 20px;
            color: #333;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #fff;
            background-color: #ff8c00;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">TaskBoard Pro</div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Welcome to TaskBoard Pro! To get started, please verify your email address by clicking the button below:</p>
    <p>Note: The verification link will expire in 24 hours.</p>
            <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email</a>
            </p>
    <p>If you didn’t sign up for an account, feel free to ignore this email — no action is required.</p>
        </div>
        <div class="footer">
            &copy; 2025 TaskBoard Pro. All rights reserved.
        </div>
    </div>
</body>
</html>`;
};
