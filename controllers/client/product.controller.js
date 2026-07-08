const Product = require("../../models/product.model");
const helperProducts = require("../../helpers/products");
const ProductCategory = require("../../models/product-category.model");
const helperProductsCategory = require("../../helpers/products-category");


// [GET] /products

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
        .sort({ position: "desc" });

    const newProducts = helperProducts.priceNewProducts(products);


    res.render("client/pages/products/index", {
        pageTitle: "Danh sách Sản phẩm",
        products: newProducts
    });
}

// Detail [GET] /products/:slug

module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugProduct;
        const product = await Product.findOne({
            slug: slug,
            status: "active",
            deleted: false
        });

        if (!product) {
            return res.redirect("/products");
        }

        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            product.categoryDetail = category;
        }

        helperProducts.priceNewProduct(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })


    } catch (error) {
        res.redirect("/products");

    }

}

// GET /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const slug = req.params.slugCategory;

        const category = await ProductCategory.findOne({
            slug: slug,
            status: "active",
            deleted: false
        });

        const getSubCategory = async (parentId) => {
            const subs = await ProductCategory.find({
                parent_id: parentId,
                status: "active",
                deleted: false,
            });

            let allSub = [...subs];

            for (const sub of subs) {
                const childs = await getSubCategory(sub.id);
                allSub = allSub.concat(childs);
            }

            return allSub;
        };

        const listSubCategory = await helperProductsCategory.getSubCategory(category.id);

        const listCategoryIds = [category.id, ...listSubCategory.map(item => item.id)];

        const product = await Product.find({
            product_category_id: {
                $in: listCategoryIds
            },
            status: "active",
            deleted: false
        }).sort({ position: "desc" });

        const newProducts = helperProducts.priceNewProducts(product);



        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts
        })


    } catch (error) {
        res.redirect("/products");

    }

}
