const Address = require('../models/Address');

exports.getMyAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.createAddress = async (req, res) => {
    try {
        const data = { ...req.body, user: req.user.id };

        // If this is set as default delivery/billing, unset that flag on all others
        if (data.isDefaultDelivery) {
            await Address.updateMany({ user: req.user.id }, { isDefaultDelivery: false });
        }
        if (data.isDefaultBilling) {
            await Address.updateMany({ user: req.user.id }, { isDefaultBilling: false });
        }

        const address = await Address.create(data);
        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
        if (!address) return res.status(404).json({ message: "Address not found" });

        if (req.body.isDefaultDelivery) {
            await Address.updateMany({ user: req.user.id }, { isDefaultDelivery: false });
        }
        if (req.body.isDefaultBilling) {
            await Address.updateMany({ user: req.user.id }, { isDefaultBilling: false });
        }

        Object.assign(address, req.body);
        await address.save();
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!address) return res.status(404).json({ message: "Address not found" });
        res.status(200).json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};