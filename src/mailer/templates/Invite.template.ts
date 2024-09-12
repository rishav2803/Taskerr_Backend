export default function getInviteTemplate(acceptLink: string, rejectLink: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invite to Taskerr</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .header h1 {
              font-size: 24px;
              margin: 0;
          }
          .content {
              margin-bottom: 20px;
          }
          .btn {
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
              text-decoration: none;
              color: #fff;
              background-color: #007bff;
              padding: 10px 20px;
              border-radius: 5px;
              margin: 5px;
          }
          .btn.reject {
              background-color: #dc3545;
          }
          .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>You're Invited!</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>You've been invited to join a project on Taskerr. To view the details and participate, please click the button below to accept the invite.</p>
          </div>
          <div class="buttons" style="text-align: center;">
              <a href="${acceptLink}" class="btn">Accept Invite</a>
              <a href="${rejectLink}" class="btn reject">Reject Invite</a>
          </div>
          <div class="footer">
              <p>If you have any questions, please contact us at support@taskerr.com.</p>
          </div>
      </div>
  </body>
  </html>

  `;
}


