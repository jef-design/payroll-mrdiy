export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #7936EC;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 150px;
    }
    h2 {
      color: #54301A;
      text-align: center;
    }
    p {
      font-size: 16px;
      color: #333333;
    }
    a.button {
      display: inline-block;
      background-color: #ffc20e;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0;
    }
    .button-wrapper {
      text-align: center;
    }
    .footer {
      font-size: 14px;
      color: #666666;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">
      <img 
        src="https://www.mrdiy.com/public/files/915c22f3aeeb6c91fde7082771b065691019b8fbe8084947fe22ee218031cbe7.png" 
        alt="MrDiy Logo" 
      />
    </div>

    <h2>Welcome to MrDiy!</h2>

    <p>
      Hi, Happy MrDiy! <strong>{{email}}</strong>,<br><br>
      We are delighted that you have signed up and are pleased to have you on board!
      To get started, please verify your email address by clicking the button below:
    </p>

    <div class="button-wrapper">
      <a href="{{link}}" class="button">Verify Account</a>
    </div>

    <div class="footer">
      If clicking the button above does not work, copy and paste this link into your browser:<br>
      <a href="{{link}}">{{link}}</a><br><br>
      This link will expire in 24 hours.<br><br>
      Thank you!
    </div>
  </div>
</body>
</html>
`;
export const LEAVE_REQUEST_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leave Request Approval</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #7936EC;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 150px;
    }
    h2 {
      color: #54301A;
      text-align: center;
    }
    p {
      font-size: 15px;
      color: #333333;
      line-height: 1.6;
    }
    .details {
      background-color: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .details p {
      margin: 6px 0;
      font-size: 14px;
    }
    .details strong {
      color: #54301A;
    }
    a.button {
      display: inline-block;
      background-color: #ffc20e;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0;
    }
    .button-wrapper {
      text-align: center;
    }
    .footer {
      font-size: 13px;
      color: #666666;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">
      <img 
        src="https://www.mrdiy.com/public/files/915c22f3aeeb6c91fde7082771b065691019b8fbe8084947fe22ee218031cbe7.png" 
        alt="MrDiy Logo" 
      />
    </div>

    <h2>Leave Request Pending Approval</h2>

    <p>
      You have received a new leave request from <strong>{{name}}</strong>.
      Please review the details below and take the necessary action.
    </p>

    <div class="details">
    <p><strong>Employee ID:</strong> {{EEID}}</p>
      <p><strong>Employee:</strong> {{name}}</p>
      <p><strong>Leave Type:</strong> {{leaveType}}</p>
      <p><strong>Leave Dates:</strong> {{from}} – {{to}}</p>
      <p><strong>Duration:</strong> {{duration}} day(s)</p>
      <p><strong>Reason:</strong> {{reason}}</p>
    </div>

    <div class="button-wrapper">
      <a href="{{approvalLink}}" class="button">Review Leave Request</a>
    </div>

    <div class="footer">

      © ${new Date().getFullYear()} MR DIY Employee Portal
    </div>
  </div>
</body>
</html>
`;
