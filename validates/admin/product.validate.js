module.exports.createPost = (req, res, next) => {
    if(!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("/admin/products/create");
        return;
    }

    next();

    // không return gì cả thì web sẽ quay liên tục
    // next() đẩy dòng hoạt động tới hoạt động tiếp theo
}