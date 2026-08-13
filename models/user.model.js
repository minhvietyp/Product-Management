const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    avatar: String,
    status: {
        type: String,
        default: "active",
    },
    position: Number,
    tokenUser: {
        type: String,
        default: () => generateHelper.generateRandomString(32)
    },
    phone: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String,
    // Những id đã gửi lời mời kết bạn 
    acceptFriends: Array,
    // Những id đã nhận lời mời kết bạn 
    requestFriends: Array,
    // Danh sách bạn bè
    friendList: [
        {
            user_id: String,
            status: String,
            room_chat_id: String
        }
    ]
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
