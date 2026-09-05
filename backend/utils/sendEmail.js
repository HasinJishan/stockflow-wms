const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        },
        family: 4 // Force IPv4 - fixes Render's ENETUNREACH error over IPv6
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