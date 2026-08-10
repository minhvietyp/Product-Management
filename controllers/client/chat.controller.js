const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // Socket IO
  // Dung once vi khi dung on moi lan load lai trang se tao them 1 ket noi
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (content) => {
      // Luu vao database
      const chat = new Chat({
        content: content,
        user_id: userId,
      });
      await chat.save();

      // Tra data ve cho client 
      _io.emit('SERVER_RETURN_MESSAGE', {
        userId: userId,
        fullName: fullName,
        content: content
      });
    });
  });


  // Typing
  _io.on("connection", (socket) => {
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      });
      
    })
  })

  // Lay data tu database 
  const chats = await Chat.find({
    deleted: false
  }).sort({ createdAt: "asc" });

  // Hien thi tin nhan
  // const chatList = chats.map((chat) => {
  //   return {
  //     user_id: chat.user_id,
  //     content: chat.content,
  //     created_at: chat.created_at,
  //   };
  // });

  for(const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
      deleted: false
    }).select("fullName avatar");

    if(infoUser) {
      chat.infoUser = infoUser;
    }
  }


  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
};