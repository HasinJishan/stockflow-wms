const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'StockFlow WMS <onboarding@resend.dev>', // default test sender, works immediately
            to: options.email,
            subject: options.subject,
            html: options.message,
        });

        if (error) {
            console.error("❌ RESEND ERROR:", error);
            throw new Error(error.message || "Email could not be sent");
        }

        console.log("✅ SUCCESS: Email sent to:", options.email);
        return data;
    } catch (error) {
        console.error("❌ RESEND ERROR:", error.message);
        throw error;
    }
};

module.exports = sendEmail;