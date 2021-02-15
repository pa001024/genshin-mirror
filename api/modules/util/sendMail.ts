import nodemailer from "nodemailer";

export async function sendMail(email: string, url: string) {
  // const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: +process.env.SMTP_PORT! || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"Paimon Bot" <noreply@genshin.im>', // sender address
    to: email, // list of receivers
    subject: "Verfiy your email address", // Subject line
    text: "Hello", // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
