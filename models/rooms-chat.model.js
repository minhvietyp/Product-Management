const mongoose = require("mongoose");

const RoomsChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    type: String, // friend, group
    status: String, // lock
    // theme_id: String, // theme of chat
    users: [
        {
            user_id: String,
            user_name: String,
            user_avatar: String,
            user_status_online: String,
            role: String 
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: String,
    deletedBy: String,
    content: String,
    createdBy: String,
    createdAt: String,

}, {
    timestamps: true,
    collection: 'rooms-chat'
});

const RoomChat = mongoose.model("RoomChat", RoomsChatSchema, "rooms-chat");

module.exports = RoomChat;