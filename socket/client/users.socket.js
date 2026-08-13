const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const User = require("../../models/user.model");

module.exports = (res) => {
    

    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            const myFullName = res.locals.user.fullName;
            const myAvatar = res.locals.user.avatar;

            // Them id cua A vao accept friend cua B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(!existAinB){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            }


            // Them id cua B vao request friend cua A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(!existBinA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                })
            }
            

        });
    });
};
