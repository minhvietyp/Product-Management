const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

module.exports.isAccessChat = async (req, res, next) => {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const existUserInRoomChat = await RoomChat.findOne({
        _id: roomChatId,
        deleted: false,
        "users.user_id": userId,
        // users: {
        //     $elemMatch: {
        //         user_id: userId,
        //         deleted: false
        //     }
        // }
    });

    if (existUserInRoomChat) {
        const infoUser = existUserInRoomChat.users.find(item => item.user_id == userId);

        if (infoUser.deleted) {
            return res.redirect('/404');
        }
    } else {
        return res.redirect('/404');
    }

    next();
}


