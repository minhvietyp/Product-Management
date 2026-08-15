const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (res) => {

    _io.on("connection", (socket) => {
        // Chuc nang them ban
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // id cua A

            // Them id cua A vao accept friend cua B
            const existAinB = await User.findOne({
                _id: userId, // id cua b
                acceptFriends: myUserId
            });

            if (!existAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                });
            }

            // Them id cua B vao request friend cua A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                });
            }

            // Lấy ra độ dài acceptFriend cua B va tra ve cho B
            const infoUserB = await User.findOne({
                _id: userId,
            }).select("acceptFriends");

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userId: userId, // id cua B
                lengthAcceptFriends: lengthAcceptFriends
            });
        });

        // Chuc nang huy loi moi ket ban 
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // id cua A

            // Xoa id cua A khoi accept friend cua B
            const existAinB = await User.findOne({
                _id: userId, // id cua B
                acceptFriends: myUserId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                });
            }

            // Xoa id cua B khoi request friend cua A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                });
            }


            // Lấy ra độ dài acceptFriend cua B va tra ve cho B
            const infoUserB = await User.findOne({
                _id: userId,
            }).select("acceptFriends");

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userId: userId, // id cua B
                lengthAcceptFriends: lengthAcceptFriends
            });

            //


            // Lay info cua A va tra ve cho B
            const infoUserA = await User.findOne({
                _id: myUserId,
            }).select("id fullName email avatar");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_USER", {
                userId: userId, // id cua B
                infoUserA: infoUserA
            });

            // Lay ra id cua A va tra ve cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId, // id cua B
                userIdA: myUserId // id cua A
            });


        });


        // Chuc nang tu choi loi moi ket ban 
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Xoa id cua A khoi accept friend cua B
            const existAinB = await User.findOne({
                _id: myUserId, // id cua B
                acceptFriends: userId
            });

            if (existAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                });
            }

            // Xoa id cua B khoi request friend cua A
            const existBinA = await User.findOne({
                _id: userId, // id cua A
                requestFriends: myUserId
            });

            if (existBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                });
            }
        });






        // Chuc nang chap nhan ket ban
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Check exit
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            let roomChat;


            // Tao phong chat chung khi ket ban 
            if (existAinB && existBinA) {
                const dataRoom = {
                    title: "Phong chat chung",
                    avatar: "",
                    type: "friend", // friend, group
                    // status: "active", // lock
                    // theme_id: String, // theme of chat
                    users: [
                        {
                            user_id: userId,
                            // user_name: myUserName,
                            // user_avatar: myUserAvatar,
                            // user_status_online: "online",
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            // user_name: userName,
                            // user_avatar: userAvatar,
                            // user_status_online: "online",
                            role: "superAdmin"
                        }
                    ],

                }

                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }


            // Xoa id cua B khoi acceptFriends cua A va Them B vao friendList cua A


            if (existAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            roomChat_id: roomChat.id
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                });
            }

            // Xoa id cua A khoi requestFriends cua B va Them A vao friendList cua B


            if (existBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            roomChat_id: roomChat.id
                        }
                    },
                    $pull: {
                        requestFriends: myUserId
                    }
                });
            }
        });
    });
};