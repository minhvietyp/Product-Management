const Chat = require("../models/chat.model");
const User = require("../models/user.model");

module.exports = (io) => {
    io.on("connection", (socket) => {

        // CLIENT SEND MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const { content, userId, fullName } = data;

            // Save to database
            const chat = new Chat({
                content: content,
                user_id: userId,
            });
            await chat.save();

            // Return to all clients
            io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        // CLIENT SEND TYPING
        socket.on("CLIENT_SEND_TYPING", (data) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", data);
        });

    });
};
