const systemConfig = require('./../../config/system');
const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
const productCategoryRoute = require('./product-catagory.route');
const roleRoute = require('./role.route');
const accountRoute = require('./account.route');
const authRoute = require('./auth.route');
const middlewareAuth = require('./../../middlewares/admin/auth.middleware')
const myAccountRoute = require('./my-account.route');


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + "/dashboard",
        middlewareAuth.requireAuth,
        dashboardRoute
    );
    app.use(
        PATH_ADMIN + "/products",
        middlewareAuth.requireAuth,
        productRoute
    );
    app.use(
        PATH_ADMIN + "/product-category",
        middlewareAuth.requireAuth,
        productCategoryRoute
    );
    app.use(
        PATH_ADMIN + "/roles",
        middlewareAuth.requireAuth,
        roleRoute
    );
    app.use(
        PATH_ADMIN + "/accounts",
        middlewareAuth.requireAuth,
        accountRoute
    );
    app.use(PATH_ADMIN + "/auth", authRoute);
    app.use(
        PATH_ADMIN + "/my-account",
        middlewareAuth.requireAuth,
        myAccountRoute
    );
}