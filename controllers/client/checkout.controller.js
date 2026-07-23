const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model'); 

const productHelper = require('../../helpers/products');


// GET /checkout
module.exports.index = async (req, res) => {

    

    



    res.render("client/pages/checkout/index", {
        pageTitle: "Thanh toán",
    })
}

