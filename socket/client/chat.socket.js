const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    _io.once("connection", (socket) => {
        socket.join(roomChatId);

        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            // imageBuffer giờ là ArrayBuffer chuẩn từ client
            if (data.images && data.images.length > 0) {
                for (const imageBuffer of data.images) {
                    const url = await uploadToCloudinary(Buffer.from(imageBuffer));
                    images.push(url);
                }
            }

            const chat = new Chat({
                user_id: userId,
                content: data.content || "",
                images: images,
                room_chat_id: roomChatId,
            });
            await chat.save();

            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content || "",
                images: images,
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type,
            });
        });
    });
};

