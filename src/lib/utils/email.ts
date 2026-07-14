import { Resend } from 'resend';

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'DUET Robotics Club <noreply@drc.duet.ac.bd>';

// ─── Email Templates ──────────────────────────────────────────

function paymentVerifiedTemplate(data: {
  name: string;
  transactionId: string;
  amount: number;
  method: string;
  membershipId?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:12px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
                DUET Robotics Club
              </h1>
              <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">Dhaka University of Engineering & Technology</p>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="padding:30px 40px 0;text-align:center;">
              <div style="display:inline-block;background-color:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:50px;padding:8px 20px;">
                <span style="color:#22c55e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                  &#10003; Payment Verified
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:25px 40px;">
              <h2 style="margin:0 0 15px;color:#ffffff;font-size:20px;">
                Hello ${data.name},
              </h2>
              <p style="margin:0 0 20px;color:#9ca3af;font-size:14px;line-height:1.7;">
                Your payment has been <strong style="color:#22c55e;">successfully verified</strong>.
                Welcome to DUET Robotics Club!
              </p>

              <!-- Payment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Payment Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Transaction ID</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">${data.transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Amount Paid</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">&#2547;${data.amount} BDT</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Payment Method</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">${data.method}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Membership Confirmation -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1));border:1px solid rgba(59,130,246,0.2);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;color:#60a5fa;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">&#127942; Membership Confirmed</p>
                    <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">
                      You are now an <strong style="color:#ffffff;">active member</strong> of DUET Robotics Club.
                    </p>
                    ${data.membershipId ? `<p style="margin:12px 0 0;color:#9ca3af;font-size:13px;">Membership ID: <strong style="color:#ffffff;">${data.membershipId}</strong></p>` : ''}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 5px;color:#9ca3af;font-size:14px;line-height:1.7;">
                If you have any questions, feel free to reach out to us.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 30px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;color:#4b5563;font-size:12px;text-align:center;line-height:1.6;">
                DUET Robotics Club &bull; Dhaka University of Engineering & Technology, Gazipur<br>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function paymentRejectedTemplate(data: {
  name: string;
  transactionId: string;
  amount: number;
  method: string;
  reason: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:12px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
                DUET Robotics Club
              </h1>
              <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">Daffodil International University</p>
            </td>
          </tr>

          <!-- Rejected Badge -->
          <tr>
            <td style="padding:30px 40px 0;text-align:center;">
              <div style="display:inline-block;background-color:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:50px;padding:8px 20px;">
                <span style="color:#ef4444;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                  &#10007; Payment Rejected
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:25px 40px;">
              <h2 style="margin:0 0 15px;color:#ffffff;font-size:20px;">
                Hello ${data.name},
              </h2>
              <p style="margin:0 0 20px;color:#9ca3af;font-size:14px;line-height:1.7;">
                We regret to inform you that your payment could not be verified.
                Please review the details below.
              </p>

              <!-- Payment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px;color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Payment Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Transaction ID</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">${data.transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Amount</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">&#2547;${data.amount} BDT</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#9ca3af;font-size:13px;">Payment Method</td>
                        <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">${data.method}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Rejection Reason -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;color:#f87171;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Reason for Rejection</p>
                    <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">${data.reason}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 5px;color:#9ca3af;font-size:14px;line-height:1.7;">
                Please make the correct payment and submit again. If you believe this is an error, contact us.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 30px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;color:#4b5563;font-size:12px;text-align:center;line-height:1.6;">
                DUET Robotics Club &bull; Daffodil International University<br>
                This email was sent to ${data.name}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send Functions ───────────────────────────────────────────

export async function sendPaymentVerifiedEmail(data: {
  to: string;
  name: string;
  transactionId: string;
  amount: number;
  method: string;
  membershipId?: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: 'Payment Verified — Welcome to DUET Robotics Club!',
      html: paymentVerifiedTemplate(data),
    });
    console.log(`[Resend] Verification email sent to ${data.to}`);
  } catch (error) {
    console.error('[Resend] Failed to send verification email:', error);
  }
}

export async function sendPaymentRejectedEmail(data: {
  to: string;
  name: string;
  transactionId: string;
  amount: number;
  method: string;
  reason: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: 'Payment Rejected — DUET Robotics Club',
      html: paymentRejectedTemplate(data),
    });
    console.log(`[Resend] Rejection email sent to ${data.to}`);
  } catch (error) {
    console.error('[Resend] Failed to send rejection email:', error);
  }
}
