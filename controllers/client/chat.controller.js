const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // Socket IO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      // Xử lý upload mảng buffer ảnh lên Cloudinary
      if (data.images && data.images.length > 0) {
        for (const imageBuffer of data.images) {
          const url = await uploadToCloudinary(imageBuffer);
          images.push(url);
        }
      }

      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: data.content || "",
        images: images,
      });
      await chat.save();

      // Trả data về cho client 
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content || "",
        images: images,
      });
    });

    // Typing Status
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });

  // Lấy data từ database 
  const chats = await Chat.find({
    deleted: false,
  }).sort({ createdAt: "asc" });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
      deleted: false,
    }).select("fullName avatar");

    if (infoUser) {
      chat.infoUser = infoUser;
    }
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};