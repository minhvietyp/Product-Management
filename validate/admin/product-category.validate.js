module.exports.createPost = async (req, res, next) => {
     if(!req.body.title) {
        req.flash("error", "Vui long nhap thong tin san pham");
        res.redirect("back");
        return;
    }

    next();
}
    