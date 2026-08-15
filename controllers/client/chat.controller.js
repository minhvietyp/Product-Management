const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

const chatSocket = require("../../socket/client/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  const roomChatId = req.params.roomChatId;

  // Socket IO
  chatSocket( req, res);


  // Lấy data từ database 
  const chats = await Chat.find({
    room_chat_id: roomChatId,
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