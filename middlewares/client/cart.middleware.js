const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const newCart = new Cart();
        await newCart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;

        res.cookie("cartId", newCart.id, {
            httpOnly: true,
            expires: new Date(Date.now() + expiresCookie)
        });
    } else {
        const cart = await Cart.findOne({ _id: req.cookies.cartId })

        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)
        cart.totalQuantity = totalQuantity;

        res.locals.miniCart = cart
    }

    next();
};
