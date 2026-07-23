const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model'); 

const productHelper = require('../../helpers/products');


// GET /cart
module.exports.index = async (req, res) => {

    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId  = item.product_id;

            const productInfo = await Product.findOne({ _id: productId}).select("title thumbnail price discountPercentage slug");

            productInfo.priceNew = productHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.priceNew;

            
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    



    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

// POST /cart/add/:productId

module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });


    const existProductInCart = cart.products.find(
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

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: { product_id: productId }
        }
    });

    req.flash('success', 'Xóa thành công');

    res.redirect('back');
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
    }, {
        $set: {
            'products.$.quantity': quantity
        }
    });

    req.flash('success', 'Cập nhật thành công');

    res.redirect('back');
}
