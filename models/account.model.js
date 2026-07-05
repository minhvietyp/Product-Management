const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role_id: String,
    avatar: String,
    status: String,
    position: Number,
    token: {
        type: String,
        default: () => generateHelper.generateRandomString(32)
    },
    phone: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String
}, {
    timestamps: true,
    collection: 'accounts'
});

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
