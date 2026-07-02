const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String
}, {
    timestamps: true,
    collection: 'roles'
});

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;