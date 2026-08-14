const User = require('../../models/user.model');

const usersSocket = require("../../socket/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // Socket 
    usersSocket(res);

    // Lấy danh sách người dùng chưa kết bạn
    const userId = res.locals.user.id;

    // lay thong tin nguoi dung da gui yeu cau
    const myUser = await User.findOne({
        _id: userId
    }).select("requestFriends");

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;



    const users = await User.find({
        status: "active",
        deleted: false,
        $and: [
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $ne: userId } }
        ]
    }).select("id fullName email avatar");

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
};



// [GET] /users/request
module.exports.request = async (req, res) => {
    // Socket 
    usersSocket(res);

    // Lấy danh sách người dùng chưa kết bạn
    const userId = res.locals.user.id;

    // lay thong tin nguoi dung da gui yeu cau
    const myUser = await User.findOne({
        _id: userId
    }).select("requestFriends");

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        status: "active",
        deleted: false,
        $and: [
            { _id: { $in: requestFriends } }
        ]
    }).select("id fullName email avatar");

    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users,
    });
};




// [GET] /users/accept
module.exports.accept = async (req, res) => {
    // Socket 
    usersSocket(res);

    // Lấy danh sách người dùng chưa kết bạn
    const userId = res.locals.user.id;

    // lay thong tin nguoi dung da gui yeu cau
    const myUser = await User.findOne({
        _id: userId
    }).select("acceptFriends");

    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        status: "active",
        deleted: false,
        $and: [
            { _id: { $in: acceptFriends } }
        ]
    }).select("id fullName email avatar");

    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời kết bạn",
        users: users,
    });
};


// [GET] /users/friends
module.exports.friends = async (req, res) => {
    // Socket 
    usersSocket(res);

    // Lấy danh sách bạn bè
    const userId = res.locals.user.id;

    // lay thong tin nguoi dung da la ban be
    const myUser = await User.findOne({
        _id: userId
    }).select("friendList");

    const friendList = myUser.friendList;
    const friendUserIds = friendList.map(item => item.user_id);

    const users = await User.find({
        status: "active",
        deleted: false,
        $and: [
            { _id: { $in: friendUserIds } }
        ]
    }).select("id fullName email avatar");

    users.forEach(user => {
        const infoUser = friendList.find(item => item.user_id == user.id);
        user.roomChatId = infoUser.roomChat_id;
    });

    res.render("client/pages/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users,
    });
};