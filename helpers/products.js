module.exports.priceNewProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(0);
        return item;
    });
    return newProducts;
}

module.exports.priceNewProduct = (product) => {
    const priceNew = (product.price * (1 - product.discountPercentage / 100)).toFixed(0);
    return parseInt(priceNew);
}