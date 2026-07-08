const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const newCart = new Cart();
        await newCart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;

        res.cookies("cartId", newCart.id, {
            httpOnly: true,
            expires: new Date(Date.now() + expiresCookie)
        })
    } else {

    }

    next();
};
