const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    address: String,
    phone: String,
    email: String,
    copyright: String,
    // socialMedia: [
    //     {
    //         name: { type: String, enum: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'] },
    //         url: String
    //     }
    // ]
}, {
    timestamps: true,
    collection: 'setting-general'
});

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "setting-general");

module.exports = SettingGeneral;