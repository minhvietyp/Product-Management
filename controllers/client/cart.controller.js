const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');


// GET /cart
module.exports.index = async (req, res) => {
    res.send("Trang giỏ hàng");
}

// POST /cart/add/:productId

module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = Cart.findOne({ _id: cartId });


    const existProductInCart = cart.product.find(
        item => item.product_id == productId
    );

    if (existProductInCart) {
        const quantityNew = parseInt(existProductInCart.quantity) + quantity;
        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            'products.$.quantity': quantityNew
        });
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };


        await Cart.updateOne({
            _id: cartId
        }, {
            $push: {
                products: objectCart
            }
        });
    }




    req.flash('success', 'thêm thành công');


    res.redirect("back");
}