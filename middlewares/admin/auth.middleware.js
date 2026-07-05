// const { application } = require('express');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const Role = require('../../models/role.model');
const mongoose = require('mongoose');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne({ token: req.cookies.token }).select("-password");
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        } else {
            if (user.role_id) {
                const roleIdStr = user.role_id.toString().trim();
                if (roleIdStr.length === 24) {
                    // Bypass Mongoose schema casting by using .collection.findOne 
                    // This allows finding the _id whether it's stored as an ObjectId or a raw String in the DB
                    const role = await Role.collection.findOne({
                        _id: { $in: [roleIdStr, new mongoose.Types.ObjectId(roleIdStr)] },
                        deleted: false
                    });
                    res.locals.role = role || { permissions: [] };
                } else {
                    // role_id is not 24 characters (e.g. it's stored as plain text like "Nhân viên")
                    const role = await Role.collection.findOne({
                        title: roleIdStr,
                        deleted: false
                    });
                    res.locals.role = role || { permissions: [] };
                }
            } else {
                res.locals.role = { permissions: [] };
            }
            res.locals.user = user;
            next();
        }
    }

}