const CompanySettings = require('../models/CompanySettings');

// GET company settings (creates default doc if none exists yet)
exports.getCompanySettings = async (req, res) => {
    try {
        let settings = await CompanySettings.findOne();
        if (!settings) {
            settings = await CompanySettings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE company settings (admin only)
exports.updateCompanySettings = async (req, res) => {
    try {
        const { name, email, timezone, currency } = req.body;
        let settings = await CompanySettings.findOne();
        if (!settings) {
            settings = await CompanySettings.create({});
        }
        if (name !== undefined) settings.name = name;
        if (email !== undefined) settings.email = email;
        if (timezone !== undefined) settings.timezone = timezone;
        if (currency !== undefined) settings.currency = currency;
        await settings.save();
        res.status(200).json({ message: "Company settings updated", settings });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};