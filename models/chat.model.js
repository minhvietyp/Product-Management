const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const chatSchema = new mongoose.Schema({
    // Tuong ung 1 tin nhan

    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String


}, {
    timestamps: true,
    collection: 'chat'
});

const Chat = mongoose.model("Chat", chatSchema, "chat");

module.exports = Chat;
