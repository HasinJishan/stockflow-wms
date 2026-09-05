const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS instead of SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4
});

    const mailOptions = {
        from: `"StockFlow WMS" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ SUCCESS: Email sent to:", options.email);
    } catch (error) {
        console.error("❌ NODEMAILER ERROR:", error.message);
        throw error; 
    }
};

module.exports = sendEmail;