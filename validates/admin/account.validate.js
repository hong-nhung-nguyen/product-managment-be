module.exports.createPost = (redirectPath) => {
    return (req, res, next) => {
        if (!req.body.fullName) {
            req.flash("error", "Vui lòng nhập họ tên");

            const path = typeof redirectPath === "function"
                ? redirectPath(req)
                : redirectPath
            
            res.redirect(path);
            return;
        };

        if (!req.body.email) {
            req.flash("error", "Vui lòng nhập email");

            const path = typeof redirectPath === "function"
                ? redirectPath(req)
                : redirectPath
    
            res.redirect(path);
            return;
        };

        if (!req.body.password) {
            req.flash("error", "Vui lòng nhập mật khẩu");

            const path = typeof redirectPath === "function"
                ? redirectPath(req)
                : redirectPath
            
            res.redirect(path);
            return;
        };

        if (!req.body.role_id) {
            req.flash("error", "Vui lòng chọn nhóm quyền");

            const path = typeof redirectPath === "function"
                ? redirectPath(req)
                : redirectPath

            res.redirect(path);
            return;
        }

        next();
    }
}