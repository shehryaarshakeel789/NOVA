import transporter from "../config/mailer.js";

export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: '"NOVA" <no-reply@nova.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log("Email failed to send:", err.message);
  }
}
